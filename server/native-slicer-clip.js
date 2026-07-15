/**
 * Native Slicer — polygon boolean operations (the clipper the engine lacked).
 *
 * The rest of the engine only offsets polygons (`offsetPolygon`); it had no way
 * to compute the DIFFERENCE / INTERSECTION / UNION of two regions. That gap is
 * why thin necks in mixed thick/thin parts couldn't be separated from the thick
 * core cleanly (needed for full-Arachne beading without double-extrusion).
 *
 * Rather than add a dependency, this wraps @jscad/modeling's robust 2D booleans
 * (already a project dependency) and adapts them to the engine's region format
 * `{ outer:number[][], holes:number[][][] }`. A boolean can yield several
 * disjoint regions, so every op returns an ARRAY of regions.
 */

import jscad from '@jscad/modeling';
import { buildRegions, _signedArea } from './native-slicer-geo.js';

const { geom2 } = jscad.geometries;
const { subtract, union, intersect } = jscad.booleans;

// @jscad's geom2.fromPoints wants a CCW outline for a solid; a CW loop would
// build an inverted (infinite) geometry. Normalise winding before handing over.
function ccw(poly) {
  return _signedArea(poly) < 0 ? poly.slice().reverse() : poly;
}

/** Engine region → a @jscad geom2 (outer solid with holes carved out). */
function toGeom2(region) {
  if (!region || !region.outer || region.outer.length < 3) return null;
  let g = geom2.fromPoints(ccw(region.outer));
  for (const h of region.holes || []) {
    if (h && h.length >= 3) g = subtract(g, geom2.fromPoints(ccw(h)));
  }
  return g;
}

/** @jscad geom2 → engine regions (outer/holes classified by containment). */
function fromGeom2(g) {
  const outlines = geom2.toOutlines(g).filter((o) => o.length >= 3);
  if (!outlines.length) return [];
  // toOutlines returns [x,y] pairs already; buildRegions nests them by depth.
  return buildRegions(outlines.map((o) => o.map((p) => [p[0], p[1]])));
}

const asList = (x) => (Array.isArray(x) ? x : [x]);

/**
 * a MINUS b. `b` may be a single region or an array of regions.
 * @returns {{outer:number[][], holes:number[][][]}[]} disjoint result regions
 */
export function regionDifference(a, b) {
  const ga = toGeom2(a); if (!ga) return [];
  let g = ga;
  for (const rb of asList(b)) { const gb = toGeom2(rb); if (gb) g = subtract(g, gb); }
  return fromGeom2(g);
}

/** Union of many regions into (possibly several) merged regions. */
export function regionUnion(regions) {
  const gs = asList(regions).map(toGeom2).filter(Boolean);
  if (!gs.length) return [];
  let g = gs[0];
  for (let i = 1; i < gs.length; i++) g = union(g, gs[i]);
  return fromGeom2(g);
}

/** Intersection of a with b (b single region or array — intersected in turn). */
export function regionIntersection(a, b) {
  const ga = toGeom2(a); if (!ga) return [];
  let g = ga;
  for (const rb of asList(b)) { const gb = toGeom2(rb); if (!gb) return []; g = intersect(g, gb); }
  return fromGeom2(g);
}
