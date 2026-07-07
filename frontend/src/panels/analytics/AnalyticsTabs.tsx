import { useMemo } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { BarChart } from '../../components/BarChart';
import type { FilByPrinter, FilWeekly, FilCostRow, MaterialEfficiency } from '../../types';

export function ConsumptionTab() {
  const t = useT();
  const { data: byPrinter } = useResource<FilByPrinter[]>(api.getFilConsumptionByPrinter, 0);
  const { data: weekly } = useResource<FilWeekly[]>(api.getFilWeeklyTrend, 0);
  const rows = byPrinter ?? [];
  const weeks = useMemo(() => {
    const m: Record<string, number> = {};
    (weekly ?? []).forEach((w) => { m[w.week] = (m[w.week] || 0) + (w.used_g || 0); });
    return Object.entries(m).sort(([a], [b]) => (a < b ? -1 : 1)).map(([week, g]) => ({ label: week.slice(5), value: Math.round(g), hint: `${week}: ${Math.round(g)} g` }));
  }, [weekly]);

  return (
    <div style={{ marginTop: 16 }}>
      <section className="card">
        <div className="card-title">{t('v2.an.weekly', 'Weekly filament use')}</div>
        <BarChart data={weeks} unit=" g" />
      </section>
      <section className="card">
        <div className="card-title">{t('v2.an.by_printer', 'By printer')}</div>
        {rows.length === 0 ? <p className="muted empty-note">{t('v2.an.no_data', 'No data yet.')}</p> : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: '1.4fr 0.8fr 1fr 0.9fr 0.7fr 0.9fr' }}>
              <span>{t('v2.an.printer', 'Printer')}</span><span>{t('v2.an.material', 'Material')}</span><span className="tnum">{t('v2.an.used', 'Used')}</span><span className="tnum">{t('v2.an.waste', 'Waste')}</span><span className="tnum">{t('v2.an.prints', 'Prints')}</span><span className="tnum">{t('v2.an.per_day', 'Avg/day')}</span>
            </div>
            {rows.map((r, i) => (
              <div className="lib-row" key={i} style={{ gridTemplateColumns: '1.4fr 0.8fr 1fr 0.9fr 0.7fr 0.9fr' }}>
                <span className="lib-name">{r.printer_id}</span>
                <span className="muted">{r.material}</span>
                <span className="tnum">{(r.total_used_g / 1000).toFixed(2)} kg</span>
                <span className="tnum low">{Math.round(r.total_waste_g)} g</span>
                <span className="tnum">{r.total_prints}</span>
                <span className="muted tnum">{Math.round(r.avg_daily_g)} g</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function CostsTab() {
  const t = useT();
  const { data } = useResource<FilCostRow[]>(api.getFilCost, 0);
  const rows = data ?? [];
  const total = rows.reduce((a, r) => a + (r.total_spent || 0), 0);
  return (
    <div style={{ marginTop: 16 }}>
      <section className="card">
        <div className="card-title">{t('v2.an.cost_title', 'Filament cost by material & vendor')} · {Math.round(total)} kr</div>
        {rows.length === 0 ? <p className="muted empty-note">{t('v2.an.no_data', 'No data yet.')}</p> : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: '0.8fr 1.2fr 0.6fr 1fr 1.2fr 1fr' }}>
              <span>{t('v2.an.material', 'Material')}</span><span>{t('v2.an.vendor', 'Vendor')}</span><span className="tnum">{t('v2.an.spools', 'Spools')}</span><span className="tnum">{t('v2.an.avg_g', 'kr/kg avg')}</span><span className="tnum">{t('v2.an.range', 'kr/kg range')}</span><span className="tnum">{t('v2.an.spent', 'Spent')}</span>
            </div>
            {rows.map((r, i) => (
              <div className="lib-row" key={i} style={{ gridTemplateColumns: '0.8fr 1.2fr 0.6fr 1fr 1.2fr 1fr' }}>
                <span className="lib-name">{r.material}</span>
                <span className="muted ellipsis">{r.vendor || '—'}</span>
                <span className="tnum">{r.spool_count}</span>
                <span className="tnum">{(r.avg_cost_per_g * 1000).toFixed(0)}</span>
                <span className="muted tnum">{(r.min_cost_per_g * 1000).toFixed(0)}–{(r.max_cost_per_g * 1000).toFixed(0)}</span>
                <span className="tnum">{Math.round(r.total_spent)} kr</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function EfficiencyTab() {
  const t = useT();
  const { data } = useResource<MaterialEfficiency[]>(api.getMaterialEfficiency, 0);
  const rows = data ?? [];
  return (
    <div style={{ marginTop: 16 }}>
      <section className="card">
        <div className="card-title">{t('v2.an.eff_title', 'Material efficiency')}</div>
        {rows.length === 0 ? <p className="muted empty-note">{t('v2.an.no_data', 'No data yet.')}</p> : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: '0.9fr 1.1fr 0.7fr 1fr 1fr 1fr 0.9fr' }}>
              <span>{t('v2.an.material', 'Material')}</span><span>{t('v2.an.brand', 'Brand')}</span><span className="tnum">{t('v2.an.prints', 'Prints')}</span><span className="tnum">{t('v2.an.g_print', 'g/print')}</span><span className="tnum">{t('v2.an.g_hour', 'g/hour')}</span><span className="tnum">{t('v2.an.min_print', 'min/print')}</span><span className="tnum">{t('v2.an.success', 'Success')}</span>
            </div>
            {rows.map((r, i) => (
              <div className="lib-row" key={i} style={{ gridTemplateColumns: '0.9fr 1.1fr 0.7fr 1fr 1fr 1fr 0.9fr' }}>
                <span className="lib-name">{r.material}</span>
                <span className="muted ellipsis">{r.brand || '—'}</span>
                <span className="tnum">{r.print_count}</span>
                <span className="tnum">{Math.round(r.avg_g_per_print)}</span>
                <span className="tnum">{Math.round(r.g_per_hour)}</span>
                <span className="muted tnum">{Math.round(r.avg_print_minutes)}</span>
                <span className={`tnum ${r.success_rate >= 90 ? '' : 'low'}`}>{Math.round(r.success_rate)}%</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
