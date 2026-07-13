/**
 * Native Slicer — support generation.
 *
 * Pragmatic pure-JS supports: rasterise each layer's solid area onto a
 * coarse grid, then grow support columns downward from any cell that
 * carries model above it but is empty itself (an overhang) all the way
 * to the bed. Emit the support mask per layer as sparse hatch lines.
 *
 * This is deliberately simple (grid pillars, no interface/tree), but it
 * is real, automatic, and printable — enough to hold up overhangs on
 * simple-to-medium parts entirely within our own engine.
 */

import { _pointInPoly, offsetPolygon, _chainSegments } from './native-slicer-geo.js';

/** Is a point inside the region's solid (inside outer, outside holes)? */
function inRegion(pt, region) {
  if (!_pointInPoly(pt, region.outer)) return false;
  for (const h of region.holes || []) if (_pointInPoly(pt, h)) return false;
  return true;
}

function inModelAt(pt, regions) {
  for (const r of regions) if (inRegion(pt, r)) return true;
  return false;
}

/**
 * @param {Array<Array<{outer:number[][],holes:number[][][]}>>} layerRegions
 * @param {object} opts lineWidth, gridRes (mm), density (0..1),
 *   xyGap (mm clearance around the model), maxOverhang (cells wider than
 *   this beyond the part still get support; kept simple = always).
 * @returns {Array<number[][][]>} per-layer array of [ [x1,y1],[x2,y2] ] segments
 */
