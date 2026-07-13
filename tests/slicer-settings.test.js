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
    assert.equal(n.infillPattern, 'gyroid');    // gyroid is a real native pattern now
    assert.equal(n.brimWidth, 5);
    assert.equal(n.skirtLoops, 2);
    assert.equal(n.printSpeed, 120);
    assert.equal(n.travelSpeed, 250);
  });

  test('real infill patterns pass through, fraction infill passes through', () => {
    assert.equal(buildNativeSettings({ infill_pattern: 'cubic' }).infillPattern, 'cubic');
    assert.equal(buildNativeSettings({ infill_pattern: 'honeycomb' }).infillPattern, 'honeycomb');
    assert.equal(buildNativeSettings({ infill_pattern: 'gyroid' }).infillPattern, 'gyroid');
    assert.equal(buildNativeSettings({ infill_pattern: 'tri-hexagon' }).infillPattern, 'triangles');
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

  test('maps per-feature acceleration', () => {
    const n = buildNativeSettings({ outer_wall_acceleration: 3000, inner_wall_acceleration: 6000, top_surface_acceleration: 2000, sparse_infill_acceleration: 8000 });
    assert.equal(n.outerWallAccel, 3000);
    assert.equal(n.innerWallAccel, 6000);
    assert.equal(n.topSurfaceAccel, 2000);
    assert.equal(n.sparseInfillAccel, 8000);
  });

  test('maps acceleration, jerk, cooling slow-down, retraction/wipe and gcode hooks', () => {
    const n = buildNativeSettings({
      default_acceleration: 4000, initial_layer_acceleration: 600, travel_acceleration: 8000, default_jerk: 12,
      slow_down_layer_time: 8, slow_down_min_speed: 12,
      retraction_speed: 40, deretraction_speed: 30, wipe: true, wipe_distance: 2.5,
      start_gcode: '; hi', end_gcode: '; bye', layer_change_gcode: '; L[layer_num]',
    });
    assert.equal(n.acceleration, 4000);
    assert.equal(n.initialLayerAccel, 600);
    assert.equal(n.travelAccel, 8000);
    assert.equal(n.jerk, 12);
    assert.equal(n.minLayerTime, 8);
    assert.equal(n.minPrintSpeed, 12);
    assert.equal(n.retractionSpeed, 40);
    assert.equal(n.deretractionSpeed, 30);
    assert.equal(n.wipe, true);
    assert.equal(n.wipeDistance, 2.5);
    assert.equal(n.startGcode, '; hi');
    assert.equal(n.endGcode, '; bye');
    assert.equal(n.layerChangeGcode, '; L[layer_num]');
  });

  test('maps bridge and overhang keys', () => {
    const n = buildNativeSettings({ bridge_speed: 20, bridge_flow: 0.7, overhang_speed: 25, overhang_fan_speed: 100, detect_overhang_wall: true });
    assert.equal(n.bridgeSpeed, 20);
    assert.equal(n.bridgeFlow, 0.7);
    assert.equal(n.overhangSpeed, 25);
    assert.equal(n.overhangFanSpeed, 100);
    assert.equal(n.overhangDetect, true);
  });

  test('maps fuzzy-skin options and arc fitting', () => {
    const n = buildNativeSettings({ fuzzy_skin_point_distance: 0.5, fuzzy_skin_first_layer: true, fuzzy_skin_mode: 'all', fuzzy_skin_thickness: 0.4, arc_fitting: true, arc_fitting_tolerance: 0.03 });
    assert.equal(n.fuzzySkinPointDist, 0.5);
    assert.equal(n.fuzzySkinFirstLayer, true);
    assert.equal(n.fuzzySkinMode, 'all');
    assert.equal(n.fuzzySkinThickness, 0.4);
    assert.equal(n.arcFitting, true);
    assert.equal(n.arcTolerance, 0.03);
  });

  test('maps XY compensation, small-perimeter and seam-gap keys', () => {
    const n = buildNativeSettings({ xy_hole_compensation: 0.1, xy_contour_compensation: -0.05, small_perimeter_speed: 20, small_perimeter_threshold: 12, seam_gap: 0.15 });
    assert.equal(n.xyHoleCompensation, 0.1);
    assert.equal(n.xyContourCompensation, -0.05);
    assert.equal(n.smallPerimeterSpeed, 20);
    assert.equal(n.smallPerimeterThreshold, 12);
    assert.equal(n.seamGap, 0.15);
  });

  test('maps gap fill keys', () => {
    const n = buildNativeSettings({ gap_fill_enabled: false, gap_infill_speed: 30 });
    assert.equal(n.gapFill, false);
    assert.equal(n.gapFillSpeed, 30);
  });

  test('maps ironing, infill/wall overlap and shell thickness keys', () => {
    const n = buildNativeSettings({ ironing_flow: 12, ironing_spacing: 0.15, ironing_direction: 90, infill_wall_overlap: 25, top_shell_thickness: 1.2, bottom_shell_thickness: 0.8 });
    assert.equal(n.ironingFlow, 0.12);          // % → fraction
    assert.equal(n.ironingSpacing, 0.15);
    assert.equal(n.ironingDirection, 90);
    assert.equal(n.infillWallOverlap, 0.25);    // % → fraction
    assert.equal(n.topShellThickness, 1.2);
    assert.equal(n.bottomShellThickness, 0.8);
  });

  test('maps support tuning keys', () => {
    const n = buildNativeSettings({ support_threshold: 40, support_base_density: 25, support_interface_top_layers: 3, support_z_gap_layers: 2, support_object_xy_distance: 0.6, support_wall_count: 2 });
    assert.equal(n.supportThreshold, 40);
    assert.equal(n.supportDensity, 0.25);   // % → fraction
    assert.equal(n.supportInterface, 3);
    assert.equal(n.supportZGap, 2);
    assert.equal(n.supportXYGap, 0.6);
    assert.equal(n.supportWallCount, 2);
  });

  test('bridge_angle: a real angle forces direction, 0 means auto', () => {
    assert.equal(buildNativeSettings({ bridge_angle: 90 }).bridgeAngle, 90);
    assert.equal('bridgeAngle' in buildNativeSettings({ bridge_angle: 0 }), false);
  });
});
