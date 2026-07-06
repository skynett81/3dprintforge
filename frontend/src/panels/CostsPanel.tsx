import { useMemo } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { costBreakdown, avgPerPrint } from '../costs';
import type { CostSummary, CostRow } from '../types';

function money(v: number, cur = 'kr') { return `${Math.round(v)} ${cur}`; }
function when(iso: string) {
  const d = new Date((iso || '').replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function CostsPanel() {
  const t = useT();
  const { data: summary, error } = useResource<CostSummary>(api.getCostSummary, 30000);
  const { data: report } = useResource<CostRow[]>(api.getCostReport, 30000);

  const breakdown = useMemo(() => (summary ? costBreakdown(summary) : []), [summary]);
  const max = Math.max(1, ...breakdown.map((b) => b.value));
  const recent = useMemo(
    () => [...(report ?? [])].sort((a, b) => (a.calculated_at < b.calculated_at ? 1 : -1)).slice(0, 20),
    [report],
  );

  const label: Record<string, string> = {
    filament: t('v2.costs.filament', 'Filament'),
    electricity: t('v2.costs.electricity', 'Electricity'),
    depreciation: t('v2.costs.depreciation', 'Depreciation'),
    labor: t('v2.costs.labor', 'Labor'),
    markup: t('v2.costs.markup', 'Markup'),
  };

  if (error) return <div className="error">{error}</div>;
  if (!summary) return <p className="muted">{t('common.loading', 'Loading…')}</p>;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.costs.title', 'Costs')}</h2>
          <p className="muted sub">{t('v2.costs.subtitle', 'Unit economics across your prints')}</p>
        </div>
      </div>

      <div className="kpis">
        <Kpi label={t('v2.costs.grand_total', 'Total')} value={money(summary.grand_total)} accent="teal" />
        <Kpi label={t('v2.costs.prints', 'Prints costed')} value={String(summary.print_count)} />
        <Kpi label={t('v2.costs.avg', 'Avg / print')} value={money(avgPerPrint(summary))} />
        <Kpi label={t('v2.costs.filament', 'Filament')} value={money(summary.total_filament)} />
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-title">{t('v2.costs.breakdown', 'Cost breakdown')}</div>
          <div className="breakdown">
            {breakdown.map((b) => (
              <div className="bd-row" key={b.key}>
                <span className="bd-label">{label[b.key] || b.key}</span>
                <span className="bd-track"><span className="bd-fill" style={{ width: `${(b.value / max) * 100}%` }} /></span>
                <span className="bd-val">{money(b.value)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-title">{t('v2.costs.recent', 'Recent print costs')}</div>
          {recent.length === 0 ? (
            <p className="muted empty-note">{t('v2.costs.none', 'No costed prints yet.')}</p>
          ) : (
            <div className="cost-list">
              {recent.map((r) => (
                <div className="cost-row" key={r.id}>
                  <span className="muted">#{r.print_history_id}</span>
                  <span className="muted tnum">{when(r.calculated_at)}</span>
                  <span className="cost-total tnum">{money(r.total_cost, r.currency || 'kr')}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
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
