import { useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { formatBytes } from '../format';
import type { BackupFile } from '../types';

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function BackupPanel({ embedded }: { embedded?: boolean } = {}) {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<BackupFile[]>(api.listBackups, 0);
  const [busy, setBusy] = useState(false);
  const backups = [...(data ?? [])].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  async function create() {
    setBusy(true);
    try { await api.createBackup(); toast(t('v2.backup.created', 'Backup created'), 'success'); reload(); }
    catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          {!embedded && <h2 className="panel-title">{t('v2.backup.title', 'Backup')}</h2>}
          <p className="muted sub">{backups.length} {t('v2.backup.backups', 'backups on disk')}</p>
        </div>
        <button className="btn btn--primary" disabled={busy} onClick={create}>{t('v2.backup.create', 'Create backup')}</button>
      </div>
      <section className="card">
        {backups.length === 0 ? (
          <p className="muted empty-note">{t('v2.backup.none', 'No backups yet.')}</p>
        ) : (
          <div className="lib-list">
            <div className="lib-head" style={{ gridTemplateColumns: '2.4fr 1fr 1.2fr' }}>
              <span>{t('v2.backup.file', 'File')}</span>
              <span>{t('v2.backup.size', 'Size')}</span>
              <span>{t('v2.backup.date', 'Created')}</span>
            </div>
            {backups.map((b) => (
              <div className="lib-row" key={b.filename} style={{ gridTemplateColumns: '2.4fr 1fr 1.2fr' }}>
                <span className="lib-name ellipsis" title={b.filename}>{b.filename}</span>
                <span className="tnum muted">{formatBytes(b.size)}</span>
                <span className="muted tnum">{when(b.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
