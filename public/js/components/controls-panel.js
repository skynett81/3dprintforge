// Controls Panel - Comprehensive printer controls
(function() {
  let lightState = 'on';
  let _lastData = null;
  let _rendered = false;  // Track if panel is already rendered

  function fanPercent(raw) {
    return Math.round((parseInt(raw) || 0) / 255 * 100);
  }

  function speedLevelKey(lvl) {
    return { 1: 'speed.silent', 2: 'speed.standard', 3: 'speed.sport', 4: 'speed.ludicrous' }[lvl] || 'speed.standard';
  }

  // Full render — only called once when panel opens
  function renderControls(container, data) {
    const meta = window.printerState.getActivePrinterMeta();
    const caps = typeof getCapabilities === 'function' ? getCapabilities(meta?.model) : {};
    const state = data.gcode_state || 'IDLE';
    const isPrinting = state === 'RUNNING' || state === 'PAUSE';

    // Track light state
    if (data.lights_report) {
      const chamber = data.lights_report.find(l => l.node === 'chamber_light');
      if (chamber) lightState = chamber.mode;
    }

    let html = '';

    // ============ SECTION 1: Print Control ============
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.print_control')}</div>
      <div class="controls-grid" id="ctrl-print-grid">`;

    html += printControlButtons(state, isPrinting);

    html += `</div></div>`;

    // ============ SECTION 2: Speed Profile ============
    const spdLvl = data.spd_lvl || 2;
    const spdMag = data.spd_mag || 100;
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.speed_profile')} <span class="ctrl-section-value" id="ctrl-speed-label">${t(speedLevelKey(spdLvl))} · ${spdMag}%</span></div>
      <div class="ctrl-speed-grid">
        <button class="ctrl-speed-btn ${spdLvl === 1 ? 'active' : ''}" data-speed="1" onclick="sendCommand('speed',{value:1})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18h4l3-8 3 8h4l5-16"/></svg>
          ${t('speed.silent')}
        </button>
        <button class="ctrl-speed-btn ${spdLvl === 2 ? 'active' : ''}" data-speed="2" onclick="sendCommand('speed',{value:2})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          ${t('speed.standard')}
        </button>
        <button class="ctrl-speed-btn ${spdLvl === 3 ? 'active' : ''}" data-speed="3" onclick="sendCommand('speed',{value:3})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          ${t('speed.sport')}
        </button>
        <button class="ctrl-speed-btn ${spdLvl === 4 ? 'active' : ''}" data-speed="4" onclick="sendCommand('speed',{value:4})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          ${t('speed.ludicrous')}
        </button>
      </div>
    </div>`;

    // ============ SECTION 3: Temperature Controls ============
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.temperature')}</div>
      <div class="ctrl-temp-list">`;

    const nozzleTemp = Math.round(data.nozzle_temper || 0);
    const nozzleTarget = Math.round(data.nozzle_target_temper || 0);
    const maxNozzle = caps.maxNozzleTemp || 300;
    html += tempRow('nozzle', t('controls.temp_nozzle'), nozzleTemp, nozzleTarget, 'M104', maxNozzle);

    if (caps.dualNozzle) {
      const nozzle2Temp = Math.round(data.nozzle_temper_2 || 0);
      const nozzle2Target = Math.round(data.nozzle_target_temper_2 || 0);
      html += tempRow('nozzle2', t('controls.temp_nozzle') + ' 2', nozzle2Temp, nozzle2Target, 'M104', maxNozzle);
    }

    const bedTemp = Math.round(data.bed_temper || 0);
    const bedTarget = Math.round(data.bed_target_temper || 0);
    const maxBed = caps.maxBedTemp || 120;
    html += tempRow('bed', t('controls.temp_bed'), bedTemp, bedTarget, 'M140', maxBed);

    if (caps.chamberHeat) {
      const chamberTemp = Math.round(data.chamber_temper || 0);
      const chamberTarget = Math.round(data.chamber_target_temper || 0);
      const maxChamber = caps.maxChamberTemp || 60;
      html += tempRow('chamber', t('controls.temp_chamber'), chamberTemp, chamberTarget, 'M141', maxChamber);
    }

    html += `</div>`;

    // Temperature presets
    html += `<div class="ctrl-presets">
      <span class="ctrl-preset-label">${t('controls.presets')}</span>
      <button class="ctrl-preset-btn" onclick="applyTempPreset(220, 60)" title="PLA">PLA</button>
      <button class="ctrl-preset-btn" onclick="applyTempPreset(250, 80)" title="PETG">PETG</button>
      <button class="ctrl-preset-btn" onclick="applyTempPreset(260, 100)" title="ABS">ABS</button>
      <button class="ctrl-preset-btn" onclick="applyTempPreset(270, 100)" title="ASA">ASA</button>
      <button class="ctrl-preset-btn" onclick="applyTempPreset(230, 60)" title="TPU">TPU</button>
      <button class="ctrl-preset-btn ctrl-preset-off" onclick="applyTempPreset(0, 0)" title="${t('controls.cooldown')}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ${t('controls.cooldown')}
      </button>
    </div>`;

    html += `</div>`;

    // ============ SECTION 4: Fan Controls ============
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.fans')}</div>
      <div class="ctrl-fan-list">`;

    const partPct = fanPercent(data.cooling_fan_speed);
    html += fanSlider('part', t('controls.fan_part'), partPct, 'P1');

    if (caps.auxFan) {
      const auxPct = fanPercent(data.big_fan1_speed);
      html += fanSlider('aux', t('controls.fan_aux'), auxPct, 'P2');
    }

    if (caps.chamberFan) {
      const chamberPct = fanPercent(data.big_fan2_speed);
      html += fanSlider('chamber', t('controls.fan_chamber'), chamberPct, 'P3');
    }

    html += `</div></div>`;

    // ============ SECTION 5: Axis / Motion ============
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.motion')}</div>
      <div class="ctrl-motion-grid">
        <div class="ctrl-motion-xy">
          <button class="ctrl-motion-btn" onclick="sendGcode('G91\\nG0 Y10 F3000\\nG90')" title="Y+10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <div class="ctrl-motion-row">
            <button class="ctrl-motion-btn" onclick="sendGcode('G91\\nG0 X-10 F3000\\nG90')" title="X-10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button class="ctrl-motion-btn ctrl-motion-home" onclick="sendGcode('G28')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </button>
            <button class="ctrl-motion-btn" onclick="sendGcode('G91\\nG0 X10 F3000\\nG90')" title="X+10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <button class="ctrl-motion-btn" onclick="sendGcode('G91\\nG0 Y-10 F3000\\nG90')" title="Y-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
        <div class="ctrl-motion-z">
          <button class="ctrl-motion-btn" onclick="sendGcode('G91\\nG0 Z5 F600\\nG90')" title="Z+5">Z+</button>
          <button class="ctrl-motion-btn" onclick="sendGcode('G91\\nG0 Z-5 F600\\nG90')" title="Z-5">Z-</button>
        </div>
      </div>
    </div>`;

    // ============ SECTION 6: Extruder ============
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.extruder')}</div>
      <div class="ctrl-extrude-row">
        <button class="ctrl-btn" onclick="sendGcode('G91\\nG0 E10 F300\\nG90')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          ${t('controls.extrude')} 10mm
        </button>
        <button class="ctrl-btn" onclick="sendGcode('G91\\nG0 E-10 F300\\nG90')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
          ${t('controls.retract')} 10mm
        </button>
      </div>
    </div>`;

    // ============ SECTION 7: Tools ============
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.tools')}</div>
      <div class="controls-grid">`;

    if (caps.light) {
      html += `<button class="ctrl-btn ctrl-light ${lightState === 'on' ? 'ctrl-light-on' : ''}" id="ctrl-light-btn" onclick="toggleLight()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 1 4 12.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.3A7 7 0 0 1 12 2z"/><line x1="10" y1="22" x2="14" y2="22"/></svg>
        ${t('controls.light')}
      </button>`;
    }

    html += `<button class="ctrl-btn" onclick="sendGcode('G29')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><rect x="9" y="12" width="6" height="8"/></svg>
      ${t('controls.calibration')}
    </button>`;

    if (caps.ai) {
      const spaghetti = data.xcam?.spaghetti_detector;
      const firstLayer = data.xcam?.first_layer_inspector;
      html += `<button class="ctrl-btn ${spaghetti ? 'ctrl-light-on' : ''}" id="ctrl-ai-spaghetti" disabled title="${t('controls.ai_spaghetti')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        ${t('controls.ai_spaghetti')}
      </button>`;
      html += `<button class="ctrl-btn ${firstLayer ? 'ctrl-light-on' : ''}" id="ctrl-ai-firstlayer" disabled title="${t('controls.ai_first_layer')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
        ${t('controls.ai_first_layer')}
      </button>`;
    }

    html += `</div></div>`;

    // ============ SECTION 8: G-code Console ============
    html += `<div class="ctrl-section">
      <div class="ctrl-section-title">${t('controls.gcode_title')}</div>
      <div class="ctrl-gcode">
        <input class="form-input ctrl-gcode-input" id="gcode-input" placeholder="${t('controls.gcode_placeholder')}" onkeydown="if(event.key==='Enter')sendGcodeInput()">
        <button class="form-btn form-btn-sm" onclick="sendGcodeInput()">${t('controls.gcode_send')}</button>
      </div>
    </div>`;

    container.innerHTML = html;
    _rendered = true;
  }

  // Lightweight update — only change values that differ, no full re-render
  function updateControlsInPlace(container, data) {
    if (data.lights_report) {
      const chamber = data.lights_report.find(l => l.node === 'chamber_light');
      if (chamber) lightState = chamber.mode;
    }

    const state = data.gcode_state || 'IDLE';
    const isPrinting = state === 'RUNNING' || state === 'PAUSE';

    // Update print control buttons (state can change between RUNNING/PAUSE/IDLE)
    const printGrid = container.querySelector('#ctrl-print-grid');
    if (printGrid) {
      printGrid.innerHTML = printControlButtons(state, isPrinting);
    }

    // Update speed label + active button
    const spdLvl = data.spd_lvl || 2;
    const spdMag = data.spd_mag || 100;
    const spdLabel = container.querySelector('#ctrl-speed-label');
    if (spdLabel) spdLabel.textContent = `${t(speedLevelKey(spdLvl))} · ${spdMag}%`;
    container.querySelectorAll('.ctrl-speed-btn').forEach(btn => {
      const lvl = parseInt(btn.dataset.speed);
      btn.classList.toggle('active', lvl === spdLvl);
    });

    // Update temperature current values (don't touch inputs — user may be editing)
    updateTempCurrent(container, 'nozzle', data.nozzle_temper);
    updateTempCurrent(container, 'nozzle2', data.nozzle_temper_2);
    updateTempCurrent(container, 'bed', data.bed_temper);
    updateTempCurrent(container, 'chamber', data.chamber_temper);

    // Update fan slider values only if user is NOT actively dragging
    updateFanSlider(container, 'part', data.cooling_fan_speed);
    updateFanSlider(container, 'aux', data.big_fan1_speed);
    updateFanSlider(container, 'chamber', data.big_fan2_speed);

    // Update light button
    const lightBtn = container.querySelector('#ctrl-light-btn');
    if (lightBtn) {
      lightBtn.classList.toggle('ctrl-light-on', lightState === 'on');
    }
  }

  function updateTempCurrent(container, id, rawTemp) {
    const el = container.querySelector(`#temp-current-${id}`);
    if (el && rawTemp !== undefined) {
      el.textContent = `${Math.round(rawTemp)}°C`;
    }
  }

  function updateFanSlider(container, id, rawSpeed) {
    const slider = container.querySelector(`#fan-slider-${id}`);
    const valueEl = container.querySelector(`#fan-val-${id}`);
    if (!slider || rawSpeed === undefined) return;

    // Don't update if user is actively interacting (mouse or touch down)
    if (slider.matches(':active')) return;

    const pct = Math.round((parseInt(rawSpeed) || 0) / 255 * 100);
    slider.value = pct;
    if (valueEl) valueEl.textContent = `${pct}%`;
  }

  function printControlButtons(state, isPrinting) {
    let html = '';
    if (state === 'RUNNING') {
      html += `<button class="ctrl-btn ctrl-pause" onclick="sendCommand('pause')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        ${t('controls.pause')}
      </button>`;
    } else if (state === 'PAUSE') {
      html += `<button class="ctrl-btn ctrl-resume" onclick="sendCommand('resume')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        ${t('controls.resume')}
      </button>`;
    }
    html += `<button class="ctrl-btn ctrl-stop" ${!isPrinting ? 'disabled' : ''} onclick="confirmStop()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
      ${t('controls.stop')}
    </button>`;
    return html;
  }

  window.updateControls = function(data) {
    _lastData = data;

    // Dashboard mini controls (if present)
    const miniContainer = document.getElementById('controls-content');
    if (miniContainer) renderControls(miniContainer, data);

    // Full panel — only update in-place if already rendered
    const panelContainer = document.getElementById('controls-panel-content');
    if (panelContainer) {
      if (!_rendered || !panelContainer.hasChildNodes()) {
        renderControls(panelContainer, data);
      } else {
        updateControlsInPlace(panelContainer, data);
      }
    }
  };

  window.loadControlsPanel = function() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;
    _rendered = false;
    panel.innerHTML = '<div id="controls-panel-content"></div>';
    if (_lastData) {
      renderControls(document.getElementById('controls-panel-content'), _lastData);
    }
  };

  function fanSlider(id, label, pct, fanParam) {
    return `<div class="ctrl-fan-row">
      <span class="ctrl-fan-label">${label}</span>
      <input type="range" class="ctrl-slider" id="fan-slider-${id}" min="0" max="100" value="${pct}"
             onchange="setFanSpeed('${fanParam}', this.value)" oninput="document.getElementById('fan-val-${id}').textContent=this.value+'%'">
      <span class="ctrl-fan-value" id="fan-val-${id}">${pct}%</span>
    </div>`;
  }

  function tempRow(id, label, current, target, gcode, max) {
    return `<div class="ctrl-temp-row">
      <span class="ctrl-temp-label">${label}</span>
      <span class="ctrl-temp-current" id="temp-current-${id}">${current}°C</span>
      <span class="ctrl-temp-arrow">\u2192</span>
      <input type="number" class="form-input ctrl-temp-input" id="temp-input-${id}" value="${target}" min="0" max="${max}" step="5">
      <button class="form-btn form-btn-sm" onclick="setTemp('${gcode}', document.getElementById('temp-input-${id}').value)">${t('controls.set')}</button>
    </div>`;
  }

  window.setFanSpeed = function(fanParam, pct) {
    const sVal = Math.round((parseInt(pct) / 100) * 255);
    sendCommand('gcode', { gcode: `M106 ${fanParam} S${sVal}` });
  };

  window.setTemp = function(gcode, temp) {
    const val = parseInt(temp);
    if (isNaN(val) || val < 0) return;
    sendCommand('gcode', { gcode: `${gcode} S${val}` });
  };

  window.applyTempPreset = function(nozzle, bed) {
    sendCommand('gcode', { gcode: `M104 S${nozzle}` });
    sendCommand('gcode', { gcode: `M140 S${bed}` });
  };

  window.sendGcode = function(gcode) {
    sendCommand('gcode', { gcode });
  };

  window.sendGcodeInput = function() {
    const input = document.getElementById('gcode-input');
    if (!input || !input.value.trim()) return;
    sendCommand('gcode', { gcode: input.value.trim() });
    input.value = '';
  };

  window.confirmStop = function() {
    if (confirm(t('controls.confirm_stop'))) {
      sendCommand('stop');
    }
  };

  window.toggleLight = function() {
    const newMode = lightState === 'on' ? 'off' : 'on';
    sendCommand('light', { mode: newMode, node: 'chamber_light' });
  };
})();
