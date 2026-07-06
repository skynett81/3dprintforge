import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { poReceivedPct, lineRemaining, PO_STATUSES } from '../purchasing';
import type { Supplier, PurchaseOrder } from '../types';

function statusClass(s: string) {
  const t = s.toLowerCase();
  if (t === 'received') return 'good';
  if (t === 'cancelled') return 'bad';
  if (t === 'ordered') return 'warn';
  return 'neutral';
}

export function PurchasingPanel() {
  const t = useT();
  const toast = useToast();
  const { data: suppliers, reload: reloadSuppliers } = useResource<Supplier[]>(api.listSuppliers, 0);
  const { data: pos, reload: reloadPos } = useResource<PurchaseOrder[]>(api.listPurchaseOrders, 15000);
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<PurchaseOrder | null>(null);
  const [addingSup, setAddingSup] = useState(false);
  const [supForm, setSupForm] = useState({ name: '', website: '', lead_time_days: '' });

  const list = pos ?? [];
  useEffect(() => { if (selected == null && list.length > 0) setSelected(list[0].id); }, [list, selected]);

  function loadDetail(id: number) {
    api.getPurchaseOrder(id).then(setDetail).catch(() => setDetail(null));
  }
  useEffect(() => { if (selected != null) loadDetail(selected); }, [selected]);

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  async function receive(lineId: number) {
    await run(async () => { await api.receivePoLine(lineId); if (selected != null) loadDetail(selected); reloadPos(); }, t('v2.purchasing.received', 'Received into stock'));
  }
  async function setStatus(status: string) {
    if (selected == null) return;
    await run(async () => { await api.updatePurchaseOrder(selected, { status }); loadDetail(selected); reloadPos(); }, t('common.saved', 'Saved'));
  }
  async function addSupplier() {
    if (!supForm.name.trim()) return;
    await run(async () => {
      await api.addSupplier({ name: supForm.name.trim(), website: supForm.website.trim() || undefined, lead_time_days: supForm.lead_time_days ? Number(supForm.lead_time_days) : undefined });
      setAddingSup(false); setSupForm({ name: '', website: '', lead_time_days: '' }); reloadSuppliers();
    }, t('v2.purchasing.sup_added', 'Supplier added'));
  }
  async function removeSupplier(s: Supplier) {
    if (!confirm(t('v2.purchasing.sup_confirm', `Delete supplier "${s.name}"?`))) return;
    await run(async () => { await api.deleteSupplier(s.id); reloadSuppliers(); }, t('v2.purchasing.sup_removed', 'Supplier removed'));
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.purchasing.title', 'Purchasing')}</h2>
          <p className="muted sub">{(suppliers ?? []).length} {t('v2.purchasing.suppliers', 'suppliers')} · {list.length} {t('v2.purchasing.orders', 'orders')}</p>
        </div>
      </div>

      <section className="card">
        <div className="card-head">
          <div className="card-title">{t('v2.purchasing.suppliers', 'Suppliers')}</div>
          <button className="btn btn--sm btn--primary" onClick={() => setAddingSup((v) => !v)}>{addingSup ? t('common.close', 'Close') : t('v2.purchasing.add_supplier', '+ Add supplier')}</button>
        </div>
        {addingSup && (
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.inv.name', 'Name')}</span><input className="input" value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} placeholder="3DJake" /></label>
            <label className="field grow"><span className="field-label">{t('v2.purchasing.website', 'Website')}</span><input className="input" value={supForm.website} onChange={(e) => setSupForm({ ...supForm, website: e.target.value })} placeholder="https://…" /></label>
            <label className="field"><span className="field-label">{t('v2.purchasing.lead', 'Lead (d)')}</span><input className="input" type="number" min={0} value={supForm.lead_time_days} onChange={(e) => setSupForm({ ...supForm, lead_time_days: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={addSupplier}>{t('v2.inv.add_btn', 'Add')}</button>
          </div>
        )}
        {(suppliers ?? []).length === 0 ? (
          <p className="muted empty-note">{t('v2.purchasing.no_suppliers', 'No suppliers yet.')}</p>
        ) : (
          <div className="sup-simple">
            {(suppliers ?? []).map((s) => (
              <div className="supx-row" key={s.id}>
                <span className="supx-name">{s.name}</span>
                <span className="muted">{s.website || ''}</span>
                <span className="muted tnum">{s.lead_time_days != null ? `${s.lead_time_days} ${t('v2.purchasing.days_lead', 'd lead')}` : ''}</span>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => removeSupplier(s)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-title">{t('v2.purchasing.orders', 'Purchase orders')}</div>
          {list.length === 0 ? (
            <p className="muted empty-note">{t('v2.purchasing.no_orders', 'No purchase orders.')}</p>
          ) : (
            <div className="po-list">
              {list.map((po) => (
                <button key={po.id} className={`po-item${po.id === selected ? ' po-item--on' : ''}`} onClick={() => setSelected(po.id)}>
                  <div className="po-item-top">
                    <span className="po-ref">{po.reference || `PO #${po.id}`}</span>
                    <span className={`hs-badge hs-badge-${statusClass(po.status)}`}>{po.status}</span>
                  </div>
                  <div className="po-item-meta muted">{po.supplier_name || '—'} · {po.received_qty}/{po.total_qty} · {Math.round(po.total_cost)} {po.currency || 'kr'}</div>
                  <div className="spool-bar"><div className="spool-fill" style={{ width: `${poReceivedPct(po)}%` }} /></div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          {!detail ? (
            <p className="muted">{t('v2.purchasing.select', 'Select an order.')}</p>
          ) : (
            <>
              <div className="card-head">
                <div className="card-title">{detail.reference || `PO #${detail.id}`}</div>
                <select className="input" style={{ width: 'auto' }} value={detail.status} onChange={(e) => setStatus(e.target.value)}>
                  {PO_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="poline-list">
                {(detail.lines ?? []).map((ln) => {
                  const rem = lineRemaining(ln);
                  return (
                    <div className="poline" key={ln.id}>
                      <div className="poline-main">
                        <span className="poline-desc">{ln.description}</span>
                        <span className="muted tnum">{ln.qty_received}/{ln.quantity}{ln.profile_material ? ` · ${ln.profile_material}` : ''}</span>
                      </div>
                      <button className="btn btn--sm" disabled={rem === 0} onClick={() => receive(ln.id)}>
                        {rem === 0 ? t('v2.purchasing.done', 'received') : `${t('v2.purchasing.receive', 'Receive')} ${rem}`}
                      </button>
                    </div>
                  );
                })}
                {(detail.lines ?? []).length === 0 && <p className="muted empty-note">{t('v2.purchasing.no_lines', 'No lines on this order.')}</p>}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
