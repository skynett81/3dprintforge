import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { overdueCount, barPct } from '../maintenance';
import type { Printer, MaintenanceStatus, MaintenanceLogEntry, MaintenanceCosts, MaintComponent } from '../types';

function since(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function when(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type Tab = 'components' | 'costs' | 'history';
const TABS: Tab[] = ['components', 'costs', 'history'];

export function MaintenancePanel({ sub, onNav }: { sub?: string | null; onNav?: (slug: string) => void } = {}) {
  const t = useT();
  const toast = useToast();
  const { data: printers } = useResource<Printer[]>(api.listPrinters, 0);
  const [selected, setSelected] = useState<string | null>(null);
  const [localTab, setLocalTab] = useState<Tab>('components');
  const tab: Tab = onNav ? ((sub && (TABS as string[]).includes(sub) ? sub : 'components') as Tab) : localTab;
  const setTab = (id: Tab) => { if (onNav) onNav(id); else setLocalTab(id); };
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [log, setLog] = useState<MaintenanceLogEntry[]>([]);
  const [costs, setCosts] = useState<MaintenanceCosts | null>(null);
  const [addingCost, setAddingCost] = useState(false);
  const [costForm, setCostForm] = useState({ component: '', cost: '', description: '' });

  const list = printers ?? [];
  useEffect(() => { if (selected == null && list.length > 0) setSelected(list[0].id); }, [list, selected]);

  function load(id: string) {
    api.getMaintenanceStatus(id).then(setStatus).catch(() => setStatus(null));
    api.getMaintenanceLog(id).then(setLog).catch(() => setLog([]));
    api.getMaintCosts(id).then(setCosts).catch(() => setCosts(null));
  }
  useEffect(() => { if (selected) load(selected); }, [selected]);

  async function editInterval(c: MaintComponent) {
    const raw = prompt(t('v2.maint.interval_prompt', `Service interval for "${c.label}" (hours):`), String(c.interval_hours));
    const hours = raw == null ? NaN : Number(raw);
    if (!selected || !Number.isFinite(hours) || hours <= 0) return;
    try {
      await api.updateMaintSchedule({ printer_id: selected, component: c.component, interval_hours: hours, label: c.label });
      toast(t('common.saved', 'Saved'), 'success'); load(selected);
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function addCost() {
    if (!selected || !costForm.component || !costForm.cost) return;
    try {
      await api.addMaintCost({ printer_id: selected, component: costForm.component, cost: Number(costForm.cost), description: costForm.description.trim() || undefined });
      toast(t('v2.maint.cost_added', 'Cost added'), 'success');
      setAddingCost(false); setCostForm({ component: '', cost: '', description: '' }); load(selected);
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  async function markServiced(component: string) {
    if (!selected) return;
    const notes = (prompt(t('v2.maint.note_prompt', 'Optional note (what you did) — leave blank to skip:')) || '').trim();
    try {
      await api.logMaintenance(selected, component, notes || undefined);
      toast(t('v2.maint.logged', 'Logged as serviced'), 'success');
      load(selected);
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  const labelFor = (comp: string) => status?.components.find((c) => c.component === comp)?.label || comp;

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

      <div className="seg" style={{ marginBottom: 4 }}>
        {([['components', t('v2.maint.tab_components', 'Components')], ['costs', t('v2.maint.tab_costs', 'Costs')], ['history', t('v2.maint.tab_history', 'History')]] as [Tab, string][]).map(([id, label]) => (
          <button key={id} className={`seg-btn${tab === id ? ' seg-btn--on' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'components' && status && (
        <div className="kpis kpis--5">
          <Kpi label={t('v2.maint.print_hours', 'Print hours')} value={status.total_print_hours.toFixed(1)} />
          <Kpi label={t('v2.maint.prints', 'Prints')} value={String(status.total_prints)} />
          <Kpi label={t('v2.maint.filament', 'Filament')} value={`${(status.total_filament_g / 1000).toFixed(1)} kg`} />
          <Kpi label={t('v2.maint.components', 'Components')} value={String(components.length)} />
          <Kpi label={t('v2.maint.overdue', 'Overdue')} value={String(overdue)} accent={overdue > 0 ? 'blue' : 'green'} />
        </div>
      )}

      {tab === 'components' && (
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
                    <span className="muted micro">{c.last_maintenance ? `${t('v2.maint.last', 'last')}: ${since(c.last_maintenance)}` : t('v2.maint.never', 'never serviced')} · {Math.round(c.hours_since_maintenance)}/{c.interval_hours} h</span>
                  </div>
                  <span className="mnt-bar"><span className={`mnt-fill${c.overdue ? ' mnt-fill--over' : ''}`} style={{ width: `${pct}%` }} /></span>
                  <div className="inv-head-actions">
                    <button className="btn btn--sm btn--ghost" title={t('v2.maint.edit_interval', 'Edit interval')} onClick={() => editInterval(c)}>✎</button>
                    <button className="btn btn--sm" onClick={() => markServiced(c.component)}>{t('v2.maint.mark', 'Mark serviced')}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      )}

      {tab === 'costs' && (
      <section className="card">
        <div className="card-head">
          <div className="card-title">{t('v2.maint.costs', 'Maintenance costs')}{costs && costs.total > 0 ? ` · ${Math.round(costs.total)} ${costs.currency || 'kr'}` : ''}</div>
          <button className="btn btn--sm btn--primary" onClick={() => setAddingCost((v) => !v)}>{addingCost ? t('common.close', 'Close') : t('v2.maint.add_cost', '+ Add cost')}</button>
        </div>
        {addingCost && (
          <div className="add-form add-form--stack">
            <label className="field"><span className="field-label">{t('v2.maint.component', 'Component')}</span>
              <select className="input" value={costForm.component} onChange={(e) => setCostForm({ ...costForm, component: e.target.value })}>
                <option value="">—</option>
                {components.map((c) => <option key={c.component} value={c.component}>{c.label}</option>)}
                <option value="other">{t('v2.maint.other', 'Other')}</option>
              </select>
            </label>
            <label className="field"><span className="field-label">{t('v2.maint.amount', 'Amount')}</span><input className="input" type="number" min={0} step="0.01" value={costForm.cost} onChange={(e) => setCostForm({ ...costForm, cost: e.target.value })} /></label>
            <label className="field grow"><span className="field-label">{t('v2.maint.desc', 'Description')}</span><input className="input" value={costForm.description} onChange={(e) => setCostForm({ ...costForm, description: e.target.value })} placeholder="Replacement nozzle" /></label>
            <button className="btn btn--primary" onClick={addCost}>{t('v2.inv.add_btn', 'Add')}</button>
          </div>
        )}
        {(!costs || costs.items.length === 0) ? (
          <p className="muted empty-note">{t('v2.maint.no_costs', 'No maintenance costs logged yet.')}</p>
        ) : (
          <div className="lib-list">
            {costs.items.map((it) => (
              <div className="lib-row" key={it.id} style={{ gridTemplateColumns: '1.2fr 1.8fr 0.8fr 1fr' }}>
                <span className="lib-name">{labelFor(it.component)}</span>
                <span className="muted ellipsis">{it.description || '—'}</span>
                <span className="tnum">{Math.round(it.cost)} {it.currency || costs.currency || 'kr'}</span>
                <span className="muted tnum">{it.timestamp ? when(it.timestamp) : ''}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      )}

      {tab === 'history' && (
      <section className="card">
        <div className="card-title">{t('v2.maint.history', 'Service history')}</div>
        {log.length === 0 ? (
          <p className="muted empty-note">{t('v2.maint.no_history', 'No maintenance logged yet for this printer.')}</p>
        ) : (
          <div className="lib-list">
            {log.map((e) => (
              <div className="lib-row" key={e.id} style={{ gridTemplateColumns: '1.4fr 1.6fr 1fr' }}>
                <span className="lib-name">{labelFor(e.component)}</span>
                <span className="muted ellipsis">{e.notes || (e.nozzle_type ? `${e.nozzle_type}${e.nozzle_diameter ? ` ${e.nozzle_diameter}mm` : ''}` : e.action)}</span>
                <span className="muted tnum">{when(e.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      )}
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
