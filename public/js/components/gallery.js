// Print Gallery — visual showcase of completed prints with thumbnails & milestones
(function() {
  let _prints = [];
  let _offset = 0;
  let _hasMore = true;
  let _loading = false;
  let _filter = 'completed';
  let _cloudTasks = null;
  const PAGE_SIZE = 24;

  async function _loadCloudTasks() {
    if (_cloudTasks !== null) return;
    try {
      const res = await fetch('/api/bambu-cloud/tasks');
      if (!res.ok) { _cloudTasks = []; return; }
      const data = await res.json();
      _cloudTasks = data.tasks || data || [];
    } catch { _cloudTasks = []; }
  }

  function _getCloudMatch(filename) {
    if (!_cloudTasks || !filename) return null;
    const fn = filename.toLowerCase().trim();
    return _cloudTasks.find(t => {
      const tt = (t.title || '').toLowerCase().trim();
      const dt = (t.designTitle || '').toLowerCase().trim();
      return tt === fn || dt === fn || fn.includes(tt) || fn.includes(dt) || tt.includes(fn) || dt.includes(fn);
    }) || null;
  }

  window.loadGalleryPanel = async function() {
    _prints = [];
    _offset = 0;
    _hasMore = true;
    _filter = 'completed';
    _loadCloudTasks();

    const el = document.getElementById('overlay-panel-body');
    if (!el) return;

    el.innerHTML = `
      <div class="gallery-controls">
        <div class="gallery-filters">
          <button class="gallery-filter active" data-filter="completed" onclick="window._galleryFilter('completed')">${t('gallery.completed')}</button>
          <button class="gallery-filter" data-filter="all" onclick="window._galleryFilter('all')">${t('gallery.all')}</button>
          <button class="gallery-filter" data-filter="failed" onclick="window._galleryFilter('failed')">${t('gallery.failed')}</button>
        </div>
      </div>
      <div class="gallery-grid" id="gallery-grid"></div>
      <div class="gallery-loader" id="gallery-loader" style="display:none">
        <div class="text-muted" style="text-align:center;padding:20px">${t('common.loading')}...</div>
      </div>
      <div class="gallery-empty" id="gallery-empty" style="display:none">
        <p class="text-muted">${t('gallery.no_prints')}</p>
      </div>
      <style>
        .gallery-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:8px; }
        .gallery-filters { display:flex; gap:4px; }
        .gallery-filter { padding:5px 14px; border-radius:16px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-secondary); font-size:0.78rem; font-weight:500; cursor:pointer; transition:all 0.15s; }
        .gallery-filter:hover { border-color:var(--accent-green); }
        .gallery-filter.active { background:var(--accent-green); color:#fff; border-color:var(--accent-green); }
        .gallery-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:16px; }
        .gallery-card { background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; overflow:hidden; cursor:pointer; transition:transform 0.15s, box-shadow 0.15s; }
        .gallery-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
        .gallery-thumb { width:100%; aspect-ratio:4/3; object-fit:cover; background:var(--bg-tertiary); display:block; }
        .gallery-thumb-placeholder { width:100%; aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; background:var(--bg-tertiary); color:var(--text-muted); }
        .gallery-info { padding:12px; }
        .gallery-name { font-weight:600; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px; }
        .gallery-meta { display:flex; gap:8px; flex-wrap:wrap; font-size:0.72rem; color:var(--text-muted); }
        .gallery-meta span { display:flex; align-items:center; gap:3px; }
        .gallery-status { display:inline-block; width:6px; height:6px; border-radius:50%; margin-right:4px; }
        .gallery-status-completed { background:var(--accent-green); }
        .gallery-status-failed { background:var(--accent-red); }
        .gallery-status-cancelled { background:var(--accent-orange, #f59e0b); }
        .gallery-milestones { display:flex; gap:2px; margin-top:8px; }
        .gallery-milestone-thumb { width:25%; aspect-ratio:16/9; object-fit:cover; border-radius:4px; background:var(--bg-tertiary); }
        .gallery-detail-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .gallery-detail { background:var(--bg-secondary); border-radius:16px; max-width:700px; width:100%; max-height:90vh; overflow-y:auto; }
        .gallery-detail-header { position:relative; }
        .gallery-detail-img { width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:16px 16px 0 0; background:var(--bg-tertiary); display:block; }
        .gallery-detail-close { position:absolute; top:12px; right:12px; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.5); color:#fff; border:none; cursor:pointer; font-size:1.2rem; display:flex; align-items:center; justify-content:center; }
        .gallery-detail-body { padding:20px; }
        .gallery-detail-title { font-size:1.1rem; font-weight:700; margin-bottom:12px; }
        .gallery-detail-stats { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:10px; margin-bottom:16px; }
        .gallery-stat { background:var(--bg-tertiary); border-radius:8px; padding:10px 12px; }
        .gallery-stat-label { font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.03em; }
        .gallery-stat-value { font-size:0.95rem; font-weight:600; margin-top:2px; }
        .gallery-milestones-detail { display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:8px; margin-top:12px; }
        .gallery-milestone-detail-img { width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:8px; background:var(--bg-tertiary); cursor:pointer; transition:transform 0.15s; }
        .gallery-milestone-detail-img:hover { transform:scale(1.03); }
        .gallery-milestone-label { font-size:0.7rem; color:var(--text-muted); text-align:center; margin-top:3px; }
        @media (max-width:600px) { .gallery-grid { grid-template-columns:1fr 1fr; gap:8px; } .gallery-info { padding:8px; } }
      </style>`;

    await _loadMore();

    // Infinite scroll
    const panelEl = el.closest('.panel-overlay') || el;
    panelEl.addEventListener('scroll', _onScroll);
  };

  function _onScroll(e) {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      _loadMore();
    }
  }

  async function _loadMore() {
    if (_loading || !_hasMore) return;
    _loading = true;
    const loader = document.getElementById('gallery-loader');
    if (loader) loader.style.display = '';

    try {
      const params = new URLSearchParams({ limit: PAGE_SIZE, offset: _offset });
      if (_filter !== 'all') params.set('status', _filter);
      const rows = await fetch(`/api/history?${params}`).then(r => r.json());

      if (!Array.isArray(rows) || rows.length === 0) {
        _hasMore = false;
        if (_prints.length === 0) {
          const empty = document.getElementById('gallery-empty');
          if (empty) empty.style.display = '';
        }
      } else {
        _prints.push(...rows);
        _offset += rows.length;
        if (rows.length < PAGE_SIZE) _hasMore = false;
        _renderCards(rows);
      }
    } catch (e) {
      console.error('[gallery] Load error:', e);
    }

    _loading = false;
    if (loader) loader.style.display = 'none';
  }

  function _renderCards(newPrints) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    for (const p of newPrints) {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.onclick = () => _showDetail(p);

      const statusCls = `gallery-status-${p.status || 'completed'}`;
      const duration = _fmtDuration(p.duration_seconds);
      const date = _fmtDate(p.started_at);
      const name = (p.filename || '').replace(/\.3mf$|\.gcode\.3mf$/i, '');
      const cloud = _getCloudMatch(p.filename);
      const displayName = cloud?.designTitle || name;
      const linkIcon = cloud?.designId ? `<a href="https://makerworld.com/en/models/${cloud.designId}" target="_blank" rel="noopener" class="ph-model-link-icon" onclick="event.stopPropagation()" title="Open on MakerWorld"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a> ` : '';

      card.innerHTML = `
        <img class="gallery-thumb" src="/api/history/${p.id}/thumbnail" loading="lazy" onerror="this.outerHTML='<div class=\\'gallery-thumb-placeholder\\'><svg width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><path d=\\'M21 15l-5-5L5 21\\'/></svg></div>'">
        <div class="gallery-info">
          <div class="gallery-name" title="${_esc(displayName)}">${linkIcon}${_esc(displayName)}</div>
          <div class="gallery-meta">
            <span><span class="gallery-status ${statusCls}"></span>${p.status || 'completed'}</span>
            <span>${duration}</span>
            <span>${date}</span>
            ${p.filament_used_g ? `<span>${Math.round(p.filament_used_g)}g</span>` : ''}
          </div>
        </div>`;

      grid.appendChild(card);

      // Load milestone thumbnails
      _loadMilestoneThumbs(p.id, card);
    }
  }

  async function _loadMilestoneThumbs(historyId, card) {
    try {
      const milestones = await fetch(`/api/milestones/archive/${historyId}`).then(r => r.json());
      if (!Array.isArray(milestones) || milestones.length === 0) return;
      const container = document.createElement('div');
      container.className = 'gallery-milestones';
      for (const m of milestones.slice(0, 4)) {
        container.innerHTML += `<img class="gallery-milestone-thumb" src="/api/milestones/archive/${historyId}/${m.filename}" loading="lazy" onerror="this.style.display='none'">`;
      }
      card.querySelector('.gallery-info')?.appendChild(container);
    } catch {}
  }

  async function _showDetail(p) {
    const name = (p.filename || '').replace(/\.3mf$|\.gcode\.3mf$/i, '');
    const cloud = _getCloudMatch(p.filename);
    const displayName = cloud?.designTitle || name;
    const duration = _fmtDuration(p.duration_seconds);
    const date = _fmtDate(p.started_at);

    let milestoneHtml = '';
    try {
      const milestones = await fetch(`/api/milestones/archive/${p.id}`).then(r => r.json());
      if (Array.isArray(milestones) && milestones.length > 0) {
        milestoneHtml = `<div style="margin-top:16px"><div style="font-weight:600;font-size:0.85rem;margin-bottom:8px">${t('gallery.milestones')}</div>
          <div class="gallery-milestones-detail">
            ${milestones.map(m => `<div>
              <img class="gallery-milestone-detail-img" src="/api/milestones/archive/${p.id}/${m.filename}" loading="lazy" onclick="window._galleryFullscreen(this.src)" onerror="this.parentElement.style.display='none'">
              <div class="gallery-milestone-label">${m.milestone || ''}%</div>
            </div>`).join('')}
          </div>
        </div>`;
      }
    } catch {}

    const overlay = document.createElement('div');
    overlay.className = 'gallery-detail-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `<div class="gallery-detail">
      <div class="gallery-detail-header">
        <img class="gallery-detail-img" src="/api/history/${p.id}/thumbnail" onerror="this.style.display='none'">
        ${typeof open3DPreview === 'function' ? `<button class="lib-3d-btn" style="position:absolute;bottom:12px;right:12px" onclick="event.stopPropagation();open3DPreview('/api/preview-3d?source=history&id=${p.id}','${_esc(displayName).replace(/'/g,"\\\\'")}')">&#x25B6; 3D</button>` : ''}
        <button class="gallery-detail-close" onclick="this.closest('.gallery-detail-overlay').remove()">&times;</button>
      </div>
      <div class="gallery-detail-body">
        <div class="gallery-detail-title">${_esc(displayName)}</div>
        ${cloud?.designId ? `<div style="margin-bottom:12px">
          <a href="https://makerworld.com/en/models/${cloud.designId}" target="_blank" rel="noopener" class="ph-model-link" style="font-size:0.85rem">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:4px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Open on MakerWorld
          </a>
          <span class="gallery-designer" style="font-size:0.78rem;color:var(--text-muted);margin-left:8px"></span>
        </div>` : ''}
        <div class="gallery-detail-stats">
          <div class="gallery-stat"><div class="gallery-stat-label">${t('gallery.status')}</div><div class="gallery-stat-value">${p.status || '—'}</div></div>
          <div class="gallery-stat"><div class="gallery-stat-label">${t('gallery.duration')}</div><div class="gallery-stat-value">${duration}</div></div>
          <div class="gallery-stat"><div class="gallery-stat-label">${t('gallery.date')}</div><div class="gallery-stat-value">${date}</div></div>
          ${p.filament_used_g ? `<div class="gallery-stat"><div class="gallery-stat-label">${t('gallery.filament')}</div><div class="gallery-stat-value">${Math.round(p.filament_used_g)}g ${p.filament_type || ''}</div></div>` : ''}
          ${p.layer_count ? `<div class="gallery-stat"><div class="gallery-stat-label">${t('gallery.layers')}</div><div class="gallery-stat-value">${p.layer_count}</div></div>` : ''}
          ${p.filament_brand ? `<div class="gallery-stat"><div class="gallery-stat-label">${t('gallery.brand')}</div><div class="gallery-stat-value">${_esc(p.filament_brand)}</div></div>` : ''}
          ${p.printer_id ? `<div class="gallery-stat"><div class="gallery-stat-label">${t('gallery.printer')}</div><div class="gallery-stat-value">${_esc(p.printer_id)}</div></div>` : ''}
        </div>
        ${p.notes ? `<div style="margin-top:8px;font-size:0.85rem;color:var(--text-secondary)">${_esc(p.notes)}</div>` : ''}
        ${milestoneHtml}
      </div>
    </div>`;

    document.body.appendChild(overlay);

    // Async: fetch designer from MakerWorld
    if (cloud?.designId) {
      fetch(`/api/makerworld/${cloud.designId}`).then(r => r.json()).then(mw => {
        if (mw.designer) {
          const designerEl = overlay.querySelector('.gallery-designer');
          if (designerEl) designerEl.textContent = 'av ' + mw.designer;
        }
      }).catch(() => {});
    }
  }

  window._galleryFullscreen = function(src) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:1100;display:flex;align-items:center;justify-content:center;cursor:pointer';
    overlay.onclick = () => overlay.remove();
    overlay.innerHTML = `<img src="${src}" style="max-width:95%;max-height:95%;object-fit:contain;border-radius:8px">`;
    document.body.appendChild(overlay);
  };

  window._galleryFilter = function(filter) {
    _filter = filter;
    _prints = [];
    _offset = 0;
    _hasMore = true;

    // Update active button
    document.querySelectorAll('.gallery-filter').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Clear grid
    const grid = document.getElementById('gallery-grid');
    if (grid) grid.innerHTML = '';
    const empty = document.getElementById('gallery-empty');
    if (empty) empty.style.display = 'none';

    _loadMore();
  };

  function _fmtDuration(seconds) {
    if (!seconds) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  function _fmtDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return iso; }
  }

  function _esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }
})();
