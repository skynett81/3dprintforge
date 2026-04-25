/**
 * G-code Reference Explorer + Time/Cost Estimator
 *
 * Two-tab panel:
 *   1. Reference  — searchable M/G-code database with firmware filter
 *   2. Estimator  — drop a .gcode file, get print time + filament weight + cost
 */
(function () {
  'use strict';

  const _state = {
    tab: 'reference',
    query: '',
    category: '',
    firmware: '',
    commands: [],
    categories: [],
    firmwares: [],
    estimateBusy: false,
    estimate: null,
    fileName: '',
  };

  function _esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }
  function _toast(m, t = 'info') { if (typeof showToast === 'function') showToast(m, t, 3000); }

  function _activeCurrency() {
    if (typeof window.currency?.active === 'string') return window.currency.active;
    return 'USD';
  }

  function _formatMoney(amount, currency) {
    if (typeof window.formatCurrency === 'function') return window.formatCurrency(Number(amount));
    if (typeof window.currency?.format === 'function') return window.currency.format(Number(amount), currency);
    return `${Number(amount).toFixed(2)} ${currency}`;
  }

  function _load() {
    const body = document.getElementById('overlay-panel-body');
    if (!body) return;
    body.innerHTML = `
      <div class="pf-tabs">
        <button class="form-btn pf-tab ${_state.tab === 'reference' ? 'active' : ''}" data-tab="reference">📖 Reference</button>
        <button class="form-btn pf-tab ${_state.tab === 'estimate' ? 'active' : ''}" data-tab="estimate">⏱️ Time &amp; Cost Estimator</button>
      </div>
      <div id="gr-content" class="pf-content"></div>
    `;
    body.querySelectorAll('.pf-tab').forEach(b => b.onclick = () => { _state.tab = b.dataset.tab; _load(); });
    if (_state.tab === 'reference') _renderReference();
    else _renderEstimator();
  }

  // ── Reference tab ─────────────────────────────────────────────────

  async function _renderReference() {
    const c = document.getElementById('gr-content');
    if (!c) return;
    c.innerHTML = `
      <div class="card">
        <div class="card-body">
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px">
            <input type="search" id="gr-q" placeholder="Search code, description, parameter…" class="form-control" style="flex:1;min-width:240px" value="${_esc(_state.query)}">
            <select id="gr-cat" class="form-control" style="width:auto">
              <option value="">All categories</option>
            </select>
            <select id="gr-fw" class="form-control" style="width:auto">
              <option value="">All firmwares</option>
            </select>
          </div>
          <div id="gr-table" style="font-size:0.85rem"><em>Loading…</em></div>
        </div>
      </div>`;
    document.getElementById('gr-q').oninput = (e) => { _state.query = e.target.value; _fetchReference(); };
    document.getElementById('gr-cat').onchange = (e) => { _state.category = e.target.value; _fetchReference(); };
    document.getElementById('gr-fw').onchange = (e) => { _state.firmware = e.target.value; _fetchReference(); };
    await _fetchReference();
  }

  async function _fetchReference() {
    const params = new URLSearchParams();
    if (_state.query) params.set('q', _state.query);
    if (_state.category) params.set('category', _state.category);
    if (_state.firmware) params.set('firmware', _state.firmware);
    try {
      const r = await fetch(`/api/gcode/reference?${params.toString()}`);
      const data = await r.json();
      _state.commands = data.commands || [];
      _state.categories = data.categories || [];
      _state.firmwares = data.firmwares || [];
      _renderRefTable();
    } catch (e) {
      const t = document.getElementById('gr-table');
      if (t) t.innerHTML = `<span style="color:#ef4444">Failed to load: ${_esc(e.message)}</span>`;
    }
  }

  function _renderRefTable() {
    const catSel = document.getElementById('gr-cat');
    const fwSel = document.getElementById('gr-fw');
    if (catSel && catSel.options.length <= 1) {
      _state.categories.forEach(cat => {
        const o = document.createElement('option');
        o.value = cat; o.textContent = cat;
        if (cat === _state.category) o.selected = true;
        catSel.appendChild(o);
      });
    }
    if (fwSel && fwSel.options.length <= 1) {
      _state.firmwares.forEach(fw => {
        const o = document.createElement('option');
        o.value = fw; o.textContent = fw;
        if (fw === _state.firmware) o.selected = true;
        fwSel.appendChild(o);
      });
    }
    const t = document.getElementById('gr-table');
    if (!t) return;
    if (_state.commands.length === 0) {
      t.innerHTML = '<em>No matches.</em>';
      return;
    }
    let html = '<table class="table table-sm"><thead><tr>'
      + '<th style="width:90px">Code</th>'
      + '<th>Description</th>'
      + '<th style="width:80px">Category</th>'
      + '<th style="width:140px">Firmwares</th>'
      + '<th style="width:200px">Example</th>'
      + '</tr></thead><tbody>';
    for (const cmd of _state.commands) {
      const params = Object.entries(cmd.params || {})
        .map(([k, v]) => `<code>${_esc(k)}</code> = ${_esc(v)}`).join('<br>');
      html += `<tr>
        <td><strong><code>${_esc(cmd.code)}</code></strong></td>
        <td>${_esc(cmd.desc)}${params ? `<details style="margin-top:4px"><summary style="cursor:pointer;font-size:0.78rem;opacity:0.75">params</summary><div style="font-size:0.78rem;margin-top:4px">${params}</div></details>` : ''}</td>
        <td>${_esc(cmd.category)}</td>
        <td>${(cmd.firmwares || []).map(f => `<span class="badge" style="background:rgba(59,130,246,0.15);color:var(--accent-blue);margin-right:2px">${_esc(f)}</span>`).join('')}</td>
        <td><code style="font-size:0.78rem">${_esc(cmd.example || '')}</code></td>
      </tr>`;
    }
    html += '</tbody></table>';
    t.innerHTML = html;
  }

  // ── Estimator tab ─────────────────────────────────────────────────

  function _renderEstimator() {
    const c = document.getElementById('gr-content');
    if (!c) return;
    c.innerHTML = `
      <div class="card">
        <div class="card-body">
          <div class="pf-drop" id="gr-drop">
            <input type="file" id="gr-file" accept=".gcode,.bgcode,.gco,.g" style="display:none">
            <strong>Drop a .gcode file here</strong>
            <p class="text-muted" style="font-size:0.78rem">or <a href="#" id="gr-pick" style="color:var(--accent-primary)">click to choose a file</a></p>
            <p class="text-muted" style="font-size:0.7rem">Up to 50 MB · Marlin / Klipper / Bambu / RepRap</p>
          </div>
          <div style="margin-top:1rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px">
            <label>Filament Ø (mm):
              <input type="number" id="gr-diam" class="form-control" step="0.05" value="1.75">
            </label>
            <label>Density (g/cm³):
              <input type="number" id="gr-density" class="form-control" step="0.01" value="1.24">
            </label>
            <label>Price (per kg, ${_esc(_activeCurrency())}):
              <input type="number" id="gr-price" class="form-control" step="0.5" value="25">
            </label>
            <label>Max acceleration (mm/s²):
              <input type="number" id="gr-accel" class="form-control" step="100" value="1500">
            </label>
          </div>
          <button id="gr-estimate-go" class="form-btn primary" style="margin-top:1rem" disabled>Run estimate</button>
          <div id="gr-result" style="margin-top:1rem"></div>
        </div>
      </div>`;
    const drop = document.getElementById('gr-drop');
    const input = document.getElementById('gr-file');
    document.getElementById('gr-pick').onclick = (e) => { e.preventDefault(); input.click(); };
    input.onchange = () => _selectFile(input.files[0]);
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('pf-drop-over'); };
    drop.ondragleave = () => drop.classList.remove('pf-drop-over');
    drop.ondrop = (e) => {
      e.preventDefault();
      drop.classList.remove('pf-drop-over');
      _selectFile(e.dataTransfer.files[0]);
    };
    document.getElementById('gr-estimate-go').onclick = _runEstimate;
  }

  function _selectFile(file) {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { _toast('File too large (max 50 MB)', 'error'); return; }
    _state.fileName = file.name;
    _state.estimateFile = file;
    document.getElementById('gr-estimate-go').disabled = false;
    const drop = document.getElementById('gr-drop');
    drop.querySelector('strong').textContent = file.name;
  }

  async function _runEstimate() {
    if (!_state.estimateFile) return;
    const params = new URLSearchParams();
    params.set('filamentDiameterMm', document.getElementById('gr-diam').value);
    params.set('filamentDensityGcm3', document.getElementById('gr-density').value);
    params.set('filamentPricePerKg', document.getElementById('gr-price').value);
    params.set('maxAcceleration', document.getElementById('gr-accel').value);
    params.set('filamentCurrency', _activeCurrency());
    const result = document.getElementById('gr-result');
    result.innerHTML = '<em>Estimating…</em>';
    try {
      const buf = await _state.estimateFile.arrayBuffer();
      const r = await fetch(`/api/gcode/estimate?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: buf,
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        result.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(err.error || r.statusText)}</span>`;
        return;
      }
      _state.estimate = await r.json();
      _renderEstimateResult();
    } catch (e) {
      result.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(e.message)}</span>`;
    }
  }

  function _renderEstimateResult() {
    const r = document.getElementById('gr-result');
    const e = _state.estimate;
    if (!r || !e) return;
    const sl = e.slicerHeader || {};
    const cmpLine = e.estimateVsSlicer !== null
      ? `<div style="font-size:0.8rem;opacity:0.7">Slicer estimate: <strong>${e.slicerHeader?.slicerTimeSeconds ? `${Math.round(e.slicerHeader.slicerTimeSeconds / 60)} min` : '—'}</strong> · diff <strong>${e.estimateVsSlicer >= 0 ? '+' : ''}${e.estimateVsSlicer}%</strong></div>`
      : '';
    r.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem">
        <div class="spark-panel">
          <span class="spark-label"><i class="bi bi-clock"></i> Print time</span>
          <span class="spark-value" style="color:var(--accent-blue)">${_esc(e.timeFormatted)}</span>
        </div>
        <div class="spark-panel">
          <span class="spark-label"><i class="bi bi-stack"></i> Layers</span>
          <span class="spark-value">${e.layerCount.toLocaleString()}</span>
        </div>
        <div class="spark-panel">
          <span class="spark-label"><i class="bi bi-droplet-fill"></i> Filament</span>
          <span class="spark-value" style="color:var(--accent-orange)">${e.weightG.toFixed(2)} g</span>
        </div>
        <div class="spark-panel">
          <span class="spark-label"><i class="bi bi-rulers"></i> Length</span>
          <span class="spark-value">${(e.extrudeLengthMm / 1000).toFixed(2)} m</span>
        </div>
        <div class="spark-panel">
          <span class="spark-label"><i class="bi bi-cash-coin"></i> Cost</span>
          <span class="spark-value" style="color:var(--accent-green)">${_esc(_formatMoney(e.cost, e.currency))}</span>
        </div>
        <div class="spark-panel">
          <span class="spark-label"><i class="bi bi-bounding-box"></i> Build size</span>
          <span class="spark-value" style="font-size:0.85rem">${e.bbox.max[0] != null ? `${(e.bbox.max[0] - e.bbox.min[0]).toFixed(0)}×${(e.bbox.max[1] - e.bbox.min[1]).toFixed(0)}×${(e.bbox.max[2] - e.bbox.min[2]).toFixed(0)} mm` : '—'}</span>
        </div>
      </div>
      ${cmpLine}
      <details style="margin-top:1rem">
        <summary style="cursor:pointer">Detailed report</summary>
        <pre style="background:rgba(0,0,0,0.05);padding:8px;border-radius:4px;font-size:0.75rem;overflow:auto">${_esc(JSON.stringify(e, null, 2))}</pre>
      </details>`;
  }

  window.loadGcodeReference = _load;
})();
