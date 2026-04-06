// Model Forge — Multi-Color Generator
(function() {
  'use strict';

  let _parts = [
    { shape: 'box', color: '#3b82f6', w: 30, h: 30, d: 3 },
    { shape: 'box', color: '#ef4444', w: 30, h: 30, d: 3 }
  ];

  window.loadForgeMultiColor = function() {
    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `<style>
      .mc-layout{display:grid;grid-template-columns:360px 1fr;gap:12px;min-height:500px}
      .mc-sidebar{overflow-y:auto;max-height:calc(100vh - 180px)}
      .mc-form{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:10px;padding:12px}
      .mc-preview{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:10px;padding:16px;min-height:400px}
      .mc-part{background:var(--bg-tertiary,var(--bg-primary));border:1px solid var(--border-color);border-radius:8px;padding:10px;margin-bottom:8px}
      .mc-part-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
      @media(max-width:900px){.mc-layout{grid-template-columns:1fr}}
    </style>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="form-btn form-btn-sm" onclick="window.loadModelForgePanel()" style="padding:4px 10px">\u2190 Back</button>
      <h4 style="margin:0;font-size:1rem">\ud83c\udfa8 Multi-Color Generator</h4>
    </div>
    <div class="mc-layout">
      <div class="mc-sidebar"><div class="mc-form" id="mc-form">
        <div style="margin-bottom:8px">
          <label style="font-size:0.7rem;color:var(--text-muted)">Layout</label>
          <select id="mc-layout-sel" class="form-input" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="stack" selected>Stack (vertical)</option>
            <option value="side-by-side">Side by Side</option>
            <option value="inlay">Inlay</option>
          </select>
        </div>
        <div id="mc-parts-list"></div>
        <button class="form-btn form-btn-sm" onclick="window._mcAddPart()" style="width:100%;margin-top:6px;padding:6px 0;font-size:0.78rem">\u2795 Add Part</button>
      </div></div>
      <div class="mc-preview" id="mc-result"><div style="color:var(--text-muted)">Configure parts to preview</div></div>
    </div>`;

    _renderParts();
    const form = document.getElementById('mc-form');
    if (form) {
      form.addEventListener('input', () => { clearTimeout(window._mcD); window._mcD = setTimeout(_up, 300); });
      form.addEventListener('change', _up);
    }
    setTimeout(_up, 100);
  };

  function _renderParts() {
    const list = document.getElementById('mc-parts-list');
    if (!list) return;
    list.innerHTML = _parts.map((p, i) => `<div class="mc-part" data-idx="${i}">
      <div class="mc-part-header">
        <span style="font-size:0.8rem;font-weight:600">Part ${i + 1}</span>
        ${_parts.length > 2 ? `<button class="form-btn form-btn-sm" onclick="window._mcRemovePart(${i})" style="padding:2px 8px;font-size:0.65rem;color:var(--accent-red)">\u2716 Remove</button>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">
        <div>
          <label style="font-size:0.7rem;color:var(--text-muted)">Shape</label>
          <select class="form-input mc-shape" data-idx="${i}" style="width:100%;font-size:0.75rem;padding:2px 4px;border-radius:4px">
            <option value="box"${p.shape === 'box' ? ' selected' : ''}>Box</option>
            <option value="cylinder"${p.shape === 'cylinder' ? ' selected' : ''}>Cylinder</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.7rem;color:var(--text-muted)">Color</label>
          <input type="color" class="mc-color" data-idx="${i}" value="${p.color}" style="width:100%;height:28px;border-radius:4px;border:1px solid var(--border-color);cursor:pointer">
        </div>
      </div>
      ${_rf('Width (mm)', 'mc-w-' + i, 5, 150, p.w, 5)}
      ${_rf('Height (mm)', 'mc-h-' + i, 5, 150, p.h, 5)}
      ${_rf('Thickness (mm)', 'mc-d-' + i, 1, 50, p.d, 1)}
    </div>`).join('');
  }

  window._mcAddPart = function() {
    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#06b6d4', '#f97316'];
    _parts = [..._parts, { shape: 'box', color: colors[_parts.length % colors.length], w: 30, h: 30, d: 3 }];
    _renderParts();
    _up();
  };

  window._mcRemovePart = function(idx) {
    if (_parts.length <= 2) return;
    _parts = _parts.filter((_, i) => i !== idx);
    _renderParts();
    _up();
  };

  function _syncParts() {
    _parts = _parts.map((p, i) => ({
      shape: document.querySelector(`.mc-shape[data-idx="${i}"]`)?.value || p.shape,
      color: document.querySelector(`.mc-color[data-idx="${i}"]`)?.value || p.color,
      w: parseFloat(document.getElementById('mc-w-' + i)?.value) || p.w,
      h: parseFloat(document.getElementById('mc-h-' + i)?.value) || p.h,
      d: parseFloat(document.getElementById('mc-d-' + i)?.value) || p.d
    }));
  }

  function _hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  }

  function _p() {
    _syncParts();
    const layout = document.getElementById('mc-layout-sel')?.value || 'stack';
    return {
      layout,
      parts: _parts.map((p, i) => {
        const rgb = _hexToRgb(p.color);
        let x = 0, y = 0, z = 0;
        if (layout === 'stack') {
          z = _parts.slice(0, i).reduce((sum, prev) => sum + prev.d, 0);
        } else if (layout === 'side-by-side') {
          x = _parts.slice(0, i).reduce((sum, prev) => sum + prev.w + 2, 0);
        }
        return { shape: p.shape, color: rgb, x, y, z, w: p.w, h: p.h, d: p.d };
      })
    };
  }

  function _up() {
    _syncParts();
    const r = document.getElementById('mc-result');
    if (!r) return;
    const layout = document.getElementById('mc-layout-sel')?.value || 'stack';
    const maxW = 300;
    const maxH = 280;

    let svgContent = '';
    if (layout === 'stack') {
      const totalD = _parts.reduce((s, p) => s + p.d, 0);
      const scaleW = Math.min(1, maxW / Math.max(..._parts.map(p => p.w)));
      const scaleH = Math.min(1, maxH / totalD);
      const scale = Math.min(scaleW, scaleH, 4);
      let offsetY = 0;
      _parts.forEach(p => {
        const pw = p.w * scale;
        const pd = p.d * scale;
        const px = (maxW - pw) / 2;
        svgContent += `<rect x="${px}" y="${offsetY}" width="${pw}" height="${pd}" rx="3" fill="${p.color}" stroke="var(--border-color)" stroke-width="1"/>`;
        offsetY += pd;
      });
      svgContent = `<svg width="${maxW}" height="${offsetY + 4}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    } else if (layout === 'side-by-side') {
      const totalW = _parts.reduce((s, p) => s + p.w + 2, -2);
      const maxD = Math.max(..._parts.map(p => p.d));
      const scaleW = Math.min(1, maxW / totalW);
      const scaleH = Math.min(1, maxH / maxD);
      const scale = Math.min(scaleW, scaleH, 4);
      let offsetX = 0;
      _parts.forEach(p => {
        const pw = p.w * scale;
        const pd = p.d * scale;
        svgContent += `<rect x="${offsetX}" y="${(maxD * scale - pd) / 2}" width="${pw}" height="${pd}" rx="3" fill="${p.color}" stroke="var(--border-color)" stroke-width="1"/>`;
        offsetX += pw + 2 * scale;
      });
      svgContent = `<svg width="${offsetX}" height="${maxD * scale + 4}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    } else {
      const base = _parts[0] || { w: 30, d: 3, color: '#ccc' };
      const scaleW = Math.min(1, maxW / base.w);
      const scaleH = Math.min(1, maxH / base.h);
      const scale = Math.min(scaleW, scaleH, 4);
      const bw = base.w * scale;
      const bh = base.h * scale;
      svgContent = `<svg width="${bw + 4}" height="${bh + 4}" xmlns="http://www.w3.org/2000/svg">`;
      svgContent += `<rect x="2" y="2" width="${bw}" height="${bh}" rx="3" fill="${_parts[0]?.color || '#ccc'}" stroke="var(--border-color)" stroke-width="1"/>`;
      _parts.slice(1).forEach((p, i) => {
        const iw = Math.min(p.w, base.w - 4) * scale;
        const ih = Math.min(p.h, base.h - 4) * scale;
        const ix = (bw - iw) / 2 + 2;
        const iy = (bh - ih) / 2 + 2;
        svgContent += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="2" fill="${p.color}" stroke="var(--border-color)" stroke-width="0.5"/>`;
      });
      svgContent += '</svg>';
    }

    r.innerHTML = `
      <div style="display:flex;gap:6px;justify-content:center">
        <button class="form-btn form-btn-sm" data-ripple onclick="window._mcPreview3D()" style="background:var(--accent-cyan);color:#fff">\ud83e\uddf1 3D Preview</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._mcDownload()" style="background:var(--accent-green);color:#fff">\u2b07 Download 3MF</button>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted)">${_parts.length} parts, ${layout} layout</div>
      <div style="border-radius:8px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.2);padding:12px;background:var(--bg-primary)">${svgContent}</div>`;
  }

  async function _gen() {
    const res = await fetch('/api/model-forge/multi-color/generate-3mf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_p())
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Generation failed');
    return res.blob();
  }

  window._mcDownload = async function() {
    try {
      if (typeof showToast === 'function') showToast('Generating multi-color model...', 'info');
      const blob = await _gen();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'multi-color.3mf';
      a.click(); URL.revokeObjectURL(a.href);
      if (typeof showToast === 'function') showToast('3MF downloaded!', 'success');
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window._mcPreview3D = async function() {
    const r = document.getElementById('mc-result');
    if (r) r.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Generating 3D...</div>';
    try {
      const blob = await _gen();
      if (typeof window._g3dHandleFile === 'function') window._g3dHandleFile(new File([blob], 'multi-color.3mf'));
      else if (typeof window.open3mfViewer === 'function') window.open3mfViewer(URL.createObjectURL(blob), 'Multi-Color');
      const obs = new MutationObserver(() => { if (!document.getElementById('_global-3d-overlay')) { obs.disconnect(); _up(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) { if (r) r.innerHTML = '<div style="color:var(--accent-red)">' + e.message + '</div>'; }
  };

  function _rf(l, id, min, max, val, step) {
    return `<div style="margin-bottom:5px"><div style="display:flex;align-items:center;justify-content:space-between"><label style="font-size:0.7rem;color:var(--text-muted)">${l}</label><input type="number" class="form-input" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" style="width:50px;font-size:0.75rem;padding:2px 4px;text-align:center;border-radius:4px" oninput="const s=this.parentElement.nextElementSibling;if(s)s.value=this.value"></div><input type="range" min="${min}" max="${max}" value="${val}" step="${step}" style="width:100%;accent-color:var(--accent-blue);margin-top:2px" oninput="const n=this.previousElementSibling.querySelector('input[type=number]');if(n)n.value=this.value"></div>`;
  }
})();
