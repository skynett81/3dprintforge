/**
 * Mesh Primitives — pure-JS indexed-mesh builders for the AI Forge.
 *
 * All functions return the same indexed-mesh shape used by mesh-repair.js
 * and mesh-transforms.js:
 *   { positions: Float32Array(3·V), indices: Uint32Array(3·F) }
 *
 * Triangulation uses CCW winding from outside; meshes are watertight
 * unless explicitly noted.
 */

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Build a mesh-record from JS arrays. Centralised so all primitives
 * produce identical typed-array layouts.
 */
function _build(positions, indices) {
  return {
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
  };
}

/**
 * Concatenate multiple meshes with vertex re-indexing.
 */
export function unionMeshes(meshes) {
  let totalPos = 0, totalIdx = 0;
  for (const m of meshes) {
    totalPos += m.positions.length;
    totalIdx += m.indices.length;
  }
  const positions = new Float32Array(totalPos);
  const indices = new Uint32Array(totalIdx);
  let pOff = 0, iOff = 0, vOff = 0;
  for (const m of meshes) {
    positions.set(m.positions, pOff);
    for (let i = 0; i < m.indices.length; i++) indices[iOff + i] = m.indices[i] + vOff;
    pOff += m.positions.length;
    iOff += m.indices.length;
    vOff += m.positions.length / 3;
  }
  return { positions, indices };
}

/**
 * Translate a mesh in-place along [dx, dy, dz]. Returns a new mesh
 * (immutable convention).
 */
export function offset(mesh, dx, dy, dz) {
  const out = new Float32Array(mesh.positions.length);
  for (let i = 0; i < mesh.positions.length; i += 3) {
    out[i] = mesh.positions[i] + dx;
    out[i + 1] = mesh.positions[i + 1] + dy;
    out[i + 2] = mesh.positions[i + 2] + dz;
  }
  return { positions: out, indices: new Uint32Array(mesh.indices) };
}

// ── Box ────────────────────────────────────────────────────────────────

/**
 * Axis-aligned box of (w × h × d), origin at min corner.
 */
export function box(w = 20, h = 20, d = 20) {
  const positions = [
    0, 0, 0, w, 0, 0, w, h, 0, 0, h, 0,        // bottom (z=0)
    0, 0, d, w, 0, d, w, h, d, 0, h, d,        // top    (z=d)
  ];
  const indices = [
    0, 2, 1, 0, 3, 2,    // bottom (CCW from outside ⇒ -Z)
    4, 5, 6, 4, 6, 7,    // top    (+Z)
    0, 1, 5, 0, 5, 4,    // front  (-Y)
    2, 3, 7, 2, 7, 6,    // back   (+Y)
    1, 2, 6, 1, 6, 5,    // right  (+X)
    0, 4, 7, 0, 7, 3,    // left   (-X)
  ];
  return _build(positions, indices);
}

// ── Sphere (UV) ────────────────────────────────────────────────────────

/**
 * UV sphere centred at origin with given radius.
 */
export function sphere(r = 10, segments = 24, rings = 16) {
  const segs = Math.max(3, segments | 0);
  const rngs = Math.max(2, rings | 0);
  const positions = [];
  const indices = [];

  positions.push(0, 0, r);                 // north pole = vertex 0
  for (let i = 1; i < rngs; i++) {
    const phi = Math.PI * i / rngs;        // 0..π
    const z = r * Math.cos(phi);
    const rxy = r * Math.sin(phi);
    for (let j = 0; j < segs; j++) {
      const theta = 2 * Math.PI * j / segs;
      positions.push(rxy * Math.cos(theta), rxy * Math.sin(theta), z);
    }
  }
  positions.push(0, 0, -r);                // south pole = last vertex
  const south = positions.length / 3 - 1;

  // North cap fan
  for (let j = 0; j < segs; j++) {
    const a = 1 + j;
    const b = 1 + ((j + 1) % segs);
    indices.push(0, a, b);
  }
  // Middle rings
  for (let i = 0; i < rngs - 2; i++) {
    const rowA = 1 + i * segs;
    const rowB = 1 + (i + 1) * segs;
    for (let j = 0; j < segs; j++) {
      const a = rowA + j;
      const b = rowA + ((j + 1) % segs);
      const c = rowB + ((j + 1) % segs);
      const d = rowB + j;
      indices.push(a, c, b, a, d, c);
    }
  }
  // South cap fan
  const lastRow = 1 + (rngs - 2) * segs;
  for (let j = 0; j < segs; j++) {
    const a = lastRow + j;
    const b = lastRow + ((j + 1) % segs);
    indices.push(south, b, a);
  }
  return _build(positions, indices);
}

