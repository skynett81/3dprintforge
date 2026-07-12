import { useState } from 'react';
import { useT } from '../../i18n';
import type { HistoryRow } from '../../types';

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
            {r.filament_color && <span className="swatch" style={{ background: `#${String(r.filament_color).replace(/^#/, '')}`, width: 20, height: 20 }} />}
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
