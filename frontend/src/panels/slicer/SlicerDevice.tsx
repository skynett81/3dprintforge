import { useState } from 'react';
import { api } from '../../api';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { SlicerPrinter } from '../../types';

type Live = Record<string, unknown>;

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : null;
}
/** First finite value among the candidate keys. */
function pick(live: Live, ...keys: string[]): number | null {
  for (const k of keys) { const n = num(live[k]); if (n != null) return n; }
  return null;
}

interface Props { printer: SlicerPrinter | undefined; live: Live | undefined; printers?: SlicerPrinter[]; onSelect?: (id: string) => void; }

/** Bambu-Studio-style Device tab: live camera, temps, motion, extruder,
 *  filament load/unload and print control for the selected printer. Motion,
 *  temperature and extrusion are Klipper/Moonraker (e.g. Snapmaker U1); Bambu
 *  printers get print control, fan and light (the server enforces this). */
export function SlicerDevice({ printer, live, printers, onSelect }: Props) {
  const t = useT();
  const toast = useToast();
  const [step, setStep] = useState(10);
  const [extAmt, setExtAmt] = useState(10);
  const [nozzleSet, setNozzleSet] = useState('');
  const [bedSet, setBedSet] = useState('');
  const [busy, setBusy] = useState(false);
  const [selSlot, setSelSlot] = useState(0);   // active AMS/tool slot for load/unload

  if (!printer) return <div className="oslice-panelbody"><p className="muted" style={{ padding: 16 }}>{t('v2.dev.no_printer', 'No printer connected.')}</p></div>;
  const st = live ?? {};
  const id = printer.id;
  const isBambu = printer.type === 'bambu';
  const tools = printer.colorSlots ?? (printer.multiTool ? 4 : 1);

  async function ctl(action: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    try { await api.controlPrinter(id, action, extra); }
    catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }

  const nozzle = pick(st, 'nozzle_temp', 'nozzle_temper');
  const nozzleT = pick(st, 'nozzle_target', 'nozzle_temp_target', 'nozzle_target_temper');
  const bed = pick(st, 'bed_temp', 'bed_temper');
  const bedT = pick(st, 'bed_target', 'bed_temp_target', 'bed_target_temper');
  const chamber = pick(st, 'chamber_temp', 'chamber_temper');
  const progress = pick(st, 'mc_percent', 'print_progress', 'progress', '_percent');
  const remain = pick(st, 'mc_remaining_time', 'remaining_time');
  const state = String(st.gcode_state ?? st.state ?? st.print_status ?? st.stg_cur ?? '').toUpperCase();
  const printing = /RUN|PRINT|PAUSE|BUSY/.test(state) || (progress != null && progress > 0 && progress < 100);
  const paused = /PAUSE/.test(state);

  const T = (cur: number | null, tgt: number | null) => `${cur == null ? '—' : Math.round(cur)}${tgt != null && tgt > 0 ? ` / ${Math.round(tgt)}` : ''}°`;

  return (
    <div className="oslice-devwrap">
      <div className="oslice-devgrid">
        {/* Camera (MJPEG); a placeholder shows through when there is no feed. */}
        <div className="oslice-devcam">
          <span className="oslice-devcam-ph">{t('v2.dev.nocam', 'No camera feed')}</span>
          <img src={`/api/printers/${encodeURIComponent(id)}/stream.mjpeg`} alt="camera"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
            style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
        </div>

        {/* Control column */}
        <div className="oslice-devctl">
          <div className="oslice-devsec">
            <div className="oslice-devsec-h" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {printers && printers.length > 1
                ? <select className="oset-input" style={{ maxWidth: 160, textTransform: 'none' }} value={printer.id} onChange={(e) => onSelect?.(e.target.value)}>{printers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                : <span>{printer.name}</span>}
              <span style={{ color: printing ? 'var(--o-accent)' : 'var(--o-muted)' }}>{state || (printing ? 'PRINTING' : 'IDLE')}</span>
            </div>
            <div className="oslice-devtemps">
              <span><b>{t('v2.dev.nozzle', 'Nozzle')}</b> {T(nozzle, nozzleT)}</span>
              <span><b>{t('v2.dev.bed', 'Bed')}</b> {T(bed, bedT)}</span>
              {chamber != null && <span><b>{t('v2.dev.chamber', 'Chamber')}</b> {Math.round(chamber)}°</span>}
            </div>
          </div>

          {/* Temperature set — Klipper/Moonraker only */}
          {!isBambu && (
            <div className="oslice-devsec">
              <div className="oslice-devsec-h">{t('v2.dev.temperature', 'Temperature')}</div>
              <div className="oslice-devrow">
                <span>{t('v2.dev.nozzle', 'Nozzle')}</span>
                <input className="oset-input" style={{ width: 64 }} type="number" placeholder={nozzle != null ? String(Math.round(nozzle)) : '°C'} value={nozzleSet} onChange={(e) => setNozzleSet(e.target.value)} />
                <button className="btn btn--sm" disabled={busy} onClick={() => ctl('set_temp', { heater: 'nozzle', temp: Number(nozzleSet) })}>{t('v2.dev.set', 'Set')}</button>
                <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('set_temp', { heater: 'nozzle', temp: 0 })}>{t('v2.dev.off', 'Off')}</button>
              </div>
              <div className="oslice-devrow">
                <span>{t('v2.dev.bed', 'Bed')}</span>
                <input className="oset-input" style={{ width: 64 }} type="number" placeholder={bed != null ? String(Math.round(bed)) : '°C'} value={bedSet} onChange={(e) => setBedSet(e.target.value)} />
                <button className="btn btn--sm" disabled={busy} onClick={() => ctl('set_temp', { heater: 'bed', temp: Number(bedSet) })}>{t('v2.dev.set', 'Set')}</button>
                <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('set_temp', { heater: 'bed', temp: 0 })}>{t('v2.dev.off', 'Off')}</button>
              </div>
            </div>
          )}

          {/* Motion — Klipper/Moonraker only */}
          {!isBambu && (
            <div className="oslice-devsec">
              <div className="oslice-devsec-h">{t('v2.dev.motion', 'Motion')}</div>
              <div className="oslice-devstep">
                {[0.1, 1, 10, 50].map((s) => <button key={s} className={`btn btn--sm${step === s ? '' : ' btn--ghost'}`} onClick={() => setStep(s)}>{s}</button>)}
                <span className="muted micro">mm</span>
              </div>
              <div className="oslice-devjog">
                <button className="oslice-jogb" style={{ gridArea: 'yp' }} disabled={busy} onClick={() => ctl('move', { axis: 'Y', dist: step })}>Y+</button>
                <button className="oslice-jogb" style={{ gridArea: 'xm' }} disabled={busy} onClick={() => ctl('move', { axis: 'X', dist: -step })}>X−</button>
                <button className="oslice-jogb oslice-jogb--home" style={{ gridArea: 'ho' }} disabled={busy} onClick={() => ctl('home', {})}>{t('v2.dev.home', 'Home')}</button>
                <button className="oslice-jogb" style={{ gridArea: 'xp' }} disabled={busy} onClick={() => ctl('move', { axis: 'X', dist: step })}>X+</button>
                <button className="oslice-jogb" style={{ gridArea: 'ym' }} disabled={busy} onClick={() => ctl('move', { axis: 'Y', dist: -step })}>Y−</button>
                <button className="oslice-jogb" style={{ gridArea: 'zp' }} disabled={busy} onClick={() => ctl('move', { axis: 'Z', dist: step })}>Z+</button>
                <button className="oslice-jogb" style={{ gridArea: 'zm' }} disabled={busy} onClick={() => ctl('move', { axis: 'Z', dist: -step })}>Z−</button>
              </div>
            </div>
          )}

          {/* Extruder + filament */}
          {!isBambu && (
            <div className="oslice-devsec">
              <div className="oslice-devsec-h">{t('v2.dev.extruder', 'Extruder / filament')}</div>
              <div className="oslice-devrow">
                <input className="oset-input" style={{ width: 56 }} type="number" value={extAmt} onChange={(e) => setExtAmt(Number(e.target.value))} />
                <span className="muted micro">mm</span>
                <button className="btn btn--sm" disabled={busy} onClick={() => ctl('extrude', { amount: Math.abs(extAmt) })}>{t('v2.dev.extrude', 'Extrude')}</button>
                <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('extrude', { amount: -Math.abs(extAmt) })}>{t('v2.dev.retract', 'Retract')}</button>
              </div>
              {Array.from({ length: tools }).map((_, i) => (
                <div className="oslice-devrow" key={i}>
                  <span style={{ minWidth: 44 }}>{tools > 1 ? `T${i}` : t('v2.dev.filament', 'Filament')}</span>
                  {tools > 1 && <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('select_tool', { tool: i })}>{t('v2.dev.select', 'Select')}</button>}
                  <button className="btn btn--sm" disabled={busy} onClick={() => ctl('filament', { op: 'load', tool: i })}>{t('v2.dev.load', 'Load')}</button>
                  <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('filament', { op: 'unload', tool: i })}>{t('v2.dev.unload', 'Unload')}</button>
                </div>
              ))}
            </div>
          )}

          {/* AMS — faithful to BambuStudio: unit selector, humidity + dry, A1-A4
              tabs, cartridge (material + colour + edit), converging feed lines to
              the nozzle, separate Ext, and the Auto-refill / Unload / Load row. */}
          {(printer.ams?.length ?? 0) > 0 && (() => {
            const N = printer.ams!.length;
            const SW = 50, GAP = 8, stepX = SW + GAP, W = N * SW + (N - 1) * GAP;
            const pen = (
              <svg className="oslice-amspen" viewBox="0 0 24 24" width="9" height="9"><path d="M3 17.2V21h3.8L18 9.8l-3.8-3.8L3 17.2zM20.7 6.3a1 1 0 000-1.4l-2.6-2.6a1 1 0 00-1.4 0l-1.8 1.8L18.9 8l1.8-1.7z" fill="currentColor" /></svg>
            );
            const cart = (color: string, mat: string, label: string, key: string, idx: number) => {
              const c = color?.startsWith('#') ? color : '#' + String(color || 'cccccc').replace(/^#/, '');
              const on = idx >= 0 && idx === selSlot;
              return (
                <div key={key} className="oslice-amsslot">
                  <div className={`oslice-amsslot-tab${on ? ' oslice-amsslot-tab--on' : ''}`}>{label}</div>
                  <button className={`oslice-amsslot-cart${on ? ' oslice-amsslot-cart--on' : ''}`} title={mat} onClick={() => idx >= 0 && setSelSlot(idx)}>
                    <div className="oslice-amsslot-mat">{mat}</div>
                    <div className="oslice-amsslot-color" style={{ background: c }}>{pen}</div>
                  </button>
                </div>
              );
            };
            return (
              <div className="oslice-devsec">
                <div className="oslice-devsec-h">{printer.multiTool ? t('v2.dev.tools', 'Tools') : t('v2.dev.ams', 'AMS')}</div>
                {/* AMS unit selector pill with the loaded colours as dots */}
                <div className="oslice-amssel">
                  {printer.ams!.map((a) => <span key={a.slot} className="oslice-amsseldot" style={{ background: a.color?.startsWith('#') ? a.color : '#' + String(a.color || 'ccc').replace(/^#/, '') }} />)}
                </div>
                <div className="oslice-amsrow">
                  <div className="oslice-amsunit">
                    <div className="oslice-amsunit-top">
                      <span className="oslice-amsdrop" />{printer.amsHumidity != null ? `${Math.round(printer.amsHumidity)}%` : ''}
                      <svg className="oslice-amssun" viewBox="0 0 24 24" width="11" height="11"><circle cx="12" cy="12" r="4.5" fill="#f0a83a" /><g stroke="#f0a83a" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" /></g></svg>
                    </div>
                    <div className="oslice-amsslots">
                      {printer.ams!.map((a) => cart(a.color, a.material, printer.multiTool ? `T${a.slot - 1}` : `A${a.slot}`, String(a.slot), a.slot - 1))}
                    </div>
                    {/* converging feed lines → nozzle */}
                    <svg className="oslice-amsfeed" viewBox={`0 0 ${W} 26`} width={W} height="26" preserveAspectRatio="none">
                      {printer.ams!.map((_, i) => { const x = i * stepX + SW / 2; return <path key={i} d={`M${x} 0 C ${x} 13 ${W / 2} 10 ${W / 2} 20`} stroke="var(--o-border)" strokeWidth="2" fill="none" />; })}
                      <path d={`M${W / 2 - 5} 20 h10 l-5 6 z`} fill="var(--o-muted)" opacity="0.6" />
                    </svg>
                  </div>
                  {printer.external && (
                    <div className="oslice-amsunit oslice-amsext">
                      <div className="oslice-amsext-h">{t('v2.dev.ext', 'Ext')}</div>
                      <div className="oslice-amsslots">{cart(printer.external.color, printer.external.material, 'Ext', 'ext', -1)}</div>
                    </div>
                  )}
                </div>
                <div className="oslice-amsbtns">
                  <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('filament', { op: 'change', tool: selSlot })}>{t('v2.dev.autorefill', 'Auto-refill')}</button>
                  <span className="muted micro" style={{ marginLeft: 6 }}>{printer.multiTool ? `T${selSlot}` : `A${selSlot + 1}`}</span>
                  <span style={{ flex: 1 }} />
                  <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('filament', { op: 'unload', tool: selSlot })}>{t('v2.dev.unload', 'Unload')}</button>
                  <button className="btn btn--sm" disabled={busy} onClick={() => ctl('filament', { op: 'load', tool: selSlot })}>{t('v2.dev.load', 'Load')}</button>
                </div>
              </div>
            );
          })()}

          {/* Fan + light — all connectors */}
          <div className="oslice-devsec">
            <div className="oslice-devsec-h">{t('v2.dev.misc', 'Fan / light')}</div>
            <div className="oslice-devstep">
              {[0, 50, 100].map((p) => <button key={p} className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('set_fan', { percent: p })}>{t('v2.dev.fan', 'Fan')} {p}%</button>)}
            </div>
            <div className="oslice-devstep">
              <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('set_light', { on: true })}>{t('v2.dev.light_on', 'Light on')}</button>
              <button className="btn btn--sm btn--ghost" disabled={busy} onClick={() => ctl('set_light', { on: false })}>{t('v2.dev.light_off', 'Light off')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Print progress + control */}
      <div className="oslice-devprog">
        <div className="oslice-devprog-bar"><div className="oslice-devprog-fill" style={{ width: `${Math.max(0, Math.min(100, progress ?? 0))}%` }} /></div>
        <div className="oslice-devprog-row">
          <span>{progress != null ? `${Math.round(progress)}%` : '—'}{remain != null && remain > 0 ? ` · ${Math.round(remain)} min ${t('v2.dev.left', 'left')}` : ''}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {printing && !paused && <button className="btn btn--sm" disabled={busy} onClick={() => ctl('pause')}>{t('v2.dev.pause', 'Pause')}</button>}
            {paused && <button className="btn btn--sm" disabled={busy} onClick={() => ctl('resume')}>{t('v2.dev.resume', 'Resume')}</button>}
            {printing && <button className="btn btn--sm btn--danger" disabled={busy} onClick={() => { if (window.confirm(t('v2.dev.stop_confirm', 'Stop the print?'))) ctl('stop'); }}>{t('v2.dev.stop', 'Stop')}</button>}
          </span>
        </div>
      </div>
    </div>
  );
}
