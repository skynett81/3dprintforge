import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import type { FilamentProfile } from '../../types';

function hex(c?: string | null) {
  const h = (c || '').replace(/^#/, '');
  return h ? `#${h}` : '#666';
}

export function ProfilesTab() {
  const t = useT();
  const { data } = useResource<FilamentProfile[]>(api.listFilaments, 0);
  const [q, setQ] = useState('');
  const [material, setMaterial] = useState('all');

  const all = data ?? [];
  const materials = useMemo(
    () => ['all', ...Array.from(new Set(all.map((p) => p.material).filter(Boolean))).sort()],
    [all],
  );
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return all
      .filter((p) => (material === 'all' || p.material === material))
      .filter((p) => !s || (p.name || '').toLowerCase().includes(s) || (p.color_name || '').toLowerCase().includes(s))
      .slice(0, 200);
  }, [all, q, material]);

  return (
    <div>
      <div className="tab-toolbar">
        <input className="input" style={{ maxWidth: 260 }} placeholder={t('v2.inv.search_profiles', 'Search filaments…')} value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ width: 'auto' }} value={material} onChange={(e) => setMaterial(e.target.value)}>
          {materials.map((m) => <option key={m} value={m}>{m === 'all' ? t('v2.inventory.all_materials', 'All materials') : m}</option>)}
        </select>
        <span className="muted">{shown.length} / {all.length}</span>
      </div>
      <section className="card">
        <div className="lib-list">
          <div className="lib-head" style={{ gridTemplateColumns: 'auto 2fr 0.8fr 1.2fr 1fr' }}>
            <span></span><span>{t('v2.inv.profile', 'Profile')}</span><span>{t('v2.inv.material', 'Material')}</span><span>{t('v2.inv.color', 'Colour')}</span><span>{t('v2.inv.temp', 'Nozzle')}</span>
          </div>
          {shown.map((p) => (
            <div className="lib-row" key={p.id} style={{ gridTemplateColumns: 'auto 2fr 0.8fr 1.2fr 1fr' }}>
              <span className="swatch swatch--sm" style={{ background: hex(p.color_hex) }} />
              <span className="lib-name ellipsis" title={p.name}>{p.name}</span>
              <span className="muted">{p.material}</span>
              <span className="muted ellipsis">{p.color_name || '—'}</span>
              <span className="muted tnum">{p.nozzle_temp_min && p.nozzle_temp_max ? `${p.nozzle_temp_min}–${p.nozzle_temp_max}°` : '—'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
