// color-order-panel.js — "Lowest-purge colour order" optimiser widget.
// Calls POST /api/filament-analytics/color-order (server/color-order.js) to
// recommend the filament order that minimises multi-colour purge waste.
//
// Usage: window.renderColorOrderPanel(containerEl, ["#RRGGBB", ...]?)
(function () {
  function t(key, fb) { return (typeof window.t === 'function') ? window.t(key, fb) : fb; }
  const _ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return s == null ? '' : String(s).replace(/[&<>"']/g, c => _ESC[c]); }
  function norm(hex) {
    let s = String(hex || '').trim();
    if (!s) return '#CCCCCC';
    if (s[0] !== '#') s = '#' + s;
    return /^#[0-9a-fA-F]{6}$/.test(s) ? s.toUpperCase() : '#CCCCCC';
  }
  function swatch(hex, size = 22) {
    return `<span title="${esc(hex)}" style="display:inline-block;width:${size}px;height:${size}px;border-radius:5px;`
      + `background:${esc(hex)};border:1px solid rgba(255,255,255,0.25);vertical-align:middle"></span>`;
  }

  // Pull colours from the currently-loaded AMS/filaments if available.
  function loadedColors() {
    try {
      const st = window.printerState?.getActivePrinterState?.() || {};
      const ams = st.print?.ams?.ams || st.ams?.ams;
      const out = [];
      if (Array.isArray(ams)) for (const unit of ams)
        for (const tray of (unit.tray || []))
          if (tray && tray.tray_color) out.push('#' + String(tray.tray_color).slice(0, 6));
      if (out.length >= 2) return out;
    } catch (_) { /* ignore */ }
    return ['#FFFFFF', '#101010', '#E03030', '#2D6DFF'];
  }

  function renderColorOrderPanel(container, initialColors) {
    if (!container) return;
    let colors = (Array.isArray(initialColors) && initialColors.length >= 2)
      ? initialColors.map(norm) : loadedColors().map(norm);

    function draw(result) {
      const inputs = colors.map((c, i) => `
        <span class="co-chip" style="display:inline-flex;align-items:center;gap:4px;margin:2px 4px 2px 0">
          <input type="color" value="${esc(c)}" data-i="${i}" class="co-input"
                 style="width:34px;height:28px;padding:0;border:none;background:none;cursor:pointer">
          ${colors.length > 2 ? `<button class="co-del" data-i="${i}" title="${esc(t('common.remove','Remove'))}"
                 style="border:none;background:none;color:var(--text-muted,#999);cursor:pointer;font-size:14px">&times;</button>` : ''}
        </span>`).join('');

      let resultHtml = '';
      if (result) {
        const seq = result.orderedColors.map(c => swatch(c)).join(
          `<span style="margin:0 4px;color:var(--text-muted,#999)">&rarr;</span>`);
        const saved = result.savedG > 0
          ? `<span style="color:#36c">${t('colororder.saves','Saves')} <b>${result.savedG} g</b> (${result.savedPct}%)</span>`
          : `<span style="color:var(--text-muted,#999)">${t('colororder.already_optimal','Already near-optimal — no meaningful saving')}</span>`;
        resultHtml = `
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border-color,rgba(255,255,255,0.1))">
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px">${seq}</div>
            <div style="font-size:13px">${saved}
              <span style="color:var(--text-muted,#999);margin-left:8px">
                ${t('colororder.purge','Purge')}: ${result.optimizedFlushG} g
                ${result.baselineFlushG !== result.optimizedFlushG ? `<s>${result.baselineFlushG} g</s>` : ''}
              </span>
            </div>
          </div>`;
      }

      container.innerHTML = `
        <div class="settings-card">
          <h3 style="margin:0 0 4px"><i class="fas fa-palette"></i> ${t('colororder.title','Lowest-purge colour order')}</h3>
          <p class="text-muted" style="font-size:12px;margin:0 0 8px">
            ${t('colororder.hint','Pick the filament colours for a multi-colour print to get the load order that minimises purge waste.')}
          </p>
          <div class="co-inputs" style="display:flex;flex-wrap:wrap;align-items:center">${inputs}
            ${colors.length < 8 ? `<button class="co-add" title="${esc(t('common.add','Add'))}"
              style="border:1px dashed var(--border-color,#666);background:none;color:var(--text-muted,#999);border-radius:5px;width:28px;height:28px;cursor:pointer;margin:2px">+</button>` : ''}
          </div>
          <button class="co-go btn btn-primary btn-sm" style="margin-top:8px">
            <i class="fas fa-wand-magic-sparkles"></i> ${t('colororder.optimize','Optimise order')}
          </button>
          ${resultHtml}
        </div>`;

      container.querySelectorAll('.co-input').forEach(el =>
        el.addEventListener('input', e => { colors[+e.target.dataset.i] = norm(e.target.value); }));
      container.querySelectorAll('.co-del').forEach(el =>
        el.addEventListener('click', e => { colors.splice(+e.target.dataset.i, 1); draw(null); }));
      const addBtn = container.querySelector('.co-add');
      if (addBtn) addBtn.addEventListener('click', () => { colors.push('#888888'); draw(null); });
      container.querySelector('.co-go').addEventListener('click', optimise);
    }

    async function optimise() {
      const btn = container.querySelector('.co-go');
      if (btn) { btn.disabled = true; btn.textContent = t('colororder.optimizing', 'Optimising…'); }
      try {
        const res = await fetch('/api/filament-analytics/color-order', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ colors }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'request failed');
        draw(data);
      } catch (e) {
        if (btn) { btn.disabled = false; }
        draw(null);
        if (window.showToast) window.showToast(t('colororder.failed', 'Could not optimise colour order'), 'error');
      }
    }

    draw(null);
  }

  window.renderColorOrderPanel = renderColorOrderPanel;
})();
