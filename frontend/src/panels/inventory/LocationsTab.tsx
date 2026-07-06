import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { StorageLocation, Spool } from '../../types';

const EMPTY = { name: '', description: '', max_spools: '' };

export function LocationsTab() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<StorageLocation[]>(api.listLocations, 0);
  const { data: spoolData } = useResource<Spool[]>(api.listSpools, 30000);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const locations = data ?? [];

  // How many live spools sit in each location (matched by name).
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    (spoolData ?? []).filter((s) => !s.archived && s.location).forEach((s) => { m[s.location as string] = (m[s.location as string] || 0) + 1; });
    return m;
  }, [spoolData]);
  const unassigned = (spoolData ?? []).filter((s) => !s.archived && !s.location).length;

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
        <span className="muted">{locations.length} {t('v2.inv.locations_n', 'locations')}{unassigned > 0 ? ` · ${unassigned} ${t('v2.inv.unassigned', 'unassigned spools')}` : ''}</span>
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
          {locations.map((l) => {
            const used = counts[l.name] || 0;
            const cap = l.max_spools || 0;
            const pct = cap > 0 ? Math.min(100, Math.round((used / cap) * 100)) : 0;
            const full = cap > 0 && used >= cap;
            return (
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
                <div className="tile-foot" style={{ marginTop: 8 }}>
                  <span className={full ? 'low' : 'muted'}>{used}{cap ? ` / ${cap}` : ''} {t('v2.inv.spools', 'spools')}{full ? ` · ${t('v2.inv.full', 'full')}` : ''}</span>
                </div>
                {cap > 0 && <div className="spool-bar" style={{ marginTop: 6 }}><div className={`spool-fill${full ? ' spool-fill--low' : ''}`} style={{ width: `${pct}%` }} /></div>}
                {l.min_weight_kg ? <div className="tile-foot muted">{t('v2.inv.min', 'min')} {l.min_weight_kg} kg</div> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
