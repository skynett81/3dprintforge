// parts.test.js — Inventory Fase 1: generic Part catalog, categories and
// physical stock items with a qty-based move ledger.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  addPartCategory, getPartCategories, getPartCategory, updatePartCategory, deletePartCategory,
  addPart, getParts, getPart, updatePart, deletePart, getPartStock,
} from '../../server/db/parts.js';
import {
  addStockItem, getStockItems, getStockItem, updateStockItem, deleteStockItem,
  adjustStock, moveStock, getStockMoves,
} from '../../server/db/stock-items.js';
import { addLocation } from '../../server/db/spools.js';

describe('Part categories', () => {
  before(() => setupTestDb());

  it('creates a category with defaults and nesting', () => {
    const root = addPartCategory({ name: 'Hardware' });
    const child = addPartCategory({ name: 'Fasteners', parent_id: root.id });
    const c = getPartCategory(child.id);
    assert.equal(c.name, 'Fasteners');
    assert.equal(c.parent_id, root.id);
    assert.equal(c.default_unit, 'pcs');
  });

  it('lists categories with a part_count', () => {
    setupTestDb();
    const cat = addPartCategory({ name: 'Tools' }).id;
    addPart({ name: 'Calipers', category_id: cat });
    addPart({ name: 'Deburring tool', category_id: cat });
    const list = getPartCategories();
    const tools = list.find((c) => c.name === 'Tools');
    assert.equal(tools.part_count, 2);
  });

  it('deletes a category and orphans its parts (category_id → null)', () => {
    setupTestDb();
    const cat = addPartCategory({ name: 'Temp' }).id;
    const p = addPart({ name: 'Widget', category_id: cat }).id;
    deletePartCategory(cat);
    assert.equal(getPartCategory(cat), null);
    assert.equal(getPart(p).category_id, null);
  });

  it('updates a category', () => {
    setupTestDb();
    const id = addPartCategory({ name: 'A' }).id;
    updatePartCategory(id, { name: 'B', default_unit: 'm' });
    assert.equal(getPartCategory(id).name, 'B');
    assert.equal(getPartCategory(id).default_unit, 'm');
  });
});

describe('Parts', () => {
  before(() => setupTestDb());

  it('creates a part with catalog defaults', () => {
    const { id } = addPart({ name: 'M3x8 screw', type: 'component' });
    const p = getPart(id);
    assert.equal(p.name, 'M3x8 screw');
    assert.equal(p.type, 'component');
    assert.equal(p.unit, 'pcs');
    assert.equal(p.is_active, 1);
    assert.equal(p.total_stock, 0);
  });

  it('rolls up total stock across stock items and flags low stock', () => {
    setupTestDb();
    const loc = addLocation({ name: 'Bin A' }).id;
    const part = addPart({ name: 'M3 nut', min_stock: 50 }).id;
    addStockItem({ part_id: part, location_id: loc, quantity: 30 });
    addStockItem({ part_id: part, location_id: loc, quantity: 10 });
    const p = getPart(part);
    assert.equal(p.total_stock, 40);
    assert.equal(getPartStock(part), 40);
    assert.equal(p.low, 1); // 40 < 50
  });

  it('lists parts with category name and honours the active filter', () => {
    setupTestDb();
    const cat = addPartCategory({ name: 'Bolts' }).id;
    addPart({ name: 'Bolt A', category_id: cat });
    addPart({ name: 'Bolt B', is_active: 0 });
    const active = getParts();
    assert.equal(active.length, 1);
    assert.equal(active[0].category_name, 'Bolts');
    const all = getParts({ includeInactive: true });
    assert.equal(all.length, 2);
  });

  it('updates and deletes a part', () => {
    setupTestDb();
    const id = addPart({ name: 'X' }).id;
    updatePart(id, { name: 'Y', min_stock: 5 });
    assert.equal(getPart(id).name, 'Y');
    deletePart(id);
    assert.equal(getPart(id), null);
  });
});

describe('Stock items + move ledger', () => {
  before(() => setupTestDb());

  it('adds a stock item and records an initial move', () => {
    const loc = addLocation({ name: 'Shelf 1' }).id;
    const part = addPart({ name: 'Bearing 608' }).id;
    const { id } = addStockItem({ part_id: part, location_id: loc, quantity: 12 });
    const item = getStockItem(id);
    assert.equal(item.quantity, 12);
    assert.equal(item.part_name, 'Bearing 608');
    assert.equal(item.location_name, 'Shelf 1');
    const moves = getStockMoves({ stock_item_id: id });
    assert.equal(moves.length, 1);
    assert.equal(moves[0].delta, 12);
    assert.equal(moves[0].balance, 12);
  });

  it('adjusts stock and appends a move with the running balance', () => {
    setupTestDb();
    const part = addPart({ name: 'Grommet' }).id;
    const { id } = addStockItem({ part_id: part, quantity: 10 });
    const r = adjustStock(id, -3, 'used in build', 'tester');
    assert.equal(r.quantity, 7);
    const moves = getStockMoves({ stock_item_id: id });
    assert.equal(moves.length, 2); // initial + adjust
    const last = moves[0]; // newest first
    assert.equal(last.delta, -3);
    assert.equal(last.balance, 7);
    assert.equal(last.reason, 'used in build');
  });

  it('never lets quantity go below zero', () => {
    setupTestDb();
    const part = addPart({ name: 'Clip' }).id;
    const { id } = addStockItem({ part_id: part, quantity: 2 });
    const r = adjustStock(id, -5);
    assert.equal(r.quantity, 0);
  });

  it('relocates a stock item', () => {
    setupTestDb();
    const a = addLocation({ name: 'A' }).id;
    const b = addLocation({ name: 'B' }).id;
    const part = addPart({ name: 'Spacer' }).id;
    const { id } = addStockItem({ part_id: part, location_id: a, quantity: 4 });
    moveStock(id, b);
    assert.equal(getStockItem(id).location_id, b);
  });

  it('filters stock items by part and location', () => {
    setupTestDb();
    const loc = addLocation({ name: 'C' }).id;
    const p1 = addPart({ name: 'P1' }).id;
    const p2 = addPart({ name: 'P2' }).id;
    addStockItem({ part_id: p1, location_id: loc, quantity: 1 });
    addStockItem({ part_id: p2, location_id: loc, quantity: 1 });
    assert.equal(getStockItems({ part_id: p1 }).length, 1);
    assert.equal(getStockItems({ location_id: loc }).length, 2);
  });

  it('deletes a stock item', () => {
    setupTestDb();
    const part = addPart({ name: 'Z' }).id;
    const { id } = addStockItem({ part_id: part, quantity: 1 });
    deleteStockItem(id);
    assert.equal(getStockItem(id), null);
  });
});
