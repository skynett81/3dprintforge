import { useCallback, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { Customer, CrmOrder, CrmInvoice } from '../../types';

const ORDER_STATUSES = ['draft', 'confirmed', 'in_progress', 'printing', 'completed', 'shipped', 'cancelled'];

function money(v?: number | null, cur = 'kr') { return `${Math.round(v || 0)} ${cur}`; }
function fdate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function statusClass(s: string) {
  const x = (s || '').toLowerCase();
  if (['completed', 'shipped', 'paid'].includes(x)) return 'good';
  if (['cancelled', 'overdue'].includes(x)) return 'bad';
  if (['confirmed', 'in_progress', 'printing', 'sent'].includes(x)) return 'warn';
  return 'neutral';
}

// ---- Overview (client-side KPIs; the dashboard endpoint has a backend bug) ----
export function CrmOverview() {
  const t = useT();
  const { data: customers } = useResource<Customer[]>(api.listCustomers, 0);
  const { data: orders } = useResource<CrmOrder[]>(api.listCrmOrders, 0);
  const { data: invoices } = useResource<CrmInvoice[]>(api.listCrmInvoices, 0);
  const cs = customers ?? []; const os = orders ?? []; const iv = invoices ?? [];
  const revenue = os.filter((o) => !['cancelled', 'draft'].includes(o.status)).reduce((a, o) => a + (o.total_cost || 0), 0);
  const open = os.filter((o) => ['draft', 'confirmed', 'in_progress', 'printing'].includes(o.status)).length;
  const unpaid = iv.filter((i) => ['draft', 'sent', 'overdue'].includes(i.status)).length;
  return (
    <div style={{ marginTop: 16 }}>
      <div className="kpis kpis--5">
        <Kpi label={t('v2.crm.ov_customers', 'Customers')} value={String(cs.length)} accent="teal" />
        <Kpi label={t('v2.crm.ov_orders', 'Orders')} value={String(os.length)} />
        <Kpi label={t('v2.crm.ov_open', 'Open orders')} value={String(open)} accent={open ? 'blue' : undefined} />
        <Kpi label={t('v2.crm.ov_revenue', 'Revenue')} value={money(revenue)} />
        <Kpi label={t('v2.crm.ov_unpaid', 'Unpaid invoices')} value={String(unpaid)} accent={unpaid ? 'blue' : undefined} />
      </div>
      <section className="card">
        <div className="card-title">{t('v2.crm.recent_orders', 'Recent orders')}</div>
        {os.length === 0 ? <p className="muted empty-note">{t('v2.crm.no_orders', 'No orders yet.')}</p> : (
          <div className="lib-list">
            {os.slice(0, 8).map((o) => (
              <div className="lib-row" key={o.id} style={{ gridTemplateColumns: '1fr 1.4fr auto 1fr' }}>
                <span className="lib-name">{o.order_number}</span>
                <span className="muted">{o.customer_name || '—'}</span>
                <span><span className={`hs-badge hs-badge-${statusClass(o.status)}`}>{o.status}</span></span>
                <span className="tnum">{money(o.total_cost, o.currency || 'kr')}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---- Orders list + create ----
export function OrdersTab({ onOpen }: { onOpen?: (id: string) => void }) {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<CrmOrder[]>(api.listCrmOrders, 15000);
  const { data: customers } = useResource<Customer[]>(api.listCustomers, 0);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ customer_id: '', status: 'confirmed', notes: '' });
  const orders = data ?? [];

  async function create() {
    try {
      const r = await api.createCrmOrder({ customer_id: form.customer_id ? Number(form.customer_id) : undefined, status: form.status, notes: form.notes.trim() || undefined });
      toast(t('v2.crm.order_created', 'Order created'), 'success');
      setAdding(false); setForm({ customer_id: '', status: 'confirmed', notes: '' }); reload();
      if (r?.id) onOpen?.(String(r.id));
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div className="tab-toolbar" style={{ marginTop: 0 }}>
        <span className="muted">{orders.length} {t('v2.crm.orders', 'orders')}</span>
        <button className="btn btn--sm btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.crm.new_order', '+ New order')}</button>
      </div>
      {adding && (
        <section className="card">
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.crm.customer', 'Customer')}</span>
              <select className="input" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
                <option value="">—</option>
                {(customers ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="field"><span className="field-label">{t('v2.crm.status', 'Status')}</span>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
            <label className="field grow"><span className="field-label">{t('v2.crm.notes', 'Notes')}</span><input className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={create}>{t('v2.inv.add_btn', 'Create')}</button>
          </div>
        </section>
      )}
      <section className="card">
        {orders.length === 0 ? <p className="muted empty-note">{t('v2.crm.no_orders', 'No orders yet.')}</p> : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: '1fr 1.4fr auto 0.9fr 1fr' }}>
              <span>{t('v2.crm.order_no', 'Order')}</span><span>{t('v2.crm.customer', 'Customer')}</span><span>{t('v2.crm.status', 'Status')}</span><span className="tnum">{t('v2.crm.items', 'Items')}</span><span className="tnum">{t('v2.crm.total', 'Total')}</span>
            </div>
            {orders.map((o) => (
              <div className="lib-row lib-row--btn" key={o.id} style={{ gridTemplateColumns: '1fr 1.4fr auto 0.9fr 1fr' }} role="button" tabIndex={0} onClick={() => onOpen?.(String(o.id))}>
                <span className="lib-name">{o.order_number}</span>
                <span className="muted ellipsis">{o.customer_name || '—'}</span>
                <span><span className={`hs-badge hs-badge-${statusClass(o.status)}`}>{o.status}</span></span>
                <span className="muted tnum">{o.items?.length ?? '—'}</span>
                <span className="tnum">{money(o.total_cost, o.currency || 'kr')}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---- Order detail: items, status, create invoice ----
export function OrderDetail({ orderId, onBack }: { orderId: number; onBack?: () => void }) {
  const t = useT();
  const toast = useToast();
  const load = useCallback(() => api.getCrmOrder(orderId), [orderId]);
  const { data: order, reload } = useResource<CrmOrder>(load, 0);
  const [addingItem, setAddingItem] = useState(false);
  const [item, setItem] = useState({ description: '', quantity: '1', cost: '' });

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function setStatus(status: string) { await run(async () => { await api.updateCrmOrderStatus(orderId, status); reload(); }, t('common.saved', 'Saved')); }
  async function addItem() {
    if (!item.description.trim()) return;
    await run(async () => {
      await api.addCrmOrderItem(orderId, { description: item.description.trim(), quantity: Number(item.quantity) || 1, material_cost: item.cost ? Number(item.cost) : 0 });
      setAddingItem(false); setItem({ description: '', quantity: '1', cost: '' }); reload();
    }, t('v2.crm.item_added', 'Item added'));
  }
  async function makeInvoice() { await run(async () => { await api.createInvoiceFromOrder(orderId); reload(); }, t('v2.crm.invoiced', 'Invoice created')); }

  if (!order) return <p className="muted" style={{ marginTop: 16 }}>{t('common.loading', 'Loading…')}</p>;
  return (
    <div>
      <div className="panel-head">
        <div>
          <button className="btn btn--sm" onClick={onBack}>← {t('v2.crm.orders', 'Orders')}</button>
          <h2 className="panel-title" style={{ marginTop: 10 }}>{order.order_number}</h2>
          <p className="muted sub">{order.customer_name || '—'}{order.customer_company ? ` · ${order.customer_company}` : ''} · {money(order.total_cost, order.currency || 'kr')}</p>
        </div>
        <div className="inv-head-actions">
          <select className="input" style={{ width: 'auto' }} value={order.status} onChange={(e) => setStatus(e.target.value)}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <button className="btn btn--sm btn--primary" onClick={makeInvoice}>{t('v2.crm.make_invoice', 'Create invoice')}</button>
        </div>
      </div>

      <section className="card">
        <div className="card-head">
          <div className="card-title">{t('v2.crm.items', 'Items')}</div>
          <button className="btn btn--sm" onClick={() => setAddingItem((v) => !v)}>{addingItem ? t('common.close', 'Close') : t('v2.crm.add_item', '+ Add item')}</button>
        </div>
        {addingItem && (
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.crm.desc', 'Description')}</span><input className="input" value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.crm.qty', 'Qty')}</span><input className="input" type="number" min={1} value={item.quantity} onChange={(e) => setItem({ ...item, quantity: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.crm.unit_price', 'Unit cost')}</span><input className="input" type="number" min={0} value={item.cost} onChange={(e) => setItem({ ...item, cost: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={addItem}>{t('v2.inv.add_btn', 'Add')}</button>
          </div>
        )}
        {(order.items ?? []).length === 0 ? <p className="muted empty-note">{t('v2.crm.no_items', 'No items on this order.')}</p> : (
          <div className="lib-list">
            {(order.items ?? []).map((it) => (
              <div className="lib-row" key={it.id} style={{ gridTemplateColumns: '2fr 0.6fr 0.9fr 0.9fr' }}>
                <span className="lib-name">{it.description}</span>
                <span className="muted tnum">×{it.quantity}</span>
                <span className="muted tnum">{money(it.material_cost, order.currency || 'kr')}</span>
                <span className="tnum">{money(it.total_cost, order.currency || 'kr')}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---- Invoices list ----
export function InvoicesTab() {
  const t = useT();
  const { data } = useResource<CrmInvoice[]>(api.listCrmInvoices, 15000);
  const rows = data ?? [];
  return (
    <div style={{ marginTop: 16 }}>
      <section className="card">
        {rows.length === 0 ? <p className="muted empty-note">{t('v2.crm.no_invoices', 'No invoices yet.')}</p> : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: '1fr 1.4fr auto 1fr 1fr' }}>
              <span>{t('v2.crm.invoice_no', 'Invoice')}</span><span>{t('v2.crm.customer', 'Customer')}</span><span>{t('v2.crm.status', 'Status')}</span><span className="tnum">{t('v2.crm.due', 'Due')}</span><span className="tnum">{t('v2.crm.total', 'Total')}</span>
            </div>
            {rows.map((iv) => (
              <div className="lib-row" key={iv.id} style={{ gridTemplateColumns: '1fr 1.4fr auto 1fr 1fr' }}>
                <span className="lib-name">{iv.invoice_number}</span>
                <span className="muted ellipsis">{iv.customer_name || '—'}</span>
                <span><span className={`hs-badge hs-badge-${statusClass(iv.status)}`}>{iv.status}</span></span>
                <span className="muted tnum">{fdate(iv.due_date)}</span>
                <span className="tnum">{money(iv.total, iv.currency || 'kr')}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---- Customer detail: info + their orders & invoices ----
export function CustomerDetail({ customerId, onBack, onOpenOrder }: { customerId: number; onBack?: () => void; onOpenOrder?: (id: string) => void }) {
  const t = useT();
  const { data: customers } = useResource<Customer[]>(api.listCustomers, 0);
  const { data: orders } = useResource<CrmOrder[]>(api.listCrmOrders, 0);
  const { data: invoices } = useResource<CrmInvoice[]>(api.listCrmInvoices, 0);
  const c = (customers ?? []).find((x) => x.id === customerId);
  const myOrders = (orders ?? []).filter((o) => o.customer_id === customerId);
  const myInvoices = (invoices ?? []).filter((iv) => myOrders.some((o) => o.order_number === iv.order_number));

  if (customers && !c) return (
    <div><button className="btn btn--sm" onClick={onBack}>← {t('v2.crm.title', 'Customers')}</button><p className="muted empty-note">{t('v2.crm.gone', 'That customer no longer exists.')}</p></div>
  );
  return (
    <div>
      <div className="panel-head">
        <div>
          <button className="btn btn--sm" onClick={onBack}>← {t('v2.crm.title', 'Customers')}</button>
          <h2 className="panel-title" style={{ marginTop: 10 }}>{c?.name || `#${customerId}`}</h2>
          <p className="muted sub">{[c?.company, c?.email, c?.phone].filter(Boolean).join(' · ') || '—'}</p>
        </div>
      </div>
      <div className="kpis">
        <Kpi label={t('v2.crm.orders', 'Orders')} value={String(myOrders.length)} accent="teal" />
        <Kpi label={t('v2.crm.ov_revenue', 'Revenue')} value={money(c?.total_revenue)} />
        <Kpi label={t('v2.crm.invoices', 'Invoices')} value={String(myInvoices.length)} />
      </div>
      <section className="card">
        <div className="card-title">{t('v2.crm.orders', 'Orders')}</div>
        {myOrders.length === 0 ? <p className="muted empty-note">{t('v2.crm.no_orders', 'No orders yet.')}</p> : (
          <div className="lib-list">
            {myOrders.map((o) => (
              <div className="lib-row lib-row--btn" key={o.id} style={{ gridTemplateColumns: '1fr auto 1fr' }} role="button" tabIndex={0} onClick={() => onOpenOrder?.(String(o.id))}>
                <span className="lib-name">{o.order_number}</span>
                <span><span className={`hs-badge hs-badge-${statusClass(o.status)}`}>{o.status}</span></span>
                <span className="tnum">{money(o.total_cost, o.currency || 'kr')}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: 'teal' | 'blue' }) {
  return <div className="kpi"><div className="kpi-label">{label}</div><div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}</div></div>;
}
