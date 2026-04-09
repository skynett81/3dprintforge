/**
 * Panel Data Injector — enriches existing panels with printer-specific data.
 * Injects extra content into: diagnostics, maintenance, fleet, errors,
 * protection, queue, library, filament panels.
 *
 * Called when panels load and on state updates.
 */
(function() {
  'use strict';

  /**
   * Inject printer data into the diagnostics panel
   */
  window.injectDiagnosticsData = function(data) {
    const container = document.getElementById('overlay-panel-body');
    if (!container || window._activePanel !== 'diagnostics') return;

    let existing = document.getElementById('injected-diagnostics');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'injected-diagnostics';
      existing.style.cssText = 'margin-bottom:14px';
      container.insertBefore(existing, container.firstChild);
    }

    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">';

    // System temperatures
    if (data._system_temps) {
      for (const [key, val] of Object.entries(data._system_temps)) {
        const label = key === 'mcu_temp' ? 'MCU Temperature' : key === 'raspberry_pi' ? 'Host CPU' : key;
        const color = val.temp > 70 ? 'var(--accent-red)' : val.temp > 55 ? 'var(--accent-orange)' : 'var(--accent-green)';
        html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">${label}</div><div style="font-size:1.5rem;font-weight:700;color:${color}">${val.temp}°C</div></div>`;
      }
    }

    // TMC drivers
    if (data._tmc) {
      for (const [name, val] of Object.entries(data._tmc)) {
        html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">TMC ${name}</div>
          ${val.temperature ? `<div style="font-size:1.2rem;font-weight:600">${Math.round(val.temperature)}°C</div>` : ''}
          ${val.run_current ? `<div style="font-size:0.7rem">Run: ${val.run_current}A</div>` : ''}
        </div>`;
      }
    }

    // Input shaper
    if (data._input_shaper) {
      const is = data._input_shaper;
      html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">Input Shaper</div>
        <div style="font-size:0.82rem">X: ${is.shaperTypeX} @ ${is.shaperFreqX?.toFixed(1)}Hz</div>
        <div style="font-size:0.82rem">Y: ${is.shaperTypeY} @ ${is.shaperFreqY?.toFixed(1)}Hz</div>
      </div>`;
    }

    // Pressure advance
    if (data._pressure_advance !== undefined) {
      html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">Pressure Advance</div>
        <div style="font-size:1.5rem;font-weight:700">${data._pressure_advance}</div>
        ${data._smooth_time ? `<div style="font-size:0.7rem">Smooth: ${data._smooth_time}s</div>` : ''}
      </div>`;
    }

    // Bed mesh variance
    if (data._bed_mesh?.meshMatrix?.length) {
      let min = Infinity, max = -Infinity;
      for (const row of data._bed_mesh.meshMatrix) for (const v of row) { if (v < min) min = v; if (v > max) max = v; }
      const variance = Math.round((max - min) * 1000) / 1000;
      const color = variance < 0.1 ? 'var(--accent-green)' : variance < 0.3 ? 'var(--accent-orange)' : 'var(--accent-red)';
      html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">Bed Mesh Variance</div>
        <div style="font-size:1.5rem;font-weight:700;color:${color}">${variance}mm</div>
        <div style="font-size:0.7rem">${data._bed_mesh.meshMatrix.length}×${data._bed_mesh.meshMatrix[0]?.length} points</div>
      </div>`;
    }

    // MCU firmware
    if (data._mcu?.mcuVersion) {
      html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">MCU Firmware</div>
        <div style="font-size:0.78rem;font-weight:600;word-break:break-all">${data._mcu.mcuVersion}</div>
      </div>`;
    }

    // Storage
    if (data._storage_state !== undefined) {
      html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">Storage</div>
        <div style="font-size:0.82rem">State: ${data._storage_state}</div>
      </div>`;
    }

    // WiFi
    if (data._wifi_rssi) {
      const rssi = parseInt(data._wifi_rssi) || 0;
      const quality = rssi > -50 ? 'Excellent' : rssi > -60 ? 'Good' : rssi > -70 ? 'Fair' : 'Weak';
      html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">WiFi Signal</div>
        <div style="font-size:1.2rem;font-weight:700">${rssi} dBm</div>
        <div style="font-size:0.7rem">${quality}</div>
      </div>`;
    }

    // Power status (Snapmaker)
    if (data._sm_power) {
      const color = data._sm_power.powerLoss ? 'var(--accent-red)' : 'var(--accent-green)';
      html += `<div class="settings-card" style="padding:12px"><div style="font-size:0.72rem;color:var(--text-muted)">Power</div>
        <div style="font-size:0.82rem;color:${color}">${data._sm_power.powerLoss ? '⚠ Power Loss!' : '✓ Stable'}</div>
        ${data._sm_inputVoltage ? `<div style="font-size:0.7rem">Input: ${data._sm_inputVoltage}</div>` : ''}
      </div>`;
    }

    html += '</div>';
    existing.innerHTML = html;
  };

  /**
   * Inject data into maintenance panel
   */
  window.injectMaintenanceData = function(data) {
    const container = document.getElementById('overlay-panel-body');
    if (!container || window._activePanel !== 'maintenance') return;

    let existing = document.getElementById('injected-maintenance');
    if (existing) return; // Only inject once
    existing = document.createElement('div');
    existing.id = 'injected-maintenance';
    existing.style.cssText = 'margin-bottom:14px';

    let html = '';

    // Bambu maintenance data from firmware
    if (data._maintenance_data) {
      html += `<div class="settings-card" style="margin-bottom:10px"><div class="card-title">Firmware Maintenance Data</div>
        <pre style="font-size:0.7rem;color:var(--text-muted);max-height:100px;overflow:auto">${JSON.stringify(data._maintenance_data, null, 2)}</pre>
      </div>`;
    }

    // Nozzle info
    if (data._nozzle_type !== undefined || data._nozzle_diameter !== undefined) {
      html += `<div class="alert alert-info" style="font-size:0.75rem">
        Nozzle: ${data._nozzle_type || '?'} — ⌀${data._nozzle_diameter || '?'}mm
      </div>`;
    }

    // Purifier filter life
    if (data._purifier || data._sm_purifier) {
      const pur = data._purifier || data._sm_purifier;
      const hours = pur.work_time ? Math.round(pur.work_time / 3600) : 0;
      html += `<div class="alert ${hours > 450 ? 'alert-warning' : 'alert-info'}" style="font-size:0.75rem">
        Air Purifier: ${hours}h / 500h filter life ${hours > 450 ? '— ⚠ Replace soon' : ''}
      </div>`;
    }

    if (html) {
      existing.innerHTML = html;
      container.insertBefore(existing, container.firstChild);
    }
  };

  /**
   * Inject data into fleet dashboard
   */
  window.injectFleetData = function(printers, states) {
    const container = document.getElementById('overlay-panel-body');
    if (!container || window._activePanel !== 'fleet') return;

    let existing = document.getElementById('injected-fleet');
    if (existing) return;
    existing = document.createElement('div');
    existing.id = 'injected-fleet';
    existing.style.cssText = 'margin-bottom:14px';

    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px">';

    for (const [id, state] of Object.entries(states)) {
      const name = printers?.find(p => p.id === id)?.name || id;
      const errors = state._active_errors || 0;
      const fwVer = state._mcu?.mcuVersion || state._firmware_name || '';
      const meshVar = _calcMeshVariance(state._bed_mesh);
      const wifi = state._wifi_rssi ? `${state._wifi_rssi}dBm` : '';

      html += `<div class="settings-card" style="padding:10px">
        <div style="font-size:0.85rem;font-weight:600;margin-bottom:6px">${name}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:0.68rem">
          ${errors > 0 ? `<span style="color:var(--accent-red)">⚠ ${errors} errors</span>` : '<span style="color:var(--accent-green)">✓ No errors</span>'}
          ${meshVar !== null ? `<span>Mesh: ${meshVar}mm</span>` : ''}
          ${wifi ? `<span>WiFi: ${wifi}</span>` : ''}
          ${fwVer ? `<span class="text-muted">FW: ${fwVer.slice(0, 20)}</span>` : ''}
        </div>
      </div>`;
    }

    html += '</div>';
    existing.innerHTML = html;
    container.insertBefore(existing, container.firstChild);
  };

  function _calcMeshVariance(mesh) {
    if (!mesh?.meshMatrix?.length) return null;
    let min = Infinity, max = -Infinity;
    for (const row of mesh.meshMatrix) for (const v of row) { if (v < min) min = v; if (v > max) max = v; }
    return Math.round((max - min) * 1000) / 1000;
  }

  /**
   * Inject error count into errors panel header
   */
  window.injectErrorsData = function(data) {
    if (window._activePanel !== 'errors') return;
    const title = document.getElementById('overlay-panel-title');
    if (!title) return;

    const hmsCount = data.hms?.length || 0;
    const tmcErrors = data._tmc ? Object.values(data._tmc).filter(t => t.error).length : 0;
    if (hmsCount + tmcErrors > 0) {
      const badge = document.getElementById('error-count-badge') || document.createElement('span');
      badge.id = 'error-count-badge';
      badge.style.cssText = 'font-size:0.7rem;padding:2px 8px;border-radius:8px;background:var(--accent-red);color:#fff;margin-left:8px';
      badge.textContent = hmsCount + tmcErrors;
      if (!badge.parentNode) title.appendChild(badge);
    }
  };

  /**
   * Inject into filament panel — ERCF gate colors, NFC sync indicator
   */
  window.injectFilamentData = function(data) {
    if (window._activePanel !== 'filament') return;
    const container = document.getElementById('overlay-panel-body');
    if (!container) return;

    let existing = document.getElementById('injected-filament');
    if (existing) return;

    let html = '';

    // ERCF gate colors
    if (data._ercf?.gateColor?.length) {
      html += '<div style="display:flex;gap:3px;margin-bottom:8px">';
      for (let i = 0; i < data._ercf.numGates; i++) {
        const color = data._ercf.gateColor[i] || '#888';
        html += `<div style="width:20px;height:20px;border-radius:50%;background:${color};border:2px solid ${data._ercf.gate === i ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'}" title="Gate ${i}"></div>`;
      }
      html += '</div>';
    }

    // NFC sync indicator
    if (data._sm_filament?.length) {
      const synced = data._sm_filament.filter(f => f.sku).length;
      html += `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:8px">
        NFC Filament: ${synced}/${data._sm_filament.length} spools synced to inventory
      </div>`;
    }

    if (html) {
      existing = document.createElement('div');
      existing.id = 'injected-filament';
      existing.innerHTML = html;
      container.insertBefore(existing, container.firstChild);
    }
  };

  /**
   * Inject protection data — filament sensor + entangle
   */
  window.injectProtectionData = function(data) {
    if (window._activePanel !== 'protection') return;
    const container = document.getElementById('overlay-panel-body');
    if (!container) return;

    let existing = document.getElementById('injected-protection');
    if (existing) return;

    let html = '';

    // Filament sensor
    if (data._filament_sensor) {
      const fs = data._filament_sensor;
      html += `<div class="alert ${fs.detected ? 'alert-success' : 'alert-danger'}" style="font-size:0.75rem;margin-bottom:8px">
        Filament Sensor: ${fs.detected ? '✓ Filament detected' : '⚠ No filament detected!'}
        ${fs.enabled ? '' : ' (disabled)'}
      </div>`;
    }

    // Entangle detection
    if (data._sm_entangle) {
      const channels = Object.entries(data._sm_entangle);
      const maxFactor = Math.max(...channels.map(([, v]) => v.detectFactor || 0));
      if (maxFactor > 0.3) {
        html += `<div class="alert alert-warning" style="font-size:0.75rem;margin-bottom:8px">
          Entangle Risk: ${Math.round(maxFactor * 100)}% on ${channels.filter(([, v]) => v.detectFactor > 0.3).length} channels
        </div>`;
      }
    }

    if (html) {
      existing = document.createElement('div');
      existing.id = 'injected-protection';
      existing.innerHTML = html;
      container.insertBefore(existing, container.firstChild);
    }
  };

  // ══════════════════════════════════════════
  // REMAINING 20 PANELS
  // ══════════════════════════════════════════

  function _inject(id, html) {
    const container = document.getElementById('overlay-panel-body');
    if (!container) return;
    let el = document.getElementById(id);
    if (el) { el.innerHTML = html; return; }
    el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'margin-bottom:10px';
    el.innerHTML = html;
    container.insertBefore(el, container.firstChild);
  }

  function _badge(label, value, color) {
    return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:6px;background:var(--bg-inset);font-size:0.68rem;margin-right:4px"><span style="color:${color || 'var(--text-muted)'}">${label}:</span> <strong>${value}</strong></span>`;
  }

  // History: temps + fan + sensor events per print
  function _injectHistory(data) {
    let html = '';
    if (data.nozzle_temper) html += _badge('Nozzle', data.nozzle_temper + '°C', '#ff6b6b');
    if (data.bed_temper) html += _badge('Bed', data.bed_temper + '°C', '#4ecdc4');
    if (data._filament_sensor) html += _badge('Sensor', data._filament_sensor.detected ? '✓' : '⚠', data._filament_sensor.detected ? 'var(--accent-green)' : 'var(--accent-red)');
    if (data._speed_level) html += _badge('Speed', ['','Silent','Normal','Sport','Ludicrous'][data._speed_level] || '', '');
    if (html) _inject('injected-history', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Analysis: bed mesh trend, TMC trends
  function _injectAnalysis(data) {
    let html = '';
    if (data._bed_mesh?.meshMatrix?.length) {
      let min = Infinity, max = -Infinity;
      for (const r of data._bed_mesh.meshMatrix) for (const v of r) { if (v < min) min = v; if (v > max) max = v; }
      const v = Math.round((max - min) * 1000) / 1000;
      html += _badge('Bed Mesh', v + 'mm', v < 0.1 ? 'var(--accent-green)' : 'var(--accent-orange)');
    }
    if (data._input_shaper) {
      html += _badge('Shaper X', (data._input_shaper.shaperFreqX?.toFixed(0) || '?') + 'Hz', '');
      html += _badge('Shaper Y', (data._input_shaper.shaperFreqY?.toFixed(0) || '?') + 'Hz', '');
    }
    if (data._pressure_advance !== undefined) html += _badge('PA', data._pressure_advance, '');
    if (html) _inject('injected-analysis', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Queue: build volume + filament sensor + temp ready
  function _injectQueue(data) {
    let html = '';
    const vol = data._buildVolume || data._printerProfile?.volume;
    if (vol) {
      const w = vol.width || vol.x || 0, d = vol.depth || vol.y || 0, h = vol.height || vol.z || 0;
      if (w) html += _badge('Build Vol', `${w}×${d}×${h}mm`, '');
    }
    if (data._filament_sensor) html += _badge('Filament', data._filament_sensor.detected ? 'Ready' : 'Missing!', data._filament_sensor.detected ? 'var(--accent-green)' : 'var(--accent-red)');
    if (data.nozzle_temper > 50) html += _badge('Nozzle', data.nozzle_temper + '°C', data.nozzle_temper > 180 ? 'var(--accent-green)' : 'var(--accent-orange)');
    if (html) _inject('injected-queue', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Scheduler: printer capability per job
  function _injectScheduler(data) {
    let html = '';
    if (data._heatedBed !== undefined) html += _badge('Heated Bed', data._heatedBed ? '✓' : '✗', data._heatedBed ? 'var(--accent-green)' : 'var(--accent-red)');
    if (data._heatedChamber !== undefined) html += _badge('Chamber', data._heatedChamber ? '✓' : '✗', data._heatedChamber ? 'var(--accent-green)' : 'var(--text-muted)');
    if (data._extruderCount > 1) html += _badge('Extruders', data._extruderCount, '');
    if (data._ercf) html += _badge('ERCF', data._ercf.numGates + ' gates', 'var(--accent-cyan)');
    if (html) _inject('injected-scheduler', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Library: printer type for send-to-printer
  function _injectLibrary(data) {
    const brand = data._detected_brand || '';
    if (!brand && !data.gcode_state) return;
    let html = _badge('Printer', brand || 'Connected', 'var(--accent-green)');
    if (data.gcode_state === 'RUNNING') html += _badge('Status', 'Printing', 'var(--accent-orange)');
    else if (data.gcode_state === 'IDLE') html += _badge('Status', 'Ready', 'var(--accent-green)');
    _inject('injected-library', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Cost Estimator: real power data, nozzle wear, printer-specific costs
  function _injectCostEstimator(data) {
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:10px">';
    // Real power measurement (U1 ADC)
    if (data._sm_current?.heater_bed) {
      html += `<div class="settings-card" style="padding:8px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Bed Power</div><div style="font-size:1rem;font-weight:700">${data._sm_current.heater_bed.current}A</div></div>`;
    }
    if (data._sm_current?.extruder) {
      html += `<div class="settings-card" style="padding:8px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Extruder Power</div><div style="font-size:1rem;font-weight:700">${data._sm_current.extruder.current}A</div></div>`;
    }
    // Nozzle wear estimate
    if (data._nozzle_type || data.nozzle_type) {
      const type = data._nozzle_type || data.nozzle_type || '';
      const diam = data._nozzle_diameter || data.nozzle_diameter || 0.4;
      const wearRate = type.includes('hardened') || type.includes('steel') ? 'Low (hardened)' : 'Normal (brass)';
      html += `<div class="settings-card" style="padding:8px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Nozzle ${diam}mm</div><div style="font-size:0.75rem;font-weight:600">${type || 'Standard'}</div><div style="font-size:0.6rem;color:var(--text-muted)">${wearRate}</div></div>`;
    }
    // Voltage for power calc
    if (data._sm_inputVoltage) {
      html += `<div class="settings-card" style="padding:8px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Input</div><div style="font-size:1rem;font-weight:700">${data._sm_inputVoltage}</div></div>`;
    }
    html += '</div>';
    _inject('injected-costestimator', html);
  }

  // Achievements: printer milestones
  function _injectAchievements(data) {
    let html = '';
    if (data._bed_mesh) html += _badge('Bed Meshes', '✓', 'var(--accent-green)');
    if (data._ercf) html += _badge('ERCF', data._ercf.numGates + ' gates', 'var(--accent-cyan)');
    if (data._sm_filament?.length > 2) html += _badge('NFC Spools', data._sm_filament.length, 'var(--accent-green)');
    if (html) _inject('injected-achievements', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Calendar: printer availability
  function _injectCalendar(data) {
    const state = data.gcode_state || 'OFFLINE';
    const color = state === 'IDLE' ? 'var(--accent-green)' : state === 'RUNNING' ? 'var(--accent-blue)' : state === 'PAUSE' ? 'var(--accent-orange)' : 'var(--accent-red)';
    _inject('injected-calendar', `<div style="margin-bottom:8px">${_badge('Printer', state, color)}</div>`);
  }

  // CRM: printer capability per order
  function _injectCrm(data) {
    let html = '';
    const vol = data._buildVolume || data._printerProfile?.volume;
    if (vol) {
      const w = vol.width || vol.x || 0;
      if (w) html += _badge('Max Size', `${w}×${vol.depth || vol.y}×${vol.height || vol.z}mm`, '');
    }
    if (data._extruderCount > 1) html += _badge('Multi-Color', data._extruderCount + ' tools', 'var(--accent-cyan)');
    if (html) _inject('injected-crm', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Knowledge: printer-specific tips
  function _injectKnowledge(data) {
    const brand = data._detected_brand || '';
    if (!brand) return;
    let tip = '';
    if (brand === 'Voron') tip = 'Tip: Run SHAPER_CALIBRATE after building for best print quality.';
    else if (brand === 'Creality') tip = 'Tip: K1 series benefits from input shaper tuning via Sonic Pad.';
    else if (brand === 'QIDI') tip = 'Tip: Use chamber heater for ABS/ASA prints on QIDI X-Max.';
    if (tip) _inject('injected-knowledge', `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:8px">${tip}</div>`);
  }

  // Profiles: per-printer capabilities
  function _injectProfiles(data) {
    let html = '';
    if (data._printerProfile?.name) html += _badge('Profile', data._printerProfile.name, '');
    if (data._extruderCount) html += _badge('Extruders', data._extruderCount, '');
    if (data._heatedBed !== undefined) html += _badge('Heated Bed', data._heatedBed ? '✓' : '✗', '');
    if (data._heatedChamber) html += _badge('Chamber', '✓', 'var(--accent-green)');
    if (html) _inject('injected-profiles', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Labels: printer info for QR
  function _injectLabels(data) {
    let html = '';
    if (data._nozzle_diameter) html += _badge('Nozzle', data._nozzle_diameter + 'mm', '');
    if (data._detected_brand) html += _badge('Brand', data._detected_brand, '');
    if (html) _inject('injected-labels', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Logs: MQTT debug + terminal
  function _injectLogs(data) {
    if (!data._terminalLog?.length) return;
    _inject('injected-logs', `<div style="background:#0d1117;border-radius:6px;padding:6px 8px;font-family:monospace;font-size:0.65rem;color:#8b949e;max-height:120px;overflow-y:auto;margin-bottom:8px">
      ${data._terminalLog.map(l => `<div>${l}</div>`).join('')}
    </div>`);
  }

  // Widgets: mini live data widgets
  function _injectWidgets(data) {
    let html = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">';
    if (data.nozzle_temper) html += `<div class="settings-card" style="padding:8px;min-width:80px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Nozzle</div><div style="font-size:1.2rem;font-weight:700;color:#ff6b6b">${data.nozzle_temper}°</div></div>`;
    if (data.bed_temper) html += `<div class="settings-card" style="padding:8px;min-width:80px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Bed</div><div style="font-size:1.2rem;font-weight:700;color:#4ecdc4">${data.bed_temper}°</div></div>`;
    if (data.mc_percent !== undefined) html += `<div class="settings-card" style="padding:8px;min-width:80px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Progress</div><div style="font-size:1.2rem;font-weight:700">${data.mc_percent}%</div></div>`;
    if (data.spd_mag) html += `<div class="settings-card" style="padding:8px;min-width:80px;text-align:center"><div style="font-size:0.6rem;color:var(--text-muted)">Speed</div><div style="font-size:1.2rem;font-weight:700">${data.spd_mag}%</div></div>`;
    html += '</div>';
    _inject('injected-widgets', html);
  }

  // Screenshots: camera availability
  function _injectScreenshots(data) {
    if (!data._camera_state && !data._brand_camera_confirmed) return;
    _inject('injected-screenshots', `<div style="margin-bottom:8px">${_badge('Camera', data._camera_state?.resolution || 'Available', 'var(--accent-green)')} ${data._camera_state?.recording ? _badge('Status', '● Recording', 'var(--accent-red)') : ''}</div>`);
  }

  // Filament Analytics: NFC trends, ERCF usage
  function _injectFilamentAnalytics(data) {
    let html = '';
    if (data._sm_filament?.length) html += _badge('NFC Spools', data._sm_filament.length + ' detected', 'var(--accent-green)');
    if (data._ercf) html += _badge('ERCF Gates', data._ercf.numGates, 'var(--accent-cyan)');
    if (data._afc) html += _badge('AFC Lanes', data._afc.lanes?.length || 0, 'var(--accent-cyan)');
    if (html) _inject('injected-filamentanalytics', `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${html}</div>`);
  }

  // Material Recommendations: printer-specific
  function _injectMaterialRec(data) {
    let tips = [];
    if (data._nozzle_type === 'hardened_steel') tips.push('Hardened steel nozzle detected — CF/GF materials compatible');
    if (data._heatedChamber) tips.push('Heated chamber available — ABS/ASA/PA recommended');
    if (data._nozzle_diameter && data._nozzle_diameter !== 0.4) tips.push(`Non-standard nozzle: ${data._nozzle_diameter}mm — adjust line width`);
    if (data._detected_brand === 'Voron' && data._nevermore) tips.push('Nevermore filter active — safe for ABS/ASA fumes');
    if (tips.length) _inject('injected-materialrec', tips.map(t => `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:4px">${t}</div>`).join(''));
  }

  // Plugins: OctoPrint/Moonraker plugins
  function _injectPlugins(data) {
    let html = '';
    if (data._installedPlugins?.length) {
      html += `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:8px">OctoPrint: ${data._installedPlugins.length} plugins installed</div>`;
    }
    if (data._brand_ratos_objects?.length) {
      html += `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:8px">RatOS: ${data._brand_ratos_objects.length} custom objects detected</div>`;
    }
    if (data._modules?.length) {
      html += `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:8px">SACP Modules: ${data._modules.map(m => m.name).join(', ')}</div>`;
    }
    if (html) _inject('injected-plugins', html);
  }

  // Error Analysis: comprehensive for ALL printer types
  function _injectErrorAnalysis(data) {
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:10px">';
    // HMS errors (Bambu)
    if (data.hms?.length) {
      html += `<div class="settings-card" style="padding:8px"><div style="font-size:0.65rem;color:var(--text-muted)">HMS Errors</div>
        <div style="font-size:1.2rem;font-weight:700;color:var(--accent-red)">${data.hms.length}</div>
        <div style="font-size:0.6rem">${data.hms.map(h => `Code: 0x${(h.attr || 0).toString(16)}`).slice(0, 3).join(', ')}</div>
      </div>`;
    }
    // TMC driver issues (Klipper)
    if (data._tmc) {
      const drivers = Object.entries(data._tmc);
      const hot = drivers.filter(([, v]) => v.temperature > 80);
      html += `<div class="settings-card" style="padding:8px"><div style="font-size:0.65rem;color:var(--text-muted)">TMC Drivers</div>
        <div style="font-size:0.82rem">${drivers.map(([n, v]) => `${n}: ${v.temperature ? Math.round(v.temperature) + '°C' : '?'}`).join(', ')}</div>
        ${hot.length > 0 ? `<div style="font-size:0.65rem;color:var(--accent-red)">⚠ ${hot.length} driver(s) overheating</div>` : ''}
      </div>`;
    }
    // Defect detection (Snapmaker U1)
    if (data._sm_defect) {
      const d = data._sm_defect;
      html += `<div class="settings-card" style="padding:8px"><div style="font-size:0.65rem;color:var(--text-muted)">AI Defect Detection</div>
        <div style="font-size:0.82rem">${d.enabled ? 'Active' : 'Disabled'}</div>
        ${d.noodle?.probability > 0.3 ? `<div style="font-size:0.65rem;color:var(--accent-orange)">Spaghetti: ${Math.round(d.noodle.probability * 100)}%</div>` : ''}
      </div>`;
    }
    // Active errors
    if (data._active_errors > 0) {
      html += `<div class="settings-card" style="padding:8px"><div style="font-size:0.65rem;color:var(--text-muted)">Active Errors</div>
        <div style="font-size:1.2rem;font-weight:700;color:var(--accent-red)">${data._active_errors}</div>
      </div>`;
    }
    // Filament sensor (all Klipper)
    if (data._filament_sensor && !data._filament_sensor.detected) {
      html += `<div class="settings-card" style="padding:8px;border-left:3px solid var(--accent-red)"><div style="font-size:0.65rem;color:var(--accent-red)">⚠ Filament Not Detected</div></div>`;
    }
    // Power loss (Snapmaker)
    if (data._sm_power?.powerLoss) {
      html += `<div class="settings-card" style="padding:8px;border-left:3px solid var(--accent-red)"><div style="font-size:0.65rem;color:var(--accent-red)">⚠ Power Loss Detected</div></div>`;
    }
    html += '</div>';
    _inject('injected-erroranalysis', html);
  }

  // Wear Prediction: TMC hours, purifier, nozzle for ALL types
  function _injectWearPrediction(data) {
    let html = '';
    // Purifier filter
    if (data._purifier?.work_time || data._sm_purifier) {
      const hours = Math.round((data._purifier?.work_time || 0) / 3600);
      const remaining = Math.max(0, 500 - hours);
      html += `<div class="alert ${remaining < 50 ? 'alert-warning' : 'alert-info'}" style="font-size:0.72rem;margin-bottom:6px">
        Purifier filter: ${hours}h used, ~${remaining}h remaining ${remaining < 50 ? '— replace soon' : ''}
      </div>`;
    }
    // TMC driver wear
    if (data._tmc) {
      const hotDrivers = Object.entries(data._tmc).filter(([, v]) => v.temperature > 60);
      if (hotDrivers.length) {
        html += `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:6px">
          TMC drivers running warm: ${hotDrivers.map(([n, v]) => `${n} (${Math.round(v.temperature)}°C)`).join(', ')}
        </div>`;
      }
    }
    // Nozzle wear
    if (data._nozzle_type) {
      const type = data._nozzle_type;
      const lifespan = type.includes('hardened') || type.includes('steel') ? '2000+ hours' : '500-800 hours (brass)';
      html += `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:6px">
        Nozzle ${data._nozzle_diameter || '0.4'}mm ${type}: expected lifespan ${lifespan}
      </div>`;
    }
    if (html) _inject('injected-wearprediction', html);
  }

  // Onboarding: printer-specific tips
  function _injectOnboarding(data) {
    const pt = typeof getPrinterType === 'function' ? getPrinterType(null, data) : {};
    const tips = [];

    if (pt.isBambu) {
      tips.push({ icon: '🔗', text: 'Connect Bambu Cloud for print history sync and MakerWorld models', link: '#settings' });
      if (pt.hasAms) tips.push({ icon: '🎨', text: 'AMS detected — filament colors sync automatically to inventory' });
      tips.push({ icon: '📷', text: 'Camera streams via RTSP — adjust resolution in Settings → Printers' });
    }
    if (pt.isMoonraker) {
      tips.push({ icon: '📐', text: 'Run BED_MESH_CALIBRATE for bed mesh heatmap visualization' });
      tips.push({ icon: '📊', text: 'Run SHAPER_CALIBRATE for input shaper frequency tuning' });
      if (pt.hasFilamentSensor) tips.push({ icon: '🧵', text: 'Filament runout sensor active — alerts will show during print' });
      if (data._detected_brand === 'Voron') tips.push({ icon: '🌀', text: 'Voron detected — QGL, Nevermore and ERCF status shown in Controls' });
      if (data._detected_brand === 'Creality') tips.push({ icon: '📸', text: 'Creality K1 camera detected on port 4408' });
    }
    if (pt.isOctoPrint) {
      tips.push({ icon: '🔌', text: 'Install PSU Control plugin for power on/off from dashboard' });
      tips.push({ icon: '🧵', text: 'Install Filament Manager plugin for spool tracking integration' });
      tips.push({ icon: '📐', text: 'Install Bed Level Visualizer for mesh heatmap' });
    }
    if (pt.isPrusaLink) {
      if (pt.hasMmu) tips.push({ icon: '🎨', text: 'MMU detected — slot status shown in filament panel' });
      tips.push({ icon: '☁️', text: 'Enable PrusaConnect in Settings for cloud monitoring' });
    }
    if (pt.isSacp) {
      tips.push({ icon: '🔧', text: 'Installed modules detected automatically — laser/CNC controls appear when relevant module is active' });
      if (pt.isSnapmaker) tips.push({ icon: '📡', text: 'NFC filament data syncs to inventory automatically' });
    }

    if (tips.length === 0) return;
    let html = '<div style="margin-bottom:10px">';
    html += '<div style="font-size:0.82rem;font-weight:600;margin-bottom:6px">Getting Started with ' + (pt.brand || 'Your Printer') + '</div>';
    for (const tip of tips) {
      html += `<div style="display:flex;gap:6px;padding:4px 0;font-size:0.72rem;align-items:flex-start">
        <span style="flex-shrink:0">${tip.icon}</span>
        <span>${tip.text}${tip.link ? ` <a href="${tip.link}" style="color:var(--accent-green)">→ Open</a>` : ''}</span>
      </div>`;
    }
    html += '</div>';
    _inject('injected-onboarding', html);
  }

  // Backup: printer config reminder
  function _injectBackup(data) {
    const printerCount = Object.keys(window.printerState?.printers || {}).length;
    if (printerCount > 0) {
      _inject('injected-backup', `<div class="alert alert-info" style="font-size:0.72rem;margin-bottom:8px">
        ${printerCount} printer(s) configured — backup includes all printer settings, filament profiles, and calibration data.
      </div>`);
    }
  }

  /**
   * Master injection — call from updateDashboard for active panel enrichment
   */
  window.injectPanelData = function(data) {
    const panel = window._activePanel;
    if (!panel) return;

    switch (panel) {
      case 'diagnostics': injectDiagnosticsData(data); break;
      case 'maintenance': injectMaintenanceData(data); break;
      case 'errors': injectErrorsData(data); break;
      case 'filament': case 'inventory': injectFilamentData(data); break;
      case 'protection': injectProtectionData(data); break;
      case 'history': _injectHistory(data); break;
      case 'analysis': case 'stats': _injectAnalysis(data); break;
      case 'queue': _injectQueue(data); break;
      case 'scheduler': case 'calendar': _injectScheduler(data); _injectCalendar(data); break;
      case 'library': _injectLibrary(data); break;
      case 'costestimator': _injectCostEstimator(data); break;
      case 'achievements': _injectAchievements(data); break;
      case 'crm-dashboard': case 'crm-orders': case 'crm-invoices': case 'crm-customers': _injectCrm(data); break;
      case 'knowledge': _injectKnowledge(data); break;
      case 'profiles': _injectProfiles(data); break;
      case 'labels': _injectLabels(data); break;
      case 'logs': _injectLogs(data); break;
      case 'widgets': _injectWidgets(data); break;
      case 'screenshots': _injectScreenshots(data); break;
      case 'filamentanalytics': _injectFilamentAnalytics(data); break;
      case 'materialrec': _injectMaterialRec(data); break;
      case 'plugins': _injectPlugins(data); break;
      case 'erroranalysis': _injectErrorAnalysis(data); break;
      case 'wearprediction': _injectWearPrediction(data); break;
      case 'playground': _injectOnboarding(data); break;
      case 'backup': _injectBackup(data); break;
    }
  };
})();

