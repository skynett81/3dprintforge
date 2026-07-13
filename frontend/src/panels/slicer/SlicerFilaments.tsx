import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import type { Spool } from '../../types';

interface Props {
  spools: Spool[];
  /** Apply a filament's colour + material to the active slot. */
  onApply?: (color: string, material: string) => void;
}

const hex = (h?: string | null) => (h ? (h.startsWith('#') ? h : '#' + String(h).replace(/^#/, '')) : '#cccccc');
function textColor(h: string): string {
  const x = h.replace(/^#/, ''); if (x.length < 6) return '#fff';
  const r = parseInt(x.slice(0, 2), 16), g = parseInt(x.slice(2, 4), 16), b = parseInt(x.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? '#1a1a1a' : '#fff';
}

/** Filament Manager: the spool library grouped by material, like BambuStudio's
 *  Filament Manager. Click a spool to load its colour + material into the
 *  active slicer slot. Read-only over the existing inventory. */
export function SlicerFilaments({ spools, onApply }: Props) {
  const t = useT();
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const active = spools.filter((s) => !s.archived);
    const filtered = needle
      ? active.filter((s) => `${s.profile_name} ${s.material} ${s.color_name} ${s.vendor_name}`.toLowerCase().includes(needle))
      : active;
    const by: Record<string, Spool[]> = {};
    for (const s of filtered) { const m = (s.material || 'Other').toUpperCase(); (by[m] ??= []).push(s); }
    return Object.entries(by).sort((a, b) => b[1].length - a[1].length);
  }, [spools, q]);

  return (
    <div className="oslice-filmgr">
      <div className="oslice-filmgr-head">
        <input className="oset-searchinput" style={{ maxWidth: 320 }} placeholder={t('v2.filmgr.search', 'Search filament…')} value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="muted micro">{spools.filter((s) => !s.archived).length} {t('v2.filmgr.spools', 'spools')}</span>
      </div>
      <div className="oslice-filmgr-body">
        {groups.length === 0 && <p className="muted" style={{ padding: 16 }}>{t('v2.filmgr.none', 'No filament in inventory.')}</p>}
        {groups.map(([mat, list]) => (
          <div key={mat} className="oslice-filmgr-grp">
            <div className="oslice-filmgr-grph">{mat} <span className="muted micro">· {list.length}</span></div>
            <div className="oslice-filmgr-grid">
              {list.map((s) => {
                const c = hex(s.color_hex);
                const pct = s.initial_weight_g > 0 ? Math.max(0, Math.min(100, (s.remaining_weight_g / s.initial_weight_g) * 100)) : 0;
                const perG = s.cost && s.initial_weight_g ? (s.cost / s.initial_weight_g) : 0;
                return (
                  <button key={s.id} className="oslice-filcard" title={t('v2.filmgr.apply', 'Load into active slot')} onClick={() => onApply?.(c, (s.material || 'PLA'))}>
                    <span className="oslice-filcard-sw" style={{ background: c, color: textColor(c) }}>{s.material?.[0] ?? '?'}</span>
                    <span className="oslice-filcard-main">
                      <span className="oslice-filcard-name">{s.color_name || s.profile_name || s.material}</span>
                      <span className="oslice-filcard-sub">{s.vendor_name || ''}{s.vendor_name && s.material ? ' · ' : ''}{s.material}</span>
                      <span className="oslice-filcard-bar"><span className="oslice-filcard-fill" style={{ width: `${pct}%`, background: c }} /></span>
                    </span>
                    <span className="oslice-filcard-meta">
                      <span>{Math.round(s.remaining_weight_g)}g</span>
                      {perG > 0 && <span className="muted">{perG.toFixed(2)} kr/g</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
