// Suppliers & Supplier Parts — procurement Phase 1 (InvenTree-inspired).
//
// A SUPPLIER is a shop you buy from (Amazon, MatterHackers, a local store) —
// distinct from the manufacturer/brand which lives in `vendors`.
// A SUPPLIER PART is one purchasable SKU: a filament_profile sold by a supplier
// at a specific pack weight + price. This powers cross-shop price comparison
// (price-per-kg) and 1-click reorder links.

import { getDb } from './connection.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:suppliers');

// ---- Suppliers ----

export function getSuppliers(filters = {}) {
  const db = getDb();
  let where = ' WHERE 1=1';
  const params = [];
  if (!filters.includeArchived) where += ' AND archived = 0';
  // Each supplier carries a count of its parts for the list view.
  const baseSql = `FROM suppliers s` + where;
  const sql = `SELECT s.*, (SELECT COUNT(*) FROM supplier_parts sp WHERE sp.supplier_id = s.id) AS part_count ${baseSql} ORDER BY s.name`;
  if (filters.limit) {
    const total = db.prepare(`SELECT COUNT(*) AS total ${baseSql}`).get(...params).total;
    const rows = db.prepare(sql + ' LIMIT ? OFFSET ?').all(...params, filters.limit, filters.offset || 0);
    return { rows, total };
  }
  return db.prepare(sql).all(...params);
}

export function getSupplier(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id) || null;
}

export function addSupplier(s) {
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO suppliers (name, website, contact, currency, lead_time_days, notes, archived)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    s.name,
    s.website || null,
    s.contact || null,
    s.currency || 'USD',
    s.lead_time_days != null ? s.lead_time_days : null,
    s.notes || null,
    s.archived ? 1 : 0
  );
  return { id: Number(result.lastInsertRowid), ...s };
}

export function updateSupplier(id, s) {
  const db = getDb();
  const existing = getSupplier(id);
  if (!existing) return null;
  const merged = { ...existing, ...s };
  db.prepare(
    `UPDATE suppliers SET name=?, website=?, contact=?, currency=?, lead_time_days=?, notes=?, archived=? WHERE id=?`
  ).run(
    merged.name,
    merged.website || null,
    merged.contact || null,
    merged.currency || 'USD',
    merged.lead_time_days != null ? merged.lead_time_days : null,
    merged.notes || null,
    merged.archived ? 1 : 0,
    id
  );
  return getSupplier(id);
}

export function deleteSupplier(id) {
  const db = getDb();
  // ON DELETE CASCADE removes the supplier's parts too.
  db.prepare('DELETE FROM suppliers WHERE id = ?').run(id);
}

// ---- Supplier Parts ----

const PART_SELECT = `SELECT sp.*, s.name AS supplier_name, s.lead_time_days AS supplier_lead_time_days,
  fp.name AS profile_name, fp.material AS profile_material, fp.color_name AS profile_color_name,
  CASE WHEN sp.weight_g > 0 AND sp.pack_qty > 0 AND sp.price IS NOT NULL
    THEN ROUND(sp.price / (sp.weight_g * sp.pack_qty / 1000.0), 2) END AS price_per_kg
  FROM supplier_parts sp
  LEFT JOIN suppliers s ON sp.supplier_id = s.id
  LEFT JOIN filament_profiles fp ON sp.filament_profile_id = fp.id`;

export function getSupplierParts(filters = {}) {
  const db = getDb();
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.supplier_id) { where += ' AND sp.supplier_id = ?'; params.push(filters.supplier_id); }
  if (filters.filament_profile_id) { where += ' AND sp.filament_profile_id = ?'; params.push(filters.filament_profile_id); }
  return db.prepare(`${PART_SELECT}${where} ORDER BY price_per_kg IS NULL, price_per_kg, s.name`).all(...params);
}

export function getSupplierPart(id) {
  const db = getDb();
  return db.prepare(`${PART_SELECT} WHERE sp.id = ?`).get(id) || null;
}

export function addSupplierPart(p) {
  const db = getDb();
  if (!p.supplier_id) throw new Error('supplier_id is required');
  const result = db.prepare(
    `INSERT INTO supplier_parts
       (supplier_id, filament_profile_id, sku, product_url, price, currency, weight_g, pack_qty, in_stock, last_checked_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    p.supplier_id,
    p.filament_profile_id != null ? p.filament_profile_id : null,
    p.sku || null,
    p.product_url || null,
    p.price != null ? p.price : null,
    p.currency || 'USD',
    p.weight_g != null ? p.weight_g : 1000,
    p.pack_qty != null ? p.pack_qty : 1,
    p.in_stock == null ? null : (p.in_stock ? 1 : 0),
    p.last_checked_at || null,
    p.notes || null
  );
  return getSupplierPart(Number(result.lastInsertRowid));
}

export function updateSupplierPart(id, p) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM supplier_parts WHERE id = ?').get(id);
  if (!existing) return null;
  const m = { ...existing, ...p };
  db.prepare(
    `UPDATE supplier_parts SET filament_profile_id=?, sku=?, product_url=?, price=?, currency=?,
       weight_g=?, pack_qty=?, in_stock=?, last_checked_at=?, notes=? WHERE id=?`
  ).run(
    m.filament_profile_id != null ? m.filament_profile_id : null,
    m.sku || null,
    m.product_url || null,
    m.price != null ? m.price : null,
    m.currency || 'USD',
    m.weight_g != null ? m.weight_g : 1000,
    m.pack_qty != null ? m.pack_qty : 1,
    m.in_stock == null ? null : (m.in_stock ? 1 : 0),
    m.last_checked_at || null,
    m.notes || null,
    id
  );
  return getSupplierPart(id);
}

export function deleteSupplierPart(id) {
  const db = getDb();
  db.prepare('DELETE FROM supplier_parts WHERE id = ?').run(id);
}

// ---- Price comparison ----
// For a given filament profile, list every supplier part sorted cheapest-first
// by price-per-kg so the UI can show "cheapest PLA Basic Black across my shops".
export function getPriceComparison(filamentProfileId) {
  return getSupplierParts({ filament_profile_id: filamentProfileId })
    .filter(p => p.price_per_kg != null);
}
