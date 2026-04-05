// snapmaker.test.js — DB tests for SM NFC filament, defect events, calibration

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';

let upsertNfcFilament, getNfcFilaments, addDefectEvent, getDefectEvents, acknowledgeDefectEvent, addCalibrationResult, getCalibrationResults;

before(async () => {
  setupTestDb();
  const mod = await import('../../server/db/snapmaker.js');
  upsertNfcFilament = mod.upsertNfcFilament;
  getNfcFilaments = mod.getNfcFilaments;
  addDefectEvent = mod.addDefectEvent;
  getDefectEvents = mod.getDefectEvents;
  acknowledgeDefectEvent = mod.acknowledgeDefectEvent;
  addCalibrationResult = mod.addCalibrationResult;
  getCalibrationResults = mod.getCalibrationResults;
});

describe('SM NFC Filament', () => {
  it('upserts and queries filament data', () => {
    upsertNfcFilament('u1', 0, {
      vendor: 'Snapmaker', manufacturer: 'Polymaker', type: 'PLA', subType: 'SnapSpeed',
      color: '#e2dedb', weight: 500, sku: 900000, official: true,
      nozzleTempMin: 190, nozzleTempMax: 230, bedTemp: 60,
      firstLayerTemp: 230, otherLayerTemp: 220, dryingTemp: 55, dryingTime: 6,
    });

    const filaments = getNfcFilaments('u1');
    assert.equal(filaments.length, 1);
    assert.equal(filaments[0].vendor, 'Snapmaker');
    assert.equal(filaments[0].filament_type, 'PLA');
    assert.equal(filaments[0].weight_g, 500);
    assert.equal(filaments[0].official, 1);
  });

  it('upserts replaces existing channel', () => {
    upsertNfcFilament('u1', 0, {
      vendor: 'Generic', manufacturer: '', type: 'PETG', subType: '', color: '#ff0000',
      weight: 1000, sku: 0, official: false,
      nozzleTempMin: 220, nozzleTempMax: 260, bedTemp: 80,
      firstLayerTemp: 250, otherLayerTemp: 245, dryingTemp: 65, dryingTime: 6,
    });

    const filaments = getNfcFilaments('u1');
    assert.equal(filaments.length, 1);
    assert.equal(filaments[0].vendor, 'Generic');
    assert.equal(filaments[0].filament_type, 'PETG');
    assert.equal(filaments[0].weight_g, 1000);
  });

  it('supports multiple channels', () => {
    upsertNfcFilament('u1', 1, { vendor: 'V2', manufacturer: '', type: 'ABS', subType: '', color: '#000', weight: 750, sku: 0, official: false, nozzleTempMin: 230, nozzleTempMax: 270, bedTemp: 100, firstLayerTemp: 260, otherLayerTemp: 255, dryingTemp: 65, dryingTime: 8 });
    upsertNfcFilament('u1', 2, { vendor: 'V3', manufacturer: '', type: 'TPU', subType: '', color: '#0f0', weight: 250, sku: 0, official: false, nozzleTempMin: 220, nozzleTempMax: 250, bedTemp: 50, firstLayerTemp: 240, otherLayerTemp: 240, dryingTemp: 55, dryingTime: 4 });

    const filaments = getNfcFilaments('u1');
    assert.equal(filaments.length, 3);
  });

  it('queries per printer', () => {
    upsertNfcFilament('other', 0, { vendor: 'Other', manufacturer: '', type: 'PLA', subType: '', color: '#fff', weight: 500, sku: 0, official: false, nozzleTempMin: 190, nozzleTempMax: 230, bedTemp: 60, firstLayerTemp: 220, otherLayerTemp: 210, dryingTemp: 55, dryingTime: 4 });
    assert.equal(getNfcFilaments('u1').length, 3);
    assert.equal(getNfcFilaments('other').length, 1);
  });
});

describe('SM Defect Events', () => {
  it('adds and queries defect events', () => {
    addDefectEvent('u1', 'spaghetti', 'warning', 'noodle prob 0.85', null);
    addDefectEvent('u1', 'dirty_bed', 'info', null, null);

    const events = getDefectEvents('u1', 10);
    assert.equal(events.length, 2);
    const types = events.map(e => e.event_type).sort();
    assert.deepEqual(types, ['dirty_bed', 'spaghetti']);
  });

  it('acknowledges events', () => {
    const events = getDefectEvents('u1', 1);
    assert.equal(events[0].acknowledged, 0);

    acknowledgeDefectEvent(events[0].id);
    const updated = getDefectEvents('u1', 1);
    assert.equal(updated[0].acknowledged, 1);
  });
});

describe('SM Calibration Results', () => {
  it('adds and queries calibration results', () => {
    addCalibrationResult('u1', 'flow', 0, 0.045, { algorithm: 'linear' });
    addCalibrationResult('u1', 'flow', 1, 0.038, null);
    addCalibrationResult('u1', 'shaper', 0, null, { freq: 48.5, type: 'mzv' });

    const all = getCalibrationResults('u1');
    assert.equal(all.length, 3);

    const flow = getCalibrationResults('u1', 'flow');
    assert.equal(flow.length, 2);
    // Both flow results present — order depends on insert timing
    const kValues = flow.map(r => r.k_value).sort();
    assert.deepEqual(kValues, [0.038, 0.045]);
  });
});
