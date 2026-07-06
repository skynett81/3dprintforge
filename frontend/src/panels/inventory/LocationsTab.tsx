import { useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { StorageLocation } from '../../types';

const EMPTY = { name: '', description: '', max_spools: '' };

export function LocationsTab() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<StorageLocation[]>(api.listLocations, 0);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const locations = data ?? [];

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); } catch (e) { toast((e as Error).message, 'error'); }
  }
  function startAdd() { setEditId(null); setForm(EMPTY); setOpen(true); }
  function startEdit(l: StorageLocation) {
    setEditId(l.id);
    setForm({ name: l.name, description: l.description || '', max_spools: l.max_spools != null ? String(l.max_spools) : '' });
    setOpen(true);
  }
  async function submit() {
    if (!form.name.trim()) return;
    const body = { name: form.name.trim(), description: form.description.trim() || undefined, max_spools: form.max_spools ? Number(form.max_spools) : undefined };
    await run(async () => {
      if (editId != null) await api.updateLocation(editId, body);
      else await api.addLocation(body);
      setOpen(false); setEditId(null); setForm(EMPTY); reload();
    }, editId != null ? t('v2.inv.loc_saved', 'Location saved') : t('v2.inv.loc_added', 'Location added'));
  }
  async function remove(l: StorageLocation) {
    if (!confirm(t('v2.inv.loc_confirm', `Delete location "${l.name}"?`))) return;
    await run(async () => { await api.deleteLocation(l.id); reload(); }, t('v2.inv.loc_removed', 'Location removed'));
  }

  return (
    <div>
      <div className="tab-toolbar">
        <span className="muted">{locations.length} {t('v2.inv.location', 'Location')}</span>
        <button className="btn btn--sm btn--primary" onClick={() => (open ? setOpen(false) : startAdd())}>{open ? t('common.close', 'Close') : t('v2.inv.add_location', '+ Add location')}</button>
      </div>

      {open && (
        <section className="card">
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.inv.name', 'Name')}</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Shelf B" /></label>
            <label className="field grow"><span className="field-label">{t('v2.inv.desc', 'Description')}</span><input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.inv.capacity', 'Capacity')}</span><input className="input" type="number" min={0} value={form.max_spools} onChange={(e) => setForm({ ...form, max_spools: e.target.value })} /></label>
            <button className="btn btn--primary" onClick={submit}>{editId != null ? t('common.save', 'Save') : t('v2.inv.add_btn', 'Add')}</button>
          </div>
        </section>
      )}

      {locations.length === 0 ? (
        <section className="card"><p className="muted empty-note">{t('v2.inv.no_locations', 'No storage locations yet.')}</p></section>
      ) : (
        <div className="tile-grid">
          {locations.map((l) => (
            <div className="tile" key={l.id}>
              <div className="tile-top">
                <span className="tile-tag">{t('v2.inv.location', 'Location')}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn--sm btn--ghost" title={t('common.edit', 'Edit')} onClick={() => startEdit(l)}>✎</button>
                  <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => remove(l)}>✕</button>
                </div>
              </div>
              <div className="tile-name">{l.name}</div>
              {l.description && <div className="tile-meta">{l.description}</div>}
              <div className="tile-foot muted">
                {l.max_spools ? `${t('v2.inv.capacity', 'Capacity')}: ${l.max_spools} ${t('v2.inv.spools', 'spools')}` : ''}
                {l.min_weight_kg ? ` · ${t('v2.inv.min', 'min')} ${l.min_weight_kg} kg` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
