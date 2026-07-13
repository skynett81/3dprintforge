// native-slice-and-send.test.js — Integration test for the web slicer's
// own engine path: POST an STL, slice with the pure-JS native slicer, and
// "upload" it to a mock printer. No external slicer binary involved.

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import http from 'node:http';
import { setupTestDb } from '../test-helper.js';
import { handleApiRequest, setPrinterManager } from '../../server/api-routes.js';
import { box } from '../../server/mesh-primitives.js';
import { meshToStlBuffer } from '../../server/format-converter.js';

// Build a binary STL for a 20mm cube to POST as the model.
function cubeStl() {
  return Buffer.from(meshToStlBuffer(box(20, 20, 10)));
}

function post(port, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ port, path, method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': body.length, ...headers } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf-8') }));
    });
    req.on('error', reject);
    req.end(body);
  });
}

describe('POST /api/slicer/native/slice-and-send', () => {
  let server, port, uploaded;

  before(async () => {
    setupTestDb();
    uploaded = [];
    // Mock printer manager with an upload-capable client.
    setPrinterManager({
      printers: new Map([['mock-1', {
        config: { model: 'Generic', type: 'moonraker' },
        client: {
          uploadFile: async (name, buf) => { uploaded.push({ name, size: buf.length, print: false }); return { ok: true, name }; },
          uploadAndPrint: async (name, buf) => { uploaded.push({ name, size: buf.length, print: true }); return { ok: true, name, started: true }; },
        },
      }]]),
    });
    server = createServer((req, res) => handleApiRequest(req, res));
    await new Promise((r) => server.listen(0, r));
    port = server.address().port;
  });

  after(() => { server?.close(); setPrinterManager(null); });

  it('slices an STL natively and uploads G-code to the printer', async () => {
    const stl = cubeStl();
    const res = await post(port, '/api/slicer/native/slice-and-send?printerId=mock-1&filename=cube.stl&settings=' +
      encodeURIComponent(JSON.stringify({ layer_height: 0.2, wall_loops: 3, infill_density: 15, infill_pattern: 'grid' })), stl);
    assert.equal(res.status, 201, res.body);
    const data = JSON.parse(res.body);
    assert.equal(data.ok, true);
    assert.equal(data.slicer, 'native');
    assert.match(data.gcodeFilename, /cube\.gcode$/);
    assert.ok(data.sizeBytes > 1000, 'produced substantial gcode');
    assert.ok(data.layers >= 40, `~50 layers expected, got ${data.layers}`);
    assert.equal(data.printing, false);
    assert.equal(uploaded.length, 1);
    assert.equal(uploaded[0].print, false);
  });

  it('starts the print when print=1', async () => {
    uploaded.length = 0;
    const res = await post(port, '/api/slicer/native/slice-and-send?printerId=mock-1&filename=cube.stl&print=1', cubeStl());
    assert.equal(res.status, 201, res.body);
    const data = JSON.parse(res.body);
    assert.equal(data.printing, true);
    assert.equal(uploaded[0].print, true);
  });

  it('404s for an unknown printer', async () => {
    const res = await post(port, '/api/slicer/native/slice-and-send?printerId=nope&filename=cube.stl', cubeStl());
    assert.equal(res.status, 404);
  });
});
