/**
 * Native Slicer — 2D geometry core.
 *
 * Pure functions that turn a mesh cross-section into printable 2D paths:
 * layer slicing, polygon offset (walls), hole/region grouping, and
 * even-odd infill (sparse + solid). Polygon offset is delegated to the
 * Clipper library (robust integer-coordinate offsetting with miter joins,
 * the same class of algorithm BambuStudio/PrusaSlicer use via ClipperUtils).
 */

import ClipperLib from 'clipper-lib';

export const EPS = 0.001;          // mm tolerance for polygon-loop closure
export const PI = Math.PI;
const MITER_LIMIT = 2;             // cap offset miters so smooth curves don't spike
const CLIP_SCALE = 1e5;            // Clipper works in integers — scale mm up (0.01µm resolution)

// ── Layer slicing ──────────────────────────────────────────────────

/**
 * Slice a mesh at z and return an array of closed polygons (each
 * polygon is an array of [x,y] points).
 */
export function sliceLayer(mesh, z) {
  const segments = [];
  const positions = mesh.positions;
  const indices = mesh.indices;

  for (let f = 0; f < indices.length; f += 3) {
    const i0 = indices[f], i1 = indices[f + 1], i2 = indices[f + 2];
    const a = [positions[3 * i0], positions[3 * i0 + 1], positions[3 * i0 + 2]];
    const b = [positions[3 * i1], positions[3 * i1 + 1], positions[3 * i1 + 2]];
    const c = [positions[3 * i2], positions[3 * i2 + 1], positions[3 * i2 + 2]];

    const edges = [[a, b], [b, c], [c, a]];
    const crossings = [];
    for (const [p, q] of edges) {
      if ((p[2] - z) * (q[2] - z) < 0) {                   // strict crossing
        const t = (z - p[2]) / (q[2] - p[2]);
        crossings.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      } else if (Math.abs(p[2] - z) < EPS && Math.abs(q[2] - z) < EPS) {
        // Edge lies on the plane — ignored to avoid duplicate segments.
      } else if (Math.abs(p[2] - z) < EPS) {
        crossings.push([p[0], p[1]]);
      }
    }
    if (crossings.length === 2) segments.push([crossings[0], crossings[1]]);
  }

  return _chainSegments(segments).map(p => simplifyPolygon(p)).filter(p => p.length >= 3);
}

/**
 * Remove near-duplicate and collinear vertices. Meshes with split-quad
 * faces emit midpoint vertices along straight edges; those wreck the
 * bisector offset (halfSin→0 ⇒ huge inward jump). Collapsing them back
 * to true corners keeps walls stable.
 */
export function simplifyPolygon(poly, tol = 0.01) {
  if (poly.length < 4) return poly;
  const pts = [];
  for (const p of poly) {
    const prev = pts[pts.length - 1];
    if (!prev || Math.hypot(p[0] - prev[0], p[1] - prev[1]) > tol) pts.push(p);
  }
  if (pts.length > 1 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) <= tol) pts.pop();
  const n = pts.length;
  if (n < 4) return pts;
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
    const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const len = Math.hypot(c[0] - a[0], c[1] - a[1]) || 1;
    if (Math.abs(cross) / len > tol) out.push(b);   // keep genuine corners
  }
  return out.length >= 3 ? out : pts;
}

export function _chainSegments(segments) {
  const polygons = [];
  const used = new Uint8Array(segments.length);
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    const poly = [segments[i][0].slice(), segments[i][1].slice()];
    used[i] = 1;
    let extending = true;
    while (extending) {
      extending = false;
      const tail = poly[poly.length - 1];
      for (let j = 0; j < segments.length; j++) {
        if (used[j]) continue;
        const [p, q] = segments[j];
        if (_near(tail, p)) { poly.push(q.slice()); used[j] = 1; extending = true; break; }
        if (_near(tail, q)) { poly.push(p.slice()); used[j] = 1; extending = true; break; }
      }
    }
    if (poly.length >= 3 && _near(poly[0], poly[poly.length - 1])) poly.pop();
    if (poly.length >= 3) polygons.push(poly);
  }
  return polygons;
}

export function _near(a, b) {
  return Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;
}

// ── Polygon offset (walls) ─────────────────────────────────────────

/**
 * Offset a closed polygon by `distance` (negative = shrink inward the enclosed
 * area, positive = grow it), independent of the input winding. Uses Clipper's
 * robust integer offsetting (miter joins, miter limit) so it never
 * self-intersects or collapses smooth high-vertex outlines — the failure that
 * the old hand-rolled bisector had on curved walls. Returns a single polygon
 * (the largest-area result loop; offsets that split a region keep the biggest
 * piece, matching the single-loop callers) in the SAME winding as the input, or
 * [] if the region vanishes. Falls back to the bisector on any Clipper error.
 */
