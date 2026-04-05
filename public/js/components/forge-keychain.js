// Model Forge — Keychain Generator
(function() {
  'use strict';

  window.loadForgeKeychain = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .kc-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:400px; }
      .kc-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); }
      .kc-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .kc-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:300px; }
      @media (max-width:900px) { .kc-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🔑 Keychain Generator</h4>
    </div>
    <div class="kc-layout">
      <div class="kc-sidebar"><div class="kc-form" id="kc-form">
        <div style="margin-bottom:10px"><label class="form-label">Text</label><input type="text" class="form-input" id="kc-text" value="KEY" maxlength="12" style="font-size:0.9rem"></div>
        ${_rf('Width (mm)', 'kc-w', 20, 80, 50, 5)}
        ${_rf('Height (mm)', 'kc-h', 10, 40, 20, 2)}
        ${_rf('Thickness (mm)', 'kc-thick', 1, 6, 3, 0.5)}
        ${_rf('Text height (mm)', 'kc-texth', 0.3, 2, 0.8, 0.1)}
        <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:8px 0">
          <input type="checkbox" id="kc-ring" checked> Keyring hole
        </label>
        ${_rf('Ring diameter (mm)', 'kc-ringd', 3, 8, 5, 0.5)}
      </div></div>
      <div class="kc-preview" id="kc-result"></div>
    </div>`;

    const form = document.getElementById('kc-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._kcDebounce); window._kcDebounce = setTimeout(_up, 300); });
      form.addEventListener('change', _up);
    }
    setTimeout(_up, 100);
  };

  function _up() {
    const result = document.getElementById('kc-result');
    if (!result) return;
    const p = _p();
    const scale = Math.min(4, 250 / p.width);
    const pw = Math.round(p.width * scale), ph = Math.round(p.height * scale);
    const ringR = Math.round(p.ringDiameter * scale / 2);
    const tabW = p.ringHole ? Math.round((p.ringDiameter + 4) * scale) : 0;

    result.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._kcPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._kcDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted)">${p.width}×${p.height}×${p.thickness}mm</div>
      <div style="display:flex;align-items:center">
        <div style="width:${pw}px;height:${ph}px;background:#3c78c8;border-radius:${Math.round(3*scale)}px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,0.3);font-size:${Math.round(ph*0.5)}px;font-weight:800;color:#eee;letter-spacing:2px">${(p.text || 'KEY').toUpperCase()}</div>
        ${p.ringHole ? '<div style="width:' + tabW + 'px;height:' + tabW + 'px;background:#3c78c8;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-left:-' + Math.round(2*scale) + 'px;box-shadow:0 4px 20px rgba(0,0,0,0.3)"><div style="width:' + (ringR*2) + 'px;height:' + (ringR*2) + 'px;border-radius:50%;background:var(--bg-primary);border:2px solid #2a5a9a"></div></div>' : ''}
      </div>`;
  }

  function _p() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    return {
      text: document.getElementById('kc-text')?.value || 'KEY',
      width: v('kc-w') || 50, height: v('kc-h') || 20, thickness: v('kc-thick') || 3,
      textHeight: v('kc-texth') || 0.8, ringHole: !!document.getElementById('kc-ring')?.checked,
      ringDiameter: v('kc-ringd') || 5
    };
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/keychain/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p())
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._kcDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating...', 'info');
      const blob = await _gen();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = (_p().text || 'keychain').replace(/[^a-zA-Z0-9_-]/g, '_') + '_keychain.3mf';
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._kcPreview3D = async function() {
    const r = document.getElementById('kc-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'keychain.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Keychain');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
