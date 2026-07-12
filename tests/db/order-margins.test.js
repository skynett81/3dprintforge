// order-margins.test.js — profitability layer over CRM orders/items.
// Revenue = item total_cost (cost x markup x qty). COGS = item_cost x qty.
// Margin = revenue - COGS; margin_pct = margin / revenue * 100.
// Order revenue is ex-tax and net of the order-level discount.

import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  createCrmCustomer,
  createCrmOrder,
  addCrmOrderItem,
  updateCrmOrder,
} from '../../server/db/crm.js';
import {
  computeMargin,
  getOrderMargin,
  getProductMargins,
  getMarginSummary,
} from '../../server/db/order-margins.js';

// Item A (qty 2): unit cost 16.5, markup 20% -> total_cost 39.6, cogs 33, margin 6.6
const ITEM_A = {
  description: 'Bracket',
  file_hash: 'hashA',
  quantity: 2,
  material_cost: 10,
  labor_cost: 5,
  electricity_cost: 1,
  wear_cost: 0.5,
  markup_pct: 20,
};
// Item B (qty 1): unit cost 20, no markup -> total_cost 20, cogs 20, margin 0
const ITEM_B = {
  description: 'Washer',
  file_hash: 'hashB',
  quantity: 1,
  material_cost: 20,
  markup_pct: 0,
};

describe('computeMargin (pure)', () => {
  it('computes margin and margin_pct', () => {
    assert.deepEqual(computeMargin(100, 60), { revenue: 100, cogs: 60, margin: 40, margin_pct: 40 });
  });
  it('never divides by zero revenue', () => {
    assert.deepEqual(computeMargin(0, 0), { revenue: 0, cogs: 0, margin: 0, margin_pct: 0 });
  });
  it('supports a loss (negative margin)', () => {
    const m = computeMargin(50, 80);
    assert.equal(m.margin, -30);
    assert.equal(m.margin_pct, -60);
  });
  it('rounds to 2 decimals', () => {
    const m = computeMargin(59.6, 53); // 6.6 / 59.6 = 11.0738...
    assert.equal(m.margin, 6.6);
    assert.equal(m.margin_pct, 11.07);
  });
});

describe('getOrderMargin', () => {
  let orderId;
  before(() => {
    setupTestDb();
    const cust = createCrmCustomer({ name: 'Acme' });
    const order = createCrmOrder({ customer_id: cust.id, status: 'draft' });
    orderId = order.id;
    addCrmOrderItem(orderId, ITEM_A);
    addCrmOrderItem(orderId, ITEM_B);
  });

  it('aggregates revenue, cogs and margin across items', () => {
    const m = getOrderMargin(orderId);
    assert.equal(m.order_id, orderId);
    assert.equal(m.revenue, 59.6);   // 39.6 + 20
    assert.equal(m.cogs, 53);        // 33 + 20
    assert.equal(m.margin, 6.6);
    assert.equal(m.margin_pct, 11.07);
    assert.equal(m.items.length, 2);
  });

  it('per-item breakdown carries its own margin', () => {
    const m = getOrderMargin(orderId);
    const a = m.items.find((i) => i.file_hash === 'hashA');
    assert.equal(a.revenue, 39.6);
    assert.equal(a.cogs, 33);
    assert.equal(a.margin, 6.6);
  });

  it('applies the order-level discount to revenue (ex-tax)', () => {
    updateCrmOrder(orderId, { discount_pct: 10 });
    const m = getOrderMargin(orderId);
    assert.equal(m.revenue, 53.64); // 59.6 * 0.9
    assert.equal(m.cogs, 53);
    assert.equal(m.margin, 0.64);
  });

  it('returns null for a missing order', () => {
    assert.equal(getOrderMargin(999999), null);
  });
});

describe('getProductMargins', () => {
  beforeEach(() => {
    setupTestDb();
    const cust = createCrmCustomer({ name: 'Acme' });
    const o1 = createCrmOrder({ customer_id: cust.id });
    addCrmOrderItem(o1.id, ITEM_A); // hashA, qty 2
    const o2 = createCrmOrder({ customer_id: cust.id });
    addCrmOrderItem(o2.id, ITEM_A); // hashA again, qty 2
    addCrmOrderItem(o2.id, ITEM_B); // hashB, qty 1
  });

  it('groups by product and sums units/revenue/cogs/margin', () => {
    const rows = getProductMargins({});
    const a = rows.find((r) => r.product_key === 'hashA');
    assert.equal(a.units, 4);        // 2 + 2
    assert.equal(a.revenue, 79.2);   // 39.6 * 2
    assert.equal(a.cogs, 66);        // 33 * 2
    assert.equal(a.margin, 13.2);
    assert.equal(a.margin_pct, 16.67);
  });

  it('sorts by margin descending by default', () => {
    const rows = getProductMargins({});
    assert.ok(rows[0].margin >= rows[rows.length - 1].margin);
    assert.equal(rows[0].product_key, 'hashA');
  });

  it('respects the limit', () => {
    assert.equal(getProductMargins({ limit: 1 }).length, 1);
  });
});

describe('getMarginSummary', () => {
  before(() => {
    setupTestDb();
    const cust = createCrmCustomer({ name: 'Acme' });
    const o = createCrmOrder({ customer_id: cust.id });
    addCrmOrderItem(o.id, ITEM_A);
    addCrmOrderItem(o.id, ITEM_B);
  });

  it('reports totals over all orders', () => {
    const s = getMarginSummary();
    assert.equal(s.orders, 1);
    assert.equal(s.revenue, 59.6);
    assert.equal(s.cogs, 53);
    assert.equal(s.margin, 6.6);
    assert.equal(s.margin_pct, 11.07);
  });

  it('includes a by_month breakdown array', () => {
    const s = getMarginSummary();
    assert.ok(Array.isArray(s.by_month));
    assert.ok(s.by_month.length >= 1);
    assert.ok('revenue' in s.by_month[0] && 'margin' in s.by_month[0]);
  });
});
