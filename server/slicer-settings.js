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
