// Model Forge — Text Plate Generator
(function() {
  'use strict';

  window.loadForgeTextPlate = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .tp-layout { display:grid; grid-template-columns:360px 1fr; gap:12px; min-height:400px; }
      .tp-sidebar { overflow-y:auto; max-height:calc(100vh - 180px); }
      .tp-form { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:12px; }
      .tp-preview { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:10px; padding:16px; min-height:300px; }
      @media (max-width:900px) { .tp-layout { grid-template-columns:1fr; } }
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">← Back</button>
      <h4 style="margin:0;font-size:1rem">🔤 Text Plate Generator</h4>
    </div>
    <div class="tp-layout">
      <div class="tp-sidebar"><div class="tp-form" id="tp-form">
        <div style="margin-bottom:10px">
          <label class="form-label">Text (multi-line supported)</label>
          <textarea class="form-input" id="tp-text" rows="3" style="font-size:0.9rem;resize:vertical">Hello World</textarea>
        </div>
        ${_rf('Font size (mm)', 'tp-fontsize', 3, 30, 8, 1)}
        ${_rf('Line spacing', 'tp-linespace', 1.0, 3.0, 1.5, 0.1)}
        ${_rf('Plate thickness (mm)', 'tp-depth', 1, 5, 2, 0.5)}
        ${_rf('Text height (mm)', 'tp-texth', 0.3, 2.0, 0.8, 0.1)}
        ${_rf('Padding (mm)', 'tp-pad', 2, 15, 4, 1)}
        <div style="margin:8px 0">
          <label style="font-size:0.75rem;color:var(--text-muted)">Alignment</label>
          <select class="form-input" id="tp-align" style="font-size:0.82rem">
            <option value="center" selected>Center</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0">
          <input type="checkbox" id="tp-border"> Add border
        </label>
        <label style="font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;margin:6px 0">
          <input type="checkbox" id="tp-holes"> Mount holes
        </label>
      </div></div>
      <div class="tp-preview" id="tp-result"></div>
    </div>`;

    const form = document.getElementById('tp-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._tpDebounce); window._tpDebounce = setTimeout(_up, 300); });
      form.addEventListener('change', _up);
    }
    setTimeout(_up, 100);
  };

  function _esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function _up() {
    const result = document.getElementById('tp-result');
    if (!result) return;
    const p = _p();
    const lines = p.text.split('\n').filter(l => l.trim());
    const maxChars = Math.max(1, ...lines.map(l => l.length));
    const charW = p.fontSize * 5 / 7;
    const plateW = maxChars * charW + p.padding * 2;
    const scale = Math.min(4, 350 / plateW);
    const pw = Math.round(plateW * scale);
    const lineH = Math.round(p.fontSize * scale);
    const ph = Math.round((lines.length * p.fontSize * p.lineSpacing + p.padding * 2) * scale);

    let textHtml = '';
    for (const line of lines) {
      const align = p.align === 'left' ? 'flex-start' : p.align === 'right' ? 'flex-end' : 'center';
      textHtml += `<div style="font-size:${lineH}px;font-family:monospace;font-weight:700;letter-spacing:1px;display:flex;justify-content:${align};width:100%">${_esc(line)}</div>`;
    }

    result.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._tpPreview3D()" style="background:var(--accent-cyan);color:#fff">🧊 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._tpDownload()" style="background:var(--accent-green);color:#fff">📥 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted)">${Math.round(plateW)}×${Math.round(lines.length * p.fontSize * p.lineSpacing + p.padding * 2)}mm — ${lines.length} line${lines.length > 1 ? 's' : ''}</div>
      <div style="width:${pw}px;min-height:${ph}px;background:#eee;color:#222;border-radius:${Math.round(3*scale)}px;padding:${Math.round(p.padding*scale)}px;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;flex-direction:column;justify-content:center;gap:${Math.round(p.fontSize*(p.lineSpacing-1)*scale*0.5)}px;${p.border ? 'border:' + Math.round(1.5*scale) + 'px solid #333;' : ''}">${textHtml}</div>`;
  }

  function _p() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    return {
      text: document.getElementById('tp-text')?.value || 'Hello World',
      fontSize: v('tp-fontsize') || 8, lineSpacing: v('tp-linespace') || 1.5,
      plateDepth: v('tp-depth') || 2, textHeight: v('tp-texth') || 0.8,
      padding: v('tp-pad') || 4, align: document.getElementById('tp-align')?.value || 'center',
      border: !!document.getElementById('tp-border')?.checked,
      holes: !!document.getElementById('tp-holes')?.checked
    };
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/text-plate/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p())
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
    return res.blob();
  }

  window._tpDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating...', 'info');
      const blob = await _gen();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      const firstLine = (_p().text || 'text').split('\n')[0].trim();
      a.download = firstLine.replace(/[^a-zA-Z0-9_-]/g, '_') + '_plate.3mf';
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._tpPreview3D = async function() {
    const r = document.getElementById('tp-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'text_plate.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Text Plate');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
