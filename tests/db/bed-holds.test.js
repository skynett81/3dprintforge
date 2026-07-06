// bed-holds.test.js — Tests for operator bed-hold confirmation storage
// (print-farm safety: a finished print holds the bed until an operator
// confirms it has been cleared, before the scheduler dispatches the next job)

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  createQueue,
  getQueue,
  updateQueue,
  addBedHold,
  getBedHold,
  getBedHolds,
  clearBedHold,
} from '../../server/db/queue.js';

describe('Bed holds (operator confirmation)', () => {
  before(() => {
    setupTestDb();
  });

  it('createQueue persists require_confirmation', () => {
    const id = createQueue({ name: 'Farm run', require_confirmation: true });
    const q = getQueue(id);
    assert.equal(q.require_confirmation, 1);
  });

  it('require_confirmation defaults to 0', () => {
    const id = createQueue({ name: 'Casual' });
    assert.equal(getQueue(id).require_confirmation, 0);
  });

  it('updateQueue toggles require_confirmation', () => {
    const id = createQueue({ name: 'Toggle', require_confirmation: true });
    updateQueue(id, { require_confirmation: false });
    assert.equal(getQueue(id).require_confirmation, 0);
    updateQueue(id, { require_confirmation: true });
    assert.equal(getQueue(id).require_confirmation, 1);
  });

  it('addBedHold + getBedHold round-trips the hold details', () => {
    addBedHold('printer-1', { queueId: 42, printHistoryId: 7, filename: 'chassis.gcode' });
    const hold = getBedHold('printer-1');
    assert.ok(hold, 'hold should exist');
    assert.equal(hold.printer_id, 'printer-1');
    assert.equal(hold.queue_id, 42);
    assert.equal(hold.print_history_id, 7);
    assert.equal(hold.filename, 'chassis.gcode');
    assert.ok(hold.held_at, 'held_at should be set');
  });

  it('addBedHold is idempotent per printer (re-hold replaces)', () => {
    addBedHold('printer-2', { queueId: 1, filename: 'a.gcode' });
    addBedHold('printer-2', { queueId: 2, filename: 'b.gcode' });
    const hold = getBedHold('printer-2');
    assert.equal(hold.queue_id, 2);
    assert.equal(hold.filename, 'b.gcode');
    assert.equal(getBedHolds().filter(h => h.printer_id === 'printer-2').length, 1);
  });

  it('getBedHolds lists all active holds', () => {
    const ids = getBedHolds().map(h => h.printer_id);
    assert.ok(ids.includes('printer-1'));
    assert.ok(ids.includes('printer-2'));
  });

  it('clearBedHold removes the hold', () => {
    clearBedHold('printer-1');
    assert.equal(getBedHold('printer-1'), undefined);
    assert.ok(!getBedHolds().some(h => h.printer_id === 'printer-1'));
  });

  it('getBedHold returns undefined for an unheld printer', () => {
    assert.equal(getBedHold('never-held'), undefined);
  });
});