export function offsetPolygon(poly, distance) {
  if (!poly || poly.length < 3) return [];
  if (distance === 0) return poly.map((p) => [p[0], p[1]]);
  try {
    const path = poly.map(([x, y]) => ({ X: Math.round(x * CLIP_SCALE), Y: Math.round(y * CLIP_SCALE) }));
    const co = new ClipperLib.ClipperOffset(MITER_LIMIT, 0.25 * CLIP_SCALE);
    co.AddPath(path, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    const sol = new ClipperLib.Paths();
    co.Execute(sol, distance * CLIP_SCALE);
    if (!sol.length) return [];
    // Pick the largest loop (by |area|) — an inward offset can carve a region
    // into several; the biggest is the wall/infill outline the caller wants.
    let best = null, bestA = -1;
    for (const p of sol) {
      const pts = p.map((pt) => [pt.X / CLIP_SCALE, pt.Y / CLIP_SCALE]);
      const a = Math.abs(_signedArea(pts));
      if (a > bestA) { bestA = a; best = pts; }
    }
    if (!best || best.length < 3) return [];
    // Clipper canonicalises winding (always CCW); restore the input's winding so
    // this is a drop-in for callers that re-offset holes (CW) in place.
    if (_signedArea(best) * _signedArea(poly) < 0) best.reverse();
    return best;
  } catch {
    return _offsetPolygonBisector(poly, distance);
  }
}

/**
 * Legacy vertex-bisector offset — kept as a fallback if Clipper throws.
 * Works on convex/mildly-concave polygons; can self-intersect on tight
 * concavities (which is why Clipper is now primary).
 */
export function _offsetPolygonBisector(poly, distance) {
  const n = poly.length;
  if (n < 3) return [];
  const ccw = _isCCW(poly) ? 1 : -1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const prev = poly[(i - 1 + n) % n];
    const curr = poly[i];
    const next = poly[(i + 1) % n];
    const v1x = curr[0] - prev[0], v1y = curr[1] - prev[1];
    const v2x = next[0] - curr[0], v2y = next[1] - curr[1];
    const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
    if (l1 < EPS || l2 < EPS) continue;
    const n1x = -v1y / l1 * ccw, n1y = v1x / l1 * ccw;
    const n2x = -v2y / l2 * ccw, n2y = v2x / l2 * ccw;
    let bx = n1x + n2x, by = n1y + n2y;
    const bl = Math.hypot(bx, by);
    if (bl < EPS) continue;
    bx /= bl; by /= bl;
    const cosA = n1x * n2x + n1y * n2y;
    // Miter displacement along the (normalised) bisector to offset BOTH edges by
    // `distance`: d / cos(half-angle), where cos(half-angle) = sqrt((1+cosA)/2)
    // and cosA is the dot of the two edge normals. Straight vertex (cosA→1) →
    // factor 1 (move perpendicular by exactly `distance`); sharp corner
    // (cosA→-1) → large miter, capped below. Using sin(half-angle) here instead
    // was the long-standing bug that collapsed smooth high-vertex curves
    // (a 128-gon circle shrank to a fraction of its radius on a tiny inset).
    const halfCos = Math.sqrt(Math.max(0.0004, (1 + cosA) / 2));
    let scale = -distance / halfCos;
    // Miter limit (outward offsets only): on smooth curves the turn angle is
    // tiny, so an un-clamped miter shoots the vertex far out (spikes) — cap the
    // displacement so a skirt/brim/grow stays hugging the outline instead of
    // ballooning into huge spurs off the bed. Inward offsets are left alone so
    // walls/concentric rings still shrink to nothing (the loops depend on it).
    if (distance > 0) {
      const maxMiter = distance * MITER_LIMIT;
      if (Math.abs(scale) > maxMiter) scale = (scale < 0 ? -maxMiter : maxMiter);
    }
    out.push([curr[0] + bx * scale, curr[1] + by * scale]);
  }
  if (_signedArea(out) * _signedArea(poly) < 0) return [];
  if (distance < 0) {
    const origBbox = _bbox(poly);
    const newBbox  = _bbox(out);
    if ((newBbox.maxX - newBbox.minX) > (origBbox.maxX - origBbox.minX) ||
        (newBbox.maxY - newBbox.minY) > (origBbox.maxY - origBbox.minY)) {
      return [];
    }
  }
  return out;
}

export function _bbox(poly) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

export function _isCCW(poly) { return _signedArea(poly) > 0; }
export function _signedArea(poly) {
  let a = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const p = poly[i], q = poly[(i + 1) % n];
    a += (q[0] - p[0]) * (q[1] + p[1]);
  }
  return -a / 2;
}

// ── Hole / region grouping ─────────────────────────────────────────

