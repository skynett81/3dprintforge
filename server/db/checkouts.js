// checkouts.js — asset check-out / custody (Snipe-IT style). Track who holds a
// tool / piece of equipment, with an optional due date and return. This is
// custody, not consumption — it does not change stock quantities.

import { getDb } from './connection.js';

const SELECT = `
  SELECT c.*, l.name AS location_name,
    CASE c.entity_type WHEN 'part' THEN (SELECT name FROM parts WHERE id = CAST(c.entity_id AS INTEGER)) ELSE NULL END AS entity_name
  FROM asset_checkouts c
  LEFT JOIN locations l ON l.id = c.location_id`;

export function checkOut(o) {
  if (!o || !o.holder) throw new Error('holder required');
  if (!o.entity_type || o.entity_id == null) throw new Error('entity required');
  const r = getDb().prepare(
    `INSERT INTO asset_checkouts (entity_type, entity_id, holder, quantity, location_id, due_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(o.entity_type, String(o.entity_id), o.holder, o.quantity ?? 1, o.location_id ?? null, o.due_at ?? null, o.notes ?? null);
  return { id: Number(r.lastInsertRowid) };
}

export function checkIn(id, notes) {
  const db = getDb();
  const c = db.prepare('SELECT status FROM asset_checkouts WHERE id = ?').get(id);
  if (!c || c.status === 'returned') return null;
  db.prepare("UPDATE asset_checkouts SET status = 'returned', checked_in_at = datetime('now'), notes = COALESCE(?, notes) WHERE id = ?").run(notes ?? null, id);
  return { ok: true };
}

export function getCheckouts(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.status) { where += ' AND c.status = ?'; params.push(filters.status); }
  if (filters.entity_type) { where += ' AND c.entity_type = ?'; params.push(filters.entity_type); }
  if (filters.entity_id != null) { where += ' AND c.entity_id = ?'; params.push(String(filters.entity_id)); }
  return getDb().prepare(SELECT + where + ' ORDER BY c.checked_out_at DESC, c.id DESC').all(...params);
}

export function getActiveCheckout(entityType, entityId) {
  return getDb().prepare(SELECT + " WHERE c.entity_type = ? AND c.entity_id = ? AND c.status = 'out' ORDER BY c.id DESC LIMIT 1").get(entityType, String(entityId)) || null;
}

export function getOverdueCheckouts() {
  return getDb().prepare(SELECT + " WHERE c.status = 'out' AND c.due_at IS NOT NULL AND date(c.due_at) < date('now') ORDER BY c.due_at").all();
}
