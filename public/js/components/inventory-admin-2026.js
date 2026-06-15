// inventory-admin-2026.js — One admin panel that ties all the round-4
// filament/Spoolman backend features into visible UI:
//   - Spoolman health badge (live via WebSocket)
//   - Initial-import wizard (first time connecting to Spoolman)
//   - Duplicate merge browser
//   - Price comparison chart (cheapest retailer per filament)
//   - Extra-field admin (Spoolman-compatible custom fields)
//   - Conflict resolution banner (when spoolman_sync_error is set)
//   - OrcaSlicer preset browser with one-click import
//
// Renders into <div id="inventory-admin-2026"> which sits collapsed in
// the Inventory tab. Permissions are enforced server-side.

(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const t = (key, fb) => (typeof window.t === 'function' ? window.t(key, fb) : fb);

  // Scoped styling so the admin grid uses the app design system (cards,
  // tokens, ghost buttons) instead of ad-hoc inline styles.
  const _iaStyle = () => `<style>
    .ia-health:empty { display: none; }
    .ia-health { margin-bottom: 8px; }
    .ia-actionbar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 12px 14px; margin-bottom: 12px; }
    .ia-actionbar-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-right: 6px; }
    .ia-results { margin-left: auto; display: flex; gap: 10px; font-size: 0.76rem; color: var(--text-secondary); align-items: center; }
    .ia-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); grid-auto-flow: dense; gap: 12px; }
    .ia-card { padding: 0; margin: 0; overflow: hidden; }
    .ia-card-head { cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 12px 14px; font-weight: 600; font-size: 0.88rem; list-style: none; user-select: none; }
    .ia-card-head::-webkit-details-marker { display: none; }
    .ia-card-icon { color: var(--accent-blue); }
    .ia-chev { margin-left: auto; color: var(--text-muted); transition: transform 0.2s var(--ease-out); font-size: 0.8rem; }
    .ia-card[open] .ia-chev { transform: rotate(90deg); }
    .ia-card-body { padding: 0 14px 14px; font-size: 0.84rem; }
    .ia-scroll { max-height: 280px; overflow-y: auto; }
    .ia-toolrow { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
    .ia-climate-grid { display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 6px; align-items: end; }
    .ia-vendor-row { display: flex; gap: 8px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border-color); }
    .ia-vendor-row:last-child { border-bottom: none; }
    .ia-vendor-name { flex: 1; min-width: 0; }
    .ia-empty { color: var(--text-muted); font-size: 0.82rem; padding: 14px 0; text-align: center; }
    .ia-table { width: 100%; font-size: 0.78rem; border-collapse: collapse; }
    .ia-table th { text-align: left; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.64rem; letter-spacing: 0.4px; padding: 0 8px 5px 0; }
    .ia-table td { padding: 4px 8px 4px 0; border-top: 1px solid var(--border-color); vertical-align: top; }
    .ia-field-list { list-style: none; margin: 0; padding: 0; }
    .ia-field-list li { display: flex; align-items: center; gap: 6px; padding: 3px 0; font-size: 0.78rem; }
    .ia-field-group { margin-bottom: 10px; }
    .ia-field-group-title { font-weight: 600; font-size: 0.78rem; text-transform: capitalize; margin-bottom: 2px; }
  </style>`;

  const state = { health: null, duplicates: [], cheapest: [], extraFields: { spool: [], filament: [], vendor: [] }, orcaResults: [], conflicts: [] };

  // ────────────────────────────────────────────────
  // Live Spoolman health from WS (already broadcast in round 1)
  // ────────────────────────────────────────────────
  window._wsListeners = window._wsListeners || [];
  window._wsListeners.push((msg) => {
    if (msg?.type === 'spoolman_health' && msg.data) {
      state.health = msg.data;
      renderHealthBadge();
    }
  });

  function renderHealthBadge() {
    const el = document.getElementById('inv-spoolman-health');
    if (!el) return;
    if (!state.health) { el.innerHTML = ''; return; }
    const cls = state.health.ok ? 'bg-success' : 'bg-danger';
    el.innerHTML = `<span class="badge ${cls}"><i class="bi bi-${state.health.ok ? 'check-circle' : 'x-circle'}"></i> Spoolman ${state.health.ok ? 'online' : 'offline'}</span>`;
  }

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  async function refresh() {
    const el = document.getElementById('inventory-admin-2026');
    if (!el) return;

    // Fetch everything in parallel
    const [health, cheapest, sfSpool, sfFil, sfVen, conflicts] = await Promise.all([
      fetch('/api/spoolman/health').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/filaments/cheapest-listings').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/extra-fields/spool').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/extra-fields/filament').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/extra-fields/vendor').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/inventory/spools?has_sync_error=1').then(r => r.ok ? r.json() : []).catch(() => []),
    ]);

    if (health?.enabled !== undefined) state.health = { ok: !!health.ok, error: health.error || null };
    state.cheapest = Array.isArray(cheapest) ? cheapest : [];
    state.extraFields = { spool: sfSpool || [], filament: sfFil || [], vendor: sfVen || [] };
    state.conflicts = Array.isArray(conflicts) ? conflicts.filter(s => s.spoolman_sync_error) : [];

    // Collapsible tool card with a clean header + chevron (no raw <details>
    // marker). opts.open expands it by default.
    const card = (icon, title, body, opts = {}) => `
      <details class="card ia-card" ${opts.open ? 'open' : ''}>
        <summary class="ia-card-head"><i class="bi bi-${icon} ia-card-icon"></i><span>${title}</span><i class="bi bi-chevron-right ia-chev"></i></summary>
        <div class="ia-card-body">${body}</div>
      </details>`;
    const tool = (id, ...buttons) => `<div class="ia-toolrow">${buttons.join('')}</div>`;
    const ghost = (onclick, label, extra = '') => `<button class="form-btn form-btn-sm form-btn-ghost" onclick="${onclick}" ${extra}>${label}</button>`;

    el.innerHTML = `
      ${_iaStyle()}
      <div id="inv-spoolman-health" class="ia-health"></div>
      ${state.conflicts.length ? renderConflicts() : ''}

      <!-- Top action bar — most-used buttons always visible -->
      <div class="card ia-actionbar">
        <span class="ia-actionbar-label">${t('admin_inv.quick_actions', 'Quick actions')}</span>
        ${ghost("_invAdmin.importAll()", '<i class="bi bi-cloud-arrow-down"></i> ' + t('admin_inv.import_from_spoolman', 'Import from Spoolman'), 'title="Pull every vendor / filament / spool from Spoolman"')}
        ${ghost("_invAdmin.detectDupes()", '<i class="bi bi-files"></i> ' + t('admin_inv.dedupe_profiles', 'Dedupe profiles'), 'title="Find and link duplicate filament profiles"')}
        ${ghost("_invAdmin.trackPrices()", '<i class="bi bi-cash-coin"></i> ' + t('admin_inv.track_prices', 'Track prices'), 'title="Snapshot current retailer prices"')}
        ${ghost("_invAdmin.syncExtraFields()", '<i class="bi bi-sliders"></i> ' + t('admin_inv.sync_custom_fields', 'Sync custom fields'), 'title="Pull custom-field schema from Spoolman"')}
        ${ghost("_invAdmin.refreshTypeBridge()", '<i class="bi bi-arrow-repeat"></i> ' + t('admin_inv.refresh_type_bridge', 'Refresh type-bridge'))}
        ${ghost("_invAdmin.refreshPerVendor()", '<i class="bi bi-arrow-repeat"></i> ' + t('admin_inv.refresh_smdb_per_vendor', 'Refresh SMDB per vendor'))}
        <a class="form-btn form-btn-sm form-btn-ghost" href="/api/spoolman/export" download><i class="bi bi-box-arrow-down"></i> ${t('admin_inv.export_json', 'Export JSON')}</a>
        <span class="ia-results">
          <span id="inv-import-result"></span>
          <span id="inv-dupe-result"></span>
          <span id="inv-climate-result"></span>
        </span>
      </div>

      <div class="ia-grid">

        ${card('currency-dollar', t('admin_inv.cheapest_retailer_per_filament', 'Cheapest retailer per filament'),
          `<div class="ia-scroll">${renderCheapest()}</div>`, { open: true })}

        ${card('shop', t('admin_inv.vendor_spoolman_sync', 'Vendor → Spoolman sync'),
          `<div id="inv-vendor-list" class="ia-scroll"></div>`, { open: true })}

        ${card('sliders', t('admin_inv.custom_fields_spoolman_compatible', 'Custom fields (Spoolman-compatible)'), renderExtraFields())}

        ${card('search', t('admin_inv.orcaslicer_preset_browser', 'OrcaSlicer preset browser'), `
          ${tool('orca',
            '<input class="form-input form-input-sm" id="inv-orca-vendor" placeholder="' + t('admin_inv.vendor', 'Vendor') + ' (BBL, Prusa…)" style="flex:1;min-width:120px">',
            '<input class="form-input form-input-sm" id="inv-orca-material" placeholder="' + t('filament.filter_material', 'Material') + ' (PLA, PETG…)" style="flex:1;min-width:120px">',
            ghost("_invAdmin.searchOrca()", t('common.search', 'Search')))}
          <div id="inv-orca-results" class="ia-scroll"></div>`)}

        ${card('search-heart', t('admin_inv.profile_matcher', 'Profile compatibility matcher'), `
          ${tool('match',
            '<input class="form-input form-input-sm" id="inv-match-vendor" placeholder="' + t('admin_inv.vendor', 'Vendor') + '" style="flex:1;min-width:100px">',
            '<input class="form-input form-input-sm" id="inv-match-material" placeholder="' + t('filament.filter_material', 'Material') + '" style="flex:1;min-width:100px">',
            '<input class="form-input form-input-sm" id="inv-match-color" placeholder="color_hex" style="flex:1;min-width:120px">',
            ghost("_invAdmin.findMatch()", t('admin_inv.match', 'Match')))}
          <div id="inv-match-out" class="ia-scroll"></div>`)}

        ${card('graph-up', t('admin_inv.price_trend', 'Price trend (per profile)'), `
          ${tool('trend',
            '<input class="form-input form-input-sm" id="inv-trend-id" type="number" placeholder="' + t('admin_inv.profile_id', 'Profile ID') + '" style="flex:1;min-width:100px">',
            '<input class="form-input form-input-sm" id="inv-trend-days" type="number" placeholder="' + t('admin_inv.days', 'Days') + '" value="30" style="width:80px">',
            ghost("_invAdmin.loadTrend()", t('common.load', 'Load')))}
          <div id="inv-trend-out"></div>`)}

        ${card('thermometer-half', t('admin_inv.record_climate', 'Record location climate'), `
          <div class="ia-climate-grid">
            <input class="form-input form-input-sm" id="inv-loc-id" type="number" placeholder="${t('admin_inv.location_id', 'Location ID')}">
            <input class="form-input form-input-sm" id="inv-loc-temp" type="number" step="0.1" placeholder="${t('admin_inv.temp_c', 'Temp °C')}">
            <input class="form-input form-input-sm" id="inv-loc-humid" type="number" step="0.1" placeholder="${t('admin_inv.humidity_pct', 'Humidity %')}">
            ${ghost("_invAdmin.recordClimate()", t('admin_inv.record', 'Record'))}
          </div>`)}

        ${card('diagram-3', t('admin_inv.materials_taxonomy', 'Materials taxonomy & purge matrix'), `
          ${tool('tax',
            ghost("_invAdmin.loadTaxonomy()", t('admin_inv.load_materials', 'Load materials')),
            ghost("_invAdmin.loadPurge()", t('admin_inv.load_purge', 'Load purge matrix')))}
          <div id="inv-taxonomy-out" class="ia-scroll" style="max-height:200px"></div>
          <div id="inv-purge-out" class="ia-scroll" style="max-height:200px;margin-top:6px"></div>`)}

        ${card('printer', t('admin_inv.printer_presets', 'Printer presets & MM systems'), `
          ${tool('preset',
            '<input class="form-input form-input-sm" id="inv-preset-vendor" placeholder="' + t('admin_inv.vendor', 'Vendor') + ' (bambu, prusa…)" style="flex:1;min-width:120px">',
            ghost("_invAdmin.listPresets()", t('admin_inv.presets', 'Presets')),
            ghost("_invAdmin.listMM()", t('admin_inv.mm_systems', 'MM systems')))}
          <div id="inv-preset-out" class="ia-scroll"></div>`)}

        ${card('activity', t('admin_inv.health_history', 'Spoolman health history & type-bridge'), `
          ${tool('health',
            ghost("_invAdmin.loadHealthHistory()", t('admin_inv.last_50', 'Last 50 checks')),
            ghost("_invAdmin.loadTypeBridge()", t('admin_inv.type_bridge_map', 'Type-bridge map')))}
          <div id="inv-health-out" class="ia-scroll" style="max-height:180px"></div>
          <div id="inv-bridge-out" class="ia-scroll" style="max-height:180px;margin-top:6px"></div>`)}
      </div>
    `;

    // Async-populate the vendor list
    fetch('/api/vendors').then(r => r.ok ? r.json() : []).then(vendors => {
      const vel = document.getElementById('inv-vendor-list');
      if (!vel) return;
      if (!Array.isArray(vendors) || vendors.length === 0) {
        vel.innerHTML = '<div class="ia-empty">' + t('admin_inv.no_vendors', 'No vendors.') + '</div>';
        return;
      }
      vel.innerHTML = vendors.slice(0, 100).map(v => `
        <div class="ia-vendor-row">
          <span class="ia-vendor-name">${esc(v.name)} ${v.spoolman_id ? `<span class="badge text-bg-success">synced #${esc(v.spoolman_id)}</span>` : ''}</span>
          ${ghost(`_invAdmin.syncVendor(${v.id})`, t('admin_inv.sync', 'Sync'))}
        </div>`).join('');
    }).catch(() => {});

    renderHealthBadge();
  }

  function renderConflicts() {
    const rows = state.conflicts.slice(0, 10).map(s => `<li>Spool #${esc(s.id)} (${esc(s.short_id || '')}): ${esc(s.spoolman_sync_error)}</li>`).join('');
    return `
      <div class="alert alert-warning" style="font-size:0.85rem">
        <strong><i class="bi bi-exclamation-triangle"></i> ${state.conflicts.length} spool(s) have sync conflicts</strong>
        <ul class="mb-0" style="font-size:0.8rem">${rows}</ul>
        <small>Edit the spool in the inventory tab and save again — the next push will force-overwrite the remote.</small>
      </div>`;
  }

  function renderCheapest() {
    if (state.cheapest.length === 0) return `<div class="ia-empty">${t('admin_inv.no_price_data', 'No price data yet — click Track prices after a sync.')}</div>`;
    const rows = state.cheapest.slice(0, 30).map(c => `
      <tr>
        <td>${esc(c.vendor_name || '')} ${esc(c.name || '')}</td>
        <td>${esc(c.material || '')}</td>
        <td>${c.price != null ? esc(c.price) : '-'} ${esc(c.currency || '')}</td>
        <td>${c.retailer ? `<a href="${esc(c.retailer_url || '#')}" target="_blank" rel="noopener">${esc(c.retailer)}</a>` : '-'}</td>
      </tr>`).join('');
    return `<table class="ia-table"><thead><tr><th>${t('filament.tab_filament', 'Filament')}</th><th>${t('filament.filter_material', 'Material')}</th><th>${t('procurement.cost', 'Price')}</th><th>${t('admin_inv.retailer', 'Retailer')}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function renderExtraFields() {
    const block = (entity, rows) => `
      <div class="ia-field-group">
        <div class="ia-field-group-title">${esc(entity)} (${rows.length})</div>
        <ul class="ia-field-list">
          ${rows.map(r => `<li><code>${esc(r.key)}</code> &middot; ${esc(r.name)} &middot; ${esc(r.field_type)} <button class="form-btn form-btn-sm form-btn-ghost" onclick="_invAdmin.delField(${r.id})" title="${t('settings.delete', 'Delete')}" style="margin-left:auto;padding:0 6px">&times;</button></li>`).join('') || `<li class="text-muted">${t('common.none', 'none')}</li>`}
        </ul>
      </div>`;
    return block('spool', state.extraFields.spool) + block('filament', state.extraFields.filament) + block('vendor', state.extraFields.vendor);
  }

  // ────────────────────────────────────────────────
  // Actions
  // ────────────────────────────────────────────────
  function setResult(id, txt, cls = '') {
    const el = document.getElementById(id);
    if (el) { el.textContent = txt; el.className = cls; }
  }

  window._invAdmin = {
    async importAll() {
      setResult('inv-import-result', 'Importing...');
      try {
        const res = await fetch('/api/spoolman/import-all', { method: 'POST' });
        const data = await res.json();
        if (res.ok) setResult('inv-import-result', `Imported ${data.vendors || 0} vendors, ${data.filaments || 0} profiles, ${data.spools || 0} spools.`);
        else setResult('inv-import-result', 'Failed: ' + (data.error || res.status));
      } catch (e) { setResult('inv-import-result', 'Failed: ' + e.message); }
    },
    async detectDupes() {
      setResult('inv-dupe-result', 'Scanning...');
      try {
        const res = await fetch('/api/filaments/detect-duplicates', { method: 'POST' });
        const data = await res.json();
        setResult('inv-dupe-result', `Scanned ${data.scanned}, merged ${data.merged} duplicates.`);
      } catch (e) { setResult('inv-dupe-result', 'Failed: ' + e.message); }
    },
    async syncExtraFields() {
      try {
        const res = await fetch('/api/extra-fields/sync', { method: 'POST' });
        const data = await res.json();
        if (window.showToast) window.showToast(`Synced: ${JSON.stringify(data)}`, 'success');
        refresh();
      } catch (e) { if (window.showToast) window.showToast('Sync failed: ' + e.message, 'error'); }
    },
    async delField(id) {
      if (!confirm('Delete this custom field?')) return;
      await fetch('/api/extra-fields/' + id, { method: 'DELETE' });
      refresh();
    },
    async searchOrca() {
      const vendor = document.getElementById('inv-orca-vendor')?.value.trim();
      const material = document.getElementById('inv-orca-material')?.value.trim();
      const qs = new URLSearchParams();
      if (vendor) qs.set('vendor', vendor);
      if (material) qs.set('material', material);
      const target = document.getElementById('inv-orca-results');
      if (target) target.innerHTML = '<em>Searching...</em>';
      try {
        const rows = await fetch('/api/orcaslicer/filaments?' + qs).then(r => r.json());
        if (!Array.isArray(rows) || rows.length === 0) {
          target.innerHTML = '<div class="ia-empty">No matches.</div>'; return;
        }
        target.innerHTML = '<ul class="mb-0">' + rows.slice(0, 50).map(r => `
          <li>${esc(r.vendor)} / ${esc(r.name)} <span class="text-muted">${esc(r.material || '')}</span>
            <button class="form-btn form-btn-sm" onclick="_invAdmin.importOrca(${r.id})">Import</button>
          </li>`).join('') + '</ul>';
      } catch (e) { target.innerHTML = 'Search failed: ' + esc(e.message); }
    },
    async importOrca(id) {
      try {
        const res = await fetch(`/api/orcaslicer/filaments/${id}/import`, { method: 'POST' });
        const data = await res.json();
        if (window.showToast) window.showToast(res.ok ? `Imported as profile #${data.profile_id}` : ('Import failed: ' + data.error), res.ok ? 'success' : 'error');
      } catch (e) { if (window.showToast) window.showToast('Import failed: ' + e.message, 'error'); }
    },
    async trackPrices() {
      try {
        const res = await fetch('/api/filaments/track-prices', { method: 'POST' });
        const data = await res.json();
        if (window.showToast) window.showToast(`Tracked ${data.tracked || 0} prices`, 'success');
        refresh();
      } catch (e) { if (window.showToast) window.showToast('Failed: ' + e.message, 'error'); }
    },
    async refreshPerVendor() {
      try {
        const res = await fetch('/api/spoolmandb/refresh-per-vendor', { method: 'POST' });
        const data = await res.json();
        if (window.showToast) window.showToast(`Imported ${data.imported || 0} filaments`, 'success');
      } catch (e) { if (window.showToast) window.showToast('Failed: ' + e.message, 'error'); }
    },
    async refreshTypeBridge() {
      try {
        const res = await fetch('/api/spoolman/refresh-type-bridge', { method: 'POST' });
        const data = await res.json();
        if (window.showToast) window.showToast(`Mapped ${data.mapped || 0} types`, 'success');
      } catch (e) { if (window.showToast) window.showToast('Failed: ' + e.message, 'error'); }
    },

    async recordClimate() {
      const id = document.getElementById('inv-loc-id')?.value;
      const temp = parseFloat(document.getElementById('inv-loc-temp')?.value);
      const humidity = parseFloat(document.getElementById('inv-loc-humid')?.value);
      if (!id) { setResult('inv-climate-result', 'Location ID required'); return; }
      try {
        const res = await fetch(`/api/inventory/locations/${encodeURIComponent(id)}/climate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            temp: Number.isFinite(temp) ? temp : null,
            humidity: Number.isFinite(humidity) ? humidity : null,
          }),
        });
        const data = await res.json();
        setResult('inv-climate-result', data.out_of_range ? '⚠ Out of range' : '✓ Recorded');
      } catch (e) { setResult('inv-climate-result', 'Failed: ' + e.message); }
    },

    async loadTaxonomy() {
      const rows = await fetch('/api/materials/taxonomy').then(r => r.json()).catch(() => []);
      const el = document.getElementById('inv-taxonomy-out');
      if (!el) return;
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<div class="ia-empty">No materials.</div>'; return; }
      el.innerHTML = `<table class="ia-table"><thead><tr><th>Material</th><th>Parent</th><th>Density</th><th>Nozzle</th><th>Bed</th><th>Enclosure</th></tr></thead><tbody>` +
        rows.map(m => `<tr><td><strong>${esc(m.material)}</strong></td><td>${esc(m.parent_material || '-')}</td><td>${m.density != null ? esc(m.density) : '-'}</td><td>${m.extruder_temp_min || '-'}-${m.extruder_temp_max || '-'}</td><td>${m.bed_temp_min || '-'}-${m.bed_temp_max || '-'}</td><td>${m.enclosure_required ? 'yes' : 'no'}</td></tr>`).join('') + '</tbody></table>';
    },

    async loadPurge() {
      const rows = await fetch('/api/filaments/purge-matrix').then(r => r.json()).catch(() => []);
      const el = document.getElementById('inv-purge-out');
      if (!el) return;
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<div class="ia-empty">No purge values imported yet. Run refresh-modular.</div>'; return; }
      el.innerHTML = `<table class="ia-table"><thead><tr><th>From</th><th>To</th><th>Volume (mm³)</th><th>Source</th></tr></thead><tbody>` +
        rows.slice(0, 200).map(r => `<tr><td>${esc(r.from_material)}</td><td>${esc(r.to_material)}</td><td>${esc(r.purge_volume_mm3)}</td><td>${esc(r.source || '')}</td></tr>`).join('') + '</tbody></table>';
    },

    async listPresets() {
      const vendor = document.getElementById('inv-preset-vendor')?.value.trim();
      const url = vendor ? `/api/presets/printer?vendor=${encodeURIComponent(vendor)}` : '/api/presets/printer';
      const data = await fetch(url).then(r => r.json()).catch(() => ({}));
      const rows = Array.isArray(data) ? data : (data.capabilities ? [] : [data]);
      const el = document.getElementById('inv-preset-out');
      if (!el) return;
      if (Array.isArray(data) && data.length === 0) { el.innerHTML = '<div class="ia-empty">No presets for this vendor.</div>'; return; }
      if (!Array.isArray(data) && data.capabilities) {
        el.innerHTML = '<strong>All capabilities</strong>: ' + data.capabilities.map(c => `<span class="badge text-bg-secondary">${esc(c)}</span>`).join(' ');
        return;
      }
      el.innerHTML = rows.map(p => `
        <div style="border-bottom:1px solid var(--bs-border-color);padding:4px 0">
          <strong>${esc(p.label || p.model)}</strong> ${p._placeholder ? '<span class="badge text-bg-warning">placeholder</span>' : ''}
          <div class="text-muted" style="font-size:0.75rem">${esc((p.capabilities || []).join(', '))}</div>
        </div>`).join('');
    },

    async listMM() {
      const data = await fetch('/api/presets/multi-material').then(r => r.json()).catch(() => []);
      const el = document.getElementById('inv-preset-out');
      if (!el) return;
      if (!Array.isArray(data)) { el.innerHTML = '<p class="text-muted">Error loading.</p>'; return; }
      el.innerHTML = '<table class="ia-table"><thead><tr><th>System</th><th>Vendor</th><th>Slots</th><th>RFID</th><th>Status</th></tr></thead><tbody>' +
        data.map(s => `<tr><td><strong>${esc(s.label || s.id)}</strong></td><td>${esc(s.vendor || '-')}</td><td>${esc(s.slots || '-')}</td><td>${s.rfid ? '✓' : '-'}</td><td>${esc(s.status || '-')}</td></tr>`).join('') + '</tbody></table>';
    },

    async loadTrend() {
      const id = document.getElementById('inv-trend-id')?.value;
      const days = document.getElementById('inv-trend-days')?.value || '30';
      if (!id) return;
      const rows = await fetch(`/api/filaments/${encodeURIComponent(id)}/price-trend?days=${days}`).then(r => r.json()).catch(() => []);
      const el = document.getElementById('inv-trend-out');
      if (!el) return;
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<div class="ia-empty">No price history.</div>'; return; }
      // Tiny SVG sparkline
      const w = 320, h = 80;
      const prices = rows.map(r => r.price).filter(p => p != null);
      const min = Math.min(...prices), max = Math.max(...prices), range = max - min || 1;
      const points = rows.map((r, i) => {
        const x = (i / Math.max(1, rows.length - 1)) * w;
        const y = h - ((r.price - min) / range) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="background:var(--bs-tertiary-bg);border-radius:4px">
        <polyline fill="none" stroke="var(--bs-primary)" stroke-width="2" points="${points}"/>
      </svg>
      <div style="font-size:0.75rem;color:var(--text-muted)">Min: ${min.toFixed(2)} · Max: ${max.toFixed(2)} · ${rows.length} data points</div>`;
    },

    async findMatch() {
      const vendor = document.getElementById('inv-match-vendor')?.value.trim();
      const material = document.getElementById('inv-match-material')?.value.trim();
      const color = document.getElementById('inv-match-color')?.value.trim().replace('#', '');
      const res = await fetch('/api/filaments/find-match', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor, material, color_hex: color }),
      });
      const data = await res.json();
      const el = document.getElementById('inv-match-out');
      if (!el) return;
      if (!data?.candidates || data.candidates.length === 0) { el.innerHTML = '<div class="ia-empty">No matches found.</div>'; return; }
      el.innerHTML = '<ol class="mb-0">' + data.candidates.map(c => `<li>${esc(c.manufacturer || '')} — ${esc(c.name || c.color_name || '')} (${esc(c.material || '')}) <code>${esc(c.color_hex || '')}</code></li>`).join('') + '</ol>';
    },

    async syncVendor(vendorId) {
      try {
        const res = await fetch(`/api/vendors/${vendorId}/spoolman-sync`, { method: 'POST' });
        const data = await res.json();
        if (window.showToast) window.showToast(res.ok ? 'Vendor synced' : ('Failed: ' + (data.error || 'unknown')), res.ok ? 'success' : 'error');
        refresh();
      } catch (e) { if (window.showToast) window.showToast('Sync failed: ' + e.message, 'error'); }
    },

    async loadHealthHistory() {
      const rows = await fetch('/api/spoolman/health-history?limit=50').then(r => r.json()).catch(() => []);
      const el = document.getElementById('inv-health-out');
      if (!el) return;
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<div class="ia-empty">No history yet.</div>'; return; }
      el.innerHTML = '<table class="ia-table"><thead><tr><th>When</th><th>OK</th><th>Error</th></tr></thead><tbody>' +
        rows.map(r => `<tr><td>${esc(r.checked_at)}</td><td>${r.ok ? '✓' : '✗'}</td><td>${esc(r.error || '')}</td></tr>`).join('') + '</tbody></table>';
    },

    async loadTypeBridge() {
      const res = await fetch('/api/spoolman/refresh-type-bridge', { method: 'POST' });
      const data = await res.json();
      const el = document.getElementById('inv-bridge-out');
      if (!el) return;
      if (data?.error) { el.innerHTML = '<p class="text-muted">' + esc(data.error) + '</p>'; return; }
      el.innerHTML = `<div>Mapped: <strong>${esc(data.mapped || 0)}</strong></div>
        <div>Orphan types (fallback identity): <strong>${esc(data.orphans?.length || 0)}</strong></div>
        ${data.orphans?.length ? '<ul class="mb-0" style="font-size:0.75rem">' + data.orphans.map(o => `<li>${esc(o)}</li>`).join('') + '</ul>' : ''}`;
    },
  };

  // Panel loader calls renderInventoryAdmin2026() after injecting the container.
  window.renderInventoryAdmin2026 = refresh;
  document.addEventListener('DOMContentLoaded', refresh);
  window.refreshInventoryAdmin = refresh;
})();
