// cloud-reconcile-slot.test.js — regression for the Bambu cloud reconcile
// crediting filament to the wrong AMS slot. Two spools of the SAME material in
// A1 and A2 must each be credited from their own slotId, not both lumped onto
// A1 (the first material match).

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { addSpool, assignSpoolToSlot } from '../../server/db/spools.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { _matchSpool } from '../../server/bambu-cloud-reconcile.js';

describe('cloud reconcile honours the exact AMS slot', () => {
  before(() => setupTestDb());

  it('credits A2 to the A2 spool, not the first same-material spool in A1', () => {
    setupTestDb();
    const pla = addFilamentProfile({ name: 'PLA Basic', material: 'PLA', color_hex: '000000' }).id;
    const a1 = addSpool({ filament_profile_id: pla, initial_weight_g: 1000 }).id;
    const a2 = addSpool({ filament_profile_id: pla, initial_weight_g: 1000 }).id;
    assignSpoolToSlot(a1, '3dsky', 0, 0); // AMS A, tray 1
    assignSpoolToSlot(a2, '3dsky', 0, 1); // AMS A, tray 2

    // Cloud mapping for a job printed on A2: amsId=0 (unit), slotId=1 (tray)
    const matchedA2 = _matchSpool('3dsky', 0, 1, 'PLA', '000000');
    assert.equal(matchedA2.id, a2, 'A2 print credits the A2 spool');

    const matchedA1 = _matchSpool('3dsky', 0, 0, 'PLA', '000000');
    assert.equal(matchedA1.id, a1, 'A1 print credits the A1 spool');
  });

  it('falls back to material/colour match when the slot has no linked spool', () => {
    setupTestDb();
    const petg = addFilamentProfile({ name: 'PETG', material: 'PETG', color_hex: 'ff0000' }).id;
    const sp = addSpool({ filament_profile_id: petg, initial_weight_g: 1000 }).id;
    assignSpoolToSlot(sp, '3dsky', 0, 2); // only A3 linked
    // A1 (slotId 0) is empty → fall back to material match → finds the PETG spool
    const matched = _matchSpool('3dsky', 0, 0, 'PETG', 'ff0000');
    assert.equal(matched.id, sp);
  });
});
