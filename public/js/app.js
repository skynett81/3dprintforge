const state = window.printerState;
let ws = null;
let reconnectTimer = null;
let reconnectDelay = 1000;
let _wasConnected = false;

function connect() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${location.host}/ws`);

  ws.onopen = () => {
    console.log('[ws] Connected');
    if (_wasConnected) {
      // Reconnected after a disconnect
      if (typeof showToast === 'function') showToast(t('connection.reconnected'), 'success', 3000);
    }
    _wasConnected = true;
    reconnectDelay = 1000;
    updateConnectionBadge('connected');
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === 'printer_meta_update' && msg.data) {
        const printers = msg.data.printers || [];
        const newMeta = {};
        for (const p of printers) {
          newMeta[p.id] = { name: p.name, model: p.model || '' };
        }
        // Remove printers that no longer exist
        const oldIds = [...Object.keys(state.printerMeta), ...Object.keys(state.printers)];
        const newIds = new Set(Object.keys(newMeta));
        for (const id of oldIds) {
          if (!newIds.has(id)) {
            state.removePrinter(id);
          }
        }
        // Update meta
        state.replacePrinterMeta(newMeta);

        // Ensure new printers have a state entry so they show in selector
        for (const id of Object.keys(newMeta)) {
          if (!state.printers[id]) {
            state.printers[id] = {};
          }
        }

        // Update selector and badge
        if (typeof updatePrinterSelector === 'function') {
          updatePrinterSelector();
        }
        updateConnectionBadge();
        scheduleInfoBoxRefresh(50);

        // If active printer was deleted, update dashboard for the new active
        if (state.getActivePrinterId()) {
          const activeState = state.getActivePrinterState();
          const printData = activeState.print || activeState;
          updateDashboard(printData);
          document.title = `${state.getActivePrinterMeta().name || state.getActivePrinterId()} - 3DPrintForge`;
        }
        return;
      }

      if (msg.type === 'init' && msg.data) {
        // Initial state dump with all printers
        const { printers, states } = msg.data;

        // Set printer metadata
        for (const [id, meta] of Object.entries(printers || {})) {
          state.setPrinterMeta(id, meta);
        }

        // Set printer states
        for (const [id, stateData] of Object.entries(states || {})) {
          state.updatePrinter(id, stateData);
        }

        updatePrinterSelector();
        updateConnectionBadge('connected');
        scheduleInfoBoxRefresh(50);
        applyCameraVisibility();

        // Trigger initial dashboard update
        const activeState = state.getActivePrinterState();
        const printData = activeState.print || activeState;
        updateDashboard(printData);
        return;
      }

      if (msg.type === 'update_available') {
        if (typeof handleUpdateAvailable === 'function') handleUpdateAvailable(msg.data);
        return;
      }
      if (msg.type === 'update_status') {
        if (typeof handleUpdateStatus === 'function') handleUpdateStatus(msg.data);
        return;
      }

      if (msg.type === 'status' && msg.data) {
        const printerId = msg.data.printer_id;
        if (printerId) {
          // Ignore status from printers not in our meta (deleted)
          if (!state.printerMeta[printerId]) return;
          const wasEmpty = !state.printers[printerId] || Object.keys(state.printers[printerId]).length === 0;
          state.updatePrinter(printerId, msg.data);
          // First status arrival flips an empty entry into "online" — refresh
          // the info-box counter immediately instead of waiting 30s.
          if (wasEmpty) scheduleInfoBoxRefresh(50);

          // Read full merged state (not delta) for dashboard updates
          const fullState = state.printers[printerId] || {};
          const fullPrintData = fullState.print || fullState;

          // Check notifications for all printers
          if (typeof checkNotifications === 'function') {
            checkNotifications(printerId, fullPrintData);
          }

          // Only update dashboard if this is the active printer
          if (printerId === state.getActivePrinterId()) {
            updateDashboard(fullPrintData);
          }

          // Always update printer selector (status dots)
          if (typeof updatePrinterSelector === 'function') {
            updatePrinterSelector();
          }
        } else {
          // Legacy single-printer format
          state.updatePrinter('default', msg.data);
          const fullState = state.printers['default'] || {};
          updateDashboard(fullState.print || fullState);
        }
      } else if (msg.type === 'connection') {
        updateConnectionBadge(msg.data.status);
      }

      // Dispatch to registered listeners
      if (window._wsListeners) {
        for (const fn of window._wsListeners) {
          try { fn(msg); } catch {}
        }
      }
    } catch (e) {
      console.warn('[ws] Parse error:', e);
    }
  };

  ws.onclose = () => {
    console.log('[ws] Disconnected - reconnecting...');
    updateConnectionBadge('disconnected');
    if (_wasConnected && typeof showToast === 'function') {
      showToast(t('connection.lost'), 'warning', 4000);
    }
    scheduleReconnect();
  };

  ws.onerror = () => {
    console.warn('[ws] Error');
    ws.close();
  };
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    reconnectDelay = Math.min(reconnectDelay * 1.5, 10000);
    connect();
  }, reconnectDelay);
}

function sendCommand(action, extra = {}) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({
      type: 'command',
      action,
      printer_id: state.getActivePrinterId(),
      ...extra
    }));
  }
}

window.sendCommand = sendCommand;

// Expose raw WS send for components (e.g. log-viewer subscriptions)
window._wsSend = function(data) {
  if (ws && ws.readyState === 1) ws.send(data);
};

let _connectionStatus = 'disconnected';

function updateConnectionBadge(status) {
  if (status) _connectionStatus = status;
  const badge = document.getElementById('connection-badge');
  if (!badge) return;
  const count = state.getPrinterIds().length;
  const label = _connectionStatus === 'connected' ? t('connection.connected') : t('connection.disconnected');
  const printerWord = count !== 1 ? t('connection.printers', { count }) : t('connection.printer', { count });
  badge.textContent = count > 0 ? `${label} · ${printerWord}` : label;
  badge.className = `badge badge-${_connectionStatus}`;
}

// ---- Browser network (online/offline) banner ----
// navigator.onLine flips the moment the OS loses connectivity, before the
// WebSocket notices. Show a persistent banner so the user knows live updates
// are paused and writes may fail, and clear it (with an immediate reconnect)
// on return — the WS backoff alone can leave them staring at stale data.
function _setOfflineBanner(offline) {
  let b = document.getElementById('net-offline-banner');
  if (offline) {
    if (!b) {
      b = document.createElement('div');
      b.id = 'net-offline-banner';
      b.className = 'net-offline-banner';
      b.setAttribute('role', 'status');
      b.setAttribute('aria-live', 'assertive');
      b.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 1l22 22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' +
        '<span>' + t('connection.offline_banner', 'You are offline — live updates are paused and changes may not be saved.') + '</span>';
      document.body.appendChild(b);
    }
  } else if (b) {
    b.remove();
  }
}

function _handleOnline() {
  _setOfflineBanner(false);
  if (typeof showToast === 'function') showToast(t('connection.back_online', 'Back online'), 'success', 2500);
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  reconnectDelay = 1000;
  connect();
}

function _handleOffline() {
  _setOfflineBanner(true);
  updateConnectionBadge('disconnected');
}

// ---- Camera visibility ----
// Cloud-only printers (no LAN IP, or cloudMode flag) usually don't expose
// a LAN camera stream. Hide the camera card by default for those, but let
// the user override per printer via the toggle button.
function _cameraPrefKey(printerId) { return `cameraVisible:${printerId || 'default'}`; }

async function applyCameraVisibility() {
  const card = document.getElementById('camera-card');
  const btn = document.getElementById('camera-toggle-btn');
  const label = document.getElementById('camera-toggle-label');
  const headerBtn = document.getElementById('camera-header-toggle');
  const headerLabel = document.getElementById('camera-header-toggle-label');
  if (!card) return;
  const printerId = state.getActivePrinterId();
  if (!printerId) {
    card.style.display = '';
    if (btn) btn.style.display = 'none';
    if (headerBtn) headerBtn.style.display = 'none';
    return;
  }
  // Look up printer config to decide auto-default
  let cfg = null;
  try {
    const printers = await fetch('/api/printers').then(r => r.json()).catch(() => []);
    cfg = Array.isArray(printers) ? printers.find(p => p.id === printerId) : null;
  } catch { /* ignore */ }
  const isLan = !!(cfg?.ip);
  const isCloud = !!(cfg?.cloudMode);
  const autoVisible = isLan && !isCloud;
  const stored = localStorage.getItem(_cameraPrefKey(printerId));
  const visible = stored === null ? autoVisible : stored === 'true';
  card.style.display = visible ? '' : 'none';
  if (btn) {
    btn.style.display = '';
    if (label) label.textContent = visible ? 'Hide' : 'Show';
  }
  if (headerBtn) {
    headerBtn.style.display = 'inline-flex';
    headerBtn.style.opacity = visible ? '1' : '0.55';
    headerBtn.style.borderColor = visible ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.18)';
    if (headerLabel) headerLabel.textContent = visible ? 'Camera: ON' : 'Camera: OFF';
  }
}
window.applyCameraVisibility = applyCameraVisibility;

window.toggleCameraVisibility = function() {
  const printerId = state.getActivePrinterId();
  const key = _cameraPrefKey(printerId);
  const card = document.getElementById('camera-card');
  if (!card) return;
  const wasVisible = card.style.display !== 'none';
  const newVisible = !wasVisible;
  localStorage.setItem(key, String(newVisible));
  // Re-apply so both card display, in-card button, and header chip stay in sync.
  applyCameraVisibility();
};

// ---- Info Box Stats ----
// Debounced trigger so multiple WS messages in flight only fire one refresh.
let _infoBoxRefreshTimer = null;
function scheduleInfoBoxRefresh(delay = 250) {
  if (_infoBoxRefreshTimer) return;
  _infoBoxRefreshTimer = setTimeout(() => {
    _infoBoxRefreshTimer = null;
    updateInfoBoxes();
  }, delay);
}
window.scheduleInfoBoxRefresh = scheduleInfoBoxRefresh;

async function updateInfoBoxes() {
  try {
    const [printers, queue, filament, spools] = await Promise.all([
      fetch('/api/printers').then(r => r.json()).catch(() => []),
      fetch('/api/queue').then(r => r.json()).catch(() => []),
      fetch('/api/filament').then(r => r.json()).catch(() => []),
      fetch('/api/inventory/spools').then(r => r.json()).catch(() => ({ rows: [] })),
    ]);

    // Printers online: a printer counts as online if it has actual MQTT/WS
    // state data (not just a meta entry). Use the public StateStore getter.
    const totalPrinters = Array.isArray(printers) ? printers.length : 0;
    const livePrinters = window.printerState?.printers || {};
    let onlinePrinters = 0;
    for (const id of Object.keys(livePrinters)) {
      const s = livePrinters[id];
      // A printer is "online" if its state object has any meaningful data
      // (gcode_state, nozzle_temper, or any incoming MQTT key).
      if (s && Object.keys(s).length > 0) onlinePrinters++;
    }
    const printersEl = document.getElementById('info-printers-count');
    if (printersEl) printersEl.textContent = `${onlinePrinters}/${totalPrinters}`;

    // Active prints (printers currently printing)
    let activePrints = 0;
    for (const id of Object.keys(livePrinters)) {
      const s = livePrinters[id];
      if (s && (s.gcode_state === 'RUNNING' || s.print?.gcode_state === 'RUNNING')) activePrints++;
    }
    const printsEl = document.getElementById('info-prints-count');
    if (printsEl) printsEl.textContent = activePrints;

    // Queue items — count pending jobs across all queues, not the number of
    // queue containers. An empty queue (e.g. a leftover "Test Queue") used to
    // make the counter read "1 in queue" while the Print Queue panel correctly
    // showed 0 jobs, which looked like a bug.
    const queueCount = Array.isArray(queue)
      ? queue.reduce((sum, q) => sum + Math.max(0, (q.item_count || 0) - (q.completed_count || 0)), 0)
      : 0;
    const queueEl = document.getElementById('info-queue-count');
    if (queueEl) queueEl.textContent = queueCount;

    // Filament spools — count from BOTH the new spools table and the
    // legacy filament_inventory table (some older installs use only one).
    const newSpoolCount = (spools && typeof spools === 'object' && Array.isArray(spools.rows))
      ? spools.rows.length
      : (Array.isArray(spools) ? spools.length : 0);
    const legacyCount = Array.isArray(filament) ? filament.length : 0;
    const spoolCount = newSpoolCount + legacyCount;
    const filamentEl = document.getElementById('info-filament-count');
    if (filamentEl) filamentEl.textContent = spoolCount;
  } catch (_) { /* non-critical */ }
}

function updateDashboard(data) {
  // Update active prints count in info-box (no API call needed, use live WS data)
  let activePrints = 0;
  const printerStates = window.printerState?.printers || {};
  for (const id of Object.keys(printerStates)) {
    const s = printerStates[id];
    if (s?.gcode_state === 'RUNNING' || s?.print?.gcode_state === 'RUNNING') activePrints++;
  }
  const printsEl = document.getElementById('info-prints-count');
  if (printsEl) printsEl.textContent = activePrints;

  if (typeof updateTemperatureGauges === 'function') updateTemperatureGauges(data);
  if (typeof updatePrintProgress === 'function') updatePrintProgress(data);
  if (typeof updateAmsPanel === 'function') updateAmsPanel(data);
  if (typeof updateControls === 'function') updateControls(data);
  if (typeof updateSpeedControl === 'function') updateSpeedControl(data);
  if (typeof updateFanDisplay === 'function') updateFanDisplay(data);
  if (typeof updateActiveFilament === 'function') updateActiveFilament(data);
  if (typeof updatePrinterInfo === 'function') updatePrinterInfo(data);
  if (typeof updatePrintPreview === 'function') updatePrintPreview(data);
  if (typeof updateQuickStatus === 'function') updateQuickStatus(data);
  if (typeof updateSparklineStats === 'function') updateSparklineStats(data);
  if (typeof updateCountdownTimer === 'function') updateCountdownTimer(data);
  if (typeof updateFilamentRing === 'function') updateFilamentRing(data);
  if (typeof updateDashboardExtras === 'function') updateDashboardExtras(data);
  if (typeof injectPanelData === 'function') injectPanelData(data);
  updateStatusBar(data);
}

function updateStatusBar(data) {
  // WiFi signal
  const wifiEl = document.getElementById('wifi-signal');
  if (wifiEl && data.wifi_signal) {
    const sig = data.wifi_signal;
    wifiEl.textContent = sig;
    const dbm = typeof sig === 'string' ? parseInt(sig) : sig;
    if (!isNaN(dbm)) {
      wifiEl.style.color = dbm > -50 ? 'var(--accent-green)' : dbm > -70 ? 'var(--accent-orange)' : 'var(--accent-red)';
    }
  }

  // Chamber light
  const lightEl = document.getElementById('light-status');
  if (lightEl && data.lights_report) {
    const chamber = data.lights_report.find(l => l.node === 'chamber_light');
    if (chamber) {
      const isOn = chamber.mode === 'on';
      lightEl.textContent = isOn ? t('status_bar.light_on') : t('status_bar.light_off');
      lightEl.style.color = isOn ? 'var(--accent-yellow)' : '';
      const icon = lightEl.previousElementSibling;
      if (icon) icon.style.color = isOn ? 'var(--accent-yellow)' : '';
    }
  }
}

// Reload active tab data when switching printers
window._showEulaModal = function(text) {
  if (!text) { if (typeof showToast === 'function') showToast('EULA text not available', 'error'); return; }
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `<div style="background:var(--bg-secondary,#1e1e2e);border:1px solid var(--border-color,#333);border-radius:12px;max-width:700px;width:100%;max-height:90vh;display:flex;flex-direction:column;overflow:hidden">
    <div style="padding:16px 20px;border-bottom:1px solid var(--border-color,#333);display:flex;align-items:center;gap:10px">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <h3 style="margin:0;font-size:1.1rem">3DPrintForge — End User License Agreement</h3>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px 20px;font-size:0.82rem;line-height:1.7;color:var(--text-muted,#aaa);white-space:pre-wrap;font-family:inherit">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/^#{1,3}\s+(.+)/gm,'<strong style="color:var(--text-primary,#eee);font-size:0.95rem">$1</strong>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" style="color:var(--accent-blue,#448aff)">$1</a>')}</div>
    <div style="padding:14px 20px;border-top:1px solid var(--border-color,#333);display:flex;align-items:center;gap:10px;justify-content:space-between">
      <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px">
        <input type="checkbox" id="eula-agree-check"> I have read and agree to the EULA
      </label>
      <button id="eula-accept-btn" disabled style="padding:8px 24px;border-radius:8px;border:none;background:var(--accent-green,#00e676);color:#000;font-weight:700;cursor:pointer;opacity:0.4;font-size:0.85rem" onclick="fetch('/api/eula/accept',{method:'POST'}).then(()=>this.closest('div').parentElement.parentElement.remove())">Accept & Continue</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  const check = overlay.querySelector('#eula-agree-check');
  const btn = overlay.querySelector('#eula-accept-btn');
  check.addEventListener('change', () => { btn.disabled = !check.checked; btn.style.opacity = check.checked ? '1' : '0.4'; });
}

