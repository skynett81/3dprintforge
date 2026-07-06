import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { overdueCount, barPct } from '../maintenance';
import type { Printer, MaintenanceStatus } from '../types';

export function MaintenancePanel() {
  const t = useT();
  const toast = useToast();
  const { data: printers } = useResource<Printer[]>(api.listPrinters, 0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);

  const list = printers ?? [];
  useEffect(() => { if (selected == null && list.length > 0) setSelected(list[0].id); }, [list, selected]);

  function load(id: string) {
    api.getMaintenanceStatus(id).then(setStatus).catch(() => setStatus(null));
  }
  useEffect(() => { if (selected) load(selected); }, [selected]);

  async function markServiced(component: string) {
    if (!selected) return;
    try {
      await api.logMaintenance(selected, component);
      toast(t('v2.maint.logged', 'Logged as serviced'), 'success');
      load(selected);
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  const components = status?.components ?? [];
  const overdue = overdueCount(components);

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.maint.title', 'Maintenance')}</h2>
          <p className="muted sub">{overdue > 0 ? `${overdue} ${t('v2.maint.overdue', 'overdue')}` : t('v2.maint.all_ok', 'all up to date')}</p>
        </div>
        {list.length > 0 && (
          <label className="project-select">
            <span className="field-label">{t('v2.maint.printer', 'Printer')}</span>
            <select className="input" value={selected ?? ''} onChange={(e) => setSelected(e.target.value)}>
              {list.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        )}
      </div>

      {status && (
        <div className="kpis kpis--5">
          <Kpi label={t('v2.maint.print_hours', 'Print hours')} value={status.total_print_hours.toFixed(1)} />
          <Kpi label={t('v2.maint.prints', 'Prints')} value={String(status.total_prints)} />
          <Kpi label={t('v2.maint.filament', 'Filament')} value={`${(status.total_filament_g / 1000).toFixed(1)} kg`} />
          <Kpi label={t('v2.maint.components', 'Components')} value={String(components.length)} />
          <Kpi label={t('v2.maint.overdue', 'Overdue')} value={String(overdue)} accent={overdue > 0 ? 'blue' : 'green'} />
        </div>
      )}

      <section className="card">
        <div className="card-title">{t('v2.maint.components', 'Components')}</div>
        {components.length === 0 ? (
          <p className="muted empty-note">{t('v2.maint.none', 'No maintenance schedule for this printer.')}</p>
        ) : (
          <div className="mnt-list">
            {components.map((c) => {
              const pct = barPct(c);
              return (
                <div className="mnt-row" key={c.component}>
                  <div className="mnt-info">
                    <span className="mnt-label">{c.label}{c.overdue && <span className="badge badge--low">{t('v2.maint.overdue', 'overdue')}</span>}</span>
                    <span className="muted tnum">{Math.round(c.hours_since_maintenance)}/{c.interval_hours} h</span>
                  </div>
                  <span className="mnt-bar"><span className={`mnt-fill${c.overdue ? ' mnt-fill--over' : ''}`} style={{ width: `${pct}%` }} /></span>
                  <button className="btn btn--sm" onClick={() => markServiced(c.component)}>{t('v2.maint.mark', 'Mark serviced')}</button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: 'blue' | 'green' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}</div>
    </div>
  );
}
