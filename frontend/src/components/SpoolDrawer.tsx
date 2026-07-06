import { useEffect, useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Spool, SpoolEvent } from '../types';

function fdate(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function fdatetime(iso: string) {
  const d = new Date(iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

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
  const [adjDelta, setAdjDelta] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [events, setEvents] = useState<SpoolEvent[] | null>(null);

  useEffect(() => {
    let alive = true;
    api.getSpoolTimeline(spool.id).then((e) => { if (alive) setEvents(e); }).catch(() => { if (alive) setEvents([]); });
    return () => { alive = false; };
  }, [spool.id]);

  const meta: [string, string | null][] = [
    [t('v2.inventory.lot', 'Lot / batch'), spool.lot_number || null],
    [t('v2.inventory.purchased', 'Purchased'), fdate(spool.purchase_date)],
    [t('v2.inventory.expiry', 'Expires'), fdate(spool.expiry_date)],
    [t('v2.inventory.last_dried', 'Last dried'), fdate(spool.last_dried_at)],
    [t('v2.inventory.k_value', 'K-value'), spool.pressure_advance_k != null ? String(spool.pressure_advance_k) : null],
    [t('v2.inventory.short_id', 'ID'), spool.short_id || null],
  ];
  const shownMeta = meta.filter(([, v]) => v);

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
  async function adjust() {
    const delta = Number(adjDelta);
    if (!delta || !isFinite(delta)) return;
    setBusy(true);
    try {
      await api.adjustSpoolStock(spool.id, { delta_g: delta, reason: adjReason.trim() || 'Manual adjustment' });
      toast(t('v2.inventory.adjusted', 'Stock adjusted'), 'success');
      setRemaining((r) => Math.max(0, Math.round(r + delta)));
      setAdjDelta(''); setAdjReason(''); onChanged();
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

        <div className="drawer-adjust">
          <div className="field-label">{t('v2.inventory.adjust', 'Stock adjustment')}</div>
          <p className="muted empty-note" style={{ margin: '0 0 8px' }}>{t('v2.inventory.adjust_hint', 'Record a +/- gram correction to the ledger (spillage, re-spool, manual count).')}</p>
          <div className="drawer-adjust-row">
            <input className="input" type="number" placeholder="±g" value={adjDelta} onChange={(e) => setAdjDelta(e.target.value)} style={{ maxWidth: 90 }} />
            <input className="input" placeholder={t('v2.inventory.adjust_reason', 'Reason')} value={adjReason} onChange={(e) => setAdjReason(e.target.value)} />
            <button className="btn btn--sm" disabled={busy || !adjDelta} onClick={adjust}>{t('v2.inventory.apply', 'Apply')}</button>
          </div>
        </div>

        {shownMeta.length > 0 && (
          <div className="drawer-meta">
            {shownMeta.map(([k, v]) => (
              <div className="drawer-meta-row" key={k}><span className="muted">{k}</span><span className="tnum">{v}</span></div>
            ))}
          </div>
        )}

        <div className="drawer-history">
          <div className="field-label">{t('v2.inventory.history', 'History')}</div>
          {events == null ? (
            <p className="muted">{t('common.loading', 'Loading…')}</p>
          ) : events.length === 0 ? (
            <p className="muted empty-note" style={{ margin: 0 }}>{t('v2.inventory.no_history', 'No recorded events yet.')}</p>
          ) : (
            <ul className="timeline">
              {events.slice(0, 40).map((e) => (
                <li className="timeline-item" key={e.id}>
                  <span className="timeline-dot" />
                  <div className="timeline-body">
                    <span className="timeline-type">{e.event_type}{e.details ? ` · ${e.details}` : ''}</span>
                    <span className="muted timeline-when">{fdatetime(e.timestamp)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
