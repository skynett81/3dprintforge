// stocktake.js — Inventory Fase 4: physical audit. Snapshot expected stock,
// enter counted quantities, then apply to reconcile (adjust the differences).

import { getDb } from './connection.js';
import { adjustStock } from './stock-items.js';

export function createStocktake(o = {}) {
  const db = getDb();
  const r = db.prepare('INSERT INTO stocktakes (name, location_id) VALUES (?, ?)').run(o.name ?? null, o.location_id ?? null);
  const id = Number(r.lastInsertRowid);
  const items = o.location_id != null
    ? db.prepare('SELECT id, part_id, quantity FROM stock_items WHERE location_id = ?').all(o.location_id)
    : db.prepare('SELECT id, part_id, quantity FROM stock_items').all();
  const ins = db.prepare('INSERT INTO stocktake_lines (stocktake_id, stock_item_id, part_id, expected, counted) VALUES (?, ?, ?, ?, NULL)');
  for (const it of items) ins.run(id, it.id, it.part_id, it.quantity);
  return { id };
}

export function getStocktakes(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.status) { where += ' AND s.status = ?'; params.push(filters.status); }
  return getDb().prepare(`SELECT s.*, l.name AS location_name,
    (SELECT COUNT(*) FROM stocktake_lines sl WHERE sl.stocktake_id = s.id) AS line_count
    FROM stocktakes s LEFT JOIN locations l ON l.id = s.location_id${where}
    ORDER BY s.created_at DESC, s.id DESC`).all(...params);
}

export function getStocktake(id) {
  const db = getDb();
  const st = db.prepare('SELECT s.*, l.name AS location_name FROM stocktakes s LEFT JOIN locations l ON l.id = s.location_id WHERE s.id = ?').get(id);
  if (!st) return null;
  const lines = db.prepare(`SELECT sl.*, p.name AS part_name, p.unit AS part_unit, loc.name AS location_name
    FROM stocktake_lines sl
    LEFT JOIN parts p ON p.id = sl.part_id
    LEFT JOIN stock_items si ON si.id = sl.stock_item_id
    LEFT JOIN locations loc ON loc.id = si.location_id
    WHERE sl.stocktake_id = ? ORDER BY sl.id`).all(id);
  return { ...st, lines };
}

export function setStocktakeCount(lineId, counted) {
  getDb().prepare('UPDATE stocktake_lines SET counted = ? WHERE id = ?').run(counted == null ? null : Number(counted), lineId);
  return { ok: true };
}

export function applyStocktake(id, actor) {
  const db = getDb();
  const st = db.prepare('SELECT * FROM stocktakes WHERE id = ?').get(id);
  if (!st || st.status !== 'open') return null;
  const lines = db.prepare('SELECT * FROM stocktake_lines WHERE stocktake_id = ?').all(id);
  let adjusted = 0;
  for (const l of lines) {
    if (l.counted == null || l.stock_item_id == null) continue;
    const diff = l.counted - (l.expected ?? 0);
    if (Math.abs(diff) > 1e-9) { adjustStock(l.stock_item_id, diff, `stocktake #${id}`, actor); adjusted++; }
  }
  db.prepare("UPDATE stocktakes SET status='applied', applied_at=datetime('now') WHERE id=?").run(id);
  return { adjusted };
}

export function cancelStocktake(id) {
  const st = getDb().prepare('SELECT status FROM stocktakes WHERE id = ?').get(id);
  if (!st || st.status !== 'open') return null;
  getDb().prepare("UPDATE stocktakes SET status='cancelled' WHERE id=?").run(id);
  return { ok: true };
}
