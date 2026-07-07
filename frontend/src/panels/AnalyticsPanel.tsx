import { useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { BarChart } from '../components/BarChart';
import { ConsumptionTab, CostsTab, EfficiencyTab } from './analytics/AnalyticsTabs';
import type { Stats } from '../types';

type Tab = 'stats' | 'consumption' | 'costs' | 'efficiency';
const TABS: Tab[] = ['stats', 'consumption', 'costs', 'efficiency'];

export function AnalyticsPanel({ sub, onNav }: { sub?: string | null; onNav?: (slug: string) => void } = {}) {
  const t = useT();
  const { data, error, loading } = useResource<Stats>(api.getStatistics, 15000);
  const [localTab, setLocalTab] = useState<Tab>('stats');
  const tab: Tab = onNav ? ((sub && (TABS as string[]).includes(sub) ? sub : 'stats') as Tab) : localTab;
  const setTab = (id: Tab) => { if (onNav) onNav(id); else setLocalTab(id); };

  const months = (data?.monthly_trends ?? []).map((m) => ({
    label: m.month.slice(5),
    value: m.total,
    hint: `${m.month}: ${m.total} prints, ${Math.round(m.total_filament_g)} g`,
  }));
  const maxFil = Math.max(1, ...(data?.filament_by_type ?? []).map((f) => f.grams));

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.analytics.title', 'Analytics')}</h2>
          <p className="muted sub">{t('v2.analytics.subtitle', 'Print statistics across the fleet')}</p>
        </div>
        <div className="seg">
          {([['stats', t('v2.an.tab_stats', 'Statistics')], ['consumption', t('v2.an.tab_consumption', 'Consumption')], ['costs', t('v2.an.tab_costs', 'Costs')], ['efficiency', t('v2.an.tab_efficiency', 'Efficiency')]] as [Tab, string][]).map(([id, label]) => (
            <button key={id} className={`seg-btn${tab === id ? ' seg-btn--on' : ''}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      {tab === 'consumption' && <ConsumptionTab />}
      {tab === 'costs' && <CostsTab />}
      {tab === 'efficiency' && <EfficiencyTab />}

      {tab === 'stats' && error && <div className="error">{error}</div>}
      {tab === 'stats' && loading && !data && <p className="muted">{t('common.loading', 'Loading…')}</p>}
      {tab === 'stats' && data && (<>
      <div className="kpis kpis--5">
        <Kpi label={t('v2.analytics.total_prints', 'Total prints')} value={String(data.total_prints)} />
        <Kpi label={t('v2.analytics.success_rate', 'Success rate')} value={`${data.success_rate}%`} accent={data.success_rate >= 90 ? 'green' : 'teal'} />
        <Kpi label={t('v2.analytics.print_hours', 'Print hours')} value={data.total_hours.toFixed(0)} />
        <Kpi label={t('v2.analytics.filament', 'Filament')} value={`${(data.total_filament_g / 1000).toFixed(1)} kg`} />
        <Kpi label={t('v2.analytics.est_cost', 'Est. cost')} value={`${Math.round(data.estimated_cost_nok || 0)} kr`} accent="teal" />
      </div>

      <section className="card">
        <div className="card-title">{t('v2.analytics.prints_per_month', 'Prints per month')}</div>
        <BarChart data={months} />
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-title">{t('v2.analytics.filament_by_type', 'Filament by type')}</div>
          <div className="breakdown">
            {data.filament_by_type.map((f) => (
              <div className="bd-row" key={f.type}>
                <span className="bd-label">{f.type}</span>
                <span className="bd-track"><span className="bd-fill" style={{ width: `${(f.grams / maxFil) * 100}%` }} /></span>
                <span className="bd-val">{Math.round(f.grams)} g</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-title">{t('v2.analytics.top_files', 'Top files')}</div>
          <div className="toplist">
            {data.top_files.slice(0, 6).map((f, i) => (
              <div className="top-row" key={i}>
                <span className="top-rank">{i + 1}</span>
                <span className="top-name" title={f.filename}>{f.filename}</span>
                <span className="top-count muted">{f.count}×</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      </>)}
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: 'teal' | 'blue' | 'green' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}{sub && <span className="kpi-sub"> {sub}</span>}</div>
    </div>
  );
}