window.reloadActiveTab = function() {
  if (window._activePanel) {
    openPanel(window._activePanel);
  }
};

// ---- Sidebar Toggle (mobile) ----

window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;

  const isOpen = sidebar.classList.contains('open');
  sidebar.classList.toggle('open', !isOpen);
  if (backdrop) backdrop.classList.toggle('visible', !isOpen);
  document.body.style.overflow = !isOpen ? 'hidden' : '';
};

function closeSidebarIfMobile() {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

// ---- Inline Panel System ----

const PANEL_TITLES = {
  controls: 'tabs.controls',
  queue: 'queue.title',
  history: 'tabs.history',
  stats: 'tabs.statistics',
  analysis: 'tabs.analysis',
  telemetry: 'tabs.telemetry',
  filament: 'tabs.filament',
  errors: 'tabs.errors',
  waste: 'tabs.waste',
  maintenance: 'tabs.maintenance',
  protection: 'protection.title',
  modelinfo: 'tabs.model_info',
  learning: 'tabs.learning',
  knowledge: 'nav.knowledge',
  activity: 'tabs.activity',
  gallery: 'tabs.gallery',
  fleet: 'tabs.fleet',
  scheduler: 'tabs.scheduler',
  library: 'tabs.library',
  'calibration': 'Calibration & Tuning',
  'slicer-studio': 'Slicer Studio',
  'admin-diagnostics': 'Diagnostics & Tuning',
  'admin-inventory': 'Inventory Admin',
  'admin-kb': 'Knowledge Base Admin',
  bedmesh: 'tabs.bedmesh',
  gcode: 'tabs.gcode',
  health: 'tabs.health',
  comparison: 'tabs.comparison',
  forecast: 'tabs.filament_analytics',
  multicolor: 'tabs.multicolor',
  diagnostics: 'tabs.diagnostics',
  labels: 'tabs.labels',
  signmaker: 'Sign Maker',
  modelforge: 'Model Forge',
  widgets: 'tabs.widgets',
  analytics: 'Analytics',
  timetracker: 'tabs.timetracker',
  printermatrix: 'tabs.printermatrix',
  costestimator: 'tabs.costestimator',
  plugins: 'tabs.plugins',
  backup: 'tabs.backup',
  'firmware-updates': 'Firmware Updates',
  'resources': 'Resources',
  'octoprint': 'OctoPrint',
  playground: 'tabs.playground',
  settings: 'tabs.settings',
  materialrec: 'material_rec.title',
  filamentanalytics: 'tabs.filament_analytics',
  wearprediction: 'tabs.maintenance',
  erroranalysis: 'error_analysis.title',
  orders: 'orders.title',
  achievements: 'achievements.title',
  profiles: 'profiles.title',
  calendar: 'calendar.title',
  screenshots: 'screenshots.title',
  logs: 'logs.title',
  'crm-dashboard': 'crm.dashboard',
  'crm-customers': 'crm.customers',
  'crm-orders': 'crm.orders',
  'crm-invoices': 'crm.invoices',
  'crm-settings': 'crm.company_settings'
};

const PANEL_LOADERS = {
  controls: () => { if (typeof loadControlsPanel === 'function') loadControlsPanel(); },
  queue: () => { if (typeof loadQueuePanel === 'function') loadQueuePanel(); },
  history: () => { if (typeof loadHistoryPanel === 'function') loadHistoryPanel(); },
  analysis: () => { if (typeof loadAnalysisPanel === 'function') loadAnalysisPanel(); },
  filament: () => { if (typeof loadFilamentPanel === 'function') loadFilamentPanel(); },
  errors: () => { if (typeof loadErrorsPanel === 'function') loadErrorsPanel(); },
  maintenance: () => { if (typeof loadMaintenancePanel === 'function') loadMaintenancePanel(); },
  protection: () => { if (typeof loadProtectionPanel === 'function') loadProtectionPanel(); },
  knowledge: () => { if (typeof loadKnowledgePanel === 'function') loadKnowledgePanel(); },
  fleet: () => { if (typeof loadFleetPanel === 'function') loadFleetPanel(); },
  library: () => { if (typeof loadLibraryPanel === 'function') loadLibraryPanel(); },
  'calibration': () => { if (typeof loadCalibrationSuite === 'function') loadCalibrationSuite(); },
  'slicer-studio': () => { if (typeof loadSlicerStudio === 'function') loadSlicerStudio(); },
  'admin-diagnostics': () => {
    const body = document.getElementById('overlay-panel-body');
    if (body) body.innerHTML = '<div id="vendor-diagnostics-2026"></div>';
    if (typeof window.renderVendorDiagnostics2026 === 'function') window.renderVendorDiagnostics2026();
  },
  'admin-inventory': () => {
    const body = document.getElementById('overlay-panel-body');
    if (body) body.innerHTML = '<div id="inventory-admin-2026"></div>';
    if (typeof window.renderInventoryAdmin2026 === 'function') window.renderInventoryAdmin2026();
  },
  'admin-kb': () => {
    const body = document.getElementById('overlay-panel-body');
    if (body) body.innerHTML = '<div id="kb-viewer-2026"></div>';
    if (typeof window.renderKbViewer2026 === 'function') window.renderKbViewer2026();
  },
  diagnostics: () => { if (typeof loadDiagnosticsPanel === 'function') loadDiagnosticsPanel(); },
  labels: () => { if (typeof loadLabelPanel === 'function') loadLabelPanel(); },
  signmaker: () => { if (typeof loadSignMakerPanel === 'function') loadSignMakerPanel(); },
  modelforge: () => {
    // Support deep-linking: #modelforge/lithophane
    const hash = location.hash.replace('#', '');
    const sub = hash.startsWith('modelforge/') ? hash.split('/')[1] : null;
    if (typeof loadModelForgePanel === 'function') loadModelForgePanel(sub);
  },
  analytics: () => { if (typeof loadAnalyticsPanel === 'function') loadAnalyticsPanel(); },
  backup: () => { if (typeof loadBackupPanel === 'function') loadBackupPanel(); },
  'firmware-updates': () => {
    const body = document.getElementById('overlay-panel-body');
    if (body) body.innerHTML = '<div id="firmware-updates-panel"></div>';
    if (typeof loadFirmwareUpdatesPanel === 'function') loadFirmwareUpdatesPanel();
  },
  'resources': () => {
    const body = document.getElementById('overlay-panel-body');
    if (body) body.innerHTML = '<div id="resources-panel"></div>';
    if (typeof loadResourcesPanel === 'function') loadResourcesPanel();
  },
  'octoprint': () => {
    const body = document.getElementById('overlay-panel-body');
    if (body) body.innerHTML = '<div id="octoprint-panel"></div>';
    if (typeof loadOctoprintPanel === 'function') loadOctoprintPanel();
  },
  costestimator: () => { if (typeof loadCostEstimatorPanel === 'function') loadCostEstimatorPanel(); },
  settings: () => { if (typeof loadSettingsPanel === 'function') loadSettingsPanel(); },
  materialrec: () => { if (typeof loadMaterialRecommendationsPanel === 'function') loadMaterialRecommendationsPanel(); },
  filamentanalytics: () => { if (typeof loadFilamentAnalyticsPanel === 'function') loadFilamentAnalyticsPanel(); },
  wearprediction: () => { if (typeof loadMaintenancePanel === 'function') loadMaintenancePanel('wearprediction'); },
  erroranalysis: () => { if (typeof loadErrorAnalysisPanel === 'function') loadErrorAnalysisPanel(); },
  orders: () => { if (typeof loadOrderPanel === 'function') loadOrderPanel(); },
  achievements: () => { if (typeof loadAchievementsPanel === 'function') loadAchievementsPanel(); },
  profiles: () => { if (typeof loadProfilesPanel === 'function') loadProfilesPanel(); },
  calendar: () => { if (typeof loadPrintCalendar === 'function') loadPrintCalendar(); },
  // Redirects — sub-panels call the parent wrapper loader with initialTab
  scheduler: () => { if (typeof loadSchedulerPanel === 'function') loadSchedulerPanel(); },
  gallery: () => { if (typeof loadHistoryPanel === 'function') loadHistoryPanel('gallery'); },
  activity: () => { if (typeof loadHistoryPanel === 'function') loadHistoryPanel('activity'); },
  stats: () => { if (typeof loadAnalysisPanel === 'function') loadAnalysisPanel('stats'); },
  timetracker: () => { if (typeof loadAnalysisPanel === 'function') loadAnalysisPanel('timetracker'); },
  comparison: () => { if (typeof loadAnalysisPanel === 'function') loadAnalysisPanel('comparison'); },
  printermatrix: () => { if (typeof loadAnalysisPanel === 'function') loadAnalysisPanel('printermatrix'); },
  waste: () => { if (typeof loadAnalysisPanel === 'function') loadAnalysisPanel('waste'); },
  telemetry: () => { if (typeof loadDiagnosticsPanel === 'function') loadDiagnosticsPanel('telemetry'); },
  bedmesh: () => { if (typeof loadDiagnosticsPanel === 'function') loadDiagnosticsPanel('bedmesh'); },
  health: () => { if (typeof loadDiagnosticsPanel === 'function') loadDiagnosticsPanel('health'); },
  gcode: () => { if (typeof loadLibraryPanel === 'function') loadLibraryPanel('gcode'); },
  forecast: () => { if (typeof loadFilamentAnalyticsPanel === 'function') loadFilamentAnalyticsPanel('forecast'); },
  multicolor: () => { if (typeof loadFilamentPanel === 'function') loadFilamentPanel('multicolor'); },
  learning: () => { if (typeof loadKnowledgePanel === 'function') loadKnowledgePanel('learning'); },
  modelinfo: () => { if (typeof loadKnowledgePanel === 'function') loadKnowledgePanel('modelinfo'); },
  screenshots: () => { if (typeof loadScreenshotGallery === 'function') loadScreenshotGallery(); },
  logs: () => { if (typeof loadLogViewer === 'function') loadLogViewer(); },
  'crm-dashboard': () => { if (typeof loadCrmDashboardPanel === 'function') loadCrmDashboardPanel(); },
  'crm-customers': () => { if (typeof loadCrmCustomersPanel === 'function') loadCrmCustomersPanel(); },
  'crm-orders': () => { if (typeof loadCrmOrdersPanel === 'function') loadCrmOrdersPanel(); },
  'crm-invoices': () => { if (typeof loadCrmInvoicesPanel === 'function') loadCrmInvoicesPanel(); },
  'crm-settings': () => { if (typeof loadCrmSettingsPanel === 'function') loadCrmSettingsPanel(); },
};

window._activePanel = null;

// Panels that must NOT be force-re-rendered by the periodic auto-refresh.
// They are either static/slow (achievements, calendar, knowledge…) or hold
// interactive state — a full re-render flickers, resets scroll and discards
// the user's selection (which read as "the page suddenly shows something
// else"). Live-telemetry panels keep auto-refreshing. Live data on the
// active printer still arrives via WebSocket push regardless.
const NO_AUTO_REFRESH = new Set([
  'achievements', 'calendar', 'knowledge', 'learning', 'library', 'gallery',
  'screenshots', 'modelinfo', 'printermatrix',
  'materialrec', 'settings', 'backup', 'profiles', 'labels', 'signmaker',
  'modelforge', 'costestimator', 'gcode',
  'comparison', 'bedmesh', 'multicolor',
]);

window.openPanel = function(name, skipHash) {
  if (!PANEL_TITLES[name]) return;
  const panelContent = document.getElementById('panel-content');
  const dashboardGrid = document.getElementById('dashboard-grid');
  const statsStrip = document.getElementById('stats-strip');
  const titleEl = document.getElementById('overlay-panel-title');
  if (!panelContent || !dashboardGrid) return;

  closeSidebarIfMobile();

  window._activePanel = name;

  // Persist last panel to localStorage
  try { localStorage.setItem('lastPanel', name); } catch (_) {}

  const panelTitle = t(PANEL_TITLES[name] || name);
  if (titleEl) {
    titleEl.textContent = panelTitle;
  }

  // Update breadcrumb
  const bcCurrent = document.getElementById('breadcrumb-current');
  if (bcCurrent) bcCurrent.textContent = panelTitle;

  // Update URL hash
  if (!skipHash) history.replaceState(null, '', '#' + name);

  // Highlight sidebar button and expand its section
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  // Map old panel names to their new merged parent for sidebar highlighting
  const _panelParentMap = {
    // Sub-tabs → parent sidebar button
    gallery: 'history', activity: 'history',
    stats: 'analysis', comparison: 'analysis', printermatrix: 'analysis', timetracker: 'analysis', waste: 'analysis',
    telemetry: 'diagnostics', bedmesh: 'diagnostics', health: 'diagnostics',
    gcode: 'library', modelinfo: 'knowledge', learning: 'knowledge',
    forecast: 'filamentanalytics', multicolor: 'filament',
    wearprediction: 'maintenance'
  };
  const sidebarName = _panelParentMap[name] || name;
  document.querySelector(`.sidebar-btn[data-panel="${sidebarName}"]`)?.classList.add('active');
  _expandSectionForPanel(name);

  // Hide dashboard + stats strip + info boxes, show panel
  dashboardGrid.classList.add('view-hidden');
  if (statsStrip) statsStrip.classList.add('view-hidden');
  const infoStrip = document.getElementById('info-box-strip');
  if (infoStrip) infoStrip.classList.add('hidden');
  const achTeaser = document.getElementById('ach-dash-teaser');
  if (achTeaser) achTeaser.style.display = 'none';
  panelContent.classList.add('panel-active');

  // Show skeleton while content loads — tailored per panel type
  const body = document.getElementById('overlay-panel-body');
  if (body) {
    const gridPanels = ['controls', 'filament', 'analysis', 'maintenance', 'learning', 'knowledge', 'diagnostics'];
    const tablePanels = ['history', 'errors', 'queue', 'waste'];
    let skel;
    if (gridPanels.includes(name)) {
      // Tab bar + card grid skeleton
      skel = '<div style="padding:8px 0">' +
        '<div style="display:flex;gap:8px;margin-bottom:16px">' +
        '<div class="skeleton" style="height:32px;width:80px;border-radius:6px"></div>' +
        '<div class="skeleton" style="height:32px;width:80px;border-radius:6px"></div>' +
        '<div class="skeleton" style="height:32px;width:80px;border-radius:6px"></div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px">' +
        '<div class="skeleton skeleton-block" style="height:140px"></div>' +
        '<div class="skeleton skeleton-block" style="height:140px"></div>' +
        '<div class="skeleton skeleton-block" style="height:140px"></div>' +
        '<div class="skeleton skeleton-block" style="height:140px"></div>' +
        '</div></div>';
    } else if (tablePanels.includes(name)) {
      // Filter bar + list rows skeleton
      skel = '<div style="padding:8px 0">' +
        '<div style="display:flex;gap:8px;margin-bottom:16px">' +
        '<div class="skeleton" style="height:32px;width:120px;border-radius:6px"></div>' +
        '<div class="skeleton" style="height:32px;flex:1;border-radius:6px"></div>' +
        '</div>' +
        '<div class="skeleton skeleton-block" style="height:48px;margin-bottom:6px"></div>' +
        '<div class="skeleton skeleton-block" style="height:48px;margin-bottom:6px"></div>' +
        '<div class="skeleton skeleton-block" style="height:48px;margin-bottom:6px"></div>' +
        '<div class="skeleton skeleton-block" style="height:48px;margin-bottom:6px"></div>' +
        '<div class="skeleton skeleton-block" style="height:48px"></div>' +
        '</div>';
    } else {
      // Generic skeleton
      skel = '<div style="padding:8px 0">' +
        '<div class="skeleton skeleton-block" style="height:40px;margin-bottom:12px"></div>' +
        '<div class="skeleton skeleton-block" style="height:180px;margin-bottom:12px"></div>' +
        '<div class="skeleton skeleton-text" style="width:45%"></div>' +
        '</div>';
    }
    body.innerHTML = skel;
  }

  if (PANEL_LOADERS[name]) PANEL_LOADERS[name]();

  // Auto-refresh
  clearInterval(window._autoRefreshInterval);
  const refreshMs = parseInt(localStorage.getItem('autoRefreshMs')) || 0;
  if (refreshMs > 0 && PANEL_LOADERS[name] && !NO_AUTO_REFRESH.has(name)) {
    window._autoRefreshInterval = setInterval(() => {
      if (window._activePanel === name && PANEL_LOADERS[name] && !NO_AUTO_REFRESH.has(name)) {
        PANEL_LOADERS[name]();
      }
    }, refreshMs);
  }
};

window.showDashboard = function(skipHash) {
  const panelContent = document.getElementById('panel-content');
  const dashboardGrid = document.getElementById('dashboard-grid');
  const statsStrip = document.getElementById('stats-strip');
  if (!panelContent || !dashboardGrid) return;

  clearInterval(window._autoRefreshInterval);
  closeSidebarIfMobile();

  dashboardGrid.classList.remove('view-hidden');
  if (statsStrip) statsStrip.classList.remove('view-hidden');
  const infoStrip = document.getElementById('info-box-strip');
  if (infoStrip) infoStrip.classList.remove('hidden');
  const achTeaser = document.getElementById('ach-dash-teaser');
  if (achTeaser && achTeaser.querySelector('.ach-teaser-card')) achTeaser.style.display = '';
  panelContent.classList.remove('panel-active');
  window._activePanel = null;

  // Update URL hash
  if (!skipHash) history.replaceState(null, '', location.pathname);

  // Highlight dashboard button
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.sidebar-btn[data-panel="dashboard"]')?.classList.add('active');
};

// Backward compatibility
window.closePanel = window.showDashboard;

// Auto-refresh configuration
window.setAutoRefresh = function(ms) {
  const val = parseInt(ms) || 0;
  localStorage.setItem('autoRefreshMs', val);
  clearInterval(window._autoRefreshInterval);
  if (val > 0 && window._activePanel && PANEL_LOADERS[window._activePanel] && !NO_AUTO_REFRESH.has(window._activePanel)) {
    window._autoRefreshInterval = setInterval(() => {
      if (window._activePanel && PANEL_LOADERS[window._activePanel] && !NO_AUTO_REFRESH.has(window._activePanel)) {
        PANEL_LOADERS[window._activePanel]();
      }
    }, val);
  }
};

// Re-render all components (called on language switch)
window.refreshAllComponents = function() {
  const activeState = state.getActivePrinterState();
  const printData = activeState.print || activeState;
  updateDashboard(printData);
  updateConnectionBadge();
  if (typeof updatePrinterSelector === 'function') updatePrinterSelector();
  // Re-render open panel
  window.reloadActiveTab();
};

// ---- Sidebar Collapse ----

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';
const SIDEBAR_SECTIONS_KEY = 'sidebar-sections';

window.toggleSidebarCollapse = function() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar || window.innerWidth <= 768) return;
  const isCollapsed = sidebar.classList.toggle('collapsed');
  try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isCollapsed ? '1' : '0'); } catch (_) {}
};

