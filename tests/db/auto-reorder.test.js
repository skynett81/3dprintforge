// auto-reorder.test.js — automatic reorder decision (Fase 3.3).
// runAutoReorder inspects the shortfall list and either drafts POs (deduped
// so ticks don't stack) or returns a notify summary.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { addSupplier, addSupplierPart } from '../../server/db/suppliers.js';
import { getPurchaseOrders } from '../../server/db/purchase-orders.js';
import { setStockTarget, runAutoReorder } from '../../server/db/reorder.js';

describe('runAutoReorder', () => {
  let plaId, supId;
  beforeEach(() => {
    setupTestDb();
    plaId = addFilamentProfile({ name: 'PLA', material: 'PLA' }).id;
    supId = addSupplier({ name: 'ShopA' }).id;
    addSupplierPart({ supplier_id: supId, filament_profile_id: plaId, price: 20, weight_g: 1000, pack_qty: 1 });
  });

  it('reports none when nothing is below target', () => {
    setStockTarget('PLA', 0);
    assert.deepEqual(runAutoReorder({ mode: 'notify' }), { action: 'none', below_target: 0 });
  });

  it('notify mode returns a summary without creating POs', () => {
    setStockTarget('PLA', 2500);
    const r = runAutoReorder({ mode: 'notify' });
    assert.equal(r.action, 'notify');
    assert.equal(r.below_target, 1);
    assert.equal(r.sourced, 1);
    assert.ok(r.materials.some(m => m.material === 'PLA'));
    assert.equal(getPurchaseOrders().length, 0); // nothing created
  });

  it('draft mode drafts a PO from the shortfall', () => {
    setStockTarget('PLA', 2500);
    const r = runAutoReorder({ mode: 'draft' });
    assert.equal(r.action, 'drafted');
    assert.equal(r.created.length, 1);
    const pos = getPurchaseOrders();
    assert.equal(pos.length, 1);
    assert.equal(pos[0].reference, 'Auto-reorder');
    assert.equal(pos[0].status, 'draft');
  });

  it('does not stack drafts — a second run skips while an auto PO is open', () => {
    setStockTarget('PLA', 2500);
    runAutoReorder({ mode: 'draft' });
    const r2 = runAutoReorder({ mode: 'draft' });
    assert.equal(r2.action, 'skipped');
    assert.equal(r2.reason, 'auto_po_open');
    assert.equal(getPurchaseOrders().length, 1); // still just the one
  });

  it('draft mode with only unsourced shortfalls creates nothing', () => {
    // PETG is below target but has no priced supplier part.
    setStockTarget('PETG', 1000);
    setStockTarget('PLA', 0);
    const r = runAutoReorder({ mode: 'draft' });
    assert.equal(r.action, 'none_sourced');
    assert.ok(r.unsourced.includes('PETG'));
    assert.equal(getPurchaseOrders().length, 0);
  });
});
