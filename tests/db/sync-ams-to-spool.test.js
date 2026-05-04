// Tests for syncAmsToSpool — the function that reconciles the local
// spool's remaining weight with what the AMS reports over MQTT.
//
// Two paths exist:
//   - sensor: AMS 2 Pro / H2D load cell (opts.actualWeightG, grams)
//   - percent: AMS Lite / original AMS (remainPct, 0-100)
//
// The bug this test locks down: before the fix, the function ignored
// the load-cell reading entirely and always derived weight from the
// percentage. AMS 2 Pro users got the same accuracy as AMS Lite users.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addSpool, getSpool, syncAmsToSpool } from '../../server/db/spools.js';

const PRINTER_ID = 'test-printer';

let spoolId;

function freshSpoolWithSlot({ initial = 1000, remaining = 1000, amsUnit = 0, amsTray = 0 } = {}) {
  const { id } = addSpool({
    initial_weight_g: initial,
    remaining_weight_g: remaining,
    printer_id: PRINTER_ID,
    ams_unit: amsUnit,
    ams_tray: amsTray,
  });
  return id;
}

describe('syncAmsToSpool', () => {
  // Fresh in-memory DB per test — keeps slot 0/0 unambiguous and lets us
  // assert against a known initial state without leak-from-previous-test.
  beforeEach(() => {
    setupTestDb();
    spoolId = freshSpoolWithSlot();
  });

  describe('sensor path (AMS 2 Pro / H2D)', () => {
    it('uses opts.actualWeightG directly when present', () => {
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, 50, { actualWeightG: 487.5 });
      assert.ok(result, 'expected sync result');
      assert.equal(result.source, 'sensor');
      assert.equal(result.newWeight, 487.5);
      // Stored in DB at the same value
      assert.equal(getSpool(spoolId).remaining_weight_g, 487.5);
    });

    it('ignores remainPct entirely when actualWeightG is given', () => {
      // Percent says 30% of 1000 = 300g. Sensor says 612g.
      // The function must trust the sensor.
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, 30, { actualWeightG: 612 });
      assert.ok(result);
      assert.equal(result.source, 'sensor');
      assert.equal(result.newWeight, 612);
    });

    it('still applies the noise gate (< 5g delta = no update)', () => {
      // Spool says 1000, sensor says 998 — under 5g, skip.
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, null, { actualWeightG: 998 });
      assert.equal(result, null);
      assert.equal(getSpool(spoolId).remaining_weight_g, 1000);
    });

    it('refuses to sync UPWARD (AMS cannot add filament)', () => {
      // Spool drained to 600. Sensor says 800 (drift / re-tare).
      // Must NOT update — our tracking knows what was used.
      const id = freshSpoolWithSlot({ remaining: 600, amsTray: 1 });
      const result = syncAmsToSpool(PRINTER_ID, 0, 1, null, { actualWeightG: 800 });
      assert.equal(result, null);
      assert.equal(getSpool(id).remaining_weight_g, 600);
    });

    it('updates used_weight_g consistently with remaining_weight_g', () => {
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, null, { actualWeightG: 750 });
      assert.ok(result);
      const row = getSpool(spoolId);
      assert.equal(row.remaining_weight_g, 750);
      assert.equal(row.used_weight_g, 250); // initial 1000 - remaining 750
    });

    it('rejects zero / negative / non-finite actualWeightG', () => {
      // Falls through to percent path — for these we ALSO pass remainPct=null,
      // so the function should return null.
      assert.equal(syncAmsToSpool(PRINTER_ID, 0, 0, null, { actualWeightG: 0 }), null);
      assert.equal(syncAmsToSpool(PRINTER_ID, 0, 0, null, { actualWeightG: -5 }), null);
      assert.equal(syncAmsToSpool(PRINTER_ID, 0, 0, null, { actualWeightG: NaN }), null);
    });
  });

  describe('percent path (AMS Lite / original AMS)', () => {
    it('derives weight from initial_weight_g × remainPct/100', () => {
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, 75); // 75% of 1000 = 750g
      assert.ok(result);
      assert.equal(result.source, 'percent');
      assert.equal(result.newWeight, 750);
    });

    it('still applies the < 5g noise gate', () => {
      // 99.7% of 1000 ≈ 997 — within noise, don't update.
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, 99.7);
      assert.equal(result, null);
    });

    it('refuses to sync UPWARD via percent too', () => {
      const id = freshSpoolWithSlot({ remaining: 400, amsTray: 2 });
      // 80% of 1000 = 800g, but spool says 400. Don't trust AMS adding.
      const result = syncAmsToSpool(PRINTER_ID, 0, 2, 80);
      assert.equal(result, null);
      assert.equal(getSpool(id).remaining_weight_g, 400);
    });
  });

  describe('preference: sensor > percent', () => {
    it('chooses sensor when both are available', () => {
      // Percent: 50% of 1000 = 500g
      // Sensor: 487.5g (more precise, plausible offset from a half-empty spool)
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, 50, { actualWeightG: 487.5 });
      assert.equal(result.source, 'sensor');
      assert.equal(result.newWeight, 487.5);
    });

    it('falls back to percent when sensor reading is missing', () => {
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, 60); // no opts
      assert.equal(result.source, 'percent');
      assert.equal(result.newWeight, 600);
    });

    it('falls back to percent when sensor reading is invalid', () => {
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, 60, { actualWeightG: 0 });
      assert.equal(result.source, 'percent');
      assert.equal(result.newWeight, 600);
    });
  });

  describe('edge cases', () => {
    it('returns null when no spool is mapped to that AMS slot', () => {
      const result = syncAmsToSpool(PRINTER_ID, 3, 3, 50, { actualWeightG: 500 });
      assert.equal(result, null);
    });

    it('returns null when both signals are missing', () => {
      const result = syncAmsToSpool(PRINTER_ID, 0, 0, null);
      assert.equal(result, null);
    });

    it('handles vt_tray (unit 255 / tray 0) like any other slot', () => {
      const id = freshSpoolWithSlot({ amsUnit: 255, amsTray: 0, remaining: 1000 });
      const result = syncAmsToSpool(PRINTER_ID, 255, 0, null, { actualWeightG: 845 });
      assert.ok(result);
      assert.equal(result.source, 'sensor');
      assert.equal(getSpool(id).remaining_weight_g, 845);
    });
  });
});
