/**
 * Native Slicer — polygon fill-surface classification (libslic3r-style).
 *
 * Replaces the coarse raster grid (buildSurfaceClassifier) with real POLYGON
 * regions per layer, the way libslic3r's discover_horizontal_shells does. For
 * each layer it derives, as {outer,holes} regions:
 *   - topSolid    : within top_shell_layers below an exposed-top surface
 *   - bottomSolid : within bottom_shell_layers above an exposed-bottom surface
 *   - solid       : union of the two (fully solid skin)
 *   - sparse      : the rest of the layer (gets sparse infill)
 *   - topExposed / bottomExposed : the directly-exposed skin (for monotonic
 *                   top-surface fill, ironing, bridge and surface speeds)
 * Boundaries are exact polygons, so solid/sparse fills are clean and connected
 * instead of a blocky grid mask.
 */

import { clipDifference, clipIntersection, clipUnion, clipExpand, regionsArea } from './native-slicer-bool.js';

const EMPTY = [];

/**
 * @param {Array<Array<{outer:number[][],holes:number[][][]}>>} layerRegions
 * @param {object} opts { topLayers, bottomLayers }
 */
export function buildSolidRegions(layerRegions, opts = {}) {
  const n = layerRegions.length;
  const topLayers = Math.max(0, opts.topLayers ?? 4);
  const bottomLayers = Math.max(0, opts.bottomLayers ?? 4);
  // How far solid surfaces grow into neighbouring infill so their fills overlap
  // and the solid/sparse seam is covered (libslic3r EXTERNAL_INFILL_MARGIN).
  const margin = Math.max(0, opts.lineWidth ?? 0.42);
  // Minimum solid strip half-width — narrower strips get widened so a rectilinear
  // line fits and the surface stays opaque (libslic3r 3·solid_infill_width).
  const widen = Math.max(0, (opts.lineWidth ?? 0.42) * 1.5);

  const slices = layerRegions.map((r) => (r && r.length ? r : EMPTY));
  // Directly-exposed skin per layer: material here not covered by the neighbour.
  const topExposed = new Array(n);
  const bottomExposed = new Array(n);
  for (let i = 0; i < n; i++) {
    topExposed[i] = i + 1 < n ? clipDifference(slices[i], slices[i + 1]) : slices[i].map(clone);
    bottomExposed[i] = i - 1 >= 0 ? clipDifference(slices[i], slices[i - 1]) : slices[i].map(clone);
  }

  const topSolid = new Array(n), bottomSolid = new Array(n), solid = new Array(n), sparse = new Array(n);
  for (let i = 0; i < n; i++) {
    if (!slices[i].length) { topSolid[i] = bottomSolid[i] = solid[i] = sparse[i] = EMPTY; continue; }
    // Top shell: parts of THIS layer that lie under an exposed-top surface within
    // the next `topLayers` layers up (projected down by intersecting with here).
    let ts = EMPTY;
    for (let k = 0; k < topLayers; k++) {
      const j = i + k; if (j >= n) break;
      const contrib = clipIntersection(slices[i], topExposed[j]);
      ts = ts.length ? clipUnion([...ts, ...contrib]) : contrib;
    }
    // Bottom shell: parts under an exposed-bottom surface within the layers below.
    let bs = EMPTY;
    for (let k = 0; k < bottomLayers; k++) {
      const j = i - k; if (j < 0) break;
      const contrib = clipIntersection(slices[i], bottomExposed[j]);
      bs = bs.length ? clipUnion([...bs, ...contrib]) : contrib;
    }
    topSolid[i] = ts; bottomSolid[i] = bs;
    let sol = ts.length && bs.length ? clipUnion([...ts, ...bs]) : (ts.length ? ts : bs);
    // Widen too-narrow solid strips so they hold full infill lines and stay
    // opaque (libslic3r discover_horizontal_shells step 3). Sloped top surfaces
    // are thin stair-step bands; without this the sparse infill shows through
    // them. Only the strips that vanish under an opening are grown, so wide
    // solids are untouched — grabbed area is clipped to the model slice.
    if (widen > 0 && sol.length) {
      const opened = clipExpand(clipExpand(sol, -widen), widen);
      const tooNarrow = clipDifference(sol, opened);
      if (tooNarrow.length) {
        const grown = clipIntersection(clipExpand(tooNarrow, widen), slices[i]);
        if (grown.length) sol = clipUnion([...sol, ...grown]);
      }
    }
    solid[i] = sol;
    sparse[i] = solid[i].length ? clipDifference(slices[i], solid[i]) : slices[i].map(clone);
  }

  // Solid grown into the neighbouring infill (clipped to the slice) so the solid
  // pattern overlaps the sparse and covers their seam. Sparse still fills up to
  // the ORIGINAL solid boundary → a thin overlap band, no gap. Only where there
  // IS adjacent sparse (a real seam), so pure top/bottom shells are unchanged.
  const solidGrown = new Array(n);
  for (let i = 0; i < n; i++) {
    if (!solid[i].length || !margin || !sparse[i].length) { solidGrown[i] = solid[i]; continue; }
    solidGrown[i] = clipIntersection(clipExpand(solid[i], margin), slices[i]);
    if (!solidGrown[i].length) solidGrown[i] = solid[i];
  }

  return {
    n,
    slices,
    topExposed, bottomExposed,
    topSolid, bottomSolid, solid, sparse, solidGrown,
    // Convenience: solid/sparse clipped to a given fill region (inside the walls).
    // solidIn uses the GROWN solid so it overlaps the sparse seam; sparseIn uses
    // the ORIGINAL solid so sparse still fills its full area (thin overlap band).
    solidIn: (i, region) => (i < 0 || i >= n || !solidGrown[i].length ? EMPTY : clipIntersection([region], solidGrown[i])),
    sparseIn: (i, region) => (i < 0 || i >= n ? [clone(region)] : (solid[i].length ? clipDifference([region], solid[i]) : [clone(region)])),
    topExposedIn: (i, region) => (i < 0 || i >= n || !topExposed[i].length ? EMPTY : clipIntersection([region], topExposed[i])),
    bottomExposedIn: (i, region) => (i < 0 || i >= n || !bottomExposed[i].length ? EMPTY : clipIntersection([region], bottomExposed[i])),
  };
}

function clone(r) { return { outer: r.outer.map((p) => [p[0], p[1]]), holes: (r.holes || []).map((h) => h.map((p) => [p[0], p[1]])) }; }

export { regionsArea };
