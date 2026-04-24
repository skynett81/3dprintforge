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

    el.innerHTML = `
      <div id="inv-spoolman-health" style="margin-bottom:8px"></div>

      ${state.conflicts.length ? renderConflicts() : ''}

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-cloud-arrow-down"></i> Initial import from Spoolman
        </summary>
        <div style="margin-top:8px;font-size:0.85rem">
          <p class="text-muted" style="font-size:0.8rem">Pulls every vendor, filament profile, and spool from the connected Spoolman server. Safe to re-run — existing rows are updated in place.</p>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.importAll()">Run import</button>
          <span id="inv-import-result" style="margin-left:8px;font-size:0.8rem"></span>
        </div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-files"></i> Duplicate filament profiles
        </summary>
        <div style="margin-top:8px">
          <button class="form-btn form-btn-sm" onclick="_invAdmin.detectDupes()">Detect &amp; link duplicates</button>
          <span id="inv-dupe-result" style="margin-left:8px;font-size:0.8rem"></span>
        </div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-currency-dollar"></i> Cheapest retailer per filament
        </summary>
        <div style="margin-top:8px;max-height:280px;overflow-y:auto;font-size:0.82rem">
          ${renderCheapest()}
        </div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-sliders"></i> Custom fields (Spoolman-compatible)
        </summary>
        <div style="margin-top:8px">
          ${renderExtraFields()}
          <button class="form-btn form-btn-sm mt-sm" onclick="_invAdmin.syncExtraFields()">Pull from Spoolman</button>
        </div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-search"></i> OrcaSlicer preset browser
        </summary>
        <div style="margin-top:8px">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <input class="form-input" id="inv-orca-vendor" placeholder="Vendor (e.g. BBL, Prusa)" style="width:160px">
            <input class="form-input" id="inv-orca-material" placeholder="Material (e.g. PLA, PETG)" style="width:140px">
            <button class="form-btn form-btn-sm" onclick="_invAdmin.searchOrca()">Search</button>
          </div>
          <div id="inv-orca-results" style="margin-top:8px;max-height:320px;overflow-y:auto;font-size:0.82rem"></div>
        </div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-thermometer-half"></i> Record location climate
        </summary>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
          <input class="form-input" id="inv-loc-id" type="number" placeholder="Location ID" style="width:110px">
          <input class="form-input" id="inv-loc-temp" type="number" step="0.1" placeholder="Temp °C" style="width:110px">
          <input class="form-input" id="inv-loc-humid" type="number" step="0.1" placeholder="Humidity %" style="width:110px">
          <button class="form-btn form-btn-sm" onclick="_invAdmin.recordClimate()">Record</button>
          <span id="inv-climate-result" style="font-size:0.8rem"></span>
        </div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-diagram-3"></i> Materials taxonomy &amp; purge matrix
        </summary>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
          <button class="form-btn form-btn-sm" onclick="_invAdmin.loadTaxonomy()">Load materials</button>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.loadPurge()">Load purge matrix</button>
        </div>
        <div id="inv-taxonomy-out" style="margin-top:8px;max-height:220px;overflow-y:auto;font-size:0.82rem"></div>
        <div id="inv-purge-out" style="margin-top:8px;max-height:220px;overflow-y:auto;font-size:0.82rem"></div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-printer"></i> Printer presets &amp; multi-material systems
        </summary>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
          <input class="form-input" id="inv-preset-vendor" placeholder="Vendor (e.g. bambu)" style="width:180px">
          <button class="form-btn form-btn-sm" onclick="_invAdmin.listPresets()">List presets</button>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.listMM()">List MM systems</button>
        </div>
        <div id="inv-preset-out" style="margin-top:8px;max-height:260px;overflow-y:auto;font-size:0.82rem"></div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-graph-up"></i> Price trend (per filament profile)
        </summary>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
          <input class="form-input" id="inv-trend-id" type="number" placeholder="Profile ID" style="width:120px">
          <input class="form-input" id="inv-trend-days" type="number" placeholder="Days" value="30" style="width:90px">
          <button class="form-btn form-btn-sm" onclick="_invAdmin.loadTrend()">Load</button>
        </div>
        <div id="inv-trend-out" style="margin-top:8px;font-size:0.82rem"></div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-search-heart"></i> Profile compatibility matcher
        </summary>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
          <input class="form-input" id="inv-match-vendor" placeholder="Vendor" style="width:140px">
          <input class="form-input" id="inv-match-material" placeholder="Material" style="width:120px">
          <input class="form-input" id="inv-match-color" placeholder="color_hex (no #)" style="width:140px">
          <button class="form-btn form-btn-sm" onclick="_invAdmin.findMatch()">Find match</button>
        </div>
        <div id="inv-match-out" style="margin-top:8px;max-height:260px;overflow-y:auto;font-size:0.82rem"></div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-shop"></i> Vendor → Spoolman sync
        </summary>
        <div id="inv-vendor-list" style="margin-top:8px;max-height:240px;overflow-y:auto;font-size:0.82rem"></div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-activity"></i> Spoolman health history &amp; type-bridge
        </summary>
        <div style="margin-top:8px">
          <button class="form-btn form-btn-sm" onclick="_invAdmin.loadHealthHistory()">Load last 50 checks</button>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.loadTypeBridge()">View type-bridge mappings</button>
        </div>
        <div id="inv-health-out" style="margin-top:8px;max-height:200px;overflow-y:auto;font-size:0.82rem"></div>
        <div id="inv-bridge-out" style="margin-top:8px;max-height:200px;overflow-y:auto;font-size:0.82rem"></div>
      </details>

      <details class="card mb-sm" style="padding:10px">
        <summary style="cursor:pointer;font-weight:600">
          <i class="bi bi-box-arrow-down"></i> Export &amp; tools
        </summary>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
          <a class="form-btn form-btn-sm" href="/api/spoolman/export" download>Download Spoolman JSON</a>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.trackPrices()">Track prices now</button>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.refreshPerVendor()">Refresh per-vendor SMDB</button>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.refreshTypeBridge()">Refresh type-bridge</button>
        </div>
      </details>
    `;

    // Async-populate the vendor list
    fetch('/api/vendors').then(r => r.ok ? r.json() : []).then(vendors => {
      const el = document.getElementById('inv-vendor-list');
      if (!el) return;
      if (!Array.isArray(vendors) || vendors.length === 0) {
        el.innerHTML = '<p class="text-muted">No vendors.</p>';
        return;
      }
      el.innerHTML = '<ul class="mb-0">' + vendors.slice(0, 100).map(v => `
        <li style="display:flex;gap:6px;align-items:center">
          <span style="flex:1">${esc(v.name)} ${v.spoolman_id ? `<span class="badge text-bg-success">synced #${esc(v.spoolman_id)}</span>` : ''}</span>
          <button class="form-btn form-btn-sm" onclick="_invAdmin.syncVendor(${v.id})">Sync to Spoolman</button>
        </li>`).join('') + '</ul>';
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
    if (state.cheapest.length === 0) return '<p class="text-muted">No price data yet. Click "Track prices now" after a seed refresh.</p>';
    const rows = state.cheapest.slice(0, 30).map(c => `
      <tr>
        <td>${esc(c.vendor_name || '')} ${esc(c.name || '')}</td>
        <td>${esc(c.material || '')}</td>
        <td>${c.price != null ? esc(c.price) : '-'} ${esc(c.currency || '')}</td>
        <td>${c.retailer ? `<a href="${esc(c.retailer_url || '#')}" target="_blank" rel="noopener">${esc(c.retailer)}</a>` : '-'}</td>
      </tr>`).join('');
    return `<table style="width:100%"><thead><tr><th>Filament</th><th>Material</th><th>Price</th><th>Retailer</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function renderExtraFields() {
    const block = (entity, rows) => `
      <div style="margin-bottom:8px">
        <strong style="text-transform:capitalize">${esc(entity)}</strong> (${rows.length})
        <ul class="mb-0" style="font-size:0.8rem;max-height:120px;overflow-y:auto">
          ${rows.map(r => `<li><code>${esc(r.key)}</code> &middot; ${esc(r.name)} &middot; ${esc(r.field_type)} <button class="form-btn form-btn-sm" onclick="_invAdmin.delField(${r.id})" title="Delete">&times;</button></li>`).join('') || '<li class="text-muted">none</li>'}
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
          target.innerHTML = '<p class="text-muted">No matches.</p>'; return;
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
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<p class="text-muted">No materials.</p>'; return; }
      el.innerHTML = `<table style="width:100%"><thead><tr><th>Material</th><th>Parent</th><th>Density</th><th>Nozzle</th><th>Bed</th><th>Enclosure</th></tr></thead><tbody>` +
        rows.map(m => `<tr><td><strong>${esc(m.material)}</strong></td><td>${esc(m.parent_material || '-')}</td><td>${m.density != null ? esc(m.density) : '-'}</td><td>${m.extruder_temp_min || '-'}-${m.extruder_temp_max || '-'}</td><td>${m.bed_temp_min || '-'}-${m.bed_temp_max || '-'}</td><td>${m.enclosure_required ? 'yes' : 'no'}</td></tr>`).join('') + '</tbody></table>';
    },

    async loadPurge() {
      const rows = await fetch('/api/filaments/purge-matrix').then(r => r.json()).catch(() => []);
      const el = document.getElementById('inv-purge-out');
      if (!el) return;
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<p class="text-muted">No purge values imported yet. Run refresh-modular.</p>'; return; }
      el.innerHTML = `<table style="width:100%"><thead><tr><th>From</th><th>To</th><th>Volume (mm³)</th><th>Source</th></tr></thead><tbody>` +
        rows.slice(0, 200).map(r => `<tr><td>${esc(r.from_material)}</td><td>${esc(r.to_material)}</td><td>${esc(r.purge_volume_mm3)}</td><td>${esc(r.source || '')}</td></tr>`).join('') + '</tbody></table>';
    },

    async listPresets() {
      const vendor = document.getElementById('inv-preset-vendor')?.value.trim();
      const url = vendor ? `/api/presets/printer?vendor=${encodeURIComponent(vendor)}` : '/api/presets/printer';
      const data = await fetch(url).then(r => r.json()).catch(() => ({}));
      const rows = Array.isArray(data) ? data : (data.capabilities ? [] : [data]);
      const el = document.getElementById('inv-preset-out');
      if (!el) return;
      if (Array.isArray(data) && data.length === 0) { el.innerHTML = '<p class="text-muted">No presets for this vendor.</p>'; return; }
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
      el.innerHTML = '<table style="width:100%"><thead><tr><th>System</th><th>Vendor</th><th>Slots</th><th>RFID</th><th>Status</th></tr></thead><tbody>' +
        data.map(s => `<tr><td><strong>${esc(s.label || s.id)}</strong></td><td>${esc(s.vendor || '-')}</td><td>${esc(s.slots || '-')}</td><td>${s.rfid ? '✓' : '-'}</td><td>${esc(s.status || '-')}</td></tr>`).join('') + '</tbody></table>';
    },

    async loadTrend() {
      const id = document.getElementById('inv-trend-id')?.value;
      const days = document.getElementById('inv-trend-days')?.value || '30';
      if (!id) return;
      const rows = await fetch(`/api/filaments/${encodeURIComponent(id)}/price-trend?days=${days}`).then(r => r.json()).catch(() => []);
      const el = document.getElementById('inv-trend-out');
      if (!el) return;
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<p class="text-muted">No price history.</p>'; return; }
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
      if (!data?.candidates || data.candidates.length === 0) { el.innerHTML = '<p class="text-muted">No matches found.</p>'; return; }
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
      if (!Array.isArray(rows) || rows.length === 0) { el.innerHTML = '<p class="text-muted">No history yet.</p>'; return; }
      el.innerHTML = '<table style="width:100%"><thead><tr><th>When</th><th>OK</th><th>Error</th></tr></thead><tbody>' +
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
