// recompute-spools.test.js — recomputing a loaded spool's remaining weight from
// the Bambu cloud's per-slot consumption since the spool was created. This is
// the automatic, identity-aware self-heal for baselines corrupted by past
// slot mis-attribution.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addPrinter } from '../../server/db/printers.js';
import { addSpool, assignSpoolToSlot, getSpool } from '../../server/db/spools.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { recomputeLoadedSpoolWeights } from '../../server/bambu-cloud-reconcile.js';

const SERIAL = 'SER123';
function mockCloud(tasks) {
  return { isAuthenticated: () => true, getTaskHistory: async () => tasks };
}
function task(slotId, weight, whenIso) {
  return { status: 1, endTime: whenIso, deviceId: SERIAL, weight: String(weight),
    amsDetailMapping: [{ amsId: 0, slotId, weight: String(weight), filamentType: 'PETG', sourceColor: '898989FF' }] };
}

describe('recompute loaded spool from cloud per-slot history', () => {
  before(() => setupTestDb());

  it('sets remaining = initial − cloud usage for the spool’s own slot', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const prof = addFilamentProfile({ name: 'PETG', material: 'PETG' }).id;
    const a1 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 0 }).id; // corrupted to 0
    assignSpoolToSlot(a1, 'p1', 0, 0);
    // two cloud prints on slot A1 (0:0) after the spool exists: 200 + 95.6 = 295.6
    const future = new Date(Date.now() + 60000).toISOString();
    const res = await recomputeLoadedSpoolWeights(mockCloud([task(0, 200, future), task(0, 95.6, future)]), {});
    assert.equal(res.updated.length, 1);
    assert.equal(res.updated[0].spoolId, a1);
    assert.equal(getSpool(a1).remaining_weight_g, 704.4);
  });

  it('excludes prints from before the spool was created and other slots', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const prof = addFilamentProfile({ name: 'PETG', material: 'PETG' }).id;
    const a1 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 0 }).id;
    assignSpoolToSlot(a1, 'p1', 0, 0);
    const past = new Date(Date.now() - 86400000).toISOString();   // before creation
    const future = new Date(Date.now() + 60000).toISOString();
    const res = await recomputeLoadedSpoolWeights(mockCloud([
      task(0, 500, past),    // before this spool existed → ignored
      task(1, 300, future),  // different slot (A2) → ignored
      task(0, 100, future),  // counts
    ]), {});
    assert.equal(getSpool(a1).remaining_weight_g, 900);
  });

  it('skips spools with no cloud evidence (never resets to full blindly)', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const prof = addFilamentProfile({ name: 'PLA', material: 'PLA' }).id;
    const a3 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 250 }).id;
    assignSpoolToSlot(a3, 'p1', 0, 2);
    const res = await recomputeLoadedSpoolWeights(mockCloud([]), {});
    assert.equal(res.updated.length, 0);
    assert.equal(res.skipped.length, 1);
    assert.equal(getSpool(a3).remaining_weight_g, 250); // untouched
  });

  it('autoHeal only repairs gross upward corruption (≥100 g), never small drift', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const prof = addFilamentProfile({ name: 'PETG', material: 'PETG' }).id;
    const future = new Date(Date.now() + 60000).toISOString();
    // case A: spool at 0 but cloud says 704 left → gross under-report → healed
    const a1 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 0 }).id;
    assignSpoolToSlot(a1, 'p1', 0, 0);
    // case B: spool slightly LOW vs cloud (in-flight live deduction) → must NOT revert
    const b1 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 660 }).id;
    assignSpoolToSlot(b1, 'p1', 1, 1);
    await recomputeLoadedSpoolWeights(mockCloud([task(0, 295.6, future), task(1, 300, future)]), { autoHeal: true });
    assert.equal(getSpool(a1).remaining_weight_g, 704.4);      // gross gap (+704) healed
    assert.equal(getSpool(b1).remaining_weight_g, 660);        // small gap (+40) left for live tracking
  });
});
