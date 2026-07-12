import { useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';

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
            </>
          )}
        </div>
      )}
    </div>
  );
}
