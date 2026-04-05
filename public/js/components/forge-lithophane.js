// Model Forge — Lithophane Generator
(function() {
  'use strict';

  let _imageData = null; // { buffer: ArrayBuffer, dataUrl: string, name: string }

  window.loadForgeLithophane = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .litho-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:500px; }
      .litho-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); padding-right:4px; }
      .litho-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .litho-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:400px; }
      .litho-drop { border:2px dashed var(--border-color); border-radius:10px; padding:30px; text-align:center; cursor:pointer; transition:border-color 0.2s; }
      .litho-drop:hover, .litho-drop.dragover { border-color:var(--accent-blue); background:color-mix(in srgb, var(--accent-blue) 5%, transparent); }
      .litho-img-preview { max-width:100%; max-height:200px; border-radius:6px; margin-top:8px; }
      @media (max-width:900px) { .litho-layout { grid-template-columns:1fr; } .litho-sidebar { max-height:none; } }
    </style>

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🖼️ Lithophane Generator</h4>
    </div>

    <div class="litho-layout">
      <div class="litho-sidebar">
        <div class="litho-form">
          <div class="litho-drop" id="litho-dropzone" onclick="document.getElementById('litho-file-input').click()">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin-bottom:8px"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <div style="font-size:0.85rem;color:var(--text-muted)">Drop image here or click to upload</div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">PNG supported (max 10 MB)</div>
            <input type="file" id="litho-file-input" accept="image/png,image/jpeg" style="display:none" onchange="window._lithoFileSelected(this)">
          </div>
          <div id="litho-img-container" style="display:none;text-align:center;margin-top:8px">
            <img id="litho-img-thumb" class="litho-img-preview" alt="Preview">
            <div id="litho-img-info" style="font-size:0.72rem;color:var(--text-muted);margin-top:4px"></div>
          </div>

          <div style="margin-top:14px;border-top:1px solid var(--border-color);padding-top:12px">
            <h5 style="margin:0 0 10px;font-size:0.88rem">Settings</h5>

            <div style="margin-bottom:10px">
              <label style="font-size:0.75rem;color:var(--text-muted)">Shape</label>
              <select class="form-input" id="litho-shape" style="font-size:0.82rem" onchange="window._lithoUpdatePreview()">
                <option value="flat" selected>Flat panel</option>
                <option value="curved">Curved arc</option>
                <option value="cylinder">Full cylinder</option>
              </select>
            </div>

            ${_rangeField('Width (mm)', 'litho-width', 40, 200, 100, 5)}
            ${_rangeField('Max thickness (mm)', 'litho-max-thick', 1, 6, 3, 0.5)}
            ${_rangeField('Min thickness (mm)', 'litho-min-thick', 0.2, 1.5, 0.4, 0.1)}
            ${_rangeField('Resolution (max pixels)', 'litho-resolution', 50, 300, 150, 10)}
            ${_rangeField('Gamma', 'litho-gamma', 0.3, 3.0, 1.0, 0.1)}

            <div id="litho-curve-opts" style="display:none">
              ${_rangeField('Curve radius (mm)', 'litho-curve-radius', 30, 150, 60, 5)}
            </div>

            <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:8px 0">
              <input type="checkbox" id="litho-invert"> Invert brightness
            </label>
            <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:8px 0">
              <input type="checkbox" id="litho-frame"> Add frame border
            </label>
            <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:8px 0">
              <input type="checkbox" id="litho-base"> Add standing base
            </label>
          </div>
        </div>
      </div>

      <div class="litho-preview" id="litho-result">
        <div style="color:var(--text-muted);font-size:0.85rem">Upload an image to get started</div>
      </div>
    </div>`;

    // Wire up drag-and-drop
    const dz = document.getElementById('litho-dropzone');
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', e => {
      e.preventDefault(); dz.classList.remove('dragover');
      if (e.dataTransfer.files.length) _handleFile(e.dataTransfer.files[0]);
    });

    // Shape toggle for curve options
    document.getElementById('litho-shape').addEventListener('change', () => {
      const v = document.getElementById('litho-shape').value;
      document.getElementById('litho-curve-opts').style.display = v === 'curved' || v === 'cylinder' ? '' : 'none';
    });

    // Auto-update on setting changes
    const form = document.querySelector('.litho-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._lithoDebounce); window._lithoDebounce = setTimeout(() => window._lithoUpdatePreview(), 300); });
      form.addEventListener('change', () => window._lithoUpdatePreview());
    }
  };

  function _handleFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      if (typeof showToast === 'function') showToast('Image too large (max 10 MB)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      _imageData = { buffer: reader.result, name: file.name, dataUrl: URL.createObjectURL(file) };
      const thumb = document.getElementById('litho-img-thumb');
      const container = document.getElementById('litho-img-container');
      const info = document.getElementById('litho-img-info');
      if (thumb && container) {
        thumb.src = _imageData.dataUrl;
        container.style.display = '';
        // Get dimensions after load
        thumb.onload = () => {
          if (info) info.textContent = `${thumb.naturalWidth}×${thumb.naturalHeight} — ${(file.size / 1024).toFixed(1)} KB`;
          window._lithoUpdatePreview();
        };
      }
    };
    reader.readAsArrayBuffer(file);
  }

  window._lithoFileSelected = function(input) {
    if (input.files.length) _handleFile(input.files[0]);
  };

  window._lithoUpdatePreview = function() {
    const result = document.getElementById('litho-result');
    if (!result || !_imageData) return;

    const shape = document.getElementById('litho-shape')?.value || 'flat';
    const width = parseFloat(document.getElementById('litho-width')?.value) || 100;
    const maxT = parseFloat(document.getElementById('litho-max-thick')?.value) || 3;

    const thumb = document.getElementById('litho-img-thumb');
    const aspect = thumb ? thumb.naturalHeight / thumb.naturalWidth : 0.75;
    const previewW = Math.min(400, result.clientWidth - 40);
    const previewH = Math.round(previewW * aspect);

    result.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._lithoGenerate3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._lithoDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin:4px 0">${shape} — ${width}mm wide, ${maxT}mm max thickness</div>
      <div style="position:relative;width:${previewW}px;height:${previewH}px;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.3)">
        <img src="${_imageData.dataUrl}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(1)${document.getElementById('litho-invert')?.checked ? ' invert(1)' : ''}">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:4px 8px;background:rgba(0,0,0,0.6);font-size:0.7rem;color:#fff;text-align:center">
          Lithophane preview (grayscale = thickness)
        </div>
      </div>`;
  };

  function _buildParams() {
    const params = new URLSearchParams();
    params.set('shape', document.getElementById('litho-shape')?.value || 'flat');
    params.set('width', document.getElementById('litho-width')?.value || '100');
    params.set('maxThickness', document.getElementById('litho-max-thick')?.value || '3');
    params.set('minThickness', document.getElementById('litho-min-thick')?.value || '0.4');
    params.set('resolution', document.getElementById('litho-resolution')?.value || '150');
    params.set('gamma', document.getElementById('litho-gamma')?.value || '1.0');
    params.set('invert', document.getElementById('litho-invert')?.checked ? 'true' : 'false');
    params.set('frame', document.getElementById('litho-frame')?.checked ? 'true' : 'false');
    params.set('frameWidth', '3');
    params.set('base', document.getElementById('litho-base')?.checked ? 'true' : 'false');
    params.set('baseHeight', '8');
    params.set('curveRadius', document.getElementById('litho-curve-radius')?.value || '60');
    return params;
  }

  window._lithoDownload = async function() {
    if (!_imageData) { if (typeof showToast === 'function') showToast('Upload an image first', 'error'); return; }
    try {
      if (typeof showToast === 'function') showToast('Generating lithophane 3MF...', 'info');
      const params = _buildParams();
      const res = await fetch(`/api/model-forge/lithophane/generate-3mf?${params}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: _imageData.buffer
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Generation failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (_imageData.name || 'lithophane').replace(/\.[^.]+$/, '') + '_lithophane.3mf';
      a.click();
      URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('Lithophane 3MF downloaded!', 'success');
    } catch (e) {
      if (typeof showToast === 'function') showToast(e.message, 'error');
    }
  };

  window._lithoGenerate3D = async function() {
    if (!_imageData) { if (typeof showToast === 'function') showToast('Upload an image first', 'error'); return; }
    const result = document.getElementById('litho-result');
    if (result) result.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D preview...</div>';

    try {
      const params = _buildParams();
      const res = await fetch(`/api/model-forge/lithophane/generate-3mf?${params}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: _imageData.buffer
      });
      if (!res.ok) throw new Error('Generation failed');
      const blob = await res.blob();
      const file = new File([blob], 'lithophane.3mf', { type: 'application/octet-stream' });

      if (typeof window._g3dHandleFile === 'function') {
        window._g3dHandleFile(file);
      } else if (typeof window.open3mfViewer === 'function') {
        const url = URL.createObjectURL(blob);
        window.open3mfViewer(url, 'Lithophane — 3D Preview');
      }

      // Restore preview when viewer closes
      const obs = new MutationObserver(() => {
        if (!document.getElementById('_global-3d-overlay')) {
          obs.disconnect();
          window._lithoUpdatePreview();
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      if (result) result.innerHTML = '<div style="padding:20px;color:var(--accent-red)">' + e.message + '</div>';
    }
  };

  function _rangeField(label, id, min, max, val, step) {
    return `<div style="margin-bottom:5px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <label style="font-size:0.7rem;color:var(--text-muted)">${label}</label>
        <input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value">
      </div>
      <input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value">
    </div>`;
  }
})();
