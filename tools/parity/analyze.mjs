// analyze.mjs — parse a G-code file into per-feature geometry stats so our
// engine's output can be diffed against BambuStudio's (the reference).
//
// Metric is EXTRUDED LENGTH (mm of XY travel while E increases) per feature,
// which reflects real deposited geometry, plus move counts and layer count.
// Handles both BambuStudio markers ("; FEATURE: Outer wall") and our own.
import { readFileSync } from 'node:fs';

// Normalise every marker vocabulary onto one canonical set.
const CANON = {
  'outer wall': 'outerWall', 'outer-wall': 'outerWall', 'external perimeter': 'outerWall',
  'inner wall': 'innerWall', 'inner-wall': 'innerWall', 'perimeter': 'innerWall',
  'top surface': 'topSurface', 'top-surface': 'topSurface', 'top solid infill': 'topSurface',
  'bottom surface': 'bottomSurface', 'bottom-surface': 'bottomSurface',
  'internal solid infill': 'solidInfill', 'solid infill': 'solidInfill', 'solid': 'solidInfill',
  'sparse infill': 'sparseInfill', 'sparse-infill': 'sparseInfill', 'internal infill': 'sparseInfill', 'sparse': 'sparseInfill',
  'bridge': 'bridge', 'bridge infill': 'bridge', 'internal bridge infill': 'bridge',
  'skirt': 'skirt', 'brim': 'brim', 'skirt/brim': 'skirt',
  'support': 'support', 'support material': 'support', 'support interface': 'support', 'support material interface': 'support',
  'ironing': 'ironing', 'gap fill': 'gapFill', 'gap infill': 'gapFill',
  'floating vertical shell': 'solidInfill', 'wall-outer': 'outerWall', 'wall-inner': 'innerWall',
  'custom': 'custom', 'undefined': 'custom', 'prime tower': 'primeTower', 'wipe tower': 'primeTower',
};

export function analyze(path) {
  const text = readFileSync(path, 'utf8');
  const len = {};          // canonical feature -> extruded length mm
  const moves = {};        // canonical feature -> extruding-move count
  let feat = 'custom';
  let x = 0, y = 0, e = 0, absE = true, layers = 0, lastZ = -1;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line[0] === ';') {
      const m = line.match(/;\s*(?:FEATURE|TYPE):\s*(.+)/i);
      if (m) { const key = m[1].trim().toLowerCase(); feat = CANON[key] ?? key.replace(/\s+/g, '_'); }
      else if (/;\s*(LAYER_CHANGE|CHANGE_LAYER)/i.test(line)) layers++;
      continue;
    }
    if (/^M83\b/.test(line)) absE = false;
    else if (/^M82\b/.test(line)) absE = true;
    else if (/^G92\b.*E/.test(line)) { const em = line.match(/E(-?[\d.]+)/); if (em) e = parseFloat(em[1]); }
    else if (/^G[01]\b/.test(line)) {
      const nx = line.match(/X(-?[\d.]+)/), ny = line.match(/Y(-?[\d.]+)/);
      const nz = line.match(/Z(-?[\d.]+)/), ne = line.match(/E(-?[\d.]+)/);
      const px = nx ? parseFloat(nx[1]) : x, py = ny ? parseFloat(ny[1]) : y;
      if (nz) { const z = parseFloat(nz[1]); if (z !== lastZ) { lastZ = z; layers++; } }
      let de = 0;
      if (ne) { const ev = parseFloat(ne[1]); de = absE ? ev - e : ev; e = absE ? ev : e + ev; }
      const dist = Math.hypot(px - x, py - y);
      if (de > 1e-6 && dist > 1e-6) { len[feat] = (len[feat] || 0) + dist; moves[feat] = (moves[feat] || 0) + 1; }
      x = px; y = py;
    }
  }
  const total = Object.values(len).reduce((a, b) => a + b, 0);
  return { len, moves, layers, total };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = analyze(process.argv[2]);
  console.log(`layers=${r.layers} totalExtrudeMM=${r.total.toFixed(0)}`);
  for (const [k, v] of Object.entries(r.len).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(14)} ${v.toFixed(0).padStart(8)} mm  (${r.moves[k]} moves)`);
}
