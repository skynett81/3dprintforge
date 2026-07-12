// shop-fulfillment.js — order -> queue -> fulfillment (Fase 2.2).
//
// Bridges the storefront catalog to production:
//  - addProductToOrder turns a catalog product into a CRM order line, carrying
//    its sale price as revenue (via a derived markup so order totals reflect
//    the price) and its cost breakdown as COGS. Tracked stock is decremented.
//  - dispatchOrderToQueue sends an order's printable lines to the print queue
//    and records the queue item on each line. It is idempotent: already
//    dispatched lines are skipped.

import { getDb } from './connection.js';
import { getShopProduct } from './shop-products.js';
import { addCrmOrderItem, updateCrmOrderStatus, createCrmCustomer, createCrmOrder } from './crm.js';
import { addQueueItem } from './queue.js';

// Guardrails for untrusted storefront submissions.
const MAX_ITEM_QTY = 1000;
const MAX_ORDER_ITEMS = 50;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Public-safe view of a product for the unauthenticated storefront. Cost,
 * margin, file and stock internals are deliberately omitted.
 */
export function publicProduct(p) {
  return {
    id: p.id,
    name: p.name,
    description: p.description || null,
    category: p.category || null,
    price: p.price || 0,
    currency: p.currency || 'NOK',
    image_url: p.image_url || null,
    in_stock: p.stock_qty === null || p.stock_qty === undefined ? true : p.stock_qty > 0,
  };
}

/**
 * Create a CRM order from an untrusted storefront cart. Everything is
 * validated before any row is written, so a bad item can't leave a partial
 * order or a spurious stock deduction behind.
 * @returns {{order_id:number, order_number:string}}
 */
export function createShopOrder({ customer = {}, items = [], notes = null } = {}) {
  const name = String(customer.name ?? '').trim().slice(0, 200);
  if (!name) throw new Error('Customer name is required');
  const email = customer.email ? String(customer.email).trim().slice(0, 200) : null;
  const phone = customer.phone ? String(customer.phone).trim().slice(0, 200) : null;
  if (email && !EMAIL_RE.test(email)) throw new Error('Invalid email address');
  if (!Array.isArray(items) || items.length === 0) throw new Error('Order must contain at least one item');
  if (items.length > MAX_ORDER_ITEMS) throw new Error('Too many items in one order');

  // Resolve + validate every line before creating anything.
  const resolved = items.map((it) => {
    const product = getShopProduct(parseInt(it.product_id, 10));
    if (!product || !product.active) throw new Error('Product not available');
    const qty = it.quantity === undefined ? 1 : parseInt(it.quantity, 10);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_ITEM_QTY) throw new Error('Invalid quantity');
    // Enforce stock server-side — in_stock in the public catalog is only a hint.
    if (product.stock_qty !== null && product.stock_qty !== undefined && product.stock_qty < qty) {
      throw new Error('Insufficient stock');
    }
    return { product, qty };
  });

  const customerId = createCrmCustomer({ name, email, phone });
  const order = createCrmOrder({ customer_id: customerId, status: 'pending', notes: notes ? String(notes).slice(0, 2000) : 'Storefront order' });
  for (const r of resolved) addProductToOrder(order.id, r.product.id, r.qty);
  return { order_id: order.id, order_number: order.order_number };
}

/**
 * Add or remove tracked stock. No-op (returns null) for made-to-order
 * products whose stock_qty is null.
 * @returns {number|null} the new stock level, or null if untracked/missing
 */
export function adjustProductStock(productId, delta) {
  const db = getDb();
  const row = db.prepare('SELECT stock_qty FROM shop_products WHERE id = ?').get(productId);
  if (!row || row.stock_qty === null || row.stock_qty === undefined) return null;
  const next = Math.max(0, row.stock_qty + delta); // never let stock go negative
  db.prepare("UPDATE shop_products SET stock_qty = ?, updated_at = datetime('now') WHERE id = ?").run(next, productId);
  return next;
}

/**
 * Add a catalog product to a CRM order as a line item.
 * @returns {{item_id:number, product_id:number, quantity:number}}
 */
export function addProductToOrder(orderId, productId, quantity = 1) {
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) throw new Error('Quantity must be a positive integer');

  const product = getShopProduct(productId);
  if (!product) throw new Error('Product not found');

  const cogs = product.unit_cogs || 0;
  const price = product.price || 0;

  // Represent the sale price as revenue. The CRM item computes
  // total_cost = itemCost * (1 + markup/100) * qty, so choose markup such that
  // the line total equals the price. When there is no cost breakdown we can't
  // express price via markup, so book the price as material_cost (margin 0).
  let costFields;
  let markupPct;
  if (cogs > 0) {
    markupPct = (price / cogs - 1) * 100;
    costFields = {
      material_cost: product.material_cost || 0,
      labor_cost: product.labor_cost || 0,
      electricity_cost: product.electricity_cost || 0,
      wear_cost: product.wear_cost || 0,
    };
  } else {
    markupPct = 0;
    costFields = { material_cost: price, labor_cost: 0, electricity_cost: 0, wear_cost: 0 };
  }

  const itemId = addCrmOrderItem(orderId, {
    description: product.name,
    filename: product.filename || null,
    file_hash: product.file_hash || null,
    quantity: qty,
    filament_type: product.filament_type || null,
    filament_weight_g: product.filament_weight_g || null,
    estimated_time_min: product.print_time_min || null,
    markup_pct: markupPct,
    ...costFields,
  });

  const db = getDb();
  db.prepare('UPDATE crm_order_items SET product_id = ? WHERE id = ?').run(productId, itemId);

  if (product.stock_qty !== null && product.stock_qty !== undefined) {
    adjustProductStock(productId, -qty);
  }

  return { item_id: itemId, product_id: productId, quantity: qty };
}

/**
 * Dispatch an order's printable lines to the print queue. Idempotent — lines
 * already linked to a queue item are left untouched.
 * @returns {{dispatched: Array, skipped: Array}}
 */
export function dispatchOrderToQueue(orderId, queueId) {
  if (!queueId) throw new Error('A target queue is required');
  const db = getDb();
  const items = db
    .prepare('SELECT * FROM crm_order_items WHERE order_id = ? AND queue_item_id IS NULL')
    .all(orderId);

  const dispatched = [];
  const skipped = [];

  for (const item of items) {
    if (!item.filename) {
      skipped.push({ item_id: item.id, reason: 'no printable file' });
      continue;
    }
    const qId = Number(addQueueItem(queueId, {
      filename: item.filename,
      copies: item.quantity || 1,
      estimated_duration_s: item.estimated_time_min ? Math.round(item.estimated_time_min * 60) : null,
      estimated_filament_g: item.filament_weight_g || null,
      required_material: item.filament_type || null,
      notes: `CRM order #${orderId}`,
    }));
    db.prepare('UPDATE crm_order_items SET queue_item_id = ? WHERE id = ?').run(qId, item.id);
    dispatched.push({ item_id: item.id, queue_item_id: qId });
  }

  if (dispatched.length > 0) {
    updateCrmOrderStatus(orderId, 'printing');
  }

  return { dispatched, skipped };
}
