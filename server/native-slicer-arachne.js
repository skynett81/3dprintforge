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
import { makeBeadingStrategy } from './native-slicer-beading.js';
import { medialAxis } from './native-slicer-voronoi.js';
import { clipExpand } from './native-slicer-bool.js';

/**
 * @param {{outer:number[][], holes?:number[][][]}} region
 * @param {number} lineWidth
 * @param {number} [gridRes] grid cell size (mm); defaults to lineWidth/2
 * @returns {{pts:number[][], widths:number[]}[]} variable-width bead polylines
 */
export function medialBeads(region, lineWidth, gridRes = lineWidth / 2, maxRadiusFactor = 1.7, minRadiusFactor = 0.35) {
  const outer = region.outer;
  const holes = region.holes || [];
  if (!outer || outer.length < 3 || !(lineWidth > 0)) return [];

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of outer) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  if (!Number.isFinite(minX)) return [];
  const pad = lineWidth * 2;
  minX -= pad; minY -= pad; maxX += pad; maxY += pad;
  const MAX_CELLS = 400000;              // grid budget (memory + time)
  let cols = Math.max(2, Math.ceil((maxX - minX) / gridRes));
  let rows = Math.max(2, Math.ceil((maxY - minY) / gridRes));
  // Adaptive grid: a large region would blow the cell budget. Rather than skip
  // it (falling back to perpendicular hatch), coarsen the grid to fit — but
  // never past the line width, or a thin feature would blur out below one cell.
  // If even a line-width grid can't fit the budget, bail and let hatch handle it.
  if (cols * rows > MAX_CELLS) {
    const coarser = gridRes * Math.sqrt((cols * rows) / MAX_CELLS);
    if (coarser > lineWidth) return [];
    gridRes = coarser;
    cols = Math.max(2, Math.ceil((maxX - minX) / gridRes));
    rows = Math.max(2, Math.ceil((maxY - minY) / gridRes));
  }
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

  // Ridge = local maxima of the distance field, restricted to thin regions
  // (radius up to ~1.7 line widths). Wider areas get proper walls elsewhere.
  const minR = lineWidth * minRadiusFactor, maxR = lineWidth * maxRadiusFactor;
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
    // Project onto the principal axis and BIN: the ridge is a 1-2 cell-thick
    // band, so average the perpendicular wobble per bin → a smooth centreline
    // (one point per bin) instead of a zig-zag through the band.
    const proj = comp.map((p) => ({ t: p.x * ux + p.y * uy, x: p.x, y: p.y, w: p.w }));
    proj.sort((a, b) => a.t - b.t);
    const smooth = [];
    for (let k = 0; k < proj.length;) {
      const t0 = proj[k].t; let sx = 0, sy = 0, sw = 0, n = 0;
      while (k < proj.length && proj[k].t < t0 + gridRes) { sx += proj[k].x; sy += proj[k].y; sw += proj[k].w; n++; k++; }
      smooth.push({ x: sx / n, y: sy / n, w: sw / n });
    }
    // Simplify: drop points collinear with their neighbours (same width) so a
    // straight bead becomes a couple of points — much smaller g-code.
    const perp = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1; return Math.abs((px - ax) * dy - (py - ay) * dx) / L; };
    const pts = [], widths = [];
    for (const p of smooth) {
      if (pts.length >= 2) {
        const a = pts[pts.length - 2], b = pts[pts.length - 1];
        if (perp(p.x, p.y, a[0], a[1], b[0], b[1]) < gridRes * 0.4 && Math.abs(p.w - widths[widths.length - 1]) < lineWidth * 0.15) {
          pts[pts.length - 1] = [p.x, p.y]; widths[widths.length - 1] = p.w; continue;
        }
      }
      pts.push([p.x, p.y]); widths.push(p.w);
    }
    if (pts.length >= 2) beads.push({ pts, widths });
  }
  return beads;
}

/** Unit perpendicular (left normal) at each point of a polyline, from the
 *  average of the incoming and outgoing segment directions. */
function perpNormals(pts) {
  const n = pts.length, out = new Array(n);
  for (let k = 0; k < n; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n - 1, k + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    out[k] = [-dy, dx];                       // left normal
  }
  return out;
}

