import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { InvPart, StockItem, StockMove, StorageLocation } from '../types';

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function PartDrawer({ partId, onClose, onChanged }: { partId: number; onClose: () => void; onChanged: () => void }) {
  const t = useT();
  const toast = useToast();
  const { data: locations } = useResource<StorageLocation[]>(api.listLocations, 0);
  const [part, setPart] = useState<InvPart | null>(null);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [moves, setMoves] = useState<StockMove[]>([]);
  const [tick, setTick] = useState(0);
  const [addLoc, setAddLoc] = useState('');
  const [addQty, setAddQty] = useState('');
  const locs = locations ?? [];

  useEffect(() => {
    let alive = true;
    Promise.all([api.getInvPart(partId), api.listPartStock(partId), api.listPartMoves(partId)])
      .then(([p, s, m]) => { if (alive) { setPart(p); setStock(s); setMoves(m); } })
      .catch((e) => toast((e as Error).message, 'error'));
    return () => { alive = false; };
  }, [partId, tick, toast]);

  function refresh() { setTick((n) => n + 1); onChanged(); }

  async function addStock() {
    const qty = Number(addQty);
    if (!Number.isFinite(qty)) { toast(t('v2.parts.qty_req', 'Enter a quantity'), 'error'); return; }
    try {
      await api.addStockItem({ part_id: partId, location_id: addLoc ? Number(addLoc) : undefined, quantity: qty });
      setAddQty(''); setAddLoc(''); refresh();
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function adjust(item: StockItem, delta: number) {
    try { await api.adjustStock(item.id, delta, delta > 0 ? 'manual add' : 'manual remove'); refresh(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  async function move(item: StockItem, locId: string) {
    try { await api.moveStock(item.id, locId ? Number(locId) : null); refresh(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  async function removeItem(item: StockItem) {
    if (!confirm(t('v2.parts.confirm_del_stock', 'Delete this stock entry?'))) return;
    try { await api.deleteStockItem(item.id); refresh(); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function genQr() {
    try { await api.assignPartQr(partId); refresh(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  function printLabel() {
    const qr = part?.qr_uid;
    if (!qr || !part) return;
    const w = window.open('', '_blank', 'width=380,height=420');
    if (!w) { toast(t('v2.parts.popup_blocked', 'Allow pop-ups to print labels'), 'error'); return; }
    const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c));
    w.document.write(`<!doctype html><html><head><title>${esc(part.name)}</title><style>body{font-family:system-ui,sans-serif;text-align:center;padding:18px;margin:0}img{width:190px;height:190px}.n{font-weight:600;margin-top:10px;font-size:15px}.c{color:#666;font-size:12px;margin-top:2px}</style></head><body><img src="${location.origin}${api.qrImageUrl(qr)}" alt="QR"/><div class="n">${esc(part.name)}</div><div class="c">${esc(qr)}${part.ipn ? ' · ' + esc(part.ipn) : ''}</div><script>window.onload=function(){setTimeout(function(){window.print()},150)}</script></body></html>`);
    w.document.close();
  }
  async function removePart() {
    if (!confirm(t('v2.parts.confirm_del', 'Delete this part and all its stock?'))) return;
    try { await api.deleteInvPart(partId); toast(t('v2.parts.deleted', 'Part deleted'), 'success'); onChanged(); onClose(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  const unit = part?.unit ?? '';

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div className="drawer-title-wrap">
            <div>
              <div className="drawer-title">{part?.name ?? `Part #${partId}`}</div>
              <div className="muted">{part?.type}{part?.category_name ? ` · ${part.category_name}` : ''}{part?.ipn ? ` · ${part.ipn}` : ''}</div>
            </div>
          </div>
          <button className="btn btn--sm btn--ghost" onClick={onClose} title={t('common.close', 'Close')}>✕</button>
        </div>

        {part && (
          <div className="diag-grid">
            <div className="diag-row"><span className="muted">{t('v2.parts.total_stock', 'Total stock')}</span><span className="diag-val">{part.total_stock} {unit}</span></div>
            <div className="diag-row"><span className="muted">{t('v2.parts.min_stock', 'Min stock')}</span><span className="diag-val">{part.min_stock} {unit}{part.low ? <span className="hs-badge hs-badge-bad" style={{ marginLeft: 8 }}>{t('v2.parts.low', 'low')}</span> : null}</span></div>
          </div>
        )}

        <div className="drawer-adjust">
          <div className="field-label">{t('v2.parts.add_stock', 'Add stock')}</div>
          <div className="drawer-adjust-row">
            <select className="input" value={addLoc} onChange={(e) => setAddLoc(e.target.value)} style={{ maxWidth: 150 }}>
              <option value="">{t('v2.parts.no_location', 'No location')}</option>
              {locs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <input className="input" type="number" placeholder={t('v2.parts.qty', 'Qty')} value={addQty} onChange={(e) => setAddQty(e.target.value)} style={{ maxWidth: 90 }} />
            <button className="btn btn--sm" onClick={addStock}>{t('v2.parts.add_stock_btn', 'Add')}</button>
          </div>
        </div>

        <div className="drawer-history">
          <div className="field-label">{t('v2.parts.stock_items', 'Stock')}</div>
          {stock.length === 0 ? (
            <p className="muted empty-note" style={{ margin: 0 }}>{t('v2.parts.no_stock', 'No stock recorded.')}</p>
          ) : stock.map((s) => (
            <div key={s.id} className="stock-entry">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600 }}>{s.quantity} {unit}</span>
                {s.status !== 'ok' && <span className="hs-badge hs-badge-warn">{s.status}</span>}
                <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>{s.location_name || t('v2.parts.no_location', 'No location')}</span>
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 5, flexWrap: 'wrap' }}>
                <button className="btn btn--sm btn--ghost" onClick={() => adjust(s, -1)} title="-1">−</button>
                <button className="btn btn--sm btn--ghost" onClick={() => adjust(s, 1)} title="+1">+</button>
                <select className="input" value="" onChange={(e) => move(s, e.target.value)} style={{ maxWidth: 130, padding: '2px 6px', fontSize: '0.8rem' }}>
                  <option value="">{t('v2.parts.move_to', 'Move to…')}</option>
                  {locs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <button className="btn btn--sm btn--ghost" style={{ marginLeft: 'auto' }} onClick={() => removeItem(s)}>{t('common.delete', 'Delete')}</button>
              </div>
            </div>
          ))}
        </div>

        {moves.length > 0 && (
          <div className="drawer-history">
            <div className="field-label">{t('v2.parts.moves', 'Movements')}</div>
            <ul className="timeline">
              {moves.slice(0, 20).map((m) => (
                <li className="timeline-item" key={m.id}>
                  <span className="timeline-dot" />
                  <div className="timeline-body">
                    <span className="timeline-type">{m.delta > 0 ? '+' : ''}{m.delta} {unit}{m.reason ? ` · ${m.reason}` : ''}{m.balance != null ? ` → ${m.balance}` : ''}</span>
                    <span className="muted timeline-when">{when(m.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="drawer-history">
          <div className="field-label">{t('v2.parts.qr', 'QR label')}</div>
          {part?.qr_uid ? (
            <div className="part-qr">
              <img src={api.qrImageUrl(part.qr_uid)} alt="QR" width={110} height={110} />
              <div>
                <div className="tnum" style={{ fontWeight: 600 }}>{part.qr_uid}</div>
                <p className="muted micro" style={{ margin: '4px 0 8px' }}>{t('v2.parts.qr_hint', 'Scan to open this part, or set an AMS/bin.')}</p>
                <button className="btn btn--sm" onClick={printLabel}>{t('v2.parts.print', 'Print label')}</button>
              </div>
            </div>
          ) : (
            <button className="btn btn--sm" onClick={genQr}>{t('v2.parts.gen_qr', 'Generate QR label')}</button>
          )}
        </div>

        <div className="drawer-controls" style={{ marginTop: 4 }}>
          <button className="btn btn--danger" onClick={removePart}>{t('v2.parts.delete', 'Delete part')}</button>
        </div>
      </aside>
    </div>
  );
}
