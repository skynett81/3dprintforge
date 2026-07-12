// purchase-order-shipping.test.js — PO shipment tracking (Fase 3.1).
// Adds a 'shipped' stage between 'placed' and 'received' with carrier +
// tracking number, and a tracking-URL builder for common carriers.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  addPurchaseOrder,
  getPurchaseOrder,
  updatePurchaseOrder,
  markPurchaseOrderShipped,
  trackingUrl,
  PO_STATUSES,
} from '../../server/db/purchase-orders.js';

describe('PO_STATUSES', () => {
  it("includes 'shipped' between placed and received", () => {
    assert.ok(PO_STATUSES.includes('shipped'));
    assert.ok(PO_STATUSES.indexOf('shipped') > PO_STATUSES.indexOf('placed'));
    assert.ok(PO_STATUSES.indexOf('shipped') < PO_STATUSES.indexOf('received'));
  });
});

describe('markPurchaseOrderShipped', () => {
  let poId;
  beforeEach(() => {
    setupTestDb();
    poId = addPurchaseOrder({ reference: 'PO-1', status: 'placed' }).id;
  });

  it('sets status, carrier, tracking number and shipped_at', () => {
    const po = markPurchaseOrderShipped(poId, { carrier: 'postnord', tracking_number: 'ABC123' });
    assert.equal(po.status, 'shipped');
    assert.equal(po.carrier, 'postnord');
    assert.equal(po.tracking_number, 'ABC123');
    assert.ok(po.shipped_at);
  });

  it('persists the shipment fields', () => {
    markPurchaseOrderShipped(poId, { carrier: 'dhl', tracking_number: 'X9' });
    const po = getPurchaseOrder(poId);
    assert.equal(po.carrier, 'dhl');
    assert.equal(po.tracking_number, 'X9');
  });

  it('works from a draft too', () => {
    const draftId = addPurchaseOrder({ reference: 'PO-2' }).id; // draft
    const po = markPurchaseOrderShipped(draftId, { carrier: 'ups', tracking_number: '1Z' });
    assert.equal(po.status, 'shipped');
  });

  it('refuses to ship a received or cancelled PO', () => {
    updatePurchaseOrder(poId, { status: 'received' });
    assert.throws(() => markPurchaseOrderShipped(poId, { carrier: 'ups', tracking_number: '1' }), /received|cannot|ship/i);
    const cId = addPurchaseOrder({ status: 'cancelled' }).id;
    assert.throws(() => markPurchaseOrderShipped(cId, { carrier: 'ups', tracking_number: '1' }), /cancel|cannot|ship/i);
  });

  it('throws for a missing PO', () => {
    assert.throws(() => markPurchaseOrderShipped(999999, { carrier: 'ups', tracking_number: '1' }), /not found/i);
  });
});

describe('trackingUrl', () => {
  it('builds a URL for known carriers with the tracking number', () => {
    const u = trackingUrl('postnord', 'ABC123');
    assert.match(u, /^https:\/\//);
    assert.ok(u.includes('ABC123'));
  });

  it('is case-insensitive on the carrier name', () => {
    assert.ok(trackingUrl('DHL', '42'));
    assert.ok(trackingUrl('PostNord', '42'));
  });

  it('URL-encodes the tracking number', () => {
    assert.ok(trackingUrl('ups', 'a b/c').includes('a%20b%2Fc'));
  });

  it('returns null for an unknown carrier or missing number', () => {
    assert.equal(trackingUrl('acme-couriers', '1'), null);
    assert.equal(trackingUrl('dhl', ''), null);
    assert.equal(trackingUrl('', '1'), null);
  });
});
