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
  // and the solid/sparse seam is covered (libslic3r EXTERNAL_INFILL_MARGIN). A
  // HALF line width is enough to bond the two without a visible seam; a full
  // line double-extrudes the whole overlap and, where solid patches are closer
  // than the grow distance (dense dividers), merges them across the sparse gap.
  const margin = Math.max(0, (opts.lineWidth ?? 0.42) * (opts.solidMarginFactor ?? 0.5));
  // Minimum solid strip half-width — strips narrower than this are grown so a
  // rectilinear line fits and the surface stays opaque. One line width: strips
  // below ~one line can't print opaque and get widened, but a genuine sloped
  // top-shell band (already 2-3 lines wide on a 45-degree face) is left alone.
  // 1.5x over-grew those bands ~37% vs BambuStudio on angled surfaces.
  const widen = Math.max(0, (opts.lineWidth ?? 0.42) * (opts.solidWidenFactor ?? 1));

  const slices = layerRegions.map((r) => (r && r.length ? r : EMPTY));
  // Boolean ops on near-identical faceted outlines (e.g. a cylinder wall) leave
  // hairline sliver polygons: non-zero region COUNT but ~zero area. If they are
  // treated as real exposed skin the widen step below inflates them into a solid
  // ring on every layer. Drop any region narrower than a fraction of a line so
  // only genuine exposed surfaces survive (libslic3r discards sub-EPSILON areas).
  const minArea = Math.max(0.04, (opts.lineWidth ?? 0.42) ** 2 * 0.5);
  // A real internal bridge spans a gap and is BROAD. Thin staircase strips on a
  // sloped top surface are supported at the wall and don't span — eroding by
  // ~1.5 line widths makes them vanish, so they fall back to solid infill
  // (matching BambuStudio, which lays sloped tops as solid, not bridge).
  const ibErode = (opts.lineWidth ?? 0.42) * 1.5;
  const prune = (regs) => (regs && regs.length ? regs.filter((r) => Math.abs(polyArea(r.outer) - (r.holes || []).reduce((a, h) => a + Math.abs(polyArea(h)), 0)) >= minArea) : EMPTY);
  // Morphological OPEN (erode then dilate) on the exposed skin — libslic3r's
  // offset2(-w,+w) surface filter. A faceted VERTICAL wall never slices to the
  // exact same outline twice: consecutive layers wobble ~0.1 mm, so the
  // layer-to-layer difference is a hairline ring on BOTH the top and bottom
  // side of every layer. Area-pruning can't kill it (a ring around a large
  // perimeter has real area), but it is far narrower than an extrusion line, so
  // an open by a fraction of a line width dissolves it while a genuine exposed
  // surface — always at least one full line wide — survives intact. Without this
  // every faceted wall grows a solid+bridge shell on every layer (18x too much).
  // Kept below half a line so a real one-line-wide top rim is still retained.
  const openW = Math.max(0, (opts.lineWidth ?? 0.42) * (opts.solidOpenFactor ?? 0.34));
  const openSkin = (regs) => {
    if (!regs || !regs.length || openW <= 0) return regs || EMPTY;
    const opened = clipExpand(clipExpand(regs, -openW), openW);
    return opened.length ? opened : EMPTY;
  };
  // Directly-exposed skin per layer. Preferred source: NORMAL-based facet
  // projection (opts.faceTop/faceBottom) — near-horizontal roof/floor facets
  // only, so a sloped or angled wall is NOT mistaken for a top/bottom surface.
  // The union of a layer's qualifying facets is clipped to that layer's slice
  // (facets can overhang the outline slightly) then pruned/opened as before.
  // Fallback (no facet data): the classic 2D layer-difference, which over-counts
  // slopes but keeps behaviour for callers that don't supply the mesh facets.
  const faceTop = opts.faceTop, faceBottom = opts.faceBottom;
  const faceUnion = (tris) => (tris && tris.length ? clipUnion(tris.map(clone)) : EMPTY);
  // Real skin = ACTUALLY EXPOSED (2D difference vs the neighbour layer) AND
  // near-horizontal-facing (facet normal). The 2D term drops internal interfaces
  // that have material above/below (e.g. a multi-material colour boundary); the
  // facet term drops sloped/vertical walls that shrink the outline but are just
  // perimeters. Their intersection is exactly BambuStudio's top/bottom skin.
  const topExposed = new Array(n);
  const bottomExposed = new Array(n);
  for (let i = 0; i < n; i++) {
    let te = i + 1 < n ? clipDifference(slices[i], slices[i + 1]) : slices[i].map(clone);
    let be = i - 1 >= 0 ? clipDifference(slices[i], slices[i - 1]) : slices[i].map(clone);
    if (faceTop) { const fu = faceUnion(faceTop[i]); te = (te.length && fu.length) ? clipIntersection(te, fu) : EMPTY; }
    if (faceBottom) { const fu = faceUnion(faceBottom[i]); be = (be.length && fu.length) ? clipIntersection(be, fu) : EMPTY; }
    topExposed[i] = openSkin(prune(te));
    bottomExposed[i] = openSkin(prune(be));
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
  // Only a genuine FLAT top-shell BOTTOM qualifies: the solid-over-sparse area
  // must sit DIRECTLY below the exposed top surface (the flat top skin a few
  // layers up projects straight down onto it). A sloped skin's exposed top is
  // shifted up-and-in each layer, so it does not sit above this floor and is
  // correctly rejected. BambuStudio likewise bridges only flat solid-over-
  // infill, never a diagonal skin. Match against the exposed top within the
  // top-shell window above (union), so the exact shell depth need not line up.
  const topExposedAbove = new Array(n);
  for (let i = 0; i < n; i++) {
    let acc = EMPTY;
    for (let k = 1; k < Math.max(1, topLayers); k++) {
      const j = i + k; if (j >= n) break;
      if (topExposed[j] && topExposed[j].length) acc = acc.length ? clipUnion([...acc, ...topExposed[j]]) : topExposed[j];
    }
    topExposedAbove[i] = acc;
  }
  const internalBridge = new Array(n);
  for (let i = 0; i < n; i++) {
    if (i === 0 || !solid[i].length || !slices[i - 1].length || !topExposedAbove[i].length) { internalBridge[i] = EMPTY; continue; }
    const notSolidBelow = solid[i - 1].length ? clipDifference(solid[i], solid[i - 1]) : solid[i].map(clone);
    const overSparse = notSolidBelow.length ? clipIntersection(notSolidBelow, slices[i - 1]) : EMPTY;
    const ibRaw = overSparse.length ? prune(clipIntersection(overSparse, topExposedAbove[i])) : EMPTY;
    // Keep only regions broad enough to be a genuine bridge; drop thin ledges.
    internalBridge[i] = ibRaw.length ? ibRaw.filter((r) => clipExpand([r], -ibErode).length) : EMPTY;
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
