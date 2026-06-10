// protection-log.test.js — addProtectionLog dedup behaviour

import { describe, it, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { getDb } from '../../server/db/connection.js';
import { addProtectionLog, getActiveAlerts, resolveProtectionAlert } from '../../server/db/errors.js';

describe('Print Guard alert dedup', () => {
  before(() => { setupTestDb(); });
  afterEach(() => { try { getDb().exec('DELETE FROM protection_log'); } catch { /* ignore */ } });

  it('collapses repeated alerts of the same type into one active row', () => {
    for (let i = 0; i < 5; i++) {
      addProtectionLog({ printer_id: 'p1', event_type: 'temp_deviation', action_taken: 'notify', notes: `dev ${i}` });
    }
    const active = getActiveAlerts('p1');
    assert.strictEqual(active.length, 1, 'five identical alerts should collapse to one');
    assert.match(active[0].notes, /dev 4/, 'the latest notes should win');
  });

  it('keeps distinct event types as separate active alerts', () => {
    addProtectionLog({ printer_id: 'p1', event_type: 'temp_deviation', action_taken: 'notify' });
    addProtectionLog({ printer_id: 'p1', event_type: 'filament_runout', action_taken: 'notify' });
    assert.strictEqual(getActiveAlerts('p1').length, 2);
  });

  it('keeps the same type separate per printer', () => {
    addProtectionLog({ printer_id: 'p1', event_type: 'temp_deviation', action_taken: 'notify' });
    addProtectionLog({ printer_id: 'p2', event_type: 'temp_deviation', action_taken: 'notify' });
    assert.strictEqual(getActiveAlerts().length, 2);
  });

  it('inserts a fresh alert after the previous one is resolved', () => {
    addProtectionLog({ printer_id: 'p1', event_type: 'temp_deviation', action_taken: 'notify' });
    const first = getActiveAlerts('p1')[0];
    resolveProtectionAlert(first.id);
    addProtectionLog({ printer_id: 'p1', event_type: 'temp_deviation', action_taken: 'notify' });
    assert.strictEqual(getActiveAlerts('p1').length, 1, 'a new active alert after resolving');
    const rows = getDb().prepare('SELECT COUNT(*) c FROM protection_log').get();
    assert.strictEqual(rows.c, 2, 'one resolved + one active row total');
  });
});
