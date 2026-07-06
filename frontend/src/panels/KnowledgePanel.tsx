import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import type { KbPrinter } from '../types';

export function KnowledgePanel() {
  const t = useT();
  const { data } = useResource<KbPrinter[]>(api.listKbPrinters, 0);
  const [q, setQ] = useState('');

  const all = data ?? [];
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s ? all.filter((p) => (p.full_name || p.model).toLowerCase().includes(s)) : all;
    return [...list].sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
  }, [all, q]);

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.kb.title', 'Knowledge base')}</h2>
          <p className="muted sub">{all.length} {t('v2.kb.printers', 'printers')}</p>
        </div>
        <input className="input" style={{ width: 'auto', minWidth: 200 }} placeholder={t('v2.kb.search', 'Search printers…')} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="tile-grid">
        {shown.map((p) => (
          <div className="tile" key={p.id}>
            <div className="tile-top">
              <span className="tile-tag">{p.release_year || ''}</span>
              {p.price_usd != null && <span className="muted tnum">${p.price_usd}</span>}
            </div>
            <div className="tile-name">{p.full_name || p.model}</div>
            <div className="tile-meta">{p.build_volume || '—'}{p.max_speed ? ` · ${p.max_speed} mm/s` : ''}</div>
            <div className="kb-tags">
              {p.has_ams ? <span className="flag">AMS</span> : null}
              {p.has_enclosure ? <span className="flag">{t('v2.kb.enclosed', 'enclosed')}</span> : null}
              {p.has_camera ? <span className="flag">{t('v2.kb.camera', 'camera')}</span> : null}
            </div>
            {p.wiki_url && <a className="tile-foot classic-link" href={p.wiki_url} target="_blank" rel="noreferrer">{t('v2.kb.wiki', 'Wiki →')}</a>}
          </div>
        ))}
        {shown.length === 0 && <p className="muted">{t('v2.kb.no_match', 'No printers match.')}</p>}
      </div>
    </div>
  );
}
