// native-slicer-support.test.js — Verify automatic support generation:
// overhangs get support columns, straight-walled parts do not.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { generateSupports } from '../../server/native-slicer-support.js';
import { sliceMeshToGcode } from '../../server/native-slicer.js';
import { box } from '../../server/mesh-primitives.js';

const SQUARE = (s, ox = 0, oy = 0) => [[ox, oy], [ox + s, oy], [ox + s, oy + s], [ox, oy + s]];

describe('native-slicer: generateSupports', () => {
  it('no supports for a straight vertical column (each layer identical)', () => {
    const layers = Array.from({ length: 20 }, () => [{ outer: SQUARE(10, 0, 0), holes: [] }]);
    const sup = generateSupports(layers, { gridRes: 1, density: 0.3 });
    const total = sup.reduce((n, segs) => n + segs.length, 0);
    assert.equal(total, 0, 'a straight column needs no support');
  });

  it('generates support under a floating overhang', () => {
    // Bottom 10 layers: nothing. Top 10 layers: a slab floating at x∈[0,20].
    // The floating slab from layer 10 up rests on air → needs support below.
    const layers = [];
    for (let i = 0; i < 10; i++) layers.push([]);                 // empty (air)
    for (let i = 10; i < 20; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
    const sup = generateSupports(layers, { gridRes: 2, density: 0.3, xyGap: 0, zGapLayers: 0 });
    const below = sup.slice(0, 10).reduce((n, segs) => n + segs.length, 0);
    assert.ok(below > 0, 'support columns fill the air beneath the floating slab');
    // The slab layers themselves are solid model → no support inside them.
    const inside = sup.slice(10).reduce((n, segs) => n + segs.length, 0);
    assert.equal(inside, 0, 'no support inside the model');
  });

  it('concentric interface emits closed rings instead of hatch lines', () => {
    const layers = [];
    for (let i = 0; i < 10; i++) layers.push([]);
    for (let i = 10; i < 20; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
    const opts = { gridRes: 2, density: 0.1, xyGap: 0, zGapLayers: 0, interfaceLayers: 3 };
    const rect = generateSupports(layers, opts);
    const conc = generateSupports(layers, { ...opts, interfacePattern: 'concentric' });
    const ifaceClosed = (sup) => sup.reduce((n, segs) => n + segs.filter((p) => p.iface && p.closed).length, 0);
    const ifaceOpen = (sup) => sup.reduce((n, segs) => n + segs.filter((p) => p.iface && !p.closed).length, 0);
    assert.ok(ifaceClosed(conc) > 0, 'concentric interface lays closed rings');
    assert.equal(ifaceClosed(rect), 0, 'rectilinear interface has no closed iface rings');
    assert.ok(ifaceOpen(rect) > 0, 'rectilinear interface uses open hatch');
  });

  it('z-gap removes the contact layer directly under the overhang', () => {
    const layers = [];
    for (let i = 0; i < 10; i++) layers.push([]);
    for (let i = 10; i < 20; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
    const gap0 = generateSupports(layers, { gridRes: 2, density: 0.3, xyGap: 0, zGapLayers: 0 });
    const gap1 = generateSupports(layers, { gridRes: 2, density: 0.3, xyGap: 0, zGapLayers: 1 });
    // Layer 9 is the contact layer (model at 10 above). With a 1-layer gap it clears.
    assert.ok(gap0[9].length > 0, 'no gap: contact layer supported');
    assert.equal(gap1[9].length, 0, 'z-gap: contact layer cleared for clean release');
    // Lower layers still supported in both.
    assert.ok(gap1[5].length > 0, 'columns below the gap remain');
  });

  it('threshold angle: gentle overhangs self-support, steep ones still get support', () => {
    // Inverted cones (widening circles) — smooth edges so the raster is not
    // grid-quantised. `grow` = radius added per layer (mm).
    const CIRCLE = (r) => { const p = []; for (let k = 0; k < 48; k++) { const a = (k / 48) * 2 * Math.PI; p.push([r * Math.cos(a), r * Math.sin(a)]); } return p; };
    const cone = (grow) => { const layers = []; for (let i = 0; i < 30; i++) layers.push([{ outer: CIRCLE(4 + i * grow), holes: [] }]); return layers; };
    const count = (layers, thr) => generateSupports(layers, { gridRes: 2, layerHeight: 0.3, thresholdAngle: thr, xyGap: 0 }).reduce((n, s) => n + s.length, 0);
    const gentle = cone(0.06);   // ~11° from vertical
    const steep = cone(0.7);     // ~67° from vertical
    assert.ok(count(gentle, 0) > 0, 'gentle overhang needs support with no threshold');
    assert.ok(count(gentle, 40) < count(gentle, 0) * 0.25, 'gentle slope mostly self-supports at 40°');
    assert.ok(count(steep, 40) > count(gentle, 40) * 3, 'steep overhang still needs support at 40°');
  });

  it('support wall count adds closed perimeter loops around the columns', () => {
    const layers = [];
    for (let i = 0; i < 10; i++) layers.push([]);
    for (let i = 10; i < 20; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
    const none = generateSupports(layers, { gridRes: 2, density: 0.3, xyGap: 0, zGapLayers: 0, wallCount: 0 });
    const walled = generateSupports(layers, { gridRes: 2, density: 0.3, xyGap: 0, zGapLayers: 0, wallCount: 2 });
    const closedCount = (frame) => frame.filter((el) => el.closed).length;
    assert.equal(closedCount(none[5]), 0, 'no walls without wallCount');
    assert.ok(closedCount(walled[5]) > 0, 'wallCount adds closed loops');
  });

  it('remove small overhangs drops tiny support islands', () => {
    const layers = [];
    for (let i = 0; i < 10; i++) layers.push([]);
    for (let i = 10; i < 20; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }, { outer: SQUARE(2, 60, 60), holes: [] }]);
    const off = generateSupports(layers, { gridRes: 2, removeSmallOverhangs: false, zGapLayers: 0, xyGap: 0 });
    const on = generateSupports(layers, { gridRes: 2, removeSmallOverhangs: true, minOverhangArea: 10, zGapLayers: 0, xyGap: 0 });
    const cnt = (f) => f.slice(0, 10).reduce((a, seg) => a + seg.length, 0);
    assert.ok(cnt(on) < cnt(off), 'the tiny 4mm² nub loses its support');
  });

  it('interface layers under the overhang are denser than deep support', () => {
    const layers = [];
    for (let i = 0; i < 10; i++) layers.push([]);
    for (let i = 10; i < 20; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
    const sup = generateSupports(layers, { gridRes: 2, density: 0.1, xyGap: 0, zGapLayers: 1, interfaceLayers: 2 });
    const iface = sup[8].length;   // just below the overhang (after the gap)
    const deep = sup[3].length;    // sparse column body
    assert.ok(iface > deep, `interface ${iface} should be denser than deep ${deep}`);
  });

  // Support painting (BambuStudio-style enforce/block regions).
  it('paint enforce forces support under a painted region (paint-only mode)', () => {
    // Floating slab, layers 5-9. No auto support (paintOnly). Enforce a triangle
    // under the slab centre (zMax = 5) → columns appear in the empty layers.
    const layers = [];
    for (let i = 0; i < 5; i++) layers.push([]);
    for (let i = 5; i < 10; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
    const enforce = [[5, 5, 15, 5, 10, 15, 5]];
    const none = generateSupports(layers, { gridRes: 2, layerHeight: 1, paintOnly: true, zGapLayers: 0, interfaceLayers: 0, wallCount: 0 });
    assert.equal(none.reduce((n, s) => n + s.length, 0), 0, 'paint-only with no paint → no support');
    const sup = generateSupports(layers, { gridRes: 2, layerHeight: 1, paintEnforce: enforce, paintOnly: true, zGapLayers: 0, interfaceLayers: 0, wallCount: 0 });
    const below = sup.slice(0, 5).reduce((n, s) => n + s.length, 0);
    assert.ok(below > 0, 'enforced support fills the air beneath the painted region');
  });

  it('tree supports branch: more tips under the overhang than trunks near the plate', async () => {
    const { generateTreeSupports } = await import('../../server/native-slicer-tree.js');
    const sq = SQUARE(40, 0, 0);
    const layers = [];
    for (let i = 0; i < 10; i++) layers.push([]);                 // air
    for (let i = 10; i < 20; i++) layers.push([{ outer: sq, holes: [] }]);   // floating slab
    const segs = generateTreeSupports(layers, { gridRes: 3, layerHeight: 1, zGapLayers: 1 });
    assert.equal(segs.slice(11).reduce((n, l) => n + l.length, 0), 0, 'no tree support inside/above the model');
    assert.ok(segs[9].length > 0, 'tips sprout under the overhang');
    assert.ok(segs[9].length > segs[1].length, 'more segments at the tips than the merged trunks below');
    assert.ok(segs[0].some((s) => s.closed), 'a foot is capped at the plate');
  });
  it('paint block removes support it overlaps', () => {
    const layers = [];
    for (let i = 0; i < 5; i++) layers.push([]);
    for (let i = 5; i < 10; i++) layers.push([{ outer: SQUARE(20, 0, 0), holes: [] }]);
    const enforce = [[5, 5, 15, 5, 10, 15, 5]];
    const block = [[3, 3, 17, 3, 10, 17, 5]];
    const sup = generateSupports(layers, { gridRes: 2, layerHeight: 1, paintEnforce: enforce, paintBlock: block, paintOnly: true, zGapLayers: 0, interfaceLayers: 0, wallCount: 0 });
    assert.equal(sup.reduce((n, s) => n + s.length, 0), 0, 'a blocker over the enforced region cancels the support');
  });
});

describe('native-slicer: supports end-to-end', () => {
  it('a plain cube slices with supports enabled but adds little/none', async () => {
    const r = await sliceMeshToGcode(box(12, 12, 8), { supports: true, layerHeight: 0.2 });
    assert.equal(r.supported, true);
    assert.ok(r.gcode.length > 3000);
  });

  it('supports flag toggles the supported result field', async () => {
    const off = await sliceMeshToGcode(box(10, 10, 6), { supports: false });
    assert.equal(off.supported, false);
  });
});