/**
 * Full-region Arachne beads: extend the single medial centreline into the
 * correct NUMBER of parallel, variable-width beads for the local cross-section
 * (BambuStudio's variable-width wall generator). Where a core is one line wide
 * it stays a single bead; where it is 2-3+ lines wide, the beading strategy
 * splits it into that many beads at their exact widths and offsets — no starved
 * extra wall, no leftover gap. Beads adapt point-by-point as the width changes.
 *
 * @param {{outer:number[][], holes?:number[][][]}} region  the leftover core
 * @param {number} lineWidth
 * @param {object} [opts]  { maxBeads, split, add, distributionRadius }
 * @returns {{pts:number[][], widths:number[]}[]}
 */
export function arachneBeads(region, lineWidth, opts = {}) {
  // WideningBeadingStrategy is on by default so genuinely thin walls survive as
  // a widened bead instead of vanishing (min_feature_size / min_bead_width).
  const minInput = opts.minInputWidth ?? lineWidth * 0.15;
  const minOutput = opts.minOutputWidth ?? lineWidth * 0.85;
  const strat = makeBeadingStrategy({
    optimalWidth: lineWidth,
    splitMidThreshold: opts.split ?? 0.5,
    addMidThreshold: opts.add ?? 0.5,
    distributionRadius: opts.distributionRadius ?? 2,
    minInputWidth: minInput,
    minOutputWidth: minOutput,
  });
  const maxBeads = opts.maxBeads ?? 6;
  // Centrelines: the exact Voronoi/Delaunay medial axis (converges to
  // BambuStudio's segment-Voronoi skeleton — ~1% width error vs the raster
  // grid's ~15%) is OPT-IN (opts.voronoi) until the junction-connection stage
  // that stitches its branches into continuous wall loops is ported; until then
  // the grid distance-transform ridge is the robust default.
  let centerlines = opts.voronoi === true ? medialAxis(region, lineWidth) : null;
  if (!centerlines || !centerlines.length) {
    const maxRF = maxBeads * 0.5 + 0.35;
    const minRF = Math.max(0.05, (minInput / 2) / lineWidth);
    centerlines = medialBeads(region, lineWidth, lineWidth / 2, maxRF, minRF);
  }
  const out = [];
  for (const cl of centerlines) {
    const pts = cl.pts, thick = cl.widths;      // thick[k] = 2*distance = local width
    // Representative bead count from the median local width (avoids per-point
    // count flips that would fragment the beads; widths still adapt per point).
    const sorted = thick.slice().sort((a, b) => a - b);
    const medW = sorted[sorted.length >> 1];
    const n = Math.max(1, Math.min(maxBeads, strat.getOptimalBeadCount(medW)));
    if (n === 1) {
      // Single bead: apply the widening strategy so a sub-min_bead_width wall is
      // printed at min_output_width (not left as a hairline that won't extrude).
      const w = thick.map((t) => { const c = strat.compute(t, 1); return c.widths.length ? c.widths[0] : Math.max(t, minOutput); });
      out.push({ pts, widths: w });
      continue;
    }
    const normals = perpNormals(pts);
    const beadPts = Array.from({ length: n }, () => []);
    const beadWid = Array.from({ length: n }, () => []);
    for (let k = 0; k < pts.length; k++) {
      const t = thick[k];
      const { widths, locations } = strat.compute(t, n);
      const nx = normals[k][0], ny = normals[k][1], px = pts[k][0], py = pts[k][1];
      for (let i = 0; i < n; i++) {
        // A thin point yields fewer beads than the component count (the widening
        // strategy collapses to one bead below optimal width) — skip the missing
        // outer beads there instead of reading undefined → NaN.
        if (locations[i] == null || widths[i] == null) continue;
        const off = locations[i] - t / 2;       // signed offset from the centreline
        beadPts[i].push([px + nx * off, py + ny * off]);
        beadWid[i].push(widths[i]);
      }
    }
    for (let i = 0; i < n; i++) if (beadPts[i].length >= 2) out.push({ pts: beadPts[i], widths: beadWid[i] });
  }
  return out;
}

/**
 * connectJunctions (Arachne) adapted to the medial graph: turn the medial
 * centrelines into CONTINUOUS, CLOSED variable-width wall loops instead of the
 * fragmented per-bead segments arachneBeads emits.
 *
 * The beading places N beads across the local width; by symmetry bead p and
 * bead N-1-p are the SAME perimeter on the two sides of the medial axis. So
 * perimeter p is one closed loop: walk side A (bead p) forward, wrap at the far
 * tip, walk side B (bead N-1-p) back, wrap at the near tip. The central bead
 * (odd N) stays a single open axis bead. Widths stay variable per point. This
 * is the connectJunctions goal — same-perimeter junctions stitched into
 * ExtrusionLine loops — realised on the Voronoi/Delaunay medial axis.
 *
 * @returns {{pts:number[][], widths:number[], closed:boolean}[]}
 */
