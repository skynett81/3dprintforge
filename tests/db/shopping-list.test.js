// shopping-list.test.js — consolidated cross-supplier shopping list (Fase 3.2).
// Turns the reorder shortfall into a per-supplier basket: cheapest supplier
// part per material, with buy link, suggested qty, line cost and subtotals.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { addSupplier, addSupplierPart } from '../../server/db/suppliers.js';
import { setStockTarget, getShoppingList } from '../../server/db/reorder.js';

describe('getShoppingList', () => {
  let supA, supB, plaId;
  beforeEach(() => {
    setupTestDb();
    plaId = addFilamentProfile({ name: 'PLA Black', material: 'PLA' }).id;
    supA = addSupplier({ name: 'ShopA' }).id;
    supB = addSupplier({ name: 'ShopB' }).id;
    // ShopA is cheaper (20/kg) than ShopB (30/kg) for the same PLA profile.
    addSupplierPart({ supplier_id: supA, filament_profile_id: plaId, price: 20, weight_g: 1000, pack_qty: 1, product_url: 'http://a/pla', sku: 'A-PLA', currency: 'USD' });
    addSupplierPart({ supplier_id: supB, filament_profile_id: plaId, price: 30, weight_g: 1000, pack_qty: 1, product_url: 'http://b/pla', currency: 'USD' });
    setStockTarget('PLA', 2500); // no stock on hand -> shortfall 2500 -> 3 spools
  });

  it('groups the cheapest supplier per material with buy link, qty and cost', () => {
    const list = getShoppingList();
    assert.equal(list.suppliers.length, 1);
    const g = list.suppliers[0];
    assert.equal(g.supplier_name, 'ShopA');
    assert.equal(g.currency, 'USD');
    assert.equal(g.lines.length, 1);
    const line = g.lines[0];
    assert.equal(line.material, 'PLA');
    assert.equal(line.qty, 3);           // ceil(2500/1000)
    assert.equal(line.price, 20);
    assert.equal(line.line_cost, 60);    // 20 * 3
    assert.equal(line.product_url, 'http://a/pla');
    assert.equal(line.sku, 'A-PLA');
    assert.equal(g.subtotal, 60);
    assert.deepEqual(list.totals_by_currency, { USD: 60 });
    assert.equal(list.item_count, 1);
  });

  it('never picks the pricier supplier', () => {
    const list = getShoppingList();
    assert.ok(!list.suppliers.some(s => s.supplier_id === supB));
  });

  it('lists materials with no priced supplier part as unsourced', () => {
    setStockTarget('PETG', 1000); // no supplier part for PETG
    const list = getShoppingList();
    assert.ok(list.unsourced.some(u => u.material === 'PETG' && u.shortfall_g === 1000));
  });

  it('groups multiple materials from one supplier and sums the subtotal', () => {
    const petg = addFilamentProfile({ name: 'PETG', material: 'PETG' }).id;
    addSupplierPart({ supplier_id: supA, filament_profile_id: petg, price: 25, weight_g: 1000, pack_qty: 1, currency: 'USD' });
    setStockTarget('PETG', 1000); // shortfall 1000 -> 1 spool -> 25
    const list = getShoppingList();
    const g = list.suppliers.find(s => s.supplier_id === supA);
    assert.equal(g.lines.length, 2);
    assert.equal(g.subtotal, 85); // 60 + 25
    assert.deepEqual(list.totals_by_currency, { USD: 85 });
  });

  it('returns an empty basket when nothing is below target', () => {
    setStockTarget('PLA', 0); // no shortfall
    const list = getShoppingList();
    assert.equal(list.suppliers.length, 0);
    assert.equal(list.item_count, 0);
    assert.deepEqual(list.unsourced, []);
  });
});
