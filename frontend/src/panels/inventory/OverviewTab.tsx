import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { spoolPct, isLow, materialShare } from '../../inventory';
import type { InventoryStats, Spool } from '../../types';

const MAT_COLORS: Record<string, string> = { PLA: '#00b3a4', PETG: '#3b82f6', ABS: '#f59e0b', ASA: '#ef4444', TPU: '#a855f7', PC: '#64748b', PA: '#ec4899' };
function matColor(m: string) { return MAT_COLORS[m] || '#00b3a4'; }
function hex(s: Spool) { const h = (s.color_hex || '').replace(/^#/, ''); return h ? `#${h}` : '#666'; }

export function OverviewTab({ onPickSpool }: { onPickSpool?: (id: number) => void }) {
  const t = useT();
  const { data: stats } = useResource<InventoryStats>(api.getInventoryStats, 30000);
  const { data: spoolData } = useResource<Spool[]>(api.listSpools, 30000);

  const spools = (spoolData ?? []).filter((s) => !s.archived);
  const low = spools.filter((s) => isLow(s)).sort((a, b) => spoolPct(a) - spoolPct(b));
  const mats = stats ? materialShare(stats.by_material) : [];
  const vendors = (stats?.by_vendor ?? []).filter((v) => v.count > 0);

  const kg = stats ? (stats.total_remaining_g / 1000).toFixed(1) : '—';
  const usedKg = stats ? (stats.total_used_g / 1000).toFixed(1) : '—';

  return (
    <div style={{ marginTop: 16 }}>
      <div className="kpis">
        <Kpi label={t('v2.inv.ov_spools', 'Spools')} value={stats ? String(stats.total_spools) : '—'} accent="teal" />
        <Kpi label={t('v2.inv.ov_onhand', 'On hand')} value={`${kg} kg`} />
        <Kpi label={t('v2.inv.ov_value', 'Stock value')} value={stats ? `${Math.round(stats.total_cost)} kr` : '—'} />
        <Kpi label={t('v2.inv.ov_low', 'Running low')} value={String(low.length)} accent={low.length ? 'warn' : undefined} />
        <Kpi label={t('v2.inv.ov_used', 'Consumed')} value={`${usedKg} kg`} />
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-title">{t('v2.inv.ov_by_material', 'Stock by material')}</div>
          {mats.length === 0 ? <p className="muted empty-note">{t('common.loading', 'Loading…')}</p> : (
            <div className="mat-bars">
              {mats.sort((a, b) => b.remaining_g - a.remaining_g).map((m) => (
                <div className="mat-row" key={m.material}>
                  <span className="mat-name"><span className="mat-dot" style={{ background: matColor(m.material) }} />{m.material}</span>
                  <div className="mat-track"><div className="mat-fill" style={{ width: `${m.pct}%`, background: matColor(m.material) }} /></div>
                  <span className="muted tnum mat-val">{(m.remaining_g / 1000).toFixed(1)} kg · {m.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-title">{t('v2.inv.ov_by_vendor', 'Stock by vendor')}</div>
          {vendors.length === 0 ? <p className="muted empty-note">{t('common.loading', 'Loading…')}</p> : (
            <div className="lib-list">
              {vendors.sort((a, b) => b.remaining_g - a.remaining_g).map((v, i) => (
                <div className="lib-row" key={i} style={{ gridTemplateColumns: '1.6fr 0.6fr 0.8fr 0.8fr' }}>
                  <span className="lib-name">{v.vendor || t('v2.inventory.unknown_vendor', 'Unknown vendor')}</span>
                  <span className="muted tnum">{v.count}</span>
                  <span className="muted tnum">{(v.remaining_g / 1000).toFixed(1)} kg</span>
                  <span className="tnum">{Math.round(v.total_cost || 0)} kr</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-title">{t('v2.inv.ov_attention', 'Needs attention')}</div>
        {low.length === 0 ? (
          <p className="muted empty-note">{t('v2.inv.ov_all_good', 'All spools are well stocked.')}</p>
        ) : (
          <div className="lib-list">
            {low.map((s) => (
              <button className="lib-row lib-row--btn" key={s.id} style={{ gridTemplateColumns: 'auto 2fr 0.8fr 1fr 0.6fr' }} onClick={() => onPickSpool?.(s.id)}>
                <span className="swatch swatch--sm" style={{ background: hex(s) }} />
                <span className="lib-name ellipsis">{s.profile_name || s.color_name || `Spool #${s.id}`}</span>
                <span className="muted">{s.material || ''}</span>
                <span className="muted ellipsis">{s.location || '—'}</span>
                <span className="low tnum">{Math.round(s.remaining_weight_g)} g · {spoolPct(s)}%</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: 'teal' | 'warn' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}</div>
    </div>
  );
}