/** Ray-cast point-in-polygon test. */
export function _pointInPoly(pt, poly) {
  let inside = false;
  const x = pt[0], y = pt[1];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function _centroid(poly) {
  let x = 0, y = 0;
  for (const p of poly) { x += p[0]; y += p[1]; }
  return [x / poly.length, y / poly.length];
}

/**
 * Group a flat list of loops (from sliceLayer) into regions of
 * { outer, holes[] }. A loop nested inside an odd number of others is a
 * hole of its immediate parent; even nesting starts a new solid region.
 * Robust enough for typical FDM cross-sections (outer wall + pockets).
 */
export function buildRegions(polygons) {
  const loops = polygons.filter(p => p.length >= 3);
  const areas = loops.map(p => Math.abs(_signedArea(p)));
  // Depth = how many strictly-larger loops contain this loop's centroid.
  // The area guard prevents a big outer whose centroid lands inside a
  // centred hole from being mis-read as nested.
  const depth = loops.map((p, i) => {
    const c = _centroid(p);
    let d = 0;
    for (let k = 0; k < loops.length; k++) {
      if (k === i) continue;
      if (areas[k] > areas[i] && _pointInPoly(c, loops[k])) d++;
    }
    return d;
  });
  const regions = [];
  // Outers = even depth. For each hole (odd depth) attach to the
  // smallest-area outer that contains it.
  for (let i = 0; i < loops.length; i++) {
    if (depth[i] % 2 === 0) regions.push({ outer: loops[i], holes: [], _i: i });
  }
  for (let i = 0; i < loops.length; i++) {
    if (depth[i] % 2 === 1) {
      const c = _centroid(loops[i]);
      let best = null, bestArea = Infinity;
      for (const r of regions) {
        if (_pointInPoly(c, r.outer) && areas[r._i] < bestArea) { best = r; bestArea = areas[r._i]; }
      }
      if (best) best.holes.push(loops[i]);
    }
  }
  return regions.map(({ outer, holes }) => ({ outer, holes }));
}

/**
 * Fuzzy skin: resample a closed outline and jitter each point in/out along
 * its outward normal, giving the outer wall a rough textured surface.
 * Deterministic (no Math.random) so slices are reproducible.
 */
export function fuzzifyPolygon(poly, thickness = 0.3, pointDist = 0.4, inBand = null) {
  if (!poly || poly.length < 3 || thickness <= 0) return poly;
  const ccw = _isCCW(poly) ? 1 : -1;
  const n = poly.length;
  const out = [];
  let seed = 0x9e3779b9 ^ Math.round((poly[0][0] + poly[1][1]) * 1000);
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed / 0x3fffffff) - 1; };
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    if (len < EPS) continue;
    // With a paint mask: skip subdivision entirely for edges fully outside the
    // band (keep the original vertex) so unpainted walls stay unchanged.
    if (inBand && !inBand(a[0], a[1]) && !inBand((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) && !inBand(b[0], b[1])) {
      out.push(a); continue;
    }
    const nx = (dy / len) * ccw, ny = (-dx / len) * ccw;   // outward normal
    const steps = Math.max(1, Math.round(len / pointDist));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const px = a[0] + dx * t, py = a[1] + dy * t;
      const j = (inBand && !inBand(px, py)) ? 0 : rnd() * thickness;
      out.push([px + nx * j, py + ny * j]);
    }
  }
  return out.length >= 3 ? out : poly;
}

// ── Infill ─────────────────────────────────────────────────────────

/**
 * Hatch a single polygon (no holes). Kept for the simple public API +
 * tests. `density` 0..1, `angleDeg` hatch direction.
 */
export function lineInfill(poly, density, angleDeg, lineWidth = 0.4) {
  if (poly.length < 3 || density <= 0) return [];
  return regionInfill({ outer: poly, holes: [] }, density, angleDeg, lineWidth);
}

/**
 * Hatch a region (outer minus holes) with parallel lines. Uses even-odd
 * scanline over all boundary loops so holes are left empty. `density`
 * 1.0 → spacing == lineWidth (solid fill).
 */
