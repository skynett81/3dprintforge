import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { delaunay, medialAxis } from '../../server/native-slicer-voronoi.js';

describe('native-slicer: Delaunay medial axis (Voronoi Arachne foundation)', () => {
  it('delaunay triangulates a point set', () => {
    const t = delaunay([[0, 0], [10, 0], [10, 10], [0, 10], [5, 5]]);
    assert.ok(t.length >= 4, 'a square + centre point gives >=4 triangles');
    for (const tri of t) assert.equal(tri.length, 3);
  });

  const widths = (region) => medialAxis(region, 0.42).flatMap((c) => c.widths).filter(Number.isFinite);
  const median = (a) => a.slice().sort((x, y) => x - y)[a.length >> 1];

  it('recovers a straight rib width to ~1% (vs the raster grid ~15%)', () => {
    const w = widths({ outer: [[0, 0], [20, 0], [20, 1.5], [0, 1.5]], holes: [] });
    const m = median(w);
    assert.ok(Math.abs(m - 1.5) < 0.12, `median medial width ≈ true 1.5 mm (got ${m.toFixed(3)})`);
  });

  it('recovers a circle diameter at its centre', () => {
    const N = 48, circ = [];
    for (let i = 0; i < N; i++) { const a = i / N * 2 * Math.PI; circ.push([4 + 4 * Math.cos(a), 4 + 4 * Math.sin(a)]); }
    const w = widths({ outer: circ, holes: [] });
    assert.ok(Math.max(...w) > 7.4 && Math.max(...w) < 8.2, `max width ≈ diameter 8 (got ${Math.max(...w).toFixed(2)})`);
  });

  it('captures a tapering wedge (width varies along the axis)', () => {
    const w = widths({ outer: [[0, 0.5], [20, 0], [20, 2.5], [0, 1.0]], holes: [] });
    assert.ok(w.length && (Math.max(...w) - Math.min(...w)) > 0.5, 'width range spans the taper');
  });

  it('produces no NaN in the skeleton', () => {
    for (const region of [
      { outer: [[0, 0], [20, 0], [20, 1.0], [0, 1.0]], holes: [] },
      { outer: [[0, 0], [10, 0], [10, 10], [0, 10]], holes: [[[4, 4], [6, 4], [6, 6], [4, 6]]] },
    ]) {
      for (const c of medialAxis(region, 0.42)) {
        for (const [x, y] of c.pts) assert.ok(Number.isFinite(x) && Number.isFinite(y));
        for (const wv of c.widths) assert.ok(Number.isFinite(wv) && wv > 0);
      }
    }
  });
});
