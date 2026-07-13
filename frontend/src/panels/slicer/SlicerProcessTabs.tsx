import { useMemo, useState } from 'react';
import { useT } from '../../i18n';

export type SliceSettings = Record<string, string | number | boolean>;

const INFILL_PATTERNS = ['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'line', 'concentric'];
const SUPPORT_TYPES = [['normal(auto)', 'Normal'], ['tree(auto)', 'Tree']];
const BRIM_TYPES = [['no_brim', 'None'], ['outer_only', 'Outer'], ['brim_ears', 'Ears']];

type Field =
  | { tab: string; k: string; label: string; type: 'num'; unit?: string; step?: number; dep?: string }
  | { tab: string; k: string; label: string; type: 'bool' }
  | { tab: string; k: string; label: string; type: 'sel'; opts: (string | string[])[]; dep?: string };

const TABS = ['Quality', 'Strength', 'Speed', 'Support', 'Others'] as const;

const FIELDS: Field[] = [
  { tab: 'Quality', k: 'layer_height', label: 'Layer height', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', k: 'initial_layer_height', label: 'First layer height', type: 'num', unit: 'mm', step: 0.02 },
  { tab: 'Quality', k: 'ironing', label: 'Ironing (smooth top)', type: 'bool' },
  { tab: 'Strength', k: 'wall_loops', label: 'Wall loops', type: 'num', step: 1 },
  { tab: 'Strength', k: 'top_layers', label: 'Top shell layers', type: 'num', step: 1 },
  { tab: 'Strength', k: 'bottom_layers', label: 'Bottom shell layers', type: 'num', step: 1 },
  { tab: 'Strength', k: 'infill_density', label: 'Infill density', type: 'num', unit: '%', step: 5 },
  { tab: 'Strength', k: 'infill_pattern', label: 'Infill pattern', type: 'sel', opts: INFILL_PATTERNS },
  { tab: 'Speed', k: 'outer_wall_speed', label: 'Outer wall speed', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', k: 'inner_wall_speed', label: 'Inner wall speed', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', k: 'infill_speed', label: 'Infill speed', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Speed', k: 'travel_speed', label: 'Travel speed', type: 'num', unit: 'mm/s', step: 5 },
  { tab: 'Support', k: 'supports', label: 'Enable supports', type: 'bool' },
  { tab: 'Support', k: 'support_type', label: 'Support type', type: 'sel', opts: SUPPORT_TYPES, dep: 'supports' },
  { tab: 'Support', k: 'support_threshold', label: 'Overhang angle', type: 'num', unit: '°', step: 1, dep: 'supports' },
  { tab: 'Others', k: 'brim_type', label: 'Brim type', type: 'sel', opts: BRIM_TYPES },
  { tab: 'Others', k: 'brim_width', label: 'Brim width', type: 'num', unit: 'mm', step: 0.5 },
  { tab: 'Others', k: 'skirt_loops', label: 'Skirt loops', type: 'num', step: 1 },
  { tab: 'Others', k: 'raft_layers', label: 'Raft layers', type: 'num', step: 1 },
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
        {shown.map(row)}
        {shown.length === 0 && <p className="muted micro" style={{ padding: 12 }}>{t('v2.oset.nomatch', 'No matching settings.')}</p>}
      </div>
    </div>
  );
}