export function regionInfill(region, density, angleDeg, lineWidth = 0.4, monotonic = false, maskFn = null) {
  const outer = region.outer;
  if (!outer || outer.length < 3 || density <= 0) return [];
  const holes = region.holes || [];
  const angle = (angleDeg ?? 45) * PI / 180;   // 0 is a valid angle (was coerced to 45 by ||)
  const spacing = Math.max(lineWidth, lineWidth / Math.max(0.01, Math.min(1, density)));
  const cos = Math.cos(-angle), sin = Math.sin(-angle);
  const cosBack = Math.cos(angle), sinBack = Math.sin(angle);
  const toWorld = (x, y) => [x * cosBack - y * sinBack, x * sinBack + y * cosBack];
  const rotLoop = (loop) => loop.map(([x, y]) => [x * cos - y * sin, x * sin + y * cos]);
  const rotOuter = rotLoop(outer);
  const rotHoles = holes.map(rotLoop);
  const allLoops = [rotOuter, ...rotHoles];
  let minY = Infinity, maxY = -Infinity;
  for (const p of rotOuter) { if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1]; }

  // Scanline spans per row (each an x-interval inside the region at height y).
  // When a mask is given (solid/bridge sub-area of the region), each span is
  // clipped to the sub-intervals the mask keeps — BEFORE connection — so the
  // zigzag connects within each masked patch instead of being chopped into
  // 2-point pieces after the fact (what made complex models fragment into tens
  // of thousands of travels).
  const maskStep = Math.max(0.2, lineWidth * 0.6);
  const rows = [];
  for (let y = minY + spacing / 2; y < maxY; y += spacing) {
    const xs = [];
    for (const loop of allLoops) {
      for (let i = 0, n = loop.length; i < n; i++) {
        const p = loop[i], q = loop[(i + 1) % n];
        if ((p[1] - y) * (q[1] - y) < 0) { const t = (y - p[1]) / (q[1] - p[1]); xs.push(p[0] + t * (q[0] - p[0])); }
      }
    }
    xs.sort((a, b) => a - b);
    let spans = [];
    for (let k = 0; k + 1 < xs.length; k += 2) if (xs[k + 1] - xs[k] >= EPS) spans.push([xs[k], xs[k + 1]]);
    if (maskFn && spans.length) {
      const kept = [];
      for (const [x0, x1] of spans) {
        const steps = Math.max(1, Math.ceil((x1 - x0) / maskStep));
        let runStart = null;
        for (let k = 0; k <= steps; k++) {
          const xx = k === steps ? x1 : x0 + (x1 - x0) * (k / steps);
          const w = toWorld(xx, y);
          const inside = maskFn(w[0], w[1]);
          if (inside && runStart === null) runStart = xx;
          else if (!inside && runStart !== null) { if (xx - runStart > EPS) kept.push([runStart, xx]); runStart = null; }
        }
        if (runStart !== null && x1 - runStart > EPS) kept.push([runStart, x1]);
      }
      spans = kept;
    }
    if (spans.length) rows.push({ y, spans });
  }
  if (!rows.length) return [];

  // Connect spans into boustrophedon chains: a span continues a chain from the
  // previous row when their x-intervals overlap (the short connector then runs
  // just inside the perimeter). Direction alternates per row → a continuous
  // zigzag that extrudes the turns instead of a travel per line (OrcaSlicer's
  // connected rectilinear infill). Cuts infill travels from one-per-line to
  // roughly one-per-chain.

  // Monotonic ordering (top/bottom surfaces): lay every line in the SAME
  // direction, swept bottom→top, so each line is deposited against an
  // already-cooled neighbour on one consistent side. This removes the banding a
  // boustrophedon zigzag leaves on visible surfaces (BambuStudio's monotonic
  // top-surface fill). Costs a travel per line — worth it on the shown skin.
  if (monotonic) {
    const lines = [];
    rows.forEach((row) => { for (const sp of row.spans) lines.push({ y: row.y, x0: sp[0], x1: sp[1] }); });
    lines.sort((a, b) => (a.y - b.y) || (a.x0 - b.x0));
    return lines.map((L) => [toWorld(L.x0, L.y), toWorld(L.x1, L.y)]);
  }

  const overlap = (s, e) => Math.min(s[1], e[1]) - Math.max(s[0], e[0]) > EPS;
  const out = [];       // finished chains (point lists in rotated space)
  let open = [];        // chains still growing: { pts, span }
  rows.forEach((row, ri) => {
    const ltr = ri % 2 === 0;   // even rows left→right, odd right→left
    const next = [];
    const used = new Set();
    for (const sp of row.spans) {
      const a = ltr ? sp[0] : sp[1], b = ltr ? sp[1] : sp[0];
      let chain = null;
      for (const oc of open) { if (!used.has(oc) && overlap(oc.span, sp)) { chain = oc; used.add(oc); break; } }
      if (chain) { chain.pts.push([a, row.y], [b, row.y]); chain.span = sp; next.push(chain); }
      else next.push({ pts: [[a, row.y], [b, row.y]], span: sp });
    }
    for (const oc of open) if (!used.has(oc)) out.push(oc.pts);   // not extended → finished
    open = next;
  });
  for (const oc of open) out.push(oc.pts);

  return out.filter((p) => p.length >= 2).map((p) => p.map(([x, y]) => toWorld(x, y)));
}

/**
 * Solid fill for top/bottom shells: a grid of two perpendicular passes
 * at full density, alternating base angle per layer for adhesion.
 */
/**
 * Best bridge fill angle for a region (BambuStudio's BridgeDetector::detect_angle).
 * Scores each candidate direction by the total length of unsupported runs that
 * are flanked by support on BOTH sides (support → air → support) — a proper
 * anchored bridge span. A run open at a line end is a cantilever and doesn't
 * count. `isSupported(x, y)` returns true where the layer below carries the
 * point. Returns the best-anchored angle in degrees, or null when the region
 * has no anchored bridge area (fully supported).
 */
export function bestBridgeAngle(region, isSupported, lineWidth = 0.4) {
  const anchoredAt = (deg) => {
    let total = 0, any = false;
    for (const L of solidInfill(region, deg, lineWidth * 3, true)) {   // coarse, separate lines
      const a = L[0], b = L[L.length - 1];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 1e-6) continue;
      const steps = Math.max(2, Math.ceil(len / (lineWidth * 1.5)));
      const seg = len / steps;
      const sup = [];
      for (let k = 0; k <= steps; k++) { const t = k / steps; sup.push(isSupported(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)); }
      let k = 0;
      while (k <= steps) {
        if (sup[k]) { k++; continue; }
        const start = k; while (k <= steps && !sup[k]) k++;
        const end = k - 1;
        if (start > 0 && end < steps && sup[start - 1] && sup[end + 1]) { total += (end - start + 1) * seg; any = true; }
      }
    }
    return { total, any };
  };
  let best = null, bestScore = 0;
  for (let deg = 0; deg < 180; deg += 15) {
    const { total, any } = anchoredAt(deg);
    if (any && total > bestScore) { bestScore = total; best = deg; }
  }
  return best;
}

