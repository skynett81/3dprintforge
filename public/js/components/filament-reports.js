// filament-reports.js
// Consolidated, exportable reports for the Filament inventory. Pulls the
// existing analytics + cost backend into one tabular, period-scoped view with
// CSV export — complementary to the chart-heavy Filament Analytics page.
// Self-contained IIFE; exposes window.loadReportsPanel(el).
(function () {
  'use strict';

  const t = (k, f) => (window.t ? window.t(k, f) : (typeof f === 'string' ? f : k));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => (window.formatCurrency ? window.formatCurrency(n || 0, 0) : (Math.round(n || 0) + ' kr'));
  const g = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + ' kg' : Math.round(n || 0) + ' g');

  let _el = null;
  let _days = 90;
  let _rows = [];
  let _cost = null;

  async function _json(url) { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status}`); return r.json(); }

  window.loadReportsPanel = async function (container) {
    _el = container || document.getElementById('filament-tab-reports');
    if (!_el) return;
    _el.innerHTML = `<div class="text-muted" style="padding:16px">${t('common.loading', 'Loading…')}</div>`;
    try {
      const [rows, cost] = await Promise.all([
        _json(`/api/filament-analytics/consumption?days=${_days}`),
        _json('/api/cost/summary'),
      ]);
      _rows = (Array.isArray(rows) ? rows : []).filter(r => (r.total_used_g || 0) > 0);
      _cost = cost || null;
    } catch (e) {
      _el.innerHTML = `<div class="alert alert-danger" style="margin:12px">${t('reports.load_failed', 'Could not load reports')}: ${esc(e.message)}</div>`;
      return;
    }
    _render();
  };

  window._reportsSetPeriod = function (d) { _days = parseInt(d) || 90; window.loadReportsPanel(_el); };

  function _render() {
    let used = 0, waste = 0, prints = 0, success = 0, seconds = 0;
    for (const r of _rows) {
      used += r.total_used_g || 0; waste += r.total_waste_g || 0;
      prints += r.total_prints || 0; success += r.total_success || 0;
      seconds += r.total_seconds || 0;
    }
    const wastePct = used > 0 ? Math.round((waste / (used + waste)) * 1000) / 10 : 0;
    const successPct = prints > 0 ? Math.round((success / prints) * 100) : 0;
    const hours = Math.round(seconds / 360) / 10;

    let h = `<div class="proc-head">
      <div class="ctrl-card-title" style="margin:0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        ${t('reports.title', 'Reports')}
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <select class="form-input form-input-sm" style="max-width:150px" onchange="window._reportsSetPeriod(this.value)">
          <option value="30" ${_days === 30 ? 'selected' : ''}>${t('reports.last_30', 'Last 30 days')}</option>
          <option value="90" ${_days === 90 ? 'selected' : ''}>${t('reports.last_90', 'Last 90 days')}</option>
          <option value="365" ${_days === 365 ? 'selected' : ''}>${t('reports.last_365', 'Last 12 months')}</option>
        </select>
        <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._reportsExportCsv()" title="${t('reports.export_csv', 'Export CSV')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          CSV
        </button>
      </div>
    </div>`;

    h += `<div class="inv-kpi-grid" style="margin:12px 0">
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', g(used), t('reports.consumed', 'Consumed'), `${_rows.length} ${t('filament.materials', 'materials')}`, '#22c55e')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', money(_cost?.grand_total || 0), t('reports.filament_cost', 'Filament cost'), `${_cost?.print_count || 0} ${t('reports.prints', 'prints')}`, '#e3b341')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', successPct + '%', t('reports.success_rate', 'Success rate'), `${prints} ${t('reports.prints', 'prints')} · ${hours} h`, successPct >= 90 ? '#22c55e' : '#f0883e')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', wastePct + '%', t('reports.waste', 'Waste'), g(waste), wastePct > 8 ? '#f0883e' : '#8b949e')}
    </div>`;

    if (!_rows.length) {
      h += `<div class="proc-empty"><p>${t('reports.empty', 'No print activity in this period yet.')}</p></div>`;
      _el.innerHTML = h;
      return;
    }

    const maxUsed = Math.max(..._rows.map(r => r.total_used_g || 0), 1);
    const sorted = [..._rows].sort((a, b) => (b.total_used_g || 0) - (a.total_used_g || 0));
    h += `<table class="data-table proc-table"><thead><tr>
      <th>${t('filament.filter_material', 'Material')}</th>
      <th>${t('reports.used', 'Used')}</th>
      <th>${t('reports.prints', 'Prints')}</th>
      <th>${t('reports.success', 'Success')}</th>
      <th>${t('reports.waste', 'Waste')}</th>
      <th>${t('reports.share', 'Share')}</th>
    </tr></thead><tbody>`;
    for (const r of sorted) {
      const share = Math.round(((r.total_used_g || 0) / maxUsed) * 100);
      const sr = r.total_prints > 0 ? Math.round((r.total_success / r.total_prints) * 100) : 0;
      h += `<tr>
        <td><strong>${esc(r.material || t('reports.unknown', 'Unknown'))}</strong>${r.brand ? `<div class="proc-notes">${esc(r.brand)}</div>` : ''}</td>
        <td>${g(r.total_used_g)}</td>
        <td>${r.total_prints || 0}</td>
        <td><span style="color:${sr >= 90 ? 'var(--accent-green)' : sr >= 70 ? 'var(--accent-orange)' : 'var(--accent-red)'}">${sr}%</span></td>
        <td>${r.total_waste_g ? g(r.total_waste_g) + ` <span class="text-muted">(${r.waste_pct || 0}%)</span>` : '–'}</td>
        <td><div class="rep-bar"><div class="rep-bar-fill" style="width:${share}%"></div></div></td>
      </tr>`;
    }
    h += `</tbody></table>`;
    _el.innerHTML = h;
  }

  function _kpi(icon, value, label, sub, color) {
    return `<div class="inv-kpi-card" style="--kc:${color}">
      <span class="inv-kpi-icon">${icon}</span>
      <span class="inv-kpi-body">
        <span class="inv-kpi-value">${value}</span>
        <span class="inv-kpi-label">${esc(label)}</span>
        ${sub ? `<span class="inv-kpi-sub">${esc(sub)}</span>` : ''}
      </span>
    </div>`;
  }

  window._reportsExportCsv = function () {
    const head = ['material', 'brand', 'used_g', 'waste_g', 'prints', 'success', 'fails', 'success_rate', 'waste_pct', 'avg_daily_g'];
    const lines = [head.join(',')];
    for (const r of _rows) {
      lines.push([
        r.material || '', r.brand || '', r.total_used_g || 0, r.total_waste_g || 0,
        r.total_prints || 0, r.total_success || 0, r.total_fails || 0,
        r.success_rate || 0, r.waste_pct || 0, r.avg_daily_g || 0,
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `filament-report-${_days}d.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (window.showToast) window.showToast(t('reports.exported', 'Report exported'), 'success');
  };
})();
