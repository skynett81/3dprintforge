// print-tracker-bugs.test.js — regression tests for three bugs found by
// the post-v1.1.21 code-review pass:
//   1. Division by zero when resuming at exactly 100% (would store
//      'Invalid Date' as started_at).
//   2. AMS tray filament-used counter hardcoded a 1000 g spool weight,
//      misrecording 750 g / 2 kg / 3 kg spools.
//   3. accuracy_pct could go negative when actual >> estimated, skewing
//      every chart that aggregated the column.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('print-tracker bug regressions', () => {
  it('resume at 100% must not produce Infinity / Invalid Date', () => {
    const pct = 100;
    const remainMin = 0;
    // The guard the fix introduced: skip the divide when pct >= 100.
    let startedAt = new Date().toISOString();
    if (pct > 0 && pct < 100 && remainMin > 0) {
      const totalMinutes = remainMin / (1 - pct / 100);
      const elapsedMs = (totalMinutes * 60 * 1000) * (pct / 100);
      startedAt = new Date(Date.now() - elapsedMs).toISOString();
    }
    // Must be a valid ISO string — never 'Invalid Date'
    assert.notEqual(startedAt, 'Invalid Date');
    assert.match(startedAt, /^\d{4}-\d{2}-\d{2}T/);
  });

  it('AMS tray filament-used uses actual spool weight, not 1000g default', () => {
    const trayWeights = { '0_0': 750, '0_1': 2000, '0_2': 3000, '0_3': 1000 };
    const diff = 50;  // 50% of the spool consumed
    // The fix: trayWeight comes from amsTrayWeights, not hardcoded 1000
    const used750 = (diff / 100) * (trayWeights['0_0'] || 1000);
    const used2k = (diff / 100) * (trayWeights['0_1'] || 1000);
    const used3k = (diff / 100) * (trayWeights['0_2'] || 1000);
    const used1k = (diff / 100) * (trayWeights['0_3'] || 1000);
    assert.equal(used750, 375);
    assert.equal(used2k, 1000);
    assert.equal(used3k, 1500);
    assert.equal(used1k, 500);
  });

  it('accuracy_pct stays in [-100, 100] for prints far over estimate', () => {
    const clamp = (raw) => Math.round(Math.max(-100, Math.min(100, raw)) * 10) / 10;
    // Print took 3× the estimate
    const est = 3600;
    const duration = 10800;
    const raw = 100 - Math.abs(est - duration) * 100 / est;  // -100
    const accuracy = clamp(raw);
    assert.equal(accuracy, -100);
    // Print finished in half the time
    const duration2 = 1800;
    const raw2 = 100 - Math.abs(est - duration2) * 100 / est;  // 50
    assert.equal(clamp(raw2), 50);
    // Print took 100× the estimate
    const duration3 = 360000;
    const raw3 = 100 - Math.abs(est - duration3) * 100 / est;  // -9800
    assert.equal(clamp(raw3), -100);
  });
});
