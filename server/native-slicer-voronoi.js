/**
 * Native Slicer — Voronoi medial axis via Delaunay of the boundary.
 *
 * BambuStudio's Arachne (SkeletalTrapezoidation) builds an exact segment
 * Voronoi diagram of the polygon edges. A faithful boost::polygon segment
 * Voronoi is not tractable in JS, so we use the standard, exact-converging
 * approximation: sample the boundary densely into POINTS, Delaunay-triangulate
 * them, and take the dual — the circumcentres of the interior triangles and the
 * edges linking adjacent ones form the medial axis. As the sample step shrinks
 * the skeleton converges to the true (segment-Voronoi) medial axis, and the
 * local half-width at each node is its circumradius (distance to the boundary).
 *
 * This replaces the raster distance-transform skeleton (native-slicer-arachne)
 * with a geometry-exact one, so the Arachne beads sit where BambuStudio's
 * Voronoi-traced walls would.
 */

// ── Delaunay (Bowyer–Watson) ───────────────────────────────────────

function circumcircle(ax, ay, bx, by, cx, cy) {
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-12) return null;
  const a2 = ax * ax + ay * ay, b2 = bx * bx + by * by, c2 = cx * cx + cy * cy;
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
  const r = Math.hypot(ax - ux, ay - uy);
  return { x: ux, y: uy, r };
}

/**
 * Delaunay triangulation of points ([[x,y],…]). Returns triangles as index
 * triples [i,j,k]. Bowyer–Watson with a super-triangle; O(n^1.5) typical.
 */
export function delaunay(points) {
  const n = points.length;
  if (n < 3) return [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of points) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  const dx = maxX - minX || 1, dy = maxY - minY || 1, dmax = Math.max(dx, dy);
  const midx = (minX + maxX) / 2, midy = (minY + maxY) / 2;
  // Super-triangle vertices appended at indices n, n+1, n+2.
  const pts = points.map((p) => [p[0], p[1]]);
  pts.push([midx - 20 * dmax, midy - dmax], [midx, midy + 20 * dmax], [midx + 20 * dmax, midy - dmax]);
  let tris = [[n, n + 1, n + 2]];
  const cc = (t) => circumcircle(pts[t[0]][0], pts[t[0]][1], pts[t[1]][0], pts[t[1]][1], pts[t[2]][0], pts[t[2]][1]);
  for (let i = 0; i < n; i++) {
    const px = pts[i][0], py = pts[i][1];
    const bad = [], good = [];
    for (const t of tris) {
      const c = cc(t);
      if (c && Math.hypot(px - c.x, py - c.y) <= c.r + 1e-9) bad.push(t); else good.push(t);
    }
    // Boundary of the bad-triangle cavity = edges not shared by two bad tris.
    const edgeCount = new Map();
    const key = (a, b) => (a < b ? a + ',' + b : b + ',' + a);
    for (const t of bad) for (const [a, b] of [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]]) { const k = key(a, b); edgeCount.set(k, (edgeCount.get(k) || 0) + 1); }
    tris = good;
    for (const [k, cnt] of edgeCount) if (cnt === 1) { const [a, b] = k.split(',').map(Number); tris.push([a, b, i]); }
  }
  // Drop triangles touching the super-triangle.
  return tris.filter((t) => t[0] < n && t[1] < n && t[2] < n);
}

// ── Boundary sampling ──────────────────────────────────────────────

