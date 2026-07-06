import { useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import type { Spool } from '../types';

function hex(s: Spool) {
  const h = (s.color_hex || '').replace(/^#/, '');
  return h ? `#${h}` : '#666';
}

export function InventoryPanel() {
  const { data, error, loading } = useResource<Spool[]>(api.listSpools);
  const [material, setMaterial] = useState<string>('all');

  const spools = useMemo(() => (data ?? []).filter((s) => !s.archived), [data]);
  const materials = useMemo(
    () => ['all', ...Array.from(new Set(spools.map((s) => s.material).filter(Boolean) as string[])).sort()],
    [spools],
  );
  const shown = material === 'all' ? spools : spools.filter((s) => s.material === material);

  const totalKg = spools.reduce((s, x) => s + (x.remaining_weight_g || 0), 0) / 1000;
  const lowCount = spools.filter((s) => s.initial_weight_g > 0 && s.remaining_weight_g / s.initial_weight_g < 0.15).length;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Inventory</h2>
          <p className="muted sub">{spools.length} spools · {totalKg.toFixed(1)} kg on hand · {lowCount} running low</p>
        </div>
        <label className="project-select">
          <span className="field-label">Material</span>
          <select className="input" value={material} onChange={(e) => setMaterial(e.target.value)}>
            {materials.map((m) => <option key={m} value={m}>{m === 'all' ? 'All materials' : m}</option>)}
          </select>
        </label>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">Loading…</p>}

      <div className="tile-grid">
        {shown.map((s) => {
          const pct = s.initial_weight_g > 0
            ? Math.max(0, Math.min(100, Math.round((s.remaining_weight_g / s.initial_weight_g) * 100)))
            : 0;
          const low = pct < 15;
          return (
            <div key={s.id} className="tile">
              <div className="tile-top">
                <span className="swatch" style={{ background: hex(s) }} />
                <span className="tile-tag">{s.material || '—'}</span>
              </div>
              <div className="tile-name">{s.profile_name || s.color_name || `Spool #${s.id}`}</div>
              <div className="tile-meta">{s.vendor_name || 'Unknown vendor'}{s.location ? ` · ${s.location}` : ''}</div>
              <div className="spool-bar">
                <div className={`spool-fill${low ? ' spool-fill--low' : ''}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="tile-foot">
                <span className={low ? 'low' : 'muted'}>{Math.round(s.remaining_weight_g)} g left</span>
                <span className="muted"> · {pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
