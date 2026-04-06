// Model Forge — Thread & Joint Generator
(function() {
  'use strict';

  window.loadForgeThread = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .th-layout{display:grid;grid-template-columns:360px 1fr;gap:12px;min-height:500px}
      .th-sidebar{overflow-y:auto;max-height:calc(100vh - 180px)}
      .th-form{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:10px;padding:12px}
      .th-preview{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:10px;padding:16px;min-height:400px}
      @media(max-width:900px){.th-layout{grid-template-columns:1fr}}
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">\u2190 Back</button>
      <h4 style="margin:0;font-size:1rem">\ud83d\udd29 Thread & Joint Generator</h4>
    </div>
    <div class="th-layout">
      <div class="th-sidebar"><div class="th-form" id="th-form">
        <div style="margin-bottom:8px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Type</label>
          <select id="th-type" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px" onchange="window._thTypeChanged()">
            <option value="bolt" selected>Bolt</option>
            <option value="nut">Nut</option>
            <option value="standoff">Standoff</option>
            <option value="snap-male">Snap Joint (Male)</option>
            <option value="snap-female">Snap Joint (Female)</option>
          </select>
        </div>
        <div style="margin-bottom:8px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Standard</label>
          <select id="th-standard" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="M3">M3</option>
            <option value="M4">M4</option>
            <option value="M5">M5</option>
            <option value="M6" selected>M6</option>
            <option value="M8">M8</option>
            <option value="M10">M10</option>
            <option value="M12">M12</option>
            <option value="M16">M16</option>
            <option value="M20">M20</option>
          </select>
        </div>
        ${_rf('Length (mm)', 'th-length', 5, 100, 20, 5)}
        ${_rf('Tolerance (mm)', 'th-tolerance', 0, 0.5, 0.2, 0.05)}
        <div id="th-head-section" style="margin-top:6px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Head Type</label>
          <select id="th-headType" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="hex" selected>Hex</option>
            <option value="socket">Socket (Allen)</option>
            <option value="flat">Flat / Countersunk</option>
            <option value="none">None (Headless)</option>
          </select>
        </div>
      </div></div>
      <div class="th-preview" id="th-result"><div style="color:var(--text-muted)">Configure thread parameters</div></div>
    </div>`;

    const form = document.getElementById('th-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._thD); window._thD = setTimeout(_up, 300); });
      form.addEventListener('change', _up);
    }
    setTimeout(_up, 100);
  };

  window._thTypeChanged = function() {
    const type = document.getElementById('th-type')?.value || 'bolt';
    const headSection = document.getElementById('th-head-section');
    if (headSection) headSection.style.display = type === 'bolt' ? '' : 'none';
    _up();
  };

  function _p() {
    const type = document.getElementById('th-type')?.value || 'bolt';
    const params = {
      type,
      standard: document.getElementById('th-standard')?.value || 'M6',
      length: parseFloat(document.getElementById('th-length')?.value) || 20,
      tolerance: parseFloat(document.getElementById('th-tolerance')?.value) || 0.2,
    };
    if (type === 'bolt') {
      params.headType = document.getElementById('th-headType')?.value || 'hex';
    }
    return params;
  }

  function _drawSketch(p) {
    const w = 200, h = 240;
    const dia = parseInt(p.standard.replace('M', ''), 10);
    const scale = Math.min(w / (dia * 3), h / (p.length + dia * 2));
    const cx = w / 2;
    const shaftW = dia * scale;
    const shaftH = p.length * scale;
    const headW = dia * 1.8 * scale;
    const headH = dia * 0.7 * scale;

    let svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">`;
    svg += `<rect width="${w}" height="${h}" fill="none"/>`;

    if (p.type === 'bolt') {
      const topY = 20;
      // Head
      svg += `<rect x="${cx - headW / 2}" y="${topY}" width="${headW}" height="${headH}" rx="2" fill="var(--accent-blue)" stroke="var(--border-color)" stroke-width="1"/>`;
      if (p.headType === 'hex') {
        svg += `<line x1="${cx - headW / 4}" y1="${topY + 2}" x2="${cx - headW / 4}" y2="${topY + headH - 2}" stroke="var(--bg-primary)" stroke-width="1.5"/>`;
        svg += `<line x1="${cx + headW / 4}" y1="${topY + 2}" x2="${cx + headW / 4}" y2="${topY + headH - 2}" stroke="var(--bg-primary)" stroke-width="1.5"/>`;
      } else if (p.headType === 'socket') {
        svg += `<rect x="${cx - headW / 6}" y="${topY + 2}" width="${headW / 3}" height="${headH - 4}" rx="1" fill="var(--bg-primary)" opacity="0.5"/>`;
      }
      // Shaft with thread lines
      const shaftTop = topY + headH;
      svg += `<rect x="${cx - shaftW / 2}" y="${shaftTop}" width="${shaftW}" height="${shaftH}" rx="1" fill="var(--accent-blue)" opacity="0.7" stroke="var(--border-color)" stroke-width="1"/>`;
      const threadSpacing = Math.max(3, shaftH / (p.length / 1.5));
      for (let ty = shaftTop + threadSpacing; ty < shaftTop + shaftH - 2; ty += threadSpacing) {
        svg += `<line x1="${cx - shaftW / 2 - 2}" y1="${ty}" x2="${cx + shaftW / 2 + 2}" y2="${ty}" stroke="var(--text-muted)" stroke-width="0.5" opacity="0.5"/>`;
      }
    } else if (p.type === 'nut') {
      const nutH = dia * 0.8 * scale;
      const topY = (h - nutH) / 2;
      svg += `<rect x="${cx - headW / 2}" y="${topY}" width="${headW}" height="${nutH}" rx="2" fill="var(--accent-orange)" stroke="var(--border-color)" stroke-width="1"/>`;
      svg += `<circle cx="${cx}" cy="${topY + nutH / 2}" r="${shaftW / 2 + 1}" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="1"/>`;
    } else if (p.type === 'standoff') {
      const topY = 30;
      svg += `<rect x="${cx - headW / 2}" y="${topY}" width="${headW}" height="${headH}" rx="2" fill="var(--accent-cyan)" stroke="var(--border-color)" stroke-width="1"/>`;
      svg += `<rect x="${cx - shaftW / 2}" y="${topY + headH}" width="${shaftW}" height="${shaftH}" rx="1" fill="var(--accent-cyan)" opacity="0.6" stroke="var(--border-color)" stroke-width="1"/>`;
      svg += `<rect x="${cx - headW / 2}" y="${topY + headH + shaftH}" width="${headW}" height="${headH}" rx="2" fill="var(--accent-cyan)" stroke="var(--border-color)" stroke-width="1"/>`;
    } else {
      // snap joints
      const topY = 40;
      const isMale = p.type === 'snap-male';
      svg += `<rect x="${cx - shaftW / 2}" y="${topY}" width="${shaftW}" height="${shaftH}" rx="1" fill="${isMale ? 'var(--accent-green)' : 'var(--accent-purple,#a855f7)'}" stroke="var(--border-color)" stroke-width="1"/>`;
      if (isMale) {
        svg += `<path d="M${cx - shaftW / 2 - 4},${topY + shaftH - 8} L${cx - shaftW / 2},${topY + shaftH} L${cx - shaftW / 2},${topY + shaftH - 16} Z" fill="var(--accent-green)"/>`;
        svg += `<path d="M${cx + shaftW / 2 + 4},${topY + shaftH - 8} L${cx + shaftW / 2},${topY + shaftH} L${cx + shaftW / 2},${topY + shaftH - 16} Z" fill="var(--accent-green)"/>`;
      } else {
        svg += `<rect x="${cx - shaftW}" y="${topY + shaftH}" width="${shaftW * 2}" height="${headH}" rx="2" fill="var(--accent-purple,#a855f7)" opacity="0.5" stroke="var(--border-color)" stroke-width="1"/>`;
      }
    }

    svg += '</svg>';
    return svg;
  }

  function _up() {
    const r = document.getElementById('th-result');
    if (!r) return;
    const p = _p();
    const dia = parseInt(p.standard.replace('M', ''), 10);
    const labels = { bolt: 'Bolt', nut: 'Nut', standoff: 'Standoff', 'snap-male': 'Snap Joint (Male)', 'snap-female': 'Snap Joint (Female)' };
    const headLabel = p.type === 'bolt' ? `, ${p.headType} head` : '';

    r.innerHTML = `
      <div style="display:flex;gap:6px;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._thPreview3D()" style="background:var(--accent-cyan);color:#fff">\ud83d\udd0d 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._thDownload()" style="background:var(--accent-green);color:#fff">\u2b07 Download 3MF</button>
      </div>
      <div style="font-size:0.85rem;font-weight:600;margin-top:4px">${labels[p.type] || p.type}</div>
      <div style="font-size:0.78rem;color:var(--text-muted)">${p.standard} \u00d7 ${p.length}mm, tolerance \u00b1${p.tolerance}mm${headLabel}</div>
      <div style="font-size:0.7rem;color:var(--text-muted)">\u00d8${dia}mm nominal diameter</div>
      <div style="border-radius:8px;overflow:hidden;padding:8px">${_drawSketch(p)}</div>`;
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/thread/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p())
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Generation failed');
    return res.blob();
  }

  window._thDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating thread model...', 'info');
      const blob = await _gen();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `${_p().type}-${_p().standard}.3mf`;
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._thPreview3D = async function() {
    const r = document.getElementById('th-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'thread.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Thread');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
