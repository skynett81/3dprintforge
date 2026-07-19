// Shop Products Panel — storefront product catalog management (Fase 2.1).
// List / create / edit sellable products. Each product carries a sale price
// and an estimated per-unit COGS; margin is shown live and server-side.
(function() {
  'use strict';

  function _esc(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function _tl(key, fb) { return (typeof window.t === 'function' ? window.t(key) : '') || fb; }
  function formatCurrency(val, currency) {
    if (val === null || val === undefined) return '--';
    if (currency && typeof window.currency !== 'undefined') return window.currency.format(Number(val), currency);
    if (typeof window.formatCurrency === 'function') return window.formatCurrency(Number(val));
    return Number(val).toFixed(2);
  }
  function _marginColor(v) { return (v || 0) < 0 ? 'var(--accent-red, #ef4444)' : 'var(--accent-green, #22c55e)'; }

  let _view = 'list';        // list | form
  let _products = [];
  let _editing = null;       // product being edited, or null for new
  let _search = '';

  async function fetchProducts() {
    try {
      const q = _search ? '?search=' + encodeURIComponent(_search) : '';
      const r = await fetch('/api/shop/products' + q);
      return r.ok ? r.json() : [];
    } catch { return []; }
  }
  async function apiSave(data) {
    const url = data.id ? '/api/shop/products/' + data.id : '/api/shop/products';
    const r = await fetch(url, { method: data.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Save failed');
    return r.json();
  }
  async function apiToggle(id, active) {
    await fetch('/api/shop/products/' + id + '/active', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) });
  }
  async function apiDelete(id) {
    await fetch('/api/shop/products/' + id, { method: 'DELETE' });
  }

  function renderList(body) {
    const rows = _products.map(p => {
      return `<tr>
        <td><strong>${_esc(p.name)}</strong>${p.sku ? ` <small style="opacity:0.6">${_esc(p.sku)}</small>` : ''}</td>
        <td>${_esc(p.category || '--')}</td>
        <td style="text-align:right">${formatCurrency(p.price, p.currency)}</td>
        <td style="text-align:right">${formatCurrency(p.unit_cogs, p.currency)}</td>
        <td style="text-align:right;color:${_marginColor(p.margin)};font-weight:600">${formatCurrency(p.margin, p.currency)} <small>(${(p.margin_pct || 0).toFixed(0)}%)</small></td>
        <td style="text-align:center">
          <span class="badge badge-status ${p.active ? 'badge-status-completed' : ''}" style="cursor:pointer" onclick="window._shopToggle(${p.id},${p.active ? 0 : 1})">${p.active ? _esc(_tl('shop.active', 'Active')) : _esc(_tl('shop.inactive', 'Inactive'))}</span>
        </td>
        <td style="text-align:right;white-space:nowrap">
          <button class="btn btn-sm btn-outline-secondary" onclick="window._shopEdit(${p.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="window._shopDelete(${p.id})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
    }).join('');

    body.innerHTML = `
      <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:1rem;flex-wrap:wrap">
        <button class="btn btn-sm btn-primary" onclick="window._shopNew()"><i class="bi bi-plus-lg"></i> ${_esc(_tl('shop.new_product', 'New product'))}</button>
        <input class="form-control form-control-sm" style="max-width:220px" placeholder="${_esc(_tl('common.search', 'Search'))}" value="${_esc(_search)}" oninput="window._shopSearch(this.value)">
        <a class="btn btn-sm btn-outline-secondary" href="/shop" target="_blank" rel="noopener"><i class="bi bi-shop"></i> ${_esc(_tl('shop.open_storefront', 'Open storefront'))}</a>
        <span style="margin-left:auto;opacity:0.6;font-size:0.85rem">${_products.length} ${_esc(_tl('shop.products', 'products'))}</span>
      </div>
      ${_products.length ? `<div class="card"><div class="card-body" style="padding:0">
        <table class="table table-sm" style="margin:0">
          <thead><tr>
            <th>${_esc(_tl('shop.name', 'Name'))}</th>
            <th>${_esc(_tl('shop.category', 'Category'))}</th>
            <th style="text-align:right">${_esc(_tl('shop.price', 'Price'))}</th>
            <th style="text-align:right">${_esc(_tl('shop.cogs', 'Cost'))}</th>
            <th style="text-align:right">${_esc(_tl('crm.margin', 'Margin'))}</th>
            <th style="text-align:center">${_esc(_tl('shop.status', 'Status'))}</th>
            <th></th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div></div>`
      : `<div style="text-align:center;padding:2rem;opacity:0.6"><i class="bi bi-box-seam" style="font-size:2rem"></i><p>${_esc(_tl('shop.no_products', 'No products yet — add one to start your storefront'))}</p></div>`}
    `;
  }

  function _numField(id, label, value, step) {
    return `<div class="form-group"><label class="form-label">${_esc(label)}</label>
      <input class="form-input" id="${id}" type="number" step="${step || '0.01'}" value="${value == null ? '' : _esc(value)}" oninput="window._shopRecalcMargin()"></div>`;
  }
  function _txtField(id, label, value, type) {
    return `<div class="form-group"><label class="form-label">${_esc(label)}</label>
      <input class="form-input" id="${id}" type="${type || 'text'}" value="${value == null ? '' : _esc(value)}"></div>`;
  }

  function renderForm(body) {
    const p = _editing || {};
    body.innerHTML = `
      <div style="margin-bottom:1rem"><button class="btn btn-sm btn-outline-secondary" onclick="window._shopBack()"><i class="bi bi-arrow-left"></i> ${_esc(_tl('shop.back', 'Back'))}</button></div>
      <div class="card"><div class="card-header"><h3 class="card-title">${p.id ? _esc(_tl('shop.edit_product', 'Edit product')) : _esc(_tl('shop.new_product', 'New product'))}</h3></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:0.75rem">
          ${_txtField('shop-name', _tl('shop.name', 'Name') + ' *', p.name)}
          ${_txtField('shop-sku', 'SKU', p.sku)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem">
          ${_txtField('shop-category', _tl('shop.category', 'Category'), p.category)}
          ${_numField('shop-price', _tl('shop.price', 'Sale price'), p.price)}
          ${_txtField('shop-currency', _tl('shop.currency', 'Currency'), p.currency || 'NOK')}
        </div>
        <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:var(--text-muted);margin:0.5rem 0">${_esc(_tl('shop.unit_costs', 'Per-unit costs (COGS)'))}</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem">
          ${_numField('shop-material', _tl('shop.material_cost', 'Material'), p.material_cost)}
          ${_numField('shop-labor', _tl('shop.labor_cost', 'Labor'), p.labor_cost)}
          ${_numField('shop-electricity', _tl('shop.electricity_cost', 'Electricity'), p.electricity_cost)}
          ${_numField('shop-wear', _tl('shop.wear_cost', 'Wear'), p.wear_cost)}
        </div>
        <div id="shop-margin-preview" style="margin:0.5rem 0;font-size:0.9rem"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem">
          ${_txtField('shop-filament', _tl('shop.filament_type', 'Filament'), p.filament_type)}
          ${_numField('shop-weight', _tl('shop.filament_weight', 'Weight (g)'), p.filament_weight_g, '1')}
          ${_numField('shop-time', _tl('shop.print_time', 'Print time (min)'), p.print_time_min, '1')}
        </div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:0.75rem">
          ${_txtField('shop-filename', _tl('shop.filename', 'Print file (dispatched to queue)'), p.filename)}
          ${_numField('shop-stock', _tl('shop.stock', 'Stock (blank = made to order)'), p.stock_qty, '1')}
        </div>
        ${_txtField('shop-image', _tl('shop.image_url', 'Image URL'), p.image_url)}
        <div class="form-group"><label class="form-label">${_esc(_tl('shop.description', 'Description'))}</label>
          <textarea class="form-input" id="shop-desc" rows="3" style="resize:vertical">${_esc(p.description || '')}</textarea></div>
        <label style="display:flex;align-items:center;gap:8px;margin:0.5rem 0"><input type="checkbox" id="shop-active" ${p.active === 0 ? '' : 'checked'}> ${_esc(_tl('shop.active', 'Active'))}</label>
        <div style="display:flex;gap:8px;margin-top:0.5rem">
          <button class="btn btn-primary" onclick="window._shopSubmit()">${_esc(_tl('shop.save', 'Save'))}</button>
          <button class="btn btn-outline-secondary" onclick="window._shopBack()">${_esc(_tl('common.cancel', 'Cancel'))}</button>
        </div>
      </div></div>`;
    window._shopRecalcMargin();
  }

  function _formData() {
    const num = (id) => { const v = parseFloat(document.getElementById(id)?.value); return Number.isFinite(v) ? v : null; };
    const str = (id) => { const v = document.getElementById(id)?.value?.trim(); return v || null; };
    return {
      id: _editing?.id,
      name: str('shop-name'), sku: str('shop-sku'), category: str('shop-category'),
      price: num('shop-price') || 0, currency: str('shop-currency') || 'NOK',
      material_cost: num('shop-material') || 0, labor_cost: num('shop-labor') || 0,
      electricity_cost: num('shop-electricity') || 0, wear_cost: num('shop-wear') || 0,
      filament_type: str('shop-filament'), filament_weight_g: num('shop-weight'),
      print_time_min: num('shop-time'), filename: str('shop-filename'),
      image_url: str('shop-image'), stock_qty: num('shop-stock'),
      description: str('shop-desc'), active: document.getElementById('shop-active')?.checked ? 1 : 0,
    };
  }

  window._shopRecalcMargin = function() {
    const d = _formData();
    const cogs = (d.material_cost || 0) + (d.labor_cost || 0) + (d.electricity_cost || 0) + (d.wear_cost || 0);
    const margin = (d.price || 0) - cogs;
    const pct = d.price > 0 ? (margin / d.price * 100) : 0;
    const el = document.getElementById('shop-margin-preview');
    if (el) el.innerHTML = `${_esc(_tl('shop.cogs', 'Cost'))}: <strong>${formatCurrency(cogs, d.currency)}</strong> &middot; ${_esc(_tl('crm.margin', 'Margin'))}: <strong style="color:${_marginColor(margin)}">${formatCurrency(margin, d.currency)} (${pct.toFixed(1)}%)</strong>`;
  };

  async function _reload() {
    const body = document.getElementById('overlay-panel-body');
    if (!body) return;
    _products = await fetchProducts();
    if (_view === 'form') renderForm(body); else renderList(body);
  }

  window._shopNew = function() { _editing = null; _view = 'form'; const b = document.getElementById('overlay-panel-body'); if (b) renderForm(b); };
  window._shopEdit = function(id) { _editing = _products.find(p => p.id === id) || null; _view = 'form'; const b = document.getElementById('overlay-panel-body'); if (b) renderForm(b); };
  window._shopBack = function() { _view = 'list'; _editing = null; _reload(); };
  window._shopSearch = function(v) { _search = v; _reload(); };
  window._shopToggle = async function(id, active) { await apiToggle(id, active); _reload(); };
  window._shopDelete = function(id) {
    const doDelete = async () => { await apiDelete(id); if (typeof showToast === 'function') showToast(_tl('shop.deleted', 'Product deleted'), 'success'); _reload(); };
    if (typeof window.deleteWithUndo === 'function') return window.deleteWithUndo({ message: _tl('shop.deleted', 'Product deleted'), commit: doDelete });
    if (confirm(_tl('shop.confirm_delete', 'Delete this product?'))) doDelete();
  };
  window._shopSubmit = async function() {
    const data = _formData();
    if (!data.name) { if (typeof showToast === 'function') showToast(_tl('shop.name_required', 'Name is required'), 'warning'); return; }
    try {
      await apiSave(data);
      if (typeof showToast === 'function') showToast(_tl('shop.saved', 'Saved'), 'success');
      _view = 'list'; _editing = null; _reload();
    } catch (e) { if (typeof showToast === 'function') showToast(e.message, 'error'); }
  };

  window.loadShopProductsPanel = async function() {
    _view = 'list'; _editing = null;
    const body = document.getElementById('overlay-panel-body');
    if (!body) return;
    body.innerHTML = `<div style="text-align:center;padding:2rem;opacity:0.6">${_tl('common.loading', 'Loading…')}</div>`;
    _products = await fetchProducts();
    renderList(body);
  };
})();
