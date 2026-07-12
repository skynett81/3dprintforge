// inventory-qr.test.js — Inventory Fase 2: QR code assignment + resolution.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from './test-helper.js';
import { ensureQr, resolveCode, codeToHash } from '../server/inventory-qr.js';
import { addPart } from '../server/db/parts.js';
import { addStockItem } from '../server/db/stock-items.js';
import { addLocation } from '../server/db/spools.js';

describe('inventory-qr', () => {
  before(() => setupTestDb());

  it('assigns a prefixed qr code to a part and is idempotent', () => {
    const part = addPart({ name: 'Nozzle 0.4' }).id;
    const first = ensureQr('part', part);
    assert.match(first.qr_uid, /^P[0-9A-F]+$/);
    const second = ensureQr('part', part);
    assert.equal(second.qr_uid, first.qr_uid); // idempotent — keeps the same code
  });

  it('uses distinct prefixes per entity type', () => {
    setupTestDb();
    const part = addPart({ name: 'p' }).id;
    const loc = addLocation({ name: 'Bin' }).id;
    const item = addStockItem({ part_id: part, quantity: 1 }).id;
    assert.match(ensureQr('part', part).qr_uid, /^P/);
    assert.match(ensureQr('location', loc).qr_uid, /^L/);
    assert.match(ensureQr('stock', item).qr_uid, /^S/);
  });

  it('resolves a code back to its entity with a nav hash', () => {
    setupTestDb();
    const part = addPart({ name: 'Belt GT2' }).id;
    const code = ensureQr('part', part).qr_uid;
    const r = resolveCode(code);
    assert.equal(r.type, 'part');
    assert.equal(r.id, part);
    assert.equal(r.name, 'Belt GT2');
    assert.equal(r.hash, `#/inventory/parts/${part}`);
  });

  it('resolves case-insensitively and strips a surrounding URL', () => {
    setupTestDb();
    const loc = addLocation({ name: 'Shelf' }).id;
    const code = ensureQr('location', loc).qr_uid;
    assert.equal(resolveCode(code.toLowerCase()).id, loc);
    assert.equal(resolveCode(`https://host/qr/${code}`).id, loc);
  });

  it('returns null for an unknown code', () => {
    setupTestDb();
    assert.equal(resolveCode('P0000DEAD'), null);
    assert.equal(ensureQr('part', 99999), null); // missing entity
  });

  it('codeToHash maps each type', () => {
    assert.equal(codeToHash('part', 3), '#/inventory/parts/3');
    assert.equal(codeToHash('location', 4), '#/inventory/locations/4');
    assert.equal(codeToHash('stock', 5), '#/inventory/stock');
  });
});
