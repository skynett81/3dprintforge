import { useEffect, useState } from 'react';
import { api } from '../../api';
import { useT } from '../../i18n';
import type { TelemetryPoint } from '../../types';

interface SeriesDef {
  key: keyof TelemetryPoint;
  color: string;
  label: string;
}

// Draw one polyline per numeric series over a shared time axis, auto-scaled.
function Chart({ points, series, width, height }: { points: TelemetryPoint[]; series: SeriesDef[]; width: number; height: number }) {
  const times = points.map((p) => new Date(p.time_bucket).getTime());
  const t0 = Math.min(...times);
  const t1 = Math.max(...times);
  const span = t1 - t0 || 1;
  const values: number[] = [];
  for (const s of series) for (const p of points) { const v = p[s.key]; if (typeof v === 'number') values.push(v); }
  const lo = values.length ? Math.min(...values) : 0;
  const hi = values.length ? Math.max(...values) : 1;
  const range = hi - lo || 1;
  const pad = 4;
  const x = (t: number) => pad + ((t - t0) / span) * (width - 2 * pad);
  const y = (v: number) => height - pad - ((v - lo) / range) * (height - 2 * pad);
  return (
    <svg width={width} height={height} style={{ display: 'block' }} role="img" aria-label="sensor history">
      {series.map((s) => {
        const d = points
          .map((p) => { const v = p[s.key]; return typeof v === 'number' ? `${x(new Date(p.time_bucket).getTime()).toFixed(1)},${y(v).toFixed(1)}` : null; })
          .filter(Boolean)
          .join(' ');
        return d ? <polyline key={String(s.key)} points={d} fill="none" stroke={s.color} strokeWidth={1.5} strokeLinejoin="round" /> : null;
      })}
    </svg>
  );
}

/**
 * Historical sensor graph for one printer. Fetches the last `hours` of
 * telemetry (nozzle / bed / chamber temps) and renders a compact multi-line
 * chart with a legend and min/max readout.
 */
export function SensorGraph({ printerId, hours = 3 }: { printerId: string; hours?: number }) {
  const t = useT();
  const [points, setPoints] = useState<TelemetryPoint[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const to = new Date();
    const from = new Date(to.getTime() - hours * 3600 * 1000);
    api.getTelemetry(printerId, from.toISOString(), to.toISOString())
      .then((data) => { if (alive) { setPoints(data); setErr(null); } })
      .catch((e) => { if (alive) setErr((e as Error).message); });
    return () => { alive = false; };
  }, [printerId, hours]);

  const series: SeriesDef[] = [
    { key: 'nozzle_temp', color: '#e8590c', label: t('v2.guard.nozzle', 'Nozzle') },
    { key: 'bed_temp', color: '#1c7ed6', label: t('v2.guard.bed', 'Bed') },
    { key: 'chamber_temp', color: '#2f9e44', label: t('v2.guard.chamber_t', 'Chamber') },
  ];

  if (err) return <p className="muted" style={{ fontSize: '0.78rem', margin: '6px 0' }}>{t('v2.guard.graph_err', 'Telemetry unavailable')}</p>;
  if (!points) return <p className="muted" style={{ fontSize: '0.78rem', margin: '6px 0' }}>{t('v2.guard.graph_load', 'Loading telemetry…')}</p>;
  const usable = points.filter((p) => series.some((s) => typeof p[s.key] === 'number'));
  if (usable.length < 2) return <p className="muted" style={{ fontSize: '0.78rem', margin: '6px 0' }}>{t('v2.guard.graph_none', 'No telemetry for this window yet.')}</p>;

  return (
    <div>
      <Chart points={usable} series={series} width={248} height={70} />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
        {series.map((s) => (
          <span key={String(s.key)} className="muted" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 3, background: s.color, borderRadius: 2, display: 'inline-block' }} />{s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
