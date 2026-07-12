import { useState, useEffect, useRef } from 'react';
import { api } from '../../api';
import { useT } from '../../i18n';
import type { HistoryRow, FilamentUsed, PrintCost } from '../../types';

const hex = (h?: string | null) => (h ? `#${String(h).replace(/^#/, '')}` : 'transparent');
const norm = (h?: string | null) => (h ? String(h).replace(/^#/, '') : null);

// Hue + saturation of a hex colour (lightness comes from the thumbnail).
function hueSat(h: string): [number, number] {
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (d === 0) return [0, 0];
  const s = d / (1 - Math.abs(2 * l - 1));
  let hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  hue *= 60; if (hue < 0) hue += 360;
  return [hue, s];
}
// HSL -> RGB with lightness supplied per pixel.
function hslPixel(hue: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((hue / 60) % 2) - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) { r = c; g = x; } else if (hue < 120) { r = x; g = c; } else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; } else if (hue < 300) { r = x; b = c; } else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

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

// Slicer/G-code preview. For a single-colour print we recolour it to the real
// filament colour (luminance-preserving multiply) so it shows what was actually
// printed, with a toggle back to the original slicer render.
function PrintPreview({ id, tintHex, alt }: { id: number; tintHex: string | null; alt: string }) {
  const t = useT();
  const [ok, setOk] = useState(true);
  const [tint, setTint] = useState<boolean>(Boolean(tintHex));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const src = `/api/history/${id}/thumbnail`;

  useEffect(() => {
    if (!tint || !tintHex) return;
    // Same-origin: no crossOrigin (setting it would force a CORS request the
    // server doesn't answer, tainting the canvas and blocking getImageData).
    const img = new Image();
    img.onload = () => {
      const cv = canvasRef.current; if (!cv) return;
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const ctx = cv.getContext('2d'); if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      try {
        const d = ctx.getImageData(0, 0, cv.width, cv.height);
        const p = d.data;
        const [hue, sat] = hueSat(tintHex);
        // Keep each pixel's lightness (the render's shading) but apply the
        // filament's hue+saturation. A grey filament (sat 0) stays grey.
        for (let i = 0; i < p.length; i += 4) {
          const l = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255;
          const [nr, ng, nb] = hslPixel(hue, sat, l);
          p[i] = nr; p[i + 1] = ng; p[i + 2] = nb;
        }
        ctx.putImageData(d, 0, 0);
      } catch { /* tainted — leave as drawn */ }
    };
    img.onerror = () => setOk(false);
    img.src = src;
  }, [id, tintHex, tint, src]);

  if (!ok) return null;
  return (
    <section className="card" style={{ padding: 12, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {tint && tintHex
          ? <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 8 }} />
          : <img src={src} alt={alt} onError={() => setOk(false)} loading="lazy" style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 8 }} />}
      </div>
      {tintHex && (
        <div className="seg" style={{ justifyContent: 'center', marginTop: 10 }}>
          <button className={`seg-btn${tint ? ' seg-btn--on' : ''}`} onClick={() => setTint(true)}>{t('v2.hist.actual_colour', 'Actual colour')}</button>
          <button className={`seg-btn${!tint ? ' seg-btn--on' : ''}`} onClick={() => setTint(false)}>{t('v2.hist.original', 'Original')}</button>
        </div>
      )}
    </section>
  );
}

