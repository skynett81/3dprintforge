// Print History Panel — rich cards with details
(function() {
  function printerName(id) {
    return window.printerState?._printerMeta?.[id]?.name || id || '--';
  }

  function statusLabel(status) {
    const key = { completed: 'completed', failed: 'failed', cancelled: 'cancelled' }[status];
    return key ? t(`history.${key}`) : status;
  }

  function formatDuration(seconds) {
    if (!seconds) return '--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}${t('time.h')} ${m}${t('time.m')}`;
    if (m > 0) return `${m}${t('time.m')} ${s}${t('time.s')}`;
    return `${s}${t('time.s')}`;
  }

  function formatDate(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function formatDateShort(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
  }

  function colorSwatch(hex) {
    if (!hex || hex.length < 6) return '';
    const css = `#${hex.substring(0, 6)}`;
    return `<span class="history-color-swatch" style="background:${css}"></span>`;
  }

  function speedLabel(level) {
    const map = { 1: 'speed.silent', 2: 'speed.standard', 3: 'speed.sport', 4: 'speed.ludicrous' };
    return level && map[level] ? t(map[level]) : null;
  }

  window.loadHistoryPanel = loadHistory;

  async function loadHistory() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    panel.innerHTML = `<div class="history-loading"><span class="text-muted">${t('progress.waiting')}</span></div>`;

    try {
      const res = await fetch('/api/history?limit=100');
      const data = await res.json();

      if (!data.length) {
        panel.innerHTML = `<p class="text-muted">${t('history.no_records')}</p>`;
        return;
      }

      // Summary stats
      const totalPrints = data.length;
      const completed = data.filter(r => r.status === 'completed').length;
      const failed = data.filter(r => r.status === 'failed').length;
      const cancelled = data.filter(r => r.status === 'cancelled').length;
      const totalTime = data.reduce((s, r) => s + (r.duration_seconds || 0), 0);
      const totalFilament = data.reduce((s, r) => s + (r.filament_used_g || 0), 0);
      const totalLayers = data.reduce((s, r) => s + (r.layer_count || 0), 0);
      const successRate = totalPrints > 0 ? Math.round(completed / totalPrints * 100) : 0;

      let html = '';

      // Summary strip
      html += `<div class="history-summary">
        <div class="history-stat">
          <span class="history-stat-value">${totalPrints}</span>
          <span class="history-stat-label">${t('stats.total_prints')}</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-value" style="color:var(--accent-green)">${successRate}%</span>
          <span class="history-stat-label">${t('stats.success_rate')}</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-value">${formatDuration(totalTime)}</span>
          <span class="history-stat-label">${t('stats.total_time')}</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-value">${Math.round(totalFilament)}g</span>
          <span class="history-stat-label">${t('stats.filament_used')}</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-value">${totalLayers.toLocaleString()}</span>
          <span class="history-stat-label">${t('stats.total_layers')}</span>
        </div>
      </div>`;

      // Filter buttons
      html += `<div class="history-filters">
        <button class="history-filter-btn active" data-filter="all" onclick="filterHistory('all', this)">${t('stats.total')} (${totalPrints})</button>
        <button class="history-filter-btn" data-filter="completed" onclick="filterHistory('completed', this)">${t('history.completed')} (${completed})</button>
        <button class="history-filter-btn" data-filter="failed" onclick="filterHistory('failed', this)">${t('history.failed')} (${failed})</button>
        <button class="history-filter-btn" data-filter="cancelled" onclick="filterHistory('cancelled', this)">${t('history.cancelled')} (${cancelled})</button>
      </div>`;

      // Print cards
      html += '<div class="history-cards" id="history-cards">';

      for (const row of data) {
        const pillClass = `pill pill-${row.status}`;
        const fname = (row.filename || '--').replace(/\.(3mf|gcode)$/i, '');
        const startDate = formatDate(row.started_at);
        const endDate = row.finished_at ? formatDate(row.finished_at) : '--';

        html += `<div class="history-card" data-status="${row.status}">`;

        // Card header: filename + status + printer
        html += `<div class="history-card-header">
          <div class="history-card-title">
            ${colorSwatch(row.filament_color)}
            <span class="history-card-filename">${fname}</span>
          </div>
          <span class="${pillClass}">${statusLabel(row.status)}</span>
        </div>`;

        // Card body: key metrics in a grid
        html += `<div class="history-card-grid">`;

        // Printer
        html += `<div class="history-card-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="8" rx="1"/><rect x="2" y="14" width="20" height="8" rx="1"/><line x1="6" y1="18" x2="6" y2="18.01"/></svg>
          <span>${printerName(row.printer_id)}</span>
        </div>`;

        // Date
        html += `<div class="history-card-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>${formatDateShort(row.started_at)}</span>
        </div>`;

        // Duration
        html += `<div class="history-card-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${formatDuration(row.duration_seconds)}</span>
        </div>`;

        // Layers
        html += `<div class="history-card-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span>${row.layer_count || '--'} ${t('history.layers').toLowerCase()}</span>
        </div>`;

        // Filament type + amount
        html += `<div class="history-card-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          <span>${row.filament_type || '--'}${row.filament_brand ? ' · ' + row.filament_brand : ''}${row.filament_used_g ? ' · ' + row.filament_used_g + 'g' : ''}</span>
        </div>`;

        // Speed profile
        const speed = speedLabel(row.speed_level);
        if (speed) {
          html += `<div class="history-card-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>${speed}</span>
          </div>`;
        }

        html += `</div>`; // end grid

        // Expandable detail section
        html += `<div class="history-card-detail" style="display:none">
          <div class="history-detail-grid">`;

        // Start time
        html += `<div class="history-detail-row">
          <span class="history-detail-label">${t('history.started')}</span>
          <span>${startDate}</span>
        </div>`;

        // End time
        html += `<div class="history-detail-row">
          <span class="history-detail-label">${t('history.ended')}</span>
          <span>${endDate}</span>
        </div>`;

        // Nozzle temp
        if (row.nozzle_target || row.max_nozzle_temp) {
          html += `<div class="history-detail-row">
            <span class="history-detail-label">${t('temperature.nozzle')}</span>
            <span>${row.nozzle_target ? row.nozzle_target + '°C' : ''}${row.max_nozzle_temp ? ' (max ' + Math.round(row.max_nozzle_temp) + '°C)' : ''}</span>
          </div>`;
        }

        // Bed temp
        if (row.bed_target || row.max_bed_temp) {
          html += `<div class="history-detail-row">
            <span class="history-detail-label">${t('temperature.bed')}</span>
            <span>${row.bed_target ? row.bed_target + '°C' : ''}${row.max_bed_temp ? ' (max ' + Math.round(row.max_bed_temp) + '°C)' : ''}</span>
          </div>`;
        }

        // Nozzle type/diameter
        if (row.nozzle_type || row.nozzle_diameter) {
          html += `<div class="history-detail-row">
            <span class="history-detail-label">${t('printer_info.nozzle')}</span>
            <span>${row.nozzle_type || ''} ${row.nozzle_diameter ? row.nozzle_diameter + 'mm' : ''}</span>
          </div>`;
        }

        // Color changes
        if (row.color_changes > 0) {
          html += `<div class="history-detail-row">
            <span class="history-detail-label">${t('waste.color_changes')}</span>
            <span>${row.color_changes}</span>
          </div>`;
        }

        // Waste
        if (row.waste_g > 0) {
          html += `<div class="history-detail-row">
            <span class="history-detail-label">${t('waste.total_weight')}</span>
            <span>${row.waste_g}g</span>
          </div>`;
        }

        // Filename (full)
        html += `<div class="history-detail-row">
          <span class="history-detail-label">${t('history.filename')}</span>
          <span class="history-detail-mono">${row.filename || '--'}</span>
        </div>`;

        // Notes
        if (row.notes) {
          html += `<div class="history-detail-row">
            <span class="history-detail-label">${t('maintenance.notes')}</span>
            <span>${row.notes}</span>
          </div>`;
        }

        html += `</div></div>`; // end detail

        // Expand toggle
        html += `<button class="history-card-toggle" onclick="toggleHistoryDetail(this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>`;

        html += `</div>`; // end card
      }

      html += '</div>'; // end cards

      // CSV export
      html += `<div class="history-export">
        <a href="/api/history/export" class="form-btn form-btn-sm form-btn-secondary" download>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          ${t('stats.download_csv')}
        </a>
      </div>`;

      panel.innerHTML = html;
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('history.load_failed')}</p>`;
    }
  }

  window.toggleHistoryDetail = function(btn) {
    const card = btn.closest('.history-card');
    const detail = card.querySelector('.history-card-detail');
    if (!detail) return;
    const isOpen = detail.style.display !== 'none';
    detail.style.display = isOpen ? 'none' : '';
    btn.classList.toggle('open', !isOpen);
  };

  window.filterHistory = function(status, btn) {
    document.querySelectorAll('.history-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.history-card').forEach(card => {
      if (status === 'all') {
        card.style.display = '';
      } else {
        card.style.display = card.dataset.status === status ? '' : 'none';
      }
    });
  };

})();
