import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { makeBeadingStrategy } from '../../server/native-slicer-beading.js';
import { arachneBeads } from '../../server/native-slicer-arachne.js';

describe('native-slicer: Arachne beading strategy (BambuStudio port)', () => {
  const bs = makeBeadingStrategy({ optimalWidth: 0.42 });

  it('maps thickness to the right bead count', () => {
    assert.equal(bs.getOptimalBeadCount(0.20), 0, 'too thin → no bead');
    assert.equal(bs.getOptimalBeadCount(0.42), 1, 'one optimal width → 1 bead');
    assert.equal(bs.getOptimalBeadCount(0.84), 2, 'two widths → 2 beads');
    assert.equal(bs.getOptimalBeadCount(1.26), 3, 'three widths → 3 beads');
  });

  it('compute() conserves the thickness exactly for every bead count', () => {
    for (const t of [0.42, 0.84, 1.26, 1.5, 2.1, 3.0, 5.0]) {
      const n = bs.getOptimalBeadCount(t);
      const { widths, locations, leftOver } = bs.compute(t, n);
      const sum = widths.reduce((a, b) => a + b, 0) + leftOver;
      assert.ok(Math.abs(sum - t) < 1e-6, `beads must sum to thickness (t=${t}, sum=${sum})`);
      // Locations strictly increasing and inside the section.
      for (let i = 0; i < n; i++) {
        assert.ok(locations[i] > 0 && locations[i] < t, `location in (0,t) — ${locations[i]} @ t=${t}`);
        if (i) assert.ok(locations[i] > locations[i - 1], 'locations increase');
      }
    }
  });

  it('widens middle beads rather than starving an extra one (distribution)', () => {
    // 3.0 mm at 0.42 → 7 beads, the central bead wider than optimal.
    const n = bs.getOptimalBeadCount(3.0);
    const { widths } = bs.compute(3.0, n);
    const mid = widths[(n - 1) >> 1];
    assert.ok(mid >= 0.42, 'central bead is at least optimal width');
    assert.ok(Math.max(...widths) <= 0.42 * 1.5, 'no bead grotesquely over-wide');
  });

  it('empty beading for sub-printable thickness', () => {
    const { widths, leftOver } = bs.compute(0.1, bs.getOptimalBeadCount(0.1));
    assert.equal(widths.length, 0);
    assert.ok(leftOver > 0);
  });
});

describe('native-slicer: Arachne variable-width beads over a region', () => {
  const rib = (w) => ({ outer: [[0, 0], [20, 0], [20, w], [0, w]], holes: [] });
  const beadArea = (beads) => {
    let a = 0;
    for (const b of beads) for (let i = 1; i < b.pts.length; i++) {
      const d = Math.hypot(b.pts[i][0] - b.pts[i - 1][0], b.pts[i][1] - b.pts[i - 1][1]);
      a += d * (b.widths[i] + b.widths[i - 1]) / 2;
    }
    return a;
  };

  it('a one-line rib is a single bead down its centre', () => {
    const beads = arachneBeads(rib(0.45), 0.42);
    assert.ok(beads.length >= 1, 'produces a bead');
    assert.ok(beads.length <= 2, 'a ~one-line rib is not split into many beads');
  });

  it('a wider rib is split into multiple beads', () => {
    const beads = arachneBeads(rib(1.5), 0.42);
    assert.ok(beads.length >= 2, 'a 1.5 mm rib needs more than one bead');
  });

  it('beads roughly cover the rib area (no gross under/over-fill)', () => {
    const region = rib(1.5);
    const cover = beadArea(arachneBeads(region, 0.42));
    const area = 20 * 1.5;
    assert.ok(cover > area * 0.7 && cover < area * 1.25, `coverage in range (got ${(100 * cover / area).toFixed(0)}%)`);
  });

  it('no NaN in produced points', () => {
    for (const b of arachneBeads(rib(2.0), 0.42)) {
      for (const [x, y] of b.pts) assert.ok(Number.isFinite(x) && Number.isFinite(y));
      for (const w of b.widths) assert.ok(Number.isFinite(w) && w > 0);
    }
  });
});
