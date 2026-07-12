import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { StockItem, StorageLocation } from '../../types';

export function StockTab() {
  const t = useT();
  const toast = useToast();
  const { data: stockData, reload } = useResource<StockItem[]>(api.listStockItems, 0);
  const { data: locData } = useResource<StorageLocation[]>(api.listLocations, 0);
  const stock = useMemo(() => stockData ?? [], [stockData]);
  const locs = locData ?? [];
  const [locFilter, setLocFilter] = useState('');
  const [q, setQ] = useState('');

  const filtered = stock.filter((s) => {
    if (locFilter && String(s.location_id ?? '') !== locFilter) return false;
    if (q && !(s.part_name ?? '').toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  async function adjust(s: StockItem, delta: number) {
    try { await api.adjustStock(s.id, delta, delta > 0 ? 'manual add' : 'manual remove'); reload(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  const totalUnits = filtered.reduce((a, s) => a + (s.quantity || 0), 0);

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 12 }}>
        <p className="muted sub" style={{ margin: 0 }}>{filtered.length} {t('v2.stock.entries', 'stock entries')} · {totalUnits} {t('v2.stock.units', 'units')}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input className="input" placeholder={t('v2.stock.search', 'Search part…')} value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 240 }} />
        <select className="input" value={locFilter} onChange={(e) => setLocFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">{t('v2.stock.all_locations', 'All locations')}</option>
          {locs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <section className="card">
        {filtered.length === 0 ? (
          <p className="muted empty-note">{stock.length === 0 ? t('v2.stock.empty', 'No stock yet. Add stock to a part in the Parts tab.') : t('v2.stock.no_match', 'No stock matches the filters.')}</p>
        ) : (
          <div className="err-list">
            {filtered.map((s) => (
              <div className="err-row" key={s.id} style={{ gridTemplateColumns: '1.6fr 1fr auto auto auto' }}>
                <span className="err-msg" style={{ fontWeight: 600 }}>{s.part_name || `#${s.part_id}`}</span>
                <span className="muted">{s.location_name || t('v2.parts.no_location', 'No location')}</span>
                <span className="tnum" style={{ fontWeight: 600 }}>{s.quantity} {s.part_unit || ''}</span>
                {s.status !== 'ok' ? <span className="hs-badge hs-badge-warn">{s.status}</span> : <span />}
                <span style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn--sm btn--ghost" onClick={() => adjust(s, -1)}>−</button>
                  <button className="btn btn--sm btn--ghost" onClick={() => adjust(s, 1)}>+</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
