import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import type { HardwareItem } from '../types';

function compatList(v?: string | null): string {
  if (!v) return '';
  try { const a = JSON.parse(v); return Array.isArray(a) ? a.join(', ') : String(v); } catch { return String(v); }
}

export function HardwarePanel() {
  const t = useT();
  const { data } = useResource<HardwareItem[]>(api.listHardware, 30000);
  const items = data ?? [];

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.hw.title', 'Hardware')}</h2>
          <p className="muted sub">{items.length} {t('v2.hw.items', 'accessories & parts')}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <section className="card"><p className="muted empty-note">{t('v2.hw.none', 'No hardware tracked yet.')}</p></section>
      ) : (
        <div className="tile-grid">
          {items.map((h) => (
            <div className="tile" key={h.id}>
              <div className="tile-top">
                <span className="tile-tag">{h.category}</span>
                {h.rating != null && <span className="muted tnum">★ {h.rating}</span>}
              </div>
              <div className="tile-name">{h.name}</div>
              <div className="tile-meta">{[h.brand, h.model].filter(Boolean).join(' ') || '—'}</div>
              {compatList(h.compatible_printers) && <div className="tile-foot muted ellipsis">{t('v2.hw.for', 'For')}: {compatList(h.compatible_printers)}</div>}
              {h.purchase_price != null && <div className="tile-foot"><span className="muted">{Math.round(h.purchase_price)} kr</span></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
