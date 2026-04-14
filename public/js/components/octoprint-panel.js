// OctoPrint Deep Integration Panel — events, system commands, users, settings, plugins
(function() {
  'use strict';

  const _esc = (s) => { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; };
  let _activeTab = 'events';
  let _selectedPrinter = null;
  let _octoPrinters = [];

  function formatDate(ts) {
    return ts ? new Date(ts).toLocaleString() : '--';
  }

  async function _loadOctoPrinters() {
    try {
      const res = await fetch('/api/printers');
      const all = await res.json();
      _octoPrinters = Array.isArray(all) ? all.filter(p => p.type === 'octoprint') : [];
      if (_octoPrinters.length > 0 && !_selectedPrinter) {
        _selectedPrinter = _octoPrinters[0].id;
      }
    } catch {}
  }

  async function _loadTab(tab) {
    _activeTab = tab;
    const content = document.getElementById('octo-tab-content');
    if (!content || !_selectedPrinter) return;
    content.innerHTML = '<div class="text-center p-3"><i class="bi bi-arrow-repeat spin"></i> Loading…</div>';

    try {
      if (tab === 'events') await _renderEvents(content);
      else if (tab === 'system') await _renderSystemCommands(content);
      else if (tab === 'users') await _renderUsers(content);
      else if (tab === 'settings') await _renderSettings(content);
      else if (tab === 'plugins') await _renderPlugins(content);
      else if (tab === 'connection') await _renderConnection(content);
      else if (tab === 'profiles') await _renderPrinterProfiles(content);
    } catch (e) {
      content.innerHTML = `<div class="alert alert-danger">${_esc(e.message)}</div>`;
    }
    document.querySelectorAll('.octo-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  }

  async function _renderEvents(container) {
    const res = await fetch(`/api/octoprint/events?printer_id=${encodeURIComponent(_selectedPrinter)}`);
    const events = await res.json();
    const items = Array.isArray(events) ? events : [];
    if (items.length === 0) {
      container.innerHTML = '<div class="alert alert-info mb-0">No events recorded yet. Events are captured from OctoPrint\'s WebSocket stream.</div>';
      return;
    }
    const eventColor = (type) => {
      if (type.includes('Failed') || type.includes('Error')) return 'danger';
      if (type.includes('Done') || type.includes('Completed')) return 'success';
      if (type.includes('Started') || type.includes('Resumed')) return 'primary';
      if (type.includes('Paused') || type.includes('Cancelled')) return 'warning';
      return 'secondary';
    };
    container.innerHTML = `
      <div class="mb-2"><span class="text-muted small">${items.length} recent events (newest first)</span></div>
      <div style="max-height:600px;overflow-y:auto">
        ${items.map(e => `
          <div class="card mb-2">
            <div class="card-body p-2">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <span class="badge text-bg-${eventColor(e.type)}">${_esc(e.type)}</span>
                <span class="text-muted small">${formatDate(e.ts)}</span>
              </div>
              ${e.payload && typeof e.payload === 'object' && Object.keys(e.payload).length > 0 ? `
                <pre class="small text-muted mt-2 mb-0" style="max-height:80px;overflow:hidden">${_esc(JSON.stringify(e.payload, null, 2).slice(0, 400))}</pre>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  async function _renderSystemCommands(container) {
    try {
      const res = await fetch(`/api/octoprint/system-commands?printer_id=${encodeURIComponent(_selectedPrinter)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const categories = data.core ? data : { core: data.core || data, custom: data.custom || [] };
      const allCmds = [
        ...(Array.isArray(categories.core) ? categories.core : []).map(c => ({ ...c, source: 'core' })),
        ...(Array.isArray(categories.custom) ? categories.custom : []).map(c => ({ ...c, source: 'custom' })),
      ];
      if (allCmds.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No system commands registered on this OctoPrint instance.</div>';
        return;
      }
      container.innerHTML = `
        <div class="alert alert-warning small"><i class="bi bi-exclamation-triangle"></i> These commands run on the OctoPrint host. Use with caution.</div>
        <div class="row g-2">
          ${allCmds.map(cmd => `
            <div class="col-md-6">
              <div class="card">
                <div class="card-body p-3">
                  <h6 class="mb-1">${_esc(cmd.name || cmd.action)}</h6>
                  <div class="text-muted small mb-2">${_esc(cmd.source)}${cmd.action ? ' · ' + _esc(cmd.action) : ''}</div>
                  ${cmd.confirm ? `<div class="small text-warning mb-2"><i class="bi bi-shield"></i> ${_esc(cmd.confirm)}</div>` : ''}
                  <button class="btn btn-sm btn-outline-danger w-100" onclick="window._octoExec('${_esc(cmd.source)}','${_esc(cmd.action)}','${_esc(cmd.name || cmd.action)}')">
                    <i class="bi bi-play"></i> Execute
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>`;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${_esc(e.message)}. Requires OctoPrint API key with admin permissions.</div>`;
    }
  }

  async function _renderUsers(container) {
    try {
      const [uRes, gRes] = await Promise.all([
        fetch(`/api/octoprint/users?printer_id=${encodeURIComponent(_selectedPrinter)}`),
        fetch(`/api/octoprint/groups?printer_id=${encodeURIComponent(_selectedPrinter)}`),
      ]);
      const uData = await uRes.json();
      const gData = await gRes.json();
      const users = uData.users || uData || [];
      const groups = gData.groups || gData || [];
      container.innerHTML = `
        <h6 class="mb-2">Users (${users.length})</h6>
        <div class="table-responsive mb-3">
          <table class="table table-sm">
            <thead><tr><th>Username</th><th>Active</th><th>Admin</th><th>Groups</th></tr></thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>${_esc(u.name || u.username)}</td>
                  <td>${u.active ? '<span class="badge text-bg-success">Yes</span>' : '<span class="badge text-bg-secondary">No</span>'}</td>
                  <td>${u.admin ? '<span class="badge text-bg-warning">Yes</span>' : 'No'}</td>
                  <td class="small">${_esc(Array.isArray(u.groups) ? u.groups.join(', ') : '')}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <h6 class="mb-2">Groups (${groups.length})</h6>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead><tr><th>Key</th><th>Name</th><th>Permissions</th></tr></thead>
            <tbody>
              ${groups.map(g => `
                <tr>
                  <td><code>${_esc(g.key)}</code></td>
                  <td>${_esc(g.name)}</td>
                  <td class="small">${_esc(Array.isArray(g.permissions) ? g.permissions.join(', ') : '')}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${_esc(e.message)}</div>`;
    }
  }

  async function _renderSettings(container) {
    try {
      const res = await fetch(`/api/octoprint/settings?printer_id=${encodeURIComponent(_selectedPrinter)}`);
      const settings = await res.json();
      container.innerHTML = `
        <div class="alert alert-info small">Full OctoPrint settings tree. Editing is read-only in this view — use OctoPrint UI for modifications.</div>
        <pre style="max-height:600px;overflow:auto;background:var(--bs-tertiary-bg);padding:12px;border-radius:6px;font-size:0.8rem">${_esc(JSON.stringify(settings, null, 2).slice(0, 10000))}</pre>`;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${_esc(e.message)}</div>`;
    }
  }

  async function _renderPlugins(container) {
    try {
      const res = await fetch(`/api/octoprint/plugins?printer_id=${encodeURIComponent(_selectedPrinter)}`);
      const data = await res.json();
      const installed = data.installed || [];
      const pluginData = data.pluginData || {};
      container.innerHTML = `
        <h6 class="mb-2">Installed plugins (${installed.length})</h6>
        <div class="row g-2 mb-3">
          ${installed.map(p => `
            <div class="col-md-6 col-lg-4">
              <div class="card h-100">
                <div class="card-body p-2">
                  <strong class="small">${_esc(p)}</strong>
                  ${pluginData[p] ? '<span class="badge text-bg-success ms-1">active</span>' : ''}
                </div>
              </div>
            </div>`).join('')}
        </div>
        ${Object.keys(pluginData).length > 0 ? `
          <h6 class="mb-2">Plugin data</h6>
          <pre style="max-height:400px;overflow:auto;background:var(--bs-tertiary-bg);padding:12px;border-radius:6px;font-size:0.8rem">${_esc(JSON.stringify(pluginData, null, 2).slice(0, 5000))}</pre>
        ` : ''}`;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${_esc(e.message)}</div>`;
    }
  }

  async function _renderConnection(container) {
    try {
      const res = await fetch(`/api/octoprint/connection?printer_id=${encodeURIComponent(_selectedPrinter)}`);
      const data = await res.json();
      const current = data.current || {};
      const options = data.options || {};
      container.innerHTML = `
        <h6 class="mb-2">Current connection</h6>
        <table class="table table-sm mb-3">
          <tbody>
            <tr><th>State</th><td>${_esc(current.state || 'unknown')}</td></tr>
            <tr><th>Port</th><td><code>${_esc(current.port || '--')}</code></td></tr>
            <tr><th>Baudrate</th><td>${current.baudrate || '--'}</td></tr>
            <tr><th>Printer profile</th><td>${_esc(current.printerProfile || '--')}</td></tr>
          </tbody>
        </table>
        <h6 class="mb-2">Available options</h6>
        <div class="row small">
          <div class="col-md-4"><strong>Ports:</strong> ${_esc((options.ports || []).join(', ') || 'none')}</div>
          <div class="col-md-4"><strong>Baudrates:</strong> ${_esc((options.baudrates || []).join(', ') || 'none')}</div>
          <div class="col-md-4"><strong>Profiles:</strong> ${_esc((options.printerProfiles || []).map(p => p.name || p.id).join(', ') || 'none')}</div>
        </div>`;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${_esc(e.message)}</div>`;
    }
  }

  async function _renderPrinterProfiles(container) {
    try {
      const res = await fetch(`/api/octoprint/printer-profiles?printer_id=${encodeURIComponent(_selectedPrinter)}`);
      const data = await res.json();
      const profiles = data.profiles || {};
      const items = Object.entries(profiles);
      container.innerHTML = `
        <div class="row g-2">
          ${items.map(([key, p]) => `
            <div class="col-md-6">
              <div class="card h-100 ${p.default ? 'border-primary' : ''}">
                <div class="card-body p-3">
                  <h6 class="mb-1">${_esc(p.name || key)}${p.default ? '<span class="badge text-bg-primary ms-2">default</span>' : ''}${p.current ? '<span class="badge text-bg-success ms-2">current</span>' : ''}</h6>
                  <div class="text-muted small mb-2">${_esc(p.model || key)}</div>
                  <div class="small">
                    <div><strong>Volume:</strong> ${p.volume ? `${p.volume.width}×${p.volume.depth}×${p.volume.height} mm` : '?'}</div>
                    <div><strong>Heated bed:</strong> ${p.heatedBed ? 'Yes' : 'No'}</div>
                    <div><strong>Heated chamber:</strong> ${p.heatedChamber ? 'Yes' : 'No'}</div>
                    <div><strong>Extruders:</strong> ${p.extruder?.count || 1} (nozzle ${p.extruder?.nozzleDiameter || '?'} mm)</div>
                  </div>
                </div>
              </div>
            </div>`).join('')}
        </div>`;
    } catch (e) {
      container.innerHTML = `<div class="alert alert-warning">${_esc(e.message)}</div>`;
    }
  }

  window._octoExec = async (source, action, name) => {
    if (!confirm(`Execute "${name}" on the OctoPrint host?`)) return;
    try {
      const res = await fetch(`/api/octoprint/system-commands/execute?printer_id=${encodeURIComponent(_selectedPrinter)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, action }),
      });
      const data = await res.json();
      if (res.ok) {
        if (window.showToast) window.showToast(`Executed: ${name}`, 'success');
      } else {
        if (window.showToast) window.showToast('Failed: ' + (data.error || 'Unknown'), 'error');
      }
    } catch (e) {
      if (window.showToast) window.showToast('Error: ' + e.message, 'error');
    }
  };

  function _render() {
    const container = document.getElementById('octoprint-panel');
    if (!container) return;

    if (_octoPrinters.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="alert alert-info mb-0">
              <i class="bi bi-info-circle"></i> No OctoPrint printers configured. Add an OctoPrint printer in Settings to use this panel.
            </div>
          </div>
        </div>`;
      return;
    }

    const tabs = [
      { id: 'events', label: 'Events', icon: 'bi-activity' },
      { id: 'system', label: 'System', icon: 'bi-gear' },
      { id: 'connection', label: 'Connection', icon: 'bi-plug' },
      { id: 'profiles', label: 'Printer Profiles', icon: 'bi-printer' },
      { id: 'users', label: 'Users', icon: 'bi-people' },
      { id: 'plugins', label: 'Plugins', icon: 'bi-puzzle' },
      { id: 'settings', label: 'Settings', icon: 'bi-sliders' },
    ];

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="bi bi-plug"></i> OctoPrint Deep Integration</h3>
          <div class="card-tools">
            <select class="form-select form-select-sm" id="octo-printer-select" style="width:auto;display:inline-block">
              ${_octoPrinters.map(p => `<option value="${_esc(p.id)}" ${p.id === _selectedPrinter ? 'selected' : ''}>${_esc(p.name)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="card-body">
          <ul class="nav nav-tabs mb-3">
            ${tabs.map(t => `
              <li class="nav-item">
                <a class="nav-link octo-tab ${t.id === _activeTab ? 'active' : ''}" data-tab="${t.id}" href="#" onclick="return window._octoSetTab('${t.id}')">
                  <i class="bi ${t.icon}"></i> ${t.label}
                </a>
              </li>`).join('')}
          </ul>
          <div id="octo-tab-content"></div>
        </div>
      </div>`;

    document.getElementById('octo-printer-select')?.addEventListener('change', (e) => {
      _selectedPrinter = e.target.value;
      _loadTab(_activeTab);
    });

    _loadTab(_activeTab);
  }

  window._octoSetTab = (tab) => { _loadTab(tab); return false; };
  window.loadOctoprintPanel = async () => {
    await _loadOctoPrinters();
    _render();
  };
})();
