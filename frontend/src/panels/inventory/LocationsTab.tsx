import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import { spoolPct } from '../../inventory';
import { toggle } from '../../selection';
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
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [overLoc, setOverLoc] = useState<string | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
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
  async function moveSpool(spool: Spool, toName: string) {
    if (!toName || toName === (spool.location || '')) return;
    await run(async () => { await api.updateSpool(spool.id, { location: toName }); reloadSpools(); }, `${t('v2.inv.moved', 'Moved to')} ${toName}`);
  }
  async function bulkMove(toName: string) {
    const ids = [...selected];
    if (!toName || ids.length === 0) return;
    await run(async () => { await api.bulkSpools('relocate', ids, { location: toName }); setSelected(new Set()); reloadSpools(); }, `${ids.length} → ${toName}`);
  }
  // Drop a dragged spool onto a location chip.
  async function dropOn(toName: string) {
    setOverLoc(null);
    const ids = dragId != null ? (selected.has(dragId) ? [...selected] : [dragId]) : [...selected];
    setDragId(null);
    if (ids.length === 0) return;
    await run(async () => { await api.bulkSpools('relocate', ids, { location: toName }); setSelected(new Set()); reloadSpools(); }, `${ids.length} → ${toName}`);
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
    const otherLocs = locations.filter((l) => l.name !== detailLoc.name);
    const COLS = 'auto auto 1.6fr 0.7fr 0.9fr 0.5fr 1.1fr';
    return (
      <div style={{ marginTop: 16 }}>
        <div className="tab-toolbar" style={{ marginTop: 0 }}>
          <div>
            <button className="btn btn--sm" onClick={onBack}>← {t('v2.inv.back', 'Locations')}</button>
            <h3 style={{ margin: '10px 0 2px' }}>{detailLoc.name}</h3>
            <span className="muted">{here.length}{cap ? ` / ${cap}` : ''} {t('v2.inv.spools', 'spools')} · {(totalG / 1000).toFixed(1)} kg{detailLoc.description ? ` · ${detailLoc.description}` : ''}</span>
          </div>
        </div>

        {otherLocs.length > 0 && here.length > 0 && (
          <div className="drop-strip">
            <span className="muted micro">{t('v2.inv.drag_hint', 'Drag spools onto a location (or select several and click one):')}</span>
            {otherLocs.map((l) => (
              <div
                key={l.id}
                className={`drop-chip${overLoc === l.name ? ' drop-chip--over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setOverLoc(l.name); }}
                onDragLeave={() => setOverLoc((o) => (o === l.name ? null : o))}
                onDrop={(e) => { e.preventDefault(); dropOn(l.name); }}
                onClick={() => { if (selected.size) bulkMove(l.name); }}
                title={l.name}
              >{l.name}{l.max_spools ? ` (${counts[l.name] || 0}/${l.max_spools})` : ''}</div>
            ))}
          </div>
        )}

        {selected.size > 0 && (
          <div className="bulk-bar">
            <span>{selected.size} {t('v2.inventory.selected', 'selected')}</span>
            <div className="bulk-actions">
              <select className="input input--sm" value="" onChange={(e) => { if (e.target.value) { bulkMove(e.target.value); } }}>
                <option value="">{t('v2.inv.move_selected', 'Move selected to')}…</option>
                {otherLocs.map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}
              </select>
              <button className="btn btn--sm" onClick={() => setSelected(new Set())}>{t('common.cancel', 'Cancel')}</button>
            </div>
          </div>
        )}

        <section className="card">
          {here.length === 0 ? (
            <p className="muted empty-note">{t('v2.inv.loc_empty', 'No filament stored here.')}</p>
          ) : (
            <div className="lib-list">
              <div className="lib-head" style={{ gridTemplateColumns: COLS }}>
                <span></span><span></span><span>{t('v2.inv.profile', 'Filament')}</span><span>{t('v2.inv.material', 'Material')}</span><span>{t('v2.inv.col_qty', 'Remaining')}</span><span>%</span><span>{t('v2.inv.move', 'Move to')}</span>
              </div>
              {here.map((s) => {
                const pct = spoolPct(s);
                const low = pct < 15;
                const sel = selected.has(s.id);
                return (
                  <div
                    className={`lib-row lib-row--btn${sel ? ' lib-row--sel' : ''}${dragId === s.id ? ' lib-row--drag' : ''}`}
                    key={s.id}
                    style={{ gridTemplateColumns: COLS, cursor: 'grab' }}
                    draggable
                    onDragStart={(e) => { setDragId(s.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(s.id)); }}
                    onDragEnd={() => { setDragId(null); setOverLoc(null); }}
                    onClick={() => setOpenSpoolId(s.id)}
                  >
                    <input type="checkbox" checked={sel} onClick={(e) => e.stopPropagation()} onChange={() => setSelected((prev) => toggle(prev, s.id))} />
                    <span className="swatch swatch--sm" style={{ background: hex(s) }} />
                    <span className="lib-name ellipsis">{s.profile_name || s.color_name || `Spool #${s.id}`}</span>
                    <span className="muted">{s.material || '—'}</span>
                    <span className={`tnum${low ? ' low' : ''}`}>{Math.round(s.remaining_weight_g)} g</span>
                    <span className={low ? 'low tnum' : 'muted tnum'}>{pct}%</span>
                    <select
                      className="input input--sm"
                      value=""
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); moveSpool(s, e.target.value); }}
                    >
                      <option value="">{t('v2.inv.move', 'Move to')}…</option>
                      {otherLocs.map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}
                    </select>
                  </div>
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
              <div
                className={`tile tile--clickable${overLoc === l.name ? ' tile--drop' : ''}`}
                key={l.id}
                onClick={() => onOpen?.(String(l.id))}
                role="button"
                tabIndex={0}
                onDragOver={(e) => { e.preventDefault(); setOverLoc(l.name); }}
                onDragLeave={() => setOverLoc((o) => (o === l.name ? null : o))}
                onDrop={(e) => { e.preventDefault(); dropOn(l.name); }}
              >
                <div className="tile-top">
                  <span className="tile-tag">{t('v2.inv.location', 'Location')}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn--sm btn--ghost" title={t('common.edit', 'Edit')} onClick={(e) => { e.stopPropagation(); startEdit(l); }}>✎</button>
                    <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); remove(l); }}>✕</button>
                  </div>
                </div>
                <div className="tile-name">{l.name}</div>
                {l.description && <div className="tile-meta">{l.description}</div>}
                <div className="loc-chips">
                  {spools.filter((s) => !s.archived && s.location === l.name).slice(0, 14).map((s) => (
                    <span
                      key={s.id}
                      className="loc-chip"
                      draggable
                      title={`${s.profile_name || s.color_name || 'Spool'} · ${Math.round(s.remaining_weight_g)} g — drag to move`}
                      style={{ background: hex(s) }}
                      onClick={(e) => { e.stopPropagation(); setOpenSpoolId(s.id); }}
                      onDragStart={(e) => { setDragId(s.id); e.stopPropagation(); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(s.id)); }}
                      onDragEnd={() => { setDragId(null); setOverLoc(null); }}
                    />
                  ))}
                  {used > 14 && <span className="loc-chip-more">+{used - 14}</span>}
                </div>
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
