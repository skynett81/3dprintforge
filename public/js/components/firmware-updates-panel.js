// Firmware Updates Panel — unified view of firmware updates across all printers
(function() {
  'use strict';

  let _updates = [];
  let _lastCheckAt = null;
  let _checking = false;

  // View mode — persisted across sessions so users get their preferred layout back.
  // 'active'  → only the currently-selected printer (matches the rest of the dashboard)
  // 'columns' → responsive grid, all printers at once
  // 'list'    → single vertical column, all printers (legacy behaviour)
  const VIEW_MODES = ['active', 'columns', 'list'];
  let _viewMode = (() => {
    try {
      const v = localStorage.getItem('fw_view_mode');
      return VIEW_MODES.includes(v) ? v : 'active';
    } catch { return 'active'; }
  })();

  function _setViewMode(mode) {
    if (!VIEW_MODES.includes(mode)) return;
    _viewMode = mode;
    try { localStorage.setItem('fw_view_mode', mode); } catch {}
    _render();
  }

  // Resubscribe once the shared printerState store is available so switching
  // the active printer live-updates this panel when we're in 'active' mode.
  function _bindActivePrinter() {
    if (_bindActivePrinter._done) return;
    const st = window.printerState;
    if (!st || typeof st.subscribe !== 'function') return;
    st.subscribe('*', () => {
      if (_viewMode === 'active') _render();
    });
    _bindActivePrinter._done = true;
  }

  function _esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  // Lightweight Markdown → HTML renderer (headings, bold, italic, lists, paragraphs, line breaks)
  function renderMarkdown(md) {
    if (!md) return '';
    // Escape HTML first
    let html = _esc(md);

    // Process line by line to handle lists and headings
    const lines = html.split('\n');
    const out = [];
    let inList = false;

    for (let raw of lines) {
      const line = raw.trimEnd();

      // Skip empty lines (they create paragraph breaks)
      if (!line.trim()) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('');
        continue;
      }

      // Headings: ### / ## / #
      const h3 = line.match(/^###\s+(.+)$/);
      const h2 = line.match(/^##\s+(.+)$/);
      const h1 = line.match(/^#\s+(.+)$/);
      if (h1 || h2 || h3) {
        if (inList) { out.push('</ul>'); inList = false; }
        const level = h1 ? 'h5' : h2 ? 'h6' : 'h6';
        const text = (h1 || h2 || h3)[1];
        out.push(`<${level} style="margin:12px 0 6px;font-weight:700;color:var(--bs-body-color)">${text}</${level}>`);
        continue;
      }

      // Numbered list: 1. text
      const num = line.match(/^(\d+)\.\s+(.+)$/);
      if (num) {
        if (!inList) { out.push('<ol style="margin:4px 0 8px 20px;padding:0">'); inList = 'ol'; }
        out.push(`<li style="margin-bottom:4px">${num[2]}</li>`);
        continue;
      }

      // Bullet list: - text / * text
      const bullet = line.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        if (!inList) { out.push('<ul style="margin:4px 0 8px 20px;padding:0">'); inList = 'ul'; }
        out.push(`<li style="margin-bottom:4px">${bullet[1]}</li>`);
        continue;
      }

      // Italic note indented: *text
      const note = line.match(/^\s*\*([^*].+)$/);
      if (note) {
        out.push(`<div style="font-style:italic;color:var(--text-muted);margin:2px 0 6px 20px;font-size:0.88em">${note[1]}</div>`);
        continue;
      }

      // Close list if we're out of list items
      if (inList) { out.push(inList === 'ol' ? '</ol>' : '</ul>'); inList = false; }

      // Plain paragraph
      out.push(`<p style="margin:4px 0">${line}</p>`);
    }
    if (inList) out.push(inList === 'ol' ? '</ol>' : '</ul>');

    // Inline formatting: **bold**, *italic*, `code`
    let result = out.join('\n');
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
    return result;
  }

  function formatDate(iso) {
    if (!iso) return '--';
    const locale = (window.i18n?.getLocale() || 'en').replace('_', '-');
    return new Date(iso).toLocaleString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  async function fetchStatus() {
    try {
      const res = await fetch('/api/firmware/updates');
      if (!res.ok) return;
      const data = await res.json();
      _updates = Array.isArray(data?.availableUpdates) ? data.availableUpdates : [];
      _lastCheckAt = data?.lastCheckAt || null;
      _render();
    } catch {}
  }

  async function checkNow() {
    if (_checking) return;
    _checking = true;
    _render();
    try {
      await fetch('/api/firmware/check-now', { method: 'POST' });
      showToast('Firmware check started — this may take a minute', 'info');
      // Poll for results
      setTimeout(fetchStatus, 10000);
      setTimeout(fetchStatus, 30000);
      setTimeout(() => { _checking = false; _render(); }, 60000);
    } catch (e) {
      _checking = false;
      showToast('Check failed: ' + e.message, 'error');
      _render();
    }
  }

  async function checkPrinter(printerId) {
    try {
      const res = await fetch('/api/firmware/check/' + encodeURIComponent(printerId), { method: 'POST' });
      const data = await res.json();
      if (data.available) {
        showToast(`Update available for ${printerId}: ${data.current} → ${data.latest}`, 'info');
      } else {
        showToast(`${printerId} is up to date (${data.current})`, 'success');
      }
      fetchStatus();
    } catch (e) {
      showToast('Check failed: ' + e.message, 'error');
    }
  }

  async function triggerUpdate(printerId) {
    try {
      const res = await fetch('/api/firmware/trigger/' + encodeURIComponent(printerId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      // Manual update required (e.g. Bambu Lab)
      if (data.requiresManualUpdate) {
        showManualUpdateDialog(printerId, data);
        return;
      }

      if (res.ok && data.ok !== false) {
        showToast('Update triggered: ' + (data.message || 'OK'), 'success');
      } else {
        showToast('Trigger failed: ' + (data.error || data.message || 'Unknown error'), 'error');
      }
    } catch (e) {
      showToast('Trigger failed: ' + e.message, 'error');
    }
  }

  function showManualUpdateDialog(printerId, info) {
    const existing = document.getElementById('fw-manual-dialog');
    if (existing) existing.remove();
    const instructions = (info.instructions || []).map(i => `<li>${_esc(i)}</li>`).join('');
    const backdrop = document.createElement('div');
    backdrop.id = 'fw-manual-dialog';
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
    backdrop.innerHTML = `
      <div class="card" style="max-width:540px;width:100%">
        <div class="card-header">
          <h5 class="card-title mb-0"><i class="bi bi-info-circle"></i> Manual update required</h5>
        </div>
        <div class="card-body">
          <p>${_esc(info.message || 'This printer requires manual firmware update.')}</p>
          <ol class="mb-3">${instructions}</ol>
          <div class="alert alert-info mb-3" style="font-size:0.88rem">
            <i class="bi bi-lightbulb"></i> After you've installed the update on the printer, click <strong>"Mark as Updated"</strong> below to clear this notification. The next auto-check will verify the new version.
          </div>
          <div class="d-flex gap-2 justify-content-end flex-wrap">
            <button class="btn btn-secondary" id="fw-dlg-close">Close</button>
            <button class="btn btn-outline-primary" id="fw-dlg-recheck" data-printer="${_esc(printerId)}">
              <i class="bi bi-arrow-repeat"></i> Recheck now
            </button>
            <button class="btn btn-success" id="fw-dlg-dismiss" data-printer="${_esc(printerId)}">
              <i class="bi bi-check"></i> Mark as Updated
            </button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });
    document.getElementById('fw-dlg-close').addEventListener('click', () => backdrop.remove());
    document.getElementById('fw-dlg-recheck').addEventListener('click', async () => {
      backdrop.remove();
      await checkPrinter(printerId);
    });
    document.getElementById('fw-dlg-dismiss').addEventListener('click', async () => {
      backdrop.remove();
      await dismissUpdate(printerId);
    });
  }

  async function dismissUpdate(printerId) {
    try {
      const res = await fetch('/api/firmware/dismiss/' + encodeURIComponent(printerId), { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast('Update dismissed. Run "Check Now" to verify.', 'success');
        fetchStatus();
        // Also update the sidebar badge
        setTimeout(() => {
          const badge = document.getElementById('fw-nav-badge');
          if (badge) {
            const n = parseInt(badge.textContent || '0') - 1;
            if (n <= 0) badge.style.display = 'none';
            else badge.textContent = n;
          }
        }, 500);
      } else {
        showToast('Dismiss failed: ' + (data.error || 'Unknown'), 'error');
      }
    } catch (e) {
      showToast('Dismiss failed: ' + e.message, 'error');
    }
  }

  function showToast(msg, type) {
    if (window.showToast) window.showToast(msg, type);
    else console.log(`[toast ${type}] ${msg}`);
  }

  function _render() {
    const container = document.getElementById('firmware-updates-panel');
    if (!container) return;
    _bindActivePrinter();

    // Group updates by printer so multi-printer setups don't get a flat mixed list.
    // Each group holds the printer's stable update (if any) and dev commits (if any).
    const byPrinter = new Map();
    for (const u of _updates) {
      const id = u.printer_id || '(unknown)';
      if (!byPrinter.has(id)) {
        byPrinter.set(id, {
          printer_id: id,
          printer_name: u.printer_name || id,
          model: u.model || '',
          type: u.type || '',
          stable: null,
          dev: null,
        });
      }
      const g = byPrinter.get(id);
      if (u.update_available === 1) g.stable = u;
      if ((u.dev_commits_ahead || 0) > 0) g.dev = u;
    }

    const groups = Array.from(byPrinter.values())
      .sort((a, b) => String(a.printer_name).localeCompare(String(b.printer_name)));

    const stableCount = groups.filter(g => g.stable).length;
    const devCount = groups.filter(g => g.dev && !g.stable).length;
    const totalCount = stableCount + devCount;
    const printerCount = groups.length;

    // In 'active' mode, narrow the groups to just the currently-selected printer.
    const activeId = window.printerState?.getActivePrinterId?.() || null;
    let visible = groups;
    if (_viewMode === 'active' && activeId) {
      visible = groups.filter(g => g.printer_id === activeId);
      // If the active printer isn't in the updates list, synthesise an "up to date"
      // placeholder so the user knows the panel did see it.
      if (visible.length === 0) {
        const meta = window.printerState?.printerMeta?.[activeId] || {};
        visible = [{
          printer_id: activeId,
          printer_name: meta.name || activeId,
          model: meta.model || '',
          stable: null, dev: null,
        }];
      }
    }

    const cardClass = stableCount > 0 ? 'card-warning' : devCount > 0 ? 'card-info' : 'card-success';
    const badgeClass = stableCount > 0 ? 'bg-warning' : devCount > 0 ? 'bg-info' : 'bg-success';

    // View-mode toggle: Active / Columns / List.
    const viewToggle = `
      <div class="btn-group btn-group-sm me-2" role="group" aria-label="View mode">
        <button type="button" class="btn ${_viewMode === 'active' ? 'btn-primary' : 'btn-outline-secondary'}" data-view="active" title="Show the currently selected printer only">
          <i class="bi bi-person-check"></i> Active
        </button>
        <button type="button" class="btn ${_viewMode === 'columns' ? 'btn-primary' : 'btn-outline-secondary'}" data-view="columns" title="All printers side-by-side (responsive grid)">
          <i class="bi bi-grid-3x3-gap"></i> Columns
        </button>
        <button type="button" class="btn ${_viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}" data-view="list" title="All printers in a single vertical list">
          <i class="bi bi-list-ul"></i> List
        </button>
      </div>`;

    let html = `
      <div class="card card-outline ${cardClass}">
        <div class="card-header">
          <h3 class="card-title">
            <i class="bi bi-cloud-download"></i> Firmware Updates
            <span class="badge ${badgeClass}">${totalCount} ${totalCount === 1 ? 'update' : 'updates'}</span>
            ${printerCount > 1 ? `<span class="badge text-bg-secondary ms-1">${printerCount} printers</span>` : ''}
          </h3>
          <div class="card-tools d-flex align-items-center flex-wrap">
            ${printerCount > 1 ? viewToggle : ''}
            <button class="btn btn-sm btn-outline-secondary me-1" id="fw-settings-btn" title="Firmware settings">
              <i class="bi bi-gear"></i>
            </button>
            <button class="btn btn-sm btn-primary" id="fw-check-now-btn" ${_checking ? 'disabled' : ''}>
              <i class="bi bi-arrow-repeat ${_checking ? 'spin' : ''}"></i>
              ${_checking ? 'Checking...' : 'Check All'}
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="text-muted small mb-2">
            Last checked: ${_lastCheckAt ? formatDate(_lastCheckAt) : 'Never'}
            ${_viewMode === 'active' && activeId ? ` &middot; showing active printer only` : ''}
          </div>`;

    if (totalCount === 0) {
      html += `<p class="text-success mb-0"><i class="bi bi-check-circle"></i> All printers are up to date</p>`;
    }

    // Layout container
    if (_viewMode === 'columns') {
      // Responsive grid: 1 col < 768px, 2 cols 768–1199px, 3 cols >= 1200px.
      html += '<div class="row g-3">';
      for (const g of visible) {
        if (_viewMode !== 'active' && !g.stable && !g.dev) continue;
        html += '<div class="col-12 col-md-6 col-xl-4">' + _renderPrinterGroup(g) + '</div>';
      }
      html += '</div>';
    } else {
      // 'active' or 'list' — single column, sections stacked vertically.
      for (const g of visible) {
        if (_viewMode === 'list' && !g.stable && !g.dev) continue;
        html += _renderPrinterGroup(g);
      }
    }

    html += `
        </div>
      </div>`;

    container.innerHTML = html;

    const btn = document.getElementById('fw-check-now-btn');
    if (btn) btn.addEventListener('click', checkNow);
    const settingsBtn = document.getElementById('fw-settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', showSettingsDialog);

    // Wire view-mode toggle
    container.querySelectorAll('[data-view]').forEach(b => {
      b.addEventListener('click', () => _setViewMode(b.getAttribute('data-view')));
    });
  }

  function _renderPrinterGroup(g) {
    const name = _esc(g.printer_name);
    const model = g.model ? ` <span class="text-muted small">(${_esc(g.model)})</span>` : '';
    const printerId = _esc(g.printer_id);

    // Status badge summarising what the printer has pending.
    const statusBadge = g.stable
      ? `<span class="badge text-bg-warning"><i class="bi bi-star-fill"></i> Stable update available</span>`
      : g.dev
        ? `<span class="badge text-bg-info"><i class="bi bi-code-slash"></i> Dev commits ahead</span>`
        : `<span class="badge text-bg-success"><i class="bi bi-check-circle"></i> Up to date</span>`;

    // Accent stripe colour matches the most important pending item (stable > dev > up-to-date).
    const borderColor = g.stable ? 'var(--bs-warning)' : g.dev ? 'var(--bs-info)' : 'var(--bs-success)';

    let inner = '';
    if (g.stable) inner += _renderStableCard(g.stable);
    if (g.dev) inner += _renderDevCard(g.dev, !!g.stable);

    // In columns mode, row-gap handles spacing so no bottom margin; otherwise mb-4.
    const gapClass = _viewMode === 'columns' ? 'h-100' : 'mb-4';

    return `
      <section class="card ${gapClass}" style="border-left:6px solid ${borderColor}" data-printer-id="${printerId}">
        <div class="card-header d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h4 class="card-title mb-1"><i class="bi bi-printer-fill"></i> ${name}${model}</h4>
            <div>${statusBadge}</div>
          </div>
          <div class="btn-group flex-wrap">
            <button class="btn btn-sm btn-outline-secondary" onclick="window._fwCheck('${printerId}')" title="Check this printer only">
              <i class="bi bi-arrow-repeat"></i> Check this printer
            </button>
          </div>
        </div>
        <div class="card-body">
          ${inner || '<p class="text-success mb-0"><i class="bi bi-check-circle"></i> This printer is up to date</p>'}
        </div>
      </section>`;
  }

  async function showSettingsDialog() {
    const existing = document.getElementById('fw-settings-dialog');
    if (existing) existing.remove();

    let settings = { dev_notifications: true };
    try {
      const res = await fetch('/api/firmware/settings');
      if (res.ok) settings = await res.json();
    } catch {}

    const backdrop = document.createElement('div');
    backdrop.id = 'fw-settings-dialog';
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
    backdrop.innerHTML = `
      <div class="card" style="max-width:480px;width:100%">
        <div class="card-header">
          <h5 class="card-title mb-0"><i class="bi bi-gear"></i> Firmware Settings</h5>
        </div>
        <div class="card-body">
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="fw-setting-dev" ${settings.dev_notifications ? 'checked' : ''}>
            <label class="form-check-label" for="fw-setting-dev">
              <strong>Development commit notifications</strong>
              <div class="text-muted small">Show commits on open-source firmware repos (e.g. Snapmaker U1) that are ahead of the latest stable release. Useful for power users tracking upcoming features.</div>
            </label>
          </div>
          <div class="d-flex gap-2 justify-content-end">
            <button class="btn btn-secondary" id="fw-settings-cancel">Cancel</button>
            <button class="btn btn-primary" id="fw-settings-save">Save</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });
    document.getElementById('fw-settings-cancel').addEventListener('click', () => backdrop.remove());
    document.getElementById('fw-settings-save').addEventListener('click', async () => {
      const devEnabled = document.getElementById('fw-setting-dev').checked;
      try {
        await fetch('/api/firmware/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dev_notifications: devEnabled }),
        });
        showToast('Firmware settings saved', 'success');
      } catch {
        showToast('Could not save settings', 'error');
      }
      backdrop.remove();
      fetchStatus();
    });
  }

  function _renderStableCard(u) {
    return `
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <div>
              <h6 class="mb-1 text-warning"><i class="bi bi-star-fill"></i> Stable release</h6>
              <div>
                <span class="badge text-bg-secondary">Current: ${_esc(u.sw_ver || '?')}</span>
                <i class="bi bi-arrow-right mx-1"></i>
                <span class="badge text-bg-success">Latest: ${_esc(u.latest_available || '?')}</span>
              </div>
            </div>
            <div class="btn-group flex-wrap">
              <button class="btn btn-sm btn-warning" onclick="window._fwTrigger('${_esc(u.printer_id)}')" title="Install update">
                <i class="bi bi-download"></i> Install Update
              </button>
              <button class="btn btn-sm btn-outline-success" onclick="window._fwDismiss('${_esc(u.printer_id)}')" title="Mark as already updated">
                <i class="bi bi-check"></i> Mark as Updated
              </button>
            </div>
          </div>
          ${u.changelog ? `
            <details>
              <summary style="cursor:pointer;font-weight:600;margin-bottom:8px">
                <i class="bi bi-card-text"></i> Release Notes
              </summary>
              <div class="fw-changelog" style="max-height:400px;overflow-y:auto;padding:12px;background:var(--bs-tertiary-bg);border-radius:6px;font-size:0.88rem;line-height:1.5">
                ${renderMarkdown(u.changelog)}
              </div>
            </details>
          ` : ''}
          ${u.release_url ? `<div class="mt-2"><a href="${_esc(u.release_url)}" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> Open release notes externally</a></div>` : ''}
          <div class="text-muted small mt-2">Checked: ${formatDate(u.checked_at)}</div>
      </div>`;
  }

  function _renderDevCard(u, isSecondary) {
    const name = _esc(u.printer_name || u.printer_id);
    const model = u.model ? ` <span class="text-muted small">(${_esc(u.model)})</span>` : '';
    const ahead = u.dev_commits_ahead || 0;
    let commits = [];
    try { commits = u.dev_commits_json ? JSON.parse(u.dev_commits_json) : []; } catch {}

    // Group commits by repo
    const byRepo = {};
    for (const c of commits) {
      if (!byRepo[c.repo]) byRepo[c.repo] = [];
      byRepo[c.repo].push(c);
    }

    const repoSections = Object.entries(byRepo).map(([repo, list]) => `
      <div class="mb-3">
        <h6 class="mb-2"><i class="bi bi-git"></i> Snapmaker/${_esc(repo)} <span class="badge text-bg-info">${list.length}</span></h6>
        <ul class="list-unstyled mb-0 small" style="border-left:2px solid var(--bs-border-color);padding-left:12px">
          ${list.map(c => `
            <li class="mb-2">
              <code style="font-size:0.8em">${_esc(c.sha)}</code>
              <span class="text-muted">${_esc(c.date)}</span>
              <div>${_esc(c.message)}</div>
              ${c.author ? `<div class="text-muted" style="font-size:0.85em">by ${_esc(c.author)}</div>` : ''}
              ${c.url ? `<a href="${_esc(c.url)}" target="_blank" rel="noopener" class="small"><i class="bi bi-box-arrow-up-right"></i> View on GitHub</a>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');

    return `
      <div class="mt-3 pt-3" style="border-top:1px solid var(--bs-border-color)">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <div>
              <h6 class="mb-1 text-info">
                <i class="bi bi-code-slash"></i> Development commits
                ${isSecondary ? '<span class="badge text-bg-secondary ms-2">also newer than stable</span>' : ''}
              </h6>
              <div class="text-muted small">${ahead} commit${ahead === 1 ? '' : 's'} ahead of stable ${_esc(u.latest_available || u.sw_ver || '?')}</div>
            </div>
          </div>
          <details ${ahead <= 5 ? 'open' : ''}>
            <summary style="cursor:pointer;font-weight:600;margin-bottom:8px">
              <i class="bi bi-list-ul"></i> Recent Commits
            </summary>
            <div style="max-height:500px;overflow-y:auto;padding:12px;background:var(--bs-tertiary-bg);border-radius:6px">
              ${repoSections || '<p class="text-muted mb-0">No commit details available</p>'}
            </div>
          </details>
          <div class="text-muted small mt-2">Checked: ${formatDate(u.checked_at)}</div>
      </div>`;
  }

  // Expose action handlers for inline onclick
  window._fwCheck = checkPrinter;
  window._fwTrigger = triggerUpdate;
  window._fwDismiss = dismissUpdate;
  window.loadFirmwareUpdatesPanel = fetchStatus;

  // Listen for WebSocket firmware check events
  if (!window._fwWsListener) {
    window._fwWsListener = true;
    const origOnMsg = window._wsOnMessage;
    document.addEventListener('ws:firmware_check_complete', () => fetchStatus());
  }

  // Periodic badge update in sidebar (every 5 minutes)
  async function updateSidebarBadge() {
    try {
      const res = await fetch('/api/firmware/updates');
      if (!res.ok) return;
      const data = await res.json();
      const count = Array.isArray(data?.availableUpdates) ? data.availableUpdates.length : 0;
      const badge = document.getElementById('fw-nav-badge');
      if (badge) {
        if (count > 0) {
          badge.textContent = count;
          badge.style.display = '';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch {}
  }

  // Auto-load on DOM ready if container exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('firmware-updates-panel')) fetchStatus();
    // Start periodic badge update
    updateSidebarBadge();
    setInterval(updateSidebarBadge, 5 * 60 * 1000);
  });
})();
