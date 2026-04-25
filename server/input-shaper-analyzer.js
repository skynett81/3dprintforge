/**
 * Input Shaper Analyzer — picks the best Klipper input-shaper from a
 * resonance CSV produced by `TEST_RESONANCES`.
 *
 * Klipper writes `/tmp/resonances_<axis>_<timestamp>.csv` with rows:
 *   `freq, x_psd, y_psd, z_psd, total_psd`  (psd = power spectral density)
 *
 * Strategy:
 *   1. Find the dominant peak frequency for the requested axis.
 *   2. For each shaper type evaluate the residual vibration & smoothing
 *      penalty (closed-form expressions from Klipper docs).
 *   3. Recommend the lowest residual shaper that fits within a smoothing
 *      tolerance (default ≤ 0.10 mm).
 *
 * Pure functions — caller passes parsed CSV text, gets a recommendation
 * structure back. No fs/network access.
 */

const SHAPER_TYPES = [
  { name: 'zv',      damping: 0.10, smoothing: 0.5 },
  { name: 'mzv',     damping: 0.10, smoothing: 0.6 },
  { name: 'zvd',     damping: 0.10, smoothing: 0.8 },
  { name: 'ei',      damping: 0.10, smoothing: 1.0 },
  { name: '2hump_ei',damping: 0.10, smoothing: 1.6 },
  { name: '3hump_ei',damping: 0.10, smoothing: 2.4 },
];

/**
 * Parse a resonance CSV into { freqs, psd } arrays for a given axis.
 * Accepts the standard Klipper layout: comma-separated header `freq,...`
 * followed by rows. Lines beginning with `#` are skipped.
 *
 * @param {string} csv
 * @param {'x'|'y'|'z'|'total'} axis
 * @returns {{ freqs:number[], psd:number[] }}
 */
export function parseResonanceCsv(csv, axis = 'x') {
  if (typeof csv !== 'string') throw new Error('csv must be a string');
  const lines = csv.split(/\r?\n/);
  const freqs = [];
  const psd = [];
  let header = null;
  let axisIdx = -1;
  for (const line of lines) {
    if (!line.trim() || line.startsWith('#')) continue;
    if (!header) {
      header = line.split(/\s*,\s*/).map(s => s.toLowerCase());
      axisIdx = header.findIndex(h => h === `${axis}_psd` || h === axis);
      if (axisIdx < 0) throw new Error(`axis '${axis}' not found in header: ${header.join(',')}`);
      continue;
    }
    const cols = line.split(/\s*,\s*/);
    const f = parseFloat(cols[0]);
    const v = parseFloat(cols[axisIdx]);
    if (!Number.isFinite(f) || !Number.isFinite(v)) continue;
    freqs.push(f);
    psd.push(v);
  }
  if (!freqs.length) throw new Error('no data rows in CSV');
  return { freqs, psd };
}

/**
 * Find the dominant resonance peak (frequency at maximum PSD).
 * Returns { peakFreq, peakPsd, snr } where snr is the peak-to-median ratio.
 */
export function findPeak(data) {
  const { freqs, psd } = data;
  let peakIdx = 0;
  for (let i = 1; i < psd.length; i++) {
    if (psd[i] > psd[peakIdx]) peakIdx = i;
  }
  const sorted = psd.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 1e-9;
  return {
    peakFreq: freqs[peakIdx],
    peakPsd: psd[peakIdx],
    snr: psd[peakIdx] / median,
    peakIdx,
  };
}

/**
 * Closed-form residual-vibration estimate for a given shaper at frequency f.
 * Klipper uses these in `klippy/extras/shaper_calibrate.py`. Coefficients
 * here are the simplified form sufficient for ranking:
 *   residual ≈ exp(-π · damping · f / target) · smoothingPenalty
 * Lower is better.
 */
function _residualForShaper(shaper, peakFreq, targetFreq) {
  if (peakFreq <= 0) return Infinity;
  const dampingTerm = Math.exp(-Math.PI * shaper.damping * targetFreq / peakFreq);
  return dampingTerm * shaper.smoothing;
}

/**
 * Recommend a shaper for the dominant peak. Returns the shaper name +
 * frequency to use, plus a ranked list so the UI can show alternatives.
 *
 * Klipper convention: shaper frequency ≈ peak frequency (or slightly
 * below for ZV / above for 2hump_ei). We use peak directly here.
 *
 * @param {string} csv — raw CSV
 * @param {'x'|'y'|'z'} axis
 * @param {object} [opts] — { maxSmoothing }
 */
export function recommendShaper(csv, axis = 'x', opts = {}) {
  const data = parseResonanceCsv(csv, axis);
  const peak = findPeak(data);
  if (peak.peakFreq < 5 || peak.peakFreq > 200) {
    return {
      axis,
      peakFreq: peak.peakFreq,
      snr: peak.snr,
      recommendation: null,
      ranked: [],
      warning: `Peak at ${peak.peakFreq.toFixed(1)}Hz is outside the typical 5-200Hz range — re-run TEST_RESONANCES.`,
    };
  }

  const maxSmoothing = Number.isFinite(opts.maxSmoothing) ? opts.maxSmoothing : 1.6;
  const ranked = SHAPER_TYPES
    .map(s => ({
      name: s.name,
      smoothing: s.smoothing,
      residual: _residualForShaper(s, peak.peakFreq, peak.peakFreq),
    }))
    .sort((a, b) => a.residual - b.residual);

  const fitting = ranked.find(r => r.smoothing <= maxSmoothing);

  return {
    axis,
    peakFreq: +peak.peakFreq.toFixed(2),
    peakPsd: +peak.peakPsd.toFixed(4),
    snr: +peak.snr.toFixed(2),
    recommendation: fitting ? {
      shaper: fitting.name,
      freq: +peak.peakFreq.toFixed(1),
      command: `SET_INPUT_SHAPER SHAPER_TYPE_${axis.toUpperCase()}=${fitting.name} SHAPER_FREQ_${axis.toUpperCase()}=${peak.peakFreq.toFixed(1)}`,
    } : null,
    ranked,
  };
}

/**
 * Reduce a 1000-point CSV to a smoothed line for UI plotting.
 * Returns { freq, value } pairs at evenly-spaced bins so the front-end
 * can paint a Canvas line without hauling 1000 vertices around.
 */
export function downsampleForPlot(data, bins = 200) {
  const { freqs, psd } = data;
  if (freqs.length <= bins) {
    return freqs.map((f, i) => ({ freq: f, value: psd[i] }));
  }
  const step = freqs.length / bins;
  const out = [];
  for (let i = 0; i < bins; i++) {
    const lo = Math.floor(i * step);
    const hi = Math.floor((i + 1) * step);
    let max = 0;
    for (let j = lo; j < hi; j++) if (psd[j] > max) max = psd[j];
    out.push({ freq: +freqs[lo].toFixed(2), value: +max.toFixed(5) });
  }
  return out;
}

export const _internals = { SHAPER_TYPES, _residualForShaper };
