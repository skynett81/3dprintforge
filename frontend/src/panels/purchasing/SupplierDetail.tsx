import { useCallback, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import { poReceivedPct } from '../../purchasing';
import type { Supplier, PurchaseOrder, SupplierPart, FilamentProfile } from '../../types';

function statusClass(s: string) {
  const x = (s || '').toLowerCase();
  if (x === 'received') return 'good';
  if (x === 'cancelled') return 'bad';
  if (x === 'ordered') return 'warn';
  return 'neutral';
}

export function SupplierDetail({ supplierId, onBack }: { supplierId: number; onBack?: () => void }) {
  const t = useT();
  const toast = useToast();
  const { data: suppliers } = useResource<Supplier[]>(api.listSuppliers, 0);
  const { data: pos } = useResource<PurchaseOrder[]>(api.listPurchaseOrders, 15000);
  const loadParts = useCallback(() => api.listSupplierParts(supplierId), [supplierId]);
  const { data: parts, reload: reloadParts } = useResource<SupplierPart[]>(loadParts, 0);
  const { data: profiles } = useResource<FilamentProfile[]>(api.listFilaments, 0);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ filament_profile_id: '', sku: '', price: '', url: '' });

  const supplier = (suppliers ?? []).find((s) => s.id === supplierId);
  const orders = (pos ?? []).filter((p) => p.supplier_id === supplierId);
  const priceList = parts ?? [];

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function addPart() {
    if (!form.price && !form.sku && !form.filament_profile_id) return;
    await run(async () => {
      await api.addSupplierPart({
        supplier_id: supplierId,
        filament_profile_id: form.filament_profile_id ? Number(form.filament_profile_id) : undefined,
        sku: form.sku.trim() || undefined,
        price: form.price ? Number(form.price) : undefined,
        url: form.url.trim() || undefined,
      });
      setAdding(false); setForm({ filament_profile_id: '', sku: '', price: '', url: '' }); reloadParts();
    }, t('v2.sup.price_added', 'Price added'));
  }
  async function removePart(id: number) {
    await run(async () => { await api.deleteSupplierPart(id); reloadParts(); }, t('v2.sup.price_removed', 'Price removed'));
  }

  if (suppliers && !supplier) return (
    <div>
      <button className="btn btn--sm" onClick={onBack}>← {t('v2.purchasing.title', 'Purchasing')}</button>
      <p className="muted empty-note">{t('v2.sup.gone', 'That supplier no longer exists.')}</p>
    </div>
  );

  const cur = supplier?.currency || 'kr';

  return (
    <div>
      <div className="panel-head">
        <div>
          <button className="btn btn--sm" onClick={onBack}>← {t('v2.purchasing.title', 'Purchasing')}</button>
          <h2 className="panel-title" style={{ marginTop: 10 }}>{supplier?.name || `#${supplierId}`}</h2>
          <p className="muted sub">
            {supplier?.website && <a className="classic-link" href={supplier.website} target="_blank" rel="noreferrer">{supplier.website}</a>}
            {supplier?.lead_time_days != null ? ` · ${supplier.lead_time_days} ${t('v2.purchasing.days_lead', 'd lead')}` : ''}
            {supplier?.currency ? ` · ${supplier.currency}` : ''}
            {supplier?.notes ? ` · ${supplier.notes}` : ''}
          </p>
        </div>
      </div>

      <section className="card">
        <div className="card-head">
          <div className="card-title">{t('v2.sup.prices', 'Prices')}</div>
          <button className="btn btn--sm btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.sup.add_price', '+ Add price')}</button>
        </div>
        {adding && (
          <div className="add-form add-form--stack">
            <label className="field grow"><span className="field-label">{t('v2.inv.filament', 'Filament')}</span>
              <select className="input" value={form.filament_profile_id} onChange={(e) => setForm({ ...form, filament_profile_id: e.target.value })}>
                <option value="">—</option>
                {(profiles ?? []).slice(0, 300).map((p) => <option key={p.id} value={p.id}>{p.name}{p.color_name ? ` — ${p.color_name}` : ''}</option>)}
              </select>
            </label>
            <label className="field"><span className="field-label">{t('v2.sup.sku', 'SKU')}</span><input className="input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.sup.price', 'Price')}</span><input className="input" type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
            <label className="field grow"><span className="field-label">{t('v2.sup.url', 'Link')}</span><input className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" /></label>
            <button className="btn btn--primary" onClick={addPart}>{t('v2.inv.add_btn', 'Add')}</button>
          </div>
        )}
        {priceList.length === 0 ? (
          <p className="muted empty-note">{t('v2.sup.no_prices', 'No prices recorded for this supplier yet.')}</p>
        ) : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: '2fr 1fr 0.9fr 0.8fr auto' }}>
              <span>{t('v2.inv.filament', 'Filament')}</span><span>{t('v2.sup.sku', 'SKU')}</span><span className="tnum">{t('v2.sup.price', 'Price')}</span><span></span><span></span>
            </div>
            {priceList.map((p) => (
              <div className="lib-row" key={p.id} style={{ gridTemplateColumns: '2fr 1fr 0.9fr 0.8fr auto' }}>
                <span className="lib-name ellipsis">{p.profile_name || (p.filament_profile_id ? `#${p.filament_profile_id}` : '—')}</span>
                <span className="muted ellipsis">{p.sku || '—'}</span>
                <span className="tnum">{p.price != null ? `${p.price} ${p.currency || cur}` : '—'}</span>
                <span>{p.url ? <a className="classic-link" href={p.url} target="_blank" rel="noreferrer">{t('v2.sup.open', 'open →')}</a> : ''}</span>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => removePart(p.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-title">{t('v2.sup.orders', 'Purchase orders')}</div>
        {orders.length === 0 ? (
          <p className="muted empty-note">{t('v2.sup.no_orders', 'No purchase orders from this supplier yet.')}</p>
        ) : (
          <div className="po-list">
            {orders.map((po) => (
              <div className="po-item" key={po.id}>
                <div className="po-item-top">
                  <span className="po-ref">{po.reference || `PO #${po.id}`}</span>
                  <span className={`hs-badge hs-badge-${statusClass(po.status)}`}>{po.status}</span>
                </div>
                <div className="po-item-meta muted">{po.received_qty}/{po.total_qty} {t('v2.sup.received', 'received')} · {Math.round(po.total_cost)} {po.currency || cur}</div>
                <div className="spool-bar"><div className="spool-fill" style={{ width: `${poReceivedPct(po)}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
