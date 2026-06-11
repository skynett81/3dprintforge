// spoolman-api.test.js — Spoolman-compatible API mapping + usage

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addSpool } from '../../server/db/spools.js';
import { handleSpoolmanApi } from '../../server/spoolman-api.js';

const Q = () => new URLSearchParams();

describe('Spoolman-compatible API', () => {
  let id;
  before(() => {
    setupTestDb();
    const r = addSpool({ initial_weight_g: 1000, remaining_weight_g: 750, used_weight_g: 250, location: 'Shelf A' });
    id = r.id;
  });

  it('/info reports a version', () => {
    const r = handleSpoolmanApi('GET', '/api/v1/info', Q(), null);
    assert.strictEqual(r.status, 200);
    assert.ok(typeof r.json.version === 'string' && r.json.version.length > 0);
  });

  it('/health is healthy', () => {
    const r = handleSpoolmanApi('GET', '/api/v1/health', Q(), null);
    assert.deepStrictEqual(r.json, { status: 'healthy' });
  });

  it('/spool lists spools in Spoolman shape', () => {
    const r = handleSpoolmanApi('GET', '/api/v1/spool', Q(), null);
    assert.strictEqual(r.status, 200);
    assert.ok(Array.isArray(r.json));
    const s = r.json.find(x => x.id === id);
    assert.ok(s, 'our spool is listed');
    assert.strictEqual(s.remaining_weight, 750);
    assert.strictEqual(s.used_weight, 250);
    assert.strictEqual(s.archived, false);
    assert.ok(s.filament && typeof s.filament === 'object', 'has a nested filament object');
    assert.strictEqual(s.location, 'Shelf A');
  });

  it('/spool/:id returns one spool; unknown id is 404', () => {
    assert.strictEqual(handleSpoolmanApi('GET', '/api/v1/spool/' + id, Q(), null).json.id, id);
    assert.strictEqual(handleSpoolmanApi('GET', '/api/v1/spool/999999', Q(), null).status, 404);
  });

  it('/spool/:id/use deducts by weight', () => {
    const r = handleSpoolmanApi('PUT', '/api/v1/spool/' + id + '/use', Q(), { use_weight: 100 });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.json.remaining_weight, 650);
    assert.strictEqual(r.json.used_weight, 350);
  });

  it('/spool/:id/use converts length (mm) to grams via density+diameter', () => {
    // 1000 mm of 1.75 mm filament at 1.24 g/cm^3 ~= 2.98 g
    const before = handleSpoolmanApi('GET', '/api/v1/spool/' + id, Q(), null).json.remaining_weight;
    const r = handleSpoolmanApi('PUT', '/api/v1/spool/' + id + '/use', Q(), { use_length: 1000 });
    const delta = before - r.json.remaining_weight;
    assert.ok(Math.abs(delta - 2.98) < 0.1, 'deducted ~2.98 g, got ' + delta);
  });

  it('rejects a use call with neither weight nor length', () => {
    assert.strictEqual(handleSpoolmanApi('PUT', '/api/v1/spool/' + id + '/use', Q(), {}).status, 400);
  });
});
