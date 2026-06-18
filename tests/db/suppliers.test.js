// suppliers.test.js — Procurement Phase 1: suppliers & supplier parts,
// including cross-shop price-per-kg comparison.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  getSuppliers, getSupplier, addSupplier, updateSupplier, deleteSupplier,
  getSupplierParts, getSupplierPart, addSupplierPart, updateSupplierPart,
  deleteSupplierPart, getPriceComparison,
} from '../../server/db/suppliers.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';

describe('Suppliers CRUD', () => {
  before(() => setupTestDb());

  it('creates and reads a supplier with defaults', () => {
    const { id } = addSupplier({ name: 'MatterHackers' });
    const s = getSupplier(id);
    assert.equal(s.name, 'MatterHackers');
    assert.equal(s.currency, 'USD');
    assert.equal(s.archived, 0);
  });

  it('lists suppliers with a part_count and excludes archived by default', () => {
    setupTestDb();
    const a = addSupplier({ name: 'Amazon' }).id;
    addSupplier({ name: 'OldShop', archived: true });
    addSupplierPart({ supplier_id: a, price: 20 });
    const list = getSuppliers();
    assert.equal(list.length, 1);
    assert.equal(list[0].name, 'Amazon');
    assert.equal(list[0].part_count, 1);
    assert.equal(getSuppliers({ includeArchived: true }).length, 2);
  });

  it('updates a supplier via merge (partial update keeps other fields)', () => {
    setupTestDb();
    const { id } = addSupplier({ name: 'Shop', currency: 'EUR', lead_time_days: 3 });
    updateSupplier(id, { lead_time_days: 7 });
    const s = getSupplier(id);
    assert.equal(s.currency, 'EUR');
    assert.equal(s.lead_time_days, 7);
  });

  it('deleting a supplier cascades to its parts', () => {
    setupTestDb();
    const id = addSupplier({ name: 'Shop' }).id;
    addSupplierPart({ supplier_id: id, price: 25 });
    assert.equal(getSupplierParts({ supplier_id: id }).length, 1);
    deleteSupplier(id);
    assert.equal(getSupplierParts({ supplier_id: id }).length, 0);
  });
});

describe('Supplier parts + price-per-kg', () => {
  before(() => setupTestDb());

  it('computes price_per_kg from price / (weight_g * pack_qty)', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'Shop' }).id;
    // 1 kg spool at 20 → 20/kg
    const p1 = addSupplierPart({ supplier_id: sup, price: 20, weight_g: 1000, pack_qty: 1 });
    assert.equal(p1.price_per_kg, 20);
    // 5-pack of 1 kg at 80 → 80 / 5kg = 16/kg
    const p2 = addSupplierPart({ supplier_id: sup, price: 80, weight_g: 1000, pack_qty: 5 });
    assert.equal(p2.price_per_kg, 16);
    // No price → null price_per_kg, never crashes
    const p3 = addSupplierPart({ supplier_id: sup, weight_g: 1000 });
    assert.equal(p3.price_per_kg, null);
  });

  it('joins supplier + profile metadata onto parts', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'MH', lead_time_days: 4 }).id;
    const prof = addFilamentProfile({ name: 'PLA Basic Black', material: 'PLA', color_name: 'Black' });
    const part = addSupplierPart({ supplier_id: sup, filament_profile_id: prof.id, price: 22, sku: 'X1' });
    assert.equal(part.supplier_name, 'MH');
    assert.equal(part.supplier_lead_time_days, 4);
    assert.equal(part.profile_name, 'PLA Basic Black');
    assert.equal(part.profile_material, 'PLA');
  });

  it('getPriceComparison returns priced parts for a profile, cheapest first', () => {
    setupTestDb();
    const s1 = addSupplier({ name: 'A' }).id;
    const s2 = addSupplier({ name: 'B' }).id;
    const prof = addFilamentProfile({ name: 'PETG', material: 'PETG' });
    addSupplierPart({ supplier_id: s1, filament_profile_id: prof.id, price: 25, weight_g: 1000 }); // 25/kg
    addSupplierPart({ supplier_id: s2, filament_profile_id: prof.id, price: 18, weight_g: 1000 }); // 18/kg
    addSupplierPart({ supplier_id: s2, filament_profile_id: prof.id, weight_g: 1000 }); // no price → excluded
    const cmp = getPriceComparison(prof.id);
    assert.equal(cmp.length, 2);
    assert.equal(cmp[0].price_per_kg, 18); // cheapest first
    assert.equal(cmp[1].price_per_kg, 25);
  });

  it('updates and deletes a supplier part', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'Shop' }).id;
    const part = addSupplierPart({ supplier_id: sup, price: 30 });
    const upd = updateSupplierPart(part.id, { price: 27.5, in_stock: true });
    assert.equal(upd.price, 27.5);
    assert.equal(upd.in_stock, 1);
    deleteSupplierPart(part.id);
    assert.equal(getSupplierPart(part.id), null);
  });
});
