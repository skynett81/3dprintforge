// eta-predictor.test.js — verify per-bucket EWMA learning + clamping.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  predictEta, recordCompletion, getEtaStats, listEtaStatsForPrinter, resetEtaBucket,
} from '../../server/eta-predictor.js';

describe('Smart ETA predictor', () => {
  before(() => setupTestDb());

  it('returns slicer estimate when no history exists', () => {
    const out = predictEta(60, { printerId: 'p1', material: 'PLA', nozzleDiameter: 0.4 });
    assert.equal(out.predicted_minutes, 60);
    assert.equal(out.multiplier, 1.0);
    assert.equal(out.samples, 0);
  });

  it('records first completion exactly as the ratio', () => {
    const stats = recordCompletion('p1', 'PLA', 0.4, 100, 110); // slicer 100, actual 110 → 1.1x
    assert.ok(stats);
    assert.ok(Math.abs(stats.multiplier - 1.1) < 1e-9);
    assert.equal(stats.samples, 1);
  });

  it('blends new samples with EWMA', () => {
    // Ratio 1.0 should pull the multiplier down towards 1.0
    recordCompletion('p1', 'PLA', 0.4, 100, 100);
    const after = getEtaStats('p1', 'PLA', 0.4);
    // alpha=0.25, mult was 1.1, ratio 1.0 → 0.75*1.1 + 0.25*1.0 = 1.075
    assert.ok(Math.abs(after.multiplier - 1.075) < 1e-9);
    assert.equal(after.samples, 2);
  });

  it('predicts using bucket multiplier', () => {
    const out = predictEta(60, { printerId: 'p1', material: 'PLA', nozzleDiameter: 0.4 });
    assert.equal(out.predicted_minutes, Math.round(60 * 1.075));
    assert.ok(out.confidence > 0);
  });

  it('clamps absurd ratios (paused/cancelled prints)', () => {
    const before = getEtaStats('p1', 'PLA', 0.4);
    recordCompletion('p1', 'PLA', 0.4, 100, 1000); // 10x — must be ignored
    recordCompletion('p1', 'PLA', 0.4, 100, 5);    // 0.05x — must be ignored
    const after = getEtaStats('p1', 'PLA', 0.4);
    assert.equal(after.multiplier, before.multiplier, 'multiplier unchanged');
    assert.equal(after.samples, before.samples, 'samples unchanged');
  });

  it('keeps separate buckets per (printer, material, nozzle)', () => {
    recordCompletion('p1', 'PETG', 0.4, 100, 130);
    recordCompletion('p1', 'PLA', 0.6, 100, 90);
    const all = listEtaStatsForPrinter('p1');
    const buckets = new Set(all.map(b => `${b.material}/${b.nozzle_diameter}`));
    assert.ok(buckets.has('PLA/0.4'));
    assert.ok(buckets.has('PETG/0.4'));
    assert.ok(buckets.has('PLA/0.6'));
  });

  it('isolates printers', () => {
    recordCompletion('p2', 'PLA', 0.4, 100, 95);
    const p1Stats = listEtaStatsForPrinter('p1').filter(b => b.material === 'PLA' && b.nozzle_diameter === 0.4);
    const p2Stats = listEtaStatsForPrinter('p2');
    assert.notEqual(p1Stats[0].multiplier, p2Stats[0].multiplier);
  });

  it('resetEtaBucket() clears the bucket', () => {
    recordCompletion('p3', 'ABS', 0.4, 100, 95);
    const ok = resetEtaBucket('p3', 'ABS', 0.4);
    assert.equal(ok, true);
    assert.equal(getEtaStats('p3', 'ABS', 0.4), undefined);
    assert.equal(resetEtaBucket('p3', 'ABS', 0.4), false); // already gone
  });

  it('ignores zero/negative inputs', () => {
    const before = getEtaStats('p1', 'PLA', 0.4);
    recordCompletion('p1', 'PLA', 0.4, 0, 50);
    recordCompletion('p1', 'PLA', 0.4, 50, 0);
    recordCompletion('p1', 'PLA', 0.4, -50, 50);
    const after = getEtaStats('p1', 'PLA', 0.4);
    assert.equal(after.samples, before.samples);
  });
});
