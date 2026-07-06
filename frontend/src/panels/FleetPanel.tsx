import { useState } from 'react';
import { api } from '../api';
import { useResource, useLivePrinters } from '../hooks';
import { useT } from '../i18n';
import { readLive, isPrinting } from '../live';
import { PrinterDrawer } from '../components/PrinterDrawer';
import type { Printer } from '../types';

function online(p: Printer) {
  const s = (p.status || p.state || '').toLowerCase();
  return s === 'online' || s === 'idle' || s === 'printing' || s === 'running';
}

function temp(v: number | null) { return v == null ? '—' : `${Math.round(v)}°`; }

export function FleetPanel() {
  const t = useT();
  const { data, error, loading } = useResource<Printer[]>(api.listPrinters);
  const { live, connected } = useLivePrinters();
  const [openId, setOpenId] = useState<string | null>(null);
  const printers = data ?? [];
  const printing = printers.filter((p) => isPrinting(readLive(live[p.id]))).length;
  const open = printers.find((p) => p.id === openId) || null;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.fleet.title', 'Fleet')}</h2>
          <p className="muted sub">{printers.filter(online).length}/{printers.length} {t('v2.fleet.online', 'online')} · {printing} {t('v2.fleet.printing', 'printing')}</p>
        </div>
        <span className={`live-pill${connected ? ' live-pill--on' : ''}`}>
          <span className="live-dot" />{connected ? t('v2.fleet.live', 'Live') : t('v2.fleet.connecting', 'Connecting…')}
        </span>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">{t('common.loading', 'Loading…')}</p>}

      <div className="tile-grid">
        {printers.map((p) => {
          const l = readLive(live[p.id]);
          const busy = isPrinting(l);
          const state = (l.gcodeState || p.status || p.state || 'unknown').toLowerCase();
          return (
            <button key={p.id} className="tile tile--clickable" onClick={() => setOpenId(p.id)}>
              <div className="tile-top">
                <span className={`status-chip status-chip--${busy ? 'busy' : online(p) ? 'on' : 'off'}`}>
                  <span className="status-dot" />{state}
                </span>
                <span className="tile-tag">{p.type}</span>
              </div>
              <div className="tile-name">{p.name}</div>
              <div className="tile-meta">{p.model || '—'}</div>

              {busy && l.progress != null && (
                <>
                  <div className="spool-bar"><div className="spool-fill" style={{ width: `${l.progress}%` }} /></div>
                  <div className="tile-foot">
                    <span>{Math.round(l.progress)}%</span>
                    {l.remainingMin != null && <span className="muted"> · {Math.round(l.remainingMin)} min left</span>}
                  </div>
                </>
              )}

              <div className="temps">
                <span className="temp"><span className="temp-k">{t('v2.fleet.nozzle', 'Nozzle')}</span> {temp(l.nozzle)}</span>
                <span className="temp"><span className="temp-k">{t('v2.fleet.bed', 'Bed')}</span> {temp(l.bed)}</span>
                {l.chamber != null && <span className="temp"><span className="temp-k">{t('v2.fleet.chamber', 'Chamber')}</span> {temp(l.chamber)}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {open && <PrinterDrawer printer={open} live={live[open.id]} onClose={() => setOpenId(null)} />}
    </div>
  );
}
