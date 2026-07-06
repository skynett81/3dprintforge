import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import { toggle } from '../../selection';
import { spoolPct, isLow, matchesQuery, sortSpools, spoolValue, type SortKey } from '../../inventory';
import { SpoolDrawer } from '../../components/SpoolDrawer';
import type { Spool, FilamentProfile, StorageLocation } from '../../types';

function hex(s: Spool) {
  const h = (s.color_hex || '').replace(/^#/, '');
  return h ? `#${h}` : '#666';
}

export function SpoolsTab({ focusId, onFocusConsumed }: { focusId?: number | null; onFocusConsumed?: () => void }) {
  const t = useT();
  const toast = useToast();
  const { data, error, loading, reload } = useResource<Spool[]>(api.listSpools);
  const [material, setMaterial] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<`${SortKey}:${'asc' | 'desc'}`>('remaining:desc');
  const [lowOnly, setLowOnly] = useState(false);
  const [view, setView] = useState<'table' | 'cards'>(() => {
    try { return (localStorage.getItem('v2.inv.view') as 'table' | 'cards') || 'table'; } catch { return 'table'; }
  });
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ profile_id: '', weight: '1000', location: '' });
  const { data: profiles } = useResource<FilamentProfile[]>(api.listFilaments, 0);
  const { data: locations } = useResource<StorageLocation[]>(api.listLocations, 0);

  const spools = useMemo(() => (data ?? []).filter((s) => !s.archived), [data]);

  // Open the drawer for a spool the Overview tab asked us to focus.
  useEffect(() => {
    if (focusId != null && spools.some((s) => s.id === focusId)) {
      setOpenId(focusId);
      onFocusConsumed?.();
    }
  }, [focusId, spools, onFocusConsumed]);

  const materials = useMemo(
    () => ['all', ...Array.from(new Set(spools.map((s) => s.material).filter(Boolean) as string[])).sort()],
    [spools],
  );
  const shown = useMemo(() => {
    const [key, dir] = sort.split(':') as [SortKey, 'asc' | 'desc'];
    const filtered = spools
      .filter((s) => material === 'all' || s.material === material)
      .filter((s) => matchesQuery(s, query))
      .filter((s) => !lowOnly || isLow(s));
    return sortSpools(filtered, key, dir);
  }, [spools, material, query, lowOnly, sort]);

  const open = spools.find((s) => s.id === openId) || null;
  const totalKg = spools.reduce((s, x) => s + (x.remaining_weight_g || 0), 0) / 1000;
  const lowCount = spools.filter((s) => isLow(s)).length;

  function clickTile(s: Spool) {
    if (selectMode) setSelected((sel) => toggle(sel, s.id));
    else setOpenId(s.id);
  }
  function exitSelect() { setSelectMode(false); setSelected(new Set()); }
  function setViewPersist(v: 'table' | 'cards') { setView(v); try { localStorage.setItem('v2.inv.view', v); } catch { /* ignore */ } }
  function sortBy(key: SortKey) {
    const [curKey, curDir] = sort.split(':') as [SortKey, 'asc' | 'desc'];
    const dir = curKey === key && curDir === 'asc' ? 'desc' : 'asc';
    setSort(`${key}:${dir}`);
  }
  const [sortKey] = sort.split(':') as [SortKey, 'asc' | 'desc'];
  const sortArrow = (key: SortKey) => (sortKey === key ? (sort.endsWith('asc') ? ' ↑' : ' ↓') : '');
  async function bulk(action: string, extra?: Record<string, unknown>) {
    const ids = [...selected];
    if (ids.length === 0) return;
    try {
      await api.bulkSpools(action, ids, extra);
      toast(`${ids.length} ${t('v2.inventory.updated', 'spools updated')}`, 'success');
      exitSelect(); reload();
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  function relocate() {
    const loc = prompt(t('v2.inventory.relocate_to', 'Move selected spools to location:'));
    if (loc && loc.trim()) bulk('relocate', { location: loc.trim() });
  }
  async function addSpool() {
    if (!addForm.profile_id) return;
    const weight = Number(addForm.weight) || 1000;
    try {
      await api.addSpool({ filament_profile_id: Number(addForm.profile_id), initial_weight_g: weight, remaining_weight_g: weight, location: addForm.location || null });
      toast(t('v2.inv.spool_added', 'Spool added'), 'success');
      setAdding(false); setAddForm({ profile_id: '', weight: '1000', location: '' }); reload();
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  return (
    <div>
      <div className="tab-toolbar">
        <span className="muted">{shown.length}/{spools.length} {t('v2.inventory.spools', 'spools')} · {totalKg.toFixed(1)} {t('v2.inventory.on_hand', 'kg on hand')} · {lowCount} {t('v2.inventory.running_low', 'running low')}</span>
        <div className="inv-head-actions">
          <button className="btn btn--sm btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.inv.add_spool', '+ Add spool')}</button>
          <button className="btn btn--sm" onClick={() => (selectMode ? exitSelect() : setSelectMode(true))}>
            {selectMode ? t('common.cancel', 'Cancel') : t('v2.inventory.select', 'Select')}
          </button>
          <div className="viewtoggle">
            <button className={`viewtoggle-btn${view === 'table' ? ' viewtoggle-btn--on' : ''}`} onClick={() => setViewPersist('table')} title={t('v2.inv.view_table', 'Table')}>≣</button>
            <button className={`viewtoggle-btn${view === 'cards' ? ' viewtoggle-btn--on' : ''}`} onClick={() => setViewPersist('cards')} title={t('v2.inv.view_cards', 'Cards')}>▦</button>
          </div>
        </div>
      </div>

      <div className="inv-filters">
        <input className="input" style={{ maxWidth: 240 }} placeholder={t('v2.inv.search_spools', 'Search name, colour, vendor, location…')} value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input" style={{ width: 'auto' }} value={material} onChange={(e) => setMaterial(e.target.value)}>
          {materials.map((m) => <option key={m} value={m}>{m === 'all' ? t('v2.inventory.all_materials', 'All materials') : m}</option>)}
        </select>
        <select className="input" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="remaining:desc">{t('v2.inv.sort_most', 'Most remaining')}</option>
          <option value="remaining:asc">{t('v2.inv.sort_least', 'Least remaining')}</option>
          <option value="pct:asc">{t('v2.inv.sort_pct', 'Lowest %')}</option>
          <option value="name:asc">{t('v2.inv.sort_name', 'Name A–Z')}</option>
          <option value="material:asc">{t('v2.inv.sort_material', 'Material')}</option>
        </select>
        <button className={`chip${lowOnly ? ' chip--on' : ''}`} onClick={() => setLowOnly((v) => !v)}>{t('v2.inv.low_only', 'Low stock')}</button>
      </div>

      {adding && (
        <section className="card">
          <div className="add-form">
            <label className="field grow"><span className="field-label">{t('v2.inv.filament', 'Filament')}</span>
              <select className="input" value={addForm.profile_id} onChange={(e) => setAddForm({ ...addForm, profile_id: e.target.value })}>
                <option value="">{t('v2.inv.pick_profile', 'Pick a filament…')}</option>
                {(profiles ?? []).slice(0, 300).map((p) => <option key={p.id} value={p.id}>{p.name}{p.color_name ? ` — ${p.color_name}` : ''}</option>)}
              </select>
            </label>
            <label className="field"><span className="field-label">{t('v2.inv.weight', 'Weight (g)')}</span><input className="input" type="number" min={1} value={addForm.weight} onChange={(e) => setAddForm({ ...addForm, weight: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.inv.location', 'Location')}</span>
              <select className="input" value={addForm.location} onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}>
                <option value="">—</option>
                {(locations ?? []).map((l) => <option key={l.id} value={l.name}>{l.name}</option>)}
              </select>
            </label>
            <button className="btn btn--primary" onClick={addSpool}>{t('v2.inv.add_btn', 'Add')}</button>
          </div>
        </section>
      )}

      {selectMode && selected.size > 0 && (
        <div className="bulk-bar">
          <span>{selected.size} {t('v2.inventory.selected', 'selected')}</span>
          <div className="bulk-actions">
            <button className="btn btn--sm" onClick={relocate}>{t('v2.inventory.relocate', 'Relocate')}</button>
            <button className="btn btn--sm" onClick={() => bulk('mark_dried')}>{t('v2.inventory.mark_dried', 'Mark dried')}</button>
            <button className="btn btn--sm btn--danger" onClick={() => bulk('archive')}>{t('v2.inventory.archive', 'Archive')}</button>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">{t('common.loading', 'Loading…')}</p>}
      {!loading && shown.length === 0 && <p className="muted empty-note">{t('v2.inv.no_match', 'No spools match your filters.')}</p>}

      {view === 'table' && shown.length > 0 && (
        <div className="stock-table-wrap">
          <table className="stock-table">
            <thead>
              <tr>
                <th></th>
                <th className="th-sort" onClick={() => sortBy('name')}>{t('v2.inv.col_name', 'Filament')}{sortArrow('name')}</th>
                <th className="th-sort" onClick={() => sortBy('material')}>{t('v2.inv.material', 'Material')}{sortArrow('material')}</th>
                <th className="th-sort tnum" onClick={() => sortBy('remaining')}>{t('v2.inv.col_qty', 'Remaining')}{sortArrow('remaining')}</th>
                <th className="th-sort tnum" onClick={() => sortBy('pct')}>%{sortArrow('pct')}</th>
                <th className="tnum">{t('v2.inv.col_value', 'Value')}</th>
                <th>{t('v2.inv.location', 'Location')}</th>
                <th>{t('v2.inv.col_vendor', 'Vendor')}</th>
                <th>{t('v2.inv.col_used', 'Last used')}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => {
                const pct = spoolPct(s);
                const low = pct < 15;
                return (
                  <tr key={s.id} className="stock-row" onClick={() => setOpenId(s.id)}>
                    <td><span className="swatch swatch--sm" style={{ background: hex(s) }} /></td>
                    <td className="stock-name ellipsis">{s.profile_name || s.color_name || `Spool #${s.id}`}</td>
                    <td className="muted">{s.material || '—'}</td>
                    <td className={`tnum${low ? ' low' : ''}`}>{Math.round(s.remaining_weight_g)} g</td>
                    <td className="tnum">
                      <span className="mini-bar"><span className={`mini-fill${low ? ' mini-fill--low' : ''}`} style={{ width: `${pct}%` }} /></span>
                      <span className={low ? 'low' : 'muted'}>{pct}%</span>
                    </td>
                    <td className="tnum muted">{spoolValue(s) ? `${spoolValue(s)} kr` : '—'}</td>
                    <td className="muted ellipsis">{s.location || '—'}</td>
                    <td className="muted ellipsis">{s.vendor_name || '—'}</td>
                    <td className="muted tnum">{s.last_used_at ? new Date(s.last_used_at.replace(' ', 'T')).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {view === 'cards' && <div className="tile-grid">
        {shown.map((s) => {
          const pct = spoolPct(s);
          const low = pct < 15;
          const sel = selected.has(s.id);
          return (
            <button key={s.id} className={`tile tile--clickable${sel ? ' tile--selected' : ''}`} onClick={() => clickTile(s)}>
              <div className="tile-top">
                <span className="swatch" style={{ background: hex(s) }} />
                {selectMode
                  ? <span className={`tile-check${sel ? ' tile-check--on' : ''}`}>{sel ? '✓' : ''}</span>
                  : <span className="tile-tag">{s.material || '—'}</span>}
              </div>
              <div className="tile-name">{s.profile_name || s.color_name || `Spool #${s.id}`}</div>
              <div className="tile-meta">{s.vendor_name || t('v2.inventory.unknown_vendor', 'Unknown vendor')}{s.location ? ` · ${s.location}` : ''}</div>
              <div className="spool-bar"><div className={`spool-fill${low ? ' spool-fill--low' : ''}`} style={{ width: `${pct}%` }} /></div>
              <div className="tile-foot">
                <span className={low ? 'low' : 'muted'}>{Math.round(s.remaining_weight_g)} g {t('v2.inventory.left', 'left')}</span>
                <span className="muted"> · {pct}%</span>
              </div>
            </button>
          );
        })}
      </div>}

      {open && <SpoolDrawer spool={open} onClose={() => setOpenId(null)} onChanged={reload} />}
    </div>
  );
}
