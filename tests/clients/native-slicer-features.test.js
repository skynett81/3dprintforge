// native-slicer-features.test.js — Verify the upgraded pure-JS slicer:
// hole/region grouping, solid top/bottom shells, skirt/brim, grid infill,
// and profile-driven start/end G-code.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildRegions, regionInfill, solidInfill, sliceMeshToGcode, layersToGcode,
} from '../../server/native-slicer.js';
import { _pointInPoly, offsetPolygon } from '../../server/native-slicer-geo.js';
import { box } from '../../server/mesh-primitives.js';

const SQUARE = (s, o = 0) => [[o, o], [o + s, o], [o + s, o + s], [o, o + s]];

describe('native-slicer: offsetPolygon miter limit', () => {
  it('growing a smooth circle outward stays hugging the outline (no spikes)', () => {
    // 48-gon circle r10; grow by 3mm. Without a miter limit, near-parallel
    // edges make vertices spike far out (the skirt-off-the-bed bug).
    const circle = [];
    for (let k = 0; k < 48; k++) { const a = k / 48 * 2 * Math.PI; circle.push([10 * Math.cos(a), 10 * Math.sin(a)]); }
    const grown = offsetPolygon(circle, 3);
    let maxR = 0;
    for (const [x, y] of grown) maxR = Math.max(maxR, Math.hypot(x, y));
    assert.ok(maxR < 10 + 3 * 2 + 0.5, `grown radius ${maxR.toFixed(1)} must stay near r+3, not spike`);
  });
  it('shrinking still collapses to nothing (walls/concentric depend on it)', () => {
    let ring = SQUARE(2, 0);
    for (let i = 0; i < 5 && ring && ring.length >= 3; i++) ring = offsetPolygon(ring, -0.4);
    assert.ok(!ring || ring.length < 3, 'a 2mm square shrinks away within a few offsets');
  });
});

describe('native-slicer: region / hole grouping', () => {
  it('groups an outer square with an inner hole into one region + one hole', () => {
    const outer = SQUARE(20);
    const hole = SQUARE(6, 7); // 6mm square centred inside
    const regions = buildRegions([outer, hole]);
    assert.equal(regions.length, 1, 'one solid region');
    assert.equal(regions[0].holes.length, 1, 'one hole attached');
  });

  it('two separate squares become two regions with no holes', () => {
    const a = SQUARE(10, 0);
    const b = SQUARE(10, 30);
    const regions = buildRegions([a, b]);
    assert.equal(regions.length, 2);
    assert.equal(regions[0].holes.length, 0);
    assert.equal(regions[1].holes.length, 0);
  });
});

describe('native-slicer: infill respects holes (even-odd)', () => {
  it('no infill segment passes through the hole interior', () => {
    const outer = SQUARE(20);
    const hole = SQUARE(6, 7);
    const region = { outer, holes: [hole] };
    const segs = regionInfill(region, 0.4, 0, 0.4);
    assert.ok(segs.length > 0, 'produces infill');
    // The hole centre is (10,10). No segment should span across it.
    for (const [a, b] of segs) {
      const crossesHoleY = Math.abs(((a[1] + b[1]) / 2) - 10) < 2; // near hole band
      if (crossesHoleY) {
        // If a line is at the hole's y-band, it must not cover x in [7,13].
        const lo = Math.min(a[0], b[0]), hi = Math.max(a[0], b[0]);
        const coversHoleX = lo < 8 && hi > 12;
        assert.ok(!coversHoleX, `segment ${JSON.stringify([a, b])} crosses hole`);
      }
    }
  });
});

describe('native-slicer: solid fill is denser than sparse', () => {
  it('solidInfill yields more segments than 20% sparse for the same area', () => {
    const region = { outer: SQUARE(20), holes: [] };
    const sparse = regionInfill(region, 0.2, 0, 0.4).length;
    const solid = solidInfill(region, 0, 0.4).length;
    assert.ok(solid > sparse * 2, `solid ${solid} should be >> sparse ${sparse}`);
  });
});

describe('native-slicer: end-to-end features', () => {
  it('produces solid bottom shells, walls and skirt for a cube', async () => {
    const cube = box(12, 12, 12);
    const r = await sliceMeshToGcode(cube, {
      layerHeight: 0.2, perimeters: 3, bottomLayers: 4, topLayers: 4,
      infillDensity: 0.15, infillPattern: 'grid', skirtLoops: 2, skirtGap: 3,
    });
    assert.equal(r.layers, 60);
    assert.ok(r.gcode.length > 5000);
    // Skirt is printed on the first layer, further out than the 12mm object
    // (object spans roughly 0..12 recentred to -6..6). A skirt point should
    // sit beyond +8 in X or Y somewhere in layer 1.
    const layer1 = r.gcode.split('; --- layer 2/')[0];
    const xs = [...layer1.matchAll(/X(-?\d+\.\d+)/g)].map(m => parseFloat(m[1]));
    assert.ok(Math.max(...xs) > 8 || Math.min(...xs) < -8, 'skirt extends beyond the part');
    assert.match(r.gcode, /; --- layer 60\/60/);
  });

  it('honours profile start/end G-code override', () => {
    const layers = [{ perimeters: [SQUARE(10)], infill: [] }];
    const g = layersToGcode(layers, {
      nozzleTemp: 220, bedTemp: 65,
      startGcode: 'M104 S[nozzle_temperature]\nSTART_PRINT BED=[bed_temperature]',
      endGcode: 'END_PRINT',
    });
    assert.match(g, /START_PRINT BED=65/);
    assert.match(g, /M104 S220/);
    assert.match(g, /END_PRINT/);
    // Default Marlin home should NOT appear when overridden.
    assert.doesNotMatch(g, /G28 ; home/);
  });
});