export function solidInfill(region, angleDeg, lineWidth = 0.4, monotonic = false, maskFn = null) {
  return regionInfill(region, 1.0, angleDeg, lineWidth, monotonic, maskFn);
}

/** True/false: is a point inside the region's solid (inside outer, outside holes)? */
function _inRegion(x, y, region) {
  if (!_pointInPoly([x, y], region.outer)) return false;
  for (const h of region.holes || []) if (_pointInPoly([x, y], h)) return false;
  return true;
}

/**
 * Combing / avoid-crossing-walls travel router. Given a travel from `a` to `b`
 * and the current layer's solid `regions` (array of {outer, holes}), return a
 * polyline that stays inside the solid — so the nozzle never drags across an
 * open gap or hole (the cause of stringing and surface scars). Straight when
 * the direct line is already safe; otherwise a shortest detour over the region
 * boundary (Dijkstra on a visibility graph of inward-nudged boundary vertices).
 * Returns null when no interior route exists (caller should retract + hop).
 */
/** Boundary vertices nudged into the solid — the waypoint set for routeInside.
 *  Computed once per layer and reused across all of that layer's travels. */
export function combWaypoints(regions, tol = 0.3, cap = 40) {
  const inside = (p) => {
    for (const r of regions) {
      if (_pointInPoly(p, r.outer)) { let inHole = false; for (const h of (r.holes || [])) if (_pointInPoly(p, h)) { inHole = true; break; } if (!inHole) return true; }
    }
    return false;
  };
  const wp = [];
  for (const r of regions) {
    for (const poly of [r.outer, ...(r.holes || [])]) {
      for (const v of poly) {
        for (let d = 0; d < 8; d++) { const ang = d / 8 * 2 * PI; const p = [v[0] + tol * Math.cos(ang), v[1] + tol * Math.sin(ang)]; if (inside(p)) { wp.push(p); break; } }
      }
    }
  }
  if (wp.length > cap) { const stride = Math.ceil(wp.length / cap); const w = []; for (let i = 0; i < wp.length; i += stride) w.push(wp[i]); return w; }
  return wp;
}

/**
 * Precompute the waypoint-to-waypoint visibility graph for a layer once, so
 * every travel that needs a detour reuses it (Dijkstra then only adds edges
 * for its own start/end). Returns adjacency: adj[i] = [[j, dist], …].
 */
export function buildCombGraph(regions, waypoints, opts = {}) {
  const step = opts.step ?? 1.5;
  const inside = (p) => {
    for (const r of regions) { if (_pointInPoly(p, r.outer)) { let inHole = false; for (const h of (r.holes || [])) if (_pointInPoly(p, h)) { inHole = true; break; } if (!inHole) return true; } }
    return false;
  };
  const segOk = (p, q) => {
    const n = Math.max(2, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / step));
    for (let i = 1; i < n; i++) { const t = i / n; if (!inside([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])) return false; }
    return true;
  };
  const N = waypoints.length;
  const adj = Array.from({ length: N }, () => []);
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (segOk(waypoints[i], waypoints[j])) { const d = Math.hypot(waypoints[i][0] - waypoints[j][0], waypoints[i][1] - waypoints[j][1]); adj[i].push([j, d]); adj[j].push([i, d]); }
    }
  }
  return adj;
}

