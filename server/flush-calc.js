// flush-calc.js — colour-aware purge/flush volume estimate.
//
// Faithful JS port of OrcaSlicer's RGB flush model (libslic3r/FlushVolCalc.cpp
// `calc_flush_vol_rgb`): HSV colour distance + luminance asymmetry (going to a
// LIGHTER colour needs more purge than going darker). Returns the per-change
// flush VOLUME in mm³, matching what the slicer puts in `flush_volumes_matrix`.
//
// Used to estimate single-nozzle purge waste accurately (vs a flat per-change
// guess), to recommend the colour order that minimises total purge, and for
// pre-print "purge X g vs part Y g" estimates.

const MIN_FLUSH_VOL = 107;     // OrcaSlicer default per-filament minimum (mm³)
const MAX_FLUSH_VOL = 800;     // sane upper clamp for an estimate (mm³)

function toRadians(deg) { return (deg * Math.PI) / 180; }

function getLuminance(r, g, b) { return r * 0.3 + g * 0.59 + b * 0.11; }

function calcTriangle3rdEdge(a, b, degAB) {
  return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(toRadians(degAB)));
}

// r,g,b in [0,1] -> { h:[0,360), s:[0,1], v:[0,1] }
function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

function deltaHS(h1, s1, v1, h2, s2, v2) {
  const dx = Math.cos(toRadians(h1)) * s1 * v1 - Math.cos(toRadians(h2)) * s2 * v2;
  const dy = Math.sin(toRadians(h1)) * s1 * v1 - Math.sin(toRadians(h2)) * s2 * v2;
  return Math.min(1.2, Math.sqrt(dx * dx + dy * dy));
}

// "#RRGGBB" / "RRGGBB" -> [r,g,b] in 0..255, or null.
function parseHex(hex) {
  if (!hex) return null;
  const s = String(hex).replace(/^#/, '');
  if (s.length < 6) return null;
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return null;
  return [r, g, b];
}

// Flush volume (mm³) needed when changing from -> to. Accepts "#RRGGBB" strings.
function flushVolumeMm3(fromHex, toHex) {
  const from = parseHex(fromHex), to = parseHex(toHex);
  if (!from || !to) return MIN_FLUSH_VOL;
  const [sr, sg, sb] = from.map((c) => c / 255);
  const [dr, dg, db] = to.map((c) => c / 255);

  const f = rgbToHsv(sr, sg, sb);
  const t = rgbToHsv(dr, dg, db);
  let hsDist = deltaHS(f.h, f.s, f.v, t.h, t.s, t.v);

  const fromLumi = getLuminance(sr, sg, sb);
  const toLumi = getLuminance(dr, dg, db);
  let lumiFlush;
  if (toLumi >= fromLumi) {
    lumiFlush = Math.pow(toLumi - fromLumi, 0.7) * 560;
  } else {
    lumiFlush = (fromLumi - toLumi) * 80;
    const interV = 0.67 * t.v + 0.33 * f.v;
    hsDist = Math.min(interV, hsDist);
  }
  const hsFlush = 230 * hsDist;
  let vol = calcTriangle3rdEdge(hsFlush, lumiFlush, 120);
  vol = Math.max(vol, 60);
  return Math.min(MAX_FLUSH_VOL, Math.max(MIN_FLUSH_VOL, Math.round(vol)));
}

// mm³ -> grams for a filament density (g/cm³, PLA ~1.24). 1 cm³ = 1000 mm³.
function mm3ToGrams(mm3, densityGcm3 = 1.24) {
  return (mm3 / 1000) * densityGcm3;
}

// Convenience: estimated purge weight (g) for one from->to change.
function flushGrams(fromHex, toHex, densityGcm3 = 1.24, multiplier = 1.0) {
  return mm3ToGrams(flushVolumeMm3(fromHex, toHex) * multiplier, densityGcm3);
}

export { flushVolumeMm3, flushGrams, mm3ToGrams, parseHex, MIN_FLUSH_VOL, MAX_FLUSH_VOL };
