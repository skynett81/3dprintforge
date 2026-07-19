/**
 * Native Slicer — fast polygon boolean ops (Clipper-backed).
 *
 * The engine derives its fill surfaces (top / bottom / internal-solid / sparse /
 * bridge) as actual POLYGON regions the way libslic3r does — via boolean
 * operations between a layer's slices and its neighbours — instead of a coarse
 * raster grid. That needs fast, robust intersection/difference/union of
 * {outer, holes} regions. clipper-lib (already a dependency for offsetting)
 * does exactly this in integer coordinates; ~0.05 ms per op.
 *
 * Region format: `{ outer: number[][], holes: number[][][] }`. Every op returns
 * an ARRAY of such regions (a boolean can yield several disjoint pieces, each
 * possibly with holes). Empty input/results yield [].
 */

import ClipperLib from 'clipper-lib';

const S = 1e5;   // mm → integer scale (0.01 µm), matches the offset module

const toPath = (poly) => poly.map(([x, y]) => ({ X: Math.round(x * S), Y: Math.round(y * S) }));
const fromPath = (p) => p.map((pt) => [pt.X / S, pt.Y / S]);

/** Add a region (outer + holes) as one polygon set of the given Clipper type. */
function addRegion(clipper, region, ptype) {
  if (!region || !region.outer || region.outer.length < 3) return;
  clipper.AddPath(toPath(region.outer), ptype, true);
  for (const h of region.holes || []) if (h && h.length >= 3) clipper.AddPath(toPath(h), ptype, true);
}

/** PolyTree → engine regions (outer with its immediate holes; recurse islands). */
function fromPolyTree(tree) {
  const regions = [];
  const walk = (node) => {
    for (const ch of node.Childs()) {
      if (!ch.IsHole()) {
        const outer = fromPath(ch.Contour());
        const holes = [];
        for (const g of ch.Childs()) {
          if (g.IsHole()) holes.push(fromPath(g.Contour()));
          walk(g);   // islands inside a hole are new solid regions
        }
        if (outer.length >= 3) regions.push({ outer, holes: holes.filter((h) => h.length >= 3) });
      }
    }
  };
  walk(tree);
  return regions;
}

function op(aRegions, bRegions, clipType) {
  const a = (Array.isArray(aRegions) ? aRegions : [aRegions]).filter(Boolean);
  const b = (Array.isArray(bRegions) ? bRegions : [bRegions]).filter(Boolean);
  if (!a.length) return clipType === ClipperLib.ClipType.ctUnion ? bUnionSelf(b) : [];
  const c = new ClipperLib.Clipper();
  for (const r of a) addRegion(c, r, ClipperLib.PolyType.ptSubject);
  for (const r of b) addRegion(c, r, ClipperLib.PolyType.ptClip);
  const sol = new ClipperLib.PolyTree();
  c.Execute(clipType, sol, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return fromPolyTree(sol);
}

// Union a set with itself (used when the difference/intersection subject is empty
// but a union of the clip set is still meaningful).
function bUnionSelf(regions) {
  const rs = regions.filter(Boolean);
  if (rs.length < 2) return rs.map((r) => ({ outer: r.outer.slice(), holes: (r.holes || []).map((h) => h.slice()) }));
  const c = new ClipperLib.Clipper();
  for (const r of rs) addRegion(c, r, ClipperLib.PolyType.ptSubject);
  const sol = new ClipperLib.PolyTree();
  c.Execute(ClipperLib.ClipType.ctUnion, sol, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return fromPolyTree(sol);
}

/** a − b (both a region or an array of regions). */
export function clipDifference(a, b) { return op(a, b, ClipperLib.ClipType.ctDifference); }
/** a ∩ b. */
export function clipIntersection(a, b) { return op(a, b, ClipperLib.ClipType.ctIntersection); }
/** Union of all regions in the list (merges overlaps, resolves holes). */
export function clipUnion(regions) { return bUnionSelf((Array.isArray(regions) ? regions : [regions]).filter(Boolean)); }

/**
 * Grow (or shrink) a list of regions by `delta` mm (miter joins), returning
 * merged {outer,holes} regions. Used to overlap solid surfaces into neighbouring
 * infill (libslic3r EXTERNAL_INFILL_MARGIN) so their fills don't leave a seam gap.
 */
export function clipExpand(regions, delta) {
  const rs = (Array.isArray(regions) ? regions : [regions]).filter(Boolean);
  if (!rs.length || !delta) return rs.map((r) => ({ outer: r.outer.slice(), holes: (r.holes || []).map((h) => h.slice()) }));
  const co = new ClipperLib.ClipperOffset(2, 0.25 * S);
  for (const r of rs) {
    co.AddPath(r.outer.map(([x, y]) => ({ X: Math.round(x * S), Y: Math.round(y * S) })), ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    for (const h of r.holes || []) co.AddPath(h.map(([x, y]) => ({ X: Math.round(x * S), Y: Math.round(y * S) })), ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
  }
  const sol = new ClipperLib.PolyTree();
  co.Execute(sol, delta * S);
  return fromPolyTree(sol);
}

/** Total signed-area magnitude of a region list (mm²) — for emptiness/coverage tests. */
export function regionsArea(regions) {
  let a = 0;
  for (const r of (Array.isArray(regions) ? regions : [regions])) {
    if (!r || !r.outer) continue;
    const area = (poly) => { let s = 0; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; s += (q[0] - p[0]) * (q[1] + p[1]); } return Math.abs(s / 2); };
    a += area(r.outer);
    for (const h of r.holes || []) a -= area(h);
  }
  return a;
}
