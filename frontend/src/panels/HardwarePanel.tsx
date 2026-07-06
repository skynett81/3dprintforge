import { useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { HardwareItem } from '../types';

function compatList(v?: string | null): string {
  if (!v) return '';
  try { const a = JSON.parse(v); return Array.isArray(a) ? a.join(', ') : String(v); } catch { return String(v); }
}

const CATEGORIES = ['nozzle', 'hotend', 'build_plate', 'camera', 'filament_dryer', 'tool', 'other'];

export function HardwarePanel() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<HardwareItem[]>(api.listHardware, 30000);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'nozzle', brand: '', model: '', purchase_price: '' });
  const items = data ?? [];

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function add() {
    if (!form.name.trim()) return;
    await run(async () => {
      await api.addHardware({ name: form.name.trim(), category: form.category, brand: form.brand.trim() || undefined, model: form.model.trim() || undefined, purchase_price: form.purchase_price ? Number(form.purchase_price) : undefined });
      setAdding(false); setForm({ name: '', category: 'nozzle', brand: '', model: '', purchase_price: '' }); reload();
    }, t('v2.hw.added', 'Hardware added'));
  }
  async function remove(h: HardwareItem) {
    if (!confirm(t('v2.hw.confirm', `Delete "${h.name}"?`))) return;
    await run(async () => { await api.deleteHardware(h.id); reload(); }, t('v2.hw.removed', 'Hardware removed'));
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.hw.title', 'Hardware')}</h2>
          <p className="muted sub">{items.length} {t('v2.hw.items', 'accessories & parts')}</p>
        </div>
        <button className="btn btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.hw.add', '+ Add hardware')}</button>
      </div>

      {adding && (
        <section className="card">
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.inv.name', 'Name')}</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.hw.category', 'Category')}</span>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
            <label className="field grow"><span className="field-label">{t('v2.hw.brand', 'Brand')}</span><input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.hw.price', 'Price')}</span><input className="input" type="number" min={0} value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={add}>{t('v2.inv.add_btn', 'Add')}</button>
          </div>
        </section>
      )}

      {items.length === 0 ? (
        <section className="card"><p className="muted empty-note">{t('v2.hw.none', 'No hardware tracked yet.')}</p></section>
      ) : (
        <div className="tile-grid">
          {items.map((h) => (
            <div className="tile" key={h.id}>
              <div className="tile-top">
                <span className="tile-tag">{h.category}</span>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => remove(h)}>✕</button>
              </div>
              <div className="tile-name">{h.name}</div>
              <div className="tile-meta">{[h.brand, h.model].filter(Boolean).join(' ') || '—'}</div>
              {compatList(h.compatible_printers) && <div className="tile-foot muted ellipsis">{t('v2.hw.for', 'For')}: {compatList(h.compatible_printers)}</div>}
              {h.purchase_price != null && <div className="tile-foot"><span className="muted">{Math.round(h.purchase_price)} kr</span></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
