// Filament Inventory — Community filament database browser: stats, search/filter, cards/table views, detail, compare, material reference
(function() {

  // ═══ Material Reference ═══

  // ═══ Filament Database Functions ═══

  async function _loadDbStats() {
    try {
      const res = await fetch('/api/community-filaments/stats');
      window._fs.dbStats = await res.json();
      const el = document.getElementById('db-hero-container');
      if (el) {
        el.outerHTML = `<div class="fil-hero-grid">
          ${window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>', window._fs.dbStats.total.toLocaleString(), t('filament.db_total'), '#1279ff')}
          ${window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', window._fs.dbStats.brands.toLocaleString(), t('filament.db_brands'), '#00e676')}
          ${window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', window._fs.dbStats.materials.toLocaleString(), t('filament.db_materials'), '#f0883e')}
          ${window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', window._fs.dbStats.with_k_value.toLocaleString(), t('filament.db_with_k'), '#9b4dff')}
          ${window._filHelpers.heroCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>', window._fs.dbStats.with_td.toLocaleString(), t('filament.db_with_td'), '#e3b341')}
        </div>`;
      }
    } catch { /* silent */ }
  }

  async function _loadDbFilaments() {
    const params = new URLSearchParams();
    if (window._fs.dbSearch) params.set('search', window._fs.dbSearch);
    if (window._fs.dbFilterBrand) params.set('manufacturer', window._fs.dbFilterBrand);
    if (window._fs.dbFilterMaterial) params.set('material', window._fs.dbFilterMaterial);
    if (window._fs.dbFilterCategory) params.set('category', window._fs.dbFilterCategory);
    if (window._fs.dbFilterHasK) params.set('has_k_value', '1');
    if (window._fs.dbFilterHasTd) params.set('has_td', '1');
    if (window._fs.dbFilterTranslucent) params.set('translucent', '1');
    if (window._fs.dbFilterGlow) params.set('glow', '1');
    if (window._fs.dbFilterMultiColor) params.set('multi_color', '1');
    params.set('sort', window._fs.dbSort);
    params.set('sort_dir', window._fs.dbSortDir);
    params.set('limit', window._fs.dbPageSize);
    params.set('offset', window._fs.dbPage * window._fs.dbPageSize);

    try {
      const promises = [fetch('/api/community-filaments?' + params)];
      if (!window._fs.dbBrands.length) promises.push(fetch('/api/community-filaments/manufacturers'));
      if (!window._fs.dbMaterials.length) promises.push(fetch('/api/community-filaments/materials'));
      const results = await Promise.all(promises);

      const data = await results[0].json();
      window._fs.dbFilaments = data.rows || data;
      window._fs.dbTotal = data.total || window._fs.dbFilaments.length;
      if (data.owned_ids) window._fs.dbOwnedIds = new Set(data.owned_ids);
      window._fs.dbLoaded = true;

      if (results[1]) window._fs.dbBrands = await results[1].json();
      if (results[2]) window._fs.dbMaterials = await results[2].json();

      _refreshDbBrowser();
    } catch (e) {
      const el = document.getElementById('db-results-container');
      if (el) el.innerHTML = `<div class="text-muted">Error: ${e.message}</div>`;
    }
  }

  function _refreshDbBrowser() {
    // Re-render the db-browser module content
    const panel = document.getElementById('filament-tab-database');
    if (!panel) return;
    const mod = panel.querySelector('[data-module-id="db-browser"]');
    if (!mod) return;
    const builder = BUILDERS['db-browser'];
    if (builder) {
      mod.innerHTML = builder(window._fs.spools);
    }
  }

  function _renderDbResults() {
    if (window._fs.dbViewMode === 'table') return _renderDbTable();
    return _renderDbCards();
  }

  function _renderDbCards() {
    let h = '<div class="db-card-grid">';
    for (const f of window._fs.dbFilaments) {
      const color = f.color_hex ? window._filHelpers.hexToRgb(f.color_hex) : '#888';
      const textColor = f.color_hex && window._filHelpers.isLightColor(f.color_hex) ? '#000' : '#fff';
      const badges = [];
      if (f.category) badges.push(`<span class="fil-badge" style="background:var(--bg-tertiary);font-size:0.65rem">${f.category}</span>`);
      if (f.pressure_advance_k != null) badges.push(`<span class="fil-badge" style="background:#2d1f4e;color:#c4b5fd;font-size:0.65rem">K=${f.pressure_advance_k}</span>`);
      if (f.td_value && f.td_value > 0) badges.push(`<span class="fil-badge" style="background:#3d2e00;color:#e3b341;font-size:0.65rem">TD=${f.td_value}</span>`);
      // Slicer settings badges
      if (f.flow_ratio && f.flow_ratio !== 1) badges.push(`<span class="fil-badge" style="background:#1a3a2a;color:#6ee7b7;font-size:0.65rem">${t('filament.flow_ratio')} ${f.flow_ratio}</span>`);
      if (f.max_volumetric_speed) badges.push(`<span class="fil-badge" style="background:#1a2a3a;color:#93c5fd;font-size:0.65rem">${f.max_volumetric_speed} mm³/s</span>`);
      if (f.retraction_distance) badges.push(`<span class="fil-badge" style="background:#3a2a1a;color:#fcd34d;font-size:0.65rem">${t('filament.retraction')} ${f.retraction_distance}mm</span>`);
      // Visual properties
      if (f.finish) badges.push(`<span class="fil-badge" style="background:#2a2a3a;color:#a5b4fc;font-size:0.65rem">${f.finish}</span>`);
      if (f.translucent) badges.push(`<span class="fil-badge" style="background:#1a2a3a;color:#67e8f9;font-size:0.65rem">${t('filament.translucent') || 'Transparent'}</span>`);
      if (f.glow) badges.push(`<span class="fil-badge" style="background:#2a3a1a;color:#bef264;font-size:0.65rem">${t('filament.glow') || 'Glow'}</span>`);
      if (f.multi_color_direction) badges.push(`<span class="fil-badge" style="background:#3a1a2a;color:#f9a8d4;font-size:0.65rem">${t('filament.multi_color') || 'Multi'}: ${f.multi_color_direction}</span>`);
      if (f.pattern) badges.push(`<span class="fil-badge" style="background:#2a3a2a;color:#86efac;font-size:0.65rem">${f.pattern}</span>`);
      // Rating
      const ratingAvg = f.rating_count > 0 ? (f.rating_sum / f.rating_count).toFixed(1) : null;
      const stars = ratingAvg ? '★'.repeat(Math.round(ratingAvg)) + '☆'.repeat(5 - Math.round(ratingAvg)) : '';
      const inCompare = window._fs.dbCompare.includes(f.id);
      const isOwned = window._fs.dbOwnedIds.has(f.id);

      // Multi-color gradient support
      let colorStyle = `background:${color}`;
      if (f.color_hexes) {
        try {
          const hexes = typeof f.color_hexes === 'string' ? JSON.parse(f.color_hexes) : f.color_hexes;
          if (Array.isArray(hexes) && hexes.length > 1) {
            const stops = hexes.map(h => '#' + h.replace('#', '')).join(', ');
            colorStyle = `background:linear-gradient(135deg, ${stops})`;
          }
        } catch { /* ignore */ }
      }
      h += `<div class="db-filament-card" onclick="window._dbShowDetail(${f.id})">
        <div class="db-card-color" style="display:flex;align-items:center;justify-content:center;position:relative">${typeof spoolIcon === 'function' ? spoolIcon(color, 52) : `<div style="width:100%;height:100%;${colorStyle}"></div>`}${isOwned ? `<span style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:#4ade80;font-size:0.6rem;padding:1px 5px;border-radius:8px">✓ ${t('filament.owned')}</span>` : ''}</div>
        <div class="db-card-body">
          <div class="db-card-brand">${esc(f.manufacturer || '')}${ratingAvg ? ` <span style="color:#fbbf24;font-size:0.7rem">${stars} (${ratingAvg})</span>` : ''}</div>
          <div class="db-card-name">${esc(f.name || f.material)}</div>
          <div class="db-card-material">${esc(f.material || '')}${f.material_type ? ' <span class="text-muted">' + esc(f.material_type) + '</span>' : ''}</div>
          <div class="db-card-temps">${f.extruder_temp ? f.extruder_temp + '°C' : '--'} / ${f.bed_temp ? f.bed_temp + '°C' : '--'}</div>
          <div class="fil-profile-badges" style="margin-top:4px">${badges.join('')}</div>
        </div>
        <div class="db-card-actions">
          ${window._can && window._can('filament') ? `<button class="form-btn form-btn-sm" onclick="event.stopPropagation();window._dbImport(${f.id})" title="${t('filament.db_add_to_inventory')}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>` : ''}
          <button class="form-btn form-btn-sm${inCompare?' active':''}" onclick="event.stopPropagation();window._dbToggleCompare(${f.id})" title="${t('filament.db_compare')}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          </button>
        </div>
      </div>`;
    }
    h += '</div>';
    return h;
  }

  function _renderDbTable() {
    let h = '<div style="overflow-x:auto"><table class="data-table"><thead><tr>';
    h += '<th></th><th>Brand</th><th>Name</th><th>Material</th><th>Nozzle</th><th>Bed</th><th>K-Value</th><th>TD</th><th>Price</th><th></th>';
    h += '</tr></thead><tbody>';
    for (const f of window._fs.dbFilaments) {
      const color = f.color_hex ? window._filHelpers.hexToRgb(f.color_hex) : '#888';
      const owned = window._fs.dbOwnedIds.has(f.id);
      h += `<tr style="cursor:pointer" onclick="window._dbShowDetail(${f.id})">
        <td>${typeof miniSpool === 'function' ? miniSpool(color, 16) : `<span class="filament-color-swatch" style="background:${color};width:14px;height:14px;display:inline-block;border-radius:50%"></span>`}${owned ? ' <span style="color:#4ade80;font-size:0.65rem">✓</span>' : ''}</td>
        <td>${esc(f.manufacturer || '')}</td>
        <td>${esc(f.name || '--')}</td>
        <td>${esc(f.material || '')}${f.material_type ? ' <span class="text-muted">' + esc(f.material_type) + '</span>' : ''}</td>
        <td>${f.extruder_temp ? f.extruder_temp + '°C' : '--'}</td>
        <td>${f.bed_temp ? f.bed_temp + '°C' : '--'}</td>
        <td>${f.pressure_advance_k != null ? f.pressure_advance_k : '--'}</td>
        <td>${f.td_value && f.td_value > 0 ? f.td_value : '--'}</td>
        <td>${f.price ? '$' + f.price : '--'}</td>
        <td>${window._can && window._can('filament') ? `<button class="form-btn form-btn-sm" onclick="event.stopPropagation();window._dbImport(${f.id})" title="${t('filament.db_add_to_inventory')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>` : ''}</td>
      </tr>`;
    }
    h += '</tbody></table></div>';
    return h;
  }

  function _dbShowDetail(id) {
    const f = window._fs.dbFilaments.find(x => x.id === id);
    if (!f) return;
    const color = f.color_hex ? window._filHelpers.hexToRgb(f.color_hex) : '#888';
    const textColor = f.color_hex && window._filHelpers.isLightColor(f.color_hex) ? '#000' : '#fff';

    const fields = [
      ['Material', f.material + (f.material_type ? ' ' + f.material_type : '')],
      ['Category', f.category || '--'],
      [t('filament.db_nozzle_temp'), f.extruder_temp ? f.extruder_temp + '°C' + (f.extruder_temp_min || f.extruder_temp_max ? ` (${f.extruder_temp_min || '?'}–${f.extruder_temp_max || '?'}°C)` : '') : '--'],
      [t('filament.db_bed_temp'), f.bed_temp ? f.bed_temp + '°C' + (f.bed_temp_min || f.bed_temp_max ? ` (${f.bed_temp_min || '?'}–${f.bed_temp_max || '?'}°C)` : '') : '--'],
      [t('filament.db_chamber_temp'), f.chamber_temp ? f.chamber_temp + '°C' : '--'],
      [t('filament.db_k_value'), f.pressure_advance_k != null ? f.pressure_advance_k : '--'],
      [t('filament.db_td_value'), f.td_value && f.td_value > 0 ? f.td_value + (f.total_td_votes ? ` (${f.total_td_votes} votes)` : '') : '--'],
      [t('filament.db_flow_ratio'), f.flow_ratio || '--'],
      [t('filament.db_volumetric'), f.max_volumetric_speed ? f.max_volumetric_speed + ' mm\u00B3/s' : '--'],
      [t('filament.db_fan_speed'), (f.fan_speed_min != null || f.fan_speed_max != null) ? `${f.fan_speed_min || 0}% - ${f.fan_speed_max || 100}%` : '--'],
      [t('filament.db_retraction'), f.retraction_distance != null ? f.retraction_distance + ' mm' + (f.retraction_speed ? ' @ ' + f.retraction_speed + ' mm/s' : '') : '--'],
      ['Density', f.density ? f.density + ' g/cm\u00B3' : '--'],
      ['Diameter', f.diameter ? f.diameter + ' mm' : '1.75 mm'],
      [t('filament.db_finish') || 'Finish', f.finish || '--'],
      [t('filament.db_spool_type') || 'Spooltype', f.spool_type || '--'],
      [t('filament.db_spool_weight') || 'Spoolvekt', f.spool_weight ? f.spool_weight + 'g' : '--'],
    ];
    // Only show visual properties if they have values
    if (f.translucent) fields.push([t('filament.translucent') || 'Transparent', 'Ja']);
    if (f.glow) fields.push([t('filament.glow') || 'Glow-in-dark', 'Ja']);
    if (f.pattern) fields.push([t('filament.db_pattern') || 'Mønster', f.pattern]);
    if (f.multi_color_direction) fields.push([t('filament.multi_color') || 'Flerfarge', f.multi_color_direction]);
    fields.push(
      [t('filament.db_price'), f.price ? '$' + f.price + (f.price_currency && f.price_currency !== 'USD' ? ' ' + f.price_currency : '') : '--'],
      [t('filament.db_source'), f.source || '--']
    );

    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:520px;max-height:90vh;overflow-y:auto">
        <div class="inv-modal-header">
          <span>${esc(f.manufacturer || '')} — ${esc(f.name || f.material)}</span>
          <button class="inv-modal-close" onclick="this.closest('.inv-modal-backdrop').remove()">&times;</button>
        </div>
        <div class="inv-modal-body">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="flex-shrink:0">${typeof spoolIcon === 'function' ? spoolIcon(color, 48) : `<div style="width:48px;height:48px;border-radius:8px;background:${color};border:2px solid var(--border-color)"></div>`}</div>
            <div>
              <div style="font-weight:600;font-size:1rem">${esc(f.name || f.material)}</div>
              <div class="text-muted text-sm">${esc(f.manufacturer || '')} &middot; ${esc(f.material)}${f.material_type ? ' ' + esc(f.material_type) : ''}</div>
              ${f.color_name ? '<div class="text-muted" style="font-size:0.75rem">' + esc(f.color_name) + (f.color_hex ? ' #' + f.color_hex : '') + '</div>' : ''}
            </div>
          </div>
          <div class="db-detail-grid">`;
    for (const [label, val] of fields) {
      if (val === '--' || val === '-- mm' || val === null) continue;
      html += `<div class="db-detail-field"><div class="db-detail-label">${label}</div><div class="db-detail-value">${val}</div></div>`;
    }
    html += '</div>';
    if (f.tips) html += `<div style="margin-top:8px;padding:8px;background:var(--bg-tertiary);border-radius:6px;font-size:0.8rem"><strong>Tips:</strong> ${esc(f.tips)}</div>`;
    if (f.purchase_url) html += `<div style="margin-top:8px"><a href="${esc(f.purchase_url)}" target="_blank" rel="noopener" class="form-btn form-btn-sm" style="display:inline-flex;align-items:center;gap:4px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> ${t('filament.db_buy')}</a></div>`;
    // Community rating
    const avgRating = f.rating_count > 0 ? (f.rating_sum / f.rating_count) : 0;
    html += `<div style="margin-top:10px;display:flex;align-items:center;gap:8px">
      <span style="font-size:0.8rem;font-weight:600">${t('filament.community_rating')}:</span>
      <span style="display:flex;gap:2px">${[1,2,3,4,5].map(i => `<span id="cf-star-${i}" style="cursor:pointer;font-size:1.1rem;color:${i <= Math.round(avgRating) ? 'var(--accent-orange)' : 'var(--text-muted)'}" onclick="window._rateCommunityFilament(${f.id},${i})">&#9733;</span>`).join('')}</span>
      ${f.rating_count > 0 ? `<span class="text-muted" style="font-size:0.75rem">(${avgRating.toFixed(1)} / ${f.rating_count})</span>` : `<span class="text-muted" style="font-size:0.75rem">${t('filament.no_ratings')}</span>`}
    </div>`;
    // TD voting
    html += `<div style="margin-top:10px;padding:8px;background:var(--bg-tertiary);border-radius:6px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span style="font-size:0.8rem;font-weight:600">${t('filament.db_td_value')}:</span>
        <span style="font-size:0.9rem;font-weight:700;color:var(--accent-orange)">${f.td_value && f.td_value > 0 ? f.td_value : '--'}</span>
        ${f.total_td_votes ? `<span class="text-muted" style="font-size:0.7rem">(${f.total_td_votes} ${t('filament.td_votes_count')})</span>` : ''}
      </div>
      <div class="flex gap-sm" style="align-items:flex-end">
        <div class="form-group" style="width:90px;margin:0">
          <label class="form-label" style="font-size:0.65rem">${t('filament.td_your_value')}</label>
          <input class="form-input" id="td-vote-${f.id}" type="number" step="0.01" placeholder="e.g. 1.42" style="font-size:0.8rem">
        </div>
        <button class="form-btn form-btn-sm" onclick="window._submitTdVote(${f.id})">${t('filament.td_submit')}</button>
      </div>
    </div>`;
    if (f.shared_by) html += `<div class="text-muted" style="font-size:0.7rem;margin-top:4px">${t('filament.shared_by')}: ${esc(f.shared_by)}</div>`;
    html += `</div>
        <div class="inv-modal-footer">
          ${window._can && window._can('filament') ? `<button class="form-btn" onclick="window._dbImport(${f.id});this.closest('.inv-modal-backdrop').remove()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            ${t('filament.db_add_to_inventory')}
          </button>
          <button class="form-btn form-btn-sm" onclick="window._dbImport(${f.id},true);this.closest('.inv-modal-backdrop').remove()">${t('filament.db_add_with_spool')}</button>` : ''}
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  async function _dbImport(id, createSpool = false) {
    try {
      const res = await fetch('/api/community-filaments/import-to-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, create_spool: createSpool })
      });
      const data = await res.json();
      if (data.ok) {
        showToast(t('filament.db_imported'), 'success');
      } else {
        showToast(data.error || 'Error', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  function _dbToggleCompare(id) {
    const idx = window._fs.dbCompare.indexOf(id);
    if (idx >= 0) window._fs.dbCompare.splice(idx, 1);
    else if (window._fs.dbCompare.length < 4) window._fs.dbCompare.push(id);
    else { showToast('Max 4 filaments', 'warning'); return; }
    _refreshDbBrowser();
  }

  function _dbShowCompare() {
    if (window._fs.dbCompare.length < 2) return;
    const items = window._fs.dbCompare.map(id => window._fs.dbFilaments.find(f => f.id === id)).filter(Boolean);
    if (items.length < 2) return;

    const fields = ['material','material_type','extruder_temp','bed_temp','chamber_temp','pressure_advance_k','td_value','flow_ratio','max_volumetric_speed','fan_speed_min','fan_speed_max','retraction_distance','retraction_speed','density','price'];
    const labels = ['Material','Type','Nozzle Temp','Bed Temp','Chamber','K-Value','TD','Flow Ratio','Max Vol. Speed','Fan Min','Fan Max','Retract Dist.','Retract Speed','Density','Price'];
    // Fields where lower is better
    const lowerIsBetter = new Set(['price','retraction_distance','density']);

    let html = `<div class="inv-modal-backdrop" onclick="if(event.target===this)this.remove()">
      <div class="inv-modal" style="max-width:${items.length*200+120}px">
        <div class="inv-modal-header"><span>${t('filament.db_compare')}</span><button class="inv-modal-close" onclick="this.closest('.inv-modal-backdrop').remove()">&times;</button></div>
        <div class="inv-modal-body" style="overflow-x:auto">
          <table class="data-table"><thead><tr><th></th>`;
    for (const f of items) {
      const color = f.color_hex ? window._filHelpers.hexToRgb(f.color_hex) : '#888';
      html += `<th><div style="display:flex;flex-direction:column;align-items:center;gap:4px">${typeof spoolIcon === 'function' ? spoolIcon(color, 24) : `<span class="filament-color-swatch" style="background:${color};width:20px;height:20px;border-radius:50%;display:inline-block"></span>`}<span style="font-size:0.75rem">${esc(f.manufacturer||'')}</span><span style="font-size:0.7rem" class="text-muted">${esc(f.name||f.material)}</span></div></th>`;
    }
    html += '</tr></thead><tbody>';
    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      const vals = items.map(f => f[key]);
      if (vals.every(v => v == null || v === '')) continue;
      // Find best/worst for numeric fields
      const numVals = vals.map(v => v != null ? parseFloat(v) : NaN).filter(n => !isNaN(n));
      const isNumeric = numVals.length >= 2 && !['material','material_type'].includes(key);
      const bestVal = isNumeric ? (lowerIsBetter.has(key) ? Math.min(...numVals) : Math.max(...numVals)) : null;
      const worstVal = isNumeric ? (lowerIsBetter.has(key) ? Math.max(...numVals) : Math.min(...numVals)) : null;
      html += `<tr><td style="font-weight:600;font-size:0.8rem">${labels[i]}</td>`;
      for (const v of vals) {
        let display = v != null ? String(v) : '--';
        if (key === 'price' && v) display = '$' + v;
        if (['extruder_temp','bed_temp','chamber_temp'].includes(key) && v) display += '\u00B0C';
        if (key === 'max_volumetric_speed' && v) display += ' mm\u00B3/s';
        if (['retraction_distance'].includes(key) && v) display += ' mm';
        if (['retraction_speed'].includes(key) && v) display += ' mm/s';
        if (key === 'density' && v) display += ' g/cm\u00B3';
        let style = 'font-size:0.8rem';
        if (isNumeric && v != null && bestVal !== worstVal) {
          const n = parseFloat(v);
          if (n === bestVal) style += ';color:var(--accent-green);font-weight:600';
          else if (n === worstVal) style += ';color:var(--accent-red)';
        }
        html += `<td style="${style}">${display}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // DB Browser interaction handlers
  window._dbOnSearch = function(val) {
    clearTimeout(window._fs.dbSearchTimer);
    window._fs.dbSearchTimer = setTimeout(() => {
      window._fs.dbSearch = val;
      window._fs.dbPage = 0;
      _loadDbFilaments();
    }, 300);
  };
  window._dbSetBrand = function(v) { window._fs.dbFilterBrand = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbSetMaterial = function(v) { window._fs.dbFilterMaterial = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbSetCategory = function(v) { window._fs.dbFilterCategory = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbToggleK = function(v) { window._fs.dbFilterHasK = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbToggleTd = function(v) { window._fs.dbFilterHasTd = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbToggleTranslucent = function(v) { window._fs.dbFilterTranslucent = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbToggleGlow = function(v) { window._fs.dbFilterGlow = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbToggleMultiColor = function(v) { window._fs.dbFilterMultiColor = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbSetSort = function(v) { window._fs.dbSort = v; window._fs.dbPage = 0; _loadDbFilaments(); };
  window._dbToggleSortDir = function() { window._fs.dbSortDir = window._fs.dbSortDir === 'ASC' ? 'DESC' : 'ASC'; _loadDbFilaments(); };
  window._dbSetView = function(v) { window._fs.dbViewMode = v; localStorage.setItem('db-view-mode', v); _refreshDbBrowser(); };
  window._dbPrevPage = function() { if (window._fs.dbPage > 0) { window._fs.dbPage--; _loadDbFilaments(); } };
  window._dbNextPage = function() { if ((window._fs.dbPage + 1) * window._fs.dbPageSize < window._fs.dbTotal) { window._fs.dbPage++; _loadDbFilaments(); } };
  window._dbShowDetail = _dbShowDetail;
  window._dbImport = _dbImport;
  window._dbToggleCompare = _dbToggleCompare;
  window._dbShowCompare = _dbShowCompare;
  window._dbClearCompare = function() { window._fs.dbCompare = []; _refreshDbBrowser(); };

  let _materialsCache = null;

  async function _loadMaterials() {
    const el = document.getElementById('matref-container');
    if (!el) return;
    try {
      if (!_materialsCache) {
        const res = await fetch('/api/materials');
        _materialsCache = await res.json();
      }
      _renderMaterials(_materialsCache, el);
    } catch (e) {
      el.innerHTML = `<div class="text-muted">Error: ${e.message}</div>`;
    }
  }

  function _renderMaterials(materials, el) {
    const filter = document.getElementById('matref-category-filter')?.value || '';
    const filtered = filter ? materials.filter(m => m.category === filter) : materials;
    if (!filtered.length) { el.innerHTML = `<div class="text-muted">${t('filament.no_materials')}</div>`; return; }

    let html = '<div class="fil-matref-grid">';
    for (const m of filtered) {
      const tips = m.tips ? (() => { try { return JSON.parse(m.tips); } catch { return {}; } })() : {};
      const badges = [];
      if (m.abrasive) badges.push('<span class="fil-matref-badge fil-matref-abrasive">Abrasive</span>');
      if (m.food_safe) badges.push('<span class="fil-matref-badge fil-matref-foodsafe">Food Safe</span>');
      if (m.uv_resistant) badges.push('<span class="fil-matref-badge fil-matref-uv">UV Resistant</span>');
      if (m.enclosure) badges.push('<span class="fil-matref-badge fil-matref-enclosure">Enclosure</span>');

      html += `<div class="fil-matref-card" onclick="showMaterialDetail(${m.id})">
        <div class="fil-matref-header">
          <strong>${m.material}</strong>
          <span class="fil-matref-cat">${m.category}</span>
        </div>
        <div class="fil-matref-bars">
          ${_matBar(t('filament.mat_difficulty'), m.difficulty, '#e74c3c')}
          ${_matBar(t('filament.mat_strength'), m.strength, '#3498db')}
          ${_matBar(t('filament.mat_temp_res'), m.temp_resistance, '#e67e22')}
          ${_matBar(t('filament.mat_flexibility'), m.flexibility, '#2ecc71')}
        </div>
        <div class="fil-matref-temps">
          ${m.nozzle_temp_min && m.nozzle_temp_max ? `<span>Nozzle: ${m.nozzle_temp_min}-${m.nozzle_temp_max}°C</span>` : ''}
          ${m.bed_temp_min && m.bed_temp_max ? `<span>Bed: ${m.bed_temp_min}-${m.bed_temp_max}°C</span>` : ''}
        </div>
        ${badges.length ? `<div class="fil-matref-badges">${badges.join('')}</div>` : ''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function _matBar(label, value, color) {
    const pct = (value / 5) * 100;
    return `<div class="fil-matref-bar-row"><span class="fil-matref-bar-label">${label}</span><div class="fil-matref-bar"><div class="fil-matref-bar-fill" style="width:${pct}%;background:${color}"></div></div><span class="fil-matref-bar-val">${value}/5</span></div>`;
  }

  window.filterMaterials = function() {
    if (_materialsCache) {
      const el = document.getElementById('matref-container');
      if (el) _renderMaterials(_materialsCache, el);
    }
  };

  window.showMaterialDetail = async function(id) {
    try {
      const res = await fetch(`/api/materials/${id}`);
      const m = await res.json();
      const tips = m.tips ? (() => { try { return JSON.parse(m.tips); } catch { return {}; } })() : {};

      let html = `<div class="modal-overlay" id="material-detail-modal">
        <div class="modal-content" style="max-width:500px">
          <div class="modal-header"><h3>${m.material}</h3>
            <button class="modal-close" onclick="document.getElementById('material-detail-modal').remove()">&times;</button></div>
          <div class="modal-body">
            <div class="fil-matref-detail-grid">
              <div class="fil-matref-detail-section">
                <h4>${t('filament.mat_properties')}</h4>
                ${_matBar(t('filament.mat_difficulty'), m.difficulty, '#e74c3c')}
                ${_matBar(t('filament.mat_strength'), m.strength, '#3498db')}
                ${_matBar(t('filament.mat_temp_res'), m.temp_resistance, '#e67e22')}
                ${_matBar(t('filament.mat_moisture'), m.moisture_sensitivity, '#9b59b6')}
                ${_matBar(t('filament.mat_flexibility'), m.flexibility, '#2ecc71')}
                ${_matBar(t('filament.mat_adhesion'), m.layer_adhesion, '#1abc9c')}
              </div>
              <div class="fil-matref-detail-section">
                <h4>${t('filament.mat_temps')}</h4>
                ${m.nozzle_temp_min ? `<div>Nozzle: ${m.nozzle_temp_min} - ${m.nozzle_temp_max}°C</div>` : ''}
                ${m.bed_temp_min ? `<div>Bed: ${m.bed_temp_min} - ${m.bed_temp_max}°C</div>` : ''}
                ${m.chamber_temp ? `<div>Chamber: ${m.chamber_temp}°C</div>` : ''}
                ${m.typical_density ? `<div>Density: ${m.typical_density} g/cm³</div>` : ''}
                ${m.nozzle_recommendation ? `<div>Nozzle: ${m.nozzle_recommendation}</div>` : ''}
              </div>
            </div>
            ${tips.print ? `<div class="fil-matref-tip"><strong>${t('filament.mat_tip_print')}:</strong> ${tips.print}</div>` : ''}
            ${tips.storage ? `<div class="fil-matref-tip"><strong>${t('filament.mat_tip_storage')}:</strong> ${tips.storage}</div>` : ''}
            ${tips.post ? `<div class="fil-matref-tip"><strong>${t('filament.mat_tip_post')}:</strong> ${tips.post}</div>` : ''}
          </div>
        </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', html);
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ═══ Forecast Chart ═══
  function _renderForecastChart(predictions) {
    const container = document.getElementById('forecast-chart-container');
    if (!container || !predictions?.per_spool?.length) {
      if (container) container.innerHTML = '<p class="text-muted" style="text-align:center;padding:16px;font-size:0.8rem">No usage data to forecast</p>';
      return;
    }

    const spools = predictions.per_spool
      .filter(s => s.avg_daily_g > 0 && s.remaining_weight_g > 0)
      .slice(0, 5); // Top 5 most active spools

    if (spools.length === 0) {
      container.innerHTML = '<p class="text-muted" style="text-align:center;padding:16px;font-size:0.8rem">No active spools to forecast</p>';
      return;
    }

    const days = 30;
    const W = 600, H = 200, PAD = 40;
    const colors = ['var(--accent-blue)', 'var(--accent-green)', 'var(--accent-orange)', 'var(--accent-red)', 'var(--accent-purple)'];

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-height:200px">`;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = PAD + (H - 2 * PAD) * i / 4;
      svg += `<line x1="${PAD}" y1="${y}" x2="${W - 10}" y2="${y}" stroke="var(--border-color)" stroke-width="0.5"/>`;
    }

    // X-axis labels (days)
    for (let d = 0; d <= days; d += 5) {
      const x = PAD + (W - PAD - 10) * d / days;
      svg += `<text x="${x}" y="${H - 5}" font-size="9" fill="var(--text-muted)" text-anchor="middle">${d}d</text>`;
    }

    // Max weight for Y scale
    const maxWeight = Math.max(...spools.map(s => s.remaining_weight_g));

    // Y-axis labels
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(maxWeight * (4 - i) / 4);
      const y = PAD + (H - 2 * PAD) * i / 4;
      svg += `<text x="${PAD - 4}" y="${y + 3}" font-size="9" fill="var(--text-muted)" text-anchor="end">${val}g</text>`;
    }

    // Draw lines for each spool
    spools.forEach((spool, idx) => {
      let points = [];
      for (let d = 0; d <= days; d++) {
        const remaining = Math.max(0, spool.remaining_weight_g - spool.avg_daily_g * d);
        const x = PAD + (W - PAD - 10) * d / days;
        const y = PAD + (H - 2 * PAD) * (1 - remaining / maxWeight);
        points.push(`${x},${y}`);
      }
      svg += `<polyline points="${points.join(' ')}" fill="none" stroke="${colors[idx]}" stroke-width="2" stroke-linecap="round"/>`;
    });

    svg += '</svg>';

    // Legend
    svg += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;font-size:0.7rem">';
    spools.forEach((spool, idx) => {
      const name = spool.name || spool.material || `Spool ${spool.id}`;
      const daysLeft = spool.avg_daily_g > 0 ? Math.round(spool.remaining_weight_g / spool.avg_daily_g) : '\u221E';
      svg += `<span style="display:flex;align-items:center;gap:3px"><span style="width:8px;height:8px;border-radius:50%;background:${colors[idx]}"></span>${esc(name)} (${daysLeft}d)</span>`;
    });
    svg += '</div>';

    container.innerHTML = svg;
  }

  // ═══ Expose database functions for cross-file use ═══
  window._loadDbStats = _loadDbStats;
  window._loadDbFilaments = _loadDbFilaments;
  window._refreshDbBrowser = _refreshDbBrowser;
  window._renderForecastChart = _renderForecastChart;
  window._loadMaterials = _loadMaterials;
  window._renderMaterials = _renderMaterials;


})();
