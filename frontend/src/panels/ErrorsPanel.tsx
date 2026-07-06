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

export function ErrorsPanel() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<AppError[]>(api.listErrors, 20000);
  const [showAcked, setShowAcked] = useState(false);

  const all = data ?? [];
  const unacked = all.filter((e) => !e.acknowledged).length;
  const rows = useMemo(() => (showAcked ? all : all.filter((e) => !e.acknowledged)), [all, showAcked]);

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }

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
              <div className={`err-row${e.acknowledged ? ' err-row--acked' : ''}`} key={e.id}>
                <span className={`hs-badge hs-badge-${sevClass(e.severity)}`}>{e.severity}</span>
                <span className="err-code tnum">{e.code}</span>
                <span className="err-msg ellipsis" title={e.message}>{e.message}</span>
                <span className="muted">{e.printer_id}</span>
                <span className="muted tnum">{when(e.timestamp)}</span>
                {e.acknowledged
                  ? <span className="faint">{t('v2.errors.acked', 'ack')}</span>
                  : <button className="btn btn--sm" onClick={() => run(async () => { await api.ackError(e.id); reload(); })}>{t('v2.errors.ack', 'Ack')}</button>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
