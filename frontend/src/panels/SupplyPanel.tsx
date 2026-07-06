import { useMemo } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { runwayDays, byRunway } from '../supply';
import type { ReorderRow, Predictions } from '../types';

export function SupplyPanel() {
  const t = useT();
  const { data: reorder } = useResource<ReorderRow[]>(api.getReorder, 30000);
  const { data: pred } = useResource<Predictions>(api.getPredictions, 30000);

  const rows = reorder ?? [];
  const forecast = useMemo(() => [...(pred?.by_material ?? [])].sort(byRunway), [pred]);
  const belowTarget = rows.filter((r) => r.below_target).length;
  const soonest = forecast.map(runwayDays).filter((d): d is number => d != null)[0];

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.supply.title', 'Supply')}</h2>
          <p className="muted sub">
            {belowTarget} {t('v2.supply.below_target', 'below target')}
            {soonest != null ? ` · ${t('v2.supply.soonest', 'soonest runout')} ${soonest} ${t('v2.supply.days', 'days')}` : ''}
          </p>
        </div>
      </div>

      <section className="card">
        <div className="card-title">{t('v2.supply.reorder', 'Reorder — what to buy')}</div>
        {rows.length === 0 ? (
          <p className="muted empty-note">{t('v2.supply.no_reorder', 'Nothing to reorder.')}</p>
        ) : (
          <div className="sup-list">
            <div className="sup-head">
              <span>{t('v2.supply.material', 'Material')}</span>
              <span>{t('v2.supply.on_hand', 'On hand')}</span>
              <span>{t('v2.supply.target', 'Target')}</span>
              <span>{t('v2.supply.shortfall', 'Shortfall')}</span>
              <span>{t('v2.supply.buy', 'Buy')}</span>
            </div>
            {rows.map((r) => (
              <div className={`sup-row${r.below_target ? ' sup-row--low' : ''}`} key={r.material}>
                <span className="sup-mat">{r.material}{r.below_target && <span className="badge badge--low">{t('v2.supply.low', 'low')}</span>}</span>
                <span className="tnum">{(r.on_hand_g / 1000).toFixed(2)} kg</span>
                <span className="tnum muted">{r.target_g ? `${(r.target_g / 1000).toFixed(2)} kg` : '—'}</span>
                <span className="tnum">{r.shortfall_g > 0 ? `${(r.shortfall_g / 1000).toFixed(2)} kg` : '—'}</span>
                <span className="tnum">{r.suggested_spools > 0 ? `${r.suggested_spools} ${t('v2.supply.spools', 'spools')}` : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-title">{t('v2.supply.forecast', 'Consumption forecast')}</div>
        {forecast.length === 0 ? (
          <p className="muted empty-note">{t('v2.supply.no_forecast', 'Not enough usage data yet.')}</p>
        ) : (
          <div className="fc-list">
            {forecast.map((m) => {
              const days = runwayDays(m);
              const cap = 60; // bar scale: 60 days = full
              const pct = days == null ? 0 : Math.max(4, Math.min(100, Math.round((days / cap) * 100)));
              const low = days != null && days < 14;
              return (
                <div className="fc-row" key={m.material}>
                  <span className="fc-mat">{m.material}</span>
                  <span className="fc-bar"><span className={`fc-fill${low ? ' fc-fill--low' : ''}`} style={{ width: `${pct}%` }} /></span>
                  <span className="fc-days tnum">{days == null ? t('v2.supply.no_use', 'no recent use') : `${days} ${t('v2.supply.days', 'days')}`}</span>
                  <span className="fc-rate muted tnum">{m.avg_daily_g ? `${Math.round(m.avg_daily_g)} g/${t('v2.supply.day', 'day')}` : ''}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
