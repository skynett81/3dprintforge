// Filament Inventory — Bulk operations: select all, bulk edit/tag/dry/labels/export, merge spools, profile/vendor multi-select
(function() {

  // ═══ Bulk Operations ═══
  // Note: selectedSpools, selectedProfiles, selectedVendors are declared in filament-tracker.js
  // and accessed here via window._fs.selectedSpools / .selectedProfiles / .selectedVendors

  window.toggleSpoolSelect = function(id, el) {
    if (window._fs.selectedSpools.has(id)) {
      window._fs.selectedSpools.delete(id);
      el.closest('.filament-card')?.classList.remove('filament-card-selected');
    } else {
      window._fs.selectedSpools.add(id);
      el.closest('.filament-card')?.classList.add('filament-card-selected');
    }
    _updateBulkBar();
    _updateSelectAllCheckbox();
  };

  window._bulkSelectAll = function(checked) {
    const cards = document.querySelectorAll('.inv-spool-card[data-spool-id]');
    if (checked) {
      cards.forEach(c => {
        const id = parseInt(c.dataset.spoolId);
        window._fs.selectedSpools.add(id);
        c.classList.add('filament-card-selected');
        const cb = c.querySelector('.fil-bulk-check');
        if (cb) cb.checked = true;
      });
    } else {
      cards.forEach(c => {
        const id = parseInt(c.dataset.spoolId);
        window._fs.selectedSpools.delete(id);
        c.classList.remove('filament-card-selected');
        const cb = c.querySelector('.fil-bulk-check');
        if (cb) cb.checked = false;
      });
    }
    _updateBulkBar();
  };

  function _updateSelectAllCheckbox() {
    const cb = document.getElementById('bulk-select-all-cb');
    if (!cb) return;
    const cards = document.querySelectorAll('.inv-spool-card[data-spool-id]');
    const total = cards.length;
    const selected = window._fs.selectedSpools.size;
    cb.checked = total > 0 && selected >= total;
    cb.indeterminate = selected > 0 && selected < total;
  }

  function _updateBulkBar() {
    let bar = document.getElementById('bulk-action-bar');
    if (window._fs.selectedSpools.size === 0) {
      if (bar) bar.remove();
      return;
    }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'bulk-action-bar';
      bar.className = 'fil-bulk-bar';
      document.body.appendChild(bar);
    }
    const canWrite = !window._can || window._can('filament');
    bar.innerHTML = `<span>${window._fs.selectedSpools.size} ${t('filament.bulk_selected')}</span>
      <div class="fil-bulk-actions">
        ${canWrite ? `<button class="form-btn form-btn-sm" data-ripple onclick="showBulkEditDialog()">${t('filament.bulk_edit')}</button>` : ''}
        ${canWrite ? `<button class="form-btn form-btn-sm" data-ripple onclick="showBulkTagDialog()">${t('filament.bulk_tag')}</button>` : ''}
        ${canWrite ? `<button class="form-btn form-btn-sm" data-ripple onclick="showBulkDryDialog()">${t('filament.bulk_dry')}</button>` : ''}
        ${canWrite && window._fs.selectedSpools.size >= 2 ? `<button class="form-btn form-btn-sm" data-ripple onclick="window._showMergeDialog()">${t('filament.merge')}</button>` : ''}
        <button class="form-btn form-btn-sm" data-ripple onclick="bulkLabels()">${t('filament.bulk_labels')}</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="bulkExport()">${t('filament.bulk_export')}</button>
        ${canWrite ? `<button class="form-btn form-btn-sm" data-ripple onclick="bulkAction('relocate')">${t('filament.bulk_relocate')}</button>` : ''}
        ${canWrite ? `<button class="form-btn form-btn-sm" data-ripple onclick="bulkAction('archive')">${t('filament.archive')}</button>` : ''}
        ${canWrite ? `<button class="form-btn form-btn-sm" data-ripple style="color:var(--accent-red)" onclick="bulkAction('delete')">${t('settings.delete')}</button>` : ''}
        <button class="form-btn form-btn-sm" data-ripple onclick="clearBulkSelection()">${t('common.cancel')}</button>
      </div>`;
  }

  window.clearBulkSelection = function() {
    window._fs.selectedSpools.clear();
    document.querySelectorAll('.filament-card-selected').forEach(el => el.classList.remove('filament-card-selected'));
    document.querySelectorAll('.fil-bulk-check').forEach(cb => cb.checked = false);
    _updateBulkBar();
    _updateSelectAllCheckbox();
  };

  window.bulkAction = async function(action) {
    const ids = Array.from(window._fs.selectedSpools);
    if (ids.length === 0) return;
    let body = { action, spool_ids: ids };

    const _doBulk = async (b) => {
      if (b.action === 'relocate') {
        const loc = prompt(t('filament.bulk_relocate_prompt'));
        if (!loc) return;
        b.location = loc;
      }
      try {
        const res = await fetch('/api/inventory/spools/bulk', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(b)
        });
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed'); }
        window._fs.selectedSpools.clear();
        _updateBulkBar();
        _updateSelectAllCheckbox();
        loadFilament();
      } catch (e) { showToast(e.message, 'error'); }
    };

    if (action === 'delete') {
      return confirmAction(t('filament.bulk_delete_confirm', { count: ids.length }), () => _doBulk(body), { danger: true });
    }
    if (action === 'archive') {
      return confirmAction(t('filament.bulk_archive_confirm', { count: ids.length }), () => _doBulk(body), {});
    }
    await _doBulk(body);
  };

  // ── Bulk Edit Dialog ──
  window.showBulkEditDialog = function() {
    const n = window._fs.selectedSpools.size;
    const locs = [...new Set(window._fs.spools.map(s => s.location).filter(Boolean))].sort();
    const mats = [...new Set(window._fs.spools.map(s => s.material).filter(Boolean))].sort();
    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:420px">
        <div class="inv-modal-header"><h3>${t('filament.bulk_edit_title', { count: n })}</h3></div>
        <div class="inv-modal-body">
          <div class="bulk-edit-row"><label><input type="checkbox" id="be-cost-cb"> ${t('filament.cost_per_kg')}</label>
            <input type="number" step="0.01" class="form-input form-input-sm" id="be-cost" disabled></div>
          <div class="bulk-edit-row"><label><input type="checkbox" id="be-notes-cb"> ${t('filament.notes')}</label>
            <input type="text" class="form-input form-input-sm" id="be-notes" disabled></div>
          <div class="bulk-edit-row"><label><input type="checkbox" id="be-location-cb"> ${t('filament.location')}</label>
            <select class="form-input form-input-sm" id="be-location" disabled>
              <option value="">--</option>${locs.map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join('')}
            </select></div>
          <div class="bulk-edit-row"><label><input type="checkbox" id="be-material-cb"> ${t('filament.material')}</label>
            <select class="form-input form-input-sm" id="be-material" disabled>
              <option value="">--</option>${mats.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join('')}
            </select></div>
        </div>
        <div class="inv-modal-footer">
          <button class="form-btn" onclick="this.closest('.inv-modal-backdrop').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" onclick="window._applyBulkEdit()">${t('filament.bulk_apply', { count: n })}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    // Wire checkboxes to enable/disable inputs
    for (const key of ['cost', 'notes', 'location', 'material']) {
      document.getElementById(`be-${key}-cb`).onchange = function() {
        document.getElementById(`be-${key}`).disabled = !this.checked;
      };
    }
  };

  window._applyBulkEdit = async function() {
    const fields = {};
    if (document.getElementById('be-cost-cb').checked) fields.cost_per_kg = parseFloat(document.getElementById('be-cost').value) || 0;
    if (document.getElementById('be-notes-cb').checked) fields.notes = document.getElementById('be-notes').value;
    if (document.getElementById('be-location-cb').checked) fields.location = document.getElementById('be-location').value;
    if (document.getElementById('be-material-cb').checked) fields.material = document.getElementById('be-material').value;
    if (Object.keys(fields).length === 0) return showToast('No fields selected', 'warning');
    try {
      const res = await fetch('/api/inventory/spools/bulk', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', spool_ids: Array.from(window._fs.selectedSpools), fields })
      });
      if (!res.ok) throw new Error('Failed');
      document.querySelector('.inv-modal-backdrop')?.remove();
      clearBulkSelection();
      loadFilament();
      showToast(t('filament.bulk_edit_done'), 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ── Bulk Tag Dialog ──
  window.showBulkTagDialog = async function() {
    const n = window._fs.selectedSpools.size;
    let tags = [];
    try { const r = await fetch('/api/tags'); tags = await r.json(); } catch {}
    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:360px">
        <div class="inv-modal-header"><h3>${t('filament.bulk_tag_title', { count: n })}</h3></div>
        <div class="inv-modal-body">
          <div style="margin-bottom:8px">
            <label>${t('filament.bulk_tag_assign')}</label>
            <select class="form-input form-input-sm" id="bt-tag">
              <option value="">--</option>
              ${tags.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:8px">
            <button class="form-btn form-btn-sm form-btn-primary" onclick="window._doBulkTag('assign')">${t('filament.bulk_tag_assign_btn')}</button>
            <button class="form-btn form-btn-sm" onclick="window._doBulkTag('unassign')">${t('filament.bulk_tag_unassign_btn')}</button>
          </div>
        </div>
        <div class="inv-modal-footer">
          <button class="form-btn" onclick="this.closest('.inv-modal-backdrop').remove()">${t('common.cancel')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window._doBulkTag = async function(action) {
    const tagId = parseInt(document.getElementById('bt-tag').value);
    if (!tagId) return showToast('Select a tag', 'warning');
    try {
      const res = await fetch('/api/tags/bulk-assign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: tagId, entity_type: 'spool', entity_ids: Array.from(window._fs.selectedSpools), action })
      });
      if (!res.ok) throw new Error('Failed');
      document.querySelector('.inv-modal-backdrop')?.remove();
      loadFilament();
      showToast(action === 'assign' ? t('filament.bulk_tag_assigned') : t('filament.bulk_tag_unassigned'), 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ── Bulk Drying Dialog ──
  window.showBulkDryDialog = async function() {
    const n = window._fs.selectedSpools.size;
    let presets = [];
    try { const r = await fetch('/api/inventory/drying/presets'); presets = await r.json(); } catch {}
    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:380px">
        <div class="inv-modal-header"><h3>${t('filament.bulk_dry_title', { count: n })}</h3></div>
        <div class="inv-modal-body">
          <div class="bulk-edit-row"><label>${t('filament.drying_preset')}</label>
            <select class="form-input form-input-sm" id="bd-preset" onchange="_fillDryPreset(this.value)">
              <option value="">-- ${t('filament.manual')} --</option>
              ${presets.map(p => `<option value="${p.id}" data-temp="${p.temperature||''}" data-dur="${p.duration_minutes||''}" data-method="${p.method||'dryer_box'}">${esc(p.name)}</option>`).join('')}
            </select>
          </div>
          <div class="bulk-edit-row"><label>${t('filament.drying_temp')}</label>
            <input type="number" class="form-input form-input-sm" id="bd-temp" placeholder="50"> °C</div>
          <div class="bulk-edit-row"><label>${t('filament.drying_duration')}</label>
            <input type="number" class="form-input form-input-sm" id="bd-dur" placeholder="240"> min</div>
        </div>
        <div class="inv-modal-footer">
          <button class="form-btn" onclick="this.closest('.inv-modal-backdrop').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" onclick="window._doBulkDry()">${t('filament.start_drying')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window._fillDryPreset = function(presetId) {
    const opt = document.querySelector(`#bd-preset option[value="${presetId}"]`);
    if (opt) {
      document.getElementById('bd-temp').value = opt.dataset.temp || '';
      document.getElementById('bd-dur').value = opt.dataset.dur || '';
    }
  };

  window._doBulkDry = async function() {
    try {
      const res = await fetch('/api/inventory/spools/bulk', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_drying', spool_ids: Array.from(window._fs.selectedSpools),
          temperature: parseInt(document.getElementById('bd-temp').value) || null,
          duration_minutes: parseInt(document.getElementById('bd-dur').value) || null
        })
      });
      if (!res.ok) throw new Error('Failed');
      document.querySelector('.inv-modal-backdrop')?.remove();
      clearBulkSelection();
      loadFilament();
      showToast(t('filament.bulk_dry_started'), 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ── Bulk Labels ──
  window.bulkLabels = function() {
    const ids = Array.from(window._fs.selectedSpools);
    if (ids.length === 0) return;
    // Show format picker
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:350px">
      <div class="inv-modal-header"><span>${t('filament.print_labels')}</span><button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button></div>
      <div class="inv-modal-body">
        <p style="font-size:0.85rem;margin:0 0 8px">${ids.length} ${t('filament.bulk_selected')}</p>
        <div class="form-group"><label class="form-label">${t('filament.label_format')}</label>
          <select class="form-input" id="label-format-select">
            <option value="thermal_40x30">Thermal 40x30mm</option>
            <option value="thermal_50x30">Thermal 50x30mm</option>
            <option value="a4_grid_3x8">A4 Grid 3x8 (Avery L7159)</option>
            <option value="a4_grid_2x7">A4 Grid 2x7 (Avery L7163)</option>
          </select>
        </div>
      </div>
      <div class="inv-modal-footer">
        <button class="form-btn" data-ripple onclick="window._doPrintLabels()">${t('filament.print_label')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  };

  window._doPrintLabels = function() {
    const ids = Array.from(window._fs.selectedSpools);
    const format = document.getElementById('label-format-select')?.value || 'thermal_40x30';
    document.querySelector('.inv-modal-overlay')?.remove();
    window.open(`/print/labels?ids=${ids.join(',')}&format=${format}`, '_blank');
  };

  // ── Bulk Export ──
  window.bulkExport = async function() {
    const ids = Array.from(window._fs.selectedSpools);
    try {
      const res = await fetch('/api/inventory/spools/bulk', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export', spool_ids: ids, format: 'csv' })
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `spools-export-${ids.length}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ── Merge Spools Dialog ──
  window._showMergeDialog = function() {
    const ids = Array.from(window._fs.selectedSpools);
    if (ids.length < 2) return showToast(t('filament.merge_min'), 'error');
    const selected = window._fs.spools.filter(s => ids.includes(s.id));
    const profiles = [...new Set(selected.map(s => s.filament_profile_id))];
    const sameProfile = profiles.length === 1;

    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:500px">
        <h3>${t('filament.merge_title')}</h3>
        ${!sameProfile ? `<div class="form-help" style="color:var(--accent-orange);margin-bottom:12px">${t('filament.merge_warning_profile')}</div>` : ''}
        <p style="margin-bottom:12px">${t('filament.merge_desc')}</p>
        <div style="margin-bottom:16px">
          <label class="form-label">${t('filament.merge_target')}</label>
          <select id="merge-target" class="form-input">
            ${selected.map(s => `<option value="${s.id}">#${s.id} — ${s.profile_name || s.material || '?'} (${Math.round(s.remaining_weight_g)}g)</option>`).join('')}
          </select>
        </div>
        <div id="merge-preview" style="background:var(--card-bg);border-radius:8px;padding:12px;margin-bottom:16px"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="form-btn" onclick="this.closest('.inv-modal-backdrop').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple onclick="window._executeMerge()">${t('filament.merge_confirm')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    const sel = document.getElementById('merge-target');
    const updatePreview = () => {
      const targetId = Number(sel.value);
      const target = selected.find(s => s.id === targetId);
      const sources = selected.filter(s => s.id !== targetId);
      const totalRemaining = selected.reduce((sum, s) => sum + (s.remaining_weight_g || 0), 0);
      const totalUsed = selected.reduce((sum, s) => sum + (s.used_weight_g || 0), 0);
      const totalCost = selected.reduce((sum, s) => sum + (s.cost || 0), 0);
      document.getElementById('merge-preview').innerHTML = `
        <div style="font-weight:600;margin-bottom:8px">${t('filament.merge_preview')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;font-size:0.9em">
          <span>${t('filament.merge_keep')}:</span><span><b>#${target.id}</b> — ${target.profile_name || '?'}</span>
          <span>${t('filament.merge_absorb')}:</span><span>${sources.map(s => '#' + s.id).join(', ')}</span>
          <span>${t('filament.remaining_weight')}:</span><span>${Math.round(totalRemaining)}g</span>
          <span>${t('filament.used_weight')}:</span><span>${Math.round(totalUsed)}g</span>
          ${totalCost > 0 ? `<span>${t('filament.cost')}:</span><span>${totalCost.toFixed(2)}</span>` : ''}
        </div>
        <div style="margin-top:8px;font-size:0.85em;opacity:0.7">${t('filament.merge_source_archived')}</div>`;
    };
    sel.addEventListener('change', updatePreview);
    updatePreview();
  };

  window._executeMerge = async function() {
    const targetId = Number(document.getElementById('merge-target').value);
    const sourceIds = Array.from(window._fs.selectedSpools).filter(id => id !== targetId);
    try {
      const res = await fetch('/api/inventory/spools/merge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id: targetId, source_ids: sourceIds })
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Merge failed'); }
      document.querySelector('.inv-modal-backdrop')?.remove();
      window._fs.selectedSpools.clear();
      _updateBulkBar();
      _updateSelectAllCheckbox();
      showToast(t('filament.merge_success'), 'success');
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ── Profile multi-select ──
  window.toggleProfileSelect = function(id, el) {
    if (window._fs.selectedProfiles.has(id)) {
      window._fs.selectedProfiles.delete(id);
      el.closest('.filament-card')?.classList.remove('filament-card-selected');
    } else {
      window._fs.selectedProfiles.add(id);
      el.closest('.filament-card')?.classList.add('filament-card-selected');
    }
    _updateManageBulkBar();
  };

  window._bulkSelectAllProfiles = function(checked) {
    document.querySelectorAll('.inv-profile-card[data-profile-id]').forEach(c => {
      const id = parseInt(c.dataset.profileId);
      if (checked) { window._fs.selectedProfiles.add(id); c.classList.add('filament-card-selected'); }
      else { window._fs.selectedProfiles.delete(id); c.classList.remove('filament-card-selected'); }
      const cb = c.querySelector('.fil-profile-check');
      if (cb) cb.checked = checked;
    });
    _updateManageBulkBar();
  };

  // ── Vendor multi-select ──
  window.toggleVendorSelect = function(id, el) {
    if (window._fs.selectedVendors.has(id)) {
      window._fs.selectedVendors.delete(id);
      el.closest('tr')?.classList.remove('bulk-row-selected');
    } else {
      window._fs.selectedVendors.add(id);
      el.closest('tr')?.classList.add('bulk-row-selected');
    }
    _updateManageBulkBar();
  };

  window._bulkSelectAllVendors = function(checked) {
    document.querySelectorAll('tr[data-vendor-id]').forEach(r => {
      const id = parseInt(r.dataset.vendorId);
      if (checked) { window._fs.selectedVendors.add(id); r.classList.add('bulk-row-selected'); }
      else { window._fs.selectedVendors.delete(id); r.classList.remove('bulk-row-selected'); }
      const cb = r.querySelector('.fil-vendor-check');
      if (cb) cb.checked = checked;
    });
    _updateManageBulkBar();
  };

  function _updateManageBulkBar() {
    let bar = document.getElementById('manage-bulk-bar');
    const pCount = window._fs.selectedProfiles.size;
    const vCount = window._fs.selectedVendors.size;
    if (pCount === 0 && vCount === 0) {
      if (bar) bar.remove();
      return;
    }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'manage-bulk-bar';
      bar.className = 'fil-bulk-bar';
      document.body.appendChild(bar);
    }
    let html = '';
    if (pCount > 0) {
      html += `<span>${pCount} ${t('filament.profiles_selected')}</span>
        <div class="fil-bulk-actions">
          <button class="form-btn form-btn-sm" data-ripple onclick="showBulkEditProfilesDialog()">${t('filament.bulk_edit')}</button>
          <button class="form-btn form-btn-sm" data-ripple style="color:var(--accent-red)" onclick="bulkDeleteProfiles()">${t('settings.delete')}</button>
          <button class="form-btn form-btn-sm" data-ripple onclick="clearManageBulkSelection()">${t('common.cancel')}</button>
        </div>`;
    }
    if (vCount > 0) {
      if (pCount > 0) html += '<span style="border-left:1px solid var(--border-color);height:20px;margin:0 4px"></span>';
      html += `<span>${vCount} ${t('filament.vendors_selected')}</span>
        <div class="fil-bulk-actions">
          <button class="form-btn form-btn-sm" data-ripple style="color:var(--accent-red)" onclick="bulkDeleteVendors()">${t('settings.delete')}</button>
          <button class="form-btn form-btn-sm" data-ripple onclick="clearManageBulkSelection()">${t('common.cancel')}</button>
        </div>`;
    }
    bar.innerHTML = html;
  }

  window.clearManageBulkSelection = function() {
    window._fs.selectedProfiles.clear();
    window._fs.selectedVendors.clear();
    document.querySelectorAll('.filament-card-selected').forEach(el => el.classList.remove('filament-card-selected'));
    document.querySelectorAll('.bulk-row-selected').forEach(el => el.classList.remove('bulk-row-selected'));
    document.querySelectorAll('.fil-profile-check, .fil-vendor-check').forEach(cb => cb.checked = false);
    _updateManageBulkBar();
  };

  window.bulkDeleteProfiles = function() {
    const ids = Array.from(window._fs.selectedProfiles);
    confirmAction(t('filament.bulk_delete_profiles_confirm', { count: ids.length }), async () => {
      try {
        const res = await fetch('/api/inventory/profiles/bulk', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', profile_ids: ids })
        });
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed'); }
        window._fs.selectedProfiles.clear();
        _updateManageBulkBar();
        loadFilament();
        showToast(t('filament.bulk_profiles_deleted'), 'success');
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  window.bulkDeleteVendors = function() {
    const ids = Array.from(window._fs.selectedVendors);
    confirmAction(t('filament.bulk_delete_vendors_confirm', { count: ids.length }), async () => {
      try {
        const res = await fetch('/api/inventory/vendors/bulk', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', vendor_ids: ids })
        });
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed'); }
        window._fs.selectedVendors.clear();
        _updateManageBulkBar();
        loadFilament();
        showToast(t('filament.bulk_vendors_deleted'), 'success');
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  window.showBulkEditProfilesDialog = function() {
    const n = window._fs.selectedProfiles.size;
    const mats = [...new Set(window._fs.profiles.map(p => p.material).filter(Boolean))].sort();
    const vendors = window._fs.vendors.map(v => ({ id: v.id, name: v.name }));
    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:420px">
        <div class="inv-modal-header"><h3>${t('filament.bulk_edit_profiles_title', { count: n })}</h3></div>
        <div class="inv-modal-body">
          <div class="bulk-edit-row"><label><input type="checkbox" id="bep-material-cb"> ${t('filament.material')}</label>
            <select class="form-input form-input-sm" id="bep-material" disabled>
              <option value="">--</option>${mats.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join('')}
            </select></div>
          <div class="bulk-edit-row"><label><input type="checkbox" id="bep-vendor-cb"> ${t('filament.vendor')}</label>
            <select class="form-input form-input-sm" id="bep-vendor" disabled>
              <option value="">--</option>${vendors.map(v => `<option value="${v.id}">${esc(v.name)}</option>`).join('')}
            </select></div>
          <div class="bulk-edit-row"><label><input type="checkbox" id="bep-density-cb"> ${t('filament.density')}</label>
            <input type="number" step="0.01" class="form-input form-input-sm" id="bep-density" placeholder="1.24" disabled> g/cm³</div>
        </div>
        <div class="inv-modal-footer">
          <button class="form-btn" onclick="this.closest('.inv-modal-backdrop').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" onclick="window._applyBulkEditProfiles()">${t('filament.bulk_apply', { count: n })}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    for (const key of ['material', 'vendor', 'density']) {
      document.getElementById(`bep-${key}-cb`).onchange = function() {
        document.getElementById(`bep-${key}`).disabled = !this.checked;
      };
    }
  };

  window._applyBulkEditProfiles = async function() {
    const fields = {};
    if (document.getElementById('bep-material-cb').checked) fields.material = document.getElementById('bep-material').value;
    if (document.getElementById('bep-vendor-cb').checked) fields.vendor_id = parseInt(document.getElementById('bep-vendor').value) || null;
    if (document.getElementById('bep-density-cb').checked) fields.density = parseFloat(document.getElementById('bep-density').value) || null;
    if (Object.keys(fields).length === 0) return showToast(t('filament.bulk_no_fields'), 'warning');
    try {
      const res = await fetch('/api/inventory/profiles/bulk', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', profile_ids: Array.from(window._fs.selectedProfiles), fields })
      });
      if (!res.ok) throw new Error('Failed');
      document.querySelector('.inv-modal-backdrop')?.remove();
      clearManageBulkSelection();
      loadFilament();
      showToast(t('filament.bulk_edit_done'), 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ── Tag Management (Manage tab) ──
  window.showAddTagForm = function() {
    const container = document.getElementById('tag-form-container');
    if (!container) return;
    container.innerHTML = `<div class="inv-inline-form" style="margin-top:8px">
      <input type="text" class="form-input form-input-sm" id="tag-name" placeholder="${t('filament.tag_name')}">
      <select class="form-input form-input-sm" id="tag-category">
        <option value="custom">${t('tags.custom')}</option>
        <option value="material">${t('tags.material')}</option>
        <option value="printer">${t('tags.printer')}</option>
        <option value="nozzle">${t('tags.nozzle')}</option>
      </select>
      <input type="color" id="tag-color" value="#58a6ff" style="width:36px;height:28px;border:none;padding:0;cursor:pointer">
      <button class="form-btn form-btn-sm form-btn-primary" onclick="saveTag()">${t('filament.tag_save')}</button>
      <button class="form-btn form-btn-sm" onclick="document.getElementById('tag-form-container').innerHTML=''">${t('common.cancel')}</button>
    </div>`;
  };

  window.showEditTagForm = function(id) {
    const tag = window._fs.tags.find(t => t.id === id);
    if (!tag) return;
    const container = document.getElementById('tag-form-container');
    if (!container) return;
    container.innerHTML = `<div class="inv-inline-form" style="margin-top:8px">
      <input type="hidden" id="tag-edit-id" value="${id}">
      <input type="text" class="form-input form-input-sm" id="tag-name" value="${esc(tag.name)}">
      <select class="form-input form-input-sm" id="tag-category">
        <option value="custom" ${tag.category === 'custom' ? 'selected' : ''}>${t('tags.custom')}</option>
        <option value="material" ${tag.category === 'material' ? 'selected' : ''}>${t('tags.material')}</option>
        <option value="printer" ${tag.category === 'printer' ? 'selected' : ''}>${t('tags.printer')}</option>
        <option value="nozzle" ${tag.category === 'nozzle' ? 'selected' : ''}>${t('tags.nozzle')}</option>
      </select>
      <input type="color" id="tag-color" value="${tag.color || '#58a6ff'}" style="width:36px;height:28px;border:none;padding:0;cursor:pointer">
      <button class="form-btn form-btn-sm form-btn-primary" onclick="saveTag()">${t('filament.tag_save')}</button>
      <button class="form-btn form-btn-sm" onclick="document.getElementById('tag-form-container').innerHTML=''">${t('common.cancel')}</button>
    </div>`;
  };

  window.saveTag = async function() {
    const name = document.getElementById('tag-name').value.trim();
    if (!name) return;
    const category = document.getElementById('tag-category').value;
    const color = document.getElementById('tag-color').value;
    const editId = document.getElementById('tag-edit-id')?.value;
    try {
      const res = await fetch(editId ? `/api/tags/${editId}` : '/api/tags', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, color })
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed'); }
      loadFilament();
      showToast(t('filament.tag_saved'), 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteTagItem = function(id) {
    const tag = window._fs.tags.find(t => t.id === id);
    confirmAction(t('filament.tag_delete_confirm', { name: tag?.name || '' }), async () => {
      try {
        await fetch(`/api/tags/${id}`, { method: 'DELETE' });
        loadFilament();
        showToast(t('filament.tag_deleted'), 'success');
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  // ── Individual spool tag assignment ──
  window.showSpoolTagAssign = async function(spoolId) {
    const spool = window._fs.spools.find(s => s.id === spoolId);
    if (!spool) return;
    const spoolTags = spool.tags || [];
    const availableTags = window._fs.tags.filter(t => !spoolTags.some(st => st.id === t.id));
    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:380px">
        <div class="inv-modal-header"><h3>${t('filament.tags_title')}</h3></div>
        <div class="inv-modal-body">
          <div class="fil-tag-badges" style="margin-bottom:8px;min-height:24px">
            ${spoolTags.map(tg => `<span class="fil-tag-chip" style="--tag-color:${esc(tg.color || '#58a6ff')}">
              <span class="fil-tag-dot" style="background:${esc(tg.color || '#58a6ff')}"></span>
              ${esc(tg.name)}
              <span class="fil-tag-chip-remove" onclick="window._removeSpoolTag(${spoolId},${tg.id})">&times;</span>
            </span>`).join('')}
          </div>
          ${availableTags.length ? `<div style="display:flex;gap:6px;align-items:center">
            <select class="form-input form-input-sm" id="spool-tag-select" style="flex:1">
              ${availableTags.map(tg => `<option value="${tg.id}">${esc(tg.name)}</option>`).join('')}
            </select>
            <button class="form-btn form-btn-sm form-btn-primary" onclick="window._addSpoolTag(${spoolId})">${t('filament.tag_add_to_spool')}</button>
          </div>` : `<p class="text-muted text-sm">${t('filament.no_tags')}</p>`}
        </div>
        <div class="inv-modal-footer">
          <button class="form-btn" onclick="this.closest('.inv-modal-backdrop').remove()">${t('common.close')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window._addSpoolTag = async function(spoolId) {
    const tagId = parseInt(document.getElementById('spool-tag-select').value);
    if (!tagId) return;
    try {
      await fetch('/api/tags/assign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type: 'spool', entity_id: spoolId, tag_id: tagId })
      });
      document.querySelector('.inv-modal-backdrop')?.remove();
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window._removeSpoolTag = async function(spoolId, tagId) {
    try {
      await fetch('/api/tags/unassign', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type: 'spool', entity_id: spoolId, tag_id: tagId })
      });
      document.querySelector('.inv-modal-backdrop')?.remove();
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ═══ Swatch Labels (enhanced) ═══
  window.showSwatchLabel = async function(id) {
    const res = await fetch(`/api/inventory/spools/${id}/label?format=swatch_40x30`);
    if (!res.ok) return;
    const data = await res.json();
    const s = data.spool;
    if (!s) return;
    const color = window._filHelpers.hexToRgb(s.color_hex);
    const textColor = window._filHelpers.isLightColor(s.color_hex) ? '#333' : '#fff';
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:500px">
      <div class="inv-modal-header">
        <span>${t('filament.swatch_label')}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px">
        <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
          <label class="form-label" style="margin:0;font-size:0.75rem">${t('filament.label_format')}:</label>
          <select class="form-input" id="swatch-format" style="width:auto;font-size:0.75rem" onchange="updateSwatchPreview(${id})">
            <option value="swatch_40x30">Swatch 40x30mm</option>
            <option value="swatch_50x75">Full 50x75mm</option>
          </select>
        </div>
        <div id="swatch-preview" class="fil-swatch-preview">
          <div class="fil-swatch-card" style="background:${color};color:${textColor}">
            <div class="fil-swatch-material">${esc(s.material || '')}</div>
            <div class="fil-swatch-vendor">${esc(s.vendor_name || '')}</div>
            ${s.color_name ? `<div class="fil-swatch-color-name">${esc(s.color_name)}</div>` : ''}
            <div class="fil-swatch-temps">${s.nozzle_temp_min || ''}–${s.nozzle_temp_max || ''}°C</div>
          </div>
        </div>
      </div>
      <div class="inv-modal-footer">
        <button class="form-btn" data-ripple onclick="printSwatchLabel()">${t('filament.print_label')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay._spoolData = s;
  };

  window.updateSwatchPreview = function(id) {
    const overlay = document.querySelector('.inv-modal-overlay');
    if (!overlay || !overlay._spoolData) return;
    const s = overlay._spoolData;
    const format = document.getElementById('swatch-format')?.value || 'swatch_40x30';
    const color = window._filHelpers.hexToRgb(s.color_hex);
    const textColor = window._filHelpers.isLightColor(s.color_hex) ? '#333' : '#fff';
    const el = document.getElementById('swatch-preview');
    if (!el) return;
    if (format === 'swatch_50x75') {
      let qrHtml = '';
      if (typeof qrcode !== 'undefined') {
        const qr = qrcode(0, 'M');
        qr.addData(JSON.stringify({ id: s.id, material: s.material }));
        qr.make();
        qrHtml = qr.createSvgTag(3, 0);
      }
      el.innerHTML = `<div class="fil-swatch-card fil-swatch-full" style="background:${color};color:${textColor}">
        <div style="display:flex;gap:8px;align-items:center">
          ${qrHtml ? `<div style="background:#fff;padding:4px;border-radius:4px">${qrHtml}</div>` : ''}
          <div>
            <div class="fil-swatch-material" style="font-size:16px">${esc(s.material || '')}</div>
            <div class="fil-swatch-vendor">${esc(s.vendor_name || '')}</div>
          </div>
        </div>
        ${s.color_name ? `<div class="fil-swatch-color-name">${esc(s.color_name)}</div>` : ''}
        <div class="fil-swatch-temps">${s.nozzle_temp_min || ''}–${s.nozzle_temp_max || ''}°C / Bed: ${s.bed_temp_min || ''}–${s.bed_temp_max || ''}°C</div>
      </div>`;
    } else {
      el.innerHTML = `<div class="fil-swatch-card" style="background:${color};color:${textColor}">
        <div class="fil-swatch-material">${esc(s.material || '')}</div>
        <div class="fil-swatch-vendor">${esc(s.vendor_name || '')}</div>
        ${s.color_name ? `<div class="fil-swatch-color-name">${esc(s.color_name)}</div>` : ''}
        <div class="fil-swatch-temps">${s.nozzle_temp_min || ''}–${s.nozzle_temp_max || ''}°C</div>
      </div>`;
    }
  };

  window.printSwatchLabel = function() {
    const preview = document.getElementById('swatch-preview');
    if (!preview) return;
    const format = document.getElementById('swatch-format')?.value || 'swatch_40x30';
    const widthMm = format === 'swatch_50x75' ? 75 : 40;
    const heightMm = format === 'swatch_50x75' ? 50 : 30;
    const win = window.open('', '_blank', 'width=400,height=300');
    win.document.write(`<html><head><title>${t('filament.swatch_label')}</title><style>
      body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh}
      .fil-swatch-card{width:${widthMm}mm;height:${heightMm}mm;border-radius:4px;padding:4mm;display:flex;flex-direction:column;justify-content:center;gap:2px;font-family:sans-serif}
      .fil-swatch-card.fil-swatch-full{height:auto;min-height:${heightMm}mm}
      .fil-swatch-material{font-weight:bold;font-size:14px}
      .fil-swatch-vendor{font-size:11px;opacity:0.85}
      .fil-swatch-color-name{font-size:10px;opacity:0.7}
      .fil-swatch-temps{font-size:9px;opacity:0.6}
      svg{width:60px;height:60px}
      @media print{@page{size:${widthMm}mm ${heightMm}mm;margin:0}body{min-height:auto}}
    </style></head><body>${preview.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };


})();
