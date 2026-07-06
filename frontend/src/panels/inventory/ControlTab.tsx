import { useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { InventoryStats, StockTarget, Spool, DryingStatusRow } from '../../types';

function fdate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function hex(c?: string | null) { const h = (c || '').replace(/^#/, ''); return h ? `#${h}` : '#666'; }

// Stable loader identity so useResource does not re-subscribe every render.
const loadExpiring30 = () => api.getExpiringSpools(30);

export function ControlTab() {
  const t = useT();
  const toast = useToast();
  const { data: stats } = useResource<InventoryStats>(api.getInventoryStats, 30000);
  const { data: targets, reload: reloadTargets } = useResource<StockTarget[]>(api.listStockTargets, 0);
  const { data: expiring } = useResource<Spool[]>(loadExpiring30, 60000);
  const { data: drying } = useResource<DryingStatusRow[]>(api.getDryingStatus, 60000);
  const [form, setForm] = useState({ material: 'PLA', min_kg: '1' });

  const materials = stats?.by_material ?? [];
  const currentG = (m: string) => materials.find((x) => x.material === m)?.remaining_g || 0;

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function setTarget() {
    const kg = Number(form.min_kg);
    if (!form.material || !kg) return;
    await run(async () => { await api.setStockTarget({ material: form.material, min_weight_g: kg * 1000 }); reloadTargets(); }, t('v2.ctl.target_saved', 'Target saved'));
  }
  async function removeTarget(m: string) {
    await run(async () => { await api.deleteStockTarget(m); reloadTargets(); }, t('v2.ctl.target_removed', 'Target removed'));
  }

  const targetRows = (targets ?? []).map((tg) => {
    const cur = currentG(tg.material);
    const short = Math.max(0, tg.min_weight_g - cur);
    return { ...tg, cur, short, pct: Math.min(100, Math.round((cur / (tg.min_weight_g || 1)) * 100)) };
  });
  const dryRows = drying ?? [];
  const dryOverdue = dryRows.filter((d) => d.drying_status === 'overdue' || d.drying_status === 'due')
    .sort((a, b) => (b.days_since_dried || 0) - (a.days_since_dried || 0));
  const dryUntracked = dryRows.length > 0 && dryRows.every((d) => !d.last_dried_at);

  return (
    <div style={{ marginTop: 16 }}>
      <section className="card">
        <div className="card-head">
          <div className="card-title">{t('v2.ctl.targets', 'Minimum stock levels')}</div>
          <div className="add-form" style={{ margin: 0 }}>
            <select className="input" style={{ width: 'auto' }} value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}>
              {['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PC', 'PA', ...materials.map((m) => m.material)].filter((v, i, a) => a.indexOf(v) === i).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input className="input" style={{ width: 90 }} type="number" min={0} step="0.5" value={form.min_kg} onChange={(e) => setForm({ ...form, min_kg: e.target.value })} />
            <span className="muted">kg</span>
            <button className="btn btn--sm btn--primary" onClick={setTarget}>{t('v2.ctl.set', 'Set')}</button>
          </div>
        </div>
        {targetRows.length === 0 ? (
          <p className="muted empty-note">{t('v2.ctl.no_targets', 'No minimum levels set. Add one to get shortfall alerts.')}</p>
        ) : (
          <div className="mat-bars">
            {targetRows.map((r) => (
              <div className="mat-row" key={r.material} style={{ gridTemplateColumns: '80px 1fr auto auto' }}>
                <span className="mat-name">{r.material}</span>
                <div className="mat-track"><div className="mat-fill" style={{ width: `${r.pct}%`, background: r.short > 0 ? 'var(--danger, #ef4444)' : 'var(--accent)' }} /></div>
                <span className="muted tnum mat-val">{(r.cur / 1000).toFixed(1)} / {(r.min_weight_g / 1000).toFixed(1)} kg{r.short > 0 ? ` · −${(r.short / 1000).toFixed(1)}` : ''}</span>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => removeTarget(r.material)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-title">{t('v2.ctl.expiring', 'Expiring within 30 days')}</div>
          {(expiring ?? []).length === 0 ? (
            <p className="muted empty-note">{t('v2.ctl.no_expiring', 'Nothing expiring soon.')}</p>
          ) : (
            <div className="lib-list">
              {(expiring ?? []).map((s) => (
                <div className="lib-row" key={s.id} style={{ gridTemplateColumns: 'auto 2fr 1fr' }}>
                  <span className="swatch swatch--sm" style={{ background: hex(s.color_hex) }} />
                  <span className="lib-name ellipsis">{s.profile_name || s.color_name || `Spool #${s.id}`}</span>
                  <span className="low tnum">{fdate(s.expiry_date)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-title">{t('v2.ctl.drying', 'Needs drying')}</div>
          {dryOverdue.length === 0 ? (
            <p className="muted empty-note">{dryUntracked ? t('v2.ctl.no_drying_history', 'No drying history tracked yet — mark spools dried to get overdue alerts.') : t('v2.ctl.no_drying', 'No spools are overdue for drying.')}</p>
          ) : (
            <div className="lib-list">
              {dryOverdue.map((d) => (
                <div className="lib-row" key={d.id} style={{ gridTemplateColumns: 'auto 2fr 1fr' }}>
                  <span className="swatch swatch--sm" style={{ background: hex(d.color_hex) }} />
                  <span className="lib-name ellipsis">{d.profile_name || `Spool #${d.id}`} <span className="muted">{d.material}</span></span>
                  <span className="low tnum">{d.days_since_dried != null ? `${d.days_since_dried} d` : t('v2.ctl.never', 'never')}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
