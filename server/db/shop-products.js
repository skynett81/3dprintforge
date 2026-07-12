// shop-products.js — storefront product catalog (Fase 2.1).
//
// A product is a sellable item: a sale price plus an estimated per-unit COGS
// (material + labor + electricity + wear). Margin is derived at read time via
// the shared computeMargin, so the catalog stays consistent with order-level
// profitability. file_hash optionally links a product to a model/print file
// so an order can later dispatch it to the print queue.

import { getDb } from './connection.js';
import { computeMargin } from './order-margins.js';

// Columns a client may set on create/update (id/timestamps are managed here).
const WRITABLE = [
  'sku', 'name', 'description', 'category', 'price', 'currency', 'file_hash', 'filename',
  'filament_type', 'filament_weight_g', 'print_time_min', 'material_cost',
  'labor_cost', 'electricity_cost', 'wear_cost', 'image_url', 'stock_qty', 'active',
];

/** Attach unit COGS and margin to a raw row. */
function _withMargin(row) {
  if (!row) return null;
  const cogs =
    (row.material_cost || 0) + (row.labor_cost || 0) +
    (row.electricity_cost || 0) + (row.wear_cost || 0);
  const m = computeMargin(row.price || 0, cogs);
  return { ...row, unit_cogs: m.cogs, margin: m.margin, margin_pct: m.margin_pct };
}

function _validate(data, { partial = false } = {}) {
  if (!partial || data.name !== undefined) {
    const name = String(data.name ?? '').trim();
    if (!name) throw new Error('Product name is required');
  }
  if (data.price !== undefined) {
    const price = Number(data.price);
    if (!Number.isFinite(price) || price < 0) throw new Error('Product price must be a number >= 0');
  }
}

/** Translate a UNIQUE(sku) violation into a clean, user-facing error. */
function _rethrowSku(e) {
  if (String(e.message || '').includes('idx_shop_products_sku') || /UNIQUE/i.test(e.message || '')) {
    return new Error('A product with this SKU already exists');
  }
  return e;
}

export function getShopProduct(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM shop_products WHERE id = ?').get(id);
  return _withMargin(row) || null;
}

export function createShopProduct(data = {}) {
  _validate(data);
  const db = getDb();
  const name = String(data.name).trim();
  const price = data.price !== undefined ? Number(data.price) : 0;
  const active = data.active === undefined ? 1 : (data.active ? 1 : 0);

  try {
    const result = db.prepare(
      `INSERT INTO shop_products
        (sku, name, description, category, price, currency, file_hash, filename, filament_type,
         filament_weight_g, print_time_min, material_cost, labor_cost, electricity_cost,
         wear_cost, image_url, stock_qty, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      data.sku ? String(data.sku).trim() : null,
      name,
      data.description || null,
      data.category || null,
      price,
      data.currency || 'NOK',
      data.file_hash || null,
      data.filename || null,
      data.filament_type || null,
      data.filament_weight_g ?? null,
      data.print_time_min ?? null,
      data.material_cost || 0,
      data.labor_cost || 0,
      data.electricity_cost || 0,
      data.wear_cost || 0,
      data.image_url || null,
      data.stock_qty ?? null,
      active,
    );
    return getShopProduct(Number(result.lastInsertRowid));
  } catch (e) {
    throw _rethrowSku(e);
  }
}

export function updateShopProduct(id, data = {}) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM shop_products WHERE id = ?').get(id);
  if (!existing) throw new Error('Product not found');
  _validate(data, { partial: true });

  const fields = [];
  const values = [];
  for (const key of WRITABLE) {
    if (data[key] === undefined) continue;
    let v = data[key];
    if (key === 'name') v = String(v).trim();
    else if (key === 'active') v = v ? 1 : 0;
    else if (key === 'sku') v = v ? String(v).trim() : null;
    fields.push(`${key} = ?`);
    values.push(v);
  }
  fields.push("updated_at = datetime('now')");
  values.push(id);

  try {
    db.prepare(`UPDATE shop_products SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  } catch (e) {
    throw _rethrowSku(e);
  }
  return getShopProduct(id);
}

export function setShopProductActive(id, active) {
  const db = getDb();
  const info = db
    .prepare("UPDATE shop_products SET active = ?, updated_at = datetime('now') WHERE id = ?")
    .run(active ? 1 : 0, id);
  if (info.changes === 0) throw new Error('Product not found');
  return getShopProduct(id);
}

export function deleteShopProduct(id) {
  const db = getDb();
  db.prepare('DELETE FROM shop_products WHERE id = ?').run(id);
}

export function listShopProducts({ active = null, category = null, search = null, limit = 200, offset = 0 } = {}) {
  const db = getDb();
  const where = [];
  const params = [];
  if (active !== null) { where.push('active = ?'); params.push(active ? 1 : 0); }
  if (category) { where.push('category = ?'); params.push(category); }
  if (search) { where.push('(name LIKE ? OR sku LIKE ? OR description LIKE ?)'); const q = `%${search}%`; params.push(q, q, q); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const rows = db
    .prepare(`SELECT * FROM shop_products ${whereSql} ORDER BY name COLLATE NOCASE LIMIT ? OFFSET ?`)
    .all(...params, limit, offset);
  return rows.map(_withMargin);
}
