import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { earnedCount, achPct } from '../insights';
import type { Achievement } from '../types';

export function AchievementsPanel() {
  const t = useT();
  const { data } = useResource<Achievement[]>(api.listAchievements, 0);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const all = data ?? [];
  const earned = earnedCount(all);
  const shown = useMemo(() => {
    if (filter === 'earned') return all.filter((a) => a.earned);
    if (filter === 'locked') return all.filter((a) => !a.earned);
    return all;
  }, [all, filter]);

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.ach.title', 'Achievements')}</h2>
          <p className="muted sub">{earned}/{all.length} {t('v2.ach.unlocked', 'unlocked')}</p>
        </div>
        <div className="seg">
          {(['all', 'earned', 'locked'] as const).map((f) => (
            <button key={f} className={`seg-btn${filter === f ? ' seg-btn--on' : ''}`} onClick={() => setFilter(f)}>{t(`v2.ach.${f}`, f)}</button>
          ))}
        </div>
      </div>

      <div className="ach-grid">
        {shown.map((a) => {
          const pct = achPct(a);
          return (
            <div className={`ach-card${a.earned ? ' ach-card--earned' : ''}`} key={a.id}>
              <div className="ach-top">
                <span className="ach-title">{a.title}</span>
                <span className={`ach-state ach-state--${a.earned ? 'on' : 'off'}`}>{a.earned ? t('v2.ach.done', 'earned') : `${pct}%`}</span>
              </div>
              <div className="ach-desc muted">{a.desc}</div>
              <div className="spool-bar"><div className="spool-fill" style={{ width: `${a.earned ? 100 : pct}%` }} /></div>
              <div className="ach-foot faint">{Math.min(a.current, a.target)}/{a.target}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
