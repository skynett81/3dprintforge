/**
 * Native Slicer — 2D geometry core.
 *
 * Pure functions that turn a mesh cross-section into printable 2D paths:
 * layer slicing, polygon offset (walls), hole/region grouping, and
 * even-odd infill (sparse + solid). No dependencies — this is the
 * project's own geometry, shared by the slicing pipeline in
 * native-slicer.js.
 */

export const EPS = 0.001;          // mm tolerance for polygon-loop closure
export const PI = Math.PI;

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
 * Offset a closed polygon by `distance` (negative = shrink inward,
 * positive = grow outward). Vertex-bisector algorithm — works on
 * convex/mildly-concave polygons typical of FDM perimeters.
 */
export function offsetPolygon(poly, distance) {
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
    const halfSin = Math.sqrt(Math.max(0.001, (1 - cosA) / 2));
    const scale = -distance / Math.max(0.001, halfSin);
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
export function fuzzifyPolygon(poly, thickness = 0.3, pointDist = 0.4) {
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
    const nx = (dy / len) * ccw, ny = (-dx / len) * ccw;   // outward normal
    const steps = Math.max(1, Math.round(len / pointDist));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const j = rnd() * thickness;
      out.push([a[0] + dx * t + nx * j, a[1] + dy * t + ny * j]);
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
export function regionInfill(region, density, angleDeg, lineWidth = 0.4) {
  const outer = region.outer;
  if (!outer || outer.length < 3 || density <= 0) return [];
  const holes = region.holes || [];
  const angle = (angleDeg || 45) * PI / 180;
  const spacing = Math.max(lineWidth, lineWidth / Math.max(0.01, Math.min(1, density)));
  const cos = Math.cos(-angle), sin = Math.sin(-angle);
  const rotLoop = (loop) => loop.map(([x, y]) => [x * cos - y * sin, x * sin + y * cos]);
  const rotOuter = rotLoop(outer);
  const rotHoles = holes.map(rotLoop);
  const allLoops = [rotOuter, ...rotHoles];
  let minY = Infinity, maxY = -Infinity;
  for (const p of rotOuter) { if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1]; }

  const cosBack = Math.cos(angle), sinBack = Math.sin(angle);
  const segments = [];
  for (let y = minY + spacing / 2; y < maxY; y += spacing) {
    const xs = [];
    for (const loop of allLoops) {
      for (let i = 0, n = loop.length; i < n; i++) {
        const p = loop[i], q = loop[(i + 1) % n];
        if ((p[1] - y) * (q[1] - y) < 0) {
          const t = (y - p[1]) / (q[1] - p[1]);
          xs.push(p[0] + t * (q[0] - p[0]));
        }
      }
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      if (xs[k + 1] - xs[k] < EPS) continue;
      const a = [xs[k] * cosBack - y * sinBack, xs[k] * sinBack + y * cosBack];
      const b = [xs[k + 1] * cosBack - y * sinBack, xs[k + 1] * sinBack + y * cosBack];
      segments.push([a, b]);
    }
  }
  return segments;
}

/**
 * Solid fill for top/bottom shells: a grid of two perpendicular passes
 * at full density, alternating base angle per layer for adhesion.
 */
export function solidInfill(region, angleDeg, lineWidth = 0.4) {
  return regionInfill(region, 1.0, angleDeg, lineWidth);
}

/** True/false: is a point inside the region's solid (inside outer, outside holes)? */
function _inRegion(x, y, region) {
  if (!_pointInPoly([x, y], region.outer)) return false;
  for (const h of region.holes || []) if (_pointInPoly([x, y], h)) return false;
  return true;
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
  return segs;
}

/**
 * Pattern dispatcher for sparse infill. grid = two passes 90° apart, triangles
 * = three passes 60° apart, gyroid = TPMS iso-contour, honeycomb = hex tiling,
 * cubic = a 3-way triad rotating with height, lines/default = one direction.
 * `ctx.z` (layer height) drives the Z-varying patterns.
 */
export function patternInfill(region, density, angleDeg, lineWidth, pattern = 'lines', ctx = {}) {
  if (pattern === 'grid') {
    return regionInfill(region, density / 2, angleDeg, lineWidth)
      .concat(regionInfill(region, density / 2, angleDeg + 90, lineWidth));
  }
  if (pattern === 'triangles' || pattern === 'star') {
    const d = density / 3;
    return regionInfill(region, d, angleDeg, lineWidth)
      .concat(regionInfill(region, d, angleDeg + 60, lineWidth))
      .concat(regionInfill(region, d, angleDeg + 120, lineWidth));
  }
  if (pattern === 'gyroid') return gyroidInfill(region, density, lineWidth, ctx.z ?? 0);
  if (pattern === 'honeycomb') return honeycombInfill(region, density, lineWidth);
  if (pattern === 'cubic') {
    // Three directions rotating with height → a 3-D cubic lattice feel.
    const rot = ((ctx.z ?? 0) * 17) % 60;
    const d = density / 3;
    return regionInfill(region, d, angleDeg + rot, lineWidth)
      .concat(regionInfill(region, d, angleDeg + 60 + rot, lineWidth))
      .concat(regionInfill(region, d, angleDeg + 120 + rot, lineWidth));
  }
  return regionInfill(region, density, angleDeg, lineWidth);
}
