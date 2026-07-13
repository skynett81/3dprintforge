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

describe('native-slicer: initial-layer temps and fan-off layers', () => {
  it('heats to initial temps, switches to steady after layer 1, delays fan', async () => {
    const r = await sliceMeshToGcode(box(20, 20, 3), {
      nozzleTemp: 210, bedTemp: 60, nozzleTempInitial: 230, bedTempInitial: 65,
      fanSpeed: 80, fanOffLayers: 2,
    });
    const g = r.gcode;
    // Start block heats to the initial-layer temps.
    assert.match(g, /M109 S230/);
    assert.match(g, /M190 S65/);
    // Fan is off at start (fanOffLayers > 0) and enabled later at 80% (=204).
    assert.match(g, /M107/);
    assert.match(g, /M106 S204/);
    // Steady temps are applied after the first layer.
    assert.match(g, /M104 S210/);
    assert.match(g, /M140 S60/);
  });
});

describe('native-slicer: acceleration, jerk, custom gcode hooks', () => {
  it('emits M204/M205 and interpolates layer-change / start / end gcode', async () => {
    const r = await sliceMeshToGcode(box(20, 20, 2), {
      acceleration: 4000, initialLayerAccel: 600, travelAccel: 8000, jerk: 12,
      startGcode: '; custom start [nozzle_temperature]', endGcode: '; custom end',
      layerChangeGcode: '; layer [layer_num] z [layer_z]', nozzleTemp: 215,
    });
    const g = r.gcode;
    assert.match(g, /M204 P600 T8000/);   // initial-layer acceleration
    assert.match(g, /M204 P4000/);        // steady acceleration after layer 1
    assert.match(g, /M205 X12 Y12/);
    assert.match(g, /; custom start 215/);
    assert.match(g, /; custom end/);
    assert.match(g, /; layer 1 z 0\.200/);
  });

  it('wipe-on-retract retracts along the previous path (no stationary retract)', async () => {
    const withWipe = await sliceMeshToGcode(box(20, 20, 1), { wipe: true, wipeDistance: 2, retraction: 1 });
    const noWipe = await sliceMeshToGcode(box(20, 20, 1), { wipe: false, retraction: 1 });
    assert.notEqual(withWipe.gcode, noWipe.gcode);
  });
});

describe('native-slicer: shell thickness and infill/wall overlap', () => {
  it('top/bottom shell thickness (mm) raises the solid layer counts', async () => {
    const { sliceMeshToLayers } = await import('../../server/native-slicer.js');
    const { s } = await sliceMeshToLayers(box(20, 20, 8), { layerHeight: 0.2, topLayers: 4, bottomLayers: 4, topShellThickness: 1.2, bottomShellThickness: 0.8 });
    assert.equal(s.topLayers, 6);       // ceil(1.2/0.2)
    assert.equal(s.bottomLayers, 4);    // ceil(0.8/0.2)=4, not below configured
  });

  it('infill/wall overlap changes the sliced output', async () => {
    const a = await sliceMeshToGcode(box(30, 30, 4), { infillWallOverlap: 0, infillDensity: 0.2 });
    const b = await sliceMeshToGcode(box(30, 30, 4), { infillWallOverlap: 0.4, infillDensity: 0.2 });
    assert.notEqual(a.gcode, b.gcode);
  });
});

describe('native-slicer: real infill patterns', () => {
  it('gyroid / honeycomb / cubic all produce sparse infill', async () => {
    for (const pattern of ['gyroid', 'honeycomb', 'cubic']) {
      const r = await sliceMeshToGcode(box(30, 30, 6), { infillPattern: pattern, infillDensity: 0.2, topLayers: 1, bottomLayers: 1 });
      assert.match(r.gcode, /FEATURE:sparse/, `${pattern} should emit sparse infill`);
    }
  });

  it('gyroid infill varies with height (true TPMS, not a flat pattern)', async () => {
    const { gyroidInfill } = await import('../../server/native-slicer-geo.js');
    const region = { outer: [[0, 0], [40, 0], [40, 40], [0, 40]], holes: [] };
    const a = gyroidInfill(region, 0.2, 0.4, 0);
    const b = gyroidInfill(region, 0.2, 0.4, 2);
    assert.ok(a.length > 0 && b.length > 0);
    assert.notEqual(JSON.stringify(a), JSON.stringify(b));
  });

  it('gyroid segments are chained into continuous polylines (few retractions)', async () => {
    const { gyroidInfill } = await import('../../server/native-slicer-geo.js');
    const region = { outer: [[0, 0], [40, 0], [40, 40], [0, 40]], holes: [] };
    const polys = gyroidInfill(region, 0.2, 0.4, 3);
    const longest = Math.max(...polys.map((p) => p.length));
    assert.ok(longest > 10, 'gyroid should chain into long polylines, not tiny segments');
  });
});

describe('native-slicer: overhang and bridge detection', () => {
  it('flags overhang walls on a steep inverted cone but not on a vertical box', async () => {
    const cone = (await import('../../server/mesh-primitives.js')).cone;
    const steep = await import('../../server/native-slicer.js').then((m) => m.sliceMeshToLayers(cone(2, 30, 12, 48), { layerHeight: 0.3 }));
    let coneOverhang = 0;
    for (const L of steep.layers) for (const p of L.paths) if (p.overhang) coneOverhang++;
    assert.ok(coneOverhang > 0, 'steep overhang cone should flag overhang walls');

    const boxL = await import('../../server/native-slicer.js').then((m) => m.sliceMeshToLayers(box(20, 20, 6), { layerHeight: 0.3 }));
    let boxOverhang = 0;
    for (const L of boxL.layers) for (const p of L.paths) if (p.overhang) boxOverhang++;
    assert.equal(boxOverhang, 0, 'vertical walls must not be flagged as overhangs');
  });

  it('applies overhang speed + fan boost in the g-code', async () => {
    const cone = (await import('../../server/mesh-primitives.js')).cone;
    const r = await sliceMeshToGcode(cone(2, 30, 12, 48), { overhangSpeed: 25, overhangFanSpeed: 100, fanSpeed: 50, outerWallSpeed: 120, layerHeight: 0.3 });
    assert.match(r.gcode, / F1500\b/);     // 25 mm/s overhang moves
    assert.match(r.gcode, /M106 S255/);    // 100% fan boost over overhangs
  });

  it('detects bottom-over-air skin as bridges', async () => {
    const { box: b, unionMeshes, offset } = await import('../../server/mesh-primitives.js');
    const bridge = unionMeshes([offset(b(6, 6, 12), -14, 0, 0), offset(b(6, 6, 12), 14, 0, 0), offset(b(40, 6, 3), 0, 0, 7.5)]);
    const r = await sliceMeshToGcode(bridge, { bridgeFlow: 0.7, bridgeSpeed: 20, layerHeight: 0.3 });
    assert.match(r.gcode, /FEATURE:bridge/);
  });
});
