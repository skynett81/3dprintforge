import { useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { TigerTagParsed } from '../types';

/**
 * Import a TigerTag RFID filament dump (https://tigertag.io). Paste the tag
 * bytes from an NFC reader (e.g. ACR122U) as hex; we decode it and match it to
 * a spool in inventory.
 */
export function TigerTagModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const toast = useToast();
  const [dump, setDump] = useState('');
  const [parsed, setParsed] = useState<TigerTagParsed | null>(null);
  const [matchedId, setMatchedId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function identify() {
    if (!dump.trim()) { toast(t('v2.tt.paste', 'Paste a TigerTag dump (hex)'), 'error'); return; }
    setBusy(true);
    try {
      const r = await api.matchTigerTag(dump.trim());
      setParsed(r.parsed);
      setMatchedId(r.matched_id);
    } catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }

  return (
    <div className="cmd-backdrop" onMouseDown={onClose}>
      <div className="st-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="qr-scan-head">
          <strong>{t('v2.tt.title', 'Read a TigerTag')}</strong>
          <button className="btn btn--sm btn--ghost" onClick={onClose} aria-label={t('common.close', 'Close')}>✕</button>
        </div>
        <div className="st-body">
          <p className="muted micro" style={{ margin: '4px 0 8px' }}>{t('v2.tt.hint', 'Paste the tag bytes (hex) from an NFC reader such as an ACR122U.')}</p>
          <textarea className="input" value={dump} onChange={(e) => setDump(e.target.value)} placeholder="04 A1 B2 … or 04a1b2…" rows={3} style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }} />
          <div style={{ marginTop: 8 }}>
            <button className="btn btn--primary btn--sm" disabled={busy} onClick={identify}>{t('v2.tt.identify', 'Identify')}</button>
          </div>

          {parsed && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                {parsed.colorHex && <span className="swatch" style={{ background: `#${parsed.colorHex}`, width: 28, height: 28, borderRadius: 6 }} />}
                <div>
                  <div style={{ fontWeight: 600 }}>{[parsed.brand, parsed.type, parsed.variant].filter(Boolean).join(' ') || t('v2.tt.unknown', 'Unknown filament')}</div>
                  <div className="muted" style={{ fontSize: '0.8rem' }}>
                    {parsed.colorHex ? `#${parsed.colorHex}` : ''}{parsed.minTemp ? ` · ${parsed.minTemp}–${parsed.maxTemp}°` : ''}{parsed.diameter ? ` · ${parsed.diameter}` : ''}{parsed.weightG ? ` · ${parsed.weightG} g` : ''}
                  </div>
                </div>
              </div>
              {matchedId ? (
                <a className="btn btn--sm" href={`#/inventory/spools/${matchedId}`} onClick={onClose}>{t('v2.tt.open', 'Open matching spool')}</a>
              ) : (
                <p className="muted micro" style={{ margin: 0 }}>{t('v2.tt.no_match', 'No matching spool in inventory — the tag was read successfully.')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