export function routeInside(a, b, regions, opts = {}) {
  if (!regions || !regions.length) return null;
  const tol = opts.tol ?? 0.3;
  const step = opts.step ?? 1.5;
  const inside = (p) => {
    for (const r of regions) {
      if (_pointInPoly(p, r.outer)) {
        let inHole = false;
        for (const h of (r.holes || [])) if (_pointInPoly(p, h)) { inHole = true; break; }
        if (!inHole) return true;
      }
    }
    return false;
  };
  const segOk = (p, q) => {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const n = Math.max(2, Math.ceil(L / step));
    for (let i = 1; i < n; i++) { const t = i / n; if (!inside([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])) return false; }
    return true;
  };
  if (!inside(a) || !inside(b)) return null;
  if (segOk(a, b)) return [a, b];
  // Waypoints (boundary vertices nudged a hair into the solid). Reused across
  // every travel in a layer when the caller precomputes them via combWaypoints.
  // Waypoints + visibility graph. When a per-layer `cache` object is passed
  // they are built lazily on the first travel that actually needs a detour and
  // reused for the rest of the layer (most travels are straight and never get
  // here), which keeps combing cheap on complex models.
  let wp, adj;
  if (opts.cache) {
    if (!opts.cache.wp) opts.cache.wp = combWaypoints(regions, tol);
    if (!opts.cache.adj) opts.cache.adj = buildCombGraph(regions, opts.cache.wp, { step });
    wp = opts.cache.wp; adj = opts.cache.adj;
  } else {
    wp = opts.waypoints || combWaypoints(regions, tol);
    adj = opts.adj || null;
  }
  const M = wp.length, S = M, T = M + 1, total = M + 2;   // start=M, target=M+1
  const posOf = (u) => u < M ? wp[u] : (u === S ? a : b);
  const dist = new Array(total).fill(Infinity), prev = new Array(total).fill(-1), done = new Uint8Array(total);
  dist[S] = 0;
  const dist2 = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  for (let it = 0; it < total; it++) {
    let u = -1, best = Infinity;
    for (let i = 0; i < total; i++) if (!done[i] && dist[i] < best) { best = dist[i]; u = i; }
    if (u < 0 || u === T) break; done[u] = 1;
    const relax = (v, d) => { if (!done[v] && dist[u] + d < dist[v]) { dist[v] = dist[u] + d; prev[v] = u; } };
    if (u < M) {
      // Waypoint: cached edges to other waypoints, plus an edge to the target.
      if (adj) { for (const [j, d] of adj[u]) relax(j, d); }
      else { for (let v = 0; v < M; v++) if (v !== u && segOk(wp[u], wp[v])) relax(v, dist2(wp[u], wp[v])); }
      if (segOk(wp[u], b)) relax(T, dist2(wp[u], b));
    } else if (u === S) {
      for (let v = 0; v < M; v++) if (segOk(a, wp[v])) relax(v, dist2(a, wp[v]));
    }
  }
  if (dist[T] === Infinity) return null;
  const path = []; let cur = T; while (cur >= 0) { path.push(posOf(cur)); cur = prev[cur]; } path.reverse();
  return path;
}

/**
 * Chain unordered 2-point segments into open polylines by shared endpoints,
 * using a spatial hash (O(n)) — for iso-contour / tiling output that would
 * otherwise be thousands of tiny disconnected moves (huge retraction/travel).
 */
function _chainOpen(segments, tol = 0.05) {
  if (segments.length < 2) return segments.map((s) => [s[0], s[1]]);
  const key = (p) => `${Math.round(p[0] / tol)},${Math.round(p[1] / tol)}`;
  const map = new Map();
  segments.forEach((s, i) => { for (const e of [0, 1]) { const kk = key(s[e]); (map.get(kk) || map.set(kk, []).get(kk)).push([i, e]); } });
  const used = new Uint8Array(segments.length);
  const out = [];
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue; used[i] = 1;
    const poly = [segments[i][0], segments[i][1]];
    for (let dir = 0; dir < 2; dir++) {
      let extend = true;
      while (extend) {
        extend = false;
        const end = dir === 0 ? poly[poly.length - 1] : poly[0];
        for (const [j, e] of (map.get(key(end)) || [])) {
          if (used[j]) continue;
          const other = segments[j][e ^ 1]; used[j] = 1;
          if (dir === 0) poly.push(other); else poly.unshift(other);
          extend = true; break;
        }
      }
    }
    out.push(poly);
  }
  return out;
}

/**
 * Gyroid infill — the real TPMS cross-section. At height z the gyroid surface
 * sin(kx)cos(ky)+sin(ky)cos(kz)+sin(kz)cos(kx)=0 reduces to a 2-D implicit
 * curve; we extract its f=0 iso-contour with marching squares and clip each
 * segment to the region. The z term shifts the pattern every layer, giving the
 * characteristic interlocking 3-D gyroid — not a flat approximation.
 */
export function gyroidInfill(region, density, lineWidth = 0.4, z = 0) {
  const outer = region.outer;
  if (!outer || outer.length < 3 || density <= 0) return [];
  const d = Math.max(0.02, Math.min(1, density));
  const spacing = Math.max(lineWidth, lineWidth / d);
  const period = spacing * 2;
  const k = 2 * PI / period;
  const cz = Math.cos(k * z), sz = Math.sin(k * z);
  const f = (x, y) => Math.sin(k * x) * Math.cos(k * y) + Math.sin(k * y) * cz + Math.cos(k * x) * sz;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of outer) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  const step = period / 6;
  const interp = (xa, ya, fa, xb, yb, fb) => { const t = fa / (fa - fb); return [xa + t * (xb - xa), ya + t * (yb - ya)]; };
  const segs = [];
  for (let x = minX; x < maxX; x += step) {
    const x1 = x + step;
    for (let y = minY; y < maxY; y += step) {
      const y1 = y + step;
      const f00 = f(x, y), f10 = f(x1, y), f11 = f(x1, y1), f01 = f(x, y1);
      const cross = [];
      if ((f00 < 0) !== (f10 < 0)) cross.push(interp(x, y, f00, x1, y, f10));
      if ((f10 < 0) !== (f11 < 0)) cross.push(interp(x1, y, f10, x1, y1, f11));
      if ((f11 < 0) !== (f01 < 0)) cross.push(interp(x1, y1, f11, x, y1, f01));
      if ((f01 < 0) !== (f00 < 0)) cross.push(interp(x, y1, f01, x, y, f00));
      for (let e = 0; e + 1 < cross.length; e += 2) {
        const a = cross[e], b = cross[e + 1];
        if (_inRegion((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, region)) segs.push([a, b]);
      }
    }
  }
  return _chainOpen(segs);
}

