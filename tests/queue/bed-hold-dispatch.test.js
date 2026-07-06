// bed-hold-dispatch.test.js — QueueManager operator-confirmation behavior.
// A finished print on a require_confirmation queue must hold the bed (no
// auto-dispatch) until confirmBedCleared() releases it.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { createQueue, addQueueItem, getBedHold } from '../../server/db/queue.js';
import { QueueManager } from '../../server/queue-manager.js';

function makeManager() {
  const broadcasts = [];
  // One live, idle printer the scheduler would otherwise dispatch to.
  const printers = new Map([
    ['printer-A', { live: true, client: {}, tracker: { previousState: { gcode_state: 'IDLE' } } }],
  ]);
  const pm = { printers };
  const qm = new QueueManager(pm, null, (event, payload) => broadcasts.push({ event, payload }), null);
  return { qm, broadcasts };
}

describe('QueueManager bed-hold (operator confirmation)', () => {
  let qm, broadcasts, queueId, itemId;

  beforeEach(() => {
    setupTestDb();
    ({ qm, broadcasts } = makeManager());
    queueId = createQueue({ name: 'Farm', status: 'active', auto_start: true, require_confirmation: true });
    itemId = addQueueItem(queueId, { filename: 'part.gcode', copies: 1 });
    // Simulate the job having been dispatched to printer-A.
    qm._activeJobs.set('printer-A', { queueId, itemId });
  });

  it('a finished print holds the bed instead of auto-dispatching', () => {
    qm.onPrintComplete('printer-A', 'completed', null);

    assert.ok(qm._heldPrinters.has('printer-A'), 'printer should be held');
    const hold = getBedHold('printer-A');
    assert.ok(hold, 'a bed hold row should be persisted');
    assert.equal(hold.filename, 'part.gcode');
    assert.ok(broadcasts.some(b => b.payload.action === 'bed_hold'), 'should broadcast bed_hold');
    // No cooldown timer scheduled — dispatch is gated on confirmation.
    assert.equal(qm._cooldownTimers.has('printer-A'), false);
  });

  it('a held bed is not an available dispatch target', () => {
    qm.onPrintComplete('printer-A', 'completed', null);
    const target = qm._findAvailablePrinter({ id: queueId }, { });
    assert.equal(target, null, 'held printer must not be selected');
  });

  it('confirmBedCleared releases the hold and re-enables dispatch', () => {
    qm.onPrintComplete('printer-A', 'completed', null);
    const released = qm.confirmBedCleared('printer-A');

    assert.equal(released, true);
    assert.equal(qm._heldPrinters.has('printer-A'), false);
    assert.equal(getBedHold('printer-A'), undefined);
    assert.ok(broadcasts.some(b => b.payload.action === 'bed_cleared'), 'should broadcast bed_cleared');
  });

  it('confirmBedCleared on an unheld printer is a no-op', () => {
    assert.equal(qm.confirmBedCleared('printer-A'), false);
  });

  it('without require_confirmation, a finished print does not hold', () => {
    const q2 = createQueue({ name: 'Casual', status: 'active', auto_start: false, require_confirmation: false });
    const i2 = addQueueItem(q2, { filename: 'x.gcode', copies: 1 });
    qm._activeJobs.set('printer-A', { queueId: q2, itemId: i2 });
    qm.onPrintComplete('printer-A', 'completed', null);
    assert.equal(qm._heldPrinters.has('printer-A'), false);
    assert.equal(getBedHold('printer-A'), undefined);
  });
});
