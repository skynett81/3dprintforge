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
  // Boolean ops on near-identical faceted outlines (e.g. a cylinder wall) leave
  // hairline sliver polygons: non-zero region COUNT but ~zero area. If they are
  // treated as real exposed skin the widen step below inflates them into a solid
  // ring on every layer. Drop any region narrower than a fraction of a line so
  // only genuine exposed surfaces survive (libslic3r discards sub-EPSILON areas).
  const minArea = Math.max(0.04, (opts.lineWidth ?? 0.42) ** 2 * 0.5);
  const prune = (regs) => (regs && regs.length ? regs.filter((r) => Math.abs(polyArea(r.outer) - (r.holes || []).reduce((a, h) => a + Math.abs(polyArea(h)), 0)) >= minArea) : EMPTY);
  // Directly-exposed skin per layer: material here not covered by the neighbour.
  const topExposed = new Array(n);
  const bottomExposed = new Array(n);
  for (let i = 0; i < n; i++) {
    topExposed[i] = i + 1 < n ? prune(clipDifference(slices[i], slices[i + 1])) : slices[i].map(clone);
    bottomExposed[i] = i - 1 >= 0 ? prune(clipDifference(slices[i], slices[i - 1])) : slices[i].map(clone);
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
    // Prune slivers left by the intersect/union accumulation so a hairline
    // artifact can't be treated as (or widened into) a solid shell.
    ts = prune(ts); bs = prune(bs);
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

  // Internal bridge: the part of each layer's solid skin that sits DIRECTLY over
  // sparse infill (solid here, but the layer below is model that is NOT solid).
  // This is the lowest layer of a top shell — it spans the sparse-infill gaps,
  // so BambuStudio prints it as a bridge (bridge flow/speed/angle) to give the
  // top surfaces above it an anchored layer to lay on (bridge_over_infill).
  // Excludes solid-over-air (that is a real bottom-surface bridge handled by the
  // fill's own bridge split) by intersecting with the layer-below slice.
  // Only a genuine top-shell BOTTOM qualifies: the solid must continue on the
  // layer ABOVE too. That keeps flat tops (a multi-layer shell whose lowest
  // layer bridges the infill) but rejects a lone sloped stair-step, whose thin
  // exposed strip is not solid on the next layer up — BambuStudio does not
  // bridge those either.
  const internalBridge = new Array(n);
  for (let i = 0; i < n; i++) {
    if (i === 0 || !solid[i].length || !slices[i - 1].length) { internalBridge[i] = EMPTY; continue; }
    const notSolidBelow = solid[i - 1].length ? clipDifference(solid[i], solid[i - 1]) : solid[i].map(clone);
    const overSparse = notSolidBelow.length ? clipIntersection(notSolidBelow, slices[i - 1]) : EMPTY;
    internalBridge[i] = (overSparse.length && i + 1 < n && solid[i + 1] && solid[i + 1].length)
      ? prune(clipIntersection(overSparse, solid[i + 1])) : EMPTY;
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
    // The internal-bridge part of a solid sub-region (solid over sparse infill).
    internalBridgeIn: (i, region) => (i < 0 || i >= n || !internalBridge[i].length ? EMPTY : clipIntersection([region], internalBridge[i])),
  };
}

function clone(r) { return { outer: r.outer.map((p) => [p[0], p[1]]), holes: (r.holes || []).map((h) => h.map((p) => [p[0], p[1]])) }; }

// Signed shoelace area of a ring (absolute value = enclosed area).
function polyArea(pts) {
  if (!pts || pts.length < 3) return 0;
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]);
  return a / 2;
}

export { regionsArea };
