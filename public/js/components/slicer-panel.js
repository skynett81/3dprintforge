/**
 * Slicer Panel — drop a model, slice via the user's installed desktop
 * slicer (OrcaSlicer / Bambu Studio / Snapmaker Orca), download or
 * send straight to a connected printer.
 */
(function () {
  'use strict';

  const _state = {
    file: null,
    fileName: '',
    slicers: [],
    profiles: { printers: [], filaments: [], processes: [] },
    selectedSlicer: null,
    selectedPrinter: null,
    selectedFilament: null,
    selectedProcess: null,
    printers: [],   // connected printers from /api/printers
    busy: false,
    lastResult: null,
  };

  const _esc = s => { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; };
  const _toast = (m, t = 'info') => { if (typeof showToast === 'function') showToast(m, t, 3000); };

  async function _load() {
    const body = document.getElementById('overlay-panel-body');
    if (!body) return;
    body.innerHTML = `
      <div class="card" id="slc-card">
        <div class="card-body">
          <h5 style="margin:0 0 8px"><i class="bi bi-cpu"></i> Slicer Bridge</h5>
          <p class="text-muted" style="font-size:0.85rem">Slice STL/3MF via your installed desktop slicer with the same profiles you use day-to-day. The G-code can be downloaded or sent directly to a connected printer.</p>
          <div id="slc-probe" style="margin-bottom:12px"></div>

          <!-- File picker -->
          <div class="pf-drop" id="slc-drop">
            <input type="file" id="slc-file" accept=".stl,.3mf,.obj" style="display:none">
            <strong>Drop a model file here</strong>
            <p class="text-muted" style="font-size:0.78rem">or <a href="#" id="slc-pick" style="color:var(--accent-primary)">click to choose</a></p>
            <p class="text-muted" style="font-size:0.7rem">STL / 3MF / OBJ · up to 100 MB</p>
          </div>

          <!-- Slicer + profile selectors -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:12px">
            <label>Slicer:
              <select id="slc-slicer" class="form-control"></select>
            </label>
            <label>Printer profile:
              <select id="slc-printer" class="form-control"></select>
            </label>
            <label>Filament profile:
              <select id="slc-filament" class="form-control"></select>
            </label>
            <label>Quality preset:
              <select id="slc-process" class="form-control"></select>
            </label>
          </div>

          <!-- Send-to-printer + actions -->
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px">
            <label>Send to printer:
              <select id="slc-target" class="form-control" style="display:inline-block;width:auto"></select>
            </label>
            <label><input type="checkbox" id="slc-print"> Auto-start print</label>
            <button id="slc-go" class="form-btn primary" disabled>Slice &amp; Download</button>
            <button id="slc-go-send" class="form-btn" disabled>Slice &amp; Send to Printer</button>
          </div>

          <div id="slc-status" style="margin-top:12px"></div>
        </div>
      </div>`;

    document.getElementById('slc-pick').onclick = (e) => { e.preventDefault(); document.getElementById('slc-file').click(); };
    document.getElementById('slc-file').onchange = (e) => _selectFile(e.target.files[0]);
    const drop = document.getElementById('slc-drop');
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('pf-drop-over'); };
    drop.ondragleave = () => drop.classList.remove('pf-drop-over');
    drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('pf-drop-over'); _selectFile(e.dataTransfer.files[0]); };

    document.getElementById('slc-slicer').onchange = (e) => _onSlicerChange(e.target.value);
    document.getElementById('slc-go').onclick = () => _runSlice(false);
    document.getElementById('slc-go-send').onclick = () => _runSlice(true);

    await _loadProbe();
    await _loadPrinters();
  }

  async function _loadProbe() {
    try {
      const r = await fetch('/api/slicer/bridge/probe');
      const data = await r.json();
      _state.slicers = data.slicers || [];
      const probeEl = document.getElementById('slc-probe');
      if (!_state.slicers.length) {
        probeEl.innerHTML = '<div class="alert alert-warning"><i class="bi bi-exclamation-triangle"></i> No slicer detected. Install <strong>OrcaSlicer</strong>, <strong>Bambu Studio</strong>, or <strong>Snapmaker Orca</strong> on the server (Flatpak / AppImage / package).</div>';
        return;
      }
      probeEl.innerHTML = `<div class="alert alert-info" style="font-size:0.82rem"><i class="bi bi-check-circle"></i> Detected: ${_state.slicers.map(s => `<strong>${_esc(s.label)}</strong>`).join(' · ')}</div>`;
      const sel = document.getElementById('slc-slicer');
      sel.innerHTML = _state.slicers.map(s => `<option value="${_esc(s.id)}">${_esc(s.label)}</option>`).join('');
      _state.selectedSlicer = _state.slicers[0].id;
      await _loadProfiles(_state.selectedSlicer);
    } catch (e) {
      const probeEl = document.getElementById('slc-probe');
      if (probeEl) probeEl.innerHTML = `<div class="alert alert-danger">Probe failed: ${_esc(e.message)}</div>`;
    }
  }

  async function _onSlicerChange(id) {
    _state.selectedSlicer = id;
    await _loadProfiles(id);
  }

  async function _loadProfiles(slicerId) {
    try {
      const r = await fetch(`/api/slicer/bridge/profiles?slicer=${encodeURIComponent(slicerId)}`);
      const data = await r.json();
      _state.profiles = data.profiles || { printers: [], filaments: [], processes: [] };
      _populateSelect('slc-printer', _state.profiles.printers, 'No printer profile (slicer default)');
      _populateSelect('slc-filament', _state.profiles.filaments, 'No filament profile (slicer default)');
      _populateSelect('slc-process', _state.profiles.processes, 'No quality preset (slicer default)');
    } catch { /* slicer may have no user profiles yet */ }
  }

  function _populateSelect(id, items, emptyLabel) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = `<option value="">${_esc(emptyLabel)}</option>`
      + items.map(p => `<option value="${_esc(p.file)}">${_esc(p.name)}</option>`).join('');
  }

  async function _loadPrinters() {
    try {
      const r = await fetch('/api/printers');
      const list = await r.json();
      _state.printers = Array.isArray(list) ? list : [];
      const sel = document.getElementById('slc-target');
      if (!sel) return;
      sel.innerHTML = '<option value="">— none (download only) —</option>'
        + _state.printers.map(p => `<option value="${_esc(p.id)}">${_esc(p.name)} (${_esc(p.model || p.type || '?')})</option>`).join('');
    } catch { /* ignore */ }
  }

  function _selectFile(file) {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) { _toast('Model too large (max 100 MB)', 'error'); return; }
    _state.file = file;
    _state.fileName = file.name;
    document.getElementById('slc-drop').querySelector('strong').textContent = file.name;
    document.getElementById('slc-go').disabled = false;
    document.getElementById('slc-go-send').disabled = false;
  }

  async function _runSlice(sendToPrinter) {
    if (!_state.file) return;
    if (sendToPrinter && !document.getElementById('slc-target').value) {
      _toast('Pick a target printer first', 'warning'); return;
    }
    const status = document.getElementById('slc-status');
    status.innerHTML = '<em><i class="bi bi-arrow-repeat" style="animation:spin 1s linear infinite"></i> Slicing… (this may take 10–60 s)</em>';
    document.getElementById('slc-go').disabled = true;
    document.getElementById('slc-go-send').disabled = true;

    const params = new URLSearchParams();
    params.set('slicer', _state.selectedSlicer);
    params.set('filename', _state.fileName);
    const printerProfile = document.getElementById('slc-printer').value;
    const filamentProfile = document.getElementById('slc-filament').value;
    const processProfile = document.getElementById('slc-process').value;
    if (printerProfile) params.set('printerProfile', printerProfile);
    if (filamentProfile) params.set('filamentProfile', filamentProfile);
    if (processProfile) params.set('processProfile', processProfile);

    try {
      const buf = await _state.file.arrayBuffer();
      let url, body, expectBinary;
      if (sendToPrinter) {
        params.set('printerId', document.getElementById('slc-target').value);
        if (document.getElementById('slc-print').checked) params.set('print', '1');
        url = `/api/slicer/bridge/slice-and-send?${params.toString()}`;
        expectBinary = false;
      } else {
        url = `/api/slicer/bridge/slice?${params.toString()}`;
        expectBinary = true;
      }
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: buf,
      });
      if (!r.ok) {
        const errBody = await r.json().catch(() => ({}));
        status.innerHTML = `<div style="color:#ef4444"><strong>Slice failed:</strong> ${_esc(errBody.error || r.statusText)}</div>${errBody.log ? `<details style="margin-top:6px"><summary>Slicer log</summary><pre style="font-size:0.7rem;background:rgba(0,0,0,0.05);padding:8px;border-radius:4px;overflow:auto;max-height:240px">${_esc(errBody.log)}</pre></details>` : ''}`;
        return;
      }
      if (expectBinary) {
        const slicer = r.headers.get('X-Slicer');
        const dur = r.headers.get('X-Slice-Duration-Ms');
        const filename = r.headers.get('X-GCode-Filename') || (_state.fileName.replace(/\.[^.]+$/, '') + '.gcode');
        const blob = await r.blob();
        // Trigger download.
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
        status.innerHTML = `<div style="color:#22c55e">✓ Sliced via <strong>${_esc(slicer)}</strong> in ${dur} ms · ${blob.size.toLocaleString()} bytes · downloaded as <code>${_esc(filename)}</code></div>`;
      } else {
        const data = await r.json();
        status.innerHTML = `<div style="color:#22c55e">✓ Sliced via <strong>${_esc(data.slicer)}</strong> in ${data.sliceDurationMs} ms · uploaded <code>${_esc(data.gcodeFilename)}</code> (${data.sizeBytes.toLocaleString()} bytes) to printer${data.printing ? ' and started print 🖨️' : ''}</div>`;
      }
    } catch (e) {
      status.innerHTML = `<div style="color:#ef4444">Failed: ${_esc(e.message)}</div>`;
    } finally {
      document.getElementById('slc-go').disabled = false;
      document.getElementById('slc-go-send').disabled = false;
    }
  }

  window.loadSlicerPanel = _load;
})();
