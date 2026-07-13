import { useState } from 'react';
import { useT } from '../../i18n';

export type SliceSettings = Record<string, string | number | boolean>;

const INFILL_PATTERNS = ['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'line', 'concentric'];
const SUPPORT_TYPES = [['normal(auto)', 'Normal'], ['tree(auto)', 'Tree']];
const BRIM_TYPES = [['no_brim', 'None'], ['outer_only', 'Outer'], ['brim_ears', 'Ears']];

const TABS = [
  { id: 'quality', label: 'Quality' },
  { id: 'strength', label: 'Strength' },
  { id: 'speed', label: 'Speed' },
  { id: 'support', label: 'Support' },
  { id: 'others', label: 'Others' },
] as const;

function Num({ label, k, v, onChange, step, unit, disabled }: { label: string; k: string; v: SliceSettings; onChange: (k: string, val: string) => void; step?: number; unit?: string; disabled?: boolean }) {
  return (
    <label className="oset-field">
      <span className="oset-label">{label}{unit ? ` (${unit})` : ''}</span>
      <input className="oset-input" type="number" step={step ?? 0.01} value={(v[k] as string) ?? ''} disabled={disabled} onChange={(e) => onChange(k, e.target.value)} />
    </label>
  );
}

/** Process settings organised into OrcaSlicer-style tabs. */
export function SlicerProcessTabs({ value, onChange }: { value: SliceSettings; onChange: (next: SliceSettings) => void }) {
  const t = useT();
  const [tab, setTab] = useState<typeof TABS[number]['id']>('quality');
  const set = (k: string, val: string) => onChange({ ...value, [k]: val });
  const setBool = (k: string, val: boolean) => onChange({ ...value, [k]: val });
  const Sel = ({ k, opts, label }: { k: string; opts: (string | string[])[]; label: string }) => (
    <label className="oset-field">
      <span className="oset-label">{label}</span>
      <select className="oset-input" value={(value[k] as string) ?? ''} onChange={(e) => set(k, e.target.value)}>
        <option value="">{t('v2.slset.default', 'default')}</option>
        {opts.map((o) => { const [val, lab] = Array.isArray(o) ? o : [o, o]; return <option key={val} value={val}>{lab}</option>; })}
      </select>
    </label>
  );

  return (
    <div className="oset">
      <div className="oset-tabs">
        {TABS.map((tb) => (
          <button key={tb.id} className={`oset-tab${tab === tb.id ? ' oset-tab--on' : ''}`} onClick={() => setTab(tb.id)}>
            {t(`v2.oset.${tb.id}`, tb.label)}
          </button>
        ))}
      </div>

      <div className="oset-body">
        {tab === 'quality' && (
          <div className="oset-grid">
            <Num label={t('v2.slset.layer', 'Layer height')} k="layer_height" v={value} onChange={set} unit="mm" />
            <Num label={t('v2.slset.initial', 'First layer')} k="initial_layer_height" v={value} onChange={set} unit="mm" />
            <label className="oset-check"><input type="checkbox" checked={!!value.ironing} onChange={(e) => setBool('ironing', e.target.checked)} /> {t('v2.slset.ironing', 'Ironing (smooth top)')}</label>
          </div>
        )}
        {tab === 'strength' && (
          <div className="oset-grid">
            <Num label={t('v2.slset.walls', 'Wall loops')} k="wall_loops" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.top', 'Top layers')} k="top_layers" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.bottom', 'Bottom layers')} k="bottom_layers" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.infill', 'Infill')} k="infill_density" v={value} onChange={set} step={1} unit="%" />
            <Sel k="infill_pattern" opts={INFILL_PATTERNS} label={t('v2.slset.pattern', 'Infill pattern')} />
          </div>
        )}
        {tab === 'speed' && (
          <div className="oset-grid">
            <Num label={t('v2.slset.outer', 'Outer wall')} k="outer_wall_speed" v={value} onChange={set} step={1} unit="mm/s" />
            <Num label={t('v2.slset.inner', 'Inner wall')} k="inner_wall_speed" v={value} onChange={set} step={1} unit="mm/s" />
            <Num label={t('v2.slset.infill_speed', 'Infill')} k="infill_speed" v={value} onChange={set} step={1} unit="mm/s" />
            <Num label={t('v2.slset.travel', 'Travel')} k="travel_speed" v={value} onChange={set} step={1} unit="mm/s" />
          </div>
        )}
        {tab === 'support' && (
          <div className="oset-grid">
            <label className="oset-check"><input type="checkbox" checked={!!value.supports} onChange={(e) => setBool('supports', e.target.checked)} /> {t('v2.slset.supports', 'Enable supports')}</label>
            <Sel k="support_type" opts={SUPPORT_TYPES} label={t('v2.slset.support_type', 'Type')} />
            <Num label={t('v2.slset.threshold', 'Overhang angle')} k="support_threshold" v={value} onChange={set} step={1} unit="°" disabled={!value.supports} />
          </div>
        )}
        {tab === 'others' && (
          <div className="oset-grid">
            <Sel k="brim_type" opts={BRIM_TYPES} label={t('v2.slset.brim', 'Brim')} />
            <Num label={t('v2.slset.brim_w', 'Brim width')} k="brim_width" v={value} onChange={set} step={0.5} unit="mm" />
            <Num label={t('v2.slset.skirt', 'Skirt loops')} k="skirt_loops" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.raft', 'Raft layers')} k="raft_layers" v={value} onChange={set} step={1} />
          </div>
        )}
      </div>
    </div>
  );
}
