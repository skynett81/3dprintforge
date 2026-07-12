// print-filaments-used.test.js — resolve the actual filament colours used in a
// print from the spool-usage log, so history can show it in the real colours
// even when print_history.filament_color is blank.

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { getDb } from '../../server/db/connection.js';
import { addFilamentProfile } from '../../server/db/filament-profiles.js';
import { getPrintFilamentsUsed } from '../../server/db/spools.js';

function seedPrintWithSpools() {
  const db = getDb();
  const grayId = addFilamentProfile({ name: 'PETG Gray', material: 'PETG', color_name: 'Gray', color_hex: '898989' }).id;
  const redId = addFilamentProfile({ name: 'PLA Red', material: 'PLA', color_name: 'Red', color_hex: 'ff0000' }).id;
  const mkSpool = (profileId, override) => Number(db.prepare(
    'INSERT INTO spools (filament_profile_id, color_hex_override, remaining_weight_g, initial_weight_g, archived) VALUES (?, ?, 800, 1000, 0)',
  ).run(profileId, override || null).lastInsertRowid);
  const graySpool = mkSpool(grayId, null);
  const redSpool = mkSpool(redId, null);
  const printId = Number(db.prepare(
    "INSERT INTO print_history (printer_id, filename, status, started_at) VALUES ('p1', 'thing.gcode', 'completed', '2026-07-05T15:00:00Z')",
  ).run().lastInsertRowid);
  const log = (spoolId, g) => db.prepare(
    "INSERT INTO spool_usage_log (spool_id, print_history_id, printer_id, used_weight_g, source) VALUES (?, ?, 'p1', ?, 'test')",
  ).run(spoolId, printId, g);
  return { printId, graySpool, redSpool, log };
}

describe('getPrintFilamentsUsed', () => {
  it('resolves the colour + material of the spool used', () => {
    setupTestDb();
    const { printId, graySpool, log } = seedPrintWithSpools();
    log(graySpool, 16.6);
    const used = getPrintFilamentsUsed(printId);
    assert.equal(used.length, 1);
    assert.equal(used[0].color_hex, '898989');
    assert.equal(used[0].material, 'PETG');
    assert.equal(used[0].name, 'PETG Gray');
    assert.equal(used[0].used_g, 16.6);
  });

  it('returns every distinct spool for a multi-colour print, most-used first', () => {
    setupTestDb();
    const { printId, graySpool, redSpool, log } = seedPrintWithSpools();
    log(graySpool, 5);
    log(redSpool, 20);
    const used = getPrintFilamentsUsed(printId);
    assert.equal(used.length, 2);
    assert.equal(used[0].color_hex, 'ff0000'); // red used more -> first
    assert.equal(used[1].color_hex, '898989');
  });

  it('sums multiple log rows for the same spool', () => {
    setupTestDb();
    const { printId, graySpool, log } = seedPrintWithSpools();
    log(graySpool, 5);
    log(graySpool, 7);
    const used = getPrintFilamentsUsed(printId);
    assert.equal(used.length, 1);
    assert.equal(used[0].used_g, 12);
  });

  it('honours a per-spool colour override', () => {
    setupTestDb();
    const db = getDb();
    const pid = addFilamentProfile({ name: 'PLA', material: 'PLA', color_hex: '000000' }).id;
    const spoolId = Number(db.prepare(
      "INSERT INTO spools (filament_profile_id, color_hex_override, remaining_weight_g, initial_weight_g, archived) VALUES (?, '#00ff00', 800, 1000, 0)",
    ).run(pid).lastInsertRowid);
    const printId = Number(db.prepare("INSERT INTO print_history (printer_id, filename, status, started_at) VALUES ('p1','x','completed','2026-07-05T15:00:00Z')").run().lastInsertRowid);
    db.prepare("INSERT INTO spool_usage_log (spool_id, print_history_id, printer_id, used_weight_g, source) VALUES (?, ?, 'p1', 3, 'test')").run(spoolId, printId);
    assert.equal(getPrintFilamentsUsed(printId)[0].color_hex, '00ff00'); // override wins, no '#'
  });

  it('returns an empty array for a print with no logged spools', () => {
    setupTestDb();
    const printId = Number(getDb().prepare("INSERT INTO print_history (printer_id, filename, status, started_at) VALUES ('p1','x','completed','2026-07-05T15:00:00Z')").run().lastInsertRowid);
    assert.deepEqual(getPrintFilamentsUsed(printId), []);
  });
});
