// Filament Inventory — Labels (QR/barcode/ZPL/DYMO/swatch), QR scanner, import dialog, file analyzer, inventory settings, WebSocket listener
(function() {

  function _code128Svg(text, height = 40) {
    const C128 = [
      [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
      [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
      [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
      [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
      [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
      [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
      [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
      [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
      [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
      [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
      [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
      [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
      [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
      [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
      [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
      [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
      [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
      [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
      [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
      [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
      [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
      [2,1,1,2,3,2],[2,3,3,1,1,1,2]
    ];
    // Use Code B
    const codes = [104]; // Start B
    let checksum = 104;
    for (let i = 0; i < text.length; i++) {
      const val = text.charCodeAt(i) - 32;
      codes.push(val);
      checksum += val * (i + 1);
    }
    codes.push(checksum % 103);
    codes.push(106); // Stop
    let bars = '';
    let x = 10;
    for (const code of codes) {
      const pattern = C128[code];
      for (let i = 0; i < pattern.length; i++) {
        if (i % 2 === 0) bars += `<rect x="${x}" y="0" width="${pattern[i]}" height="${height}" fill="black"/>`;
        x += pattern[i];
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x + 10} ${height + 14}" style="max-width:100%"><rect width="100%" height="100%" fill="white"/>${bars}<text x="${(x + 10)/2}" y="${height + 12}" text-anchor="middle" font-size="10" font-family="monospace">${text}</text></svg>`;
  }

  window._toggleLabelCode = function(type) {
    const qrEl = document.querySelector('.inv-qr-code');
    const bcEl = document.querySelector('.inv-barcode');
    if (qrEl) qrEl.style.display = (type === 'barcode') ? 'none' : '';
    if (bcEl) bcEl.style.display = (type === 'qr') ? 'none' : '';
  };

  // ═══ QR Label ═══
  window.showSpoolLabel = async function(id) {
    const res = await fetch(`/api/inventory/spools/${id}/qr`);
    if (!res.ok) return;
    const data = await res.json();
    const label = data.label;
    let qrHtml = '';
    if (typeof qrcode !== 'undefined') {
      const qr = qrcode(0, 'M');
      qr.addData(data.qr_data);
      qr.make();
      qrHtml = qr.createSvgTag(4, 0);
    } else {
      qrHtml = `<div style="width:120px;height:120px;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--text-muted)">${t('filament.qr_unavailable')}</div>`;
    }
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal inv-qr-label">
      <div class="inv-modal-header">
        <span>${t('filament.qr_label')}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:8px 12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <label class="form-label" style="margin:0;font-size:0.75rem">${t('filament.label_format')}:</label>
        <select class="form-input" id="qr-label-format" style="width:auto;font-size:0.75rem" onchange="document.getElementById('qr-label-print').className='inv-qr-label-content inv-qr-label-'+this.value">
          <option value="horizontal" selected>${t('filament.label_horizontal')}</option>
          <option value="vertical">${t('filament.label_vertical')}</option>
          <option value="compact">${t('filament.label_compact')}</option>
        </select>
        <label class="form-label" style="margin:0;font-size:0.75rem">${t('filament.label_code_type')}:</label>
        <select class="form-input" id="qr-label-code-type" style="width:auto;font-size:0.75rem" onchange="window._toggleLabelCode(this.value)">
          <option value="qr" selected>QR</option>
          <option value="barcode">Code 128</option>
          <option value="both">${t('filament.label_both')}</option>
        </select>
        <label class="form-label" style="margin:0;font-size:0.75rem">${t('filament.label_width')}:</label>
        <select class="form-input" id="qr-label-width" style="width:auto;font-size:0.75rem">
          <option value="62">62mm</option>
          <option value="50" selected>50mm</option>
          <option value="38">38mm</option>
          <option value="29">29mm</option>
        </select>
      </div>
      <div class="inv-qr-label-content inv-qr-label-horizontal" id="qr-label-print">
        <div class="inv-qr-code">${qrHtml}</div>
        <div class="inv-barcode" style="display:none;max-width:140px">${_code128Svg(label.short_id || String(id))}</div>
        <div class="inv-qr-info">
          <strong>${esc(label.name)}</strong>
          <span>${esc(label.vendor || '')} · ${esc(label.material || '')}</span>
          <span>${label.color_name ? esc(label.color_name) : ''}</span>
          ${label.short_id ? `<span>#${esc(label.short_id)}</span>` : ''}
          <span>${label.spool_weight_g ? label.spool_weight_g + 'g' : ''} ${label.remaining_weight_g ? '(' + Math.round(label.remaining_weight_g) + 'g ' + t('filament.remaining') + ')' : ''}</span>
          ${label.lot_number ? `<span>Lot: ${esc(label.lot_number)}</span>` : ''}
        </div>
      </div>
      <div class="inv-modal-footer" style="display:flex;gap:6px">
        <button class="form-btn" data-ripple onclick="printQrLabel()">${t('filament.print_label')}</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._copyZplLabel(${id})" title="${t('filament.copy_zpl')}">${t('filament.copy_zpl')}</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._copyDymoLabel(${id})" title="${t('filament.copy_dymo')}">${t('filament.copy_dymo')}</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="window._copyEscPosLabel(${id})" title="${t('filament.copy_escpos')}">${t('filament.copy_escpos')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  };

  window._copyZplLabel = async function(spoolId) {
    try {
      const res = await fetch('/api/inventory/label-zpl?spool_id=' + spoolId);
      const data = await res.json();
      if (data.zpl) {
        await navigator.clipboard.writeText(data.zpl);
        showToast(t('filament.zpl_copied'), 'success');
      }
    } catch { showToast('Error', 'error'); }
  };

  window._copyDymoLabel = async function(spoolId) {
    try {
      const res = await fetch('/api/inventory/label-zpl?spool_id=' + spoolId);
      const data = await res.json();
      if (data.dymo_xml) {
        await navigator.clipboard.writeText(data.dymo_xml);
        showToast(t('filament.dymo_copied'), 'success');
      }
    } catch { showToast('Error', 'error'); }
  };

  window._copyEscPosLabel = async function(spoolId) {
    try {
      const res = await fetch('/api/inventory/label-zpl?spool_id=' + spoolId);
      const data = await res.json();
      if (data.escpos) {
        await navigator.clipboard.writeText(data.escpos);
        showToast(t('filament.escpos_copied'), 'success');
      }
    } catch { showToast('Error', 'error'); }
  };

  window.printQrLabel = function() {
    const content = document.getElementById('qr-label-print');
    if (!content) return;
    const widthMm = document.getElementById('qr-label-width')?.value || '50';
    const format = document.getElementById('qr-label-format')?.value || 'horizontal';
    const isVertical = format === 'vertical';
    const isCompact = format === 'compact';
    const qrSize = isCompact ? '80px' : '120px';
    const fontSize = isCompact ? '10px' : '12px';
    const titleSize = isCompact ? '12px' : '14px';
    const win = window.open('', '_blank', 'width=400,height=300');
    win.document.write(`<html><head><title>${t('filament.qr_label')}</title><style>
      body{font-family:sans-serif;padding:5mm;text-align:center;margin:0}
      .inv-qr-label-content{display:flex;gap:${isCompact?'8px':'16px'};align-items:center;justify-content:center;${isVertical?'flex-direction:column;':''}width:${widthMm}mm;margin:0 auto}
      .inv-qr-info{display:flex;flex-direction:column;gap:2px;text-align:${isVertical?'center':'left'};font-size:${fontSize}}
      .inv-qr-info strong{font-size:${titleSize}}
      svg{width:${qrSize};height:${qrSize}}
      @media print{@page{size:${widthMm}mm auto;margin:2mm}body{padding:0}}
    </style></head><body>${content.outerHTML.replace(/class="[^"]*"/g, m => m.includes('inv-qr-info') || m.includes('inv-qr-code') || m.includes('inv-qr-label-content') ? m : '')}</body></html>`);
    win.document.close();
    win.print();
  };

  // ═══ QR Scanner ═══
  window.openQrScanner = function() {
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.id = 'qr-scanner-overlay';
    overlay.innerHTML = `<div class="inv-modal" style="max-width:400px">
      <div class="inv-modal-header">
        <span>${t('filament.scan_qr')}</span>
        <button class="inv-modal-close" onclick="closeQrScanner()">&times;</button>
      </div>
      <div style="position:relative">
        <video id="qr-scanner-video" style="width:100%;border-radius:4px" autoplay playsinline></video>
        <canvas id="qr-scanner-canvas" style="display:none"></canvas>
      </div>
      <div id="qr-scanner-status" class="text-muted" style="font-size:0.8rem;padding:8px;text-align:center">${t('filament.scanning')}</div>
    </div>`;
    document.body.appendChild(overlay);
    startQrScanning();
  };

  async function startQrScanning() {
    const video = document.getElementById('qr-scanner-video');
    const canvas = document.getElementById('qr-scanner-canvas');
    const status = document.getElementById('qr-scanner-status');
    if (!video || !canvas) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      video.srcObject = stream;
      video.setAttribute('playsinline', true);
      video.play();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      // Try to load jsQR
      if (typeof jsQR === 'undefined') {
        const script = document.createElement('script');
        script.src = '/js/lib/jsqr.min.js';
        script.onload = () => scanFrame(video, canvas, ctx, status, stream);
        script.onerror = () => { if (status) status.textContent = t('filament.qr_lib_failed'); };
        document.head.appendChild(script);
      } else {
        scanFrame(video, canvas, ctx, status, stream);
      }
    } catch (e) {
      if (status) status.textContent = t('filament.camera_denied');
    }
  }

  function scanFrame(video, canvas, ctx, status, stream) {
    if (!document.getElementById('qr-scanner-overlay')) { stream.getTracks().forEach(t => t.stop()); return; }
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
      if (code) {
        // Parse spool ID from URL like /#filament/spool/42
        const match = code.data.match(/#filament\/spool\/(\d+)/);
        if (match) {
          stream.getTracks().forEach(t => t.stop());
          closeQrScanner();
          const spoolId = parseInt(match[1]);
          const spool = window._fs.spools.find(s => s.id === spoolId);
          if (spool) {
            showEditSpoolForm(spoolId);
          } else {
            showToast(t('filament.spool_not_found'), 'warning');
          }
          return;
        }
        if (status) status.textContent = t('filament.qr_not_recognized');
      }
    }
    requestAnimationFrame(() => scanFrame(video, canvas, ctx, status, stream));
  }

  window.closeQrScanner = function() {
    const overlay = document.getElementById('qr-scanner-overlay');
    if (overlay) {
      const video = overlay.querySelector('video');
      if (video && video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
      overlay.remove();
    }
  };

  // ═══ Export ═══
  window.importFromAms = async function() {
    try {
      const res = await fetch('/api/inventory/import-ams', { method: 'POST' });
      const data = await res.json();
      if (data.count > 0) {
        loadFilament();
      } else {
        alert(t('filament.import_ams_none'));
      }
    } catch (e) {
      alert(t('filament.import_ams_failed'));
    }
  };

  window.exportInventory = function(type, format) {
    // Close dropdown
    document.querySelectorAll('.inv-export-menu.show').forEach(m => m.classList.remove('show'));
    const url = `/api/inventory/export/${type}?format=${format}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ═══ Color similarity ═══
  window.findSimilarColors = async function(spoolId) {
    const spool = window._fs.spools.find(s => s.id === spoolId);
    if (!spool || !spool.color_hex) return;
    const res = await fetch(`/api/inventory/colors/similar?hex=${spool.color_hex}&max_delta_e=30`);
    if (!res.ok) return;
    const results = await res.json();
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    let listHtml = '';
    for (const r of results) {
      listHtml += `<div class="inv-similar-item">
        ${miniSpool(window._filHelpers.hexToRgb(r.color_hex), 14)}
        <span>${esc(r.name)} · ${esc(r.material)}</span>
        <span class="text-muted">ΔE ${r.delta_e.toFixed(1)}</span>
      </div>`;
    }
    overlay.innerHTML = `<div class="inv-modal" style="max-width:400px">
      <div class="inv-modal-header">
        <span>${t('filament.similar_colors')}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px">${results.length > 0 ? listHtml : `<p class="text-muted">${t('filament.no_similar_colors')}</p>`}</div>
    </div>`;
    document.body.appendChild(overlay);
  };

  // ═══ SpoolmanDB Browser ═══
  window.showSpoolmanDbBrowser = async function() {
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.id = 'spoolmandb-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:600px;max-height:80vh;display:flex;flex-direction:column">
      <div class="inv-modal-header">
        <span>SpoolmanDB</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:8px"><input class="form-input" id="spoolmandb-search" placeholder="${t('filament.search_placeholder')}" oninput="window._filterSpoolmanDb(this.value)"></div>
      <div id="spoolmandb-content" style="overflow-y:auto;flex:1;padding:8px">
        <span class="text-muted text-sm">${t('filament.loading')}...</span>
      </div>
    </div>`;
    document.body.appendChild(overlay);

    try {
      const res = await fetch('/api/inventory/spoolmandb/manufacturers');
      if (!res.ok) throw new Error();
      const manufacturers = await res.json();
      window._spoolmanDbMfgs = manufacturers;
      renderSpoolmanDbList(manufacturers);
    } catch {
      const c = document.getElementById('spoolmandb-content');
      if (c) c.innerHTML = `<p class="text-muted">${t('filament.spoolmandb_failed')}</p>`;
    }
  };

  window._filterSpoolmanDb = function(query) {
    if (!window._spoolmanDbMfgs) return;
    const q = query.toLowerCase();
    const filtered = q ? window._spoolmanDbMfgs.filter(m => m.name.toLowerCase().includes(q)) : window._spoolmanDbMfgs;
    renderSpoolmanDbList(filtered);
  };

  function renderSpoolmanDbList(manufacturers) {
    const c = document.getElementById('spoolmandb-content');
    if (!c) return;
    if (manufacturers.length === 0) { c.innerHTML = `<p class="text-muted">${t('filament.no_results')}</p>`; return; }
    let h = '';
    for (const m of manufacturers.slice(0, 100)) {
      // m.id is the filename without .json, m.name is same
      const displayName = m.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ');
      h += `<div class="inv-spoolmandb-mfg">
        <div class="inv-spoolmandb-mfg-name" onclick="this.parentElement.classList.toggle('expanded');if(!this.parentElement.dataset.loaded)loadSpoolmanDbFilaments('${esc(m.id)}',this.parentElement)">
          <strong>${esc(displayName)}</strong>
        </div>
        <div class="inv-spoolmandb-filaments" style="display:none"></div>
      </div>`;
    }
    if (manufacturers.length > 100) h += `<p class="text-muted text-sm">... ${manufacturers.length - 100} ${t('filament.more')}</p>`;
    c.innerHTML = h;
  }

  window.loadSpoolmanDbFilaments = async function(mfgId, el) {
    el.dataset.loaded = '1';
    const filDiv = el.querySelector('.inv-spoolmandb-filaments');
    if (!filDiv) return;
    filDiv.style.display = '';
    filDiv.innerHTML = `<span class="text-muted text-sm">${t('filament.loading')}...</span>`;
    try {
      const res = await fetch(`/api/inventory/spoolmandb/filaments?manufacturer=${encodeURIComponent(mfgId)}`);
      const filaments = await res.json();
      let h = '';
      for (const f of filaments) {
        const color = f.color_hex ? window._filHelpers.hexToRgb(f.color_hex) : '#888';
        h += `<div class="inv-spoolmandb-fil">
          ${miniSpool(color, 10)}
          <span>${esc(f.name || '')} · ${esc(f.material || '')}</span>
          <button class="form-btn form-btn-sm" data-ripple onclick='importSpoolmanDbFilament(${JSON.stringify(f).replace(/'/g,"&#39;")})'>${t('filament.import')}</button>
        </div>`;
      }
      filDiv.innerHTML = h || `<span class="text-muted text-sm">${t('filament.no_results')}</span>`;
    } catch {
      filDiv.innerHTML = `<span class="text-muted text-sm">${t('filament.load_failed')}</span>`;
    }
  };

  window.importSpoolmanDbFilament = async function(filament) {
    const res = await fetch('/api/inventory/spoolmandb/import', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filament)
    });
    if (res.ok) {
      const overlay = document.getElementById('spoolmandb-overlay');
      if (overlay) overlay.remove();
      loadFilament();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || t('filament.import_failed'), 'error');
    }
  };

  // ═══ DnD Location drop ═══
  window._invDropSpool = async function(e, colEl) {
    e.preventDefault();
    colEl.classList.remove('inv-dnd-over');
    const spoolId = parseInt(e.dataTransfer.getData('text/plain'));
    const location = colEl.dataset.location || null;
    if (!spoolId) return;
    const spool = window._fs.spools.find(s => s.id === spoolId);
    if (!spool || spool.location === location) return;
    await fetch(`/api/inventory/spools/${spoolId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...spool, location })
    });
    loadFilament();
  };

  // ═══ Import dialog ═══
  // ═══ Vendor-specific CSV field mappings ═══
  const VENDOR_FIELD_MAPS = {
    // Polymaker format
    polymaker: { 'Product Name': 'name', 'Color': 'color_name', 'Color Code': 'color_hex', 'Material': 'material', 'Weight (g)': 'initial_weight_g', 'Price': 'cost', 'Diameter': 'diameter' },
    // Prusament format
    prusament: { 'Name': 'name', 'Filament Type': 'material', 'Color Name': 'color_name', 'Hex Color': 'color_hex', 'Net Weight': 'initial_weight_g', 'Spool Weight': 'spool_weight_g', 'Nozzle Temp': 'nozzle_temp_min', 'Bed Temp': 'bed_temp_min' },
    // eSUN format
    esun: { 'SKU': 'article_number', 'Product': 'name', 'Type': 'material', 'Color': 'color_name', 'Weight': 'initial_weight_g', 'Nozzle Temperature': 'nozzle_temp_min' },
    // Generic / Spoolman format
    spoolman: { 'filament_name': 'name', 'filament_material': 'material', 'filament_color_hex': 'color_hex', 'weight': 'initial_weight_g', 'price': 'cost' }
  };

  function _detectVendorFormat(headers) {
    for (const [vendor, map] of Object.entries(VENDOR_FIELD_MAPS)) {
      const vendorHeaders = Object.keys(map).map(h => h.toLowerCase());
      const matchCount = headers.filter(h => vendorHeaders.includes(h.toLowerCase())).length;
      if (matchCount >= 3) return { vendor, map };
    }
    return null;
  }

  let _importParsedData = null;
  let _importDetectedFormat = null;

  window.showImportDialog = function() {
    document.querySelectorAll('.inv-export-menu.show').forEach(m => m.classList.remove('show'));
    _importParsedData = null;
    _importDetectedFormat = null;
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:550px">
      <div class="inv-modal-header">
        <span>${t('filament.import')}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px">
        <div class="form-group">
          <label class="form-label">${t('filament.import_type')}</label>
          <select class="form-input" id="import-type">
            <option value="spools">${t('filament.export_spools_csv').replace(' (CSV)','')}</option>
            <option value="filaments">${t('filament.export_profiles_csv').replace(' (CSV)','')}</option>
            <option value="vendors">${t('filament.export_vendors_csv').replace(' (CSV)','')}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${t('filament.import_file')}</label>
          <div id="import-drop-zone" style="border:2px dashed var(--border);border-radius:8px;padding:16px;text-align:center;cursor:pointer">
            <input type="file" class="form-input" id="import-file" accept=".json,.csv" style="display:none" onchange="previewImport()">
            <div onclick="document.getElementById('import-file').click()" style="color:var(--text-muted);font-size:0.85rem">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div>${t('filament.import_drop')}</div>
            </div>
          </div>
        </div>
        <div id="import-preview" style="display:none"></div>
        <div id="import-status"></div>
      </div>
      <div class="inv-modal-footer">
        <button class="form-btn" data-ripple onclick="executeImport()" id="import-btn" disabled>${t('filament.import')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    // Drag-and-drop
    const zone = document.getElementById('import-drop-zone');
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--accent)'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.style.borderColor = '';
      if (e.dataTransfer.files.length) {
        const input = document.getElementById('import-file');
        input.files = e.dataTransfer.files;
        previewImport();
      }
    });
  };

  window.previewImport = async function() {
    const fileInput = document.getElementById('import-file');
    const preview = document.getElementById('import-preview');
    const btn = document.getElementById('import-btn');
    if (!fileInput?.files?.[0] || !preview) return;
    const file = fileInput.files[0];
    const text = await file.text();
    let data;
    let detectedFormat = null;

    if (file.name.endsWith('.json')) {
      data = JSON.parse(text);
      if (!Array.isArray(data)) data = [data];
    } else {
      // Parse CSV with proper quote handling
      const sep = text.includes(';') ? ';' : ',';
      const lines = text.replace(/^\uFEFF/, '').split('\n').filter(l => l.trim());
      const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));

      // Detect vendor-specific format
      detectedFormat = _detectVendorFormat(headers);

      data = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(sep).map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, idx) => {
          // Map vendor-specific headers to our field names
          const fieldName = detectedFormat ? (detectedFormat.map[h] || h) : h;
          obj[fieldName] = vals[idx] || null;
        });
        // Convert numeric fields
        for (const k of ['cost', 'initial_weight_g', 'used_weight_g', 'remaining_weight_g', 'density', 'diameter', 'spool_weight_g', 'empty_spool_weight_g']) {
          if (obj[k]) obj[k] = parseFloat(obj[k]) || null;
        }
        for (const k of ['vendor_id', 'filament_profile_id', 'nozzle_temp_min', 'nozzle_temp_max', 'bed_temp_min', 'bed_temp_max']) {
          if (obj[k]) obj[k] = parseInt(obj[k]) || null;
        }
        // Normalize color_hex
        if (obj.color_hex && !obj.color_hex.startsWith('#')) obj.color_hex = '#' + obj.color_hex;
        data.push(obj);
      }
    }

    _importParsedData = data;
    _importDetectedFormat = detectedFormat;

    // Build preview
    const sample = data.slice(0, 5);
    const fields = sample.length ? Object.keys(sample[0]).filter(k => sample.some(r => r[k])) : [];
    let h = '';
    if (detectedFormat) {
      h += `<div style="padding:6px 8px;background:var(--bg-secondary);border-radius:6px;margin-bottom:8px;font-size:0.8rem">
        <strong>${t('filament.import_format_detected')}:</strong> ${esc(detectedFormat.vendor.charAt(0).toUpperCase() + detectedFormat.vendor.slice(1))}
      </div>`;
    }

    // Check for potential duplicates
    const existingNames = new Set(window._fs.profiles.map(p => (p.name || '').toLowerCase()));
    const dupes = data.filter(r => r.name && existingNames.has(r.name.toLowerCase()));
    if (dupes.length) {
      h += `<div style="padding:6px 8px;background:rgba(255,165,0,0.1);border:1px solid rgba(255,165,0,0.3);border-radius:6px;margin-bottom:8px;font-size:0.8rem;color:var(--warning)">
        ${t('filament.import_duplicates', { count: dupes.length })}
      </div>`;
    }

    h += `<div style="font-size:0.8rem;margin-bottom:4px"><strong>${data.length}</strong> ${t('filament.import_rows')}</div>`;
    if (fields.length && sample.length) {
      h += '<div style="overflow-x:auto;max-height:200px;border:1px solid var(--border);border-radius:6px"><table style="width:100%;font-size:0.72rem;border-collapse:collapse">';
      h += '<thead><tr style="background:var(--bg-secondary);position:sticky;top:0">';
      for (const f of fields.slice(0, 6)) h += `<th style="padding:3px 6px;text-align:left;white-space:nowrap">${esc(f)}</th>`;
      if (fields.length > 6) h += '<th style="padding:3px 6px">...</th>';
      h += '</tr></thead><tbody>';
      for (const row of sample) {
        h += '<tr>';
        for (const f of fields.slice(0, 6)) {
          const v = row[f] != null ? String(row[f]).substring(0, 30) : '';
          h += `<td style="padding:2px 6px;border-top:1px solid var(--border)">${esc(v)}</td>`;
        }
        if (fields.length > 6) h += '<td style="padding:2px 6px;border-top:1px solid var(--border)">...</td>';
        h += '</tr>';
      }
      if (data.length > 5) h += `<tr><td colspan="${Math.min(fields.length, 7)}" style="padding:4px 6px;text-align:center;color:var(--text-muted)">... +${data.length - 5} ${t('filament.import_more_rows')}</td></tr>`;
      h += '</tbody></table></div>';
    }
    preview.innerHTML = h;
    preview.style.display = 'block';
    if (btn) btn.disabled = false;

    // Show filename in drop zone
    const zone = document.getElementById('import-drop-zone');
    if (zone) zone.innerHTML = `<div style="font-size:0.85rem">${esc(file.name)} <span style="color:var(--text-muted)">(${(file.size/1024).toFixed(0)} KB)</span></div>`;
  };

  window.executeImport = async function() {
    const type = document.getElementById('import-type')?.value;
    const status = document.getElementById('import-status');
    let data = _importParsedData;
    if (!data || !data.length) {
      // Fallback: read file directly (for backwards compat)
      const fileInput = document.getElementById('import-file');
      if (!fileInput?.files?.[0]) return;
      const file = fileInput.files[0];
      const text = await file.text();
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else {
        const sep = text.includes(';') ? ';' : ',';
        const lines = text.replace(/^\uFEFF/, '').split('\n').filter(l => l.trim());
        const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));
        data = [];
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(sep).map(v => v.trim().replace(/^"|"$/g, ''));
          const obj = {};
          headers.forEach((h, idx) => { obj[h] = vals[idx] || null; });
          for (const k of ['cost', 'initial_weight_g', 'used_weight_g', 'remaining_weight_g', 'density', 'diameter', 'spool_weight_g', 'empty_spool_weight_g']) {
            if (obj[k]) obj[k] = parseFloat(obj[k]) || null;
          }
          for (const k of ['vendor_id', 'filament_profile_id', 'nozzle_temp_min', 'nozzle_temp_max', 'bed_temp_min', 'bed_temp_max']) {
            if (obj[k]) obj[k] = parseInt(obj[k]) || null;
          }
          data.push(obj);
        }
      }
    }
    if (!Array.isArray(data)) data = [data];
    try {
      const res = await fetch(`/api/inventory/import/${type}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (status) status.innerHTML = `<span style="color:var(--accent-green)">${t('filament.imported_count', { count: result.imported || 0 })}</span>`;
      setTimeout(() => {
        document.querySelector('.inv-modal-overlay')?.remove();
        loadFilament();
      }, 1500);
    } catch (e) {
      if (status) status.innerHTML = `<span style="color:var(--accent-red)">${t('filament.import_failed')}</span>`;
    }
  };

  // ═══ 3MF / Gcode File Analyzer ═══
  window.showAnalyzeFileDialog = function() {
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:500px">
      <div class="inv-modal-header">
        <span>${t('filament.analyze_file')}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px">
        <p class="text-muted" style="font-size:0.8rem;margin-bottom:8px">${t('filament.analyze_file_hint')}</p>
        <input type="file" id="analyze-file-input" accept=".3mf,.gcode,.g" class="form-input">
        <div id="analyze-file-result" style="margin-top:8px"></div>
      </div>
      <div class="inv-modal-footer">
        <button class="form-btn" data-ripple onclick="window._doAnalyzeFile()">${t('filament.analyze')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  };

  window._doAnalyzeFile = async function() {
    const input = document.getElementById('analyze-file-input');
    const file = input?.files?.[0];
    if (!file) return;
    const resultEl = document.getElementById('analyze-file-result');
    resultEl.innerHTML = '<span class="text-muted">Analyzing...</span>';
    try {
      const formData = file;
      const res = await fetch(`/api/inventory/analyze-file?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: formData
      });
      const data = await res.json();
      if (data.error) { resultEl.innerHTML = `<span style="color:var(--accent-red)">${esc(data.error)}</span>`; return; }
      let h = '<div style="border:1px solid var(--border-color);border-radius:6px;padding:8px;font-size:0.8rem">';
      if (data.plate_name) h += `<div><strong>${t('common.name')}:</strong> ${esc(data.plate_name)}</div>`;
      h += `<div><strong>${t('filament.total_weight')}:</strong> ${Math.round(data.total_weight_g * 100) / 100}g</div>`;
      if (data.estimated_time_min) h += `<div><strong>${t('filament.estimated_time')}:</strong> ${Math.floor(data.estimated_time_min / 60)}h ${data.estimated_time_min % 60}m</div>`;
      if (data.filaments.length) {
        h += `<div style="margin-top:6px"><strong>${t('filament.filaments_used')}:</strong></div>`;
        h += '<table style="width:100%;font-size:0.75rem;border-collapse:collapse;margin-top:4px">';
        h += '<tr style="background:var(--bg-secondary)"><th style="padding:2px 6px;text-align:left">#</th><th style="padding:2px 6px;text-align:left">${t("filament.material")}</th><th style="padding:2px 6px;text-align:right">${t("filament.weight")}</th></tr>';
        data.filaments.forEach((f, i) => {
          h += `<tr><td style="padding:2px 6px">${i + 1}</td><td style="padding:2px 6px">${esc(f.material || '?')}</td><td style="padding:2px 6px;text-align:right">${Math.round(f.weight_g * 100) / 100}g</td></tr>`;
        });
        h += '</table>';
      }
      h += '</div>';
      resultEl.innerHTML = h;
    } catch (e) { resultEl.innerHTML = `<span style="color:var(--accent-red)">${esc(e.message)}</span>`; }
  };

  // ═══ Inventory Settings ═══
  window.showInventorySettings = async function() {
    let settings = {};
    try { const r = await fetch('/api/inventory/settings'); settings = await r.json(); } catch {}
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:400px">
      <div class="inv-modal-header">
        <span>${t('filament.settings')}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px">
        <div class="form-group">
          <label class="form-label">${t('filament.default_weight')}</label>
          <input class="form-input" id="set-default-weight" type="number" value="${settings.default_weight || 1000}" placeholder="1000">
        </div>
        <div class="form-group">
          <label class="form-label">${t('filament.currency')}</label>
          <input class="form-input" id="set-currency" value="${settings.currency || currencySymbol()}" placeholder="${currencySymbol()}">
        </div>
        <div class="form-group">
          <label class="form-label">${t('filament.low_stock_threshold')}</label>
          <input class="form-input" id="set-low-threshold" type="number" value="${settings.low_stock_threshold || 20}" placeholder="20" min="1" max="50">
          <span class="text-muted" style="font-size:0.7rem">%</span>
        </div>
        <div class="form-group">
          <label class="form-label">${t('filament.near_empty_grams')}</label>
          <input class="form-input" id="set-near-empty-g" type="number" value="${settings.near_empty_grams || 0}" placeholder="0" min="0">
          <span class="text-muted" style="font-size:0.7rem">${t('filament.near_empty_grams_hint')}</span>
        </div>
        <div class="form-group">
          <label class="form-label">${t('filament.filament_check_mode')}</label>
          <select class="form-input" id="set-filament-check-mode">
            <option value="warn" ${(settings.filament_check_mode || 'warn') === 'warn' ? 'selected' : ''}>${t('filament.filament_check_warn')}</option>
            <option value="block" ${settings.filament_check_mode === 'block' ? 'selected' : ''}>${t('filament.filament_check_block')}</option>
          </select>
          <span class="text-muted" style="font-size:0.7rem">${t('filament.filament_check_hint')}</span>
        </div>
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:8px">
            <input type="checkbox" id="set-exclude-labor-cancelled" ${settings.exclude_labor_cancelled === '1' ? 'checked' : ''}>
            ${t('filament.exclude_labor_cancelled')}
          </label>
          <span class="text-muted" style="font-size:0.7rem">${t('filament.exclude_labor_cancelled_hint')}</span>
        </div>
        <div class="form-group">
          <label class="form-label">${t('filament.page_size')}</label>
          <select class="form-input" id="set-page-size">
            ${[25, 50, 100].map(n => `<option value="${n}" ${(window._fs.pageSize === n || (!window._fs.pageSize && n === 50)) ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${t('filament.auto_trash_days')}</label>
          <input class="form-input" id="set-auto-trash" type="number" value="${settings.auto_trash_days || 0}" placeholder="0" min="0" max="365">
          <span class="text-muted" style="font-size:0.7rem">${t('filament.auto_trash_hint')}</span>
        </div>
        <div style="border-top:1px solid var(--border-color);margin-top:8px;padding-top:8px">
          <div style="font-size:0.8rem;font-weight:600;margin-bottom:6px">${t('filament.cost_estimate')}</div>
          <div class="form-group">
            <label class="form-label">${t('filament.electricity_rate')}</label>
            <input class="form-input" id="set-electricity-rate" type="number" step="0.01" value="${settings.electricity_rate_kwh || ''}" placeholder="0.00">
          </div>
          <div class="form-group">
            <label class="form-label">${t('filament.printer_wattage')}</label>
            <input class="form-input" id="set-printer-wattage" type="number" value="${settings.printer_wattage || ''}" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">${t('filament.machine_cost')}</label>
            <input class="form-input" id="set-machine-cost" type="number" step="0.01" value="${settings.machine_cost || ''}" placeholder="0.00">
          </div>
          <div class="form-group">
            <label class="form-label">${t('filament.machine_lifetime')}</label>
            <input class="form-input" id="set-machine-lifetime" type="number" value="${settings.machine_lifetime_hours || ''}" placeholder="5000">
          </div>
          <div class="form-group">
            <label class="form-label">${t('filament.labor_rate')}</label>
            <input class="form-input" id="set-labor-rate" type="number" step="0.01" value="${settings.labor_rate_hourly || ''}" placeholder="0.00">
          </div>
        </div>
      </div>
      <div class="inv-modal-footer">
        <button class="form-btn" data-ripple onclick="saveInventorySettings()">${t('filament.save')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  };

  window.saveInventorySettings = async function() {
    const keys = [
      ['default_weight', document.getElementById('set-default-weight')?.value],
      ['currency', document.getElementById('set-currency')?.value],
      ['low_stock_threshold', document.getElementById('set-low-threshold')?.value],
      ['near_empty_grams', document.getElementById('set-near-empty-g')?.value],
      ['filament_check_mode', document.getElementById('set-filament-check-mode')?.value],
      ['exclude_labor_cancelled', document.getElementById('set-exclude-labor-cancelled')?.checked ? '1' : '0'],
      ['page_size', document.getElementById('set-page-size')?.value],
      ['auto_trash_days', document.getElementById('set-auto-trash')?.value],
      ['electricity_rate_kwh', document.getElementById('set-electricity-rate')?.value],
      ['printer_wattage', document.getElementById('set-printer-wattage')?.value],
      ['machine_cost', document.getElementById('set-machine-cost')?.value],
      ['machine_lifetime_hours', document.getElementById('set-machine-lifetime')?.value],
      ['labor_rate_hourly', document.getElementById('set-labor-rate')?.value]
    ];
    for (const [key, value] of keys) {
      if (value != null) await fetch(`/api/inventory/settings/${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value }) });
    }
    window._fs.pageSize = parseInt(document.getElementById('set-page-size')?.value) || 50;
    document.querySelector('.inv-modal-overlay')?.remove();
    loadFilament();
  };

  // ═══ WebSocket inventory listener ═══
  let _wsListenerAttached = false;
  let _wsDebounce = null;
  function attachInventoryWsListener() {
    if (_wsListenerAttached || !window.printerState?._ws) return;
    const origHandler = window.printerState._ws.onmessage;
    window.printerState._ws.addEventListener('message', (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'inventory_update') {
          clearTimeout(_wsDebounce);
          _wsDebounce = setTimeout(() => {
            // Only reload if filament panel is visible
            if (document.getElementById('overlay-panel-body')?.querySelector('.filament-tab-panel')) {
              loadFilament();
            }
          }, 500);
        }
      } catch {}
    });
    _wsListenerAttached = true;
  }

  // ═══ Expose WS listener for cross-file use ═══
  window.attachInventoryWsListener = attachInventoryWsListener;

})();
