import { useState } from 'react';
import { useT } from '../../i18n';
import type { SlicerStatus } from '../../types';

export type SliceSettings = Record<string, string | number | boolean>;

const INFILL_PATTERNS = ['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'line', 'concentric'];
const SUPPORT_TYPES = [['normal(auto)', 'Normal'], ['tree(auto)', 'Tree']];
const BRIM_TYPES = [['no_brim', 'None'], ['outer_only', 'Outer'], ['brim_ears', 'Ears']];

function Num({ label, k, v, onChange, step, unit }: { label: string; k: string; v: SliceSettings; onChange: (k: string, val: string) => void; step?: number; unit?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}{unit ? ` (${unit})` : ''}</span>
      <input className="input" type="number" step={step ?? 0.01} value={(v[k] as string) ?? ''} onChange={(e) => onChange(k, e.target.value)} />
    </label>
  );
}

/** Grouped OrcaSlicer print settings for the web slicer. */
export function SlicerSettings({ value, onChange, status }: { value: SliceSettings; onChange: (next: SliceSettings) => void; status?: SlicerStatus }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const set = (k: string, val: string) => onChange({ ...value, [k]: val });
  const setBool = (k: string, val: boolean) => onChange({ ...value, [k]: val });

  function applyPreset(id: string) {
    const p = status?.qualityPresets?.find((q) => q.id === id);
    if (!p) return;
    onChange({ ...value, quality: id, layer_height: p.layerHeight, infill_density: p.infill });
  }

  return (
    <section className="card" style={{ marginBottom: 14 }}>
      <button className="field-label" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', width: '100%', alignItems: 'center', gap: 6 }} onClick={() => setOpen((o) => !o)}>
        {t('v2.slset.title', 'Print settings')} {open ? '▴' : '▾'}
        <span className="muted" style={{ marginLeft: 'auto', fontWeight: 400, fontSize: '0.78rem' }}>{value.layer_height ? `${value.layer_height}mm · ${value.infill_density ?? 15}% infill` : t('v2.slset.default', 'default')}</span>
      </button>

      {open && (
        <div style={{ marginTop: 10 }}>
          <label className="field" style={{ maxWidth: 240 }}>
            <span className="field-label">{t('v2.slset.quality', 'Quality preset')}</span>
            <select className="input" value={(value.quality as string) ?? ''} onChange={(e) => applyPreset(e.target.value)}>
              <option value="">{t('v2.slset.custom', 'Custom')}</option>
              {(status?.qualityPresets ?? []).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>

          <div className="slset-grid">
            <Num label={t('v2.slset.layer', 'Layer height')} k="layer_height" v={value} onChange={set} unit="mm" />
            <Num label={t('v2.slset.initial', 'First layer')} k="initial_layer_height" v={value} onChange={set} unit="mm" />
            <Num label={t('v2.slset.walls', 'Wall loops')} k="wall_loops" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.top', 'Top layers')} k="top_layers" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.bottom', 'Bottom layers')} k="bottom_layers" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.infill', 'Infill')} k="infill_density" v={value} onChange={set} step={1} unit="%" />
            <label className="field"><span className="field-label">{t('v2.slset.pattern', 'Infill pattern')}</span>
              <select className="input" value={(value.infill_pattern as string) ?? ''} onChange={(e) => set('infill_pattern', e.target.value)}>
                <option value="">{t('v2.slset.default', 'default')}</option>
                {INFILL_PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>

          <div className="slset-grid" style={{ marginTop: 6 }}>
            <label className="chk" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!value.supports} onChange={(e) => setBool('supports', e.target.checked)} /> {t('v2.slset.supports', 'Supports')}</label>
            <label className="field"><span className="field-label">{t('v2.slset.support_type', 'Support type')}</span>
              <select className="input" value={(value.support_type as string) ?? ''} onChange={(e) => set('support_type', e.target.value)} disabled={!value.supports}>
                <option value="">{t('v2.slset.default', 'default')}</option>
                {SUPPORT_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <Num label={t('v2.slset.threshold', 'Overhang angle')} k="support_threshold" v={value} onChange={set} step={1} unit="°" />
            <label className="field"><span className="field-label">{t('v2.slset.brim', 'Brim')}</span>
              <select className="input" value={(value.brim_type as string) ?? ''} onChange={(e) => set('brim_type', e.target.value)}>
                <option value="">{t('v2.slset.default', 'default')}</option>
                {BRIM_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <Num label={t('v2.slset.brim_w', 'Brim width')} k="brim_width" v={value} onChange={set} step={0.5} unit="mm" />
            <Num label={t('v2.slset.raft', 'Raft layers')} k="raft_layers" v={value} onChange={set} step={1} />
            <Num label={t('v2.slset.skirt', 'Skirt loops')} k="skirt_loops" v={value} onChange={set} step={1} />
          </div>

          <div className="slset-grid" style={{ marginTop: 6 }}>
            <Num label={t('v2.slset.outer', 'Outer wall speed')} k="outer_wall_speed" v={value} onChange={set} step={1} unit="mm/s" />
            <Num label={t('v2.slset.inner', 'Inner wall speed')} k="inner_wall_speed" v={value} onChange={set} step={1} unit="mm/s" />
            <Num label={t('v2.slset.infill_speed', 'Infill speed')} k="infill_speed" v={value} onChange={set} step={1} unit="mm/s" />
            <Num label={t('v2.slset.travel', 'Travel speed')} k="travel_speed" v={value} onChange={set} step={1} unit="mm/s" />
          </div>
        </div>
      )}
    </section>
  );
}
