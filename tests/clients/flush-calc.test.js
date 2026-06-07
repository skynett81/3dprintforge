// flush-calc.test.js — the colour-aware purge model (port of OrcaSlicer's
// calc_flush_vol_rgb). Asserts the qualitative properties the slicer guarantees.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { flushVolumeMm3, flushGrams, mm3ToGrams, parseHex } from '../../server/flush-calc.js';

describe('colour-aware flush model', () => {
  it('same colour -> minimum flush', () => {
    assert.equal(flushVolumeMm3('#FF0000', '#FF0000'), 107);
  });

  it('dark -> light needs MORE purge than light -> dark (the key asymmetry)', () => {
    const darkToLight = flushVolumeMm3('#000000', '#FFFFFF');
    const lightToDark = flushVolumeMm3('#FFFFFF', '#000000');
    assert.ok(darkToLight > lightToDark,
      `black->white (${darkToLight}) should exceed white->black (${lightToDark})`);
  });

  it('a big colour jump needs more than a small one', () => {
    const big = flushVolumeMm3('#FF0000', '#00FF00');   // red -> green
    const small = flushVolumeMm3('#FF0000', '#FF1010');  // red -> almost red
    assert.ok(big > small, `red->green (${big}) should exceed red->near-red (${small})`);
  });

  it('result is clamped to a sane range', () => {
    const v = flushVolumeMm3('#000000', '#FFFFFF');
    assert.ok(v >= 107 && v <= 800);
  });

  it('grams conversion scales with density', () => {
    assert.ok(mm3ToGrams(1000, 1.24) > mm3ToGrams(1000, 1.04)); // PLA denser than... lighter
    assert.ok(Math.abs(mm3ToGrams(1000, 1.24) - 1.24) < 1e-9);   // 1000 mm³ = 1 cm³
    assert.ok(flushGrams('#000000', '#FFFFFF') > 0);
  });

  it('parseHex handles with/without leading # and rejects junk', () => {
    assert.deepEqual(parseHex('#FFFFFF'), [255, 255, 255]);
    assert.deepEqual(parseHex('000000'), [0, 0, 0]);
    assert.equal(parseHex('xyz'), null);
    assert.equal(parseHex(null), null);
  });
});
