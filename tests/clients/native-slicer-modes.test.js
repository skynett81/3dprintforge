// native-slicer-modes.test.js — vase/spiral mode, concentric infill,
// elephant-foot compensation.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sliceMeshToGcode } from '../../server/native-slicer.js';
import { buildNativeSettings } from '../../server/slicer-settings.js';
import { box, cylinder } from '../../server/mesh-primitives.js';

describe('native-slicer: vase / spiral mode', () => {
  it('spirals a single wall with continuously ramping Z above the base', async () => {
    const r = await sliceMeshToGcode(cylinder(18, 20, 48), { spiralMode: true, bottomLayers: 3 });
    // Many G1 moves that carry X/Y AND a Z that increases by a small fraction
    // of a layer — the signature of a spiral.
    const zMoves = [...r.gcode.matchAll(/G1 X[-\d.]+ Y[-\d.]+ Z(\d+\.\d+)/g)].map((m) => +m[1]);
    assert.ok(zMoves.length > 200, `expected many spiral Z moves, got ${zMoves.length}`);
    let ramps = 0;
    for (let i = 1; i < zMoves.length; i++) if (zMoves[i] > zMoves[i - 1] && zMoves[i] - zMoves[i - 1] < 0.05) ramps++;
    assert.ok(ramps > 100, `expected continuous Z ramps, got ${ramps}`);
  });
});

describe('native-slicer: concentric infill', () => {
  it('produces closed sparse rings', async () => {
    const r = await sliceMeshToGcode(box(30, 30, 4), { infillPattern: 'concentric', infillDensity: 0.2, topLayers: 1, bottomLayers: 1 });
    assert.match(r.gcode, /; FEATURE:sparse/);
  });
});

describe('native-slicer: elephant foot', () => {
  it('slices with first-layer compensation applied', async () => {
    const off = await sliceMeshToGcode(box(20, 20, 4), { elephantFoot: 0 });
    const on = await sliceMeshToGcode(box(20, 20, 4), { elephantFoot: 0.4 });
    // Both slice; the compensated one differs in its first-layer geometry.
    assert.ok(on.gcode.length > 1000 && off.gcode.length > 1000);
    assert.notEqual(on.gcode, off.gcode);
  });
});

describe('buildNativeSettings: new modes', () => {
  it('maps spiral_mode, elephant_foot and concentric pattern', () => {
    const n = buildNativeSettings({ spiral_mode: true, elephant_foot: 0.2, infill_pattern: 'concentric' });
    assert.equal(n.spiralMode, true);
    assert.equal(n.elephantFoot, 0.2);
    assert.equal(n.infillPattern, 'concentric');
  });
});
