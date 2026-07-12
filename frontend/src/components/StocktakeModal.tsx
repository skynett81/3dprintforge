import { useEffect, useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Stocktake } from '../types';

/**
 * Physical audit flow: creates a stocktake (snapshotting expected quantities),
 * lets you enter counted values, then applies the differences to stock.
 */
export function StocktakeModal({ locationId, onClose, onApplied }: { locationId: number | null; onClose: () => void; onApplied: () => void }) {
  const t = useT();
  const toast = useToast();
  const [st, setSt] = useState<Stocktake | null>(null);
  const [counts, setCounts] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    api.createStocktake({ location_id: locationId ?? undefined })
      .then((r) => api.getStocktake(r.id))
      .then((full) => { if (alive) setSt(full); })
      .catch((e) => { toast((e as Error).message, 'error'); onClose(); });
    return () => { alive = false; };
  }, [locationId, onClose, toast]);

  async function apply() {
    if (!st) return;
    setBusy(true);
    try {
      for (const l of st.lines ?? []) {
        const v = counts[l.id];
        if (v !== undefined && v !== '') await api.setStocktakeCount(l.id, Number(v));
      }
      const r = await api.applyStocktake(st.id);
      toast(`${t('v2.st.applied', 'Stocktake applied')} · ${r.adjusted} ${t('v2.st.adjusted', 'adjusted')}`, 'success');
      onApplied(); onClose();
    } catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }
  async function cancel() {
    if (st) { try { await api.cancelStocktake(st.id); } catch { /* ignore */ } }
    onClose();
  }

  return (
    <div className="cmd-backdrop" onMouseDown={cancel}>
      <div className="st-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="qr-scan-head">
          <strong>{t('v2.st.title', 'Stocktake')}</strong>
          <button className="btn btn--sm btn--ghost" onClick={cancel} aria-label={t('common.close', 'Close')}>✕</button>
        </div>
        <div className="st-body">
          {!st ? (
            <p className="muted" style={{ padding: 14 }}>{t('common.loading', 'Loading…')}</p>
          ) : (st.lines?.length ?? 0) === 0 ? (
            <p className="muted empty-note">{t('v2.st.empty', 'No stock to count in this scope.')}</p>
          ) : (
            <div className="err-list">
              <div className="err-row st-head" style={{ gridTemplateColumns: '1.5fr auto auto' }}>
                <span className="muted">{t('v2.st.part', 'Part')}</span>
                <span className="muted">{t('v2.st.expected', 'Expected')}</span>
                <span className="muted">{t('v2.st.counted', 'Counted')}</span>
              </div>
              {st.lines!.map((l) => (
                <div key={l.id} className="err-row" style={{ gridTemplateColumns: '1.5fr auto auto' }}>
                  <span className="err-msg">{l.part_name || `#${l.part_id}`}{l.location_name ? <span className="muted"> · {l.location_name}</span> : null}</span>
                  <span className="tnum muted">{l.expected} {l.part_unit || ''}</span>
                  <input className="input" type="number" style={{ maxWidth: 84, padding: '3px 6px' }} placeholder={String(l.expected ?? '')} value={counts[l.id] ?? ''} onChange={(e) => setCounts({ ...counts, [l.id]: e.target.value })} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="drawer-controls" style={{ padding: '10px 14px' }}>
          <button className="btn btn--primary" disabled={busy || !st} onClick={apply}>{t('v2.st.apply', 'Apply adjustments')}</button>
          <button className="btn btn--ghost" onClick={cancel}>{t('common.cancel', 'Cancel')}</button>
        </div>
      </div>
    </div>
  );
}
