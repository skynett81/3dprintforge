// filament-orders.js
// Purchase Orders for the Filament inventory (Procurement Phase 2,
// InvenTree-inspired). A PURCHASE ORDER groups what you buy from one supplier
// with a status lifecycle (draft -> placed -> received | cancelled). Each LINE
// is a quantity of a filament profile / supplier part; receiving a line creates
// real spools in inventory. Self-contained IIFE; exposes window.loadOrdersPanel(el).
(function () {
  'use strict';

  const t = (k, f) => (window.t ? window.t(k, f) : (typeof f === 'string' ? f : k));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => (window.formatCurrency ? window.formatCurrency(n || 0, 2) : (Number(n || 0).toFixed(2)));
  const toast = (m, k) => (window.showToast ? window.showToast(m, k) : void 0);

  const STATUS = {
    draft: { label: 'Draft', cls: 'po-badge-draft' },
    placed: { label: 'Placed', cls: 'po-badge-placed' },
    received: { label: 'Received', cls: 'po-badge-received' },
    cancelled: { label: 'Cancelled', cls: 'po-badge-cancelled' },
  };

  let _orders = [];
  let _suppliers = [];
  let _profiles = [];
  let _reorder = [];
  let _el = null;
  let _expanded = null;

  async function _fetchJson(url, opts) {
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
  }

  window.loadOrdersPanel = async function (container) {
    _el = container || document.getElementById('filament-tab-orders');
    if (!_el) return;
    _el.innerHTML = `<div class="text-muted" style="padding:16px">${t('common.loading', 'Loading…')}</div>`;
    try {
      const [orders, suppliers, profiles, reorder] = await Promise.all([
        _fetchJson('/api/inventory/purchase-orders'),
        _fetchJson('/api/inventory/suppliers'),
        _fetchJson('/api/inventory/filaments?limit=2000'),
        _fetchJson('/api/inventory/reorder').catch(() => []),
      ]);
      _orders = Array.isArray(orders) ? orders : [];
      _suppliers = Array.isArray(suppliers) ? suppliers : [];
      _profiles = Array.isArray(profiles) ? profiles : (profiles.rows || profiles.data || []);
      _reorder = Array.isArray(reorder) ? reorder : [];
    } catch (e) {
      _el.innerHTML = `<div class="alert alert-danger" style="margin:12px">${t('po.load_failed', 'Could not load orders')}: ${esc(e.message)}</div>`;
      return;
    }
    _render();
  };

  function _reload() { return window.loadOrdersPanel(_el); }
  function _detail(id) { return _orders.find(o => o.id === id); }

  function _render() {
    const open = _orders.filter(o => o.status === 'draft' || o.status === 'placed');
    const onOrderQty = open.reduce((s, o) => s + ((o.total_qty || 0) - (o.received_qty || 0)), 0);
    const committed = open.reduce((s, o) => s + (o.total_cost || 0), 0);

    let h = `<div class="proc-head">
      <div class="ctrl-card-title" style="margin:0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        ${t('po.title', 'Purchase orders')}
      </div>
      <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._poNew()" ${_suppliers.length ? '' : 'disabled title="Add a supplier first"'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ${t('po.new', 'New order')}
      </button>
    </div>`;

    h += `<div class="inv-kpi-grid" style="margin:12px 0">
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', open.length, t('po.open', 'Open orders'), '', '#f0883e')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', onOrderQty, t('po.on_order', 'Spools on order'), '', '#3b82f6')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', money(committed), t('po.committed', 'Committed spend'), t('po.open_orders', 'open orders'), '#e3b341')}
    </div>`;

    h += _reorderCard();

    h += `<div id="po-form-host"></div>`;

    if (!_orders.length) {
      h += `<div class="proc-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>${_suppliers.length ? t('po.empty', 'No purchase orders yet. Create one to track what you have on order and receive it into inventory.') : t('po.empty_no_supplier', 'Add a supplier under the Suppliers tab first, then create a purchase order here.')}</p>
      </div>`;
      _el.innerHTML = h;
      return;
    }

    h += `<table class="data-table po-table"><thead><tr>
      <th>${t('po.reference', 'Reference')}</th>
      <th>${t('suppliers.name', 'Supplier')}</th>
      <th>${t('po.status', 'Status')}</th>
      <th>${t('po.progress', 'Received')}</th>
      <th>${t('po.total', 'Total')}</th>
      <th></th>
    </tr></thead><tbody>`;
    for (const o of _orders) {
      const st = STATUS[o.status] || STATUS.draft;
      h += `<tr>
        <td><strong>${esc(o.reference || ('#' + o.id))}</strong>${o.order_date ? `<div class="proc-notes">${esc(String(o.order_date).slice(0, 10))}</div>` : ''}</td>
        <td>${esc(o.supplier_name || '–')}</td>
        <td><span class="po-badge ${st.cls}">${t('po.status_' + o.status, st.label)}</span></td>
        <td>${o.received_qty || 0} / ${o.total_qty || 0}</td>
        <td>${money(o.total_cost)}</td>
        <td class="proc-actions">
          <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._poToggle(${o.id})">${_expanded === o.id ? t('po.hide', 'Hide') : t('po.open_btn', 'Open')}</button>
          <button class="form-btn form-btn-sm form-btn-ghost" data-ripple style="color:var(--accent-red)" onclick="window._poDelete(${o.id})" title="${t('settings.delete', 'Delete')}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>`;
      if (_expanded === o.id) {
        h += `<tr class="po-detail-row"><td colspan="6">${_orderDetail(o)}</td></tr>`;
      }
    }
    h += `</tbody></table>`;
    _el.innerHTML = h;
  }

  function _orderDetail(o) {
    let h = `<div class="po-detail">`;
    // Lines
    if (o.lines && o.lines.length) {
      h += `<table class="data-table po-lines-table"><thead><tr>
        <th>${t('suppliers.filament', 'Filament')}</th>
        <th>${t('po.qty', 'Qty')}</th>
        <th>${t('po.received_col', 'Received')}</th>
        <th>${t('suppliers.price', 'Unit')}</th>
        <th>${t('suppliers.weight_g', 'Weight')}</th>
        <th></th>
      </tr></thead><tbody>`;
      for (const l of o.lines) {
        const outstanding = (l.quantity || 0) - (l.qty_received || 0);
        const canReceive = o.status !== 'cancelled' && outstanding > 0;
        h += `<tr>
          <td>${esc(l.profile_name || l.description || t('suppliers.unlinked', '(unlinked)'))}</td>
          <td>${l.quantity || 0}</td>
          <td>${l.qty_received || 0}</td>
          <td>${l.unit_price != null ? money(l.unit_price) : '–'}</td>
          <td>${Math.round(l.weight_g || 0)} g</td>
          <td class="proc-actions">
            ${canReceive ? `<button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._poReceive(${l.id}, ${outstanding})">${t('po.receive', 'Receive')}</button>` : ''}
            ${o.status === 'draft' ? `<button class="form-btn form-btn-sm form-btn-ghost" data-ripple style="color:var(--accent-red)" onclick="window._poDeleteLine(${l.id})" title="${t('settings.delete', 'Delete')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>` : ''}
          </td>
        </tr>`;
      }
      h += `</tbody></table>`;
    } else {
      h += `<p class="text-muted" style="font-size:0.78rem;margin:0 0 8px">${t('po.no_lines', 'No lines yet. Add what you are ordering below.')}</p>`;
    }

    // Add-line form (only while editable)
    if (o.status === 'draft' || o.status === 'placed') {
      const profOpts = [..._profiles]
        .sort((a, b) => String(a.name).localeCompare(String(b.name)))
        .map(p => `<option value="${p.id}">${esc(p.name)}${p.material ? ' · ' + esc(p.material) : ''}</option>`)
        .join('');
      h += `<div class="sup-addpart">
        <select class="form-input form-input-sm" id="po-pp-${o.id}" style="min-width:200px"><option value="">${t('suppliers.pick_filament', 'Pick a filament…')}</option>${profOpts}</select>
        <input class="form-input form-input-sm" id="po-qty-${o.id}" type="number" min="1" value="1" title="${t('po.qty', 'Qty')}" style="max-width:70px">
        <input class="form-input form-input-sm" id="po-price-${o.id}" type="number" step="0.01" placeholder="${t('suppliers.price', 'Unit price')}" style="max-width:100px">
        <input class="form-input form-input-sm" id="po-wt-${o.id}" type="number" step="1" value="1000" title="${t('suppliers.weight_g', 'Weight (g)')}" style="max-width:90px">
        <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._poAddLine(${o.id})">${t('po.add_line', 'Add line')}</button>
      </div>`;
    }

    // Status controls
    h += `<div class="po-status-bar">`;
    if (o.status === 'draft') h += `<button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._poSetStatus(${o.id}, 'placed')">${t('po.mark_placed', 'Mark as placed')}</button>`;
    if (o.status !== 'received' && o.status !== 'cancelled') h += `<button class="form-btn form-btn-sm form-btn-ghost" data-ripple style="color:var(--accent-red)" onclick="window._poSetStatus(${o.id}, 'cancelled')">${t('po.cancel_order', 'Cancel order')}</button>`;
    if (o.status === 'cancelled') h += `<button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._poSetStatus(${o.id}, 'draft')">${t('po.reopen', 'Reopen')}</button>`;
    if (o.notes) h += `<span class="proc-notes" style="margin-left:auto">${esc(o.notes)}</span>`;
    h += `</div>`;
    h += `</div>`;
    return h;
  }

  // ── Reorder needs: per-material min stock vs on-hand + queue demand ──
  function _reorderCard() {
    const short = _reorder.filter(r => r.below_target);
    const hasTargets = _reorder.some(r => r.target_g > 0);
    let body = '';
    if (!_reorder.length) {
      body = `<p class="text-muted" style="font-size:0.8rem;margin:8px 0 0">${t('po.reorder_none', 'No materials in stock yet.')}</p>`;
    } else {
      body = `<table class="data-table ro-table" style="margin-top:8px"><thead><tr>
        <th>${t('po.material', 'Material')}</th>
        <th>${t('po.on_hand', 'On hand')}</th>
        <th>${t('po.demand', 'Queue')}</th>
        <th>${t('po.min_target', 'Min target')}</th>
        <th>${t('po.shortfall', 'Shortfall')}</th>
        <th>${t('po.buy', 'Buy')}</th>
      </tr></thead><tbody>`;
      for (const r of _reorder) {
        const tgtVal = r.target_g ? Math.round(r.target_g) : '';
        const shortCell = r.shortfall_g > 0
          ? `<span class="ro-short">${Math.round(r.shortfall_g)} g</span>`
          : `<span class="ro-ok">✓</span>`;
        const buy = r.shortfall_g > 0
          ? (r.cheapest ? `${r.suggested_spools}× <span class="text-muted">(${esc(r.cheapest.supplier_name || '?')})</span>` : `<span class="text-muted">${t('po.no_supplier', 'no supplier')}</span>`)
          : '';
        body += `<tr class="${r.below_target ? 'ro-row-short' : ''}">
          <td><strong>${esc(r.material)}</strong></td>
          <td>${Math.round(r.on_hand_g)} g <span class="text-muted">(${r.spools_on_hand})</span></td>
          <td>${r.queue_demand_g ? Math.round(r.queue_demand_g) + ' g' : '–'}</td>
          <td><input class="form-input form-input-sm ro-target" data-mat="${esc(r.material)}" type="number" min="0" step="100" value="${tgtVal}" placeholder="0" style="width:90px" onchange="window._poSetTarget(this)"></td>
          <td>${shortCell}</td>
          <td>${buy}</td>
        </tr>`;
      }
      body += `</tbody></table>`;
    }
    const draftBtn = short.some(r => r.cheapest)
      ? `<button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._poDraftReorder()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${t('po.draft_reorder', 'Draft purchase orders')}</button>`
      : '';
    return `<details class="ctrl-card ro-card" ${short.length ? 'open' : ''} style="margin-bottom:12px">
      <summary class="ro-summary">
        <span class="ctrl-card-title" style="margin:0">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>
          ${t('po.reorder_title', 'Reorder needs')}
        </span>
        ${short.length ? `<span class="ro-badge">${short.length} ${t('po.below_target', 'below target')}</span>` : `<span class="ro-badge ro-badge-ok">${t('po.all_ok', 'all stocked')}</span>`}
        ${draftBtn}
      </summary>
      <p class="text-muted" style="font-size:0.76rem;margin:6px 0 0">${t('po.reorder_help', 'Set a minimum stock per material. Shortfall = target + queued demand − on hand.')}</p>
      ${body}
    </details>`;
  }

  window._poSetTarget = async function (input) {
    const material = input.getAttribute('data-mat');
    const v = input.value === '' ? 0 : parseFloat(input.value);
    try {
      await _fetchJson('/api/inventory/stock-targets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ material, min_weight_g: v }) });
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

  window._poDraftReorder = async function () {
    try {
      const r = await _fetchJson('/api/inventory/reorder/draft-po', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const n = (r.created || []).length;
      if (!n) { toast(t('po.reorder_nothing', 'Nothing to order, or no supplier set for short materials'), 'info'); return; }
      toast(t('po.reorder_drafted', '{{n}} draft order(s) created').replace('{{n}}', n), 'success');
      if (r.unsourced && r.unsourced.length) toast(t('po.reorder_unsourced', 'No supplier for: ') + r.unsourced.join(', '), 'info');
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

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

  // ── New order form ──
  window._poNew = function () {
    const host = document.getElementById('po-form-host');
    if (!host) return;
    const today = new Date().toISOString().slice(0, 10);
    const supOpts = [..._suppliers].sort((a, b) => a.name.localeCompare(b.name))
      .map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    host.innerHTML = `<div class="proc-form card-inset">
      <div class="proc-form-grid">
        <div class="form-group"><label class="form-label">${t('suppliers.name', 'Supplier')} *</label>
          <select class="form-input" id="po-supplier">${supOpts}</select></div>
        <div class="form-group"><label class="form-label">${t('po.reference', 'Reference')}</label>
          <input class="form-input" id="po-ref" placeholder="${t('po.reference_ph', 'e.g. PO-2026-014')}"></div>
        <div class="form-group"><label class="form-label">${t('po.order_date', 'Order date')}</label>
          <input class="form-input" id="po-date" type="date" value="${today}"></div>
        <div class="form-group"><label class="form-label">${t('po.shipping', 'Shipping cost')}</label>
          <input class="form-input" id="po-ship" type="number" step="0.01" value="0"></div>
        <div class="form-group proc-form-wide"><label class="form-label">${t('filament.notes', 'Notes')}</label>
          <input class="form-input" id="po-notes"></div>
      </div>
      <div class="proc-form-actions">
        <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="document.getElementById('po-form-host').innerHTML=''">${t('settings.cancel', 'Cancel')}</button>
        <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._poSave()">${t('po.create', 'Create order')}</button>
      </div>
    </div>`;
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window._poSave = async function () {
    const supplier_id = parseInt(document.getElementById('po-supplier')?.value);
    if (!supplier_id) { toast(t('po.supplier_required', 'Pick a supplier'), 'error'); return; }
    const body = {
      supplier_id,
      reference: document.getElementById('po-ref')?.value?.trim() || null,
      order_date: document.getElementById('po-date')?.value || null,
      shipping_cost: parseFloat(document.getElementById('po-ship')?.value) || 0,
      notes: document.getElementById('po-notes')?.value?.trim() || null,
    };
    try {
      const po = await _fetchJson('/api/inventory/purchase-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      _expanded = po.id; // open it so the user can add lines
      toast(t('po.created', 'Order created'), 'success');
      await _reload();
    } catch (e) { toast(t('po.save_failed', 'Save failed') + ': ' + e.message, 'error'); }
  };

  window._poDelete = async function (id) {
    if (!confirm(t('po.confirm_delete', 'Delete this purchase order?'))) return;
    try {
      await _fetchJson(`/api/inventory/purchase-orders/${id}`, { method: 'DELETE' });
      if (_expanded === id) _expanded = null;
      toast(t('po.deleted', 'Order deleted'), 'success');
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

  window._poToggle = function (id) { _expanded = _expanded === id ? null : id; _render(); };

  window._poSetStatus = async function (id, status) {
    try {
      await _fetchJson(`/api/inventory/purchase-orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

  window._poAddLine = async function (poId) {
    const pid = document.getElementById(`po-pp-${poId}`)?.value;
    if (!pid) { toast(t('suppliers.pick_filament', 'Pick a filament…'), 'error'); return; }
    const body = {
      filament_profile_id: parseInt(pid),
      quantity: parseInt(document.getElementById(`po-qty-${poId}`)?.value) || 1,
      unit_price: document.getElementById(`po-price-${poId}`)?.value !== '' ? parseFloat(document.getElementById(`po-price-${poId}`).value) : null,
      weight_g: parseFloat(document.getElementById(`po-wt-${poId}`)?.value) || 1000,
    };
    try {
      await _fetchJson(`/api/inventory/purchase-orders/${poId}/lines`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

  window._poDeleteLine = async function (lineId) {
    try {
      await _fetchJson(`/api/inventory/purchase-order-lines/${lineId}`, { method: 'DELETE' });
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

  window._poReceive = async function (lineId, outstanding) {
    const ask = prompt(t('po.receive_qty', 'How many to receive into inventory?'), String(outstanding));
    if (ask == null) return;
    const qty = parseInt(ask);
    if (!qty || qty < 1) return;
    try {
      const r = await _fetchJson(`/api/inventory/purchase-order-lines/${lineId}/receive`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qty }) });
      toast(t('po.received_n', '{{n}} spool(s) received').replace('{{n}}', r.received), 'success');
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };
})();
