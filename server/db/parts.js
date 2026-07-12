// parts.js — Inventory Fase 1: generic Part catalog + nested categories.
// A part is a catalog entry (what a thing IS); physical quantity lives in
// stock_items (see stock-items.js). Filament stays specialised in spools; a
// part can optionally link to a filament profile or a shop product.

import { getDb } from './connection.js';

// ---- Part categories ----

export function addPartCategory(c) {
  const r = getDb().prepare(
    `INSERT INTO part_categories (name, parent_id, icon, default_location_id, default_unit)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(c.name, c.parent_id ?? null, c.icon ?? null, c.default_location_id ?? null, c.default_unit ?? 'pcs');
  return { id: Number(r.lastInsertRowid) };
}

export function getPartCategories() {
  return getDb().prepare(`
    SELECT pc.*, (SELECT COUNT(*) FROM parts p WHERE p.category_id = pc.id) AS part_count
    FROM part_categories pc
    ORDER BY pc.name COLLATE NOCASE`).all();
}

export function getPartCategory(id) {
  return getDb().prepare('SELECT * FROM part_categories WHERE id = ?').get(id) || null;
}

export function updatePartCategory(id, c) {
  const cur = getPartCategory(id);
  if (!cur) return null;
  const m = { ...cur, ...c };
  getDb().prepare(
    `UPDATE part_categories SET name=?, parent_id=?, icon=?, default_location_id=?, default_unit=? WHERE id=?`,
  ).run(m.name, m.parent_id ?? null, m.icon ?? null, m.default_location_id ?? null, m.default_unit ?? 'pcs', id);
  return { ok: true };
}

export function deletePartCategory(id) {
  getDb().prepare('DELETE FROM part_categories WHERE id = ?').run(id);
  return { ok: true };
}

// ---- Parts ----

// Shared SELECT: catalog columns + category name + rolled-up physical stock.
const PART_SELECT = `
  SELECT p.*, pc.name AS category_name,
    COALESCE((SELECT SUM(si.quantity) FROM stock_items si WHERE si.part_id = p.id), 0) AS total_stock,
    (SELECT COUNT(*) FROM stock_items si WHERE si.part_id = p.id) AS stock_item_count
  FROM parts p
  LEFT JOIN part_categories pc ON pc.id = p.category_id`;

function withLow(row) {
  if (!row) return row;
  return { ...row, low: row.min_stock > 0 && row.total_stock < row.min_stock ? 1 : 0 };
}

export function getParts(filters = {}) {
  let where = filters.includeInactive ? ' WHERE 1=1' : ' WHERE p.is_active = 1';
  const params = [];
  if (filters.category_id != null) { where += ' AND p.category_id = ?'; params.push(filters.category_id); }
  if (filters.type) { where += ' AND p.type = ?'; params.push(filters.type); }
  if (filters.q) { where += ' AND (p.name LIKE ? OR p.ipn LIKE ?)'; params.push(`%${filters.q}%`, `%${filters.q}%`); }
  const sql = PART_SELECT + where + ' ORDER BY p.name COLLATE NOCASE';
  return getDb().prepare(sql).all(...params).map(withLow);
}

export function getPart(id) {
  return withLow(getDb().prepare(PART_SELECT + ' WHERE p.id = ?').get(id) || null);
}

export function addPart(p) {
  const r = getDb().prepare(`
    INSERT INTO parts (ipn, name, description, category_id, type, unit, min_stock, cost, image, notes, is_active, filament_profile_id, shop_product_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    p.ipn ?? null, p.name, p.description ?? null, p.category_id ?? null,
    p.type ?? 'component', p.unit ?? 'pcs', p.min_stock ?? 0, p.cost ?? null, p.image ?? null, p.notes ?? null,
    p.is_active === undefined ? 1 : (p.is_active ? 1 : 0),
    p.filament_profile_id ?? null, p.shop_product_id ?? null,
  );
  return { id: Number(r.lastInsertRowid) };
}

const PART_FIELDS = ['ipn', 'name', 'description', 'category_id', 'type', 'unit', 'min_stock', 'cost', 'image', 'notes', 'is_active', 'filament_profile_id', 'shop_product_id'];

export function updatePart(id, p) {
  const cur = getDb().prepare('SELECT * FROM parts WHERE id = ?').get(id);
  if (!cur) return null;
  const sets = [];
  const params = [];
  for (const f of PART_FIELDS) {
    if (p[f] !== undefined) {
      sets.push(`${f} = ?`);
      params.push(f === 'is_active' ? (p[f] ? 1 : 0) : p[f]);
    }
  }
  if (sets.length === 0) return { ok: true };
  sets.push("updated_at = datetime('now')");
  params.push(id);
  getDb().prepare(`UPDATE parts SET ${sets.join(', ')} WHERE id = ?`).run(...params);
  return { ok: true };
}

export function deletePart(id) {
  getDb().prepare('DELETE FROM parts WHERE id = ?').run(id);
  return { ok: true };
}

export function getPartStock(partId) {
  const r = getDb().prepare('SELECT COALESCE(SUM(quantity), 0) AS total FROM stock_items WHERE part_id = ?').get(partId);
  return r ? r.total : 0;
}
