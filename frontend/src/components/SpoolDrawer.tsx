import { useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Spool } from '../types';

function hex(s: Spool) {
  const h = (s.color_hex || '').replace(/^#/, '');
  return h ? `#${h}` : '#666';
}

interface Props {
  spool: Spool;
  onClose: () => void;
  onChanged: () => void;
}

export function SpoolDrawer({ spool, onClose, onChanged }: Props) {
  const t = useT();
  const toast = useToast();
  const [remaining, setRemaining] = useState(Math.round(spool.remaining_weight_g));
  const [cost, setCost] = useState(spool.cost ?? 0);
  const [location, setLocation] = useState(spool.location ?? '');
  const [busy, setBusy] = useState(false);

  const pct = spool.initial_weight_g > 0
    ? Math.max(0, Math.min(100, Math.round((remaining / spool.initial_weight_g) * 100)))
    : 0;

  async function save() {
    setBusy(true);
    try {
      await api.updateSpool(spool.id, { remaining_weight_g: remaining, cost, location: location || null });
      toast(t('common.saved', 'Saved'), 'success');
      onChanged();
    } catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }
  async function archive() {
    if (!confirm(t('v2.inventory.confirm_archive', 'Archive this spool?'))) return;
    setBusy(true);
    try { await api.archiveSpool(spool.id, true); toast(t('v2.inventory.archived', 'Spool archived'), 'success'); onChanged(); onClose(); }
    catch (e) { toast((e as Error).message, 'error'); setBusy(false); }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div className="drawer-title-wrap">
            <span className="swatch" style={{ background: hex(spool), width: 26, height: 26 }} />
            <div>
              <div className="drawer-title">{spool.profile_name || spool.color_name || `Spool #${spool.id}`}</div>
              <div className="muted">{spool.material || '—'}{spool.vendor_name ? ` · ${spool.vendor_name}` : ''}</div>
            </div>
          </div>
          <button className="btn btn--sm btn--ghost" onClick={onClose} title={t('common.close', 'Close')}>✕</button>
        </div>

        <div>
          <div className="spool-bar"><div className={`spool-fill${pct < 15 ? ' spool-fill--low' : ''}`} style={{ width: `${pct}%` }} /></div>
          <div className="tile-foot"><span className={pct < 15 ? 'low' : 'muted'}>{remaining} g</span><span className="muted"> · {pct}% {t('v2.inventory.of', 'of')} {Math.round(spool.initial_weight_g)} g</span></div>
        </div>

        <div className="drawer-fields">
          <label className="field"><span className="field-label">{t('v2.inventory.remaining', 'Remaining (g)')}</span>
            <input className="input" type="number" min={0} value={remaining} onChange={(e) => setRemaining(Number(e.target.value) || 0)} /></label>
          <label className="field"><span className="field-label">{t('v2.inventory.cost', 'Cost')}</span>
            <input className="input" type="number" min={0} step="0.01" value={cost} onChange={(e) => setCost(Number(e.target.value) || 0)} /></label>
          <label className="field"><span className="field-label">{t('v2.inventory.location', 'Location')}</span>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="AMS1, shelf B…" /></label>
        </div>

        <div className="drawer-controls">
          <button className="btn btn--primary" disabled={busy} onClick={save}>{t('common.save', 'Save')}</button>
          <button className="btn btn--danger" disabled={busy} onClick={archive}>{t('v2.inventory.archive', 'Archive')}</button>
        </div>
      </aside>
    </div>
  );
}
