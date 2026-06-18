// reorder.test.js — Procurement Phase 4: per-material minimum stock targets,
// queue-aware demand, shortfall report, and drafting POs from shortfalls.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  setStockTarget, getStockTargets, deleteStockTarget,
  getReorderReport, draftReorderPurchaseOrders,
} from '../../server/db/reorder.js';
import { addSpool } from '../../server/db/spools.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { addSupplier, addSupplierPart } from '../../server/db/suppliers.js';
import { createQueue, addQueueItem } from '../../server/db/queue.js';

function plaSpool(g) {
  const prof = addFilamentProfile({ name: 'PLA ' + g, material: 'PLA' }).id;
  return addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: g });
}

describe('Stock targets', () => {
  before(() => setupTestDb());

  it('upserts a per-material target (normalised to base material)', () => {
    setupTestDb();
    setStockTarget('PLA-Basic', 2000, 'keep 2kg');
    const list = getStockTargets();
    assert.equal(list.length, 1);
    assert.equal(list[0].material, 'PLA');
    assert.equal(list[0].min_weight_g, 2000);
    // upsert (no duplicate)
    setStockTarget('PLA', 1500);
    assert.equal(getStockTargets().length, 1);
    assert.equal(getStockTargets()[0].min_weight_g, 1500);
    deleteStockTarget('PLA');
    assert.equal(getStockTargets().length, 0);
  });
});

describe('Reorder report', () => {
  before(() => setupTestDb());

  it('computes shortfall = target + queue demand − on-hand', () => {
    setupTestDb();
    // 800 g PLA on hand
    plaSpool(800);
    // target 2000 g
    setStockTarget('PLA', 2000);
    // queue demands 500 g PLA (2 copies of a 250 g job)
    const qid = Number(createQueue({ name: 'Q' }));
    addQueueItem(qid, { filename: 'job.3mf', estimated_filament_g: 250, required_material: 'PLA', copies: 2 });

    const report = getReorderReport();
    const pla = report.find(r => r.material === 'PLA');
    assert.ok(pla, 'PLA row present');
    assert.equal(pla.on_hand_g, 800);
    assert.equal(pla.queue_demand_g, 500);
    assert.equal(pla.target_g, 2000);
    // 2000 + 500 - 800 = 1700
    assert.equal(pla.shortfall_g, 1700);
    assert.equal(pla.below_target, true);
    assert.equal(pla.suggested_spools, 2); // ceil(1700/1000)
  });

  it('suggests the cheapest supplier part and sizes spools to its pack', () => {
    setupTestDb();
    plaSpool(0 + 100);
    setStockTarget('PLA', 2000);
    const prof = addFilamentProfile({ name: 'PLA Cheap', material: 'PLA' }).id;
    const s1 = addSupplier({ name: 'Pricey' }).id;
    const s2 = addSupplier({ name: 'Cheap' }).id;
    addSupplierPart({ supplier_id: s1, filament_profile_id: prof, price: 30, weight_g: 1000 }); // 30/kg
    addSupplierPart({ supplier_id: s2, filament_profile_id: prof, price: 18, weight_g: 1000 }); // 18/kg
    const pla = getReorderReport().find(r => r.material === 'PLA');
    assert.ok(pla.cheapest);
    assert.equal(pla.cheapest.supplier_name, 'Cheap');
    assert.equal(pla.cheapest.price_per_kg, 18);
  });

  it('no shortfall when on-hand meets target', () => {
    setupTestDb();
    plaSpool(3000);
    setStockTarget('PLA', 2000);
    const pla = getReorderReport().find(r => r.material === 'PLA');
    assert.equal(pla.shortfall_g, 0);
    assert.equal(pla.below_target, false);
    assert.equal(pla.suggested_spools, 0);
  });
});

describe('Draft POs from shortfall', () => {
  before(() => setupTestDb());

  it('groups shortfall materials by cheapest supplier into draft POs', () => {
    setupTestDb();
    plaSpool(100);
    setStockTarget('PLA', 2000);
    const prof = addFilamentProfile({ name: 'PLA Buy', material: 'PLA' }).id;
    const sup = addSupplier({ name: 'Shop' }).id;
    addSupplierPart({ supplier_id: sup, filament_profile_id: prof, price: 20, weight_g: 1000 });

    const { created, unsourced } = draftReorderPurchaseOrders();
    assert.equal(created.length, 1);
    assert.equal(created[0].status, 'draft');
    assert.equal(created[0].supplier_name, 'Shop');
    assert.ok(created[0].lines.length >= 1);
    assert.equal(created[0].lines[0].filament_profile_id, prof);
    assert.equal(unsourced.length, 0);
  });

  it('flags materials with no priced supplier part as unsourced', () => {
    setupTestDb();
    plaSpool(100);
    setStockTarget('PLA', 2000); // PLA short but no supplier part exists
    const { created, unsourced } = draftReorderPurchaseOrders();
    assert.equal(created.length, 0);
    assert.deepEqual(unsourced, ['PLA']);
  });
});
