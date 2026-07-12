import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { InvPart, PartCategory } from '../../types';
import { PartDrawer } from '../../components/PartDrawer';

const TYPES = ['component', 'tool', 'consumable', 'material', 'product'];
const UNITS = ['pcs', 'g', 'kg', 'm', 'ml', 'set'];

export function PartsTab({ openPartId }: { openPartId?: number | null } = {}) {
  const t = useT();
  const toast = useToast();
  const { data: partsData, reload } = useResource<InvPart[]>(api.listInvParts, 0);
  const { data: catData, reload: reloadCats } = useResource<PartCategory[]>(api.listPartCategories, 0);
  const parts = useMemo(() => partsData ?? [], [partsData]);
  const cats = catData ?? [];

  const [q, setQ] = useState('');
  const [catFilter, setCatFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [openId, setOpenId] = useState<number | null>(openPartId ?? null);
  useEffect(() => { if (openPartId) setOpenId(openPartId); }, [openPartId]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', ipn: '', category_id: '', type: 'component', unit: 'pcs', min_stock: '' });
  const [newCat, setNewCat] = useState('');

  const filtered = parts.filter((p) => {
    if (q && !(`${p.name} ${p.ipn ?? ''}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (catFilter && String(p.category_id ?? '') !== catFilter) return false;
    if (typeFilter && p.type !== typeFilter) return false;
    return true;
  });
  const lowCount = parts.filter((p) => p.low).length;

  async function addPart() {
    if (!form.name.trim()) { toast(t('v2.parts.name_req', 'Name is required'), 'error'); return; }
    try {
      await api.addInvPart({
        name: form.name.trim(), ipn: form.ipn.trim() || undefined,
        category_id: form.category_id ? Number(form.category_id) : undefined,
        type: form.type, unit: form.unit, min_stock: form.min_stock ? Number(form.min_stock) : 0,
      });
      toast(t('v2.parts.added', 'Part added'), 'success');
      setForm({ name: '', ipn: '', category_id: '', type: 'component', unit: 'pcs', min_stock: '' });
      setAdding(false); reload();
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  async function addCategory() {
    if (!newCat.trim()) return;
    try { await api.addPartCategory({ name: newCat.trim() }); setNewCat(''); reloadCats(); toast(t('v2.parts.cat_added', 'Category added'), 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const r = await api.importPartsCsv(text);
      toast(`${r.created} ${t('v2.parts.imported', 'parts imported')}`, 'success');
      reload();
    } catch (err) { toast((err as Error).message, 'error'); }
  }

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 12 }}>
        <p className="muted sub" style={{ margin: 0 }}>
          {parts.length} {t('v2.parts.parts', 'parts')}{lowCount > 0 ? ` · ${lowCount} ${t('v2.parts.low', 'low on stock')}` : ''}
        </p>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <a className="btn btn--sm btn--ghost" href={api.exportPartsCsvUrl()} download>{t('v2.parts.export', 'Export CSV')}</a>
          <label className="btn btn--sm btn--ghost" style={{ cursor: 'pointer' }}>{t('v2.parts.import', 'Import CSV')}<input type="file" accept=".csv,text/csv" hidden onChange={onImport} /></label>
          <button className="btn btn--primary btn--sm" onClick={() => setAdding((a) => !a)}>{adding ? t('common.cancel', 'Cancel') : t('v2.parts.add', '+ Add part')}</button>
        </div>
      </div>

      {adding && (
        <section className="card" style={{ marginBottom: 14 }}>
          <div className="drawer-fields">
            <label className="field"><span className="field-label">{t('v2.parts.name', 'Name')}</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></label>
            <label className="field"><span className="field-label">{t('v2.parts.ipn', 'Part no. (IPN)')}</span><input className="input" value={form.ipn} onChange={(e) => setForm({ ...form, ipn: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.parts.category', 'Category')}</span>
              <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">{t('v2.parts.uncategorized', '— none —')}</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="field"><span className="field-label">{t('v2.parts.type', 'Type')}</span>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((x) => <option key={x} value={x}>{x}</option>)}</select>
            </label>
            <label className="field"><span className="field-label">{t('v2.parts.unit', 'Unit')}</span>
              <select className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>{UNITS.map((x) => <option key={x} value={x}>{x}</option>)}</select>
            </label>
            <label className="field"><span className="field-label">{t('v2.parts.min_stock', 'Min stock')}</span><input className="input" type="number" min={0} value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: e.target.value })} /></label>
          </div>
          <div className="drawer-controls"><button className="btn btn--primary" onClick={addPart}>{t('common.save', 'Save')}</button></div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10 }}>
            <input className="input" placeholder={t('v2.parts.new_cat', 'New category…')} value={newCat} onChange={(e) => setNewCat(e.target.value)} style={{ maxWidth: 200 }} />
            <button className="btn btn--sm" disabled={!newCat.trim()} onClick={addCategory}>{t('v2.parts.add_cat', 'Add category')}</button>
          </div>
        </section>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input className="input" placeholder={t('v2.parts.search', 'Search name or part no.…')} value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 260 }} />
        <select className="input" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">{t('v2.parts.all_cats', 'All categories')}</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}{c.part_count ? ` (${c.part_count})` : ''}</option>)}
        </select>
        <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ maxWidth: 150 }}>
          <option value="">{t('v2.parts.all_types', 'All types')}</option>
          {TYPES.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>

      <section className="card">
        {filtered.length === 0 ? (
          <p className="muted empty-note">{parts.length === 0 ? t('v2.parts.empty', 'No parts yet. Add tools, components, consumables or finished products.') : t('v2.parts.no_match', 'No parts match the filters.')}</p>
        ) : (
          <div className="err-list">
            {filtered.map((p) => (
              <div className="err-row" key={p.id} style={{ gridTemplateColumns: '1.6fr 1fr auto auto auto', cursor: 'pointer' }} onClick={() => setOpenId(p.id)}>
                <span className="err-msg" style={{ fontWeight: 600 }}>{p.name}{p.ipn ? <span className="muted" style={{ fontWeight: 400 }}> · {p.ipn}</span> : null}</span>
                <span className="muted">{p.category_name || '—'}</span>
                <span className="hs-badge hs-badge-neutral">{p.type}</span>
                <span className="tnum" style={{ fontWeight: 600 }}>{p.total_stock} {p.unit}</span>
                {p.low ? <span className="hs-badge hs-badge-bad">{t('v2.parts.low', 'low')}</span> : <span />}
              </div>
            ))}
          </div>
        )}
      </section>

      {openId != null && <PartDrawer partId={openId} onClose={() => setOpenId(null)} onChanged={reload} />}
    </div>
  );
}
