// Model Forge — Gridfinity Tool Holder Generator
(function() {
  'use strict';

  window.loadForgeGridfinityToolHolder = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .gfth-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:500px; }
      .gfth-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); padding-right:4px; }
      .gfth-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .gfth-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:400px; }
      @media (max-width:900px) { .gfth-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🔧 Gridfinity Tool Holder</h4>
    </div>
    <div class="gfth-layout">
      <div class="gfth-sidebar"><div class="gfth-form" id="gfth-form">
        <h5 style="margin:0 0 10px;font-size:0.88rem">Grid size (42mm units)</h5>
        ${_rf('Units X', 'gfth-x', 1, 6, 2, 1)}
        ${_rf('Units Y', 'gfth-y', 1, 6, 1, 1)}

        <h5 style="margin:14px 0 10px;font-size:0.88rem">Height (7mm units)</h5>
        ${_rf('H units', 'gfth-h', 2, 15, 5, 1)}

        <h5 style="margin:14px 0 10px;font-size:0.88rem">Tool slots</h5>
        ${_rf('Slot diameter (mm)', 'gfth-d', 2, 30, 8, 0.5)}
        ${_rf('Min spacing (mm)', 'gfth-s', 1, 10, 3, 0.5)}

        <div style="margin-top:12px;padding:8px;background:var(--bg-tertiary);border-radius:6px;font-size:0.7rem;color:var(--text-muted);line-height:1.4">
          Solid Gridfinity block with a grid of round holes drilled into the top. Great for drill bits, screwdrivers, pens, or any round tools.
        </div>
      </div></div>
      <div class="gfth-preview" id="gfth-result">
        <div style="color:var(--text-muted);font-size:0.85rem">Configure your tool holder and generate</div>
      </div>
    </div>`;

    const form = document.getElementById('gfth-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._gfthDebounce); window._gfthDebounce = setTimeout(_updatePreview, 300); });
      form.addEventListener('change', _updatePreview);
    }
    setTimeout(_updatePreview, 100);
  };

  function _updatePreview() {
    const result = document.getElementById('gfth-result');
    if (!result) return;
    const p = _params();
    const scale = Math.min(4, 280 / Math.max(p.unitsX * 42, p.unitsY * 42));
    const pw = Math.round(p.unitsX * 42 * scale);
    const pd = Math.round(p.unitsY * 42 * scale);
    // Estimate slots count for preview
    const pitch = p.slotDiameter + p.slotSpacing;
    const cols = Math.max(1, Math.floor((p.unitsX * 42 - 2.4 - p.slotSpacing) / pitch));
    const rowsN = Math.max(1, Math.floor((p.unitsY * 42 - 2.4 - p.slotSpacing) / pitch));
    const slotCount = cols * rowsN;

    let holes = '';
    const holePx = Math.max(3, p.slotDiameter * scale);
    const gridW = cols * pitch * scale;
    const gridD = rowsN * pitch * scale;
    const offX = (pw - gridW) / 2 + (holePx / 2);
    const offY = (pd - gridD) / 2 + (holePx / 2);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rowsN; j++) {
        const cx = offX + i * pitch * scale;
        const cy = offY + j * pitch * scale;
        holes += `<div style="position:absolute;left:${cx - holePx/2}px;top:${cy - holePx/2}px;width:${holePx}px;height:${holePx}px;border-radius:50%;background:#2a3a4a;box-shadow:inset 0 2px 3px rgba(0,0,0,0.6)"></div>`;
      }
    }

    result.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._gfthPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._gfthDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);margin:4px 0">${p.unitsX}×${p.unitsY}×${p.heightUnits}u · ${slotCount} slots @ ${p.slotDiameter}mm</div>
      <div style="perspective:400px;margin-top:10px">
        <div style="width:${pw}px;height:${pd}px;position:relative;transform:rotateX(28deg);background:linear-gradient(145deg,#7a8fb0,#506580);border:2px solid #3a4d68;border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,0.35)">
          ${holes}
        </div>
      </div>`;
  }

  function _params() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    return {
      unitsX: Math.max(1, Math.min(6, v('gfth-x') || 2)),
      unitsY: Math.max(1, Math.min(6, v('gfth-y') || 1)),
      heightUnits: Math.max(2, Math.min(15, v('gfth-h') || 5)),
      slotDiameter: Math.max(2, Math.min(30, v('gfth-d') || 8)),
      slotSpacing: Math.max(1, Math.min(10, v('gfth-s') || 3)),
    };
  }

  async function _generate() {
    const p = _params();
    const res = await fetch('/api/model-forge/gridfinity-tool-holder/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._gfthDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating tool holder...', 'info');
      const blob = await _generate();
      const p = _params();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `gridfinity_tool_holder_${p.unitsX}x${p.unitsY}x${p.heightUnits}u.3mf`;
      a.click();
      URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) {
      if (typeof showToast === 'function') showToast(e.message, 'error');
    }
  };

  window._gfthPreview3D = async function() {
    const result = document.getElementById('gfth-result');
    if (result) result.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _generate();
      const file = new File([blob], 'gridfinity_tool_holder.3mf', { type: 'application/octet-stream' });
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(file);
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Gridfinity Tool Holder');
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
