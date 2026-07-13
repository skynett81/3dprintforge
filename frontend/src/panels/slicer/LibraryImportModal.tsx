import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { LibraryFile } from '../../types';

const MODEL_TYPES = ['stl', '3mf', 'obj', 'step', 'stp'];

/**
 * Pick a model straight from the 3DPrintForge model library and load it onto
 * the slicer plate — everything in one place, no re-uploading.
 */
export function LibraryImportModal({ onClose, onImport }: { onClose: () => void; onImport: (f: File) => void }) {
  const t = useT();
  const toast = useToast();
  const { data } = useResource<LibraryFile[]>(api.listLibrary, 0);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<number | null>(null);

  const items = useMemo(() => {
    const all = (data ?? []).filter((i) => MODEL_TYPES.includes((i.file_type || '').toLowerCase()));
    const needle = q.trim().toLowerCase();
    return needle ? all.filter((i) => i.original_name.toLowerCase().includes(needle)) : all;
  }, [data, q]);

  async function pick(item: LibraryFile) {
    setBusy(item.id);
    try {
      const file = await api.downloadLibraryModel(item.id, item.original_name);
      onImport(file);
      onClose();
    } catch (e) {
      toast((e as Error).message || t('v2.lib.fail', 'Import failed'), 'error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="model-modal-backdrop" onClick={onClose}>
      <div className="model-modal lib-modal" onClick={(e) => e.stopPropagation()}>
        <div className="model-modal-head">
          <span>{t('v2.lib.title', 'Import from model library')}</span>
          <button className="btn btn--sm btn--ghost" onClick={onClose}>×</button>
        </div>
        <div style={{ padding: 14 }}>
        <input className="input" placeholder={t('v2.lib.search', 'Search models…')} value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 12 }} />
        <div className="lib-grid">
          {items.map((i) => (
            <button key={i.id} className="lib-card" disabled={busy !== null} onClick={() => pick(i)}>
              <div className="lib-thumb">
                {i.thumbnail_path
                  ? <img src={`/api/library/${i.id}/thumbnail`} alt="" loading="lazy" />
                  : <span className="lib-ext">{(i.file_type || '?').toUpperCase()}</span>}
              </div>
              <span className="lib-name ellipsis" title={i.original_name}>{i.original_name}</span>
              <span className="muted micro">{(i.file_size / 1024 / 1024).toFixed(1)} MB{busy === i.id ? ` · ${t('v2.lib.loading', 'loading…')}` : ''}</span>
            </button>
          ))}
          {items.length === 0 && <p className="muted empty-note">{t('v2.lib.empty', 'No models in the library yet.')}</p>}
        </div>
        </div>
      </div>
    </div>
  );
}
