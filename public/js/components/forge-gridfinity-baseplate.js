// Model Forge — Gridfinity Baseplate Generator
(function() {
  'use strict';

  window.loadForgeGridfinityBaseplate = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .gfbp-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:500px; }
      .gfbp-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); padding-right:4px; }
      .gfbp-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .gfbp-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:400px; }
      .gfbp-cell { background:linear-gradient(145deg,#8fa5bc,#5e7890); border:1px solid #3d5468; border-radius:3px; box-shadow:inset 0 -2px 4px rgba(0,0,0,0.25); }
      @media (max-width:900px) { .gfbp-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🧰 Gridfinity Baseplate</h4>
    </div>
    <div class="gfbp-layout">
      <div class="gfbp-sidebar"><div class="gfbp-form" id="gfbp-form">
        <h5 style="margin:0 0 10px;font-size:0.88rem">Grid size (42mm units)</h5>
        ${_rf('Units X', 'gfbp-x', 1, 12, 2, 1)}
        ${_rf('Units Y', 'gfbp-y', 1, 12, 2, 1)}

        <h5 style="margin:14px 0 10px;font-size:0.88rem">Options</h5>
        <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0">
          <input type="checkbox" id="gfbp-magnet"> Magnet hole markers
        </label>

        <div style="margin-top:12px;padding:8px;background:var(--bg-tertiary);border-radius:6px;font-size:0.7rem;color:var(--text-muted);line-height:1.4">
          Gridfinity spec © Zack Freedman, CC BY 4.0.
          Each cell is 42 × 42 mm with a chamfered pocket that mates with standard bin feet.
        </div>
      </div></div>
      <div class="gfbp-preview" id="gfbp-result">
        <div style="color:var(--text-muted);font-size:0.85rem">Configure your baseplate and generate</div>
      </div>
    </div>`;

    const form = document.getElementById('gfbp-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._gfbpDebounce); window._gfbpDebounce = setTimeout(_updatePreview, 300); });
      form.addEventListener('change', _updatePreview);
    }
    setTimeout(_updatePreview, 100);
  };

  function _updatePreview() {
    const result = document.getElementById('gfbp-result');
    if (!result) return;
    const p = _params();
    const cellPx = Math.max(14, Math.min(38, 320 / Math.max(p.unitsX, p.unitsY)));
    const totalW = cellPx * p.unitsX;
    const totalD = cellPx * p.unitsY;

    let cells = '';
    for (let iy = 0; iy < p.unitsY; iy++) {
      for (let ix = 0; ix < p.unitsX; ix++) {
        const left = ix * cellPx;
        const top = iy * cellPx;
        cells += `<div class="gfbp-cell" style="position:absolute;left:${left + 2}px;top:${top + 2}px;width:${cellPx - 4}px;height:${cellPx - 4}px"></div>`;
      }
    }

    result.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._gfbpPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._gfbpDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin:4px 0">${p.unitsX}×${p.unitsY} cells · ${p.unitsX * 42}×${p.unitsY * 42} mm${p.magnetHoles ? ' · magnets' : ''}</div>
      <div style="perspective:400px;margin-top:10px">
        <div style="width:${totalW}px;height:${totalD}px;position:relative;background:#3d5468;border:2px solid #2a3a4a;border-radius:6px;transform:rotateX(24deg);box-shadow:0 6px 20px rgba(0,0,0,0.35)">
          ${cells}
        </div>
      </div>`;
  }

  function _params() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    const c = id => !!document.getElementById(id)?.checked;
    return {
      unitsX: Math.max(1, Math.min(12, v('gfbp-x') || 2)),
      unitsY: Math.max(1, Math.min(12, v('gfbp-y') || 2)),
      magnetHoles: c('gfbp-magnet'),
    };
  }

  async function _generate() {
    const p = _params();
    const res = await fetch('/api/model-forge/gridfinity-baseplate/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._gfbpDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating baseplate...', 'info');
      const blob = await _generate();
      const p = _params();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `gridfinity_baseplate_${p.unitsX}x${p.unitsY}.3mf`;
      a.click();
      URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) {
      if (typeof showToast === 'function') showToast(e.message, 'error');
    }
  };

  window._gfbpPreview3D = async function() {
    const result = document.getElementById('gfbp-result');
    if (result) result.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _generate();
      const file = new File([blob], 'gridfinity_baseplate.3mf', { type: 'application/octet-stream' });
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(file);
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Gridfinity Baseplate');
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
