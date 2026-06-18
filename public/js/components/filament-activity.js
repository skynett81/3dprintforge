// filament-activity.js
// Stock Activity — the unified, immutable ledger view (Procurement Phase 3,
// InvenTree StockItemTracking). One chronological feed of every stock movement
// across all spools: print consumption, manual adjustments, purchase-order
// receipts, lifecycle events and location moves. Also hosts the manual "Adjust
// stock" action (count/correct a spool with an audited reason).
// Self-contained IIFE; exposes window.loadActivityPanel(el).
(function () {
  'use strict';

  const t = (k, f) => (window.t ? window.t(k, f) : (typeof f === 'string' ? f : k));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (m, k) => (window.showToast ? window.showToast(m, k) : void 0);

  // Map ledger entry types → icon + accent + label. `consume` is a negative
  // delta (print used filament); `receive`/`add` are positive (stock in).
  const TYPES = {
    consume:   { label: 'Consumed', color: '#f0883e', icon: '<path d="M5 12h14"/>' },
    adjust:    { label: 'Adjusted', color: '#a855f7', icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>' },
    receive:   { label: 'Received', color: '#22c55e', icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
    add:       { label: 'Added', color: '#22c55e', icon: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' },
    created:   { label: 'Created', color: '#3b82f6', icon: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' },
    checkout:  { label: 'Checked out', color: '#06b6d4', icon: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>' },
    checkin:   { label: 'Checked in', color: '#06b6d4', icon: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>' },
    move:      { label: 'Moved', color: '#06b6d4', icon: '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><line x1="12" y1="2" x2="12" y2="22"/>' },
    archived:  { label: 'Archived', color: 'var(--text-muted)', icon: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>' },
    refilled:  { label: 'Refilled', color: '#22c55e', icon: '<path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>' },
    adjusted:  { label: 'Adjusted', color: '#a855f7', icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>' },
  };
  const FILTERS = [
    { key: '', label: 'All' },
    { key: 'consume', label: 'Consumed' },
    { key: 'adjust', label: 'Adjusted' },
    { key: 'receive', label: 'Received' },
  ];

  let _feed = [];
  let _spools = [];
  let _el = null;
  let _filter = '';

  async function _fetchJson(url, opts) {
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
  }

  window.loadActivityPanel = async function (container) {
    _el = container || document.getElementById('filament-tab-activity');
    if (!_el) return;
    _el.innerHTML = `<div class="text-muted" style="padding:16px">${t('common.loading', 'Loading…')}</div>`;
    try {
      const [feed, spools] = await Promise.all([
        _fetchJson(`/api/inventory/stock-activity?limit=200${_filter ? '&type=' + _filter : ''}`),
        _fetchJson('/api/inventory/spools'),
      ]);
      _feed = Array.isArray(feed) ? feed : [];
      _spools = Array.isArray(spools) ? spools : (spools.rows || spools.spools || []);
    } catch (e) {
      _el.innerHTML = `<div class="alert alert-danger" style="margin:12px">${t('stockact.load_failed', 'Could not load activity')}: ${esc(e.message)}</div>`;
      return;
    }
    _render();
  };

  function _reload() { return window.loadActivityPanel(_el); }

  function _fmtTime(ts) {
    if (!ts) return '';
    const d = new Date(String(ts).replace(' ', 'T') + (String(ts).includes('Z') ? '' : 'Z'));
    if (isNaN(d.getTime())) return String(ts).slice(0, 16);
    if (window.formatRelativeTime) return window.formatRelativeTime(d);
    return d.toLocaleString();
  }

  function _render() {
    let h = `<div class="proc-head">
      <div class="ctrl-card-title" style="margin:0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        ${t('stockact.title', 'Stock activity')}
      </div>
      <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._adjShow()" ${_spools.length ? '' : 'disabled'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
        ${t('stockact.adjust', 'Adjust stock')}
      </button>
    </div>`;

    // Type filter pills
    h += `<div class="act-filters">`;
    for (const f of FILTERS) {
      h += `<button class="act-filter${_filter === f.key ? ' active' : ''}" data-ripple onclick="window._actFilter('${f.key}')">${t('stockact.f_' + (f.key || 'all'), f.label)}</button>`;
    }
    h += `</div>`;

    h += `<div id="adj-form-host"></div>`;

    if (!_feed.length) {
      h += `<div class="proc-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <p>${t('stockact.empty', 'No stock movements yet. Consumption, receipts and adjustments will appear here.')}</p>
      </div>`;
      _el.innerHTML = h;
      return;
    }

    h += `<div class="act-feed">`;
    for (const e of _feed) {
      const meta = TYPES[e.type] || { label: e.type, color: 'var(--text-muted)', icon: '<circle cx="12" cy="12" r="3"/>' };
      const sw = e.spool_color ? `<span class="act-swatch" style="background:#${esc(String(e.spool_color).replace(/^#/, ''))}"></span>` : '';
      const delta = e.delta_g != null ? `<span class="act-delta ${e.delta_g < 0 ? 'neg' : 'pos'}">${e.delta_g > 0 ? '+' : ''}${Math.round(e.delta_g)} g</span>` : '';
      const ref = e.ref_type === 'po' && e.ref_id ? `<span class="act-ref">PO #${e.ref_id}</span>`
        : (e.ref_type === 'print' && e.ref_id ? `<span class="act-ref">${t('stockact.print', 'Print')} #${e.ref_id}</span>` : '');
      const moved = (e.location_from || e.location_to) ? `<span class="act-ref">${esc(e.location_from || '?')} → ${esc(e.location_to || '?')}</span>` : '';
      const reason = e.reason ? `<span class="act-reason">${esc(String(e.reason).replace(/^\{.*\}$/, '').slice(0, 80))}</span>` : '';
      h += `<div class="act-row">
        <span class="act-icon" style="color:${meta.color};background:color-mix(in srgb, ${meta.color} 14%, transparent)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${meta.icon}</svg></span>
        <span class="act-body">
          <span class="act-line1">${sw}<strong>${esc(e.spool_label || t('stockact.unknown_spool', 'Spool'))}</strong> <span class="act-type">${t('stockact.t_' + e.type, meta.label)}</span> ${delta}</span>
          <span class="act-line2">${reason}${ref}${moved}</span>
        </span>
        <span class="act-time" title="${esc(String(e.timestamp || ''))}">${esc(_fmtTime(e.timestamp))}</span>
      </div>`;
    }
    h += `</div>`;
    _el.innerHTML = h;
  }

  window._actFilter = function (key) { _filter = key; _reload(); };

  // ── Manual stock adjustment dialog ──
  window._adjShow = function (spoolId) {
    const host = document.getElementById('adj-form-host');
    if (!host) return;
    const opts = [..._spools]
      .filter(s => !s.archived)
      .sort((a, b) => String(a.profile_name || a.id).localeCompare(String(b.profile_name || b.id)))
      .map(s => `<option value="${s.id}" ${String(spoolId) === String(s.id) ? 'selected' : ''}>${esc(s.profile_name || ('Spool #' + s.id))}${s.color_name ? ' · ' + esc(s.color_name) : ''} (${Math.round(s.remaining_weight_g || 0)} g)</option>`)
      .join('');
    host.innerHTML = `<div class="proc-form card-inset">
      <div class="ctrl-card-title" style="margin:0 0 8px">${t('stockact.adjust_title', 'Adjust stock')}</div>
      <p class="text-muted" style="font-size:0.78rem;margin:0 0 10px">${t('stockact.adjust_help', 'Correct the remaining weight of a spool (e.g. after re-weighing). The change is recorded in the ledger with your reason.')}</p>
      <div class="proc-form-grid">
        <div class="form-group proc-form-wide"><label class="form-label">${t('stockact.spool', 'Spool')} *</label>
          <select class="form-input" id="adj-spool" onchange="window._adjSyncCurrent()">${opts}</select></div>
        <div class="form-group"><label class="form-label">${t('stockact.new_weight', 'New remaining (g)')} *</label>
          <input class="form-input" id="adj-weight" type="number" step="1" min="0"></div>
        <div class="form-group proc-form-wide"><label class="form-label">${t('stockact.reason', 'Reason')}</label>
          <input class="form-input" id="adj-reason" placeholder="${t('stockact.reason_ph', 'e.g. Re-weighed on scale')}"></div>
      </div>
      <div class="proc-form-actions">
        <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="document.getElementById('adj-form-host').innerHTML=''">${t('settings.cancel', 'Cancel')}</button>
        <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._adjSave()">${t('settings.save', 'Save')}</button>
      </div>
    </div>`;
    window._adjSyncCurrent();
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Prefill the weight field with the selected spool's current remaining weight.
  window._adjSyncCurrent = function () {
    const sel = document.getElementById('adj-spool');
    const wt = document.getElementById('adj-weight');
    if (!sel || !wt) return;
    const s = _spools.find(x => String(x.id) === String(sel.value));
    if (s && (wt.value === '' || wt.dataset.auto !== '0')) { wt.value = Math.round(s.remaining_weight_g || 0); wt.dataset.auto = '1'; }
    wt.oninput = () => { wt.dataset.auto = '0'; };
  };

  window._adjSave = async function () {
    const spoolId = parseInt(document.getElementById('adj-spool')?.value);
    const newW = document.getElementById('adj-weight')?.value;
    if (!spoolId || newW === '') { toast(t('stockact.adjust_invalid', 'Pick a spool and a weight'), 'error'); return; }
    const body = { new_remaining_g: parseFloat(newW), reason: document.getElementById('adj-reason')?.value?.trim() || null };
    try {
      await _fetchJson(`/api/inventory/spools/${spoolId}/adjust`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      toast(t('stockact.adjusted', 'Stock adjusted'), 'success');
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };
})();
