import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import { spoolPct } from '../../inventory';
import { SpoolDrawer } from '../../components/SpoolDrawer';
import type { StorageLocation, Spool } from '../../types';

const EMPTY = { name: '', description: '', max_spools: '' };
function hex(s: Spool) { const h = (s.color_hex || '').replace(/^#/, ''); return h ? `#${h}` : '#666'; }

interface Props {
  detail?: string | null;
  onOpen?: (id: string) => void;
  onBack?: () => void;
}

export function LocationsTab({ detail, onOpen, onBack }: Props = {}) {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<StorageLocation[]>(api.listLocations, 0);
  const { data: spoolData, reload: reloadSpools } = useResource<Spool[]>(api.listSpools, 30000);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [openSpoolId, setOpenSpoolId] = useState<number | null>(null);
  const locations = data ?? [];
  const spools = spoolData ?? [];

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    spools.filter((s) => !s.archived && s.location).forEach((s) => { m[s.location as string] = (m[s.location as string] || 0) + 1; });
    return m;
  }, [spools]);
  const unassigned = spools.filter((s) => !s.archived && !s.location).length;

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

  // ---- Detail view: one location and the spools stored in it ----
  const detailLoc = detail ? locations.find((l) => String(l.id) === detail) : null;
  if (detail) {
    if (locations.length === 0) return <p className="muted" style={{ marginTop: 16 }}>{t('common.loading', 'Loading…')}</p>;
    if (!detailLoc) return (
      <div style={{ marginTop: 16 }}>
        <button className="btn btn--sm" onClick={onBack}>← {t('v2.inv.back', 'Back')}</button>
        <p className="muted empty-note">{t('v2.inv.loc_gone', 'That location no longer exists.')}</p>
      </div>
    );
    const here = spools.filter((s) => !s.archived && s.location === detailLoc.name);
    const totalG = here.reduce((a, s) => a + (s.remaining_weight_g || 0), 0);
    const cap = detailLoc.max_spools || 0;
    return (
      <div style={{ marginTop: 16 }}>
        <div className="tab-toolbar" style={{ marginTop: 0 }}>
          <div>
            <button className="btn btn--sm" onClick={onBack}>← {t('v2.inv.back', 'Locations')}</button>
            <h3 style={{ margin: '10px 0 2px' }}>{detailLoc.name}</h3>
            <span className="muted">{here.length}{cap ? ` / ${cap}` : ''} {t('v2.inv.spools', 'spools')} · {(totalG / 1000).toFixed(1)} kg{detailLoc.description ? ` · ${detailLoc.description}` : ''}</span>
          </div>
        </div>
        <section className="card">
          {here.length === 0 ? (
            <p className="muted empty-note">{t('v2.inv.loc_empty', 'No filament stored here.')}</p>
          ) : (
            <div className="lib-list">
              <div className="lib-head" style={{ gridTemplateColumns: 'auto 2fr 0.8fr 1fr 0.8fr' }}>
                <span></span><span>{t('v2.inv.profile', 'Filament')}</span><span>{t('v2.inv.material', 'Material')}</span><span>{t('v2.inv.col_qty', 'Remaining')}</span><span>%</span>
              </div>
              {here.map((s) => {
                const pct = spoolPct(s);
                const low = pct < 15;
                return (
                  <button className="lib-row lib-row--btn" key={s.id} style={{ gridTemplateColumns: 'auto 2fr 0.8fr 1fr 0.8fr' }} onClick={() => setOpenSpoolId(s.id)}>
                    <span className="swatch swatch--sm" style={{ background: hex(s) }} />
                    <span className="lib-name ellipsis">{s.profile_name || s.color_name || `Spool #${s.id}`}</span>
                    <span className="muted">{s.material || '—'}</span>
                    <span className={`tnum${low ? ' low' : ''}`}>{Math.round(s.remaining_weight_g)} g</span>
                    <span className={low ? 'low tnum' : 'muted tnum'}>{pct}%</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
        {openSpoolId != null && spools.find((s) => s.id === openSpoolId) && (
          <SpoolDrawer spool={spools.find((s) => s.id === openSpoolId)!} onClose={() => setOpenSpoolId(null)} onChanged={reloadSpools} />
        )}
      </div>
    );
  }

  // ---- Grid view ----
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
              <div className="tile tile--clickable" key={l.id} onClick={() => onOpen?.(String(l.id))} role="button" tabIndex={0}>
                <div className="tile-top">
                  <span className="tile-tag">{t('v2.inv.location', 'Location')}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn--sm btn--ghost" title={t('common.edit', 'Edit')} onClick={(e) => { e.stopPropagation(); startEdit(l); }}>✎</button>
                    <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); remove(l); }}>✕</button>
                  </div>
                </div>
                <div className="tile-name">{l.name}</div>
                {l.description && <div className="tile-meta">{l.description}</div>}
                <div className="tile-foot" style={{ marginTop: 8 }}>
                  <span className={full ? 'low' : 'muted'}>{used}{cap ? ` / ${cap}` : ''} {t('v2.inv.spools', 'spools')}{full ? ` · ${t('v2.inv.full', 'full')}` : ''}</span>
                  <span className="muted">{t('v2.inv.view', 'view →')}</span>
                </div>
                {cap > 0 && <div className="spool-bar" style={{ marginTop: 6 }}><div className={`spool-fill${full ? ' spool-fill--low' : ''}`} style={{ width: `${pct}%` }} /></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
