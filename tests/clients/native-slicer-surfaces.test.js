// native-slicer-surfaces.test.js — top/bottom surface detection: infill turns
// solid on real horizontal faces (over a step), not just global edge layers.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { buildSurfaceClassifier } from '../../server/native-slicer-surfaces.js';
import { sliceMeshToGcode } from '../../server/native-slicer.js';
import { box } from '../../server/mesh-primitives.js';

const SQUARE = (s, ox, oy) => [[ox, oy], [ox + s, oy], [ox + s, oy + s], [ox, oy + s]];

describe('native-slicer: surface classifier', () => {
  // A stepped tower: 20mm base for layers 0..14, then a 10mm tower centred
  // for layers 15..29. The top of the base (the exposed ring) must be solid.
  const layers = [];
  for (let i = 0; i < 15; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
  for (let i = 15; i < 30; i++) layers.push([{ outer: SQUARE(10, 5, 5), holes: [] }]);
  const cls = buildSurfaceClassifier(layers, { gridRes: 2, topLayers: 4, bottomLayers: 4 });

  it('the exposed base ring is solid at the step layer', () => {
    // (2,2) is on the base but NOT under the tower → top surface at layer 14.
    assert.equal(cls.isSolidPoint(14, 2, 2), true);
  });

  it('a covered mid-column is sparse', () => {
    // (10,10) sits under the tower and above the base → fully enclosed.
    assert.equal(cls.isSolidPoint(10, 10, 10), false);
    // (2,2) mid-base is still covered within topLayers at layer 10.
    assert.equal(cls.isSolidPoint(10, 2, 2), false);
  });

  it('global bottom and top layers stay solid', () => {
    assert.equal(cls.isSolidPoint(0, 10, 10), true);
    assert.equal(cls.isSolidPoint(29, 10, 10), true);
  });
});

describe('native-slicer: surfaces end-to-end', () => {
  it('a plain cube still slices with solid shells + sparse middle', async () => {
    const r = await sliceMeshToGcode(box(20, 20, 10), { infillDensity: 0.15, topLayers: 4, bottomLayers: 4 });
    assert.equal(r.layers, 50);
    // Feature tags present: solid (shells) and sparse (middle).
    assert.match(r.gcode, /; FEATURE: (Top surface|Bottom surface|Internal solid infill)/);
    assert.match(r.gcode, /; FEATURE: Sparse infill/);
  });

  it('bridges the first top-shell layer over sparse infill (internal bridge)', async () => {
    // The lowest solid layer of the top shell sits over sparse infill, so it is
    // laid as a bridge (BambuStudio bridge_over_infill). Off → no bridge on a
    // plain box (no overhangs).
    const on = await sliceMeshToGcode(box(30, 30, 10), { infillDensity: 0.15, topLayers: 4, bottomLayers: 3 });
    const off = await sliceMeshToGcode(box(30, 30, 10), { infillDensity: 0.15, topLayers: 4, bottomLayers: 3, internalBridge: false });
    assert.ok(on.gcode.includes('; FEATURE: Bridge'), 'internal bridge present over sparse infill');
    assert.ok(!off.gcode.includes('; FEATURE: Bridge'), 'no bridge on a plain box when disabled');
  });

  it('does NOT bridge a sloped top surface (thin staircase ledges → solid, like BambuStudio)', async () => {
    // A ramp: 40x40 base, top slopes z=4 (x=0) → z=30 (x=40). Each layer exposes
    // a thin top-shell ledge over sparse. Those ledges are supported at the wall,
    // not spanning a gap, so they must be solid infill — NOT bridges (which would
    // lay diagonal bridge lines that read as errant streaks in the preview).
    const v = [
      [0, 0, 0], [40, 0, 0], [40, 40, 0], [0, 40, 0],
      [0, 0, 4], [40, 0, 30], [40, 40, 30], [0, 40, 4],
    ];
    const f = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]];
    const pos = [], idx = [];
    let vi = 0;
    for (const t of f) for (const i of t) { pos.push(...v[i]); idx.push(vi++); }
    const r = await sliceMeshToGcode({ positions: new Float32Array(pos), indices: new Uint32Array(idx) }, { infillDensity: 0.15, topLayers: 4, bottomLayers: 3 });
    // Count bridge extrusion length — the sloped top must produce (near) none.
    let feat = '', px = 0, py = 0, have = false, bridgeLen = 0;
    for (const l of r.gcode.split('\n')) {
      const fi = l.indexOf('FEATURE:'); if (fi >= 0) { feat = l.slice(fi + 8).trim(); continue; }
      const m = /^G[01]\b/.test(l) && { x: l.match(/X(-?[\d.]+)/), y: l.match(/Y(-?[\d.]+)/), e: l.match(/E(-?[\d.]+)/) };
      if (m) { const nx = m.x ? +m.x[1] : px, ny = m.y ? +m.y[1] : py; if ((m.x || m.y) && m.e && have && feat === 'Bridge') bridgeLen += Math.hypot(nx - px, ny - py); if (m.x || m.y) { px = nx; py = ny; have = true; } }
    }
    assert.ok(bridgeLen < 500, `sloped top should not bridge (got ${Math.round(bridgeLen)}mm)`);
  });

  it('fills thin sections with internal solid, not gap beads (BambuStudio parity)', async () => {
    // A thin upright wall: 40 x 2 x 16 mm. After 2 perimeters the ~1 mm core is
    // too thin for sparse but wide enough for solid lines — it must fill SOLID
    // (BambuStudio "internal solid infill"), not a lone medial gap bead that
    // under-fills and leaves the surface open.
    const v = [
      [0, 0, 0], [40, 0, 0], [40, 2, 0], [0, 2, 0],
      [0, 0, 16], [40, 0, 16], [40, 2, 16], [0, 2, 16],
    ];
    const f = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]];
    const pos = [], idx = [];
    let vi = 0;
    for (const t of f) for (const i of t) { pos.push(...v[i]); idx.push(vi++); }
    const measure = async (opts) => {
      const r = await sliceMeshToGcode({ positions: new Float32Array(pos), indices: new Uint32Array(idx) }, { infillDensity: 0.15, topLayers: 4, bottomLayers: 3, ...opts });
      let feat = '', px = 0, py = 0, have = false; const len = {};
      for (const l of r.gcode.split('\n')) {
        const fi = l.indexOf('FEATURE:'); if (fi >= 0) { feat = l.slice(fi + 8).trim(); continue; }
        const m = /^G[01]\b/.test(l) && { x: l.match(/X(-?[\d.]+)/), y: l.match(/Y(-?[\d.]+)/), e: l.match(/E(-?[\d.]+)/) };
        if (m) { const nx = m.x ? +m.x[1] : px, ny = m.y ? +m.y[1] : py; if ((m.x || m.y) && m.e && have) len[feat] = (len[feat] || 0) + Math.hypot(nx - px, ny - py); if (m.x || m.y) { px = nx; py = ny; have = true; } }
      }
      return len;
    };
    const on = await measure({});
    const off = await measure({ solidThinFill: false });
    // With the fix on, the thin core is solid and gap fill nearly vanishes.
    assert.ok((on['Internal solid infill'] || 0) > (off['Internal solid infill'] || 0), 'thin core now fills solid');
    assert.ok((on['Gap infill'] || 0) < (off['Gap infill'] || 1), 'gap-bead fill drops when thin sections go solid');
  });

  it('ironing adds a top-skin ironing pass when enabled', async () => {
    const plain = await sliceMeshToGcode(box(20, 20, 10), { infillDensity: 0.15, ironing: false });
    const ironed = await sliceMeshToGcode(box(20, 20, 10), { infillDensity: 0.15, ironing: true });
    assert.doesNotMatch(plain.gcode, /; FEATURE: Ironing/);
    assert.match(ironed.gcode, /; FEATURE: Ironing/);
  });
});
