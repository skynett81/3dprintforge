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

  it('ironing adds a top-skin ironing pass when enabled', async () => {
    const plain = await sliceMeshToGcode(box(20, 20, 10), { infillDensity: 0.15, ironing: false });
    const ironed = await sliceMeshToGcode(box(20, 20, 10), { infillDensity: 0.15, ironing: true });
    assert.doesNotMatch(plain.gcode, /; FEATURE: Ironing/);
    assert.match(ironed.gcode, /; FEATURE: Ironing/);
  });
});
