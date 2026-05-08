// Regression test for the non-Bambu spool auto-create path.
//
// Bug: when the user inserts an Elegoo / Polymaker / generic spool (no
// Bambu RFID), the firmware reports tray.tray_uuid = '00000…' and
// tray.remain = -1. The auto-match logic skipped these slots entirely,
// and even when auto-create ran it created a 0g (already-empty) spool.
// Result: a freshly-loaded 1kg reel produced no DB entry, and the
// in-progress print's usage couldn't be attributed.
//
// This locks in:
//   - autoCreateSpoolFromTray treats remain=-1 as 100%, not 0%
//   - It still works without a Bambu tray_id_name / tray_uuid

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { autoCreateSpoolFromTray, getSpool } from '../../server/db/spools.js';

const PRINTER = 'p1';

function bambuTray(overrides = {}) {
  return {
    tray_type: 'PLA',
    tray_color: '0086D6FF',
    tray_sub_brands: 'PLA Basic',
    tray_id_name: 'A00-B8',
    tray_uuid: '987DD0A1640B42B88B80305EC6AC5D67',
    tag_uid: '9623F9E000000100',
    tray_weight: '1000',
    remain: 75,
    ...overrides,
  };
}

function elegooTray(overrides = {}) {
  // Bambu firmware reports a non-Bambu spool with a recognised type+color
  // but no RFID payload. tray_id_name and tray_uuid arrive empty/zero.
  return {
    tray_type: 'PETG',
    tray_color: 'FFFFFFFF',
    tray_sub_brands: null,
    tray_id_name: '',
    tray_uuid: '00000000000000000000000000000000',
    tag_uid: '0000000000000000',
    tray_weight: null,
    remain: -1,
    ...overrides,
  };
}

describe('autoCreateSpoolFromTray', () => {
  beforeEach(() => setupTestDb());

  describe('Bambu RFID-tagged spool', () => {
    it('creates a 1000g spool with the AMS-reported remaining %', () => {
      const result = autoCreateSpoolFromTray(bambuTray({ remain: 75 }), PRINTER, 0, 0);
      assert.ok(result.id);
      const row = getSpool(result.id);
      assert.equal(row.initial_weight_g, 1000);
      assert.equal(row.remaining_weight_g, 750);
      assert.equal(row.used_weight_g, 250);
      assert.equal(row.tray_id_name, 'A00-B8');
    });
  });

  describe('non-Bambu spool (Elegoo / Polymaker / generic)', () => {
    it('treats remain=-1 as 100% (freshly-loaded reel, not empty)', () => {
      const result = autoCreateSpoolFromTray(elegooTray(), PRINTER, 0, 1);
      assert.ok(result.id, 'spool must be created');
      const row = getSpool(result.id);
      assert.equal(row.initial_weight_g, 1000);
      assert.equal(row.remaining_weight_g, 1000, 'fresh reel — full');
      assert.equal(row.used_weight_g, 0);
    });

    it('creates with material from tray_type even without tray_id_name', () => {
      const result = autoCreateSpoolFromTray(elegooTray(), PRINTER, 0, 1);
      const row = getSpool(result.id);
      assert.equal(row.material || row.profile_material, 'PETG');
    });

    it('derives a color_name from the tray hex (FFFFFF → White)', () => {
      const result = autoCreateSpoolFromTray(elegooTray(), PRINTER, 0, 1);
      const row = getSpool(result.id);
      // Profile color_name should be set so the inventory list shows a
      // human label instead of just '#FFFFFF'.
      assert.equal(row.color_name, 'White');
    });

    it('produces a profile_name with material + colour name', () => {
      const result = autoCreateSpoolFromTray(elegooTray(), PRINTER, 0, 1);
      const row = getSpool(result.id);
      // Without a Bambu tray_id_name we want at least "PETG White",
      // not bare "PETG".
      assert.match(row.profile_name, /PETG/);
      assert.match(row.profile_name, /White/);
    });

    it('handles missing tray_weight by defaulting to 1000g', () => {
      const result = autoCreateSpoolFromTray(elegooTray({ tray_weight: null }), PRINTER, 0, 1);
      const row = getSpool(result.id);
      assert.equal(row.initial_weight_g, 1000);
    });

    it('keeps remain=-1 → 100% even when tray_weight is set', () => {
      // User reports the spool was 1000 g when print started; the firmware
      // still says remain=-1 because it can't measure non-RFID spools.
      const result = autoCreateSpoolFromTray(
        elegooTray({ tray_weight: '1000', remain: -1 }),
        PRINTER, 0, 1,
      );
      const row = getSpool(result.id);
      assert.equal(row.remaining_weight_g, 1000);
    });
  });

  describe('genuinely empty slot', () => {
    it('still auto-creates if called — caller is responsible for skipping empty slots', () => {
      // The auto-match path skips empty slots before reaching this fn
      // (via tray_type / tray_color guards). The fn itself just builds
      // a row from whatever it's given. Lock in that contract.
      const result = autoCreateSpoolFromTray(elegooTray({ remain: 50 }), PRINTER, 0, 1);
      const row = getSpool(result.id);
      assert.equal(row.remaining_weight_g, 500); // 50% × 1000g
    });
  });
});
