// Error Log Display - Enhanced with filters, search, grouping, stats
(function() {
  let _allErrors = [];
  let _activeSeverity = 'all';
  let _searchTerm = '';
  let _selectedErrorPrinter = null;

  function printerName(id) {
    return window.printerState?._printerMeta?.[id]?.name || id || '--';
  }

  function formatDate(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  function timeAgo(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('errors.just_now');
    if (mins < 60) return `${mins}${t('time.m')}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}${t('time.h')}`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }

  function severityIcon(sev) {
    switch (sev) {
      case 'fatal':
      case 'critical': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
      case 'error': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      case 'warning': return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      default: return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }
  }

  function severityColor(sev) {
    switch (sev) {
      case 'fatal':
      case 'critical': return 'var(--accent-red)';
      case 'error': return 'var(--accent-orange)';
      case 'warning': return 'var(--accent-yellow, #e3b341)';
      default: return 'var(--accent-blue)';
    }
  }

  window.loadErrorsPanel = loadErrors;

  window.changeErrorPrinter = function(value) {
    _selectedErrorPrinter = value || null;
    loadErrors();
  };

  window.filterErrorSeverity = function(severity) {
    _activeSeverity = severity;
    renderFilteredErrors();
  };

  window.searchErrors = function(term) {
    _searchTerm = term.toLowerCase();
    renderFilteredErrors();
  };

  async function loadErrors() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    const printerId = _selectedErrorPrinter;
    const params = printerId ? `?limit=100&printer_id=${printerId}` : '?limit=100';

    try {
      const res = await fetch(`/api/errors${params}`);
      _allErrors = await res.json();
      renderErrorPanel(panel);
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('errors.load_failed')}</p>`;
    }
  }

  function renderErrorPanel(panel) {
    const errors = _allErrors;

    let html = buildPrinterSelector('changeErrorPrinter', _selectedErrorPrinter);

    if (!errors.length) {
      html += `<div class="error-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="1.5" style="opacity:0.5">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p class="text-muted" style="margin-top:12px">${t('errors.no_errors')}</p>
      </div>`;
      panel.innerHTML = html;
      return;
    }

    // Summary stats
    const counts = { fatal: 0, critical: 0, error: 0, warning: 0, info: 0 };
    for (const e of errors) {
      const sev = e.severity || 'info';
      if (counts[sev] !== undefined) counts[sev]++;
      else counts.info++;
    }

    html += `<div class="error-stats-strip">
      <div class="error-stat">
        <span class="error-stat-count">${errors.length}</span>
        <span class="error-stat-label">${t('errors.total')}</span>
      </div>
      <div class="error-stat" style="color:var(--accent-red)">
        <span class="error-stat-count">${counts.fatal + counts.critical}</span>
        <span class="error-stat-label">${t('errors.critical')}</span>
      </div>
      <div class="error-stat" style="color:var(--accent-orange)">
        <span class="error-stat-count">${counts.error}</span>
        <span class="error-stat-label">${t('errors.errors')}</span>
      </div>
      <div class="error-stat" style="color:var(--accent-yellow, #e3b341)">
        <span class="error-stat-count">${counts.warning}</span>
        <span class="error-stat-label">${t('errors.warnings')}</span>
      </div>
      <div class="error-stat" style="color:var(--accent-blue)">
        <span class="error-stat-count">${counts.info}</span>
        <span class="error-stat-label">${t('errors.info')}</span>
      </div>
    </div>`;

    // Search + filter row
    html += `<div class="error-toolbar">
      <input type="text" class="form-input error-search" placeholder="${t('errors.search_placeholder')}" value="${_searchTerm}" oninput="searchErrors(this.value)">
      <div class="error-filters">
        <button class="error-filter-btn ${_activeSeverity === 'all' ? 'active' : ''}" onclick="filterErrorSeverity('all')">${t('errors.all')}</button>
        <button class="error-filter-btn ${_activeSeverity === 'critical' ? 'active' : ''}" onclick="filterErrorSeverity('critical')" style="--filter-color:var(--accent-red)">${t('errors.critical')} (${counts.fatal + counts.critical})</button>
        <button class="error-filter-btn ${_activeSeverity === 'error' ? 'active' : ''}" onclick="filterErrorSeverity('error')" style="--filter-color:var(--accent-orange)">${t('errors.errors')} (${counts.error})</button>
        <button class="error-filter-btn ${_activeSeverity === 'warning' ? 'active' : ''}" onclick="filterErrorSeverity('warning')" style="--filter-color:var(--accent-yellow, #e3b341)">${t('errors.warnings')} (${counts.warning})</button>
      </div>
    </div>`;

    // Error cards container
    html += `<div class="error-cards" id="error-cards-container"></div>`;

    panel.innerHTML = html;
    renderFilteredErrors();
  }

  function renderFilteredErrors() {
    const container = document.getElementById('error-cards-container');
    if (!container) return;

    let filtered = _allErrors;

    // Filter by severity
    if (_activeSeverity !== 'all') {
      if (_activeSeverity === 'critical') {
        filtered = filtered.filter(e => e.severity === 'fatal' || e.severity === 'critical');
      } else {
        filtered = filtered.filter(e => e.severity === _activeSeverity);
      }
    }

    // Filter by search
    if (_searchTerm) {
      filtered = filtered.filter(e =>
        (e.message || '').toLowerCase().includes(_searchTerm) ||
        (e.code || '').toLowerCase().includes(_searchTerm) ||
        printerName(e.printer_id).toLowerCase().includes(_searchTerm)
      );
    }

    if (!filtered.length) {
      container.innerHTML = `<p class="text-muted" style="text-align:center;padding:24px 0">${t('errors.no_match')}</p>`;
      return;
    }

    // Group by date
    const groups = {};
    for (const e of filtered) {
      const d = e.timestamp ? new Date(e.timestamp) : new Date();
      const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
      const key = d.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    }

    let html = '';
    for (const [date, items] of Object.entries(groups)) {
      html += `<div class="error-group">
        <div class="error-group-header">
          <span>${date}</span>
          <span class="error-group-count">${items.length}</span>
        </div>`;

      for (const e of items) {
        const sev = e.severity || 'info';
        const color = severityColor(sev);
        html += `<div class="error-card" style="--error-color:${color}">
          <div class="error-card-icon" style="color:${color}">${severityIcon(sev)}</div>
          <div class="error-card-body">
            <div class="error-card-top">
              <span class="error-card-message">${e.message || t('errors.unknown_error')}</span>
              <span class="error-card-ago">${timeAgo(e.timestamp)}</span>
            </div>
            <div class="error-card-meta">
              <span class="printer-tag">${printerName(e.printer_id)}</span>
              ${e.code ? `<span class="error-code">${e.code}</span>` : ''}
              <span class="error-card-time">${formatDate(e.timestamp)}</span>
            </div>
          </div>
          <div class="error-card-severity">
            <span class="error-severity-pill" style="background:${color}">${sev}</span>
          </div>
        </div>`;
      }
      html += '</div>';
    }

    container.innerHTML = html;
  }

})();
