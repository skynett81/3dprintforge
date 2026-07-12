// stock-items.js — Inventory Fase 1: physical stock of a part at a location,
// plus a qty-based move ledger (stock_moves). Kept separate from the
// filament-specific stock_transactions (which is in grams, per spool).

import { getDb } from './connection.js';

function recordMove(db, m) {
  db.prepare(`INSERT INTO stock_moves (stock_item_id, part_id, delta, balance, reason, ref_type, ref_id, actor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    m.stock_item_id ?? null, m.part_id ?? null, m.delta, m.balance ?? null,
    m.reason ?? null, m.ref_type ?? null, m.ref_id ?? null, m.actor ?? null,
  );
}

const STOCK_SELECT = `
  SELECT si.*, p.name AS part_name, p.unit AS part_unit, p.ipn AS part_ipn, l.name AS location_name
  FROM stock_items si
  LEFT JOIN parts p ON p.id = si.part_id
  LEFT JOIN locations l ON l.id = si.location_id`;

export function getStockItems(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.part_id != null) { where += ' AND si.part_id = ?'; params.push(filters.part_id); }
  if (filters.location_id != null) { where += ' AND si.location_id = ?'; params.push(filters.location_id); }
  if (filters.status) { where += ' AND si.status = ?'; params.push(filters.status); }
  return getDb().prepare(STOCK_SELECT + where + ' ORDER BY si.created_at DESC, si.id DESC').all(...params);
}

export function getStockItem(id) {
  return getDb().prepare(STOCK_SELECT + ' WHERE si.id = ?').get(id) || null;
}

export function addStockItem(s) {
  const db = getDb();
  const qty = Number(s.quantity) || 0;
  const r = db.prepare(`
    INSERT INTO stock_items (part_id, location_id, quantity, batch, serial, status, purchase_price, supplier_id, po_line_id, expiry, qr_uid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    s.part_id, s.location_id ?? null, qty, s.batch ?? null, s.serial ?? null, s.status ?? 'ok',
    s.purchase_price ?? null, s.supplier_id ?? null, s.po_line_id ?? null, s.expiry ?? null, s.qr_uid ?? null,
  );
  const id = Number(r.lastInsertRowid);
  if (qty !== 0) recordMove(db, { stock_item_id: id, part_id: s.part_id, delta: qty, balance: qty, reason: s.reason || 'initial', actor: s.actor });
  return { id };
}

const STOCK_FIELDS = ['location_id', 'quantity', 'batch', 'serial', 'status', 'purchase_price', 'supplier_id', 'po_line_id', 'expiry', 'qr_uid'];

export function updateStockItem(id, s) {
  const cur = getDb().prepare('SELECT * FROM stock_items WHERE id = ?').get(id);
  if (!cur) return null;
  const sets = [];
  const params = [];
  for (const f of STOCK_FIELDS) if (s[f] !== undefined) { sets.push(`${f} = ?`); params.push(s[f]); }
  if (!sets.length) return { ok: true };
  sets.push("updated_at = datetime('now')");
  params.push(id);
  getDb().prepare(`UPDATE stock_items SET ${sets.join(', ')} WHERE id = ?`).run(...params);
  return { ok: true };
}

export function deleteStockItem(id) {
  getDb().prepare('DELETE FROM stock_items WHERE id = ?').run(id);
  return { ok: true };
}

// Change quantity by delta (clamped to >= 0) and append a move with the new
// running balance. Auto-flags depleted at 0 and restores to ok when refilled.
export function adjustStock(id, delta, reason, actor) {
  const db = getDb();
  const item = db.prepare('SELECT * FROM stock_items WHERE id = ?').get(id);
  if (!item) return null;
  const prev = item.quantity || 0;
  const next = Math.max(0, prev + (Number(delta) || 0));
  const applied = next - prev;
  let status = item.status;
  if (next === 0 && status === 'ok') status = 'depleted';
  else if (next > 0 && status === 'depleted') status = 'ok';
  db.prepare("UPDATE stock_items SET quantity = ?, status = ?, updated_at = datetime('now') WHERE id = ?").run(next, status, id);
  recordMove(db, { stock_item_id: id, part_id: item.part_id, delta: applied, balance: next, reason, actor });
  return { id, quantity: next, applied };
}

export function moveStock(id, toLocationId, actor) {
  const db = getDb();
  const item = db.prepare('SELECT * FROM stock_items WHERE id = ?').get(id);
  if (!item) return null;
  db.prepare("UPDATE stock_items SET location_id = ?, updated_at = datetime('now') WHERE id = ?").run(toLocationId ?? null, id);
  recordMove(db, { stock_item_id: id, part_id: item.part_id, delta: 0, balance: item.quantity, reason: 'relocate', ref_type: 'location', ref_id: toLocationId ?? null, actor });
  return { ok: true, location_id: toLocationId ?? null };
}

export function getStockMoves(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.stock_item_id != null) { where += ' AND stock_item_id = ?'; params.push(filters.stock_item_id); }
  if (filters.part_id != null) { where += ' AND part_id = ?'; params.push(filters.part_id); }
  const limit = filters.limit ? ' LIMIT ' + Number(filters.limit) : '';
  return getDb().prepare(`SELECT * FROM stock_moves${where} ORDER BY id DESC${limit}`).all(...params);
}
