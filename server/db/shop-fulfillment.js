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
import { addCrmOrderItem, updateCrmOrderStatus } from './crm.js';
import { addQueueItem } from './queue.js';

/**
 * Add or remove tracked stock. No-op (returns null) for made-to-order
 * products whose stock_qty is null.
 * @returns {number|null} the new stock level, or null if untracked/missing
 */
export function adjustProductStock(productId, delta) {
  const db = getDb();
  const row = db.prepare('SELECT stock_qty FROM shop_products WHERE id = ?').get(productId);
  if (!row || row.stock_qty === null || row.stock_qty === undefined) return null;
  const next = row.stock_qty + delta;
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
