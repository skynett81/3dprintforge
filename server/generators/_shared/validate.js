/**
 * Shared parameter validators for Model Forge generators.
 * Keeps validation consistent across tools and prevents invalid geometry
 * from reaching lib3mf (which tends to crash on degenerate inputs).
 */

/**
 * Clamp a number to [min, max] with a default fallback when undefined/NaN.
 * @param {unknown} v
 * @param {number} min
 * @param {number} max
 * @param {number} def
 * @returns {number}
 */
export function num(v, min, max, def) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) return def;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/**
 * Clamp an integer to [min, max] with a default fallback.
 * @param {unknown} v
 * @param {number} min
 * @param {number} max
 * @param {number} def
 * @returns {number}
 */
export function int(v, min, max, def) {
  const n = typeof v === 'number' ? v : parseInt(v, 10);
  if (!Number.isFinite(n)) return def;
  if (n < min) return min;
  if (n > max) return max;
  return Math.round(n);
}

/**
 * Coerce any value to boolean with default.
 * @param {unknown} v
 * @param {boolean} def
 * @returns {boolean}
 */
export function bool(v, def) {
  if (v === true || v === false) return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return def;
}

/**
 * Validate and clamp a text string (for labels, tags, filenames).
 * Strips control characters and limits length.
 * @param {unknown} v
 * @param {number} maxLen
 * @param {string} def
 * @returns {string}
 */
export function str(v, maxLen, def) {
  if (typeof v !== 'string') return def;
  // eslint-disable-next-line no-control-regex
  const clean = v.replace(/[\x00-\x1f\x7f]/g, '').trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) : clean;
}

/**
 * Throw if a dimension combination would produce degenerate geometry.
 * @param {object} dims
 */
export function assertPositive(dims) {
  for (const [k, v] of Object.entries(dims)) {
    if (!Number.isFinite(v) || v <= 0) {
      throw new Error(`Invalid dimension ${k}: ${v}`);
    }
  }
}
