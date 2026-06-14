// print-tracker-retro.test.js — regression for print history silently dropping
// finished prints. Two faults, both surfaced when prints stopped appearing on
// the history page:
//   1. A finished print sitting in the printer at (re)connect was captured on
//      a single FINISH frame; if that first frame arrived before subtask_name
//      was populated it bailed to 'Unknown' and was lost forever. The retry now
//      keeps trying until the name is known.
//   2. addHistory() writes is_tool_changer, but the column was missing on some
//      DBs (v146 recorded but never applied) so EVERY insert threw. v150 heals
//      it — and this test fails loudly if that column ever goes missing again,
//      because the capture below would throw and return false.

import { describe, it, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { getDb } from '../../server/db/connection.js';
import { getHistory } from '../../server/db/history.js';
import { PrintTracker } from '../../server/print-tracker.js';

describe('print-tracker — retroactive capture retry', () => {
  before(() => setupTestDb());
  afterEach(() => { try { getDb().exec('DELETE FROM print_history'); } catch { /* ignore */ } });

  it('waits while subtask_name is missing, then records once it arrives', () => {
    const t = new PrintTracker('retro-printer');

    // First FINISH frame after connect, before the job name is known.
    const r1 = t._captureRetroactivePrint('FINISH', { gcode_state: 'FINISH' });
    assert.equal(r1, false, 'no filename yet should signal "retry on a later frame"');
    assert.equal(getHistory(10, 0, 'retro-printer').length, 0, 'must not record an Unknown print');

    // A later frame carries subtask_name -> capture succeeds.
    const r2 = t._captureRetroactivePrint('FINISH', { gcode_state: 'FINISH', subtask_name: 'My Print.gcode' });
    assert.equal(r2, true);
    const rows = getHistory(10, 0, 'retro-printer');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].filename, 'My Print.gcode');
    assert.equal(rows[0].status, 'completed');
  });

  it('is idempotent — a repeated FINISH frame does not duplicate the row', () => {
    const t = new PrintTracker('retro-printer2');
    assert.equal(t._captureRetroactivePrint('FINISH', { subtask_name: 'Dup.gcode' }), true);
    // Same print observed again on the next frame -> already recorded, no dupe.
    assert.equal(t._captureRetroactivePrint('FINISH', { subtask_name: 'Dup.gcode' }), true);
    const dupes = getHistory(10, 0, 'retro-printer2').filter(h => h.filename === 'Dup.gcode');
    assert.equal(dupes.length, 1);
  });

  it('captures a FAILED print with the failed status', () => {
    const t = new PrintTracker('retro-printer3');
    assert.equal(t._captureRetroactivePrint('FAILED', { subtask_name: 'Oops.gcode' }), true);
    assert.equal(getHistory(10, 0, 'retro-printer3')[0].status, 'failed');
  });
});
