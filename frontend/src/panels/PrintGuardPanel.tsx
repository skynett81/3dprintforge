import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { ProtectionEvent, GuardStatus, Printer } from '../types';

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
  const [statuses, setStatuses] = useState<Record<string, GuardStatus>>({});
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);

  const printers = useMemo(() => printersData ?? [], [printersData]);
  const events = useMemo(() => [...(logData ?? [])].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)), [logData]);

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

  function guardState(s?: GuardStatus): { text: string; cls: string } {
    if (!s || !s.settings) return { text: t('v2.guard.unknown', 'Unknown'), cls: 'neutral' };
    if (!s.settings.enabled) return { text: t('v2.guard.off', 'Off'), cls: 'neutral' };
    const sn = s.settings.snooze_until;
    if (sn && Date.now() < new Date(sn).getTime()) return { text: `${t('v2.guard.snoozed', 'Snoozed')} → ${hm(sn)}`, cls: 'warn' };
    return { text: t('v2.guard.active', 'Active'), cls: 'good' };
  }

  const openAlerts = events.filter((e) => !e.resolved).length;
  const rows = showResolved ? events : events.filter((e) => !e.resolved);

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.guard.title', 'Print Guard')}</h2>
          <p className="muted sub">{printers.length} {t('v2.guard.printers', 'printers')} · {openAlerts} {t('v2.guard.open', 'open alerts')}</p>
        </div>
      </div>

      {/* Per-printer guard cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>
        {printers.map((p) => {
          const s = statuses[p.id];
          const st = guardState(s);
          const rel = reliability(p.id);
          const settings = s?.settings ?? {};
          const intervening = Object.keys(settings)
            .filter((k) => k.endsWith('_action') && (settings[k] === 'pause' || settings[k] === 'stop'))
            .map(label);
          const activeAlerts = s?.alerts?.filter((a) => !a.resolved).length ?? 0;
          const snoozed = st.cls === 'warn';
          return (
            <section className="card" key={p.id} style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="panel-title" style={{ fontSize: '1rem', margin: 0 }}>{p.name || p.id}</span>
                <span className={`hs-badge hs-badge-${st.cls}`} style={{ marginLeft: 'auto' }}>{st.text}</span>
              </div>

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
              </div>
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
