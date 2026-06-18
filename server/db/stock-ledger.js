// Stock Ledger — procurement Phase 3 (InvenTree StockItemTracking).
//
// A unified, immutable view of every stock movement. New explicit changes are
// written to `stock_transactions` (signed weight delta + resulting balance +
// reason + reference). The read-model also folds in the three legacy logs —
// spool_usage_log (print consumption), spool_events (lifecycle) and
// spool_checkout_log (location moves) — so existing spools get a full timeline
// without any backfill. Each entry is normalised to one shape:
//   { source, type, delta_g, balance_g, reason, ref_type, ref_id,
//     location_from, location_to, actor, timestamp }

import { getDb } from './connection.js';
import { addSpoolEvent } from './spools.js';
import { createLogger } from '../logger.js';

const log = createLogger('db:stock-ledger');

// ---- Canonical ledger writes ----

export function recordStockTransaction(txn = {}) {
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO stock_transactions (spool_id, txn_type, delta_g, balance_g, reason, ref_type, ref_id, actor)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    txn.spool_id != null ? txn.spool_id : null,
    txn.txn_type || 'adjust',
    txn.delta_g != null ? txn.delta_g : null,
    txn.balance_g != null ? txn.balance_g : null,
    txn.reason || null,
    txn.ref_type || null,
    txn.ref_id != null ? txn.ref_id : null,
    txn.actor || null
  );
  return Number(result.lastInsertRowid);
}

// Manual stock correction: set a spool's remaining weight to an absolute value
// (or apply a signed delta), updating the spool and recording an audited
// transaction. This is InvenTree's "count / adjust stock" with a reason.
export function adjustSpoolStock(spoolId, opts = {}) {
  const db = getDb();
  const spool = db.prepare('SELECT id, remaining_weight_g, initial_weight_g FROM spools WHERE id = ?').get(spoolId);
  if (!spool) throw new Error('spool not found');
  const current = spool.remaining_weight_g != null ? spool.remaining_weight_g : (spool.initial_weight_g || 0);
  let next;
  if (opts.new_remaining_g != null) next = Number(opts.new_remaining_g);
  else if (opts.delta_g != null) next = current + Number(opts.delta_g);
  else throw new Error('new_remaining_g or delta_g required');
  if (!isFinite(next) || next < 0) throw new Error('resulting weight must be a non-negative number');
  const delta = Math.round((next - current) * 100) / 100;
  db.prepare('UPDATE spools SET remaining_weight_g = ? WHERE id = ?').run(next, spoolId);
  const txnId = recordStockTransaction({
    spool_id: spoolId,
    txn_type: 'adjust',
    delta_g: delta,
    balance_g: next,
    reason: opts.reason || null,
    ref_type: 'manual',
    actor: opts.actor || null,
  });
  try { addSpoolEvent(spoolId, 'adjusted', JSON.stringify({ from: current, to: next, reason: opts.reason || null }), opts.actor || null); }
  catch (e) { log.warn('Failed to log adjust event: ' + e.message); }
  return { id: txnId, spool_id: spoolId, delta_g: delta, balance_g: next };
}

// ---- Unified read-model ----

function _normCanon(r) {
  return {
    source: 'transaction', type: r.txn_type, delta_g: r.delta_g, balance_g: r.balance_g,
    reason: r.reason, ref_type: r.ref_type, ref_id: r.ref_id,
    location_from: null, location_to: null, actor: r.actor, timestamp: r.created_at,
  };
}
function _normUsage(r) {
  return {
    source: 'usage', type: 'consume', delta_g: r.used_weight_g != null ? -Math.abs(r.used_weight_g) : null, balance_g: null,
    reason: r.source === 'manual' ? 'Manual usage' : 'Print', ref_type: 'print', ref_id: r.print_history_id,
    location_from: null, location_to: null, actor: null, timestamp: r.timestamp,
  };
}
function _normEvent(r) {
  return {
    source: 'event', type: r.event_type, delta_g: null, balance_g: null,
    reason: r.details, ref_type: null, ref_id: null,
    location_from: null, location_to: null, actor: r.actor, timestamp: r.timestamp,
  };
}
function _normCheckout(r) {
  return {
    source: 'checkout', type: r.action || 'move', delta_g: null, balance_g: null,
    reason: null, ref_type: null, ref_id: null,
    location_from: r.from_location, location_to: r.to_location, actor: r.actor, timestamp: r.timestamp,
  };
}

