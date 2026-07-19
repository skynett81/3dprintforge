// reservations.js — the build shopping list (print-vault idea). Open build
// orders (planned / in_progress) reserve their BOM component stock; this
// aggregates the components whose reserved demand exceeds what is on hand, so
// you know exactly what to buy to fulfil the planned builds.

import { getDb } from './connection.js';

export function getBuildShoppingList() {
  const rows = getDb().prepare(`
    SELECT p.id AS part_id, p.name AS part_name, p.unit,
      SUM(bl.quantity * bo.quantity * (1 + COALESCE(bl.waste_pct, 0) / 100.0)) AS needed,
      COALESCE((SELECT SUM(si.quantity) FROM stock_items si WHERE si.part_id = p.id), 0) AS on_hand
    FROM build_orders bo
    JOIN bom_lines bl ON bl.parent_part_id = bo.part_id
    JOIN parts p ON p.id = bl.component_part_id
    WHERE bo.status IN ('planned', 'in_progress')
    GROUP BY p.id
    HAVING needed > on_hand
    ORDER BY p.name COLLATE NOCASE`).all();
  return rows.map((r) => ({
    ...r,
    needed: Math.round(r.needed * 1e4) / 1e4,
    shortfall: Math.round((r.needed - r.on_hand) * 1e4) / 1e4,
  }));
}
