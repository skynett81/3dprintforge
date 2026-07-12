import { useState, useEffect, useRef } from 'react';
import { api } from '../../api';
import { useT } from '../../i18n';
import type { HistoryRow, FilamentUsed, PrintCost, CloudTask } from '../../types';
import { matchCloud, cloudTasksOf } from '../../history-name';
import { Model3D } from './Model3D';

const hex = (h?: string | null) => (h ? `#${String(h).replace(/^#/, '')}` : 'transparent');
const norm = (h?: string | null) => (h ? String(h).replace(/^#/, '') : null);

// Full HSL of a hex colour.
function toHsl(h: string): [number, number, number] {
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  hue *= 60; if (hue < 0) hue += 360;
  return [hue, s, l];
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

// Slicer/G-code preview, recoloured to the real filament colour. The render's
// shading is kept but the colour's hue/saturation AND overall lightness are
// applied, so a white filament reads as white (not the grey slicer render).
function PrintPreview({ id, tintHex, alt, onZoom }: { id: number; tintHex: string | null; alt: string; onZoom?: () => void }) {
  const t = useT();
  const [ok, setOk] = useState(true);
  const [tint, setTint] = useState<boolean>(Boolean(tintHex));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const src = `/api/history/${id}/thumbnail`;

  useEffect(() => {
    if (!tint || !tintHex) return;
    const img = new Image(); // same-origin: no crossOrigin (would taint the canvas)
    img.onload = () => {
      const cv = canvasRef.current; if (!cv) return;
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const ctx = cv.getContext('2d'); if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      try {
        const d = ctx.getImageData(0, 0, cv.width, cv.height);
        const p = d.data;
        const [hue, sat, lT] = toHsl(tintHex);
        for (let i = 0; i < p.length; i += 4) {
          const lum = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255;
          // Base lightness on the target colour, darkened by the render's shading.
          const l = Math.min(1, Math.max(0, lT - (1 - lum) * 0.45));
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
  const imgStyle = { maxWidth: '100%', maxHeight: 340, objectFit: 'contain' as const, borderRadius: 8, cursor: onZoom ? 'zoom-in' : 'default' };
  return (
    <section className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: 0, padding: 12 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onZoom}>
        {tint && tintHex
          ? <canvas ref={canvasRef} style={imgStyle} />
          : <img src={src} alt={alt} onError={() => setOk(false)} loading="lazy" style={imgStyle} />}
      </div>
      {tintHex && (
        <div className="seg" style={{ justifyContent: 'center', marginTop: 10 }}>
          <button className={`seg-btn${tint ? ' seg-btn--on' : ''}`} onClick={() => setTint(true)}>{t('v2.hist.actual_colour', 'Actual colour')}</button>
          <button className={`seg-btn${!tint ? ' seg-btn--on' : ''}`} onClick={() => setTint(false)}>{t('v2.hist.original', 'Slicer render')}</button>
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

  // Bambu cloud enrichment: real design name + full-colour cover render.
  const [cloud, setCloud] = useState<CloudTask | null>(null);
  useEffect(() => {
    let alive = true;
    api.getCloudTasks().then((d) => {
      if (!alive) return;
      setCloud(matchCloud(r.filename, cloudTasksOf(d)));
    }).catch(() => {});
    return () => { alive = false; };
  }, [r.filename]);
  const cloudTitle = cloud?.designTitle && cloud.designTitle !== cloud.title ? cloud.designTitle : null;
  const coverUrl = cloud?.cover || null;
  const [zoom, setZoom] = useState(false); // lightbox open
  const [show3D, setShow3D] = useState(false);
  const [busy3D, setBusy3D] = useState(false);

  // The Bambu cover is rendered in the *sliced* colour. When the AMS remapped
  // to a different real filament, the cover shows the wrong colour — fall back
  // to the recoloured (same-origin) thumbnail so we show what was printed.
  const colorMismatch = (cloud?.amsDetailMapping ?? []).some(
    (m) => m.targetColor && (norm(m.sourceColor) || '').slice(0, 6) !== (norm(m.targetColor) || '').slice(0, 6),
  );
  const useCover = Boolean(coverUrl) && !colorMismatch;
  const zoomSrc = coverUrl || `/api/history/${r.id}/thumbnail`;

  // A cloud match means we can fetch the model's 3MF and show a real 3D view.
  const has3D = Boolean(cloud);
  const open3D = async () => {
    setBusy3D(true);
    try {
      await fetch(`/api/history/${r.id}/fetch-3mf`, { method: 'POST' });
      setShow3D(true);
    } catch { /* Model3D surfaces its own error */ } finally { setBusy3D(false); }
  };
  const onImageClick = () => (has3D ? open3D() : setZoom(true));

  // The AMS mapping records the colour actually loaded at print time
  // (targetColor) — more accurate than the spool matched from the usage log,
  // since the AMS can remap the sliced colour to a different real filament.
  const cloudFilaments: FilamentUsed[] = (cloud?.amsDetailMapping ?? [])
    .map((m, i): FilamentUsed => ({
      spool_id: -1 - i,
      color_hex: (norm(m.targetColor || m.sourceColor) || '').slice(0, 6) || null,
      multi_color_hexes: null,
      material: m.filamentType || null,
      name: null,
      color_name: null,
      used_g: null,
    }))
    .filter((f) => f.color_hex);
  const shownFilaments = cloudFilaments.length ? cloudFilaments : filaments;

  const headerColor = r.filament_color || shownFilaments[0]?.color_hex || null;
  // Only tint when the print used exactly one colour.
  const distinctColours = Array.from(new Set(shownFilaments.map((f) => norm(f.color_hex)).filter(Boolean)));
  const tintHex = distinctColours.length === 1 ? distinctColours[0] : null;

  const SPEED = ['—', 'Silent', 'Standard', 'Sport', 'Ludicrous'];
  const cleanName = (r.filename || '').replace(/\.(3mf|gcode)$/i, '');
  const title = cloudTitle || r.model_name || cleanName || t('v2.hist.untitled', 'Untitled print');
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

  // Headline stats for the hero summary (only those with data).
  const heroStats = ([
    [t('v2.history.duration', 'Duration'), r.duration_seconds ? dur(r.duration_seconds) : null],
    [t('v2.hist.used', 'Filament'), r.filament_used_g != null ? `${Math.round(r.filament_used_g)} g` : null],
    [t('v2.hist.cost', 'Cost'), hasCost ? money(cost?.total_cost ?? cost?.filament_cost) : null],
    [t('v2.hist.layers', 'Layers'), r.layer_count != null ? String(r.layer_count) : null],
  ] as [string, string | null][]).filter((x): x is [string, string] => Boolean(x[1]));

  const preview = useCover ? (
    <section className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, margin: 0 }}>
      <img src={coverUrl!} alt={title} loading="lazy" onClick={onImageClick}
        style={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain', borderRadius: 8, cursor: has3D ? 'pointer' : 'zoom-in' }} />
    </section>
  ) : (
    <PrintPreview key={tintHex ?? 'plain'} id={r.id} tintHex={tintHex} alt={t('v2.hist.preview', 'Print preview')} onZoom={onImageClick} />
  );

  const chip = (f: FilamentUsed) => {
    const multi = (f.multi_color_hexes || '').split(/[,;]/).map((x) => x.trim()).filter(Boolean);
    return (
      <div key={f.spool_id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {multi.length > 1 ? (
          <span style={{ display: 'inline-flex', borderRadius: 5, overflow: 'hidden', width: 22, height: 22, border: '1px solid rgba(128,128,128,0.4)' }}>
            {multi.map((c, i) => <span key={i} style={{ flex: 1, background: hex(c) }} />)}
          </span>
        ) : (
          <span className="swatch" style={{ background: hex(f.color_hex), width: 22, height: 22, border: '1px solid rgba(128,128,128,0.4)' }} />
        )}
        <span style={{ fontWeight: 600 }}>{f.name || [f.material, f.color_name].filter(Boolean).join(' ') || t('v2.hist.filament_unknown', 'Filament')}</span>
      </div>
    );
  };

  const detailCard = (titleKey: string, fallback: string, rows: [string, string][]) => (
    <section className="card" style={{ margin: 0 }}>
      <div className="card-title">{t(titleKey, fallback)}</div>
      <div className="diag-grid">
        {rows.map(([k, v]) => <div className="diag-row" key={k}><span className="muted">{k}</span><span className="diag-val">{v}</span></div>)}
      </div>
    </section>
  );

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 14 }}>
        <button className="btn btn--sm" onClick={onBack}>← {t('v2.history.title', 'History')}</button>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
          <span className={`hs-badge hs-badge-${statusClass(r.status)}`}>{r.status}</span>
          {has3D && (
            <button className="btn btn--sm" onClick={open3D} disabled={busy3D}>
              {busy3D ? t('common.loading', 'Loading…') : `▶ ${t('v2.hist.view_3d', '3D')}`}
            </button>
          )}
          {r.model_url && <a className="btn btn--sm" href={r.model_url} target="_blank" rel="noreferrer">{t('v2.hist.model', 'Model →')}</a>}
        </div>
      </div>

      {/* Hero: preview + summary side by side, stacks on narrow screens */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 260px', maxWidth: 440, display: 'flex' }}>{preview}</div>
        <section className="card" style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: 14, margin: 0 }}>
          <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }} title={title}>
            {headerColor && <span className="swatch" style={{ background: hex(headerColor), width: 22, height: 22, flex: '0 0 auto' }} />}
            <span className="ellipsis">{title}</span>
          </h2>
          {shownFilaments.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>{shownFilaments.map(chip)}</div>
          )}
          {r.notes && (
            <div>
              <div className="muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 4 }}>{t('v2.hist.notes', 'Notes')}</div>
              <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{r.notes}</p>
            </div>
          )}
          {heroStats.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(88px,1fr))', gap: 12, marginTop: 'auto' }}>
              {heroStats.map(([k, v]) => (
                <div key={k}>
                  <div className="muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{k}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Details in a responsive grid rather than a long vertical stack */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
        {detailCard('v2.hist.print', 'Print', specs)}
        {detailCard('v2.history.filament', 'Filament', filament)}
        {hasCost && (
          <section className="card" style={{ margin: 0 }}>
            <div className="card-title">{t('v2.hist.cost', 'Cost')}</div>
            <div className="diag-grid">
              {costRows.filter(([, v]) => v != null && v > 0).map(([k, v]) => (
                <div className="diag-row" key={k}><span className="muted">{k}</span><span className="diag-val">{money(v)}</span></div>
              ))}
              <div className="diag-row" style={{ fontWeight: 700 }}><span>{t('v2.hist.cost_total', 'Total')}</span><span className="diag-val">{money(cost?.total_cost ?? cost?.filament_cost)}</span></div>
            </div>
          </section>
        )}
      </div>

      {zoom && (
        <div
          onClick={() => setZoom(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24, cursor: 'zoom-out' }}
        >
          <img src={zoomSrc} alt={title} style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: 8 }} />
        </div>
      )}

      {show3D && <Model3D id={r.id} onClose={() => setShow3D(false)} />}
    </div>
  );
}
