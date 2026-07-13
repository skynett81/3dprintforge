// slicer-settings.test.js — UI settings → OrcaSlicer process-profile JSON.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildOrcaProcessJson, hasOverrides, buildNativeSettings } from '../server/slicer-settings.js';

describe('slicer-settings', () => {
  test('maps UI keys to Orca process keys as strings', () => {
    const j = buildOrcaProcessJson({
      layer_height: 0.28, initial_layer_height: 0.3, wall_loops: 3,
      infill_density: 15, infill_pattern: 'gyroid', supports: true,
      support_type: 'tree(auto)', brim_type: 'outer_only', brim_width: 5,
      outer_wall_speed: 120, travel_speed: 250,
    });
    assert.equal(j.type, 'process');
    assert.equal(j.layer_height, '0.28');
    assert.equal(j.initial_layer_print_height, '0.3');
    assert.equal(j.wall_loops, '3');
    assert.equal(j.sparse_infill_density, '15%');
    assert.equal(j.sparse_infill_pattern, 'gyroid');
    assert.equal(j.enable_support, '1');
    assert.equal(j.support_type, 'tree(auto)');
    assert.equal(j.brim_type, 'outer_only');
    assert.equal(j.outer_wall_speed, '120');
    assert.equal(j.travel_speed, '250');
  });

  test('omits blank fields and toggles supports off', () => {
    const j = buildOrcaProcessJson({ layer_height: 0.2, infill_density: '', supports: false, wall_loops: undefined });
    assert.equal(j.layer_height, '0.2');
    assert.equal('sparse_infill_density' in j, false);
    assert.equal('wall_loops' in j, false);
    assert.equal(j.enable_support, '0');
  });

  test('hasOverrides reflects whether anything was set', () => {
    assert.equal(hasOverrides({}), false);
    assert.equal(hasOverrides({ layer_height: 0.2 }), true);
    assert.equal(hasOverrides({ supports: true }), true);
  });
});

describe('buildNativeSettings', () => {
  test('maps UI keys to native engine options with correct types', () => {
    const n = buildNativeSettings({
      layer_height: 0.28, wall_loops: 3, top_layers: 5, bottom_layers: 4,
      infill_density: 15, infill_pattern: 'gyroid', brim_width: 5,
      skirt_loops: 2, outer_wall_speed: 120, travel_speed: 250,
    });
    assert.equal(n.layerHeight, 0.28);
    assert.equal(n.perimeters, 3);
    assert.equal(n.topLayers, 5);
    assert.equal(n.bottomLayers, 4);
    assert.equal(n.infillDensity, 0.15);        // % → fraction
    assert.equal(n.infillPattern, 'grid');      // gyroid approximated as grid
    assert.equal(n.brimWidth, 5);
    assert.equal(n.skirtLoops, 2);
    assert.equal(n.printSpeed, 120);
    assert.equal(n.travelSpeed, 250);
  });

  test('grid-family patterns map to grid, fraction infill passes through', () => {
    assert.equal(buildNativeSettings({ infill_pattern: 'cubic' }).infillPattern, 'grid');
    assert.equal(buildNativeSettings({ infill_pattern: 'honeycomb' }).infillPattern, 'grid');
    assert.equal(buildNativeSettings({ infill_density: 0.3 }).infillDensity, 0.3);
  });

  test('merges base defaults and lets UI override', () => {
    const n = buildNativeSettings({ nozzle_temp: 230 }, { bedTemp: 60, nozzleTemp: 210, material: 'PLA' });
    assert.equal(n.bedTemp, 60);
    assert.equal(n.nozzleTemp, 230);
    assert.equal(n.material, 'PLA');
  });

  test('ignores blank/invalid values', () => {
    const n = buildNativeSettings({ layer_height: '', wall_loops: 'abc', infill_density: undefined });
    assert.equal('layerHeight' in n, false);
    assert.equal('perimeters' in n, false);
    assert.equal('infillDensity' in n, false);
  });

  test('maps temperature and cooling keys', () => {
    const n = buildNativeSettings({
      nozzle_temp: 240, bed_temp: 80, nozzle_temp_initial: 245, bed_temp_initial: 85,
      fan_speed: 60, fan_off_layers: 3,
    });
    assert.equal(n.nozzleTemp, 240);
    assert.equal(n.bedTemp, 80);
    assert.equal(n.nozzleTempInitial, 245);
    assert.equal(n.bedTempInitial, 85);
    assert.equal(n.fanSpeed, 60);
    assert.equal(n.fanOffLayers, 3);
  });
});
