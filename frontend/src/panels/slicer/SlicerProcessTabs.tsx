import { useMemo, useState } from 'react';
import { useT } from '../../i18n';

export type SliceSettings = Record<string, string | number | boolean>;

const INFILL_PATTERNS = ['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'star', 'crosshatch', 'lightning', 'line', 'rectilinear', 'alignedrectilinear', 'concentric'];
const SUPPORT_TYPES = [['normal(auto)', 'Normal'], ['tree(auto)', 'Tree']];
const BRIM_TYPES = [['no_brim', 'None'], ['outer_only', 'Outer'], ['brim_ears', 'Ears']];

type Field =
  | { tab: string; group: string; k: string; label: string; type: 'num'; unit?: string; step?: number; dep?: string }
  | { tab: string; group: string; k: string; label: string; type: 'bool'; dep?: string }
  | { tab: string; group: string; k: string; label: string; type: 'sel'; opts: (string | string[])[]; dep?: string }
  | { tab: string; group: string; k: string; label: string; type: 'text'; rows?: number; dep?: string };

const TABS = ['Quality', 'Strength', 'Speed', 'Temperature', 'Support', 'Others', 'G-code'] as const;

const FIELDS: Field[] = [
  { tab: 'Quality', group: 'Layer height', k: 'layer_height', label: 'Layer height', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Layer height', k: 'initial_layer_height', label: 'Initial layer height', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Layer height', k: 'adaptive_layer_height', label: 'Adaptive layer height', type: 'bool' },
  { tab: 'Quality', group: 'Layer height', k: 'min_layer_height', label: 'Min layer height', type: 'num', unit: 'mm', step: 0.02, dep: 'adaptive_layer_height' },
  { tab: 'Quality', group: 'Layer height', k: 'max_layer_height', label: 'Max layer height', type: 'num', unit: 'mm', step: 0.02, dep: 'adaptive_layer_height' },
  { tab: 'Quality', group: 'Precision', k: 'elephant_foot', label: 'Elephant foot compensation', type: 'num', unit: 'mm', step: 0.05 },
  { tab: 'Quality', group: 'Precision', k: 'resolution', label: 'Resolution (path simplify)', type: 'num', unit: 'mm', step: 0.01 },
  { tab: 'Quality', group: 'Precision', k: 'xy_hole_compensation', label: 'X-Y hole compensation', type: 'num', unit: 'mm', step: 0.05 },
  { tab: 'Quality', group: 'Precision', k: 'xy_contour_compensation', label: 'X-Y contour compensation', type: 'num', unit: 'mm', step: 0.05 },
  { tab: 'Quality', group: 'Surface', k: 'ironing', label: 'Ironing (smooth top)', type: 'bool' },
  { tab: 'Quality', group: 'Surface', k: 'ironing_flow', label: 'Ironing flow', type: 'num', unit: '%', step: 1, dep: 'ironing' },
  { tab: 'Quality', group: 'Surface', k: 'ironing_spacing', label: 'Ironing line spacing', type: 'num', unit: 'mm', step: 0.05, dep: 'ironing' },
  { tab: 'Quality', group: 'Surface', k: 'ironing_direction', label: 'Ironing direction', type: 'num', unit: '°', step: 5, dep: 'ironing' },
  { tab: 'Quality', group: 'Surface', k: 'fuzzy_skin', label: 'Fuzzy skin', type: 'bool' },
  { tab: 'Quality', group: 'Surface', k: 'fuzzy_skin_mode', label: 'Fuzzy skin mode', type: 'sel', opts: [['external', 'Outer wall'], ['all', 'All walls']], dep: 'fuzzy_skin' },
  { tab: 'Quality', group: 'Surface', k: 'fuzzy_skin_thickness', label: 'Fuzzy skin thickness', type: 'num', unit: 'mm', step: 0.05, dep: 'fuzzy_skin' },
  { tab: 'Quality', group: 'Surface', k: 'fuzzy_skin_point_distance', label: 'Fuzzy skin point distance', type: 'num', unit: 'mm', step: 0.05, dep: 'fuzzy_skin' },
  { tab: 'Quality', group: 'Surface', k: 'fuzzy_skin_first_layer', label: 'Fuzzy skin on first layer', type: 'bool', dep: 'fuzzy_skin' },
  { tab: 'Quality', group: 'Special mode', k: 'spiral_mode', label: 'Spiral vase mode', type: 'bool' },
  { tab: 'Quality', group: 'Overhangs & bridges', k: 'detect_overhang_wall', label: 'Detect overhang walls', type: 'bool' },
  { tab: 'Quality', group: 'Overhangs & bridges', k: 'bridge_flow', label: 'Bridge flow ratio', type: 'num', step: 0.05 },
  { tab: 'Quality', group: 'Overhangs & bridges', k: 'bridge_angle', label: 'Bridge direction (0 = auto)', type: 'num', unit: '°', step: 5 },
  { tab: 'Strength', group: 'Walls', k: 'wall_generator', label: 'Wall generator', type: 'sel', opts: [['classic', 'Classic'], ['arachne', 'Arachne (variable width)']] },
  { tab: 'Strength', group: 'Walls', k: 'wall_loops', label: 'Wall loops', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'top_layers', label: 'Top shell layers', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'bottom_layers', label: 'Bottom shell layers', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'top_shell_thickness', label: 'Top shell thickness', type: 'num', unit: 'mm', step: 0.2 },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'bottom_shell_thickness', label: 'Bottom shell thickness', type: 'num', unit: 'mm', step: 0.2 },
  { tab: 'Strength', group: 'Infill', k: 'infill_density', label: 'Sparse infill density', type: 'num', unit: '%', step: 5 },
  { tab: 'Strength', group: 'Infill', k: 'infill_wall_overlap', label: 'Infill/wall overlap', type: 'num', unit: '%', step: 5 },
  { tab: 'Strength', group: 'Infill', k: 'gap_fill_enabled', label: 'Gap fill (solid-fill thin features)', type: 'bool' },
  { tab: 'Speed', group: 'Infill', k: 'gap_infill_speed', label: 'Gap fill', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Strength', group: 'Infill', k: 'infill_pattern', label: 'Sparse infill pattern', type: 'sel', opts: INFILL_PATTERNS },
  { tab: 'Strength', group: 'Infill', k: 'infill_direction', label: 'Infill direction', type: 'num', unit: '°', step: 5 },
  { tab: 'Strength', group: 'Infill', k: 'infill_combination', label: 'Combine infill every N layers', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Infill', k: 'min_sparse_infill_area', label: 'Min sparse infill area', type: 'num', unit: 'mm²', step: 10 },
  { tab: 'Strength', group: 'Walls', k: 'wall_infill_order', label: 'Wall order', type: 'sel', opts: [['outer-inner', 'Outer / inner'], ['inner-outer', 'Inner / outer']] },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'top_surface_pattern', label: 'Top surface pattern', type: 'sel', opts: [['rectilinear', 'Rectilinear'], ['concentric', 'Concentric']] },
  { tab: 'Quality', group: 'Line width', k: 'line_width', label: 'Default', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'outer_wall_line_width', label: 'Outer wall', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'inner_wall_line_width', label: 'Inner wall', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'sparse_infill_line_width', label: 'Sparse infill', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'initial_layer_line_width', label: 'Initial layer', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Speed', group: 'Walls', k: 'outer_wall_speed', label: 'Outer wall', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Walls', k: 'inner_wall_speed', label: 'Inner wall', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Walls', k: 'small_perimeter_speed', label: 'Small perimeter', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Walls', k: 'small_perimeter_threshold', label: 'Small perimeter threshold', type: 'num', unit: 'mm', step: 1 },
  { tab: 'Speed', group: 'Infill', k: 'sparse_infill_speed', label: 'Sparse infill', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Infill', k: 'internal_solid_infill_speed', label: 'Solid infill', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Overhang & bridge', k: 'overhang_1_4_speed', label: 'Overhang 0-25% (0 = keep speed)', type: 'num', unit: 'mm/s', step: 5, dep: 'detect_overhang_wall' },
  { tab: 'Speed', group: 'Overhang & bridge', k: 'overhang_2_4_speed', label: 'Overhang 25-50%', type: 'num', unit: 'mm/s', step: 5, dep: 'detect_overhang_wall' },
  { tab: 'Speed', group: 'Overhang & bridge', k: 'overhang_3_4_speed', label: 'Overhang 50-75%', type: 'num', unit: 'mm/s', step: 5, dep: 'detect_overhang_wall' },
  { tab: 'Speed', group: 'Overhang & bridge', k: 'overhang_4_4_speed', label: 'Overhang 75-100%', type: 'num', unit: 'mm/s', step: 5, dep: 'detect_overhang_wall' },
  { tab: 'Speed', group: 'Overhang & bridge', k: 'bridge_speed', label: 'Bridge', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Support', k: 'support_speed', label: 'Support', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Other', k: 'initial_layer_speed', label: 'Initial layer', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Other', k: 'ironing_speed', label: 'Ironing', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Other', k: 'travel_speed', label: 'Travel', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Acceleration', k: 'default_acceleration', label: 'Default acceleration', type: 'num', unit: 'mm/s²', step: 100 },
  { tab: 'Speed', group: 'Acceleration', k: 'outer_wall_acceleration', label: 'Outer wall', type: 'num', unit: 'mm/s²', step: 100 },
  { tab: 'Speed', group: 'Acceleration', k: 'inner_wall_acceleration', label: 'Inner wall', type: 'num', unit: 'mm/s²', step: 100 },
  { tab: 'Speed', group: 'Acceleration', k: 'top_surface_acceleration', label: 'Top surface', type: 'num', unit: 'mm/s²', step: 100 },
  { tab: 'Speed', group: 'Acceleration', k: 'sparse_infill_acceleration', label: 'Sparse infill', type: 'num', unit: 'mm/s²', step: 100 },
  { tab: 'Speed', group: 'Acceleration', k: 'initial_layer_acceleration', label: 'Initial layer', type: 'num', unit: 'mm/s²', step: 100 },
  { tab: 'Speed', group: 'Acceleration', k: 'travel_acceleration', label: 'Travel', type: 'num', unit: 'mm/s²', step: 100 },
  { tab: 'Speed', group: 'Jerk', k: 'default_jerk', label: 'Jerk (max)', type: 'num', unit: 'mm/s', step: 1 },
  { tab: 'Temperature', group: 'Nozzle', k: 'nozzle_temp', label: 'Nozzle temperature', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Nozzle', k: 'nozzle_temp_initial', label: 'Nozzle temp — initial layer', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Bed', k: 'bed_temp', label: 'Bed temperature', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Bed', k: 'bed_temp_initial', label: 'Bed temp — initial layer', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Cooling', k: 'fan_speed', label: 'Part cooling fan', type: 'num', unit: '%', step: 5 },
  { tab: 'Temperature', group: 'Cooling', k: 'fan_off_layers', label: 'Fan off for first N layers', type: 'num', step: 1 },
  { tab: 'Temperature', group: 'Cooling', k: 'slow_down_layer_time', label: 'Slow down if layer faster than', type: 'num', unit: 's', step: 1 },
  { tab: 'Temperature', group: 'Cooling', k: 'slow_down_min_speed', label: 'Min print speed (slow-down floor)', type: 'num', unit: 'mm/s', step: 1 },
  { tab: 'Temperature', group: 'Cooling', k: 'overhang_fan_speed', label: 'Overhang/bridge fan', type: 'num', unit: '%', step: 5 },
  { tab: 'Temperature', group: 'Cooling', k: 'fan_min_speed', label: 'Fan min speed (ramp start)', type: 'num', unit: '%', step: 5 },
  { tab: 'Temperature', group: 'Cooling', k: 'fan_max_speed', label: 'Fan max speed (ramp end)', type: 'num', unit: '%', step: 5 },
  { tab: 'Temperature', group: 'Cooling', k: 'full_fan_speed_layer', label: 'Full fan speed at layer', type: 'num', step: 1, dep: 'fan_max_speed' },
  { tab: 'Support', group: 'Support', k: 'supports', label: 'Enable supports', type: 'bool' },
  { tab: 'Support', group: 'Support', k: 'support_type', label: 'Type', type: 'sel', opts: SUPPORT_TYPES, dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_threshold', label: 'Threshold angle (from vertical)', type: 'num', unit: '°', step: 1, dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_on_plate', label: 'On build plate only', type: 'bool', dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_remove_small_overhangs', label: 'Remove small overhangs', type: 'bool', dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_min_overhang_area', label: 'Min overhang area', type: 'num', unit: 'mm²', step: 1, dep: 'supports' },
  { tab: 'Support', group: 'Interface', k: 'support_top_z_distance', label: 'Top Z distance', type: 'num', unit: 'mm', step: 0.05, dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_base_density', label: 'Base density', type: 'num', unit: '%', step: 5, dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_base_pattern', label: 'Base pattern', type: 'sel', opts: [['rectilinear', 'Rectilinear'], ['grid', 'Grid']], dep: 'supports' },
  { tab: 'Support', group: 'Interface', k: 'support_interface_spacing', label: 'Interface line spacing (0 = solid)', type: 'num', unit: 'mm', step: 0.1, dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_wall_count', label: 'Support wall loops', type: 'num', step: 1, dep: 'supports' },
  { tab: 'Support', group: 'Interface', k: 'support_interface_top_layers', label: 'Top interface layers', type: 'num', step: 1, dep: 'supports' },
  { tab: 'Support', group: 'Interface', k: 'support_z_gap_layers', label: 'Top Z gap (layers)', type: 'num', step: 1, dep: 'supports' },
  { tab: 'Support', group: 'Clearance', k: 'support_object_xy_distance', label: 'XY distance to model', type: 'num', unit: 'mm', step: 0.1, dep: 'supports' },
  { tab: 'Others', group: 'Seam', k: 'seam_position', label: 'Seam position', type: 'sel', opts: [['nearest', 'Nearest'], ['aligned', 'Aligned'], ['back', 'Rear'], ['random', 'Random']] },
  { tab: 'Others', group: 'Seam', k: 'seam_gap', label: 'Seam gap', type: 'num', unit: 'mm', step: 0.05 },
  { tab: 'Others', group: 'Seam', k: 'scarf_seam', label: 'Scarf joint seam', type: 'bool' },
  { tab: 'Others', group: 'Seam', k: 'scarf_length', label: 'Scarf length', type: 'num', unit: 'mm', step: 0.5, dep: 'scarf_seam' },
  { tab: 'Others', group: 'Adhesion', k: 'brim_type', label: 'Brim type', type: 'sel', opts: BRIM_TYPES },
  { tab: 'Others', group: 'Adhesion', k: 'brim_width', label: 'Brim width', type: 'num', unit: 'mm', step: 0.5 },
  { tab: 'Others', group: 'Adhesion', k: 'brim_object_gap', label: 'Brim-object gap', type: 'num', unit: 'mm', step: 0.05, dep: 'brim_type' },
  { tab: 'Others', group: 'Adhesion', k: 'skirt_loops', label: 'Skirt loops', type: 'num', step: 1 },
  { tab: 'Others', group: 'Adhesion', k: 'skirt_height', label: 'Skirt height (layers)', type: 'num', step: 1, dep: 'skirt_loops' },
  { tab: 'Others', group: 'Adhesion', k: 'skirt_distance', label: 'Skirt distance', type: 'num', unit: 'mm', step: 0.5 },
  { tab: 'Speed', group: 'Other', k: 'skirt_speed', label: 'Skirt', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Others', group: 'Adhesion', k: 'raft_layers', label: 'Raft layers', type: 'num', step: 1 },
  { tab: 'Others', group: 'Adhesion', k: 'draft_shield', label: 'Draft shield', type: 'bool' },
  { tab: 'Others', group: 'Retraction', k: 'retraction_length', label: 'Retraction length', type: 'num', unit: 'mm', step: 0.1 },
  { tab: 'Others', group: 'Retraction', k: 'retraction_speed', label: 'Retraction speed', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Others', group: 'Retraction', k: 'deretraction_speed', label: 'Deretraction speed', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Others', group: 'Retraction', k: 'z_hop', label: 'Z hop', type: 'num', unit: 'mm', step: 0.05 },
  { tab: 'Others', group: 'Retraction', k: 'wipe', label: 'Wipe while retracting', type: 'bool' },
  { tab: 'Others', group: 'Retraction', k: 'wipe_distance', label: 'Wipe distance', type: 'num', unit: 'mm', step: 0.5, dep: 'wipe' },
  { tab: 'Others', group: 'Travel', k: 'avoid_crossing_walls', label: 'Avoid crossing walls (combing)', type: 'bool' },
  { tab: 'Others', group: 'Reduce waste', k: 'reduce_waste', label: 'Skip prime line', type: 'bool' },
  { tab: 'Others', group: 'Reduce waste', k: 'prime_line_length', label: 'Prime line length', type: 'num', unit: 'mm', step: 5 },
  { tab: 'Others', group: 'Multi-colour', k: 'flush_into_infill', label: 'Flush into infill (waste as infill)', type: 'bool' },
  { tab: 'Others', group: 'Multi-colour', k: 'flush_volume', label: 'Flush volume', type: 'num', unit: 'mm³', step: 10, dep: 'flush_into_infill' },
  { tab: 'Others', group: 'Multi-colour', k: 'wipe_tower', label: 'Wipe/prime tower (purge beside model)', type: 'bool' },
  { tab: 'Others', group: 'Multi-colour', k: 'wipe_tower_width', label: 'Wipe tower width', type: 'num', unit: 'mm', step: 5, dep: 'wipe_tower' },
  { tab: 'Others', group: 'Multi-colour', k: 'wipe_tower_depth', label: 'Wipe tower depth', type: 'num', unit: 'mm', step: 5, dep: 'wipe_tower' },
  { tab: 'Others', group: 'Sequential printing', k: 'print_sequence', label: 'Print sequence', type: 'sel', opts: [['by_layer', 'By layer (all objects together)'], ['by_object', 'By object (one at a time)']] },
  { tab: 'Others', group: 'Sequential printing', k: 'extruder_clearance_height', label: 'Gantry clearance height', type: 'num', unit: 'mm', step: 1, dep: 'print_sequence' },
  { tab: 'Others', group: 'Output', k: 'arc_fitting', label: 'Arc fitting (G2/G3)', type: 'bool' },
  { tab: 'Others', group: 'Output', k: 'arc_fitting_tolerance', label: 'Arc fitting tolerance', type: 'num', unit: 'mm', step: 0.01, dep: 'arc_fitting' },
  { tab: 'Speed', group: 'Flow dynamics', k: 'max_volumetric_speed', label: 'Max volumetric speed', type: 'num', unit: 'mm³/s', step: 1 },
  { tab: 'Speed', group: 'Flow dynamics', k: 'pressure_advance', label: 'Pressure advance (K)', type: 'num', step: 0.001 },
  { tab: 'Speed', group: 'Flow dynamics', k: 'gcode_flavor', label: 'G-code flavor', type: 'sel', opts: [['marlin', 'Marlin (M900)'], ['klipper', 'Klipper (SET_PRESSURE_ADVANCE)']] },
  { tab: 'G-code', group: 'Custom G-code', k: 'start_gcode', label: 'Start G-code', type: 'text', rows: 5 },
  { tab: 'G-code', group: 'Custom G-code', k: 'layer_change_gcode', label: 'Layer change G-code', type: 'text', rows: 3 },
  { tab: 'G-code', group: 'Custom G-code', k: 'end_gcode', label: 'End G-code', type: 'text', rows: 5 },
];

/** OrcaSlicer-style process settings: category tabs + a search box, each
 *  setting a label-left / value-right row. */
export function SlicerProcessTabs({ value, onChange }: { value: SliceSettings; onChange: (next: SliceSettings) => void }) {
  const t = useT();
  const [tab, setTab] = useState<string>('Quality');
  const [q, setQ] = useState('');
  const set = (k: string, val: string | boolean) => onChange({ ...value, [k]: val });

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle) return FIELDS.filter((f) => f.label.toLowerCase().includes(needle));
    return FIELDS.filter((f) => f.tab === tab);
  }, [q, tab]);

  const row = (f: Field) => {
    const disabled = 'dep' in f && f.dep ? !value[f.dep] : false;
    if (f.type === 'text') {
      return (
        <div className="oset-row" key={f.k} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
          <span className="oset-rowlabel">{t(`v2.f.${f.k}`, f.label)}</span>
          <textarea className="oset-rowinput" style={{ width: '100%', minHeight: (f.rows ?? 3) * 20, fontFamily: 'monospace', fontSize: '0.72rem', resize: 'vertical' }}
            value={(value[f.k] as string) ?? ''} onChange={(e) => set(f.k, e.target.value)} spellCheck={false} placeholder="; G-code…" />
        </div>
      );
    }
    let control;
    if (f.type === 'bool') control = <input className="oset-toggle" type="checkbox" checked={!!value[f.k]} onChange={(e) => set(f.k, e.target.checked)} />;
    else if (f.type === 'sel') control = (
      <select className="oset-rowinput" value={(value[f.k] as string) ?? ''} disabled={disabled} onChange={(e) => set(f.k, e.target.value)}>
        <option value="">{t('v2.slset.default', 'default')}</option>
        {f.opts.map((o) => { const [val, lab] = Array.isArray(o) ? o : [o, o]; return <option key={val} value={val}>{lab}</option>; })}
      </select>
    );
    else control = <input className="oset-rowinput" type="number" step={f.step ?? 0.01} disabled={disabled} value={(value[f.k] as string) ?? ''} onChange={(e) => set(f.k, e.target.value)} />;
    return (
      <div className={`oset-row${disabled ? ' oset-row--off' : ''}`} key={f.k}>
        <span className="oset-rowlabel">{t(`v2.f.${f.k}`, f.label)}{'unit' in f && f.unit ? ` (${f.unit})` : ''}</span>
        {control}
      </div>
    );
  };

  return (
    <div className="oset">
      <div className="oset-search">
        <input className="oset-searchinput" placeholder={t('v2.oset.search', 'Search settings…')} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {!q && (
        <div className="oset-tabs">
          {TABS.map((tb) => (
            <button key={tb} className={`oset-tab${tab === tb ? ' oset-tab--on' : ''}`} onClick={() => setTab(tb)}>{t(`v2.oset.${tb.toLowerCase()}`, tb)}</button>
          ))}
        </div>
      )}
      <div className="oset-rows">
        {shown.map((f, i) => {
          const prev = shown[i - 1];
          const header = !q && (i === 0 || prev.group !== f.group)
            ? <div className="oset-group" key={`g-${f.group}`}>{t(`v2.g.${f.group}`, f.group)}</div>
            : null;
          return <div key={f.k}>{header}{row(f)}</div>;
        })}
        {shown.length === 0 && <p className="muted micro" style={{ padding: 12 }}>{t('v2.oset.nomatch', 'No matching settings.')}</p>}
      </div>
    </div>
  );
}
