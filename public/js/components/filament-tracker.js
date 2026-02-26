// Filament Inventory Tracker - Per Printer (Enhanced)
(function() {
  function hexToRgb(hex) {
    if (!hex || hex.length < 6) return '#888';
    return `#${hex.substring(0, 6)}`;
  }

  function hexToRgbColor(hex) {
    if (!hex || hex.length < 6) return 'rgb(128,128,128)';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r},${g},${b})`;
  }

  function isLightColor(hex) {
    if (!hex || hex.length < 6) return false;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  }

  function printerName(id) {
    return window.printerState?._printerMeta?.[id]?.name || id || '--';
  }

  window.loadFilamentPanel = loadFilament;

  async function loadFilament() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    try {
      let html = '';

      // ---- Active filament per printer (from live AMS data) ----
      html += buildActiveFilamentSection();

      // ---- Inventory per printer ----
      const res = await fetch('/api/filament');
      const allSpools = await res.json();

      // Compute inventory summary
      const totalSpools = allSpools.length;
      let totalWeight = 0, totalRemaining = 0, totalValue = 0, lowStockCount = 0;
      for (const s of allSpools) {
        totalWeight += s.weight_total_g || 0;
        const rem = (s.weight_total_g || 0) - (s.weight_used_g || 0);
        totalRemaining += Math.max(0, rem);
        if (s.cost_nok) totalValue += s.cost_nok;
        const pct = s.weight_total_g > 0 ? (rem / s.weight_total_g) * 100 : 0;
        if (pct < 20 && pct > 0) lowStockCount++;
      }

      // Summary strip
      html += `<div class="filament-summary-strip">
        <div class="filament-summary-item">
          <span class="filament-summary-val">${totalSpools}</span>
          <span class="filament-summary-label">${t('filament.total_spools')}</span>
        </div>
        <div class="filament-summary-item">
          <span class="filament-summary-val">${totalRemaining >= 1000 ? (totalRemaining / 1000).toFixed(1) + ' kg' : Math.round(totalRemaining) + 'g'}</span>
          <span class="filament-summary-label">${t('filament.total_remaining')}</span>
        </div>
        ${totalValue > 0 ? `<div class="filament-summary-item">
          <span class="filament-summary-val">${Math.round(totalValue)} kr</span>
          <span class="filament-summary-label">${t('filament.total_value')}</span>
        </div>` : ''}
        ${lowStockCount > 0 ? `<div class="filament-summary-item" style="color:var(--accent-orange)">
          <span class="filament-summary-val">${lowStockCount}</span>
          <span class="filament-summary-label">${t('filament.low_stock')}</span>
        </div>` : ''}
      </div>`;

      // Low stock warnings
      const lowStockSpools = allSpools.filter(s => {
        const rem = (s.weight_total_g || 0) - (s.weight_used_g || 0);
        const pct = s.weight_total_g > 0 ? (rem / s.weight_total_g) * 100 : 100;
        return pct < 20 && pct > 0;
      });

      if (lowStockSpools.length > 0) {
        html += `<div class="filament-low-stock-alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>${t('filament.low_stock_warning', { count: lowStockSpools.length })}</span>
        </div>`;
      }

      // Group by printer_id
      const grouped = {};
      const unassigned = [];
      for (const s of allSpools) {
        if (s.printer_id) {
          if (!grouped[s.printer_id]) grouped[s.printer_id] = [];
          grouped[s.printer_id].push(s);
        } else {
          unassigned.push(s);
        }
      }

      // Get all printer IDs (from state + any that have filament)
      const state = window.printerState;
      const printerIds = state ? state.getPrinterIds() : [];
      const allIds = [...new Set([...printerIds, ...Object.keys(grouped)])];

      for (const pid of allIds) {
        const spools = grouped[pid] || [];
        const name = printerName(pid);

        html += `<div class="filament-printer-section" data-printer-id="${pid}">
          <div class="filament-printer-header">
            <span class="printer-tag">${name}</span>
            <span class="text-muted" style="font-size:0.75rem">${spools.length} ${spools.length === 1 ? t('filament.spool_singular') : t('filament.spool_plural')}</span>
            <button class="form-btn form-btn-sm" style="margin-left:auto" onclick="showAddFilamentForm('${pid}')">${t('filament.add_spool')}</button>
          </div>`;

        if (spools.length > 0) {
          // Sort: low stock first
          spools.sort((a, b) => {
            const pctA = a.weight_total_g > 0 ? ((a.weight_total_g - a.weight_used_g) / a.weight_total_g) : 1;
            const pctB = b.weight_total_g > 0 ? ((b.weight_total_g - b.weight_used_g) / b.weight_total_g) : 1;
            return pctA - pctB;
          });
          html += '<div class="filament-grid">';
          for (const s of spools) {
            html += renderSpoolCard(s);
          }
          html += '</div>';
        }

        html += `<div id="filament-form-${pid}" style="display:none"></div>`;
        html += '</div>';
      }

      // Unassigned spools (always show as drop target)
      html += `<div class="filament-printer-section" data-printer-id="">
        <div class="filament-printer-header">
          <span class="text-muted" style="font-size:0.8rem;font-weight:600">${t('filament.unassigned')}</span>
          <span class="text-muted" style="font-size:0.75rem">${unassigned.length} ${unassigned.length === 1 ? t('filament.spool_singular') : t('filament.spool_plural')}</span>
        </div>`;
      if (unassigned.length > 0) {
        html += '<div class="filament-grid">';
        for (const s of unassigned) {
          html += renderSpoolCard(s);
        }
        html += '</div>';
      } else {
        html += `<div class="filament-drop-hint text-muted">${t('filament.drop_here')}</div>`;
      }
      html += '</div>';

      panel.innerHTML = html;

      // Initialize drag-and-drop
      initFilamentDnd();
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('filament.load_failed')}</p>`;
    }
  }

  function renderSpoolCard(s) {
    const remaining = Math.max(0, s.weight_total_g - s.weight_used_g);
    const pct = s.weight_total_g > 0 ? Math.round((remaining / s.weight_total_g) * 100) : 0;
    const color = hexToRgb(s.color_hex);
    const isLow = pct < 20 && pct > 0;
    const isEmpty = pct === 0 && s.weight_used_g > 0;
    const lowClass = isEmpty ? 'filament-card-empty' : isLow ? 'filament-card-low' : '';
    const costPerG = (s.cost_nok && s.weight_total_g) ? (s.cost_nok / s.weight_total_g).toFixed(2) : null;

    return `
      <div class="filament-card ${lowClass}" data-spool-id="${s.id}" draggable="true">
        <div class="flex items-center gap-sm" style="justify-content:space-between">
          <div class="flex items-center gap-sm">
            <span class="filament-color-swatch" style="background:${color}"></span>
            <div>
              <strong>${s.type}</strong>
              <span class="text-muted" style="font-size:0.75rem"> ${s.brand || ''}</span>
            </div>
          </div>
          <div class="flex items-center gap-sm">
            <button class="filament-edit-btn" onclick="showEditFilamentForm(${s.id})" title="${t('settings.edit')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="filament-delete-btn" onclick="deleteFilamentSpool(${s.id})" title="${t('settings.delete')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="mt-sm" style="font-size:0.8rem;color:var(--text-secondary)">
          ${s.color_name || ''} &middot; ${Math.round(remaining)}g ${t('filament.remaining')}
        </div>
        <div class="filament-bar">
          <div class="filament-bar-fill" style="width:${pct}%;background:${isLow || isEmpty ? 'var(--accent-orange)' : color}"></div>
        </div>
        <div class="flex justify-between mt-sm" style="font-size:0.75rem;color:var(--text-muted)">
          <span>${pct}% ${t('filament.remaining')}${isLow ? ' ⚠' : ''}</span>
          <span>${s.cost_nok ? s.cost_nok + ' kr' : ''}${costPerG ? ` (${costPerG} kr/g)` : ''}</span>
        </div>
        <div id="filament-edit-${s.id}" style="display:none"></div>
      </div>`;
  }

  function buildActiveFilamentSection() {
    const state = window.printerState;
    if (!state) return '';

    const ids = state.getPrinterIds();
    if (ids.length === 0) return '';

    let html = `<div class="card-title">${t('common.active_filament')}</div>`;
    let hasAny = false;

    for (const id of ids) {
      const ps = state._printers[id];
      const printData = ps?.print || ps;
      const amsData = printData?.ams;
      if (!amsData?.ams || amsData.ams.length === 0) continue;

      hasAny = true;
      const name = printerName(id);
      const activeTray = amsData.tray_now;

      html += `<div class="active-filament-printer">
        <div class="active-filament-printer-name">${name}</div>
        <div class="active-filament-trays">`;

      let globalSlot = 0;
      for (let unitIdx = 0; unitIdx < amsData.ams.length; unitIdx++) {
        const trays = amsData.ams[unitIdx]?.tray;
        if (!trays) continue;

        for (let i = 0; i < trays.length; i++) {
          const tray = trays[i];
          const isActive = String(globalSlot) === String(activeTray);

          if (tray && tray.tray_type) {
            const color = hexToRgbColor(tray.tray_color);
            const light = isLightColor(tray.tray_color);
            const remain = tray.remain >= 0 ? tray.remain : '?';
            const brand = tray.tray_sub_brands || '';
            const slotLabel = amsData.ams.length > 1
              ? `AMS${unitIdx + 1}:${i + 1}`
              : `${i + 1}`;

            html += `<div class="active-filament-tray ${isActive ? 'active-filament-tray-active' : ''}">
              <div class="active-filament-color" style="background:${color};${light ? 'border:1px solid var(--border-color);' : ''}"></div>
              <div class="active-filament-info">
                <span class="active-filament-type">${tray.tray_type}${brand ? ' · ' + brand : ''}</span>
                <span class="active-filament-remain">${remain}%</span>
              </div>
              <span class="active-filament-slot">${slotLabel}</span>
            </div>`;
          }
          globalSlot++;
        }
      }

      html += `</div></div>`;
    }

    if (!hasAny) {
      html += `<p class="text-muted" style="margin-bottom:16px">${t('common.no_ams_data')}</p>`;
    }

    return html;
  }

  window.showAddFilamentForm = function(printerId) {
    // Hide all other forms first
    document.querySelectorAll('[id^="filament-form-"]').forEach(el => {
      el.style.display = 'none';
      el.innerHTML = '';
    });
    document.querySelectorAll('[id^="filament-edit-"]').forEach(el => {
      el.style.display = 'none';
      el.innerHTML = '';
    });

    const container = document.getElementById(`filament-form-${printerId}`);
    if (!container) return;

    container.style.display = '';
    container.innerHTML = renderFilamentForm(printerId, null);
  };

  window.showEditFilamentForm = function(spoolId) {
    // Hide all other forms
    document.querySelectorAll('[id^="filament-form-"]').forEach(el => {
      el.style.display = 'none';
      el.innerHTML = '';
    });
    document.querySelectorAll('[id^="filament-edit-"]').forEach(el => {
      el.style.display = 'none';
      el.innerHTML = '';
    });

    const container = document.getElementById(`filament-edit-${spoolId}`);
    if (!container) return;

    // Fetch current data
    fetch('/api/filament').then(r => r.json()).then(spools => {
      const spool = spools.find(s => s.id === spoolId);
      if (!spool) return;
      container.style.display = '';
      container.innerHTML = renderFilamentForm(spool.printer_id, spool);
    });
  };

  function buildPrinterOptions(selectedId) {
    const state = window.printerState;
    const ids = state ? state.getPrinterIds() : [];
    let opts = `<option value="" ${!selectedId ? 'selected' : ''}>${t('filament.unassigned')}</option>`;
    for (const id of ids) {
      const name = printerName(id);
      opts += `<option value="${id}" ${id === selectedId ? 'selected' : ''}>${name}</option>`;
    }
    return opts;
  }

  function renderFilamentForm(printerId, spool) {
    const isEdit = !!spool;
    const idSuffix = isEdit ? `edit-${spool.id}` : printerId;
    const currentPrinterId = spool?.printer_id || printerId || '';

    return `
      <div class="settings-form mt-sm" style="border-top:1px solid var(--border-color);padding-top:12px">
        <div class="flex gap-sm" style="flex-wrap:wrap">
          ${isEdit ? `<div class="form-group" style="flex:1;min-width:140px">
            <label class="form-label">${t('common.printer')}</label>
            <select class="form-input" id="f-printer-${idSuffix}">${buildPrinterOptions(currentPrinterId)}</select>
          </div>` : ''}
          <div class="form-group" style="flex:1;min-width:120px">
            <label class="form-label">${t('filament.brand')}</label>
            <input class="form-input" id="f-brand-${idSuffix}" value="${spool?.brand || ''}" placeholder="Bambu Lab">
          </div>
          <div class="form-group" style="flex:1;min-width:100px">
            <label class="form-label">${t('filament.type')}</label>
            <input class="form-input" id="f-type-${idSuffix}" value="${spool?.type || ''}" placeholder="PLA" required>
          </div>
          <div class="form-group" style="flex:1;min-width:100px">
            <label class="form-label">${t('filament.color')}</label>
            <input class="form-input" id="f-color-${idSuffix}" value="${spool?.color_name || ''}" placeholder="">
          </div>
          <div class="form-group" style="width:80px">
            <label class="form-label">${t('filament.color_hex')}</label>
            <input class="form-input" id="f-hex-${idSuffix}" value="${spool?.color_hex || ''}" placeholder="FFFFFF">
          </div>
          <div class="form-group" style="width:80px">
            <label class="form-label">${t('filament.weight')}</label>
            <input class="form-input" id="f-weight-${idSuffix}" type="number" value="${spool?.weight_total_g || 1000}">
          </div>
          <div class="form-group" style="width:80px">
            <label class="form-label">${t('filament.used_g')}</label>
            <input class="form-input" id="f-used-${idSuffix}" type="number" value="${spool?.weight_used_g || 0}">
          </div>
          <div class="form-group" style="width:80px">
            <label class="form-label">${t('filament.price')}</label>
            <input class="form-input" id="f-cost-${idSuffix}" type="number" value="${spool?.cost_nok || ''}" placeholder="219">
          </div>
        </div>
        <div class="flex gap-sm">
          <button class="form-btn" onclick="${isEdit ? `updateFilament(${spool.id}, '${idSuffix}')` : `saveFilament('${printerId}')`}">${t('filament.save')}</button>
          <button class="form-btn form-btn-sm" style="background:transparent;color:var(--text-muted)" onclick="${isEdit ? `hideEditFilamentForm(${spool.id})` : `hideFilamentForm('${printerId}')`}">${t('settings.cancel')}</button>
        </div>
      </div>`;
  }

  window.hideFilamentForm = function(printerId) {
    const container = document.getElementById(`filament-form-${printerId}`);
    if (container) {
      container.style.display = 'none';
      container.innerHTML = '';
    }
  };

  window.hideEditFilamentForm = function(spoolId) {
    const container = document.getElementById(`filament-edit-${spoolId}`);
    if (container) {
      container.style.display = 'none';
      container.innerHTML = '';
    }
  };

  window.saveFilament = async function(printerId) {
    const data = {
      printer_id: printerId,
      brand: document.getElementById(`f-brand-${printerId}`).value,
      type: document.getElementById(`f-type-${printerId}`).value,
      color_name: document.getElementById(`f-color-${printerId}`).value,
      color_hex: document.getElementById(`f-hex-${printerId}`).value,
      weight_total_g: parseFloat(document.getElementById(`f-weight-${printerId}`).value) || 1000,
      weight_used_g: parseFloat(document.getElementById(`f-used-${printerId}`).value) || 0,
      cost_nok: parseFloat(document.getElementById(`f-cost-${printerId}`).value) || null
    };

    if (!data.type) return alert(t('filament.type_required'));

    await fetch('/api/filament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    loadFilament();
  };

  window.updateFilament = async function(spoolId, idSuffix) {
    const printerSelect = document.getElementById(`f-printer-${idSuffix}`);
    const data = {
      printer_id: printerSelect ? (printerSelect.value || null) : undefined,
      brand: document.getElementById(`f-brand-${idSuffix}`).value,
      type: document.getElementById(`f-type-${idSuffix}`).value,
      color_name: document.getElementById(`f-color-${idSuffix}`).value,
      color_hex: document.getElementById(`f-hex-${idSuffix}`).value,
      weight_total_g: parseFloat(document.getElementById(`f-weight-${idSuffix}`).value) || 1000,
      weight_used_g: parseFloat(document.getElementById(`f-used-${idSuffix}`).value) || 0,
      cost_nok: parseFloat(document.getElementById(`f-cost-${idSuffix}`).value) || null
    };

    if (!data.type) return alert(t('filament.type_required'));

    await fetch(`/api/filament/${spoolId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    loadFilament();
  };

  window.deleteFilamentSpool = async function(id) {
    await fetch(`/api/filament/${id}`, { method: 'DELETE' });
    loadFilament();
  };

  // ---- Drag & Drop between printer sections ----

  function initFilamentDnd() {
    let draggedEl = null;
    let draggedSpoolId = null;

    document.querySelectorAll('.filament-card[draggable]').forEach(card => {
      card.addEventListener('dragstart', e => {
        draggedEl = card;
        draggedSpoolId = card.dataset.spoolId;
        card.classList.add('filament-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedSpoolId);
      });

      card.addEventListener('dragend', () => {
        if (draggedEl) draggedEl.classList.remove('filament-dragging');
        draggedEl = null;
        draggedSpoolId = null;
        document.querySelectorAll('.filament-drop-target')
          .forEach(el => el.classList.remove('filament-drop-target'));
      });
    });

    document.querySelectorAll('.filament-printer-section').forEach(section => {
      section.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      section.addEventListener('dragenter', e => {
        e.preventDefault();
        section.classList.add('filament-drop-target');
      });

      section.addEventListener('dragleave', e => {
        if (!section.contains(e.relatedTarget)) {
          section.classList.remove('filament-drop-target');
        }
      });

      section.addEventListener('drop', async e => {
        e.preventDefault();
        section.classList.remove('filament-drop-target');
        const spoolId = e.dataTransfer.getData('text/plain');
        const targetPrinterId = section.dataset.printerId || null;
        if (!spoolId) return;
        await reassignSpool(parseInt(spoolId), targetPrinterId);
      });
    });
  }

  async function reassignSpool(spoolId, newPrinterId) {
    try {
      const res = await fetch('/api/filament');
      const spools = await res.json();
      const spool = spools.find(s => s.id === spoolId);
      if (!spool) return;

      spool.printer_id = newPrinterId;
      await fetch(`/api/filament/${spoolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spool)
      });

      loadFilament();
    } catch (err) {
      console.error('Failed to reassign spool:', err);
    }
  }

})();