// One medial CHAIN → its closed variable-width wall loops (perimeter p pairs
// bead p with bead N-1-p; central bead stays an open axis bead).
function chainWallLoops(cl, strat, maxBeads, minOutput) {
  const out = [];
  const pts = cl.pts, thick = cl.widths;
  if (pts.length < 2) return out;
  const sorted = thick.slice().sort((a, b) => a - b);
  const N = Math.max(1, Math.min(maxBeads, strat.getOptimalBeadCount(sorted[sorted.length >> 1])));
  const normals = perpNormals(pts);
  const half = Math.ceil(N / 2);
  for (let p = 0; p < half; p++) {
    const q = N - 1 - p;
    if (p === q) {
      const cp = [], cw = [];
      for (let k = 0; k < pts.length; k++) { const c = strat.compute(thick[k], N); const wv = c.widths[p]; if (wv != null && wv > 0) { cp.push(pts[k].slice()); cw.push(wv); } }
      if (cp.length >= 2) out.push({ pts: cp, widths: cw, closed: false });
      continue;
    }
    const sideA = [], sideB = [], wA = [], wB = [];
    for (let k = 0; k < pts.length; k++) {
      const t = thick[k];
      const { widths, locations } = strat.compute(t, N);
      if (locations[p] == null || locations[q] == null || !(widths[p] > 0) || !(widths[q] > 0)) continue;
      const nx = normals[k][0], ny = normals[k][1], px = pts[k][0], py = pts[k][1];
      sideA.push([px + nx * (locations[p] - t / 2), py + ny * (locations[p] - t / 2)]); wA.push(widths[p]);
      sideB.push([px + nx * (locations[q] - t / 2), py + ny * (locations[q] - t / 2)]); wB.push(widths[q]);
    }
    if (sideA.length < 2) continue;
    out.push({ pts: [...sideA, ...sideB.reverse()], widths: [...wA, ...wB.reverse()], closed: true });
  }
  return out;
}

export function arachneWalls(region, lineWidth, opts = {}) {
  const minInput = opts.minInputWidth ?? lineWidth * 0.15;
  const minOutput = opts.minOutputWidth ?? lineWidth * 0.85;
  const strat = makeBeadingStrategy({
    optimalWidth: lineWidth,
    splitMidThreshold: opts.split ?? 0.5,
    addMidThreshold: opts.add ?? 0.5,
    distributionRadius: opts.distributionRadius ?? 2,
    minInputWidth: minInput, minOutputWidth: minOutput,
  });
  const maxBeads = opts.maxBeads ?? 6;
  const out = [];
  // CROSS-CHAIN connectJunctions: offset the whole region inward level by level
  // — each level is a UNIFIED iso-contour loop across every medial branch, so a
  // convex outline's corner branches never emit their own overlapping loops
  // (the per-chain double-cover). When an island is too thin for a full bead,
  // its thin core is filled with the per-chain medial wall loops (clean there).
  let cur = [{ outer: region.outer, holes: (region.holes || []).map((h) => h.slice()) }];
  let guard = 0;
  while (cur.length && guard++ < maxBeads + 2) {
    const next = [];
    for (const isl of cur) {
      if (!isl.outer || isl.outer.length < 3) continue;
      const inner = clipExpand([isl], -lineWidth);           // material left after one full bead
      if (inner.length) {
        const centres = clipExpand([isl], -lineWidth / 2);   // this bead's centreline loop(s)
        for (const c of centres) {
          if (c.outer && c.outer.length >= 3) out.push({ pts: c.outer, widths: c.outer.map(() => lineWidth), closed: true });
          for (const h of c.holes || []) if (h.length >= 3) out.push({ pts: h, widths: h.map(() => lineWidth), closed: true });
        }
        for (const inr of inner) next.push(inr);
      } else {
        for (const cl of medialAxis(isl, lineWidth)) for (const w of chainWallLoops(cl, strat, maxBeads, minOutput)) out.push(w);
      }
    }
    cur = next;
  }
  return out;
}
