import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { api } from '../../api';
import { useToast } from '../../toast';
import { useResource } from '../../hooks';
import type { Printer, Spool, FilamentProfile, StorageLocation } from '../../types';
import { SpoolDrawer } from '../../components/SpoolDrawer';

type GroupBy = 'location' | 'material' | 'vendor';

interface Props {
  spools: Spool[];
  printers?: Printer[];
  /** Apply a filament's colour + material to the active slot. */
  onApply?: (color: string, material: string) => void;
  /** Reload the spool list after an edit/add. */
  onChanged?: () => void;
  /** printerId → AMS unit summary (e.g. "AMS 2 Pro"), so the loaded group shows it. */
  amsByPrinter?: Record<string, string>;
}

const hex = (h?: string | null) => (h ? (h.startsWith('#') ? h : '#' + String(h).replace(/^#/, '')) : '#cccccc');
function textColor(h: string): string {
  const x = h.replace(/^#/, ''); if (x.length < 6) return '#fff';
  const r = parseInt(x.slice(0, 2), 16), g = parseInt(x.slice(2, 4), 16), b = parseInt(x.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? '#1a1a1a' : '#fff';
}

/** Filament Manager: the spool library grouped by storage location (or material
 *  / vendor), like BambuStudio's Filament Manager over the real inventory.
 *  Spools loaded on a printer group under that printer; the rest under their
 *  shelf/box location. Click a spool to load its colour + material into the
 *  active slicer slot. Read-only over the existing inventory. */
export function SlicerFilaments({ spools, printers, onApply, onChanged, amsByPrinter }: Props) {
  const t = useT();
  const [q, setQ] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('location');
  const toast = useToast();
  const [editId, setEditId] = useState<number | null>(null);
  const editing = spools.find((s) => s.id === editId) || null;
  // Jump to the full inventory (locations, everything else).
  const goInv = (sub: string) => { window.location.hash = `#/inventory/${sub}`; };
  // Quick add-spool form, inline — no need to leave the slicer.
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ profile_id: '', weight: '1000', location: '' });
  const { data: profiles } = useResource<FilamentProfile[]>(api.listFilaments, 0);
  const { data: locations } = useResource<StorageLocation[]>(api.listLocations, 0);
  async function addSpool() {
    if (!addForm.profile_id) { toast(t('v2.filmgr.pick_profile', 'Pick a filament first'), 'error'); return; }
    const w = Number(addForm.weight) || 1000;
    try {
      await api.addSpool({ filament_profile_id: Number(addForm.profile_id), initial_weight_g: w, remaining_weight_g: w, location: addForm.location || null });
      toast(t('v2.filmgr.spool_added', 'Spool added'), 'success');
      setAdding(false); setAddForm({ profile_id: '', weight: '1000', location: '' }); onChanged?.();
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  const printerName = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of printers ?? []) m.set(p.id, p.name);
    return (id: string) => m.get(id) || id;
  }, [printers]);

  const UNASSIGNED = t('v2.filmgr.unassigned', 'Unassigned');
  function keyOf(s: Spool): string {
    if (groupBy === 'material') return (s.material || 'Other').toUpperCase();
    if (groupBy === 'vendor') return s.vendor_name || t('v2.filmgr.unknown_vendor', 'Unknown vendor');
    // location: loaded-on-a-printer wins (labelled with the AMS unit so it's
    // clear these are the AMS's filaments), then the shelf/box location.
    if (s.printer_id) return `${printerName(s.printer_id)} · ${amsByPrinter?.[s.printer_id] || t('v2.filmgr.loaded_tag', 'loaded')}`;
    return s.location?.trim() || UNASSIGNED;
  }

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const active = spools.filter((s) => !s.archived);
    const filtered = needle
      ? active.filter((s) => `${s.profile_name} ${s.material} ${s.color_name} ${s.vendor_name} ${s.location}`.toLowerCase().includes(needle))
      : active;
    const by: Record<string, Spool[]> = {};
    for (const s of filtered) { (by[keyOf(s)] ??= []).push(s); }
    // Loaded-on-printer groups first, then by count desc, "Unassigned" always last.
    return Object.entries(by).sort((a, b) => {
      const au = a[0] === UNASSIGNED, bu = b[0] === UNASSIGNED;
      if (au !== bu) return au ? 1 : -1;
      const al = a[0].includes(` · ${t('v2.filmgr.loaded_tag', 'loaded')}`), bl = b[0].includes(` · ${t('v2.filmgr.loaded_tag', 'loaded')}`);
      if (groupBy === 'location' && al !== bl) return al ? -1 : 1;
      return b[1].length - a[1].length;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spools, q, groupBy, printerName]);

  return (
    <div className="oslice-filmgr">
      <div className="oslice-filmgr-head">
        <input className="oset-searchinput" style={{ maxWidth: 280 }} placeholder={t('v2.filmgr.search', 'Search filament…')} value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="oslice-filmgr-groupby">
          <span className="muted micro">{t('v2.filmgr.groupby', 'Group by')}</span>
          {(['location', 'material', 'vendor'] as GroupBy[]).map((g) => (
            <button key={g} className={`btn btn--xs${groupBy === g ? '' : ' btn--ghost'}`} onClick={() => setGroupBy(g)}>
              {t(`v2.filmgr.by_${g}`, g === 'location' ? 'Location' : g === 'material' ? 'Material' : 'Vendor')}
            </button>
          ))}
        </div>
        <span className="muted micro" style={{ marginLeft: 'auto' }}>{spools.filter((s) => !s.archived).length} {t('v2.filmgr.spools', 'spools')}</span>
        <div className="oslice-filmgr-actions">
          <button className={`btn btn--xs${adding ? '' : ' btn--primary'}`} title={t('v2.filmgr.add_spool_hint', 'Add a spool')} onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : `＋ ${t('v2.filmgr.add_spool', 'Add spool')}`}</button>
          <button className="btn btn--xs btn--ghost" title={t('v2.filmgr.locations_hint', 'Manage storage locations')} onClick={() => goInv('locations')}>{t('v2.filmgr.locations', 'Locations')}</button>
          <button className="btn btn--xs btn--ghost" title={t('v2.filmgr.inventory_hint', 'Open the full inventory')} onClick={() => goInv('overview')}>{t('v2.filmgr.inventory', 'Inventory →')}</button>
        </div>
      </div>
      {adding && (
        <div className="oslice-filmgr-addform">
          <select className="oset-input" value={addForm.profile_id} onChange={(e) => setAddForm({ ...addForm, profile_id: e.target.value })}>
            <option value="">{t('v2.filmgr.pick_profile', 'Pick a filament…')}</option>
            {(profiles ?? []).slice(0, 400).map((pp) => <option key={pp.id} value={pp.id}>{pp.name}{pp.color_name ? ` — ${pp.color_name}` : ''}</option>)}
          </select>
          <input className="oset-input" style={{ maxWidth: 90 }} type="number" min={1} placeholder={t('v2.inv.weight', 'g')} value={addForm.weight} onChange={(e) => setAddForm({ ...addForm, weight: e.target.value })} />
          <select className="oset-input" style={{ maxWidth: 130 }} value={addForm.location} onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}>
            <option value="">{t('v2.inv.location', 'Location')}</option>
            {(locations ?? []).map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}
          </select>
          <button className="btn btn--sm btn--primary" onClick={addSpool}>{t('v2.inv.add_btn', 'Add')}</button>
        </div>
      )}
      <div className="oslice-filmgr-body">
        {groups.length === 0 && <p className="muted" style={{ padding: 16 }}>{t('v2.filmgr.none', 'No filament in inventory.')}</p>}
        {groups.map(([label, list]) => (
          <div key={label} className="oslice-filmgr-grp">
            <div className={`oslice-filmgr-grph${groupBy === 'material' ? '' : ' oslice-filmgr-grph--plain'}`}>{label} <span className="muted micro">· {list.length}</span></div>
            <div className="oslice-filmgr-grid">
              {list.map((s) => {
                const c = hex(s.color_hex);
                const pct = s.initial_weight_g > 0 ? Math.max(0, Math.min(100, (s.remaining_weight_g / s.initial_weight_g) * 100)) : 0;
                const perG = s.cost && s.initial_weight_g ? (s.cost / s.initial_weight_g) : 0;
                // Stock status (ForgeFilamentManager): Out ≤0g, Low <10% or <50g, else OK.
                const rem = s.remaining_weight_g || 0;
                const stock = rem <= 0 ? 'out' : (pct < 10 || rem < 50) ? 'low' : 'ok';
                return (
                  <div key={s.id} className="oslice-filcard" role="button" tabIndex={0} title={t('v2.filmgr.apply', 'Load into active slot')} onClick={() => onApply?.(c, (s.material || 'PLA'))}>
                    <button className="oslice-filcard-edit" title={t('v2.filmgr.edit', 'Edit spool (weight, cost, location…)')} onClick={(e) => { e.stopPropagation(); setEditId(s.id); }}>✎</button>
                    <span className="oslice-filcard-sw" style={{ background: c, color: textColor(c) }}>{s.material?.[0] ?? '?'}</span>
                    <span className="oslice-filcard-main">
                      <span className="oslice-filcard-name">{s.color_name || s.profile_name || s.material}
                        <span className={`oslice-stock oslice-stock--${stock}`}>{stock === 'out' ? t('v2.filmgr.out', 'Out') : stock === 'low' ? t('v2.filmgr.low', 'Low') : t('v2.filmgr.ok', 'OK')}</span>
                      </span>
                      <span className="oslice-filcard-sub">{s.vendor_name || ''}{s.vendor_name && s.material ? ' · ' : ''}{s.material}</span>
                      <span className="oslice-filcard-bar"><span className="oslice-filcard-fill" style={{ width: `${pct}%`, background: c }} /></span>
                    </span>
                    <span className="oslice-filcard-meta">
                      <span>{Math.round(s.remaining_weight_g)}g</span>
                      {perG > 0 && <span className="muted">{perG.toFixed(2)} kr/g</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {editing && <SpoolDrawer spool={editing} onClose={() => setEditId(null)} onChanged={() => { onChanged?.(); }} />}
    </div>
  );
}
