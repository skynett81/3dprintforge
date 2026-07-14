import { useState } from 'react';
import { useT } from '../../i18n';

interface Props {
  nozzle: number | null; nozzleT: number | null;
  bed: number | null; bedT: number | null;
  chamber: number | null;
  fanPct: number | null;
  busy: boolean;
  ctl: (action: string, extra?: Record<string, unknown>) => void;
}

/** Bambu-Studio-faithful Device control cluster: an icon temperature column, a
 *  circular XY jog dial, an extruder up/down column and the bed-Z row. Drives
 *  the same gcode-based control endpoint for Bambu (MQTT gcode_line) and
 *  Klipper/Moonraker printers alike. */
export function SlicerDeviceControls({ nozzle, nozzleT, bed, bedT, chamber, fanPct, busy, ctl }: Props) {
  const t = useT();
  const [xyStep, setXyStep] = useState(10);
  const eAmt = 10;
  const [edit, setEdit] = useState<'nozzle' | 'bed' | null>(null);
  const [val, setVal] = useState('');

  const TT = (cur: number | null, tgt: number | null) =>
    `${cur == null ? '—' : Math.round(cur)}${tgt != null ? ` /${Math.round(tgt)}` : ''}`;

  function openEdit(h: 'nozzle' | 'bed', cur: number | null) { setEdit(h); setVal(cur != null ? String(Math.round(cur)) : ''); }
  function applyEdit() {
    if (edit) { const n = Number(val); if (Number.isFinite(n) && n >= 0 && n <= 350) ctl('set_temp', { heater: edit, temp: n }); }
    setEdit(null);
  }

  // Nozzle / bed / chamber icons — thin line glyphs like Bambu's control panel.
  const nozIcon = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 3h8l-1 8H9L8 3zM9 11l-2 4v6h10v-6l-2-4M11 21v-3h2v3" strokeLinejoin="round" /></svg>;
  const bedIcon = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="14" width="18" height="4" rx="1" /><path d="M6 14V9a2 2 0 012-2h8a2 2 0 012 2v5M12 4v3" strokeLinecap="round" /></svg>;
  const chIcon = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h5" strokeLinecap="round" /></svg>;
  const fanIcon = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="2" /><path d="M12 10c0-4 1-6 3-6s2 3-1 5M14 12c4 0 6 1 6 3s-3 2-5-1M12 14c0 4-1 6-3 6s-2-3 1-5M10 12c-4 0-6-1-6-3s3-2 5 1" strokeLinejoin="round" /></svg>;
  const lampIcon = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z" strokeLinecap="round" strokeLinejoin="round" /></svg>;

  return (
    <div className="oslice-devctrl">
      {/* Temperature + fan/lamp icon column */}
      <div className="oslice-devtcol">
        <button className="oslice-devtrow" disabled={busy} onClick={() => openEdit('nozzle', nozzle)} title={t('v2.dev.nozzle', 'Nozzle')}>
          {nozIcon}<span>{TT(nozzle, nozzleT)}</span><small>°C</small>
        </button>
        <button className="oslice-devtrow" disabled={busy} onClick={() => openEdit('bed', bed)} title={t('v2.dev.bed', 'Bed')}>
          {bedIcon}<span>{TT(bed, bedT)}</span><small>°C</small>
        </button>
        <div className="oslice-devtrow oslice-devtrow--ro" title={t('v2.dev.chamber', 'Chamber')}>
          {chIcon}<span>{chamber == null ? '—' : Math.round(chamber)}</span><small>°C</small>
        </div>
        <div className="oslice-devtsep" />
        <div className="oslice-devtrow oslice-devtrow--ro" title={t('v2.dev.fan', 'Fan')}>
          {fanIcon}<span>{fanPct == null ? '—' : `${Math.round(fanPct)}%`}</span>
        </div>
        <button className="oslice-devtrow" disabled={busy} onClick={() => ctl('set_light', { on: true })} title={t('v2.dev.lamp', 'Lamp')}>
          {lampIcon}<span>{t('v2.dev.lamp', 'Lamp')}</span>
        </button>
        {edit && (
          <div className="oslice-devtset">
            <input autoFocus className="oset-input" type="number" value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyEdit(); if (e.key === 'Escape') setEdit(null); }} />
            <button className="btn btn--sm" disabled={busy} onClick={applyEdit}>{t('v2.dev.set', 'Set')}</button>
            <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => { setVal('0'); }}>0</button>
          </div>
        )}
      </div>

      {/* Circular XY jog dial */}
      <div className="oslice-devdialwrap">
        <div className="oslice-devdial">
          <button className="oslice-dialwedge oslice-dialwedge--yp" disabled={busy} onClick={() => ctl('move', { axis: 'Y', dist: xyStep })} aria-label="Y+" />
          <button className="oslice-dialwedge oslice-dialwedge--xp" disabled={busy} onClick={() => ctl('move', { axis: 'X', dist: xyStep })} aria-label="X+" />
          <button className="oslice-dialwedge oslice-dialwedge--ym" disabled={busy} onClick={() => ctl('move', { axis: 'Y', dist: -xyStep })} aria-label="Y-" />
          <button className="oslice-dialwedge oslice-dialwedge--xm" disabled={busy} onClick={() => ctl('move', { axis: 'X', dist: -xyStep })} aria-label="X-" />
          <button className="oslice-dialhome" disabled={busy} onClick={() => ctl('home', {})} title={t('v2.dev.home', 'Home')}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 11l8-6 8 6M6 10v9h12v-9" strokeLinejoin="round" strokeLinecap="round" /></svg>
          </button>
          <span className="oslice-diallbl oslice-diallbl--y">Y</span>
          <span className="oslice-diallbl oslice-diallbl--x">X</span>
          <span className="oslice-diallbl oslice-diallbl--ym">-Y</span>
          <span className="oslice-diallbl oslice-diallbl--xm">-X</span>
        </div>
        <div className="oslice-devstep oslice-devstep--dial">
          {[1, 10].map((s) => <button key={s} className={`btn btn--xs${xyStep === s ? '' : ' btn--ghost'}`} onClick={() => setXyStep(s)}>{s}</button>)}
          <span className="muted micro">mm</span>
        </div>
      </div>

      {/* Extruder up / down */}
      <div className="oslice-devecol">
        <button className="oslice-eb" disabled={busy} onClick={() => ctl('extrude', { amount: Math.abs(eAmt) })} aria-label={t('v2.dev.extrude', 'Extrude')}>▲</button>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3h6l-1 6h-4L9 3zM8 9h8l-1 5H9L8 9zM11 14v5l1 2 1-2v-5" strokeLinejoin="round" /></svg>
        <button className="oslice-eb" disabled={busy} onClick={() => ctl('extrude', { amount: -Math.abs(eAmt) })} aria-label={t('v2.dev.retract', 'Retract')}>▼</button>
        <span className="oslice-eblbl">{t('v2.dev.extruder', 'Extruder')}</span>
      </div>

      {/* Bed Z row */}
      <div className="oslice-devbedrow">
        <button className="btn btn--xs btn--ghost" disabled={busy} onClick={() => ctl('move', { axis: 'Z', dist: 10 })}>↑10</button>
        <button className="btn btn--xs btn--ghost" disabled={busy} onClick={() => ctl('move', { axis: 'Z', dist: 1 })}>↑1</button>
        <span className="oslice-bedlbl">{t('v2.dev.bed', 'Bed')}</span>
        <button className="btn btn--xs btn--ghost" disabled={busy} onClick={() => ctl('move', { axis: 'Z', dist: -1 })}>↓1</button>
        <button className="btn btn--xs btn--ghost" disabled={busy} onClick={() => ctl('move', { axis: 'Z', dist: -10 })}>↓10</button>
      </div>
    </div>
  );
}
