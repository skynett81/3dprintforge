// Model Forge — Cable Label Generator
(function() {
  'use strict';

  window.loadForgeCableLabel = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .cl-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:400px; }
      .cl-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); }
      .cl-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .cl-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:300px; }
      @media (max-width:900px) { .cl-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🏷️ Cable Label Generator</h4>
    </div>
    <div class="cl-layout">
      <div class="cl-sidebar"><div class="cl-form" id="cl-form">
        <div style="margin-bottom:10px"><label class="form-label">Label text</label><input type="text" class="form-input" id="cl-text" value="ETH" maxlength="10" style="font-size:0.9rem"></div>
        <div style="margin-bottom:10px">
          <label style="font-size:0.75rem;color:var(--text-muted)">Style</label>
          <select class="form-input" id="cl-style" style="font-size:0.82rem">
            <option value="flag" selected>Flag (ring + flat tag)</option>
            <option value="wrap">Wrap-around band</option>
          </select>
        </div>
        ${_rf('Cable diameter (mm)', 'cl-cable', 2, 20, 5, 0.5)}
        ${_rf('Label height (mm)', 'cl-height', 6, 25, 12, 1)}
        ${_rf('Wall thickness (mm)', 'cl-thick', 0.6, 2.5, 1.2, 0.2)}
        ${_rf('Text height (mm)', 'cl-texth', 0.2, 1.5, 0.6, 0.1)}
        <div id="cl-flag-opts">${_rf('Flag width (mm)', 'cl-flagw', 15, 60, 30, 5)}</div>
        <div id="cl-wrap-opts" style="display:none">${_rf('Wrap angle (°)', 'cl-angle', 180, 350, 270, 10)}</div>
        ${_rf('Tolerance (mm)', 'cl-tol', 0.1, 0.6, 0.3, 0.05)}
      </div></div>
      <div class="cl-preview" id="cl-result"></div>
    </div>`;

    document.getElementById('cl-style')?.addEventListener('change', () => {
      const s = document.getElementById('cl-style')?.value;
      document.getElementById('cl-flag-opts').style.display = s === 'flag' ? '' : 'none';
      document.getElementById('cl-wrap-opts').style.display = s === 'wrap' ? '' : 'none';
      _up();
    });
    const form = document.getElementById('cl-form');
    if (form) { form.addEventListener('input', () => { clearTimeout(window._clD); window._clD = setTimeout(_up, 300); }); form.addEventListener('change', _up); }
    setTimeout(_up, 100);
  };

  function _up() {
    const r = document.getElementById('cl-result');
    if (!r) return;
    const p = _p();
    const scale = 4;
    const cableR = Math.round(p.cableDiameter * scale / 2);
    const outerR = cableR + Math.round(p.thickness * scale);
    const flagW = Math.round(p.flagWidth * scale);
    const labelH = Math.round(p.labelHeight * scale);

    let preview;
    if (p.style === 'flag') {
      preview = `<div style="display:flex;align-items:center">
        <div style="width:${outerR*2}px;height:${outerR*2}px;border-radius:50%;background:#ddd;display:flex;align-items:center;justify-content:center;border:2px solid #aaa">
          <div style="width:${cableR*2}px;height:${cableR*2}px;border-radius:50%;background:var(--bg-primary);border:1px solid #888"></div>
        </div>
        <div style="width:${flagW}px;height:${labelH}px;background:#ddd;border:2px solid #aaa;border-left:none;display:flex;align-items:center;justify-content:center;font-size:${Math.round(labelH*0.5)}px;font-weight:700;color:#333;letter-spacing:1px;border-radius:0 3px 3px 0">${(p.text || 'ETH').toUpperCase()}</div>
      </div>`;
    } else {
      preview = `<div style="width:${outerR*2}px;height:${outerR*2}px;border:${Math.round(p.thickness*scale)}px solid #ddd;border-top-color:transparent;border-radius:50%;display:flex;align-items:center;justify-content:center">
        <div style="width:${cableR*2-4}px;height:${cableR*2-4}px;border-radius:50%;background:var(--bg-primary);border:1px solid #888"></div>
      </div>`;
    }

    r.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._clPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._clDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted)">${p.style} — ${p.cableDiameter}mm cable</div>
      <div style="box-shadow:0 4px 20px rgba(0,0,0,0.3)">${preview}</div>`;
  }

  function _p() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    return { text: document.getElementById('cl-text')?.value || 'ETH', style: document.getElementById('cl-style')?.value || 'flag',
      cableDiameter: v('cl-cable') || 5, labelHeight: v('cl-height') || 12, thickness: v('cl-thick') || 1.2,
      textHeight: v('cl-texth') || 0.6, flagWidth: v('cl-flagw') || 30, wrapAngle: v('cl-angle') || 270, tolerance: v('cl-tol') || 0.3 };
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/cable-label/generate-3mf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p()) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._clDownload = async function() {
    try { if (typeof showToast === 'function') showToast('Generating...', 'info');
      const blob = await _gen(); const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = (_p().text || 'cable_label').replace(/[^a-zA-Z0-9_-]/g, '_') + '_label.3mf'; a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._clPreview3D = async function() {
    const r = document.getElementById('cl-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try { const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'label.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Cable Label');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