function _byTimeDesc(a, b) { return String(b.timestamp || '').localeCompare(String(a.timestamp || '')); }

// Full normalised ledger for one spool (newest first), merging the canonical
// transactions with the three legacy logs.
export function getStockLedger(spoolId, opts = {}) {
  const db = getDb();
  const limit = opts.limit || 200;
  const entries = [
    ...db.prepare('SELECT * FROM stock_transactions WHERE spool_id = ? ORDER BY created_at DESC LIMIT ?').all(spoolId, limit).map(_normCanon),
    ...db.prepare('SELECT * FROM spool_usage_log WHERE spool_id = ? ORDER BY timestamp DESC LIMIT ?').all(spoolId, limit).map(_normUsage),
    ...db.prepare('SELECT * FROM spool_events WHERE spool_id = ? ORDER BY timestamp DESC LIMIT ?').all(spoolId, limit).map(_normEvent),
    ...db.prepare('SELECT * FROM spool_checkout_log WHERE spool_id = ? ORDER BY timestamp DESC LIMIT ?').all(spoolId, limit).map(_normCheckout),
  ];
  entries.sort(_byTimeDesc);
  return entries.slice(0, limit);
}

// Global activity feed across all spools (newest first), each entry labelled
// with its spool so the UI can render a single chronological stream.
export function getStockActivity(opts = {}) {
  const db = getDb();
  const limit = opts.limit || 100;
  const per = limit; // pull up to `limit` from each source, then merge + trim
  let entries = [
    ...db.prepare('SELECT * FROM stock_transactions ORDER BY created_at DESC LIMIT ?').all(per).map((r) => ({ ..._normCanon(r), spool_id: r.spool_id })),
    ...db.prepare('SELECT * FROM spool_usage_log ORDER BY timestamp DESC LIMIT ?').all(per).map((r) => ({ ..._normUsage(r), spool_id: r.spool_id })),
    ...db.prepare('SELECT * FROM spool_events ORDER BY timestamp DESC LIMIT ?').all(per).map((r) => ({ ..._normEvent(r), spool_id: r.spool_id })),
    ...db.prepare('SELECT * FROM spool_checkout_log ORDER BY timestamp DESC LIMIT ?').all(per).map((r) => ({ ..._normCheckout(r), spool_id: r.spool_id })),
  ];
  if (opts.type) entries = entries.filter((e) => e.type === opts.type);
  entries.sort(_byTimeDesc);
  entries = entries.slice(0, limit);

  // Label each entry with its spool (profile name + colour) in one batch query.
  const ids = [...new Set(entries.map((e) => e.spool_id).filter((x) => x != null))];
  if (ids.length) {
    const rows = db.prepare(
      `SELECT s.id, COALESCE(fp.name, s.color_name_override, 'Spool #' || s.id) AS label,
              COALESCE(s.color_hex_override, fp.color_hex) AS color_hex
       FROM spools s LEFT JOIN filament_profiles fp ON s.filament_profile_id = fp.id
       WHERE s.id IN (${ids.map(() => '?').join(',')})`
    ).all(...ids);
    const map = {};
    for (const r of rows) map[r.id] = r;
    for (const e of entries) { const m = map[e.spool_id]; e.spool_label = m ? m.label : (e.spool_id ? 'Spool #' + e.spool_id : null); e.spool_color = m ? m.color_hex : null; }
  }
  return entries;
}