// ---- Sidebar Sections (collapsible groups via AdminLTE treeview) ----

window.toggleSidebarSection = function(name) {
  const section = document.querySelector(`.sidebar-section[data-section="${name}"]`);
  if (!section) return;
  const link = section.querySelector(':scope > .nav-link');
  if (link) link.click();
};

// Live-filter the sidebar so the user can jump to any of the ~48 panels by
// typing, instead of hunting through nine collapsible groups. Matching items
// stay visible and their group auto-expands; empty groups hide. Clearing the
// box restores the user's saved expand/collapse state.
window.filterSidebar = function(query) {
  const q = (query || '').toLowerCase().trim();
  const menu = document.querySelector('.sidebar-menu');
  if (!menu) return;
  menu.querySelectorAll(':scope > li.nav-item').forEach(li => {
    // The Pinned shortcuts duplicate real items, so just hide them while
    // searching (the real items are matched below); restored on clear.
    if (li.id === 'sidebar-pinned-section') { li.style.display = q ? 'none' : ''; return; }
    const sub = li.querySelector(':scope > ul.nav-treeview');
    if (!sub) {
      // Flat top-level entry (Dashboard).
      const txt = (li.textContent || '').toLowerCase();
      li.style.display = (!q || txt.includes(q)) ? '' : 'none';
      return;
    }
    let anyMatch = false;
    sub.querySelectorAll(':scope > li.nav-item').forEach(child => {
      const m = !q || (child.textContent || '').toLowerCase().includes(q);
      child.style.display = m ? '' : 'none';
      if (m) anyMatch = true;
    });
    if (q) {
      li.style.display = anyMatch ? '' : 'none';
      if (anyMatch) { li.classList.add('menu-open'); sub.style.display = 'block'; }
    } else {
      li.style.display = '';
    }
  });
  if (!q) {
    // Collapse everything, then restore the state the user had open.
    document.querySelectorAll('.sidebar-section').forEach(s => {
      s.classList.remove('menu-open');
      const sub = s.querySelector(':scope > .nav-treeview');
      if (sub) sub.style.display = '';
    });
    try { _restoreSidebarSections(); } catch (_) {}
    try { _renderPinned(); } catch (_) {}
  }
};

