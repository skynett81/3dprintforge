// shop-fulfillment.test.js — order -> queue -> fulfillment (Fase 2.2).
// A catalog product can be added to a CRM order (carrying its price as
// revenue and its cost breakdown as COGS), then the order is dispatched to
// the print queue. Tracked stock is decremented on add.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { createShopProduct, getShopProduct } from '../../server/db/shop-products.js';
import { createCrmCustomer, createCrmOrder, getCrmOrder } from '../../server/db/crm.js';
import { getOrderMargin } from '../../server/db/order-margins.js';
import { createQueue, getQueue } from '../../server/db/queue.js';
import {
  addProductToOrder,
  dispatchOrderToQueue,
  adjustProductStock,
} from '../../server/db/shop-fulfillment.js';

// price 100, COGS 33 (20+10+2+1)
const PROD = {
  name: 'Bracket', filename: 'bracket.3mf', file_hash: 'h1', price: 100,
  filament_type: 'PLA', filament_weight_g: 42, print_time_min: 90,
  material_cost: 20, labor_cost: 10, electricity_cost: 2, wear_cost: 1,
  stock_qty: 5,
};

describe('addProductToOrder', () => {
  let orderId, productId;
  beforeEach(() => {
    setupTestDb();
    productId = createShopProduct(PROD).id;
    const cust = createCrmCustomer({ name: 'Acme' });
    orderId = createCrmOrder({ customer_id: cust.id }).id;
  });

  it('creates an order item linked to the product', () => {
    addProductToOrder(orderId, productId, 2);
    const order = getCrmOrder(orderId);
    assert.equal(order.items.length, 1);
    const item = order.items[0];
    assert.equal(item.product_id, productId);
    assert.equal(item.quantity, 2);
    assert.equal(item.filename, 'bracket.3mf');
  });

  it('reflects the product sale price as revenue in the margin', () => {
    addProductToOrder(orderId, productId, 1);
    const m = getOrderMargin(orderId);
    assert.equal(m.revenue, 100); // sale price, not cost
    assert.equal(m.cogs, 33);
    assert.equal(m.margin, 67);
  });

  it('decrements tracked stock', () => {
    addProductToOrder(orderId, productId, 2);
    assert.equal(getShopProduct(productId).stock_qty, 3); // 5 - 2
  });

  it('leaves made-to-order (null stock) products alone', () => {
    const mto = createShopProduct({ name: 'MTO', filename: 'x.3mf', price: 10 }).id;
    addProductToOrder(orderId, mto, 3);
    assert.equal(getShopProduct(mto).stock_qty, null);
  });

  it('throws on a missing product', () => {
    assert.throws(() => addProductToOrder(orderId, 999999, 1), /product not found/i);
  });

  it('rejects a non-positive quantity', () => {
    assert.throws(() => addProductToOrder(orderId, productId, 0), /quantity/i);
  });
});

describe('dispatchOrderToQueue', () => {
  let orderId, productId, queueId;
  beforeEach(() => {
    setupTestDb();
    productId = createShopProduct(PROD).id;
    const cust = createCrmCustomer({ name: 'Acme' });
    orderId = createCrmOrder({ customer_id: cust.id }).id;
    queueId = Number(createQueue({ name: 'Shop queue' }));
  });

  it('creates a queue item per order line and links it back', () => {
    addProductToOrder(orderId, productId, 3);
    const res = dispatchOrderToQueue(orderId, queueId);
    assert.equal(res.dispatched.length, 1);
    assert.equal(res.skipped.length, 0);

    const queue = getQueue(queueId);
    assert.equal(queue.items.length, 1);
    const qi = queue.items[0];
    assert.equal(qi.filename, 'bracket.3mf');
    assert.equal(qi.copies, 3);
    assert.equal(qi.estimated_duration_s, 5400); // 90 min * 60
    assert.equal(qi.estimated_filament_g, 42);

    const item = getCrmOrder(orderId).items[0];
    assert.equal(item.queue_item_id, qi.id);
  });

  it('moves the order into printing status', () => {
    addProductToOrder(orderId, productId, 1);
    dispatchOrderToQueue(orderId, queueId);
    assert.equal(getCrmOrder(orderId).status, 'printing');
  });

  it('is idempotent — a second dispatch queues nothing new', () => {
    addProductToOrder(orderId, productId, 1);
    dispatchOrderToQueue(orderId, queueId);
    const res2 = dispatchOrderToQueue(orderId, queueId);
    assert.equal(res2.dispatched.length, 0);
    assert.equal(getQueue(queueId).items.length, 1);
  });

  it('skips items with no printable file', () => {
    const noFile = createShopProduct({ name: 'No file', price: 5 }).id;
    addProductToOrder(orderId, noFile, 1);
    const res = dispatchOrderToQueue(orderId, queueId);
    assert.equal(res.dispatched.length, 0);
    assert.equal(res.skipped.length, 1);
  });
});

describe('adjustProductStock', () => {
  beforeEach(() => setupTestDb());

  it('adds and removes tracked stock', () => {
    const id = createShopProduct({ name: 'S', price: 1, stock_qty: 10 }).id;
    assert.equal(adjustProductStock(id, -4), 6);
    assert.equal(adjustProductStock(id, 2), 8);
  });

  it('is a no-op for made-to-order products', () => {
    const id = createShopProduct({ name: 'M', price: 1 }).id;
    assert.equal(adjustProductStock(id, -1), null);
    assert.equal(getShopProduct(id).stock_qty, null);
  });

  it('never drops below zero', () => {
    const id = createShopProduct({ name: 'Z', price: 1, stock_qty: 3 }).id;
    assert.equal(adjustProductStock(id, -10), 0);
    assert.equal(getShopProduct(id).stock_qty, 0);
  });
});
