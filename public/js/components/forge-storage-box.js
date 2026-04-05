// Model Forge — Storage Box Generator
(function() {
  'use strict';

  window.loadForgeStorageBox = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .sbox-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:500px; }
      .sbox-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); padding-right:4px; }
      .sbox-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .sbox-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:400px; }
      @media (max-width:900px) { .sbox-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">📦 Storage Box Generator</h4>
    </div>
    <div class="sbox-layout">
      <div class="sbox-sidebar"><div class="sbox-form" id="sbox-form">
        <h5 style="margin:0 0 10px;font-size:0.88rem">Dimensions</h5>
        ${_rf('Width (mm)', 'sbox-w', 20, 300, 80, 5)}
        ${_rf('Depth (mm)', 'sbox-d', 20, 300, 60, 5)}
        ${_rf('Height (mm)', 'sbox-h', 10, 150, 40, 5)}
        ${_rf('Wall thickness (mm)', 'sbox-wall', 0.8, 4, 1.6, 0.4)}
        ${_rf('Bottom thickness (mm)', 'sbox-bottom', 0.4, 4, 1.2, 0.4)}

        <h5 style="margin:14px 0 10px;font-size:0.88rem">Dividers</h5>
        ${_rf('Dividers X', 'sbox-divx', 0, 10, 0, 1)}
        ${_rf('Dividers Y', 'sbox-divy', 0, 10, 0, 1)}
        ${_rf('Divider thickness (mm)', 'sbox-divt', 0.8, 3, 1.2, 0.4)}

        <h5 style="margin:14px 0 10px;font-size:0.88rem">Options</h5>
        <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0">
          <input type="checkbox" id="sbox-stack"> Stackable lip
        </label>
        <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0">
          <input type="checkbox" id="sbox-grid"> Gridfinity compatible (42mm grid)
        </label>
        <div id="sbox-grid-opts" style="display:none;margin-top:6px">
          ${_rf('Grid units X', 'sbox-gx', 1, 8, 2, 1)}
          ${_rf('Grid units Y', 'sbox-gy', 1, 8, 2, 1)}
        </div>
        <div style="margin-top:6px">
          <label style="font-size:0.75rem;color:var(--text-muted)">Label (optional)</label>
          <input type="text" class="form-input" id="sbox-label" placeholder="e.g. Screws M3" style="font-size:0.82rem">
        </div>
      </div></div>
      <div class="sbox-preview" id="sbox-result">
        <div style="color:var(--text-muted);font-size:0.85rem">Configure your box and generate</div>
      </div>
    </div>`;

    document.getElementById('sbox-grid')?.addEventListener('change', () => {
      document.getElementById('sbox-grid-opts').style.display = document.getElementById('sbox-grid')?.checked ? '' : 'none';
    });

    const form = document.getElementById('sbox-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._sboxDebounce); window._sboxDebounce = setTimeout(_updatePreview, 300); });
      form.addEventListener('change', _updatePreview);
    }
    setTimeout(_updatePreview, 100);
  };

  function _updatePreview() {
    const result = document.getElementById('sbox-result');
    if (!result) return;
    const p = _params();
    const scale = Math.min(3, 300 / Math.max(p.width, p.depth));
    const pw = Math.round(p.width * scale), pd = Math.round(p.depth * scale * 0.6), ph = Math.round(p.height * scale * 0.4);

    let divHtml = '';
    for (let i = 1; i <= p.dividersX; i++) {
      const x = Math.round((pw / (p.dividersX + 1)) * i);
      divHtml += `<div style="position:absolute;left:${x}px;top:0;width:1px;height:100%;background:rgba(255,255,255,0.3)"></div>`;
    }
    for (let i = 1; i <= p.dividersY; i++) {
      const y = Math.round((pd / (p.dividersY + 1)) * i);
      divHtml += `<div style="position:absolute;left:0;top:${y}px;width:100%;height:1px;background:rgba(255,255,255,0.3)"></div>`;
    }

    result.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._sboxPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._sboxDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin:4px 0">${p.width}×${p.depth}×${p.height}mm${p.gridfinity ? ' (Gridfinity)' : ''}${p.stackable ? ' + stackable' : ''}</div>
      <div style="perspective:400px">
        <div style="width:${pw}px;height:${pd + ph}px;position:relative;transform:rotateX(20deg)">
          <div style="position:absolute;bottom:0;width:${pw}px;height:${pd}px;background:#6490b4;border:2px solid #4a7090;border-radius:2px;box-shadow:0 4px 20px rgba(0,0,0,0.3);overflow:hidden">${divHtml}</div>
          <div style="position:absolute;bottom:${pd - 2}px;width:${pw}px;height:${ph}px;background:linear-gradient(180deg,#7aa8cc,#6490b4);border:2px solid #4a7090;border-bottom:none;border-radius:2px 2px 0 0"></div>
          ${p.stackable ? '<div style="position:absolute;bottom:' + (pd + ph - 4) + 'px;width:' + (pw - 4) + 'px;height:3px;background:#5580a0;border:1px solid #4a7090;left:2px;border-radius:1px"></div>' : ''}
        </div>
      </div>`;
  }

  function _params() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    const c = id => !!document.getElementById(id)?.checked;
    return {
      width: v('sbox-w') || 80, depth: v('sbox-d') || 60, height: v('sbox-h') || 40,
      wallThickness: v('sbox-wall') || 1.6, bottomThickness: v('sbox-bottom') || 1.2,
      dividersX: v('sbox-divx'), dividersY: v('sbox-divy'), dividerThickness: v('sbox-divt') || 1.2,
      stackable: c('sbox-stack'), gridfinity: c('sbox-grid'),
      gridUnitsX: v('sbox-gx') || 2, gridUnitsY: v('sbox-gy') || 2,
      label: document.getElementById('sbox-label')?.value || ''
    };
  }

  async function _generate() {
    const p = _params();
    const res = await fetch('/api/model-forge/storage-box/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._sboxDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating box...', 'info');
      const blob = await _generate();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = (_params().label || 'storage_box') .replace(/[^a-zA-Z0-9_-]/g, '_') + '.3mf';
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._sboxPreview3D = async function() {
    const result = document.getElementById('sbox-result');
    if (result) result.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _generate();
      const file = new File([blob], 'box.3mf', { type: 'application/octet-stream' });
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(file);
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Storage Box');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _updatePreview(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (result) result.innerHTML = '<div style="padding:20px;color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(label, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${label}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
