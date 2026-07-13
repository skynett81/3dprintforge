import { useMemo, useState } from 'react';
import { useT } from '../../i18n';

export type SliceSettings = Record<string, string | number | boolean>;

const INFILL_PATTERNS = ['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'line', 'concentric'];
const SUPPORT_TYPES = [['normal(auto)', 'Normal'], ['tree(auto)', 'Tree']];
const BRIM_TYPES = [['no_brim', 'None'], ['outer_only', 'Outer'], ['brim_ears', 'Ears']];

type Field =
  | { tab: string; group: string; k: string; label: string; type: 'num'; unit?: string; step?: number; dep?: string }
  | { tab: string; group: string; k: string; label: string; type: 'bool'; dep?: string }
  | { tab: string; group: string; k: string; label: string; type: 'sel'; opts: (string | string[])[]; dep?: string };

const TABS = ['Quality', 'Strength', 'Speed', 'Temperature', 'Support', 'Others'] as const;

const FIELDS: Field[] = [
  { tab: 'Quality', group: 'Layer height', k: 'layer_height', label: 'Layer height', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Layer height', k: 'initial_layer_height', label: 'Initial layer height', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Precision', k: 'elephant_foot', label: 'Elephant foot compensation', type: 'num', unit: 'mm', step: 0.05 },
  { tab: 'Quality', group: 'Surface', k: 'ironing', label: 'Ironing (smooth top)', type: 'bool' },
  { tab: 'Quality', group: 'Surface', k: 'fuzzy_skin', label: 'Fuzzy skin', type: 'bool' },
  { tab: 'Quality', group: 'Surface', k: 'fuzzy_skin_thickness', label: 'Fuzzy skin thickness', type: 'num', unit: 'mm', step: 0.05, dep: 'fuzzy_skin' },
  { tab: 'Quality', group: 'Special mode', k: 'spiral_mode', label: 'Spiral vase mode', type: 'bool' },
  { tab: 'Strength', group: 'Walls', k: 'wall_loops', label: 'Wall loops', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'top_layers', label: 'Top shell layers', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'bottom_layers', label: 'Bottom shell layers', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Infill', k: 'infill_density', label: 'Sparse infill density', type: 'num', unit: '%', step: 5 },
  { tab: 'Strength', group: 'Infill', k: 'infill_pattern', label: 'Sparse infill pattern', type: 'sel', opts: INFILL_PATTERNS },
  { tab: 'Strength', group: 'Infill', k: 'infill_direction', label: 'Infill direction', type: 'num', unit: '°', step: 5 },
  { tab: 'Strength', group: 'Infill', k: 'infill_combination', label: 'Combine infill every N layers', type: 'num', step: 1 },
  { tab: 'Strength', group: 'Walls', k: 'wall_infill_order', label: 'Wall order', type: 'sel', opts: [['outer-inner', 'Outer / inner'], ['inner-outer', 'Inner / outer']] },
  { tab: 'Strength', group: 'Top/bottom shells', k: 'top_surface_pattern', label: 'Top surface pattern', type: 'sel', opts: [['rectilinear', 'Rectilinear'], ['concentric', 'Concentric']] },
  { tab: 'Quality', group: 'Line width', k: 'line_width', label: 'Default', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'outer_wall_line_width', label: 'Outer wall', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'inner_wall_line_width', label: 'Inner wall', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'sparse_infill_line_width', label: 'Sparse infill', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', group: 'Line width', k: 'initial_layer_line_width', label: 'Initial layer', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Speed', group: 'Walls', k: 'outer_wall_speed', label: 'Outer wall', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Walls', k: 'inner_wall_speed', label: 'Inner wall', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Infill', k: 'sparse_infill_speed', label: 'Sparse infill', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Infill', k: 'internal_solid_infill_speed', label: 'Solid infill', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Support', k: 'support_speed', label: 'Support', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Other', k: 'initial_layer_speed', label: 'Initial layer', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Other', k: 'ironing_speed', label: 'Ironing', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', group: 'Other', k: 'travel_speed', label: 'Travel', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Temperature', group: 'Nozzle', k: 'nozzle_temp', label: 'Nozzle temperature', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Nozzle', k: 'nozzle_temp_initial', label: 'Nozzle temp — initial layer', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Bed', k: 'bed_temp', label: 'Bed temperature', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Bed', k: 'bed_temp_initial', label: 'Bed temp — initial layer', type: 'num', unit: '°C', step: 5 },
  { tab: 'Temperature', group: 'Cooling', k: 'fan_speed', label: 'Part cooling fan', type: 'num', unit: '%', step: 5 },
  { tab: 'Temperature', group: 'Cooling', k: 'fan_off_layers', label: 'Fan off for first N layers', type: 'num', step: 1 },
  { tab: 'Support', group: 'Support', k: 'supports', label: 'Enable supports', type: 'bool' },
  { tab: 'Support', group: 'Support', k: 'support_type', label: 'Type', type: 'sel', opts: SUPPORT_TYPES, dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_threshold', label: 'Threshold angle', type: 'num', unit: '°', step: 1, dep: 'supports' },
  { tab: 'Support', group: 'Support', k: 'support_on_plate', label: 'On build plate only', type: 'bool', dep: 'supports' },
  { tab: 'Others', group: 'Seam', k: 'seam_position', label: 'Seam position', type: 'sel', opts: [['nearest', 'Nearest'], ['aligned', 'Aligned'], ['back', 'Rear'], ['random', 'Random']] },
  { tab: 'Others', group: 'Adhesion', k: 'brim_type', label: 'Brim type', type: 'sel', opts: BRIM_TYPES },
  { tab: 'Others', group: 'Adhesion', k: 'brim_width', label: 'Brim width', type: 'num', unit: 'mm', step: 0.5 },
  { tab: 'Others', group: 'Adhesion', k: 'skirt_loops', label: 'Skirt loops', type: 'num', step: 1 },
  { tab: 'Others', group: 'Adhesion', k: 'skirt_distance', label: 'Skirt distance', type: 'num', unit: 'mm', step: 0.5 },
  { tab: 'Others', group: 'Adhesion', k: 'raft_layers', label: 'Raft layers', type: 'num', step: 1 },
  { tab: 'Others', group: 'Adhesion', k: 'draft_shield', label: 'Draft shield', type: 'bool' },
  { tab: 'Others', group: 'Retraction', k: 'retraction_length', label: 'Retraction length', type: 'num', unit: 'mm', step: 0.1 },
  { tab: 'Others', group: 'Retraction', k: 'z_hop', label: 'Z hop', type: 'num', unit: 'mm', step: 0.05 },
  { tab: 'Others', group: 'Reduce waste', k: 'reduce_waste', label: 'Skip prime line', type: 'bool' },
  { tab: 'Others', group: 'Reduce waste', k: 'prime_line_length', label: 'Prime line length', type: 'num', unit: 'mm', step: 5 },
  { tab: 'Others', group: 'Multi-colour', k: 'flush_into_infill', label: 'Flush into infill (waste as infill)', type: 'bool' },
  { tab: 'Others', group: 'Multi-colour', k: 'flush_volume', label: 'Flush volume', type: 'num', unit: 'mm³', step: 10, dep: 'flush_into_infill' },
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
