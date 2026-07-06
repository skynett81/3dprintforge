// part-auto-credit.test.js — a finished queue job tagged with a project Part
// auto-credits parts_per_plate toward that Part (bridges queue -> production).

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { createQueue, addQueueItem } from '../../server/db/queue.js';
import { addProject, addProjectPart, getProjectPart } from '../../server/db/projects.js';
import { QueueManager } from '../../server/queue-manager.js';

function makeManager() {
  const printers = new Map([
    ['printer-A', { live: true, client: {}, tracker: { previousState: { gcode_state: 'IDLE' } } }],
  ]);
  const qm = new QueueManager({ printers }, null, () => {}, null);
  return qm;
}

describe('Queue -> Part auto-crediting', () => {
  let qm, partId, queueId, itemId;

  beforeEach(() => {
    setupTestDb();
    qm = makeManager();
    const projectId = addProject({ name: 'Run' });
    partId = addProjectPart({ project_id: projectId, name: 'Bracket', target_qty: 100, parts_per_plate: 10 });
    queueId = createQueue({ name: 'Farm', status: 'active' });
    itemId = addQueueItem(queueId, { filename: 'bracket.gcode', copies: 1, part_id: partId });
    qm._activeJobs.set('printer-A', { queueId, itemId });
  });

  it('a completed job credits parts_per_plate toward the linked part', () => {
    qm.onPrintComplete('printer-A', 'completed', null);
    assert.equal(getProjectPart(partId).completed_qty, 10);
  });

  it('a failed job credits nothing', () => {
    qm.onPrintComplete('printer-A', 'failed', null);
    assert.equal(getProjectPart(partId).completed_qty, 0);
  });

  it('an item with no part link credits nothing (no crash)', () => {
    const i2 = addQueueItem(queueId, { filename: 'x.gcode', copies: 1 });
    qm._activeJobs.set('printer-A', { queueId, itemId: i2 });
    qm.onPrintComplete('printer-A', 'completed', null);
    assert.equal(getProjectPart(partId).completed_qty, 0);
  });
});
