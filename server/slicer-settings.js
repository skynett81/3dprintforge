// slicer-settings.js — map the web slicer's UI settings to an OrcaSlicer
// process-profile JSON. OrcaSlicer's CLI layers this on top of the machine's
// defaults via --load-settings, so we only emit the overridden keys.
//
// Values in Orca profiles are strings; percentages carry a '%'. Temperatures
// live in the filament profile (not here).

const KEY = {
  layer_height: 'layer_height',
  initial_layer_height: 'initial_layer_print_height',
  wall_loops: 'wall_loops',
  top_layers: 'top_shell_layers',
  bottom_layers: 'bottom_shell_layers',
  infill_pattern: 'sparse_infill_pattern',
  support_type: 'support_type',
  support_threshold: 'support_threshold_angle',
  brim_type: 'brim_type',
  brim_width: 'brim_width',
  raft_layers: 'raft_layers',
  skirt_loops: 'skirt_loops',
  outer_wall_speed: 'outer_wall_speed',
  inner_wall_speed: 'inner_wall_speed',
  infill_speed: 'sparse_infill_speed',
  travel_speed: 'travel_speed',
};

export function buildOrcaProcessJson(s = {}) {
  const j = { type: 'process', name: 'ForgeWeb', from: 'User' };
  for (const [uiKey, orcaKey] of Object.entries(KEY)) {
    const v = s[uiKey];
    if (v !== undefined && v !== null && v !== '') j[orcaKey] = String(v);
  }
  if (s.infill_density !== undefined && s.infill_density !== null && s.infill_density !== '') {
    j.sparse_infill_density = `${Number(s.infill_density)}%`;
  }
  if (s.supports !== undefined) j.enable_support = s.supports ? '1' : '0';
  return j;
}

// Whether any meaningful override is present (beyond the identity keys).
export function hasOverrides(s = {}) {
  return Object.keys(buildOrcaProcessJson(s)).length > 3;
}

// ── Native engine mapping ──────────────────────────────────────────
// Map the same UI settings to our own pure-JS slicer's option names.
// The native engine only knows 'lines' and 'grid' fills, so richer
// OrcaSlicer patterns collapse to the closest of the two.
const NATIVE_PATTERN = {
  grid: 'grid', cubic: 'cubic', 'adaptivecubic': 'cubic',
  honeycomb: 'honeycomb', '3dhoneycomb': 'honeycomb',
  triangles: 'triangles', 'tri-hexagon': 'triangles', star: 'triangles',
  line: 'lines', lines: 'lines', concentric: 'concentric',
  gyroid: 'gyroid', zigzag: 'lines',
};

/**
 * Translate the web slicer's UI settings (+ optional profile-derived
 * base defaults like temps / start-end gcode) into the option object the
 * native engine (sliceMeshToGcode) consumes.
 */
