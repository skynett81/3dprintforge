// filament-procurement.js
// Procurement view for the Filament inventory — the "purchase -> receive ->
// shelf" lifecycle. Backed by the existing purchased_spools API
// (/api/filament-tracker/purchased). A purchase is "pending" until it is
// linked to a real spool in inventory ("received"), at which point it counts
// as stock. Self-contained IIFE; exposes window.loadProcurementPanel(el).
(function () {
  'use strict';

  const t = (k, f) => (window.t ? window.t(k, f) : (typeof f === 'string' ? f : k));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => (window.formatCurrency ? window.formatCurrency(n || 0, 0) : (Math.round(n || 0) + ' kr'));
  const toast = (m, k) => (window.showToast ? window.showToast(m, k) : void 0);

  let _purchases = [];
  let _spools = [];
  let _el = null;

  async function _fetchJson(url, opts) {
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
  }

  window.loadProcurementPanel = async function (container) {
    _el = container || document.getElementById('filament-tab-procurement');
    if (!_el) return;
    _el.innerHTML = `<div class="text-muted" style="padding:16px">${t('common.loading', 'Loading…')}</div>`;
    try {
      const [purchased, spools] = await Promise.all([
        _fetchJson('/api/filament-tracker/purchased'),
        _fetchJson('/api/inventory/spools'),
      ]);
      _purchases = Array.isArray(purchased) ? purchased : [];
      _spools = Array.isArray(spools) ? spools : (spools.data || spools.spools || []);
    } catch (e) {
      _el.innerHTML = `<div class="alert alert-danger" style="margin:12px">${t('procurement.load_failed', 'Could not load purchases')}: ${esc(e.message)}</div>`;
      return;
    }
    _render();
  };

  function _isReceived(p) { return !!p.spool_id; }

  function _render() {
    const pending = _purchases.filter(p => !_isReceived(p));
    const received = _purchases.filter(_isReceived);
    let totalSpent = 0, monthSpent = 0;
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    for (const p of _purchases) {
      const c = Number(p.cost) || 0;
      totalSpent += c;
      if (String(p.purchase_date || '').slice(0, 7) === ym) monthSpent += c;
    }

    let h = `<div class="proc-head">
      <div class="ctrl-card-title" style="margin:0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        ${t('procurement.title', 'Procurement')}
      </div>
      <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._procShowForm()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ${t('procurement.log_purchase', 'Log purchase')}
      </button>
    </div>`;

    // KPI strip (reuses the inventory KPI styles)
    h += `<div class="inv-kpi-grid" style="margin:12px 0">
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', pending.length, t('procurement.pending', 'Pending'), pending.length ? t('procurement.awaiting_receipt', 'awaiting receipt') : t('procurement.all_received', 'all received'), '#f0883e')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', received.length, t('procurement.received', 'Received'), t('procurement.in_inventory', 'in inventory'), '#22c55e')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', money(totalSpent), t('procurement.total_spent', 'Total spent'), `${money(monthSpent)} ${t('procurement.this_month', 'this month')}`, '#e3b341')}
    </div>`;

    h += `<div id="proc-form-host"></div>`;

    if (!_purchases.length) {
      h += `<div class="proc-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>${t('procurement.empty', 'No purchases logged yet. Log a purchase to track orders from order to shelf.')}</p>
      </div>`;
      _el.innerHTML = h;
      return;
    }

    h += `<table class="data-table proc-table"><thead><tr>
      <th>${t('procurement.item', 'Item')}</th>
      <th>${t('filament.vendor', 'Brand')}</th>
      <th>${t('procurement.cost', 'Cost')}</th>
      <th>${t('procurement.date', 'Date')}</th>
      <th>${t('procurement.status', 'Status')}</th>
      <th></th>
    </tr></thead><tbody>`;
    // Pending first, then received; each sorted by date desc.
    const ordered = [...pending.sort(_byDateDesc), ...received.sort(_byDateDesc)];
    for (const p of ordered) {
      const sw = p.color_hex ? `<span class="proc-swatch" style="background:#${esc(String(p.color_hex).replace(/^#/, ''))}"></span>` : '';
      const rec = _isReceived(p);
      const linked = rec ? _spools.find(s => s.id === p.spool_id) : null;
      h += `<tr>
        <td>${sw}${esc(p.name)}${p.notes ? `<div class="proc-notes">${esc(p.notes)}</div>` : ''}</td>
        <td>${esc(p.brand || '–')}</td>
        <td>${p.cost ? money(p.cost) : '–'}</td>
        <td>${esc(String(p.purchase_date || '').slice(0, 10) || '–')}</td>
        <td>${rec
          ? `<span class="proc-badge proc-badge-ok">${t('procurement.received', 'Received')}</span>${linked ? `<div class="proc-notes">${esc(linked.profile_name || ('#' + p.spool_id))}</div>` : ''}`
          : `<span class="proc-badge proc-badge-pending">${t('procurement.pending', 'Pending')}</span>`}</td>
        <td class="proc-actions">
          ${rec
            ? `<button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._procUnlink(${p.id})" title="${t('procurement.unlink', 'Mark as not received')}">${t('procurement.undo', 'Undo')}</button>`
            : `<button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._procReceive(${p.id})">${t('procurement.receive', 'Receive')}</button>`}
          <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._procShowForm(${p.id})" title="${t('settings.edit', 'Edit')}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
          </button>
          <button class="form-btn form-btn-sm form-btn-ghost" data-ripple style="color:var(--accent-red)" onclick="window._procDelete(${p.id})" title="${t('settings.delete', 'Delete')}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>`;
    }
    h += `</tbody></table>`;
    _el.innerHTML = h;
  }

  function _byDateDesc(a, b) { return String(b.purchase_date || '').localeCompare(String(a.purchase_date || '')); }

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

  // ── Add / edit form ──────────────────────────────────────────────────────
  window._procShowForm = function (id) {
    const host = document.getElementById('proc-form-host');
    if (!host) return;
    const p = id ? _purchases.find(x => x.id === id) : null;
    const today = new Date().toISOString().slice(0, 10);
    host.innerHTML = `<div class="proc-form card-inset">
      <div class="proc-form-grid">
        <div class="form-group"><label class="form-label">${t('procurement.item', 'Item')} *</label>
          <input class="form-input" id="proc-name" value="${esc(p?.name || '')}" placeholder="${t('procurement.item_ph', 'e.g. eSUN PETG Black')}"></div>
        <div class="form-group"><label class="form-label">${t('filament.vendor', 'Brand')}</label>
          <input class="form-input" id="proc-brand" value="${esc(p?.brand || '')}"></div>
        <div class="form-group"><label class="form-label">${t('procurement.cost', 'Cost')}</label>
          <input class="form-input" id="proc-cost" type="number" step="0.01" value="${p?.cost ?? ''}"></div>
        <div class="form-group"><label class="form-label">${t('procurement.date', 'Date')}</label>
          <input class="form-input" id="proc-date" type="date" value="${esc(String(p?.purchase_date || today).slice(0, 10))}"></div>
        <div class="form-group"><label class="form-label">${t('filament.color', 'Color')}</label>
          <input class="form-input" id="proc-color" type="color" value="#${esc(String(p?.color_hex || 'cccccc').replace(/^#/, ''))}"></div>
        <div class="form-group"><label class="form-label">${t('procurement.qty', 'Quantity')}</label>
          <input class="form-input" id="proc-qty" type="number" min="1" max="50" value="${p?.purchase_order || 1}"></div>
        <div class="form-group proc-form-wide"><label class="form-label">${t('filament.notes', 'Notes')}</label>
          <input class="form-input" id="proc-notes" value="${esc(p?.notes || '')}"></div>
      </div>
      <div class="proc-form-actions">
        <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="document.getElementById('proc-form-host').innerHTML=''">${t('settings.cancel', 'Cancel')}</button>
        <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._procSave(${id || 0})">${t('settings.save', 'Save')}</button>
      </div>
    </div>`;
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window._procSave = async function (id) {
    const name = document.getElementById('proc-name')?.value?.trim();
    if (!name) { toast(t('procurement.name_required', 'Item name is required'), 'error'); return; }
    const body = {
      name,
      brand: document.getElementById('proc-brand')?.value?.trim() || null,
      cost: parseFloat(document.getElementById('proc-cost')?.value) || null,
      purchase_date: document.getElementById('proc-date')?.value || null,
      color_hex: (document.getElementById('proc-color')?.value || '').replace(/^#/, '') || null,
      purchase_order: parseInt(document.getElementById('proc-qty')?.value) || 1,
      notes: document.getElementById('proc-notes')?.value?.trim() || null,
    };
    try {
      if (id) {
        await fetch(`/api/filament-tracker/purchased/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        await fetch('/api/filament-tracker/purchased', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      toast(t('procurement.saved', 'Purchase saved'), 'success');
      await window.loadProcurementPanel(_el);
    } catch (e) { toast(t('procurement.save_failed', 'Save failed') + ': ' + e.message, 'error'); }
  };

  window._procDelete = async function (id) {
    if (!confirm(t('procurement.confirm_delete', 'Delete this purchase record?'))) return;
    try {
      await fetch(`/api/filament-tracker/purchased/${id}`, { method: 'DELETE' });
      toast(t('procurement.deleted', 'Purchase deleted'), 'success');
      await window.loadProcurementPanel(_el);
    } catch (e) { toast(e.message, 'error'); }
  };

  // ── Receive: link to an existing spool, or create one prefilled ───────────
  window._procReceive = function (id) {
    const p = _purchases.find(x => x.id === id);
    if (!p) return;
    const host = document.getElementById('proc-form-host');
    if (!host) return;
    const unlinkedSpools = _spools.filter(s => !s.archived);
    const opts = unlinkedSpools.map(s => `<option value="${s.id}">${esc(s.profile_name || ('#' + s.id))}${s.color_name ? ' · ' + esc(s.color_name) : ''} (${Math.round(s.remaining_weight_g || 0)}g)</option>`).join('');
    host.innerHTML = `<div class="proc-form card-inset">
      <div class="ctrl-card-title" style="margin:0 0 8px">${t('procurement.receive_title', 'Receive')}: ${esc(p.name)}</div>
      <p class="text-muted" style="font-size:0.78rem;margin:0 0 10px">${t('procurement.receive_help', 'Add this purchase to inventory as a new spool, or link it to a spool you already have.')}</p>
      <div class="proc-receive-row">
        <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._procCreateSpool(${id})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${t('procurement.create_spool', 'Add as new spool')}
        </button>
        <span class="text-muted" style="font-size:0.75rem">${t('common.or', 'or')}</span>
        <select class="form-input form-input-sm" id="proc-link-spool" style="max-width:280px"><option value="">${t('procurement.link_existing', 'Link to existing spool…')}</option>${opts}</select>
        <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._procLink(${id})">${t('procurement.link', 'Link')}</button>
        <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="document.getElementById('proc-form-host').innerHTML=''">${t('settings.cancel', 'Cancel')}</button>
      </div>
    </div>`;
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window._procLink = async function (id) {
    const spoolId = parseInt(document.getElementById('proc-link-spool')?.value);
    if (!spoolId) { toast(t('procurement.pick_spool', 'Pick a spool to link'), 'error'); return; }
    try {
      await fetch('/api/filament-tracker/purchased/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ purchased_id: id, spool_id: spoolId }) });
      toast(t('procurement.received_ok', 'Marked as received'), 'success');
      await window.loadProcurementPanel(_el);
    } catch (e) { toast(e.message, 'error'); }
  };

  window._procUnlink = async function (id) {
    try {
      await fetch('/api/filament-tracker/purchased/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ purchased_id: id, spool_id: null }) });
      await window.loadProcurementPanel(_el);
    } catch (e) { toast(e.message, 'error'); }
  };

  // Open the inventory Add-Spool form prefilled from this purchase. The user
  // completes profile/weight and saves; we then link the newest spool back.
  window._procCreateSpool = function (id) {
    const p = _purchases.find(x => x.id === id);
    if (!p || typeof window.showAddSpoolForm !== 'function') return;
    window._procPendingLink = id;
    window.showAddSpoolForm({
      cost: p.cost || null,
      color_hex: p.color_hex || null,
      color_name: p.name || null,
      purchase_date: p.purchase_date || null,
      comment: p.notes || null,
    });
    toast(t('procurement.complete_spool', 'Complete the spool details and save to receive'), 'info');
  };
})();
