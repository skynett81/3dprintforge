// Pre-print confirmation dialog — shows file info, estimated time, settings before printing
(function() {
  'use strict';

  /**
   * Show a pre-print confirmation dialog
   * @param {object} opts
   * @param {string} opts.filename
   * @param {string} opts.printerId
   * @param {object} [opts.metadata] - G-code metadata (from slicer or analyzer)
   * @param {Function} opts.onConfirm - Called when user confirms
   */
  window.showPrePrintDialog = function(opts) {
    const { filename, printerId, metadata, onConfirm } = opts;
    const state = window.printerState;
    const meta = state?._printerMeta?.[printerId] || {};
    const printerName = meta.name || printerId;

    const m = metadata || {};
    const estTime = m.estimated_time || m.estimatedTimeSeconds;
    const estTimeStr = estTime ? _fmtTime(estTime) : '--';
    const filWeight = m.filament_weight_total || m.filamentWeightG;
    const layerH = m.layer_height;
    const nozzleTemp = m.first_layer_extr_temp || m.maxNozzleTemp;
    const bedTemp = m.first_layer_bed_temp || m.maxBedTemp;
    const slicer = m.slicer;
    const layers = m.layer_count || m.layerCount;
    const filType = m.filament_type;
    const filColour = m.filament_colour;

    const overlay = document.createElement('div');
    overlay.className = 'lib-dialog-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="lib-dialog" style="max-width:420px;padding:20px">
      <h4 style="margin:0 0 14px;display:flex;align-items:center;gap:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        Print Confirmation
      </h4>

      <div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-bottom:12px">
        <div style="font-size:0.9rem;font-weight:600;margin-bottom:4px">${_esc(filename)}</div>
        <div style="font-size:0.78rem;color:var(--text-muted)">Printer: <strong>${_esc(printerName)}</strong></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${_infoCard('Est. Time', estTimeStr, '⏱️')}
        ${_infoCard('Layers', layers || '--', '📐')}
        ${_infoCard('Filament', filWeight ? filWeight.toFixed(1) + 'g' : '--', '🧵')}
        ${_infoCard('Layer Height', layerH ? layerH + 'mm' : '--', '📏')}
        ${_infoCard('Nozzle', nozzleTemp ? nozzleTemp + '°C' : '--', '🔥')}
        ${_infoCard('Bed', bedTemp ? bedTemp + '°C' : '--', '🛏️')}
        ${filType ? _infoCard('Material', filType, '🧪') : ''}
        ${slicer ? _infoCard('Slicer', slicer, '⚙️') : ''}
      </div>

      ${filColour ? `<div style="display:flex;gap:4px;margin-bottom:12px;align-items:center"><span style="font-size:0.75rem;color:var(--text-muted)">Colours:</span>${filColour.split(';').map(c => `<span style="width:16px;height:16px;border-radius:50%;background:${c};border:1px solid rgba(255,255,255,0.2);display:inline-block"></span>`).join('')}</div>` : ''}

      ${_renderValidation(printerId, m)}

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="form-btn form-btn-sm" onclick="this.closest('.lib-dialog-overlay').remove()">Cancel</button>
        <button class="form-btn form-btn-sm" style="background:var(--accent-green);color:#fff;padding:6px 20px" onclick="this.closest('.lib-dialog-overlay').remove();(${_esc(onConfirm.toString())})()">🖨️ Start Print</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  };

  function _infoCard(label, value, icon) {
    return `<div style="background:var(--bg-tertiary);border-radius:6px;padding:8px;text-align:center">
      <div style="font-size:0.65rem;color:var(--text-muted)">${icon} ${label}</div>
      <div style="font-size:0.9rem;font-weight:600;margin-top:2px">${value}</div>
    </div>`;
  }

  function _fmtTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  function _renderValidation(printerId, m) {
    const state = window.printerState;
    const printerData = state?.printers?.[printerId] || {};
    const pt = typeof getPrinterType === 'function' ? getPrinterType(state?._printerMeta?.[printerId], printerData) : {};
    const warnings = [];
    const checks = [];

    // Build volume check
    const vol = printerData._buildVolume || printerData._printerProfile?.volume;
    if (vol && m.dimensions) {
      const w = vol.width || vol.x || 999, d = vol.depth || vol.y || 999, h = vol.height || vol.z || 999;
      if (m.dimensions.x > w || m.dimensions.y > d || m.dimensions.z > h) {
        warnings.push(`⚠ Model (${m.dimensions.x}×${m.dimensions.y}×${m.dimensions.z}mm) exceeds build volume (${w}×${d}×${h}mm)`);
      } else {
        checks.push(`✅ Fits within ${w}×${d}×${h}mm build volume`);
      }
    }

    // Heated chamber check
    if (m.filament_type && ['ABS', 'ASA', 'PA', 'PC'].includes(m.filament_type.toUpperCase())) {
      if (pt.hasChamber) checks.push('✅ Heated chamber available for ' + m.filament_type);
      else warnings.push(`⚠ ${m.filament_type} recommended with heated chamber — not available`);
    }

    // Nozzle check
    if (m.nozzle_diameter && printerData._nozzle_diameter) {
      if (Math.abs(m.nozzle_diameter - printerData._nozzle_diameter) > 0.01) {
        warnings.push(`⚠ G-code sliced for ${m.nozzle_diameter}mm nozzle, printer has ${printerData._nozzle_diameter}mm`);
      } else {
        checks.push(`✅ Nozzle ${printerData._nozzle_diameter}mm matches`);
      }
    }

    // Filament sensor
    if (pt.hasFilamentSensor && printerData._filament_sensor && !printerData._filament_sensor.detected) {
      warnings.push('⚠ Filament not detected — insert filament before printing');
    }

    // Printer state
    if (printerData.gcode_state === 'RUNNING') {
      warnings.push('⚠ Printer is currently printing — this will queue the job');
    }

    if (warnings.length === 0 && checks.length === 0) return '';

    let html = '<div style="margin-bottom:12px">';
    for (const w of warnings) html += `<div style="font-size:0.72rem;color:var(--accent-orange);margin-bottom:2px">${w}</div>`;
    for (const c of checks) html += `<div style="font-size:0.72rem;color:var(--accent-green);margin-bottom:2px">${c}</div>`;
    html += '</div>';
    return html;
  }

  function _esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
})();
