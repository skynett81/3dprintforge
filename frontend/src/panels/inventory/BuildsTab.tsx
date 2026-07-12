import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { Build, InvPart, BuildShoppingItem } from '../../types';

const STATUS_CLS: Record<string, string> = { planned: 'neutral', in_progress: 'warn', completed: 'good', cancelled: 'bad' };

function when(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function BuildsTab() {
  const t = useT();
  const toast = useToast();
  const { data: buildData, reload } = useResource<Build[]>(api.listBuilds, 0);
  const { data: partData } = useResource<InvPart[]>(api.listInvParts, 0);
  const { data: shopData, reload: reloadShop } = useResource<BuildShoppingItem[]>(api.getBuildShoppingList, 0);
  const shopping = shopData ?? [];
  const builds = useMemo(() => buildData ?? [], [buildData]);
  const products = (partData ?? []).filter((p) => p.type === 'product' || p.type === 'component');
  const [product, setProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [busy, setBusy] = useState(false);

  async function create() {
    if (!product) { toast(t('v2.build.pick', 'Pick a product to build'), 'error'); return; }
    setBusy(true);
    try { await api.addBuild({ part_id: Number(product), quantity: Number(qty) || 1 }); setProduct(''); setQty('1'); reload(); reloadShop(); }
    catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }
  async function complete(b: Build) {
    setBusy(true);
    try {
      const r = await api.completeBuild(b.id);
      if (r.shortages && r.shortages.length) toast(`${t('v2.build.short', 'Completed with shortages')}: ${r.shortages.map((s) => s.part_name).join(', ')}`, 'error');
      else toast(t('v2.build.done', 'Build completed — stock updated'), 'success');
      reload(); reloadShop();
    } catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }
  async function cancel(b: Build) {
    try { await api.cancelBuild(b.id); reload(); reloadShop(); } catch (e) { toast((e as Error).message, 'error'); }
  }

  const open = builds.filter((b) => b.status === 'planned' || b.status === 'in_progress').length;

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 12 }}>
        <p className="muted sub" style={{ margin: 0 }}>{builds.length} {t('v2.build.builds', 'build orders')}{open ? ` · ${open} ${t('v2.build.open', 'open')}` : ''}</p>
      </div>

      <section className="card" style={{ marginBottom: 14 }}>
        <div className="field-label">{t('v2.build.new', 'New build')}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
          <select className="input" value={product} onChange={(e) => setProduct(e.target.value)} style={{ flex: '1 1 200px', minWidth: 0 }}>
            <option value="">{t('v2.build.product', 'Product to build…')}</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input className="input" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} style={{ maxWidth: 80 }} />
          <button className="btn btn--primary btn--sm" disabled={busy} onClick={create}>{t('v2.build.create', 'Create build')}</button>
        </div>
        <p className="muted micro" style={{ margin: '8px 0 0' }}>{t('v2.build.hint', 'Completing a build consumes the BOM components from stock and adds finished units.')}</p>
      </section>

      {shopping.length > 0 && (
        <section className="card" style={{ marginBottom: 14 }}>
          <div className="field-label" style={{ marginBottom: 8 }}>{t('v2.build.shopping', 'Shopping list for planned builds')}</div>
          <div className="err-list">
            <div className="err-row st-head" style={{ gridTemplateColumns: '1.6fr auto auto auto' }}>
              <span className="muted">{t('v2.build.component', 'Component')}</span>
              <span className="muted">{t('v2.build.needed', 'Needed')}</span>
              <span className="muted">{t('v2.build.on_hand', 'On hand')}</span>
              <span className="muted">{t('v2.build.buy', 'Buy')}</span>
            </div>
            {shopping.map((s) => (
              <div className="err-row" key={s.part_id} style={{ gridTemplateColumns: '1.6fr auto auto auto' }}>
                <span className="err-msg" style={{ fontWeight: 600 }}>{s.part_name}</span>
                <span className="muted tnum">{s.needed} {s.unit || ''}</span>
                <span className="muted tnum">{s.on_hand} {s.unit || ''}</span>
                <span className="tnum low" style={{ fontWeight: 600 }}>{s.shortfall} {s.unit || ''}</span>
              </div>
            ))}
          </div>
          <p className="muted micro" style={{ margin: '8px 0 0' }}>{t('v2.build.shopping_hint', 'Open builds reserve component stock; this is what you still need to buy to fulfil them.')}</p>
        </section>
      )}

      <section className="card">
        {builds.length === 0 ? (
          <p className="muted empty-note">{t('v2.build.empty', 'No build orders yet.')}</p>
        ) : (
          <div className="err-list">
            {builds.map((b) => (
              <div className="err-row" key={b.id} style={{ gridTemplateColumns: 'auto 1.4fr auto auto auto' }}>
                <span className={`hs-badge hs-badge-${STATUS_CLS[b.status] || 'neutral'}`}>{b.status.replace('_', ' ')}</span>
                <span className="err-msg" style={{ fontWeight: 600 }}>{b.part_name || `#${b.part_id}`}</span>
                <span className="tnum">×{b.quantity}</span>
                <span className="muted tnum">{when(b.completed_at || b.created_at)}</span>
                <span style={{ display: 'flex', gap: 5 }}>
                  {(b.status === 'planned' || b.status === 'in_progress') ? (
                    <>
                      <button className="btn btn--sm btn--primary" disabled={busy} onClick={() => complete(b)}>{t('v2.build.complete', 'Complete')}</button>
                      <button className="btn btn--sm btn--ghost" onClick={() => cancel(b)}>{t('v2.build.cancel', 'Cancel')}</button>
                    </>
                  ) : <span />}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
