// Reorder engine — procurement Phase 4 (InvenTree minimum stock / required parts).
//
// Compares on-hand stock + queued demand against a per-material minimum target
// (safety stock) to produce a "what to buy" shortfall list, and can draft
// purchase orders from it (grouped by the cheapest supplier per material).

import { getDb } from './connection.js';
import { addPurchaseOrder } from './purchase-orders.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:reorder');

const DEFAULT_SPOOL_G = 1000;

function _base(material) {
  const m = String(material || '').toUpperCase();
  for (const key of ['PETG', 'PLA', 'ABS', 'ASA', 'TPU', 'PVA', 'HIPS', 'PA', 'PC']) {
    if (m.includes(key)) return key;
  }
  return m;
}

// ---- Targets ----

export function getStockTargets() {
  return getDb().prepare('SELECT * FROM stock_targets ORDER BY material').all();
}

export function setStockTarget(material, minWeightG, notes) {
  const db = getDb();
  const mat = _base(material);
  if (!mat) throw new Error('material required');
  db.prepare(
    `INSERT INTO stock_targets (material, min_weight_g, notes) VALUES (?, ?, ?)
     ON CONFLICT(material) DO UPDATE SET min_weight_g = excluded.min_weight_g, notes = excluded.notes`
  ).run(mat, Number(minWeightG) || 0, notes || null);
  return db.prepare('SELECT * FROM stock_targets WHERE material = ?').get(mat);
}

export function deleteStockTarget(material) {
  getDb().prepare('DELETE FROM stock_targets WHERE material = ?').run(_base(material));
}

// ---- Demand ----

// Reserved filament for not-yet-finished queue items, grouped by base material.
// quantity = estimated_filament_g * outstanding copies.
export function getQueueDemandByMaterial() {
  const db = getDb();
  const rows = db.prepare(
    `SELECT required_material AS material, estimated_filament_g AS g, copies, copies_completed
     FROM queue_items
     WHERE status NOT IN ('completed','cancelled','failed')
       AND estimated_filament_g IS NOT NULL AND estimated_filament_g > 0`
  ).all();
  const out = {};
  for (const r of rows) {
    const mat = _base(r.material);
    if (!mat) continue;
    const outstanding = Math.max(0, (r.copies || 1) - (r.copies_completed || 0));
    out[mat] = (out[mat] || 0) + (r.g || 0) * outstanding;
  }
  return out;
}

// ---- Reorder report ----

// Cheapest supplier part per base material (joined to a profile of that
// material), for suggesting where to buy and at what price.
function _cheapestByMaterial() {
  const db = getDb();
  const rows = db.prepare(
    `SELECT sp.id AS supplier_part_id, sp.supplier_id, s.name AS supplier_name,
            sp.filament_profile_id, sp.price, sp.weight_g, sp.pack_qty, fp.material,
            CASE WHEN sp.weight_g > 0 AND sp.pack_qty > 0 AND sp.price IS NOT NULL
              THEN sp.price / (sp.weight_g * sp.pack_qty / 1000.0) END AS price_per_kg
     FROM supplier_parts sp
     JOIN filament_profiles fp ON sp.filament_profile_id = fp.id
     LEFT JOIN suppliers s ON sp.supplier_id = s.id
     WHERE sp.price IS NOT NULL`
  ).all();
  const best = {};
  for (const r of rows) {
    const mat = _base(r.material);
    if (!mat || r.price_per_kg == null) continue;
    if (!best[mat] || r.price_per_kg < best[mat].price_per_kg) best[mat] = r;
  }
  return best;
}

