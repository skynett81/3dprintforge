// purchase-orders.test.js — Procurement Phase 2: purchase orders with a status
// lifecycle and receiving that creates real spools (partial receiving).

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  getPurchaseOrders, getPurchaseOrder, addPurchaseOrder, updatePurchaseOrder,
  deletePurchaseOrder, addPurchaseOrderLine, updatePurchaseOrderLine,
  deletePurchaseOrderLine, receivePurchaseOrderLine,
} from '../../server/db/purchase-orders.js';
import { addSupplier, addSupplierPart } from '../../server/db/suppliers.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { getSpools } from '../../server/db/spools.js';

describe('Purchase orders CRUD + totals', () => {
  before(() => setupTestDb());

  it('creates a draft PO with lines and computes totals', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'MH' }).id;
    const prof = addFilamentProfile({ name: 'PLA Black', material: 'PLA' });
    const po = addPurchaseOrder({
      supplier_id: sup, reference: 'PO-1', shipping_cost: 10,
      lines: [
        { filament_profile_id: prof.id, quantity: 3, unit_price: 20, weight_g: 1000 },
        { filament_profile_id: prof.id, quantity: 2, unit_price: 25, weight_g: 1000 },
      ],
    });
    assert.equal(po.status, 'draft');
    assert.equal(po.supplier_name, 'MH');
    assert.equal(po.line_count, 2);
    assert.equal(po.total_qty, 5);
    // 3*20 + 2*25 + 10 shipping = 120
    assert.equal(po.total_cost, 120);
  });

  it('inherits profile/weight/price from a supplier part on the line', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'Shop' }).id;
    const prof = addFilamentProfile({ name: 'PETG', material: 'PETG' });
    const part = addSupplierPart({ supplier_id: sup, filament_profile_id: prof.id, price: 18, weight_g: 1000, sku: 'P1' });
    const po = addPurchaseOrder({ supplier_id: sup, lines: [{ supplier_part_id: part.id, quantity: 2 }] });
    const line = po.lines[0];
    assert.equal(line.filament_profile_id, prof.id);
    assert.equal(line.unit_price, 18);
    assert.equal(line.weight_g, 1000);
    assert.equal(line.supplier_sku, 'P1');
  });

  it('lists and filters by status', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'S' }).id;
    addPurchaseOrder({ supplier_id: sup, status: 'draft' });
    addPurchaseOrder({ supplier_id: sup, status: 'cancelled' });
    assert.equal(getPurchaseOrders().length, 2);
    assert.equal(getPurchaseOrders({ status: 'draft' }).length, 1);
  });

  it('updates status and deletes (cascading lines)', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'S' }).id;
    const po = addPurchaseOrder({ supplier_id: sup, lines: [{ quantity: 1, unit_price: 5 }] });
    const upd = updatePurchaseOrder(po.id, { status: 'placed', reference: 'X' });
    assert.equal(upd.status, 'placed');
    assert.equal(upd.reference, 'X');
    deletePurchaseOrder(po.id);
    assert.equal(getPurchaseOrder(po.id), null);
  });
});

describe('Receiving creates spools + advances status', () => {
  before(() => setupTestDb());

  it('partial receive moves draft -> placed and creates spools', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'S' }).id;
    const prof = addFilamentProfile({ name: 'PLA', material: 'PLA' });
    const po = addPurchaseOrder({ supplier_id: sup, order_date: '2026-06-01', lines: [{ filament_profile_id: prof.id, quantity: 3, unit_price: 20, weight_g: 1000 }] });
    const line = po.lines[0];
    const before = getSpools().total;
    const r = receivePurchaseOrderLine(line.id, 1);
    assert.equal(r.received, 1);
    assert.equal(r.spoolIds.length, 1);
    assert.equal(getSpools().total, before + 1);
    const after = getPurchaseOrder(po.id);
    assert.equal(after.status, 'placed');
    assert.equal(after.received_qty, 1);
    // the created spool carries the line's profile + weight + unit cost
    const spool = getSpools().rows.find(s => s.id === r.spoolIds[0]);
    assert.equal(spool.filament_profile_id, prof.id);
    assert.equal(spool.initial_weight_g, 1000);
    assert.equal(spool.cost, 20);
  });

  it('receiving the remainder auto-completes the PO', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'S' }).id;
    const prof = addFilamentProfile({ name: 'PLA', material: 'PLA' });
    const po = addPurchaseOrder({ supplier_id: sup, lines: [{ filament_profile_id: prof.id, quantity: 2, unit_price: 10 }] });
    const line = po.lines[0];
    receivePurchaseOrderLine(line.id, 2);
    const after = getPurchaseOrder(po.id);
    assert.equal(after.status, 'received');
    assert.ok(after.received_at);
  });

  it('never over-receives beyond the ordered quantity', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'S' }).id;
    const prof = addFilamentProfile({ name: 'PLA', material: 'PLA' });
    const po = addPurchaseOrder({ supplier_id: sup, lines: [{ filament_profile_id: prof.id, quantity: 2 }] });
    const line = po.lines[0];
    const r = receivePurchaseOrderLine(line.id, 99); // ask for more than ordered
    assert.equal(r.received, 2);
    const r2 = receivePurchaseOrderLine(line.id, 5); // nothing left
    assert.equal(r2.received, 0);
  });

  it('can add/update/delete lines independently', () => {
    setupTestDb();
    const sup = addSupplier({ name: 'S' }).id;
    const po = addPurchaseOrder({ supplier_id: sup });
    const line = addPurchaseOrderLine(po.id, { quantity: 1, unit_price: 5 });
    const upd = updatePurchaseOrderLine(line.id, { quantity: 4 });
    assert.equal(upd.quantity, 4);
    deletePurchaseOrderLine(line.id);
    assert.equal(getPurchaseOrder(po.id).lines.length, 0);
  });
});
