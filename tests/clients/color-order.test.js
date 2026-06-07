// color-order.test.js — the lowest-purge colour ordering recommender.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { optimizeColorOrder, cycleCost, buildMatrix } from '../../server/color-order.js';

describe('smart colour ordering', () => {
  it('handles trivial cases (0 or 1 colour)', () => {
    assert.equal(optimizeColorOrder([]).order.length, 0);
    assert.deepEqual(optimizeColorOrder(['#FF0000']).order, [0]);
  });

  it('the optimised cycle is never worse than the as-listed order', () => {
    const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'];
    const r = optimizeColorOrder(colors);
    assert.ok(r.optimizedFlushMm3 <= r.baselineFlushMm3);
    assert.ok(r.savedMm3 >= 0 && r.savedPct >= 0);
  });

  it('orders a light->dark gradient to minimise purge (groups similar luminance)', () => {
    // A deliberately bad input order (alternating extremes) should be improvable.
    const colors = ['#FFFFFF', '#000000', '#EEEEEE', '#111111', '#DDDDDD', '#222222'];
    const r = optimizeColorOrder(colors);
    // The optimum should cost strictly less than the alternating baseline.
    assert.ok(r.optimizedFlushMm3 < r.baselineFlushMm3, `opt ${r.optimizedFlushMm3} vs base ${r.baselineFlushMm3}`);
    assert.ok(r.savedPct > 0);
  });

  it('brute force for small N matches an exhaustive check', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
    const r = optimizeColorOrder(colors);
    const m = buildMatrix(colors);
    // No permutation of these 4 can beat the reported optimum.
    const perms = [];
    const gen = (a, k) => { if (k === a.length) { perms.push(a.slice()); return; }
      for (let i = k; i < a.length; i++) { [a[k], a[i]] = [a[i], a[k]]; gen(a, k + 1); [a[k], a[i]] = [a[i], a[k]]; } };
    gen([0, 1, 2, 3], 0);
    const best = Math.min(...perms.map((p) => cycleCost(p, m)));
    assert.equal(r.optimizedFlushMm3, Math.round(best));
  });

  it('larger N uses the heuristic and still returns a valid permutation', () => {
    const colors = Array.from({ length: 12 }, (_, i) =>
      '#' + (i * 0x151515).toString(16).padStart(6, '0').slice(0, 6));
    const r = optimizeColorOrder(colors);
    assert.equal(r.method, 'nn+2opt');
    assert.equal(new Set(r.order).size, 12); // a real permutation, no repeats
  });
});
