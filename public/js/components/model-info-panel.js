// Model Info — Device hardware panel (Bambu Studio style) + model linking
(function() {
  const SOURCE_COLORS = {
    makerworld:  { bg: 'rgba(18,121,255,0.15)', border: 'rgba(18,121,255,0.4)', text: '#1279ff', label: 'MakerWorld' },
    printables:  { bg: 'rgba(255,128,0,0.15)', border: 'rgba(255,128,0,0.4)', text: '#ff8000', label: 'Printables' },
    thingiverse: { bg: 'rgba(0,200,220,0.15)', border: 'rgba(0,200,220,0.4)', text: '#00c8dc', label: 'Thingiverse' }
  };

  let _currentProjectId = '';
  let _currentModelData = null;
  let _fetching = false;
  let _currentFilename = '';

  // Module code → friendly name mapping
  const MODULE_NAMES = {
    'ota':  'Printer Firmware',
    'ap2':  'Application Processor',
    'mc':   'Motion Controller',
    'th':   'Toolhead',
    'smc':  'Speed Motor Controller',
    'ahb':  'Filament Buffer',
    'n3f':  'AMS 2 Pro',
    'n3s':  'AMS 2 Pro',
    'ams':  'AMS',
    'n1f':  'AMS Lite',
    'rv1126': 'Camera Module',
    'esp32':  'WiFi Module'
  };

  // Module code → detail suffix (shown after dash)
  const MODULE_SUFFIX = {
    'ahb': 'for P2'
  };

  // SVG icons for device sections
  const PRINTER_SVG = `<svg viewBox="0 0 80 80" width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="60" height="50" rx="4" stroke="var(--text-muted)" stroke-width="1.5" fill="var(--bg-tertiary)"/>
    <rect x="15" y="25" width="50" height="30" rx="2" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.5"/>
    <rect x="10" y="12" width="60" height="10" rx="3" stroke="var(--text-muted)" stroke-width="1.5" fill="var(--bg-tertiary)"/>
    <circle cx="65" cy="17" r="2" fill="var(--accent-green)"/>
    <line x1="30" y1="40" x2="50" y2="40" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2 2"/>
    <rect x="35" y="60" width="10" height="8" rx="1" fill="var(--text-muted)" opacity="0.3"/>
  </svg>`;

  const AMS_SVG = `<svg viewBox="0 0 80 60" width="120" height="90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="70" height="50" rx="4" stroke="var(--text-muted)" stroke-width="1.5" fill="var(--bg-tertiary)"/>
    <rect x="10" y="12" width="13" height="35" rx="2" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.4"/>
    <rect x="26" y="12" width="13" height="35" rx="2" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.4"/>
    <rect x="42" y="12" width="13" height="35" rx="2" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.4"/>
    <rect x="58" y="12" width="13" height="35" rx="2" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.4"/>
    <circle cx="16" cy="20" r="4" fill="var(--accent-blue)" opacity="0.5"/>
    <circle cx="32" cy="20" r="4" fill="var(--accent-green)" opacity="0.5"/>
    <circle cx="48" cy="20" r="4" fill="#e06" opacity="0.5"/>
    <circle cx="64" cy="20" r="4" fill="var(--text-muted)" opacity="0.3"/>
  </svg>`;

  const BUFFER_SVG = `<svg viewBox="0 0 80 50" width="120" height="75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="70" height="40" rx="4" stroke="var(--text-muted)" stroke-width="1.5" fill="var(--bg-tertiary)"/>
    <path d="M15 15 Q25 25 35 15 Q45 25 55 15 Q65 25 70 20" stroke="var(--text-muted)" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M15 25 Q25 35 35 25 Q45 35 55 25 Q65 35 70 30" stroke="var(--text-muted)" stroke-width="1.5" fill="none" opacity="0.3"/>
  </svg>`;

  const TOOLHEAD_SVG = `<svg viewBox="0 0 60 60" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="8" width="30" height="40" rx="4" stroke="var(--text-muted)" stroke-width="1.5" fill="var(--bg-tertiary)"/>
    <circle cx="30" cy="24" r="6" stroke="var(--text-muted)" stroke-width="1.5" fill="var(--bg-primary)" opacity="0.5"/>
    <path d="M28 44 L30 52 L32 44" stroke="var(--text-muted)" stroke-width="1.5" fill="none"/>
    <rect x="22" y="12" width="16" height="4" rx="1" fill="var(--text-muted)" opacity="0.2"/>
  </svg>`;

  const BOARD_SVG = `<svg viewBox="0 0 60 60" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="44" height="36" rx="3" stroke="var(--text-muted)" stroke-width="1.5" fill="var(--bg-tertiary)"/>
    <rect x="14" y="18" width="8" height="8" rx="1" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.4"/>
    <rect x="26" y="18" width="8" height="8" rx="1" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.4"/>
    <rect x="38" y="18" width="8" height="8" rx="1" stroke="var(--text-muted)" stroke-width="1" fill="var(--bg-primary)" opacity="0.4"/>
    <line x1="14" y1="32" x2="46" y2="32" stroke="var(--text-muted)" stroke-width="0.5" opacity="0.3"/>
    <line x1="14" y1="36" x2="46" y2="36" stroke="var(--text-muted)" stroke-width="0.5" opacity="0.3"/>
    <line x1="14" y1="40" x2="46" y2="40" stroke="var(--text-muted)" stroke-width="0.5" opacity="0.3"/>
    <circle cx="12" cy="46" r="1.5" fill="var(--text-muted)" opacity="0.3"/>
    <circle cx="48" cy="46" r="1.5" fill="var(--text-muted)" opacity="0.3"/>
    <circle cx="12" cy="14" r="1.5" fill="var(--text-muted)" opacity="0.3"/>
    <circle cx="48" cy="14" r="1.5" fill="var(--text-muted)" opacity="0.3"/>
  </svg>`;

  function getModuleIcon(code) {
    const base = code.split('/')[0];
    if (base === 'ahb') return BUFFER_SVG;
    if (['n3f','n3s','ams','n1f'].includes(base)) return AMS_SVG;
    if (base === 'th') return TOOLHEAD_SVG;
    if (['mc','smc','ap2','rv1126','esp32'].includes(base)) return BOARD_SVG;
    return BOARD_SVG;
  }

  // ---- Dashboard strip (MakerWorld / Printables / Thingiverse) ----
  window.updateModelInfo = function(data, isActive) {
    const strip = document.getElementById('model-info');
    if (!strip) return;

    if (!isActive) {
      strip.style.display = 'none';
      _currentProjectId = '';
      _currentModelData = null;
      _currentFilename = '';
      return;
    }

    const projectId = data.project_id;
    const filename = data.subtask_name || data.gcode_file || '';
    _currentFilename = filename;

    if (projectId && projectId !== '0') {
      if (projectId === _currentProjectId && _currentModelData !== null) return;
      _currentProjectId = projectId;
      _currentModelData = null;

      if (_fetching) return;
      _fetching = true;

      strip.style.display = '';
      strip.innerHTML = `<span class="mi-loading">${t('model_info.loading')}</span>`;

      fetch(`/api/makerworld/${projectId}`)
        .then(r => r.ok ? r.json() : null)
        .then(info => {
          _currentModelData = info ? { ...info, source: 'makerworld', source_id: projectId } : null;
          renderStrip(strip);
        })
        .catch(() => {
          _currentModelData = { url: `https://makerworld.com/en/models/${projectId}`, source: 'makerworld', source_id: projectId, fallback: true };
          renderStrip(strip);
        })
        .finally(() => { _fetching = false; });
      return;
    }

    _currentProjectId = '';
    const printerId = window.printerState?.getActivePrinterId();
    if (printerId && filename) {
      checkLinkedModel(strip, printerId, filename);
    } else {
      strip.style.display = 'none';
    }
  };

  let _lastModelLinkCheck = 0;
  let _lastModelLinkFile = '';
  function checkLinkedModel(strip, printerId, filename) {
    // Throttle: only check once per 30s per filename
    const now = Date.now();
    if (filename === _lastModelLinkFile && now - _lastModelLinkCheck < 30000) return;
    _lastModelLinkCheck = now;
    _lastModelLinkFile = filename;
    fetch(`/api/model-link/${encodeURIComponent(printerId)}?filename=${encodeURIComponent(filename)}`)
      .then(r => r.ok ? r.json() : null)
      .then(link => {
        if (link) {
          _currentModelData = link;
          strip.style.display = '';
          renderStrip(strip);
        } else {
          strip.style.display = '';
          strip.innerHTML = `<button class="mi-link-btn" onclick="openPanel('modelinfo')" title="${t('model_info.link_model')}">`
            + `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`
            + ` ${t('model_info.link_model')}</button>`;
        }
      })
      .catch(() => { strip.style.display = 'none'; });
  }

  function renderStrip(strip) {
    const data = _currentModelData;
    if (!data) { strip.style.display = 'none'; return; }

    const src = SOURCE_COLORS[data.source] || SOURCE_COLORS.makerworld;
    let html = `<span class="mi-source-badge" style="background:${src.bg};border-color:${src.border};color:${src.text}">${src.label}</span>`;

    if (data.image) {
      html += `<img class="mi-thumb" src="${esc(data.image)}" alt="" onerror="this.style.display='none'">`;
    }

    const url = data.url || '#';
    html += `<div class="mi-info">`;
    html += `<a class="mi-title" href="${esc(url)}" target="_blank" rel="noopener">${esc(data.title || t('model_info.unknown'))}</a>`;
    const parts = [];
    if (data.designer) parts.push(esc(data.designer));
    if (data.downloads > 0) parts.push(`${data.downloads} \u2B07`);
    if (data.likes > 0) parts.push(`${data.likes} \u2764`);
    if (parts.length) html += `<span class="mi-meta">${parts.join(' \u00B7 ')}</span>`;
    html += `</div>`;

    html += `<a class="mi-open" href="${esc(url)}" target="_blank" rel="noopener" title="${src.label}">`
      + `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`;

    strip.innerHTML = html;
    strip.onclick = (e) => {
      if (e.target.closest('a')) return;
      openPanel('modelinfo');
    };
  }

  // ---- Sidebar Panel ----

  window.loadModelInfoPanel = async function() {
    const container = document.getElementById('overlay-panel-body');
    if (!container) return;

    const state = window.printerState?.getActivePrinterState?.() || {};
    const meta = window.printerState?.getActivePrinterMeta?.() || {};
    const printerId = window.printerState?.getActivePrinterId?.();
    const printData = state.print || state;
    const gcodeState = printData.gcode_state || 'IDLE';
    const stateLabel = { RUNNING: 'Printing', PAUSE: 'Paused', IDLE: 'Idle', FINISH: 'Finished', FAILED: 'Failed', PREPARE: 'Preparing' }[gcodeState] || gcodeState;

    // Show loading state
    container.innerHTML = `<div class="di-panel"><div class="di-header">${esc(meta.name || printerId || 'Printer')}(${stateLabel})</div><div style="padding:20px;color:var(--text-muted)">Loading device info...</div></div>`;

    // Fetch firmware modules from API (reliable source)
    let modules = [];
    if (printerId) {
      try {
        const res = await fetch(`/api/firmware?printer_id=${encodeURIComponent(printerId)}`);
        const data = await res.json();
        if (Array.isArray(data)) modules = data;
      } catch {}
    }

    // Deduplicate: keep latest entry per module name
    const modMap = new Map();
    for (const m of modules) {
      const existing = modMap.get(m.module);
      if (!existing || m.id > existing.id) modMap.set(m.module, m);
    }
    const uniqueModules = [...modMap.values()];

    // Find OTA module for printer firmware version
    const otaMod = uniqueModules.find(m => m.module === 'ota');
    const fwVersion = otaMod?.sw_ver || '--';
    const upgradeState = printData.upgrade_state || {};

    let html = `<div class="di-panel">`;

    // ---- Device header ----
    html += `<div class="di-header">${esc(meta.name || printerId || 'Printer')}(${stateLabel})</div>`;

    // ---- Printer section ----
    html += `<div class="di-device-section di-printer-section">`;
    html += `<div class="di-device-image">${PRINTER_SVG}</div>`;
    html += `<div class="di-device-info">`;
    html += `<div class="di-firmware-actions"><button class="di-update-btn" id="di-update-firmware-btn">Update firmware</button></div>`;

    if (upgradeState.status === 'SUCCESS' || upgradeState.progress === 100) {
      html += `<div class="di-fw-status di-fw-success">Updating successful</div>`;
      html += `<div class="di-fw-progress-row"><div class="di-fw-progress"><div class="di-fw-progress-fill" style="width:100%"></div></div><span class="di-fw-percent">100%</span></div>`;
      html += `<a class="di-release-note" href="https://wiki.bambulab.com/en/software/firmware-release-notes" target="_blank" rel="noopener">Release Note</a>`;
    } else if (upgradeState.progress > 0 && upgradeState.progress < 100) {
      html += `<div class="di-fw-status">Updating... ${upgradeState.progress}%</div>`;
      html += `<div class="di-fw-progress-row"><div class="di-fw-progress"><div class="di-fw-progress-fill" style="width:${upgradeState.progress}%"></div></div><span class="di-fw-percent">${upgradeState.progress}%</span></div>`;
    } else {
      html += `<div class="di-fw-version"><strong>Version:</strong> ${esc(fwVersion)}</div>`;
    }

    html += `</div></div>`;

    // ---- Usage & Maintenance summary ----
    html += `<div class="di-usage-section" id="di-usage-section"><div class="di-usage-loading">Loading usage data...</div></div>`;

    // ---- All hardware modules in grid ----
    const order = ['ahb', 'n3f', 'n3s', 'ams', 'n1f', 'th', 'mc', 'smc', 'ap2'];
    const sorted = [...uniqueModules]
      .filter(m => m.module !== 'ota')
      .sort((a, b) => {
        const ai = order.indexOf(a.module.split('/')[0]);
        const bi = order.indexOf(b.module.split('/')[0]);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });

    html += `<div class="di-modules-grid">`;
    for (const mod of sorted) {
      const base = mod.module.split('/')[0];
      const friendlyName = MODULE_NAMES[base] || base.toUpperCase();
      const suffix = MODULE_SUFFIX[base] || '';
      const unitIdx = mod.module.includes('/') ? parseInt(mod.module.split('/')[1]) : -1;
      const unitLabel = unitIdx >= 0 ? ` (${unitIdx + 1})` : '';
      const title = suffix ? `${friendlyName} \u2013 ${suffix}` : `${friendlyName}${unitLabel}`;
      const icon = getModuleIcon(mod.module);

      html += `<div class="di-module-card">`;
      html += `<div class="di-module-card-icon">${icon}</div>`;
      html += `<div class="di-module-card-info">`;
      html += `<div class="di-module-name">${esc(title)}</div>`;
      html += `<div class="di-module-detail"><span class="di-detail-label">Serial:</span> ${esc(mod.sn || '--')}</div>`;
      html += `<div class="di-module-detail"><span class="di-detail-label">Version:</span> ${esc(mod.sw_ver || '--')}</div>`;
      if (mod.hw_ver && mod.hw_ver !== 'N/A') {
        html += `<div class="di-module-detail"><span class="di-detail-label">Hardware:</span> ${esc(mod.hw_ver)}</div>`;
      }
      html += `</div></div>`;
    }
    html += `</div>`;

    html += `</div>`;
    container.innerHTML = html;

    // Firmware update button handler
    const updateBtn = document.getElementById('di-update-firmware-btn');
    if (updateBtn && printerId) {
      updateBtn.onclick = async () => {
        updateBtn.disabled = true;
        updateBtn.textContent = 'Checking...';
        try {
          const res = await fetch(`/api/update/status`);
          const data = await res.json();
          if (data.updateAvailable) {
            updateBtn.textContent = 'Update available!';
          } else {
            updateBtn.textContent = 'Up to date';
          }
        } catch {
          updateBtn.textContent = 'Check failed';
        }
        setTimeout(() => {
          updateBtn.disabled = false;
          updateBtn.textContent = 'Update firmware';
        }, 3000);
      };
    }

    // Load usage & maintenance data async
    if (printerId) {
      loadUsageSection(printerId);
    }
  };

  async function loadUsageSection(printerId) {
    const section = document.getElementById('di-usage-section');
    if (!section) return;

    try {
      const [statusRes, wearRes] = await Promise.all([
        fetch(`/api/maintenance/status?printer_id=${encodeURIComponent(printerId)}`),
        fetch(`/api/wear?printer_id=${encodeURIComponent(printerId)}`)
      ]);
      const status = await statusRes.json();
      const wear = await wearRes.json().catch(() => []);

      function fmtW(g) { return g >= 1000 ? `${(g/1000).toFixed(1)} kg` : `${Math.round(g)}g`; }

      let h = '';

      // Usage stats cards
      h += `<div class="di-usage-header">Usage & Maintenance</div>`;
      h += `<div class="di-stats-row">`;
      h += `<div class="di-stat-card"><div class="di-stat-value">${status.total_print_hours || 0}h</div><div class="di-stat-label">Total Print Time</div></div>`;
      h += `<div class="di-stat-card"><div class="di-stat-value">${status.total_prints || 0}</div><div class="di-stat-label">Total Prints</div></div>`;
      h += `<div class="di-stat-card"><div class="di-stat-value">${fmtW(status.total_filament_g || 0)}</div><div class="di-stat-label">Filament Used</div></div>`;

      // Active nozzle
      if (status.active_nozzle) {
        const n = status.active_nozzle;
        const w = n.wear_estimate;
        h += `<div class="di-stat-card"><div class="di-stat-value">${n.type || 'SS'} ${n.diameter}mm</div><div class="di-stat-label">Nozzle (${w.percentage}% wear)</div></div>`;
      }
      h += `</div>`;

      // Component maintenance status
      const comps = status.components || [];
      if (comps.length) {
        h += `<div class="di-maint-grid">`;
        for (const c of comps) {
          const pct = c.percentage || 0;
          const barColor = c.overdue ? 'var(--accent-red)' : pct >= 75 ? 'var(--accent-orange)' : 'var(--accent-green)';
          const statusText = c.overdue ? 'Overdue!' : `${c.hours_since_maintenance}h / ${c.interval_hours}h`;
          const compNames = {
            nozzle: 'Nozzle', ptfe_tube: 'PTFE Tube', linear_rods: 'Linear Rods',
            carbon_rods: 'Carbon Rods', build_plate: 'Build Plate', general: 'General Service'
          };
          const label = compNames[c.component] || c.component;

          h += `<div class="di-maint-item">`;
          h += `<div class="di-maint-item-header"><span class="di-maint-comp-name">${label}</span>`;
          if (c.overdue) h += `<span class="di-maint-overdue">Overdue</span>`;
          h += `<span class="di-maint-hours">${statusText}</span></div>`;
          h += `<div class="di-maint-bar"><div class="di-maint-bar-fill" style="width:${Math.min(pct, 100)}%;background:${barColor}"></div></div>`;
          h += `</div>`;
        }
        h += `</div>`;
      }

      // Wear tracking
      const WEAR_LIMITS = {
        fan_cooling: 3000, fan_aux: 3000, fan_chamber: 3000, fan_heatbreak: 3000,
        hotend_heater: 2000, bed_heater: 5000, belts_x: 5000, belts_y: 5000,
        linear_rails: 10000, extruder_motor: 5000
      };
      const wearNames = {
        fan_cooling: 'Cooling Fan', fan_aux: 'Aux Fan', fan_chamber: 'Chamber Fan',
        fan_heatbreak: 'Heatbreak Fan', hotend_heater: 'Hotend Heater', bed_heater: 'Bed Heater',
        belts_x: 'Belt X', belts_y: 'Belt Y', linear_rails: 'Linear Rails', extruder_motor: 'Extruder Motor'
      };

      if (Array.isArray(wear) && wear.length) {
        h += `<div class="di-wear-header">Wear Tracking</div>`;
        h += `<div class="di-maint-grid">`;
        for (const w of wear) {
          const limit = WEAR_LIMITS[w.component] || 5000;
          const pct = Math.min(Math.round((w.total_hours / limit) * 100), 100);
          const barColor = pct >= 80 ? 'var(--accent-red)' : pct >= 50 ? 'var(--accent-orange)' : 'var(--accent-green)';
          const label = wearNames[w.component] || w.component;

          h += `<div class="di-maint-item">`;
          h += `<div class="di-maint-item-header"><span class="di-maint-comp-name">${label}</span>`;
          h += `<span class="di-maint-hours">${Math.round(w.total_hours)}h / ${limit}h</span></div>`;
          h += `<div class="di-maint-bar"><div class="di-maint-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>`;
          h += `</div>`;
        }
        h += `</div>`;
      }

      // Link to full maintenance panel
      h += `<a class="di-maint-link" href="#maintenance" onclick="openPanel('maintenance');return false;">View full maintenance &rarr;</a>`;

      section.innerHTML = h;
    } catch {
      section.innerHTML = '<div class="di-usage-loading" style="color:var(--text-muted)">Could not load usage data</div>';
    }
  }

  // ---- Remaining model linking functions (search, link by URL, etc.) ----

  function renderActiveModel() {
    const el = document.getElementById('mi-active-model');
    if (!el) return;

    if (!_currentModelData) {
      el.innerHTML = `<div class="mi-empty">${t('model_info.no_active_model')}</div>`;
      return;
    }

    const data = _currentModelData;
    const src = SOURCE_COLORS[data.source] || SOURCE_COLORS.makerworld;
    let html = `<div class="mi-active-card">`;

    if (data.image) {
      html += `<img class="mi-active-img" src="${esc(data.image)}" alt="" onerror="this.style.display='none'">`;
    }

    html += `<div class="mi-active-details">`;
    html += `<div class="mi-active-title">${esc(data.title || t('model_info.unknown'))}</div>`;
    if (data.designer) html += `<div class="mi-active-designer">${t('model_info.by')} ${esc(data.designer)}</div>`;
    html += `<div class="mi-active-meta">`;
    html += `<span class="mi-source-badge" style="background:${src.bg};border-color:${src.border};color:${src.text}">${src.label}</span>`;
    if (data.category) html += `<span class="mi-category-badge">${esc(data.category)}</span>`;
    if (data.downloads > 0) html += `<span>\u2B07 ${data.downloads}</span>`;
    if (data.likes > 0) html += `<span>\u2764 ${data.likes}</span>`;
    if (data.prints > 0) html += `<span>\uD83D\uDDA8 ${data.prints}</span>`;
    html += `</div>`;
    if (data.url) {
      html += `<a class="mi-active-link" href="${esc(data.url)}" target="_blank" rel="noopener">${t('model_info.view_on')} ${src.label} \u2192</a>`;
    }
    html += `</div></div>`;

    if (data.description) {
      html += `<div class="mi-description">`;
      html += `<h4 class="mi-sub-title">${t('model_info.description')}</h4>`;
      html += `<p class="mi-desc-text">${esc(data.description)}</p>`;
      html += `</div>`;
    }

    const ps = data.print_settings;
    if (ps && typeof ps === 'object' && Object.keys(ps).length) {
      html += `<div class="mi-print-settings">`;
      html += `<h4 class="mi-sub-title">${t('model_info.print_settings')}</h4>`;
      html += `<div class="mi-settings-grid">`;
      const settingLabels = {
        printer: t('model_info.ps_printer'),
        printer_model: t('model_info.ps_printer_model'),
        rafts: t('model_info.ps_rafts'),
        supports: t('model_info.ps_supports'),
        resolution: t('model_info.ps_resolution'),
        infill: t('model_info.ps_infill'),
        filament: t('model_info.ps_filament'),
        layer_height: t('model_info.ps_layer_height')
      };
      for (const [key, val] of Object.entries(ps)) {
        const label = settingLabels[key] || key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
        html += `<div class="mi-setting-row"><span class="mi-setting-label">${esc(label)}</span><span class="mi-setting-value">${esc(String(val))}</span></div>`;
      }
      html += `</div></div>`;
    }

    el.innerHTML = html;
  }

  function doSearch() {
    const input = document.getElementById('mi-search-input');
    const source = document.getElementById('mi-search-source');
    const results = document.getElementById('mi-search-results');
    if (!input || !results) return;

    const q = input.value.trim();
    if (q.length < 2) return;

    results.innerHTML = `<div class="mi-loading">${t('model_info.searching')}</div>`;

    const searchBtn = document.getElementById('mi-search-btn');
    if (searchBtn) { searchBtn.disabled = true; searchBtn.dataset.loading = 'true'; }

    fetch(`/api/model-search?q=${encodeURIComponent(q)}&source=${source.value}`)
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        if (searchBtn) { searchBtn.disabled = false; delete searchBtn.dataset.loading; }
        if (!items.length) {
          results.innerHTML = `<div class="mi-empty">${t('model_info.no_results')}</div>`;
          return;
        }
        results.innerHTML = items.map(item => renderSearchResult(item)).join('');
        results.querySelectorAll('.mi-result-link-btn').forEach(btn => {
          btn.addEventListener('click', () => linkModel(btn.dataset));
        });
      })
      .catch(() => {
        if (searchBtn) { searchBtn.disabled = false; delete searchBtn.dataset.loading; }
        results.innerHTML = `<div class="mi-empty">${t('model_info.search_error')}</div>`;
      });
  }

  function renderSearchResult(item) {
    const src = SOURCE_COLORS[item.source] || SOURCE_COLORS.makerworld;
    let html = `<div class="mi-result-card">`;
    if (item.image) {
      html += `<img class="mi-result-img" src="${esc(item.image)}" alt="" onerror="this.style.display='none'">`;
    } else {
      html += `<div class="mi-result-img-placeholder">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
      </div>`;
    }
    html += `<div class="mi-result-info">`;
    html += `<div class="mi-result-title">${esc(item.title)}</div>`;
    html += `<div class="mi-result-meta">`;
    html += `<span class="mi-source-badge" style="background:${src.bg};border-color:${src.border};color:${src.text}">${src.label}</span>`;
    if (item.designer) html += `<span>${esc(item.designer)}</span>`;
    if (item.downloads > 0) html += `<span>\u2B07 ${item.downloads}</span>`;
    if (item.likes > 0) html += `<span>\u2764 ${item.likes}</span>`;
    html += `</div></div>`;

    html += `<div class="mi-result-actions">`;
    html += `<a class="mi-action-btn mi-action-view" href="${esc(item.url)}" target="_blank" rel="noopener" title="${t('model_info.view_on')} ${src.label}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>`;
    const printerId = window.printerState?.getActivePrinterId() || '';
    const filename = _currentFilename;
    if (printerId && filename) {
      html += `<button class="mi-action-btn mi-action-link mi-result-link-btn" data-ripple `
        + `data-source="${esc(item.source)}" `
        + `data-source_id="${esc(item.source_id)}" `
        + `data-title="${esc(item.title)}" `
        + `data-url="${esc(item.url)}" `
        + `data-image="${esc(item.image || '')}" `
        + `data-designer="${esc(item.designer || '')}" `
        + `title="${t('model_info.link')}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
      </button>`;
    }
    html += `</div></div>`;
    return html;
  }

  function linkByUrl() {
    const input = document.getElementById('mi-url-input');
    const status = document.getElementById('mi-url-status');
    if (!input || !status) return;

    const url = input.value.trim();
    if (!url) return;

    const printerId = window.printerState?.getActivePrinterId();
    if (!printerId || !_currentFilename) {
      status.innerHTML = `<div class="mi-empty">${t('model_info.no_active_model')}</div>`;
      return;
    }

    let source = null, sourceId = null;
    const mwMatch = url.match(/makerworld\.com\/.*?models?\/(\d+)/);
    const prMatch = url.match(/printables\.com\/model\/(\d+)/);
    const tvMatch = url.match(/thingiverse\.com\/thing:(\d+)/);

    if (mwMatch) { source = 'makerworld'; sourceId = mwMatch[1]; }
    else if (prMatch) { source = 'printables'; sourceId = prMatch[1]; }
    else if (tvMatch) { source = 'thingiverse'; sourceId = tvMatch[1]; }
    else {
      status.innerHTML = `<div class="mi-empty">${t('model_info.url_invalid')}</div>`;
      return;
    }

    status.innerHTML = `<div class="mi-loading">${t('model_info.loading')}</div>`;

    const apiMap = {
      makerworld: (id) => `/api/makerworld/${id}`,
      printables: (id) => `/api/printables/${id}`,
      thingiverse: (id) => `/api/thingiverse/${id}`
    };

    fetch(apiMap[source](sourceId))
      .then(r => r.ok ? r.json() : { url, source, fallback: true })
      .then(fullData => {
        const body = {
          filename: _currentFilename,
          source,
          source_id: sourceId,
          title: fullData.title || `${SOURCE_COLORS[source].label} #${sourceId}`,
          url: fullData.url || url,
          image: fullData.image || null,
          designer: fullData.designer || null,
          description: fullData.description || null,
          category: fullData.category || null,
          print_settings: fullData.print_settings || null
        };

        return fetch(`/api/model-link/${encodeURIComponent(printerId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).then(r => r.ok ? r.json() : null).then(result => {
          if (result?.ok) {
            _currentModelData = { ...body };
            renderStrip(document.getElementById('model-info'));
            renderActiveModel();
            loadRecentLinks();
            input.value = '';
            const src = SOURCE_COLORS[source];
            status.innerHTML = `<div class="mi-url-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>${t('model_info.linked_success')}</span>
            </div>`;
          }
        });
      })
      .catch(() => {
        status.innerHTML = `<div class="mi-empty">${t('model_info.search_error')}</div>`;
      });
  }

  function linkModel(dataset) {
    const printerId = window.printerState?.getActivePrinterId();
    if (!printerId || !_currentFilename) return;

    const apiMap = {
      makerworld: (id) => `/api/makerworld/${id}`,
      printables: (id) => `/api/printables/${id}`,
      thingiverse: (id) => `/api/thingiverse/${id}`
    };
    const detailUrl = apiMap[dataset.source]?.(dataset.source_id);

    const saveLink = (fullData) => {
      const body = {
        filename: _currentFilename,
        source: dataset.source,
        source_id: dataset.source_id,
        title: fullData.title || dataset.title,
        url: fullData.url || dataset.url,
        image: fullData.image || dataset.image,
        designer: fullData.designer || dataset.designer,
        description: fullData.description || null,
        category: fullData.category || null,
        print_settings: fullData.print_settings || null
      };

      fetch(`/api/model-link/${encodeURIComponent(printerId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      .then(r => r.ok ? r.json() : null)
      .then(result => {
        if (result?.ok) {
          _currentModelData = { ...body, source: body.source };
          renderStrip(document.getElementById('model-info'));
          renderActiveModel();
          loadRecentLinks();
        }
      });
    };

    if (detailUrl) {
      fetch(detailUrl)
        .then(r => r.ok ? r.json() : {})
        .then(saveLink)
        .catch(() => saveLink(dataset));
    } else {
      saveLink(dataset);
    }
  }

  function loadRecentLinks() {
    const el = document.getElementById('mi-recent-links');
    if (!el) return;

    fetch('/api/model-links/recent')
      .then(r => r.ok ? r.json() : [])
      .then(links => {
        if (!links.length) {
          el.innerHTML = `<div class="mi-empty">${t('model_info.no_recent')}</div>`;
          return;
        }
        el.innerHTML = links.map(link => {
          const src = SOURCE_COLORS[link.source] || SOURCE_COLORS.makerworld;
          return `<div class="mi-recent-card">
            <div class="mi-recent-card-accent" style="background:${src.text}"></div>
            <div class="mi-recent-card-body">
              <div class="mi-recent-card-top">
                <span class="mi-source-badge mi-source-badge-sm" style="background:${src.bg};border-color:${src.border};color:${src.text}">${src.label}</span>
                <a class="mi-recent-card-title" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.title || link.source_id)}</a>
              </div>
              <div class="mi-recent-card-meta">
                <span class="mi-recent-file">${esc(link.filename)}</span>
              </div>
            </div>
          </div>`;
        }).join('');
      })
      .catch(() => {
        el.innerHTML = `<div class="mi-empty">${t('model_info.no_recent')}</div>`;
      });
  }
})();
