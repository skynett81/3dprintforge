// Protection Panel — Print Guard with Tabs and Drag-and-Drop
(function() {
  const TAB_CONFIG = {
    status:   { label: 'protection.tab_status',   modules: ['guard-overview','active-alerts','sensor-dashboard'] },
    settings: { label: 'protection.tab_settings',  modules: ['protection-settings'] },
    log:      { label: 'protection.tab_log',       modules: ['protection-log'] }
  };

  const MODULE_SIZE = {
    'guard-overview':       'half',
    'active-alerts':        'half',
    'sensor-dashboard':     'full',
    'protection-settings':  'full',
    'protection-log':       'full'
  };

  const STORAGE_PREFIX = 'protection-module-order-';
  const LOCK_KEY = 'protection-layout-locked';

  let _activeTab = 'status';
  let _locked = localStorage.getItem(LOCK_KEY) !== '0';
  let _printers = [];
  let _alerts = [];
  let _settings = {};
  let _log = [];
  let _draggedMod = null;

  function getOrder(tabId) {
    try { const s = localStorage.getItem(STORAGE_PREFIX + tabId); if (s) return JSON.parse(s); } catch {}
    return TAB_CONFIG[tabId].modules;
  }
  function saveOrder(tabId, order) { localStorage.setItem(STORAGE_PREFIX + tabId, JSON.stringify(order)); }

  const EVENT_LABELS = {
    spaghetti_detected: 'protection.spaghetti',
    first_layer_issue:  'protection.first_layer',
    foreign_object:     'protection.foreign_object',
    nozzle_clump:       'protection.nozzle_clump'
  };

  const ACTION_LABELS = {
    notify: 'protection.action_notify',
    pause:  'protection.action_pause',
    stop:   'protection.action_stop',
    ignore: 'protection.action_ignore'
  };

  function printerName(id) {
    const p = _printers.find(p => p.id === id);
    return p?.name || id;
  }

  function fmtTime(iso) {
    if (!iso) return '--';
    const l = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return new Date(iso).toLocaleString(l, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  // ═══ Module builders ═══
  const BUILDERS = {
    'guard-overview': () => {
      let h = `<div class="card-title">${t('protection.guard_overview')}</div>`;
      if (!_printers.length) return h + `<div class="text-muted" style="font-size:0.8rem">${t('protection.no_alerts')}</div>`;
      h += '<div class="stats-detail-list">';
      for (const p of _printers) {
        const s = _settings[p.id];
        const enabled = s ? s.enabled : 0;
        const pAlerts = _alerts.filter(a => a.printer_id === p.id);
        const statusColor = enabled ? 'var(--accent-green)' : 'var(--text-muted)';
        const statusText = enabled ? t('protection.enabled') : t('protection.disabled');
        h += `<div class="stats-detail-item">
          <span class="stats-detail-item-label" style="display:flex;align-items:center;gap:6px">
            <span style="width:8px;height:8px;border-radius:50%;background:${statusColor};display:inline-block"></span>
            ${p.name}
          </span>
          <span class="stats-detail-item-value">${statusText}${pAlerts.length ? ` <span style="color:var(--accent-red);margin-left:6px">${pAlerts.length} alert${pAlerts.length > 1 ? 's' : ''}</span>` : ''}</span>
        </div>`;
      }
      h += '</div>';
      return h;
    },

    'active-alerts': () => {
      let h = `<div class="card-title">${t('protection.active_alerts')}</div>`;
      if (!_alerts.length) return h + `<div class="text-muted" style="font-size:0.8rem">${t('protection.no_alerts')}</div>`;
      h += '<div style="display:flex;flex-direction:column;gap:6px">';
      for (const a of _alerts) {
        const evLabel = t(EVENT_LABELS[a.event_type] || a.event_type);
        const actLabel = t(ACTION_LABELS[a.action_taken] || a.action_taken);
        h += `<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--bg-tertiary);border-radius:var(--radius-sm);border:1px solid rgba(248,81,73,0.2)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.8rem;font-weight:600">${printerName(a.printer_id)} — ${evLabel}</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">${actLabel} · ${fmtTime(a.timestamp)}</div>
          </div>
          <button class="form-btn form-btn-sm form-btn-secondary" onclick="resolveProtectionAlert(${a.id})">${t('protection.resolve')}</button>
        </div>`;
      }
      h += '</div>';
      return h;
    },

    'sensor-dashboard': () => {
      let h = `<div class="card-title">${t('protection.sensor_dashboard')}</div>`;
      if (!_printers.length) return h + '<div class="text-muted" style="font-size:0.8rem">No printers</div>';
      h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">';
      const eventTypes = ['spaghetti_detected', 'first_layer_issue', 'foreign_object', 'nozzle_clump'];
      for (const p of _printers) {
        const s = _settings[p.id];
        const enabled = s ? s.enabled : 0;
        h += `<div style="background:var(--bg-tertiary);border-radius:var(--radius);padding:12px;border:1px solid var(--border-color)">
          <div style="font-size:0.8rem;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <span style="width:8px;height:8px;border-radius:50%;background:${enabled ? 'var(--accent-green)' : 'var(--text-muted)'};display:inline-block"></span>
            ${p.name}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">`;
        for (const et of eventTypes) {
          const action = s ? s[et.replace('_detected', '_action').replace('_issue', '_action').replace('_object', '_object_action').replace('nozzle_clump', 'nozzle_clump_action')] : 'notify';
          const actionKey = et === 'spaghetti_detected' ? 'spaghetti_action' :
                           et === 'first_layer_issue' ? 'first_layer_action' :
                           et === 'foreign_object' ? 'foreign_object_action' : 'nozzle_clump_action';
          const actualAction = s ? (s[actionKey] || 'notify') : 'notify';
          const actColor = actualAction === 'pause' ? 'var(--accent-orange)' :
                          actualAction === 'stop' ? 'var(--accent-red)' :
                          actualAction === 'ignore' ? 'var(--text-muted)' : 'var(--accent-blue)';
          const shortLabel = t(EVENT_LABELS[et] || et).split(' ')[0];
          h += `<div style="font-size:0.65rem;padding:3px 6px;border-radius:6px;background:var(--bg-secondary);text-align:center">
            <div style="color:var(--text-muted)">${shortLabel}</div>
            <div style="color:${actColor};font-weight:600">${t(ACTION_LABELS[actualAction] || actualAction)}</div>
          </div>`;
        }
        h += '</div></div>';
      }
      h += '</div>';
      return h;
    },

    'protection-settings': () => {
      let h = `<div class="card-title">${t('protection.tab_settings')}</div>`;
      if (!_printers.length) return h + '<div class="text-muted">No printers</div>';
      h += '<div style="display:flex;flex-direction:column;gap:16px">';
      for (const p of _printers) {
        const s = _settings[p.id] || { enabled: 1, spaghetti_action: 'pause', first_layer_action: 'notify', foreign_object_action: 'pause', nozzle_clump_action: 'pause', cooldown_seconds: 60, auto_resume: 0 };
        h += `<div style="background:var(--bg-tertiary);border-radius:var(--radius);padding:14px;border:1px solid var(--border-color)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <span style="font-size:0.85rem;font-weight:600">${p.name}</span>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.8rem">
              <input type="checkbox" ${s.enabled ? 'checked' : ''} onchange="toggleProtection('${p.id}', this.checked)" style="accent-color:var(--accent-green)">
              ${t('protection.enabled')}
            </label>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${_settingsRow(p.id, 'spaghetti_action', 'protection.spaghetti', s.spaghetti_action)}
            ${_settingsRow(p.id, 'first_layer_action', 'protection.first_layer', s.first_layer_action)}
            ${_settingsRow(p.id, 'foreign_object_action', 'protection.foreign_object', s.foreign_object_action)}
            ${_settingsRow(p.id, 'nozzle_clump_action', 'protection.nozzle_clump', s.nozzle_clump_action)}
          </div>
          <div style="display:flex;gap:12px;margin-top:10px;align-items:center">
            <label style="font-size:0.75rem;color:var(--text-muted)">${t('protection.cooldown')}:
              <input type="number" value="${s.cooldown_seconds}" min="10" max="600" style="width:60px;padding:3px 6px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:6px;color:var(--text-primary);font-size:0.8rem;margin-left:4px" onchange="updateProtectionSetting('${p.id}', 'cooldown_seconds', parseInt(this.value))">
            </label>
            <label style="font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:4px">
              <input type="checkbox" ${s.auto_resume ? 'checked' : ''} onchange="updateProtectionSetting('${p.id}', 'auto_resume', this.checked ? 1 : 0)" style="accent-color:var(--accent-green)">
              ${t('protection.auto_resume')}
            </label>
          </div>
        </div>`;
      }
      h += '</div>';
      return h;
    },

    'protection-log': () => {
      let h = `<div class="card-title">${t('protection.tab_log')}</div>`;
      if (!_log.length) return h + `<div class="text-muted" style="font-size:0.8rem">${t('protection.no_alerts')}</div>`;
      h += '<div style="display:flex;flex-direction:column;gap:4px">';
      for (const entry of _log) {
        const evLabel = t(EVENT_LABELS[entry.event_type] || entry.event_type);
        const actLabel = t(ACTION_LABELS[entry.action_taken] || entry.action_taken);
        const resolvedStyle = entry.resolved ? 'opacity:0.5' : '';
        h += `<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;font-size:0.78rem;border-bottom:1px solid var(--border-color);${resolvedStyle}">
          <span style="width:8px;height:8px;border-radius:50%;background:${entry.resolved ? 'var(--text-muted)' : 'var(--accent-red)'};flex-shrink:0"></span>
          <span style="min-width:100px;color:var(--text-muted)">${fmtTime(entry.timestamp)}</span>
          <span style="min-width:80px;font-weight:500">${printerName(entry.printer_id)}</span>
          <span style="flex:1">${evLabel}</span>
          <span style="min-width:80px;color:var(--text-muted)">${actLabel}</span>
          ${entry.resolved ? '<span style="font-size:0.7rem;color:var(--accent-green)">Resolved</span>' : `<button class="form-btn form-btn-sm form-btn-secondary" onclick="resolveProtectionAlert(${entry.id})" style="padding:2px 8px;font-size:0.7rem">${t('protection.resolve')}</button>`}
        </div>`;
      }
      h += '</div>';
      return h;
    }
  };

  function _settingsRow(printerId, field, labelKey, value) {
    const options = ['notify', 'pause', 'stop', 'ignore'].map(v =>
      `<option value="${v}" ${v === value ? 'selected' : ''}>${t(ACTION_LABELS[v])}</option>`
    ).join('');
    return `<div style="display:flex;flex-direction:column;gap:3px">
      <label style="font-size:0.7rem;color:var(--text-muted)">${t(labelKey)}</label>
      <select onchange="updateProtectionSetting('${printerId}', '${field}', this.value)" style="padding:4px 8px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:6px;color:var(--text-primary);font-size:0.78rem;cursor:pointer">${options}</select>
    </div>`;
  }

  // ═══ Rendering ═══
  function render() {
    const body = document.getElementById('overlay-panel-body');
    if (!body) return;

    // Toolbar
    let html = `<div class="stats-toolbar">
      <div class="tabs" style="border-bottom:none;margin-bottom:0">`;
    for (const [id, cfg] of Object.entries(TAB_CONFIG)) {
      html += `<button class="tab-btn${id === _activeTab ? ' active' : ''}" onclick="switchProtectionTab('${id}')">${t(cfg.label)}</button>`;
    }
    html += `</div>
      <div class="stats-toolbar-actions">
        <button class="form-btn form-btn-sm form-btn-secondary" onclick="toggleProtectionLock()" title="${_locked ? t('protection.layout_locked') : t('protection.layout_unlocked')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${_locked ? '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' : '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>'}</svg>
          ${_locked ? t('protection.layout_locked') : t('protection.layout_unlocked')}
        </button>
      </div>
    </div>`;

    // Tab panels
    for (const [id, cfg] of Object.entries(TAB_CONFIG)) {
      const active = id === _activeTab;
      const order = getOrder(id);
      html += `<div class="protection-tab-panel tab-panel stats-tab-panel${active ? ' active' : ''}" id="protection-tab-${id}" style="display:${active?'grid':'none'}">`;
      for (const modId of order) {
        if (!BUILDERS[modId]) continue;
        const size = MODULE_SIZE[modId] || 'full';
        const cls = `stats-module${_locked ? '' : ' stats-module-unlocked'}`;
        const fullCls = size === 'full' ? ' stats-module-full' : '';
        html += `<div class="${cls}${fullCls}" data-module-id="${modId}" ${_locked ? '' : 'draggable="true"'}>
          <span class="stats-module-handle">&#9776;</span>
          ${BUILDERS[modId]()}
        </div>`;
      }
      html += '</div>';
    }

    body.innerHTML = html;
    if (!_locked) initDrag();
  }

  // ═══ Drag and Drop ═══
  function initDrag() {
    const container = document.querySelector(`.protection-tab-panel.active`);
    if (!container) return;
    container.querySelectorAll('.stats-module').forEach(mod => {
      mod.addEventListener('dragstart', e => {
        _draggedMod = mod;
        mod.classList.add('stats-module-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      mod.addEventListener('dragend', () => {
        if (_draggedMod) _draggedMod.classList.remove('stats-module-dragging');
        container.querySelectorAll('.stats-module').forEach(m => m.classList.remove('stats-module-over'));
        _draggedMod = null;
      });
      mod.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; mod.classList.add('stats-module-over'); });
      mod.addEventListener('dragleave', () => mod.classList.remove('stats-module-over'));
      mod.addEventListener('drop', e => {
        e.preventDefault();
        mod.classList.remove('stats-module-over');
        if (!_draggedMod || _draggedMod === mod) return;
        const mods = [...container.querySelectorAll('.stats-module')];
        const fromIdx = mods.indexOf(_draggedMod);
        const toIdx = mods.indexOf(mod);
        if (fromIdx < toIdx) mod.after(_draggedMod); else mod.before(_draggedMod);
        const order = [...container.querySelectorAll('.stats-module')].map(m => m.dataset.moduleId);
        saveOrder(_activeTab, order);
      });
    });
  }

  // ═══ Public functions ═══
  window.switchProtectionTab = function(tabId) {
    _activeTab = tabId;
    document.querySelectorAll('.protection-tab-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
    const el = document.getElementById('protection-tab-' + tabId);
    if (el) { el.style.display = 'grid'; el.classList.add('active'); }
    document.querySelectorAll('.stats-toolbar .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.stats-toolbar .tab-btn[onclick="switchProtectionTab('${tabId}')"]`)?.classList.add('active');
    if (!_locked) initDrag();
    const base = location.hash.split('/')[0] || '#protection';
    history.replaceState(null, '', tabId === 'status' ? base : `${base}/${tabId}`);
  };

  window.toggleProtectionLock = function() {
    _locked = !_locked;
    localStorage.setItem(LOCK_KEY, _locked ? '1' : '0');
    render();
  };

  window.resolveProtectionAlert = async function(logId) {
    try {
      await fetch('/api/protection/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId })
      });
      await loadData();
      render();
      updateBadge();
    } catch (e) { console.error('[protection] Resolve failed:', e); }
  };

  window.toggleProtection = async function(printerId, enabled) {
    const s = _settings[printerId] || { spaghetti_action: 'pause', first_layer_action: 'notify', foreign_object_action: 'pause', nozzle_clump_action: 'pause', cooldown_seconds: 60, auto_resume: 0 };
    s.enabled = enabled ? 1 : 0;
    s.printer_id = printerId;
    await fetch('/api/protection/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
    _settings[printerId] = s;
    render();
  };

  window.updateProtectionSetting = async function(printerId, field, value) {
    const s = _settings[printerId] || { enabled: 1, spaghetti_action: 'pause', first_layer_action: 'notify', foreign_object_action: 'pause', nozzle_clump_action: 'pause', cooldown_seconds: 60, auto_resume: 0 };
    s[field] = value;
    s.printer_id = printerId;
    await fetch('/api/protection/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
    _settings[printerId] = s;
  };

  // ═══ Data loading ═══
  async function loadData() {
    try {
      const [printersRes, statusRes, logRes] = await Promise.all([
        fetch('/api/printers'),
        fetch('/api/protection/status'),
        fetch('/api/protection/log?limit=100')
      ]);
      _printers = await printersRes.json();
      const statusData = await statusRes.json();
      _alerts = statusData.alerts || [];
      _log = await logRes.json();

      // Load settings per printer
      _settings = {};
      await Promise.all(_printers.map(async p => {
        try {
          const res = await fetch(`/api/protection/settings?printer_id=${p.id}`);
          _settings[p.id] = await res.json();
        } catch {}
      }));
    } catch (e) {
      console.error('[protection] Failed to load data:', e);
    }
  }

  function updateBadge() {
    const badge = document.getElementById('protection-badge');
    if (!badge) return;
    if (_alerts.length > 0) {
      badge.textContent = _alerts.length;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  // ═══ WebSocket handling ═══
  function handleWsMessage(data) {
    if (data.type === 'protection_alert' || data.type === 'protection_resolved') {
      loadData().then(() => {
        if (window._activePanel === 'protection') render();
        updateBadge();
      });
    }
  }

  // ═══ Entry point ═══
  window.loadProtectionPanel = async function() {
    const hashParts = location.hash.replace('#protection', '').split('/').filter(Boolean);
    if (hashParts[0] && TAB_CONFIG[hashParts[0]]) _activeTab = hashParts[0];

    await loadData();
    render();
    updateBadge();
  };

  // Register WebSocket listener
  if (window._wsListeners) {
    window._wsListeners.push(handleWsMessage);
  } else {
    window._wsListeners = [handleWsMessage];
  }

  // Periodically update badge
  setInterval(async () => {
    try {
      const res = await fetch('/api/protection/status');
      const data = await res.json();
      _alerts = data.alerts || [];
      updateBadge();
    } catch {}
  }, 30000);
})();
