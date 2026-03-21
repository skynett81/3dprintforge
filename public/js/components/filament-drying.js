// Filament Inventory — Drying management: sessions, timers, presets, history, stats, checked-out spools
(function() {

  // ═══ Drying Management Functions ═══

  function _startDryingTimers() {
    for (const ds of window._fs.dryingSessions) {
      if (window._fs.dryingTimers[ds.id]) continue;
      window._fs.dryingTimers[ds.id] = setInterval(() => {
        const el = document.getElementById('drying-timer-' + ds.id);
        if (!el) { clearInterval(window._fs.dryingTimers[ds.id]); delete window._fs.dryingTimers[ds.id]; return; }
        const startTime = new Date(ds.started_at + 'Z').getTime();
        const endTime = startTime + ds.duration_minutes * 60 * 1000;
        const remaining = Math.max(0, endTime - Date.now());
        const remainMin = Math.floor(remaining / 60000);
        const remainH = Math.floor(remainMin / 60);
        const remainM = remainMin % 60;
        el.textContent = remaining <= 0 ? 'Done!' : `${remainH}h ${String(remainM).padStart(2, '0')}m`;
        if (remaining <= 0) el.style.color = 'var(--accent-green, #00e676)';
      }, 5000);
    }
  }

  // ── Drying dashboard sub-tab rendering ──
  async function _loadDryingStats() {
    try {
      const res = await fetch('/api/inventory/drying/sessions?active=0&limit=200');
      window._fs.dryingHistory = await res.json();
      const totalEl = document.getElementById('drying-stat-total');
      const humidEl = document.getElementById('drying-stat-humidity');
      if (totalEl) totalEl.textContent = window._fs.dryingHistory.length;
      if (humidEl) {
        const withHumidity = window._fs.dryingHistory.filter(s => s.humidity_before != null && s.humidity_after != null);
        if (withHumidity.length > 0) {
          const avg = withHumidity.reduce((sum, s) => sum + (s.humidity_before - s.humidity_after), 0) / withHumidity.length;
          humidEl.textContent = avg.toFixed(1) + '%';
        } else {
          humidEl.textContent = '-';
        }
      }
    } catch { /* ignore */ }
  }

  window._switchDryingSubTab = function(tab) {
    window._fs.dryingSubTab = tab;
    document.querySelectorAll('.drying-sub-tab').forEach(b => b.classList.toggle('active', b.textContent.trim().startsWith(
      tab === 'active' ? t('filament.drying_sub_active') : tab === 'history' ? t('filament.drying_sub_history') : t('filament.drying_sub_presets')
    )));
    _renderDryingSubContent();
  };

  function _renderDryingSubContent() {
    const el = document.getElementById('drying-sub-content');
    if (!el) return;
    if (window._fs.dryingSubTab === 'active') _renderDryingActive(el);
    else if (window._fs.dryingSubTab === 'history') _renderDryingHistory(el);
    else if (window._fs.dryingSubTab === 'presets') _renderDryingPresets(el);
  }

  function _renderDryingActive(el) {
    if (!window._fs.dryingSessions || window._fs.dryingSessions.length === 0) {
      el.innerHTML = `<p class="text-muted" style="font-size:0.8rem;padding:8px 0">${t('filament.drying_no_active')}</p>`;
      return;
    }
    let h = '';
    for (const ds of window._fs.dryingSessions) {
      const startTime = new Date(ds.started_at + 'Z').getTime();
      const endTime = startTime + ds.duration_minutes * 60 * 1000;
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const remaining = Math.max(0, endTime - now);
      const remainMin = Math.floor(remaining / 60000);
      const remainH = Math.floor(remainMin / 60);
      const remainM = remainMin % 60;
      const pct = Math.min(100, Math.round((elapsed / (ds.duration_minutes * 60000)) * 100));
      const colorDot = ds.color_hex ? (typeof miniSpool === 'function' ? miniSpool('#' + ds.color_hex, 14) : `<span class="fil-color-dot" style="background:#${ds.color_hex}"></span>`) : '';
      const methodLabel = t('filament.drying_method_' + (ds.method || 'dryer_box'));
      h += `<div class="fil-drying-card active" data-drying-id="${ds.id}">
        ${colorDot}
        <div class="fil-drying-info">
          <div class="label">${esc(ds.profile_name || '?')} ${ds.vendor_name ? '(' + esc(ds.vendor_name) + ')' : ''}</div>
          <div class="meta">${esc(ds.material || '')} · ${methodLabel} · ${ds.temperature ? ds.temperature + '°C' : ''}</div>
        </div>
        <div class="fil-drying-timer" id="drying-timer-${ds.id}">${remainH}h ${String(remainM).padStart(2, '0')}m</div>
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
          <div class="filament-bar" style="width:80px;height:6px"><div class="filament-bar-fill" style="width:${pct}%;background:var(--accent-orange,#f0883e)"></div></div>
          <button class="form-btn form-btn-sm" data-ripple onclick="completeDryingItem(${ds.id})">${t('filament.drying_complete')}</button>
        </div>
      </div>`;
    }
    el.innerHTML = h;
    _startDryingTimers();
  }

  function _renderDryingHistory(el) {
    // Filter bar
    const materials = [...new Set(window._fs.dryingHistory.map(s => s.material).filter(Boolean))].sort();
    const methods = [...new Set(window._fs.dryingHistory.map(s => s.method).filter(Boolean))].sort();
    let h = `<div class="inv-filter-bar" style="margin-bottom:10px">
      <select class="form-input form-input-sm" onchange="window._dryFilterMaterial(this.value)" style="max-width:150px">
        <option value="">${t('filament.drying_filter_material')}</option>
        ${materials.map(m => `<option value="${m}" ${m === window._fs.dryHistoryFilter.material ? 'selected' : ''}>${m}</option>`).join('')}
      </select>
      <select class="form-input form-input-sm" onchange="window._dryFilterMethod(this.value)" style="max-width:150px">
        <option value="">${t('filament.drying_filter_method')}</option>
        ${methods.map(m => `<option value="${m}" ${m === window._fs.dryHistoryFilter.method ? 'selected' : ''}>${t('filament.drying_method_' + m)}</option>`).join('')}
      </select>
      <select class="form-input form-input-sm" onchange="window._drySort(this.value)" style="max-width:150px">
        <option value="date_desc" ${window._fs.dryHistorySort === 'date_desc' ? 'selected' : ''}>${t('filament.drying_sort_newest')}</option>
        <option value="date_asc" ${window._fs.dryHistorySort === 'date_asc' ? 'selected' : ''}>${t('filament.drying_sort_oldest')}</option>
      </select>
    </div>`;

    // Filter + sort
    let filtered = window._fs.dryingHistory.slice();
    if (window._fs.dryHistoryFilter.material) filtered = filtered.filter(s => s.material === window._fs.dryHistoryFilter.material);
    if (window._fs.dryHistoryFilter.method) filtered = filtered.filter(s => s.method === window._fs.dryHistoryFilter.method);
    if (window._fs.dryHistorySort === 'date_asc') filtered.reverse();

    if (filtered.length === 0) {
      h += `<p class="text-muted text-sm">${t('filament.drying_no_history')}</p>`;
      el.innerHTML = h;
      return;
    }

    h += `<table class="fil-drying-presets-table"><thead><tr>
      <th>${t('common.date')}</th>
      <th>${t('filament.profile_name')}</th>
      <th>${t('filament.filter_material')}</th>
      <th>${t('filament.drying_method')}</th>
      <th>${t('filament.drying_temp')}</th>
      <th>${t('filament.drying_duration')}</th>
      <th>${t('filament.drying_humidity_before')}</th>
      <th>${t('filament.drying_humidity_after')}</th>
      <th></th>
    </tr></thead><tbody>`;
    for (const s of filtered) {
      const date = s.completed_at ? new Date(s.completed_at + 'Z').toLocaleDateString() : new Date(s.started_at + 'Z').toLocaleDateString();
      const methodLabel = t('filament.drying_method_' + (s.method || 'dryer_box'));
      h += `<tr>
        <td>${date}</td>
        <td>${esc(s.profile_name || '?')}</td>
        <td>${esc(s.material || '')}</td>
        <td>${methodLabel}</td>
        <td>${s.temperature ? s.temperature + '°C' : '-'}</td>
        <td>${s.duration_minutes} min</td>
        <td>${s.humidity_before != null ? s.humidity_before + '%' : '-'}</td>
        <td>${s.humidity_after != null ? s.humidity_after + '%' : '-'}</td>
        <td><button class="filament-delete-btn" style="opacity:1" onclick="deleteDryingItem(${s.id})" data-tooltip="${t('settings.delete')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button></td>
      </tr>`;
    }
    h += '</tbody></table>';
    el.innerHTML = h;
  }

  function _renderDryingPresets(el) {
    let h = `<div style="display:flex;justify-content:flex-end;margin-bottom:8px">
      <button class="form-btn form-btn-sm" data-ripple onclick="showAddDryingPresetForm()">${t('filament.drying_preset_add')}</button>
    </div>`;
    h += `<div id="drying-presets-form" style="display:none"></div>`;
    if (!window._fs.dryingPresets || window._fs.dryingPresets.length === 0) {
      h += `<p class="text-muted" style="font-size:0.8rem;padding:8px 0">No presets</p>`;
      el.innerHTML = h;
      return;
    }
    h += `<table class="fil-drying-presets-table"><thead><tr>
      <th>${t('filament.filter_material')}</th>
      <th>${t('filament.drying_temp')}</th>
      <th>${t('filament.drying_duration')}</th>
      <th>${t('filament.drying_max_days')}</th>
      <th></th>
    </tr></thead><tbody>`;
    for (const p of window._fs.dryingPresets) {
      h += `<tr>
        <td><strong>${esc(p.material)}</strong></td>
        <td>${p.temperature}°C</td>
        <td>${p.duration_minutes} min (${(p.duration_minutes / 60).toFixed(1)}h)</td>
        <td>${p.max_days_without_drying} d</td>
        <td style="text-align:right">
          <button class="filament-edit-btn" style="opacity:1" onclick="editDryingPreset('${esc(p.material)}')" title="${t('settings.edit')}" data-tooltip="${t('settings.edit')}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="filament-delete-btn" style="opacity:1" onclick="deleteDryingPresetItem('${esc(p.material)}')" title="${t('settings.delete')}" data-tooltip="${t('settings.delete')}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </td>
      </tr>`;
    }
    h += '</tbody></table>';
    el.innerHTML = h;
  }

  window._dryFilterMaterial = function(v) { window._fs.dryHistoryFilter.material = v; _renderDryingSubContent(); };
  window._dryFilterMethod = function(v) { window._fs.dryHistoryFilter.method = v; _renderDryingSubContent(); };
  window._drySort = function(v) { window._fs.dryHistorySort = v; _renderDryingSubContent(); };

  window._dryingQuickStart = function() {
    let spoolOpts = `<option value="">${t('filament.drying_select_spool')}</option>`;
    for (const s of window._fs.spools) {
      const name = s.profile_name || s.material || `Spool #${s.id}`;
      const vendor = s.vendor_name ? ` (${s.vendor_name})` : '';
      spoolOpts += `<option value="${s.id}" data-material="${esc(s.material || '')}">${esc(name)}${esc(vendor)}</option>`;
    }
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:440px">
      <div class="inv-modal-header">
        <span>${t('filament.drying_quick_start')}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div class="inv-modal-body">
        <div class="form-group"><label class="form-label">${t('filament.drying_select_spool')}</label>
          <select class="form-input" id="qs-dry-spool" onchange="window._qsDrySpoolChanged()">${spoolOpts}</select>
        </div>
        <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:8px">
          <label class="form-label">${t('filament.drying_temp')}
            <input class="form-input form-input-sm" type="number" id="qs-dry-temp" value="50" min="30" max="120">
          </label>
          <label class="form-label">${t('filament.drying_duration')}
            <input class="form-input form-input-sm" type="number" id="qs-dry-duration" value="240" min="30" max="1440">
          </label>
          <label class="form-label">${t('filament.drying_method')}
            <select class="form-input form-input-sm" id="qs-dry-method">
              <option value="dryer_box">${t('filament.drying_method_dryer_box')}</option>
              <option value="ams_drying">${t('filament.drying_method_ams')}</option>
              <option value="oven">${t('filament.drying_method_oven')}</option>
              <option value="other">${t('filament.drying_method_other')}</option>
            </select>
          </label>
          <label class="form-label">${t('filament.drying_humidity_before')}
            <input class="form-input form-input-sm" type="number" id="qs-dry-humidity" step="0.1" min="0" max="100" placeholder="Optional">
          </label>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="form-btn" data-ripple onclick="window._qsDrySubmit()">${t('filament.drying_quick_start')}</button>
          <button class="form-btn form-btn-sm" data-ripple onclick="this.closest('.inv-modal-overlay').remove()">${t('common.cancel')}</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  };

  window._qsDrySpoolChanged = function() {
    const select = document.getElementById('qs-dry-spool');
    if (!select?.value) return;
    const spool = window._fs.spools.find(s => s.id === parseInt(select.value));
    if (!spool) return;
    const preset = window._fs.dryingPresets.find(p => p.material === spool.material);
    if (preset) {
      const tempEl = document.getElementById('qs-dry-temp');
      const durEl = document.getElementById('qs-dry-duration');
      if (tempEl) tempEl.value = preset.temperature;
      if (durEl) durEl.value = preset.duration_minutes;
    }
  };

  window._qsDrySubmit = async function() {
    const spoolId = parseInt(document.getElementById('qs-dry-spool')?.value);
    if (!spoolId) return;
    const temp = parseInt(document.getElementById('qs-dry-temp')?.value || '50');
    const duration = parseInt(document.getElementById('qs-dry-duration')?.value || '240');
    const method = document.getElementById('qs-dry-method')?.value || 'dryer_box';
    const humidity = parseFloat(document.getElementById('qs-dry-humidity')?.value) || null;
    try {
      const res = await fetch('/api/inventory/drying/sessions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spool_id: spoolId, temperature: temp, duration_minutes: duration, method, humidity_before: humidity })
      });
      if (!res.ok) throw new Error('Failed');
      document.querySelector('.inv-modal-overlay')?.remove();
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  async function _loadInsights() {
    const container = document.getElementById('insights-container');
    if (!container) return;
    try {
      const res = await fetch('/api/inventory/insights');
      const data = await res.json();
      if (!data.insights || data.insights.length === 0) {
        container.innerHTML = `<p class="text-muted" style="font-size:0.85rem;padding:12px 0">${t('filament.ai_insights_hint')}</p>`;
        return;
      }
      const icons = { warning: '&#9888;', restock: '&#128230;', info: '&#128161;', suggestion: '&#128300;' };
      const colors = { warning: 'var(--accent-orange, orange)', restock: 'var(--accent-red, red)', info: 'var(--accent-blue, #4a9eff)', suggestion: 'var(--accent-green, green)' };
      let h = '';
      for (const insight of data.insights) {
        h += `<div style="padding:10px;border:1px solid ${colors[insight.type] || 'var(--border-color)'};border-radius:8px;margin-bottom:8px;background:color-mix(in srgb, ${colors[insight.type] || 'var(--border-color)'} 5%, transparent)">
          <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px">${icons[insight.type] || ''} ${esc(insight.title)}</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">${esc(insight.message)}</div>`;
        if (insight.items?.length) {
          h += '<ul style="margin:6px 0 0;padding-left:18px;font-size:0.75rem">';
          for (const item of insight.items) h += `<li>${esc(item)}</li>`;
          h += '</ul>';
        }
        h += '</div>';
      }
      container.innerHTML = h;
    } catch { container.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  async function _loadPriceWatch() {
    const container = document.getElementById('price-watch-container');
    if (!container) return;
    try {
      const res = await fetch('/api/price-alerts');
      const alerts = await res.json();
      let h = '';
      if (alerts.length > 0) {
        h += '<div class="inv-location-list">';
        for (const a of alerts) {
          const colorDot = a.color_hex ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#${a.color_hex};border:1px solid var(--border-color)"></span>` : '';
          const statusIcon = a.triggered ? `<span style="color:var(--accent-green,#3fb950)" title="${t('filament.price_alert_triggered')}">&#10003;</span>` : '';
          const priceInfo = a.latest_price != null ? `<span class="text-muted">${t('filament.price_current')}: ${a.latest_price}</span>` : '';
          h += `<div class="fil-tag-item">
            ${colorDot}
            <span style="flex:1">
              <strong>${esc(a.profile_name || '?')}</strong>
              ${a.vendor_name ? '<span class="text-muted">(' + esc(a.vendor_name) + ')</span>' : ''}
              <br><span class="text-muted" style="font-size:0.75rem">${t('filament.price_target')}: ${a.target_price} ${esc(a.currency || '')} ${priceInfo}</span>
            </span>
            ${statusIcon}
            ${a.source_url ? `<a href="${esc(a.source_url)}" target="_blank" class="filament-edit-btn" title="${t('filament.price_source')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
            <button class="filament-delete-btn" onclick="window._deletePriceAlert(${a.id})" data-tooltip="${t('settings.delete')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>`;
        }
        h += '</div>';
      } else {
        h += `<p class="text-muted" style="font-size:0.85rem">${t('filament.price_watch_none')}</p>`;
      }
      h += `<div id="price-alert-form-container"></div>`;
      if (window._can && window._can('filament')) h += `<button class="form-btn form-btn-sm" data-ripple style="margin-top:8px" onclick="window._showAddPriceAlert()">+ ${t('filament.price_alert_add')}</button>`;
      container.innerHTML = h;
    } catch (e) { container.innerHTML = `<p class="text-muted">Error: ${e.message}</p>`; }
  }

  window._showAddPriceAlert = function() {
    const container = document.getElementById('price-alert-form-container');
    if (!container) return;
    const profiles = window._fs.profiles || [];
    let opts = profiles.map(p => `<option value="${p.id}">${esc(p.name)} (${esc(p.material || '')})</option>`).join('');
    container.innerHTML = `<div class="inv-inline-form" style="margin-top:8px">
      <select class="form-input form-input-sm" id="pa-profile"><option value="">-- ${t('filament.profile_name')} --</option>${opts}</select>
      <input class="form-input form-input-sm" id="pa-target" type="number" step="0.01" placeholder="${t('filament.price_target')}" style="width:100px">
      <input class="form-input form-input-sm" id="pa-currency" type="text" value="USD" placeholder="USD" style="width:60px">
      <input class="form-input form-input-sm" id="pa-url" type="url" placeholder="${t('filament.price_source_url')}" style="flex:1">
      <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._savePriceAlert()">${t('filament.tag_save')}</button>
    </div>`;
  };

  window._savePriceAlert = async function() {
    const profileId = document.getElementById('pa-profile')?.value;
    const target = parseFloat(document.getElementById('pa-target')?.value);
    const currency = document.getElementById('pa-currency')?.value || 'USD';
    const url = document.getElementById('pa-url')?.value || '';
    if (!profileId || !target) return;
    await fetch('/api/price-alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filament_profile_id: parseInt(profileId), target_price: target, currency, source_url: url || null }) });
    _loadPriceWatch();
  };

  window._deletePriceAlert = async function(id) {
    if (!confirm(t('filament.price_alert_delete_confirm'))) return;
    await fetch('/api/price-alerts/' + id, { method: 'DELETE' });
    _loadPriceWatch();
  };

  async function _loadRestockSuggestions() {
    const container = document.getElementById('restock-container');
    if (!container) return;
    try {
      const res = await fetch('/api/inventory/restock?days=30');
      const data = await res.json();
      if (!data || data.length === 0) {
        container.innerHTML = `<p class="text-muted text-sm">${t('filament.restock_none')}</p>`;
        return;
      }

      // Hero summary
      const critical = data.filter(s => s.urgency === 'critical').length;
      const high = data.filter(s => s.urgency === 'high').length;
      const medium = data.filter(s => s.urgency === 'medium').length;
      const totalCost = data.reduce((s, d) => s + (d.est_cost || 0), 0);
      const totalSpools = data.reduce((s, d) => s + (d.spools_to_order || 0), 0);

      let h = '<div class="fil-hero-grid" style="margin-bottom:12px">';
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', critical, t('filament.restock_critical') || 'Kritisk', '#f85149');
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>', high, t('filament.restock_high') || 'Haster', '#f0883e');
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', medium, t('filament.restock_medium') || 'Middels', '#d29922');
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>', totalSpools + ' ' + (t('filament.spools') || 'spoler'), t('filament.restock_to_order') || 'Bestilles', '#58a6ff');
      if (totalCost > 0) h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>', '~' + Math.round(totalCost), t('filament.restock_est_cost') || 'Est. kostnad', '#a371f7');
      h += '</div>';

      h += `<table class="fil-drying-presets-table"><thead><tr>
        <th></th>
        <th>${t('filament.profile_name')}</th>
        <th>${t('filament.filter_material')}</th>
        <th>${t('filament.restock_stock')}</th>
        <th>${t('filament.restock_days_left')}</th>
        <th>${t('filament.restock_order')}</th>
        <th>${t('filament.restock_urgency')}</th>
      </tr></thead><tbody>`;
      for (const s of data) {
        const colorDot = s.color_hex ? `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#${s.color_hex};border:1px solid var(--border-color)"></span>` : '';
        const urgencyColors = { critical: '#f85149', high: '#f0883e', medium: '#d29922', low: '#58a6ff' };
        const uColor = urgencyColors[s.urgency] || '#8b949e';
        // Progress bar showing remaining stock vs needed
        const stockPct = s.needed_g > 0 ? Math.min(100, Math.round(s.current_stock_g / s.needed_g * 100)) : 100;
        const barColor = stockPct > 60 ? 'var(--accent-green)' : stockPct > 30 ? '#d29922' : '#f85149';
        h += `<tr>
          <td>${colorDot}</td>
          <td>${esc(s.profile_name || '?')} ${s.vendor_name ? '<span class="text-muted">(' + esc(s.vendor_name) + ')</span>' : ''}</td>
          <td>${esc(s.material || '')}</td>
          <td>
            <div style="font-size:0.78rem">${s.current_stock_g}g <span class="text-muted">(${s.current_spool_count})</span></div>
            <div style="width:60px;height:4px;background:var(--bg-tertiary);border-radius:2px;margin-top:2px"><div style="width:${stockPct}%;height:100%;background:${barColor};border-radius:2px"></div></div>
          </td>
          <td style="color:${s.days_until_out != null && s.days_until_out <= 14 ? uColor : ''};font-weight:${s.days_until_out != null && s.days_until_out <= 7 ? '700' : '400'}">${s.days_until_out != null ? s.days_until_out + 'd' : '-'}</td>
          <td>${s.spools_to_order > 0 ? `<strong>${s.spools_to_order}</strong> ${t('filament.spools') || 'spoler'}${s.est_cost ? ` <span class="text-muted">(~${Math.round(s.est_cost)})</span>` : ''}` : '-'}</td>
          <td><span style="background:${uColor};color:#fff;padding:1px 8px;border-radius:4px;font-size:0.7rem;text-transform:uppercase">${t('filament.urgency_' + s.urgency) || s.urgency}</span></td>
        </tr>`;
      }
      h += '</tbody></table>';
      container.innerHTML = h;
    } catch (e) { container.innerHTML = `<p class="text-muted">Error: ${e.message}</p>`; }
  }

  async function _loadUsagePredictions() {
    const container = document.getElementById('usage-predictions-container');
    if (!container) return;
    try {
      const res = await fetch('/api/inventory/predictions');
      const data = await res.json();
      if (!data.per_spool || data.per_spool.length === 0) {
        container.innerHTML = `<p class="text-muted text-sm">${t('filament.no_usage_data')}</p>`;
        return;
      }
      const active = data.per_spool.filter(s => s.avg_daily_g > 0);
      if (active.length === 0) {
        container.innerHTML = `<p class="text-muted text-sm">${t('filament.no_usage_data')}</p>`;
        return;
      }

      // Hero summary
      const totalRemaining = active.reduce((s, d) => s + d.remaining_weight_g, 0);
      const totalDailyUsage = data.by_material?.reduce((s, m) => s + m.avg_daily_g, 0) || 0;
      const needsReorder = active.filter(s => s.needs_reorder).length;
      const avgDaysLeft = active.length > 0 ? Math.round(active.reduce((s, d) => s + (d.days_until_empty || 0), 0) / active.length) : 0;
      const closestEmpty = active.reduce((min, s) => s.days_until_empty != null && s.days_until_empty < min ? s.days_until_empty : min, 999);

      let h = '<div class="fil-hero-grid" style="margin-bottom:12px">';
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', Math.round(totalDailyUsage) + 'g/d', t('filament.daily_usage') || 'Daglig forbruk', '#1279ff');
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', closestEmpty < 999 ? closestEmpty + 'd' : '--', t('filament.next_empty') || 'Tidligst tom', closestEmpty <= 7 ? '#f85149' : closestEmpty <= 14 ? '#f0883e' : '#00e676');
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>', Math.round(totalRemaining) + 'g', t('filament.total_remaining') || 'Totalt igjen', '#00e676');
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', needsReorder, t('filament.needs_reorder_count') || 'Trenger bestilling', needsReorder > 0 ? '#f0883e' : '#8b949e');
      h += window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', active.length, t('filament.active_spools') || 'Aktive spoler', '#a371f7');
      h += '</div>';

      // Material usage summary cards
      if (data.by_material && data.by_material.length > 0) {
        h += '<div class="auto-grid auto-grid--md" style="margin-bottom:12px">';
        for (const m of data.by_material) {
          const matColor = m.material === 'PLA' ? '#4ade80' : m.material === 'PETG' ? '#60a5fa' : m.material === 'ABS' ? '#f97316' : m.material === 'TPU' ? '#c084fc' : '#8b949e';
          h += `<div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);padding:10px 14px;display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-weight:700;font-size:0.9rem;color:${matColor}">${esc(m.material)}</div>
              <div class="text-muted" style="font-size:0.7rem">${m.active_days} ${t('filament.active_days') || 'aktive dager'}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;font-size:0.9rem">${m.avg_daily_g}g/d</div>
              <div class="text-muted" style="font-size:0.7rem">${Math.round(m.total_used_g)}g ${t('filament.total_used') || 'totalt brukt'}</div>
            </div>
          </div>`;
        }
        h += '</div>';
      }

      // Per-spool table
      h += `<table class="fil-drying-presets-table"><thead><tr>
        <th></th>
        <th>${t('filament.profile_name')}</th>
        <th>${t('filament.filter_material')}</th>
        <th>${t('filament.remaining_weight')}</th>
        <th>${t('filament.avg_daily_usage')}</th>
        <th>${t('filament.days_until_empty')}</th>
        <th></th>
      </tr></thead><tbody>`;
      for (const s of active) {
        const daysColor = s.days_until_empty != null && s.days_until_empty <= 7 ? '#f85149' : s.days_until_empty != null && s.days_until_empty <= 14 ? '#f0883e' : '';
        const reorderBadge = s.needs_reorder ? `<span style="background:${s.days_until_empty <= 7 ? '#f85149' : '#f0883e'};color:#fff;padding:1px 6px;border-radius:4px;font-size:0.7rem">${s.days_until_empty <= 7 ? (t('filament.urgency_critical') || 'Kritisk') : (t('filament.needs_reorder') || 'Bestill')}</span>` : '';
        const colorDot = s.color_hex ? `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#${s.color_hex};border:1px solid var(--border-color)"></span>` : '';
        // Weight bar
        const maxW = Math.max(...active.map(a => a.remaining_weight_g));
        const wPct = Math.round(s.remaining_weight_g / maxW * 100);
        h += `<tr>
          <td>${colorDot}</td>
          <td>${esc(s.profile_name || '?')} ${s.vendor_name ? '<span class="text-muted">(' + esc(s.vendor_name) + ')</span>' : ''}</td>
          <td>${esc(s.material || '')}</td>
          <td>
            <div style="font-size:0.78rem">${Math.round(s.remaining_weight_g)}g</div>
            <div style="width:50px;height:3px;background:var(--bg-tertiary);border-radius:2px;margin-top:2px"><div style="width:${wPct}%;height:100%;background:var(--accent-blue);border-radius:2px"></div></div>
          </td>
          <td style="font-weight:600">${s.avg_daily_g}g/d</td>
          <td style="color:${daysColor};font-weight:${s.needs_reorder ? '700' : '400'}">${s.days_until_empty != null ? s.days_until_empty + 'd' : '-'}</td>
          <td>${reorderBadge}</td>
        </tr>`;
      }
      h += '</tbody></table>';

      // Forecast chart
      h += '<div class="card" style="margin-top:12px">';
      h += `<div class="card-title">${t('forecast.chart_title') || '30-dagers prognose'}</div>`;
      h += '<div id="forecast-chart-container"></div>';
      h += '</div>';

      container.innerHTML = h;
      setTimeout(() => window._renderForecastChart?.(data), 50);
    } catch (e) { container.innerHTML = `<p class="text-muted">Error: ${e.message}</p>`; }
  }

  async function _loadCostEstimation() {
    const container = document.getElementById('cost-estimation-container');
    if (!container) return;
    try {
      const res = await fetch('/api/history');
      const history = await res.json();
      const completed = history.filter(r => r.status === 'completed' && r.filament_used_g > 0);
      if (completed.length === 0) {
        container.innerHTML = `<p class="text-muted text-sm">${t('filament.no_usage_data')}</p>`;
        return;
      }
      let totalFilament = 0, totalElectricity = 0, totalDepreciation = 0, totalCost = 0;
      const byMaterial = {};
      const rows = [];
      for (const r of completed.slice(0, 50)) {
        try {
          const params = new URLSearchParams({ filament_g: r.filament_used_g, duration_s: r.duration_seconds || 0 });
          const cRes = await fetch('/api/inventory/cost-estimate?' + params);
          const cost = await cRes.json();
          totalFilament += cost.filament_cost;
          totalElectricity += cost.electricity_cost;
          totalDepreciation += cost.depreciation_cost;
          totalCost += cost.total_cost;
          const mat = r.filament_type || 'Unknown';
          if (!byMaterial[mat]) byMaterial[mat] = { count: 0, cost: 0 };
          byMaterial[mat].count++;
          byMaterial[mat].cost += cost.total_cost;
          rows.push({ name: r.filename, cost: cost.total_cost });
        } catch {}
      }
      let h = `<div class="fil-health-legend" style="gap:12px;margin-bottom:8px">
        <span><strong>${t('filament.filament_cost')}:</strong> ${formatCurrency(totalFilament)}</span>
        <span><strong>${t('filament.electricity_cost')}:</strong> ${formatCurrency(totalElectricity)}</span>
        <span><strong>${t('filament.depreciation_cost')}:</strong> ${formatCurrency(totalDepreciation)}</span>
        <span style="font-weight:700"><strong>${t('filament.total_cost')}:</strong> ${formatCurrency(totalCost)}</span>
      </div>`;
      const mats = Object.entries(byMaterial).sort((a, b) => b[1].cost - a[1].cost);
      if (mats.length > 0) {
        h += `<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px">`;
        h += mats.map(([m, d]) => `${m}: ${formatCurrency(d.cost)} (${d.count})`).join(' · ');
        h += '</div>';
      }
      container.innerHTML = h;
    } catch (e) { container.innerHTML = `<p class="text-muted">Error: ${e.message}</p>`; }
  }

  window.showStartDryingDialog = function(spoolId) {
    const spool = window._fs.spools.find(s => s.id === spoolId);
    if (!spool) return;
    const preset = window._fs.dryingPresets.find(p => p.material === spool.material);
    const cleanName = window._cleanProfileName(spool);
    const cancelAction = `closeDryingDialog()`;
    const formHtml = `
      <div class="ctrl-card" style="margin-bottom:12px">
        <div class="ctrl-card-title">${t('filament.start_drying')} — ${esc(cleanName)}</div>
        <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:8px">
          <label class="form-label">${t('filament.drying_temp')}
            <input class="form-input form-input-sm" type="number" id="dry-temp" value="${preset?.temperature || 50}" min="30" max="120">
          </label>
          <label class="form-label">${t('filament.drying_duration')}
            <input class="form-input form-input-sm" type="number" id="dry-duration" value="${preset?.duration_minutes || 240}" min="30" max="1440">
          </label>
          <label class="form-label">${t('filament.drying_method')}
            <select class="form-input form-input-sm" id="dry-method">
              <option value="dryer_box">${t('filament.drying_method_dryer_box')}</option>
              <option value="ams_drying">${t('filament.drying_method_ams')}</option>
              <option value="oven">${t('filament.drying_method_oven')}</option>
              <option value="other">${t('filament.drying_method_other')}</option>
            </select>
          </label>
          <label class="form-label">${t('filament.drying_humidity_before')}
            <input class="form-input form-input-sm" type="number" id="dry-humidity" step="0.1" min="0" max="100" placeholder="Optional">
          </label>
          <label class="form-label" style="grid-column:1/-1">${t('filament.drying_notes')}
            <input class="form-input form-input-sm" type="text" id="dry-notes" placeholder="Optional">
          </label>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="form-btn" data-ripple onclick="submitStartDrying(${spoolId})">${t('filament.start_drying')}</button>
          <button class="form-btn form-btn-sm" data-ripple onclick="${cancelAction}">${t('common.cancel')}</button>
        </div>
      </div>`;

    const formContainer = document.getElementById('inv-global-form');
    if (formContainer) {
      formContainer.style.display = 'block';
      formContainer.innerHTML = formHtml;
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    // Fallback: open in modal overlay (visual card view)
    const overlay = document.createElement('div');
    overlay.className = 'inv-modal-overlay';
    overlay.id = 'drying-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="inv-modal" style="max-width:500px">
      <div class="inv-modal-header">
        <span>${t('filament.start_drying')} — ${esc(cleanName)}</span>
        <button class="inv-modal-close" onclick="this.closest('.inv-modal-overlay').remove()">&times;</button>
      </div>
      <div style="padding:12px">${formHtml}</div>
    </div>`;
    document.body.appendChild(overlay);
  };

  window.closeDryingDialog = function() {
    const c = document.getElementById('inv-global-form');
    if (c) { c.style.display = 'none'; return; }
    const m = document.getElementById('drying-modal-overlay');
    if (m) m.remove();
  };

  window.submitStartDrying = async function(spoolId) {
    const temp = parseInt(document.getElementById('dry-temp')?.value || '50');
    const duration = parseInt(document.getElementById('dry-duration')?.value || '240');
    const method = document.getElementById('dry-method')?.value || 'dryer_box';
    const humidity = parseFloat(document.getElementById('dry-humidity')?.value) || null;
    const notes = document.getElementById('dry-notes')?.value || null;

    try {
      const res = await fetch('/api/inventory/drying/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spool_id: spoolId, temperature: temp, duration_minutes: duration, method, humidity_before: humidity, notes })
      });
      if (!res.ok) throw new Error('Failed');
      closeDryingDialog();
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.completeDryingItem = async function(sessionId) {
    const humidityAfter = prompt(t('filament.drying_humidity_after'));
    try {
      const res = await fetch(`/api/inventory/drying/sessions/${sessionId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ humidity_after: humidityAfter ? parseFloat(humidityAfter) : null })
      });
      if (!res.ok) throw new Error('Failed');
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteDryingItem = function(sessionId) {
    return confirmAction(t('common.delete_confirm'), async () => {
      try {
        await fetch(`/api/inventory/drying/sessions/${sessionId}`, { method: 'DELETE' });
        loadFilament();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  window.showAddDryingPresetForm = function() {
    const container = document.getElementById('drying-presets-form');
    if (!container) return;
    container.style.display = 'block';
    container.innerHTML = `
      <div class="form-grid" style="grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:8px">
        <label class="form-label">${t('filament.filter_material')}
          <input class="form-input form-input-sm" type="text" id="preset-material" placeholder="e.g. PLA">
        </label>
        <label class="form-label">${t('filament.drying_temp')}
          <input class="form-input form-input-sm" type="number" id="preset-temp" value="50" min="30" max="120">
        </label>
        <label class="form-label">${t('filament.drying_duration')}
          <input class="form-input form-input-sm" type="number" id="preset-duration" value="240" min="30" max="1440">
        </label>
        <label class="form-label">${t('filament.drying_max_days')}
          <input class="form-input form-input-sm" type="number" id="preset-maxdays" value="30" min="1" max="365">
        </label>
      </div>
      <div style="display:flex;gap:8px">
        <button class="form-btn" data-ripple onclick="submitDryingPreset()">${t('common.save')}</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="document.getElementById('drying-presets-form').style.display='none'">${t('common.cancel')}</button>
      </div>`;
  };

  window.editDryingPreset = function(material) {
    const preset = window._fs.dryingPresets.find(p => p.material === material);
    if (!preset) return;
    const container = document.getElementById('drying-presets-form');
    if (!container) return;
    container.style.display = 'block';
    container.innerHTML = `
      <div class="form-grid" style="grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:8px">
        <label class="form-label">${t('filament.filter_material')}
          <input class="form-input form-input-sm" type="text" id="preset-material" value="${esc(material)}" readonly>
        </label>
        <label class="form-label">${t('filament.drying_temp')}
          <input class="form-input form-input-sm" type="number" id="preset-temp" value="${preset.temperature}" min="30" max="120">
        </label>
        <label class="form-label">${t('filament.drying_duration')}
          <input class="form-input form-input-sm" type="number" id="preset-duration" value="${preset.duration_minutes}" min="30" max="1440">
        </label>
        <label class="form-label">${t('filament.drying_max_days')}
          <input class="form-input form-input-sm" type="number" id="preset-maxdays" value="${preset.max_days_without_drying || 30}" min="1" max="365">
        </label>
      </div>
      <div style="display:flex;gap:8px">
        <button class="form-btn" data-ripple onclick="submitDryingPreset()">${t('common.save')}</button>
        <button class="form-btn form-btn-sm" data-ripple onclick="document.getElementById('drying-presets-form').style.display='none'">${t('common.cancel')}</button>
      </div>`;
  };

  window.submitDryingPreset = async function() {
    const material = document.getElementById('preset-material')?.value?.trim();
    const temperature = parseInt(document.getElementById('preset-temp')?.value || '50');
    const duration_minutes = parseInt(document.getElementById('preset-duration')?.value || '240');
    const max_days_without_drying = parseInt(document.getElementById('preset-maxdays')?.value || '30');
    if (!material) return;
    try {
      const res = await fetch(`/api/inventory/drying/presets/${encodeURIComponent(material)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature, duration_minutes, max_days_without_drying })
      });
      if (!res.ok) throw new Error('Failed');
      document.getElementById('drying-presets-form').style.display = 'none';
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteDryingPresetItem = function(material) {
    return confirmAction(t('filament.drying_preset_delete'), async () => {
      try {
        await fetch(`/api/inventory/drying/presets/${encodeURIComponent(material)}`, { method: 'DELETE' });
        loadFilament();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  // ═══ Checked-out spools ═══
  async function _loadCheckedOut() {
    const el = document.getElementById('checked-out-container');
    if (!el) return;
    try {
      const res = await fetch('/api/inventory/checked-out');
      const spools = await res.json();
      if (!spools.length) { el.innerHTML = `<p class="text-muted" style="font-size:0.8rem;padding:8px 0">${t('filament.no_checked_out')}</p>`; return; }
      let h = '<div class="fil-checkout-list">';
      for (const s of spools) {
        const color = window._filHelpers.hexToRgb(s.color_hex);
        h += `<div class="fil-checkout-item">
          ${miniSpool(color, 16)}
          <div class="fil-checkout-info">
            <strong>${esc(s.profile_name || s.material || '--')}</strong>
            <span class="text-muted" style="font-size:0.75rem">${s.checked_out_by ? t('filament.checked_out_by') + ': ' + esc(s.checked_out_by) : ''} ${s.checked_out_from ? '· ' + esc(s.checked_out_from) : ''}</span>
          </div>
          <button class="form-btn form-btn-sm" data-ripple onclick="checkinSpoolItem(${s.id})">${t('filament.checkin')}</button>
        </div>`;
      }
      h += '</div>';
      el.innerHTML = h;
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  window.checkoutSpoolItem = async function(id) {
    const actor = prompt(t('filament.checkout_actor'));
    if (actor === null) return;
    try {
      await fetch(`/api/inventory/spools/${id}/checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor: actor || undefined })
      });
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.checkinSpoolItem = async function(id) {
    try {
      await fetch(`/api/inventory/spools/${id}/checkin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      loadFilament();
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ═══ Expose drying functions for cross-file use ═══
  window._loadDryingStats = _loadDryingStats;
  window._startDryingTimers = _startDryingTimers;
  window._renderDryingSubContent = _renderDryingSubContent;
  window._loadCheckedOut = _loadCheckedOut;
  window._loadInsights = _loadInsights;
  window._loadPriceWatch = _loadPriceWatch;
  window._loadRestockSuggestions = _loadRestockSuggestions;
  window._loadUsagePredictions = _loadUsagePredictions;
  window._loadCostEstimation = _loadCostEstimation;

})();
