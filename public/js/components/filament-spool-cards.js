// Filament Inventory — Spool card rendering, visual spool cards, detail overlay, list/table/groups views, active filament display
(function() {

  // ═══ Spool card rendering ═══
  function _cleanProfileName(s) {
    let name = s.profile_name || s.material || '--';
    if (s.vendor_name && name.startsWith(s.vendor_name + ' ')) {
      name = name.substring(s.vendor_name.length + 1);
    }
    return name;
  }

  function renderColorSwatch(s, size) {
    const color = window._filHelpers.hexToRgb(s.color_hex);
    const pct = window._filHelpers.spoolPct(s) || 80;
    if (typeof miniSpool === 'function') return miniSpool(color, size || 16, pct);
    const bg = window._filHelpers._buildColorStyle(s.color_hex, s.multi_color_hexes, s.multi_color_direction);
    return `<span class="filament-color-swatch" style="background:${bg}"></span>`;
  }

  function renderSpoolCard(s) {
    const pct = window._filHelpers.spoolPct(s);
    const color = window._filHelpers.hexToRgb(s.color_hex);
    const isLow = (pct > 0 && pct < window._fs.lowStockPct) || (window._fs.lowStockGrams > 0 && s.remaining_weight_g > 0 && s.remaining_weight_g < window._fs.lowStockGrams);
    const isEmpty = pct === 0 && s.used_weight_g > 0;
    const lowClass = isEmpty ? 'filament-card-empty' : isLow ? 'filament-card-low' : '';
    const archivedClass = s.archived ? 'filament-card-archived' : '';
    const cleanName = window._cleanProfileName(s);
    const subtitle = [s.vendor_name, s.diameter && s.diameter !== 1.75 ? s.diameter + 'mm' : ''].filter(Boolean).join(' · ');
    // Drying status indicator
    const dryStatus = window._fs.dryingStatus.find(d => d.id === s.id);
    const dryIcon = dryStatus?.drying_status === 'overdue' ? `<span class="fil-dry-badge fil-dry-overdue" title="${t('filament.drying_status_overdue')}">&#x1F534;</span>`
      : dryStatus?.drying_status === 'due_soon' ? `<span class="fil-dry-badge" title="${t('filament.drying_status_due_soon')}">&#x1F7E1;</span>`
      : dryStatus?.drying_status === 'fresh' ? `<span class="fil-dry-badge" title="${t('filament.drying_status_fresh')}">&#x1F7E2;</span>`
      : '';
    // Compatibility check
    const compatWarnings = window._filHelpers.checkCompatibility(s);
    const compatIcon = compatWarnings.length > 0
      ? `<span class="fil-compat-warn" title="${esc(compatWarnings.join('\n'))}">&#x26A0;&#xFE0F;</span>`
      : '';
    const infoParts = [`${pct}%`];
    if (s.remaining_length_m) infoParts.push(s.remaining_length_m.toFixed(1) + 'm');
    if (s.short_id) infoParts.push('#' + s.short_id);
    if (s.location) infoParts.push('📍' + esc(s.location));
    if (s.storage_method) infoParts.push(s.storage_method === 'dry_box' ? '📦' : s.storage_method === 'vacuum_bag' ? '🫙' : '🌬');
    if (s.transmission_distance) infoParts.push('TD:' + s.transmission_distance);
    if (s.last_used_at) {
      const daysAgo = Math.floor((Date.now() - new Date(s.last_used_at).getTime()) / 86400000);
      if (daysAgo < 1) infoParts.push(t('filament.used_today'));
      else if (daysAgo < 60) infoParts.push(t('filament.days_ago', { n: daysAgo }));
      else infoParts.push(t('filament.months_ago', { n: Math.floor(daysAgo / 30) }));
    }
    if (s.archived) infoParts.push('📦');
    if (s.is_refill) infoParts.push('♻ x' + (s.refill_count || 1));
    const footerLeft = [
      s.printer_id ? '🖨 ' + esc(window._filHelpers.printerName(s.printer_id)) : '',
      s.ams_unit != null ? `AMS${s.ams_unit+1}:${(s.ams_tray||0)+1}` : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="filament-card inv-spool-card ${lowClass} ${archivedClass}" data-spool-id="${s.id}" onclick="if(!event.target.closest('button,input,a,.fil-spool-actions'))window._showSpoolDetail(${s.id})" style="cursor:pointer">
        <div class="fil-spool-top">
          <div class="fil-spool-identity">
            <input type="checkbox" class="fil-bulk-check" onclick="toggleSpoolSelect(${s.id}, this)" ${window._fs.selectedSpools.has(s.id) ? 'checked' : ''} title="${t('filament.bulk_select')}">
            ${window.renderColorSwatch(s)}
            <strong>${esc(cleanName)}</strong>
          </div>
          <div class="fil-spool-actions">
            <button class="filament-edit-btn fil-fav-btn ${s.is_favorite ? 'fil-fav-active' : ''}" onclick="toggleFavorite(${s.id})" title="${s.is_favorite ? t('filament.remove_favorite') : t('filament.add_favorite')}" data-tooltip="${s.is_favorite ? t('filament.remove_favorite') : t('filament.add_favorite')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="${s.is_favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            ${s.archived ? `<button class="filament-edit-btn" onclick="unarchiveSpoolItem(${s.id})" title="${t('filament.unarchive')}" data-tooltip="${t('filament.unarchive')}">↩</button>` : ''}
            <button class="filament-edit-btn" onclick="showSwatchLabel(${s.id})" title="${t('filament.swatch_label')}" data-tooltip="${t('filament.swatch_label')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="12" r="4"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="showSpoolTimeline(${s.id})" title="${t('filament.spool_timeline')}" data-tooltip="${t('filament.spool_timeline')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="showSpoolLabel(${s.id})" title="${t('filament.qr_label')}" data-tooltip="${t('filament.qr_label')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="duplicateSpoolItem(${s.id})" title="${t('filament.duplicate')}" data-tooltip="${t('filament.duplicate')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="showMeasureDialog(${s.id})" title="${t('filament.measure_weight')}" data-tooltip="${t('filament.measure_weight')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="showStartDryingDialog(${s.id})" title="${t('filament.start_drying')}" data-tooltip="${t('filament.start_drying')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="window.open('https://store.bambulab.com/collections/filament?q='+encodeURIComponent('${esc(s.material||'')} ${esc(s.color_name||'')}'),'_blank')" title="${t('filament.buy_reorder')}" data-tooltip="${t('filament.buy_reorder')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="showSpoolTagAssign(${s.id})" title="${t('filament.tags_title')}" data-tooltip="${t('filament.tags_title')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="showEditSpoolForm(${s.id})" title="${t('settings.edit')}" data-tooltip="${t('settings.edit')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="filament-edit-btn" onclick="showRefillDialog(${s.id})" title="${t('filament.refill_spool')}" data-tooltip="${t('filament.refill_spool')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 11-.57-8.38"/></svg>
            </button>
            ${!s.archived ? `<button class="filament-edit-btn" onclick="archiveSpoolItem(${s.id})" title="${t('filament.archive')}" data-tooltip="${t('filament.archive')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
            </button>` : ''}
            <button class="filament-delete-btn" onclick="deleteSpoolItem(${s.id})" title="${t('settings.delete')}" data-tooltip="${t('settings.delete')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        ${subtitle ? `<div class="fil-spool-subtitle">${esc(subtitle)}</div>` : ''}
        <div class="fil-bar-row">
          <div class="filament-bar">
            <div class="filament-bar-fill" style="width:${pct}%;background:${isLow || isEmpty ? 'var(--accent-orange)' : color}"></div>
          </div>
          <span class="fil-bar-weight">${window._filHelpers.spoolRemainG(s)}g / ${Math.round(s.initial_weight_g)}g</span>
        </div>
        <div class="fil-spool-info">${infoParts.join(' · ')}${dryIcon}${compatIcon}</div>
        <div class="fil-spool-footer">
          <span>${footerLeft}</span>
          <span>${s.cost ? formatCurrency(s.cost) : ''}</span>
        </div>
        ${s.tags && s.tags.length ? `<div class="fil-tag-badges">${s.tags.map(tg => `<span class="fil-tag-badge" style="--tag-color:${esc(tg.color || '#58a6ff')}">${esc(tg.name)}</span>`).join('')}</div>` : ''}
        ${s.extra_fields ? renderExtraFields(s.extra_fields) : ''}
        <div id="spool-edit-${s.id}" style="display:none"></div>
      </div>`;
  }

  // ═══ Visual spool card (history-style) ═══
  // Build SVG spool visual — front view with filament wound around hub
  // Exposed globally so other panels (multicolor, etc.) can reuse
  window._spoolSvg = _spoolSvg;
  function _spoolSvg(colorHex, multiColorHexes, multiColorDir, pct, spoolId, size) {
    const sz = size || 80;
    const hubR = 13;
    const maxR = 38;
    const filR = pct > 0 ? hubR + (maxR - hubR) * Math.max(5, pct) / 100 : hubR;

    // Determine fill — solid color or SVG gradient for multi-color
    let defs = '';
    let fillAttr = window._filHelpers.hexToRgb(colorHex);
    let hexes;
    try { hexes = multiColorHexes ? (typeof multiColorHexes === 'string' ? JSON.parse(multiColorHexes) : multiColorHexes) : null; } catch { hexes = null; }
    if (hexes && hexes.length > 1) {
      const gid = 'sg' + spoolId;
      const horiz = multiColorDir === 'longitudinal';
      defs = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="${horiz?1:0}" y2="${horiz?0:1}">`;
      hexes.forEach((h, i) => { defs += `<stop offset="${(i/(hexes.length-1)).toFixed(2)}" stop-color="${window._filHelpers.hexToRgb(h)}"/>`; });
      defs += '</linearGradient></defs>';
      fillAttr = `url(#${gid})`;
    }

    // Winding texture lines
    let windings = '';
    if (pct > 8) {
      const gap = (filR - hubR) / Math.min(5, Math.max(2, Math.round((filR - hubR) / 4)));
      for (let r = hubR + gap; r < filR - 1; r += gap) {
        windings += `<circle cx="50" cy="50" r="${r.toFixed(1)}" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="0.6"/>`;
      }
    }

    // Flange notches (4 small marks on outer edge)
    const notches = [0, 90, 180, 270].map(deg => {
      const rad = deg * Math.PI / 180;
      const x1 = 50 + 40 * Math.cos(rad), y1 = 50 + 40 * Math.sin(rad);
      const x2 = 50 + 44 * Math.cos(rad), y2 = 50 + 44 * Math.sin(rad);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--border-color)" stroke-width="1.2" opacity="0.4"/>`;
    }).join('');

    return `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" class="spool-svg">
      ${defs}
      <circle cx="50" cy="50" r="44" fill="rgba(0,0,0,0.06)"/>
      <circle cx="50" cy="50" r="42" class="spool-flange"/>
      ${notches}
      <circle cx="50" cy="50" r="${filR.toFixed(1)}" fill="${fillAttr}" class="spool-filament"/>
      ${windings}
      <circle cx="50" cy="50" r="${hubR}" class="spool-hub"/>
      <circle cx="50" cy="50" r="5" class="spool-hole"/>
    </svg>`;
  }

  function _renderSpoolVisualCard(s) {
    const pct = window._filHelpers.spoolPct(s);
    const cleanName = window._cleanProfileName(s);
    const vendorName = s.vendor_name || '--';
    const remaining = `${window._filHelpers.spoolRemainG(s)}g / ${Math.round(s.initial_weight_g)}g`;
    const isLow = (pct > 0 && pct < window._fs.lowStockPct);
    const isEmpty = pct === 0 && s.used_weight_g > 0;
    const statusColor = isEmpty ? 'var(--accent-red)' : isLow ? 'var(--accent-orange)' : 'var(--accent-green)';
    const statusText = isEmpty ? t('filament.status_empty', 'Tom') : isLow ? t('filament.status_low', 'Lav') : `${pct}%`;

    return `<div class="spool-vcard" onclick="window._showSpoolDetail(${s.id})">
      <div class="spool-vcard-thumb">
        ${_spoolSvg(s.color_hex, s.multi_color_hexes, s.multi_color_direction, pct, s.id)}
        <span class="spool-vcard-badge">${esc(s.material || '--')}</span>
        ${s.is_favorite ? '<span class="spool-vcard-fav">♥</span>' : ''}
      </div>
      <div class="spool-vcard-info">
        <div class="spool-vcard-name" title="${esc(cleanName)}">${esc(cleanName)}</div>
        <div class="spool-vcard-meta">${esc(vendorName)} · ${remaining}</div>
        <div class="spool-vcard-bottom">
          <span class="spool-vcard-pct" style="color:${statusColor}">${statusText}</span>
          <div class="spool-vcard-bar"><div class="spool-vcard-bar-fill" style="width:${pct}%;background:${statusColor}"></div></div>
        </div>
      </div>
    </div>`;
  }

  // ═══ Spool detail overlay ═══
  window._showSpoolDetail = async function(id) {
    const s = window._fs.spools.find(sp => sp.id === id);
    if (!s) return;
    const pct = window._filHelpers.spoolPct(s);
    const colorStyle = window._filHelpers._buildColorStyle(s.color_hex, s.multi_color_hexes, s.multi_color_direction);
    const isLight = window._filHelpers.isLightColor(s.color_hex);
    const textColor = isLight ? '#333' : '#fff';
    const cleanName = window._cleanProfileName(s);
    const isEmpty = pct === 0 && s.used_weight_g > 0;
    const isLow = (pct > 0 && pct < window._fs.lowStockPct);
    const statusColor = isEmpty ? 'var(--accent-red)' : isLow ? 'var(--accent-orange)' : 'var(--accent-green)';
    const statusText = isEmpty ? t('filament.status_empty', 'Tom') : isLow ? t('filament.status_low_stock', 'Lav beholdning') : t('filament.status_in_stock', 'På lager');

    const daysAgo = s.last_used_at ? Math.floor((Date.now() - new Date(s.last_used_at).getTime()) / 86400000) : null;
    const lastUsedText = daysAgo !== null ? (daysAgo < 1 ? t('filament.today', 'I dag') : daysAgo + ' ' + t('filament.days_ago', 'dager siden')) : '--';
    const amsText = s.ams_unit != null ? `AMS${s.ams_unit+1} ${t('filament.slot', 'spor')} ${(s.ams_tray||0)+1}` : '--';
    const printerText = s.printer_id ? window._filHelpers.printerName(s.printer_id) : '--';

    // Fetch print stats
    let ps = null;
    try {
      const res = await fetch(`/api/inventory/spools/${id}/print-stats`);
      if (res.ok) ps = await res.json();
    } catch {}

    const costPerG = ps ? ps.cost_per_g : 0;
    const fmtTime = (sec) => {
      if (!sec) return '--';
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      return h > 0 ? `${h}t ${m}m` : `${m}m`;
    };

    const overlay = document.createElement('div');
    overlay.className = 'ph-detail-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `<div class="ph-detail-panel spool-detail-panel">
      <button class="ph-detail-close" onclick="this.closest('.ph-detail-overlay').remove()">&times;</button>
      <div class="ph-detail-layout">
        <div class="ph-detail-left">
          <div class="spool-detail-color spool-detail-spool-bg">
            ${_spoolSvg(s.color_hex, s.multi_color_hexes, s.multi_color_direction, pct, s.id, 140)}
          </div>
          <div class="ph-detail-status-banner" style="background:${statusColor}">
            <span>${statusText} · ${pct}%</span>
          </div>
          <div class="spool-detail-bar-section">
            <div class="spool-detail-bar-wrap">
              <div class="spool-vcard-bar spool-detail-bar"><div class="spool-vcard-bar-fill spool-detail-bar-fill" style="width:${pct}%;background:${statusColor}"></div></div>
              <div class="spool-detail-weight-row">
                <span>${window._filHelpers.spoolRemainG(s)}g ${t('filament.remaining_short', 'igjen')}</span>
                <span>${Math.round(s.initial_weight_g)}g ${t('filament.total_short', 'total')}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="ph-detail-right">
          <div class="ph-detail-header">
            <h3 class="ph-detail-title">${esc(cleanName)}</h3>
          </div>
          <div class="ph-detail-grid">
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.brand', 'Merke')}</span>
              <span class="ph-detail-value">${esc(s.vendor_name || '--')}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.type', 'Materiale')}</span>
              <span class="ph-detail-value">${typeof miniSpool === 'function' ? miniSpool(window._filHelpers.hexToRgb(s.color_hex), 14) : `<span class="color-dot" style="background:${window._filHelpers.hexToRgb(s.color_hex)}"></span>`} ${esc(s.material || '--')}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.color', 'Farge')}</span>
              <span class="ph-detail-value">${esc(s.color_name || '--')}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.diameter', 'Diameter')}</span>
              <span class="ph-detail-value">${s.diameter || 1.75}mm</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.used_weight', 'Brukt')}</span>
              <span class="ph-detail-value">${Math.round(s.used_weight_g || 0)}g</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.remaining', 'Gjenstående')}</span>
              <span class="ph-detail-value">${window._filHelpers.spoolRemainG(s)}g (${pct}%)</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('common.printer', 'Printer')}</span>
              <span class="ph-detail-value">${esc(printerText)}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.ams_slot', 'AMS-plassering')}</span>
              <span class="ph-detail-value">${amsText}</span>
            </div>
            ${s.cost ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.spool_price', 'Spolpris')}</span>
              <span class="ph-detail-value">${formatCurrency(s.cost)}</span>
            </div>` : ''}
            ${costPerG > 0 ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.price_per_gram', 'Pris/gram')}</span>
              <span class="ph-detail-value">${formatCurrency(costPerG, 3)}</span>
            </div>` : ''}
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.last_used', 'Sist brukt')}</span>
              <span class="ph-detail-value">${lastUsedText}</span>
            </div>
            ${s.location ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.location', 'Plassering')}</span>
              <span class="ph-detail-value">${esc(s.location)}</span>
            </div>` : ''}
            ${s.lot_number ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.lot_number', 'Lot-nummer')}</span>
              <span class="ph-detail-value">${esc(s.lot_number)}</span>
            </div>` : ''}
          </div>
          ${ps && ps.total_prints > 0 ? `
          <div class="ph-detail-divider"></div>
          <div class="ph-detail-field ph-detail-field-wide">
            <span class="ph-detail-label">${t('filament.usage_stats', 'Bruksstatistikk')}</span>
          </div>
          <div class="ph-detail-grid">
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.total_prints', 'Antall prints')}</span>
              <span class="ph-detail-value">${ps.total_prints} (${ps.completed_prints} ${t('filament.detail_completed', 'fullført')}${ps.failed_prints > 0 ? ', ' + ps.failed_prints + ' ' + t('filament.detail_failed', 'feilet') : ''})</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.total_print_time', 'Total printtid')}</span>
              <span class="ph-detail-value">${fmtTime(ps.total_print_time_s)}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.avg_per_print', 'Snitt per print')}</span>
              <span class="ph-detail-value">${Math.round(ps.avg_per_print_g)}g</span>
            </div>
            ${ps.total_cost_used > 0 ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.cost_used', 'Filamentkostnad brukt')}</span>
              <span class="ph-detail-value">${formatCurrency(ps.total_cost_used)}</span>
            </div>` : ''}
            ${ps.remaining_value > 0 ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.remaining_value', 'Gjenværende verdi')}</span>
              <span class="ph-detail-value">${formatCurrency(ps.remaining_value)}</span>
            </div>` : ''}
            ${ps.waste_from_failed_g > 0 ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('filament.waste_failed', 'Svinn (feilede)')}</span>
              <span class="ph-detail-value">${Math.round(ps.waste_from_failed_g)}g (${formatCurrency(ps.waste_from_failed_g * costPerG)})</span>
            </div>` : ''}
          </div>
          <div class="ph-detail-divider"></div>
          <div class="ph-detail-field ph-detail-field-wide">
            <span class="ph-detail-label">${t('filament.recent_prints', 'Siste prints')}</span>
          </div>
          <div class="spool-print-list">
            ${ps.prints.slice(0, 8).map(p => `<div class="spool-print-row">
              <span class="spool-print-name" title="${esc(p.filename || '')}">${esc((p.filename || '?').replace(/\.gcode\.3mf$|\.3mf$|\.gcode$/i, '').substring(0, 35))}</span>
              <span class="spool-print-meta">${Math.round(p.used_g)}g${costPerG > 0 ? ' · ' + formatCurrency(p.cost) : ''} · ${fmtTime(p.duration_seconds)}</span>
              <span class="spool-print-status spool-print-status-${p.status}">${p.status === 'completed' ? '✓' : p.status === 'failed' ? '✗' : '−'}</span>
            </div>`).join('')}
          </div>` : `
          <div class="ph-detail-divider"></div>
          <div class="ph-detail-field ph-detail-field-wide">
            <span class="ph-detail-label">${t('filament.usage_stats', 'Bruksstatistikk')}</span>
            <span class="ph-detail-value spool-detail-muted">${t('filament.no_prints_recorded', 'Ingen prints registrert for denne spolen')}</span>
          </div>`}
          ${s.comment ? `<div class="ph-detail-divider"></div><div class="ph-detail-field ph-detail-field-wide"><span class="ph-detail-label">${t('filament.comment', 'Kommentar')}</span><span class="ph-detail-value">${esc(s.comment)}</span></div>` : ''}
          <div class="ph-detail-divider"></div>
          <div class="spool-detail-actions">
            <button class="form-btn form-btn-sm" data-ripple onclick="this.closest('.ph-detail-overlay').remove();showEditSpoolForm(${s.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              ${t('settings.edit', 'Rediger')}
            </button>
            <button class="form-btn form-btn-sm" data-ripple onclick="this.closest('.ph-detail-overlay').remove();showMeasureDialog(${s.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18"/></svg>
              ${t('filament.weigh', 'Vei')}
            </button>
            <button class="form-btn form-btn-sm" data-ripple onclick="this.closest('.ph-detail-overlay').remove();showStartDryingDialog(${s.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
              ${t('filament.dry', 'Tørk')}
            </button>
            <button class="form-btn form-btn-sm" data-ripple onclick="this.closest('.ph-detail-overlay').remove();showSpoolTimeline(${s.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${t('filament.history', 'Historikk')}
            </button>
            <button class="form-btn form-btn-sm" data-ripple onclick="this.closest('.ph-detail-overlay').remove();showSpoolLabel(${s.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              QR
            </button>
          </div>
        </div>
      </div>
    </div>`;

    document.body.appendChild(overlay);
  };

  function _renderSpoolGroups(spools) {
    const groupFn = {
      material: s => s.material || 'Unknown',
      brand: s => s.brand || 'Unknown',
      color: s => window._filHelpers._classifyColor(s.color_hex) || 'Other',
      location: s => s.location || t('filament.no_location')
    }[window._fs.groupBy] || (s => s.material || 'Unknown');
    const groups = {};
    for (const s of spools) {
      const key = groupFn(s);
      (groups[key] || (groups[key] = [])).push(s);
    }
    const sortedKeys = Object.keys(groups).sort((a, b) => a.localeCompare(b));
    let h = `<div class="inv-group-bar">
      <span class="inv-group-label">${t('filament.group_by')}:</span>
      ${[['material','material'],['brand','vendor'],['color','color'],['location','location']].map(([g, k]) =>
        `<button class="form-btn form-btn-sm inv-group-btn ${window._fs.groupBy === g ? '' : 'form-btn-ghost'}" data-ripple onclick="window._setGroupBy('${g}')">${t('filament.group_by_' + k)}</button>`
      ).join('')}
    </div>`;
    for (const key of sortedKeys) {
      const grp = groups[key];
      const totalWeight = grp.reduce((s, sp) => s + (sp.remaining_weight_g || 0), 0);
      h += `<div class="inv-group-section">
        <div class="inv-group-header">
          <span>${key}</span>
          <span class="inv-group-meta">${grp.length} ${t('filament.total_spools').toLowerCase()} &middot; ${Math.round(totalWeight)}g</span>
        </div>
        <div class="filament-grid">`;
      for (const s of grp) h += window.renderSpoolCard(s);
      h += '</div></div>';
    }
    return h;
  }

  window._setGroupBy = function(g) { window._fs.groupBy = g; localStorage.setItem('inv-group-by', g); loadFilament(); };

  function _renderSpoolList(spools) {
    let h = '<div class="inv-list-view">';
    for (const s of spools) {
      const pct = window._filHelpers.spoolPct(s);
      const color = window._filHelpers.hexToRgb(s.color_hex);
      const name = window._cleanProfileName(s);
      const favIcon = s.is_favorite ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' : '';
      h += `<div class="inv-list-row" data-spool-id="${s.id}" onclick="if(!event.target.closest('button,input,a'))window._showSpoolDetail(${s.id})" style="cursor:pointer">
        ${miniSpool(color, 14, pct)}
        <span class="inv-list-name">${favIcon} <strong>${esc(name)}</strong> <span class="text-muted">${esc(s.vendor_name || '')}</span></span>
        <span class="inv-list-material">${s.material || '--'}</span>
        <div class="inv-list-bar"><div class="filament-bar" style="width:80px;height:6px"><div class="filament-bar-fill" style="width:${pct}%;background:${(pct > 0 && pct < window._fs.lowStockPct) || (window._fs.lowStockGrams > 0 && s.remaining_weight_g > 0 && s.remaining_weight_g < window._fs.lowStockGrams) ? 'var(--accent-orange)' : color}"></div></div></div>
        <span class="inv-list-weight">${window._filHelpers.spoolRemainG(s)}g / ${Math.round(s.initial_weight_g)}g</span>
        <span class="inv-list-loc text-muted">${s.location || ''}</span>
        <span class="inv-list-cost">${s.cost ? formatCurrency(s.cost) : ''}</span>
        <span class="inv-list-actions">
          <button class="filament-edit-btn fil-fav-btn ${s.is_favorite ? 'fil-fav-active' : ''}" onclick="toggleFavorite(${s.id})" title="${t('filament.toggle_favorite')}" aria-label="${t('filament.toggle_favorite')}"><svg width="11" height="11" viewBox="0 0 24 24" fill="${s.is_favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
          <button class="filament-edit-btn" onclick="showEditSpoolForm(${s.id})" title="${t('settings.edit')}" aria-label="${t('settings.edit')}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="filament-delete-btn" onclick="deleteSpoolItem(${s.id})" title="${t('settings.delete')}" aria-label="${t('settings.delete')}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </span>
      </div>`;
    }
    h += '</div>';
    return h;
  }

  function _renderSpoolTable(spools) {
    let h = `<div class="inv-table-wrap"><table class="data-table inv-table-view">
      <thead><tr>
        <th></th><th>${t('filament.profile_name')}</th><th>${t('filament.type')}</th>
        <th>${t('filament.brand')}</th><th>${t('filament.remaining')}</th><th>%</th>
        <th>${t('filament.location')}</th><th>${t('filament.price')}</th><th>${t('common.printer')}</th><th></th>
      </tr></thead><tbody>`;
    for (const s of spools) {
      const pct = window._filHelpers.spoolPct(s);
      const color = window._filHelpers.hexToRgb(s.color_hex);
      const name = window._cleanProfileName(s);
      h += `<tr data-spool-id="${s.id}" class="${s.archived ? 'filament-card-archived' : ''}" onclick="if(!event.target.closest('button,input,a'))window._showSpoolDetail(${s.id})" style="cursor:pointer">
        <td>${miniSpool(color, 12, pct)}</td>
        <td><strong>${esc(name)}</strong>${s.is_favorite ? ' <span style="color:#e53935">♥</span>' : ''}</td>
        <td>${s.material || '--'}</td>
        <td>${esc(s.vendor_name || '--')}</td>
        <td>${window._filHelpers.spoolRemainG(s)}g / ${Math.round(s.initial_weight_g)}g</td>
        <td style="color:${(pct > 0 && pct < window._fs.lowStockPct) || (window._fs.lowStockGrams > 0 && s.remaining_weight_g > 0 && s.remaining_weight_g < window._fs.lowStockGrams) ? 'var(--accent-orange)' : 'inherit'}">${pct}%</td>
        <td>${esc(s.location || '--')}</td>
        <td>${s.cost ? formatCurrency(s.cost) : '--'}</td>
        <td>${s.printer_id ? esc(window._filHelpers.printerName(s.printer_id)) : '--'}</td>
        <td style="white-space:nowrap">
          <button class="filament-edit-btn fil-fav-btn ${s.is_favorite ? 'fil-fav-active' : ''}" onclick="toggleFavorite(${s.id})" title="${t('filament.toggle_favorite')}" aria-label="${t('filament.toggle_favorite')}"><svg width="11" height="11" viewBox="0 0 24 24" fill="${s.is_favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
          <button class="filament-edit-btn" onclick="showEditSpoolForm(${s.id})" title="${t('settings.edit')}" aria-label="${t('settings.edit')}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="filament-delete-btn" onclick="deleteSpoolItem(${s.id})" title="${t('settings.delete')}" aria-label="${t('settings.delete')}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </td>
      </tr>`;
    }
    h += '</tbody></table></div>';
    return h;
  }

  function renderExtraFields(json) {
    let obj;
    try { obj = typeof json === 'string' ? JSON.parse(json) : json; } catch { return ''; }
    if (!obj || typeof obj !== 'object' || Object.keys(obj).length === 0) return '';
    let h = '<div class="fil-extra-fields">';
    for (const [k, v] of Object.entries(obj)) {
      h += `<span class="fil-extra-field"><span class="fil-extra-key">${esc(k)}</span> ${esc(String(v))}</span>`;
    }
    h += '</div>';
    return h;
  }

  // ═══ Active filament display ═══
  function buildActiveFilamentContent() {
    const state = window.printerState;
    if (!state) return `<p class="text-muted text-sm">${t('common.no_ams_data')}</p>`;
    const ids = state.getPrinterIds();
    if (ids.length === 0) return `<p class="text-muted text-sm">${t('common.no_ams_data')}</p>`;

    let html = '';
    let hasAny = false;
    for (const id of ids) {
      const ps = state._printers[id];
      const printData = ps?.print || ps;
      const amsData = printData?.ams;
      if (!amsData?.ams || amsData.ams.length === 0) continue;
      hasAny = true;
      const name = window._filHelpers.printerName(id);
      const activeTray = amsData.tray_now;
      html += `<div class="fil-ams-printer"><div class="fil-ams-name">${esc(name)}</div><div class="fil-ams-trays">`;
      let globalSlot = 0;
      for (let u = 0; u < amsData.ams.length; u++) {
        const trays = amsData.ams[u]?.tray;
        if (!trays) continue;
        for (let i = 0; i < trays.length; i++) {
          const tray = trays[i];
          const isActive = String(globalSlot) === String(activeTray);
          if (tray && tray.tray_type) {
            const color = window._filHelpers.hexToRgbColor(tray.tray_color);
            const light = window._filHelpers.isLightColor(tray.tray_color);
            const remain = tray.remain >= 0 ? Math.round(tray.remain) : '?';
            const brand = tray.tray_sub_brands || '';
            const slotLabel = amsData.ams.length > 1 ? `AMS${u+1}:${i+1}` : `${i+1}`;
            const remColor = remain < 20 ? 'var(--accent-orange)' : 'var(--accent-green)';
            // Find linked spool
            const linkedSpool = window._fs.spools.find(sp => sp.printer_id === id && sp.ams_unit === u && sp.ams_tray === i && !sp.archived);
            html += `<div class="fil-ams-tray ${isActive ? 'fil-ams-tray-active' : ''}">
              <div class="fil-ams-color">${miniSpool(color, 18, remain)}</div>
              <div class="fil-ams-info">
                <span class="fil-ams-type">${tray.tray_type}${brand ? ' · ' + brand : ''}</span>
                ${linkedSpool ? `<span class="fil-ams-linked text-muted" style="font-size:0.65rem">🔗 ${esc(linkedSpool.profile_name || '')} (${Math.round(linkedSpool.remaining_weight_g)}g)</span>` : ''}
                <div class="fil-ams-remain-row">
                  <div class="fil-ams-remain-bar"><div class="fil-ams-remain-fill" style="width:${remain}%;background:${remColor}"></div></div>
                  <span class="fil-ams-remain-pct">${remain}%</span>
                </div>
              </div>
              <span class="fil-ams-slot">${slotLabel}</span>
            </div>`;
          }
          globalSlot++;
        }
      }
      html += '</div></div>';
    }
    if (!hasAny) html += `<p class="text-muted text-sm">${t('common.no_ams_data')}</p>`;
    return html;
  }

  // ═══ Expose rendering functions for cross-file use ═══
  window._cleanProfileName = _cleanProfileName;
  window.renderColorSwatch = renderColorSwatch;
  window.renderSpoolCard = renderSpoolCard;
  window._renderSpoolVisualCard = _renderSpoolVisualCard;
  window._renderSpoolGroups = _renderSpoolGroups;
  window._renderSpoolList = _renderSpoolList;
  window._renderSpoolTable = _renderSpoolTable;
  window.buildActiveFilamentContent = buildActiveFilamentContent;

})();
