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
function _matchSpool(printerId, amsUnit, material, color6) {
  const want = _baseMaterial(material);
  const cands = [];
  for (let tray = 0; tray < 4; tray++) {
    const sp = getSpoolBySlot(printerId, amsUnit, tray);
    if (sp) cands.push(sp);
  }
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
      .map(m => ({ m, w: parseFloat(m.weight) || 0, sp: _matchSpool(printer.id, m.amsId ?? 0, m.filamentType, _color6(m.sourceColor)) }))
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

// ── Automatic reconciliation ──────────────────────────────────────────────
// Runs in the background so the user never has to press the button: shortly
// after boot, every 30 min, and (debounced) right after a print is captured
// retroactively — exactly when a missed deduction is likely.
let _cloudProvider = null;   // () => BambuCloud
let _onDeduct = null;        // called with the result when something was deducted
let _debounce = null;

export function configureAutoReconcile(cloudFn, onDeduct) {
  _cloudProvider = cloudFn || null;
  _onDeduct = onDeduct || null;
}

async function _runAuto() {
  try {
    const cloud = _cloudProvider && _cloudProvider();
    if (!cloud || typeof cloud.isAuthenticated !== 'function' || !cloud.isAuthenticated()) return;
    const r = await reconcileCloudFilament(cloud, {});
    if (r.deducted.length && _onDeduct) { try { _onDeduct(r); } catch { /* ignore */ } }
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
