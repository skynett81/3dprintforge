// Model Forge — Lattice Generator
(function() {
  'use strict';

  window.loadForgeLattice = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .lt-layout{display:flex;gap:12px;height:calc(100% - 40px)}
      .lt-sidebar{width:220px;min-width:180px;overflow-y:auto}
      .lt-form label{font-size:0.7rem;color:var(--text-muted)}
      .lt-form select,.lt-form input[type=number]{font-size:0.75rem;padding:2px 4px;border-radius:4px}
      .lt-preview{flex:1;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:8px;background:var(--bg-secondary);overflow:auto}
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">\u2190 Back</button>
      <h4 style="margin:0;font-size:1rem">\ud83e\uddf1 Lattice Generator</h4>
    </div>
    <div class="lt-layout">
      <div class="lt-sidebar"><div class="lt-form" id="lt-form">
        <div style="margin-bottom:5px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Cell Type</label>
          <select id="lt-cellType" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="cubic">Cubic</option>
            <option value="bcc" selected>BCC</option>
            <option value="fcc">FCC</option>
            <option value="octet">Octet</option>
            <option value="diamond">Diamond</option>
          </select>
        </div>
        ${_rf('Cell Size (mm)','lt-cellSize',5,20,10,1)}
        ${_rf('Strut Diameter (mm)','lt-strutDia',0.8,3.0,1.2,0.2)}
        ${_rf('Count X','lt-countX',1,8,3,1)}
        ${_rf('Count Y','lt-countY',1,8,3,1)}
        ${_rf('Count Z','lt-countZ',1,8,3,1)}
        ${_rf('Shell Wall (mm)','lt-shell',0,2,0,0.4)}
      </div></div>
      <div class="lt-preview" id="lt-result"></div>
    </div>`;

    const form = document.getElementById('lt-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._ltDebounce); window._ltDebounce = setTimeout(_up, 300); });
      form.addEventListener('change', _up);
    }
    setTimeout(_up, 100);
  };

  function _up() {
    const p = _p();
    const sizeX = (p.cellSize * p.countX).toFixed(1);
    const sizeY = (p.cellSize * p.countY).toFixed(1);
    const sizeZ = (p.cellSize * p.countZ).toFixed(1);
    const shell = p.shell > 0 ? ` + ${p.shell}mm shell` : '';
    const r = document.getElementById('lt-result');
    if (!r) return;
    r.innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">
        <strong>${p.cellType.toUpperCase()}</strong> lattice
      </div>
      <div style="font-size:2rem;margin:12px 0">\ud83e\uddf1</div>
      <div style="font-size:0.8rem;margin-bottom:4px">${p.countX} \u00d7 ${p.countY} \u00d7 ${p.countZ} cells</div>
      <div style="font-size:0.8rem;margin-bottom:4px">${sizeX} \u00d7 ${sizeY} \u00d7 ${sizeZ} mm${shell}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">Strut \u00d8${p.strutDia}mm</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="form-btn form-btn-sm" onclick="window._ltPreview3D()" style="padding:4px 12px">\ud83d\udd0d 3D Preview</button>
        <button class="form-btn form-btn-sm" onclick="window._ltDownload()" style="padding:4px 12px">\u2b07 Download 3MF</button>
      </div>
    </div>`;
  }

  function _p() {
    return {
      cellType: document.getElementById('lt-cellType')?.value || 'bcc',
      cellSize: parseFloat(document.getElementById('lt-cellSize')?.value) || 10,
      strutDia: parseFloat(document.getElementById('lt-strutDia')?.value) || 1.2,
      countX: parseInt(document.getElementById('lt-countX')?.value) || 3,
      countY: parseInt(document.getElementById('lt-countY')?.value) || 3,
      countZ: parseInt(document.getElementById('lt-countZ')?.value) || 3,
      shell: parseFloat(document.getElementById('lt-shell')?.value) || 0
    };
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/lattice/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p())
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._ltDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating lattice...', 'info');
      const blob = await _gen();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'lattice.3mf';
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._ltPreview3D = async function() {
    const r = document.getElementById('lt-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'lattice.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Lattice');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
