// E2E test: Snapmaker filament panel renders correctly
// Uses node:test + fetch against running server (not Playwright — no browser needed for API E2E)

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.TEST_URL || 'https://localhost:3443';
const PRINTER_ID = process.env.TEST_PRINTER || 'snapmaker-u1';

// Skip if no server running
async function serverAvailable() {
  try {
    await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
    return true;
  } catch { return false; }
}

describe('SM Filament E2E', () => {

  before(async () => {
    if (!await serverAvailable()) {
      console.log('Skipping E2E tests — server not running');
      process.exit(0);
    }
  });

  it('GET /snapmaker/filament returns channel data', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/filament`, {
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.channels), 'channels should be an array');
    if (data.channels.length > 0) {
      const ch = data.channels[0];
      assert.ok('vendor' in ch, 'channel should have vendor');
      assert.ok('type' in ch, 'channel should have type');
      assert.ok('color' in ch, 'channel should have color');
      assert.ok(ch.color.startsWith('#'), 'color should be hex');
    }
  });

  it('GET /snapmaker/filament returns feed state', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/filament`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    assert.ok(Array.isArray(data.feed), 'feed should be an array');
    if (data.feed.length > 0) {
      const f = data.feed[0];
      assert.ok('extruder' in f, 'feed should have extruder');
      assert.ok('stateLabel' in f, 'feed should have stateLabel');
      assert.ok('filament_detected' in f, 'feed should have filament_detected');
    }
  });

  it('POST /snapmaker/feed validates action', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'invalid', channel: 0 }),
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes('action required'));
  });

  it('POST /snapmaker/feed validates channel', async () => {
    const res = await fetch(`${BASE}/api/printers/${PRINTER_ID}/snapmaker/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'auto', channel: 99 }),
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(res.status, 400);
  });
});
