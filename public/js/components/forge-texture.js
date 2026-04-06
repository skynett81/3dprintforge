// Model Forge — Texture Surface Generator
(function() {
  'use strict';

  window.loadForgeTexture = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .tx-layout{display:flex;gap:12px;height:calc(100% - 40px)}
      .tx-sidebar{width:220px;min-width:180px;overflow-y:auto}
      .tx-form label{font-size:0.7rem;color:var(--text-muted)}
      .tx-form select,.tx-form input[type=number]{font-size:0.75rem;padding:2px 4px;border-radius:4px}
      .tx-preview{flex:1;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:8px;background:var(--bg-secondary);overflow:auto}
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">\u2190 Back</button>
      <h4 style="margin:0;font-size:1rem">\ud83e\uddf1 Texture Surface Generator</h4>
    </div>
    <div class="tx-layout">
      <div class="tx-sidebar"><div class="tx-form" id="tx-form">
        <div style="margin-bottom:5px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Pattern</label>
          <select id="tx-pattern" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="diamond-plate" selected>Diamond Plate</option>
            <option value="knurl">Knurl</option>
            <option value="honeycomb">Honeycomb</option>
            <option value="waves">Waves</option>
            <option value="brick">Brick</option>
            <option value="carbon-fiber">Carbon Fiber</option>
            <option value="dots">Dots</option>
            <option value="crosshatch">Crosshatch</option>
          </select>
        </div>
        <div style="margin-bottom:5px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Surface</label>
          <select id="tx-surface" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="flat" selected>Flat</option>
            <option value="cylinder">Cylinder</option>
          </select>
        </div>
        <div id="tx-flat-fields">
          ${_rf('Width (mm)','tx-width',20,150,60,5)}
          ${_rf('Depth (mm)','tx-depth',20,150,60,5)}
        </div>
        <div id="tx-cyl-fields" style="display:none">
          ${_rf('Cylinder Radius (mm)','tx-cylRadius',5,50,15,1)}
          ${_rf('Cylinder Height (mm)','tx-cylHeight',10,100,40,5)}
        </div>
        ${_rf('Base Thickness (mm)','tx-baseThick',1,5,2,0.5)}
        ${_rf('Relief Depth (mm)','tx-relief',0.2,3,0.8,0.1)}
        ${_rf('Resolution','tx-resolution',20,100,50,10)}
      </div></div>
      <div class="tx-preview" id="tx-result"></div>
    </div>`;

    const form = document.getElementById('tx-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._txDebounce); window._txDebounce = setTimeout(_up, 300); });
      form.addEventListener('change', _up);
    }

    // Toggle flat/cylinder fields
    const surfSel = document.getElementById('tx-surface');
    if (surfSel) {
      surfSel.addEventListener('change', function() {
        const flatF = document.getElementById('tx-flat-fields');
        const cylF = document.getElementById('tx-cyl-fields');
        if (this.value === 'flat') {
          if (flatF) flatF.style.display = '';
          if (cylF) cylF.style.display = 'none';
        } else {
          if (flatF) flatF.style.display = 'none';
          if (cylF) cylF.style.display = '';
        }
        _up();
      });
    }

    setTimeout(_up, 100);
  };

  function _up() {
    const p = _p();
    const r = document.getElementById('tx-result');
    if (!r) return;

    const patLabel = p.pattern.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    let dims;
    if (p.surface === 'flat') {
      dims = `${p.width} \u00d7 ${p.depth} \u00d7 ${(p.baseThick + p.relief).toFixed(1)} mm`;
    } else {
      dims = `R${p.cylRadius}mm \u00d7 ${p.cylHeight}mm tall \u00d7 ${(p.baseThick + p.relief).toFixed(1)}mm wall`;
    }

    r.innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">
        <strong>${patLabel}</strong> on ${p.surface}
      </div>
      <div style="font-size:2rem;margin:12px 0">\ud83e\uddf1</div>
      <div style="font-size:0.8rem;margin-bottom:4px">${dims}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">Relief ${p.relief}mm \u00b7 Base ${p.baseThick}mm \u00b7 Res ${p.resolution}</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="form-btn form-btn-sm" onclick="window._txPreview3D()" style="padding:4px 12px">\ud83d\udd0d 3D Preview</button>
        <button class="form-btn form-btn-sm" onclick="window._txDownload()" style="padding:4px 12px">\u2b07 Download 3MF</button>
      </div>
    </div>`;
  }

  function _p() {
    return {
      pattern: document.getElementById('tx-pattern')?.value || 'diamond-plate',
      surface: document.getElementById('tx-surface')?.value || 'flat',
      width: parseFloat(document.getElementById('tx-width')?.value) || 60,
      depth: parseFloat(document.getElementById('tx-depth')?.value) || 60,
      cylRadius: parseFloat(document.getElementById('tx-cylRadius')?.value) || 15,
      cylHeight: parseFloat(document.getElementById('tx-cylHeight')?.value) || 40,
      baseThick: parseFloat(document.getElementById('tx-baseThick')?.value) || 2,
      relief: parseFloat(document.getElementById('tx-relief')?.value) || 0.8,
      resolution: parseInt(document.getElementById('tx-resolution')?.value) || 50
    };
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/texture/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p())
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._txDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating texture...', 'info');
      const blob = await _gen();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'texture.3mf';
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._txPreview3D = async function() {
    const r = document.getElementById('tx-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'texture.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Texture');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
