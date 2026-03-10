// Print Queue Panel
(function() {

  const TAB_CONFIG = {
    active:   { label: 'queue.tab_active',   modules: ['queue-hero', 'queue-list', 'active-jobs'] },
    history:  { label: 'queue.tab_history',   modules: ['completed-items'] },
    settings: { label: 'queue.tab_settings',  modules: ['queue-settings'] }
  };
  const MODULE_SIZE = {
    'queue-hero': 'full', 'queue-list': 'full', 'active-jobs': 'full',
    'completed-items': 'full', 'queue-settings': 'full'
  };

  const STORAGE_PREFIX = 'queue-module-order-';
  const LOCK_KEY = 'queue-layout-locked';

  let _activeTab = 'active';
  let _locked = localStorage.getItem(LOCK_KEY) !== '0';
  let _queues = [];
  let _selectedQueue = null;
  let _draggedMod = null;

  function getOrder(tabId) {
    try { const o = JSON.parse(localStorage.getItem(STORAGE_PREFIX + tabId)); if (Array.isArray(o)) return o; } catch {}
    return TAB_CONFIG[tabId]?.modules || [];
  }
  function saveOrder(tabId) {
    const cont = document.getElementById(`queue-tab-${tabId}`);
    if (!cont) return;
    const ids = [...cont.querySelectorAll('.stats-module[data-module-id]')].map(m => m.dataset.moduleId);
    localStorage.setItem(STORAGE_PREFIX + tabId, JSON.stringify(ids));
  }

  function printerName(id) {
    return window.printerState?._printerMeta?.[id]?.name || id || '--';
  }

  function fmtDate(iso) {
    if (!iso) return '--';
    const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  function statusBadge(status) {
    const colors = { active: 'var(--accent-green)', paused: 'var(--accent-orange)', completed: 'var(--text-secondary)', pending: 'var(--text-secondary)', printing: 'var(--accent-blue)', failed: 'var(--accent-red)', skipped: 'var(--text-muted)', cancelled: 'var(--text-muted)' };
    return `<span class="queue-status-badge" style="background:${colors[status] || 'var(--text-muted)'}33;color:${colors[status] || 'var(--text-muted)'};padding:2px 8px;border-radius:10px;font-size:0.75rem">${t('queue.status_' + status) || status}</span>`;
  }

  // ═══ Module builders ═══
  const BUILDERS = {
    'queue-hero': () => {
      const active = _queues.filter(q => q.status === 'active').length;
      const total = _queues.length;
      const printing = _queues.reduce((s, q) => s + (q.printing_count || 0), 0);
      return `<div class="stat-grid">
        <div class="stat-card"><div class="stat-value">${active}</div><div class="stat-label">${t('queue.active_queues')}</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--accent-blue)">${printing}</div><div class="stat-label">${t('queue.active_jobs')}</div></div>
        <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">${t('queue.total_queues')}</div></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="form-btn" data-ripple onclick="window._queueShowCreate()">${t('queue.create')}</button>
        <button class="form-btn form-btn-secondary" data-ripple onclick="window._queueForceDispatch()">${t('queue.dispatch_now')}</button>
      </div>`;
    },

    'queue-list': () => {
      const activeQueues = _queues.filter(q => q.status === 'active' || q.status === 'paused');
      if (activeQueues.length === 0) return emptyState({
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>',
        title: t('queue.no_queues'),
        desc: t('queue.no_queues_desc') || 'Create a print queue to manage and schedule your print jobs.'
      });

      return activeQueues.map(q => {
        const progressPct = q.item_count > 0 ? Math.round((q.completed_count / q.item_count) * 100) : 0;
        return `<div class="queue-card" data-queue-id="${q.id}" onclick="window._queueSelect(${q.id})">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <strong>${q.name}</strong>
            <div style="display:flex;gap:6px;align-items:center">
              ${statusBadge(q.status)}
              <span style="font-size:0.8rem;color:var(--text-secondary)">${q.completed_count}/${q.item_count}</span>
            </div>
          </div>
          <div class="chart-bar-track" style="height:6px;margin-bottom:6px"><div class="chart-bar-fill" style="width:${progressPct}%;background:var(--accent-green)"></div></div>
          <div style="display:flex;gap:8px;font-size:0.75rem;color:var(--text-secondary)">
            <span>${q.auto_start ? t('queue.auto_start') : t('queue.manual')}</span>
            <span>${q.priority_mode}</span>
            ${q.target_printer_id ? `<span>${printerName(q.target_printer_id)}</span>` : ''}
          </div>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
            ${q.status === 'active' ? `<button class="form-btn form-btn-secondary form-btn-sm" onclick="event.stopPropagation();window._queuePause(${q.id})">${t('queue.pause_queue')}</button>` :
              q.status === 'paused' ? `<button class="form-btn form-btn-secondary form-btn-sm" onclick="event.stopPropagation();window._queueResume(${q.id})">${t('queue.resume_queue')}</button>` : ''}
            <button class="form-btn form-btn-secondary form-btn-sm" onclick="event.stopPropagation();window._queueAddItem(${q.id})">${t('queue.add_item')}</button>
            <button class="form-btn form-btn-secondary form-btn-sm" onclick="event.stopPropagation();window._queueEditDialog(${q.id})">${t('common.edit') || 'Rediger'}</button>
            <button class="form-btn form-btn-danger form-btn-sm" onclick="event.stopPropagation();window._queueDelete(${q.id})">${t('common.delete') || 'Slett'}</button>
          </div>
        </div>`;
      }).join('');
    },

    'active-jobs': () => {
      if (!_selectedQueue) return '';
      const queue = _queues.find(q => q.id === _selectedQueue);
      if (!queue) return '';

      return `<div id="queue-items-container"></div>`;
    },

    'completed-items': () => {
      return `<div id="queue-completed-container"><div class="stats-empty">${t('queue.loading')}</div></div>`;
    },

    'queue-settings': () => {
      if (_queues.length === 0) {
        return emptyState({
          icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>',
          title: t('queue.no_queues'),
          desc: t('queue.no_queues_desc') || 'Opprett en kø først for å endre innstillinger.'
        });
      }
      return _queues.map(q => _renderQueueSettings(q)).join('');
    }
  };

  // ═══ Load queue items for selected queue ═══
  async function _loadQueueItems(queueId) {
    try {
      const resp = await fetch(`/api/queue/${queueId}`);
      const queue = await resp.json();
      if (queue.error) return;

      const container = document.getElementById('queue-items-container');
      if (!container) return;

      const items = queue.items || [];
      if (items.length === 0) {
        container.innerHTML = emptyState({
          icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
          title: t('queue.no_items'),
          desc: t('queue.no_items_desc') || 'No items in this queue yet. Add files to start printing.'
        });
        return;
      }

      container.innerHTML = `<div class="queue-items-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong>${queue.name} — ${t('queue.items_count', { count: items.length })}</strong>
      </div>` + items.map(item => `
        <div class="queue-item q-item" data-item-id="${item.id}" draggable="true" style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;background:var(--card-bg)">
          <span class="queue-item-drag" style="cursor:grab;color:var(--text-muted)">⠿</span>
          <div style="flex:1;min-width:0">
            <div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.filename}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);display:flex;gap:8px;margin-top:2px">
              ${item.printer_id ? `<span>${printerName(item.printer_id)}</span>` : ''}
              ${item.target_printers ? (() => { try { const tp = JSON.parse(item.target_printers); return tp.length > 0 ? `<span title="${tp.map(p => printerName(p)).join(', ')}">${tp.length} ${t('queue.multiprint')}</span>` : ''; } catch(_) { return ''; } })() : ''}
              ${item.copies > 1 ? `<span>${item.copies_completed}/${item.copies} copies</span>` : ''}
              ${item.required_material ? `<span>${item.required_material}</span>` : ''}
            </div>
          </div>
          ${statusBadge(item.status)}
          <div style="display:flex;gap:4px">
            ${item.status === 'pending' ? `<button class="form-btn form-btn-secondary form-btn-sm" data-ripple data-tooltip="${t('queue.skip')}" onclick="window._queueSkipItem(${item.id})" title="${t('queue.skip')}">&times;</button>` : ''}
          </div>
        </div>`).join('');

      // Setup drag-and-drop for reordering
      _setupItemDrag(container, queueId);
    } catch (e) {
      console.error('[queue] Failed to load items:', e);
    }
  }

  function _setupItemDrag(container, queueId) {
    let dragItem = null;
    container.querySelectorAll('.queue-item').forEach(el => {
      el.addEventListener('dragstart', (e) => { dragItem = el; el.style.opacity = '0.5'; });
      el.addEventListener('dragend', () => { if (dragItem) dragItem.style.opacity = '1'; dragItem = null; });
      el.addEventListener('dragover', (e) => { e.preventDefault(); });
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!dragItem || dragItem === el) return;
        const items = [...container.querySelectorAll('.queue-item')];
        const fromIdx = items.indexOf(dragItem);
        const toIdx = items.indexOf(el);
        if (fromIdx < toIdx) el.after(dragItem);
        else el.before(dragItem);
        // Save new order
        const newOrder = [...container.querySelectorAll('.queue-item')].map(i => parseInt(i.dataset.itemId));
        fetch(`/api/queue/${queueId}/reorder`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item_ids: newOrder }) });
      });
    });
  }

  // ═══ Load completed history ═══
  const EVENT_COLORS = {
    queue_created: 'var(--accent-blue, #1279ff)',
    queue_paused: 'var(--accent-orange, #f59e0b)',
    queue_resumed: 'var(--accent-green, #00ae42)',
    queue_completed: 'var(--accent-green, #00ae42)',
    queue_deleted: 'var(--accent-red, #e53935)',
    item_added: 'var(--accent-blue, #1279ff)',
    item_started: 'var(--accent-blue, #1279ff)',
    item_completed: 'var(--accent-green, #00ae42)',
    item_failed: 'var(--accent-red, #e53935)',
    item_skipped: 'var(--text-muted)',
    item_cancelled: 'var(--text-muted)',
    dispatch: 'var(--accent-blue, #1279ff)'
  };

  function _eventLabel(event) {
    return t('queue.event_' + event) || event.replace(/_/g, ' ');
  }

  async function _loadCompletedItems() {
    try {
      const resp = await fetch('/api/queue/log?limit=100');
      const log = await resp.json();
      const container = document.getElementById('queue-completed-container');
      if (!container) return;

      if (!log.length) {
        container.innerHTML = emptyState({
          icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
          title: t('queue.no_history'),
          desc: t('queue.no_history_desc') || 'Fullførte køhendelser vises her.'
        });
        return;
      }

      container.innerHTML = log.map(entry => {
        const color = EVENT_COLORS[entry.event] || 'var(--text-muted)';
        return `<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-bottom:1px solid var(--border-subtle);transition:background 0.1s" onmouseenter="this.style.background='var(--bg-tertiary)'" onmouseleave="this.style.background=''">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></span>
          <span style="font-size:0.8rem;font-weight:600;color:var(--text-primary);flex:1">${_eventLabel(entry.event)}</span>
          ${entry.details ? `<span style="font-size:0.8rem;color:var(--text-secondary)">${entry.details}</span>` : ''}
          ${entry.printer_id ? `<span style="font-size:0.75rem;color:var(--text-muted)">${printerName(entry.printer_id)}</span>` : ''}
          <span style="font-size:0.7rem;color:var(--text-muted);min-width:100px;text-align:right">${fmtDate(entry.timestamp)}</span>
        </div>`;
      }).join('');
    } catch (e) {
      console.error('[queue] Failed to load log:', e);
    }
  }

  // ═══ Create queue dialog ═══
  window._queueShowCreate = function() {
    const printers = Object.entries(window.printerState?._printerMeta || {}).map(([id, m]) => ({ id, name: m.name }));
    const printerOpts = printers.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content" style="max-width:500px">
      <h3>${t('queue.create')}</h3>
      <div class="form-group"><label>${t('queue.name')}</label><input type="text" id="qc-name" class="form-input" /></div>
      <div class="form-group"><label>${t('queue.description')}</label><input type="text" id="qc-desc" class="form-input" /></div>
      <div class="form-row" style="display:flex;gap:12px">
        <div class="form-group" style="flex:1"><label>${t('queue.priority_mode')}</label>
          <select id="qc-pmode" class="form-input"><option value="fifo">${t('queue.fifo')}</option><option value="priority">${t('queue.priority')}</option></select>
        </div>
        <div class="form-group" style="flex:1"><label>${t('queue.target_printer')}</label>
          <select id="qc-printer" class="form-input"><option value="">${t('queue.any_printer')}</option>${printerOpts}</select>
        </div>
      </div>
      <div class="form-row" style="display:flex;gap:12px;align-items:center">
        <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="qc-auto" /> ${t('queue.auto_start')}</label>
        <div class="form-group" style="flex:1"><label>${t('queue.cooldown')}</label><input type="number" id="qc-cooldown" class="form-input" value="60" min="0" /></div>
        <div class="form-group" style="flex:1"><label>${t('queue.stagger')}</label><input type="number" id="qc-stagger" class="form-input" value="0" min="0" title="${t('queue.stagger_hint')}" /></div>
      </div>
      <div class="form-group"><label>${t('queue.bed_clear_gcode')}</label><textarea id="qc-gcode" class="form-input" rows="3" placeholder="G28\nG1 Z50"></textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
        <button class="form-btn form-btn-secondary" data-ripple onclick="this.closest('.modal-overlay').remove()">${t('common.cancel')}</button>
        <button class="form-btn" data-ripple onclick="window._queueDoCreate()">${t('queue.create')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  };

  window._queueDoCreate = async function() {
    const name = document.getElementById('qc-name')?.value?.trim();
    if (!name) return;

    const body = {
      name,
      description: document.getElementById('qc-desc')?.value?.trim() || null,
      priority_mode: document.getElementById('qc-pmode')?.value || 'fifo',
      target_printer_id: document.getElementById('qc-printer')?.value || null,
      auto_start: document.getElementById('qc-auto')?.checked || false,
      cooldown_seconds: parseInt(document.getElementById('qc-cooldown')?.value) || 60,
      stagger_seconds: parseInt(document.getElementById('qc-stagger')?.value) || 0,
      bed_clear_gcode: document.getElementById('qc-gcode')?.value?.trim() || null
    };

    await fetch('/api/queue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    document.querySelector('.modal-overlay')?.remove();
    _reload();
  };

  // ═══ Add item dialog ═══
  window._queueAddItem = async function(queueId) {
    const printers = Object.entries(window.printerState?._printerMeta || {}).map(([id, m]) => ({ id, name: m.name }));
    const printerChecks = printers.map(p =>
      `<label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer"><input type="checkbox" class="qi-printer-check" value="${p.id}"> ${p.name || p.id}</label>`
    ).join('');
    // Fetch available tags for tag-based matching
    let tagsHtml = '';
    try {
      const tRes = await fetch('/api/tags');
      const tags = await tRes.json();
      if (tags.length > 0) {
        const tagChecks = tags.map(tg =>
          `<label style="display:flex;align-items:center;gap:4px;font-size:0.85rem;cursor:pointer"><input type="checkbox" class="qi-tag-check" value="${tg.id}"> <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${tg.color || '#58a6ff'}"></span> ${tg.name}</label>`
        ).join('');
        tagsHtml = `<div class="form-group">
          <label>${t('queue.required_tags')}</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:4px">${tagChecks}</div>
        </div>`;
      }
    } catch (_) {}
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content" style="max-width:450px">
      <h3>${t('queue.add_item')}</h3>
      <div class="form-group"><label>${t('queue.filename')}</label><input type="text" id="qi-filename" class="form-input" placeholder="/sdcard/model.3mf" /></div>
      <div class="form-row" style="display:flex;gap:12px">
        <div class="form-group" style="flex:1"><label>${t('queue.copies')}</label><input type="number" id="qi-copies" class="form-input" value="1" min="1" /></div>
        <div class="form-group" style="flex:1"><label>${t('queue.priority_label')}</label><input type="number" id="qi-priority" class="form-input" value="0" min="0" max="100" /></div>
      </div>
      <div class="form-group"><label>${t('queue.required_material')}</label><input type="text" id="qi-material" class="form-input" placeholder="PLA" /></div>
      <div class="form-group"><label>${t('queue.notes')}</label><input type="text" id="qi-notes" class="form-input" /></div>
      ${tagsHtml}
      ${printers.length > 0 ? `<div class="form-group">
        <label style="display:flex;align-items:center;gap:6px">${t('queue.select_printers')}
          <button class="form-btn form-btn-secondary form-btn-sm" style="font-size:0.7rem;padding:1px 6px" onclick="document.querySelectorAll('.qi-printer-check').forEach(c=>c.checked=!c.checked)">${t('queue.all_printers')}</button>
        </label>
        <div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:4px">${printerChecks}</div>
      </div>` : ''}
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
        <button class="form-btn form-btn-secondary" data-ripple onclick="this.closest('.modal-overlay').remove()">${t('common.cancel')}</button>
        <button class="form-btn" data-ripple onclick="window._queueDoAddItem(${queueId})">${t('queue.add_item')}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  };

  window._queueDoAddItem = async function(queueId) {
    const filename = document.getElementById('qi-filename')?.value?.trim();
    if (!filename) return;

    const selectedPrinters = [...document.querySelectorAll('.qi-printer-check:checked')].map(c => c.value);
    const selectedTags = [...document.querySelectorAll('.qi-tag-check:checked')].map(c => parseInt(c.value));
    const body = {
      filename,
      copies: parseInt(document.getElementById('qi-copies')?.value) || 1,
      priority: parseInt(document.getElementById('qi-priority')?.value) || 0,
      required_material: document.getElementById('qi-material')?.value?.trim() || null,
      notes: document.getElementById('qi-notes')?.value?.trim() || null,
      target_printers: selectedPrinters.length > 0 ? selectedPrinters : null,
      required_tags: selectedTags.length > 0 ? selectedTags : null
    };

    await fetch(`/api/queue/${queueId}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    document.querySelector('.modal-overlay')?.remove();
    _reload();
  };

  // ═══ Queue settings renderer ═══
  function _renderQueueSettings(q) {
    const printers = Object.entries(window.printerState?._printerMeta || {}).map(([id, m]) => ({ id, name: m.name }));
    const printerOpts = `<option value="">${t('queue.any_printer')}</option>` +
      printers.map(p => `<option value="${p.id}"${p.id === q.target_printer_id ? ' selected' : ''}>${p.name}</option>`).join('');

    return `<div class="queue-settings-card" style="background:var(--bg-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius);padding:16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong style="font-size:0.95rem">${q.name}</strong>
        <div style="display:flex;gap:6px">
          <button class="form-btn form-btn-sm" onclick="window._queueSaveSettings(${q.id})">${t('common.save') || 'Lagre'}</button>
          <button class="form-btn form-btn-danger form-btn-sm" onclick="window._queueDelete(${q.id})">${t('common.delete') || 'Slett'}</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <label class="form-label">${t('queue.name')}</label>
          <input class="form-input" id="qs-name-${q.id}" value="${q.name || ''}">
        </div>
        <div>
          <label class="form-label">${t('queue.description')}</label>
          <input class="form-input" id="qs-desc-${q.id}" value="${q.description || ''}">
        </div>
        <div>
          <label class="form-label">${t('queue.priority_mode')}</label>
          <select class="form-input" id="qs-pmode-${q.id}">
            <option value="fifo"${q.priority_mode === 'fifo' ? ' selected' : ''}>${t('queue.fifo')}</option>
            <option value="priority"${q.priority_mode === 'priority' ? ' selected' : ''}>${t('queue.priority')}</option>
          </select>
        </div>
        <div>
          <label class="form-label">${t('queue.target_printer')}</label>
          <select class="form-input" id="qs-printer-${q.id}">${printerOpts}</select>
        </div>
        <div>
          <label class="form-label">${t('queue.cooldown')}</label>
          <input class="form-input" type="number" id="qs-cooldown-${q.id}" value="${q.cooldown_seconds || 60}" min="0">
        </div>
        <div>
          <label class="form-label">${t('queue.stagger')}</label>
          <input class="form-input" type="number" id="qs-stagger-${q.id}" value="${q.stagger_seconds || 0}" min="0" title="${t('queue.stagger_hint')}">
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding-top:20px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox" id="qs-auto-${q.id}" ${q.auto_start ? 'checked' : ''}> ${t('queue.auto_start')}
          </label>
        </div>
      </div>
      <div style="margin-top:10px">
        <label class="form-label">${t('queue.bed_clear_gcode')}</label>
        <textarea class="form-input" id="qs-gcode-${q.id}" rows="2" placeholder="G28\nG1 Z50">${q.bed_clear_gcode || ''}</textarea>
      </div>
    </div>`;
  }

  window._queueSaveSettings = async function(id) {
    const body = {
      name: document.getElementById(`qs-name-${id}`)?.value?.trim(),
      description: document.getElementById(`qs-desc-${id}`)?.value?.trim() || null,
      priority_mode: document.getElementById(`qs-pmode-${id}`)?.value || 'fifo',
      target_printer_id: document.getElementById(`qs-printer-${id}`)?.value || null,
      cooldown_seconds: parseInt(document.getElementById(`qs-cooldown-${id}`)?.value) || 60,
      stagger_seconds: parseInt(document.getElementById(`qs-stagger-${id}`)?.value) || 0,
      auto_start: document.getElementById(`qs-auto-${id}`)?.checked ? 1 : 0,
      bed_clear_gcode: document.getElementById(`qs-gcode-${id}`)?.value?.trim() || null
    };
    try {
      await fetch(`/api/queue/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (typeof showToast === 'function') showToast(t('common.saved') || 'Lagret', 'success');
      _reload();
    } catch (e) {
      if (typeof showToast === 'function') showToast(t('common.save_error') || 'Feil ved lagring', 'error');
    }
  };

  window._queueDelete = async function(id) {
    if (typeof confirmAction === 'function') {
      confirmAction(t('queue.delete_confirm') || 'Slette denne køen?', async () => {
        await fetch(`/api/queue/${id}`, { method: 'DELETE' });
        if (typeof showToast === 'function') showToast(t('common.deleted') || 'Slettet', 'success');
        _reload();
      }, { danger: true });
    }
  };

  // ═══ Edit queue dialog ═══
  window._queueEditDialog = function(id) {
    const q = _queues.find(x => x.id === id);
    if (!q) return;
    const printers = Object.entries(window.printerState?._printerMeta || {}).map(([pid, m]) => ({ id: pid, name: m.name }));
    const printerOpts = `<option value="">${t('queue.any_printer')}</option>` +
      printers.map(p => `<option value="${p.id}"${p.id === q.target_printer_id ? ' selected' : ''}>${p.name}</option>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content" style="max-width:500px">
      <h3>${t('common.edit') || 'Rediger'} — ${q.name}</h3>
      <div class="form-group"><label class="form-label">${t('queue.name')}</label><input class="form-input" id="qe-name" value="${q.name || ''}" /></div>
      <div class="form-group"><label class="form-label">${t('queue.description')}</label><input class="form-input" id="qe-desc" value="${q.description || ''}" /></div>
      <div style="display:flex;gap:12px">
        <div class="form-group" style="flex:1"><label class="form-label">${t('queue.priority_mode')}</label>
          <select class="form-input" id="qe-pmode"><option value="fifo"${q.priority_mode === 'fifo' ? ' selected' : ''}>${t('queue.fifo')}</option><option value="priority"${q.priority_mode === 'priority' ? ' selected' : ''}>${t('queue.priority')}</option></select>
        </div>
        <div class="form-group" style="flex:1"><label class="form-label">${t('queue.target_printer')}</label>
          <select class="form-input" id="qe-printer">${printerOpts}</select>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:center">
        <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="qe-auto" ${q.auto_start ? 'checked' : ''} /> ${t('queue.auto_start')}</label>
        <div class="form-group" style="flex:1"><label class="form-label">${t('queue.cooldown')}</label><input class="form-input" type="number" id="qe-cooldown" value="${q.cooldown_seconds || 60}" min="0" /></div>
        <div class="form-group" style="flex:1"><label class="form-label">${t('queue.stagger')}</label><input class="form-input" type="number" id="qe-stagger" value="${q.stagger_seconds || 0}" min="0" /></div>
      </div>
      <div class="form-group"><label class="form-label">${t('queue.bed_clear_gcode')}</label><textarea class="form-input" id="qe-gcode" rows="3" placeholder="G28\nG1 Z50">${q.bed_clear_gcode || ''}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
        <button class="form-btn form-btn-secondary" onclick="this.closest('.modal-overlay').remove()">${t('common.cancel') || 'Avbryt'}</button>
        <button class="form-btn" onclick="window._queueDoEdit(${q.id})">${t('common.save') || 'Lagre'}</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  };

  window._queueDoEdit = async function(id) {
    const body = {
      name: document.getElementById('qe-name')?.value?.trim(),
      description: document.getElementById('qe-desc')?.value?.trim() || null,
      priority_mode: document.getElementById('qe-pmode')?.value || 'fifo',
      target_printer_id: document.getElementById('qe-printer')?.value || null,
      auto_start: document.getElementById('qe-auto')?.checked ? 1 : 0,
      cooldown_seconds: parseInt(document.getElementById('qe-cooldown')?.value) || 60,
      stagger_seconds: parseInt(document.getElementById('qe-stagger')?.value) || 0,
      bed_clear_gcode: document.getElementById('qe-gcode')?.value?.trim() || null
    };
    await fetch(`/api/queue/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    document.querySelector('.modal-overlay')?.remove();
    if (typeof showToast === 'function') showToast(t('common.saved') || 'Lagret', 'success');
    _reload();
  };

  // ═══ Queue actions ═══
  window._queueSelect = function(id) {
    _selectedQueue = id;
    _loadQueueItems(id);
  };

  window._queuePause = async function(id) {
    await fetch(`/api/queue/${id}/pause`, { method: 'POST' });
    _reload();
  };

  window._queueResume = async function(id) {
    await fetch(`/api/queue/${id}/resume`, { method: 'POST' });
    _reload();
  };

  window._queueForceDispatch = async function() {
    await fetch('/api/queue/dispatch', { method: 'POST' });
  };

  window._queueSkipItem = async function(itemId) {
    await fetch(`/api/queue/items/${itemId}/skip`, { method: 'POST' });
    if (_selectedQueue) _loadQueueItems(_selectedQueue);
  };

  // ═══ Render engine ═══
  function _renderTabs() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    const switcherHtml = '<div class="tabs" style="margin-bottom:12px">' +
      '<button class="tab-btn active" onclick="openPanel(\'queue\')">' + (t('queue.title') || 'Utskriftskø') + '</button>' +
      '<button class="tab-btn" onclick="openPanel(\'scheduler\')">' + (t('tabs.scheduler') || 'Planlegger') + '</button>' +
      '</div>';

    const tabBar = Object.entries(TAB_CONFIG).map(([id, cfg]) =>
      `<button class="tab-btn${id === _activeTab ? ' active' : ''}" data-tab="${id}" data-ripple>${t(cfg.label) || id}</button>`
    ).join('');

    let html = switcherHtml + `<div class="tabs" id="queue-tab-bar">${tabBar}</div>`;
    for (const [tabId, cfg] of Object.entries(TAB_CONFIG)) {
      const display = tabId === _activeTab ? '' : 'display:none';
      const order = getOrder(tabId);
      const mods = order.filter(m => cfg.modules.includes(m));
      html += `<div class="tab-content module-grid ix-tab-panel" id="queue-tab-${tabId}" style="${display}">`;
      for (const modId of mods) {
        const size = MODULE_SIZE[modId] || 'full';
        const content = BUILDERS[modId] ? BUILDERS[modId]() : '';
        html += `<div class="stats-module module-${size}" data-module-id="${modId}">
          <div class="module-header"><h3 class="module-title">${t('queue.mod_' + modId.replace(/-/g, '_')) || modId}</h3></div>
          <div class="module-body">${content}</div>
        </div>`;
      }
      html += '</div>';
    }
    panel.innerHTML = html;

    // Tab click handlers (only queue's own tabs, not panel switcher)
    panel.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeTab = btn.dataset.tab;
        _renderTabs();
        if (_activeTab === 'history') _loadCompletedItems();
        if (_activeTab === 'active' && _selectedQueue) _loadQueueItems(_selectedQueue);
      });
    });
  }

  async function _reload() {
    try {
      const resp = await fetch('/api/queue');
      _queues = await resp.json();
    } catch { _queues = []; }
    _renderTabs();
    if (_activeTab === 'active' && _selectedQueue) _loadQueueItems(_selectedQueue);
    if (_activeTab === 'history') _loadCompletedItems();
  }

  window.loadQueuePanel = function() {
    _reload();
  };

  // Listen for WebSocket queue updates
  if (!window._wsListeners) window._wsListeners = [];
  window._wsListeners.push((msg) => {
    if (msg.type === 'queue_update' && window._activePanel === 'queue') {
      _reload();
    }
  });

})();
