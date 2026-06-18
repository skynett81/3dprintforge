// bambu-cloud-reconcile.js
// Reconcile filament usage from Bambu Lab Cloud for prints the server missed —
// i.e. prints that finished while the server was down, so the live
// PRINTING->FINISH deduction never ran and the spool stayed too high.
//
// The cloud records each completed print's total weight plus a per-slot AMS
// mapping (filament type + colour + grams). We map each mapping back to the
// linked inventory spool and deduct it exactly once. Idempotent via a
// 'cloud:<taskId>' source tag in spool_usage_log, and guarded against
// double-deducting prints that were already tracked live.

import { getPrinters } from './db/printers.js';
import { getHistory, addHistory } from './db/history.js';
import { useSpoolWeight, getSpoolBySlot } from './db/spools.js';
import { getDb } from './db/connection.js';
import { createLogger } from './logger.js';

const log = createLogger('cloud-reconcile');

function _baseMaterial(m) {
  const u = String(m || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (u.startsWith('PLA')) return 'PLA';
  if (u.startsWith('PETG') || u.startsWith('PET')) return 'PETG';
  if (u.startsWith('ABS')) return 'ABS';
  if (u.startsWith('ASA')) return 'ASA';
  if (u.startsWith('TPU')) return 'TPU';
  if (u.startsWith('PC')) return 'PC';
  if (u.startsWith('PA') || u.startsWith('NYLON')) return 'PA';
  return u;
}
function _color6(c) { return String(c || '').replace(/^#/, '').toUpperCase().slice(0, 6); }
function _ms(t) {
  if (t == null) return NaN;
  return Date.parse(typeof t === 'number' ? new Date(t * 1000).toISOString() : t);
}

// Only completed prints carry meaningful filament usage.
function _isCompleted(task) {
  if (task.status == null) return false;
  if (task.failedType && task.failedType > 0) return false;
  if (task.status === 0) return false;
  return task.status >= 1 && !!task.endTime;
}

// Match a cloud AMS mapping (the slotId is unreliable, so ignore it) to the
// linked inventory spool by AMS unit + base material, refined by colour.
export function _matchSpool(printerId, amsUnit, slotId, material, color6) {
  // Ground truth first: the cloud tells us the exact AMS slot used (amsId =
  // unit, slotId = tray). If a spool is linked to that slot, credit it
  // directly. The previous code ignored slotId and just took the first spool
  // in the unit that matched the material — so every PLA job was charged to
  // tray A1 and a second slot (e.g. A2) of the same material was never
  // deducted. Honour the slot before falling back to colour/material guessing.
  if (slotId != null && Number.isFinite(Number(slotId))) {
    const exact = getSpoolBySlot(printerId, amsUnit, Number(slotId));
    if (exact) return exact;
  }
  const want = _baseMaterial(material);
  const cands = [];
  for (let tray = 0; tray < 4; tray++) {
    const sp = getSpoolBySlot(printerId, amsUnit, tray);
    if (sp) cands.push(sp);
  }
  // The cloud reports amsId/slotId 0 even for external-spool prints, so also
  // consider the external spool (ams_unit 255) when matching.
  const ext = getSpoolBySlot(printerId, 255, 0);
  if (ext) cands.push(ext);
  return cands.find(sp => _baseMaterial(sp.material) === want && _color6(sp.color_hex) === color6)
    || cands.find(sp => _baseMaterial(sp.material) === want)
    || null;
}

function _alreadyReconciled(taskId) {
  try {
    return !!getDb().prepare('SELECT 1 FROM spool_usage_log WHERE source = ? LIMIT 1').get('cloud:' + taskId);
  } catch { return false; }
}

// A print is "already tracked" if a history row with the same filename within a
// generous window already carries a filament weight (i.e. the live deduction
// ran). Prevents double-deducting normal prints.
function _trackedRow(printerId, filename, startMs, endMs) {
  const rows = getHistory(400, 0, printerId);
  const lo = (isNaN(startMs) ? -Infinity : startMs) - 12 * 3600e3;
  const hi = (isNaN(endMs) ? Infinity : endMs) + 24 * 3600e3;
  return rows.find(h => {
    if (h.filename !== filename) return false;
    const t = _ms(h.finished_at) || _ms(h.started_at);
    return isNaN(t) ? true : (t >= lo && t <= hi);
  }) || null;
}

/**
 * @param {object} cloud  authenticated BambuCloud instance (getTaskHistory()).
 * @param {{dryRun?:boolean}} opts
 * @returns {Promise<{scanned:number, deducted:Array, skipped:Array, unmatched:Array}>}
 */
export async function reconcileCloudFilament(cloud, opts = {}) {
  const dryRun = !!opts.dryRun;
  const tasks = await cloud.getTaskHistory();
  const bySerial = {};
  for (const p of getPrinters()) { if (p.serial) bySerial[p.serial] = p; }

  const out = { scanned: 0, deducted: [], skipped: [], unmatched: [] };

  for (const task of tasks) {
    if (!_isCompleted(task)) continue;
    const maps = task.amsDetailMapping || [];
    if (!maps.length || !task.weight) continue;
    const printer = bySerial[task.deviceId || task.dev_id || ''];
    if (!printer) continue;
    out.scanned++;

    const taskId = String(task.id || (task.startTime + '|' + task.title));
    const title = task.title || task.designTitle || 'Unknown';
    if (_alreadyReconciled(taskId)) { out.skipped.push({ title, reason: 'already reconciled' }); continue; }

    const startMs = _ms(task.startTime);
    const endMs = _ms(task.endTime) || startMs;
    const tracked = _trackedRow(printer.id, title, startMs, endMs);
    if (tracked && tracked.filament_used_g > 0) { out.skipped.push({ title, reason: 'already tracked' }); continue; }

    // Which mappings map to a known spool?
    const planned = maps
      .map(m => ({ m, w: parseFloat(m.weight) || 0, sp: _matchSpool(printer.id, m.amsId ?? 0, m.slotId, m.filamentType, _color6(m.sourceColor)) }))
      .filter(x => x.w > 0);
    const matched = planned.filter(x => x.sp);
    const noMatch = planned.filter(x => !x.sp);
    noMatch.forEach(x => out.unmatched.push({ title, type: x.m.filamentType, color: _color6(x.m.sourceColor), weight: Math.round(x.w * 10) / 10 }));

    // Nothing maps to a spool — leave it untouched so a later run (after the
    // user links the right spool) can still pick it up.
    if (!matched.length) continue;

    let phid = tracked ? tracked.id : null;
    if (!dryRun) {
      if (!tracked) {
        try {
          phid = addHistory({
            printer_id: printer.id,
            started_at: new Date(isNaN(startMs) ? Date.now() : startMs).toISOString(),
            finished_at: new Date(isNaN(endMs) ? Date.now() : endMs).toISOString(),
            filename: title, status: 'completed',
            duration_seconds: task.costTime || null,
            filament_used_g: parseFloat(task.weight) || null,
            filament_type: maps[0]?.filamentType || null,
            filament_color: _color6(maps[0]?.sourceColor) || null,
            notes: 'Imported from Bambu Cloud (reconcile)',
          });
        } catch (e) { log.warn('reconcile: addHistory failed for ' + title + ': ' + e.message); }
      } else if (!(tracked.filament_used_g > 0)) {
        try {
          getDb().prepare("UPDATE print_history SET filament_used_g = ?, filament_type = COALESCE(NULLIF(filament_type, ''), ?) WHERE id = ?")
            .run(parseFloat(task.weight) || null, maps[0]?.filamentType || null, tracked.id);
        } catch (e) { /* non-fatal */ }
      }
    }

    for (const x of matched) {
      if (!dryRun) {
        try { useSpoolWeight(x.sp.id, x.w, 'cloud:' + taskId, phid, printer.id); }
        catch (e) { log.warn('reconcile: deduct failed for spool ' + x.sp.id + ': ' + e.message); continue; }
      }
      out.deducted.push({ title, spoolId: x.sp.id, type: x.m.filamentType, weight: Math.round(x.w * 10) / 10 });
    }
  }

  if (!dryRun && out.deducted.length) {
    log.info(`Reconciled ${out.deducted.length} filament deduction(s) from Bambu Cloud`);
  }
  return out;
}

// ── Recompute loaded-spool weights from cloud per-slot history ─────────────
// For a spool that is still loaded in an AMS slot, its true remaining weight is
//   initial − (sum of cloud per-slot consumption for that exact slot since the
//   spool was created).
// A loaded spool was created when it went into the slot and has stayed there,
// so its own creation date bounds the prints that belong to it — sidestepping
// the fact that we don't record historical slot occupancy. This rebuilds a
// correct baseline after a mis-attribution corrupted the running tally, using
// the cloud's authoritative per-print slotId+weight. Mass-honest: it never
// invents filament, it recomputes from ground truth. ?dryRun previews.
export async function recomputeLoadedSpoolWeights(cloud, { dryRun = false, autoHeal = false } = {}) {
  const out = { updated: [], skipped: [], dryRun };
  try {
    if (!cloud || typeof cloud.isAuthenticated !== 'function' || !cloud.isAuthenticated()) return out;
    const tasks = await cloud.getTaskHistory();
    const printers = getPrinters();
    const db = getDb();
    const spools = db.prepare(
      `SELECT id, printer_id, ams_unit, ams_tray, initial_weight_g, remaining_weight_g, created_at
       FROM spools WHERE archived = 0 AND ams_unit IS NOT NULL AND ams_tray IS NOT NULL`
    ).all();

    for (const sp of spools) {
      const printer = printers.find(p => p.id === sp.printer_id);
      if (!printer || !printer.serial || !sp.initial_weight_g) continue;
      const createdMs = _ms(sp.created_at);
      let used = 0, matchedPrints = 0;
      for (const task of tasks) {
        if (!_isCompleted(task)) continue;
        if ((task.deviceId || task.dev_id || '') !== printer.serial) continue;
        const endMs = _ms(task.endTime) || _ms(task.startTime);
        if (Number.isFinite(createdMs) && Number.isFinite(endMs) && endMs < createdMs) continue;
        let taskSlotG = 0;
        for (const m of (task.amsDetailMapping || [])) {
          if ((m.amsId ?? 0) === sp.ams_unit && Number(m.slotId) === sp.ams_tray) taskSlotG += parseFloat(m.weight) || 0;
        }
        if (taskSlotG > 0) { used += taskSlotG; matchedPrints++; }
      }
      // Only correct spools we have positive cloud evidence for. With zero
      // matched prints we can't tell "genuinely full" from "cloud history
      // window missed older prints" — resetting to full could over-report a
      // used spool, so leave those untouched and just report them.
      if (matchedPrints === 0) {
        out.skipped.push({ spoolId: sp.id, slot: sp.ams_unit + ':' + sp.ams_tray, currentG: Math.round((sp.remaining_weight_g || 0) * 10) / 10, reason: 'no cloud prints on this slot since the spool was created' });
        continue;
      }
      const correct = Math.max(0, Math.round((sp.initial_weight_g - used) * 10) / 10);
      const diff = Math.round((correct - (sp.remaining_weight_g || 0)) * 10) / 10;
      // Manual run: correct any drift ≥ 5 g, either direction. Automatic heal:
      // only repair GROSS UNDER-reporting (spool drained far too low because a
      // mis-attribution charged it for other slots' filament) — upward-only and
      // ≥ 100 g, so it can never undo a legitimate in-flight live deduction.
      if (autoHeal ? diff < 100 : Math.abs(diff) < 5) continue;
      if (!dryRun) {
        db.prepare('UPDATE spools SET remaining_weight_g = ?, used_weight_g = MAX(0, initial_weight_g - ?), last_used_at = datetime(\'now\') WHERE id = ?').run(correct, correct, sp.id);
        try {
          db.prepare(`INSERT INTO stock_transactions (spool_id, txn_type, delta_g, balance_g, reason, ref_type)
            VALUES (?, 'adjust', ?, ?, 'Recomputed from Bambu Cloud per-slot history', 'recompute')`).run(sp.id, diff, correct);
        } catch { /* ledger best-effort */ }
      }
      out.updated.push({ spoolId: sp.id, slot: sp.ams_unit + ':' + sp.ams_tray, oldG: Math.round((sp.remaining_weight_g || 0) * 10) / 10, newG: correct, cloudUsedG: Math.round(used * 10) / 10, prints: matchedPrints });
    }
    if (!dryRun && out.updated.length) log.info(`Recomputed ${out.updated.length} loaded-spool weight(s) from Bambu Cloud`);
  } catch (e) { log.warn('Loaded-spool recompute failed: ' + e.message); }
  return out;
}

// ── Automatic reconciliation ──────────────────────────────────────────────
// Runs in the background so the user never has to press the button: shortly
// after boot, every 30 min, and (debounced) right after a print is captured
// retroactively — exactly when a missed deduction is likely.
let _cloudProvider = null;   // () => BambuCloud
let _onDeduct = null;        // called with the result when something was deducted
let _debounce = null;
let _didBootHeal = false;    // run the gross-corruption recompute once per boot

export function configureAutoReconcile(cloudFn, onDeduct) {
  _cloudProvider = cloudFn || null;
  _onDeduct = onDeduct || null;
}

async function _runAuto() {
  try {
    const cloud = _cloudProvider && _cloudProvider();
    if (!cloud || typeof cloud.isAuthenticated !== 'function' || !cloud.isAuthenticated()) return;
    const r = await reconcileCloudFilament(cloud, {});
    // Once per boot, self-heal any spool grossly under-reported by a past
    // mis-attribution (e.g. a slot drained to 0 that the cloud says still has
    // filament). Upward-only + ≥100 g, so it never fights live deductions.
    let healed = { updated: [] };
    if (!_didBootHeal) { _didBootHeal = true; healed = await recomputeLoadedSpoolWeights(cloud, { autoHeal: true }); }
    if ((r.deducted.length || healed.updated.length) && _onDeduct) { try { _onDeduct(r); } catch { /* ignore */ } }
  } catch (e) { log.warn('Auto-reconcile failed: ' + e.message); }
}

// Debounced — batches a burst of retroactive captures into one cloud fetch.
export function triggerAutoReconcile(delayMs = 30000) {
  if (!_cloudProvider || _debounce) return;
  _debounce = setTimeout(() => { _debounce = null; _runAuto(); }, delayMs);
}

export function startAutoReconcile() {
  setTimeout(() => triggerAutoReconcile(3000), 25000);          // ~25s after boot
  setInterval(() => triggerAutoReconcile(0), 30 * 60 * 1000);   // every 30 min
}
