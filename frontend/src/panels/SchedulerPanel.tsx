import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { ScheduledPrint } from '../types';

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function SchedulerPanel() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<ScheduledPrint[]>(api.listScheduled, 20000);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', filename: '', scheduled_at: '' });

  const rows = useMemo(
    () => [...(data ?? [])].sort((a, b) => (a.scheduled_at < b.scheduled_at ? -1 : 1)),
    [data],
  );

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function add() {
    if (!form.title.trim() || !form.filename.trim() || !form.scheduled_at) return;
    await run(async () => {
      // datetime-local has no timezone; send an ISO string.
      await api.addScheduled({ title: form.title.trim(), filename: form.filename.trim(), scheduled_at: new Date(form.scheduled_at).toISOString() });
      setAdding(false); setForm({ title: '', filename: '', scheduled_at: '' }); reload();
    }, t('v2.scheduler.added', 'Scheduled'));
  }
  async function remove(sp: ScheduledPrint) {
    if (!confirm(t('v2.scheduler.confirm_delete', `Remove "${sp.title}"?`))) return;
    await run(async () => { await api.deleteScheduled(sp.id); reload(); }, t('v2.scheduler.removed', 'Removed'));
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.scheduler.title', 'Scheduler')}</h2>
          <p className="muted sub">{rows.length} {t('v2.scheduler.scheduled', 'scheduled prints')}</p>
        </div>
        <button className="btn btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.scheduler.add', '+ Schedule print')}</button>
      </div>

      {adding && (
        <section className="card">
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.scheduler.title_field', 'Title')}</span><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label className="field grow"><span className="field-label">{t('v2.scheduler.file', 'File')}</span><input className="input" value={form.filename} onChange={(e) => setForm({ ...form, filename: e.target.value })} placeholder="model.3mf" /></label>
            <label className="field"><span className="field-label">{t('v2.scheduler.at', 'When')}</span><input className="input" type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={add}>{t('v2.scheduler.add_btn', 'Schedule')}</button>
          </div>
        </section>
      )}

      <section className="card">
        {rows.length === 0 ? (
          <p className="muted empty-note">{t('v2.scheduler.empty', 'No scheduled prints. Add one above.')}</p>
        ) : (
          <div className="sch-list">
            {rows.map((sp) => (
              <div className="sch-row" key={sp.id}>
                <span className="sch-when tnum">{when(sp.scheduled_at)}</span>
                <span className="sch-title">{sp.title}</span>
                <span className="muted ellipsis">{sp.filename}</span>
                {sp.status && <span className={`hs-badge hs-badge-${sp.status === 'done' ? 'good' : 'neutral'}`}>{sp.status}</span>}
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => remove(sp)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
