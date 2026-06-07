// color-order.js — recommend the filament colour order that minimises total
// purge for a multi-colour print. Uses the slicer-faithful flush model
// (flush-calc.js). The flush between two colours is asymmetric (dark->light
// costs more), so this is an asymmetric TSP over the colour set.
//
// For a repeating multi-colour print the relevant cost is the sum of flushes
// around a CYCLE through all colours (…A->B->C->A…). For N <= 8 filaments we
// brute-force the optimum; above that we use nearest-neighbour + 2-opt.

import { flushVolumeMm3, mm3ToGrams } from './flush-calc.js';

const BRUTE_LIMIT = 8;

function buildMatrix(colors) {
  const n = colors.length;
  const m = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (i !== j) m[i][j] = flushVolumeMm3(colors[i], colors[j]);
  return m;
}

// Total flush around the cycle order[0]->order[1]->...->order[n-1]->order[0].
function cycleCost(order, m) {
  let total = 0;
  for (let i = 0; i < order.length; i++)
    total += m[order[i]][order[(i + 1) % order.length]];
  return total;
}

function bruteForce(m) {
  const n = m.length;
  // Fix index 0 to remove rotational duplicates.
  const rest = [];
  for (let i = 1; i < n; i++) rest.push(i);
  let best = null, bestCost = Infinity;
  const permute = (arr, k) => {
    if (k === arr.length) {
      const order = [0, ...arr];
      const c = cycleCost(order, m);
      if (c < bestCost) { bestCost = c; best = order.slice(); }
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      permute(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  };
  permute(rest, 0);
  return { order: best, cost: bestCost };
}

function nearestNeighbour(m) {
  const n = m.length;
  const visited = new Array(n).fill(false);
  const order = [0];
  visited[0] = true;
  for (let step = 1; step < n; step++) {
    const last = order[order.length - 1];
    let next = -1, bestD = Infinity;
    for (let j = 0; j < n; j++)
      if (!visited[j] && m[last][j] < bestD) { bestD = m[last][j]; next = j; }
    order.push(next); visited[next] = true;
  }
  return order;
}

function twoOpt(order, m) {
  let improved = true;
  let best = order.slice();
  let bestCost = cycleCost(best, m);
  while (improved) {
    improved = false;
    for (let i = 1; i < best.length - 1; i++) {
      for (let k = i + 1; k < best.length; k++) {
        const cand = best.slice(0, i).concat(best.slice(i, k + 1).reverse(), best.slice(k + 1));
        const c = cycleCost(cand, m);
        if (c < bestCost - 1e-9) { best = cand; bestCost = c; improved = true; }
      }
    }
  }
  return { order: best, cost: bestCost };
}

// Average cycle cost of a few random orders — a fair "no optimisation" baseline.
function baselineCost(m) {
  const n = m.length;
  const idx = Array.from({ length: n }, (_, i) => i);
  // Identity order is as good a "naive" baseline as any deterministic choice.
  return cycleCost(idx, m);
}

/**
 * @param {string[]} colors  filament colours as "#RRGGBB"
 * @param {number} densityGcm3  for the grams figure (default PLA 1.24)
 * @returns optimised order + savings vs the naive (load-as-listed) order.
 */
function optimizeColorOrder(colors, densityGcm3 = 1.24) {
  const n = Array.isArray(colors) ? colors.length : 0;
  if (n < 2) {
    return { order: n === 1 ? [0] : [], orderedColors: colors || [],
      optimizedFlushMm3: 0, optimizedFlushG: 0, baselineFlushMm3: 0, baselineFlushG: 0,
      savedMm3: 0, savedG: 0, savedPct: 0, method: 'trivial' };
  }
  const m = buildMatrix(colors);
  const baseline = baselineCost(m);
  let result, method;
  if (n <= BRUTE_LIMIT) {
    result = bruteForce(m); method = 'brute-force';
  } else {
    result = twoOpt(nearestNeighbour(m), m); method = 'nn+2opt';
  }
  const opt = result.cost;
  const savedMm3 = Math.max(0, baseline - opt);
  return {
    order: result.order,
    orderedColors: result.order.map((i) => colors[i]),
    optimizedFlushMm3: Math.round(opt),
    optimizedFlushG: Math.round(mm3ToGrams(opt, densityGcm3) * 100) / 100,
    baselineFlushMm3: Math.round(baseline),
    baselineFlushG: Math.round(mm3ToGrams(baseline, densityGcm3) * 100) / 100,
    savedMm3: Math.round(savedMm3),
    savedG: Math.round(mm3ToGrams(savedMm3, densityGcm3) * 100) / 100,
    savedPct: baseline > 0 ? Math.round((savedMm3 / baseline) * 1000) / 10 : 0,
    method,
  };
}

export { optimizeColorOrder, buildMatrix, cycleCost };