// ── Cylinder ───────────────────────────────────────────────────────────

/**
 * Solid cylinder, axis along +Z, base at origin.
 */
export function cylinder(r = 10, h = 20, segments = 32) {
  const segs = Math.max(3, segments | 0);
  const positions = [];
  const indices = [];

  positions.push(0, 0, 0);          // 0: bottom centre
  positions.push(0, 0, h);          // 1: top centre
  // Side ring (bottom + top)
  for (let i = 0; i < segs; i++) {
    const a = 2 * Math.PI * i / segs;
    positions.push(r * Math.cos(a), r * Math.sin(a), 0);
    positions.push(r * Math.cos(a), r * Math.sin(a), h);
  }
  for (let i = 0; i < segs; i++) {
    const ai = 2 + 2 * i;            // bottom-current
    const bi = 2 + 2 * ((i + 1) % segs); // bottom-next
    const at = ai + 1;               // top-current
    const bt = bi + 1;               // top-next
    indices.push(0, bi, ai);         // bottom fan (CCW from -Z)
    indices.push(1, at, bt);         // top fan    (CCW from +Z)
    indices.push(ai, bi, bt);        // side quad tri-1
    indices.push(ai, bt, at);        // side quad tri-2
  }
  return _build(positions, indices);
}

// ── Cone ───────────────────────────────────────────────────────────────

/**
 * Cone (solid) with bottom radius r1, top radius r2 (set r2=0 for tip).
 */
export function cone(r1 = 10, r2 = 0, h = 20, segments = 32) {
  const segs = Math.max(3, segments | 0);
  const positions = [];
  const indices = [];

  positions.push(0, 0, 0);          // 0: bottom centre
  positions.push(0, 0, h);          // 1: top centre
  for (let i = 0; i < segs; i++) {
    const a = 2 * Math.PI * i / segs;
    positions.push(r1 * Math.cos(a), r1 * Math.sin(a), 0);
    positions.push(r2 * Math.cos(a), r2 * Math.sin(a), h);
  }
  for (let i = 0; i < segs; i++) {
    const ai = 2 + 2 * i, bi = 2 + 2 * ((i + 1) % segs);
    const at = ai + 1, bt = bi + 1;
    indices.push(0, bi, ai);
    indices.push(1, at, bt);
    indices.push(ai, bi, bt);
    indices.push(ai, bt, at);
  }
  return _build(positions, indices);
}

// ── Torus ──────────────────────────────────────────────────────────────

/**
 * Torus: ring radius R (centre to tube centre), tube radius r.
 */
export function torus(R = 20, r = 5, ringSegs = 32, tubeSegs = 16) {
  const rs = Math.max(3, ringSegs | 0);
  const ts = Math.max(3, tubeSegs | 0);
  const positions = [];
  const indices = [];

  for (let i = 0; i < rs; i++) {
    const theta = 2 * Math.PI * i / rs;
    const cT = Math.cos(theta), sT = Math.sin(theta);
    for (let j = 0; j < ts; j++) {
      const phi = 2 * Math.PI * j / ts;
      const cP = Math.cos(phi), sP = Math.sin(phi);
      positions.push((R + r * cP) * cT, (R + r * cP) * sT, r * sP);
    }
  }
  for (let i = 0; i < rs; i++) {
    for (let j = 0; j < ts; j++) {
      const a = i * ts + j;
      const b = ((i + 1) % rs) * ts + j;
      const c = ((i + 1) % rs) * ts + ((j + 1) % ts);
      const d = i * ts + ((j + 1) % ts);
      indices.push(a, b, c, a, c, d);
    }
  }
  return _build(positions, indices);
}

// ── Regular prism ──────────────────────────────────────────────────────

/**
 * Regular n-sided prism (hex, octagon, etc), axis along +Z.
 */
export function prism(sides = 6, r = 10, h = 20) {
  return cylinder(r, h, Math.max(3, sides | 0));
}

// ── Pyramid ────────────────────────────────────────────────────────────

/**
 * Square-base pyramid. Tip at (0, 0, h), base spans (-w/2..+w/2).
 */
