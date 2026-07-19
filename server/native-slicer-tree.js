// native-slicer-tree.js — Tree / organic supports. Instead of vertical grid
// columns, support "tips" sprout under overhangs and, descending layer by layer,
// drift toward one another and merge into fewer, thicker trunks — touching the
// model far less than grid support and peeling off cleanly. Built top-down over
// the sliced layer regions; returns the same per-layer {pts, closed} segments
// the grid generator does, so the emitter is unchanged.

import { _pointInPoly } from './native-slicer-geo.js';

function inModel(x, y, regions) {
  for (const r of regions) {
    if (!_pointInPoly([x, y], r.outer)) continue;
    let hole = false;
    for (const h of r.holes || []) if (_pointInPoly([x, y], h)) { hole = true; break; }
    if (!hole) return true;
  }
  return false;
}

export function generateTreeSupports(layerRegions, opts = {}) {
  const n = layerRegions.length;
  const empty = Array.from({ length: n }, () => []);
  if (n < 2) return empty;
  const gridRes = opts.gridRes ?? 3;
  const zGap = Math.max(0, Math.round(opts.zGapLayers ?? 1));
  const mergeR = Math.max(gridRes * 1.5, (opts.branchMerge ?? 4));   // node merge radius (mm)
  const drift = Math.min(mergeR, (opts.branchDrift ?? gridRes));     // max horizontal drift per layer (mm)

  // Bounding box + grid.
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
  const model = new Array(n);
  for (let i = 0; i < n; i++) {
    const g = new Uint8Array(cols * rows), regs = layerRegions[i];
    if (regs.length) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (inModel(cx(c), cy(r), regs)) g[r * cols + c] = 1;
    model[i] = g;
  }

  // "On build plate only": a support tip over a cell that has model somewhere
  // below it could only rest on that model, never reaching the bed — so skip it.
  // modelBelow[i] marks cells with model at any layer strictly below i.
  const onPlateOnly = !!opts.onPlateOnly;
  const modelBelow = new Array(n);
  {
    const cum = new Uint8Array(cols * rows);
    for (let i = 0; i < n; i++) { modelBelow[i] = cum.slice(); const g = model[i]; for (let idx = 0; idx < g.length; idx++) if (g[idx]) cum[idx] = 1; }
  }

  // Cluster nodes greedily; each cluster is centred on its members' centroid.
  const cluster = (nodes) => {
    const cl = [];
    for (const nd of nodes) {
      let best = null, bestD = mergeR * mergeR;
      for (const k of cl) { const dx = k.x - nd.x, dy = k.y - nd.y, d = dx * dx + dy * dy; if (d < bestD) { bestD = d; best = k; } }
      if (best) { best.members.push(nd); best.sx += nd.x; best.sy += nd.y; best.x = best.sx / best.members.length; best.y = best.sy / best.members.length; }
      else cl.push({ x: nd.x, y: nd.y, sx: nd.x, sy: nd.y, members: [nd] });
    }
    return cl;
  };

  const segs = Array.from({ length: n }, () => []);
  let active = [];            // support trunks continuing downward: {x, y}
  for (let i = n - 1; i >= 0; i--) {
    const g = model[i], above = model[i + 1];
    // New tips: air here, model directly above (overhang underside), respecting
    // the Z-gap so the branch tip doesn't fuse to the part.
    if (i + zGap < n) {
      const gapAbove = model[i + zGap];
      for (let idx = 0; idx < g.length; idx++) if (!g[idx] && above && above[idx] && gapAbove && gapAbove[idx] && !(onPlateOnly && modelBelow[i][idx])) active.push({ x: cx(idx % cols), y: cy((idx / cols) | 0) });
    }
    const clusters = cluster(active);
    const next = [];
    for (const cl of clusters) {
      // A trunk that has drifted into the model rests on it — terminate.
      if (inModel(cl.x, cl.y, layerRegions[i])) continue;
      // Branch lines: each member down to the merged trunk centre (capped drift).
      for (const m of cl.members) {
        let tx = cl.x, ty = cl.y;
        const dx = cl.x - m.x, dy = cl.y - m.y, d = Math.hypot(dx, dy);
        if (d > drift) { tx = m.x + (dx / d) * drift; ty = m.y + (dy / d) * drift; }
        segs[i].push({ pts: [[m.x, m.y], [tx, ty]], closed: false });
      }
      // A small cross marks the trunk cross-section at this layer.
      const h = gridRes * 0.5;
      segs[i].push({ pts: [[cl.x - h, cl.y], [cl.x + h, cl.y]], closed: false });
      segs[i].push({ pts: [[cl.x, cl.y - h], [cl.x, cl.y + h]], closed: false });
      // At the plate, cap with a wider foot; otherwise carry the trunk down.
      if (i === 0) {
        const f = gridRes;
        segs[i].push({ pts: [[cl.x - f, cl.y - f], [cl.x + f, cl.y - f], [cl.x + f, cl.y + f], [cl.x - f, cl.y + f]], closed: true });
      } else next.push({ x: cl.x, y: cl.y });
    }
    active = next;
  }
  return segs;
}
