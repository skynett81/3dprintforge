import { useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Customer } from '../types';

export function CrmPanel() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<Customer[]>(api.listCustomers, 0);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const customers = data ?? [];
  const revenue = customers.reduce((a, c) => a + (c.total_revenue || 0), 0);

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

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.crm.title', 'Customers')}</h2>
          <p className="muted sub">{customers.length} {t('v2.crm.customers', 'customers')} · {Math.round(revenue)} kr {t('v2.crm.revenue', 'revenue')}</p>
        </div>
        <button className="btn btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.crm.add', '+ Add customer')}</button>
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
              <span>{t('v2.crm.name', 'Name')}</span>
              <span>{t('v2.crm.company', 'Company')}</span>
              <span>{t('v2.crm.email', 'Email')}</span>
              <span>{t('v2.crm.orders', 'Orders')}</span>
              <span>{t('v2.crm.revenue', 'Revenue')}</span>
              <span></span>
            </div>
            {customers.map((c) => (
              <div className="lib-row" key={c.id} style={{ gridTemplateColumns: '1.4fr 1.2fr 1.4fr 0.6fr 0.8fr auto' }}>
                <span className="lib-name">{c.name}</span>
                <span className="muted">{c.company || '—'}</span>
                <span className="muted ellipsis">{c.email || '—'}</span>
                <span className="tnum">{c.total_orders || 0}</span>
                <span className="tnum">{Math.round(c.total_revenue || 0)} kr</span>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => remove(c)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