export function pyramid(w = 20, h = 20) {
  const half = w / 2;
  const positions = [
    -half, -half, 0, half, -half, 0, half, half, 0, -half, half, 0,
    0, 0, h,
  ];
  const indices = [
    0, 2, 1, 0, 3, 2,            // base (-Z)
    0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4, // side faces
  ];
  return _build(positions, indices);
}

// ── 2D extrude ─────────────────────────────────────────────────────────

/**
 * Extrude a CCW 2D polygon along +Z by depth.
 *
 * Polygon is an array of [x, y] points (closed loop, no repeated last
 * vertex). Resulting mesh is watertight provided the polygon is simple
 * (non-self-intersecting). Triangulates the cap using fan-from-centroid;
 * good enough for convex polygons and most printable silhouettes.
 *
 * @param {Array<[number, number]>} points
 * @param {number} depth
 */
export function extrudePolygon(points, depth = 5) {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error('extrudePolygon: need at least 3 points');
  }
  const n = points.length;
  // Centroid for fan triangulation.
  let cx = 0, cy = 0;
  for (const [x, y] of points) { cx += x; cy += y; }
  cx /= n; cy /= n;

  const positions = [];
  // Bottom centroid: 0; top centroid: 1.
  positions.push(cx, cy, 0);
  positions.push(cx, cy, depth);
  // Bottom + top ring.
  for (let i = 0; i < n; i++) {
    positions.push(points[i][0], points[i][1], 0);     // 2 + 2*i
    positions.push(points[i][0], points[i][1], depth); // 2 + 2*i + 1
  }
  const indices = [];
  for (let i = 0; i < n; i++) {
    const ai = 2 + 2 * i, bi = 2 + 2 * ((i + 1) % n);
    const at = ai + 1, bt = bi + 1;
    indices.push(0, bi, ai);    // bottom fan (-Z)
    indices.push(1, at, bt);    // top fan    (+Z)
    indices.push(ai, bi, bt);   // side
    indices.push(ai, bt, at);
  }
  return _build(positions, indices);
}

// ── Heightmap ──────────────────────────────────────────────────────────

/**
 * Build a watertight relief mesh from a 2D heightmap.
 *
 * `grid` is a 2D number array (rows of columns), values in mm. The
 * surface samples z = grid[y][x]; the underside is a flat plate at
 * z = base. Useful for image-to-mesh.
 *
 * @param {number[][]} grid
 * @param {number} cellSize - mm per grid cell
 * @param {number} base - thickness below the surface
 */
export function heightmapToMesh(grid, cellSize = 1, base = 1) {
  if (!Array.isArray(grid) || grid.length < 2 || !Array.isArray(grid[0])) {
    throw new Error('heightmapToMesh: grid must be a 2D number array');
  }
  const rows = grid.length;
  const cols = grid[0].length;
  const positions = [];
  // Top surface vertices
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      positions.push(x * cellSize, y * cellSize, base + (grid[y][x] || 0));
    }
  }
  // Bottom surface vertices (flat at z=0)
  const bottomOffset = positions.length / 3;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      positions.push(x * cellSize, y * cellSize, 0);
    }
  }
  const indices = [];
  // Top surface triangulation
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const a = y * cols + x;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }
  // Bottom surface triangulation (reversed winding)
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const a = bottomOffset + y * cols + x;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices.push(a, d, b, a, c, d);
    }
  }
  // Side walls
  for (let x = 0; x < cols - 1; x++) {
    // Front (y=0)
    const a = x;
    const b = x + 1;
    const aB = bottomOffset + x;
    const bB = bottomOffset + x + 1;
    indices.push(a, aB, bB, a, bB, b);
    // Back (y=rows-1)
    const ay = (rows - 1) * cols + x;
    const by = ay + 1;
    const ayB = bottomOffset + ay;
    const byB = bottomOffset + by;
    indices.push(ay, by, byB, ay, byB, ayB);
  }
  for (let y = 0; y < rows - 1; y++) {
    // Left (x=0)
    const a = y * cols;
    const b = (y + 1) * cols;
    const aB = bottomOffset + a;
    const bB = bottomOffset + b;
    indices.push(a, b, bB, a, bB, aB);
    // Right (x=cols-1)
    const ay = y * cols + (cols - 1);
    const by = (y + 1) * cols + (cols - 1);
    const ayB = bottomOffset + ay;
    const byB = bottomOffset + by;
    indices.push(ay, ayB, byB, ay, byB, by);
  }
  return _build(positions, indices);
}

export const _internals = { _build };
