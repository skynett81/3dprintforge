import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { QueueItemRow } from '../components/QueueItemRow';
import type { Queue, BedHold, QueueItem } from '../types';

export function QueuePanel() {
  const t = useT();
  const { data: queues, error, reload: reloadQueues } = useResource<Queue[]>(api.listQueues, 4000);
  const { data: holds, reload: reloadHolds } = useResource<BedHold[]>(api.listHolds, 4000);
  const [selected, setSelected] = useState<number | null>(null);
  const [items, setItems] = useState<QueueItem[]>([]);
  const list = queues ?? [];
  const heldBeds = holds ?? [];

  useEffect(() => {
    if (selected == null && list.length > 0) setSelected(list[0].id);
  }, [list, selected]);

  const current = list.find((q) => q.id === selected) || null;

  function loadItems(id: number) {
    api.getQueueItems(id).then(setItems).catch(() => setItems([]));
  }
  useEffect(() => { if (selected != null) loadItems(selected); }, [selected]);

  async function confirmBed(printerId: string) { await api.confirmBed(printerId); reloadHolds(); }
  async function toggleQueue(q: Queue) {
    if (q.status === 'active') await api.pauseQueue(q.id); else await api.resumeQueue(q.id);
    reloadQueues();
  }
  async function saveItem(id: number, body: { copies: number; priority: number }) {
    await api.updateQueueItem(id, body);
    if (selected != null) loadItems(selected);
  }
  async function deleteItem(item: QueueItem) {
    if (!confirm(t('v2.queue.confirm_delete', `Remove "${item.filename}" from the queue?`))) return;
    await api.deleteQueueItem(item.id);
    if (selected != null) loadItems(selected);
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.queue.title', 'Queue')}</h2>
          <p className="muted sub">{list.length} {t('v2.queue.queues', 'queues')} · {heldBeds.length} {t('v2.queue.beds_waiting', 'beds awaiting confirmation')}</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {heldBeds.length > 0 && (
        <section className="card hold-card">
          <div className="card-title warn">{t('v2.queue.beds_held', 'Beds awaiting operator confirmation')}</div>
          {heldBeds.map((h) => (
            <div key={h.printer_id} className="hold-row">
              <span><strong>{h.printer_id}</strong>{h.filename ? ` — ${h.filename}` : ''}</span>
              <button className="btn btn--sm btn--primary" onClick={() => confirmBed(h.printer_id)}>{t('v2.queue.confirm_bed', 'Confirm bed cleared')}</button>
            </div>
          ))}
        </section>
      )}

      <div className="tile-grid">
        {list.map((q) => {
          const pct = q.item_count > 0 ? Math.round((q.completed_count / q.item_count) * 100) : 0;
          return (
            <button key={q.id} className={`tile tile--clickable${q.id === selected ? ' tile--selected' : ''}`} onClick={() => setSelected(q.id)}>
              <div className="tile-top">
                <span className={`status-chip status-chip--${q.status === 'active' ? 'on' : 'off'}`}>
                  <span className="status-dot" />{q.status}
                </span>
                {q.printing_count > 0 && <span className="tile-tag tile-tag--live">{q.printing_count} {t('v2.queue.printing', 'printing')}</span>}
              </div>
              <div className="tile-name">{q.name}</div>
              <div className="tile-meta">{q.completed_count}/{q.item_count} {t('v2.queue.items', 'items')} · {q.priority_mode}</div>
              <div className="spool-bar"><div className="spool-fill" style={{ width: `${pct}%` }} /></div>
              <div className="tile-foot flags">
                {q.auto_start ? <span className="flag">{t('v2.queue.auto_start', 'auto-start')}</span> : null}
                {q.require_confirmation ? <span className="flag flag--warn">{t('v2.queue.confirm_beds', 'confirm beds')}</span> : null}
              </div>
            </button>
          );
        })}
        {list.length === 0 && <p className="muted">{t('v2.queue.no_queues', 'No queues.')}</p>}
      </div>

      {current && (
        <section className="card">
          <div className="card-head">
            <div className="card-title">{current.name}</div>
            <button className="btn btn--sm" onClick={() => toggleQueue(current)}>
              {current.status === 'active' ? t('v2.queue.pause', 'Pause queue') : t('v2.queue.resume', 'Resume queue')}
            </button>
          </div>
          {items.length === 0 ? (
            <p className="muted empty-note">{t('v2.queue.no_items', 'No items in this queue.')}</p>
          ) : (
            <div className="qi-list">
              <div className="qi-head">
                <span>{t('v2.queue.file', 'File')}</span>
                <span>{t('v2.queue.status', 'Status')}</span>
                <span>{t('v2.queue.copies', 'Copies')}</span>
                <span>{t('v2.queue.priority', 'Priority')}</span>
                <span></span>
              </div>
              {items.map((it) => <QueueItemRow key={it.id} item={it} onSave={saveItem} onDelete={deleteItem} />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
