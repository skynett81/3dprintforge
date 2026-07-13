// slicer-settings.test.js — UI settings → OrcaSlicer process-profile JSON.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildOrcaProcessJson, hasOverrides } from '../server/slicer-settings.js';

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
