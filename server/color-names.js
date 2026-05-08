// Resolve a hex colour to a human-readable name for auto-created spools
// and UI labels. Covers the common cases (white, black, primary colours)
// + the printable-PLA palette that Bambu, Elegoo, Polymaker etc. all
// share variants of. Anything outside is left null so callers can fall
// back to the raw hex.

// Curated set of obvious filament colour names. Sorted by RGB distance
// at lookup time. Not RAL-grade — that lives in misc.js findClosestRal()
// and is for manufacturing accuracy. This file is for "what should I
// call this spool" labels.
const PALETTE = [
  ['White',       0xFF, 0xFF, 0xFF],
  ['Black',       0x00, 0x00, 0x00],
  ['Red',         0xFF, 0x00, 0x00],
  ['Green',       0x00, 0x80, 0x00],
  ['Blue',        0x00, 0x00, 0xFF],
  ['Yellow',      0xFF, 0xFF, 0x00],
  ['Cyan',        0x00, 0xFF, 0xFF],
  ['Magenta',     0xFF, 0x00, 0xFF],
  ['Orange',      0xFF, 0xA5, 0x00],
  ['Purple',      0x80, 0x00, 0x80],
  ['Pink',        0xFF, 0xC0, 0xCB],
  ['Hot Pink',    0xF5, 0x54, 0x7C],
  ['Brown',       0x8B, 0x45, 0x13],
  ['Cocoa',       0x6F, 0x50, 0x34],
  ['Bronze',      0xE4, 0xBD, 0x68],
  ['Gold',        0xFF, 0xD7, 0x00],
  ['Silver',      0xC0, 0xC0, 0xC0],
  ['Gray',        0x80, 0x80, 0x80],
  ['Light Gray',  0xD3, 0xD3, 0xD3],
  ['Dark Gray',   0x40, 0x40, 0x40],
  ['Sky Blue',    0x00, 0x86, 0xD6],
  ['Navy',        0x00, 0x00, 0x80],
  ['Lime',        0x00, 0xFF, 0x00],
  ['Olive',       0x80, 0x80, 0x00],
  ['Maroon',      0x80, 0x00, 0x00],
  ['Teal',        0x00, 0x80, 0x80],
  ['Beige',       0xF5, 0xF5, 0xDC],
  ['Tan',         0xD2, 0xB4, 0x8C],
];

const NEAR_MATCH_THRESHOLD = 80; // Euclidean distance squared root in RGB space

/** Map a 6-char hex string (with or without leading '#') to a basic
 *  English colour name. Returns null when the closest match is too far
 *  away — caller should fall back to the raw hex or "Unknown". */
export function basicColorName(hex) {
  if (!hex) return null;
  const clean = String(hex).replace(/^#/, '').slice(0, 6);
  if (clean.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  let best = null;
  let bestDist = Infinity;
  for (const [name, pr, pg, pb] of PALETTE) {
    // Squared Euclidean — fine for ranking without sqrt cost.
    const d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = name;
    }
  }
  return Math.sqrt(bestDist) <= NEAR_MATCH_THRESHOLD ? best : null;
}
