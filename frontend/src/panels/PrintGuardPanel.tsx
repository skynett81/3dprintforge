import { useEffect, useMemo, useState, Fragment } from 'react';
import { api } from '../api';
import { useResource, useLivePrinters } from '../hooks';
import { readLive, isPrinting } from '../live';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { ProtectionEvent, GuardStatus, Printer } from '../types';
import { CameraSnapshot } from './guard/CameraSnapshot';
import { SensorGraph } from './guard/SensorGraph';
import { WallMode, type WallTile } from './guard/WallMode';
import { useAlertNotifications } from './guard/useAlertNotifications';

const temp = (v?: number | null) => (v == null ? '—' : `${Math.round(v)}°`);

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function hm(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
function label(k: string) {
  return k.replace(/_action$/, '').replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}
const WEEK = 7 * 24 * 60 * 60 * 1000;

export function PrintGuardPanel() {
  const t = useT();
  const toast = useToast();
  const { data: printersData } = useResource<Printer[]>(api.listPrinters, 30000);
  const { data: logData, reload } = useResource<ProtectionEvent[]>(api.getProtectionLog, 15000);
  const { live, connected } = useLivePrinters();
  const [statuses, setStatuses] = useState<Record<string, GuardStatus>>({});
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [graphFor, setGraphFor] = useState<string | null>(null);
  const [wall, setWall] = useState(false);
  const [notify, setNotify] = useState(false);

  // Save one setting, optimistically updating the local card.
  async function saveSetting(pid: string, key: string, value: unknown) {
    setStatuses((prev) => (prev[pid] ? { ...prev, [pid]: { ...prev[pid], settings: { ...prev[pid].settings, [key]: value } } } : prev));
    try { await api.updateGuardSettings(pid, { [key]: value }); }
    catch (e) { toast((e as Error).message, 'error'); setTick((n) => n + 1); }
  }

  // Toggle a Bambu xcam AI detector straight from the card.
  async function toggleXcam(pid: string, field: string, enable: boolean) {
    try {
      await api.setXcam(pid, field, enable);
      toast(enable ? t('v2.guard.detector_on', 'Detector enabled') : t('v2.guard.detector_off', 'Detector disabled'), 'success');
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  const THRESHOLDS: [string, string][] = [
    ['temp_deviation_threshold', '°C'], ['filament_low_pct', '%'], ['stall_minutes', 'min'],
    ['ams_humidity_threshold', '%'], ['heater_health_minutes', 'min'], ['cooldown_seconds', 'sec'],
  ];

  const printers = useMemo(() => printersData ?? [], [printersData]);
  const events = useMemo(() => [...(logData ?? [])].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)), [logData]);
  const { permission, request: requestNotify } = useAlertNotifications(events, notify);

  async function toggleNotify() {
    if (notify) { setNotify(false); return; }
    const p = permission === 'granted' ? 'granted' : await requestNotify();
    setNotify(true);
    if (p === 'denied') toast(t('v2.guard.notify_blocked', 'Notifications are blocked in the browser; sound only'), 'error');
  }

  // Fetch each printer's guard status (settings + active alerts).
  useEffect(() => {
    let alive = true;
    Promise.all(printers.map((p) => api.getGuardStatus(p.id).then((s) => [p.id, s] as const).catch(() => null)))
      .then((pairs) => { if (alive) setStatuses(Object.fromEntries(pairs.filter(Boolean) as [string, GuardStatus][])); });
    return () => { alive = false; };
  }, [printers, tick]);

  async function act(key: string, fn: () => Promise<unknown>, ok?: string) {
    setBusy(key);
    try { await fn(); if (ok) toast(ok, 'success'); setTick((n) => n + 1); reload(); }
    catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(null); }
  }

  function reliability(printerId: string) {
    const now = Date.now();
    const week = events.filter((e) => e.printer_id === printerId && now - new Date(e.timestamp).getTime() < WEEK);
    const byType: Record<string, number> = {};
    for (const e of week) byType[e.event_type] = (byType[e.event_type] || 0) + 1;
    const top = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
    return { total: week.length, top: top?.[0] ?? null, lastAt: week[0]?.timestamp ?? null };
  }

  function watchState(s: GuardStatus | undefined, printing: boolean, activeAlerts: number): { text: string; cls: string } {
    if (!s || !s.settings) return { text: t('v2.guard.unknown', 'Unknown'), cls: 'neutral' };
    if (!s.settings.enabled) return { text: t('v2.guard.off', 'Off'), cls: 'neutral' };
    const sn = s.settings.snooze_until;
    if (sn && Date.now() < new Date(sn).getTime()) return { text: `${t('v2.guard.snoozed', 'Snoozed')} → ${hm(sn)}`, cls: 'warn' };
    if (activeAlerts > 0) return { text: `⚠ ${t('v2.guard.alert', 'Alert')}`, cls: 'bad' };
    if (printing) return { text: `● ${t('v2.guard.watching', 'Watching')}`, cls: 'good' };
    return { text: t('v2.guard.armed', 'Armed'), cls: 'neutral' };
  }

  const openAlerts = events.filter((e) => !e.resolved).length;
  const rows = showResolved ? events : events.filter((e) => !e.resolved);

  const tiles: WallTile[] = printers.map((p) => {
    const s = statuses[p.id];
    const l = readLive((live[p.id] ?? {}) as Record<string, unknown>);
    const printing = isPrinting(l);
    const activeAlerts = s?.alerts?.filter((a) => !a.resolved).length ?? 0;
    return { id: p.id, name: p.name || p.id, printing, progress: l.progress, file: l.file, nozzle: l.nozzle, bed: l.bed, state: watchState(s, printing, activeAlerts), alerts: activeAlerts };
  });

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.guard.title', 'Print Guard')}</h2>
          <p className="muted sub">{printers.length} {t('v2.guard.printers', 'printers')} · {openAlerts} {t('v2.guard.open', 'open alerts')}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
          <button className={`btn btn--sm${notify ? '' : ' btn--ghost'}`} onClick={toggleNotify} title={t('v2.guard.notify_hint', 'Sound + browser notification on new alerts')}>
            {notify ? t('v2.guard.notify_on', '🔔 Alerts on') : t('v2.guard.notify_off', '🔕 Alerts off')}
          </button>
          <button className="btn btn--sm" disabled={printers.length === 0} onClick={() => setWall(true)}>{t('v2.guard.wall', 'Wall mode')}</button>
          <span className={`live-pill${connected ? ' live-pill--on' : ''}`}>
            <span className="live-dot" />{connected ? t('v2.guard.live', 'Live') : t('v2.guard.connecting', 'Connecting…')}
          </span>
        </div>
      </div>

      {wall && <WallMode tiles={tiles} onClose={() => setWall(false)} />}

      {/* Per-printer guard cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>
        {printers.map((p) => {
          const s = statuses[p.id];
          const raw = (live[p.id] ?? {}) as Record<string, unknown>;
          const l = readLive(raw);
          const printing = isPrinting(l);
          const xc = (raw._xcam ?? {}) as Record<string, unknown>;
          const hasXcam = Object.keys(xc).length > 0;
          const detectors: [string, string, boolean][] = [
            [t('v2.guard.d_spaghetti', 'Spaghetti'), 'spaghetti_detector', !!xc.spaghettiDetector],
            [t('v2.guard.d_firstlayer', 'First layer'), 'first_layer_inspector', !!xc.firstLayerInspector],
            [t('v2.guard.d_buildplate', 'Buildplate'), 'buildplate_marker_detector', !!xc.buildplateMarkerDetector],
          ];
          const sensitivity = ((raw.xcam ?? {}) as Record<string, unknown>).halt_print_sensitivity as string | undefined;
          const fans = ([
            [t('v2.guard.f_part', 'Part'), raw._fan_part],
            [t('v2.guard.f_aux', 'Aux'), raw._fan_aux],
            [t('v2.guard.f_chamber', 'Chamber'), raw._fan_chamber],
          ] as [string, unknown][]).filter(([, v]) => v != null && String(v) !== '');
          const wifi = raw._wifi_rssi as string | undefined;
          const activeAlerts = s?.alerts?.filter((a) => !a.resolved).length ?? 0;
          const st = watchState(s, printing, activeAlerts);
          const rel = reliability(p.id);
          const settings = s?.settings ?? {};
          const intervening = Object.keys(settings)
            .filter((k) => k.endsWith('_action') && (settings[k] === 'pause' || settings[k] === 'stop'))
            .map(label);
          const snoozed = Boolean(s?.settings?.snooze_until && Date.now() < new Date(s.settings.snooze_until).getTime());
          return (
            <section className="card" key={p.id} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {printing && <CameraSnapshot printerId={p.id} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="panel-title" style={{ fontSize: '1rem', margin: 0 }}>{p.name || p.id}</span>
                <span className={`hs-badge hs-badge-${st.cls}`} style={{ marginLeft: 'auto' }}>{st.text}</span>
              </div>

              {hasXcam && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  <span className="muted" style={{ fontSize: '0.72rem' }}>{t('v2.guard.ai', 'AI monitors')}:</span>
                  {detectors.map(([name, field, on]) => (
                    <button
                      key={field}
                      className={`hs-badge hs-badge-${on ? 'good' : 'neutral'}`}
                      title={on ? t('v2.guard.click_disable', 'Click to disable') : t('v2.guard.click_enable', 'Click to enable')}
                      style={{ cursor: 'pointer', border: 'none', opacity: on ? 1 : 0.55 }}
                      onClick={() => toggleXcam(p.id, field, !on)}
                    >
                      {on ? '● ' : '○ '}{name}
                    </button>
                  ))}
                  {sensitivity && <span className="muted" style={{ fontSize: '0.72rem' }}>· {sensitivity}</span>}
                </div>
              )}

              {printing && (
                <div style={{ fontSize: '0.82rem' }}>
                  {l.file && <div className="ellipsis muted" title={l.file}>{l.file}</div>}
                  {l.progress != null && (
                    <div style={{ margin: '5px 0' }}>
                      <div className="spool-bar"><div className="spool-fill" style={{ width: `${Math.max(0, Math.min(100, l.progress))}%` }} /></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <span>{Math.round(l.progress)}%</span>
                        {l.remainingMin != null && <span className="muted">{Math.round(l.remainingMin)} {t('v2.guard.min_left', 'min left')}</span>}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span className="muted">{t('v2.guard.nozzle', 'Nozzle')} {temp(l.nozzle)}</span>
                    <span className="muted">{t('v2.guard.bed', 'Bed')} {temp(l.bed)}</span>
                    {l.chamber != null && <span className="muted">{t('v2.guard.chamber_t', 'Chamber')} {temp(l.chamber)}</span>}
                  </div>
                  {(fans.length > 0 || wifi) && (
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 3 }}>
                      {fans.map(([name, v]) => <span key={name} className="muted">{name} {t('v2.guard.fan', 'fan')} {String(v)}</span>)}
                      {wifi && <span className="muted">{t('v2.guard.wifi', 'Wi-Fi')} {wifi}</span>}
                    </div>
                  )}
                </div>
              )}

              {activeAlerts > 0 && (
                <div className="hs-badge hs-badge-bad" style={{ alignSelf: 'flex-start' }}>{activeAlerts} {t('v2.guard.active_alerts', 'active alert(s)')}</div>
              )}

              <div className="diag-grid">
                <div className="diag-row"><span className="muted">{t('v2.guard.last_7d', 'Incidents (7d)')}</span><span className="diag-val">{rel.total}</span></div>
                {rel.top && <div className="diag-row"><span className="muted">{t('v2.guard.common', 'Most common')}</span><span className="diag-val">{label(rel.top)}</span></div>}
                {rel.lastAt && <div className="diag-row"><span className="muted">{t('v2.guard.last', 'Last')}</span><span className="diag-val">{when(rel.lastAt)}</span></div>}
              </div>

              {intervening.length > 0 && (
                <div className="muted" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                  <strong>{t('v2.guard.pauses_on', 'Pauses/stops on')}:</strong> {intervening.join(', ')}
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                <button className="btn btn--sm" disabled={busy === `test-${p.id}`} onClick={() => act(`test-${p.id}`, () => api.testGuard(p.id), t('v2.guard.test_sent', 'Test alert sent'))}>{t('v2.guard.test', 'Test alert')}</button>
                {snoozed ? (
                  <button className="btn btn--sm" disabled={busy === `snz-${p.id}`} onClick={() => act(`snz-${p.id}`, () => api.snoozeGuard(p.id, 0), t('v2.guard.resumed', 'Guard resumed'))}>{t('v2.guard.wake', 'Resume')}</button>
                ) : (
                  [15, 30, 60].map((m) => (
                    <button key={m} className="btn btn--sm btn--ghost" disabled={busy === `snz-${p.id}`} onClick={() => act(`snz-${p.id}`, () => api.snoozeGuard(p.id, m), t('v2.guard.snoozed_ok', 'Snoozed'))}>{m}m</button>
                  ))
                )}
                <button className="btn btn--sm" disabled={busy === `en-${p.id}`} onClick={() => act(`en-${p.id}`, () => api.setGuardEnabled(p.id, !settings.enabled), settings.enabled ? t('v2.guard.disabled', 'Guard disabled') : t('v2.guard.enabled', 'Guard enabled'))}>{settings.enabled ? t('v2.guard.turn_off', 'Turn off') : t('v2.guard.turn_on', 'Turn on')}</button>
                <button className="btn btn--sm btn--ghost" onClick={() => setGraphFor(graphFor === p.id ? null : p.id)}>{t('v2.guard.graph', 'Sensors')} {graphFor === p.id ? '▴' : '▾'}</button>
                <button className="btn btn--sm btn--ghost" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>{t('v2.guard.configure', 'Configure')} {expanded === p.id ? '▴' : '▾'}</button>
              </div>

              {graphFor === p.id && (
                <div style={{ borderTop: '1px solid var(--border, rgba(128,128,128,0.2))', paddingTop: 10, marginTop: 2 }}>
                  <div className="muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>{t('v2.guard.sensor_history', 'Sensor history (3h)')}</div>
                  <SensorGraph printerId={p.id} />
                </div>
              )}

              {expanded === p.id && s && (
                <div style={{ borderTop: '1px solid var(--border, rgba(128,128,128,0.2))', paddingTop: 10, marginTop: 2 }}>
                  <div className="muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>{t('v2.guard.on_detect', 'When detected')}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '5px 10px', alignItems: 'center' }}>
                    {Object.keys(settings).filter((k) => k.endsWith('_action')).map((k) => (
                      <Fragment key={k}>
                        <span style={{ fontSize: '0.82rem' }}>{label(k)}</span>
                        <select className="input" style={{ padding: '2px 6px', fontSize: '0.8rem' }} value={String(settings[k] ?? 'notify')} onChange={(e) => saveSetting(p.id, k, e.target.value)}>
                          <option value="notify">{t('v2.guard.notify', 'Notify')}</option>
                          <option value="pause">{t('v2.guard.pause', 'Pause')}</option>
                          <option value="stop">{t('v2.guard.stop', 'Stop')}</option>
                        </select>
                      </Fragment>
                    ))}
                  </div>
                  <div className="muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.03em', margin: '10px 0 6px' }}>{t('v2.guard.thresholds', 'Thresholds')}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '5px 10px', alignItems: 'center' }}>
                    {THRESHOLDS.filter(([k]) => settings[k] !== undefined).map(([k, unit]) => (
                      <Fragment key={k}>
                        <span style={{ fontSize: '0.82rem' }}>{label(k)} <span className="muted">({unit})</span></span>
                        <input className="input" type="number" style={{ width: 78, padding: '2px 6px', fontSize: '0.8rem' }} defaultValue={Number(settings[k] ?? 0)} onBlur={(e) => saveSetting(p.id, k, Number(e.target.value))} />
                      </Fragment>
                    ))}
                    <span style={{ fontSize: '0.82rem' }}>{t('v2.guard.auto_resume', 'Auto-resume after pause')}</span>
                    <input type="checkbox" checked={!!settings.auto_resume} onChange={(e) => saveSetting(p.id, 'auto_resume', e.target.checked ? 1 : 0)} />
                  </div>
                </div>
              )}
            </section>
          );
        })}
        {printers.length === 0 && <p className="muted empty-note">{t('v2.guard.no_printers', 'No printers to guard.')}</p>}
      </div>

      {/* Event log */}
      <div className="panel-head" style={{ marginBottom: 10 }}>
        <h3 className="panel-title" style={{ fontSize: '1.05rem' }}>{t('v2.guard.events', 'Events')}</h3>
        <label className="chk" style={{ marginLeft: 'auto' }}><input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} /> {t('v2.guard.show_resolved', 'Show resolved')}</label>
      </div>
      <section className="card">
        {rows.length === 0 ? (
          <p className="muted empty-note">{t('v2.guard.none', 'No protection events. Prints are running clean.')}</p>
        ) : (
          <div className="err-list">
            {rows.map((e) => (
              <div className={`err-row${e.resolved ? ' err-row--acked' : ''}`} key={e.id} style={{ gridTemplateColumns: 'auto 1.6fr 1fr auto auto' }}>
                <span className={`hs-badge hs-badge-${e.resolved ? 'good' : 'bad'}`}>{label(e.event_type)}</span>
                <span className="err-msg">{e.action_taken || t('v2.guard.detected', 'detected')}</span>
                <span className="muted">{e.printer_id}</span>
                <span className="muted tnum">{when(e.timestamp)}</span>
                {e.resolved
                  ? <span className="faint">{t('v2.guard.done', 'resolved')}</span>
                  : <button className="btn btn--sm" onClick={() => act(`res-${e.id}`, () => api.resolveProtection(e.id), t('v2.guard.resolved', 'Resolved'))}>{t('v2.guard.resolve', 'Resolve')}</button>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
