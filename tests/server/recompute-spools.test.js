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
// The P2S cloud reports slotId 0 for every job, so attribution is by COLOUR.
function task(color, weight, whenIso, material = 'PETG') {
  return { status: 1, endTime: whenIso, deviceId: SERIAL, weight: String(weight),
    amsDetailMapping: [{ amsId: 0, slotId: 0, weight: String(weight), filamentType: material, sourceColor: color }] };
}

describe('recompute loaded spool from cloud per-slot history', () => {
  before(() => setupTestDb());

  it('sets remaining = initial − cloud usage matched by COLOUR + material', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const prof = addFilamentProfile({ name: 'PETG Gray', material: 'PETG', color_hex: '898989' }).id;
    const a1 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 0 }).id; // corrupted to 0
    assignSpoolToSlot(a1, 'p1', 0, 0);
    const future = new Date(Date.now() + 60000).toISOString();
    // two grey PETG prints: 200 + 95.6 = 295.6
    const res = await recomputeLoadedSpoolWeights(mockCloud([task('898989FF', 200, future), task('898989FF', 95.6, future)]), {});
    assert.equal(res.updated.length, 1);
    assert.equal(getSpool(a1).remaining_weight_g, 704.4);
  });

  it('credits the white spool for white prints, not the grey spool (slotId is always 0)', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const grayP = addFilamentProfile({ name: 'PETG Gray', material: 'PETG', color_hex: '898989' }).id;
    const whiteP = addFilamentProfile({ name: 'PETG White', material: 'PETG', color_hex: 'FFFFFF' }).id;
    const a1 = addSpool({ filament_profile_id: grayP, initial_weight_g: 1000, remaining_weight_g: 1000 }).id;
    const a2 = addSpool({ filament_profile_id: whiteP, initial_weight_g: 1000, remaining_weight_g: 1000 }).id;
    assignSpoolToSlot(a1, 'p1', 0, 0);
    assignSpoolToSlot(a2, 'p1', 0, 1); // A2
    const future = new Date(Date.now() + 60000).toISOString();
    // every print reports slotId 0; colour distinguishes them
    await recomputeLoadedSpoolWeights(mockCloud([
      task('898989FF', 100, future),  // grey → A1
      task('FFFFFFFF', 400, future),  // white → A2 (the user's case)
    ]), {});
    assert.equal(getSpool(a1).remaining_weight_g, 900); // grey: 1000-100
    assert.equal(getSpool(a2).remaining_weight_g, 600); // white: 1000-400
  });

  it('excludes prints from before the spool was created', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const prof = addFilamentProfile({ name: 'PETG Gray', material: 'PETG', color_hex: '898989' }).id;
    const a1 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 0 }).id;
    assignSpoolToSlot(a1, 'p1', 0, 0);
    const past = new Date(Date.now() - 86400000).toISOString();
    const future = new Date(Date.now() + 60000).toISOString();
    await recomputeLoadedSpoolWeights(mockCloud([
      task('898989FF', 500, past),    // before this spool existed → ignored
      task('FFFFFFFF', 300, future),  // different colour → ignored
      task('898989FF', 100, future),  // counts
    ]), {});
    assert.equal(getSpool(a1).remaining_weight_g, 900);
  });

  it('skips spools with no cloud evidence (never resets to full blindly)', async () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: SERIAL, type: 'bambu' });
    const prof = addFilamentProfile({ name: 'PLA Pink', material: 'PLA', color_hex: 'F5547C' }).id;
    const a3 = addSpool({ filament_profile_id: prof, initial_weight_g: 1000, remaining_weight_g: 250 }).id;
    assignSpoolToSlot(a3, 'p1', 0, 2);
    const res = await recomputeLoadedSpoolWeights(mockCloud([]), {});
    assert.equal(res.updated.length, 0);
    assert.equal(res.skipped.length, 1);
    assert.equal(getSpool(a3).remaining_weight_g, 250); // untouched
  });
});
