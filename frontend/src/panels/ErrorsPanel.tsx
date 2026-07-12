import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { AppError } from '../types';

function sevClass(s: string) {
  const v = s.toLowerCase();
  if (v === 'error' || v === 'critical' || v === 'fatal') return 'bad';
  if (v === 'warning' || v === 'warn') return 'warn';
  return 'neutral';
}
function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function parseContext(c?: string | null): Record<string, unknown> {
  if (!c) return {};
  try { return typeof c === 'string' ? JSON.parse(c) : (c as Record<string, unknown>); } catch { return {}; }
}
function label(k: string) {
  return k.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function ErrorsPanel() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<AppError[]>(api.listErrors, 20000);
  const [showAcked, setShowAcked] = useState(false);
  const [selected, setSelected] = useState<AppError | null>(null);

  const all = data ?? [];
  const unacked = all.filter((e) => !e.acknowledged).length;
  const rows = useMemo(() => (showAcked ? all : all.filter((e) => !e.acknowledged)), [all, showAcked]);

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }

  const ctx = selected ? parseContext(selected.context) : {};
  const wikiUrl = typeof ctx.wiki_url === 'string' ? ctx.wiki_url : null;
  const ctxRows = Object.entries(ctx).filter(([k, v]) => k !== 'wiki_url' && v !== null && v !== undefined && v !== '');

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.errors.title', 'Errors')}</h2>
          <p className="muted sub">{unacked} {t('v2.errors.unacked', 'unacknowledged')} · {all.length} {t('v2.errors.total', 'total')}</p>
        </div>
        <div className="inv-head-actions">
          <label className="chk"><input type="checkbox" checked={showAcked} onChange={(e) => setShowAcked(e.target.checked)} /> {t('v2.errors.show_all', 'Show acknowledged')}</label>
          <button className="btn btn--sm" disabled={unacked === 0} onClick={() => run(async () => { await api.ackAllErrors(); reload(); }, t('v2.errors.all_acked', 'All acknowledged'))}>{t('v2.errors.ack_all', 'Acknowledge all')}</button>
        </div>
      </div>

      <section className="card">
        {rows.length === 0 ? (
          <p className="muted empty-note">{t('v2.errors.none', 'No errors. All clear.')}</p>
        ) : (
          <div className="err-list">
            {rows.map((e) => (
              <div className={`err-row err-row--btn${e.acknowledged ? ' err-row--acked' : ''}`} key={e.id}
                role="button" tabIndex={0} style={{ cursor: 'pointer' }}
                onClick={() => setSelected(e)}
                onKeyDown={(ev) => { if (ev.key === 'Enter') setSelected(e); }}>
                <span className={`hs-badge hs-badge-${sevClass(e.severity)}`}>{e.severity}</span>
                <span className="err-code tnum">{e.code}</span>
                <span className="err-msg ellipsis" title={e.message}>{e.message}</span>
                <span className="muted">{e.printer_id}</span>
                <span className="muted tnum">{when(e.timestamp)}</span>
                {e.acknowledged
                  ? <span className="faint">{t('v2.errors.acked', 'ack')}</span>
                  : <button className="btn btn--sm" onClick={(ev) => { ev.stopPropagation(); run(async () => { await api.ackError(e.id); reload(); }); }}>{t('v2.errors.ack', 'Ack')}</button>}
              </div>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className={`hs-badge hs-badge-${sevClass(selected.severity)}`}>{selected.severity}</span>
              <span className="tnum" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selected.code}</span>
              <button className="btn btn--sm" style={{ marginLeft: 'auto' }} onClick={() => setSelected(null)}>✕</button>
            </div>
            <p style={{ margin: '4px 0 12px', lineHeight: 1.5 }}>{selected.message}</p>

            <div className="diag-grid">
              <div className="diag-row"><span className="muted">{t('v2.errors.printer', 'Printer')}</span><span className="diag-val">{selected.printer_id}</span></div>
              <div className="diag-row"><span className="muted">{t('v2.errors.time', 'Time')}</span><span className="diag-val">{when(selected.timestamp)}</span></div>
              {ctxRows.map(([k, v]) => (
                <div className="diag-row" key={k}><span className="muted">{label(k)}</span><span className="diag-val">{String(v)}</span></div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {wikiUrl && <a className="btn btn--sm btn--primary" href={wikiUrl} target="_blank" rel="noreferrer">{t('v2.errors.troubleshoot', 'Troubleshooting guide →')}</a>}
              {!selected.acknowledged && (
                <button className="btn btn--sm" onClick={() => run(async () => { await api.ackError(selected.id); reload(); setSelected(null); }, t('v2.errors.acked_one', 'Acknowledged'))}>{t('v2.errors.ack', 'Acknowledge')}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
