// Settings - Printer management
(function() {
  window.loadSettingsPanel = loadSettings;

  async function loadSettings() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    try {
      const res = await fetch('/api/printers');
      const printers = await res.json();

      // Printer info section (live data)
      let html = `
        <div class="settings-section">
          <div class="card-title">${t('printer_info.title')}</div>
          <div id="settings-printer-info">
            <span class="text-muted" style="font-size:0.8rem">${t('printer_info.waiting')}</span>
          </div>
        </div>`;

      html += `<div class="card-title mt-md">${t('settings.printers_title')}</div>`;
      html += '<div class="printer-list">';

      for (const p of printers) {
        html += `
          <div class="printer-config-card">
            <div class="printer-config-header">
              <div>
                <strong>${p.name}</strong>
                <div class="text-muted" style="font-size:0.75rem">${p.model || ''} ${p.ip && p.serial && p.accessCode ? '| ' + p.ip + ' | ' + t('settings.auto_connect') : '| ' + t('settings.add_details')}</div>
              </div>
              <div class="printer-config-actions">
                <button class="form-btn form-btn-sm" onclick="editPrinter('${p.id}')">${t('settings.edit')}</button>
                <button class="form-btn form-btn-sm form-btn-danger" onclick="removePrinter('${p.id}')">${t('settings.delete')}</button>
              </div>
            </div>
          </div>`;
      }

      html += '</div>';
      html += `<button class="form-btn mt-md" onclick="showAddPrinterForm()">${t('settings.add_printer')}</button>`;
      html += `<div id="printer-form-area"></div>`;

      // Language selector
      html += `
        <div class="settings-section mt-md">
          <div class="card-title">${t('settings.language')}</div>
          <select class="form-input" id="lang-select" onchange="changeLanguage(this.value)" style="max-width:250px">`;
      const locales = window.i18n.getSupportedLocales();
      const names = window.i18n.getLocaleNames();
      const current = window.i18n.getLocale();
      for (const loc of locales) {
        html += `<option value="${loc}" ${loc === current ? 'selected' : ''}>${names[loc]}</option>`;
      }
      html += `</select></div>`;

      // Browser notification settings
      html += `
        <div class="settings-section mt-md">
          <div class="card-title">${t('settings.notifications_title')}</div>
          <label class="settings-checkbox">
            <input type="checkbox" id="notify-toggle"
                   ${typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'checked' : ''}
                   onchange="toggleNotificationsPerm(this.checked)">
            <span>${t('settings.notifications_browser')}</span>
          </label>
        </div>`;

      // Server notification settings (loaded async)
      html += `<div id="notif-server-section"><div class="text-muted" style="font-size:0.8rem;margin-top:12px">Loading...</div></div>`;

      // Server info
      html += `
        <div class="settings-section mt-md">
          <div class="card-title">${t('settings.server_title')}</div>
          <div class="text-muted" style="font-size:0.8rem">
            Port: ${location.port || '3000'} | Printere: ${printers.length}
          </div>
        </div>`;

      // Update section (loaded async)
      html += `
        <div class="settings-section mt-md">
          <div class="card-title">${t('update.title')}</div>
          <div id="update-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div>
        </div>`;

      // Notification log section
      html += `
        <div class="settings-section mt-md">
          <div class="card-title">${t('settings.notif_log_title')}</div>
          <div id="notif-log-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div>
        </div>`;

      // Demo data section (loaded async)
      html += `<div id="demo-data-section"></div>`;

      panel.innerHTML = html;

      // Populate printer info
      const printerInfoEl = document.getElementById('settings-printer-info');
      if (printerInfoEl && typeof renderPrinterInfoSection === 'function') renderPrinterInfoSection(printerInfoEl);
      // Check for demo data
      checkDemoData();
      // Load server notification settings
      loadNotifSettings();
      // Load notification log
      loadNotifLog();
      // Load update section
      const updateSection = document.getElementById('update-section');
      if (updateSection && typeof renderUpdateSection === 'function') renderUpdateSection(updateSection);
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('settings.load_failed')}</p>`;
    }
  }

  function renderPrinterForm(target, printer = null) {
    const isEdit = !!printer;
    const title = isEdit ? t('settings.edit_printer') : t('settings.add_printer_title');

    target.innerHTML = `
      <div class="settings-form mt-md">
        <div class="card-title">${title}</div>
        <div class="form-group">
          <label class="form-label">${t('settings.name')}</label>
          <input class="form-input" id="pf-name" value="${printer?.name || ''}" placeholder="${t('settings.name_placeholder')}">
        </div>
        <div class="form-group">
          <label class="form-label">${t('settings.model')}</label>
          <select class="form-input" id="pf-model">
            <option value="">${t('settings.model_placeholder')}</option>
            ${(typeof getKnownModels === 'function' ? getKnownModels() : []).map(m =>
              `<option value="${m}" ${printer?.model === m ? 'selected' : ''}>${m}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${t('settings.ip')}</label>
          <input class="form-input" id="pf-ip" value="${printer?.ip || ''}" placeholder="${t('settings.ip_placeholder')}">
        </div>
        <div class="form-group">
          <label class="form-label">${t('settings.serial')}</label>
          <input class="form-input" id="pf-serial" value="${printer?.serial || ''}" placeholder="${t('settings.serial_placeholder')}">
        </div>
        <div class="form-group">
          <label class="form-label">${t('settings.access_code')}</label>
          <input class="form-input" id="pf-access" value="" placeholder="${t('settings.access_code_hint')}">
        </div>
        <div class="form-actions">
          <button class="form-btn" onclick="savePrinterForm('${printer?.id || ''}')">${t('settings.save')}</button>
          <button class="form-btn form-btn-secondary" onclick="cancelPrinterForm()">${t('settings.cancel')}</button>
        </div>
        <p class="text-muted mt-sm" style="font-size:0.75rem">${t('settings.auto_connect_hint')}</p>
      </div>`;
  }

  window.showAddPrinterForm = function() {
    const area = document.getElementById('printer-form-area');
    if (area) renderPrinterForm(area);
  };

  window.editPrinter = async function(id) {
    try {
      const res = await fetch('/api/printers');
      const printers = await res.json();
      const printer = printers.find(p => p.id === id);
      if (!printer) return;
      const area = document.getElementById('printer-form-area');
      if (area) renderPrinterForm(area, printer);
    } catch (e) { /* ignore */ }
  };

  window.savePrinterForm = async function(existingId) {
    const name = document.getElementById('pf-name')?.value.trim();
    const model = document.getElementById('pf-model')?.value.trim();
    const ip = document.getElementById('pf-ip')?.value.trim();
    const serial = document.getElementById('pf-serial')?.value.trim();

    if (!name) { alert(t('settings.name_required')); return; }

    const accessCode = document.getElementById('pf-access')?.value.trim();
    const body = { name, model, ip, serial, accessCode };

    try {
      if (existingId) {
        await fetch(`/api/printers/${existingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        body.id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        await fetch('/api/printers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }
      loadSettings();
    } catch (e) {
      alert(t('settings.save_failed'));
    }
  };

  window.cancelPrinterForm = function() {
    const area = document.getElementById('printer-form-area');
    if (area) area.innerHTML = '';
  };

  window.removePrinter = async function(id) {
    if (!confirm(t('settings.confirm_delete'))) return;
    try {
      await fetch(`/api/printers/${id}`, { method: 'DELETE' });
      loadSettings();
    } catch (e) { /* ignore */ }
  };

  window.changeLanguage = function(locale) {
    window.i18n.setLocale(locale).then(() => {
      // Re-render settings if open
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
        section.innerHTML = `
          <div class="settings-section mt-md">
            <div class="card-title">${t('settings.demo_title')}</div>
            <div class="text-muted" style="font-size:0.8rem; margin-bottom:8px;">
              ${t('settings.demo_description', { count: data.printerIds.length })}
            </div>
            <button class="form-btn form-btn-danger" onclick="deleteDemoData()">${t('settings.demo_delete')}</button>
          </div>`;
      }
    } catch { /* no demo data endpoint or error */ }
  }

  window.deleteDemoData = async function() {
    if (!confirm(t('settings.demo_confirm'))) return;
    try {
      const res = await fetch('/api/demo', { method: 'DELETE' });
      const data = await res.json();
      if (data.deleted > 0) {
        // Clear local state for deleted printers
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
      ]}
    ];

    const events = [
      { key: 'print_started',   label: t('settings.notif_evt_print_started') },
      { key: 'print_finished',  label: t('settings.notif_evt_print_finished') },
      { key: 'print_failed',    label: t('settings.notif_evt_print_failed') },
      { key: 'print_cancelled', label: t('settings.notif_evt_print_cancelled') },
      { key: 'printer_error',   label: t('settings.notif_evt_printer_error') },
      { key: 'maintenance_due', label: t('settings.notif_evt_maintenance_due') },
      { key: 'bed_cooled',      label: t('settings.notif_evt_bed_cooled') }
    ];

    let html = `
      <div class="settings-section mt-md notif-section">
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
        html += `
          <div class="notif-field">
            <label>${f.label}</label>
            <input type="${f.type || 'text'}" id="notif-${ch.key}-${f.id}" value="${String(val).replace(/"/g, '&quot;')}" autocomplete="off">
          </div>`;
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
        <button class="form-btn" id="notif-save-btn" onclick="saveNotifSettings()">${t('settings.notif_save')}</button>
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
      pushover: ['apiToken', 'userKey']
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
    if (btn) btn.disabled = true;
    if (status) status.textContent = t('settings.notif_saving');

    const allEvents = ['print_started','print_finished','print_failed','print_cancelled','printer_error','maintenance_due','bed_cooled'];
    const allChannelKeys = ['telegram','discord','email','webhook','ntfy','pushover'];

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

    if (btn) btn.disabled = false;
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

})();