// ---- Sidebar favourites (pin any panel to a "Pinned" section up top) ----
const PINNED_KEY = 'sidebar-pinned';
function _getPinned() { try { return JSON.parse(localStorage.getItem(PINNED_KEY)) || []; } catch (_) { return []; } }
function _isPinned(panel) { return _getPinned().includes(panel); }

window.togglePin = function(panel) {
  let p = _getPinned();
  p = p.includes(panel) ? p.filter(x => x !== panel) : [...p, panel];
  try { localStorage.setItem(PINNED_KEY, JSON.stringify(p)); } catch (_) {}
  document.querySelectorAll(`.sidebar-menu .nav-treeview .sidebar-btn[data-panel="${panel}"]`)
    .forEach(b => b.classList.toggle('is-pinned', p.includes(panel)));
  _renderPinned();
};

// Rebuild the Pinned list from storage (clones look/label from the originals).
function _renderPinned() {
  const list = document.getElementById('sidebar-pinned-list');
  const section = document.getElementById('sidebar-pinned-section');
  if (!list || !section) return;
  list.innerHTML = '';
  let n = 0;
  for (const panel of _getPinned()) {
    const orig = document.querySelector(`.sidebar-menu .nav-treeview .sidebar-btn[data-panel="${panel}"]`);
    if (!orig) continue;
    const iconCls = orig.querySelector('.nav-icon')?.className || 'nav-icon bi bi-dot';
    const label = (orig.querySelector('p')?.textContent || panel).trim();
    const li = document.createElement('li');
    li.className = 'nav-item';
    const a = document.createElement('a');
    a.href = '#'; a.className = 'nav-link sidebar-btn'; a.dataset.panel = panel;
    const i = document.createElement('i'); i.className = iconCls;
    const p = document.createElement('p'); p.textContent = label;
    const unpin = document.createElement('button');
    unpin.className = 'sidebar-pin pinned'; unpin.title = 'Unpin';
    unpin.innerHTML = '<i class="bi bi-pin-angle-fill"></i>';
    unpin.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); togglePin(panel); });
    a.append(i, p, unpin);
    a.addEventListener('click', (e) => { e.preventDefault(); if (window.openPanel) window.openPanel(panel); });
    li.appendChild(a);
    list.appendChild(li);
    n++;
  }
  section.style.display = n ? '' : 'none';
}

