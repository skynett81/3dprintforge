// kb-viewer-2026.js — Complete Knowledge-Base browser in the dashboard.
//
// Exposes every local KB table as tabs: Filaments · Materials · Build Plates
// · Maintenance · Troubleshooting. Each tab has a list pane + a detail pane.
// Clicking a list row loads the full record (including body_markdown) and
// renders Norwegian prose inline.
//
// Container: <div id="kb-viewer-2026">

(function () {
  'use strict';

  const state = {
    tab: 'filaments',
    locale: (() => { try { return localStorage.getItem('kb_locale') || 'nb'; } catch { return 'nb'; } })(),
    lists: { filaments: [], materials: [], plates: [], maint: [], ts: [] },
    detail: null,
    loaded: false,
    bambuOnly: false,
    search: '',
  };

  function setLocale(l) {
    if (l !== 'nb' && l !== 'en') return;
    state.locale = l;
    try { localStorage.setItem('kb_locale', l); } catch {}
    state.detail = null;
    loadLists();
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Very small markdown → HTML: headings, lists, bold, italic, code, paragraphs
  function md(text) {
    if (!text) return '';
    let t = esc(text);
    t = t.replace(/^###\s+(.+)$/gm, '<h5 style="margin-top:12px;margin-bottom:6px;font-weight:700">$1</h5>');
    t = t.replace(/^##\s+(.+)$/gm, '<h4 style="margin-top:14px;margin-bottom:6px;font-weight:700;border-bottom:1px solid var(--bs-border-color);padding-bottom:2px">$1</h4>');
    t = t.replace(/^#\s+(.+)$/gm, '<h3 style="font-weight:700;margin:14px 0 8px">$1</h3>');
    t = t.replace(/```([\s\S]*?)```/g, (_, c) => `<pre style="background:var(--bs-tertiary-bg);padding:8px;border-radius:4px;overflow-x:auto"><code>${c.trim()}</code></pre>`);
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Table conversion — detect markdown tables and turn into <table>
    const lines = t.split('\n');
    const out = [];
    let inList = false, inTable = false, tableRows = [];
    const flushTable = () => {
      if (!tableRows.length) return;
      const header = tableRows[0];
      const rest = tableRows.slice(2); // skip | --- |
      out.push('<table class="table table-sm" style="width:auto;font-size:0.82rem;border-collapse:collapse;margin:6px 0"><thead><tr>' + header.map(h => `<th style="border:1px solid var(--bs-border-color);padding:4px 8px">${h}</th>`).join('') + '</tr></thead><tbody>');
      for (const r of rest) out.push('<tr>' + r.map(c => `<td style="border:1px solid var(--bs-border-color);padding:4px 8px">${c}</td>`).join('') + '</tr>');
      out.push('</tbody></table>');
      tableRows = [];
    };
    for (const raw of lines) {
      const line = raw.trimEnd();
      if (/^\s*\|.+\|\s*$/.test(line)) {
        if (inList) { out.push('</ul>'); inList = false; }
        inTable = true;
        tableRows.push(line.split('|').slice(1, -1).map(c => c.trim()));
        continue;
      }
      if (inTable) { flushTable(); inTable = false; }
      if (/^\s*[-*]\s+/.test(line)) {
        if (!inList) { out.push('<ul style="margin:6px 0 6px 20px">'); inList = true; }
        out.push('<li>' + line.replace(/^\s*[-*]\s+/, '') + '</li>');
        continue;
      }
      if (inList) { out.push('</ul>'); inList = false; }
      if (!line.trim()) { out.push(''); continue; }
      out.push('<p style="margin:4px 0">' + line + '</p>');
    }
    if (inList) out.push('</ul>');
    if (inTable) flushTable();
    return out.join('\n');
  }

  async function loadLists() {
    const q = '?locale=' + state.locale;
    const [fil, mat, plates, maint, ts] = await Promise.all([
      fetch('/api/kb/filaments').then(r => r.ok ? r.json() : []),
      fetch('/api/materials/taxonomy').then(r => r.ok ? r.json() : []),
      fetch('/api/kb/build-plates' + q).then(r => r.ok ? r.json() : []),
      fetch('/api/kb/maintenance' + q).then(r => r.ok ? r.json() : []),
      fetch('/api/kb/troubleshooting' + q).then(r => r.ok ? r.json() : []),
    ]);
    state.lists = { filaments: fil || [], materials: mat || [], plates: plates || [], maint: maint || [], ts: ts || [] };
    state.loaded = true;
    render();
  }

  function render() {
    const el = document.getElementById('kb-viewer-2026');
    if (!el) return;
    if (!state.loaded) { el.innerHTML = '<p class="text-muted">Loading KB…</p>'; return; }

    const tabs = [
      { id: 'filaments', label: 'Filaments',       n: state.lists.filaments.length },
      { id: 'materials', label: 'Materials',       n: state.lists.materials.length },
      { id: 'plates',    label: 'Build plates',    n: state.lists.plates.length },
      { id: 'maint',     label: 'Maintenance',     n: state.lists.maint.length },
      { id: 'ts',        label: 'Troubleshooting', n: state.lists.ts.length },
    ];

    el.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:4px;border-bottom:1px solid var(--bs-border-color);padding-bottom:4px;margin-bottom:8px;align-items:center">
        ${tabs.map(t => `<button class="form-btn form-btn-sm ${state.tab === t.id ? 'form-btn-primary' : 'form-btn-secondary'}" onclick="_kb.setTab('${t.id}')">${esc(t.label)} <span class="badge text-bg-secondary">${t.n}</span></button>`).join('')}
        <div style="margin-left:auto;display:flex;gap:4px">
          <button class="form-btn form-btn-sm ${state.locale === 'nb' ? 'form-btn-primary' : 'form-btn-secondary'}" onclick="_kb.setLocale('nb')" title="Norsk">🇳🇴 NB</button>
          <button class="form-btn form-btn-sm ${state.locale === 'en' ? 'form-btn-primary' : 'form-btn-secondary'}" onclick="_kb.setLocale('en')" title="English">🇬🇧 EN</button>
        </div>
      </div>
      <div style="display:flex;gap:12px;min-height:420px">
        <div style="flex:0 0 280px;max-height:520px;overflow-y:auto;border-right:1px solid var(--bs-border-color);padding-right:8px">
          ${renderListHeader()}
          ${renderList()}
        </div>
        <div style="flex:1;max-height:520px;overflow-y:auto;padding:0 8px">
          ${renderDetail()}
        </div>
      </div>`;
  }

  function renderListHeader() {
    if (state.tab === 'filaments') {
      return `
        <div style="margin-bottom:6px;display:flex;gap:6px">
          <input type="text" class="form-input" id="kb-search" placeholder="Search…" value="${esc(state.search)}" oninput="_kb.setSearch(this.value)" style="flex:1;padding:4px 6px;font-size:0.85rem">
          <label style="font-size:0.75rem;white-space:nowrap"><input type="checkbox" ${state.bambuOnly ? 'checked' : ''} onchange="_kb.toggleBambu()"> Bambu only</label>
        </div>`;
    }
    return `<div style="margin-bottom:6px"><input type="text" class="form-input" id="kb-search" placeholder="Search…" value="${esc(state.search)}" oninput="_kb.setSearch(this.value)" style="width:100%;padding:4px 6px;font-size:0.85rem"></div>`;
  }

  function renderList() {
    const q = state.search.toLowerCase();
    let rows;
    switch (state.tab) {
      case 'filaments':
        rows = state.lists.filaments
          .filter(f => !state.bambuOnly || f.brand === 'Bambu Lab')
          .filter(f => !q || `${f.material} ${f.brand || ''} ${f.variant || ''}`.toLowerCase().includes(q))
          .slice(0, 200);
        return '<ul style="list-style:none;margin:0;padding:0;font-size:0.83rem">' + rows.map(f => `
          <li onclick="_kb.openFilament(${f.id})" style="padding:5px 6px;cursor:pointer;border-bottom:1px solid var(--bs-border-color)">
            <strong>${esc(f.material)}</strong>${f.variant ? ' · ' + esc(f.variant) : ''}
            <div class="text-muted" style="font-size:0.75rem">${esc(f.brand || '')} ${f.category ? '· ' + esc(f.category) : ''}</div>
          </li>`).join('') + '</ul>';
      case 'materials':
        rows = state.lists.materials.filter(m => !q || (m.material + ' ' + (m.description || '')).toLowerCase().includes(q)).slice(0, 200);
        return '<ul style="list-style:none;margin:0;padding:0;font-size:0.83rem">' + rows.map(m => `
          <li onclick="_kb.openMaterial(${m.id})" style="padding:5px 6px;cursor:pointer;border-bottom:1px solid var(--bs-border-color)">
            <strong>${esc(m.material)}</strong>
            <div class="text-muted" style="font-size:0.75rem">${esc(m.category || '')} ${m.parent_material ? '· parent: ' + esc(m.parent_material) : ''}</div>
          </li>`).join('') + '</ul>';
      case 'plates':
      case 'maint':
      case 'ts': {
        const list = state.tab === 'plates' ? state.lists.plates : state.tab === 'maint' ? state.lists.maint : state.lists.ts;
        rows = list.filter(r => !q || (r.title + ' ' + (r.description || '')).toLowerCase().includes(q));
        return '<ul style="list-style:none;margin:0;padding:0;font-size:0.83rem">' + rows.map(r => `
          <li onclick="_kb.openSlug('${state.tab}', '${esc(r.slug)}')" style="padding:5px 6px;cursor:pointer;border-bottom:1px solid var(--bs-border-color)">
            <strong>${esc(r.title)}</strong>
            <div class="text-muted" style="font-size:0.75rem">${esc(r.description || '').slice(0, 120)}</div>
          </li>`).join('') + '</ul>';
      }
    }
    return '';
  }

  function renderDetail() {
    if (!state.detail) return '<p class="text-muted">Select an entry from the list.</p>';
    const d = state.detail;
    if (state.tab === 'filaments') {
      const stars = (n) => n ? '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n)) : '-';
      let plate = '';
      if (d.plate_compatibility) {
        try {
          const p = JSON.parse(d.plate_compatibility);
          const labels = { 2: 'Excellent', 1: 'Good', 0: 'Avoid' };
          plate = '<h5>Build-plate compatibility</h5><ul>' + Object.entries(p).map(([k, v]) => `<li><strong>${esc(k.replace(/_/g, ' '))}</strong>: ${esc(labels[v] ?? v)}</li>`).join('') + '</ul>';
        } catch {}
      }
      return `
        <h3>${esc(d.material)}${d.variant ? ' — ' + esc(d.variant) : ''}</h3>
        <div class="text-muted">${esc(d.brand || '')} · ${esc(d.category || '')}</div>
        <table class="table table-sm" style="font-size:0.82rem;margin-top:8px">
          <tr><th>Nozzle</th><td>${esc(d.nozzle_temp_min)}–${esc(d.nozzle_temp_max)} °C</td></tr>
          <tr><th>Bed</th><td>${esc(d.bed_temp_min)}–${esc(d.bed_temp_max)} °C</td></tr>
          <tr><th>Chamber</th><td>${d.chamber_temp || '-'} °C</td></tr>
          <tr><th>Fan</th><td>${esc(d.fan_speed_min)}–${esc(d.fan_speed_max)}%</td></tr>
          <tr><th>Difficulty</th><td>${stars(d.difficulty)}</td></tr>
          <tr><th>Strength</th><td>${stars(d.strength)}</td></tr>
          <tr><th>Flexibility</th><td>${stars(d.flexibility)}</td></tr>
          <tr><th>Heat resistance</th><td>${stars(d.heat_resistance)}</td></tr>
          <tr><th>UV resistance</th><td>${stars(d.uv_resistant)}</td></tr>
          <tr><th>Enclosure</th><td>${d.enclosure_required ? 'Required' : 'Not required'}</td></tr>
          <tr><th>Food safe</th><td>${d.food_safe ? 'Yes (limited)' : 'No'}</td></tr>
          <tr><th>Abrasive</th><td>${d.abrasive ? 'Yes — hardened nozzle' : 'No'}</td></tr>
          <tr><th>Glue stick</th><td>${esc(d.glue_stick || '-')}</td></tr>
        </table>
        ${plate}
        ${d.tips_print ? '<h5>Print tips</h5><div>' + md(d.tips_print) + '</div>' : ''}
        ${d.tips_storage ? '<h5>Storage / drying</h5><div>' + md(d.tips_storage) + '</div>' : ''}
        ${d.tips_post ? '<h5>Post-processing</h5><div>' + md(d.tips_post) + '</div>' : ''}`;
    }
    if (state.tab === 'materials') {
      return `
        <h3>${esc(d.material)}</h3>
        <div class="text-muted">${esc(d.category || '')} ${d.parent_material ? '· base: ' + esc(d.parent_material) : ''}</div>
        ${d.description ? '<p>' + esc(d.description) + '</p>' : ''}
        <table class="table table-sm" style="font-size:0.82rem">
          <tr><th>Nozzle</th><td>${esc(d.extruder_temp_min)}–${esc(d.extruder_temp_max)} °C</td></tr>
          <tr><th>Bed</th><td>${esc(d.bed_temp_min)}–${esc(d.bed_temp_max)} °C</td></tr>
          <tr><th>Density</th><td>${d.density ? esc(d.density) + ' g/cm³' : '-'}</td></tr>
          <tr><th>Glass-transition</th><td>${d.glass_temp_c ? esc(d.glass_temp_c) + ' °C' : '-'}</td></tr>
          <tr><th>Enclosure required</th><td>${d.enclosure_required ? 'Yes' : 'No'}</td></tr>
          <tr><th>Food safe</th><td>${d.food_safe ? 'Yes' : 'No'}</td></tr>
          <tr><th>Source</th><td><code>${esc(d.source || '-')}</code></td></tr>
        </table>`;
    }
    // plates / maint / ts — just render the full markdown body
    return `
      <h3>${esc(d.title)}</h3>
      ${d.description ? '<p class="text-muted">' + esc(d.description) + '</p>' : ''}
      ${d.body_markdown ? md(d.body_markdown) : '<p class="text-muted">(no body content)</p>'}`;
  }

  window._kb = {
    setTab(tab) { state.tab = tab; state.detail = null; state.search = ''; render(); },
    setSearch(v) { state.search = v; render(); },
    toggleBambu() { state.bambuOnly = !state.bambuOnly; render(); },
    async openFilament(id) {
      state.detail = state.lists.filaments.find(f => f.id === id) || null;
      render();
    },
    async openMaterial(id) {
      state.detail = state.lists.materials.find(m => m.id === id) || null;
      render();
    },
    async openSlug(tab, slug) {
      const endpoint = tab === 'plates' ? 'build-plates' : tab === 'maint' ? 'maintenance' : 'troubleshooting';
      try {
        const r = await fetch(`/api/kb/${endpoint}/${encodeURIComponent(slug)}?locale=${state.locale}`);
        state.detail = r.ok ? await r.json() : null;
      } catch { state.detail = null; }
      render();
    },
    setLocale,
  };

  // Panel loader calls renderKbViewer2026() after injecting the container.
  window.renderKbViewer2026 = loadLists;
  document.addEventListener('DOMContentLoaded', loadLists);
})();
