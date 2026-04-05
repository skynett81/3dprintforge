// Model Forge — Image Relief / Stamp Generator
(function() {
  'use strict';
  let _imgData = null;

  window.loadForgeRelief = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .rel-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:500px; }
      .rel-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); }
      .rel-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .rel-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:400px; }
      .rel-drop { border:2px dashed var(--border-color); border-radius:10px; padding:30px; text-align:center; cursor:pointer; transition:border-color 0.2s; }
      .rel-drop:hover,.rel-drop.dragover { border-color:var(--accent-blue); }
      @media (max-width:900px) { .rel-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🗿 Image Relief / Stamp Generator</h4>
    </div>
    <div class="rel-layout">
      <div class="rel-sidebar"><div class="rel-form" id="rel-form">
        <div class="rel-drop" id="rel-drop" onclick="document.getElementById('rel-file').click()">
          <div style="font-size:0.85rem;color:var(--text-muted)">Drop image or click to upload (PNG)</div>
          <input type="file" id="rel-file" accept="image/png,image/jpeg" style="display:none" onchange="window._relFile(this)">
        </div>
        <div id="rel-thumb-box" style="display:none;text-align:center;margin-top:8px"><img id="rel-thumb" style="max-width:100%;max-height:150px;border-radius:6px"></div>
        <div style="margin-top:12px;border-top:1px solid var(--border-color);padding-top:10px">
          ${_rf('Width (mm)', 'rel-w', 20, 200, 80, 5)}
          ${_rf('Max relief height (mm)', 'rel-relief', 0.5, 8, 3, 0.5)}
          ${_rf('Base thickness (mm)', 'rel-base', 1, 5, 2, 0.5)}
          ${_rf('Resolution', 'rel-res', 30, 250, 150, 10)}
          ${_rf('Gamma', 'rel-gamma', 0.3, 3.0, 1.0, 0.1)}
          <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0"><input type="checkbox" id="rel-invert"> Invert (dark = raised)</label>
          <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0"><input type="checkbox" id="rel-mirror"> Mirror (for stamps)</label>
          <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0"><input type="checkbox" id="rel-border"> Add border frame</label>
        </div>
      </div></div>
      <div class="rel-preview" id="rel-result"><div style="color:var(--text-muted)">Upload an image to get started</div></div>
    </div>`;

    const dz = document.getElementById('rel-drop');
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('dragover'); if (e.dataTransfer.files.length) _handleFile(e.dataTransfer.files[0]); });
    const form = document.getElementById('rel-form');
    if (form) { form.addEventListener('input', () => { clearTimeout(window._relD); window._relD = setTimeout(_up, 300); }); form.addEventListener('change', _up); }
  };

  function _handleFile(f) {
    if (!f || f.size > 10*1024*1024) return;
    const reader = new FileReader();
    reader.onload = () => { _imgData = { buffer: reader.result, url: URL.createObjectURL(f), name: f.name };
      const t = document.getElementById('rel-thumb'); if (t) { t.src = _imgData.url; document.getElementById('rel-thumb-box').style.display = ''; t.onload = _up; }
    };
    reader.readAsArrayBuffer(f);
  }
  window._relFile = function(inp) { if (inp.files.length) _handleFile(inp.files[0]); };

  function _up() {
    const r = document.getElementById('rel-result');
    if (!r || !_imgData) return;
    const w = parseFloat(document.getElementById('rel-w')?.value) || 80;
    const relief = parseFloat(document.getElementById('rel-relief')?.value) || 3;
    const t = document.getElementById('rel-thumb');
    const aspect = t ? t.naturalHeight / t.naturalWidth : 0.75;
    const pw = Math.min(350, r.clientWidth - 40);
    const ph = Math.round(pw * aspect);

    r.innerHTML = `
      <div style="display:flex;gap:6px;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._relPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._relDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted)">${w}mm wide, ${relief}mm max relief${document.getElementById('rel-mirror')?.checked ? ' (stamp mode)' : ''}</div>
      <div style="width:${pw}px;height:${ph}px;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.3);position:relative">
        <img src="${_imgData.url}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(0.8)${document.getElementById('rel-invert')?.checked ? ' invert(1)' : ''}${document.getElementById('rel-mirror')?.checked ? ' scaleX(-1)' : ''}">
        <div style="position:absolute;bottom:0;left:0;right:0;padding:3px 8px;background:rgba(0,0,0,0.6);font-size:0.65rem;color:#fff;text-align:center">Brightness → height</div>
      </div>`;
  }

  function _params() {
    return new URLSearchParams({ width: document.getElementById('rel-w')?.value || '80', maxRelief: document.getElementById('rel-relief')?.value || '3',
      baseThickness: document.getElementById('rel-base')?.value || '2', resolution: document.getElementById('rel-res')?.value || '150',
      gamma: document.getElementById('rel-gamma')?.value || '1.0', invert: document.getElementById('rel-invert')?.checked ? 'true' : 'false',
      mirror: document.getElementById('rel-mirror')?.checked ? 'true' : 'false', border: document.getElementById('rel-border')?.checked ? 'true' : 'false' });
  }

  async function _gen() {
    const res = await fetch(`/api/model-forge/relief/generate-3mf?${_params()}`, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: _imgData.buffer });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._relDownload = async function() {
    if (!_imgData) return;
    try { if (typeof showToast === 'function') showToast('Generating...', 'info');
      const blob = await _gen(); const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = (_imgData.name || 'relief').replace(/\.[^.]+$/, '') + '_relief.3mf'; a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._relPreview3D = async function() {
    if (!_imgData) return;
    const r = document.getElementById('rel-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try { const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'relief.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Relief');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
