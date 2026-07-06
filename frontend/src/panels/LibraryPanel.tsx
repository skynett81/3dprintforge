import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { formatBytes } from '../format';
import type { LibraryFile } from '../types';

function when(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date((iso || '').replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function LibraryPanel() {
  const t = useT();
  const { data } = useResource<LibraryFile[]>(api.listLibrary, 30000);
  const files = data ?? [];
  const totalSize = files.reduce((a, f) => a + (f.file_size || 0), 0);

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
            <div className="lib-head">
              <span>{t('v2.library.name', 'File')}</span>
              <span>{t('v2.library.type', 'Type')}</span>
              <span>{t('v2.library.size', 'Size')}</span>
              <span>{t('v2.library.prints', 'Prints')}</span>
              <span>{t('v2.library.last', 'Last printed')}</span>
            </div>
            {files.map((f) => (
              <div className="lib-row" key={f.id}>
                <span className="lib-name ellipsis" title={f.original_name}>{f.original_name}</span>
                <span><span className="tile-tag">{f.file_type}</span></span>
                <span className="tnum muted">{formatBytes(f.file_size)}</span>
                <span className="tnum">{f.print_count}</span>
                <span className="muted tnum">{when(f.last_printed)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
