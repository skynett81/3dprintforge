import { useState } from 'react';
import { useT } from '../../i18n';
import type { SlicerStatus } from '../../types';

export type SliceSettings = Record<string, string | number | boolean>;

const INFILL_PATTERNS = ['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'line', 'concentric'];
const SUPPORT_TYPES = [['normal(auto)', 'Normal'], ['tree(auto)', 'Tree']];
const BRIM_TYPES = [['no_brim', 'None'], ['outer_only', 'Outer'], ['brim_ears', 'Ears']];

// Material → [nozzle °C, bed °C] presets, applied when the material changes.
const MATERIALS: Record<string, [number, number]> = {
  PLA: [210, 60], PETG: [240, 80], ABS: [250, 100], ASA: [250, 100], TPU: [230, 40], PC: [270, 110], Nylon: [260, 80],
};

function Num({ label, k, v, onChange, step, unit }: { label: string; k: string; v: SliceSettings; onChange: (k: string, val: string) => void; step?: number; unit?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}{unit ? ` (${unit})` : ''}</span>
      <input className="input" type="number" step={step ?? 0.01} value={(v[k] as string) ?? ''} onChange={(e) => onChange(k, e.target.value)} />
    </label>
  );
}

/** Grouped OrcaSlicer print settings for the web slicer. */
const PRESET_KEY = 'v2.slicer.presets';
function loadPresets(): Record<string, SliceSettings> {
  try { return JSON.parse(localStorage.getItem(PRESET_KEY) || '{}'); } catch { return {}; }
}

export function SlicerSettings({ value, onChange, status }: { value: SliceSettings; onChange: (next: SliceSettings) => void; status?: SlicerStatus }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [presets, setPresets] = useState<Record<string, SliceSettings>>(() => loadPresets());
  const set = (k: string, val: string) => onChange({ ...value, [k]: val });
  const setBool = (k: string, val: boolean) => onChange({ ...value, [k]: val });

  function savePreset() {
    const name = window.prompt(t('v2.slset.preset_name', 'Preset name'))?.trim();
    if (!name) return;
    const next = { ...presets, [name]: value };
    setPresets(next);
    localStorage.setItem(PRESET_KEY, JSON.stringify(next));
  }
  function applyUserPreset(name: string) {
    if (!name || !presets[name]) return;
    onChange({ ...presets[name] });
  }
  function deletePreset(name: string) {
    const next = { ...presets }; delete next[name];
    setPresets(next);
    localStorage.setItem(PRESET_KEY, JSON.stringify(next));
  }

  function applyPreset(id: string) {
    const p = status?.qualityPresets?.find((q) => q.id === id);
    if (!p) return;
    onChange({ ...value, quality: id, layer_height: p.layerHeight, infill_density: p.infill });
  }

  function applyMaterial(mat: string) {
    const temps = MATERIALS[mat];
    if (!temps) { onChange({ ...value, material: mat }); return; }
    onChange({ ...value, material: mat, nozzle_temp: temps[0], bed_temp: temps[1] });
  }

  return (
    <section className="card" style={{ marginBottom: 14 }}>
      <button className="field-label" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', width: '100%', alignItems: 'center', gap: 6 }} onClick={() => setOpen((o) => !o)}>
        {t('v2.slset.title', 'Print settings')} {open ? '▴' : '▾'}
        <span className="muted" style={{ marginLeft: 'auto', fontWeight: 400, fontSize: '0.78rem' }}>{value.layer_height ? `${value.layer_height}mm · ${value.infill_density ?? 15}% infill` : t('v2.slset.default', 'default')}</span>
      </button>

      {open && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span className="field-label" style={{ margin: 0 }}>{t('v2.slset.presets', 'My presets')}</span>
            <select className="input" style={{ flex: 1, maxWidth: 150 }} value="" onChange={(e) => applyUserPreset(e.target.value)}>
              <option value="">{Object.keys(presets).length ? t('v2.slset.load_preset', 'Load…') : t('v2.slset.none_saved', 'none saved')}</option>
              {Object.keys(presets).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <button className="btn btn--sm btn--ghost" onClick={savePreset}>{t('v2.slset.save', 'Save')}</button>
            {Object.keys(presets).length > 0 && (
              <select className="input btn--sm" style={{ maxWidth: 34 }} title={t('v2.slset.delete_preset', 'Delete a preset')} value="" onChange={(e) => { if (e.target.value) deletePreset(e.target.value); }}>
                <option value="">×</option>
                {Object.keys(presets).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            )}
          </div>
          <div className="slset-grid" style={{ marginBottom: 8 }}>
            <label className="field">
              <span className="field-label">{t('v2.slset.quality', 'Quality preset')}</span>
              <select className="input" value={(value.quality as string) ?? ''} onChange={(e) => applyPreset(e.target.value)}>
                <option value="">{t('v2.slset.custom', 'Custom')}</option>
                {(status?.qualityPresets ?? []).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">{t('v2.slset.material', 'Material')}</span>
              <select className="input" value={(value.material as string) ?? 'PLA'} onChange={(e) => applyMaterial(e.target.value)}>
                {Object.keys(MATERIALS).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <Num label={t('v2.slset.nozzle', 'Nozzle temp')} k="nozzle_temp" v={value} onChange={set} step={1} unit="°C" />
            <Num label={t('v2.slset.bed', 'Bed temp')} k="bed_temp" v={value} onChange={set} step={1} unit="°C" />
          </div>

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
            <label className="chk" style={{ alignSelf: 'end' }} title={t('v2.slset.ironing_hint', 'Smooth the top surface with a fine low-flow pass')}><input type="checkbox" checked={!!value.ironing} onChange={(e) => setBool('ironing', e.target.checked)} /> {t('v2.slset.ironing', 'Ironing')}</label>
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
