// Tests for recalibrateFromHistory — recomputes remaining_weight_g for
// a spool from print_history, ignoring spool_usage_log (which can carry
// misattributed entries when active-extruder tracking gets confused).

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addSpool, getSpool, recalibrateFromHistory } from '../../server/db/spools.js';
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

function logPrint(trayId, used, status = 'completed') {
  // addHistory binds undefined → SQLite error; provide explicit nulls for
  // every nullable column the record is allowed to leave blank.
  addHistory({
    printer_id: PRINTER,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    filename: 'test.gcode',
    status,
    duration_seconds: 600,
    filament_used_g: used,
    filament_type: null,
    filament_color: null,
    layer_count: 50,
    notes: null,
    tray_id: String(trayId),
  });
}

describe('recalibrateFromHistory', () => {
  beforeEach(() => setupTestDb());

  it('returns dry-run result without modifying the row', () => {
    const id = spoolAt(0, { initial: 1000, remaining: 0, used: 1000 });
    logPrint(0, 100);
    logPrint(0, 200);
    const result = recalibrateFromHistory(id, { apply: false });
    assert.equal(result.historyUsed, 300);
    assert.equal(result.newRemaining, 700);
    assert.equal(result.newUsed, 300);
    assert.equal(result.applied, undefined);
    // Row unchanged
    const row = getSpool(id);
    assert.equal(row.remaining_weight_g, 0);
    assert.equal(row.used_weight_g, 1000);
  });

  it('applies the new values when apply=true', () => {
    const id = spoolAt(0, { remaining: 0, used: 1000 });
    logPrint(0, 250);
    logPrint(0, 150);
    const result = recalibrateFromHistory(id, { apply: true });
    assert.equal(result.historyUsed, 400);
    assert.equal(result.applied, true);
    const row = getSpool(id);
    assert.equal(row.remaining_weight_g, 600);
    assert.equal(row.used_weight_g, 400);
  });

  it('only counts prints matching this spool tray (ignores other slots)', () => {
    const a1 = spoolAt(0, { initial: 1000, remaining: 0, used: 1000 });
    const a2 = spoolAt(1, { initial: 1000, remaining: 1000, used: 0 });
    logPrint(0, 200);  // A1
    logPrint(1, 500);  // A2
    logPrint(0, 100);  // A1
    const r = recalibrateFromHistory(a1, { apply: false });
    assert.equal(r.historyUsed, 300, 'should only sum tray=0 prints');
    assert.equal(r.prints, 2);
  });

  it('does NOT count external-spool prints (tray 254) — the original bug', () => {
    // The user's actual scenario: 18 prints to tray 254 wrongly
    // depleted A1. recalibrate must restore A1's true remaining.
    const a1 = spoolAt(0, { initial: 1000, remaining: 0, used: 1000 });
    logPrint(254, 1617); // big external-spool print, must be ignored
    logPrint(0, 100);     // actual A1 print
    const r = recalibrateFromHistory(a1, { apply: true });
    assert.equal(r.historyUsed, 100);
    assert.equal(getSpool(a1).remaining_weight_g, 900);
  });

  it('skips non-completed prints', () => {
    const id = spoolAt(0);
    logPrint(0, 200, 'completed');
    logPrint(0, 500, 'failed');     // unreliable filament_used_g
    logPrint(0, 100, 'cancelled');  // partial extrusion
    const r = recalibrateFromHistory(id, { apply: false });
    assert.equal(r.historyUsed, 200);
    assert.equal(r.prints, 1);
  });

  it('clamps newRemaining at 0 when history exceeds initial', () => {
    const id = spoolAt(0, { initial: 500 });
    logPrint(0, 1000); // somehow used more than initial — could be over-estimated
    const r = recalibrateFromHistory(id, { apply: true });
    assert.equal(r.newRemaining, 0);
    assert.ok(r.newUsed <= 500, 'used capped at initial');
  });

  it('returns an error result when spool has no slot assignment', () => {
    const { id } = addSpool({ initial_weight_g: 1000 }); // no printer_id / ams_tray
    const r = recalibrateFromHistory(id, { apply: false });
    assert.ok(r.error, 'expected error result');
  });

  it('returns null for missing or archived spool', () => {
    assert.equal(recalibrateFromHistory(999999, { apply: false }), null);
  });

  it('logs a recalibrated event in spool history when applied', async () => {
    const id = spoolAt(0, { remaining: 0, used: 1000 });
    logPrint(0, 250);
    recalibrateFromHistory(id, { apply: true, note: 'unit-test' });
    // Cross-module check: spool_events should contain the new event
    const { getSpoolTimeline } = await import('../../server/db/spools.js');
    const events = getSpoolTimeline(id);
    const recalibrated = events.find(e => e.event_type === 'recalibrated');
    assert.ok(recalibrated, 'expected a recalibrated event');
  });
});
