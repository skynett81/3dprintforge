import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { KbPrinterDetail } from './knowledge/KbPrinterDetail';
import type { KbPrinter } from '../types';

interface Props { selected?: string | null; onSelect?: (id: string) => void; onBack?: () => void; }

export function KnowledgePanel({ selected, onSelect, onBack }: Props = {}) {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<KbPrinter[]>(api.listKbPrinters, 0);
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ full_name: '', model: '', release_year: '', build_volume: '', price_usd: '' });
  const EMPTY = { full_name: '', model: '', release_year: '', build_volume: '', price_usd: '' };

  const all = data ?? [];
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s ? all.filter((p) => (p.full_name || p.model).toLowerCase().includes(s)) : all;
    return [...list].sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
  }, [all, q]);

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  function toggleAdd() {
    if (adding) { setAdding(false); setEditId(null); setForm(EMPTY); }
    else { setEditId(null); setForm(EMPTY); setAdding(true); }
  }
  function startEdit(p: KbPrinter) {
    setEditId(p.id);
    setForm({ full_name: p.full_name || '', model: p.model || '', release_year: p.release_year != null ? String(p.release_year) : '', build_volume: p.build_volume || '', price_usd: p.price_usd != null ? String(p.price_usd) : '' });
    setAdding(true);
  }
  async function submit() {
    if (!form.full_name.trim() || !form.model.trim()) { toast(t('v2.kb.need_name', 'Model and full name required'), 'error'); return; }
    const body = {
      model: form.model.trim(), full_name: form.full_name.trim(),
      release_year: form.release_year ? Number(form.release_year) : undefined,
      build_volume: form.build_volume.trim() || undefined,
      price_usd: form.price_usd ? Number(form.price_usd) : undefined,
    };
    await run(async () => {
      if (editId != null) await api.updateKbPrinter(editId, body);
      else await api.addKbPrinter(body);
      setAdding(false); setEditId(null); setForm(EMPTY); reload();
    }, editId != null ? t('v2.kb.saved', 'Printer saved') : t('v2.kb.added', 'Printer added'));
  }
  async function remove(p: KbPrinter) {
    if (!confirm(t('v2.kb.confirm', `Delete "${p.full_name || p.model}"?`))) return;
    await run(async () => { await api.deleteKbPrinter(p.id); reload(); }, t('v2.kb.removed', 'Printer removed'));
  }

  const detail = selected ? all.find((p) => String(p.id) === selected) : null;
  if (selected && all.length > 0) {
    if (detail) return <KbPrinterDetail printer={detail} onBack={onBack} />;
    return (
      <div>
        <button className="btn btn--sm" onClick={onBack}>← {t('v2.kb.title', 'Knowledge base')}</button>
        <p className="muted empty-note">{t('v2.kb.gone', 'That printer is no longer in the knowledge base.')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.kb.title', 'Knowledge base')}</h2>
          <p className="muted sub">{all.length} {t('v2.kb.printers', 'printers')}</p>
        </div>
        <div className="inv-head-actions">
          <input className="input" style={{ width: 'auto', minWidth: 180 }} placeholder={t('v2.kb.search', 'Search printers…')} value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn btn--primary" onClick={toggleAdd}>{adding ? t('common.close', 'Close') : t('v2.kb.add', '+ Add printer')}</button>
        </div>
      </div>

      {adding && (
        <section className="card">
          {editId != null && <div className="card-title">{t('v2.kb.edit', 'Edit printer')}</div>}
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.kb.full_name', 'Full name')}</span><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Bambu Lab X1E" /></label>
            <label className="field"><span className="field-label">{t('v2.kb.model', 'Model')}</span><input className="input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="X1E" /></label>
            <label className="field"><span className="field-label">{t('v2.kb.year', 'Year')}</span><input className="input" type="number" value={form.release_year} onChange={(e) => setForm({ ...form, release_year: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.kb.volume', 'Build volume')}</span><input className="input" value={form.build_volume} onChange={(e) => setForm({ ...form, build_volume: e.target.value })} placeholder="256x256x256" /></label>
            <label className="field"><span className="field-label">{t('v2.kb.price', 'Price $')}</span><input className="input" type="number" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={submit}>{editId != null ? t('common.save', 'Save') : t('v2.inv.add_btn', 'Add')}</button>
          </div>
        </section>
      )}

      <div className="tile-grid">
        {shown.map((p) => (
          <div className="tile tile--clickable" key={p.id} role="button" tabIndex={0} onClick={() => onSelect?.(String(p.id))}>
            <div className="tile-top">
              <span className="tile-tag">{p.release_year || ''}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.price_usd != null && <span className="muted tnum">${p.price_usd}</span>}
                <button className="btn btn--sm btn--ghost" title={t('common.edit', 'Edit')} onClick={(e) => { e.stopPropagation(); startEdit(p); }}>✎</button>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); remove(p); }}>✕</button>
              </div>
            </div>
            <div className="tile-name">{p.full_name || p.model}</div>
            <div className="tile-meta">{p.build_volume || '—'}{p.max_speed ? ` · ${p.max_speed} mm/s` : ''}</div>
            <div className="kb-tags">
              {p.has_ams ? <span className="flag">AMS</span> : null}
              {p.has_enclosure ? <span className="flag">{t('v2.kb.enclosed', 'enclosed')}</span> : null}
              {p.has_camera ? <span className="flag">{t('v2.kb.camera', 'camera')}</span> : null}
            </div>
            <div className="tile-foot muted">{t('v2.inv.view', 'view →')}</div>
          </div>
        ))}
        {shown.length === 0 && <p className="muted">{t('v2.kb.no_match', 'No printers match.')}</p>}
      </div>
    </div>
  );
}
