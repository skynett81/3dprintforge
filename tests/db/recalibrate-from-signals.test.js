// Tests for recalibrateFromSignals — the multi-source variant that picks
// the best available signal: AMS snapshot sensor > snapshot percent >
// print_history. Locks in the priority order so a future "trust history
// over snapshot" change fails the suite.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addSpool, getSpool, recalibrateFromSignals } from '../../server/db/spools.js';
import { addAmsSnapshot } from '../../server/db/maintenance.js';
import { addHistory } from '../../server/db/history.js';

const PRINTER = 'p1';

function spoolAt(amsTray, opts = {}) {
  const { id } = addSpool({
    initial_weight_g: opts.initial ?? 1000,
    remaining_weight_g: opts.remaining ?? opts.initial ?? 1000,
    used_weight_g: opts.used ?? 0,
    printer_id: PRINTER,
    ams_unit: 0,
    ams_tray: amsTray,
  });
  return id;
}

function snap(amsTray, fields = {}) {
  addAmsSnapshot({
    printer_id: PRINTER,
    ams_unit: 0,
    tray_id: amsTray,
    remain_pct: fields.pct ?? null,
    tray_weight: fields.weight ?? null,
    tray_color: fields.color ?? null,
  });
}

function logPrint(trayId, used) {
  addHistory({
    printer_id: PRINTER,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    filename: 't.gcode',
    status: 'completed',
    duration_seconds: 600,
    filament_used_g: used,
    filament_type: null,
    filament_color: null,
    layer_count: 50,
    notes: null,
    tray_id: String(trayId),
  });
}

describe('recalibrateFromSignals', () => {
  beforeEach(() => setupTestDb());

  describe('signal priority', () => {
    it('prefers credible sensor weight over percent and history', () => {
      const id = spoolAt(0, { remaining: 0, used: 1000 });
      // Sensor: 350g (above floor) — should win
      snap(0, { pct: 50, weight: 350 });
      logPrint(0, 200);
      const r = recalibrateFromSignals(id, { apply: true });
      assert.equal(r.chosen, 'snapshot_sensor');
      assert.equal(r.newRemaining, 350);
    });

    it('falls back to snapshot percent when sensor is at the static-init floor', () => {
      // tray_weight=1000 is the carried "initial" value, not a fresh
      // load-cell reading — the function treats it as no sensor signal.
      const id = spoolAt(0, { initial: 1000, remaining: 0, used: 1000 });
      snap(0, { pct: 20, weight: 1000 });
      logPrint(0, 999); // history says basically empty
      const r = recalibrateFromSignals(id, { apply: true });
      assert.equal(r.chosen, 'snapshot_percent');
      assert.equal(r.newRemaining, 200);
    });

    it('falls back to history when no snapshot exists', () => {
      const id = spoolAt(0, { remaining: 0, used: 1000 });
      logPrint(0, 300);
      // No snap() — function should pick history.
      const r = recalibrateFromSignals(id, { apply: true });
      assert.equal(r.chosen, 'history');
      assert.equal(r.newRemaining, 700);
    });

    it('uses history when snapshot has neither percent nor sensor', () => {
      const id = spoolAt(0);
      snap(0, { pct: null, weight: null });
      logPrint(0, 250);
      const r = recalibrateFromSignals(id, { apply: false });
      assert.equal(r.chosen, 'history');
    });
  });

  describe('user-reported scenario (AMS 2 Pro near-empty)', () => {
    it('returns snapshot percent of 20% as 200g remaining (A1 Cyan case)', () => {
      const id = spoolAt(0, { initial: 1000, remaining: 0, used: 1000 });
      snap(0, { pct: 20, weight: 1000, color: '0086D6FF' });
      logPrint(0, 506); // history says 494g remaining — but wrong because of misattribution
      const r = recalibrateFromSignals(id, { apply: true });
      assert.equal(r.chosen, 'snapshot_percent');
      assert.equal(r.newRemaining, 200);
      // Snapshot disagrees with history; signals object surfaces both
      // for the operator to compare.
      assert.equal(r.signals.history.derivedRemaining, 494);
      assert.equal(r.signals.snapshot.remainPct, 20);
    });

    it('handles A2 Cocoa Brown case: snapshot 0% means actually empty', () => {
      const id = spoolAt(1, { initial: 1000, remaining: 0, used: 1000 });
      snap(1, { pct: 0, weight: 1000 });
      logPrint(1, 199);
      const r = recalibrateFromSignals(id, { apply: true });
      // Snapshot 0% wins over history's 801g — firmware says empty.
      assert.equal(r.chosen, 'snapshot_percent');
      assert.equal(r.newRemaining, 0);
    });
  });

  describe('clamping and error paths', () => {
    it('clamps newRemaining at initial', () => {
      const id = spoolAt(0, { initial: 500 });
      snap(0, { pct: 95 }); // would compute 475g — already <= initial, no clamp needed
      const r = recalibrateFromSignals(id, { apply: false });
      assert.ok(r.newRemaining <= 500);
    });

    it('returns null for missing spool', () => {
      assert.equal(recalibrateFromSignals(99999, {}), null);
    });

    it('errors when spool has no AMS slot', () => {
      const { id } = addSpool({ initial_weight_g: 1000 });
      const r = recalibrateFromSignals(id, {});
      assert.ok(r.error);
    });
  });

  describe('audit trail', () => {
    it('writes a recalibrated event with chosen signal name', async () => {
      const id = spoolAt(0);
      snap(0, { pct: 33 });
      recalibrateFromSignals(id, { apply: true, note: 'test' });
      const { getSpoolTimeline } = await import('../../server/db/spools.js');
      const events = getSpoolTimeline(id);
      const ev = events.find(e => e.event_type === 'recalibrated');
      assert.ok(ev, 'event must be logged');
      const details = JSON.parse(ev.details);
      assert.equal(details.method, 'signals');
      assert.equal(details.chosen, 'snapshot_percent');
    });
  });
});
