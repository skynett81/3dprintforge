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

const CATEGORIES = ['nozzle', 'hotend', 'extruder', 'build_plate', 'multimaterial', 'camera', 'filament_dryer', 'sensor', 'tool', 'other'];

// Category → colour + short monogram, used as a visual when no image is set.
const CAT_META: Record<string, { c: string; m: string }> = {
  nozzle: { c: '#00b3a4', m: 'NZ' }, hotend: { c: '#ef4444', m: 'HE' }, extruder: { c: '#f59e0b', m: 'EX' },
  build_plate: { c: '#22c55e', m: 'BP' }, multimaterial: { c: '#a855f7', m: 'MM' }, camera: { c: '#3b82f6', m: 'CAM' },
  filament_dryer: { c: '#eab308', m: 'DRY' }, sensor: { c: '#06b6d4', m: 'SEN' }, tool: { c: '#64748b', m: 'TL' },
};
function catMeta(cat?: string) { return CAT_META[cat || ''] || { c: '#64748b', m: (cat || '?').slice(0, 2).toUpperCase() }; }

interface Specs { count?: number; detail?: string[]; auto_detected?: boolean }
function parseSpecs(v?: string | null): Specs {
  if (!v) return {};
  try { const o = JSON.parse(v); return o && typeof o === 'object' ? o : {}; } catch { return {}; }
}

export function HardwarePanel() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<HardwareItem[]>(api.listHardware, 30000);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', category: 'nozzle', brand: '', model: '', purchase_price: '', image_url: '' });
  const items = data ?? [];
  const EMPTY = { name: '', category: 'nozzle', brand: '', model: '', purchase_price: '', image_url: '' };

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  function toggleAdd() {
    if (adding) { setAdding(false); setEditId(null); setForm(EMPTY); }
    else { setEditId(null); setForm(EMPTY); setAdding(true); }
  }
  function startEdit(h: HardwareItem) {
    setEditId(h.id);
    setForm({ name: h.name, category: h.category || 'nozzle', brand: h.brand || '', model: h.model || '', purchase_price: h.purchase_price != null ? String(h.purchase_price) : '', image_url: h.image_url || '' });
    setAdding(true);
  }
  async function submit() {
    if (!form.name.trim()) return;
    const body = { name: form.name.trim(), category: form.category, brand: form.brand.trim() || undefined, model: form.model.trim() || undefined, purchase_price: form.purchase_price ? Number(form.purchase_price) : undefined, image_url: form.image_url.trim() || null };
    await run(async () => {
      if (editId != null) await api.updateHardware(editId, body);
      else await api.addHardware(body);
      setAdding(false); setEditId(null); setForm(EMPTY); reload();
    }, editId != null ? t('v2.hw.saved', 'Hardware saved') : t('v2.hw.added', 'Hardware added'));
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
        <button className="btn btn--primary" onClick={toggleAdd}>{adding ? t('common.close', 'Close') : t('v2.hw.add', '+ Add hardware')}</button>
      </div>

      {adding && (
        <section className="card">
          {editId != null && <div className="card-title">{t('v2.hw.edit', 'Edit hardware')}</div>}
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.inv.name', 'Name')}</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.hw.category', 'Category')}</span>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
            <label className="field grow"><span className="field-label">{t('v2.hw.brand', 'Brand')}</span><input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.hw.price', 'Price')}</span><input className="input" type="number" min={0} value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} /></label>
            <label className="field grow"><span className="field-label">{t('v2.hw.image', 'Image URL')}</span><input className="input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></label>
            <button className="btn btn--primary" onClick={submit}>{editId != null ? t('common.save', 'Save') : t('v2.inv.add_btn', 'Add')}</button>
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
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn--sm btn--ghost" title={t('common.edit', 'Edit')} onClick={() => startEdit(h)}>✎</button>
                  <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => remove(h)}>✕</button>
                </div>
              </div>
              <div className="hw-visual">
                {h.image_url
                  ? <img className="hw-img" src={h.image_url} alt={h.name} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  : <span className="hw-badge" style={{ background: catMeta(h.category).c }}>{catMeta(h.category).m}</span>}
              </div>
              <div className="tile-name">{h.name}</div>
              <div className="tile-meta">{[h.brand, h.model].filter(Boolean).join(' ') || '—'}</div>
              {(() => {
                const s = parseSpecs(h.specs);
                const detail = (s.detail || []).filter(Boolean).join(', ');
                return (detail || s.auto_detected || s.count) ? (
                  <div className="hw-status">
                    {detail && <span className="muted ellipsis">{detail}</span>}
                    {s.count && s.count > 1 ? <span className="flag">×{s.count}</span> : null}
                    {s.auto_detected ? <span className="flag flag--ok">{t('v2.hw.auto', 'auto-detected')}</span> : null}
                  </div>
                ) : null;
              })()}
              {compatList(h.compatible_printers) && <div className="tile-foot muted ellipsis">{t('v2.hw.for', 'For')}: {compatList(h.compatible_printers)}</div>}
              {h.purchase_price != null && <div className="tile-foot"><span className="muted">{Math.round(h.purchase_price)} kr</span></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
