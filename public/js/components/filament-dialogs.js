// Filament Inventory — Add/Edit spool dialogs, Manage sub-tabs (profiles/vendors/locations/tags), CRUD operations, measurements
(function() {

  // ═══ Add/Edit Spool ═══
  window.showAddSpoolForm = function() {
    if (window._fs.activeTab !== 'inventory') switchTab('inventory');
    const container = document.getElementById('inv-global-form');
    if (!container) return;
    container.style.display = '';
    container.innerHTML = renderSpoolForm(null);
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window.showQuickCreate = async function(btn) {
    // Remove existing dropdown
    document.querySelector('.quick-create-menu')?.remove();
    try {
      const res = await fetch('/api/inventory/recent-profiles');
      const profiles = await res.json();
      if (!profiles.length) { showToast(t('filament.recent_profiles') + ': ' + t('common.none'), 'info'); return; }
      const menu = document.createElement('div');
      menu.className = 'inv-export-menu quick-create-menu show';
      menu.style.cssText = 'min-width:200px';
      for (const p of profiles) {
        const b = document.createElement('button');
        b.textContent = `${p.brand || ''} ${p.material || ''} ${p.color_name || ''}`.trim();
        b.onclick = async () => {
          menu.remove();
          const data = {
            filament_profile_id: p.id,
            initial_weight_g: p.spool_weight_g || 1000,
            used_weight_g: 0,
            remaining_weight_g: p.spool_weight_g || 1000
          };
          try {
            await fetch('/api/inventory/spools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            showToast(t('filament.spool_added'), 'success');
            loadFilament();
          } catch { showToast(t('filament.save_failed'), 'error'); }
        };
        menu.appendChild(b);
      }
      btn.closest('.inv-export-dropdown').appendChild(menu);
      setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 10);
    } catch { showToast(t('filament.save_failed'), 'error'); }
  };

  window.showEditSpoolForm = function(spoolId) {
    const spool = window._fs.spools.find(s => s.id === spoolId);
    if (!spool) return;
    const container = document.getElementById(`spool-edit-${spoolId}`);
    if (container) {
      container.style.display = '';
      container.innerHTML = renderSpoolForm(spool);
      return;
    }
    // Fallback: open in modal overlay (visual card view)
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:700px">
      <div class="inv-modal-header">
        <span>${t('settings.edit')} — ${esc(window._cleanProfileName(spool))}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px" id="spool-edit-modal-${spoolId}">${renderSpoolForm(spool)}</div>
    </div>`;
    document.body.appendChild(overlay);
  };

  function renderSpoolForm(spool) {
    const isEdit = !!spool;
    const id = isEdit ? spool.id : 'new';
    return `
      <div class="settings-card" style="margin:8px 0">
        <div class="settings-form">
          <div class="flex gap-sm" style="flex-wrap:wrap">
            <div class="form-group" style="flex:2;min-width:180px">
              <label class="form-label">${t('filament.profile_select')}</label>
              <select class="form-input" id="sp-profile-${id}" onchange="onSpoolProfileChange('${id}')">${window._filHelpers.buildProfileSelect(spool?.filament_profile_id)}</select>
            </div>
            <div class="form-group" style="width:100px">
              <label class="form-label">${t('filament.initial_weight')}</label>
              <input class="form-input" id="sp-initial-${id}" type="number" value="${spool?.initial_weight_g || 1000}">
            </div>
            <div class="form-group" style="width:100px">
              <label class="form-label">${t('filament.used_g')}</label>
              <input class="form-input" id="sp-used-${id}" type="number" value="${spool?.used_weight_g || 0}">
            </div>
            <div class="form-group" style="width:100px">
              <label class="form-label">${t('filament.remaining_g') || 'Igjen (g)'}</label>
              <input class="form-input" id="sp-remaining-${id}" type="number" value="${spool?.remaining_weight_g ?? ''}" placeholder="Auto">
            </div>
            <div class="form-group" style="width:80px">
              <label class="form-label">${t('filament.price')}</label>
              <input class="form-input" id="sp-cost-${id}" type="number" value="${spool?.cost || ''}" placeholder="219">
            </div>
            <div class="form-group" style="width:100px">
              <label class="form-label">${t('filament.spool_tare_weight')}</label>
              <input class="form-input" id="sp-tare-${id}" type="number" value="${spool?.spool_weight || ''}" placeholder="Auto">
            </div>
            <div class="form-group" style="width:100px">
              <label class="form-label">${t('filament.lot_number')}</label>
              <input class="form-input" id="sp-lot-${id}" value="${spool?.lot_number || ''}">
            </div>
            <div class="form-group" style="width:130px">
              <label class="form-label">${t('filament.location')}</label>
              <select class="form-input" id="sp-location-${id}">${window._filHelpers.buildLocationSelect(spool?.location)}</select>
            </div>
            <div class="form-group" style="width:130px">
              <label class="form-label">${t('common.printer')}</label>
              <select class="form-input" id="sp-printer-${id}">${window._filHelpers.buildPrinterOptions(spool?.printer_id)}</select>
            </div>
            <div class="form-group" style="width:120px">
              <label class="form-label">${t('filament.purchase_date')}</label>
              <input class="form-input" id="sp-purchase-${id}" type="date" value="${spool?.purchase_date || ''}">
            </div>
            <div class="form-group" style="width:110px">
              <label class="form-label">${t('filament.storage_method')}</label>
              <select class="form-input" id="sp-storage-${id}">
                <option value="">${t('common.none')}</option>
                <option value="dry_box" ${spool?.storage_method === 'dry_box' ? 'selected' : ''}>${t('filament.storage_dry_box')}</option>
                <option value="vacuum_bag" ${spool?.storage_method === 'vacuum_bag' ? 'selected' : ''}>${t('filament.storage_vacuum')}</option>
                <option value="open_air" ${spool?.storage_method === 'open_air' ? 'selected' : ''}>${t('filament.storage_open_air')}</option>
              </select>
            </div>
            <div class="form-group" style="flex:1;min-width:120px">
              <label class="form-label">${t('filament.comment')}</label>
              <input class="form-input" id="sp-comment-${id}" value="${spool?.comment || ''}">
            </div>
            ${!isEdit ? `<div class="form-group" style="width:80px">
              <label class="form-label">${t('filament.bulk_quantity')}</label>
              <input class="form-input" id="sp-quantity-${id}" type="number" value="1" min="1" max="50" step="1">
            </div>` : ''}
          </div>
          <div id="sp-${id}-extra-fields-section">
            <div style="font-size:0.8rem;margin:4px 0">${t('filament.extra_fields')}</div>
            <div id="sp-${id}-extra-fields">${_renderExtraFieldInputs(`sp-${id}`, spool?.extra_fields)}</div>
            <button class="form-btn form-btn-sm" data-ripple style="font-size:0.7rem" onclick="window._addExtraField('sp-${id}')" type="button">+ ${t('filament.add_field')}</button>
          </div>
          <div class="flex gap-sm">
            <button class="form-btn" data-ripple onclick="${isEdit ? `saveSpool(${spool.id})` : 'saveNewSpool()'}">${t('filament.save')}</button>
            <button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="${isEdit ? `hideSpoolEdit(${spool.id})` : 'hideGlobalSpoolForm()'}">${t('settings.cancel')}</button>
          </div>
        </div>
      </div>`;
  }

  window.onSpoolProfileChange = function(id) {
    const sel = document.getElementById(`sp-profile-${id}`);
    const initialInput = document.getElementById(`sp-initial-${id}`);
    if (!sel || !initialInput) return;
    const profile = window._fs.profiles.find(p => p.id === parseInt(sel.value));
    if (profile && id === 'new') {
      initialInput.value = profile.spool_weight_g || 1000;
    }
  };

  window.saveNewSpool = async function() {
    const profileId = parseInt(document.getElementById('sp-profile-new')?.value);
    if (!profileId) { showToast(t('filament.add_spool_select_profile'), 'warning'); return; }
    const data = {
      filament_profile_id: profileId,
      initial_weight_g: parseFloat(document.getElementById('sp-initial-new').value) || 1000,
      used_weight_g: parseFloat(document.getElementById('sp-used-new').value) || 0,
      cost: parseFloat(document.getElementById('sp-cost-new').value) || null,
      lot_number: document.getElementById('sp-lot-new').value || null,
      location: document.getElementById('sp-location-new').value || null,
      printer_id: document.getElementById('sp-printer-new').value || null,
      comment: document.getElementById('sp-comment-new').value || null,
      purchase_date: document.getElementById('sp-purchase-new').value || null,
      spool_weight: parseFloat(document.getElementById('sp-tare-new').value) || null,
      storage_method: document.getElementById('sp-storage-new').value || null,
      extra_fields: _collectExtraFields('sp-new')
    };
    const manualRem = document.getElementById('sp-remaining-new')?.value;
    if (manualRem !== '' && manualRem !== undefined) {
      data.remaining_weight_g = Math.max(0, parseFloat(manualRem));
      data.used_weight_g = Math.max(0, data.initial_weight_g - data.remaining_weight_g);
    } else {
      data.remaining_weight_g = Math.max(0, data.initial_weight_g - data.used_weight_g);
    }
    const quantity = parseInt(document.getElementById('sp-quantity-new')?.value) || 1;
    if (quantity > 1) {
      data.count = Math.min(quantity, 50);
      await fetch('/api/inventory/spools/batch-add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      showToast(t('filament.bulk_added', { count: data.count }), 'success');
    } else {
      await fetch('/api/inventory/spools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    loadFilament();
  };

  window.saveSpool = async function(spoolId) {
    const id = spoolId;
    const spool = window._fs.spools.find(s => s.id === spoolId);
    const data = {
      filament_profile_id: parseInt(document.getElementById(`sp-profile-${id}`)?.value) || spool?.filament_profile_id,
      initial_weight_g: parseFloat(document.getElementById(`sp-initial-${id}`).value) || 1000,
      used_weight_g: parseFloat(document.getElementById(`sp-used-${id}`).value) || 0,
      cost: parseFloat(document.getElementById(`sp-cost-${id}`).value) || null,
      lot_number: document.getElementById(`sp-lot-${id}`).value || null,
      location: document.getElementById(`sp-location-${id}`).value || null,
      printer_id: document.getElementById(`sp-printer-${id}`).value || null,
      comment: document.getElementById(`sp-comment-${id}`).value || null,
      purchase_date: document.getElementById(`sp-purchase-${id}`).value || null,
      archived: spool?.archived || 0,
      spool_weight: parseFloat(document.getElementById(`sp-tare-${id}`).value) || null,
      storage_method: document.getElementById(`sp-storage-${id}`).value || null,
      extra_fields: _collectExtraFields(`sp-${id}`)
    };
    // Manuelt remaining har prioritet, ellers beregn fra initial - used
    const manualRemaining = document.getElementById(`sp-remaining-${id}`)?.value;
    if (manualRemaining !== '' && manualRemaining !== undefined) {
      data.remaining_weight_g = Math.max(0, parseFloat(manualRemaining));
      // Oppdater used_weight_g til å matche
      data.used_weight_g = Math.max(0, data.initial_weight_g - data.remaining_weight_g);
    } else {
      data.remaining_weight_g = Math.max(0, data.initial_weight_g - data.used_weight_g);
    }
    await fetch(`/api/inventory/spools/${spoolId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    // Close modal overlay if editing from visual card view
    const modal = document.getElementById(`spool-edit-modal-${spoolId}`);
    if (modal) modal.closest('.inv-modal-overlay')?.remove();
    loadFilament();
  };

  window.hideGlobalSpoolForm = function() {
    const c = document.getElementById('inv-global-form');
    if (c) { c.style.display = 'none'; c.innerHTML = ''; }
  };

  window.hideSpoolEdit = function(spoolId) {
    const c = document.getElementById(`spool-edit-${spoolId}`);
    if (c) { c.style.display = 'none'; c.innerHTML = ''; return; }
    // Fallback: close modal overlay if editing from visual card view
    const modal = document.getElementById(`spool-edit-modal-${spoolId}`);
    if (modal) modal.closest('.inv-modal-overlay')?.remove();
  };

  window.deleteSpoolItem = function(id) {
    return confirmAction(t('filament.delete_spool_confirm'), async () => {
      await fetch(`/api/inventory/spools/${id}`, { method: 'DELETE' });
      loadFilament();
    }, { danger: true });
  };

  window.archiveSpoolItem = async function(id) {
    await fetch(`/api/inventory/spools/${id}/archive`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: true }) });
    loadFilament();
  };

  window.unarchiveSpoolItem = async function(id) {
    await fetch(`/api/inventory/spools/${id}/archive`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: false }) });
    loadFilament();
  };

  // ═══ Manage Dashboard Sub-tabs ═══
  window._switchManageSubTab = function(tab) {
    window._fs.manageSubTab = tab;
    const container = document.getElementById('manage-sub-content')?.closest('.stats-module');
    if (container) {
      container.querySelectorAll('[data-manage-tab]').forEach(b => {
        b.classList.toggle('active', b.dataset.manageTab === tab);
      });
    }
    _renderManageSubContent(window._fs.spools);
  };

  function _renderManageSubContent(spools) {
    const el = document.getElementById('manage-sub-content');
    if (!el) return;
    if (window._fs.manageSubTab === 'profiles') {
      el.innerHTML = _renderProfilesList();
    } else if (window._fs.manageSubTab === 'vendors') {
      el.innerHTML = _renderVendorsList();
    } else if (window._fs.manageSubTab === 'locations') {
      el.innerHTML = _renderLocationsList() + _renderLocationsDnd(spools || window._fs.spools);
    } else if (window._fs.manageSubTab === 'tags') {
      el.innerHTML = _renderTagsList();
    } else if (window._fs.manageSubTab === 'prices') {
      el.innerHTML = `<div id="price-watch-container"><span class="text-muted text-sm">Loading...</span></div>`;
      if (typeof window._loadPriceWatch === 'function') window._loadPriceWatch();
    } else if (window._fs.manageSubTab === 'insights') {
      el.innerHTML = `<div id="insights-container"><span class="text-muted text-sm">${t('filament.ai_loading')}</span></div>`;
      if (typeof window._loadInsights === 'function') window._loadInsights();
    }
  }

  function _renderVendorsList() {
    let h = '';
    if (window._fs.vendors.length === 0) {
      h += `<p class="text-muted" style="font-size:0.85rem">${t('filament.no_vendors')}</p>`;
    } else {
      const canWrite = !window._can || window._can('filament');
      h += `<table class="data-table"><thead><tr>${canWrite ? `<th style="width:30px"><input type="checkbox" class="fil-bulk-check" onchange="window._bulkSelectAllVendors(this.checked)" title="${t('filament.bulk_select_all')}"></th>` : ''}<th>${t('filament.vendor_name')}</th><th>${t('filament.vendor_website')}</th><th>${t('filament.vendor_empty_spool')}</th><th></th></tr></thead><tbody>`;
      for (const v of window._fs.vendors) {
        h += `<tr data-vendor-id="${v.id}" class="${window._fs.selectedVendors.has(v.id) ? 'bulk-row-selected' : ''}">
          ${canWrite ? `<td><input type="checkbox" class="fil-bulk-check fil-vendor-check" ${window._fs.selectedVendors.has(v.id) ? 'checked' : ''} onchange="window.toggleVendorSelect(${v.id}, this)"></td>` : ''}
          <td><strong>${esc(v.name)}</strong></td>
          <td>${v.website ? `<a href="${esc(v.website)}" target="_blank" class="text-muted">${esc(v.website)}</a>` : '--'}</td>
          <td>${v.empty_spool_weight_g ? v.empty_spool_weight_g + 'g' : '--'}</td>
          <td style="text-align:right">
            <button class="filament-edit-btn" onclick="editVendor(${v.id})" title="${t('settings.edit')}" data-tooltip="${t('settings.edit')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button class="filament-delete-btn" onclick="deleteVendorItem(${v.id})" title="${t('settings.delete')}" data-tooltip="${t('settings.delete')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </td>
        </tr>`;
      }
      h += '</tbody></table>';
    }
    h += `<div id="vendor-form-container"></div>`;
    if (window._can && window._can('filament')) h += `<button class="form-btn form-btn-sm" data-ripple style="margin-top:8px" onclick="showAddVendorForm()">+ ${t('filament.vendor_add')}</button>`;
    return h;
  }

  function _renderProfilesList() {
    let h = '';
    if (window._fs.profiles.length === 0) {
      h += `<p class="text-muted" style="font-size:0.85rem">${t('filament.no_profiles')}</p>`;
    } else {
      const canWrite = !window._can || window._can('filament');
      h += '<div class="filament-grid">';
      for (const p of window._fs.profiles) {
        const color = window._filHelpers.hexToRgb(p.color_hex);
        const tempParts = [];
        if (p.nozzle_temp_min || p.nozzle_temp_max) tempParts.push(`🌡 ${p.nozzle_temp_min || '?'}–${p.nozzle_temp_max || '?'}°C`);
        if (p.bed_temp_min || p.bed_temp_max) tempParts.push(`🛏 ${p.bed_temp_min || '?'}–${p.bed_temp_max || '?'}°C`);
        if (p.chamber_temp_min || p.chamber_temp_max) tempParts.push(`🏠 ${p.chamber_temp_min || '?'}–${p.chamber_temp_max || '?'}°C`);
        const metaParts = [];
        if (p.density && p.density !== 1.24) metaParts.push(p.density + ' g/cm³');
        if (p.diameter && p.diameter !== 1.75) metaParts.push('⌀' + p.diameter + 'mm');
        if (p.diameter_tolerance) metaParts.push('±' + p.diameter_tolerance + 'mm');
        if (p.price) metaParts.push(formatCurrency(p.price));
        const refParts = [];
        if (p.tray_id_name) refParts.push(esc(p.tray_id_name));
        if (p.ral_code) refParts.push(esc(p.ral_code));
        if (p.pantone_code) refParts.push('Pantone ' + esc(p.pantone_code));
        if (p.article_number) refParts.push(esc(p.article_number));
        const tuneParts = [];
        if (p.pressure_advance_k) tuneParts.push('PA:' + p.pressure_advance_k);
        if (p.max_volumetric_speed) tuneParts.push('Vol:' + p.max_volumetric_speed + 'mm³/s');
        if (p.retraction_distance) tuneParts.push('Ret:' + p.retraction_distance + 'mm');
        if (p.cooling_fan_speed) tuneParts.push('Fan:' + p.cooling_fan_speed + '%');

        h += `<div class="filament-card inv-spool-card inv-profile-card ${window._fs.selectedProfiles.has(p.id) ? 'filament-card-selected' : ''}" data-profile-id="${p.id}">
          <div class="fil-spool-top">
            <div class="fil-spool-identity">
              ${canWrite ? `<input type="checkbox" class="fil-bulk-check fil-profile-check" ${window._fs.selectedProfiles.has(p.id) ? 'checked' : ''} onclick="window.toggleProfileSelect(${p.id}, this)">` : ''}
              ${miniSpool(color, 20)}
              <div>
                <strong style="font-size:0.9rem">${esc(p.name)}</strong>
                <span class="text-muted" style="font-size:0.75rem;display:block">${esc(p.vendor_name || '--')}</span>
              </div>
            </div>
          </div>
          <div class="fil-spool-meta" style="margin-top:8px">${esc(p.material)}${p.color_name ? ' · ' + esc(p.color_name) : ''} · ${p.spool_weight_g}g${metaParts.length ? ' · ' + metaParts.join(' · ') : ''}</div>
          ${tempParts.length ? `<div class="fil-spool-meta text-muted" style="font-size:0.7rem">${tempParts.join('  ')}</div>` : ''}
          ${refParts.length ? `<div class="fil-spool-meta text-muted" style="font-size:0.7rem">${refParts.join(' · ')}</div>` : ''}
          ${p.finish || p.translucent || p.glow || p.modifiers ? `<div class="fil-profile-badges">${p.finish ? `<span class="fil-badge">${t('filament.finish_' + p.finish)}</span>` : ''}${p.translucent ? `<span class="fil-badge">${t('filament.translucent')}</span>` : ''}${p.glow ? `<span class="fil-badge fil-badge-glow">${t('filament.glow')}</span>` : ''}${_parseModifiers(p.modifiers).map(m => `<span class="modifier-badge">${m}</span>`).join('')}</div>` : ''}
          ${tuneParts.length ? `<div class="fil-spool-meta text-muted" style="font-size:0.65rem;margin-top:2px">${tuneParts.join(' · ')}</div>` : ''}
          <div class="fil-profile-toolbar">
            <button class="fil-profile-action" onclick="window._shareProfile(${p.id})" data-tooltip="${t('filament.share_to_community')}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              ${t('filament.share_short', 'Del')}
            </button>
            <button class="fil-profile-action" onclick="window._exportSlicerProfile(${p.id})" data-tooltip="${t('filament.export_slicer')}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ${t('filament.export_short', 'Eksporter')}
            </button>
            <button class="fil-profile-action" onclick="editProfile(${p.id})" data-tooltip="${t('settings.edit')}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              ${t('settings.edit', 'Rediger')}
            </button>
            <button class="fil-profile-action fil-profile-action-danger" onclick="deleteProfileItem(${p.id})" data-tooltip="${t('settings.delete')}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              ${t('settings.delete', 'Slett')}
            </button>
          </div>
        </div>`;
      }
      h += '</div>';
    }
    h += `<div id="profile-form-container"></div>`;
    if (window._can && window._can('filament')) h += `<button class="form-btn form-btn-sm" data-ripple style="margin-top:8px" onclick="showAddProfileForm()">+ ${t('filament.profile_add')}</button>`;
    return h;
  }

  function _renderLocationsList() {
    let h = '';
    if (window._fs.locations.length === 0) {
      h += `<p class="text-muted" style="font-size:0.85rem">${t('filament.no_locations')}</p>`;
    } else {
      // Build tree: top-level first, then children
      const byParent = {};
      for (const l of window._fs.locations) {
        const pid = l.parent_id || 0;
        (byParent[pid] || (byParent[pid] = [])).push(l);
      }
      function renderLevel(parentId, depth) {
        const items = byParent[parentId] || [];
        let out = '';
        for (const l of items) {
          const indent = depth * 20;
          const thresholdInfo = [];
          if (l.min_spools) thresholdInfo.push(`min:${l.min_spools}`);
          if (l.max_spools) thresholdInfo.push(`max:${l.max_spools}`);
          out += `<div class="inv-location-item" style="padding-left:${indent}px">
            <span>${depth > 0 ? '&#x2514; ' : ''}${esc(l.name)}${l.description ? ` <span class="text-muted">(${esc(l.description)})</span>` : ''}${thresholdInfo.length ? ` <span class="text-muted" style="font-size:0.7rem">[${thresholdInfo.join(', ')}]</span>` : ''}</span>
            <div>
              <button class="filament-edit-btn" onclick="editLocationItem(${l.id})" title="${t('settings.edit')}" data-tooltip="${t('settings.edit')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="filament-delete-btn" onclick="deleteLocationItem(${l.id})" data-tooltip="${t('settings.delete')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
          </div>`;
          out += renderLevel(l.id, depth + 1);
        }
        return out;
      }
      h += '<div class="inv-location-list">';
      h += renderLevel(0, 0);
      h += '</div>';
    }
    h += `<div id="location-form-container"></div>`;
    h += `<button class="form-btn form-btn-sm" data-ripple style="margin-top:8px" onclick="showAddLocationForm()">+ ${t('filament.location_add')}</button>`;
    return h;
  }

  function _renderTagsList() {
    let h = '';
    if (window._fs.tags.length === 0) {
      h += `<p class="text-muted" style="font-size:0.85rem">${t('filament.no_tags')}</p>`;
    } else {
      h += '<div class="inv-location-list">';
      for (const tag of window._fs.tags) {
        const dot = tag.color ? `<span class="fil-tag-dot" style="background:${esc(tag.color)}"></span>` : '';
        h += `<div class="fil-tag-item">
          ${dot}
          <span style="flex:1"><strong>${esc(tag.name)}</strong> <span class="text-muted" style="font-size:0.75rem">(${esc(tag.category || 'custom')})</span></span>
          <span class="text-muted" style="font-size:0.75rem">${t('filament.tag_usage_count', { count: tag.usage_count || 0 })}</span>
          <div>
            <button class="filament-edit-btn" onclick="showEditTagForm(${tag.id})" title="${t('settings.edit')}" data-tooltip="${t('settings.edit')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button class="filament-delete-btn" onclick="deleteTagItem(${tag.id})" data-tooltip="${t('settings.delete')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
        </div>`;
      }
      h += '</div>';
    }
    h += `<div id="tag-form-container"></div>`;
    if (window._can && window._can('filament')) h += `<button class="form-btn form-btn-sm" data-ripple style="margin-top:8px" onclick="showAddTagForm()">+ ${t('filament.tag_add')}</button>`;
    return h;
  }

  function _renderLocationsDnd(spools) {
    const active = (spools || []).filter(s => !s.archived);
    if (active.length === 0 && window._fs.locations.length === 0) return '';
    let h = `<div class="ctrl-card-title" style="margin-top:16px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      ${t('filament.locations_dnd_title')}
    </div>`;
    const byLoc = { '': [] };
    for (const l of window._fs.locations) byLoc[l.name] = [];
    for (const s of active) {
      const loc = s.location || '';
      if (!byLoc[loc]) byLoc[loc] = [];
      byLoc[loc].push(s);
    }
    h += '<div class="inv-dnd-columns">';
    for (const [locName, locSpools] of Object.entries(byLoc)) {
      const label = locName || t('filament.unassigned');
      h += `<div class="inv-dnd-column" data-location="${esc(locName)}" ondragover="event.preventDefault();this.classList.add('inv-dnd-over')" ondragleave="this.classList.remove('inv-dnd-over')" ondrop="window._invDropSpool(event,this)">
        <div class="inv-dnd-column-header">${esc(label)} <span class="text-muted">(${locSpools.length})</span></div>`;
      for (const s of locSpools) {
        const color = window._filHelpers.hexToRgb(s.color_hex);
        h += `<div class="inv-dnd-spool" draggable="true" data-spool-id="${s.id}" ondragstart="event.dataTransfer.setData('text/plain','${s.id}')">
          ${miniSpool(color, 10)}
          <span>${esc(s.profile_name || s.material || '--')} · ${Math.round(s.remaining_weight_g)}g</span>
        </div>`;
      }
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  // ═══ Vendor CRUD ═══
  window.showAddVendorForm = function() {
    const c = document.getElementById('vendor-form-container');
    if (!c) return;
    c.innerHTML = `<div class="settings-form mt-sm" style="border-top:1px solid var(--border-color);padding-top:8px">
      <div class="flex gap-sm" style="flex-wrap:wrap">
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.vendor_name')}</label><input class="form-input" id="v-name"></div>
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.vendor_website')}</label><input class="form-input" id="v-website" placeholder="https://"></div>
        <div class="form-group" style="width:100px"><label class="form-label">${t('filament.vendor_empty_spool')}</label><input class="form-input" id="v-spool-weight" type="number" placeholder="250"></div>
      </div>
      <div id="va-extra-fields-section">
        <div style="font-size:0.8rem;margin:4px 0">${t('filament.extra_fields')}</div>
        <div id="va-extra-fields"></div>
        <button class="form-btn form-btn-sm" data-ripple style="font-size:0.7rem" onclick="window._addExtraField('va')" type="button">+ ${t('filament.add_field')}</button>
      </div>
      <div class="flex gap-sm"><button class="form-btn" data-ripple onclick="saveNewVendor()">${t('filament.save')}</button><button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="document.getElementById('vendor-form-container').innerHTML=''">${t('settings.cancel')}</button></div>
    </div>`;
  };

  window.editVendor = function(id) {
    const v = window._fs.vendors.find(x => x.id === id);
    if (!v) return;
    const c = document.getElementById('vendor-form-container');
    if (!c) return;
    c.innerHTML = `<div class="settings-form mt-sm" style="border-top:1px solid var(--border-color);padding-top:8px">
      <div class="flex gap-sm" style="flex-wrap:wrap">
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.vendor_name')}</label><input class="form-input" id="v-name" value="${esc(v.name)}"></div>
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.vendor_website')}</label><input class="form-input" id="v-website" value="${esc(v.website || '')}"></div>
        <div class="form-group" style="width:100px"><label class="form-label">${t('filament.vendor_empty_spool')}</label><input class="form-input" id="v-spool-weight" type="number" value="${v.empty_spool_weight_g || ''}"></div>
      </div>
      <div id="ve-extra-fields-section">
        <div style="font-size:0.8rem;margin:4px 0">${t('filament.extra_fields')}</div>
        <div id="ve-extra-fields">${_renderExtraFieldInputs('ve', v.extra_fields)}</div>
        <button class="form-btn form-btn-sm" data-ripple style="font-size:0.7rem" onclick="window._addExtraField('ve')" type="button">+ ${t('filament.add_field')}</button>
      </div>
      <div class="flex gap-sm"><button class="form-btn" data-ripple onclick="saveVendorEdit(${id})">${t('filament.save')}</button><button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="document.getElementById('vendor-form-container').innerHTML=''">${t('settings.cancel')}</button></div>
    </div>`;
  };

  window.saveNewVendor = async function() {
    const name = document.getElementById('v-name')?.value?.trim();
    if (!name) return;
    await fetch('/api/inventory/vendors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      name, website: document.getElementById('v-website').value || null,
      empty_spool_weight_g: parseFloat(document.getElementById('v-spool-weight').value) || null,
      extra_fields: _collectExtraFields('va')
    })});
    loadFilament();
  };

  window.saveVendorEdit = async function(id) {
    const name = document.getElementById('v-name')?.value?.trim();
    if (!name) return;
    await fetch(`/api/inventory/vendors/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      name, website: document.getElementById('v-website').value || null,
      empty_spool_weight_g: parseFloat(document.getElementById('v-spool-weight').value) || null,
      extra_fields: _collectExtraFields('ve')
    })});
    loadFilament();
  };

  window.deleteVendorItem = function(id) {
    return confirmAction(t('filament.vendor_delete_confirm'), async () => {
      await fetch(`/api/inventory/vendors/${id}`, { method: 'DELETE' });
      loadFilament();
    }, { danger: true });
  };

  // ═══ Profile CRUD ═══
  window.showAddProfileForm = function() {
    const c = document.getElementById('profile-form-container');
    if (!c) return;
    c.innerHTML = renderProfileForm(null);
  };

  window.editProfile = function(id) {
    const p = window._fs.profiles.find(x => x.id === id);
    if (!p) return;
    const c = document.getElementById('profile-form-container');
    if (!c) return;
    c.innerHTML = renderProfileForm(p);
  };

  function _parseWeightOptions(json) {
    try { const arr = json ? (typeof json === 'string' ? JSON.parse(json) : json) : []; return arr.join(', '); } catch { return ''; }
  }
  function _parseDiameters(json) {
    try { const arr = json ? (typeof json === 'string' ? JSON.parse(json) : json) : []; return arr.join(', '); } catch { return ''; }
  }
  function _parseModifiers(json) {
    try { return json ? (typeof json === 'string' ? JSON.parse(json) : json) : []; } catch { return []; }
  }
  const _MODIFIERS = [
    'CF','GF','KF','HF','HS','HT','ESD','FR','UV',
    'Silk','Marble','Wood','Metal','Glow','Sparkle','Galaxy',
    'Tough','Flex','Pro','Plus','Basic','Lite','Max',
    'Matte','Glossy','Satin','Transparent','Translucent',
    'Recycled','Bio','ASA-Blend','Conductive','Magnetic',
    'Hygroscopic','Abrasive','Food-Safe','Medical',
    'Lightweight','Heavy','Foaming','Gradient','Dual-Color',
    'Neon','Pastel','Fluorescent','Phosphorescent',
    'Temperature','Humidity','Color-Change','Pearlescent'
  ];

  // Multi-color + extra fields helpers
  function _hasMultiColor(profile) {
    if (!profile?.multi_color_hexes) return false;
    try { const arr = JSON.parse(profile.multi_color_hexes); return Array.isArray(arr) && arr.length > 1; } catch { return false; }
  }

  function _renderMultiColorInputs(pfx, profile) {
    let hexes = [];
    try { hexes = profile?.multi_color_hexes ? JSON.parse(profile.multi_color_hexes) : []; } catch {}
    if (hexes.length < 2) hexes = ['FF0000', '00FF00'];
    let h = '';
    for (let i = 0; i < hexes.length; i++) {
      h += `<input type="color" class="form-input ${pfx}-mc-color" value="${window._filHelpers.hexToRgb(hexes[i])}" style="width:36px;height:28px;padding:1px">`;
    }
    h += `<button class="form-btn form-btn-sm" style="font-size:0.7rem" onclick="window._addMultiColorStop('${pfx}')" type="button">+</button>`;
    h += `<select class="form-input form-input-sm" id="${pfx}-mc-dir" style="width:auto">
      <option value="coaxial" ${profile?.multi_color_direction !== 'longitudinal' ? 'selected' : ''}>Coaxial</option>
      <option value="longitudinal" ${profile?.multi_color_direction === 'longitudinal' ? 'selected' : ''}>Longitudinal</option>
    </select>`;
    return h;
  }

  function _renderExtraFieldInputs(pfx, extraJson) {
    let obj = {};
    try { if (extraJson) obj = typeof extraJson === 'string' ? JSON.parse(extraJson) : extraJson; } catch {}
    let h = '';
    let idx = 0;
    for (const [k, v] of Object.entries(obj)) {
      h += `<div class="flex gap-sm" style="margin:2px 0">
        <input class="form-input form-input-sm ${pfx}-ef-key" value="${esc(k)}" placeholder="${t('filament.field_key')}" style="width:100px">
        <input class="form-input form-input-sm ${pfx}-ef-val" value="${esc(String(v))}" placeholder="${t('filament.field_value')}" style="flex:1">
        <button class="filament-delete-btn" onclick="this.parentElement.remove()" type="button" style="opacity:1" title="${t('settings.delete')}" aria-label="${t('settings.delete')}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>`;
      idx++;
    }
    return h;
  }

  function _collectExtraFields(pfx) {
    const container = document.getElementById(`${pfx}-extra-fields`);
    if (!container) return null;
    const keys = container.querySelectorAll(`.${pfx}-ef-key`);
    const vals = container.querySelectorAll(`.${pfx}-ef-val`);
    const obj = {};
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]?.value?.trim();
      const v = vals[i]?.value?.trim();
      if (k) obj[k] = v || '';
    }
    return Object.keys(obj).length > 0 ? JSON.stringify(obj) : null;
  }

  function _collectMultiColorHexes(pfx) {
    const inputs = document.querySelectorAll(`.${pfx}-mc-color`);
    if (inputs.length < 2) return null;
    return JSON.stringify([...inputs].map(i => i.value.replace('#', '')));
  }

  window._toggleMultiColor = function(pfx, checked) {
    const fields = document.getElementById(`${pfx}-multicolor-fields`);
    if (fields) fields.style.display = checked ? 'flex' : 'none';
  };

  window._addMultiColorStop = function(pfx) {
    const container = document.getElementById(`${pfx}-multicolor-fields`);
    if (!container) return;
    const inputs = container.querySelectorAll(`.${pfx}-mc-color`);
    if (inputs.length >= 8) return;
    const newInput = document.createElement('input');
    newInput.type = 'color';
    newInput.className = `form-input ${pfx}-mc-color`;
    newInput.value = '#0000FF';
    newInput.style.cssText = 'width:36px;height:28px;padding:1px';
    const btn = container.querySelector('button');
    container.insertBefore(newInput, btn);
  };

  window._addExtraField = function(pfx) {
    const container = document.getElementById(`${pfx}-extra-fields`);
    if (!container) return;
    if (container.querySelectorAll(`.${pfx}-ef-key`).length >= 20) return;
    const row = document.createElement('div');
    row.className = 'flex gap-sm';
    row.style.margin = '2px 0';
    row.innerHTML = `<input class="form-input form-input-sm ${pfx}-ef-key" placeholder="${t('filament.field_key')}" style="width:100px">
      <input class="form-input form-input-sm ${pfx}-ef-val" placeholder="${t('filament.field_value')}" style="flex:1">
      <button class="filament-delete-btn" onclick="this.parentElement.remove()" type="button" style="opacity:1" title="${t('settings.delete')}" aria-label="${t('settings.delete')}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    container.appendChild(row);
  };

  function renderProfileForm(profile) {
    const isEdit = !!profile;
    const pfx = isEdit ? 'pe' : 'pa';
    return `<div class="settings-form mt-sm" style="border-top:1px solid var(--border-color);padding-top:8px">
      <div class="flex gap-sm" style="flex-wrap:wrap">
        <div class="form-group" style="flex:1;min-width:130px">
          <label class="form-label">${t('filament.filter_vendor')}</label>
          <select class="form-input" id="${pfx}-vendor">
            <option value="">--</option>
            ${window._fs.vendors.map(v => `<option value="${v.id}" ${profile?.vendor_id === v.id ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.profile_name')}</label><input class="form-input" id="${pfx}-name" value="${profile?.name || ''}"></div>
        <div class="form-group" style="flex:1;min-width:120px">
          <label class="form-label">${t('filament.profile_material')}</label>
          <select class="form-input" id="${pfx}-material" onchange="window._onProfileMaterialChange('${pfx}')">${window._filHelpers.buildMaterialOptions(profile?.material || '')}</select>
          <input class="form-input mt-xs" id="${pfx}-material-custom" style="display:none" placeholder="${t('filament.custom_type_placeholder')}">
        </div>
        <div class="form-group" style="width:90px"><label class="form-label">${t('filament.color')}</label><input class="form-input" id="${pfx}-color-name" value="${profile?.color_name || ''}"></div>
        <div class="form-group" style="width:60px"><label class="form-label">${t('filament.color_hex')}</label><input type="color" class="form-input" id="${pfx}-color-hex" value="${profile?.color_hex ? window._filHelpers.hexToRgb(profile.color_hex) : '#888888'}" style="padding:2px;height:32px"></div>
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.profile_spool_weight')}</label><input class="form-input" id="${pfx}-spool-weight" type="number" value="${profile?.spool_weight_g || 1000}"></div>
        <div class="form-group" style="width:70px"><label class="form-label">${t('filament.profile_density')}</label><input class="form-input" id="${pfx}-density" type="number" step="0.01" value="${profile?.density ?? 1.24}"></div>
        <div class="form-group" style="width:70px"><label class="form-label">${t('filament.profile_diameter')}</label><input class="form-input" id="${pfx}-diameter" type="number" step="0.01" value="${profile?.diameter ?? 1.75}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.price')}</label><input class="form-input" id="${pfx}-price" type="number" step="0.01" value="${profile?.price || ''}"></div>
        <div class="form-group" style="flex:1;min-width:180px"><label class="form-label">${t('filament.purchase_url')}</label>
          <div style="display:flex;gap:4px"><input class="form-input" id="${pfx}-purchase-url" value="${profile?.purchase_url || ''}" placeholder="https://...">
          <button class="form-btn form-btn-sm" type="button" data-ripple onclick="window._checkPrice('${pfx}')" title="${t('filament.check_price')}" style="white-space:nowrap">${t('filament.check_price')}</button></div>
        </div>
      </div>
      <div class="flex gap-sm" style="flex-wrap:wrap">
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.profile_nozzle_temp')} ${t('filament.temp_min')}</label><input class="form-input" id="${pfx}-nozzle-min" type="number" value="${profile?.nozzle_temp_min || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.profile_nozzle_temp')} ${t('filament.temp_max')}</label><input class="form-input" id="${pfx}-nozzle-max" type="number" value="${profile?.nozzle_temp_max || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.profile_bed_temp')} ${t('filament.temp_min')}</label><input class="form-input" id="${pfx}-bed-min" type="number" value="${profile?.bed_temp_min || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.profile_bed_temp')} ${t('filament.temp_max')}</label><input class="form-input" id="${pfx}-bed-max" type="number" value="${profile?.bed_temp_max || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">Kammer min</label><input class="form-input" id="${pfx}-chamber-min" type="number" value="${profile?.chamber_temp_min || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">Kammer maks</label><input class="form-input" id="${pfx}-chamber-max" type="number" value="${profile?.chamber_temp_max || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">⌀ toleranse</label><input class="form-input" id="${pfx}-dia-tolerance" type="number" step="0.001" value="${profile?.diameter_tolerance || ''}" placeholder="±mm"></div>
        <div class="form-group" style="width:100px"><label class="form-label">${t('filament.article_number')}</label><input class="form-input" id="${pfx}-article" value="${profile?.article_number || ''}"></div>
        <div class="form-group" style="width:90px"><label class="form-label">Bambu SKU</label><input class="form-input" id="${pfx}-tray-id-name" value="${profile?.tray_id_name || ''}" placeholder="A00-W0"></div>
        <div class="form-group" style="width:90px"><label class="form-label">RAL-kode</label><input class="form-input" id="${pfx}-ral-code" value="${profile?.ral_code || ''}" placeholder="RAL 9005"></div>
        <div class="form-group" style="width:90px"><label class="form-label">Pantone</label><input class="form-input" id="${pfx}-pantone-code" value="${profile?.pantone_code || ''}" placeholder="PMS 123"></div>
        <div class="form-group" style="width:90px">
          <label class="form-label">${t('filament.finish')}</label>
          <select class="form-input" id="${pfx}-finish">
            <option value="">--</option>
            ${['matte','glossy','satin','silk'].map(f => `<option value="${f}" ${profile?.finish === f ? 'selected' : ''}>${t('filament.finish_' + f)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="width:120px"><label class="form-label">${t('filament.weight_options')}</label><input class="form-input" id="${pfx}-weights" value="${_parseWeightOptions(profile?.weight_options)}" placeholder="250, 500, 1000"></div>
        <div class="form-group" style="width:120px"><label class="form-label">${t('filament.diameters')}</label><input class="form-input" id="${pfx}-diameters" value="${_parseDiameters(profile?.diameters)}" placeholder="1.75, 2.85"></div>
      </div>
      <div style="margin-top:4px">
        <label class="form-label">${t('filament.modifiers')}</label>
        <div class="modifier-tags" id="${pfx}-modifiers">
          ${_MODIFIERS.map(m => {
            const active = _parseModifiers(profile?.modifiers).includes(m);
            return `<span class="modifier-tag${active ? ' active' : ''}" onclick="this.classList.toggle('active')" data-mod="${m}">${m}</span>`;
          }).join('')}
        </div>
      </div>
      <div class="flex gap-sm" style="flex-wrap:wrap;margin-top:4px">
        <div style="font-size:0.75rem;width:100%;color:var(--text-muted);font-weight:600">${t('filament.optimal_settings')}</div>
        <div class="form-group" style="width:90px"><label class="form-label">${t('filament.pressure_advance')}</label><input class="form-input" id="${pfx}-pa-k" type="number" step="0.001" value="${profile?.pressure_advance_k || ''}"></div>
        <div class="form-group" style="width:100px"><label class="form-label">${t('filament.max_volumetric_speed')}</label><input class="form-input" id="${pfx}-max-vol" type="number" step="0.1" value="${profile?.max_volumetric_speed || ''}"></div>
        <div class="form-group" style="width:90px"><label class="form-label">${t('filament.retraction_distance')}</label><input class="form-input" id="${pfx}-retract-dist" type="number" step="0.1" value="${profile?.retraction_distance || ''}"></div>
        <div class="form-group" style="width:90px"><label class="form-label">${t('filament.retraction_speed')}</label><input class="form-input" id="${pfx}-retract-speed" type="number" step="1" value="${profile?.retraction_speed || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.cooling_fan_speed')}</label><input class="form-input" id="${pfx}-fan-speed" type="number" min="0" max="100" value="${profile?.cooling_fan_speed || ''}"></div>
        <div class="form-group" style="width:80px"><label class="form-label">${t('filament.transmission_distance')}</label><input class="form-input" id="${pfx}-td" type="number" step="0.01" min="0" value="${profile?.transmission_distance || ''}" placeholder="TD"></div>
      </div>
      <div class="flex gap-sm" style="flex-wrap:wrap;align-items:center">
        <label style="font-size:0.8rem;display:flex;align-items:center;gap:4px">
          <input type="checkbox" id="${pfx}-translucent" ${profile?.translucent ? 'checked' : ''}>
          ${t('filament.translucent')}
        </label>
        <label style="font-size:0.8rem;display:flex;align-items:center;gap:4px">
          <input type="checkbox" id="${pfx}-glow" ${profile?.glow ? 'checked' : ''}>
          ${t('filament.glow')}
        </label>
        <label style="font-size:0.8rem;display:flex;align-items:center;gap:4px">
          <input type="checkbox" id="${pfx}-multicolor" ${_hasMultiColor(profile) ? 'checked' : ''} onchange="window._toggleMultiColor('${pfx}',this.checked)">
          ${t('filament.multi_color')}
        </label>
        <div id="${pfx}-multicolor-fields" style="display:${_hasMultiColor(profile) ? 'flex' : 'none'};gap:4px;flex-wrap:wrap;align-items:center">
          ${_renderMultiColorInputs(pfx, profile)}
        </div>
      </div>
      <div id="${pfx}-extra-fields-section">
        <div style="font-size:0.8rem;margin:4px 0">${t('filament.extra_fields')}</div>
        <div id="${pfx}-extra-fields">${_renderExtraFieldInputs(pfx, profile?.extra_fields)}</div>
        <button class="form-btn form-btn-sm" data-ripple style="font-size:0.7rem" onclick="window._addExtraField('${pfx}')" type="button">+ ${t('filament.add_field')}</button>
      </div>
      <div class="flex gap-sm">
        <button class="form-btn" data-ripple onclick="${isEdit ? `saveProfileEdit(${profile.id})` : 'saveNewProfile()'}">${t('filament.save')}</button>
        <button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="document.getElementById('profile-form-container').innerHTML=''">${t('settings.cancel')}</button>
      </div>
    </div>`;
  }

  window._onProfileMaterialChange = function(pfx) {
    const sel = document.getElementById(`${pfx}-material`);
    const custom = document.getElementById(`${pfx}-material-custom`);
    if (!sel || !custom) return;
    if (sel.value === '__custom__') { custom.style.display = ''; custom.focus(); }
    else { custom.style.display = 'none'; custom.value = ''; }
  };

  function getProfileMaterial(pfx) {
    const sel = document.getElementById(`${pfx}-material`);
    if (!sel) return '';
    if (sel.value === '__custom__') return document.getElementById(`${pfx}-material-custom`)?.value?.trim() || '';
    return sel.value;
  }

  function collectProfileData(pfx) {
    const colorHex = document.getElementById(`${pfx}-color-hex`)?.value?.replace('#', '') || '';
    const isMultiColor = document.getElementById(`${pfx}-multicolor`)?.checked;
    return {
      vendor_id: parseInt(document.getElementById(`${pfx}-vendor`)?.value) || null,
      name: document.getElementById(`${pfx}-name`)?.value?.trim() || '',
      material: getProfileMaterial(pfx),
      color_name: document.getElementById(`${pfx}-color-name`)?.value || null,
      color_hex: colorHex || null,
      spool_weight_g: parseFloat(document.getElementById(`${pfx}-spool-weight`)?.value) || 1000,
      density: parseFloat(document.getElementById(`${pfx}-density`)?.value) || 1.24,
      diameter: parseFloat(document.getElementById(`${pfx}-diameter`)?.value) || 1.75,
      nozzle_temp_min: parseInt(document.getElementById(`${pfx}-nozzle-min`)?.value) || null,
      nozzle_temp_max: parseInt(document.getElementById(`${pfx}-nozzle-max`)?.value) || null,
      bed_temp_min: parseInt(document.getElementById(`${pfx}-bed-min`)?.value) || null,
      bed_temp_max: parseInt(document.getElementById(`${pfx}-bed-max`)?.value) || null,
      chamber_temp_min: parseInt(document.getElementById(`${pfx}-chamber-min`)?.value) || null,
      chamber_temp_max: parseInt(document.getElementById(`${pfx}-chamber-max`)?.value) || null,
      diameter_tolerance: parseFloat(document.getElementById(`${pfx}-dia-tolerance`)?.value) || null,
      tray_id_name: document.getElementById(`${pfx}-tray-id-name`)?.value?.trim() || null,
      ral_code: document.getElementById(`${pfx}-ral-code`)?.value?.trim() || null,
      pantone_code: document.getElementById(`${pfx}-pantone-code`)?.value?.trim() || null,
      price: parseFloat(document.getElementById(`${pfx}-price`)?.value) || null,
      article_number: document.getElementById(`${pfx}-article`)?.value?.trim() || null,
      multi_color_hexes: isMultiColor ? _collectMultiColorHexes(pfx) : null,
      multi_color_direction: isMultiColor ? (document.getElementById(`${pfx}-mc-dir`)?.value || 'coaxial') : null,
      extra_fields: _collectExtraFields(pfx),
      finish: document.getElementById(`${pfx}-finish`)?.value || null,
      translucent: document.getElementById(`${pfx}-translucent`)?.checked ? 1 : 0,
      glow: document.getElementById(`${pfx}-glow`)?.checked ? 1 : 0,
      weight_options: (() => { const v = document.getElementById(`${pfx}-weights`)?.value?.trim(); if (!v) return null; return JSON.stringify(v.split(',').map(s => parseInt(s.trim())).filter(n => n > 0)); })(),
      diameters: (() => { const v = document.getElementById(`${pfx}-diameters`)?.value?.trim(); if (!v) return null; return JSON.stringify(v.split(',').map(s => parseFloat(s.trim())).filter(n => n > 0)); })(),
      weights: (() => {
        const v = document.getElementById(`${pfx}-weights`)?.value?.trim();
        if (!v) return null;
        const spoolW = parseFloat(document.getElementById(`${pfx}-spool-weight`)?.value) || null;
        return JSON.stringify(v.split(',').map(s => parseInt(s.trim())).filter(n => n > 0).map(w => ({ weight: w, spool_weight: spoolW, spool_type: 'plastic' })));
      })(),
      pressure_advance_k: parseFloat(document.getElementById(`${pfx}-pa-k`)?.value) || null,
      max_volumetric_speed: parseFloat(document.getElementById(`${pfx}-max-vol`)?.value) || null,
      retraction_distance: parseFloat(document.getElementById(`${pfx}-retract-dist`)?.value) || null,
      retraction_speed: parseFloat(document.getElementById(`${pfx}-retract-speed`)?.value) || null,
      cooling_fan_speed: parseInt(document.getElementById(`${pfx}-fan-speed`)?.value) || null,
      transmission_distance: parseFloat(document.getElementById(`${pfx}-td`)?.value) || null,
      purchase_url: document.getElementById(`${pfx}-purchase-url`)?.value?.trim() || null,
      modifiers: (() => {
        const el = document.getElementById(`${pfx}-modifiers`);
        if (!el) return null;
        const active = [...el.querySelectorAll('.modifier-tag.active')].map(t => t.dataset.mod);
        return active.length > 0 ? active : null;
      })(),
    };
  }

  window.saveNewProfile = async function() {
    const data = collectProfileData('pa');
    if (!data.name || !data.material) { showToast(t('filament.type_required'), 'warning'); return; }
    await fetch('/api/inventory/filaments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    loadFilament();
  };

  window.saveProfileEdit = async function(id) {
    const data = collectProfileData('pe');
    if (!data.name || !data.material) { showToast(t('filament.type_required'), 'warning'); return; }
    await fetch(`/api/inventory/filaments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    loadFilament();
  };

  window._checkPrice = async function(pfx) {
    const url = document.getElementById(`${pfx}-purchase-url`)?.value?.trim();
    if (!url) { showToast(t('filament.enter_url_first'), 'warning'); return; }
    try {
      const res = await fetch('/api/inventory/price-check', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.price) {
        const priceInput = document.getElementById(`${pfx}-price`);
        if (priceInput && !priceInput.value) priceInput.value = data.price;
        showToast(`${t('filament.price_found')}: ${data.currency || ''}${data.price}`, 'success');
      } else {
        showToast(t('filament.price_not_found'), 'warning');
      }
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteProfileItem = function(id) {
    return confirmAction(t('filament.profile_delete_confirm'), async () => {
      await fetch(`/api/inventory/filaments/${id}`, { method: 'DELETE' });
      loadFilament();
    }, { danger: true });
  };

  // ═══ Community Sharing ═══
  window._exportSlicerProfile = function(id) {
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-backdrop';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:320px">
      <h3>${t('filament.export_slicer')}</h3>
      <div style="display:flex;flex-direction:column;gap:8px;margin:16px 0">
        <a href="/api/inventory/filaments/${id}/slicer-export?format=orcaslicer" download class="form-btn form-btn-primary" style="text-align:center" onclick="setTimeout(()=>this.closest('.inv-modal-backdrop').remove(),200)">OrcaSlicer (.json)</a>
        <a href="/api/inventory/filaments/${id}/slicer-export?format=prusaslicer" download class="form-btn" style="text-align:center" onclick="setTimeout(()=>this.closest('.inv-modal-backdrop').remove(),200)">PrusaSlicer (.ini)</a>
      </div>
      <button class="form-btn" style="width:100%" onclick="this.closest('.inv-modal-backdrop').remove()">${t('common.cancel')}</button>
    </div>`;
    document.body.appendChild(overlay);
  };

  window._shareProfile = async function(id) {
    const profile = window._fs.profiles.find(p => p.id === id);
    if (!profile) return;
    const confirmed = confirm(t('filament.share_confirm', { name: profile.name || profile.material }));
    if (!confirmed) return;
    try {
      const res = await fetch('/api/community-filaments/share', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: id })
      });
      const data = await res.json();
      if (data.ok) showToast(t('filament.shared_success'), 'success');
      else showToast(data.error || 'Error', 'error');
    } catch (e) { showToast(e.message, 'error'); }
  };

  window._rateCommunityFilament = async function(id, rating) {
    try {
      const res = await fetch(`/api/community-filaments/${id}/rate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });
      const data = await res.json();
      if (data.ok) {
        showToast(t('filament.rating_saved'), 'success');
        // Update stars display
        for (let i = 1; i <= 5; i++) {
          const star = document.getElementById(`cf-star-${i}`);
          if (star) star.style.color = i <= rating ? 'var(--accent-orange)' : 'var(--text-muted)';
        }
      }
      else showToast(data.error || 'Error', 'error');
    } catch (e) { showToast(e.message, 'error'); }
  };

  window._submitTdVote = async function(id) {
    const val = parseFloat(document.getElementById(`td-vote-${id}`)?.value);
    if (!val || val <= 0) return;
    try {
      const res = await fetch(`/api/community-filaments/${id}/td-vote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ td_value: val })
      });
      const data = await res.json();
      if (data.td_value != null) {
        showToast(`TD updated: ${data.td_value} (${data.total_td_votes} votes)`, 'success');
        const f = window._fs.dbFilaments.find(x => x.id === id);
        if (f) { f.td_value = data.td_value; f.total_td_votes = data.total_td_votes; }
      } else showToast(data.error || 'Error', 'error');
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ═══ Location CRUD ═══
  function _buildParentLocationOptions(excludeId) {
    let opts = `<option value="">${t('common.none')}</option>`;
    for (const l of window._fs.locations) {
      if (l.id === excludeId) continue;
      opts += `<option value="${l.id}">${esc(l.name)}</option>`;
    }
    return opts;
  }

  window.showAddLocationForm = function() {
    const c = document.getElementById('location-form-container');
    if (!c) return;
    c.innerHTML = `<div class="settings-form mt-sm" style="border-top:1px solid var(--border-color);padding-top:8px">
      <div class="flex gap-sm" style="flex-wrap:wrap">
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.location_name')}</label><input class="form-input" id="loc-name"></div>
        <div class="form-group" style="width:120px"><label class="form-label">${t('filament.location_parent')}</label><select class="form-input" id="loc-parent">${_buildParentLocationOptions()}</select></div>
        <div class="form-group" style="width:70px"><label class="form-label">${t('filament.location_min_spools')}</label><input class="form-input" id="loc-min-spools" type="number" min="0"></div>
        <div class="form-group" style="width:70px"><label class="form-label">${t('filament.location_max_spools')}</label><input class="form-input" id="loc-max-spools" type="number" min="0"></div>
      </div>
      <div class="flex gap-sm"><button class="form-btn" data-ripple onclick="saveNewLocation()">${t('filament.save')}</button><button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="document.getElementById('location-form-container').innerHTML=''">${t('settings.cancel')}</button></div>
    </div>`;
  };

  window.saveNewLocation = async function() {
    const name = document.getElementById('loc-name')?.value?.trim();
    if (!name) return;
    const data = { name };
    const parentId = document.getElementById('loc-parent')?.value;
    if (parentId) data.parent_id = parseInt(parentId);
    const minS = document.getElementById('loc-min-spools')?.value;
    if (minS) data.min_spools = parseInt(minS);
    const maxS = document.getElementById('loc-max-spools')?.value;
    if (maxS) data.max_spools = parseInt(maxS);
    await fetch('/api/inventory/locations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    loadFilament();
  };

  window.deleteLocationItem = async function(id) {
    await fetch(`/api/inventory/locations/${id}`, { method: 'DELETE' });
    loadFilament();
  };

  window.editLocationItem = function(id) {
    const l = window._fs.locations.find(x => x.id === id);
    if (!l) return;
    const c = document.getElementById('location-form-container');
    if (!c) return;
    c.innerHTML = `<div class="settings-form mt-sm" style="border-top:1px solid var(--border-color);padding-top:8px">
      <div class="flex gap-sm" style="flex-wrap:wrap">
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.location_name')}</label><input class="form-input" id="loc-edit-name" value="${esc(l.name)}"></div>
        <div class="form-group" style="flex:1;min-width:120px"><label class="form-label">${t('filament.location_description')}</label><input class="form-input" id="loc-edit-desc" value="${esc(l.description || '')}"></div>
        <div class="form-group" style="width:120px"><label class="form-label">${t('filament.location_parent')}</label><select class="form-input" id="loc-edit-parent">${_buildParentLocationOptions(id).replace(`value="${l.parent_id}"`, `value="${l.parent_id}" selected`)}</select></div>
        <div class="form-group" style="width:70px"><label class="form-label">${t('filament.location_min_spools')}</label><input class="form-input" id="loc-edit-min-spools" type="number" min="0" value="${l.min_spools || ''}"></div>
        <div class="form-group" style="width:70px"><label class="form-label">${t('filament.location_max_spools')}</label><input class="form-input" id="loc-edit-max-spools" type="number" min="0" value="${l.max_spools || ''}"></div>
      </div>
      <div class="flex gap-sm"><button class="form-btn" data-ripple onclick="saveLocationEdit(${id})">${t('filament.save')}</button><button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="document.getElementById('location-form-container').innerHTML=''">${t('settings.cancel')}</button></div>
    </div>`;
  };

  window.saveLocationEdit = async function(id) {
    const name = document.getElementById('loc-edit-name')?.value?.trim();
    if (!name) return;
    const desc = document.getElementById('loc-edit-desc')?.value?.trim() || null;
    const data = { name, description: desc };
    const parentId = document.getElementById('loc-edit-parent')?.value;
    data.parent_id = parentId ? parseInt(parentId) : null;
    const minS = document.getElementById('loc-edit-min-spools')?.value;
    data.min_spools = minS ? parseInt(minS) : null;
    const maxS = document.getElementById('loc-edit-max-spools')?.value;
    data.max_spools = maxS ? parseInt(maxS) : null;
    await fetch(`/api/inventory/locations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    loadFilament();
  };

  // ═══ Duplicate Spool ═══
  window.duplicateSpoolItem = async function(id) {
    const res = await fetch(`/api/inventory/spools/${id}/duplicate`, { method: 'POST' });
    if (res.ok) loadFilament();
    else showToast(t('filament.duplicate_failed'), 'error');
  };

  // ═══ Measure Weight ═══
  window.showRefillDialog = function(id) {
    const spool = window._fs.spools.find(s => s.id === id);
    if (!spool) return;
    const container = document.getElementById(`spool-edit-${id}`);
    if (!container) return;
    container.style.display = '';
    container.innerHTML = `<div class="settings-form" style="margin:6px 0;padding:6px;border-top:1px solid var(--border-color)">
      <div style="font-size:0.8rem;font-weight:600;margin-bottom:4px">${t('filament.refill_spool')} ${spool.is_refill ? '♻ x' + (spool.refill_count || 1) : ''}</div>
      <div class="flex gap-sm" style="align-items:flex-end">
        <div class="form-group" style="width:120px">
          <label class="form-label">${t('filament.new_fill_weight')}</label>
          <input class="form-input" id="refill-weight-${id}" type="number" value="${spool.initial_weight_g || 1000}" min="1">
        </div>
        <button class="form-btn form-btn-sm" data-ripple onclick="submitRefill(${id})">${t('filament.refill')}</button>
        <button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="document.getElementById('spool-edit-${id}').style.display='none'">${t('settings.cancel')}</button>
      </div>
    </div>`;
  };

  window.submitRefill = async function(id) {
    const weightEl = document.getElementById(`refill-weight-${id}`);
    const weight = parseFloat(weightEl?.value);
    if (!weight || weight <= 0) { showToast('Enter a valid weight', 'warning'); return; }
    try {
      const res = await fetch(`/api/inventory/spools/${id}/refill`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_weight_g: weight })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      showToast(t('filament.refill_done'), 'success');
      document.getElementById(`spool-edit-${id}`).style.display = 'none';
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.showMeasureDialog = function(id) {
    const spool = window._fs.spools.find(s => s.id === id);
    if (!spool) return;
    const tare = spool.spool_weight ?? spool.vendor_empty_spool_weight_g ?? 250;
    const totalG = spool.initial_weight_g || 1000;
    const quickPcts = [0, 25, 50, 75, 100];
    const quickBtns = quickPcts.map(p => {
      const gross = Math.round(totalG * p / 100 + tare);
      return `<button class="measure-quick-btn" onclick="document.getElementById('measure-weight-${id}').value=${gross};document.getElementById('measure-weight-${id}').dispatchEvent(new Event('input'))">${p}% <span class="measure-quick-g">${gross}g</span></button>`;
    }).join('');
    const density = spool.density || 1.24;
    const diameter = spool.diameter || 1.75;
    const cancelAction = `closeMeasureDialog(${id})`;
    const formHtml = `<div class="settings-form" style="margin:6px 0;padding:6px;border-top:1px solid var(--border-color)">
      <div class="flex gap-sm" style="align-items:center;margin-bottom:4px">
        <label style="font-size:0.7rem;cursor:pointer"><input type="radio" name="measure-mode-${id}" value="scale" checked onchange="document.getElementById('measure-scale-${id}').style.display='';document.getElementById('measure-length-${id}').style.display='none'"> ${t('filament.gross_weight')}</label>
        <label style="font-size:0.7rem;cursor:pointer"><input type="radio" name="measure-mode-${id}" value="length" onchange="document.getElementById('measure-scale-${id}').style.display='none';document.getElementById('measure-length-${id}').style.display=''"> ${t('filament.use_by_length')}</label>
      </div>
      <div id="measure-scale-${id}">
        <div class="flex gap-sm" style="align-items:flex-end">
          <div class="form-group" style="width:120px">
            <label class="form-label">${t('filament.gross_weight')}</label>
            <input class="form-input" id="measure-weight-${id}" type="number" placeholder="${t('filament.gross_weight_placeholder')}">
          </div>
          <button class="form-btn form-btn-sm" data-ripple onclick="submitMeasure(${id})">${t('filament.measure')}</button>
          <button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="${cancelAction}">${t('settings.cancel')}</button>
        </div>
        <div class="measure-quick-btns">${quickBtns}</div>
      </div>
      <div id="measure-length-${id}" style="display:none">
        <div class="flex gap-sm" style="align-items:flex-end">
          <div class="form-group" style="width:120px">
            <label class="form-label">${t('filament.meters')}</label>
            <input class="form-input" id="measure-length-val-${id}" type="number" step="0.1" placeholder="${t('filament.enter_meters')}">
          </div>
          <button class="form-btn form-btn-sm" data-ripple onclick="submitMeasureLength(${id},${density},${diameter})">${t('filament.measure')}</button>
          <button class="form-btn form-btn-sm" data-ripple style="background:transparent;color:var(--text-muted)" onclick="${cancelAction}">${t('settings.cancel')}</button>
        </div>
      </div>
    </div>`;
    const container = document.getElementById(`spool-edit-${id}`);
    if (container) {
      container.style.display = '';
      container.innerHTML = formHtml;
      return;
    }
    // Fallback: open in modal overlay (visual card view)
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.id = `measure-modal-${id}`;
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:500px">
      <div class="inv-modal-header">
        <span>${t('filament.measure_weight')} — ${esc(window._cleanProfileName(spool))}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px">${formHtml}</div>
    </div>`;
    document.body.appendChild(overlay);
  };

  window.closeMeasureDialog = function(id) {
    const c = document.getElementById(`spool-edit-${id}`);
    if (c) { c.style.display = 'none'; return; }
    const m = document.getElementById(`measure-modal-${id}`);
    if (m) m.remove();
  };

  window.submitMeasure = async function(id) {
    const grossWeight = parseFloat(document.getElementById(`measure-weight-${id}`)?.value);
    if (!grossWeight || grossWeight <= 0) return;
    const res = await fetch(`/api/inventory/spools/${id}/measure`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gross_weight_g: grossWeight })
    });
    if (res.ok) { closeMeasureDialog(id); loadFilament(); }
    else { const err = await res.json().catch(() => ({})); showToast(err.error || t('filament.measure_failed'), 'error'); }
  };

  window.submitMeasureLength = async function(id, density, diameter) {
    const meters = parseFloat(document.getElementById(`measure-length-val-${id}`)?.value);
    if (!meters || meters <= 0) return;
    const radiusCm = (diameter / 10) / 2;
    const lengthCm = meters * 100;
    const volumeCm3 = lengthCm * Math.PI * radiusCm * radiusCm;
    const grams = Math.round(volumeCm3 * density * 100) / 100;
    const res = await fetch(`/api/inventory/spools/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ used_weight_g_add: grams })
    });
    if (res.ok) { closeMeasureDialog(id); loadFilament(); }
    else showToast(t('filament.measure_failed'), 'error');
  };

  // ═══ Expose manage sub-content renderer for cross-file use ═══
  window._renderManageSubContent = _renderManageSubContent;

  // ═══ Code 128 Barcode Generator ═══

})();
