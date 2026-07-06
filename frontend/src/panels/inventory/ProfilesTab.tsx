import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { FilamentProfile } from '../../types';

function hex(c?: string | null) {
  const h = (c || '').replace(/^#/, '');
  return h ? `#${h}` : '#666';
}

export function ProfilesTab() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<FilamentProfile[]>(api.listFilaments, 0);
  const [q, setQ] = useState('');
  const [material, setMaterial] = useState('all');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', material: 'PLA', color_name: '', color_hex: '#00b3a4' });

  const CAP = 500;
  const all = data ?? [];
  const materials = useMemo(() => ['all', ...Array.from(new Set(all.map((p) => p.material).filter(Boolean))).sort()], [all]);
  const matched = useMemo(() => {
    const s = q.trim().toLowerCase();
    return all
      .filter((p) => (material === 'all' || p.material === material))
      .filter((p) => !s || (p.name || '').toLowerCase().includes(s) || (p.color_name || '').toLowerCase().includes(s));
  }, [all, q, material]);
  const shown = matched.slice(0, CAP);

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function add() {
    if (!form.name.trim()) return;
    await run(async () => {
      await api.addFilament({ name: form.name.trim(), material: form.material, color_name: form.color_name.trim() || undefined, color_hex: form.color_hex.replace(/^#/, '') });
      setAdding(false); setForm({ name: '', material: 'PLA', color_name: '', color_hex: '#00b3a4' }); reload();
    }, t('v2.inv.profile_added', 'Profile added'));
  }
  async function remove(p: FilamentProfile) {
    if (!confirm(t('v2.inv.profile_confirm', `Delete profile "${p.name}"?`))) return;
    await run(async () => { await api.deleteFilament(p.id); reload(); }, t('v2.inv.profile_removed', 'Profile removed'));
  }

  return (
    <div>
      <div className="tab-toolbar">
        <div className="tab-toolbar" style={{ margin: 0, gap: 8 }}>
          <input className="input" style={{ maxWidth: 220 }} placeholder={t('v2.inv.search_profiles', 'Search filaments…')} value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" style={{ width: 'auto' }} value={material} onChange={(e) => setMaterial(e.target.value)}>
            {materials.map((m) => <option key={m} value={m}>{m === 'all' ? t('v2.inventory.all_materials', 'All materials') : m}</option>)}
          </select>
          <span className="muted">{matched.length === all.length ? all.length : `${matched.length}/${all.length}`}{matched.length > CAP ? ` · ${t('v2.inv.refine', 'refine to see all')}` : ''}</span>
        </div>
        <button className="btn btn--sm btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.inv.add_profile', '+ Add profile')}</button>
      </div>

      {adding && (
        <section className="card">
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.inv.name', 'Name')}</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bambu PLA Basic" /></label>
            <label className="field"><span className="field-label">{t('v2.inv.material', 'Material')}</span>
              <select className="input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}>{['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PC', 'PA'].map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
            <label className="field grow"><span className="field-label">{t('v2.inv.color', 'Colour')}</span><input className="input" value={form.color_name} onChange={(e) => setForm({ ...form, color_name: e.target.value })} placeholder="Matte Black" /></label>
            <label className="field"><span className="field-label">Hex</span><input className="input" type="color" value={form.color_hex} onChange={(e) => setForm({ ...form, color_hex: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={add}>{t('v2.inv.add_btn', 'Add')}</button>
          </div>
        </section>
      )}

      <section className="card">
        <div className="lib-list">
          <div className="lib-head" style={{ gridTemplateColumns: 'auto 2fr 0.8fr 1.2fr 0.9fr auto' }}>
            <span></span><span>{t('v2.inv.profile', 'Profile')}</span><span>{t('v2.inv.material', 'Material')}</span><span>{t('v2.inv.color', 'Colour')}</span><span>{t('v2.inv.temp', 'Nozzle')}</span><span></span>
          </div>
          {shown.map((p) => (
            <div className="lib-row" key={p.id} style={{ gridTemplateColumns: 'auto 2fr 0.8fr 1.2fr 0.9fr auto' }}>
              <span className={`swatch swatch--sm${p.color_hex ? '' : ' swatch--empty'}`} style={p.color_hex ? { background: hex(p.color_hex) } : undefined} />
              <span className="lib-name ellipsis" title={p.name}>{p.name}</span>
              <span className="muted">{p.material}</span>
              <span className="muted ellipsis">{p.color_name || '—'}</span>
              <span className="muted tnum">{p.nozzle_temp_min && p.nozzle_temp_max ? `${p.nozzle_temp_min}–${p.nozzle_temp_max}°` : '—'}</span>
              <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => remove(p)}>✕</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
