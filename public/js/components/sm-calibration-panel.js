// Snapmaker U1 — Calibration wizard panel
(function() {
  'use strict';

  /**
   * Render SM calibration section for controls panel
   */
  window.renderSmCalibrationPanel = function(data) {
    if (!data._sm_print_config && !data._sm_flow_cal) return '';

    let html = `<div class="ctrl-card">
      <div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        Calibration
      </div>`;

    // Flow calibration
    const fc = data._sm_flow_cal;
    const hasFlowData = fc && Object.keys(fc).length > 0;
    html += `<div style="margin-bottom:10px">
      <div style="font-size:0.82rem;font-weight:600;margin-bottom:6px">Flow Calibration (Pressure Advance)</div>
      <div style="display:flex;gap:4px;margin-bottom:6px">
        <button class="form-btn form-btn-sm" data-ripple onclick="sendCommand('sm_flow_calibrate')" style="font-size:0.72rem">Start Flow Calibration</button>
      </div>
      ${hasFlowData ? `<div style="font-size:0.7rem;color:var(--text-muted)">Last result: ${JSON.stringify(fc)}</div>` : '<div style="font-size:0.7rem;color:var(--text-muted)">No calibration data yet</div>'}
    </div>`;

    // Quick calibration buttons
    html += `<div style="margin-bottom:8px">
      <div style="font-size:0.82rem;font-weight:600;margin-bottom:6px">Quick Calibrations</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        <button class="form-btn form-btn-sm" data-ripple onclick="sendGcode('BED_MESH_CALIBRATE')" style="font-size:0.72rem">Bed Mesh</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="sendGcode('SHAPER_CALIBRATE')" style="font-size:0.72rem">Input Shaper</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="sendGcode('AUTO_SCREWS_TILT_ADJUST')" style="font-size:0.72rem">Screw Tilt</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="sendGcode('XYZ_OFFSET_CALIBRATE_ALL')" style="font-size:0.72rem">XYZ Offset (All)</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="sendGcode('ROUGHLY_CLEAN_NOZZLE')" style="font-size:0.72rem">Clean Nozzle</button>
      </div>
    </div>`;

    // Extruder offset calibration
    html += `<div>
      <div style="font-size:0.82rem;font-weight:600;margin-bottom:6px">Extruder Offset Calibration</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        <button class="form-btn form-btn-sm" data-ripple onclick="sendGcode('EXTRUDER_OFFSET_ACTION_PROBE_CALIBRATE_ALL')" style="font-size:0.72rem">Auto-calibrate All Heads</button>
      </div>
      <p style="font-size:0.65rem;color:var(--text-muted);margin:6px 0 0">Measures nozzle offsets between all 4 extruders using inductance probe. Takes ~5 min.</p>
    </div>`;

    html += '</div>';
    return html;
  };
})();
