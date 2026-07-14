/**
 * Native Slicer — Arachne-style variable-width beads for thin regions.
 *
 * Classic slicing lays fixed-width walls and fills the leftover with gap-fill,
 * which wastes material and leaves seams in narrow ribs. Arachne instead runs a
 * single bead down the medial axis of a thin region, varying its width to match
 * the local thickness. We approximate the medial axis with a distance transform
 * on a grid (the same technique real slicers use): the ridge of the distance
 * field is the skeleton, and 2x the distance there is the local width.
 *
 * Self-contained and opt-in — only invoked in the arachne wall generator for
 * regions too thin for a proper wall; the classic path is untouched.
 */

import { _pointInPoly } from './native-slicer-geo.js';

/**
 * @param {{outer:number[][], holes?:number[][][]}} region
 * @param {number} lineWidth
 * @param {number} [gridRes] grid cell size (mm); defaults to lineWidth/2
 * @returns {{pts:number[][], widths:number[]}[]} variable-width bead polylines
 */
export function medialBeads(region, lineWidth, gridRes = lineWidth / 2) {
  const outer = region.outer;
  const holes = region.holes || [];
  if (!outer || outer.length < 3 || !(lineWidth > 0)) return [];

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of outer) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  if (!Number.isFinite(minX)) return [];
  const pad = lineWidth * 2;
  minX -= pad; minY -= pad; maxX += pad; maxY += pad;
  const cols = Math.max(2, Math.ceil((maxX - minX) / gridRes));
  const rows = Math.max(2, Math.ceil((maxY - minY) / gridRes));
  if (cols * rows > 400000) return [];   // safety cap on huge regions
  const cx = (c) => minX + (c + 0.5) * gridRes;
  const cy = (r) => minY + (r + 0.5) * gridRes;
  const idxOf = (r, c) => r * cols + c;

  const inModel = (x, y) => {
    if (!_pointInPoly([x, y], outer)) return false;
    for (const h of holes) if (_pointInPoly([x, y], h)) return false;
    return true;
  };

  const inside = new Uint8Array(cols * rows);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) inside[idxOf(r, c)] = inModel(cx(c), cy(r)) ? 1 : 0;

  // Chamfer distance transform (mm) — distance from each inside cell to the
  // nearest outside cell. Two diagonal passes give a good Euclidean estimate.
  const D1 = gridRes, D2 = gridRes * Math.SQRT2;
  const dist = new Float32Array(cols * rows);
  for (let i = 0; i < dist.length; i++) dist[i] = inside[i] ? 1e9 : 0;
  const relax = (r, c, nr, nc, w) => { if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) return; const nd = dist[idxOf(nr, nc)] + w; const i = idxOf(r, c); if (nd < dist[i]) dist[i] = nd; };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (!inside[idxOf(r, c)]) continue; relax(r, c, r - 1, c, D1); relax(r, c, r, c - 1, D1); relax(r, c, r - 1, c - 1, D2); relax(r, c, r - 1, c + 1, D2); }
  for (let r = rows - 1; r >= 0; r--) for (let c = cols - 1; c >= 0; c--) { if (!inside[idxOf(r, c)]) continue; relax(r, c, r + 1, c, D1); relax(r, c, r, c + 1, D1); relax(r, c, r + 1, c + 1, D2); relax(r, c, r + 1, c - 1, D2); }

  // Ridge = local maxima of the distance field, restricted to THIN regions
  // (radius up to ~1.6 line widths — thicker areas get proper walls elsewhere).
  const minR = lineWidth * 0.35, maxR = lineWidth * 1.7;
  const ridge = new Uint8Array(cols * rows);
  for (let r = 1; r < rows - 1; r++) for (let c = 1; c < cols - 1; c++) {
    const i = idxOf(r, c); if (!inside[i]) continue;
    const d = dist[i]; if (d < minR || d > maxR) continue;
    let isMax = true;
    for (let dr = -1; dr <= 1 && isMax; dr++) for (let dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; if (dist[idxOf(r + dr, c + dc)] > d + 1e-4) { isMax = false; break; } }
    if (isMax) ridge[i] = 1;
  }

  // Group ridge cells into 8-connected components; each component is one bead.
  // The ridge is a 1-2 cell-thick band, so ordering cells by nearest-neighbour
  // zig-zags — instead project each component onto its principal axis (PCA) and
  // sort along it, giving a clean centreline for any orientation.
  const seen = new Uint8Array(cols * rows);
  const beads = [];
  for (let r0 = 0; r0 < rows; r0++) for (let c0 = 0; c0 < cols; c0++) {
    const s = idxOf(r0, c0);
    if (!ridge[s] || seen[s]) continue;
    const comp = [];
    const stack = [[r0, c0]]; seen[s] = 1;
    while (stack.length) {
      const [r, c] = stack.pop();
      comp.push({ x: cx(c), y: cy(r), w: 2 * dist[idxOf(r, c)] });
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue; const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        const ni = idxOf(nr, nc); if (ridge[ni] && !seen[ni]) { seen[ni] = 1; stack.push([nr, nc]); }
      }
    }
    if (comp.length < 2) continue;
    // Principal axis via covariance of the component's cell centres.
    let mx = 0, my = 0; for (const p of comp) { mx += p.x; my += p.y; } mx /= comp.length; my /= comp.length;
    let sxx = 0, sxy = 0, syy = 0; for (const p of comp) { const dx = p.x - mx, dy = p.y - my; sxx += dx * dx; sxy += dx * dy; syy += dy * dy; }
    const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    const ux = Math.cos(ang), uy = Math.sin(ang);
    comp.sort((a, b) => (a.x * ux + a.y * uy) - (b.x * ux + b.y * uy));
    // Downsample to ~lineWidth spacing so the bead isn't over-dense.
    const pts = [], widths = [];
    let lastX = -1e9, lastY = -1e9;
    for (const p of comp) {
      if (pts.length && Math.hypot(p.x - lastX, p.y - lastY) < lineWidth * 0.6) continue;
      pts.push([p.x, p.y]); widths.push(p.w); lastX = p.x; lastY = p.y;
    }
    if (pts.length >= 2) beads.push({ pts, widths });
  }
  return beads;
}
