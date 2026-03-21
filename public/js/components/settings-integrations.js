// Settings — Integrations: e-commerce (Shopify/WooCommerce), timelapse, hub/kiosk, AI detection, printer groups, custom fields, brand defaults
(function() {

  async function loadTimelapseSettings() {
    try {
      const res = await fetch('/api/inventory/settings/timelapse_enabled');
      const data = await res.json();
      const cb = document.getElementById('timelapse-enabled');
      if (cb) cb.checked = data.value === '1' || data.value === 'true';
    } catch {}

    // Load recordings list
    try {
      const res = await fetch('/api/timelapse');
      const recs = await res.json();
      const el = document.getElementById('timelapse-list');
      if (!el || !recs.length) return;
      el.innerHTML = '<div style="font-size:0.85rem;font-weight:600;margin-bottom:0.3rem">' + t('settings.timelapse_recordings') + '</div>' +
        recs.slice(0, 10).map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.3rem 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.8rem">
          <div>
            <span>${window._settingsEsc(r.filename || 'Timelapse')}</span>
            <span class="text-muted" style="margin-left:0.3rem">${r.status}</span>
            ${r.file_size_bytes ? '<span class="text-muted" style="margin-left:0.3rem">' + (r.file_size_bytes / 1024 / 1024).toFixed(1) + 'MB</span>' : ''}
          </div>
          <div style="display:flex;gap:0.3rem">
            ${r.status === 'complete' ? `<a class="form-btn form-btn-sm" data-ripple data-tooltip="${t('common.view')}" href="/api/timelapse/${r.id}/video" target="_blank">${t('common.view')}</a>` : ''}
            <button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('common.delete')}" onclick="deleteTimelapse(${r.id})">${t('common.delete')}</button>
          </div>
        </div>`).join('');
    } catch {}
  }

  window.toggleTimelapse = async function(enabled) {
    try {
      await fetch('/api/inventory/settings/timelapse_enabled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: enabled ? '1' : '0' })
      });
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteTimelapse = async function(id) {
    return confirmAction(t('settings.timelapse_delete_confirm'), async () => {
      try {
        await fetch(`/api/timelapse/${id}`, { method: 'DELETE' });
        loadTimelapseSettings();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  // ---- Hub/Kiosk Settings ----
  async function loadHubSettings() {
    try {
      const res = await fetch('/api/hub/settings');
      const data = await res.json();
      const hubCb = document.getElementById('hub-mode');
      const kioskCb = document.getElementById('kiosk-mode');
      if (hubCb) hubCb.checked = data.hub_mode;
      if (kioskCb) kioskCb.checked = data.kiosk_mode;
    } catch {}
  }

  window.toggleHubMode = async function(enabled) {
    await fetch('/api/hub/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hub_mode: enabled }) });
  };
  window.toggleKioskMode = async function(enabled) {
    await fetch('/api/hub/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kiosk_mode: enabled }) });
  };

  // ---- AI Detection Settings ----
  async function loadAiDetectionSettings() {
    try {
      const enabledRes = await fetch('/api/inventory/settings/ai_detection_enabled');
      const enabledData = await enabledRes.json();
      const sensRes = await fetch('/api/inventory/settings/ai_detection_sensitivity');
      const sensData = await sensRes.json();
      const cb = document.getElementById('ai-detection-enabled');
      const sel = document.getElementById('ai-detection-sensitivity');
      if (cb) cb.checked = enabledData.value === '1';
      if (sel) sel.value = sensData.value || 'medium';
      // Load recent detections
      const dRes = await fetch('/api/failure-detections?limit=5');
      const detections = await dRes.json();
      const list = document.getElementById('ai-detection-list');
      if (list && Array.isArray(detections) && detections.length > 0) {
        list.innerHTML = detections.map(d => `<div style="font-size:0.8rem;padding:0.25rem 0;border-bottom:1px solid var(--border)">${window._settingsEsc(d.detection_type)} (${Math.round((d.confidence || 0) * 100)}%) - ${d.detected_at}</div>`).join('');
      } else if (list) {
        list.innerHTML = '<div class="text-muted" style="font-size:0.8rem">' + t('settings.no_detections') + '</div>';
      }
    } catch {}
  }

  window.toggleAiDetection = async function(enabled) {
    await fetch('/api/inventory/settings/ai_detection_enabled', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: enabled ? '1' : '0' }) });
  };
  window.updateAiSensitivity = async function(value) {
    await fetch('/api/inventory/settings/ai_detection_sensitivity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value }) });
  };

  // ---- Printer Groups Settings ----
  async function loadPrinterGroupsSettings() {
    try {
      const res = await fetch('/api/printer-groups');
      const groups = await res.json();
      const section = document.getElementById('printer-groups-section');
      if (!section) return;
      if (!Array.isArray(groups) || groups.length === 0) {
        section.innerHTML = '<div class="text-muted" style="font-size:0.8rem">' + t('settings.no_printer_groups') + '</div>';
        return;
      }
      section.innerHTML = groups.map(g => `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.25rem 0;border-bottom:1px solid var(--border)"><span style="font-size:0.85rem">${window._settingsEsc(g.name)} ${g.color ? '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:' + window._settingsEsc(g.color) + '"></span>' : ''} <span class="text-muted">(${(g.members || []).length} printers, stagger: ${g.stagger_delay_s}s)</span></span><button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('common.delete')}" onclick="deletePrinterGroupSetting(${g.id})" style="font-size:0.75rem">${t('common.delete')}</button></div>`).join('');
    } catch {}
  }

  window.showPrinterGroupEditor = function(editId = null) {
    let name = '', desc = '', color = '#00AE42', delay = 30, maxConc = 0;
    if (editId) {
      // Pre-fill for edit (find from DOM data)
    }
    const html = `<div class="modal-overlay" id="pg-editor-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:420px">
        <div class="modal-header"><h3>${t('settings.printer_groups_add')}</h3>
          <button class="modal-close" onclick="document.getElementById('pg-editor-modal').remove()">&times;</button></div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:0.6rem">
          <div class="form-group">
            <label class="form-label">${t('settings.pg_name')}</label>
            <input class="form-input" id="pg-name" value="${name}" placeholder="${t('settings.pg_name_ph')}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.pg_description')}</label>
            <input class="form-input" id="pg-desc" value="${desc}" placeholder="${t('settings.pg_desc_ph')}">
          </div>
          <div style="display:flex;gap:0.75rem">
            <div class="form-group" style="flex:1">
              <label class="form-label">${t('settings.pg_color')}</label>
              <input type="color" id="pg-color" value="${color}" style="width:100%;height:32px;border:none;cursor:pointer">
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">${t('settings.pg_stagger')}</label>
              <input class="form-input" type="number" id="pg-delay" value="${delay}" min="0" max="600" placeholder="30">
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">${t('settings.pg_max_concurrent')}</label>
              <input class="form-input" type="number" id="pg-max" value="${maxConc}" min="0" placeholder="0 = unlimited">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="form-btn form-btn-secondary" data-ripple onclick="document.getElementById('pg-editor-modal').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple onclick="savePrinterGroup()">${t('common.save')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window.savePrinterGroup = async function() {
    const name = document.getElementById('pg-name')?.value.trim();
    if (!name) { showToast(t('settings.pg_name_required'), 'warning'); return; }
    const body = {
      name,
      description: document.getElementById('pg-desc')?.value.trim() || null,
      color: document.getElementById('pg-color')?.value || null,
      stagger_delay_s: parseInt(document.getElementById('pg-delay')?.value) || 0,
      max_concurrent: parseInt(document.getElementById('pg-max')?.value) || 0
    };
    try {
      await fetch('/api/printer-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      document.getElementById('pg-editor-modal')?.remove();
      loadPrinterGroupsSettings();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deletePrinterGroupSetting = async function(id) {
    return confirmAction(t('settings.pg_delete_confirm'), async () => {
      await fetch(`/api/printer-groups/${id}`, { method: 'DELETE' });
      loadPrinterGroupsSettings();
    }, { danger: true });
  };

  // ---- Custom Fields Settings ----
  async function loadCustomFieldsSettings() {
    try {
      const res = await fetch('/api/custom-fields');
      const fields = await res.json();
      const section = document.getElementById('custom-fields-section');
      if (!section) return;
      if (!Array.isArray(fields) || fields.length === 0) {
        section.innerHTML = '<div class="text-muted" style="font-size:0.8rem">' + t('settings.no_custom_fields') + '</div>';
        return;
      }
      section.innerHTML = fields.map(f => `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.25rem 0;border-bottom:1px solid var(--border)"><span style="font-size:0.85rem">${window._settingsEsc(f.field_label)} <span class="text-muted">(${window._settingsEsc(f.entity_type)} / ${window._settingsEsc(f.field_type)})</span></span><button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('common.delete')}" onclick="deleteCustomFieldSetting(${f.id})" style="font-size:0.75rem">${t('common.delete')}</button></div>`).join('');
    } catch {}
  }

  window.showCustomFieldEditor = function() {
    const entityOpts = ['spool','printer','profile','project'].map(e =>
      `<option value="${e}">${e.charAt(0).toUpperCase() + e.slice(1)}</option>`).join('');
    const typeOpts = ['text','number','select','checkbox','date','url','email','color','textarea','rating'].map(t2 =>
      `<option value="${t2}">${t2.charAt(0).toUpperCase() + t2.slice(1)}</option>`).join('');
    const html = `<div class="modal-overlay" id="cf-editor-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:420px">
        <div class="modal-header"><h3>${t('settings.custom_fields_add')}</h3>
          <button class="modal-close" onclick="document.getElementById('cf-editor-modal').remove()">&times;</button></div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:0.6rem">
          <div class="form-group">
            <label class="form-label">${t('settings.cf_entity_type')}</label>
            <select class="form-input" id="cf-entity">${entityOpts}</select>
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.cf_field_name')}</label>
            <input class="form-input" id="cf-name" placeholder="${t('settings.cf_field_name_ph')}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.cf_field_label')}</label>
            <input class="form-input" id="cf-label" placeholder="${t('settings.cf_field_label_ph')}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.cf_field_type')}</label>
            <select class="form-input" id="cf-type">${typeOpts}</select>
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.cf_default_value')}</label>
            <input class="form-input" id="cf-default" placeholder="${t('settings.cf_default_ph')}">
          </div>
          <label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem">
            <input type="checkbox" id="cf-required">
            <span>${t('settings.cf_required')}</span>
          </label>
        </div>
        <div class="modal-footer">
          <button class="form-btn form-btn-secondary" data-ripple onclick="document.getElementById('cf-editor-modal').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple onclick="saveCustomField()">${t('common.save')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window.saveCustomField = async function() {
    const field_name = document.getElementById('cf-name')?.value.trim();
    const field_label = document.getElementById('cf-label')?.value.trim();
    if (!field_name || !field_label) { showToast(t('settings.cf_name_required'), 'warning'); return; }
    const body = {
      entity_type: document.getElementById('cf-entity')?.value || 'spool',
      field_name,
      field_label,
      field_type: document.getElementById('cf-type')?.value || 'text',
      default_value: document.getElementById('cf-default')?.value || null,
      required: document.getElementById('cf-required')?.checked ? 1 : 0
    };
    try {
      await fetch('/api/custom-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      document.getElementById('cf-editor-modal')?.remove();
      loadCustomFieldsSettings();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteCustomFieldSetting = async function(id) {
    return confirmAction(t('settings.cf_delete_confirm'), async () => {
      await fetch(`/api/custom-fields/${id}`, { method: 'DELETE' });
      loadCustomFieldsSettings();
    }, { danger: true });
  };

  // ---- Brand Defaults Settings ----
  async function loadBrandDefaultsSettings() {
    try {
      const res = await fetch('/api/brand-defaults');
      const defaults = await res.json();
      const section = document.getElementById('brand-defaults-section');
      if (!section) return;
      if (!Array.isArray(defaults) || defaults.length === 0) {
        section.innerHTML = '<div class="text-muted" style="font-size:0.8rem">' + t('settings.no_brand_defaults') + '</div>';
        return;
      }
      section.innerHTML = defaults.map(d => `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.25rem 0;border-bottom:1px solid var(--border)"><span style="font-size:0.85rem">${window._settingsEsc(d.manufacturer)} ${d.material ? '(' + window._settingsEsc(d.material) + ')' : ''} <span class="text-muted">${d.default_extruder_temp ? d.default_extruder_temp + '°C' : ''}</span></span><button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('common.delete')}" onclick="deleteBrandDefaultSetting(${d.id})" style="font-size:0.75rem">${t('common.delete')}</button></div>`).join('');
    } catch {}
  }

  window.showBrandDefaultEditor = function() {
    const html = `<div class="modal-overlay" id="bd-editor-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:420px">
        <div class="modal-header"><h3>${t('settings.brand_defaults_add')}</h3>
          <button class="modal-close" onclick="document.getElementById('bd-editor-modal').remove()">&times;</button></div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:0.6rem">
          <div class="form-group">
            <label class="form-label">${t('settings.bd_manufacturer')}</label>
            <input class="form-input" id="bd-manufacturer" placeholder="${t('settings.bd_manufacturer_ph')}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.bd_material')}</label>
            <input class="form-input" id="bd-material" placeholder="${t('settings.bd_material_ph')}">
          </div>
          <div style="display:flex;gap:0.75rem">
            <div class="form-group" style="flex:1">
              <label class="form-label">${t('settings.bd_nozzle_temp')}</label>
              <input class="form-input" type="number" id="bd-nozzle-temp" placeholder="200" min="0" max="400">
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">${t('settings.bd_bed_temp')}</label>
              <input class="form-input" type="number" id="bd-bed-temp" placeholder="60" min="0" max="150">
            </div>
          </div>
          <div style="display:flex;gap:0.75rem">
            <div class="form-group" style="flex:1">
              <label class="form-label">${t('settings.bd_diameter')}</label>
              <input class="form-input" type="number" id="bd-diameter" value="1.75" step="0.05" min="1" max="3">
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">${t('settings.bd_net_weight')}</label>
              <input class="form-input" type="number" id="bd-weight" placeholder="1000" min="0">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="form-btn form-btn-secondary" data-ripple onclick="document.getElementById('bd-editor-modal').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple onclick="saveBrandDefault()">${t('common.save')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window.saveBrandDefault = async function() {
    const manufacturer = document.getElementById('bd-manufacturer')?.value.trim();
    if (!manufacturer) { showToast(t('settings.bd_manufacturer_required'), 'warning'); return; }
    const body = {
      manufacturer,
      material: document.getElementById('bd-material')?.value.trim() || null,
      default_extruder_temp: parseInt(document.getElementById('bd-nozzle-temp')?.value) || null,
      default_bed_temp: parseInt(document.getElementById('bd-bed-temp')?.value) || null,
      default_diameter: parseFloat(document.getElementById('bd-diameter')?.value) || 1.75,
      default_net_weight: parseInt(document.getElementById('bd-weight')?.value) || null
    };
    try {
      await fetch('/api/brand-defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      document.getElementById('bd-editor-modal')?.remove();
      loadBrandDefaultsSettings();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteBrandDefaultSetting = async function(id) {
    return confirmAction(t('settings.bd_delete_confirm'), async () => {
      await fetch(`/api/brand-defaults/${id}`, { method: 'DELETE' });
      loadBrandDefaultsSettings();
    }, { danger: true });
  };


})();
