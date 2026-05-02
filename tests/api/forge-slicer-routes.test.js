// forge-slicer-routes.test.js — verifies the /api/slicer/forge/* HTTP
// proxy endpoints relay data correctly between the browser and the
// fork's service. Spins up two HTTP servers: a fake fork on a random
// port, and a tiny adapter that runs the api-routes.js handlers
// against in-process state.

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { configure as configureForge, stopBackgroundProbe } from '../../server/forge-slicer-client.js';

let forkServer;
let forkPort;
let receivedSlice = null;
let receivedSliceAndSend = null;

before(async () => {
  forkServer = createServer((req, res) => {
    if (req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, service: 'forge-slicer', version: 't' }));
    }
    if (req.url === '/api/slice' && req.method === 'POST') {
      const chunks = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => {
        receivedSlice = { ct: req.headers['content-type'], len: Buffer.concat(chunks).length };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true, job_id: 'job-test',
          gcode_path: '/tmp/test.gcode', gcode_size: 256,
          estimated_time_s: 1800, filament_used_g: [25, 0, 0, 0],
        }));
      });
      return;
    }
    if (req.url === '/api/jobs/job-test/gcode' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      return res.end(Buffer.from(';TEST GCODE\nG28\nG1 X0 Y0\n'));
    }
    if (req.url === '/api/jobs' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ jobs: [] }));
    }
    res.writeHead(404); res.end();
  });
  await new Promise(r => forkServer.listen(0, '127.0.0.1', r));
  forkPort = forkServer.address().port;
  configureForge({ url: `http://127.0.0.1:${forkPort}`, enabled: true });
});

after(() => {
  stopBackgroundProbe();
  return new Promise(r => forkServer.close(r));
});

describe('forge-slicer client integration', () => {
  it('slice() forwards multipart and returns parsed JSON', async () => {
    const { slice } = await import('../../server/forge-slicer-client.js');
    receivedSlice = null;
    const result = await slice({
      modelBuffer: Buffer.from('solid test\nendsolid\n'),
      printerId: 'p1', filamentIds: ['pla'], processId: 'normal',
    });
    assert.equal(result.ok, true);
    assert.equal(result.job_id, 'job-test');
    assert.match(receivedSlice.ct, /^multipart\/form-data/);
    assert.ok(receivedSlice.len > 50);
  });

  it('fetchGcode() pulls the gcode bytes through', async () => {
    const { fetchGcode } = await import('../../server/forge-slicer-client.js');
    const buf = await fetchGcode('job-test');
    assert.ok(Buffer.isBuffer(buf));
    assert.match(buf.toString('utf8'), /^;TEST GCODE/);
  });

  it('listJobs() returns the queue snapshot', async () => {
    const { listJobs } = await import('../../server/forge-slicer-client.js');
    const data = await listJobs();
    assert.ok(Array.isArray(data.jobs));
  });

  it('probe is cached so repeated calls do not hammer /api/health', async () => {
    const { probe, lastProbe } = await import('../../server/forge-slicer-client.js');
    await probe({ force: true });
    const at1 = lastProbe().at;
    await probe();
    await probe();
    assert.equal(lastProbe().at, at1);
  });
});
