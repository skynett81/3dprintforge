// input-shaper-analyzer.test.js — verify CSV parsing, peak detection,
// and shaper recommendation against synthetic resonance data.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseResonanceCsv, findPeak, recommendShaper, downsampleForPlot,
} from '../../server/input-shaper-analyzer.js';

// Synthesise a CSV with a clean peak at 50Hz on the X axis.
function _makeCsv(peakFreq = 50) {
  const rows = ['freq, x_psd, y_psd, z_psd, total_psd'];
  for (let f = 5; f <= 200; f++) {
    const dist = Math.abs(f - peakFreq);
    const xPsd = Math.exp(-dist * dist / 50) * 100 + 0.5; // gaussian peak
    const yPsd = 0.4;
    const zPsd = 0.3;
    rows.push(`${f}, ${xPsd.toFixed(4)}, ${yPsd}, ${zPsd}, ${(xPsd + yPsd + zPsd).toFixed(4)}`);
  }
  return rows.join('\n');
}

describe('parseResonanceCsv()', () => {
  it('parses standard Klipper CSV', () => {
    const data = parseResonanceCsv(_makeCsv(), 'x');
    assert.equal(data.freqs.length, 196); // 5..200 inclusive
    assert.ok(data.psd.every(v => Number.isFinite(v)));
  });

  it('rejects when axis column missing', () => {
    assert.throws(() => parseResonanceCsv('freq, total_psd\n10,1\n', 'x'));
  });

  it('skips comment lines and blanks', () => {
    const csv = '# header comment\nfreq, x_psd\n\n10, 1.5\n# another\n20, 2.5\n';
    const data = parseResonanceCsv(csv, 'x');
    assert.equal(data.freqs.length, 2);
  });
});

describe('findPeak()', () => {
  it('returns the frequency at maximum PSD', () => {
    const data = parseResonanceCsv(_makeCsv(50), 'x');
    const peak = findPeak(data);
    assert.equal(peak.peakFreq, 50);
    assert.ok(peak.snr > 10, `snr should be high for clean peak; got ${peak.snr}`);
  });
});

describe('recommendShaper()', () => {
  it('recommends a shaper for a typical 50Hz resonance', () => {
    const reco = recommendShaper(_makeCsv(50), 'x');
    assert.ok(reco.recommendation);
    assert.equal(reco.peakFreq, 50);
    assert.ok(['zv', 'mzv', 'zvd', 'ei', '2hump_ei', '3hump_ei'].includes(reco.recommendation.shaper));
    assert.match(reco.recommendation.command, /SET_INPUT_SHAPER/);
  });

  it('warns on out-of-range peak', () => {
    const csv = ['freq, x_psd', '1, 100', '2, 100', '3, 100', '4, 50'].join('\n');
    const reco = recommendShaper(csv, 'x');
    assert.equal(reco.recommendation, null);
    assert.ok(reco.warning.includes('outside'));
  });

  it('respects max smoothing constraint', () => {
    const reco = recommendShaper(_makeCsv(50), 'x', { maxSmoothing: 0.5 });
    assert.equal(reco.recommendation.shaper, 'zv'); // only ZV fits ≤ 0.5
  });

  it('returns ranked alternatives', () => {
    const reco = recommendShaper(_makeCsv(50), 'x');
    assert.ok(Array.isArray(reco.ranked));
    assert.equal(reco.ranked.length, 6);
    // ranked by ascending residual
    for (let i = 1; i < reco.ranked.length; i++) {
      assert.ok(reco.ranked[i].residual >= reco.ranked[i - 1].residual);
    }
  });
});

describe('downsampleForPlot()', () => {
  it('caps point count to bins', () => {
    const data = parseResonanceCsv(_makeCsv(), 'x');
    const out = downsampleForPlot(data, 50);
    assert.equal(out.length, 50);
    assert.ok(out.every(p => Number.isFinite(p.freq) && Number.isFinite(p.value)));
  });

  it('returns full data when input ≤ bins', () => {
    const data = parseResonanceCsv('freq, x_psd\n10, 1\n20, 2\n30, 3\n', 'x');
    const out = downsampleForPlot(data, 100);
    assert.equal(out.length, 3);
  });
});
