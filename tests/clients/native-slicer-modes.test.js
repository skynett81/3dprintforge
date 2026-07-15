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

describe('native-slicer: gap fill', () => {
  it('solid-fills a thin rib but leaves a thick part on sparse infill', async () => {
    const { sliceMeshToLayers } = await import('../../server/native-slicer.js');
    const thin = await sliceMeshToLayers(box(1.6, 24, 8), { layerHeight: 0.3, perimeters: 2, infillDensity: 0.15, lineWidth: 0.4 });
    const thick = await sliceMeshToLayers(box(30, 30, 6), { layerHeight: 0.3, infillDensity: 0.15 });
    const count = (r, f) => { let c = 0; for (const L of r.layers) for (const p of L.paths) if (p.feature === f) c++; return c; };
    assert.ok(count(thin, 'gap') > 0, 'thin rib gets gap fill');
    assert.equal(count(thin, 'sparse'), 0, 'thin rib is not left as sparse');
    assert.equal(count(thick, 'gap'), 0, 'thick part gets no gap fill');
    assert.ok(count(thick, 'sparse') > 0, 'thick part keeps sparse infill');
  });

  it('gap fill can be disabled', async () => {
    const r = await sliceMeshToGcode(box(1.6, 24, 8), { gapFill: false, layerHeight: 0.3 });
    assert.doesNotMatch(r.gcode, /FEATURE:gap/);
  });
});

describe('native-slicer: arc fitting (G2/G3)', () => {
  it('fits a clean quarter-circle to one exact arc', async () => {
    const { fitArcs } = await import('../../server/native-slicer-arc.js');
    let g = 'G1 X10 Y0 F1200 ; travel\n'; let e = 0;
    for (let deg = 2; deg <= 90; deg += 2) { const a = deg * Math.PI / 180; e += 0.35; g += `G1 X${(10 * Math.cos(a)).toFixed(3)} Y${(10 * Math.sin(a)).toFixed(3)} E${e.toFixed(4)} F1200\n`; }
    const out = fitArcs(g, 0.02);
    const arc = out.split('\n').find((l) => /^G[23] /.test(l));
    assert.ok(arc, 'a circular run should become a G2/G3 arc');
    const m = arc.match(/^(G[23]) X(\S+) Y(\S+) I(\S+) J(\S+)/);
    const cx = 10 + parseFloat(m[4]), cy = 0 + parseFloat(m[5]);   // I/J relative to the start (10,0)
    assert.ok(Math.hypot(cx, cy) < 0.05, 'arc centre matches the true circle centre');
    assert.equal(m[1], 'G3', 'CCW sweep → G3');
  });

  it('leaves straight geometry alone (no false arcs on a box)', async () => {
    const r = await sliceMeshToGcode(box(20, 20, 3), { arcFitting: true });
    assert.equal((r.gcode.match(/^G[23] /gm) || []).length, 0);
  });

  it('a round wall produces arcs and shrinks the g-code', async () => {
    const { cylinder } = await import('../../server/mesh-primitives.js');
    const on = await sliceMeshToGcode(cylinder(15, 6, 64), { arcFitting: true, arcTolerance: 0.05 });
    const off = await sliceMeshToGcode(cylinder(15, 6, 64), { arcFitting: false });
    assert.ok((on.gcode.match(/^G[23] /gm) || []).length > 0);
    assert.ok(on.gcode.split('\n').length < off.gcode.split('\n').length);
  });
});

describe('native-slicer: XY compensation, small-perimeter, seam gap', () => {
  it('XY contour compensation changes the sliced outline', async () => {
    const a = await sliceMeshToGcode(box(20, 20, 3), {});
    const b = await sliceMeshToGcode(box(20, 20, 3), { xyContourCompensation: -0.1 });
    assert.notEqual(a.gcode, b.gcode);
  });

  it('small closed perimeters print at the small-perimeter speed', async () => {
    const { cylinder } = await import('../../server/mesh-primitives.js');
    const r = await sliceMeshToGcode(cylinder(2, 6, 24), { outerWallSpeed: 120, smallPerimeterSpeed: 20, smallPerimeterThreshold: 20 });
    assert.match(r.gcode, / F1200\b/);   // 20 mm/s
  });

  it('seam gap changes the loop-closing output', async () => {
    const a = await sliceMeshToGcode(box(20, 20, 3), { seamGap: 0 });
    const b = await sliceMeshToGcode(box(20, 20, 3), { seamGap: 0.3 });
    assert.notEqual(a.gcode, b.gcode);
  });
});

