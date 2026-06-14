import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectAccessories, _internals } from '../../server/accessory-detector.js';

describe('accessory-detector — Klipper/Moonraker', () => {
  const objects = [
    'gcode_macro FOO', 'resonance_tester', 'probe', 'bed_mesh', 'purifier',
    'temperature_sensor cavity', 'fan_generic cavity_fan', 'led cavity_led',
    'filament_motion_sensor e0_filament', 'filament_motion_sensor e1_filament',
    'filament_entangle_detect e0_filament', 'defect_detection', 'heater_fan e0_nozzle_fan',
  ];
  const acc = detectAccessories({ type: 'moonraker', state: { _klipper_objects: objects } });
  const byId = Object.fromEntries(acc.map(a => [a.id, a]));

  it('ignores gcode_macro objects', () => {
    assert.ok(!acc.some(a => a.detail.includes('FOO')));
  });
  it('detects single accessories', () => {
    assert.ok(byId.input_shaper && byId.probe && byId.bed_mesh && byId.air_purifier && byId.ai_camera);
  });
  it('groups duplicates with a count and details', () => {
    assert.equal(byId.filament_sensor.count, 2);
    assert.deepEqual(byId.filament_sensor.detail, ['e0_filament', 'e1_filament']);
  });
  it('carries the object suffix as detail', () => {
    assert.deepEqual(byId.temp_sensor.detail, ['cavity']);
  });
});

describe('accessory-detector — Bambu', () => {
  it('labels AMS 2 Pro from humidity_raw when the module map is empty', () => {
    const state = { ams: { ams: [{ humidity_raw: 27, tray: [] }] }, nozzle_diameter: 0.4, nozzle_type: 'HS01' };
    const acc = detectAccessories({ type: 'bambu', state, model: { amsDefault: 'ams_lite', nozzleCount: 1 } });
    const ams = acc.find(a => a.id === 'ams');
    assert.equal(ams.name, 'AMS 2 Pro');
  });
  it('detects external spool, camera, chamber and nozzle', () => {
    const state = { vt_tray: { tray_type: 'PLA' }, ipcam: { ipcam_dev: '1' }, chamber_temper: 35, nozzle_diameter: 0.4 };
    const acc = detectAccessories({ type: 'bambu', state, model: {} });
    const ids = acc.map(a => a.id);
    assert.ok(ids.includes('ext_spool') && ids.includes('camera') && ids.includes('chamber') && ids.includes('nozzle'));
  });
});
