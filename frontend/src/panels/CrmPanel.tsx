import { useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { CrmOverview, OrdersTab, OrderDetail, InvoicesTab, CustomerDetail } from './crm/CrmTabs';
import type { Customer } from '../types';

type Tab = 'overview' | 'customers' | 'orders' | 'invoices';
const TABS: Tab[] = ['overview', 'customers', 'orders', 'invoices'];

interface Props { sub?: string | null; detail?: string | null; onNav?: (slug: string, detail?: string | null) => void }

export function CrmPanel({ sub, detail, onNav }: Props = {}) {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<Customer[]>(api.listCustomers, 0);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const customers = data ?? [];
  const revenue = customers.reduce((a, c) => a + (c.total_revenue || 0), 0);
  const tab: Tab = (sub && (TABS as string[]).includes(sub) ? sub : 'overview') as Tab;

  async function add() {
    if (!form.name.trim()) return;
    try {
      await api.addCustomer({ name: form.name.trim(), email: form.email.trim() || undefined, company: form.company.trim() || undefined });
      toast(t('v2.crm.added', 'Customer added'), 'success');
      setAdding(false); setForm({ name: '', email: '', company: '' }); reload();
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function remove(c: Customer) {
    if (!confirm(t('v2.crm.confirm', `Remove customer "${c.name}"?`))) return;
    try { await api.deleteCustomer(c.id); toast(t('v2.crm.removed', 'Customer removed'), 'success'); reload(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  // Detail drilldowns
  if (sub === 'customers' && detail) return <CustomerDetail customerId={Number(detail)} onBack={() => onNav?.('customers')} onOpenOrder={(id) => onNav?.('orders', id)} />;
  if (sub === 'orders' && detail) return <OrderDetail orderId={Number(detail)} onBack={() => onNav?.('orders')} />;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.crm.title2', 'CRM')}</h2>
          <p className="muted sub">{customers.length} {t('v2.crm.customers', 'customers')} · {Math.round(revenue)} kr {t('v2.crm.revenue', 'revenue')}</p>
        </div>
        <div className="seg">
          {([['overview', t('v2.crm.tab_overview', 'Overview')], ['customers', t('v2.crm.tab_customers', 'Customers')], ['orders', t('v2.crm.tab_orders', 'Orders')], ['invoices', t('v2.crm.tab_invoices', 'Invoices')]] as [Tab, string][]).map(([id, lb]) => (
            <button key={id} className={`seg-btn${tab === id ? ' seg-btn--on' : ''}`} onClick={() => onNav?.(id)}>{lb}</button>
          ))}
        </div>
      </div>

      {tab === 'overview' && <CrmOverview />}
      {tab === 'orders' && <OrdersTab onOpen={(id) => onNav?.('orders', id)} />}
      {tab === 'invoices' && <InvoicesTab />}

      {tab === 'customers' && (<>
        <div className="tab-toolbar" style={{ marginTop: 16 }}>
          <span className="muted">{customers.length} {t('v2.crm.customers', 'customers')}</span>
          <button className="btn btn--sm btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.crm.add', '+ Add customer')}</button>
        </div>
        {adding && (
          <section className="card">
            <div className="add-form">
              <label className="field grow"><span className="field-label">{t('v2.crm.name', 'Name')}</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label className="field grow"><span className="field-label">{t('v2.crm.email', 'Email')}</span><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label className="field grow"><span className="field-label">{t('v2.crm.company', 'Company')}</span><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
              <button className="btn btn--primary" onClick={add}>{t('v2.crm.add_btn', 'Add')}</button>
            </div>
          </section>
        )}
        <section className="card">
          {customers.length === 0 ? (
            <p className="muted empty-note">{t('v2.crm.none', 'No customers yet.')}</p>
          ) : (
            <div className="lib-list">
              <div className="lib-head" style={{ gridTemplateColumns: '1.4fr 1.2fr 1.4fr 0.6fr 0.8fr auto' }}>
                <span>{t('v2.crm.name', 'Name')}</span><span>{t('v2.crm.company', 'Company')}</span><span>{t('v2.crm.email', 'Email')}</span><span>{t('v2.crm.orders', 'Orders')}</span><span>{t('v2.crm.revenue', 'Revenue')}</span><span></span>
              </div>
              {customers.map((c) => (
                <div className="lib-row lib-row--btn" key={c.id} style={{ gridTemplateColumns: '1.4fr 1.2fr 1.4fr 0.6fr 0.8fr auto' }} role="button" tabIndex={0} onClick={() => onNav?.('customers', String(c.id))}>
                  <span className="lib-name">{c.name}</span>
                  <span className="muted">{c.company || '—'}</span>
                  <span className="muted ellipsis">{c.email || '—'}</span>
                  <span className="tnum">{c.total_orders || 0}</span>
                  <span className="tnum">{Math.round(c.total_revenue || 0)} kr</span>
                  <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); remove(c); }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </>)}
    </div>
  );
}
