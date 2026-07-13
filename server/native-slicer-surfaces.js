/**
 * Native Slicer — top/bottom surface detection.
 *
 * A real slicer makes infill solid wherever a layer is a *surface* — the
 * top of the part, the bottom, or any horizontal face over a hole or step —
 * not just the first/last N layers globally. We approximate this by
 * rasterising each layer's solid area on a coarse grid and marking a cell
 * solid when, within `topLayers` above or `bottomLayers` below, the column
 * is exposed to air. The pipeline then classifies each infill line by the
 * grid and hatches solid vs sparse accordingly.
 */

import { _pointInPoly } from './native-slicer-geo.js';

function inModelAt(pt, regions) {
  for (const r of regions) {
    if (_pointInPoly(pt, r.outer)) {
      let hole = false;
      for (const h of r.holes || []) if (_pointInPoly(pt, h)) { hole = true; break; }
      if (!hole) return true;
    }
  }
  return false;
}

/**
 * @param {Array<Array<{outer:number[][],holes:number[][][]}>>} layerRegions
 * @param {object} opts gridRes (mm), topLayers, bottomLayers
 * @returns {{ isSolidPoint(i:number,x:number,y:number):boolean, cols:number, rows:number }}
 */
export function buildSurfaceClassifier(layerRegions, opts = {}) {
  const gridRes = opts.gridRes ?? 2;
  const topLayers = Math.max(0, opts.topLayers ?? 4);
  const bottomLayers = Math.max(0, opts.bottomLayers ?? 4);
  const n = layerRegions.length;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const regions of layerRegions) {
    for (const r of regions) {
      for (const [x, y] of r.outer) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  if (!Number.isFinite(minX)) {
    return { isSolidPoint: () => true, cols: 0, rows: 0 };
  }
  minX -= gridRes; minY -= gridRes; maxX += gridRes; maxY += gridRes;
  const cols = Math.max(1, Math.ceil((maxX - minX) / gridRes));
  const rows = Math.max(1, Math.ceil((maxY - minY) / gridRes));
  const cx = (c) => minX + (c + 0.5) * gridRes;
  const cy = (r) => minY + (r + 0.5) * gridRes;

  // Rasterise model presence per layer.
  const model = new Array(n);
  for (let i = 0; i < n; i++) {
    const grid = new Uint8Array(cols * rows);
    const regions = layerRegions[i];
    if (regions.length) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (inModelAt([cx(c), cy(r)], regions)) grid[r * cols + c] = 1;
        }
      }
    }
    model[i] = grid;
  }

  // Classify solid surface cells.
  const solid = new Array(n);
  for (let i = 0; i < n; i++) {
    const s = new Uint8Array(cols * rows);
    const here = model[i];
    const globalEdge = i < bottomLayers || i >= n - topLayers;
    for (let idx = 0; idx < s.length; idx++) {
      if (!here[idx]) continue;                  // only model cells matter
      let isSolid = globalEdge;
      for (let k = 1; k <= topLayers && !isSolid; k++) {   // exposed above → top surface
        const j = i + k;
        if (j >= n || !model[j][idx]) isSolid = true;
      }
      for (let k = 1; k <= bottomLayers && !isSolid; k++) { // exposed below → bottom surface
        const j = i - k;
        if (j < 0 || !model[j][idx]) isSolid = true;
      }
      s[idx] = isSolid ? 1 : 0;
    }
    solid[i] = s;
  }

  return {
    cols, rows,
    isSolidPoint(i, x, y) {
      if (i < 0 || i >= n) return true;
      const c = Math.floor((x - minX) / gridRes);
      const r = Math.floor((y - minY) / gridRes);
      if (c < 0 || r < 0 || c >= cols || r >= rows) return false;
      return !!solid[i][r * cols + c];
    },
  };
}
