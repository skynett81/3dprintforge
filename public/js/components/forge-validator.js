// Model Forge — 3MF Validator & Color Matcher
(function() {
  'use strict';

  let _file = null;
  let _validationResult = null;

  window.loadForgeValidator = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    _file = null;
    _validationResult = null;

    el.innerHTML = `<style>
      .fv-layout{display:grid;grid-template-columns:360px 1fr;gap:12px;min-height:500px}
      .fv-sidebar{overflow-y:auto;max-height:calc(100vh - 180px)}
      .fv-form{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:10px;padding:12px}
      .fv-results{overflow-y:auto;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:10px;padding:16px;min-height:400px}
      .fv-drop{border:2px dashed var(--border-color);border-radius:10px;padding:40px 20px;text-align:center;cursor:pointer;transition:border-color 0.2s}
      .fv-drop:hover,.fv-drop.dragover{border-color:var(--accent-blue)}
      .fv-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:600}
      .fv-badge-valid{background:color-mix(in srgb,var(--accent-green) 20%,transparent);color:var(--accent-green)}
      .fv-badge-invalid{background:color-mix(in srgb,var(--accent-red) 20%,transparent);color:var(--accent-red)}
      .fv-section{margin-top:14px;padding-top:10px;border-top:1px solid var(--border-color)}
      .fv-section h5{margin:0 0 8px;font-size:0.82rem}
      .fv-stat{display:flex;justify-content:space-between;padding:3px 0;font-size:0.75rem;border-bottom:1px solid color-mix(in srgb,var(--border-color) 40%,transparent)}
      .fv-stat-label{color:var(--text-muted)}
      .fv-warn{background:color-mix(in srgb,var(--accent-orange) 10%,transparent);border:1px solid var(--accent-orange);border-radius:6px;padding:6px 10px;margin:4px 0;font-size:0.72rem}
      .fv-mesh{background:var(--bg-tertiary,var(--bg-primary));border:1px solid var(--border-color);border-radius:6px;padding:8px;margin:4px 0}
      .fv-swatch{display:inline-block;width:24px;height:24px;border-radius:4px;border:1px solid var(--border-color);vertical-align:middle}
      .fv-color-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid color-mix(in srgb,var(--border-color) 40%,transparent);font-size:0.75rem}
      @media(max-width:900px){.fv-layout{grid-template-columns:1fr}}
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">\u2190 Back</button>
      <h4 style="margin:0;font-size:1rem">\u2705 3MF Validator</h4>
    </div>
    <div class="fv-layout">
      <div class="fv-sidebar"><div class="fv-form">
        <div class="fv-drop" id="fv-drop" onclick="document.getElementById('fv-file').click()">
          <div style="font-size:2rem;margin-bottom:8px">\ud83d\udcc2</div>
          <div style="font-size:0.85rem;color:var(--text-muted)">Drop a .3mf file or click to browse</div>
          <input type="file" id="fv-file" accept=".3mf" style="display:none" onchange="window._fvFileSelected(this)">
        </div>
        <div id="fv-file-info" style="display:none;margin-top:10px;padding:8px;background:var(--bg-tertiary,var(--bg-primary));border-radius:6px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:1.2rem">\ud83d\udce6</span>
            <div>
              <div id="fv-file-name" style="font-size:0.8rem;font-weight:600"></div>
              <div id="fv-file-size" style="font-size:0.7rem;color:var(--text-muted)"></div>
            </div>
          </div>
        </div>
        <div id="fv-actions" style="display:none;margin-top:10px;display:flex;flex-direction:column;gap:6px">
          <button class="form-btn form-btn-sm" data-ripple onclick="window._fvValidate()" style="width:100%;padding:8px 0;background:var(--accent-blue);color:#fff;font-size:0.82rem">\u2705 Validate</button>
          <button class="form-btn form-btn-sm" data-ripple onclick="window._fvMatchColors()" style="width:100%;padding:8px 0;font-size:0.82rem">\ud83c\udfa8 Match Colors</button>
        </div>
      </div></div>
      <div class="fv-results" id="fv-results">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">Upload a 3MF file to validate</div>
      </div>
    </div>`;

    const dz = document.getElementById('fv-drop');
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('dragover'); if (e.dataTransfer.files.length) _handleFile(e.dataTransfer.files[0]); });
  };

  function _handleFile(f) {
    if (!f || !f.name.toLowerCase().endsWith('.3mf')) {
      if (typeof showToast === 'function') showToast('Please select a .3mf file', 'error');
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      if (typeof showToast === 'function') showToast('File too large (max 100MB)', 'error');
      return;
    }
    _file = f;
    _validationResult = null;

    const nameEl = document.getElementById('fv-file-name');
    const sizeEl = document.getElementById('fv-file-size');
    const infoEl = document.getElementById('fv-file-info');
    const actionsEl = document.getElementById('fv-actions');

    if (nameEl) nameEl.textContent = f.name;
    if (sizeEl) sizeEl.textContent = _formatSize(f.size);
    if (infoEl) infoEl.style.display = '';
    if (actionsEl) actionsEl.style.display = '';

    const results = document.getElementById('fv-results');
    if (results) results.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">Click Validate to analyze the file</div>';
  }

  window._fvFileSelected = function(inp) { if (inp.files.length) _handleFile(inp.files[0]); };

  function _formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  window._fvValidate = async function() {
    if (!_file) return;
    const results = document.getElementById('fv-results');
    if (results) results.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">\u23f3 Validating...</div>';

    try {
      const res = await fetch('/api/model-forge/validator/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: _file
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Validation failed');
      const data = await res.json();
      _validationResult = data;
      _renderResults(data);
    } catch (e) {
      if (results) results.innerHTML = `<div style="color:var(--accent-red);padding:20px;text-align:center">\u274c ${_escHtml(e.message)}</div>`;
    }
  };

  function _renderResults(data) {
    const r = document.getElementById('fv-results');
    if (!r) return;

    const isValid = data.valid !== false;
    const warnings = data.warnings || [];
    const meshes = data.meshes || [];
    const extensions = data.extensions || [];
    const metadata = data.metadata || {};
    const hasThumbnail = data.thumbnail === true;

    let html = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <span class="fv-badge ${isValid ? 'fv-badge-valid' : 'fv-badge-invalid'}">${isValid ? '\u2705 Valid' : '\u274c Invalid'}</span>
      <span style="font-size:0.75rem;color:var(--text-muted)">${_file ? _escHtml(_file.name) : ''}</span>
    </div>`;

    // Warnings
    if (warnings.length > 0) {
      html += `<div class="fv-section"><h5>\u26a0\ufe0f Warnings (${warnings.length})</h5>`;
      warnings.forEach(w => { html += `<div class="fv-warn">${_escHtml(typeof w === 'string' ? w : w.message || JSON.stringify(w))}</div>`; });
      html += '</div>';
    }

    // Mesh statistics
    if (meshes.length > 0) {
      html += `<div class="fv-section"><h5>\ud83d\udcca Meshes (${meshes.length})</h5>`;
      meshes.forEach((m, i) => {
        const name = m.name || ('Mesh ' + (i + 1));
        const manifold = m.manifold !== false;
        html += `<div class="fv-mesh">
          <div style="font-size:0.78rem;font-weight:600;margin-bottom:4px">${_escHtml(name)}</div>
          <div class="fv-stat"><span class="fv-stat-label">Vertices</span><span>${(m.vertices || 0).toLocaleString()}</span></div>
          <div class="fv-stat"><span class="fv-stat-label">Triangles</span><span>${(m.triangles || 0).toLocaleString()}</span></div>
          <div class="fv-stat"><span class="fv-stat-label">Manifold</span><span style="color:${manifold ? 'var(--accent-green)' : 'var(--accent-red)'}">${manifold ? 'Yes' : 'No'}</span></div>
          ${m.volume != null ? `<div class="fv-stat"><span class="fv-stat-label">Volume</span><span>${parseFloat(m.volume).toFixed(2)} mm\u00b3</span></div>` : ''}
        </div>`;
      });
      html += '</div>';
    } else if (data.meshCount != null) {
      html += `<div class="fv-section"><h5>\ud83d\udcca Mesh Summary</h5>`;
      html += `<div class="fv-stat"><span class="fv-stat-label">Mesh count</span><span>${data.meshCount}</span></div>`;
      if (data.totalVertices != null) html += `<div class="fv-stat"><span class="fv-stat-label">Total vertices</span><span>${data.totalVertices.toLocaleString()}</span></div>`;
      if (data.totalTriangles != null) html += `<div class="fv-stat"><span class="fv-stat-label">Total triangles</span><span>${data.totalTriangles.toLocaleString()}</span></div>`;
      html += '</div>';
    }

    // Extensions
    if (extensions.length > 0) {
      html += `<div class="fv-section"><h5>\ud83e\udde9 Extensions (${extensions.length})</h5>`;
      extensions.forEach(ext => {
        const name = typeof ext === 'string' ? ext : (ext.namespace || ext.name || JSON.stringify(ext));
        html += `<div style="font-size:0.72rem;padding:3px 8px;margin:2px 0;background:var(--bg-tertiary,var(--bg-primary));border-radius:4px">${_escHtml(name)}</div>`;
      });
      html += '</div>';
    }

    // Metadata
    const metaKeys = Object.keys(metadata);
    if (metaKeys.length > 0) {
      html += `<div class="fv-section"><h5>\ud83d\udcdd Metadata</h5>`;
      metaKeys.forEach(k => {
        html += `<div class="fv-stat"><span class="fv-stat-label">${_escHtml(k)}</span><span style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_escHtml(String(metadata[k]))}</span></div>`;
      });
      html += '</div>';
    }

    // Thumbnail
    html += `<div class="fv-section"><h5>\ud83d\uddbc\ufe0f Thumbnail</h5>`;
    html += `<div style="font-size:0.75rem;color:var(--text-muted)">${hasThumbnail ? '\u2705 Present' : '\u274c Not found'}</div>`;
    html += '</div>';

    r.innerHTML = html;
  }

  window._fvMatchColors = async function() {
    if (!_file) return;
    const results = document.getElementById('fv-results');
    if (results) results.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">\u23f3 Matching colors...</div>';

    try {
      const res = await fetch('/api/model-forge/color-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: _file
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Color match failed');
      const data = await res.json();
      _renderColorMatch(data);
    } catch (e) {
      if (results) results.innerHTML = `<div style="color:var(--accent-red);padding:20px;text-align:center">\u274c ${_escHtml(e.message)}</div>`;
    }
  };

  function _renderColorMatch(data) {
    const r = document.getElementById('fv-results');
    if (!r) return;

    const colors = data.colors || [];
    const matches = data.matches || [];

    let html = '<h5 style="margin:0 0 10px;font-size:0.88rem">\ud83c\udfa8 Color Analysis</h5>';

    if (colors.length > 0) {
      html += '<div style="margin-bottom:12px"><div style="font-size:0.78rem;font-weight:600;margin-bottom:6px">Extracted Colors</div>';
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap">';
      colors.forEach(c => {
        const hex = typeof c === 'string' ? c : (c.hex || _rgbToHex(c));
        html += `<div style="text-align:center"><div class="fv-swatch" style="background:${_escHtml(hex)}"></div><div style="font-size:0.6rem;color:var(--text-muted);margin-top:2px">${_escHtml(hex)}</div></div>`;
      });
      html += '</div></div>';
    }

    if (matches.length > 0) {
      html += '<div><div style="font-size:0.78rem;font-weight:600;margin-bottom:6px">Matched Spools</div>';
      matches.forEach(m => {
        const srcHex = typeof m.sourceColor === 'string' ? m.sourceColor : (m.sourceColor?.hex || '#888');
        const spoolHex = m.spoolColor || m.spool?.color || '#888';
        const spoolName = m.spoolName || m.spool?.name || 'Unknown spool';
        const distance = m.distance != null ? m.distance.toFixed(1) : '?';
        html += `<div class="fv-color-row">
          <div class="fv-swatch" style="background:${_escHtml(srcHex)}"></div>
          <span>\u2192</span>
          <div class="fv-swatch" style="background:${_escHtml(spoolHex)}"></div>
          <div style="flex:1">
            <div style="font-size:0.75rem">${_escHtml(spoolName)}</div>
            <div style="font-size:0.65rem;color:var(--text-muted)">\u0394E = ${distance}</div>
          </div>
        </div>`;
      });
      html += '</div>';
    }

    if (colors.length === 0 && matches.length === 0) {
      html += '<div style="color:var(--text-muted);font-size:0.8rem">No colors found in this 3MF file.</div>';
    }

    r.innerHTML = html;
  }

  function _rgbToHex(c) {
    const r = Math.round(c.r || 0);
    const g = Math.round(c.g || 0);
    const b = Math.round(c.b || 0);
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function _escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();
