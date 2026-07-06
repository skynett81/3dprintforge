import { useEffect, useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { readLive, isPrinting } from '../live';
import type { Printer } from '../types';

interface Props {
  printer: Printer;
  live: Record<string, unknown> | undefined;
  onClose: () => void;
}

function temp(v: number | null) { return v == null ? '—' : `${Math.round(v)}°`; }

export function PrinterDrawer({ printer, live, onClose }: Props) {
  const t = useT();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [camFailed, setCamFailed] = useState(false);
  const l = readLive(live);
  const busyPrinting = isPrinting(l);

  // Refresh the camera snapshot every 3s while the drawer is open.
  useEffect(() => {
    const iv = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(iv);
  }, []);

  async function control(action: string, extra?: Record<string, unknown>) {
    if (action === 'stop' && !confirm(t('v2.fleet.confirm_stop', 'Stop the current print? This cannot be undone.'))) return;
    setBusy(action);
    try {
      await api.controlPrinter(printer.id, action, extra);
      toast(t('v2.fleet.sent', 'Command sent'), 'success');
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="drawer-title">{printer.name}</div>
            <div className="muted">{printer.model} · {printer.type}</div>
          </div>
          <button className="btn btn--sm btn--ghost" onClick={onClose} title={t('common.close', 'Close')}>✕</button>
        </div>

        <div className="drawer-state">
          <span className={`status-chip status-chip--${busyPrinting ? 'busy' : 'on'}`}>
            <span className="status-dot" />{(l.gcodeState || printer.status || 'online').toLowerCase()}
          </span>
          {l.file && <span className="muted ellipsis" title={l.file}>{l.file}</span>}
        </div>

        {!camFailed && (
          <img
            className="drawer-cam"
            src={`/api/printers/${encodeURIComponent(printer.id)}/frame.jpeg?t=${tick}`}
            alt={t('v2.fleet.camera', 'Camera')}
            onError={() => setCamFailed(true)}
          />
        )}

        {busyPrinting && l.progress != null && (
          <div className="drawer-prog">
            <div className="spool-bar"><div className="spool-fill" style={{ width: `${l.progress}%` }} /></div>
            <div className="tile-foot"><span>{Math.round(l.progress)}%</span>{l.remainingMin != null && <span className="muted"> · {Math.round(l.remainingMin)} min left</span>}</div>
          </div>
        )}

        <div className="drawer-temps">
          <div className="dt"><span className="dt-k">{t('v2.fleet.nozzle', 'Nozzle')}</span><span className="dt-v">{temp(l.nozzle)}</span></div>
          <div className="dt"><span className="dt-k">{t('v2.fleet.bed', 'Bed')}</span><span className="dt-v">{temp(l.bed)}</span></div>
          {l.chamber != null && <div className="dt"><span className="dt-k">{t('v2.fleet.chamber', 'Chamber')}</span><span className="dt-v">{temp(l.chamber)}</span></div>}
        </div>

        <div className="drawer-controls">
          {busyPrinting
            ? <button className="btn" disabled={busy != null} onClick={() => control('pause')}>{t('v2.fleet.pause', 'Pause')}</button>
            : <button className="btn" disabled={busy != null} onClick={() => control('resume')}>{t('v2.fleet.resume', 'Resume')}</button>}
          <button className="btn btn--danger" disabled={busy != null || !busyPrinting} onClick={() => control('stop')}>{t('v2.fleet.stop', 'Stop')}</button>
          <button className="btn" disabled={busy != null} onClick={() => control('set_light', { on: true })}>{t('v2.fleet.light_on', 'Light on')}</button>
          <button className="btn" disabled={busy != null} onClick={() => control('set_light', { on: false })}>{t('v2.fleet.light_off', 'Light off')}</button>
        </div>
      </aside>
    </div>
  );
}
