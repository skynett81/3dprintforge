// native-slicer-objects.test.js — per-object settings slicing.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sliceObjectsGcode } from '../../server/native-slicer.js';
import { box } from '../../server/mesh-primitives.js';

const shiftX = (m, dx) => ({ positions: m.positions.map((v, i) => (i % 3 === 0 ? v + dx : v)), indices: m.indices });

describe('native-slicer: per-object settings', () => {
  it('slices two objects, each with its own settings, into one G-code', async () => {
    const r = await sliceObjectsGcode([
      { mesh: box(15, 15, 8), settings: { infillDensity: 0.15, perimeters: 2 } },
      { mesh: shiftX(box(15, 15, 8), 25), settings: { infillDensity: 0.6, perimeters: 5 } },
    ], { layerHeight: 0.2, topLayers: 3, bottomLayers: 3 });
    assert.equal(r.objects, 2);
    assert.ok(r.layers >= 35);
    // A mid layer has an outer wall for BOTH objects.
    const mid = r.gcode.split('--- layer 20/')[1]?.split('--- layer 21/')[0] || '';
    assert.equal((mid.match(/FEATURE: Outer wall/g) || []).length, 2);
  });

  it('honours a per-object support override', async () => {
    const noSup = await sliceObjectsGcode([{ mesh: box(15, 15, 8), settings: {} }], { layerHeight: 0.2, supports: false });
    assert.doesNotMatch(noSup.gcode, /FEATURE: Support/);
  });
});
