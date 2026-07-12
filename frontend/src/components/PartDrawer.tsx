import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { InvPart, StockItem, StockMove, StorageLocation, BomLine, Warranty, Attachment, ShopProduct, LibraryFile } from '../types';

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
  const [bom, setBom] = useState<{ lines: BomLine[]; cost: number }>({ lines: [], cost: 0 });
  const [allParts, setAllParts] = useState<InvPart[]>([]);
  const [bl, setBl] = useState({ component: '', qty: '1', waste: '0' });
  const [tick, setTick] = useState(0);
  const [addLoc, setAddLoc] = useState('');
  const [addQty, setAddQty] = useState('');
  const locs = locations ?? [];

  useEffect(() => {
    let alive = true;
    Promise.all([api.getInvPart(partId), api.listPartStock(partId), api.listPartMoves(partId), api.getPartBom(partId), api.listInvParts()])
      .then(([p, s, m, bo, ps]) => { if (alive) { setPart(p); setStock(s); setMoves(m); setBom(bo); setAllParts(ps.filter((x) => x.id !== partId)); } })
      .catch((e) => toast((e as Error).message, 'error'));
    return () => { alive = false; };
  }, [partId, tick, toast]);

  async function addBomLine() {
    if (!bl.component) { toast(t('v2.bom.pick', 'Pick a component'), 'error'); return; }
    try {
      await api.addBomLine(partId, { component_part_id: Number(bl.component), quantity: Number(bl.qty) || 1, waste_pct: Number(bl.waste) || 0 });
      setBl({ component: '', qty: '1', waste: '0' }); refresh();
    } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function delBomLine(id: number) {
    try { await api.deleteBomLine(id); refresh(); } catch (e) { toast((e as Error).message, 'error'); }
  }

  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [libFiles, setLibFiles] = useState<LibraryFile[]>([]);
  const [modelSel, setModelSel] = useState('');
  const [wForm, setWForm] = useState({ provider: '', end_date: '' });
  const [aForm, setAForm] = useState({ title: '', url: '', kind: 'manual' });
  const [linkSel, setLinkSel] = useState('');
  useEffect(() => {
    let alive = true;
    const eid = String(partId);
    Promise.all([api.listWarranties('part', eid), api.listAttachments('part', eid), api.listShopProducts().catch(() => []), api.listLibrary().catch(() => [])])
      .then(([w, a, sp, lf]) => { if (alive) { setWarranties(w); setAttachments(a); setShopProducts(sp); setLibFiles(lf); } })
      .catch(() => {});
    return () => { alive = false; };
  }, [partId, tick]);

  async function linkModel(fid: number | null) {
    try { await api.updateInvPart(partId, { model_file_id: fid }); setModelSel(''); refresh(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  const linkedProduct = shopProducts.find((p) => p.part_id === partId) || null;
  async function linkProduct(pid: number) {
    try { await api.updateShopProduct(pid, { part_id: partId }); setLinkSel(''); refresh(); toast(t('v2.shop.linked', 'Linked to shop product'), 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  async function unlinkProduct(pid: number) {
    try { await api.updateShopProduct(pid, { part_id: null }); refresh(); } catch (e) { toast((e as Error).message, 'error'); }
  }
  async function createProductFromPart() {
    if (!part) return;
    try { await api.createShopProduct({ name: part.name, price: 0, part_id: partId }); refresh(); toast(t('v2.shop.created', 'Shop product created — set a price in Shop'), 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  async function addW() {
    if (!wForm.end_date && !wForm.provider) { toast(t('v2.warr.need', 'Enter a provider or end date'), 'error'); return; }
    try { await api.addWarranty({ entity_type: 'part', entity_id: String(partId), provider: wForm.provider || undefined, end_date: wForm.end_date || undefined }); setWForm({ provider: '', end_date: '' }); refresh(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  async function delW(id: number) { try { await api.deleteWarranty(id); refresh(); } catch (e) { toast((e as Error).message, 'error'); } }
  async function addA() {
    if (!aForm.url.trim()) { toast(t('v2.att.url_req', 'Enter a URL'), 'error'); return; }
    try { await api.addAttachment({ entity_type: 'part', entity_id: String(partId), kind: aForm.kind, title: aForm.title || undefined, url: aForm.url.trim() }); setAForm({ title: '', url: '', kind: 'manual' }); refresh(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }
  async function delA(id: number) { try { await api.deleteAttachment(id); refresh(); } catch (e) { toast((e as Error).message, 'error'); } }

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

        <div className="drawer-history">
          <div className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {t('v2.bom.title', 'Bill of materials')}
            {bom.cost > 0 && <span className="muted" style={{ marginLeft: 'auto', fontWeight: 400 }}>{t('v2.bom.cost', 'Material cost')}: {bom.cost.toFixed(2)}</span>}
          </div>
          {bom.lines.length === 0 ? (
            <p className="muted empty-note" style={{ margin: 0 }}>{t('v2.bom.empty', 'No components. Add a recipe to build this from stock.')}</p>
          ) : bom.lines.map((l) => (
            <div key={l.id} className="err-row" style={{ gridTemplateColumns: '1.5fr auto auto auto', padding: '6px 0' }}>
              <span className="err-msg">{l.component_name || l.filament_name || `#${l.component_part_id ?? l.filament_profile_id}`}</span>
              <span className="muted tnum">{l.quantity}{l.waste_pct ? ` +${l.waste_pct}%` : ''}</span>
              <span className="tnum">{l.line_cost ? l.line_cost.toFixed(2) : '—'}</span>
              <button className="btn btn--sm btn--ghost" onClick={() => delBomLine(l.id)}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <select className="input" value={bl.component} onChange={(e) => setBl({ ...bl, component: e.target.value })} style={{ flex: '1 1 130px', minWidth: 0 }}>
              <option value="">{t('v2.bom.component', 'Component…')}</option>
              {allParts.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <input className="input" type="number" value={bl.qty} onChange={(e) => setBl({ ...bl, qty: e.target.value })} title={t('v2.bom.qty', 'Qty')} style={{ maxWidth: 70 }} />
            <input className="input" type="number" value={bl.waste} onChange={(e) => setBl({ ...bl, waste: e.target.value })} title={t('v2.bom.waste', 'Waste %')} style={{ maxWidth: 64 }} />
            <button className="btn btn--sm" onClick={addBomLine}>{t('v2.bom.add', 'Add')}</button>
          </div>
        </div>

        <div className="drawer-history">
          <div className="field-label">{t('v2.model.title', 'Printable file')}</div>
          {part?.model_file_id ? (
            <div className="err-row" style={{ gridTemplateColumns: 'auto 1.4fr auto', padding: '6px 0' }}>
              <span className="hs-badge hs-badge-neutral">{part.model_file_type || 'file'}</span>
              <a className="err-msg" href={`#/library/${part.model_file_id}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.model_name || `#${part.model_file_id}`}</a>
              <button className="btn btn--sm btn--ghost" onClick={() => linkModel(null)}>{t('v2.model.unlink', 'Unlink')}</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
              <select className="input" value={modelSel} onChange={(e) => setModelSel(e.target.value)} style={{ flex: '1 1 150px', minWidth: 0 }}>
                <option value="">{t('v2.model.pick', 'Link a printable file…')}</option>
                {libFiles.map((f) => <option key={f.id} value={f.id}>{f.original_name} ({f.file_type})</option>)}
              </select>
              <button className="btn btn--sm" disabled={!modelSel} onClick={() => linkModel(Number(modelSel))}>{t('v2.model.link', 'Link')}</button>
            </div>
          )}
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

        <div className="drawer-history">
          <div className="field-label">{t('v2.warr.title', 'Warranty')}</div>
          {warranties.map((w) => {
            const exp = w.end_date ? new Date(w.end_date) : null;
            const expired = exp ? exp.getTime() < Date.now() : false;
            return (
              <div key={w.id} className="err-row" style={{ gridTemplateColumns: '1.4fr auto auto', padding: '6px 0' }}>
                <span className="err-msg">{w.provider || t('v2.warr.warranty', 'Warranty')}</span>
                <span className={expired ? 'low tnum' : 'muted tnum'}>{w.end_date || '—'}{expired ? ` · ${t('v2.warr.expired', 'expired')}` : ''}</span>
                <button className="btn btn--sm btn--ghost" onClick={() => delW(w.id)}>✕</button>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <input className="input" placeholder={t('v2.warr.provider', 'Provider')} value={wForm.provider} onChange={(e) => setWForm({ ...wForm, provider: e.target.value })} style={{ flex: '1 1 120px', minWidth: 0 }} />
            <input className="input" type="date" value={wForm.end_date} onChange={(e) => setWForm({ ...wForm, end_date: e.target.value })} style={{ maxWidth: 150 }} />
            <button className="btn btn--sm" onClick={addW}>{t('v2.warr.add', 'Add')}</button>
          </div>
        </div>

        <div className="drawer-history">
          <div className="field-label">{t('v2.att.title', 'Attachments')}</div>
          {attachments.map((a) => (
            <div key={a.id} className="err-row" style={{ gridTemplateColumns: 'auto 1.4fr auto', padding: '6px 0' }}>
              <span className="hs-badge hs-badge-neutral">{a.kind}</span>
              <a className="err-msg" href={a.url} target="_blank" rel="noreferrer" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title || a.url}</a>
              <button className="btn btn--sm btn--ghost" onClick={() => delA(a.id)}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <select className="input" value={aForm.kind} onChange={(e) => setAForm({ ...aForm, kind: e.target.value })} style={{ maxWidth: 110 }}>
              {['manual', 'receipt', 'photo', 'link'].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <input className="input" placeholder={t('v2.att.titlep', 'Title')} value={aForm.title} onChange={(e) => setAForm({ ...aForm, title: e.target.value })} style={{ maxWidth: 120 }} />
            <input className="input" placeholder="https://…" value={aForm.url} onChange={(e) => setAForm({ ...aForm, url: e.target.value })} style={{ flex: '1 1 130px', minWidth: 0 }} />
            <button className="btn btn--sm" onClick={addA}>{t('v2.att.add', 'Add')}</button>
          </div>
        </div>

        <div className="drawer-history">
          <div className="field-label">{t('v2.shop.title', 'Sell as product')}</div>
          {linkedProduct ? (
            <div>
              <div className="err-row" style={{ gridTemplateColumns: '1.4fr auto auto', padding: '6px 0' }}>
                <span className="err-msg" style={{ fontWeight: 600 }}>{linkedProduct.name}</span>
                <span className="tnum">{linkedProduct.price} {linkedProduct.currency || ''}{linkedProduct.margin != null ? ` · ${t('v2.shop.margin', 'margin')} ${linkedProduct.margin.toFixed(2)}` : ''}</span>
                <button className="btn btn--sm btn--ghost" onClick={() => unlinkProduct(linkedProduct.id)}>{t('v2.shop.unlink', 'Unlink')}</button>
              </div>
              <p className="muted micro" style={{ margin: '4px 0 0' }}>{t('v2.shop.sellable', 'Sellable stock')}: {part?.total_stock ?? 0} {part?.unit}. {t('v2.shop.sale_hint', 'Selling deducts this stock; margin uses the BOM cost.')}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
              <select className="input" value={linkSel} onChange={(e) => setLinkSel(e.target.value)} style={{ flex: '1 1 150px', minWidth: 0 }}>
                <option value="">{t('v2.shop.link_existing', 'Link existing product…')}</option>
                {shopProducts.filter((p) => p.part_id == null).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn--sm" disabled={!linkSel} onClick={() => linkProduct(Number(linkSel))}>{t('v2.shop.link', 'Link')}</button>
              <button className="btn btn--sm btn--ghost" onClick={createProductFromPart}>{t('v2.shop.create', '+ New product')}</button>
            </div>
          )}
        </div>

        <div className="drawer-controls" style={{ marginTop: 4 }}>
          <button className="btn btn--danger" onClick={removePart}>{t('v2.parts.delete', 'Delete part')}</button>
        </div>
      </aside>
    </div>
  );
}
