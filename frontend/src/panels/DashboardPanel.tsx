import { api } from '../api';
import { useResource, useLivePrinters, useProjects } from '../hooks';
import { useT } from '../i18n';
import { readLive, isPrinting } from '../live';
import type { Printer, Spool, Queue, ReorderRow, WasteStats } from '../types';

function online(p: Printer) {
  const s = (p.status || p.state || '').toLowerCase();
  return s === 'online' || s === 'idle' || s === 'printing' || s === 'running';
}
function temp(v: number | null) { return v == null ? '—' : `${Math.round(v)}°`; }

export function DashboardPanel({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const t = useT();
  const { data: printers } = useResource<Printer[]>(api.listPrinters);
  const { data: spools } = useResource<Spool[]>(api.listSpools);
  const { data: queues } = useResource<Queue[]>(api.listQueues);
  const { data: reorder } = useResource<ReorderRow[]>(api.getReorder, 30000);
  const { data: waste } = useResource<WasteStats>(api.getWasteStats, 30000);
  const { projects } = useProjects();
  const { live, connected } = useLivePrinters();

  const pr = printers ?? [];
  const sp = (spools ?? []).filter((s) => !s.archived);
  const qs = queues ?? [];

  const printing = pr.filter((p) => isPrinting(readLive(live[p.id]))).length;
  const kg = sp.reduce((a, s) => a + (s.remaining_weight_g || 0), 0) / 1000;
  const low = sp.filter((s) => s.initial_weight_g > 0 && s.remaining_weight_g / s.initial_weight_g < 0.15).length;
  const pending = qs.reduce((a, q) => a + Math.max(0, q.item_count - q.completed_count), 0);
  const belowTarget = (reorder ?? []).filter((r) => r.below_target).length;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.dash.title', 'Dashboard')}</h2>
          <p className="muted sub">{t('v2.dash.subtitle', 'Farm overview — click a card to jump in')}</p>
        </div>
        <span className={`live-pill${connected ? ' live-pill--on' : ''}`}>
          <span className="live-dot" />{connected ? t('v2.fleet.live', 'Live') : t('v2.fleet.connecting', 'Connecting…')}
        </span>
      </div>

      <div className="kpis kpis--dash">
        <Kpi label={t('v2.dash.online', 'Printers online')} value={`${pr.filter(online).length}/${pr.length}`} onClick={() => onNavigate?.('fleet')} />
        <Kpi label={t('v2.dash.printing', 'Printing now')} value={String(printing)} accent="blue" onClick={() => onNavigate?.('fleet')} />
        <Kpi label={t('v2.dash.queue', 'Queue pending')} value={String(pending)} onClick={() => onNavigate?.('queue')} />
        <Kpi label={t('v2.dash.filament', 'Filament')} value={`${kg.toFixed(1)} kg`} sub={`${low} ${t('v2.dash.low', 'low')}`} onClick={() => onNavigate?.('inventory')} />
        <Kpi label={t('v2.dash.reorder', 'To reorder')} value={String(belowTarget)} accent={belowTarget > 0 ? 'blue' : undefined} onClick={() => onNavigate?.('supply')} />
        <Kpi label={t('v2.dash.waste', 'Waste cost')} value={waste ? `${Math.round(waste.total_cost)} kr` : '—'} onClick={() => onNavigate?.('waste')} />
        <Kpi label={t('v2.dash.projects', 'Active projects')} value={String(projects.length)} accent="teal" onClick={() => onNavigate?.('production')} />
      </div>

      <section className="card">
        <div className="card-title">{t('v2.dash.now_printing', 'Now printing')}</div>
        {(() => {
          const active = pr.filter((p) => isPrinting(readLive(live[p.id])));
          if (active.length === 0) return <p className="muted empty-note">{t('v2.dash.nothing_printing', 'Nothing is printing right now.')}</p>;
          return (
            <div className="np-grid">
              {active.map((p) => {
                const l = readLive(live[p.id]);
                return (
                  <div className="np-card" key={p.id} role="button" tabIndex={0} onClick={() => onNavigate?.('fleet')}>
                    <div className="np-thumb-wrap">
                      <img
                        className="np-thumb"
                        src={`/api/thumbnail/${encodeURIComponent(p.id)}?f=${encodeURIComponent(l.file || '')}`}
                        alt={l.file || p.name}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          if (!img.dataset.fb) { img.dataset.fb = '1'; img.src = `/api/printer-image/${encodeURIComponent(p.model || p.name)}`; }
                          else { img.style.visibility = 'hidden'; }
                        }}
                      />
                      {l.progress != null && <span className="np-pct">{Math.round(l.progress)}%</span>}
                    </div>
                    <div className="np-body">
                      <div className="np-printer">{p.name} <span className="status-chip status-chip--busy"><span className="status-dot" />{(l.gcodeState || 'printing').toLowerCase()}</span></div>
                      <div className="np-file ellipsis" title={l.file || ''}>{l.file || t('v2.dash.unknown_file', 'Unknown file')}</div>
                      {l.progress != null && <div className="spool-bar"><div className="spool-fill" style={{ width: `${l.progress}%` }} /></div>}
                      <div className="np-meta muted">
                        {l.remainingMin != null && <span>{Math.round(l.remainingMin)} {t('v2.dash.min_left', 'min left')}</span>}
                        <span>N {temp(l.nozzle)} · B {temp(l.bed)}{l.chamber != null ? ` · C ${temp(l.chamber)}` : ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      <section className="card">
        <div className="card-title">{t('v2.dash.live_fleet', 'Live fleet')}</div>
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
          {pr.length === 0 && <p className="muted">{t('v2.dash.no_printers', 'No printers.')}</p>}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, accent, onClick }: { label: string; value: string; sub?: string; accent?: 'teal' | 'blue' | 'green'; onClick?: () => void }) {
  const inner = (
    <>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}{sub && <span className="kpi-sub"> {sub}</span>}</div>
    </>
  );
  return onClick
    ? <button className="kpi kpi--click" onClick={onClick}>{inner}</button>
    : <div className="kpi">{inner}</div>;
}
