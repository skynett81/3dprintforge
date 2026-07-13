// native-slice-multi.test.js — multi-material slice-and-send endpoint.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import http from 'node:http';
import { setupTestDb } from '../test-helper.js';
import { handleApiRequest, setPrinterManager } from '../../server/api-routes.js';
import { box } from '../../server/mesh-primitives.js';
import { meshToStlBuffer } from '../../server/format-converter.js';

function shiftX(mesh, dx) { return { positions: mesh.positions.map((v, i) => (i % 3 === 0 ? v + dx : v)), indices: mesh.indices }; }
function b64(mesh) { return Buffer.from(meshToStlBuffer(mesh)).toString('base64'); }

function postJson(port, path, obj) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify(obj));
    const req = http.request({ port, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': body.length } }, (res) => {
      const cs = []; res.on('data', (c) => cs.push(c)); res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(cs).toString('utf-8') }));
    });
    req.on('error', reject); req.end(body);
  });
}

describe('POST /api/slicer/native/slice-multi-and-send', () => {
  let server, port, uploaded;
  before(async () => {
    setupTestDb(); uploaded = [];
    setPrinterManager({ printers: new Map([['mock-1', { config: { model: 'Generic', type: 'moonraker' }, client: { uploadFile: async (n, b) => { uploaded.push({ n, size: b.length }); return { ok: true }; } } }]]) });
    server = createServer((req, res) => handleApiRequest(req, res));
    await new Promise((r) => server.listen(0, r)); port = server.address().port;
  });
  after(() => { server?.close(); setPrinterManager(null); });

  it('slices two colours with tool changes + flush-into-infill and uploads', async () => {
    const parts = [
      { extruder: 1, stl: b64(box(15, 15, 6)) },
      { extruder: 2, stl: b64(shiftX(box(15, 15, 6), 25)) },
    ];
    const res = await postJson(port, '/api/slicer/native/slice-multi-and-send', { printerId: 'mock-1', filename: 'dual.3mf', print: false, settings: { flush_into_infill: true, flush_volume: 80 }, parts });
    assert.equal(res.status, 201, res.body);
    const data = JSON.parse(res.body);
    assert.equal(data.ok, true);
    assert.equal(data.slicer, 'native-multi');
    assert.equal(data.materials, 2);
    assert.ok(data.sizeBytes > 1000);
    assert.equal(uploaded.length, 1);
  });
});
