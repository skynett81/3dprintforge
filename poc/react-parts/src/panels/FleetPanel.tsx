import { api } from '../api';
import { useResource } from '../hooks';
import type { Printer } from '../types';

function isOnline(p: Printer) {
  const s = (p.status || p.state || '').toLowerCase();
  return s === 'online' || s === 'idle' || s === 'printing' || s === 'running';
}

export function FleetPanel() {
  const { data, error, loading } = useResource<Printer[]>(api.listPrinters);
  const printers = data ?? [];
  const online = printers.filter(isOnline).length;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Fleet</h2>
          <p className="muted sub">{online} of {printers.length} printers online</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">Loading…</p>}

      <div className="tile-grid">
        {printers.map((p) => {
          const state = (p.status || p.state || 'unknown').toLowerCase();
          return (
            <div key={p.id} className="tile">
              <div className="tile-top">
                <span className={`status-chip status-chip--${isOnline(p) ? 'on' : 'off'}`}>
                  <span className="status-dot" />{state}
                </span>
                <span className="tile-tag">{p.type}</span>
              </div>
              <div className="tile-name">{p.name}</div>
              <div className="tile-meta">{p.model || '—'}</div>
              <div className="tile-foot muted">{p.ip || 'no address'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
