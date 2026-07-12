// bom.js — Inventory Fase 3: a part's bill of materials. Each line is a
// component part OR a filament profile, with quantity + waste. Cost rolls up
// from parts.cost (components) and filament price-per-gram (filament).

import { getDb } from './connection.js';

const BOM_SELECT = `
  SELECT bl.*,
    cp.name AS component_name, cp.unit AS component_unit, cp.cost AS component_cost,
    fp.name AS filament_name, fp.price AS filament_price, fp.spool_weight_g AS filament_spool_g
  FROM bom_lines bl
  LEFT JOIN parts cp ON cp.id = bl.component_part_id
  LEFT JOIN filament_profiles fp ON fp.id = bl.filament_profile_id`;

function lineCost(l) {
  const factor = 1 + (l.waste_pct || 0) / 100;
  if (l.component_part_id != null) return (l.component_cost || 0) * (l.quantity || 0) * factor;
  if (l.filament_profile_id != null && l.filament_spool_g) return ((l.filament_price || 0) / l.filament_spool_g) * (l.quantity || 0) * factor;
  return 0;
}

const round6 = (n) => Math.round(n * 1e6) / 1e6;

export function getBom(parentPartId) {
  const rows = getDb().prepare(BOM_SELECT + ' WHERE bl.parent_part_id = ? ORDER BY bl.id').all(parentPartId);
  return rows.map((l) => ({ ...l, line_cost: round6(lineCost(l)) }));
}

export function getBomCost(parentPartId) {
  return round6(getBom(parentPartId).reduce((a, l) => a + l.line_cost, 0));
}

export function addBomLine(l) {
  const r = getDb().prepare(`INSERT INTO bom_lines (parent_part_id, component_part_id, filament_profile_id, quantity, unit, waste_pct, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    l.parent_part_id, l.component_part_id ?? null, l.filament_profile_id ?? null,
    l.quantity ?? 1, l.unit ?? null, l.waste_pct ?? 0, l.notes ?? null);
  return { id: Number(r.lastInsertRowid) };
}

const BOM_FIELDS = ['component_part_id', 'filament_profile_id', 'quantity', 'unit', 'waste_pct', 'notes'];
export function updateBomLine(id, l) {
  const cur = getDb().prepare('SELECT * FROM bom_lines WHERE id = ?').get(id);
  if (!cur) return null;
  const sets = [];
  const params = [];
  for (const f of BOM_FIELDS) if (l[f] !== undefined) { sets.push(`${f} = ?`); params.push(l[f]); }
  if (!sets.length) return { ok: true };
  params.push(id);
  getDb().prepare(`UPDATE bom_lines SET ${sets.join(', ')} WHERE id = ?`).run(...params);
  return { ok: true };
}

export function deleteBomLine(id) {
  getDb().prepare('DELETE FROM bom_lines WHERE id = ?').run(id);
  return { ok: true };
}