// Sample a loop; record each point's loop id + running index so we can tell
// whether a Delaunay edge is a boundary edge (consecutive samples of one loop).
function sampleLoop(loop, step, out, loopId, meta) {
  const n = loop.length;
  const start = out.length;
  for (let i = 0; i < n; i++) {
    const a = loop[i], b = loop[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const segs = Math.max(1, Math.round(len / step));
    for (let k = 0; k < segs; k++) { const t = k / segs; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  const count = out.length - start;
  for (let i = 0; i < count; i++) meta.push({ loop: loopId, idx: i, count, base: start });
}

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

const inRegion = (x, y, region) => {
  if (!pointInPoly(x, y, region.outer)) return false;
  for (const h of region.holes || []) if (pointInPoly(x, y, h)) return false;
  return true;
};

/**
 * Medial-axis skeleton of a region as variable-width centrelines.
 * @param {{outer:number[][], holes?:number[][][]}} region
 * @param {number} lineWidth   sample step defaults to ~half this
 * @returns {{pts:number[][], widths:number[]}[]}  each is a centreline with the
 *          local FULL width (2×distance-to-boundary) at every point.
 */
export function medialAxis(region, lineWidth, step = lineWidth * 0.6) {
  const outer = region.outer;
  if (!outer || outer.length < 3) return [];
  const holes = region.holes || [];
  const pts = [], meta = [];
  sampleLoop(outer, step, pts, 0, meta);
  holes.forEach((h, hi) => sampleLoop(h, step, pts, hi + 1, meta));
  if (pts.length < 3 || pts.length > 20000) return [];   // guard runaway on huge regions
  const tris = delaunay(pts);
  let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
  for (const p of pts) { if (p[0] < mnx) mnx = p[0]; if (p[0] > mxx) mxx = p[0]; if (p[1] < mny) mny = p[1]; if (p[1] > mxy) mxy = p[1]; }
  const bbDiag = Math.hypot(mxx - mnx, mxy - mny);
  // A Delaunay edge is a BOUNDARY edge if its two points are consecutive samples
  // of the same loop (they trace the outline). Medial edges must cross the
  // INTERIOR, so we only link circumcentres over non-boundary shared edges.
  const isBoundaryEdge = (a, b) => {
    const ma = meta[a], mb = meta[b];
    if (!ma || !mb || ma.loop !== mb.loop) return false;
    const d = Math.abs(ma.idx - mb.idx);
    return d === 1 || d === ma.count - 1;
  };
  // Interior triangles: centroid in the solid, real area, empty-circumcircle
  // radius bounded (a near-collinear sliver has a huge, meaningless radius).
  const nodes = [];   // {x,y,r} circumcentre + half-width
  const triNode = new Map();
  for (let ti = 0; ti < tris.length; ti++) {
    const t = tris[ti];
    const [ax, ay] = pts[t[0]], [bx, by] = pts[t[1]], [cx2, cy2] = pts[t[2]];
    const area2 = Math.abs((bx - ax) * (cy2 - ay) - (by - ay) * (cx2 - ax));
    if (area2 < lineWidth * lineWidth * 0.02) continue;                // sliver
    const gx = (ax + bx + cx2) / 3, gy = (ay + by + cy2) / 3;
    if (!inRegion(gx, gy, region)) continue;
    const c = circumcircle(ax, ay, bx, by, cx2, cy2);
    if (!c || !(c.r > 0) || c.r > bbDiag) continue;
    const inC = inRegion(c.x, c.y, region);
    triNode.set(ti, nodes.length);
    nodes.push({ x: inC ? c.x : gx, y: inC ? c.y : gy, r: c.r });
  }
  // Adjacency over INTERNAL shared edges only (skip boundary edges).
  const edgeTris = new Map();
  const key = (a, b) => (a < b ? a + ',' + b : b + ',' + a);
  for (let ti = 0; ti < tris.length; ti++) {
    if (!triNode.has(ti)) continue;
    const t = tris[ti];
    for (const [a, b] of [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]]) { if (isBoundaryEdge(a, b)) continue; const k = key(a, b); (edgeTris.get(k) || edgeTris.set(k, []).get(k)).push(ti); }
  }
  const adj = nodes.map(() => []);
  for (const [, ts] of edgeTris) {
    if (ts.length !== 2) continue;
    const [t1, t2] = ts;
    if (!triNode.has(t1) || !triNode.has(t2)) continue;
    const u = triNode.get(t1), v = triNode.get(t2);
    adj[u].push(v); adj[v].push(u);
  }
  // Walk the medial graph into polylines: start at endpoints/junctions
  // (degree ≠ 2) and follow degree-2 chains; then mop up any pure loops.
  const visitedEdge = new Set();
  const ek = (a, b) => (a < b ? a + '_' + b : b + '_' + a);
  const chains = [];
  const walk = (start, first) => {
    const chain = [start];
    let prev = start, cur = first;
    while (true) {
      chain.push(cur);
      visitedEdge.add(ek(prev, cur));
      if (adj[cur].length !== 2) break;                 // hit a junction/endpoint
      const nxt = adj[cur][0] === prev ? adj[cur][1] : adj[cur][0];
      if (visitedEdge.has(ek(cur, nxt))) break;
      prev = cur; cur = nxt;
    }
    return chain;
  };
  for (let i = 0; i < nodes.length; i++) {
    if (adj[i].length === 2) continue;                  // start only at ends/junctions
    for (const j of adj[i]) if (!visitedEdge.has(ek(i, j))) chains.push(walk(i, j));
  }
  for (let i = 0; i < nodes.length; i++) {              // leftover closed loops
    if (adj[i].length === 2) for (const j of adj[i]) if (!visitedEdge.has(ek(i, j))) chains.push(walk(i, j));
  }
  const out = [];
  for (const ch of chains) {
    if (ch.length < 2) continue;
    // Dedupe consecutive coincident circumcentres (cocircular triangles share
    // one) — a zero-length segment would divide-by-zero in the bead offsetting.
    const pline = [], widths = [];
    for (const ni of ch) {
      const x = nodes[ni].x, y = nodes[ni].y;
      if (pline.length && Math.hypot(x - pline[pline.length - 1][0], y - pline[pline.length - 1][1]) < 1e-6) continue;
      pline.push([x, y]); widths.push(2 * nodes[ni].r);
    }
    if (pline.length >= 2) out.push({ pts: pline, widths });
  }
  return out;
}
