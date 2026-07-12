// order-margins.js — profitability / margin layer over CRM orders & items.
//
// The CRM already stores, per order item:
//   item_cost  = per-unit COGS (material + labor + electricity + wear), no markup
//   total_cost = item_cost * (1 + markup_pct/100) * quantity  (the price charged)
//
// This module derives profitability without mutating anything:
//   revenue = total_cost              (list price incl. markup, incl. quantity)
//   cogs    = item_cost * quantity    (what it actually cost to make)
//   margin  = revenue - cogs
// Order-level revenue is reported ex-tax and net of the order discount, since
// tax is pass-through and a discount is a real giveback of margin.

import { getDb } from './connection.js';

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

/**
 * Pure margin math. Shared so every grain (item/order/product/summary)
 * rounds and guards divide-by-zero identically.
 * @param {number} revenue
 * @param {number} cogs
 * @returns {{revenue:number, cogs:number, margin:number, margin_pct:number}}
 */
export function computeMargin(revenue, cogs) {
  const rev = round2(revenue);
  const c = round2(cogs);
  const margin = round2(rev - c);
  const margin_pct = rev !== 0 ? round2((margin / rev) * 100) : 0;
  return { revenue: rev, cogs: c, margin, margin_pct };
}

/**
 * Profitability for a single order, with a per-item breakdown.
 * @param {number} orderId
 * @returns {object|null} null when the order does not exist
 */
export function getOrderMargin(orderId) {
  const db = getDb();
  const order = db
    .prepare('SELECT id, discount_pct, currency, created_at FROM crm_orders WHERE id = ?')
    .get(orderId);
  if (!order) return null;

  const rows = db
    .prepare(
      `SELECT id, file_hash, description, quantity, item_cost, total_cost
       FROM crm_order_items WHERE order_id = ?`
    )
    .all(orderId);

  const items = rows.map((r) => ({
    id: r.id,
    file_hash: r.file_hash || null,
    description: r.description || null,
    quantity: r.quantity || 1,
    ...computeMargin(r.total_cost, (r.item_cost || 0) * (r.quantity || 1)),
  }));

  const grossRevenue = rows.reduce((s, r) => s + (r.total_cost || 0), 0);
  const cogs = rows.reduce((s, r) => s + (r.item_cost || 0) * (r.quantity || 1), 0);
  const netRevenue = grossRevenue * (1 - (order.discount_pct || 0) / 100);

  return {
    order_id: order.id,
    currency: order.currency || 'NOK',
    ...computeMargin(netRevenue, cogs),
    items,
  };
}

/**
 * Margin aggregated per product (keyed by file hash, falling back to
 * description), across all orders in an optional date window.
 * @param {{from?:string, to?:string, limit?:number}} [opts]
 * @returns {Array<object>} sorted by margin descending
 */
export function getProductMargins({ from = null, to = null, limit = 100 } = {}) {
  const db = getDb();
  const where = [];
  const params = [];
  if (from) { where.push('o.created_at >= ?'); params.push(from); }
  if (to) { where.push('o.created_at <= ?'); params.push(to); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const rows = db
    .prepare(
      `SELECT COALESCE(NULLIF(i.file_hash, ''), i.description) AS product_key,
              MAX(i.description) AS description,
              SUM(i.quantity) AS units,
              SUM(i.total_cost) AS revenue,
              SUM(i.item_cost * i.quantity) AS cogs
       FROM crm_order_items i
       JOIN crm_orders o ON o.id = i.order_id
       ${whereSql}
       GROUP BY product_key`
    )
    .all(...params);

  return rows
    .map((r) => ({
      product_key: r.product_key,
      description: r.description || null,
      units: r.units || 0,
      ...computeMargin(r.revenue, r.cogs),
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, limit);
}

/**
 * Overall margin totals plus a by-month time series. Revenue is netted
 * against each order's discount before aggregation.
 * @param {string} [from]
 * @param {string} [to]
 */
export function getMarginSummary(from = null, to = null) {
  const db = getDb();
  const where = ['1=1'];
  const params = [];
  if (from) { where.push('o.created_at >= ?'); params.push(from); }
  if (to) { where.push('o.created_at <= ?'); params.push(to); }

  // One row per order so the discount can be applied before summing.
  const orders = db
    .prepare(
      `SELECT o.id, o.discount_pct, o.created_at,
              SUM(i.total_cost) AS gross,
              SUM(i.item_cost * i.quantity) AS cogs
       FROM crm_orders o
       JOIN crm_order_items i ON i.order_id = o.id
       WHERE ${where.join(' AND ')}
       GROUP BY o.id`
    )
    .all(...params);

  let totalRevenue = 0;
  let totalCogs = 0;
  const byMonth = new Map();

  for (const o of orders) {
    const revenue = (o.gross || 0) * (1 - (o.discount_pct || 0) / 100);
    const cogs = o.cogs || 0;
    totalRevenue += revenue;
    totalCogs += cogs;

    const month = String(o.created_at || '').slice(0, 7) || 'unknown';
    const m = byMonth.get(month) || { month, orders: 0, revenue: 0, cogs: 0 };
    m.orders += 1;
    m.revenue += revenue;
    m.cogs += cogs;
    byMonth.set(month, m);
  }

  const by_month = [...byMonth.values()]
    .map((m) => ({ month: m.month, orders: m.orders, ...computeMargin(m.revenue, m.cogs) }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    orders: orders.length,
    ...computeMargin(totalRevenue, totalCogs),
    by_month,
  };
}
