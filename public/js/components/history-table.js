// Print History — Bambu Studio style
(function() {

  // ═══ Helpers ═══
  function printerName(id) {
    return window.printerState?._printerMeta?.[id]?.name || id || '--';
  }
  function statusLabel(status) {
    const map = { completed: 'completed', failed: 'failed', cancelled: 'cancelled' };
    return map[status] ? t(`history.${map[status]}`) : status;
  }
  function statusColor(status) {
    return { completed: 'var(--accent-green)', failed: 'var(--accent-red)', cancelled: 'var(--accent-orange)' }[status] || 'var(--text-muted)';
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
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function formatDateShort(iso) {
    if (!iso) return '--';
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short' });
  }
  function formatDateFull(iso) {
    if (!iso) return '--';
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function colorSwatch(hex) {
    if (!hex || hex.length < 6) return '';
    return `<span class="history-color-swatch" style="background:#${hex.substring(0, 6)}"></span>`;
  }
  function speedLabel(level) {
    const map = { 1: 'speed.silent', 2: 'speed.standard', 3: 'speed.sport', 4: 'speed.ludicrous' };
    return level && map[level] ? t(map[level]) : null;
  }
  function fmtW(g) { return g >= 1000 ? (g/1000).toFixed(1)+' kg' : Math.round(g)+'g'; }
  function barRow(lbl, pct, clr, val) { return `<div class="chart-bar-row"><span class="chart-bar-label">${lbl}</span><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${pct}%;background:${clr}"></div></div><span class="chart-bar-value">${val}</span></div>`; }
  function sRow(lbl, val, clr) { return `<div class="stats-detail-item"><span class="stats-detail-item-label">${lbl}</span><span class="stats-detail-item-value"${clr?` style="color:${clr}"`:''}>${val}</span></div>`; }

  // ═══ Status icon helper ═══
  function statusIcon(status) {
    if (status === 'completed') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    if (status === 'failed') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>';
  }

  // Placeholder thumbnail SVG
  function thumbPlaceholder(color) {
    const c = color && color.length >= 6 ? '#' + color.substring(0, 6) : '#555';
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#2a2a2a"/>
      <g transform="translate(100,100)">
        <rect x="-40" y="-30" width="80" height="60" rx="6" fill="${c}" opacity="0.7"/>
        <rect x="-30" y="-40" width="60" height="30" rx="4" fill="${c}" opacity="0.5"/>
        <circle cx="0" cy="10" r="15" fill="${c}" opacity="0.9"/>
      </g>
    </svg>`;
  }

  // ═══ Tab config ═══
  const TAB_CONFIG = {
    history: { label: 'history.tab_history', modules: ['history-summary', 'history-filters', 'history-list'] },
    stats:   { label: 'history.tab_stats',   modules: ['status-breakdown', 'duration-stats', 'temperature-stats', 'filament-breakdown', 'nozzle-stats', 'top-models', 'printer-breakdown', 'print-timeline'] }
  };
  const MODULE_SIZE = {
    'history-summary': 'full', 'history-filters': 'full', 'history-list': 'full',
    'status-breakdown': 'third', 'printer-breakdown': 'third',
    'filament-breakdown': 'full', 'duration-stats': 'third',
    'nozzle-stats': 'third', 'temperature-stats': 'third',
    'print-timeline': 'full', 'top-models': 'third'
  };

  const STORAGE_PREFIX = 'history-module-order-';
  const LOCK_KEY = 'history-layout-locked';

  let _data = [];
  let _cloudTasks = null;
  let _activeFilter = 'all';
  let _activeTab = 'history';
  let _activePrinter = 'all';
  let _locked = localStorage.getItem(LOCK_KEY) !== '0';
  let _draggedMod = null;

  // Load cloud tasks for design title enrichment
  async function _loadCloudTasks() {
    if (_cloudTasks !== null) return;
    try {
      const res = await fetch('/api/bambu-cloud/tasks');
      if (!res.ok) { _cloudTasks = []; return; }
      const data = await res.json();
      _cloudTasks = data.tasks || data || [];
    } catch { _cloudTasks = []; }
  }

  function _getCloudMatch(filename) {
    if (!_cloudTasks || !filename) return null;
    const fn = filename.toLowerCase().trim();
    return _cloudTasks.find(t => {
      const tt = (t.title || '').toLowerCase().trim();
      const dt = (t.designTitle || '').toLowerCase().trim();
      return tt === fn || dt === fn || fn.includes(tt) || fn.includes(dt) || tt.includes(fn) || dt.includes(fn);
    }) || null;
  }

  // ═══ Persistence ═══
  function getOrder(tabId) {
    try { const o = JSON.parse(localStorage.getItem(STORAGE_PREFIX + tabId)); if (Array.isArray(o)) return o; } catch (_) {}
    return TAB_CONFIG[tabId]?.modules || [];
  }
  function saveOrder(tabId) {
    const cont = document.getElementById(`history-tab-${tabId}`);
    if (!cont) return;
    const ids = [...cont.querySelectorAll('.stats-module[data-module-id]')].map(m => m.dataset.moduleId);
    localStorage.setItem(STORAGE_PREFIX + tabId, JSON.stringify(ids));
  }

  // ═══ Computed stats ═══
  function getStats(data) {
    const completed = data.filter(r => r.status === 'completed').length;
    const failed = data.filter(r => r.status === 'failed').length;
    const cancelled = data.filter(r => r.status === 'cancelled').length;
    const totalTime = data.reduce((s, r) => s + (r.duration_seconds || 0), 0);
    const totalFilament = data.reduce((s, r) => s + (r.filament_used_g || 0), 0);
    const totalLayers = data.reduce((s, r) => s + (r.layer_count || 0), 0);
    const successRate = data.length > 0 ? Math.round(completed / data.length * 100) : 0;
    return { completed, failed, cancelled, totalTime, totalFilament, totalLayers, successRate };
  }

  // ═══ Module builders ═══
  const BUILDERS = {
    'history-summary': (data) => {
      const s = getStats(data);
      return `<div class="history-summary">
        <div class="history-stat">
          <span class="history-stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="8" rx="1"/><rect x="2" y="14" width="20" height="8" rx="1"/><line x1="6" y1="18" x2="6" y2="18.01"/></svg></span>
          <span class="history-stat-value">${data.length}</span>
          <span class="history-stat-label">${t('stats.total_prints')}</span>
        </div>
        <div class="history-stat history-stat-success">
          <span class="history-stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span>
          <span class="history-stat-value">${s.successRate}%</span>
          <span class="history-stat-label">${t('stats.success_rate')}</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
          <span class="history-stat-value">${formatDuration(s.totalTime)}</span>
          <span class="history-stat-label">${t('stats.total_time')}</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></span>
          <span class="history-stat-value">${fmtW(s.totalFilament)}</span>
          <span class="history-stat-label">${t('stats.filament_used')}</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span>
          <span class="history-stat-value">${s.totalLayers.toLocaleString()}</span>
          <span class="history-stat-label">${t('stats.total_layers')}</span>
        </div>
      </div>`;
    },

    'history-filters': (data) => {
      const s = getStats(data);
      return `<div class="history-filters">
        <button class="history-filter-btn ${_activeFilter === 'all' ? 'active' : ''}" data-filter="all" data-ripple onclick="filterHistory('all', this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          ${t('stats.total')} <span class="history-filter-count">${data.length}</span>
        </button>
        <button class="history-filter-btn history-filter-completed ${_activeFilter === 'completed' ? 'active' : ''}" data-filter="completed" data-ripple onclick="filterHistory('completed', this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          ${t('history.completed')} <span class="history-filter-count">${s.completed}</span>
        </button>
        <button class="history-filter-btn history-filter-failed ${_activeFilter === 'failed' ? 'active' : ''}" data-filter="failed" data-ripple onclick="filterHistory('failed', this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ${t('history.failed')} <span class="history-filter-count">${s.failed}</span>
        </button>
        <button class="history-filter-btn history-filter-cancelled ${_activeFilter === 'cancelled' ? 'active' : ''}" data-filter="cancelled" data-ripple onclick="filterHistory('cancelled', this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          ${t('history.cancelled')} <span class="history-filter-count">${s.cancelled}</span>
        </button>
      </div>`;
    },

    'history-list': (data) => {
      let h = '<div class="ph-grid" id="history-cards">';
      for (const row of data) {
        const fname = (row.filename || '--').replace(/\.(3mf|gcode)$/i, '');
        const cloud = _getCloudMatch(row.filename);
        const displayName = cloud?.designTitle || fname;
        const display = (_activeFilter === 'all' || row.status === _activeFilter) ? '' : 'display:none;';
        const pName = printerName(row.printer_id);
        const duration = formatDuration(row.duration_seconds);
        const dateShort = formatDateShort(row.started_at);
        const thumbUrl = `/api/history/${row.id}/thumbnail`;
        const fallbackThumb = 'data:image/svg+xml,' + encodeURIComponent(thumbPlaceholder(row.filament_color));
        const plateLabel = cloud?.plateIndex ? `Plate ${cloud.plateIndex}` : '';

        h += `<div class="ph-card" data-status="${row.status}" data-id="${row.id}" style="${display}" onclick="showHistoryDetail(${row.id})">
          <div class="ph-card-thumb">
            <img src="${thumbUrl}" alt="" loading="lazy" onerror="this.src='${fallbackThumb}'">
            <span class="ph-badge">Gcode</span>
          </div>
          <div class="ph-card-info">
            <div class="ph-card-name" title="${esc(displayName)}">${esc(displayName)}</div>
            <div class="ph-card-meta">
              <span class="ph-meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${duration}</span>
              <span class="ph-meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="8" rx="1"/><rect x="2" y="14" width="20" height="8" rx="1"/><line x1="6" y1="18" x2="6" y2="18.01"/></svg> ${esc(pName)}</span>
            </div>
            <div class="ph-card-bottom">
              <span class="ph-card-date">${plateLabel ? plateLabel + '  ' : ''}${dateShort}</span>
              <span class="ph-card-status" style="color:${statusColor(row.status)}">${statusLabel(row.status)}</span>
            </div>
          </div>
        </div>`;
      }
      h += '</div>';
      const exportUrl = _activePrinter === 'all' ? '/api/history/export' : `/api/history/export?printer_id=${_activePrinter}`;
      h += `<div class="history-export"><a href="${exportUrl}" class="form-btn form-btn-sm form-btn-secondary" data-ripple download>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${t('stats.download_csv')}</a></div>`;
      return h;
    },

    'status-breakdown': (data) => {
      if (!data.length) return '';
      const s = getStats(data);
      const entries = [
        [t('history.completed'), s.completed, 'var(--accent-green)'],
        [t('history.failed'), s.failed, 'var(--accent-red)'],
        [t('history.cancelled'), s.cancelled, 'var(--accent-orange)']
      ].filter(e => e[1] > 0);
      const mx = Math.max(...entries.map(e => e[1]), 1);
      let h = `<div class="card-title">${t('history.status_breakdown')}</div><div class="chart-bars">`;
      for (const [lbl, cnt, clr] of entries) h += barRow(lbl, (cnt / mx) * 100, clr, cnt);
      h += '</div>';
      return h;
    },

    'printer-breakdown': (data) => {
      if (!data.length) return '';
      const byPrinter = {};
      for (const r of data) {
        const pid = r.printer_id || 'unknown';
        byPrinter[pid] = (byPrinter[pid] || 0) + 1;
      }
      const sorted = Object.entries(byPrinter).sort((a, b) => b[1] - a[1]);
      const mx = sorted[0]?.[1] || 1;
      let h = `<div class="card-title">${t('history.printer_breakdown')}</div><div class="chart-bars">`;
      for (const [pid, cnt] of sorted) h += barRow(esc(printerName(pid)), (cnt / mx) * 100, 'var(--accent-purple)', cnt);
      h += '</div>';
      return h;
    },

    'filament-breakdown': (data) => {
      if (!data.length) return '';
      // Group by type + color for full breakdown
      const byType = {};
      const byColor = {};
      const byBrand = {};
      for (const r of data) {
        const tp = r.filament_type || 'Unknown';
        const color = r.filament_color || '';
        const brand = r.filament_brand || 'Unknown';
        if (!byType[tp]) byType[tp] = { count: 0, weight: 0, colors: new Set() };
        byType[tp].count++;
        byType[tp].weight += r.filament_used_g || 0;
        if (color) byType[tp].colors.add(color.substring(0, 6));

        // By color
        const colorKey = color ? color.substring(0, 6) : 'none';
        if (!byColor[colorKey]) byColor[colorKey] = { count: 0, weight: 0, type: tp };
        byColor[colorKey].count++;
        byColor[colorKey].weight += r.filament_used_g || 0;

        // By brand
        if (!byBrand[brand]) byBrand[brand] = { count: 0, weight: 0 };
        byBrand[brand].count++;
        byBrand[brand].weight += r.filament_used_g || 0;
      }

      let h = `<div class="card-title">${t('history.filament_breakdown')}</div>`;
      h += '<div class="filament-breakdown-grid">';

      // Left: Type bars + Brand bars
      h += '<div class="filament-breakdown-col">';
      const sortedTypes = Object.entries(byType).sort((a, b) => b[1].count - a[1].count);
      const mxT = sortedTypes[0]?.[1].count || 1;
      h += '<div class="card-subtitle">Per type</div><div class="chart-bars">';
      for (const [tp, d] of sortedTypes) {
        const swatches = [...d.colors].map(c => `<span class="color-dot" style="background:#${c}"></span>`).join('');
        h += `<div class="chart-bar-row"><span class="chart-bar-label">${swatches} ${esc(tp)}</span><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(d.count/mxT)*100}%;background:var(--accent-blue)"></div></div><span class="chart-bar-value">${d.count} · ${fmtW(d.weight)}</span></div>`;
      }
      h += '</div>';

      const sortedBrands = Object.entries(byBrand).sort((a, b) => b[1].weight - a[1].weight);
      if (sortedBrands.length > 1 || (sortedBrands.length === 1 && sortedBrands[0][0] !== 'Unknown')) {
        const mxB = sortedBrands[0]?.[1].weight || 1;
        h += '<div class="card-subtitle" style="margin-top:12px">Per merke</div><div class="chart-bars">';
        for (const [brand, d] of sortedBrands) {
          h += barRow(esc(brand), (d.weight/mxB)*100, 'var(--accent-purple)', `${d.count}× · ${fmtW(d.weight)}`);
        }
        h += '</div>';
      }
      h += '</div>';

      // Right: Color chips
      const sortedColors = Object.entries(byColor).filter(([k]) => k !== 'none').sort((a, b) => b[1].count - a[1].count);
      if (sortedColors.length > 0) {
        h += '<div class="filament-breakdown-col">';
        h += '<div class="card-subtitle">Farger brukt</div><div class="filament-color-grid">';
        for (const [hex, d] of sortedColors) {
          const c = '#' + hex;
          const r = parseInt(hex.substring(0,2),16), g = parseInt(hex.substring(2,4),16), b = parseInt(hex.substring(4,6),16);
          const light = (r*299+g*587+b*114)/1000 > 160;
          h += `<div class="filament-color-chip" style="background:${c};color:${light?'#333':'#fff'}">
            <span class="filament-color-type">${esc(d.type)}</span>
            <span class="filament-color-stats">${d.count}× · ${fmtW(d.weight)}</span>
          </div>`;
        }
        h += '</div></div>';
      }

      h += '</div>';
      return h;
    },

    'duration-stats': (data) => {
      if (!data.length) return '';
      const s = getStats(data);
      const durations = data.filter(r => r.duration_seconds > 0).map(r => r.duration_seconds);
      const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
      const longest = durations.length > 0 ? Math.max(...durations) : 0;
      const longestRow = data.find(r => r.duration_seconds === longest);
      const avgFilament = data.length > 0 ? Math.round(s.totalFilament / data.length) : 0;
      let h = `<div class="card-title">${t('history.duration_stats')}</div><div class="stats-detail-list">`;
      h += sRow(t('stats.avg_duration'), formatDuration(avgDuration));
      h += sRow(t('stats.longest_print'), `${formatDuration(longest)}${longestRow ? ' — ' + esc((longestRow.filename || '').replace(/\.(3mf|gcode)$/i, '')) : ''}`);
      h += sRow(t('stats.avg_filament'), `${avgFilament}g`);
      h += sRow(t('stats.total_time'), formatDuration(s.totalTime));
      h += '</div>';
      return h;
    },

    'nozzle-stats': (data) => {
      if (!data.length) return '';
      const byNozzle = {};
      let totalLayers = 0;
      for (const r of data) {
        const key = r.nozzle_type && r.nozzle_diameter
          ? `${r.nozzle_type} ${r.nozzle_diameter}mm`
          : r.nozzle_diameter ? `${r.nozzle_diameter}mm` : null;
        if (key) {
          if (!byNozzle[key]) byNozzle[key] = { count: 0, time: 0, layers: 0 };
          byNozzle[key].count++;
          byNozzle[key].time += r.duration_seconds || 0;
          byNozzle[key].layers += r.layer_count || 0;
        }
        totalLayers += r.layer_count || 0;
      }
      const sorted = Object.entries(byNozzle).sort((a, b) => b[1].count - a[1].count);
      if (!sorted.length) return '';
      const mx = sorted[0][1].count;
      let h = `<div class="card-title">Dysestatistikk</div><div class="chart-bars">`;
      for (const [nz, d] of sorted) {
        h += barRow(esc(nz), (d.count / mx) * 100, 'var(--accent-orange, #f0883e)', `${d.count}× · ${formatDuration(d.time)}`);
      }
      h += '</div>';
      h += `<div class="stats-detail-list" style="margin-top:10px">`;
      h += sRow('Totalt lag printet', totalLayers.toLocaleString());
      const speedLevels = data.filter(r => r.speed_level != null);
      if (speedLevels.length > 0) {
        const speedNames = { 1: 'Stille', 2: 'Standard', 3: 'Sport', 4: 'Ludicrous' };
        const bySp = {};
        for (const r of speedLevels) {
          const name = speedNames[r.speed_level] || `Nivå ${r.speed_level}`;
          bySp[name] = (bySp[name] || 0) + 1;
        }
        const topSpeed = Object.entries(bySp).sort((a, b) => b[1] - a[1]);
        h += sRow('Mest brukte hastighet', topSpeed[0] ? `${topSpeed[0][0]} (${topSpeed[0][1]}×)` : '--');
      }
      h += '</div>';
      return h;
    },

    'temperature-stats': (data) => {
      if (!data.length) return '';
      const nozzleTemps = data.filter(r => r.max_nozzle_temp > 100).map(r => r.max_nozzle_temp);
      const bedTemps = data.filter(r => r.max_bed_temp > 0).map(r => r.max_bed_temp);
      if (!nozzleTemps.length && !bedTemps.length) return '';

      let h = `<div class="card-title">Temperaturstatistikk</div><div class="stats-detail-list">`;
      if (nozzleTemps.length) {
        const avg = Math.round(nozzleTemps.reduce((a, b) => a + b, 0) / nozzleTemps.length);
        const max = Math.max(...nozzleTemps);
        const min = Math.min(...nozzleTemps);
        h += sRow('Dyse gjennomsnitt', `${avg}°C`);
        h += sRow('Dyse maks', `${max}°C`);
        h += sRow('Dyse min', `${min}°C`);
      }
      if (bedTemps.length) {
        const avg = Math.round(bedTemps.reduce((a, b) => a + b, 0) / bedTemps.length);
        const max = Math.max(...bedTemps);
        h += sRow('Bed gjennomsnitt', `${avg}°C`);
        h += sRow('Bed maks', `${max}°C`);
      }
      const wasteTotal = data.reduce((s, r) => s + (r.waste_g || 0), 0);
      if (wasteTotal > 0) h += sRow('Total filamentsvinn', fmtW(wasteTotal));
      const colorChanges = data.reduce((s, r) => s + (r.color_changes || 0), 0);
      if (colorChanges > 0) h += sRow('Fargebytter totalt', colorChanges);
      h += '</div>';
      return h;
    },

    'print-timeline': (data) => {
      if (!data.length) return '';
      // Group prints by day
      const byDay = {};
      for (const r of data) {
        if (!r.started_at) continue;
        const day = r.started_at.substring(0, 10);
        if (!byDay[day]) byDay[day] = { count: 0, time: 0, success: 0 };
        byDay[day].count++;
        byDay[day].time += r.duration_seconds || 0;
        if (r.status === 'completed') byDay[day].success++;
      }
      const days = Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0]));
      if (days.length < 2) return '';

      const maxCount = Math.max(...days.map(d => d[1].count), 1);
      let h = `<div class="card-title">Printtidslinje</div>`;
      h += `<div class="timeline-chart">`;
      for (const [day, d] of days) {
        const pct = (d.count / maxCount) * 100;
        const dateLabel = day.substring(5); // MM-DD
        const successRate = d.count > 0 ? Math.round(d.success / d.count * 100) : 0;
        const color = successRate === 100 ? 'var(--accent-green)' : successRate >= 50 ? 'var(--accent-orange, #f0883e)' : 'var(--accent-red)';
        h += `<div class="timeline-bar" title="${day}: ${d.count} prints, ${formatDuration(d.time)}">
          <div class="timeline-bar-fill" style="height:${pct}%;background:${color}"></div>
          <span class="timeline-bar-label">${dateLabel}</span>
          <span class="timeline-bar-count">${d.count}</span>
        </div>`;
      }
      h += '</div>';

      // Activity summary
      const totalDays = days.length;
      const first = days[0][0];
      const last = days[days.length - 1][0];
      const span = Math.max(1, Math.round((new Date(last) - new Date(first)) / 86400000));
      const activePct = Math.round(totalDays / span * 100);
      h += `<div class="stats-detail-list" style="margin-top:10px">`;
      h += sRow('Aktive printdager', `${totalDays} av ${span} dager (${activePct}%)`);
      h += sRow('Prints per dag (snitt)', (data.length / totalDays).toFixed(1));
      const byHour = Array(24).fill(0);
      for (const r of data) {
        if (!r.started_at) continue;
        const h24 = new Date(r.started_at).getHours();
        byHour[h24]++;
      }
      const peakHour = byHour.indexOf(Math.max(...byHour));
      h += sRow('Mest aktive time', `${String(peakHour).padStart(2,'0')}:00 – ${String(peakHour+1).padStart(2,'0')}:00 (${byHour[peakHour]} prints)`);
      h += '</div>';
      return h;
    },

    'top-models': (data) => {
      if (!data.length) return '';
      const byModel = {};
      for (const r of data) {
        const name = (r.filename || 'Ukjent').replace(/\.(3mf|gcode)$/i, '');
        if (!byModel[name]) byModel[name] = { count: 0, time: 0, success: 0, fail: 0 };
        byModel[name].count++;
        byModel[name].time += r.duration_seconds || 0;
        if (r.status === 'completed') byModel[name].success++;
        if (r.status === 'failed') byModel[name].fail++;
      }
      const sorted = Object.entries(byModel).sort((a, b) => b[1].count - a[1].count).slice(0, 10);
      const mx = sorted[0]?.[1].count || 1;
      let h = `<div class="card-title">Mest printede modeller</div><div class="chart-bars">`;
      for (const [name, d] of sorted) {
        const failTag = d.fail > 0 ? ` <span style="color:var(--accent-red);font-size:0.7rem">(${d.fail} feilet)</span>` : '';
        h += barRow(esc(name.length > 30 ? name.substring(0, 28) + '…' : name), (d.count / mx) * 100, 'var(--accent-green)', `${d.count}×${failTag}`);
      }
      h += '</div>';
      return h;
    }
  };

  // ═══ Detail overlay ═══
  function showDetail(id) {
    const row = _data.find(r => r.id === id);
    if (!row) return;

    const fname = (row.filename || '--').replace(/\.(3mf|gcode)$/i, '');
    const cloud = _getCloudMatch(row.filename);
    const displayName = cloud?.designTitle || fname;
    const pName = printerName(row.printer_id);
    const speed = speedLabel(row.speed_level);
    const filWeight = row.filament_used_g ? (cloud?.weight || row.filament_used_g) + 'g' : '--';
    const filBrand = row.filament_brand || '--';
    const filType = row.filament_type || '--';
    const filColorHex = row.filament_color && row.filament_color.length >= 6 ? '#' + row.filament_color.substring(0, 6) : null;
    const traySlot = row.tray_id != null && row.tray_id !== '255' ? `A${parseInt(row.tray_id) + 1}` : row.tray_id === '255' ? 'Ext' : '--';
    const amsUsed = row.ams_units_used ? `${row.ams_units_used} enhet${row.ams_units_used > 1 ? 'er' : ''}` : '--';
    const thumbUrl = `/api/history/${row.id}/thumbnail`;
    const fallbackThumb = 'data:image/svg+xml,' + encodeURIComponent(thumbPlaceholder(row.filament_color));
    const nozzleText = [row.nozzle_type, row.nozzle_diameter ? row.nozzle_diameter + 'mm' : ''].filter(Boolean).join(' ') || '--';
    const plateLabel = cloud?.plateName || (cloud?.plateIndex ? `Plate ${cloud.plateIndex}` : '');

    // Build filament chip with color swatch
    let filChip = '';
    if (row.filament_type) {
      const fColor = filColorHex || '#888';
      filChip = `<div class="ph-detail-filament-chip">
        <div class="ph-fil-swatch" style="background:${fColor}"></div>
        <div class="ph-fil-chip-info">
          <span class="ph-fil-chip-brand">${esc(filBrand)}</span>
          <span class="ph-fil-chip-type">${esc(filType)}${filWeight !== '--' ? ' · ' + filWeight : ''}</span>
          <span class="ph-fil-chip-slot">${traySlot}</span>
        </div>
      </div>`;
    }

    const overlay = document.createElement('div');
    overlay.className = 'ph-detail-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    // Build temperature info
    const tempInfo = [];
    if (row.max_nozzle_temp > 0) tempInfo.push(`Dyse: ${row.max_nozzle_temp}°C`);
    if (row.max_bed_temp > 0) tempInfo.push(`Bed: ${row.max_bed_temp}°C`);
    const tempText = tempInfo.length ? tempInfo.join(' · ') : '--';

    overlay.innerHTML = `<div class="ph-detail-panel">
      <button class="ph-detail-close" onclick="this.closest('.ph-detail-overlay').remove()">&times;</button>
      <div class="ph-detail-layout">
        <div class="ph-detail-left">
          <div class="ph-detail-thumb">
            <img src="${thumbUrl}" alt="" onerror="this.src='${fallbackThumb}'">
            <span class="ph-badge">Gcode</span>
          </div>
          <div class="ph-detail-status-banner" style="background:${statusColor(row.status)}">
            ${statusIcon(row.status)}
            <span>${statusLabel(row.status)}</span>
          </div>
          ${filChip ? `<div class="ph-detail-filaments-section">
            <span class="ph-detail-label">Filaments</span>
            ${filChip}
          </div>` : ''}
        </div>
        <div class="ph-detail-right">
          <div class="ph-detail-header">
            <h3 class="ph-detail-title">${esc(displayName)}</h3>
          </div>
          <div class="ph-detail-grid">
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('common.printer')}</span>
              <span class="ph-detail-value">${esc(pName)}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('history.duration')}</span>
              <span class="ph-detail-value">${formatDuration(row.duration_seconds)}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">Filamentmerke</span>
              <span class="ph-detail-value">${esc(filBrand)}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">Filamenttype</span>
              <span class="ph-detail-value">${filColorHex ? `<span class="color-dot" style="background:${filColorHex}"></span> ` : ''}${esc(filType)}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">Vekt brukt</span>
              <span class="ph-detail-value">${filWeight}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('history.layers')}</span>
              <span class="ph-detail-value">${row.layer_count || '--'}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">AMS-spor</span>
              <span class="ph-detail-value">${traySlot}</span>
            </div>
            ${speed ? `<div class="ph-detail-field">
              <span class="ph-detail-label">${t('speed.label').replace(':','')}</span>
              <span class="ph-detail-value">${speed}</span>
            </div>` : ''}
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('printer_info.nozzle')}</span>
              <span class="ph-detail-value">${nozzleText}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">Temperaturer</span>
              <span class="ph-detail-value">${tempText}</span>
            </div>
            <div class="ph-detail-field ph-detail-cost-field" data-id="${row.id}" data-filament-g="${row.filament_used_g || 0}" data-duration-s="${row.duration_seconds || 0}">
              <span class="ph-detail-label">${t('filament.cost_estimate')}</span>
              <span class="ph-detail-value ph-detail-cost-value">--</span>
            </div>
            ${plateLabel ? `<div class="ph-detail-field">
              <span class="ph-detail-label">Plate</span>
              <span class="ph-detail-value">${esc(plateLabel)}</span>
            </div>` : ''}
          </div>
          <div class="ph-detail-divider"></div>
          <div class="ph-detail-grid">
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('history.started')}</span>
              <span class="ph-detail-value">${formatDateFull(row.started_at)}</span>
            </div>
            <div class="ph-detail-field">
              <span class="ph-detail-label">${t('history.ended')}</span>
              <span class="ph-detail-value">${formatDateFull(row.finished_at)}</span>
            </div>
          </div>
          <div class="ph-detail-divider"></div>
          <div class="ph-detail-footer-fields">
            <div class="ph-detail-field ph-detail-field-wide">
              <span class="ph-detail-label">${t('history.filename')}</span>
              <span class="ph-detail-value ph-detail-mono">${esc(row.filename) || '--'}</span>
            </div>
            ${row.notes ? `<div class="ph-detail-field ph-detail-field-wide">
              <span class="ph-detail-label">${t('maintenance.notes')}</span>
              <span class="ph-detail-value">${esc(row.notes)}</span>
            </div>` : ''}
          </div>
        </div>
      </div>
    </div>`;

    document.body.appendChild(overlay);

    // Load cost estimate
    const costField = overlay.querySelector('.ph-detail-cost-field');
    if (costField) {
      const fg = parseFloat(costField.dataset.filamentG) || 0;
      const ds = parseInt(costField.dataset.durationS) || 0;
      if (fg > 0 || ds > 0) {
        fetch(`/api/inventory/cost-estimate?filament_g=${fg}&duration_s=${ds}`)
          .then(r => r.json())
          .then(cost => {
            if (cost.total_cost > 0) {
              const el = costField.querySelector('.ph-detail-cost-value');
              if (el) el.textContent = formatCurrency(cost.total_cost);
            }
          }).catch(() => {});
      }
    }
  }

  // ═══ Tab switching ═══
  function switchTab(tabId) {
    _activeTab = tabId;
    document.querySelectorAll('.history-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    document.querySelectorAll('.history-tab-panel').forEach(p => {
      const isActive = p.id === `history-tab-${tabId}`;
      p.classList.toggle('active', isActive);
      p.style.display = isActive ? 'grid' : 'none';
      if (isActive) {
        p.classList.add('ix-tab-panel');
        p.addEventListener('animationend', () => p.classList.remove('ix-tab-panel'), { once: true });
      }
    });
    const slug = tabId === 'history' ? 'history' : `history/${tabId}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
  }

  // ═══ Module Drag & Drop ═══
  function initModuleDrag(container, tabId) {
    container.addEventListener('dragstart', e => {
      const mod = e.target.closest('.stats-module');
      if (!mod || _locked) { e.preventDefault(); return; }
      _draggedMod = mod;
      mod.classList.add('stats-module-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    });
    container.addEventListener('dragover', e => {
      e.preventDefault();
      if (!_draggedMod || _locked) return;
      e.dataTransfer.dropEffect = 'move';
      const target = e.target.closest('.stats-module');
      if (target && target !== _draggedMod) {
        const rect = target.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) container.insertBefore(_draggedMod, target);
        else container.insertBefore(_draggedMod, target.nextSibling);
      }
    });
    container.addEventListener('drop', e => {
      e.preventDefault();
      if (_draggedMod) { _draggedMod.classList.remove('stats-module-dragging'); saveOrder(tabId); _draggedMod = null; }
    });
    container.addEventListener('dragend', () => {
      if (_draggedMod) { _draggedMod.classList.remove('stats-module-dragging'); _draggedMod = null; }
    });
  }

  // ═══ Main render ═══
  async function loadHistory() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    panel.innerHTML = `<div class="history-loading"><span class="text-muted">${t('progress.waiting')}</span></div>`;

    const hashParts = location.hash.replace('#', '').split('/');
    if (hashParts[0] === 'history' && hashParts[1]) {
      if (hashParts[1] === 'printer' && hashParts[2]) {
        _activePrinter = hashParts[2];
      } else if (TAB_CONFIG[hashParts[1]]) {
        _activeTab = hashParts[1];
      } else if (['completed', 'failed', 'cancelled'].includes(hashParts[1])) {
        _activeFilter = hashParts[1];
        _activeTab = 'history';
      }
    }

    try {
      const [histRes] = await Promise.all([fetch('/api/history?limit=100'), _loadCloudTasks()]);
      _data = await histRes.json();

      if (!_data.length) {
        panel.innerHTML = `<p class="text-muted">${t('history.no_records')}</p>`;
        return;
      }

      const filteredData = _activePrinter === 'all'
        ? _data : _data.filter(r => r.printer_id === _activePrinter);

      let html = '<div class="history-layout">';

      // Toolbar
      const lockIcon = _locked
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>';
      html += `<div class="stats-toolbar">
        <button class="speed-btn ${_locked ? '' : 'active'}" onclick="toggleHistoryLock()" title="${_locked ? t('history.layout_locked') : t('history.layout_unlocked')}">
          ${lockIcon} <span>${_locked ? t('history.layout_locked') : t('history.layout_unlocked')}</span>
        </button>
      </div>`;

      // Printer tab bar
      const printerIds = [...new Set(_data.map(r => r.printer_id))];
      if (printerIds.length > 1) {
        html += '<div class="tabs history-printer-tabs">';
        html += `<button class="tab-btn ${_activePrinter === 'all' ? 'active' : ''}" onclick="filterHistoryPrinter('all')">${t('history.all_printers')}</button>`;
        for (const pid of printerIds) {
          html += `<button class="tab-btn ${_activePrinter === pid ? 'active' : ''}" onclick="filterHistoryPrinter('${pid}')">${esc(printerName(pid))}</button>`;
        }
        html += '</div>';
      }

      // Tab bar
      html += '<div class="tabs">';
      for (const [id, cfg] of Object.entries(TAB_CONFIG)) {
        html += `<button class="tab-btn history-tab-btn ${id === _activeTab ? 'active' : ''}" data-tab="${id}" onclick="switchHistoryTab('${id}')">${t(cfg.label)}</button>`;
      }
      html += '</div>';

      // Tab panels
      for (const [tabId, cfg] of Object.entries(TAB_CONFIG)) {
        const order = getOrder(tabId);
        html += `<div class="tab-panel history-tab-panel stats-tab-panel stagger-in ${tabId === _activeTab ? 'active' : ''}" id="history-tab-${tabId}" style="display:${tabId === _activeTab ? 'grid' : 'none'}">`;
        let _si = 0;
        for (const modId of order) {
          const builder = BUILDERS[modId];
          if (!builder) continue;
          const content = builder(filteredData);
          if (!content) continue;
          const draggable = _locked ? '' : 'draggable="true"';
          const unlocked = _locked ? '' : ' stats-module-unlocked';
          const size = MODULE_SIZE[modId] || 'full';
          const span = size === 'full' ? 'grid-column:1/-1;' : size === 'half' ? 'grid-column:span 2;' : '';
          html += `<div class="stats-module${unlocked}" data-module-id="${modId}" ${draggable} style="${span}--i:${_si++};">`;
          if (!_locked) html += '<div class="stats-module-handle" title="Drag to reorder">&#x2630;</div>';
          html += content;
          html += '</div>';
        }
        html += '</div>';
      }

      html += '</div>';
      panel.innerHTML = html;

      for (const tabId of Object.keys(TAB_CONFIG)) {
        const cont = document.getElementById(`history-tab-${tabId}`);
        if (cont) initModuleDrag(cont, tabId);
      }
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('history.load_failed')}</p>`;
    }
  }

  // ═══ Global API ═══
  window.loadHistoryPanel = loadHistory;
  window.switchHistoryTab = switchTab;
  window.showHistoryDetail = showDetail;
  window.toggleHistoryLock = function() {
    _locked = !_locked;
    localStorage.setItem(LOCK_KEY, _locked ? '1' : '0');
    loadHistory();
  };

  window.toggleHistoryDetail = function(btn) {
    const card = btn.closest('.history-card-content') || btn.closest('.history-card');
    const detail = card.querySelector('.history-card-detail');
    if (!detail) return;
    const isOpen = detail.style.display !== 'none';
    detail.style.display = isOpen ? 'none' : '';
    btn.classList.toggle('open', !isOpen);
  };

  window.filterHistoryPrinter = function(printerId) {
    _activePrinter = printerId;
    const slug = printerId === 'all' ? 'history' : `history/printer/${printerId}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    loadHistory();
  };

  window.filterHistory = function(status, btn) {
    _activeFilter = status;
    const slug = status === 'all' ? 'history' : `history/${status}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    document.querySelectorAll('.history-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) {
      btn.classList.add('active');
    } else {
      document.querySelectorAll('.history-filter-btn').forEach(b => {
        const match = b.getAttribute('onclick')?.match(/filterHistory\('(\w+)'/);
        if (match && match[1] === status) b.classList.add('active');
      });
    }
    document.querySelectorAll('.ph-card').forEach(card => {
      card.style.display = (status === 'all' || card.dataset.status === status) ? '' : 'none';
    });
  };

})();
