// Settings — General: auth settings, OBS overlay config, notification channel settings, notification log
(function() {

  window.changeLanguage = function(locale) {
    window.i18n.setLocale(locale).then(() => {
      if (window._activePanel === 'settings') {
        loadSettings();
      }
    });
  };

  window.toggleNotificationsPerm = function(checked) {
    if (checked && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  async function checkDemoData() {
    const section = document.getElementById('demo-data-section');
    if (!section) return;
    try {
      const res = await fetch('/api/demo/status');
      const data = await res.json();
      if (data.hasDemo) {
        section.style.display = '';
        section.innerHTML = `
          <div class="settings-card">
            <div class="card-title">${t('settings.demo_title')}</div>
            <div class="text-muted" style="font-size:0.8rem; margin-bottom:8px;">
              ${t('settings.demo_description', { count: data.printerIds.length })}
            </div>
            <button class="form-btn form-btn-danger" data-ripple data-tooltip="${t('settings.demo_delete')}" onclick="deleteDemoData()">${t('settings.demo_delete')}</button>
          </div>`;
      }
    } catch { /* no demo data endpoint or error */ }
  }

  window.deleteDemoData = async function() {
    return confirmAction(t('settings.demo_confirm'), async () => {
      try {
        const res = await fetch('/api/demo', { method: 'DELETE' });
        const data = await res.json();
        if (data.deleted > 0) {
          if (data.printerIds && window.printerState) {
            for (const id of data.printerIds) {
              window.printerState.removePrinter(id);
            }
            if (typeof updatePrinterSelector === 'function') updatePrinterSelector();
            if (typeof updateConnectionBadge === 'function') updateConnectionBadge();
          }
          loadSettings();
        }
      } catch { /* ignore */ }
    }, { danger: true });
  };

  // ---- Authentication Settings ----

  let _authUsers = [];

  async function loadAuthSettings() {
    const section = document.getElementById('auth-settings-section');
    if (!section) return;

    try {
      const res = await fetch('/api/auth/config');
      const ac = await res.json();

      const envManaged = ac.envManaged;
      _authUsers = (ac.users || []).map(u => ({ ...u }));

      let html = `
        <div class="settings-card">
          <div class="card-title">${t('settings.auth_title')}</div>`;

      if (envManaged) {
        html += `<p class="text-muted" style="font-size:0.8rem">${t('settings.auth_env_notice')}</p>`;
      } else {
        html += `
          <p class="text-muted" style="font-size:0.8rem;margin-bottom:12px">${t('settings.auth_info')}</p>
          <label class="settings-checkbox">
            <input type="checkbox" id="auth-enabled" ${ac.enabled ? 'checked' : ''}>
            <span>${t('settings.auth_enable')}</span>
          </label>

          <div class="card-title mt-md" style="font-size:0.7rem">${t('settings.auth_users_title')}</div>
          <div id="auth-users-list"></div>
          <button class="form-btn form-btn-sm mt-sm" data-ripple onclick="addAuthUser()">${t('settings.auth_add_user')}</button>

          <div class="form-group mt-md">
            <label class="form-label">${t('settings.auth_session')}</label>
            <input class="form-input" type="number" id="auth-session-hours" value="${ac.sessionDurationHours || 24}" min="1" max="720" style="max-width:120px">
          </div>
          <div class="notif-save-row">
            <button class="form-btn" id="auth-save-btn" data-ripple onclick="saveAuthSettings()">${t('settings.auth_save')}</button>
            <span class="notif-save-status" id="auth-save-status"></span>
          </div>`;
      }

      html += '</div>';
      section.innerHTML = html;

      if (!envManaged) renderAuthUsers();
    } catch {
      section.innerHTML = '';
    }
  }

  function renderAuthUsers() {
    const list = document.getElementById('auth-users-list');
    if (!list) return;

    if (_authUsers.length === 0) {
      list.innerHTML = `<p class="text-muted" style="font-size:0.8rem">${t('settings.auth_no_users')}</p>`;
      return;
    }

    let html = '<div class="auth-users-grid">';
    for (let i = 0; i < _authUsers.length; i++) {
      const u = _authUsers[i];
      html += `
        <div class="auth-user-row">
          <input class="form-input auth-user-input" type="text" value="${(u.username || '').replace(/"/g, '&quot;')}"
                 placeholder="${t('settings.auth_username_ph')}" data-idx="${i}" data-field="username" onchange="updateAuthUser(this)">
          <input class="form-input auth-user-input" type="password" value="${u.password || ''}"
                 placeholder="${u.password === '***' ? t('settings.auth_password_unchanged') : t('settings.auth_password_ph')}"
                 data-idx="${i}" data-field="password" onchange="updateAuthUser(this)">
          <button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('settings.delete')}" onclick="removeAuthUser(${i})" title="${t('settings.delete')}">✕</button>
        </div>`;
    }
    html += '</div>';
    list.innerHTML = html;
  }

  window.addAuthUser = function() {
    _authUsers.push({ username: '', password: '' });
    renderAuthUsers();
    // Focus the new username field
    const inputs = document.querySelectorAll('.auth-user-row:last-child input[data-field="username"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  };

  window.updateAuthUser = function(el) {
    const idx = parseInt(el.dataset.idx);
    const field = el.dataset.field;
    if (_authUsers[idx]) _authUsers[idx][field] = el.value;
  };

  window.removeAuthUser = function(idx) {
    _authUsers.splice(idx, 1);
    renderAuthUsers();
  };

  window.saveAuthSettings = async function() {
    const btn = document.getElementById('auth-save-btn');
    const status = document.getElementById('auth-save-status');
    if (btn) { btn.disabled = true; btn.classList.add('btn-loading'); }
    if (status) { status.textContent = t('settings.auth_saving'); status.style.color = ''; }

    const body = {
      enabled: document.getElementById('auth-enabled')?.checked || false,
      users: _authUsers.filter(u => u.username && u.username.trim()),
      password: '',
      username: '',
      sessionDurationHours: parseInt(document.getElementById('auth-session-hours')?.value) || 24
    };

    try {
      const res = await fetch('/api/auth/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        if (status) { status.textContent = t('settings.auth_saved'); status.style.color = 'var(--accent-green)'; }
        // Reload to get fresh masked passwords
        setTimeout(() => loadAuthSettings(), 1500);
      } else {
        if (status) { status.textContent = data.error || t('settings.auth_save_failed'); status.style.color = 'var(--accent-red)'; }
      }
    } catch {
      if (status) { status.textContent = t('settings.auth_save_failed'); status.style.color = 'var(--accent-red)'; }
    }

    if (btn) { btn.disabled = false; btn.classList.remove('btn-loading'); }
    setTimeout(() => { if (status) { status.textContent = ''; status.style.color = ''; } }, 3000);
  };

  // ---- Server Notification Settings ----

  let _notifConf = null;

  async function loadNotifSettings() {
    const section = document.getElementById('notif-server-section');
    if (!section) return;

    try {
      const res = await fetch('/api/notifications/config');
      _notifConf = await res.json();
    } catch {
      section.innerHTML = '';
      return;
    }

    const nc = _notifConf;
    const channels = [
      { key: 'telegram', label: t('settings.notif_telegram'), fields: [
        { id: 'botToken', label: t('settings.notif_bot_token') },
        { id: 'chatId', label: t('settings.notif_chat_id') }
      ]},
      { key: 'discord', label: t('settings.notif_discord'), fields: [
        { id: 'webhookUrl', label: t('settings.notif_webhook_url') }
      ]},
      { key: 'email', label: t('settings.notif_email'), fields: [
        { id: 'host', label: t('settings.notif_host') },
        { id: 'port', label: t('settings.notif_port'), type: 'number' },
        { id: 'user', label: t('settings.notif_user') },
        { id: 'pass', label: t('settings.notif_pass'), type: 'password' },
        { id: 'from', label: t('settings.notif_from') },
        { id: 'to', label: t('settings.notif_to') }
      ]},
      { key: 'webhook', label: t('settings.notif_webhook'), fields: [
        { id: 'url', label: t('settings.notif_url') },
        { id: 'headers', label: t('settings.notif_headers') }
      ]},
      { key: 'ntfy', label: t('settings.notif_ntfy'), fields: [
        { id: 'serverUrl', label: t('settings.notif_server_url') },
        { id: 'topic', label: t('settings.notif_topic') },
        { id: 'token', label: t('settings.notif_token') }
      ]},
      { key: 'pushover', label: t('settings.notif_pushover'), fields: [
        { id: 'apiToken', label: t('settings.notif_api_token') },
        { id: 'userKey', label: t('settings.notif_user_key') }
      ]},
      { key: 'sms', label: t('settings.notif_sms'), fields: [
        { id: 'provider', label: t('settings.notif_sms_provider'), type: 'select', options: [{ value: 'twilio', label: 'Twilio' }, { value: 'generic', label: t('settings.notif_sms_generic') }] },
        { id: 'accountSid', label: t('settings.notif_sms_account_sid') },
        { id: 'authToken', label: t('settings.notif_sms_auth_token'), type: 'password' },
        { id: 'fromNumber', label: t('settings.notif_sms_from') },
        { id: 'toNumber', label: t('settings.notif_sms_to') },
        { id: 'gatewayUrl', label: t('settings.notif_sms_gateway_url') },
        { id: 'gatewayHeaders', label: t('settings.notif_sms_gateway_headers') }
      ]}
    ];

    const events = [
      { key: 'print_started',   label: t('settings.notif_evt_print_started') },
      { key: 'print_finished',  label: t('settings.notif_evt_print_finished') },
      { key: 'print_failed',    label: t('settings.notif_evt_print_failed') },
      { key: 'print_cancelled', label: t('settings.notif_evt_print_cancelled') },
      { key: 'printer_error',   label: t('settings.notif_evt_printer_error') },
      { key: 'maintenance_due', label: t('settings.notif_evt_maintenance_due') },
      { key: 'bed_cooled',      label: t('settings.notif_evt_bed_cooled') },
      { key: 'drying_due',      label: t('settings.notif_evt_drying_due') },
      { key: 'filament_low_stock', label: t('settings.notif_evt_low_stock') },
      { key: 'queue_item_started',  label: t('settings.notif_evt_queue_item_started') },
      { key: 'queue_item_completed', label: t('settings.notif_evt_queue_item_completed') },
      { key: 'queue_item_failed',   label: t('settings.notif_evt_queue_item_failed') },
      { key: 'queue_completed',     label: t('settings.notif_evt_queue_completed') }
    ];

    let html = `
      <div class="settings-card notif-section">
        <div class="card-title">${t('settings.notif_server_title')}</div>
        <label class="settings-checkbox">
          <input type="checkbox" id="notif-enabled" ${nc.enabled ? 'checked' : ''}>
          <span>${t('settings.notif_enable')}</span>
        </label>

        <div class="card-title mt-md" style="font-size:0.7rem">${t('settings.notif_channels')}</div>
        <div class="notif-channel-list">`;

    for (const ch of channels) {
      const chConf = nc.channels?.[ch.key] || {};
      html += `
        <div class="notif-channel" id="notif-ch-${ch.key}">
          <div class="notif-channel-header" onclick="toggleNotifChannel('${ch.key}')">
            <span class="notif-channel-arrow">&#9654;</span>
            <span class="notif-channel-name">${ch.label}</span>
            <input type="checkbox" class="notif-channel-toggle" id="notif-ch-${ch.key}-on" ${chConf.enabled ? 'checked' : ''} onclick="event.stopPropagation()">
            <button class="notif-test-btn" id="notif-test-${ch.key}" onclick="event.stopPropagation(); testNotifChannel('${ch.key}')">${t('settings.notif_test')}</button>
          </div>
          <div class="notif-channel-body">`;

      for (const f of ch.fields) {
        let val = chConf[f.id] ?? '';
        if (f.id === 'headers' && typeof val === 'object') val = JSON.stringify(val);
        html += `<div class="notif-field"><label>${f.label}</label>`;
        if (f.type === 'select' && f.options) {
          html += `<select id="notif-${ch.key}-${f.id}" class="form-input" style="height:28px;font-size:0.8rem">`;
          for (const opt of f.options) html += `<option value="${opt.value}" ${val === opt.value ? 'selected' : ''}>${opt.label}</option>`;
          html += '</select>';
        } else {
          html += `<input type="${f.type || 'text'}" id="notif-${ch.key}-${f.id}" value="${String(val).replace(/"/g, '&quot;')}" autocomplete="off">`;
        }
        html += '</div>';
      }
      html += '</div></div>';
    }

    html += `</div>

      <div class="card-title mt-md" style="font-size:0.7rem">${t('settings.notif_events')}</div>
      <div class="notif-events-grid">`;

    for (const ev of events) {
      const evConf = nc.events?.[ev.key] || {};
      html += `
        <label class="notif-event-item">
          <input type="checkbox" id="notif-ev-${ev.key}" ${evConf.enabled ? 'checked' : ''}>
          <span>${ev.label}</span>
        </label>`;
    }

    html += `</div>
      <div class="notif-field mt-sm" style="max-width:200px">
        <label>${t('settings.notif_bed_threshold')}</label>
        <input type="number" id="notif-bed-threshold" value="${nc.bedCooledThreshold || 30}" min="15" max="60">
      </div>

      <div class="card-title mt-md" style="font-size:0.7rem">${t('settings.notif_quiet_hours')}</div>
      <div class="notif-quiet-row">
        <label class="notif-event-item">
          <input type="checkbox" id="notif-quiet-on" ${nc.quietHours?.enabled ? 'checked' : ''}>
          <span>${t('settings.notif_quiet_enable')}</span>
        </label>
        <label>${t('settings.notif_quiet_from')}</label>
        <input type="time" id="notif-quiet-start" value="${nc.quietHours?.start || '23:00'}">
        <label>${t('settings.notif_quiet_to')}</label>
        <input type="time" id="notif-quiet-end" value="${nc.quietHours?.end || '07:00'}">
      </div>

      <div class="notif-save-row">
        <button class="form-btn" id="notif-save-btn" data-ripple onclick="saveNotifSettings()">${t('settings.notif_save')}</button>
        <span class="notif-save-status" id="notif-save-status"></span>
      </div>
    </div>`;

    section.innerHTML = html;
  }

  window.toggleNotifChannel = function(key) {
    const el = document.getElementById(`notif-ch-${key}`);
    if (el) el.classList.toggle('open');
  };

  window.testNotifChannel = async function(key) {
    const btn = document.getElementById(`notif-test-${key}`);
    if (!btn) return;
    btn.textContent = '...';
    btn.className = 'notif-test-btn';

    const channelConf = _getChannelConf(key);
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: key, config: channelConf })
      });
      const data = await res.json();
      if (data.ok) {
        btn.textContent = t('settings.notif_test_ok');
        btn.className = 'notif-test-btn success';
      } else {
        btn.textContent = t('settings.notif_test_fail');
        btn.title = data.error || '';
        btn.className = 'notif-test-btn fail';
      }
    } catch (e) {
      btn.textContent = t('settings.notif_test_fail');
      btn.className = 'notif-test-btn fail';
    }
    setTimeout(() => { btn.textContent = t('settings.notif_test'); btn.className = 'notif-test-btn'; btn.title = ''; }, 3000);
  };

  function _getChannelConf(key) {
    const fields = {
      telegram: ['botToken', 'chatId'],
      discord: ['webhookUrl'],
      email: ['host', 'port', 'user', 'pass', 'from', 'to'],
      webhook: ['url', 'headers'],
      ntfy: ['serverUrl', 'topic', 'token'],
      pushover: ['apiToken', 'userKey'],
      sms: ['provider', 'accountSid', 'authToken', 'fromNumber', 'toNumber', 'gatewayUrl', 'gatewayHeaders']
    };
    const conf = { enabled: document.getElementById(`notif-ch-${key}-on`)?.checked || false };
    for (const f of (fields[key] || [])) {
      let val = document.getElementById(`notif-${key}-${f}`)?.value || '';
      if (f === 'port') val = parseInt(val) || 587;
      if (f === 'headers') {
        try { val = JSON.parse(val); } catch { val = {}; }
      }
      conf[f] = val;
    }
    return conf;
  }

  window.saveNotifSettings = async function() {
    const btn = document.getElementById('notif-save-btn');
    const status = document.getElementById('notif-save-status');
    if (btn) { btn.disabled = true; btn.classList.add('btn-loading'); }
    if (status) status.textContent = t('settings.notif_saving');

    const allEvents = ['print_started','print_finished','print_failed','print_cancelled','printer_error','maintenance_due','bed_cooled','drying_due','filament_low_stock','queue_item_started','queue_item_completed','queue_item_failed','queue_completed'];
    const allChannelKeys = ['telegram','discord','email','webhook','ntfy','pushover','sms'];

    const eventsConf = {};
    for (const ev of allEvents) {
      eventsConf[ev] = {
        enabled: document.getElementById(`notif-ev-${ev}`)?.checked || false,
        channels: allChannelKeys
      };
    }

    const channelsConf = {};
    for (const key of allChannelKeys) {
      channelsConf[key] = _getChannelConf(key);
    }

    const body = {
      enabled: document.getElementById('notif-enabled')?.checked || false,
      channels: channelsConf,
      events: eventsConf,
      quietHours: {
        enabled: document.getElementById('notif-quiet-on')?.checked || false,
        start: document.getElementById('notif-quiet-start')?.value || '23:00',
        end: document.getElementById('notif-quiet-end')?.value || '07:00'
      },
      bedCooledThreshold: parseInt(document.getElementById('notif-bed-threshold')?.value) || 30
    };

    try {
      const res = await fetch('/api/notifications/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        if (status) { status.textContent = t('settings.notif_saved'); status.style.color = 'var(--accent-green)'; }
      } else {
        if (status) { status.textContent = t('settings.notif_save_failed'); status.style.color = 'var(--accent-red)'; }
      }
    } catch {
      if (status) { status.textContent = t('settings.notif_save_failed'); status.style.color = 'var(--accent-red)'; }
    }

    if (btn) { btn.disabled = false; btn.classList.remove('btn-loading'); }
    setTimeout(() => { if (status) { status.textContent = ''; status.style.color = ''; } }, 3000);
  };

  // ---- Notification Log ----
  async function loadNotifLog() {
    const section = document.getElementById('notif-log-section');
    if (!section) return;

    try {
      const res = await fetch('/api/notifications/log?limit=20');
      const logs = await res.json();

      if (!logs || logs.length === 0) {
        section.innerHTML = `<p class="text-muted" style="font-size:0.8rem">${t('settings.notif_log_empty')}</p>`;
        return;
      }

      const locale = (window.i18n?.getLocale() || 'nb').replace('_', '-');
      let html = '<div class="notif-log-list">';
      for (const l of logs) {
        const d = l.timestamp ? new Date(l.timestamp) : new Date();
        const time = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        const okClass = l.success ? 'notif-log-ok' : 'notif-log-fail';
        const icon = l.success
          ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
          : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        html += `<div class="notif-log-item ${okClass}">
          <span class="notif-log-icon">${icon}</span>
          <span class="notif-log-channel">${l.channel || '--'}</span>
          <span class="notif-log-event">${l.event || '--'}</span>
          <span class="notif-log-time">${time}</span>
          ${l.error ? `<span class="notif-log-error" title="${l.error}">${l.error.substring(0, 40)}</span>` : ''}
        </div>`;
      }
      html += '</div>';
      section.innerHTML = html;
    } catch {
      section.innerHTML = `<p class="text-muted" style="font-size:0.8rem">${t('settings.notif_log_failed')}</p>`;
    }
  }

  // ---- OBS URL Builder ----
  window._obsUpdateUrl = function() {
    const base = location.origin + '/obs.html';
    const params = new URLSearchParams();
    const printer = document.getElementById('obs-cfg-printer')?.value;
    const bgSel = document.getElementById('obs-cfg-bg')?.value;
    const bgColor = document.getElementById('obs-cfg-bg-color')?.value;
    const compact = document.getElementById('obs-cfg-compact')?.checked;
    const hideIdle = document.getElementById('obs-cfg-hide-idle')?.checked;
    const pos = document.getElementById('obs-cfg-pos')?.value;

    if (printer) params.set('printer', printer);
    if (bgSel === 'transparent') params.set('bg', 'transparent');
    else if (bgSel === 'custom' && bgColor) params.set('bg', bgColor);
    if (compact) params.set('compact', '');
    if (hideIdle) params.set('hide_idle', '');
    if (pos && pos !== 'right') params.set('pos', pos);

    const qs = params.toString();
    const url = qs ? base + '?' + qs : base;
    const input = document.getElementById('obs-url-display');
    if (input) input.value = url;
  };

  window._obsRefreshPreview = function() {
    const input = document.getElementById('obs-url-display');
    const frame = document.getElementById('obs-preview-frame');
    if (input && frame) frame.src = input.value;
  };

  window.copyObsUrl = function() {
    const input = document.getElementById('obs-url-display');
    if (!input) return;
    navigator.clipboard.writeText(input.value).then(() => {
      const btn = input.parentElement.querySelector('button');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px"><polyline points="20 6 9 17 4 12"/></svg> Kopiert!';
        setTimeout(() => { btn.innerHTML = orig; }, 1500);
      }
    });
  };

  // ---- Appearance / Theme ----

  const ACCENT_SWATCHES = [
    { color: '#00AE42', label: 'Green' },
    { color: '#1279ff', label: 'Blue' },
    { color: '#7b2ff2', label: 'Purple' },
    { color: '#f0883e', label: 'Orange' },
    { color: '#e91e63', label: 'Pink' },
    { color: '#00bcd4', label: 'Cyan' },
  ];
  // Expose for settings-dialog.js core's _renderAppearanceSubContent
  window._ACCENT_SWATCHES = ACCENT_SWATCHES;

  function buildAppearanceTab() {
    const cfg = window.theme ? window.theme.get() : { preset: 'light', accentColor: null, radius: 12 };
    const currentAccent = cfg.accentColor || (window.theme ? window.theme.getDefaultAccent() : '#00AE42');
    const currentRadius = cfg.radius ?? 12;

    let html = '';

    // Theme preset
    html += `
      <div class="settings-card">
        <div class="card-title">${t('settings.theme_title')}</div>
        <div class="theme-preset-grid">
          <button class="theme-preset-card ${cfg.preset === 'light' ? 'active' : ''}" onclick="setThemePreset('light')">
            <div class="theme-preset-preview theme-preview-light">
              <div class="tpp-sidebar"></div>
              <div class="tpp-main"><div class="tpp-card"></div><div class="tpp-card"></div></div>
            </div>
            <span>${t('settings.theme_light')}</span>
          </button>
          <button class="theme-preset-card ${cfg.preset === 'dark' ? 'active' : ''}" onclick="setThemePreset('dark')">
            <div class="theme-preset-preview theme-preview-dark">
              <div class="tpp-sidebar"></div>
              <div class="tpp-main"><div class="tpp-card"></div><div class="tpp-card"></div></div>
            </div>
            <span>${t('settings.theme_dark')}</span>
          </button>
          <button class="theme-preset-card ${cfg.preset === 'auto' ? 'active' : ''}" onclick="setThemePreset('auto')">
            <div class="theme-preset-preview theme-preview-auto">
              <div class="tpp-half-light"></div>
              <div class="tpp-half-dark"></div>
            </div>
            <span>${t('settings.theme_auto')}</span>
          </button>
        </div>
      </div>`;

    // Accent color
    html += `
      <div class="settings-card mt-md">
        <div class="card-title">${t('settings.theme_accent')}</div>
        <div class="theme-color-row">`;
    for (const s of ACCENT_SWATCHES) {
      const isActive = currentAccent.toLowerCase() === s.color.toLowerCase();
      html += `<button class="theme-color-swatch ${isActive ? 'active' : ''}" style="background:${s.color}" onclick="setThemeAccent('${s.color}')" title="${s.label}"></button>`;
    }
    html += `
          <label class="theme-color-custom" title="${t('settings.theme_accent')}">
            <input type="color" id="theme-accent-picker" value="${currentAccent}" onchange="setThemeAccent(this.value)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </label>
        </div>
        ${cfg.accentColor ? `<button class="form-btn form-btn-sm form-btn-secondary mt-sm" data-ripple onclick="setThemeAccent(null)">${t('settings.theme_accent_reset')}</button>` : ''}
      </div>`;

    // Border radius
    html += `
      <div class="settings-card mt-md">
        <div class="card-title">${t('settings.theme_radius')}</div>
        <div class="theme-radius-row">
          <span class="text-muted" style="font-size:0.8rem">${t('settings.theme_radius_sharp')}</span>
          <input type="range" class="theme-radius-slider" id="theme-radius-slider" min="0" max="20" step="1" value="${currentRadius}" oninput="setThemeRadius(this.value)">
          <span class="text-muted" style="font-size:0.8rem">${t('settings.theme_radius_round')}</span>
          <span class="theme-radius-value" id="theme-radius-value">${currentRadius}px</span>
        </div>
      </div>`;

    // Reset
    html += `
      <div class="mt-md">
        <button class="form-btn form-btn-secondary" data-ripple onclick="resetTheme()">${t('settings.theme_reset')}</button>
      </div>`;

    return html;
  }

  window.setThemePreset = function(preset) {
    if (window.theme) window.theme.set({ preset });
    if (window._activePanel === 'settings' && _activeTab === 'appearance') if (typeof window._renderAppearanceSubContent === 'function') window._renderAppearanceSubContent();
  };

  window.setThemeAccent = function(color) {
    if (window.theme) window.theme.set({ accentColor: color });
    if (window._activePanel === 'settings' && _activeTab === 'appearance') if (typeof window._renderAppearanceSubContent === 'function') window._renderAppearanceSubContent();
  };

  window.setThemeRadius = function(val) {
    const r = parseInt(val) || 12;
    if (window.theme) window.theme.set({ radius: r });
    const label = document.getElementById('theme-radius-value');
    if (label) label.textContent = r + 'px';
  };

  window.resetTheme = function() {
    return confirmAction(t('settings.theme_reset_confirm'), () => {
      if (window.theme) window.theme.set({ preset: 'light', accentColor: null, radius: 12 });
      if (window._activePanel === 'settings' && _activeTab === 'appearance') if (typeof window._renderAppearanceSubContent === 'function') window._renderAppearanceSubContent();
    }, {});
  };

  // ---- Webhook Management ----


})();
