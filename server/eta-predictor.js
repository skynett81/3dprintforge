/**
 * Smart ETA Predictor — learns each printer's slicer-vs-actual delta
 * over time and applies it to new prints for sharper time estimates.
 *
 * Bucketing: (printer_id, material, nozzle_diameter). For each bucket
 * we keep an exponentially-weighted moving multiplier (`actual / slicer`)
 * so the latest prints carry more weight than ancient ones, but we still
 * survive the occasional outlier.
 *
 * `predict()` is pure — pass slicer estimate + bucket params, get adjusted
 * estimate plus confidence interval. Storage and bookkeeping happens in
 * calls to `recordCompletion()` (typically from print-tracker on FINISH).
 */

import { getDb } from './db/connection.js';

const EWMA_ALPHA = 0.25; // newer prints contribute 25% to the multiplier
const MIN_SAMPLES_FOR_CI = 3; // need at least 3 prints before confidence kicks in
const DEFAULT_MULTIPLIER = 1.0;

function _bucketKey(printerId, material, nozzle) {
  const m = (material || 'unknown').toLowerCase().trim();
  const n = nozzle ? +nozzle : 0.4;
  return `${printerId}::${m}::${n.toFixed(2)}`;
}

/**
 * Predict actual print duration based on slicer estimate + history.
 * @returns {{ predicted_minutes, slicer_minutes, multiplier, samples, confidence }}
 */
export function predictEta(slicerMinutes, opts = {}) {
  if (!Number.isFinite(slicerMinutes) || slicerMinutes <= 0) {
    return { predicted_minutes: 0, slicer_minutes: 0, multiplier: DEFAULT_MULTIPLIER, samples: 0, confidence: 0 };
  }
  const { printerId, material, nozzleDiameter } = opts;
  if (!printerId) {
    return { predicted_minutes: slicerMinutes, slicer_minutes: slicerMinutes, multiplier: DEFAULT_MULTIPLIER, samples: 0, confidence: 0 };
  }

  const stats = getEtaStats(printerId, material, nozzleDiameter);
  const multiplier = stats?.multiplier || DEFAULT_MULTIPLIER;
  const samples = stats?.samples || 0;
  const confidence = Math.min(1, samples / 10); // saturates at 10 samples
  return {
    predicted_minutes: Math.round(slicerMinutes * multiplier),
    slicer_minutes: slicerMinutes,
    multiplier: +multiplier.toFixed(4),
    samples,
    confidence: +confidence.toFixed(2),
  };
}

/**
 * Update the multiplier for a (printer, material, nozzle) bucket after a
 * print finishes. Both estimates in minutes; we ignore the call when
 * either side is non-positive.
 */
export function recordCompletion(printerId, material, nozzleDiameter, slicerMinutes, actualMinutes) {
  if (!printerId) throw new Error('printerId required');
  if (!Number.isFinite(slicerMinutes) || slicerMinutes <= 0) return null;
  if (!Number.isFinite(actualMinutes) || actualMinutes <= 0) return null;

  const ratio = actualMinutes / slicerMinutes;
  // Sanity clamp: anything outside 0.3..3.0 is almost certainly a tracking
  // bug or a paused print, not a real signal — skip the update.
  if (ratio < 0.3 || ratio > 3.0) return null;

  const db = getDb();
  const key = _bucketKey(printerId, material, nozzleDiameter);
  const existing = db.prepare('SELECT * FROM eta_predictions WHERE bucket_key = ?').get(key);

  if (!existing) {
    db.prepare(`
      INSERT INTO eta_predictions
        (bucket_key, printer_id, material, nozzle_diameter, multiplier, samples, total_slicer_min, total_actual_min, last_actual_min, last_slicer_min, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, datetime('now'))
    `).run(key, printerId, material || 'unknown', nozzleDiameter || 0.4, ratio, slicerMinutes, actualMinutes, actualMinutes, slicerMinutes);
  } else {
    const newMult = (1 - EWMA_ALPHA) * existing.multiplier + EWMA_ALPHA * ratio;
    db.prepare(`
      UPDATE eta_predictions SET
        multiplier = ?,
        samples = samples + 1,
        total_slicer_min = total_slicer_min + ?,
        total_actual_min = total_actual_min + ?,
        last_actual_min = ?,
        last_slicer_min = ?,
        updated_at = datetime('now')
      WHERE bucket_key = ?
    `).run(newMult, slicerMinutes, actualMinutes, actualMinutes, slicerMinutes, key);
  }
  return getEtaStats(printerId, material, nozzleDiameter);
}

export function getEtaStats(printerId, material, nozzleDiameter) {
  const key = _bucketKey(printerId, material, nozzleDiameter);
  return getDb().prepare('SELECT * FROM eta_predictions WHERE bucket_key = ?').get(key);
}

/** All buckets for a printer (used by the stats panel to show per-material accuracy). */
export function listEtaStatsForPrinter(printerId) {
  return getDb().prepare(`
    SELECT bucket_key, printer_id, material, nozzle_diameter, multiplier, samples,
           total_slicer_min, total_actual_min, last_actual_min, last_slicer_min, updated_at
    FROM eta_predictions
    WHERE printer_id = ?
    ORDER BY samples DESC, material
  `).all(printerId);
}

/** Reset a single bucket — useful when a printer changes hardware. */
export function resetEtaBucket(printerId, material, nozzleDiameter) {
  const key = _bucketKey(printerId, material, nozzleDiameter);
  const r = getDb().prepare('DELETE FROM eta_predictions WHERE bucket_key = ?').run(key);
  return r.changes > 0;
}

export const _internals = { EWMA_ALPHA, _bucketKey, MIN_SAMPLES_FOR_CI };
