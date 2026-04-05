// E2E test: Snapmaker defect detection API

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.TEST_URL || 'https://localhost:3443';
const PRINTER_ID = process.env.TEST_PRINTER || 'snapmaker-u1';

async function serverAvailable() {
  try { await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(3000) }); return true; } catch { return false; }
}

describe('SM Defect Detection E2E', () => {

  before(async () => {
    if (!await serverAvailable()) { console.log('Skipping — server not running'); process.exit(0); }
  });

  it('GET /snapmaker/defects returns current state + events', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/defects`, { signal: AbortSignal.timeout(5000) });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok('current' in data, 'should have current');
    assert.ok('events' in data, 'should have events');
    if (data.current) {
      assert.ok('enabled' in data.current, 'current should have enabled');
      assert.ok('noodle' in data.current || 'cleanBed' in data.current, 'should have detector configs');
    }
  });

  it('GET /snapmaker/state returns machine state', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/state`, { signal: AbortSignal.timeout(5000) });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok('machine_state' in data, 'should have machine_state');
    assert.ok('state_name' in data, 'should have state_name');
    assert.ok('state_category' in data, 'should have state_category');
    assert.ok('state_label' in data, 'should have state_label');
  });

  it('GET /snapmaker/power returns power status', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/power`, { signal: AbortSignal.timeout(5000) });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok('initialized' in data || 'powerLoss' in data || 'dutyPercent' in data, 'should have power fields');
  });
});
