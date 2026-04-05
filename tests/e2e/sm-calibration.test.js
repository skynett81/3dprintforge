// E2E test: Snapmaker calibration + print config API

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.TEST_URL || 'https://localhost:3443';
const PRINTER_ID = process.env.TEST_PRINTER || 'snapmaker-u1';

async function serverAvailable() {
  try { await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(3000) }); return true; } catch { return false; }
}

describe('SM Calibration + Config E2E', () => {

  before(async () => {
    if (!await serverAvailable()) { console.log('Skipping — server not running'); process.exit(0); }
  });

  it('GET /snapmaker/print-config returns config toggles', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/print-config`, { signal: AbortSignal.timeout(5000) });
    assert.equal(res.status, 200);
    const data = await res.json();
    // Should have boolean toggle fields
    const hasToggles = 'autoBedLeveling' in data || 'flowCalibrate' in data || 'timelapse' in data;
    assert.ok(hasToggles, 'should have config toggle fields');
  });

  it('PUT /snapmaker/print-config validates input', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/print-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invalidKey: true }),
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes('No valid config'));
  });

  it('PUT /snapmaker/print-config accepts valid toggles', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/print-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoBedLeveling: true }),
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.deepEqual(data.updated, { autoBedLeveling: true });
  });

  it('GET /snapmaker/calibration returns cal state + history', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/calibration`, { signal: AbortSignal.timeout(5000) });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok('flow_cal' in data, 'should have flow_cal');
    assert.ok('history' in data, 'should have history');
    assert.ok(Array.isArray(data.history), 'history should be array');
  });

  it('GET /snapmaker/profiles returns machine + filaments', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/profiles`, { signal: AbortSignal.timeout(5000) });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.machine, 'should have machine');
    assert.equal(data.machine.name, 'Snapmaker U1');
    assert.ok(Array.isArray(data.filaments), 'should have filaments array');
    assert.ok(data.filaments.length >= 15, 'should have 15+ filament profiles');
  });

  it('unknown SM endpoint returns 404', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/nonexistent`, { signal: AbortSignal.timeout(5000) });
    assert.equal(res.status, 404);
  });
});
