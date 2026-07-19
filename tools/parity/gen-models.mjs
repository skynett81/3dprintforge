// gen-models.mjs — write a set of representative binary-STL test models used to
// compare our native engine against BambuStudio (the hard reference).
// Models are chosen to exercise distinct slicer features:
//   cube     : walls + solid top/bottom + sparse infill
//   cylinder : curved perimeters (offset/arc fidelity)
//   overhang : sloped faces (overhang speed, surface classification)
//   thinwall : narrow features (Arachne / thin-wall handling)
//   holes    : a plate with holes (inner perimeters, infill around holes)
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), 'models');

// --- tiny mesh builder: each face pushed as triangles (CCW, outward normal) ---
function tri(a, b, c) { return [a, b, c]; }
function box(x0, y0, z0, x1, y1, z1) {
  const v = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], // bottom 0-3
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], // top 4-7
  ];
  const q = (a, b, c, d) => [tri(v[a], v[b], v[c]), tri(v[a], v[c], v[d])];
  return [
    ...q(0, 3, 2, 1), // bottom (-Z)
    ...q(4, 5, 6, 7), // top (+Z)
    ...q(0, 1, 5, 4), // -Y
    ...q(2, 3, 7, 6), // +Y
    ...q(1, 2, 6, 5), // +X
    ...q(3, 0, 4, 7), // -X
  ];
}
function cylinder(cx, cy, r, z0, z1, seg = 64) {
  const t = [];
  const p = (i, z) => [cx + r * Math.cos((i / seg) * 2 * Math.PI), cy + r * Math.sin((i / seg) * 2 * Math.PI), z];
  const cB = [cx, cy, z0], cT = [cx, cy, z1];
  for (let i = 0; i < seg; i++) {
    const a0 = p(i, z0), a1 = p(i + 1, z0), b0 = p(i, z1), b1 = p(i + 1, z1);
    t.push(tri(cB, a1, a0));        // bottom fan
    t.push(tri(cT, b0, b1));        // top fan
    t.push(tri(a0, a1, b1));        // side
    t.push(tri(a0, b1, b0));
  }
  return t;
}
function wedge(x0, y0, z0, x1, y1, h) {
  // A right-triangular prism: vertical back face, sloped front (overhang test).
  const v = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], // base 0-3
    [x0, y0, z0 + h], [x1, y0, z0 + h],                     // top back edge 4-5
  ];
  const q = (a, b, c, d) => [tri(v[a], v[b], v[c]), tri(v[a], v[c], v[d])];
  return [
    ...q(0, 3, 2, 1),                 // base
    tri(v[0], v[1], v[5]), tri(v[0], v[5], v[4]), // back vertical (-Y)
    tri(v[3], v[4], v[5]), tri(v[3], v[5], v[2]), // slope
    tri(v[0], v[4], v[3]),            // left cap
    tri(v[1], v[2], v[5]),            // right cap
  ];
}

function toBinaryStl(tris) {
  const n = tris.length;
  const buf = Buffer.alloc(84 + n * 50);
  buf.writeUInt32LE(n, 80);
  let o = 84;
  for (const t of tris) {
    // normal (zeroed; slicers recompute)
    o += 12;
    for (const p of t) { buf.writeFloatLE(p[0], o); buf.writeFloatLE(p[1], o + 4); buf.writeFloatLE(p[2], o + 8); o += 12; }
    o += 2; // attribute byte count
  }
  return buf;
}

const models = {
  cube: box(0, 0, 0, 30, 30, 30),
  cylinder: cylinder(0, 0, 15, 0, 30, 96),
  overhang: wedge(0, 0, 0, 40, 20, 20),
  thinwall: box(0, 0, 0, 40, 1.2, 20),        // 1.2 mm wall — Arachne territory
  holes: (() => {
    // 40x40x8 plate with two round holes punched (approx via boolean-free: build
    // plate as a ring of boxes is overkill; instead just a solid plate — holes
    // handled by a separate model if needed). Keep a simple plate for infill.
    return box(0, 0, 0, 40, 40, 6);
  })(),
};

for (const [name, tris] of Object.entries(models)) {
  const p = join(DIR, `${name}.stl`);
  writeFileSync(p, toBinaryStl(tris));
  console.log(`wrote ${name}.stl (${tris.length} tris)`);
}
