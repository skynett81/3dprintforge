// Model Forge — Advanced Vase Generator
(function() {
  'use strict';

  window.loadForgeVase = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .vs-layout{display:flex;gap:12px;height:calc(100% - 40px)}
      .vs-sidebar{width:220px;min-width:180px;overflow-y:auto}
      .vs-form label{font-size:0.7rem;color:var(--text-muted)}
      .vs-form select,.vs-form input[type=number]{font-size:0.75rem;padding:2px 4px;border-radius:4px}
      .vs-preview{flex:1;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:8px;background:var(--bg-secondary);overflow:auto}
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">\u2190 Back</button>
      <h4 style="margin:0;font-size:1rem">\ud83c\udffa Advanced Vase Generator</h4>
    </div>
    <div class="vs-layout">
      <div class="vs-sidebar"><div class="vs-form" id="vs-form">
        <div style="margin-bottom:5px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Shape</label>
          <select id="vs-shape" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="cylinder">Cylinder</option>
            <option value="sine" selected>Sine</option>
            <option value="bulge">Bulge</option>
            <option value="flare">Flare</option>
            <option value="twist">Twist</option>
            <option value="hourglass">Hourglass</option>
            <option value="tulip">Tulip</option>
          </select>
        </div>
        ${_rf('Height (mm)','vs-height',30,200,80,5)}
        ${_rf('Diameter (mm)','vs-diameter',20,120,60,5)}
        ${_rf('Wall Thickness (mm)','vs-wall',0.8,4,1.6,0.2)}
        ${_rf('Base Height (mm)','vs-base',1,5,2,0.5)}
        ${_rf('Amplitude','vs-amplitude',0,0.5,0.15,0.05)}
        ${_rf('Frequency','vs-frequency',1,8,3,1)}
        ${_rf('Quality (layers)','vs-quality',20,100,50,10)}
        ${_rf('Segments','vs-segments',16,64,32,8)}
      </div></div>
      <div class="vs-preview" id="vs-result"></div>
    </div>`;

    const form = document.getElementById('vs-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._vsDebounce); window._vsDebounce = setTimeout(_up, 300); });
      form.addEventListener('change', _up);
    }
    setTimeout(_up, 100);
  };

  function _up() {
    const p = _p();
    const r = document.getElementById('vs-result');
    if (!r) return;

    // Generate SVG vase outline sketch
    const svgW = 120, svgH = 160;
    const vH = 120, vR = 40;
    let pathL = '', pathR = '';
    const layers = 40;
    for (let i = 0; i <= layers; i++) {
      const t = i / layers;
      const y = svgH - 10 - t * vH;
      let rad = vR;
      if (p.shape === 'sine') rad = vR * (1 + p.amplitude * Math.sin(t * p.frequency * Math.PI * 2));
      else if (p.shape === 'bulge') rad = vR * (1 + p.amplitude * Math.sin(t * Math.PI));
      else if (p.shape === 'flare') rad = vR * (0.6 + 0.4 * t);
      else if (p.shape === 'twist') rad = vR * (1 + p.amplitude * Math.sin(t * p.frequency * Math.PI * 2));
      else if (p.shape === 'hourglass') rad = vR * (1 - p.amplitude * Math.sin(t * Math.PI));
      else if (p.shape === 'tulip') rad = vR * (0.7 + 0.3 * Math.pow(t, 0.5));
      const cx = svgW / 2;
      const cmd = i === 0 ? 'M' : 'L';
      pathL += `${cmd}${(cx - rad * 0.45).toFixed(1)},${y.toFixed(1)} `;
      pathR += `${cmd}${(cx + rad * 0.45).toFixed(1)},${y.toFixed(1)} `;
    }

    r.innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">
        <strong>${p.shape.charAt(0).toUpperCase() + p.shape.slice(1)}</strong> vase
      </div>
      <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="margin:8px 0">
        <path d="${pathL}" fill="none" stroke="var(--accent-blue)" stroke-width="1.5"/>
        <path d="${pathR}" fill="none" stroke="var(--accent-blue)" stroke-width="1.5"/>
        <line x1="${svgW/2 - vR*0.45}" y1="${svgH - 10}" x2="${svgW/2 + vR*0.45}" y2="${svgH - 10}" stroke="var(--accent-blue)" stroke-width="1.5"/>
      </svg>
      <div style="font-size:0.8rem;margin-bottom:4px">\u00d8${p.diameter}mm \u00d7 ${p.height}mm tall</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">Wall ${p.wall}mm \u00b7 Base ${p.base}mm \u00b7 ${p.segments} segments</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="form-btn form-btn-sm" onclick="window._vsPreview3D()" style="padding:4px 12px">\ud83d\udd0d 3D Preview</button>
        <button class="form-btn form-btn-sm" onclick="window._vsDownload()" style="padding:4px 12px">\u2b07 Download 3MF</button>
      </div>
    </div>`;
  }

  function _p() {
    return {
      shape: document.getElementById('vs-shape')?.value || 'sine',
      height: parseFloat(document.getElementById('vs-height')?.value) || 80,
      diameter: parseFloat(document.getElementById('vs-diameter')?.value) || 60,
      wall: parseFloat(document.getElementById('vs-wall')?.value) || 1.6,
      base: parseFloat(document.getElementById('vs-base')?.value) || 2,
      amplitude: parseFloat(document.getElementById('vs-amplitude')?.value) || 0.15,
      frequency: parseInt(document.getElementById('vs-frequency')?.value) || 3,
      quality: parseInt(document.getElementById('vs-quality')?.value) || 50,
      segments: parseInt(document.getElementById('vs-segments')?.value) || 32
    };
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/vase/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p())
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._vsDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating vase...', 'info');
      const blob = await _gen();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'vase.3mf';
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._vsPreview3D = async function() {
    const r = document.getElementById('vs-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'vase.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Vase');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
