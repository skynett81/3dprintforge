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
  grid: 'grid', cubic: 'grid', honeycomb: 'grid', '3dhoneycomb': 'grid',
  triangles: 'triangles', 'tri-hexagon': 'triangles', star: 'triangles',
  line: 'lines', lines: 'lines', concentric: 'concentric',
  gyroid: 'grid', zigzag: 'lines',
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
  if (s.supports !== undefined && s.supports !== '') out.supports = !!s.supports;
  if (s.ironing !== undefined && s.ironing !== '') out.ironing = !!s.ironing;
  if (s.spiral_mode !== undefined && s.spiral_mode !== '') out.spiralMode = !!s.spiral_mode;
  set('elephantFoot', num(s.elephant_foot));
  if (s.fuzzy_skin !== undefined && s.fuzzy_skin !== '') out.fuzzySkin = !!s.fuzzy_skin;
  set('fuzzySkinThickness', num(s.fuzzy_skin_thickness));
  if (s.draft_shield !== undefined && s.draft_shield !== '') out.draftShield = !!s.draft_shield;

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
  set('nozzleTemp', num(s.nozzle_temp));
  set('bedTemp', num(s.bed_temp));
  if (s.material) out.material = String(s.material);

  return out;
}
