// assets.js — Inventory Fase 4: warranties + link-based attachments for parts
// and printers (manuals, receipts, photos) — the personal-use side of the
// inventory (InvenTree/Homebox style, without hosting the files ourselves).

import { getDb } from './connection.js';

// ---- Warranties ----

export function getWarranties(entityType, entityId) {
  return getDb().prepare('SELECT * FROM warranties WHERE entity_type = ? AND entity_id = ? ORDER BY end_date').all(entityType, String(entityId));
}

export function addWarranty(w) {
  const r = getDb().prepare('INSERT INTO warranties (entity_type, entity_id, provider, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(w.entity_type, String(w.entity_id), w.provider ?? null, w.start_date ?? null, w.end_date ?? null, w.notes ?? null);
  return { id: Number(r.lastInsertRowid) };
}

export function deleteWarranty(id) {
  getDb().prepare('DELETE FROM warranties WHERE id = ?').run(id);
  return { ok: true };
}

/** Warranties whose end_date falls between today and today+withinDays. */
export function getExpiringWarranties(withinDays = 60) {
  return getDb().prepare(`SELECT * FROM warranties
    WHERE end_date IS NOT NULL AND date(end_date) >= date('now') AND date(end_date) <= date('now', ?)
    ORDER BY end_date`).all(`+${Number(withinDays)} days`);
}

// ---- Attachments (links) ----

export function getAttachments(entityType, entityId) {
  return getDb().prepare('SELECT * FROM attachments WHERE entity_type = ? AND entity_id = ? ORDER BY id DESC').all(entityType, String(entityId));
}

export function addAttachment(a) {
  if (!a.url) throw new Error('url required');
  const r = getDb().prepare('INSERT INTO attachments (entity_type, entity_id, kind, title, url) VALUES (?, ?, ?, ?, ?)')
    .run(a.entity_type, String(a.entity_id), a.kind ?? 'link', a.title ?? null, a.url);
  return { id: Number(r.lastInsertRowid) };
}

export function deleteAttachment(id) {
  getDb().prepare('DELETE FROM attachments WHERE id = ?').run(id);
  return { ok: true };
}