// On-hand stock (g) of active, non-empty spools grouped by base material.
function _onHandByMaterial() {
  const db = getDb();
  const rows = db.prepare(
    `SELECT fp.material AS material, COALESCE(SUM(s.remaining_weight_g), 0) AS g, COUNT(*) AS spools
     FROM spools s JOIN filament_profiles fp ON s.filament_profile_id = fp.id
     WHERE s.archived = 0 AND s.remaining_weight_g > 0
     GROUP BY fp.material`
  ).all();
  const out = {};
  for (const r of rows) {
    const mat = _base(r.material);
    if (!mat) continue;
    if (!out[mat]) out[mat] = { g: 0, spools: 0 };
    out[mat].g += r.g; out[mat].spools += r.spools;
  }
  return out;
}

// Full reorder report: every material that has a target, on-hand stock, or
// queued demand. shortfall = max(0, target + demand - onHand).
export function getReorderReport() {
  const targets = {};
  for (const t of getStockTargets()) targets[t.material] = t;
  const onHand = _onHandByMaterial();
  const demand = getQueueDemandByMaterial();
  const cheapest = _cheapestByMaterial();

  const materials = new Set([...Object.keys(targets), ...Object.keys(onHand), ...Object.keys(demand)]);
  const report = [];
  for (const mat of materials) {
    const target = targets[mat] ? targets[mat].min_weight_g : 0;
    const onHandG = onHand[mat] ? onHand[mat].g : 0;
    const demandG = demand[mat] || 0;
    const shortfall = Math.max(0, target + demandG - onHandG);
    const best = cheapest[mat] || null;
    const spoolG = best && best.weight_g ? best.weight_g : DEFAULT_SPOOL_G;
    const suggestedSpools = shortfall > 0 ? Math.ceil(shortfall / spoolG) : 0;
    report.push({
      material: mat,
      target_g: target,
      on_hand_g: Math.round(onHandG),
      queue_demand_g: Math.round(demandG),
      shortfall_g: Math.round(shortfall),
      spools_on_hand: onHand[mat] ? onHand[mat].spools : 0,
      suggested_spools: suggestedSpools,
      below_target: shortfall > 0,
      cheapest: best ? {
        supplier_part_id: best.supplier_part_id, supplier_id: best.supplier_id,
        supplier_name: best.supplier_name, filament_profile_id: best.filament_profile_id,
        price: best.price, weight_g: best.weight_g, price_per_kg: Math.round((best.price_per_kg || 0) * 100) / 100,
      } : null,
    });
  }
  // Shortfalls first (largest), then the rest alphabetically.
  report.sort((a, b) => (b.shortfall_g - a.shortfall_g) || a.material.localeCompare(b.material));
  return report;
}

// Draft purchase orders from the shortfall list. Materials that have a cheapest
// supplier part are grouped by supplier into one draft PO each; materials with
// no priced supplier part are returned as `unsourced` so the UI can flag them.
export function draftReorderPurchaseOrders(opts = {}) {
  const report = getReorderReport().filter(r => r.shortfall_g > 0 && r.suggested_spools > 0);
  const bySupplier = {};
  const unsourced = [];
  for (const r of report) {
    if (!r.cheapest || !r.cheapest.supplier_id) { unsourced.push(r.material); continue; }
    const sid = r.cheapest.supplier_id;
    (bySupplier[sid] = bySupplier[sid] || []).push(r);
  }
  const created = [];
  for (const sid of Object.keys(bySupplier)) {
    const lines = bySupplier[sid].map(r => ({
      supplier_part_id: r.cheapest.supplier_part_id,
      filament_profile_id: r.cheapest.filament_profile_id,
      quantity: r.suggested_spools,
      unit_price: r.cheapest.price,
      weight_g: r.cheapest.weight_g,
      description: `Reorder ${r.material} (${r.shortfall_g} g short)`,
    }));
    const po = addPurchaseOrder({
      supplier_id: Number(sid),
      reference: opts.reference || 'Auto-reorder',
      status: 'draft',
      order_date: opts.order_date || null,
      notes: 'Drafted from reorder shortfall',
      lines,
    });
    created.push(po);
  }
  return { created, unsourced };
}
