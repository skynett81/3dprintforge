import { useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Printer } from '../types';

// Web NFC is Chrome-on-Android only; feature-detect so the button only shows
// where it can actually work.
const NFC_SUPPORTED = typeof window !== 'undefined' && 'NDEFReader' in window;

/**
 * OpenSpool NFC tag for a spool — https://github.com/spuder/OpenSpool.
 * Fetches the tag payload on expand and offers copy, an openspool.io preview
 * link, and (where Web NFC exists) writing it straight to an NTAG.
 */
export function OpenSpoolTag({ spoolId }: { spoolId: number }) {
  const t = useT();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<Record<string, string> | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const { data: printers } = useResource<Printer[]>(api.listPrinters, 0);
  const bambu = (printers ?? []).filter((p) => (p.type ?? '').toLowerCase() === 'bambu');
  const [printerId, setPrinterId] = useState('');
  const [amsId, setAmsId] = useState(0);
  const [slot, setSlot] = useState(1); // 1-4 in the UI, 0-3 on the wire
  const [applying, setApplying] = useState(false);

  async function applyToAms() {
    if (!tag) return;
    const pid = printerId || bambu[0]?.id;
    if (!pid) { toast(t('v2.openspool.no_bambu', 'No Bambu printer available'), 'error'); return; }
    setApplying(true);
    try {
      await api.applyOpenspool(pid, tag, amsId, slot - 1);
      toast(t('v2.openspool.applied', 'AMS slot updated on the printer'), 'success');
    } catch (e) { toast((e as Error).message, 'error'); }
    finally { setApplying(false); }
  }

  async function expand() {
    const next = !open;
    setOpen(next);
    if (next && !tag) {
      try {
        const r = await api.getOpenspoolTag(spoolId);
        setTag(r.tag);
        setPreviewUrl(r.preview_url);
      } catch (e) { toast((e as Error).message, 'error'); }
    }
  }

  async function copy() {
    if (!tag) return;
    try { await navigator.clipboard.writeText(JSON.stringify(tag)); toast(t('v2.openspool.copied', 'Tag JSON copied'), 'success'); }
    catch { toast(t('v2.openspool.copy_fail', 'Clipboard unavailable'), 'error'); }
  }

  async function writeNfc() {
    if (!tag) return;
    setBusy(true);
    try {
      const Reader = (window as unknown as { NDEFReader: new () => { write: (m: unknown) => Promise<void> } }).NDEFReader;
      const ndef = new Reader();
      await ndef.write({ records: [{ recordType: 'mime', mediaType: 'application/json', data: new TextEncoder().encode(JSON.stringify(tag)) }] });
      toast(t('v2.openspool.written', 'Written — tap the tag to the phone'), 'success');
    } catch (e) { toast(`${t('v2.openspool.write_fail', 'NFC write failed')}: ${(e as Error).message}`, 'error'); }
    finally { setBusy(false); }
  }

  return (
    <div className="drawer-openspool">
      <button className="field-label openspool-toggle" onClick={expand} aria-expanded={open}>
        {t('v2.openspool.title', 'OpenSpool NFC tag')} {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="openspool-body">
          {!tag ? (
            <p className="muted">{t('common.loading', 'Loading…')}</p>
          ) : (
            <>
              <pre className="openspool-json">{JSON.stringify(tag, null, 2)}</pre>
              <div className="openspool-actions">
                <button className="btn btn--sm" onClick={copy}>{t('v2.openspool.copy', 'Copy JSON')}</button>
                {previewUrl && <a className="btn btn--sm btn--ghost" href={previewUrl} target="_blank" rel="noreferrer">{t('v2.openspool.preview', 'Preview')}</a>}
                {NFC_SUPPORTED && <button className="btn btn--sm btn--primary" disabled={busy} onClick={writeNfc}>{t('v2.openspool.write', 'Write to NFC')}</button>}
              </div>
              <p className="muted micro">{t('v2.openspool.hint', 'Write to an NTAG 215/216 so any OpenSpool reader (or a phone) can identify this spool and auto-set the AMS slot.')}</p>
              {bambu.length > 0 && (
                <div className="openspool-ams">
                  <div className="field-label">{t('v2.openspool.set_ams', 'Set a Bambu AMS slot')}</div>
                  <div className="openspool-ams-row">
                    <select className="input" value={printerId || bambu[0].id} onChange={(e) => setPrinterId(e.target.value)} aria-label={t('v2.openspool.printer', 'Printer')}>
                      {bambu.map((p) => <option key={p.id} value={p.id}>{p.name || p.id}</option>)}
                    </select>
                    <select className="input" value={amsId} onChange={(e) => setAmsId(Number(e.target.value))} aria-label="AMS" style={{ maxWidth: 78 }}>
                      {[0, 1, 2, 3].map((n) => <option key={n} value={n}>AMS {n + 1}</option>)}
                    </select>
                    <select className="input" value={slot} onChange={(e) => setSlot(Number(e.target.value))} aria-label={t('v2.openspool.slot', 'Slot')} style={{ maxWidth: 78 }}>
                      {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{t('v2.openspool.slot', 'Slot')} {n}</option>)}
                    </select>
                    <button className="btn btn--sm" disabled={applying} onClick={applyToAms}>{t('v2.openspool.set', 'Set slot')}</button>
                  </div>
                  <p className="muted micro">{t('v2.openspool.set_hint', 'Pushes this filament (type, colour, temps) to the chosen AMS slot over MQTT — the same setting OpenSpool applies.')}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