export function buildNativeSettings(s = {}, base = {}) {
  const out = { ...base };
  const num = (v) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  };
  const set = (k, v) => { if (v !== undefined) out[k] = v; };

  set('layerHeight', num(s.layer_height));
  set('perimeters', num(s.wall_loops));
  set('topLayers', num(s.top_layers));
  set('bottomLayers', num(s.bottom_layers));

  const infill = num(s.infill_density);
  if (infill !== undefined) out.infillDensity = infill > 1 ? infill / 100 : infill;
  if (s.infill_pattern) out.infillPattern = NATIVE_PATTERN[String(s.infill_pattern).toLowerCase()] || 'lines';

  set('brimWidth', num(s.brim_width));
  set('skirtLoops', num(s.skirt_loops));
  set('skirtGap', num(s.skirt_distance));
  set('infillAngle', num(s.infill_direction));
  set('raftLayers', num(s.raft_layers));
  set('infillCombination', num(s.infill_combination));
  if (s.supports !== undefined && s.supports !== '') out.supports = !!s.supports;
  if (s.ironing !== undefined && s.ironing !== '') out.ironing = !!s.ironing;
  if (s.spiral_mode !== undefined && s.spiral_mode !== '') out.spiralMode = !!s.spiral_mode;
  set('elephantFoot', num(s.elephant_foot));
  if (s.fuzzy_skin !== undefined && s.fuzzy_skin !== '') out.fuzzySkin = !!s.fuzzy_skin;
  set('fuzzySkinThickness', num(s.fuzzy_skin_thickness));
  if (s.draft_shield !== undefined && s.draft_shield !== '') out.draftShield = !!s.draft_shield;
  if (s.wall_infill_order) out.wallOrder = /inner/i.test(String(s.wall_infill_order)) && /outer/i.test(String(s.wall_infill_order)) && String(s.wall_infill_order).toLowerCase().indexOf('inner') < String(s.wall_infill_order).toLowerCase().indexOf('outer') ? 'inner-outer' : String(s.wall_infill_order);
  if (s.top_surface_pattern) out.topSurfacePattern = String(s.top_surface_pattern);
  if (s.reduce_waste !== undefined && s.reduce_waste !== '') out.reduceWaste = !!s.reduce_waste;
  set('primeLineLength', num(s.prime_line_length));
  if (s.flush_into_infill !== undefined && s.flush_into_infill !== '') out.flushIntoInfill = !!s.flush_into_infill;
  set('flushVolume', num(s.flush_volume));

  // Per-feature speeds.
  set('outerWallSpeed', num(s.outer_wall_speed));
  set('innerWallSpeed', num(s.inner_wall_speed));
  set('sparseInfillSpeed', num(s.sparse_infill_speed) ?? num(s.infill_speed));
  set('solidInfillSpeed', num(s.internal_solid_infill_speed) ?? num(s.solid_infill_speed));
  set('supportSpeed', num(s.support_speed));
  set('ironingSpeed', num(s.ironing_speed));
  set('travelSpeed', num(s.travel_speed));
  set('firstLayerSpeed', num(s.initial_layer_speed) ?? num(s.first_layer_speed));
  const anyWall = num(s.outer_wall_speed) ?? num(s.inner_wall_speed);
  if (anyWall !== undefined) set('printSpeed', anyWall);
  if (s.seam_position) out.seamPosition = String(s.seam_position);
  if (s.support_on_plate !== undefined && s.support_on_plate !== '') out.supportOnPlate = !!s.support_on_plate;
  // Support tuning.
  set('supportThreshold', num(s.support_threshold_angle ?? s.support_threshold));
  set('supportInterface', num(s.support_interface_top_layers ?? s.support_interface));
  set('supportZGap', num(s.support_z_gap_layers ?? s.support_z_gap));
  set('supportXYGap', num(s.support_object_xy_distance ?? s.support_xy_gap));
  const supDens = num(s.support_base_density ?? s.support_density);
  if (supDens !== undefined) out.supportDensity = supDens > 1 ? supDens / 100 : supDens;
  set('supportWallCount', num(s.support_wall_count));
  // Per-feature line widths.
  set('outerWallLineWidth', num(s.outer_wall_line_width));
  set('innerWallLineWidth', num(s.inner_wall_line_width));
  set('sparseInfillLineWidth', num(s.sparse_infill_line_width));
  set('solidInfillLineWidth', num(s.internal_solid_infill_line_width));
  set('initialLayerLineWidth', num(s.initial_layer_line_width));
  set('lineWidth', num(s.line_width));
  // Retraction / travel.
  set('retraction', num(s.retraction_length));
  set('zHop', num(s.z_hop));
  // Ironing (top-surface smoothing pass).
  const ifl = num(s.ironing_flow);
  if (ifl !== undefined) out.ironingFlow = ifl > 1 ? ifl / 100 : ifl;
  set('ironingSpacing', num(s.ironing_spacing));
  set('ironingDirection', num(s.ironing_direction));
  // Infill / wall overlap (fraction of a line width the infill grows toward walls).
  const iov = num(s.infill_wall_overlap);
  if (iov !== undefined) out.infillWallOverlap = iov > 1 ? iov / 100 : iov;
  // Top / bottom shell thickness (mm) — the pipeline converts to layer counts.
  set('topShellThickness', num(s.top_shell_thickness));
  set('bottomShellThickness', num(s.bottom_shell_thickness));
  // Gap fill (solid-fill thin features that can't hold sparse infill).
  if (s.gap_fill_enabled !== undefined && s.gap_fill_enabled !== '') out.gapFill = !!s.gap_fill_enabled;
  set('gapFillSpeed', num(s.gap_infill_speed ?? s.gap_fill_speed));
  // Avoid-crossing-walls travel (combing).
  if (s.avoid_crossing_walls !== undefined && s.avoid_crossing_walls !== '') out.avoidCrossingWalls = !!s.avoid_crossing_walls;
  else if (s.reduce_crossing_wall !== undefined && s.reduce_crossing_wall !== '') out.avoidCrossingWalls = !!s.reduce_crossing_wall;
  // XY dimensional compensation (positive contour = grow outline; positive hole = enlarge holes).
  set('xyContourCompensation', num(s.xy_contour_compensation));
  set('xyHoleCompensation', num(s.xy_hole_compensation));
  // Small-perimeter slowdown + seam gap.
  set('smallPerimeterSpeed', num(s.small_perimeter_speed));
  set('smallPerimeterThreshold', num(s.small_perimeter_threshold));
  set('seamGap', num(s.seam_gap));
  // Fuzzy-skin options (thickness is mapped elsewhere).
  set('fuzzySkinPointDist', num(s.fuzzy_skin_point_distance ?? s.fuzzy_skin_point_dist));
  if (s.fuzzy_skin_first_layer !== undefined && s.fuzzy_skin_first_layer !== '') out.fuzzySkinFirstLayer = !!s.fuzzy_skin_first_layer;
  if (s.fuzzy_skin_mode) out.fuzzySkinMode = String(s.fuzzy_skin_mode);
  set('fuzzySkinThickness', num(s.fuzzy_skin_thickness));
  // Arc fitting (post-process straight moves into G2/G3 arcs).
  if (s.arc_fitting !== undefined && s.arc_fitting !== '') out.arcFitting = !!s.arc_fitting;
  set('arcTolerance', num(s.arc_fitting_tolerance ?? s.arc_tolerance));
  set('nozzleTemp', num(s.nozzle_temp));
  set('bedTemp', num(s.bed_temp));
  // Initial-layer temperatures and part-cooling fan — critical per material.
  set('nozzleTempInitial', num(s.nozzle_temp_initial));
  set('bedTempInitial', num(s.bed_temp_initial));
  set('fanSpeed', num(s.fan_speed ?? s.fan_max_speed));
  set('fanOffLayers', num(s.fan_off_layers ?? s.close_fan_the_first_x_layers));
  // Cooling: minimum layer time slow-down.
  set('minLayerTime', num(s.min_layer_time ?? s.slow_down_layer_time));
  set('minPrintSpeed', num(s.min_print_speed ?? s.slow_down_min_speed));
  // Acceleration / jerk (M204 / M205).
  set('acceleration', num(s.acceleration ?? s.default_acceleration));
  set('initialLayerAccel', num(s.initial_layer_acceleration ?? s.initial_layer_accel));
  set('travelAccel', num(s.travel_acceleration ?? s.travel_accel));
  set('jerk', num(s.jerk ?? s.default_jerk));
  // Retraction / wipe.
  set('retractionSpeed', num(s.retraction_speed));
  set('deretractionSpeed', num(s.deretraction_speed));
  if (s.wipe !== undefined && s.wipe !== '') out.wipe = !!s.wipe;
  set('wipeDistance', num(s.wipe_distance));
  set('wipeSpeed', num(s.wipe_speed));
  // Bridges + overhang perimeters.
  set('bridgeSpeed', num(s.bridge_speed));
  set('bridgeFlow', num(s.bridge_flow));
  set('overhangSpeed', num(s.overhang_speed));
  set('overhangFanSpeed', num(s.overhang_fan_speed));
  const ba = num(s.bridge_angle);
  if (ba) out.bridgeAngle = ba;                 // 0 = auto (keep the layer base angle)
  if (s.detect_overhang_wall !== undefined && s.detect_overhang_wall !== '') out.overhangDetect = !!s.detect_overhang_wall;
  // Custom G-code hooks.
  if (s.start_gcode || s.machine_start_gcode) out.startGcode = String(s.start_gcode ?? s.machine_start_gcode);
  if (s.end_gcode || s.machine_end_gcode) out.endGcode = String(s.end_gcode ?? s.machine_end_gcode);
  if (s.layer_change_gcode) out.layerChangeGcode = String(s.layer_change_gcode);
  if (s.material) out.material = String(s.material);
  // Bed size (for centring the model on the plate). Accept [x,y] or {x,y}.
  if (Array.isArray(s.bed_size) && s.bed_size.length >= 2) out.bedSize = [Number(s.bed_size[0]), Number(s.bed_size[1])];
  else if (s.bed_size && s.bed_size.x) out.bedSize = [Number(s.bed_size.x), Number(s.bed_size.y)];

  return out;
}
