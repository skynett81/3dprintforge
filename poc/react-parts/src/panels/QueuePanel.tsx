import { api } from '../api';
import { useResource } from '../hooks';
import type { Queue, BedHold } from '../types';

export function QueuePanel() {
  const { data: queues, error } = useResource<Queue[]>(api.listQueues, 4000);
  const { data: holds, reload: reloadHolds } = useResource<BedHold[]>(api.listHolds, 4000);
  const list = queues ?? [];
  const heldBeds = holds ?? [];

  async function confirmBed(printerId: string) {
    await fetch(`/api/queue/confirm-bed/${encodeURIComponent(printerId)}`, { method: 'POST' });
    reloadHolds();
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Queue</h2>
          <p className="muted sub">{list.length} queues · {heldBeds.length} beds awaiting confirmation</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {heldBeds.length > 0 && (
        <section className="card hold-card">
          <div className="card-title warn">Beds awaiting operator confirmation</div>
          {heldBeds.map((h) => (
            <div key={h.printer_id} className="hold-row">
              <span><strong>{h.printer_id}</strong>{h.filename ? ` — ${h.filename}` : ''}</span>
              <button className="btn btn--sm btn--primary" onClick={() => confirmBed(h.printer_id)}>Confirm bed cleared</button>
            </div>
          ))}
        </section>
      )}

      <div className="tile-grid">
        {list.map((q) => {
          const pct = q.item_count > 0 ? Math.round((q.completed_count / q.item_count) * 100) : 0;
          return (
            <div key={q.id} className="tile">
              <div className="tile-top">
                <span className={`status-chip status-chip--${q.status === 'active' ? 'on' : 'off'}`}>
                  <span className="status-dot" />{q.status}
                </span>
                {q.printing_count > 0 && <span className="tile-tag tile-tag--live">{q.printing_count} printing</span>}
              </div>
              <div className="tile-name">{q.name}</div>
              <div className="tile-meta">{q.completed_count}/{q.item_count} items · {q.priority_mode}</div>
              <div className="spool-bar"><div className="spool-fill" style={{ width: `${pct}%` }} /></div>
              <div className="tile-foot flags">
                {q.auto_start ? <span className="flag">auto-start</span> : null}
                {q.require_confirmation ? <span className="flag flag--warn">confirm beds</span> : null}
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p className="muted">No queues.</p>}
      </div>
    </div>
  );
}
