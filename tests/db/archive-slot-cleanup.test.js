// Regression test: archiving a spool must free its AMS slot, otherwise
// two rows can claim the same (printer_id, ams_unit, ams_tray) — the
// archived empty one and a freshly auto-created one for the new reel.
// Most queries filter archived=0 so the symptom hides until a join or
// admin tool sees both rows and reports a phantom conflict.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addSpool, archiveSpool, getSpool, getSpoolBySlot } from '../../server/db/spools.js'; // eslint-disable-line no-duplicate-imports

const PRINTER = 'p1';

function spoolAt(slot) {
  const { id } = addSpool({
    initial_weight_g: 1000,
    remaining_weight_g: 0,
    printer_id: PRINTER,
    ams_unit: 0,
    ams_tray: slot,
  });
  return id;
}

describe('archiveSpool — slot cleanup', () => {
  beforeEach(() => setupTestDb());

  it('clears printer_id / ams_unit / ams_tray on archive', () => {
    const id = spoolAt(0);
    archiveSpool(id, true);
    const row = getSpool(id);
    assert.equal(row.archived, 1);
    assert.equal(row.printer_id, null);
    assert.equal(row.ams_unit, null);
    assert.equal(row.ams_tray, null);
  });

  it('leaves the slot free for a new spool to claim', () => {
    const oldId = spoolAt(0);
    archiveSpool(oldId, true);
    // New reel gets created in the same slot.
    const newId = spoolAt(0);
    // getSpoolBySlot only looks at archived=0 rows; should now point at
    // the new spool, not the old one.
    const found = getSpoolBySlot(PRINTER, 0, 0);
    assert.ok(found);
    assert.equal(found.id, newId);
  });

  it('only one active row claims the slot after archive + create', () => {
    const oldId = spoolAt(0);
    archiveSpool(oldId, true);
    const newId = spoolAt(0);
    // Cross-check at the SQL level: no two non-archived rows on this slot.
    // Locks down the data invariant the user reported (and that
    // motivates this fix).
    const row = getSpool(oldId);
    assert.equal(row.archived, 1);
    assert.notEqual(row.printer_id, PRINTER, 'archived row must not own the slot');
    const newRow = getSpool(newId);
    assert.equal(newRow.printer_id, PRINTER);
    assert.equal(newRow.ams_tray, 0);
  });

  it('unarchive does NOT re-link the slot (user must reassign)', () => {
    const id = spoolAt(0);
    archiveSpool(id, true);
    archiveSpool(id, false); // unarchive
    const row = getSpool(id);
    assert.equal(row.archived, 0);
    // Slot stays empty — restoring an archived spool to its old slot
    // could clobber a freshly-loaded reel. User triggers re-assignment
    // explicitly via the slot picker.
    assert.equal(row.printer_id, null);
    assert.equal(row.ams_tray, null);
  });

  it('addSpool with conflicting slot evicts the older active claim', () => {
    // Pre-existing active spool at slot 0.
    const oldId = spoolAt(0);
    // Manual create or auto-create targets the same slot — should bump
    // the old one out, not leave two active rows competing.
    const newId = spoolAt(0);
    const oldRow = getSpool(oldId);
    const newRow = getSpool(newId);
    assert.equal(oldRow.printer_id, null, 'old spool must be evicted from slot');
    assert.equal(newRow.printer_id, PRINTER, 'new spool owns the slot');
    assert.equal(newRow.ams_tray, 0);
    // getSpoolBySlot returns exactly one row.
    const bySlot = getSpoolBySlot(PRINTER, 0, 0);
    assert.ok(bySlot);
    assert.equal(bySlot.id, newId);
  });

  it('addSpool without slot fields touches no other rows', () => {
    const a = spoolAt(0);
    // Create another spool with no slot — must NOT clear A's slot.
    addSpool({ initial_weight_g: 1000 });
    const aRow = getSpool(a);
    assert.equal(aRow.printer_id, PRINTER);
    assert.equal(aRow.ams_tray, 0);
  });
});
