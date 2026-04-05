// Snapmaker U1 — Filament spool cards + feed control panel
(function() {
  'use strict';

  /**
   * Render full SM filament section for controls panel
   * @param {object} data - printer state with _sm_filament, _sm_feed_channels
   * @param {string} printerId
   * @returns {string} HTML
   */
  window.renderSmFilamentPanel = function(data, printerId) {
    if (!data._sm_filament && !data._sm_feed_channels) return '';

    let html = `<div class="ctrl-card">
      <div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
        Filament Slots
      </div>`;

    // Spool cards
    if (data._sm_filament) {
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:10px">';
      for (let i = 0; i < data._sm_filament.length; i++) {
        const f = data._sm_filament[i];
        const feed = data._sm_feed_channels?.find(c => c.extruder === `extruder${i}`);
        const feedLabel = feed?.stateLabel || '';
        const feedCat = feed?.stateCategory || 'idle';
        const detected = feed?.filament_detected;
        const isLoading = feedCat === 'loading' || feedCat === 'unloading';

        html += `<div style="background:var(--bg-tertiary);border-radius:8px;padding:8px;position:relative;border-left:4px solid ${f.color || '#888'}">
          <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
            <span style="width:12px;height:12px;border-radius:50%;background:${f.color};border:1px solid rgba(255,255,255,0.2);flex-shrink:0"></span>
            <span style="font-size:0.82rem;font-weight:600">T${i}</span>
            ${f.official ? '<span style="font-size:0.55rem;padding:0 4px;border-radius:6px;background:var(--accent-green);color:#fff">NFC</span>' : ''}
          </div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${f.vendor ? f.vendor + ' ' : ''}${f.type}${f.subType ? ' ' + f.subType : ''}</div>
          <div style="font-size:0.65rem;color:var(--text-muted);margin-top:2px">${f.nozzleTempMin}-${f.nozzleTempMax}°C / Bed ${f.bedTemp}°C</div>
          ${f.weight ? '<div style="font-size:0.65rem;color:var(--text-muted)">' + f.weight + 'g / ⌀' + f.diameter + 'mm</div>' : ''}
          ${feedLabel ? '<div style="font-size:0.65rem;margin-top:3px;color:' + (feedCat === 'error' ? 'var(--accent-red)' : 'var(--accent-cyan)') + '">' + feedLabel + '</div>' : ''}
          ${isLoading ? '<div style="height:2px;background:var(--bg-secondary);border-radius:1px;margin-top:3px"><div style="height:2px;background:var(--accent-cyan);border-radius:1px;width:50%;animation:sm-pulse 1s infinite alternate"></div></div>' : ''}
          <div style="display:flex;gap:3px;margin-top:5px">
            <button class="form-btn form-btn-sm" style="font-size:0.6rem;padding:1px 5px;flex:1" data-ripple onclick="sendCommand('sm_feed_auto',{channel:${i}})">Load</button>
            <button class="form-btn form-btn-sm" style="font-size:0.6rem;padding:1px 5px;flex:1" data-ripple onclick="sendCommand('sm_feed_unload',{channel:${i}})">Unload</button>
          </div>
        </div>`;
      }
      html += '</div>';
    }

    html += '</div>';

    // Add animation keyframe
    html += '<style>@keyframes sm-pulse{from{opacity:0.4}to{opacity:1}}</style>';

    return html;
  };

  /**
   * Update filament panel in-place (for WebSocket state updates)
   */
  window.updateSmFilamentPanel = function(data) {
    // Feed state updates are handled by full re-render via updateControls
    // since the data changes are structural (card content)
  };
})();
