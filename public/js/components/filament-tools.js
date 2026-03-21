// Filament Inventory — Tools sub-tabs: temperature guide, compatibility matrix, color card, NFC/tag manager, spool timeline
(function() {

  // ═══ Tools Dashboard Sub-tabs ═══
  window._switchToolsSubTab = function(tab) {
    window._fs.toolsSubTab = tab;
    document.querySelectorAll('#tools-sub-content').length; // ensure dom ready
    document.querySelectorAll('.drying-sub-tab').forEach(b => {
      const parent = b.closest('[id]');
      if (parent && parent.id !== 'tools-sub-content') return; // only tools tabs
    });
    // Re-render tabs active state
    const container = document.getElementById('tools-sub-content')?.closest('.stats-module');
    if (container) {
      container.querySelectorAll('.drying-sub-tab').forEach(b => {
        const isActive = b.textContent.trim() === ({
          spools: t('filament.tools_sub_spools'),
          colors: t('filament.color_card'),
          tags: t('filament.nfc_manager'),
          reference: t('filament.material_reference')
        })[tab];
        b.classList.toggle('active', isActive);
      });
    }
    _renderToolsSubContent();
  };

  function _renderToolsSubContent() {
    const el = document.getElementById('tools-sub-content');
    if (!el) return;
    if (window._fs.toolsSubTab === 'spools') {
      el.innerHTML = `<div class="ctrl-card-title" style="display:flex;align-items:center;justify-content:space-between">
        <span style="display:flex;align-items:center;gap:6px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          ${t('filament.checked_out_spools')}
        </span>
      </div>
      <div id="checked-out-container"><span class="text-muted text-sm">Loading...</span></div>
      <div class="ctrl-card-title" style="margin-top:16px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${t('filament.spool_timeline')}
      </div>
      <div id="timeline-container"><span class="text-muted text-sm">Loading...</span></div>`;
      if (typeof window._loadCheckedOut === 'function') window._loadCheckedOut();
      _loadTimeline();
    } else if (window._fs.toolsSubTab === 'colors') {
      el.innerHTML = `<div class="ctrl-card-title" style="display:flex;align-items:center;justify-content:space-between">
        <span style="display:flex;align-items:center;gap:6px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/></svg>
          ${t('filament.color_card')}
        </span>
        <div id="color-card-actions" style="display:none;gap:4px">
          <button class="form-btn form-btn-sm" data-ripple onclick="exportColorCard()">${t('filament.color_card_export')}</button>
          <button class="form-btn form-btn-sm" data-ripple onclick="sharePalette()" style="display:flex;align-items:center;gap:4px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            ${t('filament.share_palette')}
          </button>
        </div>
      </div>
      <div id="color-card-container"><span class="text-muted text-sm">Loading...</span></div>`;
      _loadColorCard();
    } else if (window._fs.toolsSubTab === 'tags') {
      el.innerHTML = `<div class="ctrl-card-title" style="display:flex;align-items:center;justify-content:space-between">
        <span style="display:flex;align-items:center;gap:6px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8.32a7.43 7.43 0 010 7.36"/><path d="M9.46 6.21a11.76 11.76 0 010 11.58"/><path d="M12.91 4.1a16.09 16.09 0 010 15.8"/><path d="M16.37 2a20.42 20.42 0 010 20"/></svg>
          ${t('filament.nfc_manager')}
        </span>
        <button class="form-btn form-btn-sm" data-ripple onclick="openTagScanner()">${t('filament.tag_scan')}</button>
      </div>
      <div id="nfc-container"><span class="text-muted text-sm">Loading...</span></div>`;
      _loadNfcMappings();
    } else if (window._fs.toolsSubTab === 'reference') {
      el.innerHTML = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        ${t('filament.material_reference')}
      </div>
      <div class="fil-matref-filter mb-sm">
        <select class="form-input form-input-sm" id="matref-category-filter" onchange="filterMaterials()">
          <option value="">All Categories</option>
          <option value="standard">Standard</option>
          <option value="engineering">Engineering</option>
          <option value="composite">Composite</option>
          <option value="flexible">Flexible</option>
          <option value="specialty">Specialty</option>
          <option value="support">Support</option>
          <option value="high-performance">High Performance</option>
        </select>
      </div>
      <div id="matref-container"><span class="text-muted text-sm">Loading...</span></div>`;
      if (typeof window._loadMaterials === 'function') window._loadMaterials();
    } else if (window._fs.toolsSubTab === 'compat') {
      el.innerHTML = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        ${t('filament.compatibility')}
      </div>
      <div id="compat-container"><span class="text-muted text-sm">Loading...</span></div>`;
      _loadCompatMatrix();
    } else if (window._fs.toolsSubTab === 'tempguide') {
      el.innerHTML = `<div class="ctrl-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
        ${t('filament.temp_guide')}
      </div>
      <div id="tempguide-container"><span class="text-muted text-sm">Loading...</span></div>`;
      _loadTempGuide();
    }
  }

  // ═══ Temperature Guide ═══
  async function _loadTempGuide() {
    const el = document.getElementById('tempguide-container');
    if (!el) return;
    try {
      const res = await fetch('/api/inventory/temperature-guide');
      const data = await res.json();
      if (data.length === 0) { el.innerHTML = `<p class="text-muted">${t('filament.temp_guide_empty')}</p>`; return; }
      let h = '<div style="overflow-x:auto"><table class="compat-matrix"><thead><tr>';
      h += `<th>${t('filament.filter_material')}</th><th>${t('filament.nozzle_temp')} (°C)</th><th>${t('filament.bed_temp')} (°C)</th>`;
      h += `<th>${t('filament.temp_enclosure')}</th><th>${t('filament.temp_nozzle_rec')}</th><th>${t('filament.temp_tips')}</th></tr></thead><tbody>`;
      for (const r of data) {
        let tipsHtml = '—';
        if (r.tips) {
          try {
            const tp = typeof r.tips === 'string' ? JSON.parse(r.tips) : r.tips;
            const parts = [];
            if (tp.print) parts.push(`<b>${t('filament.tip_print')}:</b> ${tp.print}`);
            if (tp.storage) parts.push(`<b>${t('filament.tip_storage')}:</b> ${tp.storage}`);
            if (tp.post) parts.push(`<b>${t('filament.tip_post')}:</b> ${tp.post}`);
            tipsHtml = parts.length ? parts.join('<br>') : String(r.tips);
          } catch { tipsHtml = String(r.tips); }
        }
        h += `<tr>
          <td><b>${r.material}</b> <span class="text-muted">(${r.profile_count})</span></td>
          <td>${r.nozzle_min || '?'}–${r.nozzle_max || '?'}</td>
          <td>${r.bed_min || '?'}–${r.bed_max || '?'}</td>
          <td>${r.enclosure ? '✅' : '—'}</td>
          <td>${r.nozzle_recommendation || '—'}</td>
          <td style="max-width:300px;font-size:0.8em">${tipsHtml}</td>
        </tr>`;
      }
      h += '</tbody></table></div>';
      el.innerHTML = h;
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  // ═══ Compatibility Matrix ═══
  async function _loadCompatMatrix() {
    const el = document.getElementById('compat-container');
    if (!el) return;
    try {
      const res = await fetch('/api/inventory/compatibility');
      const rules = await res.json();
      if (rules.length === 0) { el.innerHTML = `<p class="text-muted">${t('filament.compat_empty')}</p>`; return; }
      const materials = [...new Set(rules.map(r => r.material))].sort();
      const plates = [...new Set(rules.map(r => r.plate_type))].sort();
      const icons = { good: '✅', fair: '⚠️', poor: '❌' };
      let h = '<div style="overflow-x:auto"><table class="compat-matrix"><thead><tr><th>' + t('filament.filter_material') + '</th>';
      for (const p of plates) h += `<th>${p.replace(/_/g, ' ')}</th>`;
      h += '</tr></thead><tbody>';
      for (const mat of materials) {
        h += `<tr><td><b>${mat}</b></td>`;
        for (const plate of plates) {
          const rule = rules.find(r => r.material === mat && r.plate_type === plate);
          if (rule) {
            h += `<td title="${rule.notes || ''}" class="compat-${rule.compatibility}">${icons[rule.compatibility] || '—'}</td>`;
          } else {
            h += '<td>—</td>';
          }
        }
        h += '</tr>';
      }
      h += '</tbody></table></div>';
      el.innerHTML = h;
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  // ═══ Color Card ═══
  async function _loadColorCard() {
    const el = document.getElementById('color-card-container');
    if (!el) return;
    try {
      const res = await fetch('/api/inventory/color-card');
      const grouped = await res.json();
      const materials = Object.keys(grouped).sort();
      const actions = document.getElementById('color-card-actions');
      if (materials.length === 0) {
        el.innerHTML = `<p class="text-muted" style="font-size:0.8rem;padding:8px 0">${t('filament.no_spools')}</p>`;
        if (actions) actions.style.display = 'none';
        return;
      }
      if (actions) actions.style.display = 'flex';
      let h = '<div class="fil-color-card" id="color-card-canvas-area">';
      for (const mat of materials) {
        h += `<div class="fil-color-group"><div class="fil-color-group-title">${esc(mat)}</div><div class="fil-color-swatches">`;
        for (const s of grouped[mat]) {
          const c = window._filHelpers.hexToRgb(s.color_hex);
          const pct = window._filHelpers.spoolPct(s) || 80;
          h += `<div class="fil-color-swatch-card" title="${esc(s.vendor_name || '')} ${esc(s.name || '')}\n${esc(s.color_name || '')}">
            ${typeof spoolIcon === 'function' ? spoolIcon(c, 48, pct) : `<div class="fil-color-swatch-big" style="background:${c}"></div>`}
            <div class="fil-color-swatch-name">${esc(s.color_name || s.name || '')}</div>
          </div>`;
        }
        h += '</div></div>';
      }
      h += '</div>';
      el.innerHTML = h;
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  window.exportColorCard = function() {
    const area = document.getElementById('color-card-canvas-area');
    if (!area) return;
    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`<html><head><title>${t('filament.color_card')}</title><style>
      body{font-family:sans-serif;padding:20px;background:#fff;color:#333}
      .fil-color-group{margin-bottom:16px}
      .fil-color-group-title{font-weight:bold;font-size:14px;margin-bottom:8px;border-bottom:1px solid #ddd;padding-bottom:4px}
      .fil-color-swatches{display:flex;flex-wrap:wrap;gap:8px}
      .fil-color-swatch-card{text-align:center;width:60px}
      .fil-color-swatch-big{width:48px;height:48px;border-radius:6px;margin:0 auto 4px}
      .fil-color-swatch-name{font-size:9px;word-break:break-word}
      @media print{@page{margin:10mm}}
    </style></head><body>${area.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  window.sharePalette = async function() {
    try {
      const filters = {};
      if (_filterMaterial) filters.material = _filterMaterial;
      if (_filterVendor) filters.vendor = _filterVendor;
      if (_filterLocation) filters.location = _filterLocation;
      const res = await fetch('/api/inventory/palette/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t('filament.color_card'), filters })
      });
      const data = await res.json();
      if (data.url) {
        const fullUrl = location.origin + data.url;
        try { await navigator.clipboard.writeText(fullUrl); } catch (_) {}
        showToast(t('filament.palette_shared') + ': ' + fullUrl, 'success');
      }
    } catch (e) {
      showToast(t('filament.load_failed'), 'error');
    }
  };

  // ═══ NFC Manager ═══
  async function _loadNfcMappings() {
    const el = document.getElementById('nfc-container');
    if (!el) return;
    try {
      const res = await fetch('/api/nfc/mappings');
      const mappings = await res.json();
      if (!mappings.length) {
        el.innerHTML = `<p class="text-muted" style="font-size:0.8rem;padding:8px 0">${t('filament.nfc_no_mappings')}</p>`;
        return;
      }
      let h = '<div class="fil-nfc-list">';
      for (const m of mappings) {
        const color = m.color_hex ? window._filHelpers.hexToRgb(m.color_hex) : '#888';
        h += `<div class="fil-nfc-item">
          ${miniSpool(color, 16)}
          <div class="fil-nfc-info">
            <strong>${esc(m.spool_name || t('filament.nfc_unlinked'))}</strong>
            <span class="text-muted" style="font-size:0.75rem">UID: ${esc(m.tag_uid)} · ${esc(m.standard || 'openspool')}</span>
          </div>
          <button class="filament-delete-btn" style="opacity:1" onclick="unlinkNfcItem('${esc(m.tag_uid)}')" title="${t('settings.delete')}" data-tooltip="${t('settings.delete')}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`;
      }
      h += '</div>';
      el.innerHTML = h;
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  // ── Multi-method Tag Scanner ──
  let _tagScannerStream = null;
  let _tagScannerNdef = null;
  let _tagScannerWedgeTimer = null;

  window.openTagScanner = function() {
    const hasNfc = 'NDEFReader' in window;
    const methods = [];
    if (hasNfc) methods.push({ id: 'nfc', label: t('filament.tag_method_nfc') });
    methods.push({ id: 'camera', label: t('filament.tag_method_camera') });
    methods.push({ id: 'usb', label: t('filament.tag_method_usb') });
    methods.push({ id: 'manual', label: t('filament.tag_method_manual') });

    const tabs = methods.map((m, i) =>
      `<button class="tag-scanner-tab${i === 0 ? ' active' : ''}" data-method="${m.id}" onclick="window._tagSwitchTab('${m.id}')">${m.label}</button>`
    ).join('');

    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.id = 'tag-scanner-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) window.closeTagScanner(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:440px">
      <div class="inv-modal-header">
        <span>${t('filament.tag_scanner')}</span>
        <button class="inv-modal-close" onclick="closeTagScanner()">&times;</button>
      </div>
      <div class="tag-scanner-tabs">${tabs}</div>
      <div id="tag-scanner-body" style="padding:16px;min-height:180px"></div>
      <div id="tag-scanner-result" style="padding:0 16px 16px"></div>
    </div>`;
    document.body.appendChild(overlay);
    window._tagSwitchTab(methods[0].id);
  };

  window._tagSwitchTab = function(method) {
    // Clean up previous method
    _tagCleanupMethod();
    // Update tab active state
    document.querySelectorAll('.tag-scanner-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.method === method);
    });
    const body = document.getElementById('tag-scanner-body');
    const result = document.getElementById('tag-scanner-result');
    if (!body) return;
    if (result) result.innerHTML = '';

    if (method === 'nfc') {
      body.innerHTML = `<div style="text-align:center;padding:16px 0">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="1.5"><path d="M6 8.32a7.43 7.43 0 010 7.36"/><path d="M9.46 6.21a11.76 11.76 0 010 11.58"/><path d="M12.91 4.1a16.09 16.09 0 010 15.8"/><path d="M16.37 2a20.42 20.42 0 010 20"/></svg>
        <p style="margin-top:12px">${t('filament.nfc_hold_tag')}</p>
        <p class="text-muted" style="font-size:0.75rem">${t('filament.nfc_scanning')}...</p>
      </div>`;
      _tagStartNfc();
    } else if (method === 'camera') {
      body.innerHTML = `<div style="position:relative">
        <video id="tag-scanner-video" style="width:100%;border-radius:6px;background:#000" autoplay playsinline></video>
        <canvas id="tag-scanner-canvas" style="display:none"></canvas>
      </div>
      <p class="text-muted" style="font-size:0.75rem;text-align:center;margin-top:8px">${t('filament.scanning')}</p>`;
      _tagStartCamera();
    } else if (method === 'usb') {
      body.innerHTML = `<div style="text-align:center;padding:16px 0">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><circle cx="12" cy="16" r="2"/></svg>
        <p style="margin-top:12px;font-size:0.85rem">${t('filament.tag_usb_hint')}</p>
        <input type="text" id="tag-usb-input" class="form-input" style="margin-top:12px;text-align:center;font-family:monospace;font-size:1.1rem;letter-spacing:1px" autofocus placeholder="${t('filament.tag_usb_placeholder')}">
      </div>`;
      setTimeout(() => {
        const inp = document.getElementById('tag-usb-input');
        if (inp) {
          inp.focus();
          inp.addEventListener('input', () => {
            clearTimeout(_tagScannerWedgeTimer);
            if (inp.value.length >= 4) {
              _tagScannerWedgeTimer = setTimeout(() => {
                const uid = inp.value.trim();
                if (uid) _handleScannedTag(uid);
              }, 500);
            }
          });
          inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              clearTimeout(_tagScannerWedgeTimer);
              const uid = inp.value.trim();
              if (uid) _handleScannedTag(uid);
            }
          });
        }
      }, 50);
    } else if (method === 'manual') {
      body.innerHTML = `<div style="padding:8px 0">
        <p style="font-size:0.85rem;margin-bottom:12px">${t('filament.tag_manual_hint')}</p>
        <div style="display:flex;gap:8px">
          <input type="text" id="tag-manual-input" class="form-input" style="flex:1;font-family:monospace" placeholder="${t('filament.tag_manual_placeholder')}">
          <button class="form-btn form-btn-sm" data-ripple onclick="window._tagManualLookup()">${t('filament.nfc_link')}</button>
        </div>
      </div>`;
      setTimeout(() => { const inp = document.getElementById('tag-manual-input'); if (inp) inp.focus(); }, 50);
    }
  };

  window._tagManualLookup = function() {
    const inp = document.getElementById('tag-manual-input');
    const uid = inp?.value?.trim();
    if (!uid) return;
    _handleScannedTag(uid);
  };

  async function _tagStartNfc() {
    try {
      _tagScannerNdef = new NDEFReader();
      await _tagScannerNdef.scan();
      _tagScannerNdef.onreading = (event) => {
        const uid = event.serialNumber || 'unknown';
        _handleScannedTag(uid);
      };
    } catch (e) {
      showToast(t('filament.nfc_error') + ': ' + e.message, 'error');
    }
  }

  async function _tagStartCamera() {
    const video = document.getElementById('tag-scanner-video');
    const canvas = document.getElementById('tag-scanner-canvas');
    if (!video || !canvas) return;
    try {
      _tagScannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      video.srcObject = _tagScannerStream;
      video.play();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const startScan = () => _tagScanFrame(video, canvas, ctx);
      if (typeof jsQR === 'undefined') {
        const script = document.createElement('script');
        script.src = '/js/lib/jsqr.min.js';
        script.onload = startScan;
        script.onerror = () => showToast(t('filament.qr_lib_failed'), 'error');
        document.head.appendChild(script);
      } else {
        startScan();
      }
    } catch {
      const body = document.getElementById('tag-scanner-body');
      if (body) body.innerHTML = `<p class="text-muted" style="padding:24px;text-align:center">${t('filament.camera_denied')}</p>`;
    }
  }

  function _tagScanFrame(video, canvas, ctx) {
    if (!document.getElementById('tag-scanner-overlay')) return;
    if (!_tagScannerStream) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
      if (code && code.data) {
        // Parse as spool URL or raw UID
        const spoolMatch = code.data.match(/#filament\/spool\/(\d+)/);
        if (spoolMatch) {
          const spoolId = parseInt(spoolMatch[1]);
          const spool = window._fs.spools.find(s => s.id === spoolId);
          if (spool) {
            _tagCleanupMethod();
            closeTagScanner();
            showEditSpoolForm(spoolId);
            return;
          }
        }
        // Try as NFC UID
        _handleScannedTag(code.data);
        return;
      }
    }
    requestAnimationFrame(() => _tagScanFrame(video, canvas, ctx));
  }

  async function _handleScannedTag(uid) {
    const resultEl = document.getElementById('tag-scanner-result');
    if (!resultEl) return;
    resultEl.innerHTML = `<div style="padding:12px;background:var(--bg-secondary);border-radius:8px;text-align:center">
      <span class="text-muted">${t('filament.scanning')}...</span>
    </div>`;
    try {
      const res = await fetch(`/api/nfc/lookup/${encodeURIComponent(uid)}`);
      if (res.ok) {
        const tag = await res.json();
        const color = tag.color_hex ? window._filHelpers.hexToRgb(tag.color_hex) : '#888';
        resultEl.innerHTML = `<div style="padding:12px;background:var(--bg-secondary);border-radius:8px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            ${typeof spoolIcon === 'function' ? spoolIcon(color, 28) : `<span class="filament-color-swatch" style="background:${color};width:24px;height:24px"></span>`}
            <div>
              <strong>${esc(tag.spool_name || 'Unknown')}</strong><br>
              <span class="text-muted text-sm">${esc(tag.material || '')} · ${esc(tag.vendor_name || '')}</span>
            </div>
          </div>
          <span class="text-muted" style="font-size:0.75rem">UID: ${esc(uid)}${tag.standard ? ` · ${esc(tag.standard)}` : ''}</span>
          ${'NDEFReader' in window ? `<button class="form-btn form-btn-sm" data-ripple style="margin-top:6px" onclick="window._nfcWriteToTag(${tag.spool_id})">${t('filament.nfc_write_to_tag')}</button>` : ''}
        </div>`;
      } else {
        // Build spool options for linking
        let spoolOpts = `<option value="">${t('filament.tag_select_spool')}</option>`;
        for (const s of window._fs.spools) {
          const name = s.profile_name || s.material || `Spool #${s.id}`;
          const vendor = s.vendor_name ? ` (${s.vendor_name})` : '';
          spoolOpts += `<option value="${s.id}">${esc(name)}${esc(vendor)}</option>`;
        }
        resultEl.innerHTML = `<div style="padding:12px;background:var(--bg-secondary);border-radius:8px">
          <p style="margin-bottom:8px">${t('filament.tag_not_found')}</p>
          <span class="text-muted" style="font-size:0.75rem">UID: ${esc(uid)}</span>
          <div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <select id="tag-link-spool-select" class="form-input" style="flex:1;min-width:120px">${spoolOpts}</select>
            <select id="tag-link-standard" class="form-input" style="width:100px">
              <option value="openspool">${t('filament.nfc_standard_openspool')}</option>
              <option value="bambu">${t('filament.nfc_standard_bambu')}</option>
              <option value="ntag">${t('filament.nfc_standard_ntag')}</option>
            </select>
            <button class="form-btn form-btn-sm" data-ripple onclick="window._tagLinkSpool('${esc(uid)}')">${t('filament.tag_link_spool')}</button>
          </div>
        </div>`;
      }
    } catch {
      resultEl.innerHTML = `<span class="text-muted">Error</span>`;
    }
  }

  window._tagLinkSpool = async function(uid) {
    const select = document.getElementById('tag-link-spool-select');
    const spoolId = select?.value;
    if (!spoolId) return;
    const standard = document.getElementById('tag-link-standard')?.value || 'openspool';
    try {
      await fetch('/api/nfc/link', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_uid: uid, spool_id: parseInt(spoolId), standard })
      });
      showToast(t('filament.tag_found'), 'success');
      closeTagScanner();
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ═══ NFC Write ═══
  window._nfcWriteToTag = async function(spoolId) {
    if (!('NDEFReader' in window)) { showToast(t('filament.nfc_write_unsupported'), 'error'); return; }
    const spool = window._fs.spools.find(s => s.id === spoolId);
    if (!spool) return;
    const host = location.host;
    const proto = location.protocol;
    const url = `${proto}//${host}/#filament/spool/${spoolId}`;
    const statusEl = document.getElementById('tag-scanner-result');
    if (statusEl) statusEl.innerHTML = `<div style="padding:12px;background:var(--bg-secondary);border-radius:8px;text-align:center"><span class="text-muted">${t('filament.nfc_hold_to_write')}...</span></div>`;
    try {
      const writer = new NDEFReader();
      await writer.write({
        records: [
          { recordType: 'url', data: url },
          { recordType: 'text', data: `${spool.profile_name || spool.material || 'Spool'} #${spool.short_id || spoolId}` }
        ]
      });
      showToast(t('filament.nfc_write_success'), 'success');
      if (statusEl) statusEl.innerHTML = `<div style="padding:12px;background:var(--bg-secondary);border-radius:8px;text-align:center;color:var(--accent-green)">${t('filament.nfc_write_success')}</div>`;
    } catch (e) {
      showToast(t('filament.nfc_write_failed') + ': ' + e.message, 'error');
      if (statusEl) statusEl.innerHTML = `<div style="padding:12px;background:var(--bg-secondary);border-radius:8px;text-align:center;color:var(--accent-red)">${t('filament.nfc_write_failed')}: ${esc(e.message)}</div>`;
    }
  };

  function _tagCleanupMethod() {
    // Stop camera
    if (_tagScannerStream) {
      _tagScannerStream.getTracks().forEach(t => t.stop());
      _tagScannerStream = null;
    }
    // Stop NFC
    if (_tagScannerNdef) {
      _tagScannerNdef.onreading = null;
      _tagScannerNdef = null;
    }
    // Clear wedge timer
    clearTimeout(_tagScannerWedgeTimer);
  }

  window.closeTagScanner = function() {
    _tagCleanupMethod();
    const overlay = document.getElementById('tag-scanner-overlay');
    if (overlay) overlay.remove();
  };

  window.linkNfcToSpool = async function(uid) {
    // Legacy compat — opens tag scanner instead
    window.openTagScanner();
  };

  window.unlinkNfcItem = function(uid) {
    return confirmAction(t('filament.nfc_unlink_confirm'), async () => {
      try {
        await fetch(`/api/nfc/link/${encodeURIComponent(uid)}`, { method: 'DELETE' });
        loadFilament();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  // ═══ Spool Timeline ═══
  async function _loadTimeline() {
    const el = document.getElementById('timeline-container');
    if (!el) return;
    try {
      const res = await fetch('/api/inventory/events?limit=50');
      const events = await res.json();
      if (!events.length) { el.innerHTML = `<p class="text-muted" style="font-size:0.8rem;padding:8px 0">${t('filament.timeline_empty')}</p>`; return; }
      const eventIcons = {
        created: '&#x2795;', edited: '&#x270F;', used: '&#x1F4E6;', dried: '&#x1F4A7;',
        assigned: '&#x1F5A8;', unassigned: '&#x2B05;', archived: '&#x1F4E6;', unarchived: '&#x21A9;',
        checked_out: '&#x2197;', checked_in: '&#x2199;', empty: '&#x26A0;'
      };
      let h = '<div class="fil-timeline">';
      for (const ev of events) {
        const icon = eventIcons[ev.event_type] || '&#x2022;';
        const time = ev.timestamp ? new Date(ev.timestamp + 'Z').toLocaleString() : '';
        h += `<div class="fil-timeline-item">
          <div class="fil-timeline-dot">${icon}</div>
          <div class="fil-timeline-content">
            <div class="fil-timeline-header">
              <strong>${esc(ev.spool_name || 'Spool #' + ev.spool_id)}</strong>
              <span class="text-muted" style="font-size:0.7rem">${time}</span>
            </div>
            <div class="fil-timeline-event">${t('filament.event_' + ev.event_type, {}, ev.event_type)}</div>
            ${ev.actor ? `<span class="text-muted" style="font-size:0.7rem">${esc(ev.actor)}</span>` : ''}
          </div>
        </div>`;
      }
      h += '</div>';
      el.innerHTML = h;
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  // ═══ Spool Timeline Dialog (per spool) ═══
  window.showSpoolTimeline = async function(id) {
    try {
      const res = await fetch(`/api/inventory/spools/${id}/timeline`);
      const events = await res.json();
      const eventIcons = {
        created: '&#x2795;', edited: '&#x270F;', used: '&#x1F4E6;', dried: '&#x1F4A7;',
        assigned: '&#x1F5A8;', unassigned: '&#x2B05;', archived: '&#x1F4E6;', unarchived: '&#x21A9;',
        checked_out: '&#x2197;', checked_in: '&#x2199;', empty: '&#x26A0;'
      };
      let h = '';
      if (!events.length) { h = `<p class="text-muted">${t('filament.timeline_empty')}</p>`; }
      else {
        h = '<div class="fil-timeline">';
        for (const ev of events) {
          const icon = eventIcons[ev.event_type] || '&#x2022;';
          const time = ev.timestamp ? new Date(ev.timestamp + 'Z').toLocaleString() : '';
          h += `<div class="fil-timeline-item">
            <div class="fil-timeline-dot">${icon}</div>
            <div class="fil-timeline-content">
              <div class="fil-timeline-header"><span>${t('filament.event_' + ev.event_type, {}, ev.event_type)}</span><span class="text-muted" style="font-size:0.7rem">${time}</span></div>
            </div>
          </div>`;
        }
        h += '</div>';
      }
      const overlay = document.createElement('div');
      overlay.className = 'inv-modal-overlay';
      overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
      overlay.innerHTML = `<div class="inv-modal" style="max-width:500px">
        <div class="inv-modal-header">
          <span>${t('filament.spool_timeline')}</span>
          <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
        </div>
        <div style="padding:12px;max-height:400px;overflow-y:auto">${h}</div>
      </div>`;
      document.body.appendChild(overlay);
    } catch (e) { showToast(e.message, 'error'); }
  };


})();
