// native-slicer-lightning.js — Lightning infill: a tree-like sparse infill that
// only grows where it must support a top/overhang surface, branching down and
// out toward the walls. Uses far less material than uniform infill because the
// deep interior stays hollow. Built top-down over the sliced layer regions.

import { _pointInPoly } from './native-slicer-geo.js';

function inModel(x, y, regions) {
  for (const r of regions) {
    if (!_pointInPoly([x, y], r.outer)) continue;
    let inHole = false;
    for (const h of r.holes || []) if (_pointInPoly([x, y], h)) { inHole = true; break; }
    if (!inHole) return true;
  }
  return false;
}

/**
 * @param {Array<Array<{outer:number[][], holes:number[][]}>>} layerRegions
 * @param {{lineWidth?:number, density?:number}} opts
 * @returns {Array<Array<[number,number][]>>} per-layer line segments
 */
export function generateLightning(layerRegions, opts = {}) {
  const n = layerRegions.length;
  const empty = Array.from({ length: n }, () => []);
  if (n < 2) return empty;
  const lineWidth = opts.lineWidth ?? 0.4;
  const density = Math.min(0.4, Math.max(0.03, opts.density ?? 0.12));
  const gridRes = Math.max(lineWidth * 2, lineWidth / density);

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const regions of layerRegions) for (const r of regions) for (const [x, y] of r.outer) {
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  if (!Number.isFinite(minX)) return empty;
  minX -= gridRes; minY -= gridRes; maxX += gridRes; maxY += gridRes;
  const cols = Math.max(1, Math.ceil((maxX - minX) / gridRes));
  const rows = Math.max(1, Math.ceil((maxY - minY) / gridRes));
  const cx = (c) => minX + (c + 0.5) * gridRes;
  const cy = (r) => minY + (r + 0.5) * gridRes;

  // Model presence per layer.
  const model = new Array(n);
  for (let i = 0; i < n; i++) {
    const g = new Uint8Array(cols * rows), regs = layerRegions[i];
    if (regs.length) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (inModel(cx(c), cy(r), regs)) g[r * cols + c] = 1;
    model[i] = g;
  }

  // Distance (in cells) to the nearest wall, via multi-source BFS from the
  // model's boundary cells. Interior cells get a larger value; wall cells 0.
  const distField = (g) => {
    const dist = new Int32Array(cols * rows).fill(-1);
    const q = [];
    for (let idx = 0; idx < g.length; idx++) {
      if (!g[idx]) continue;
      const r = (idx / cols) | 0, c = idx % cols;
      const bnd = c === 0 || c === cols - 1 || r === 0 || r === rows - 1 || !g[idx - 1] || !g[idx + 1] || !g[idx - cols] || !g[idx + cols];
      if (bnd) { dist[idx] = 0; q.push(idx); }
    }
    for (let head = 0; head < q.length; head++) {
      const idx = q[head], r = (idx / cols) | 0, c = idx % cols, d = dist[idx];
      const nbs = [c > 0 ? idx - 1 : -1, c < cols - 1 ? idx + 1 : -1, r > 0 ? idx - cols : -1, r < rows - 1 ? idx + cols : -1];
      for (const nb of nbs) { if (nb >= 0 && g[nb] && dist[nb] < 0) { dist[nb] = d + 1; q.push(nb); } }
    }
    return dist;
  };

  const segs = Array.from({ length: n }, () => []);
  let active = new Set();     // interior cells whose tree continues below
  for (let i = n - 1; i >= 0; i--) {
    const g = model[i], above = model[i + 1];
    const dist = distField(g);
    // New roots: cells that are a top/overhang surface here (nothing above).
    for (let idx = 0; idx < g.length; idx++) if (g[idx] && (i === n - 1 || !above[idx])) active.add(idx);
    const next = new Set();
    for (const idx of active) {
      if (!g[idx]) continue;                       // left the model — drop
      const d = dist[idx];
      if (d <= 0) continue;                         // reached a wall — supported
      const r = (idx / cols) | 0, c = idx % cols;
      // Step one cell toward the wall (steepest distance descent).
      let best = idx, bd = d;
      const nbs = [c > 0 ? idx - 1 : -1, c < cols - 1 ? idx + 1 : -1, r > 0 ? idx - cols : -1, r < rows - 1 ? idx + cols : -1];
      for (const nb of nbs) { if (nb >= 0 && g[nb] && dist[nb] >= 0 && dist[nb] < bd) { bd = dist[nb]; best = nb; } }
      if (best === idx) continue;
      const br = (best / cols) | 0, bc = best % cols;
      segs[i].push([[cx(c), cy(r)], [cx(bc), cy(br)]]);
      next.add(best);                               // carry the moved node down (Set → trunk merge)
    }
    active = next;
  }
  return segs;
}
