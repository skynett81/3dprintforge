// native-slicer-multi.test.js — multi-material / multi-colour slicing with
// tool changes and flush-into-infill (waste as infill).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sliceMultiMaterialGcode } from '../../server/native-slicer-multi.js';
import { box } from '../../server/mesh-primitives.js';

function shiftX(mesh, dx) {
  return { positions: mesh.positions.map((v, i) => (i % 3 === 0 ? v + dx : v)), indices: mesh.indices };
}

describe('native-slicer: multi-material', () => {
  it('interleaves two colours per layer with tool changes', async () => {
    const a = { ...box(15, 15, 6), extruder: 1 };
    const b = { ...shiftX(box(15, 15, 6), 25), extruder: 2 };
    const r = await sliceMultiMaterialGcode([a, b], { flushIntoInfill: true, flushVolume: 80 });
    assert.equal(r.materials, 2);
    assert.ok(r.layers >= 25);
    assert.match(r.gcode, /^T0$/m);
    assert.match(r.gcode, /^T1$/m);
    assert.ok((r.gcode.match(/TOOL_CHANGE/g) || []).length > 10, 'many tool changes');
  });

  it('flush-into-infill deposits purge into infill (no waste tower)', async () => {
    const a = { ...box(15, 15, 6), extruder: 1 };
    const b = { ...shiftX(box(15, 15, 6), 25), extruder: 2 };
    const withInfill = await sliceMultiMaterialGcode([a, b], { flushIntoInfill: true, flushVolume: 80 });
    const withPurge = await sliceMultiMaterialGcode([a, b], { flushIntoInfill: false, flushVolume: 80 });
    assert.ok((withInfill.gcode.match(/flush into infill/g) || []).length > 10);
    assert.doesNotMatch(withInfill.gcode, /; purge/);
    assert.match(withPurge.gcode, /; purge/);
  });

  it('single material still slices', async () => {
    const r = await sliceMultiMaterialGcode([{ ...box(15, 15, 6), extruder: 1 }], {});
    assert.equal(r.materials, 1);
    assert.match(r.gcode, /; --- finished ---/);
  });
});
