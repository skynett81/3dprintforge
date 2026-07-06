import { useState } from 'react';
import { useT } from '../i18n';
import type { QueueItem } from '../types';

function statusClass(s: string) {
  const t = s.toLowerCase();
  if (t === 'completed') return 'good';
  if (t === 'failed') return 'bad';
  if (t === 'printing') return 'warn';
  return 'neutral';
}

interface Props {
  item: QueueItem;
  onSave: (id: number, body: { copies: number; priority: number }) => void;
  onDelete: (item: QueueItem) => void;
}

export function QueueItemRow({ item, onSave, onDelete }: Props) {
  const t = useT();
  const [editing, setEditing] = useState(false);
  const [copies, setCopies] = useState(item.copies);
  const [priority, setPriority] = useState(item.priority);

  if (editing) {
    return (
      <div className="qi-row qi-row--edit">
        <span className="qi-file ellipsis" title={item.filename}>{item.filename}</span>
        <label className="field"><span className="field-label">{t('v2.queue.copies', 'Copies')}</span>
          <input className="input" type="number" min={1} value={copies} onChange={(e) => setCopies(Number(e.target.value) || 1)} /></label>
        <label className="field"><span className="field-label">{t('v2.queue.priority', 'Priority')}</span>
          <input className="input" type="number" min={0} value={priority} onChange={(e) => setPriority(Number(e.target.value) || 0)} /></label>
        <div className="qi-actions">
          <button className="btn btn--sm btn--primary" onClick={() => { onSave(item.id, { copies: Math.max(1, copies), priority: Math.max(0, priority) }); setEditing(false); }}>{t('common.save', 'Save')}</button>
          <button className="btn btn--sm" onClick={() => { setEditing(false); setCopies(item.copies); setPriority(item.priority); }}>{t('common.cancel', 'Cancel')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qi-row">
      <span className="qi-file ellipsis" title={item.filename}>{item.filename}</span>
      <span><span className={`hs-badge hs-badge-${statusClass(item.status)}`}>{item.status}</span></span>
      <span className="tnum">{item.copies_completed || 0}/{item.copies}</span>
      <span className="tnum muted">P{item.priority}</span>
      <div className="qi-actions">
        <button className="btn btn--sm btn--ghost-quiet" title={t('common.edit', 'Edit')} onClick={() => setEditing(true)}>✎</button>
        <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => onDelete(item)}>✕</button>
      </div>
    </div>
  );
}
