import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
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

export function HistoryPanel() {
  const { data, error, loading } = useResource<HistoryRow[]>(api.listHistory, 10000);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all');

  const rows = useMemo(() => {
    const list = data ?? [];
    if (filter === 'all') return list;
    if (filter === 'failed') return list.filter((r) => ['failed', 'error', 'cancelled'].includes(r.status.toLowerCase()));
    return list.filter((r) => ['completed', 'finish'].includes(r.status.toLowerCase()));
  }, [data, filter]);

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">History</h2>
          <p className="muted sub">{(data ?? []).length} recent prints</p>
        </div>
        <div className="seg">
          {(['all', 'completed', 'failed'] as const).map((f) => (
            <button key={f} className={`seg-btn${filter === f ? ' seg-btn--on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">Loading…</p>}

      <section className="card">
        <div className="hist-head">
          <span>File</span><span>Printer</span><span>Status</span><span>Duration</span><span>Filament</span><span>Date</span>
        </div>
        {rows.map((r) => (
          <div className="hist-row" key={r.id}>
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
        {rows.length === 0 && !loading && <p className="muted empty-note">No prints match this filter.</p>}
      </section>
    </div>
  );
}
