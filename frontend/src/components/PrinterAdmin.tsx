import { useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Printer } from '../types';

const TYPES = ['bambu', 'moonraker', 'prusalink', 'octoprint'];

export function PrinterAdmin() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<Printer[]>(api.listPrinters, 0);
  const printers = data ?? [];
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ name: string; ip: string }>({ name: '', ip: '' });
  const [adding, setAdding] = useState(false);
  const [nw, setNw] = useState({ name: '', ip: '', type: 'moonraker', serial: '', accessCode: '' });

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  function startEdit(p: Printer) { setEditing(p.id); setDraft({ name: p.name, ip: p.ip || '' }); }
  async function saveEdit(id: string) {
    await run(async () => { await api.updatePrinter(id, { name: draft.name.trim(), ip: draft.ip.trim() }); setEditing(null); reload(); }, t('common.saved', 'Saved'));
  }
  async function remove(p: Printer) {
    if (!confirm(t('v2.printers.confirm_delete', `Remove printer "${p.name}"?`))) return;
    await run(async () => { await api.removePrinter(p.id); reload(); }, t('v2.printers.removed', 'Printer removed'));
  }
  async function add() {
    if (!nw.name.trim() || !nw.ip.trim()) return;
    await run(async () => {
      await api.createPrinter({
        name: nw.name.trim(), ip: nw.ip.trim(), type: nw.type,
        serial: nw.serial.trim() || undefined, accessCode: nw.accessCode.trim() || undefined,
      });
      setAdding(false); setNw({ name: '', ip: '', type: 'moonraker', serial: '', accessCode: '' });
      reload();
    }, t('v2.printers.added', 'Printer added'));
  }

  return (
    <section className="card">
      <div className="card-head">
        <div className="card-title">{t('v2.printers.title', 'Printers')}</div>
        <button className="btn btn--sm btn--primary" onClick={() => setAdding((v) => !v)}>{adding ? t('common.close', 'Close') : t('v2.printers.add', '+ Add printer')}</button>
      </div>

      {adding && (
        <div className="add-wrap padd-form">
          <label className="field grow"><span className="field-label">{t('v2.printers.name', 'Name')}</span><input className="input" value={nw.name} onChange={(e) => setNw({ ...nw, name: e.target.value })} /></label>
          <label className="field grow"><span className="field-label">{t('v2.printers.ip', 'IP address')}</span><input className="input" value={nw.ip} onChange={(e) => setNw({ ...nw, ip: e.target.value })} placeholder="192.168.1.50" /></label>
          <label className="field"><span className="field-label">{t('v2.printers.type', 'Type')}</span>
            <select className="input" value={nw.type} onChange={(e) => setNw({ ...nw, type: e.target.value })}>{TYPES.map((ty) => <option key={ty} value={ty}>{ty}</option>)}</select></label>
          {nw.type === 'bambu' && <>
            <label className="field"><span className="field-label">{t('v2.printers.serial', 'Serial')}</span><input className="input" value={nw.serial} onChange={(e) => setNw({ ...nw, serial: e.target.value })} /></label>
            <label className="field"><span className="field-label">{t('v2.printers.access', 'Access code')}</span><input className="input" value={nw.accessCode} onChange={(e) => setNw({ ...nw, accessCode: e.target.value })} /></label>
          </>}
          <button className="btn btn--primary" onClick={add}>{t('v2.printers.add_btn', 'Add')}</button>
        </div>
      )}

      <div className="padm-list">
        {printers.map((p) => (
          editing === p.id ? (
            <div className="padm-row padm-row--edit" key={p.id}>
              <input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <input className="input" value={draft.ip} onChange={(e) => setDraft({ ...draft, ip: e.target.value })} />
              <div className="qi-actions">
                <button className="btn btn--sm btn--primary" onClick={() => saveEdit(p.id)}>{t('common.save', 'Save')}</button>
                <button className="btn btn--sm" onClick={() => setEditing(null)}>{t('common.cancel', 'Cancel')}</button>
              </div>
            </div>
          ) : (
            <div className="padm-row" key={p.id}>
              <span className="padm-name">{p.name}</span>
              <span className="muted">{p.type}</span>
              <span className="muted tnum">{p.ip}</span>
              <div className="qi-actions">
                <button className="btn btn--sm btn--ghost-quiet" title={t('common.edit', 'Edit')} onClick={() => startEdit(p)}>✎</button>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={() => remove(p)}>✕</button>
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
}
