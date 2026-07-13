// native-slice-objects.test.js — per-object-settings slice-and-send endpoint.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import http from 'node:http';
import { setupTestDb } from '../test-helper.js';
import { handleApiRequest, setPrinterManager } from '../../server/api-routes.js';
import { box } from '../../server/mesh-primitives.js';
import { meshToStlBuffer } from '../../server/format-converter.js';

const shiftX = (m, dx) => ({ positions: m.positions.map((v, i) => (i % 3 === 0 ? v + dx : v)), indices: m.indices });
const b64 = (m) => Buffer.from(meshToStlBuffer(m)).toString('base64');

function postJson(port, path, obj) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify(obj));
    const req = http.request({ port, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': body.length } }, (res) => {
      const cs = []; res.on('data', (c) => cs.push(c)); res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(cs).toString('utf-8') }));
    });
    req.on('error', reject); req.end(body);
  });
}

describe('POST /api/slicer/native/slice-objects-and-send', () => {
  let server, port, uploaded;
  before(async () => {
    setupTestDb(); uploaded = [];
    setPrinterManager({ printers: new Map([['mock-1', { config: { model: 'Generic', type: 'moonraker' }, client: { uploadFile: async (n, b) => { uploaded.push({ n, size: b.length }); return { ok: true }; } } }]]) });
    server = createServer((req, res) => handleApiRequest(req, res));
    await new Promise((r) => server.listen(0, r)); port = server.address().port;
  });
  after(() => { server?.close(); setPrinterManager(null); });

  it('slices two objects with different settings and uploads', async () => {
    const objects = [
      { stl: b64(box(15, 15, 8)), settings: { infill_density: 15, wall_loops: 2 } },
      { stl: b64(shiftX(box(15, 15, 8), 25)), settings: { infill_density: 60, wall_loops: 5 } },
    ];
    const res = await postJson(port, '/api/slicer/native/slice-objects-and-send', { printerId: 'mock-1', filename: 'plate.3mf', print: false, settings: { layer_height: 0.2 }, objects });
    assert.equal(res.status, 201, res.body);
    const data = JSON.parse(res.body);
    assert.equal(data.ok, true);
    assert.equal(data.slicer, 'native-objects');
    assert.equal(data.objects, 2);
    assert.ok(data.sizeBytes > 1000);
    assert.equal(uploaded.length, 1);
  });
});