export function generateSupports(layerRegions, opts = {}) {
  const lineWidth = opts.lineWidth ?? 0.4;
  const gridRes = opts.gridRes ?? 2;
  const density = Math.min(1, Math.max(0.05, opts.density ?? 0.2));
  const xyGap = opts.xyGap ?? 0.8;
  const n = layerRegions.length;
  const empty = Array.from({ length: n }, () => []);
  if (n < 2) return empty;

  // Bounding box across all layers.
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const regions of layerRegions) {
    for (const r of regions) {
      for (const [x, y] of r.outer) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  if (!Number.isFinite(minX)) return empty;
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

  // Threshold angle (from vertical): an overhang only starts a NEW support
  // column when the model above is NOT self-supported. `thresholdAngle` 0
  // means "support every overhang" (legacy). Because the grid step is far
  // larger than the layer height, a single-layer neighbour test can't resolve
  // the angle — so we walk DOWN a widening cone (radius = depth·layerHeight·
  // tan(angle)) and call the overhang self-supported if solid material is
  // found inside that cone before it fades out. Material reachable within the
  // threshold cone can carry the overhang; material only beyond it cannot.
  const layerHeight = opts.layerHeight ?? 0.2;
  const thresholdAngle = Math.max(0, Math.min(89, opts.thresholdAngle ?? 0));
  const useThreshold = thresholdAngle > 0;
  const reachPerLayer = layerHeight * Math.tan(thresholdAngle * Math.PI / 180);  // mm/layer
  const checkDepth = useThreshold ? Math.min(40, Math.max(1, Math.ceil(gridRes / Math.max(1e-3, reachPerLayer)))) : 0;
  const selfSupported = (i, idx) => {
    if (!useThreshold) return false;
    const c0 = idx % cols, r0 = (idx / cols) | 0;
    for (let k = 1; k <= checkDepth; k++) {
      const j = i - k; if (j < 0) break;               // hit the bed → unsupported
      const rc = Math.round((k * reachPerLayer) / gridRes);
      const grid = model[j];
      for (let dr = -rc; dr <= rc; dr++) {
        for (let dc = -rc; dc <= rc; dc++) {
          const rr = r0 + dr, cc = c0 + dc;
          if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
          if (grid[rr * cols + cc]) return true;        // material inside the cone below
        }
      }
    }
    return false;
  };

  // Grow support columns downward from overhangs.
  const support = new Array(n);
  support[n - 1] = new Uint8Array(cols * rows);
  for (let i = n - 2; i >= 0; i--) {
    const s = new Uint8Array(cols * rows);
    const here = model[i], above = model[i + 1], supAbove = support[i + 1];
    for (let idx = 0; idx < s.length; idx++) {
      if (here[idx]) continue;
      // Continue an existing column, or start one under a true (non-self-
      // supported) overhang.
      if (supAbove[idx] || (above[idx] && !selfSupported(i, idx))) s[idx] = 1;
    }
    support[i] = s;
  }

  // Z-gap: clear the top `zGapLayers` of support directly beneath an
  // overhang so the support doesn't fuse to the part and lifts off cleanly.
  const zGap = Math.max(0, Math.round(opts.zGapLayers ?? 1));
  if (zGap > 0) {
    for (let i = 0; i < n; i++) {
      const s = support[i]; if (!s) continue;
      const cleared = s.slice();
      for (let idx = 0; idx < s.length; idx++) {
        if (!s[idx]) continue;
        for (let k = 1; k <= zGap; k++) {
          const j = i + k;
          if (j < n && model[j][idx]) { cleared[idx] = 0; break; }   // model within the gap above
        }
      }
      support[i] = cleared;
    }
  }

  // Clear cells too close to the model (xy clearance) so supports don't
  // fuse to walls — a cell within one grid step of model is dropped.
  const gapCells = Math.max(0, Math.round(xyGap / gridRes));
  if (gapCells > 0) {
    for (let i = 0; i < n; i++) {
      const s = support[i], here = model[i];
      const cleared = s.slice();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!s[r * cols + c]) continue;
          let nearModel = false;
          for (let dr = -gapCells; dr <= gapCells && !nearModel; dr++) {
            for (let dc = -gapCells; dc <= gapCells; dc++) {
              const rr = r + dr, cc = c + dc;
              if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
              if (here[rr * cols + cc]) { nearModel = true; break; }
            }
          }
          if (nearModel) cleared[r * cols + c] = 0;
        }
      }
      support[i] = cleared;
    }
  }

  // Support on build plate only: drop any column that would rest on the model
  // (i.e. has model somewhere below it) rather than reaching the bed.
  if (opts.onPlateOnly) {
    const modelBelow = new Uint8Array(cols * rows);
    for (let i = 0; i < n; i++) {
      const s = support[i], here = model[i];
      for (let idx = 0; idx < s.length; idx++) {
        if (modelBelow[idx] && s[idx]) s[idx] = 0;
        if (here[idx]) modelBelow[idx] = 1;
      }
    }
  }

  // Interface cells: the top `interfaceLayers` of each column, just below
  // the Z-gap under the overhang. Filled solid for a smoother underside.
  const interfaceLayers = Math.max(0, Math.round(opts.interfaceLayers ?? 2));
  const iface = new Array(n);
  for (let i = 0; i < n; i++) {
    const s = support[i];
    const grid = new Uint8Array(cols * rows);
    if (interfaceLayers > 0 && s) {
      for (let idx = 0; idx < s.length; idx++) {
        if (!s[idx]) continue;
        for (let k = 1; k <= interfaceLayers; k++) {
          const j = i + zGap + k;             // first model layer sits above the gap
          if (j < n && model[j][idx]) { grid[idx] = 1; break; }
        }
      }
    }
    iface[i] = grid;
  }

  // Walls around the support island: trace the mask's boundary (edges between
  // an on-cell and an off-cell), chain into loops, and add `wallCount` loops
  // stepping inward. Gives the support columns a perimeter for strength and
  // clean removal. Returns closed loops in world coordinates.
  const wallCount = Math.max(0, Math.round(opts.wallCount ?? 0));
  const maskWalls = (mask) => {
    if (!wallCount) return [];
    const on = (r, c) => (r >= 0 && c >= 0 && r < rows && c < cols) ? mask[r * cols + c] : 0;
    const g = gridRes;
    const segs = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!mask[r * cols + c]) continue;
        const x0 = cx(c) - g / 2, x1 = cx(c) + g / 2, y0 = cy(r) - g / 2, y1 = cy(r) + g / 2;
        if (!on(r, c - 1)) segs.push([[x0, y0], [x0, y1]]);
        if (!on(r, c + 1)) segs.push([[x1, y0], [x1, y1]]);
        if (!on(r - 1, c)) segs.push([[x0, y0], [x1, y0]]);
        if (!on(r + 1, c)) segs.push([[x0, y1], [x1, y1]]);
      }
    }
    const loops = _chainSegments(segs);
    const walls = [];
    for (const loop of loops) {
      if (loop.length < 3) continue;
      walls.push(loop);
      let ring = loop;
      for (let w = 1; w < wallCount; w++) { ring = offsetPolygon(ring, -lineWidth); if (!ring || ring.length < 3) break; walls.push(ring); }
    }
    return walls;
  };

  // Convert each layer's mask to horizontal hatch lines. Normal support is
  // sparse (row step = lineWidth / density); interface cells fill every row.
  const step = Math.max(1, Math.round((lineWidth / density) / gridRes));
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const s = support[i];
    const inf = iface[i];
    const parts = [];
    for (const loop of maskWalls(s)) parts.push({ pts: loop, closed: true });
    for (let r = 0; r < rows; r++) {
      const dense = r % step === 0;
      let runStart = -1;
      for (let c = 0; c <= cols; c++) {
        const idx = r * cols + c;
        const on = c < cols && s[idx] && (dense || inf[idx]);
        if (on && runStart < 0) runStart = c;
        else if (!on && runStart >= 0) {
          parts.push({ pts: [[cx(runStart), cy(r)], [cx(c - 1), cy(r)]], closed: false });
          runStart = -1;
        }
      }
    }
    out[i] = parts;
  }
  return out;
}
