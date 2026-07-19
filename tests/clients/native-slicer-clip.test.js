// native-slicer-clip.test.js — polygon boolean wrapper (the clipper the engine
// lacked). Backed by @jscad/modeling's robust 2D booleans, adapted to the
// engine's { outer, holes } region format.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { regionDifference, regionUnion, regionIntersection } from '../../server/native-slicer-clip.js';
import { _signedArea } from '../../server/native-slicer-geo.js';

const sq = (x0, y0, s) => [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]];
const area = (region) => Math.abs(_signedArea(region.outer)) - region.holes.reduce((a, h) => a + Math.abs(_signedArea(h)), 0);
const totalArea = (regions) => regions.reduce((a, r) => a + area(r), 0);

describe('native-slicer-clip: regionDifference', () => {
  it('a square minus a centred square leaves an outer with one hole', () => {
    const out = regionDifference({ outer: sq(0, 0, 10), holes: [] }, { outer: sq(3, 3, 4), holes: [] });
    assert.equal(out.length, 1, 'one region');
    assert.equal(out[0].holes.length, 1, 'with a hole');
    assert.ok(Math.abs(totalArea(out) - (100 - 16)) < 0.5, `area ~84 (got ${totalArea(out).toFixed(1)})`);
  });

  it('a bar minus a middle chunk splits into two disjoint regions', () => {
    // 30x4 bar, remove the middle 10x4 → two 10x4 pieces.
    const bar = { outer: [[0, 0], [30, 0], [30, 4], [0, 4]], holes: [] };
    const mid = { outer: [[10, -1], [20, -1], [20, 5], [10, 5]], holes: [] };
    const out = regionDifference(bar, mid);
    assert.equal(out.length, 2, 'two pieces');
    assert.ok(Math.abs(totalArea(out) - 80) < 1, `area ~80 (got ${totalArea(out).toFixed(1)})`);
  });

  it('subtracting a covering shape yields nothing', () => {
    const out = regionDifference({ outer: sq(0, 0, 5), holes: [] }, { outer: sq(-1, -1, 8), holes: [] });
    assert.equal(out.length, 0);
  });

  it('accepts an array of subtrahends', () => {
    const out = regionDifference({ outer: sq(0, 0, 10), holes: [] }, [{ outer: sq(0, 0, 3), holes: [] }, { outer: sq(7, 7, 3), holes: [] }]);
    assert.ok(Math.abs(totalArea(out) - (100 - 18)) < 1, `area ~82 (got ${totalArea(out).toFixed(1)})`);
  });
});

describe('native-slicer-clip: regionUnion / regionIntersection', () => {
  it('union of two overlapping squares is one region of the merged area', () => {
    const out = regionUnion([{ outer: sq(0, 0, 6), holes: [] }, { outer: sq(4, 4, 6), holes: [] }]);
    assert.equal(out.length, 1);
    // 36 + 36 − 4 (2x2 overlap) = 68
    assert.ok(Math.abs(totalArea(out) - 68) < 1, `area ~68 (got ${totalArea(out).toFixed(1)})`);
  });

  it('intersection of two overlapping squares is the shared area', () => {
    const out = regionIntersection({ outer: sq(0, 0, 6), holes: [] }, { outer: sq(4, 4, 6), holes: [] });
    assert.equal(out.length, 1);
    assert.ok(Math.abs(totalArea(out) - 4) < 0.5, `overlap ~4 (got ${totalArea(out).toFixed(1)})`);
  });

  it('disjoint squares do not intersect', () => {
    const out = regionIntersection({ outer: sq(0, 0, 5), holes: [] }, { outer: sq(20, 20, 5), holes: [] });
    assert.equal(out.length, 0);
  });
});