// Add a pin toggle to every leaf nav item, then render the Pinned section.
function _initSidebarPins() {
  document.querySelectorAll('.sidebar-menu .nav-treeview .sidebar-btn[data-panel]').forEach(btn => {
    if (btn.querySelector('.sidebar-pin')) return;
    const panel = btn.dataset.panel;
    const b = document.createElement('button');
    b.className = 'sidebar-pin'; b.title = 'Pin to top';
    b.innerHTML = '<i class="bi bi-pin-angle"></i>';
    b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); togglePin(panel); });
    btn.appendChild(b);
    if (_isPinned(panel)) btn.classList.add('is-pinned');
  });
  _renderPinned();
}

function _saveSidebarSections() {
  try {
    const sectionState = {};
    document.querySelectorAll('.sidebar-section').forEach(s => {
      sectionState[s.dataset.section] = s.classList.contains('menu-open') ? 1 : 0;
    });
    localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(sectionState));
  } catch (_) {}
}

function _restoreSidebarSections() {
  try {
    const raw = localStorage.getItem(SIDEBAR_SECTIONS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    for (const [name, open] of Object.entries(saved)) {
      const section = document.querySelector(`.sidebar-section[data-section="${name}"]`);
      if (!section) continue;
      const treeview = section.querySelector(':scope > .nav-treeview');
      if (open) {
        section.classList.add('menu-open');
        if (treeview) treeview.style.display = 'block';
      } else {
        section.classList.remove('menu-open');
        if (treeview) treeview.style.display = 'none';
      }
    }
  } catch (_) {}
}

// Auto-expand section when its child panel becomes active
function _expandSectionForPanel(panelName) {
  // Try direct match first, then check parent map
  const parentMap = {
    gallery: 'history', activity: 'history',
    stats: 'analysis', comparison: 'analysis', printermatrix: 'analysis', timetracker: 'analysis', waste: 'analysis',
    telemetry: 'diagnostics', bedmesh: 'diagnostics', health: 'diagnostics',
    gcode: 'library', modelinfo: 'knowledge', learning: 'knowledge',
    forecast: 'filamentanalytics', multicolor: 'filament',
    wearprediction: 'maintenance'
  };
  const resolvedName = parentMap[panelName] || panelName;
  const btn = document.querySelector(`.sidebar-btn[data-panel="${resolvedName}"]`) || document.querySelector(`.sidebar-btn[data-panel="${panelName}"]`);
  if (!btn) return;
  const section = btn.closest('.sidebar-section');
  if (section && !section.classList.contains('menu-open')) {
    section.classList.add('menu-open');
    const treeview = section.querySelector(':scope > .nav-treeview');
    if (treeview) treeview.style.display = 'block';
    _saveSidebarSections();
  }
}

// ---- Hash-based routing ----

function navigateFromHash() {
  const hash = location.hash.replace('#', '');
  const base = hash.split('/')[0];
  if (hash && PANEL_TITLES[hash]) {
    openPanel(hash, true);
  } else if (base && PANEL_TITLES[base]) {
    openPanel(base, true);
    if (hash !== base) history.replaceState(null, '', '#' + hash);
  } else if (window._activePanel) {
    showDashboard(true);
  }
}

window.addEventListener('hashchange', navigateFromHash);

// Init
document.addEventListener('DOMContentLoaded', async () => {
  await window.i18n.init();
  if (window._initPermissions) await window._initPermissions();

  // Apply permission gating to sidebar
  if (window._isAuthEnabled && window._isAuthEnabled()) {
    if (window._can && !window._can('admin')) {
      const settingsBtn = document.querySelector('[data-panel="settings"]');
      // Don't hide settings entirely — operators/viewers still need appearance/push settings
      // But we could hide it if we wanted. For now, keep visible — admin sections are gated inside.
    }
  }

  connect();

  // React immediately to the browser losing/regaining connectivity.
  window.addEventListener('online', _handleOnline);
  window.addEventListener('offline', _handleOffline);
  if (!navigator.onLine) _handleOffline();

  // Load info-box stats and refresh every 30s
  updateInfoBoxes();
  setInterval(updateInfoBoxes, 30000);

  // Show business sidebar section only when ecom license is active
  fetch('/api/ecommerce/license').then(r => r.ok ? r.json() : { active: false }).then(lic => {
    const el = document.getElementById('sidebar-business');
    if (el && lic && lic.active) el.style.display = '';
  }).catch(() => {});

  // Restore sidebar collapse state
  if (window.innerWidth > 768 && localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1') {
    document.getElementById('sidebar')?.classList.add('collapsed');
  }

  // Restore sidebar section collapse state
  _restoreSidebarSections();

  // Wire up "pin to top" favourites on every nav item.
  _initSidebarPins();

  // Listen for AdminLTE treeview events to persist sidebar section state
  document.querySelectorAll('.sidebar-section').forEach(section => {
    section.addEventListener('expanded.lte.treeview', () => _saveSidebarSections());
    section.addEventListener('collapsed.lte.treeview', () => _saveSidebarSections());
  });

  // Check EULA acceptance
  fetch('/api/eula').then(r => r.json()).then(d => {
    if (!d.accepted) _showEulaModal(d.text);
  }).catch(() => {});

  // Fetch version for sidebar
  fetch('/api/update/status').then(r => r.json()).then(d => {
    const el = document.getElementById('sidebar-version');
    if (el && d.current) el.textContent = `v${d.current}`;
  }).catch(() => {});

  // Toggle for "continue where you left off" (read in the no-hash branch below)
  window.setRestoreLastPanel = function (v) { try { localStorage.setItem('restore-last-panel', v ? '1' : '0'); } catch (_) { /* ignore */ } };

  // Restore panel from URL hash on load, fallback to localStorage
  const initHash = location.hash.replace('#', '');
  const initBase = initHash.split('/')[0];
  if (initHash && PANEL_TITLES[initHash]) {
    setTimeout(() => openPanel(initHash), 200);
  } else if (initBase && PANEL_TITLES[initBase]) {
    setTimeout(() => {
      openPanel(initBase, true); // skipHash=true to preserve full path
      if (initHash !== initBase) history.replaceState(null, '', '#' + initHash);
    }, 200);
  } else if (!initHash) {
    // No hash = stay on dashboard, unless the user opted into "continue where
    // you left off" — then reopen the last-viewed panel.
    try {
      if (localStorage.getItem('restore-last-panel') === '1') {
        const last = localStorage.getItem('lastPanel');
        if (last && last !== 'dashboard' && PANEL_TITLES[last]) setTimeout(() => openPanel(last), 200);
      }
    } catch (_) { /* ignore */ }
  }

  // ESC key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (window._activePanel) {
        showDashboard();
      } else if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar?.classList.contains('open')) toggleSidebar();
      }
    }
  });

  // Close sidebar on resize above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('visible');
      document.body.style.overflow = '';
    }
  });

  // ---- System Info Badge ----
  function formatUptime(sec) {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (d > 0) return d + 'd ' + h + 'h';
    if (h > 0) return h + 'h ' + m + 'm';
    return m + 'm';
  }

  let _lastSystemInfo = null;

  async function fetchSystemInfo() {
    const badge = document.getElementById('system-info-badge');
    if (!badge) return;
    try {
      const res = await fetch('/api/system/info');
      if (!res.ok) return;
      const info = await res.json();
      _lastSystemInfo = info;
      const uptime = formatUptime(info.uptime || info.uptime_seconds || 0);
      const memMB = info.memory_mb || Math.round((info.memoryUsage?.rss || 0) / 1024 / 1024);
      badge.textContent = uptime + ' · ' + memMB + ' MB';
      badge.title = 'Server uptime: ' + uptime + '\nMemory: ' + memMB + ' MB\nNode: ' + (info.node_version || info.nodeVersion) + '\nPrinters: ' + (info.printer_count ?? info.printerCount) + '\nStarted: ' + (info.startedAt || '—');
    } catch (_) {
      badge.textContent = '';
    }
  }

  badge_click: {
    const sib = document.getElementById('system-info-badge');
    if (sib) {
      sib.addEventListener('click', () => {
        if (!_lastSystemInfo) return;
        const info = _lastSystemInfo;
        const uptime = formatUptime(info.uptime || info.uptime_seconds || 0);
        const memMB = info.memory_mb || Math.round((info.memoryUsage?.rss || 0) / 1024 / 1024);
        const heapUsed = info.memoryUsage ? Math.round(info.memoryUsage.heapUsed / 1024 / 1024) : '—';
        const heapTotal = info.memoryUsage ? Math.round(info.memoryUsage.heapTotal / 1024 / 1024) : '—';
        const dbMB = info.dbSize ? (info.dbSize / 1024 / 1024).toFixed(1) : (info.db_size ? (info.db_size / 1024 / 1024).toFixed(1) : '—');
        const lines = [
          'Server Uptime: ' + uptime,
          'Memory (RSS): ' + memMB + ' MB',
          'Heap: ' + heapUsed + ' / ' + heapTotal + ' MB',
          'Node: ' + (info.node_version || info.nodeVersion),
          'Platform: ' + (info.platform || '—'),
          'Printers: ' + (info.printer_count ?? info.printerCount),
          'DB Size: ' + dbMB + ' MB',
          'Started: ' + (info.startedAt || '—'),
          'PID: ' + (info.pid || '—')
        ];
        if (typeof showToast === 'function') {
          showToast(lines.join('\n'), 'info', 8000);
        } else {
          alert(lines.join('\n'));
        }
      });
    }
  }

  // Fetch immediately, then every 30 seconds
  fetchSystemInfo();
  setInterval(fetchSystemInfo, 30000);
});
