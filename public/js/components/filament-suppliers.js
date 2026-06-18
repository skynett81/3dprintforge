// filament-suppliers.js
// Suppliers & price comparison for the Filament inventory (Procurement Phase 1,
// InvenTree-inspired). A SUPPLIER is a shop you buy from (distinct from the
// manufacturer/brand in `vendors`). A SUPPLIER PART is one purchasable SKU at a
// supplier — a filament profile sold at a given pack weight + price — which lets
// us compare price-per-kg across shops and keep 1-click reorder links.
// Self-contained IIFE; exposes window.loadSuppliersPanel(el).
(function () {
  'use strict';

  const t = (k, f) => (window.t ? window.t(k, f) : (typeof f === 'string' ? f : k));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => (window.formatCurrency ? window.formatCurrency(n || 0, 2) : (Number(n || 0).toFixed(2)));
  const toast = (m, k) => (window.showToast ? window.showToast(m, k) : void 0);

  let _suppliers = [];
  let _parts = [];
  let _profiles = [];
  let _el = null;
  let _expanded = null; // supplier id whose parts editor is open
  let _comparePid = ''; // profile id selected in the compare card

  async function _fetchJson(url, opts) {
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
  }

  window.loadSuppliersPanel = async function (container) {
    _el = container || document.getElementById('filament-tab-suppliers');
    if (!_el) return;
    _el.innerHTML = `<div class="text-muted" style="padding:16px">${t('common.loading', 'Loading…')}</div>`;
    try {
      const [suppliers, parts, profiles] = await Promise.all([
        _fetchJson('/api/inventory/suppliers'),
        _fetchJson('/api/inventory/supplier-parts'),
        _fetchJson('/api/inventory/filaments?limit=2000'),
      ]);
      _suppliers = Array.isArray(suppliers) ? suppliers : [];
      _parts = Array.isArray(parts) ? parts : [];
      _profiles = Array.isArray(profiles) ? profiles : (profiles.rows || profiles.data || []);
    } catch (e) {
      _el.innerHTML = `<div class="alert alert-danger" style="margin:12px">${t('suppliers.load_failed', 'Could not load suppliers')}: ${esc(e.message)}</div>`;
      return;
    }
    _render();
  };

  function _reload() { return window.loadSuppliersPanel(_el); }

  function _render() {
    const pricedParts = _parts.filter(p => p.price_per_kg != null);
    const cheapest = pricedParts.length ? Math.min(...pricedParts.map(p => p.price_per_kg)) : null;

    let h = `<div class="proc-head">
      <div class="ctrl-card-title" style="margin:0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1-5h16l1 5"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M9 13h6"/></svg>
        ${t('suppliers.title', 'Suppliers')}
      </div>
      <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._supShowForm()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ${t('suppliers.add', 'Add supplier')}
      </button>
    </div>`;

    h += `<div class="inv-kpi-grid" style="margin:12px 0">
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l1-5h16l1 5"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/></svg>', _suppliers.length, t('suppliers.count', 'Suppliers'), '', '#3b82f6')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>', _parts.length, t('suppliers.parts', 'Supplier parts'), '', '#a855f7')}
      ${_kpi('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', cheapest != null ? money(cheapest) : '–', t('suppliers.best_price_kg', 'Best price/kg'), cheapest != null ? t('suppliers.across_shops', 'across your shops') : '', '#22c55e')}
    </div>`;

    h += `<div id="sup-form-host"></div>`;

    // ── Price comparison card ──
    h += _comparisonCard();

    // ── Suppliers table ──
    if (!_suppliers.length) {
      h += `<div class="proc-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"><path d="M3 9l1-5h16l1 5"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M9 13h6"/></svg>
        <p>${t('suppliers.empty', 'No suppliers yet. Add the shops you buy filament from to compare prices and keep reorder links.')}</p>
      </div>`;
      _el.innerHTML = h;
      _bindCompare();
      return;
    }

    h += `<table class="data-table sup-table"><thead><tr>
      <th>${t('suppliers.name', 'Supplier')}</th>
      <th>${t('suppliers.lead_time', 'Lead time')}</th>
      <th>${t('suppliers.currency', 'Currency')}</th>
      <th>${t('suppliers.parts', 'Parts')}</th>
      <th></th>
    </tr></thead><tbody>`;
    for (const s of [..._suppliers].sort((a, b) => a.name.localeCompare(b.name))) {
      const lead = s.lead_time_days != null ? `${s.lead_time_days} ${t('suppliers.days', 'days')}` : '–';
      const site = s.website ? `<a href="${esc(s.website)}" target="_blank" rel="noopener" class="sup-link" onclick="event.stopPropagation()" title="${esc(s.website)}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : '';
      h += `<tr>
        <td><strong>${esc(s.name)}</strong> ${site}${s.notes ? `<div class="proc-notes">${esc(s.notes)}</div>` : ''}</td>
        <td>${lead}</td>
        <td>${esc(s.currency || 'USD')}</td>
        <td>${s.part_count || 0}</td>
        <td class="proc-actions">
          <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._supToggleParts(${s.id})">${_expanded === s.id ? t('suppliers.hide_parts', 'Hide parts') : t('suppliers.manage_parts', 'Parts')}</button>
          <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="window._supShowForm(${s.id})" title="${t('settings.edit', 'Edit')}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
          </button>
          <button class="form-btn form-btn-sm form-btn-ghost" data-ripple style="color:var(--accent-red)" onclick="window._supDelete(${s.id})" title="${t('settings.delete', 'Delete')}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>`;
      if (_expanded === s.id) {
        h += `<tr class="sup-parts-row"><td colspan="5">${_partsEditor(s)}</td></tr>`;
      }
    }
    h += `</tbody></table>`;

    _el.innerHTML = h;
    _bindCompare();
  }

  // ── Price comparison: pick a profile, see every supplier part cheapest-first ──
  function _comparisonCard() {
    const opts = [..._profiles]
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      .map(p => `<option value="${p.id}" ${String(_comparePid) === String(p.id) ? 'selected' : ''}>${esc(p.name)}${p.material ? ' · ' + esc(p.material) : ''}${p.vendor_name ? ' (' + esc(p.vendor_name) + ')' : ''}</option>`)
      .join('');
    let body = '';
    if (_comparePid) {
      const rows = _parts
        .filter(p => String(p.filament_profile_id) === String(_comparePid) && p.price_per_kg != null)
        .sort((a, b) => a.price_per_kg - b.price_per_kg);
      if (!rows.length) {
        body = `<p class="text-muted" style="font-size:0.8rem;margin:8px 0 0">${t('suppliers.no_priced_parts', 'No priced supplier parts for this filament yet. Add one under a supplier below.')}</p>`;
      } else {
        body = `<table class="data-table sup-compare-table" style="margin-top:10px"><thead><tr>
          <th>${t('suppliers.name', 'Supplier')}</th>
          <th>${t('suppliers.pack', 'Pack')}</th>
          <th>${t('suppliers.price', 'Price')}</th>
          <th>${t('suppliers.price_kg', 'Price/kg')}</th>
          <th>${t('suppliers.lead_time', 'Lead time')}</th>
          <th></th>
        </tr></thead><tbody>`;
        rows.forEach((p, i) => {
          const pack = `${p.pack_qty > 1 ? p.pack_qty + ' × ' : ''}${Math.round(p.weight_g || 0)} g`;
          const best = i === 0 ? `<span class="sup-best">${t('suppliers.best', 'Best')}</span>` : '';
          const buy = p.product_url ? `<a class="form-btn form-btn-sm form-btn-ghost" href="${esc(p.product_url)}" target="_blank" rel="noopener">${t('suppliers.buy', 'Buy')}</a>` : '';
          body += `<tr class="${i === 0 ? 'sup-best-row' : ''}">
            <td>${esc(p.supplier_name || '–')} ${best}</td>
            <td>${pack}</td>
            <td>${p.price != null ? money(p.price) : '–'}</td>
            <td><strong>${money(p.price_per_kg)}</strong></td>
            <td>${p.supplier_lead_time_days != null ? p.supplier_lead_time_days + ' ' + t('suppliers.days', 'days') : '–'}</td>
            <td>${buy}</td>
          </tr>`;
        });
        body += `</tbody></table>`;
      }
    } else {
      body = `<p class="text-muted" style="font-size:0.8rem;margin:8px 0 0">${t('suppliers.compare_hint', 'Pick a filament to compare price-per-kg across your shops.')}</p>`;
    }
    return `<div class="ctrl-card sup-compare-card" style="margin-bottom:14px">
      <div class="ctrl-card-title" style="margin:0 0 8px">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        ${t('suppliers.compare_title', 'Price comparison')}
      </div>
      <select class="form-input form-input-sm" id="sup-compare-pick" style="max-width:360px">
        <option value="">${t('suppliers.pick_filament', 'Pick a filament…')}</option>
        ${opts}
      </select>
      ${body}
    </div>`;
  }

  function _bindCompare() {
    const sel = document.getElementById('sup-compare-pick');
    if (sel) sel.onchange = () => { _comparePid = sel.value; _render(); };
  }

  // ── Per-supplier parts editor ──
  function _partsEditor(s) {
    const parts = _parts.filter(p => p.supplier_id === s.id);
    let h = `<div class="sup-parts">`;
    if (parts.length) {
      h += `<table class="data-table sup-parts-table"><thead><tr>
        <th>${t('suppliers.filament', 'Filament')}</th>
        <th>${t('suppliers.sku', 'SKU')}</th>
        <th>${t('suppliers.pack', 'Pack')}</th>
        <th>${t('suppliers.price', 'Price')}</th>
        <th>${t('suppliers.price_kg', 'Price/kg')}</th>
        <th></th>
      </tr></thead><tbody>`;
      for (const p of parts) {
        const pack = `${p.pack_qty > 1 ? p.pack_qty + ' × ' : ''}${Math.round(p.weight_g || 0)} g`;
        h += `<tr>
          <td>${esc(p.profile_name || t('suppliers.unlinked', '(unlinked)'))}</td>
          <td>${esc(p.sku || '–')}</td>
          <td>${pack}</td>
          <td>${p.price != null ? money(p.price) : '–'}</td>
          <td>${p.price_per_kg != null ? money(p.price_per_kg) : '–'}</td>
          <td class="proc-actions">
            ${p.product_url ? `<a class="form-btn form-btn-sm form-btn-ghost" href="${esc(p.product_url)}" target="_blank" rel="noopener" title="${t('suppliers.open', 'Open')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
            <button class="form-btn form-btn-sm form-btn-ghost" data-ripple style="color:var(--accent-red)" onclick="window._supDeletePart(${p.id})" title="${t('settings.delete', 'Delete')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </td>
        </tr>`;
      }
      h += `</tbody></table>`;
    } else {
      h += `<p class="text-muted" style="font-size:0.78rem;margin:0 0 8px">${t('suppliers.no_parts', 'No parts for this supplier yet.')}</p>`;
    }
    // Add-part inline form
    const profOpts = [..._profiles]
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      .map(p => `<option value="${p.id}">${esc(p.name)}${p.material ? ' · ' + esc(p.material) : ''}</option>`)
      .join('');
    h += `<div class="sup-addpart">
      <select class="form-input form-input-sm" id="sup-pp-${s.id}" style="min-width:200px"><option value="">${t('suppliers.pick_filament', 'Pick a filament…')}</option>${profOpts}</select>
      <input class="form-input form-input-sm" id="sup-sku-${s.id}" placeholder="${t('suppliers.sku', 'SKU')}" style="max-width:110px">
      <input class="form-input form-input-sm" id="sup-price-${s.id}" type="number" step="0.01" placeholder="${t('suppliers.price', 'Price')}" style="max-width:90px">
      <input class="form-input form-input-sm" id="sup-wt-${s.id}" type="number" step="1" value="1000" title="${t('suppliers.weight_g', 'Pack weight (g)')}" style="max-width:80px">
      <input class="form-input form-input-sm" id="sup-pq-${s.id}" type="number" min="1" value="1" title="${t('suppliers.pack_qty', 'Spools per pack')}" style="max-width:64px">
      <input class="form-input form-input-sm" id="sup-url-${s.id}" placeholder="${t('suppliers.url', 'Link')}" style="flex:1;min-width:120px">
      <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._supAddPart(${s.id})">${t('suppliers.add_part', 'Add part')}</button>
    </div>`;
    h += `</div>`;
    return h;
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

  // ── Supplier add/edit form ──
  window._supShowForm = function (id) {
    const host = document.getElementById('sup-form-host');
    if (!host) return;
    const s = id ? _suppliers.find(x => x.id === id) : null;
    host.innerHTML = `<div class="proc-form card-inset">
      <div class="proc-form-grid">
        <div class="form-group"><label class="form-label">${t('suppliers.name', 'Supplier')} *</label>
          <input class="form-input" id="sup-name" value="${esc(s?.name || '')}" placeholder="${t('suppliers.name_ph', 'e.g. MatterHackers')}"></div>
        <div class="form-group"><label class="form-label">${t('suppliers.website', 'Website')}</label>
          <input class="form-input" id="sup-web" value="${esc(s?.website || '')}" placeholder="https://"></div>
        <div class="form-group"><label class="form-label">${t('suppliers.currency', 'Currency')}</label>
          <input class="form-input" id="sup-cur" value="${esc(s?.currency || 'USD')}" maxlength="3" style="text-transform:uppercase"></div>
        <div class="form-group"><label class="form-label">${t('suppliers.lead_time_days', 'Lead time (days)')}</label>
          <input class="form-input" id="sup-lead" type="number" min="0" value="${s?.lead_time_days ?? ''}"></div>
        <div class="form-group proc-form-wide"><label class="form-label">${t('filament.notes', 'Notes')}</label>
          <input class="form-input" id="sup-notes" value="${esc(s?.notes || '')}"></div>
      </div>
      <div class="proc-form-actions">
        <button class="form-btn form-btn-sm form-btn-ghost" data-ripple onclick="document.getElementById('sup-form-host').innerHTML=''">${t('settings.cancel', 'Cancel')}</button>
        <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window._supSave(${id || 0})">${t('settings.save', 'Save')}</button>
      </div>
    </div>`;
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  window._supSave = async function (id) {
    const name = document.getElementById('sup-name')?.value?.trim();
    if (!name) { toast(t('suppliers.name_required', 'Supplier name is required'), 'error'); return; }
    const body = {
      name,
      website: document.getElementById('sup-web')?.value?.trim() || null,
      currency: (document.getElementById('sup-cur')?.value?.trim() || 'USD').toUpperCase().slice(0, 3),
      lead_time_days: document.getElementById('sup-lead')?.value !== '' ? parseInt(document.getElementById('sup-lead').value) : null,
      notes: document.getElementById('sup-notes')?.value?.trim() || null,
    };
    try {
      if (id) await _fetchJson(`/api/inventory/suppliers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      else await _fetchJson('/api/inventory/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      toast(t('suppliers.saved', 'Supplier saved'), 'success');
      await _reload();
    } catch (e) { toast(t('suppliers.save_failed', 'Save failed') + ': ' + e.message, 'error'); }
  };

  window._supDelete = async function (id) {
    if (!confirm(t('suppliers.confirm_delete', 'Delete this supplier and all its parts?'))) return;
    try {
      await _fetchJson(`/api/inventory/suppliers/${id}`, { method: 'DELETE' });
      if (_expanded === id) _expanded = null;
      toast(t('suppliers.deleted', 'Supplier deleted'), 'success');
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

  window._supToggleParts = function (id) {
    _expanded = _expanded === id ? null : id;
    _render();
  };

  window._supAddPart = async function (supplierId) {
    const pid = document.getElementById(`sup-pp-${supplierId}`)?.value;
    const price = document.getElementById(`sup-price-${supplierId}`)?.value;
    const body = {
      supplier_id: supplierId,
      filament_profile_id: pid ? parseInt(pid) : null,
      sku: document.getElementById(`sup-sku-${supplierId}`)?.value?.trim() || null,
      price: price !== '' ? parseFloat(price) : null,
      weight_g: parseFloat(document.getElementById(`sup-wt-${supplierId}`)?.value) || 1000,
      pack_qty: parseInt(document.getElementById(`sup-pq-${supplierId}`)?.value) || 1,
      product_url: document.getElementById(`sup-url-${supplierId}`)?.value?.trim() || null,
    };
    if (!body.filament_profile_id && !body.sku) { toast(t('suppliers.part_needs_filament', 'Pick a filament or enter a SKU'), 'error'); return; }
    try {
      await _fetchJson('/api/inventory/supplier-parts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      toast(t('suppliers.part_added', 'Supplier part added'), 'success');
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };

  window._supDeletePart = async function (id) {
    try {
      await _fetchJson(`/api/inventory/supplier-parts/${id}`, { method: 'DELETE' });
      await _reload();
    } catch (e) { toast(e.message, 'error'); }
  };
})();
