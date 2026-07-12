// shop-public.test.js — public storefront order intake (Fase 2.3).
// Untrusted callers: products must be exposed without cost/margin, and order
// submission must validate everything before creating anything.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { createShopProduct, getShopProduct, setShopProductActive } from '../../server/db/shop-products.js';
import { getCrmOrder } from '../../server/db/crm.js';
import { getOrderMargin } from '../../server/db/order-margins.js';
import { publicProduct, createShopOrder } from '../../server/db/shop-fulfillment.js';

const PROD = {
  name: 'Bracket', filename: 'bracket.3mf', price: 100,
  material_cost: 20, labor_cost: 10, electricity_cost: 2, wear_cost: 1,
  stock_qty: 5, image_url: 'http://x/img.png', category: 'Home',
};

describe('publicProduct — no internal leakage', () => {
  beforeEach(() => setupTestDb());

  it('exposes only public fields', () => {
    const p = getShopProduct(createShopProduct(PROD).id);
    const pub = publicProduct(p);
    assert.deepEqual(Object.keys(pub).sort(), ['category', 'currency', 'description', 'id', 'image_url', 'in_stock', 'name', 'price'].sort());
  });

  it('never leaks cost/margin/file fields', () => {
    const pub = publicProduct(getShopProduct(createShopProduct(PROD).id));
    for (const k of ['material_cost', 'labor_cost', 'electricity_cost', 'wear_cost', 'unit_cogs', 'margin', 'margin_pct', 'filename', 'file_hash', 'stock_qty']) {
      assert.ok(!(k in pub), `leaked ${k}`);
    }
  });

  it('derives in_stock', () => {
    assert.equal(publicProduct(getShopProduct(createShopProduct({ name: 'A', price: 1, stock_qty: 0 }).id)).in_stock, false);
    assert.equal(publicProduct(getShopProduct(createShopProduct({ name: 'B', price: 1, stock_qty: 3 }).id)).in_stock, true);
    assert.equal(publicProduct(getShopProduct(createShopProduct({ name: 'C', price: 1 }).id)).in_stock, true); // made to order
  });
});

describe('createShopOrder', () => {
  let productId;
  beforeEach(() => {
    setupTestDb();
    productId = createShopProduct(PROD).id;
  });

  it('creates a pending CRM order from cart items', () => {
    const res = createShopOrder({ customer: { name: 'Jane', email: 'jane@example.com' }, items: [{ product_id: productId, quantity: 2 }] });
    assert.ok(res.order_number);
    const order = getCrmOrder(res.order_id);
    assert.equal(order.status, 'pending');
    assert.equal(order.items.length, 1);
    assert.equal(order.items[0].quantity, 2);
  });

  it('books the sale price as revenue', () => {
    const res = createShopOrder({ customer: { name: 'Jane' }, items: [{ product_id: productId, quantity: 1 }] });
    const m = getOrderMargin(res.order_id);
    assert.equal(m.revenue, 100);
    assert.equal(m.margin, 67);
  });

  it('decrements tracked stock', () => {
    createShopOrder({ customer: { name: 'Jane' }, items: [{ product_id: productId, quantity: 2 }] });
    assert.equal(getShopProduct(productId).stock_qty, 3);
  });

  it('requires a customer name', () => {
    assert.throws(() => createShopOrder({ customer: {}, items: [{ product_id: productId, quantity: 1 }] }), /name/i);
  });

  it('rejects an invalid email', () => {
    assert.throws(() => createShopOrder({ customer: { name: 'X', email: 'not-an-email' }, items: [{ product_id: productId, quantity: 1 }] }), /email/i);
  });

  it('requires at least one item', () => {
    assert.throws(() => createShopOrder({ customer: { name: 'X' }, items: [] }), /item/i);
  });

  it('rejects an inactive product', () => {
    setShopProductActive(productId, false);
    assert.throws(() => createShopOrder({ customer: { name: 'X' }, items: [{ product_id: productId, quantity: 1 }] }), /not available/i);
  });

  it('rejects a nonexistent product', () => {
    assert.throws(() => createShopOrder({ customer: { name: 'X' }, items: [{ product_id: 999999, quantity: 1 }] }), /not available/i);
  });

  it('rejects an invalid quantity', () => {
    assert.throws(() => createShopOrder({ customer: { name: 'X' }, items: [{ product_id: productId, quantity: 0 }] }), /quantity/i);
    assert.throws(() => createShopOrder({ customer: { name: 'X' }, items: [{ product_id: productId, quantity: 99999 }] }), /quantity/i);
  });

  it('rejects an order exceeding tracked stock', () => {
    // PROD has stock_qty 5
    assert.throws(() => createShopOrder({ customer: { name: 'X' }, items: [{ product_id: productId, quantity: 6 }] }), /insufficient stock/i);
    assert.equal(getShopProduct(productId).stock_qty, 5); // untouched
  });

  it('allows made-to-order products past any quantity', () => {
    const mto = createShopProduct({ name: 'MTO', price: 5 }).id; // null stock
    const res = createShopOrder({ customer: { name: 'X' }, items: [{ product_id: mto, quantity: 500 }] });
    assert.ok(res.order_number);
  });

  it('creates nothing when an item is invalid (validate-before-write)', () => {
    const before = getShopProduct(productId).stock_qty;
    assert.throws(() => createShopOrder({ customer: { name: 'X' }, items: [{ product_id: productId, quantity: 1 }, { product_id: 999999, quantity: 1 }] }));
    assert.equal(getShopProduct(productId).stock_qty, before); // stock untouched
  });
});
