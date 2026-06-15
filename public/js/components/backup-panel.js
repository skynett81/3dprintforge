// Cloud Backup Panel — create, upload, restore, download, delete backups + export
(function() {
  'use strict';

  let _backups = [];

  function _esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  }

  function formatDate(iso) {
    if (!iso) return '--';
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function showStatus(msg, type) {
    const el = document.getElementById('backup-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'backup-status backup-status--' + (type || 'info');
    el.style.display = 'block';
    if (type !== 'error') {
      setTimeout(() => { el.style.display = 'none'; }, 4000);
    }
  }

  // ═══ API calls ═══

  async function fetchBackups() {
    const res = await fetch('/api/backup/list');
    if (!res.ok) throw new Error('Failed to fetch backups');
    return res.json();
  }

  async function createBackup() {
    const res = await fetch('/api/backup', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create backup');
    return res.json();
  }

  async function deleteBackup(filename) {
    const res = await fetch('/api/backup/' + encodeURIComponent(filename), { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete backup');
    return res.json();
  }

  async function restoreBackup(filename) {
    const res = await fetch('/api/backup/restore/' + encodeURIComponent(filename), { method: 'POST' });
    if (!res.ok) throw new Error('Failed to restore backup');
    return res.json();
  }

  async function uploadBackup(file) {
    const buffer = await file.arrayBuffer();
    const res = await fetch('/api/backup/upload?filename=' + encodeURIComponent(file.name), {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: buffer
    });
    if (!res.ok) throw new Error('Failed to upload backup');
    return res.json();
  }

  // ═══ List rendering ═══

  function renderList() {
    const listEl = document.getElementById('backup-list');
    if (!listEl) return;

    if (!_backups.length) {
      listEl.innerHTML = '<div class="backup-empty">' + _esc(t('backup.no_backups')) + '</div>';
      return;
    }

    let html = '';
    for (const b of _backups) {
      html += `<div class="backup-item">
        <div class="backup-item-info">
          <div class="backup-item-name">${_esc(b.filename)}</div>
          <div class="backup-item-meta">
            <span>${t('backup.size')}: ${formatSize(b.size)}</span>
            <span>${t('backup.date')}: ${formatDate(b.created_at)}</span>
          </div>
        </div>
        <div class="backup-item-actions">
          <a href="/api/backup/download/${encodeURIComponent(b.filename)}" class="form-btn form-btn-sm form-btn-ghost" title="${_esc(t('backup.download'))}"><i class="bi bi-download"></i> ${t('backup.download')}</a>
          <button class="form-btn form-btn-sm form-btn-ghost backup-btn--restore" data-filename="${_esc(b.filename)}" title="${_esc(t('backup.restore'))}"><i class="bi bi-arrow-counterclockwise"></i> ${t('backup.restore')}</button>
          <button class="form-btn form-btn-sm form-btn-ghost backup-btn--delete" data-filename="${_esc(b.filename)}" style="color:var(--accent-red)" title="${_esc(t('backup.delete'))}"><i class="bi bi-trash"></i> ${t('backup.delete')}</button>
        </div>
      </div>`;
    }
    listEl.innerHTML = html;

    // Bind restore buttons
    listEl.querySelectorAll('.backup-btn--restore').forEach(btn => {
      btn.addEventListener('click', () => showRestoreConfirm(btn.dataset.filename));
    });

    // Bind delete buttons
    listEl.querySelectorAll('.backup-btn--delete').forEach(btn => {
      btn.addEventListener('click', () => handleDelete(btn.dataset.filename, btn.closest('.backup-item')));
    });
  }

  async function refreshList() {
    try {
      _backups = await fetchBackups();
      renderList();
    } catch (e) {
      showStatus(e.message, 'error');
    }
  }

  // ═══ Actions ═══

  async function handleCreate() {
    const btn = document.getElementById('backup-create-btn');
    if (!btn) return;
    btn.disabled = true;
    btn.innerHTML = '<span class="backup-spinner"></span> ' + _esc(t('backup.creating'));
    try {
      await createBackup();
      showStatus(t('backup.created_ok'), 'success');
      await refreshList();
    } catch (e) {
      showStatus(e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-plus-circle"></i> ' + t('backup.create');
    }
  }

  async function handleUpload() {
    const input = document.getElementById('backup-file-input');
    if (!input || !input.files.length) return;
    const file = input.files[0];

    const btn = document.getElementById('backup-upload-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="backup-spinner"></span> ' + _esc(t('backup.uploading'));
    }
    try {
      await uploadBackup(file);
      showStatus(t('backup.uploaded_ok'), 'success');
      input.value = '';
      await refreshList();
    } catch (e) {
      showStatus(e.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-upload"></i> ' + t('backup.upload');
      }
    }
  }

  function handleDelete(filename, row) {
    // Backup delete was a one-click immediate action with no confirm — an
    // accidental click meant a lost backup. Route it through undo instead.
    if (typeof window.deleteWithUndo === 'function') {
      return window.deleteWithUndo({
        message: t('backup.deleted_ok', 'Backup deleted'),
        delay: 7000,
        onHide: () => { if (row) row.style.display = 'none'; },
        onRestore: () => { if (row) row.style.display = ''; },
        commit: async () => {
          try { await deleteBackup(filename); await refreshList(); } catch (e) { showStatus(e.message, 'error'); }
        },
      });
    }
    deleteBackup(filename).then(() => { showStatus(t('backup.deleted_ok'), 'success'); return refreshList(); }).catch(e => showStatus(e.message, 'error'));
  }

  function showRestoreConfirm(filename) {
    // Remove any existing dialog
    const existing = document.getElementById('backup-restore-dialog');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'backup-restore-dialog';
    overlay.className = 'backup-dialog-overlay';
    overlay.innerHTML = `
      <div class="backup-dialog">
        <div class="backup-dialog-title">${t('backup.restore_confirm')}</div>
        <div class="backup-dialog-warning">${t('backup.restore_warning')}</div>
        <div class="backup-dialog-file">${_esc(filename)}</div>
        <div class="backup-dialog-actions">
          <button class="form-btn form-btn-sm form-btn-ghost" id="backup-cancel-btn">${t('backup.cancel')}</button>
          <button class="form-btn form-btn-sm" id="backup-confirm-btn" style="background:var(--accent-red)">${t('backup.confirm')}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    document.getElementById('backup-cancel-btn').addEventListener('click', () => overlay.remove());
    document.getElementById('backup-confirm-btn').addEventListener('click', async () => {
      overlay.remove();
      try {
        await restoreBackup(filename);
        showStatus(t('backup.restored_ok'), 'success');
        await refreshList();
      } catch (e) {
        showStatus(e.message, 'error');
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  // ═══ Main render ═══

  window.loadBackupPanel = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `
      <style>
        .backup-panel { padding: 1rem; }
        .backup-section { margin-bottom: 1.5rem; }
        .backup-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .backup-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
        /* Buttons use the shared .form-btn system; .backup-btn--restore/--delete
           remain only as markers for the JS event bindings. */
        .backup-file-input { display: none; }
        .backup-file-label {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.8rem; color: var(--text-muted);
        }
        .backup-status {
          display: none; margin-top: 0.75rem; padding: 0.5rem 0.75rem;
          border-radius: var(--radius); font-size: 0.8rem;
        }
        .backup-status--success { background: rgba(0, 200, 100, 0.12); color: var(--accent-green-text); }
        .backup-status--error { background: rgba(255, 60, 60, 0.12); color: var(--accent-red); }
        .backup-status--info { background: rgba(0, 180, 255, 0.12); color: var(--accent-blue); }
        .backup-empty { color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0; }
        .backup-item {
          display: flex; flex-direction: column; gap: 0.6rem;
          padding: 0.85rem 1rem; border-radius: var(--radius);
          background: var(--bg-secondary); border: 1px solid var(--border-color);
        }
        .backup-item-info { min-width: 0; }
        .backup-item-name {
          font-size: 0.85rem; font-weight: 600; color: var(--text-primary);
          word-break: break-all; line-height: 1.3;
        }
        .backup-item-meta {
          display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.74rem; color: var(--text-muted); margin-top: 0.3rem;
        }
        .backup-item-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; padding-top: 0.5rem; border-top: 1px solid var(--border-color); }
        .backup-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: backup-spin 0.6s linear infinite;
        }
        @keyframes backup-spin { to { transform: rotate(360deg); } }
        .backup-export-links { display: flex; gap: 0.75rem; }
        .backup-dialog-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.55); display: flex; align-items: center;
          justify-content: center; z-index: 9999;
        }
        .backup-dialog {
          background: var(--bg-secondary); border: 1px solid var(--border-color);
          border-radius: var(--radius); padding: 1.5rem; min-width: 320px; max-width: 420px;
        }
        .backup-dialog-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; }
        .backup-dialog-warning { font-size: 0.85rem; color: var(--accent-red); margin-bottom: 0.75rem; }
        .backup-dialog-file { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem; word-break: break-all; }
        .backup-dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
      </style>

      <div class="backup-panel">
        <!-- Unified action bar — create, upload + history exports always visible -->
        <div class="backup-section" style="margin-bottom:1rem">
          <div class="backup-section-title">${t('backup.title')}</div>
          <div class="backup-actions">
            <button class="form-btn form-btn-sm" id="backup-create-btn"><i class="bi bi-plus-circle"></i> ${t('backup.create')}</button>
            <button class="form-btn form-btn-sm form-btn-ghost" id="backup-upload-btn" onclick="document.getElementById('backup-file-input').click()"><i class="bi bi-upload"></i> ${t('backup.upload')}</button>
            <input type="file" id="backup-file-input" class="backup-file-input" accept=".db">
            <span style="border-left:1px solid var(--border-color);height:24px;margin:0 4px"></span>
            <span style="font-size:0.78rem;color:var(--text-muted)">${t('backup.export_title')}:</span>
            <a href="/api/history/export?format=csv" class="form-btn form-btn-sm form-btn-ghost" download>${t('backup.export_csv')}</a>
            <a href="/api/history/export?format=json" class="form-btn form-btn-sm form-btn-ghost" download>${t('backup.export_json')}</a>
          </div>
          <div class="backup-status" id="backup-status"></div>
        </div>

        <!-- Backup list (auto-fits 1 or 2 columns based on viewport width) -->
        <div class="backup-section">
          <div class="backup-section-title">${t('backup.list_title')}</div>
          <div id="backup-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:0.5rem;align-items:start">
            <div class="backup-empty"><span class="backup-spinner"></span></div>
          </div>
        </div>
      </div>`;

    // Bind events
    document.getElementById('backup-create-btn').addEventListener('click', handleCreate);
    document.getElementById('backup-file-input').addEventListener('change', handleUpload);

    // Initial load
    refreshList();
  };

})();
