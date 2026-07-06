import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { toggle } from '../selection';
import { SpoolDrawer } from '../components/SpoolDrawer';
import type { Spool } from '../types';

function hex(s: Spool) {
  const h = (s.color_hex || '').replace(/^#/, '');
  return h ? `#${h}` : '#666';
}

export function InventoryPanel() {
  const t = useT();
  const toast = useToast();
  const { data, error, loading, reload } = useResource<Spool[]>(api.listSpools);
  const [material, setMaterial] = useState<string>('all');
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const spools = useMemo(() => (data ?? []).filter((s) => !s.archived), [data]);
  const materials = useMemo(
    () => ['all', ...Array.from(new Set(spools.map((s) => s.material).filter(Boolean) as string[])).sort()],
    [spools],
  );
  const shown = material === 'all' ? spools : spools.filter((s) => s.material === material);
  const open = spools.find((s) => s.id === openId) || null;

  const totalKg = spools.reduce((s, x) => s + (x.remaining_weight_g || 0), 0) / 1000;
  const lowCount = spools.filter((s) => s.initial_weight_g > 0 && s.remaining_weight_g / s.initial_weight_g < 0.15).length;

  function clickTile(s: Spool) {
    if (selectMode) setSelected((sel) => toggle(sel, s.id));
    else setOpenId(s.id);
  }
  function exitSelect() { setSelectMode(false); setSelected(new Set()); }

  async function bulk(action: string, extra?: Record<string, unknown>) {
    const ids = [...selected];
    if (ids.length === 0) return;
    try {
      await api.bulkSpools(action, ids, extra);
      toast(`${ids.length} ${t('v2.inventory.updated', 'spools updated')}`, 'success');
      exitSelect();
      reload();
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  function relocate() {
    const loc = prompt(t('v2.inventory.relocate_to', 'Move selected spools to location:'));
    if (loc && loc.trim()) bulk('relocate', { location: loc.trim() });
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.inventory.title', 'Inventory')}</h2>
          <p className="muted sub">
            {spools.length} {t('v2.inventory.spools', 'spools')} · {totalKg.toFixed(1)} {t('v2.inventory.on_hand', 'kg on hand')} · {lowCount} {t('v2.inventory.running_low', 'running low')}
          </p>
        </div>
        <div className="inv-head-actions">
          <button className="btn btn--sm" onClick={() => (selectMode ? exitSelect() : setSelectMode(true))}>
            {selectMode ? t('common.cancel', 'Cancel') : t('v2.inventory.select', 'Select')}
          </button>
          <label className="project-select">
            <span className="field-label">{t('v2.inventory.material', 'Material')}</span>
            <select className="input" value={material} onChange={(e) => setMaterial(e.target.value)}>
              {materials.map((m) => <option key={m} value={m}>{m === 'all' ? t('v2.inventory.all_materials', 'All materials') : m}</option>)}
            </select>
          </label>
        </div>
      </div>

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

      <div className="tile-grid">
        {shown.map((s) => {
          const pct = s.initial_weight_g > 0
            ? Math.max(0, Math.min(100, Math.round((s.remaining_weight_g / s.initial_weight_g) * 100)))
            : 0;
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
              <div className="spool-bar">
                <div className={`spool-fill${low ? ' spool-fill--low' : ''}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="tile-foot">
                <span className={low ? 'low' : 'muted'}>{Math.round(s.remaining_weight_g)} g {t('v2.inventory.left', 'left')}</span>
                <span className="muted"> · {pct}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {open && <SpoolDrawer spool={open} onClose={() => setOpenId(null)} onChanged={reload} />}
    </div>
  );
}
