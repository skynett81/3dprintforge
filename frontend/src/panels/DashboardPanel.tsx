import { api } from '../api';
import { useResource, useLivePrinters, useProjects } from '../hooks';
import { readLive, isPrinting } from '../live';
import type { Printer, Spool, Queue } from '../types';

function online(p: Printer) {
  const s = (p.status || p.state || '').toLowerCase();
  return s === 'online' || s === 'idle' || s === 'printing' || s === 'running';
}
function temp(v: number | null) { return v == null ? '—' : `${Math.round(v)}°`; }

export function DashboardPanel() {
  const { data: printers } = useResource<Printer[]>(api.listPrinters);
  const { data: spools } = useResource<Spool[]>(api.listSpools);
  const { data: queues } = useResource<Queue[]>(api.listQueues);
  const { projects } = useProjects();
  const { live, connected } = useLivePrinters();

  const pr = printers ?? [];
  const sp = (spools ?? []).filter((s) => !s.archived);
  const qs = queues ?? [];

  const printing = pr.filter((p) => isPrinting(readLive(live[p.id]))).length;
  const kg = sp.reduce((a, s) => a + (s.remaining_weight_g || 0), 0) / 1000;
  const low = sp.filter((s) => s.initial_weight_g > 0 && s.remaining_weight_g / s.initial_weight_g < 0.15).length;
  const pending = qs.reduce((a, q) => a + Math.max(0, q.item_count - q.completed_count), 0);

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Dashboard</h2>
          <p className="muted sub">Farm overview across fleet, filament, queue and production</p>
        </div>
        <span className={`live-pill${connected ? ' live-pill--on' : ''}`}>
          <span className="live-dot" />{connected ? 'Live' : 'Connecting…'}
        </span>
      </div>

      <div className="kpis kpis--5">
        <Kpi label="Printers online" value={`${pr.filter(online).length}/${pr.length}`} />
        <Kpi label="Printing now" value={String(printing)} accent="blue" />
        <Kpi label="Filament" value={`${kg.toFixed(1)} kg`} sub={`${low} low`} />
        <Kpi label="Queue pending" value={String(pending)} />
        <Kpi label="Active projects" value={String(projects.length)} accent="teal" />
      </div>

      <section className="card">
        <div className="card-title">Live fleet</div>
        <div className="live-list">
          {pr.map((p) => {
            const l = readLive(live[p.id]);
            const busy = isPrinting(l);
            return (
              <div key={p.id} className="live-row">
                <span className={`status-chip status-chip--${busy ? 'busy' : online(p) ? 'on' : 'off'}`}>
                  <span className="status-dot" />
                </span>
                <span className="live-name">{p.name}</span>
                <span className="live-state muted">{(l.gcodeState || p.status || 'online').toLowerCase()}</span>
                <span className="live-temps muted">N {temp(l.nozzle)} · B {temp(l.bed)}{l.chamber != null ? ` · C ${temp(l.chamber)}` : ''}</span>
                <span className="live-prog">
                  {busy && l.progress != null ? (
                    <span className="mini-bar"><span className="mini-fill" style={{ width: `${l.progress}%` }} /></span>
                  ) : <span className="faint">idle</span>}
                </span>
              </div>
            );
          })}
          {pr.length === 0 && <p className="muted">No printers.</p>}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: 'teal' | 'blue' | 'green' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>
        {value}{sub && <span className="kpi-sub"> {sub}</span>}
      </div>
    </div>
  );
}
