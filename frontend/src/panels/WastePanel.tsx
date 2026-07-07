import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { BarChart } from '../components/BarChart';
import { wasteBreakdown } from '../waste';
import type { WasteStats, WasteEvent } from '../types';

function when(iso: string) {
  const d = new Date((iso || '').replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

type Tab = 'overview' | 'events';
const TABS: Tab[] = ['overview', 'events'];

export function WastePanel({ sub, onNav }: { sub?: string | null; onNav?: (slug: string) => void } = {}) {
  const t = useT();
  const { data: stats, error } = useResource<WasteStats>(api.getWasteStats, 30000);
  const { data: history } = useResource<WasteEvent[]>(api.getWasteHistory, 30000);
  const [localTab, setLocalTab] = useState<Tab>('overview');
  const tab: Tab = onNav ? ((sub && (TABS as string[]).includes(sub) ? sub : 'overview') as Tab) : localTab;
  const setTab = (id: Tab) => { if (onNav) onNav(id); else setLocalTab(id); };

  const breakdown = useMemo(() => (stats ? wasteBreakdown(stats.waste_breakdown) : []), [stats]);
  const maxB = Math.max(1, ...breakdown.map((b) => b.value));
  const perDay = useMemo(
    () => (stats?.waste_per_day ?? []).slice(-14).map((d) => ({ label: d.day.slice(5), value: Math.round(d.total), hint: `${d.day}: ${Math.round(d.total)} g` })),
    [stats],
  );

  const label: Record<string, string> = {
    color_change: t('v2.waste.color_change', 'Colour changes'),
    failed: t('v2.waste.failed', 'Failed prints'),
    purge: t('v2.waste.purge', 'Purge'),
    manual: t('v2.waste.manual', 'Manual'),
  };

  if (error) return <div className="error">{error}</div>;
  if (!stats) return <p className="muted">{t('common.loading', 'Loading…')}</p>;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.waste.title', 'Waste')}</h2>
          <p className="muted sub">{t('v2.waste.subtitle', 'Filament wasted to purge, colour changes and failures')}</p>
        </div>
        <div className="seg">
          {([['overview', t('v2.waste.tab_overview', 'Overview')], ['events', t('v2.waste.tab_events', 'Events')]] as [Tab, string][]).map(([id, lb]) => (
            <button key={id} className={`seg-btn${tab === id ? ' seg-btn--on' : ''}`} onClick={() => setTab(id)}>{lb}</button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (<>
        <div className="kpis">
          <Kpi label={t('v2.waste.total', 'Total waste')} value={`${Math.round(stats.total_waste_g)} g`} accent="blue" />
          <Kpi label={t('v2.waste.cost', 'Waste cost')} value={`${Math.round(stats.total_cost)} kr`} />
          <Kpi label={t('v2.waste.avg', 'Avg / print')} value={`${stats.avg_per_print.toFixed(1)} g`} />
          <Kpi label={t('v2.waste.affected', 'Prints with waste')} value={`${stats.prints_with_waste}/${stats.total_prints}`} />
        </div>

        <section className="card">
          <div className="card-title">{t('v2.waste.breakdown', 'Where waste comes from')}</div>
          <div className="breakdown">
            {breakdown.map((b) => (
              <div className="bd-row" key={b.key}>
                <span className="bd-label">{label[b.key] || b.key}</span>
                <span className="bd-track"><span className="bd-fill" style={{ width: `${(b.value / maxB) * 100}%` }} /></span>
                <span className="bd-val">{Math.round(b.value)} g</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-title">{t('v2.waste.per_day', 'Waste per day (g)')}</div>
          <BarChart data={perDay} />
        </section>
      </>)}

      {tab === 'events' && (
        <section className="card">
          <div className="card-title">{t('v2.waste.recent', 'Recent waste events')}</div>
          {(history ?? []).length === 0 ? (
            <p className="muted empty-note">{t('v2.waste.none', 'No waste events yet.')}</p>
          ) : (
            <div className="cost-list">
              {(history ?? []).map((w) => (
                <div className="cost-row" key={w.id}>
                  <span className="muted">{w.printer_id} · {w.reason || '—'}</span>
                  <span className="muted tnum">{when(w.timestamp)}</span>
                  <span className="cost-total tnum">{Math.round(w.waste_g)} g</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: 'blue' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}</div>
    </div>
  );
}
