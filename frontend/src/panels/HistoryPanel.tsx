import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { filterHistory, type StatusFilter } from '../history-filter';
import { HistoryDetail } from './history/HistoryDetail';
import type { HistoryRow } from '../types';

function dur(s?: number) {
  if (!s) return '—';
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}
function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function statusClass(s: string) {
  const t = s.toLowerCase();
  if (t === 'completed' || t === 'finish') return 'good';
  if (t === 'failed' || t === 'error') return 'bad';
  return 'warn';
}

interface Props { selected?: string | null; onSelect?: (id: string) => void; onBack?: () => void; }

export function HistoryPanel({ selected, onSelect, onBack }: Props = {}) {
  const t = useT();
  const { data, error, loading } = useResource<HistoryRow[]>(api.listHistory, 10000);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [printer, setPrinter] = useState('all');

  const all = data ?? [];

  const detail = selected ? all.find((r) => String(r.id) === selected) : null;
  if (selected && all.length > 0) {
    if (detail) return <HistoryDetail row={detail} onBack={onBack} />;
    return (
      <div>
        <button className="btn btn--sm" onClick={onBack}>← {t('v2.history.title', 'History')}</button>
        <p className="muted empty-note">{t('v2.hist.gone', 'That print is no longer in the history.')}</p>
      </div>
    );
  }
  const printers = useMemo(
    () => ['all', ...Array.from(new Set(all.map((r) => r.printer_id).filter(Boolean))).sort()],
    [all],
  );
  const rows = useMemo(() => filterHistory(all, status, printer), [all, status, printer]);

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.history.title', 'History')}</h2>
          <p className="muted sub">{all.length} {t('v2.history.recent_prints', 'recent prints')}</p>
        </div>
        <div className="hist-filters">
          <select className="input" value={printer} onChange={(e) => setPrinter(e.target.value)}>
            {printers.map((p) => <option key={p} value={p}>{p === 'all' ? t('v2.history.all_printers', 'All printers') : p}</option>)}
          </select>
          <div className="seg">
            {(['all', 'completed', 'failed'] as const).map((f) => (
              <button key={f} className={`seg-btn${status === f ? ' seg-btn--on' : ''}`} onClick={() => setStatus(f)}>{t(`v2.history.${f}`, f)}</button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">{t('common.loading', 'Loading…')}</p>}

      <section className="card">
        <div className="hist-head">
          <span>{t('v2.history.file', 'File')}</span>
          <span>{t('v2.history.printer', 'Printer')}</span>
          <span>{t('v2.history.status', 'Status')}</span>
          <span>{t('v2.history.duration', 'Duration')}</span>
          <span>{t('v2.history.filament', 'Filament')}</span>
          <span>{t('v2.history.date', 'Date')}</span>
        </div>
        {rows.map((r) => (
          <div className="hist-row hist-row--btn" key={r.id} role="button" tabIndex={0} onClick={() => onSelect?.(String(r.id))}>
            <span className="hist-file">
              {r.filament_color && <span className="swatch swatch--sm" style={{ background: `#${String(r.filament_color).replace(/^#/, '')}` }} />}
              <span className="ellipsis" title={r.filename}>{r.filename}</span>
            </span>
            <span className="muted">{r.printer_id}</span>
            <span><span className={`hs-badge hs-badge-${statusClass(r.status)}`}>{r.status}</span></span>
            <span className="tnum">{dur(r.duration_seconds)}</span>
            <span className="tnum">{r.filament_used_g ? `${Math.round(r.filament_used_g)} g` : '—'}</span>
            <span className="muted">{when(r.started_at)}</span>
          </div>
        ))}
        {rows.length === 0 && !loading && <p className="muted empty-note">{t('v2.history.no_match', 'No prints match this filter.')}</p>}
      </section>
    </div>
  );
}
