// history.test.js — Tester for utskriftshistorikk

import { describe, it, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { getDb } from '../../server/db/connection.js';
import {
  addHistory,
  getHistory,
  getHistoryById,
  updateHistoryNotes,
} from '../../server/db/history.js';

// Hjelpefunksjon: lager en minimal utskriftspost
function makeRecord(overrides = {}) {
  return {
    printer_id: 'test-printer',
    started_at: '2024-01-15T10:00:00Z',
    finished_at: '2024-01-15T12:00:00Z',
    filename: 'test_model.gcode',
    status: 'completed',
    duration_seconds: 7200,
    filament_used_g: 45.5,
    filament_type: 'PLA',
    filament_color: '#FF0000',
    layer_count: 300,
    notes: null,
    ...overrides,
  };
}

describe('Print History', () => {
  before(() => {
    // Sett opp db én gang for alle tester i denne describe-blokken
    setupTestDb();
  });

  afterEach(() => {
    // Rens tabellen mellom tester for å sikre isolasjon
    try { getDb().exec('DELETE FROM print_history'); } catch { /* ignorer */ }
  });

  it('getHistory() returnerer tom liste initialt', () => {
    const rows = getHistory();
    assert.ok(Array.isArray(rows), 'skal returnere array');
    assert.strictEqual(rows.length, 0, 'ingen historikk initialt');
  });

  it('addHistory() legger til en post og returnerer id', () => {
    const id = addHistory(makeRecord());
    assert.ok(typeof id === 'number', 'id skal være nummer');
    assert.ok(id > 0, 'id skal være positiv');
  });

  it('getHistory() returnerer posten som ble lagt til', () => {
    addHistory(makeRecord());
    const rows = getHistory();
    assert.strictEqual(rows.length, 1, 'skal ha 1 post');
    const r = rows[0];
    assert.strictEqual(r.filename, 'test_model.gcode');
    assert.strictEqual(r.status, 'completed');
    assert.strictEqual(r.filament_type, 'PLA');
  });

  it('addHistory() støtter alle valgfrie felter', () => {
    const id = addHistory(makeRecord({
      filename: 'full_record.gcode',
      status: 'failed',
      filament_brand: 'Bambu',
      nozzle_type: 'hardened_steel',
      nozzle_diameter: 0.4,
      speed_level: 2,
      bed_target: 60,
      nozzle_target: 220,
      max_nozzle_temp: 225.5,
      max_bed_temp: 62.0,
      max_chamber_temp: 35.0,
      color_changes: 3,
      waste_g: 2.5,
    }));
    const record = getHistoryById(id);
    assert.strictEqual(record.filament_brand, 'Bambu');
    assert.strictEqual(record.nozzle_type, 'hardened_steel');
    assert.strictEqual(record.color_changes, 3);
  });

  it('getHistoryById() returnerer korrekt post', () => {
    const id = addHistory(makeRecord({ filename: 'unique_test.gcode' }));
    const record = getHistoryById(id);
    assert.ok(record, 'post skal finnes');
    assert.strictEqual(record.id, id);
    assert.strictEqual(record.filename, 'unique_test.gcode');
  });

  it('getHistoryById() returnerer null for ikke-eksisterende id', () => {
    const record = getHistoryById(99999);
    assert.strictEqual(record, null);
  });

  it('updateHistoryNotes() oppdaterer notater', () => {
    const id = addHistory(makeRecord({ notes: null }));
    const updated = updateHistoryNotes(id, 'Disse notatene er oppdatert');
    assert.ok(updated, 'skal returnere oppdatert post');
    assert.strictEqual(updated.notes, 'Disse notatene er oppdatert');
  });

  it('updateHistoryNotes() returnerer post med oppdaterte notater ved nytt oppslag', () => {
    const id = addHistory(makeRecord());
    updateHistoryNotes(id, 'Test notater');
    const record = getHistoryById(id);
    assert.strictEqual(record.notes, 'Test notater');
  });

  it('getHistory() støtter filtrering på printerId', () => {
    addHistory(makeRecord({ printer_id: 'printer-A', filename: 'printer-a.gcode' }));
    addHistory(makeRecord({ printer_id: 'printer-B', filename: 'printer-b.gcode' }));
    addHistory(makeRecord({ printer_id: 'printer-A', filename: 'printer-a2.gcode' }));

    const rowsA = getHistory(50, 0, 'printer-A');
    assert.strictEqual(rowsA.length, 2, 'skal ha 2 poster for printer-A');

    const rowsB = getHistory(50, 0, 'printer-B');
    assert.strictEqual(rowsB.length, 1, 'skal ha 1 post for printer-B');
  });

  it('getHistory() støtter filtrering på status', () => {
    addHistory(makeRecord({ status: 'completed' }));
    addHistory(makeRecord({ status: 'failed' }));
    addHistory(makeRecord({ status: 'completed' }));

    const completed = getHistory(50, 0, null, 'completed');
    assert.strictEqual(completed.length, 2, 'skal ha 2 completed-poster');

    const failed = getHistory(50, 0, null, 'failed');
    assert.strictEqual(failed.length, 1, 'skal ha 1 failed-post');
  });

  it('getHistory() respekterer limit og offset', () => {
    for (let i = 0; i < 5; i++) {
      addHistory(makeRecord({ filename: `print_${i}.gcode` }));
    }

    const limited = getHistory(3, 0);
    assert.strictEqual(limited.length, 3, 'limit skal fungere');

    const offset = getHistory(10, 2);
    assert.strictEqual(offset.length, 3, 'offset skal gi 3 rader (5-2)');
  });
});
