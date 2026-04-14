// Model Forge — Gridfinity Lid Generator
(function() {
  'use strict';

  window.loadForgeGridfinityLid = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .gfld-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:500px; }
      .gfld-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); padding-right:4px; }
      .gfld-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .gfld-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:400px; }
      @media (max-width:900px) { .gfld-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🔲 Gridfinity Lid</h4>
    </div>
    <div class="gfld-layout">
      <div class="gfld-sidebar"><div class="gfld-form" id="gfld-form">
        <h5 style="margin:0 0 10px;font-size:0.88rem">Grid size (42mm units)</h5>
        ${_rf('Units X', 'gfld-x', 1, 6, 1, 1)}
        ${_rf('Units Y', 'gfld-y', 1, 6, 1, 1)}

        <div style="margin-top:12px;padding:8px;background:var(--bg-tertiary);border-radius:6px;font-size:0.7rem;color:var(--text-muted);line-height:1.4">
          A simple flat lid with a short skirt that drops into the bin opening. Sized to match the Gridfinity bin footprint.
        </div>
      </div></div>
      <div class="gfld-preview" id="gfld-result">
        <div style="color:var(--text-muted);font-size:0.85rem">Configure your lid and generate</div>
      </div>
    </div>`;

    const form = document.getElementById('gfld-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._gfldDebounce); window._gfldDebounce = setTimeout(_updatePreview, 300); });
      form.addEventListener('change', _updatePreview);
    }
    setTimeout(_updatePreview, 100);
  };

  function _updatePreview() {
    const result = document.getElementById('gfld-result');
    if (!result) return;
    const p = _params();
    const scale = Math.min(5, 280 / Math.max(p.unitsX * 42, p.unitsY * 42));
    const pw = Math.round(p.unitsX * 42 * scale);
    const pd = Math.round(p.unitsY * 42 * scale);

    result.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._gfldPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._gfldDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin:4px 0">${p.unitsX}×${p.unitsY} · ${p.unitsX * 42}×${p.unitsY * 42} mm</div>
      <div style="perspective:400px;margin-top:10px">
        <div style="width:${pw}px;height:${pd}px;position:relative;transform:rotateX(26deg);background:linear-gradient(145deg,#a0afc8,#7889a4);border:2px solid #4a5d78;border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,0.35)"></div>
      </div>`;
  }

  function _params() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    return {
      unitsX: Math.max(1, Math.min(6, v('gfld-x') || 1)),
      unitsY: Math.max(1, Math.min(6, v('gfld-y') || 1)),
    };
  }

  async function _generate() {
    const p = _params();
    const res = await fetch('/api/model-forge/gridfinity-lid/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._gfldDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating lid...', 'info');
      const blob = await _generate();
      const p = _params();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `gridfinity_lid_${p.unitsX}x${p.unitsY}.3mf`;
      a.click();
      URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) {
      if (typeof showToast === 'function') showToast(e.message, 'error');
    }
  };

  window._gfldPreview3D = async function() {
    const result = document.getElementById('gfld-result');
    if (result) result.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _generate();
      const file = new File([blob], 'gridfinity_lid.3mf', { type: 'application/octet-stream' });
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(file);
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Gridfinity Lid');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _updatePreview(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      if (result) result.innerHTML = '<div style="padding:20px;color:var(--accent-red)">' + e.message + '</div>';
    }
  };

  function _rf(label, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${label}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
