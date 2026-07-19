// builds.js — Inventory Fase 3: build orders. Completing a build consumes its
// product's BOM component stock (FIFO, clamped, logged as moves) and produces
// finished-good stock for the product part. Filament BOM lines are
// informational here — spool consumption stays with print-tracker.

import { getDb } from './connection.js';
import { getBom } from './bom.js';
import { addStockItem, consumePartStock } from './stock-items.js';

const BUILD_SELECT = `SELECT bo.*, p.name AS part_name, p.unit AS part_unit FROM build_orders bo LEFT JOIN parts p ON p.id = bo.part_id`;

export function getBuilds(filters = {}) {
  let where = ' WHERE 1=1';
  const params = [];
  if (filters.status) { where += ' AND bo.status = ?'; params.push(filters.status); }
  if (filters.part_id != null) { where += ' AND bo.part_id = ?'; params.push(filters.part_id); }
  return getDb().prepare(BUILD_SELECT + where + ' ORDER BY bo.created_at DESC, bo.id DESC').all(...params);
}

export function getBuild(id) {
  return getDb().prepare(BUILD_SELECT + ' WHERE bo.id = ?').get(id) || null;
}

export function addBuild(b) {
  const r = getDb().prepare(`INSERT INTO build_orders (part_id, quantity, status, printer_id, location_id, notes)
    VALUES (?, ?, ?, ?, ?, ?)`).run(
    b.part_id, b.quantity ?? 1, b.status ?? 'planned', b.printer_id ?? null, b.location_id ?? null, b.notes ?? null);
  return { id: Number(r.lastInsertRowid) };
}

const BUILD_FIELDS = ['quantity', 'status', 'printer_id', 'location_id', 'notes', 'started_at', 'completed_at'];
export function updateBuild(id, b) {
  const cur = getDb().prepare('SELECT * FROM build_orders WHERE id = ?').get(id);
  if (!cur) return null;
  const sets = [];
  const params = [];
  for (const f of BUILD_FIELDS) if (b[f] !== undefined) { sets.push(`${f} = ?`); params.push(b[f]); }
  if (!sets.length) return { ok: true };
  params.push(id);
  getDb().prepare(`UPDATE build_orders SET ${sets.join(', ')} WHERE id = ?`).run(...params);
  return { ok: true };
}

export function cancelBuild(id) {
  const bo = getBuild(id);
  if (!bo || bo.status === 'completed') return null;
  getDb().prepare("UPDATE build_orders SET status = 'cancelled' WHERE id = ?").run(id);
  return { ok: true };
}

export function completeBuild(id, actor) {
  const db = getDb();
  const bo = getBuild(id);
  if (!bo) return null;
  if (bo.status === 'completed') return { already: true };
  const buildQty = bo.quantity || 1;
  const consumed = [];
  const shortages = [];

  for (const line of getBom(bo.part_id)) {
    if (line.component_part_id == null) continue; // filament: informational only
    const need = (line.quantity || 0) * buildQty * (1 + (line.waste_pct || 0) / 100);
    if (need <= 0) continue;
    const r = consumePartStock(line.component_part_id, need, `build #${id}`, actor);
    consumed.push({ part_id: line.component_part_id, part_name: line.component_name, needed: need, consumed: r.consumed });
    if (r.shortage > 1e-9) shortages.push({ part_id: line.component_part_id, part_name: line.component_name, needed: need, available: r.consumed });
  }

  // Produce the finished goods as a new stock item for the product part.
  addStockItem({ part_id: bo.part_id, location_id: bo.location_id ?? undefined, quantity: buildQty, reason: `build #${id} output`, actor });
  db.prepare("UPDATE build_orders SET status = 'completed', completed_at = datetime('now') WHERE id = ?").run(id);
  return { consumed, produced: buildQty, shortages };
}
