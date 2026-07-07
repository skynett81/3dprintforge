import { useState } from 'react';
import { api } from '../api';
import { useResource, useLivePrinters } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { readLive, isPrinting } from '../live';
import { PrinterDrawer } from '../components/PrinterDrawer';
import type { Printer } from '../types';

const PRINTER_TYPES = ['bambu', 'moonraker', 'prusalink', 'octoprint'];

function online(p: Printer) {
  const s = (p.status || p.state || '').toLowerCase();
  return s === 'online' || s === 'idle' || s === 'printing' || s === 'running';
}

function temp(v: number | null) { return v == null ? '—' : `${Math.round(v)}°`; }

export function FleetPanel() {
  const t = useT();
  const toast = useToast();
  const { data, error, loading, reload } = useResource<Printer[]>(api.listPrinters);
  const { live, connected } = useLivePrinters();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nw, setNw] = useState({ name: '', ip: '', type: 'moonraker', serial: '', accessCode: '' });
  const printers = data ?? [];

  const EMPTY_NW = { name: '', ip: '', type: 'moonraker', serial: '', accessCode: '' };
  function toggleAdd() {
    if (adding) { setAdding(false); setEditId(null); setNw(EMPTY_NW); }
    else { setEditId(null); setNw(EMPTY_NW); setAdding(true); }
  }
  function startEdit(p: Printer) {
    setEditId(p.id);
    setNw({ name: p.name, ip: p.ip || '', type: p.type || 'moonraker', serial: '', accessCode: '' });
    setAdding(true);
  }
  async function submitPrinter() {
    if (!nw.name.trim() || !nw.ip.trim()) return;
    try {
      if (editId) {
        await api.updatePrinter(editId, { name: nw.name.trim(), ip: nw.ip.trim() });
        toast(t('common.saved', 'Saved'), 'success');
      } else {
        await api.createPrinter({ name: nw.name.trim(), ip: nw.ip.trim(), type: nw.type, serial: nw.serial.trim() || undefined, accessCode: nw.accessCode.trim() || undefined });
        toast(t('v2.printers.added', 'Printer added'), 'success');
      }
      setAdding(false); setEditId(null); setNw(EMPTY_NW); reload();
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function removePrinter(p: Printer) {
    if (!confirm(t('v2.printers.confirm_delete', `Remove printer "${p.name}"?`))) return;
    try { await api.removePrinter(p.id); toast(t('v2.printers.removed', 'Printer removed'), 'success'); reload(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  const printing = printers.filter((p) => isPrinting(readLive(live[p.id]))).length;
  const open = printers.find((p) => p.id === openId) || null;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.fleet.title', 'Fleet')}</h2>
          <p className="muted sub">{printers.filter(online).length}/{printers.length} {t('v2.fleet.online', 'online')} · {printing} {t('v2.fleet.printing', 'printing')}</p>
        </div>
        <div className="inv-head-actions">
          <span className={`live-pill${connected ? ' live-pill--on' : ''}`}>
            <span className="live-dot" />{connected ? t('v2.fleet.live', 'Live') : t('v2.fleet.connecting', 'Connecting…')}
          </span>
          <button className="btn btn--sm btn--primary" onClick={toggleAdd}>{adding ? t('common.close', 'Close') : t('v2.printers.add', '+ Add printer')}</button>
        </div>
      </div>

      {adding && (
        <section className="card">
          {editId && <div className="card-title">{t('v2.printers.edit', 'Edit printer')}</div>}
          <div className="add-form add-form--stack">
            <label className="field grow"><span className="field-label">{t('v2.printers.name', 'Name')}</span><input className="input" value={nw.name} onChange={(e) => setNw({ ...nw, name: e.target.value })} placeholder="X1 Carbon" /></label>
            <label className="field grow"><span className="field-label">{t('v2.printers.ip', 'IP address')}</span><input className="input" value={nw.ip} onChange={(e) => setNw({ ...nw, ip: e.target.value })} placeholder="192.168.1.50" /></label>
            {!editId && <label className="field"><span className="field-label">{t('v2.printers.type', 'Type')}</span>
              <select className="input" value={nw.type} onChange={(e) => setNw({ ...nw, type: e.target.value })}>{PRINTER_TYPES.map((ty) => <option key={ty} value={ty}>{ty}</option>)}</select></label>}
            {!editId && nw.type === 'bambu' && <>
              <label className="field"><span className="field-label">{t('v2.printers.serial', 'Serial')}</span><input className="input" value={nw.serial} onChange={(e) => setNw({ ...nw, serial: e.target.value })} /></label>
              <label className="field"><span className="field-label">{t('v2.printers.access', 'Access code')}</span><input className="input" value={nw.accessCode} onChange={(e) => setNw({ ...nw, accessCode: e.target.value })} /></label>
            </>}
            <button className="btn btn--primary" onClick={submitPrinter}>{editId ? t('common.save', 'Save') : t('v2.printers.add_btn', 'Add')}</button>
          </div>
        </section>
      )}

      {error && <div className="error">{error}</div>}
      {loading && !data && <p className="muted">{t('common.loading', 'Loading…')}</p>}

      <div className="tile-grid">
        {printers.map((p) => {
          const l = readLive(live[p.id]);
          const busy = isPrinting(l);
          const state = (l.gcodeState || p.status || p.state || 'unknown').toLowerCase();
          return (
            <div key={p.id} className="tile tile--clickable" role="button" tabIndex={0} onClick={() => setOpenId(p.id)}>
              <div className="tile-top">
                <span className={`status-chip status-chip--${busy ? 'busy' : online(p) ? 'on' : 'off'}`}>
                  <span className="status-dot" />{state}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="tile-tag">{p.type}</span>
                  <button className="btn btn--sm btn--ghost" title={t('common.edit', 'Edit')} onClick={(e) => { e.stopPropagation(); startEdit(p); }}>✎</button>
                  <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); removePrinter(p); }}>✕</button>
                </div>
              </div>
              <img
                className="printer-thumb"
                src={`/api/printer-image/${encodeURIComponent(p.model || p.name)}`}
                alt={p.name}
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
              />
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
            </div>
          );
        })}
      </div>

      {open && <PrinterDrawer printer={open} live={live[open.id]} onClose={() => setOpenId(null)} />}
    </div>
  );
}
