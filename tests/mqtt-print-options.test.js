// mqtt-print-options.test.js — project_file print command with AMS colour
// mapping and per-print options (OpenBambuAPI project_file spec).

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildPrintCommand } from '../server/mqtt-commands.js';

describe('buildPrintCommand', () => {
  test('legacy call (plate number) keeps the old defaults and no mapping', () => {
    const c = buildPrintCommand('models/benchy.3mf', 3).print;
    assert.equal(c.command, 'project_file');
    assert.equal(c.param, 'Metadata/plate_3.gcode');
    assert.equal(c.subtask_name, 'benchy');
    assert.equal(c.use_ams, true);
    assert.equal(c.bed_leveling, true);
    assert.equal(c.timelapse, false);
    assert.equal('ams_mapping' in c, false);
    assert.match(c.url, /^ftp:\/\//);
  });

  test('options object adds AMS mapping and toggles print options', () => {
    const c = buildPrintCommand('a.3mf', {
      plateId: 2, amsMapping: [0, 2, -1, 254], timelapse: true, bedLeveling: false,
      flowCali: true, vibrationCali: true, layerInspect: true, useAms: true,
    }).print;
    assert.equal(c.param, 'Metadata/plate_2.gcode');
    assert.deepEqual(c.ams_mapping, [0, 2, -1, 254]);
    assert.equal(c.timelapse, true);
    assert.equal(c.bed_leveling, false);
    assert.equal(c.flow_cali, true);
    assert.equal(c.vibration_cali, true);
    assert.equal(c.layer_inspect, true);
  });

  test('snake_case option keys are accepted too', () => {
    const c = buildPrintCommand('a.3mf', { plate_id: 1, ams_mapping: ['1', 'x'], use_ams: false, bed_leveling: false }).print;
    assert.deepEqual(c.ams_mapping, [1, -1]); // coerced; non-numeric -> -1
    assert.equal(c.use_ams, false);
    assert.equal(c.bed_leveling, false);
  });

  test('an empty mapping is omitted (auto AMS)', () => {
    const c = buildPrintCommand('a.3mf', { amsMapping: [] }).print;
    assert.equal('ams_mapping' in c, false);
  });
});
