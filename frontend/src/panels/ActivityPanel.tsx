import { useMemo } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { BarChart } from '../components/BarChart';
import { activityTotals } from '../insights';
import type { ActivityDay } from '../types';

export function ActivityPanel() {
  const t = useT();
  const { data } = useResource<ActivityDay[]>(api.listActivity, 30000);

  const days = useMemo(() => [...(data ?? [])].sort((a, b) => (a.day < b.day ? -1 : 1)), [data]);
  const totals = useMemo(() => activityTotals(days), [days]);
  const chart = days.slice(-30).map((d) => ({ label: d.day.slice(5), value: d.prints || 0, hint: `${d.day}: ${d.prints || 0} prints, ${(d.hours || 0).toFixed(1)} h` }));

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.activity.title', 'Activity')}</h2>
          <p className="muted sub">{t('v2.activity.subtitle', 'Print activity over time')}</p>
        </div>
      </div>

      <div className="kpis">
        <Kpi label={t('v2.activity.active_days', 'Active days')} value={String(totals.days)} accent="teal" />
        <Kpi label={t('v2.activity.prints', 'Prints')} value={String(totals.prints)} />
        <Kpi label={t('v2.activity.hours', 'Print hours')} value={totals.hours.toFixed(0)} />
        <Kpi label={t('v2.activity.filament', 'Filament')} value={`${(totals.filament_g / 1000).toFixed(1)} kg`} />
      </div>

      <section className="card">
        <div className="card-title">{t('v2.activity.per_day', 'Prints per day (last 30)')}</div>
        <BarChart data={chart} />
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: 'teal' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}</div>
    </div>
  );
}
