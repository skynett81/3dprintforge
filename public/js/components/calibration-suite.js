/**
 * Calibration & Tuning Suite — three tabs:
 *   1. Calibration Generator (6 G-code generators)
 *   2. Smart ETA stats (slicer-vs-actual learning per material/printer)
 *   3. Input Shaper Wizard (Klipper resonance CSV → recommended shaper)
 *
 * Renders into #overlay-panel-body. Pure vanilla JS, no external deps.
 */
(function () {
  'use strict';

  const _state = { tab: 'gen', genType: 'temp-tower', genResult: null };
  function _esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }
  function _toast(msg, type = 'info') { if (typeof showToast === 'function') showToast(msg, type, 3000); }

  function _load() {
    const body = document.getElementById('overlay-panel-body');
    if (!body) return;
    body.innerHTML = `
      <div class="cal-tabs">
        <button class="form-btn cal-tab ${_state.tab === 'gen' ? 'active' : ''}" data-tab="gen">🧪 Calibration Generator</button>
        <button class="form-btn cal-tab ${_state.tab === 'eta' ? 'active' : ''}" data-tab="eta">🎯 Smart ETA</button>
        <button class="form-btn cal-tab ${_state.tab === 'shaper' ? 'active' : ''}" data-tab="shaper">📊 Input Shaper Wizard</button>
      </div>
      <div id="cal-content" class="cal-content"></div>
    `;
    body.querySelectorAll('.cal-tab').forEach(btn => {
      btn.onclick = () => { _state.tab = btn.dataset.tab; _load(); };
    });
    if (_state.tab === 'gen') _renderGen();
    else if (_state.tab === 'eta') _renderEta();
    else _renderShaper();
  }

  // ── Tab 1: Calibration Generator ────────────────────────────────────

  const GEN_DEFS = {
    'temp-tower': {
      label: 'Temperature Tower', icon: '🌡',
      params: [
        { key: 'bedTemp', label: 'Bed temp (°C)', type: 'number', value: 60 },
        { key: 'hotendStart', label: 'Hotend start (°C)', type: 'number', value: 200 },
        { key: 'hotendEnd', label: 'Hotend end (°C)', type: 'number', value: 230 },
        { key: 'blocks', label: 'Blocks', type: 'number', value: 8, min: 2, max: 12 },
        { key: 'blockHeight', label: 'Block height (mm)', type: 'number', step: 0.5, value: 5 },
      ],
    },
    'retract-tower': {
      label: 'Retraction Tower', icon: '↩',
      params: [
        { key: 'bedTemp', label: 'Bed temp (°C)', type: 'number', value: 60 },
        { key: 'hotendTemp', label: 'Hotend temp (°C)', type: 'number', value: 215 },
        { key: 'retractStart', label: 'Retract start (mm)', type: 'number', step: 0.1, value: 0.5 },
        { key: 'retractEnd', label: 'Retract end (mm)', type: 'number', step: 0.1, value: 5 },
        { key: 'blocks', label: 'Blocks', type: 'number', value: 6, min: 2, max: 12 },
      ],
    },
    'flow-test': {
      label: 'Flow Rate Test', icon: '🔄',
      params: [
        { key: 'bedTemp', label: 'Bed temp (°C)', type: 'number', value: 60 },
        { key: 'hotendTemp', label: 'Hotend temp (°C)', type: 'number', value: 215 },
        { key: 'flowStart', label: 'Flow start (%)', type: 'number', value: 90 },
        { key: 'flowEnd', label: 'Flow end (%)', type: 'number', value: 110 },
        { key: 'blocks', label: 'Blocks', type: 'number', value: 5 },
      ],
    },
    'pressure-advance': {
      label: 'Pressure Advance Tower', icon: '⚡',
      params: [
        { key: 'firmware', label: 'Firmware', type: 'select', options: ['klipper', 'marlin'], value: 'klipper' },
        { key: 'bedTemp', label: 'Bed temp (°C)', type: 'number', value: 60 },
        { key: 'hotendTemp', label: 'Hotend temp (°C)', type: 'number', value: 215 },
        { key: 'paStart', label: 'PA start', type: 'number', step: 0.001, value: 0 },
        { key: 'paEnd', label: 'PA end', type: 'number', step: 0.001, value: 0.1 },
        { key: 'paStep', label: 'PA step per layer', type: 'number', step: 0.001, value: 0.005 },
      ],
    },
    'first-layer': {
      label: 'First Layer Test', icon: '◻',
      params: [
        { key: 'pattern', label: 'Pattern', type: 'select', options: ['snake', 'square', 'concentric'], value: 'snake' },
        { key: 'bedTemp', label: 'Bed temp (°C)', type: 'number', value: 60 },
        { key: 'hotendTemp', label: 'Hotend temp (°C)', type: 'number', value: 215 },
        { key: 'width', label: 'Width (mm)', type: 'number', value: 200 },
        { key: 'height', label: 'Height (mm)', type: 'number', value: 200 },
      ],
    },
    'single-line': {
      label: 'Single-Line Speed Test', icon: '➡',
      params: [
        { key: 'bedTemp', label: 'Bed temp (°C)', type: 'number', value: 60 },
        { key: 'hotendTemp', label: 'Hotend temp (°C)', type: 'number', value: 215 },
        { key: 'speedStart', label: 'Start speed (mm/s)', type: 'number', value: 30 },
        { key: 'speedEnd', label: 'End speed (mm/s)', type: 'number', value: 200 },
        { key: 'lines', label: 'Lines', type: 'number', value: 8 },
      ],
    },
  };

  function _renderGen() {
    const c = document.getElementById('cal-content');
    if (!c) return;
    c.innerHTML = `
      <div class="cal-gen-grid">
        <div class="cal-pane">
          <div class="cal-pane-title">Choose Test</div>
          <div class="cal-test-list">
            ${Object.entries(GEN_DEFS).map(([key, def]) => `
              <div class="cal-test ${key === _state.genType ? 'active' : ''}" data-type="${key}">
                <div class="cal-test-icon">${def.icon}</div>
                <div class="cal-test-name">${def.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="cal-pane">
          <div class="cal-pane-title">Parameters</div>
          <div id="cal-params" class="cal-params"></div>
          <div class="cal-actions">
            <button class="form-btn form-btn-success" id="cal-generate">⚙ Generate G-code</button>
          </div>
        </div>
        <div class="cal-pane">
          <div class="cal-pane-title">Preview &amp; Download</div>
          <div id="cal-preview" class="cal-preview text-muted">Select parameters and click Generate.</div>
        </div>
      </div>`;
    c.querySelectorAll('.cal-test').forEach(el => {
      el.onclick = () => { _state.genType = el.dataset.type; _renderGen(); };
    });
    _renderParams();
    document.getElementById('cal-generate').onclick = _generate;
  }

  function _renderParams() {
    const def = GEN_DEFS[_state.genType];
    const el = document.getElementById('cal-params');
    if (!el || !def) return;
    el.innerHTML = def.params.map(p => `
      <label class="form-label cal-param">
        <span>${_esc(p.label)}</span>
        ${p.type === 'select'
          ? `<select class="form-input form-input-sm" data-key="${p.key}">${p.options.map(o => `<option value="${_esc(o)}" ${o === p.value ? 'selected' : ''}>${_esc(o)}</option>`).join('')}</select>`
          : `<input class="form-input form-input-sm" type="${p.type}" data-key="${p.key}" value="${p.value}" ${p.step ? `step="${p.step}"` : ''} ${p.min != null ? `min="${p.min}"` : ''} ${p.max != null ? `max="${p.max}"` : ''}>`}
      </label>
    `).join('');
  }

  async function _generate() {
    const def = GEN_DEFS[_state.genType];
    const params = {};
    document.querySelectorAll('.cal-param [data-key]').forEach(el => {
      const v = el.value;
      params[el.dataset.key] = el.type === 'number' ? parseFloat(v) : v;
    });
    try {
      const res = await fetch('/api/calibration/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: _state.genType, params }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'generate failed');
      _state.genResult = data;
      _renderPreview();
      _toast(`${data.name} ready · ~${data.expected_minutes} min · ~${data.filament_g}g`, 'success');
    } catch (e) {
      _toast(`Generate failed: ${e.message}`, 'error');
    }
  }

  function _renderPreview() {
    const el = document.getElementById('cal-preview');
    if (!el || !_state.genResult) return;
    const r = _state.genResult;
    const sizeKB = (new Blob([r.gcode]).size / 1024).toFixed(1);
    el.innerHTML = `
      <div class="cal-preview-head">
        <strong>${_esc(r.name)}</strong>
        <span class="text-muted" style="font-size:0.72rem">${_esc(r.description)}</span>
        <div class="cal-preview-stats">
          <span>⏱ ~${r.expected_minutes} min</span>
          <span>⚖ ~${r.filament_g}g</span>
          <span>📦 ${sizeKB} KB</span>
        </div>
      </div>
      <div class="cal-actions">
        <button class="form-btn form-btn-sm" onclick="window._cal.downloadGcode()">⬇ Download .gcode</button>
        <button class="form-btn form-btn-sm" onclick="window._cal.copyGcode()">📋 Copy</button>
      </div>
      <textarea class="cal-gcode-preview" readonly>${_esc(r.gcode.slice(0, 8000))}${r.gcode.length > 8000 ? '\n\n; ...truncated for preview, download for full file' : ''}</textarea>
    `;
  }

  function _downloadGcode() {
    if (!_state.genResult) return;
    const blob = new Blob([_state.genResult.gcode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${_state.genResult.type}_${Date.now()}.gcode`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function _copyGcode() {
    if (!_state.genResult) return;
    navigator.clipboard.writeText(_state.genResult.gcode).then(
      () => _toast('Copied G-code to clipboard', 'success'),
      () => _toast('Copy failed — browser blocked clipboard', 'error'),
    );
  }

  // ── Tab 2: Smart ETA ───────────────────────────────────────────────

  async function _renderEta() {
    const c = document.getElementById('cal-content');
    if (!c) return;
    c.innerHTML = '<div class="text-muted">Loading ETA stats…</div>';

    try {
      const printers = await (await fetch('/api/printers')).json();
      const all = [];
      for (const p of printers) {
        try {
          const buckets = await (await fetch(`/api/eta/printer/${encodeURIComponent(p.id)}`)).json();
          for (const b of buckets) all.push({ ...b, printer_name: p.name });
        } catch {}
      }
      if (!all.length) {
        c.innerHTML = `
          <div class="cal-empty">
            <h3>📈 No ETA history yet</h3>
            <p>Smart ETA learns from completed prints. Once a print finishes the slicer estimate is compared with the actual time and the multiplier for that <code>(printer, material, nozzle)</code> bucket is updated.</p>
            <p>Run a few prints and come back — the predictor needs ~3 samples per bucket before its prediction beats the slicer estimate.</p>
          </div>`;
        return;
      }
      const sortedByPrinter = {};
      for (const b of all) {
        sortedByPrinter[b.printer_name] = sortedByPrinter[b.printer_name] || [];
        sortedByPrinter[b.printer_name].push(b);
      }
      let html = '';
      for (const [printer, buckets] of Object.entries(sortedByPrinter)) {
        html += `<h3 class="cal-eta-printer">${_esc(printer)}</h3>
        <table class="cal-eta-table">
          <thead><tr>
            <th>Material</th><th>Nozzle</th><th>Multiplier</th><th>Samples</th>
            <th>Last slicer</th><th>Last actual</th><th>Updated</th>
          </tr></thead>
          <tbody>
            ${buckets.map(b => {
              const colour = b.multiplier > 1.05 ? 'var(--accent-orange)' : b.multiplier < 0.95 ? 'var(--accent-blue)' : 'var(--accent-green)';
              const accuracy = b.samples > 0 ? `${Math.round((1 - Math.abs(b.multiplier - 1)) * 100)}%` : '—';
              return `<tr>
                <td>${_esc(b.material)}</td>
                <td>${b.nozzle_diameter}mm</td>
                <td><strong style="color:${colour}">${(+b.multiplier).toFixed(3)}×</strong> <span class="text-muted" style="font-size:0.7rem">${accuracy}</span></td>
                <td>${b.samples}</td>
                <td>${Math.round(b.last_slicer_min)} min</td>
                <td>${Math.round(b.last_actual_min)} min</td>
                <td class="text-muted" style="font-size:0.7rem">${_esc(b.updated_at)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`;
      }
      c.innerHTML = html;
    } catch (e) {
      c.innerHTML = `<div class="text-muted">Failed to load: ${_esc(e.message)}</div>`;
    }
  }

  // ── Tab 3: Input Shaper Wizard ─────────────────────────────────────

  function _renderShaper() {
    const c = document.getElementById('cal-content');
    if (!c) return;
    c.innerHTML = `
      <div class="cal-shaper-wrap">
        <div class="cal-shaper-intro">
          <h3>📊 Input Shaper Wizard <span style="font-size:0.7rem;font-weight:normal;color:var(--text-muted)">(Klipper)</span></h3>
          <p class="text-muted">Run <code>TEST_RESONANCES AXIS=X</code> on the printer, retrieve the resulting <code>resonances_x_*.csv</code> file, drag it here. The wizard will pick the lowest-residual shaper that fits a smoothing tolerance.</p>
        </div>
        <input type="file" id="cal-shaper-file" accept=".csv" style="display:none">
        <div class="cal-shaper-controls">
          <button class="form-btn" onclick="document.getElementById('cal-shaper-file').click()">📂 Load CSV</button>
          <label>Axis:
            <select id="cal-shaper-axis" class="form-input form-input-sm">
              <option value="x">X</option>
              <option value="y">Y</option>
              <option value="z">Z</option>
            </select>
          </label>
          <label>Max smoothing:
            <input id="cal-shaper-smooth" class="form-input form-input-sm" type="number" value="1.6" step="0.1" style="width:70px">
          </label>
        </div>
        <div id="cal-shaper-output" class="cal-shaper-output">
          <div class="text-muted">Awaiting CSV…</div>
        </div>
      </div>`;
    document.getElementById('cal-shaper-file').addEventListener('change', _onShaperCsv);
  }

  async function _onShaperCsv(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const axis = document.getElementById('cal-shaper-axis').value;
    const max = parseFloat(document.getElementById('cal-shaper-smooth').value);
    try {
      const res = await fetch('/api/input-shaper/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: text, axis, max_smoothing: max }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'analyze failed');
      _renderShaperOutput(data);
    } catch (e) {
      _toast(`Analysis failed: ${e.message}`, 'error');
    }
  }

  function _renderShaperOutput(data) {
    const el = document.getElementById('cal-shaper-output');
    if (!el) return;
    let html = `
      <div class="cal-shaper-summary">
        <div><strong>Peak frequency:</strong> ${data.peakFreq} Hz</div>
        <div><strong>SNR:</strong> ${data.snr}</div>
        ${data.warning ? `<div style="color:var(--accent-orange)">⚠ ${_esc(data.warning)}</div>` : ''}
      </div>`;
    if (data.recommendation) {
      html += `
        <div class="cal-shaper-reco">
          <div class="cal-shaper-reco-head">Recommended</div>
          <div class="cal-shaper-reco-name">${_esc(data.recommendation.shaper.toUpperCase())} @ ${data.recommendation.freq} Hz</div>
          <div class="cal-shaper-reco-cmd">
            <code>${_esc(data.recommendation.command)}</code>
            <button class="form-btn form-btn-sm" onclick="navigator.clipboard.writeText('${_esc(data.recommendation.command).replace(/'/g, "\\'")}'); showToast?.('Command copied', 'success', 2000)">📋 Copy</button>
          </div>
        </div>`;
    }
    if (data.ranked?.length) {
      html += `
        <table class="cal-eta-table" style="margin-top:12px">
          <thead><tr><th>Shaper</th><th>Smoothing</th><th>Residual</th></tr></thead>
          <tbody>
            ${data.ranked.map(r => `<tr><td>${_esc(r.name)}</td><td>${r.smoothing}</td><td>${r.residual.toFixed(4)}</td></tr>`).join('')}
          </tbody>
        </table>`;
    }
    if (data.plot?.length) {
      html += `<canvas id="cal-shaper-plot" width="600" height="200" style="margin-top:12px;width:100%;background:var(--bg-tertiary);border-radius:6px"></canvas>`;
    }
    el.innerHTML = html;
    if (data.plot?.length) _drawPlot(data.plot, data.peakFreq);
  }

  function _drawPlot(plot, peakFreq) {
    const canvas = document.getElementById('cal-shaper-plot');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height, pad = 20;
    const maxF = Math.max(...plot.map(p => p.freq));
    const minF = Math.min(...plot.map(p => p.freq));
    const maxV = Math.max(...plot.map(p => p.value)) * 1.1;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, h - pad); ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = '#10b3a4';
    ctx.lineWidth = 2;
    plot.forEach((p, i) => {
      const x = pad + ((p.freq - minF) / (maxF - minF)) * (w - 2 * pad);
      const y = (h - pad) - (p.value / maxV) * (h - 2 * pad);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    // Mark peak
    const peakX = pad + ((peakFreq - minF) / (maxF - minF)) * (w - 2 * pad);
    ctx.strokeStyle = '#ff6b6b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(peakX, pad); ctx.lineTo(peakX, h - pad); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '10px ui-monospace';
    ctx.fillText(`Peak ${peakFreq}Hz`, peakX + 4, pad + 12);
    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`${minF}Hz`, pad, h - 4);
    ctx.fillText(`${maxF}Hz`, w - pad - 30, h - 4);
  }

  // ── Public API ─────────────────────────────────────────────────────

  window.loadCalibrationSuite = _load;
  window._cal = {
    downloadGcode: _downloadGcode,
    copyGcode: _copyGcode,
  };
})();