describe('native-slicer: avoid-crossing-walls travel (combing)', () => {
  it('routes a travel around a hole instead of across it', async () => {
    const { routeInside } = await import('../../server/native-slicer-geo.js');
    const regions = [{ outer: [[0, 0], [40, 0], [40, 40], [0, 40]], holes: [[[14, 14], [26, 14], [26, 26], [14, 26]]] }];
    const route = routeInside([5, 20], [35, 20], regions, { tol: 0.5 });
    assert.ok(route && route.length > 2, 'a detour (not a straight line) is returned');
    const inHole = (p) => p[0] > 14 && p[0] < 26 && p[1] > 14 && p[1] < 26;
    assert.ok(!route.some(inHole), 'no waypoint passes through the hole');
  });

  it('returns a straight route when the direct line is already inside', async () => {
    const { routeInside } = await import('../../server/native-slicer-geo.js');
    const regions = [{ outer: [[0, 0], [40, 0], [40, 40], [0, 40]], holes: [] }];
    const route = routeInside([5, 5], [35, 35], regions, { tol: 0.5 });
    assert.deepEqual(route, [[5, 5], [35, 35]]);
  });

  it('combing sharply reduces retractions vs no combing', async () => {
    const withComb = await sliceMeshToGcode(box(30, 30, 4), { avoidCrossingWalls: true, infillDensity: 0.2 });
    const noComb = await sliceMeshToGcode(box(30, 30, 4), { avoidCrossingWalls: false, infillDensity: 0.2 });
    const retracts = (g) => { let c = 0; const L = g.split('\n'); for (let i = 1; i < L.length; i++) if (/^G0 X/.test(L[i]) && /G1 E/.test(L[i - 1])) c++; return c; };
    // Connected zigzag infill already removes most in-region travels, so combing
    // has fewer moves to work on than with the old disconnected fill — but it
    // still routes a clear majority of the remaining travels inside the part,
    // avoiding their retractions.
    assert.ok(retracts(withComb.gcode) < retracts(noComb.gcode) * 0.7, 'combing keeps travels inside the part, avoiding many retractions');
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

  it('grades overhang speed PER SEGMENT (slow overhang + full speed on the same wall)', async () => {
    const { box: b, unionMeshes, offset } = await import('../../server/mesh-primitives.js');
    // Upper box shifted +8 in X over the lower box: its +X wall hangs over air,
    // its -X wall is supported — one wall loop, mixed overhang.
    const m = unionMeshes([b(20, 20, 6), offset(b(20, 20, 6), 8, 0, 6)]);
    const r = await sliceMeshToGcode(m, { layerHeight: 0.3, outerWallSpeed: 120, overhangSpeeds: [80, 50, 30, 10], supports: false });
    const speeds = new Set();
    let f = false;
    for (const l of r.gcode.split('\n')) { if (l.startsWith('; FEATURE:')) { f = l.includes('FEATURE:outer-wall'); continue; } const e = l.match(/^G1 X[-\d.]+ Y[-\d.]+ E[-\d.]+ F(\d+)/); if (e && f) speeds.add(+e[1]); }
    assert.ok(speeds.has(600), `steep overhang segments slow to 10 mm/s / F600 (got ${[...speeds]})`);
    assert.ok(speeds.has(7200), 'supported segments keep full 120 mm/s / F7200');
    assert.ok(!r.gcode.includes('NaN'));
  });

  it('detects bottom-over-air skin as bridges', async () => {
    const { box: b, unionMeshes, offset } = await import('../../server/mesh-primitives.js');
    const bridge = unionMeshes([offset(b(6, 6, 12), -14, 0, 0), offset(b(6, 6, 12), 14, 0, 0), offset(b(40, 6, 3), 0, 0, 7.5)]);
    const r = await sliceMeshToGcode(bridge, { bridgeFlow: 0.7, bridgeSpeed: 20, layerHeight: 0.3 });
    assert.match(r.gcode, /FEATURE:bridge/);
  });
});
