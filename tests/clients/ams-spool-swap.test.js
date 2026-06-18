// ams-spool-swap.test.js — when a new spool is loaded into an AMS slot (on the
// printer, in Bambu Handy or Studio), the server must reflect it. A swap must be
// detected on COLOUR as well as material, so replacing white PETG with black
// PETG (same material) doesn't leave the old colour showing on the dashboard.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { PrintTracker } from '../../server/print-tracker.js';
import { addPrinter } from '../../server/db/printers.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { addSpool, assignSpoolToSlot, getSpoolBySlot, getSpool } from '../../server/db/spools.js';

function amsData(trayType, trayColor) {
  return { ams: { ams: [{ id: '0', tray: [{
    id: '0', tray_type: trayType, tray_color: trayColor, tag_uid: '0000000000000000',
    tray_id_name: '', tray_sub_brands: '', tray_weight: '1000', remain: -1,
  }] }] } };
}

describe('AMS slot reflects a newly loaded spool', () => {
  before(() => setupTestDb());

  it('detects a colour swap (white PETG → black PETG) and re-links the slot', () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: 'S1', type: 'bambu' });
    const whiteP = addFilamentProfile({ name: 'PETG White', material: 'PETG', color_hex: 'FFFFFF' }).id;
    const white = addSpool({ filament_profile_id: whiteP, initial_weight_g: 1000, remaining_weight_g: 600 }).id;
    assignSpoolToSlot(white, 'p1', 0, 0);

    const t = new PrintTracker('p1');
    // A black PETG spool is now loaded into the same slot.
    t._autoMatchAmsTrays(amsData('PETG', '000000FF'));

    // Old white spool is unlinked (still in inventory, just not in the slot).
    assert.equal(getSpool(white).printer_id, null);
    // The slot now holds a new spool whose colour is black.
    const now = getSpoolBySlot('p1', 0, 0);
    assert.ok(now, 'slot has a spool');
    assert.notEqual(now.id, white);
    assert.equal(String(now.color_hex).toUpperCase().slice(0, 6), '000000');
    assert.equal(String(now.material).toUpperCase(), 'PETG');
  });

  it('reloading the SAME filament keeps the existing spool (no churn)', () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: 'S1', type: 'bambu' });
    const grayP = addFilamentProfile({ name: 'PETG Gray', material: 'PETG', color_hex: '898989' }).id;
    const gray = addSpool({ filament_profile_id: grayP, initial_weight_g: 1000, remaining_weight_g: 700 }).id;
    assignSpoolToSlot(gray, 'p1', 0, 0);

    const t = new PrintTracker('p1');
    t._autoMatchAmsTrays(amsData('PETG', '898989FF'));

    const now = getSpoolBySlot('p1', 0, 0);
    assert.equal(now.id, gray); // unchanged
    assert.equal(getSpool(gray).remaining_weight_g, 700);
  });

  it('re-links a returning spool by colour+material instead of creating a duplicate', () => {
    setupTestDb();
    addPrinter({ id: 'p1', name: 'P1', serial: 'S1', type: 'bambu' });
    const whiteP = addFilamentProfile({ name: 'PETG White', material: 'PETG', color_hex: 'FFFFFF' }).id;
    const redP = addFilamentProfile({ name: 'PETG Red', material: 'PETG', color_hex: 'FF0000' }).id;
    const white = addSpool({ filament_profile_id: whiteP, initial_weight_g: 1000, remaining_weight_g: 600 }).id;
    assignSpoolToSlot(white, 'p1', 0, 0);
    // A red spool already exists in inventory (used before, now unloaded).
    const red = addSpool({ filament_profile_id: redP, initial_weight_g: 1000, remaining_weight_g: 450 }).id;

    const t = new PrintTracker('p1');
    t._autoMatchAmsTrays(amsData('PETG', 'FF0000FF'));

    const now = getSpoolBySlot('p1', 0, 0);
    assert.equal(now.id, red, 'the returning red spool is re-linked, not duplicated');
    assert.equal(getSpool(red).remaining_weight_g, 450); // its tracked weight is preserved
    assert.equal(getSpool(white).printer_id, null);
  });
});