export function HistoryDetail({ row, onBack }: { row: HistoryRow; onBack?: () => void }) {
  const t = useT();
  const r = row;
  // Enriched detail (real filament colours + cost), fetched by id.
  const [filaments, setFilaments] = useState<FilamentUsed[]>([]);
  const [cost, setCost] = useState<PrintCost | null>(null);
  useEffect(() => {
    let alive = true;
    api.getHistoryDetail(r.id).then((d) => {
      if (!alive) return;
      setFilaments(d.filaments_used ?? []);
      setCost(d.cost ?? null);
    }).catch(() => {});
    return () => { alive = false; };
  }, [r.id]);

  const headerColor = r.filament_color || filaments[0]?.color_hex || null;
  // Only tint when the print used exactly one colour.
  const distinctColours = Array.from(new Set(filaments.map((f) => norm(f.color_hex)).filter(Boolean)));
  const tintHex = distinctColours.length === 1 ? distinctColours[0] : null;

  const SPEED = ['—', 'Silent', 'Standard', 'Sport', 'Ludicrous'];
  const cleanName = (r.filename || '').replace(/\.(3mf|gcode)$/i, '');
  const title = r.model_name || cleanName || t('v2.hist.untitled', 'Untitled print');
  // Only rows with real data (keeps the panel honest instead of a wall of "—").
  const specs: [string, string][] = ([
    [t('v2.history.printer', 'Printer'), r.printer_id],
    [t('v2.hist.file', 'File'), r.filename],
    [t('v2.hist.started', 'Started'), when(r.started_at)],
    [t('v2.hist.finished', 'Finished'), when(r.finished_at)],
    [t('v2.history.duration', 'Duration'), r.duration_seconds ? dur(r.duration_seconds) : null],
    [t('v2.hist.layers', 'Layers'), r.layer_count != null ? String(r.layer_count) : null],
    [t('v2.hist.color_changes', 'Colour changes'), r.color_changes != null ? String(r.color_changes) : null],
    [t('v2.hist.speed', 'Speed'), r.speed_level != null ? (SPEED[r.speed_level] || String(r.speed_level)) : null],
    [t('v2.hist.tray', 'AMS tray'), r.tray_id != null && r.tray_id !== 255 && r.tray_id !== 254 ? String(r.tray_id) : null],
    [t('v2.hist.nozzle', 'Nozzle'), [r.nozzle_type, r.nozzle_diameter ? `${r.nozzle_diameter} mm` : ''].filter(Boolean).join(' · ') || null],
    [t('v2.hist.max_temps', 'Max nozzle / bed'), [r.max_nozzle_temp ? `${r.max_nozzle_temp}°` : null, r.max_bed_temp ? `${r.max_bed_temp}°` : null].filter(Boolean).join(' / ') || null],
    [t('v2.hist.chamber', 'Max chamber'), r.max_chamber_temp ? `${r.max_chamber_temp}°` : null],
  ] as [string, string | null][]).filter((x): x is [string, string] => Boolean(x[1]));
  const filament: [string, string][] = [
    [t('v2.hist.used', 'Used'), r.filament_used_g != null ? `${Math.round(r.filament_used_g)} g` : '—'],
    [t('v2.hist.estimated', 'Estimated'), r.estimated_filament_g != null ? `${Math.round(r.estimated_filament_g)} g` : '—'],
    [t('v2.hist.accuracy', 'Accuracy'), r.filament_accuracy_pct != null ? `${Math.round(r.filament_accuracy_pct)}%` : '—'],
    [t('v2.hist.waste', 'Waste'), r.waste_g != null ? `${Math.round(r.waste_g)} g` : '—'],
    [t('v2.history.filament', 'Type'), [r.filament_brand, r.filament_type].filter(Boolean).join(' ') || '—'],
  ];

  const cur = cost?.currency || 'NOK';
  const money = (v?: number) => `${(v ?? 0).toFixed(2)} ${cur}`;
  const costRows: [string, number | undefined][] = [
    [t('v2.hist.cost_filament', 'Filament'), cost?.filament_cost],
    [t('v2.hist.cost_electricity', 'Electricity'), cost?.electricity_cost],
    [t('v2.hist.cost_wear', 'Wear'), cost?.depreciation_cost],
    [t('v2.hist.cost_labour', 'Labour'), cost?.labor_cost],
    [t('v2.hist.cost_markup', 'Markup'), cost?.markup_amount],
  ];
  const hasCost = cost && (cost.total_cost != null || cost.filament_cost != null);

  return (
    <div>
      <div className="panel-head">
        <div>
          <button className="btn btn--sm" onClick={onBack}>← {t('v2.history.title', 'History')}</button>
          <h2 className="panel-title" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            {headerColor && <span className="swatch" style={{ background: hex(headerColor), width: 20, height: 20 }} />}
            <span className="ellipsis" title={title}>{title}</span>
          </h2>
          <p className="muted sub"><span className={`hs-badge hs-badge-${statusClass(r.status)}`}>{r.status}</span></p>
        </div>
        {r.model_url && <a className="btn btn--sm" href={r.model_url} target="_blank" rel="noreferrer">{r.model_name || t('v2.hist.model', 'Model →')}</a>}
      </div>

      <PrintPreview key={tintHex ?? 'plain'} id={r.id} tintHex={tintHex} alt={t('v2.hist.preview', 'Print preview')} />

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

      {hasCost && (
        <section className="card" style={{ marginTop: 12 }}>
          <div className="card-title">{t('v2.hist.cost', 'Cost')}</div>
          <div className="diag-grid">
            {costRows.filter(([, v]) => v != null && v > 0).map(([k, v]) => (
              <div className="diag-row" key={k}><span className="muted">{k}</span><span className="diag-val">{money(v)}</span></div>
            ))}
            <div className="diag-row" style={{ fontWeight: 700 }}><span>{t('v2.hist.cost_total', 'Total')}</span><span className="diag-val">{money(cost?.total_cost ?? cost?.filament_cost)}</span></div>
          </div>
        </section>
      )}

      {r.notes && (
        <section className="card" style={{ marginTop: 12 }}>
          <div className="card-title">{t('v2.hist.notes', 'Notes')}</div>
          <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>{r.notes}</p>
        </section>
      )}
    </div>
  );
}
