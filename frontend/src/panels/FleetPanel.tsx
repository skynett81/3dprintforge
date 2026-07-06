import { api } from '../api';
import { useResource, useLivePrinters } from '../hooks';
import { readLive, isPrinting } from '../live';
import type { Printer } from '../types';

function online(p: Printer) {
  const s = (p.status || p.state || '').toLowerCase();
  return s === 'online' || s === 'idle' || s === 'printing' || s === 'running';
}

function temp(v: number | null) { return v == null ? '—' : `${Math.round(v)}°`; }

export function FleetPanel() {
  const { data, error, loading } = useResource<Printer[]>(api.listPrinters);
  const { live, connected } = useLivePrinters();
  const printers = data ?? [];
  const printing = printers.filter((p) => isPrinting(readLive(live[p.id]))).length;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Fleet</h2>
          <p className="muted sub">{printers.filter(online).length}/{printers.length} online · {printing} printing</p>
        </div>
        <span className={`live-pill${connected ? ' live-pill--on' : ''}`}>
          <span className="live-dot" />{connected ? 'Live' : 'Connecting…'}
        </span>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">Loading…</p>}

      <div className="tile-grid">
        {printers.map((p) => {
          const l = readLive(live[p.id]);
          const busy = isPrinting(l);
          const state = (l.gcodeState || p.status || p.state || 'unknown').toLowerCase();
          return (
            <div key={p.id} className="tile">
              <div className="tile-top">
                <span className={`status-chip status-chip--${busy ? 'busy' : online(p) ? 'on' : 'off'}`}>
                  <span className="status-dot" />{state}
                </span>
                <span className="tile-tag">{p.type}</span>
              </div>
              <div className="tile-name">{p.name}</div>
              <div className="tile-meta">{p.model || '—'}</div>

              {busy && l.progress != null && (
                <>
                  <div className="spool-bar"><div className="spool-fill" style={{ width: `${l.progress}%` }} /></div>
                  <div className="tile-foot">
                    <span>{Math.round(l.progress)}%</span>
                    {l.remainingMin != null && <span className="muted"> · {Math.round(l.remainingMin)} min left</span>}
                  </div>
                </>
              )}

              <div className="temps">
                <span className="temp"><span className="temp-k">Nozzle</span> {temp(l.nozzle)}</span>
                <span className="temp"><span className="temp-k">Bed</span> {temp(l.bed)}</span>
                {l.chamber != null && <span className="temp"><span className="temp-k">Chamber</span> {temp(l.chamber)}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