/**
 * Honeycomb infill — a real hexagon tiling. Hexagons are laid across the
 * bounding box, their shared edges de-duplicated, and each edge clipped to the
 * region. `density` sets the cell size.
 */
/**
 * Stitch a soup of 2-point segments into connected polylines by joining
 * shared endpoints. Used by lattice fills (honeycomb) whose edges are generated
 * cell-by-cell in no particular order: greedily walks unused edges from each
 * endpoint so the printer traces long continuous paths instead of retracting
 * between every edge. Vertices with odd degree still force some breaks, but the
 * travel count drops by ~an order of magnitude.
 * @param {number[][][]} segs  segments [[ax,ay],[bx,by]]
 * @returns {number[][][]} polylines [[x,y], …]
 */
export function stitchSegments(segs, eps = 1e-3) {
  if (!segs.length) return [];
  const key = (p) => `${Math.round(p[0] / eps)},${Math.round(p[1] / eps)}`;
  const nodes = new Map();               // point key -> incident edges
  const edges = segs.map(([a, b]) => ({ a, b, ka: key(a), kb: key(b), used: false }));
  for (const e of edges) {
    if (!nodes.has(e.ka)) nodes.set(e.ka, []);
    if (!nodes.has(e.kb)) nodes.set(e.kb, []);
    nodes.get(e.ka).push(e); nodes.get(e.kb).push(e);
  }
  const nextFrom = (k) => { for (const e of nodes.get(k)) if (!e.used) return e; return null; };
  const paths = [];
  for (const start of edges) {
    if (start.used) continue;
    start.used = true;
    const path = [start.a, start.b];
    let endKey = start.kb;
    for (let nxt; (nxt = nextFrom(endKey)); ) {
      nxt.used = true;
      const fwd = nxt.ka === endKey;
      path.push(fwd ? nxt.b : nxt.a); endKey = fwd ? nxt.kb : nxt.ka;
    }
    let headKey = start.ka;
    for (let nxt; (nxt = nextFrom(headKey)); ) {
      nxt.used = true;
      const fwd = nxt.ka === headKey;
      path.unshift(fwd ? nxt.b : nxt.a); headKey = fwd ? nxt.kb : nxt.ka;
    }
    paths.push(path);
  }
  return paths;
}

