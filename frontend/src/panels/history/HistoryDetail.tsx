import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useT } from '../../i18n';
import type { HistoryRow, FilamentUsed } from '../../types';

const hex = (h?: string | null) => (h ? `#${String(h).replace(/^#/, '')}` : 'transparent');

function statusClass(s: string) {
  const x = (s || '').toLowerCase();
  if (x === 'completed' || x === 'finished') return 'good';
  if (x === 'failed' || x === 'cancelled') return 'bad';
  return 'warn';
}
function dur(sec?: number) {
  if (!sec) return '—';
  const h = Math.floor(sec / 3600); const m = Math.round((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function when(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function HistoryDetail({ row, onBack }: { row: HistoryRow; onBack?: () => void }) {
  const t = useT();
  const r = row;
  // Slicer/G-code preview of what was printed. Hidden if this print has none.
  const [thumbOk, setThumbOk] = useState(true);
  // Real filament(s)/colours used, resolved from the spool-usage log — so we
  // show what was printed in the correct colours even when the history row's
  // own filament_color is blank.
  const [filaments, setFilaments] = useState<FilamentUsed[]>([]);
  useEffect(() => {
    let alive = true;
    api.getHistoryFilaments(r.id).then((f) => { if (alive) setFilaments(f); }).catch(() => {});
    return () => { alive = false; };
  }, [r.id]);
  const headerColor = r.filament_color || filaments[0]?.color_hex || null;
  const specs: [string, string][] = [
    [t('v2.history.printer', 'Printer'), r.printer_id || '—'],
    [t('v2.hist.started', 'Started'), when(r.started_at)],
    [t('v2.hist.finished', 'Finished'), when(r.finished_at)],
    [t('v2.history.duration', 'Duration'), dur(r.duration_seconds)],
    [t('v2.hist.layers', 'Layers'), r.layer_count != null ? String(r.layer_count) : '—'],
    [t('v2.hist.color_changes', 'Colour changes'), r.color_changes != null ? String(r.color_changes) : '—'],
    [t('v2.hist.nozzle', 'Nozzle'), [r.nozzle_type, r.nozzle_diameter ? `${r.nozzle_diameter} mm` : ''].filter(Boolean).join(' · ') || '—'],
    [t('v2.hist.max_temps', 'Max nozzle / bed'), [r.max_nozzle_temp ? `${r.max_nozzle_temp}°` : null, r.max_bed_temp ? `${r.max_bed_temp}°` : null].filter(Boolean).join(' / ') || '—'],
  ];
  const filament: [string, string][] = [
    [t('v2.hist.used', 'Used'), r.filament_used_g != null ? `${Math.round(r.filament_used_g)} g` : '—'],
    [t('v2.hist.estimated', 'Estimated'), r.estimated_filament_g != null ? `${Math.round(r.estimated_filament_g)} g` : '—'],
    [t('v2.hist.accuracy', 'Accuracy'), r.filament_accuracy_pct != null ? `${Math.round(r.filament_accuracy_pct)}%` : '—'],
    [t('v2.hist.waste', 'Waste'), r.waste_g != null ? `${Math.round(r.waste_g)} g` : '—'],
    [t('v2.history.filament', 'Type'), [r.filament_brand, r.filament_type].filter(Boolean).join(' ') || '—'],
  ];

  return (
    <div>
      <div className="panel-head">
        <div>
          <button className="btn btn--sm" onClick={onBack}>← {t('v2.history.title', 'History')}</button>
          <h2 className="panel-title" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            {headerColor && <span className="swatch" style={{ background: hex(headerColor), width: 20, height: 20 }} />}
            <span className="ellipsis">{r.filename}</span>
          </h2>
          <p className="muted sub"><span className={`hs-badge hs-badge-${statusClass(r.status)}`}>{r.status}</span></p>
        </div>
        {r.model_url && <a className="btn btn--sm" href={r.model_url} target="_blank" rel="noreferrer">{r.model_name || t('v2.hist.model', 'Model →')}</a>}
      </div>

      {thumbOk && (
        <section className="card" style={{ display: 'flex', justifyContent: 'center', padding: 12, marginBottom: 12 }}>
          <img
            src={`/api/history/${r.id}/thumbnail`}
            alt={t('v2.hist.preview', 'Print preview')}
            onError={() => setThumbOk(false)}
            loading="lazy"
            style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 8 }}
          />
        </section>
      )}

      {filaments.length > 0 && (
        <section className="card" style={{ marginBottom: 12 }}>
          <div className="card-title">{t('v2.hist.printed_with', 'Printed with')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {filaments.map((f) => {
              const multi = (f.multi_color_hexes || '').split(/[,;]/).map((x) => x.trim()).filter(Boolean);
              return (
                <div key={f.spool_id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {multi.length > 1 ? (
                    <span style={{ display: 'inline-flex', borderRadius: 5, overflow: 'hidden', width: 24, height: 24, border: '1px solid rgba(128,128,128,0.4)' }}>
                      {multi.map((c, i) => <span key={i} style={{ flex: 1, background: hex(c) }} />)}
                    </span>
                  ) : (
                    <span className="swatch" style={{ background: hex(f.color_hex), width: 24, height: 24, border: '1px solid rgba(128,128,128,0.4)' }} />
                  )}
                  <span>
                    <span style={{ fontWeight: 600 }}>{f.name || [f.material, f.color_name].filter(Boolean).join(' ') || t('v2.hist.filament_unknown', 'Filament')}</span>
                    {f.used_g != null && <span className="muted"> · {Math.round(f.used_g)} g</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="two-col">
        <section className="card">
          <div className="card-title">{t('v2.hist.print', 'Print')}</div>
          <div className="diag-grid">
            {specs.map(([k, v]) => <div className="diag-row" key={k}><span className="muted">{k}</span><span className="diag-val">{v}</span></div>)}
          </div>
        </section>
        <section className="card">
          <div className="card-title">{t('v2.history.filament', 'Filament')}</div>
          <div className="diag-grid">
            {filament.map(([k, v]) => <div className="diag-row" key={k}><span className="muted">{k}</span><span className="diag-val">{v}</span></div>)}
          </div>
        </section>
      </div>

      {r.notes && (
        <section className="card">
          <div className="card-title">{t('v2.hist.notes', 'Notes')}</div>
          <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>{r.notes}</p>
        </section>
      )}
    </div>
  );
}
