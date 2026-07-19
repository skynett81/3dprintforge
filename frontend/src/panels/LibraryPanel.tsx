import { Suspense, lazy, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { formatBytes } from '../format';
import type { LibraryFile } from '../types';

const ModelViewer = lazy(() => import('../components/ModelViewer'));
const COLS = '2.2fr 0.8fr 0.8fr 0.6fr 0.9fr auto auto';

interface Props { selected?: string | null; onSelect?: (id: string) => void; onBack?: () => void }

function when(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function LibraryPanel({ selected, onSelect, onBack }: Props = {}) {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<LibraryFile[]>(api.listLibrary, 30000);
  const files = data ?? [];
  const totalSize = files.reduce((a, f) => a + (f.file_size || 0), 0);

  async function remove(f: LibraryFile) {
    if (!confirm(t('v2.library.confirm', `Delete "${f.original_name}"?`))) return;
    try { await api.deleteLibrary(f.id); toast(t('v2.library.removed', 'File removed'), 'success'); reload(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  // ---- 3D viewer for a selected 3MF file ----
  const detail = selected ? files.find((f) => String(f.id) === selected) : null;
  if (selected && files.length > 0) {
    if (!detail) return (
      <div><button className="btn btn--sm" onClick={onBack}>← {t('v2.library.title', 'Library')}</button>
        <p className="muted empty-note">{t('v2.library.gone', 'That file is no longer in the library.')}</p></div>
    );
    const is3mf = (detail.file_type || '').toLowerCase() === '3mf' || detail.filename?.toLowerCase().endsWith('.3mf');
    return (
      <div>
        <div className="panel-head">
          <div>
            <button className="btn btn--sm" onClick={onBack}>← {t('v2.library.title', 'Library')}</button>
            <h2 className="panel-title" style={{ marginTop: 10 }}>{detail.original_name}</h2>
            <p className="muted sub">
              {detail.file_type} · {formatBytes(detail.file_size)} · {detail.print_count} {t('v2.library.prints', 'prints')}
              {detail.designer ? ` · ${detail.designer}` : ''}{detail.license ? ` · ${detail.license}` : ''}
              {detail.used_by ? <span className="hs-badge hs-badge-good" style={{ marginLeft: 8 }}>{t('v2.library.used_in', 'used in')} {detail.used_by} {t('v2.library.products', 'product(s)')}</span> : null}
            </p>
          </div>
          <a className="btn btn--sm" href={`/api/library/${detail.id}/download`}>{t('v2.library.download', 'Download')}</a>
        </div>
        <section className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
          {is3mf ? (
            <Suspense fallback={<div className="model-overlay muted" style={{ position: 'static', height: 440 }}>{t('common.loading', 'Loading…')}</div>}>
              <ModelViewer src={`/api/library/${detail.id}/model`} />
            </Suspense>
          ) : (
            <p className="muted empty-note" style={{ padding: 20 }}>{t('v2.library.no_preview', '3D preview is available for 3MF files only.')}</p>
          )}
        </section>
        <LibraryMeta file={detail} onSaved={reload} />
      </div>
    );
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.library.title', 'Library')}</h2>
          <p className="muted sub">{files.length} {t('v2.library.files', 'files')} · {formatBytes(totalSize)}</p>
        </div>
      </div>
      <section className="card">
        {files.length === 0 ? (
          <p className="muted empty-note">{t('v2.library.none', 'No files in the library.')}</p>
        ) : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: COLS }}>
              <span>{t('v2.library.name', 'File')}</span>
              <span>{t('v2.library.type', 'Type')}</span>
              <span>{t('v2.library.size', 'Size')}</span>
              <span>{t('v2.library.prints', 'Prints')}</span>
              <span>{t('v2.library.last', 'Last printed')}</span>
              <span></span>
              <span></span>
            </div>
            {files.map((f) => (
              <div className="lib-row lib-row--btn" key={f.id} style={{ gridTemplateColumns: COLS }} role="button" tabIndex={0} onClick={() => onSelect?.(String(f.id))}>
                <span className="lib-name ellipsis" title={f.original_name}>{f.original_name}{f.used_by ? <span className="hs-badge hs-badge-good" style={{ marginLeft: 6, fontSize: '0.6rem' }}>{f.used_by}×</span> : null}</span>
                <span><span className="tile-tag">{f.file_type}</span></span>
                <span className="tnum muted">{formatBytes(f.file_size)}</span>
                <span className="tnum">{f.print_count}</span>
                <span className="muted tnum">{when(f.last_printed)}</span>
                <span className="muted">{t('v2.inv.view', 'view →')}</span>
                <button className="btn btn--sm btn--ghost" title={t('common.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); remove(f); }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Manyfold-style provenance metadata editor for a library file.
function LibraryMeta({ file, onSaved }: { file: LibraryFile; onSaved: () => void }) {
  const t = useT();
  const toast = useToast();
  const [f, setF] = useState({ designer: file.designer || '', license: file.license || '', source_url: file.source_url || '', tags: file.tags || '', notes: file.notes || '' });
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try { await api.updateLibrary(file.id, f); toast(t('v2.library.saved', 'Metadata saved'), 'success'); onSaved(); }
    catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }
  return (
    <section className="card">
      <div className="field-label" style={{ marginBottom: 8 }}>{t('v2.library.meta', 'Model details')}</div>
      <div className="drawer-fields">
        <label className="field"><span className="field-label">{t('v2.library.designer', 'Designer')}</span><input className="input" value={f.designer} onChange={(e) => setF({ ...f, designer: e.target.value })} /></label>
        <label className="field"><span className="field-label">{t('v2.library.license', 'License')}</span><input className="input" value={f.license} onChange={(e) => setF({ ...f, license: e.target.value })} placeholder="CC-BY, CC0…" /></label>
        <label className="field" style={{ gridColumn: '1 / -1' }}><span className="field-label">{t('v2.library.source', 'Source URL')}</span><input className="input" value={f.source_url} onChange={(e) => setF({ ...f, source_url: e.target.value })} placeholder="https://…" /></label>
        <label className="field" style={{ gridColumn: '1 / -1' }}><span className="field-label">{t('v2.library.tags', 'Tags')}</span><input className="input" value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="calibration, gears…" /></label>
        <label className="field" style={{ gridColumn: '1 / -1' }}><span className="field-label">{t('v2.library.notes', 'Notes')}</span><input className="input" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
      </div>
      <div className="drawer-controls">
        <button className="btn btn--primary" disabled={busy} onClick={save}>{t('common.save', 'Save')}</button>
        {f.source_url && <a className="btn btn--ghost" href={f.source_url} target="_blank" rel="noreferrer">{t('v2.library.open_source', 'Open source')}</a>}
      </div>
    </section>
  );
}
