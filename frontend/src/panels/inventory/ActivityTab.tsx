import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import type { StockMovement } from '../../types';

function when(iso: string) {
  const d = new Date((iso || '').replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function hex(c?: string | null) {
  const h = (c || '').replace(/^#/, '');
  return h ? `#${h}` : '#666';
}

export function StockActivityTab() {
  const t = useT();
  const { data } = useResource<StockMovement[]>(api.getStockActivity, 15000);
  const rows = data ?? [];

  return (
    <section className="card">
      {rows.length === 0 ? (
        <p className="muted empty-note">{t('v2.inv.no_activity', 'No stock movements yet.')}</p>
      ) : (
        <div className="lib-list">
          <div className="lib-head" style={{ gridTemplateColumns: 'auto 1.8fr 1fr 0.8fr 1fr' }}>
            <span></span><span>{t('v2.inv.spool', 'Spool')}</span><span>{t('v2.inv.type', 'Type')}</span><span>{t('v2.inv.change', 'Change')}</span><span>{t('v2.inv.date', 'When')}</span>
          </div>
          {rows.map((m, i) => (
            <div className="lib-row" key={i} style={{ gridTemplateColumns: 'auto 1.8fr 1fr 0.8fr 1fr' }}>
              <span className="swatch swatch--sm" style={{ background: hex(m.spool_color) }} />
              <span className="lib-name ellipsis" title={m.spool_label || ''}>{m.spool_label || `#${m.ref_id ?? ''}`}</span>
              <span className="muted">{m.reason || m.type}</span>
              <span className={`tnum ${m.delta_g < 0 ? 'low' : ''}`}>{m.delta_g > 0 ? '+' : ''}{Math.round(m.delta_g)} g</span>
              <span className="muted tnum">{when(m.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
