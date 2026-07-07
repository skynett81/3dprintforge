import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { poReceivedPct, lineRemaining, PO_STATUSES } from '../purchasing';
import { SupplierDetail } from './purchasing/SupplierDetail';
import type { Supplier, PurchaseOrder } from '../types';

interface PurchasingProps {
  supplierDetail?: string | null;
  onOpenSupplier?: (id: string) => void;
  onBackSuppliers?: () => void;
}

function statusClass(s: string) {
  const t = s.toLowerCase();
  if (t === 'received') return 'good';
  if (t === 'cancelled') return 'bad';
  if (t === 'ordered') return 'warn';
  return 'neutral';
}

export function PurchasingPanel({ supplierDetail, onOpenSupplier, onBackSuppliers }: PurchasingProps = {}) {
  const t = useT();
  const toast = useToast();
  const { data: suppliers, reload: reloadSuppliers } = useResource<Supplier[]>(api.listSuppliers, 0);
  const { data: pos, reload: reloadPos } = useResource<PurchaseOrder[]>(api.listPurchaseOrders, 15000);
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<PurchaseOrder | null>(null);
  const [addingSup, setAddingSup] = useState(false);
  const [editSupId, setEditSupId] = useState<number | null>(null);
  const [supForm, setSupForm] = useState({ name: '', website: '', lead_time_days: '' });
  const [newPoOpen, setNewPoOpen] = useState(false);
  const [poForm, setPoForm] = useState({ supplier_id: '', reference: '', currency: 'kr' });
  const [addingLine, setAddingLine] = useState(false);
  const [lineForm, setLineForm] = useState({ description: '', quantity: '1', unit_cost: '' });

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
  function startEditSupplier(s: Supplier) {
    setEditSupId(s.id);
    setSupForm({ name: s.name, website: s.website || '', lead_time_days: s.lead_time_days != null ? String(s.lead_time_days) : '' });
    setAddingSup(true);
  }
  async function addSupplier() {
    if (!supForm.name.trim()) return;
    const body = { name: supForm.name.trim(), website: supForm.website.trim() || undefined, lead_time_days: supForm.lead_time_days ? Number(supForm.lead_time_days) : undefined };
    await run(async () => {
      if (editSupId != null) await api.updateSupplier(editSupId, body);
      else await api.addSupplier(body);
      setAddingSup(false); setEditSupId(null); setSupForm({ name: '', website: '', lead_time_days: '' }); reloadSuppliers();
    }, editSupId != null ? t('v2.purchasing.sup_saved', 'Supplier saved') : t('v2.purchasing.sup_added', 'Supplier added'));
  }
  async function removeSupplier(s: Supplier) {
    if (!confirm(t('v2.purchasing.sup_confirm', `Delete supplier "${s.name}"?`))) return;
    await run(async () => { await api.deleteSupplier(s.id); reloadSuppliers(); }, t('v2.purchasing.sup_removed', 'Supplier removed'));
  }
  async function createPo() {
    await run(async () => {
      const po = await api.createPurchaseOrder({
        supplier_id: poForm.supplier_id ? Number(poForm.supplier_id) : undefined,
        reference: poForm.reference.trim() || undefined,
        currency: poForm.currency.trim() || 'kr',
      });
      setNewPoOpen(false); setPoForm({ supplier_id: '', reference: '', currency: 'kr' });
      reloadPos(); if (po?.id) { setSelected(po.id); loadDetail(po.id); }
    }, t('v2.purchasing.po_created', 'Purchase order created'));
  }
  async function removePo() {
    if (selected == null) return;
    if (!confirm(t('v2.purchasing.po_confirm', 'Delete this purchase order?'))) return;
    await run(async () => { await api.deletePurchaseOrder(selected); setSelected(null); setDetail(null); reloadPos(); }, t('v2.purchasing.po_removed', 'Purchase order removed'));
  }
  async function addLine() {
    if (selected == null || !lineForm.description.trim()) return;
    await run(async () => {
      await api.addPoLine(selected, {
        description: lineForm.description.trim(),
        quantity: Number(lineForm.quantity) || 1,
        unit_cost: lineForm.unit_cost ? Number(lineForm.unit_cost) : 0,
      });
      setAddingLine(false); setLineForm({ description: '', quantity: '1', unit_cost: '' });
      loadDetail(selected); reloadPos();
    }, t('v2.purchasing.line_added', 'Line added'));
  }
  async function removeLine(lineId: number) {
    await run(async () => { await api.deletePoLine(lineId); if (selected != null) loadDetail(selected); reloadPos(); }, t('v2.purchasing.line_removed', 'Line removed'));
  }

  if (supplierDetail) {
    return <SupplierDetail supplierId={Number(supplierDetail)} onBack={onBackSuppliers} />;
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
          <button className="btn btn--sm btn--primary" onClick={() => { setEditSupId(null); setSupForm({ name: '', website: '', lead_time_days: '' }); setAddingSup((v) => !v); }}>{addingSup ? t('common.close', 'Close') : t('v2.purchasing.add_supplier', '+ Add supplier')}</button>
        </div>
        {addingSup && (
          <div className="add-form">
            {editSupId != null && <div className="card-title" style={{ width: '100%' }}>{t('v2.purchasing.sup_edit', 'Edit supplier')}</div>}
            <label className="field grow"><span className="field-label">{t('v2.inv.name', 'Name')}</span><input className="input" value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} placeholder="3DJake" /></label>
            <label className="field grow"><span className="field-label">{t('v2.purchasing.website', 'Website')}</span><input className="input" value={supForm.website} onChange={(e) => setSupForm({ ...supForm, website: e.target.value })} placeholder="https://…" /></label>
            <label className="field"><span className="field-label">{t('v2.purchasing.lead', 'Lead (d)')}</span><input className="input" type="number" min={0} value={supForm.lead_time_days} onChange={(e) => setSupForm({ ...supForm, lead_time_days: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={addSupplier}>{editSupId != null ? t('common.save', 'Save') : t('v2.inv.add_btn', 'Add')}</button>
          </div>
        )}
        {(suppliers ?? []).length === 0 ? (
          <p className="muted empty-note">{t('v2.purchasing.no_suppliers', 'No suppliers yet.')}</p>
        ) : (
          <div className="sup-simple">
            {(suppliers ?? []).map((s) => (
              <div className="supx-row supx-row--btn" key={s.id} role="button" tabIndex={0} onClick={() => onOpenSupplier?.(String(s.id))}>
                <span className="supx-name">{s.name}</span>
                <span className="muted">{s.website || ''}</span>
                <span className="muted tnum">{s.lead_time_days != null ? `${s.lead_time_days} ${t('v2.purchasing.days_lead', 'd lead')}` : ''}</span>
                <button className="btn btn--sm btn--ghost" title={t('common.edit', 'Edit')} onClick={(e) => { e.stopPropagation(); startEditSupplier(s); }}>✎</button>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); removeSupplier(s); }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-head">
            <div className="card-title">{t('v2.purchasing.orders', 'Purchase orders')}</div>
            <button className="btn btn--sm btn--primary" onClick={() => setNewPoOpen((v) => !v)}>{newPoOpen ? t('common.close', 'Close') : t('v2.purchasing.new_po', '+ New PO')}</button>
          </div>
          {newPoOpen && (
            <div className="add-form add-form--stack">
              <label className="field grow"><span className="field-label">{t('v2.purchasing.supplier', 'Supplier')}</span>
                <select className="input" value={poForm.supplier_id} onChange={(e) => setPoForm({ ...poForm, supplier_id: e.target.value })}>
                  <option value="">—</option>
                  {(suppliers ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label className="field grow"><span className="field-label">{t('v2.purchasing.reference', 'Reference')}</span><input className="input" value={poForm.reference} onChange={(e) => setPoForm({ ...poForm, reference: e.target.value })} placeholder="PO-2026-01" /></label>
              <button className="btn btn--primary" onClick={createPo}>{t('v2.purchasing.create', 'Create')}</button>
            </div>
          )}
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
                <div className="inv-head-actions">
                  <select className="input" style={{ width: 'auto' }} value={detail.status} onChange={(e) => setStatus(e.target.value)}>
                    {PO_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn btn--sm" onClick={() => setAddingLine((v) => !v)}>{addingLine ? t('common.close', 'Close') : t('v2.purchasing.add_line', '+ Line')}</button>
                  <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={removePo}>✕</button>
                </div>
              </div>
              {addingLine && (
                <div className="add-form add-form--stack">
                  <label className="field grow"><span className="field-label">{t('v2.purchasing.line_desc', 'Description')}</span><input className="input" value={lineForm.description} onChange={(e) => setLineForm({ ...lineForm, description: e.target.value })} placeholder="Bambu PLA Basic — Black" /></label>
                  <label className="field"><span className="field-label">{t('v2.purchasing.qty', 'Qty')}</span><input className="input" type="number" min={1} value={lineForm.quantity} onChange={(e) => setLineForm({ ...lineForm, quantity: e.target.value })} /></label>
                  <label className="field"><span className="field-label">{t('v2.purchasing.unit_cost', 'Unit cost')}</span><input className="input" type="number" min={0} value={lineForm.unit_cost} onChange={(e) => setLineForm({ ...lineForm, unit_cost: e.target.value })} /></label>
                  <button className="btn btn--primary" onClick={addLine}>{t('v2.inv.add_btn', 'Add')}</button>
                </div>
              )}
              <div className="poline-list">
                {(detail.lines ?? []).map((ln) => {
                  const rem = lineRemaining(ln);
                  return (
                    <div className="poline" key={ln.id}>
                      <div className="poline-main">
                        <span className="poline-desc">{ln.description}</span>
                        <span className="muted tnum">{ln.qty_received}/{ln.quantity}{ln.profile_material ? ` · ${ln.profile_material}` : ''}</span>
                      </div>
                      <div className="inv-head-actions">
                        <button className="btn btn--sm" disabled={rem === 0} onClick={() => receive(ln.id)}>
                          {rem === 0 ? t('v2.purchasing.done', 'received') : `${t('v2.purchasing.receive', 'Receive')} ${rem}`}
                        </button>
                        <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => removeLine(ln.id)}>✕</button>
                      </div>
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
