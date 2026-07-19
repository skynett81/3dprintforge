// inventory-fase4.test.js — stocktake reconciliation, warranties, attachments.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addPart, getPartStock } from '../../server/db/parts.js';
import { addStockItem } from '../../server/db/stock-items.js';
import { addLocation } from '../../server/db/spools.js';
import {
  createStocktake, getStocktake, getStocktakes, setStocktakeCount, applyStocktake, cancelStocktake,
} from '../../server/db/stocktake.js';
import {
  addWarranty, getWarranties, deleteWarranty, getExpiringWarranties,
  addAttachment, getAttachments, deleteAttachment,
} from '../../server/db/assets.js';

describe('Stocktake', () => {
  before(() => setupTestDb());

  it('snapshots expected quantities, optionally scoped to a location', () => {
    const a = addLocation({ name: 'A' }).id;
    const b = addLocation({ name: 'B' }).id;
    const part = addPart({ name: 'Screw' }).id;
    addStockItem({ part_id: part, location_id: a, quantity: 10 });
    addStockItem({ part_id: part, location_id: b, quantity: 4 });
    const st = createStocktake({ name: 'Q3', location_id: a });
    const full = getStocktake(st.id);
    assert.equal(full.lines.length, 1);            // only location A
    assert.equal(full.lines[0].expected, 10);
    assert.equal(full.lines[0].counted, null);
    assert.equal(full.lines[0].part_name, 'Screw');
  });

  it('applying reconciles counted vs expected and adjusts stock', () => {
    setupTestDb();
    const part = addPart({ name: 'Nut' }).id;
    const si = addStockItem({ part_id: part, quantity: 10 }).id;
    const st = createStocktake({}).id;
    const line = getStocktake(st).lines[0];
    setStocktakeCount(line.id, 7);
    const res = applyStocktake(st);
    assert.equal(res.adjusted, 1);
    assert.equal(getPartStock(part), 7);           // 10 → 7
    assert.equal(getStocktake(st).status, 'applied');
    assert.ok(si);
  });

  it('cancels a stocktake without adjusting stock', () => {
    setupTestDb();
    const part = addPart({ name: 'Bolt' }).id;
    addStockItem({ part_id: part, quantity: 5 });
    const st = createStocktake({}).id;
    setStocktakeCount(getStocktake(st).lines[0].id, 2);
    cancelStocktake(st);
    assert.equal(getStocktake(st).status, 'cancelled');
    assert.equal(getPartStock(part), 5);
    assert.equal(getStocktakes().length, 1);
  });
});

describe('Warranties & attachments', () => {
  before(() => setupTestDb());

  it('adds, lists and deletes a warranty; flags expiring ones', () => {
    setupTestDb();
    addWarranty({ entity_type: 'printer', entity_id: 'p1', provider: 'Bambu', start_date: '2025-01-01', end_date: '2099-01-01' });
    const list = getWarranties('printer', 'p1');
    assert.equal(list.length, 1);
    assert.equal(list[0].provider, 'Bambu');
    assert.equal(getExpiringWarranties(365 * 100).length, 1); // within 100y
    deleteWarranty(list[0].id);
    assert.equal(getWarranties('printer', 'p1').length, 0);
  });

  it('adds, lists and deletes attachments for a part', () => {
    setupTestDb();
    const part = String(addPart({ name: 'Extruder' }).id);
    addAttachment({ entity_type: 'part', entity_id: part, kind: 'manual', title: 'Manual', url: 'https://x/m.pdf' });
    const list = getAttachments('part', part);
    assert.equal(list.length, 1);
    assert.equal(list[0].kind, 'manual');
    assert.equal(list[0].url, 'https://x/m.pdf');
    deleteAttachment(list[0].id);
    assert.equal(getAttachments('part', part).length, 0);
  });
});