export function honeycombInfill(region, density, lineWidth = 0.4) {
  const outer = region.outer;
  if (!outer || outer.length < 3 || density <= 0) return [];
  const d = Math.max(0.02, Math.min(1, density));
  const spacing = Math.max(lineWidth, lineWidth / d);
  const R = spacing * 1.8;             // hexagon circumradius
  const dx = Math.sqrt(3) * R;         // horizontal centre spacing (pointy-top)
  const dy = 1.5 * R;                  // vertical centre spacing
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of outer) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  const seen = new Set();
  const kkey = (a, b) => { const r = (v) => Math.round(v * 50) / 50; const A = `${r(a[0])},${r(a[1])}`, B = `${r(b[0])},${r(b[1])}`; return A < B ? `${A}|${B}` : `${B}|${A}`; };
  const segs = [];
  let row = 0;
  for (let cy = minY - dy; cy < maxY + dy; cy += dy, row++) {
    const xoff = (row & 1) ? dx / 2 : 0;
    for (let cx = minX - dx + xoff; cx < maxX + dx; cx += dx) {
      const v = [];
      for (let j = 0; j < 6; j++) { const a = (30 + 60 * j) * PI / 180; v.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
      for (let j = 0; j < 6; j++) {
        const a = v[j], b = v[(j + 1) % 6]; const key = kkey(a, b);
        if (seen.has(key)) continue; seen.add(key);
        if (_inRegion((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, region)) segs.push([a, b]);
      }
    }
  }
  return stitchSegments(segs);
}

/**
 * Pattern dispatcher for sparse infill. grid = two passes 90° apart, triangles
 * = three passes 60° apart, gyroid = TPMS iso-contour, honeycomb = hex tiling,
 * cubic = a 3-way triad rotating with height, lines/default = one direction.
 * `ctx.z` (layer height) drives the Z-varying patterns.
 */
/**
 * Hilbert-curve infill: a single continuous space-filling curve (a BambuStudio
 * pattern). Deposits one connected serpentine at ~`spacing` pitch, giving even
 * multi-directional strength with very few travels. Segments whose midpoint
 * falls outside the region (or inside a hole) are dropped; the walls cover the
 * boundary. Deterministic.
 * @returns {number[][][]} segments [[ax,ay],[bx,by]]
 */
export function hilbertInfill(region, density, lineWidth = 0.4) {
  const outer = region.outer;
  if (!outer || outer.length < 3 || density <= 0) return [];
  const holes = region.holes || [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of outer) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  const span = Math.max(maxX - minX, maxY - minY);
  if (!(span > 0)) return [];
  const spacing = Math.max(lineWidth, lineWidth / Math.max(0.01, Math.min(1, density)));
  let p = 1; while ((1 << (p + 1)) * spacing <= span && p < 8) p++;   // order (cell ≈ spacing, capped)
  const N = 1 << p;
  const cell = span / N;
  const ox = minX + ((maxX - minX) - span) / 2;   // centre the NxN square over the bbox
  const oy = minY + ((maxY - minY) - span) / 2;
  // Hilbert distance d → grid (x,y) — the reference iterative algorithm.
  const d2xy = (d) => {
    let rx, ry, t = d, x = 0, y = 0;
    for (let s = 1; s < N; s <<= 1) {
      rx = 1 & (t >> 1);
      ry = 1 & (t ^ rx);
      if (ry === 0) { if (rx === 1) { x = s - 1 - x; y = s - 1 - y; } const tmp = x; x = y; y = tmp; }
      x += s * rx; y += s * ry; t >>= 2;
    }
    return [x, y];
  };
  const inside = (x, y) => { if (!_pointInPoly([x, y], outer)) return false; for (const h of holes) if (_pointInPoly([x, y], h)) return false; return true; };
  const pt = (d) => { const [gx, gy] = d2xy(d); return [ox + (gx + 0.5) * cell, oy + (gy + 0.5) * cell]; };
  // Keep a cell segment only when BOTH endpoints are inside the region (and out
  // of holes) — a midpoint-only test would let a segment poke past the wall on
  // concave outlines / low density. Cells are ~one line-width so the small gap
  // this leaves at the boundary is covered by the walls.
  // Walk the curve in Hilbert order, accumulating runs of in-region cells into
  // continuous polylines. The serpentine is one path; it only breaks where it
  // crosses outside the region / into a hole, so a convex part fills as a single
  // connected curve with one travel per layer.
  const paths = [];
  let chain = [];
  let prev = pt(0), prevIn = inside(prev[0], prev[1]);
  for (let d = 1; d < N * N; d++) {
    const cur = pt(d), curIn = inside(cur[0], cur[1]);
    if (prevIn && curIn) {
      if (chain.length === 0) chain.push(prev);
      chain.push(cur);
    } else {
      if (chain.length >= 2) paths.push(chain);
      chain = [];
    }
    prev = cur; prevIn = curIn;
  }
  if (chain.length >= 2) paths.push(chain);
  return paths;
}

export function patternInfill(region, density, angleDeg, lineWidth, pattern = 'lines', ctx = {}, maskFn = null) {
  // maskFn (optional) clips the fill to a sub-area BEFORE the scanline connects,
  // so sparse infill next to a solid patch stays connected within its own area
  // instead of being fragmented by a post-filter. Only the scanline-based
  // patterns thread it; gyroid/honeycomb/hilbert are still filtered downstream.
  if (pattern === 'hilbert' || pattern === 'hilbertcurve') return hilbertInfill(region, density, lineWidth);
  if (pattern === 'grid') {
    return regionInfill(region, density / 2, angleDeg, lineWidth, false, maskFn)
      .concat(regionInfill(region, density / 2, angleDeg + 90, lineWidth, false, maskFn));
  }
  if (pattern === 'triangles' || pattern === 'star') {
    const d = density / 3;
    return regionInfill(region, d, angleDeg, lineWidth, false, maskFn)
      .concat(regionInfill(region, d, angleDeg + 60, lineWidth, false, maskFn))
      .concat(regionInfill(region, d, angleDeg + 120, lineWidth, false, maskFn));
  }
  if (pattern === 'gyroid') return gyroidInfill(region, density, lineWidth, ctx.z ?? 0);
  if (pattern === 'honeycomb') return honeycombInfill(region, density, lineWidth);
  if (pattern === 'crosshatch') {
    // 3-D cross-hatch: single-direction lines whose angle flips 90° every few
    // layers, so successive bands cross — stronger than plain rectilinear.
    const z = ctx.z ?? 0;
    const rot = (Math.floor(z / (lineWidth * 4)) % 2) * 90;
    return regionInfill(region, density, angleDeg + rot, lineWidth, false, maskFn);
  }
  if (pattern === 'cubic') {
    // Three directions rotating with height → a 3-D cubic lattice feel.
    const rot = ((ctx.z ?? 0) * 17) % 60;
    const d = density / 3;
    return regionInfill(region, d, angleDeg + rot, lineWidth, false, maskFn)
      .concat(regionInfill(region, d, angleDeg + 60 + rot, lineWidth, false, maskFn))
      .concat(regionInfill(region, d, angleDeg + 120 + rot, lineWidth, false, maskFn));
  }
  return regionInfill(region, density, angleDeg, lineWidth, false, maskFn);
}
