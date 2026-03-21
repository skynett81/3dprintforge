// Settings — Core: state, search index, tab HTML builder (loadSettings), switchSettingsTab,
// sub-tab switchers and renderers for all 5 tabs (printers/general/appearance/notifications/system).
// Sub-files (loaded AFTER this file, define window.* functions called from here):
//   settings-printers.js      — printer forms, discovery, Bambu Cloud
//   settings-general.js       — auth, OBS, notification channel settings, notif log
//   settings-security.js      — webhooks, user management, API keys
//   settings-integrations.js  — e-commerce, timelapse, hub, AI detection, groups
//   settings-advanced.js      — energy, HA MQTT, remote nodes, power, reports
(function() {

  window.loadSettingsPanel = loadSettings;

  // Ensure modal CSS exists (guards against stale SW cache)
  if (!document.getElementById('modal-css-inject')) {
    const style = document.createElement('style');
    style.id = 'modal-css-inject';
    style.textContent = `.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:1000;display:flex;align-items:center;justify-content:center}.modal-content{background:var(--bg-card,#1a1f3c);border-radius:10px;border:1px solid var(--border-color,#2a2f4a);width:90%;max-width:500px;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.3)}.modal-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border-color,#2a2f4a)}.modal-header h3{margin:0;font-size:0.9rem;font-weight:600;color:var(--text-primary,#e8ecf1)}.modal-close{background:none;border:none;color:var(--text-muted,#8892b0);font-size:1.4rem;cursor:pointer;line-height:1;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:4px}.modal-close:hover{color:var(--text-primary,#e8ecf1);background:var(--bg-tertiary,#252a4a)}.modal-body{padding:16px;overflow-y:auto;flex:1}.modal-footer{padding:12px 16px;border-top:1px solid var(--border-color,#2a2f4a);display:flex;justify-content:flex-end;gap:0.5rem}`;
    document.head.appendChild(style);
  }

  function _esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  let _activeTab = 'printers';
  let _printerSubTab = 'list';
  let _generalSubTab = 'preferences';
  let _appearanceSubTab = 'theme';
  let _systemSubTab = 'updates';
  let _notifSubTab = 'channels';

  // Search index: each entry maps a translatable label + keywords to a tab/sub-tab path
  const _searchIndex = [
    // Printers tab
    { key: 'settings.printers_title', kw: 'printer list manage ip serial access code', tab: 'printers', sub: 'list' },
    { key: 'settings.bambu_cloud', kw: 'cloud import login account bambu', tab: 'printers', sub: 'list' },
    { key: 'settings.discover_printers', kw: 'discover scan network find', tab: 'printers', sub: 'list' },
    { key: 'printer_info.title', kw: 'printer status info firmware nozzle', tab: 'printers', sub: 'status' },
    // General tab
    { key: 'settings.language', kw: 'language locale i18n translation', tab: 'general', sub: 'preferences' },
    { key: 'settings.notifications_title', kw: 'browser notifications permission', tab: 'general', sub: 'preferences' },
    { key: 'settings.server_title', kw: 'server port', tab: 'general', sub: 'preferences' },
    { key: 'settings.auth_title', kw: 'authentication login password user auth', tab: 'general', sub: 'auth' },
    { key: 'settings.obs_title', kw: 'obs overlay streaming browser source', tab: 'general', sub: 'obs' },
    // Appearance tab
    { key: 'settings.theme_title', kw: 'theme dark light auto mode', tab: 'appearance', sub: 'theme' },
    { key: 'settings.theme_accent', kw: 'accent color swatch', tab: 'appearance', sub: 'customize' },
    { key: 'settings.theme_radius', kw: 'corner roundness radius sharp round border', tab: 'appearance', sub: 'customize' },
    // Notifications tab
    { key: 'settings.notif_server_title', kw: 'telegram discord email webhook ntfy pushover sms notification', tab: 'notifications', sub: 'channels' },
    { key: 'settings.notif_log_title', kw: 'notification log history sent', tab: 'notifications', sub: 'log' },
    { key: 'settings.webhooks_title', kw: 'webhook outgoing http external', tab: 'notifications', sub: 'webhooks' },
    // System tab
    { key: 'update.title', kw: 'update version upgrade check', tab: 'system', sub: 'updates' },
    { key: 'settings.demo_title', kw: 'demo data test', tab: 'system', sub: 'updates' },
    { key: 'settings.users_title', kw: 'user management roles admin permissions', tab: 'system', sub: 'security' },
    { key: 'settings.api_keys_title', kw: 'api key token bearer integration', tab: 'system', sub: 'security' },
    { key: 'settings.push_title', kw: 'push notifications vapid browser', tab: 'system', sub: 'security' },
    { key: 'settings.totp_title', kw: 'two factor 2fa totp authenticator', tab: 'system', sub: 'security' },
    { key: 'settings.printer_groups_title', kw: 'group printer farm organize', tab: 'system', sub: 'printers' },
    { key: 'settings.hub_title', kw: 'hub kiosk mode display multi printer', tab: 'system', sub: 'printers' },
    { key: 'settings.ai_detection_title', kw: 'ai failure detection camera spaghetti', tab: 'system', sub: 'automation' },
    { key: 'settings.timelapse_title', kw: 'timelapse recording ffmpeg video', tab: 'system', sub: 'automation' },
    { key: 'settings.ecom_title', kw: 'ecommerce shopify woocommerce orders shop', tab: 'system', sub: 'integrations' },
    { key: 'orders.title', kw: 'orders order kanban invoice project management faktura ordrer', tab: 'system', sub: 'integrations' },
    { key: 'settings.spoolman_title', kw: 'spoolman filament sync external', tab: 'system', sub: 'integrations' },
    { key: 'settings.custom_fields_title', kw: 'custom field spool printer profile project', tab: 'system', sub: 'data' },
    { key: 'settings.brand_defaults_title', kw: 'brand default temperature filament material', tab: 'system', sub: 'data' },
    { key: 'settings.courses_title', kw: 'learning center tutorial guide course', tab: 'system', sub: 'data' },
  ];

  function _settingsSearch(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return _searchIndex.filter(entry => {
      const label = t(entry.key).toLowerCase();
      return label.includes(q) || entry.kw.includes(q);
    });
  }

  function _navigateToSetting(tab, sub) {
    // Set sub-tab state
    if (tab === 'printers') _printerSubTab = sub;
    else if (tab === 'general') _generalSubTab = sub;
    else if (tab === 'appearance') _appearanceSubTab = sub;
    else if (tab === 'notifications') _notifSubTab = sub;
    else if (tab === 'system') _systemSubTab = sub;
    // Switch main tab
    window.switchSettingsTab(tab);
    // Switch sub-tab
    if (tab === 'printers') window._switchPrinterSubTab(sub);
    else if (tab === 'general') window._switchGeneralSubTab(sub);
    else if (tab === 'appearance') window._switchAppearanceSubTab(sub);
    else if (tab === 'notifications') window._switchNotifSubTab(sub);
    else if (tab === 'system') window._switchSystemSubTab(sub);
    // Clear search
    const input = document.getElementById('settings-search-input');
    if (input) input.value = '';
    const dropdown = document.getElementById('settings-search-results');
    if (dropdown) dropdown.style.display = 'none';
  }

  window._settingsSearchInput = function(e) {
    const query = e.target.value;
    const dropdown = document.getElementById('settings-search-results');
    if (!dropdown) return;
    const results = _settingsSearch(query);
    if (!results.length || !query || query.length < 2) {
      dropdown.style.display = 'none';
      return;
    }
    const tabNames = {
      printers: t('settings.tab_printers'),
      general: t('settings.tab_general'),
      appearance: t('settings.tab_appearance'),
      notifications: t('settings.tab_notifications'),
      system: t('settings.tab_system')
    };
    let html = '';
    for (const r of results) {
      html += `<button class="settings-search-item" onmousedown="_navigateToSettingFromSearch('${r.tab}','${r.sub}')">
        <span class="settings-search-label">${_esc(t(r.key))}</span>
        <span class="settings-search-path">${_esc(tabNames[r.tab])}</span>
      </button>`;
    }
    dropdown.innerHTML = html;
    dropdown.style.display = 'block';
  };

  window._navigateToSettingFromSearch = function(tab, sub) {
    _navigateToSetting(tab, sub);
  };

  window._settingsSearchBlur = function() {
    setTimeout(() => {
      const dropdown = document.getElementById('settings-search-results');
      if (dropdown) dropdown.style.display = 'none';
    }, 150);
  };

  async function loadSettings() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    // Read sub-slug from hash (e.g. #settings/notifications or #settings/system/security)
    const hashParts = location.hash.replace('#', '').split('/');
    const hashSub = hashParts[1];
    if (hashSub && ['printers','general','appearance','notifications','system'].includes(hashSub)) _activeTab = hashSub;
    if (hashParts[2]) {
      if (_activeTab === 'printers' && ['list','status'].includes(hashParts[2])) _printerSubTab = hashParts[2];
      if (_activeTab === 'general' && ['preferences','auth','obs'].includes(hashParts[2])) _generalSubTab = hashParts[2];
      if (_activeTab === 'appearance' && ['theme','customize'].includes(hashParts[2])) _appearanceSubTab = hashParts[2];
      if (_activeTab === 'system' && ['updates','security','printers','automation','energy','integrations','nodes','data'].includes(hashParts[2])) _systemSubTab = hashParts[2];
      if (_activeTab === 'notifications' && ['channels','log','webhooks'].includes(hashParts[2])) _notifSubTab = hashParts[2];
    }

    try {
      const res = await fetch('/api/printers');
      const printers = await res.json();

      // Search bar + Tab bar
      let html = `
        <div class="settings-search-wrap">
          <svg class="settings-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="settings-search-input" id="settings-search-input" placeholder="${t('settings.search_placeholder')}" oninput="_settingsSearchInput(event)" onblur="_settingsSearchBlur()" autocomplete="off">
          <div class="settings-search-results" id="settings-search-results" style="display:none"></div>
        </div>
        <div class="settings-tabs">
          <button class="settings-tab ${_activeTab === 'printers' ? 'active' : ''}" onclick="switchSettingsTab('printers')">${t('settings.tab_printers')}</button>
          <button class="settings-tab ${_activeTab === 'general' ? 'active' : ''}" onclick="switchSettingsTab('general')">${t('settings.tab_general')}</button>
          <button class="settings-tab ${_activeTab === 'appearance' ? 'active' : ''}" onclick="switchSettingsTab('appearance')">${t('settings.tab_appearance')}</button>
          <button class="settings-tab ${_activeTab === 'notifications' ? 'active' : ''}" onclick="switchSettingsTab('notifications')">${t('settings.tab_notifications')}</button>
          <button class="settings-tab ${_activeTab === 'system' ? 'active' : ''}" onclick="switchSettingsTab('system')">${t('settings.tab_system')}</button>
        </div>`;

      // ======== TAB: Printers (sub-tabs) ========
      html += `<div class="settings-tab-content ${_activeTab === 'printers' ? 'active' : ''}" id="tab-printers">`;
      {
        const ptabs = [
          { id: 'list', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', label: t('settings.settings_sub_printer_list') },
          { id: 'status', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', label: t('settings.settings_sub_printer_status') }
        ];
        html += '<div class="drying-sub-tabs">';
        for (const tab of ptabs) html += `<button class="drying-sub-tab${_printerSubTab === tab.id ? ' active' : ''}" data-printer-tab="${tab.id}" onclick="window._switchPrinterSubTab('${tab.id}')" style="display:flex;align-items:center;gap:4px">${tab.icon} ${tab.label}</button>`;
        html += '</div>';
        html += '<div id="printer-sub-content"></div>';
      }
      html += '</div>'; // end tab-printers

      // ======== TAB: General (sub-tabs) ========
      html += `<div class="settings-tab-content ${_activeTab === 'general' ? 'active' : ''}" id="tab-general">`;
      {
        const gtabs = [
          { id: 'preferences', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', label: t('settings.settings_sub_preferences') },
          { id: 'auth', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', label: t('settings.settings_sub_auth') },
          { id: 'obs', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', label: t('settings.settings_sub_obs') }
        ];
        html += '<div class="drying-sub-tabs">';
        for (const tab of gtabs) html += `<button class="drying-sub-tab${_generalSubTab === tab.id ? ' active' : ''}" data-general-tab="${tab.id}" onclick="window._switchGeneralSubTab('${tab.id}')" style="display:flex;align-items:center;gap:4px">${tab.icon} ${tab.label}</button>`;
        html += '</div>';
        html += '<div id="general-sub-content"></div>';
      }
      html += '</div>'; // end tab-general

      // ======== TAB: Appearance (sub-tabs) ========
      html += `<div class="settings-tab-content ${_activeTab === 'appearance' ? 'active' : ''}" id="tab-appearance">`;
      {
        const atabs = [
          { id: 'theme', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>', label: t('settings.settings_sub_theme') },
          { id: 'customize', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>', label: t('settings.settings_sub_customize') }
        ];
        html += '<div class="drying-sub-tabs">';
        for (const tab of atabs) html += `<button class="drying-sub-tab${_appearanceSubTab === tab.id ? ' active' : ''}" data-appearance-tab="${tab.id}" onclick="window._switchAppearanceSubTab('${tab.id}')" style="display:flex;align-items:center;gap:4px">${tab.icon} ${tab.label}</button>`;
        html += '</div>';
        html += '<div id="appearance-sub-content"></div>';
      }
      html += '</div>'; // end tab-appearance

      // ======== TAB: Notifications (sub-tabs) ========
      html += `<div class="settings-tab-content ${_activeTab === 'notifications' ? 'active' : ''}" id="tab-notifications">`;
      {
        const ntabs = [
          { id: 'channels', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>', label: t('settings.settings_sub_channels') },
          { id: 'log', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', label: t('settings.settings_sub_log') },
          { id: 'webhooks', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>', label: t('settings.settings_sub_webhooks') }
        ];
        html += '<div class="drying-sub-tabs">';
        for (const tab of ntabs) html += `<button class="drying-sub-tab${_notifSubTab === tab.id ? ' active' : ''}" data-notif-tab="${tab.id}" onclick="window._switchNotifSubTab('${tab.id}')" style="display:flex;align-items:center;gap:4px">${tab.icon} ${tab.label}</button>`;
        html += '</div>';
        html += '<div id="notif-sub-content"></div>';
      }
      html += '</div>'; // end tab-notifications

      // ======== TAB: System (sub-tabs) ========
      html += `<div class="settings-tab-content ${_activeTab === 'system' ? 'active' : ''}" id="tab-system">`;
      {
        const stabs = [
          { id: 'updates', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', label: t('settings.settings_sub_updates') },
          { id: 'security', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', label: t('settings.settings_sub_security'), admin: true },
          { id: 'printers', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', label: t('settings.settings_sub_printers') },
          { id: 'automation', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', label: t('settings.settings_sub_automation') },
          { id: 'energy', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', label: t('settings.settings_sub_energy') },
          { id: 'integrations', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>', label: t('settings.settings_sub_integrations') },
          { id: 'nodes', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>', label: t('settings.settings_sub_nodes') },
          { id: 'data', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>', label: t('settings.settings_sub_data') }
        ];
        html += '<div class="drying-sub-tabs">';
        for (const tab of stabs) {
          if (tab.admin && !(window._can && window._can('admin'))) continue;
          html += `<button class="drying-sub-tab${_systemSubTab === tab.id ? ' active' : ''}" data-system-tab="${tab.id}" onclick="window._switchSystemSubTab('${tab.id}')" style="display:flex;align-items:center;gap:4px">${tab.icon} ${tab.label}</button>`;
        }
        html += '</div>';
        html += '<div id="system-sub-content"></div>';
      }
      html += '</div>'; // end tab-system

      panel.innerHTML = html;

      // Post-render: lazy-load all sub-tabbed sections
      _renderPrinterSubContent(printers);
      _renderGeneralSubContent(printers);
      _renderAppearanceSubContent();
      _renderNotifSubContent();
      _renderSystemSubContent();
    } catch (e) {
      panel.innerHTML = `<p class="text-muted">${t('settings.load_failed')}</p>`;
    }
  }

  window.switchSettingsTab = function(tab) {
    _activeTab = tab;
    const slug = tab === 'printers' ? 'settings' : `settings/${tab}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    document.querySelectorAll('.settings-tab').forEach(el => {
      el.classList.toggle('active', el.textContent.trim() === document.querySelector(`.settings-tab[onclick*="'${tab}'"]`)?.textContent.trim());
    });
    document.querySelectorAll('.settings-tab-content').forEach(el => {
      const isTarget = el.id === 'tab-' + tab;
      el.classList.toggle('active', isTarget);
      if (isTarget) {
        el.classList.add('ix-tab-panel');
        el.addEventListener('animationend', () => el.classList.remove('ix-tab-panel'), { once: true });
      }
    });
    // Re-match tab buttons
    document.querySelectorAll('.settings-tab').forEach(el => {
      const match = el.getAttribute('onclick')?.match(/switchSettingsTab\('(\w+)'\)/);
      if (match) el.classList.toggle('active', match[1] === tab);
    });
  };

  // ═══ Printers sub-tabs ═══
  let _cachedPrinters = [];
  window._switchPrinterSubTab = function(tab) {
    _printerSubTab = tab;
    const slug = `settings/printers/${tab}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    document.querySelectorAll('[data-printer-tab]').forEach(b => b.classList.toggle('active', b.dataset.printerTab === tab));
    _renderPrinterSubContent(_cachedPrinters);
  };

  function _renderPrinterSubContent(printers) {
    if (printers && printers.length) _cachedPrinters = printers;
    const p = _cachedPrinters;
    const el = document.getElementById('printer-sub-content');
    if (!el) return;

    if (_printerSubTab === 'list') {
      let h = '';
      // Bambu Lab Cloud section
      h += `<div id="cloud-section" class="settings-card" style="margin-bottom:0.75rem"><div class="card-title" style="display:flex;align-items:center;gap:6px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg> ${t('settings.bambu_cloud')}</div><div id="cloud-content"><span class="text-muted" style="font-size:0.8rem">...</span></div></div>`;
      // Discovery + Add buttons
      h += `<div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap">
        <button class="form-btn" data-ripple onclick="discoverPrinters()" id="discover-btn" style="display:flex;align-items:center;gap:6px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          ${t('settings.discover_printers')}
        </button>
        <button class="form-btn" data-ripple onclick="showAddPrinterForm()" style="display:flex;align-items:center;gap:6px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ${t('settings.add_printer')}
        </button>
      </div>`;
      h += '<div id="discovery-results"></div>';
      h += '<div class="printer-list-grid">';
      for (const pr of p) {
        h += `<div class="printer-config-card"><div class="printer-config-header"><div><strong>${pr.name}</strong><div class="text-muted" style="font-size:0.75rem">${pr.model || ''} ${pr.ip && pr.serial && pr.accessCode ? '| ' + pr.ip + ' | ' + t('settings.auto_connect') : '| ' + t('settings.add_details')}</div></div><div class="printer-config-actions"><button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('settings.edit')}" onclick="editPrinter('${pr.id}')">${t('settings.edit')}</button><button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('settings.delete')}" onclick="removePrinter('${pr.id}')">${t('settings.delete')}</button></div></div></div>`;
      }
      h += '</div>';
      h += '<div id="printer-form-area"></div>';
      el.innerHTML = h;
      // Load cloud status async
      _loadCloudStatus();
    } else if (_printerSubTab === 'status') {
      el.innerHTML = `<div class="settings-card"><div class="card-title">${t('printer_info.title')}</div><div id="settings-printer-info"><span class="text-muted" style="font-size:0.8rem">${t('printer_info.waiting')}</span></div></div>`;
      const printerInfoEl = document.getElementById('settings-printer-info');
      if (printerInfoEl && typeof renderPrinterInfoSection === 'function') renderPrinterInfoSection(printerInfoEl);
    }
  }

  // ═══ Appearance sub-tabs ═══
  window._switchAppearanceSubTab = function(tab) {
    _appearanceSubTab = tab;
    const slug = `settings/appearance/${tab}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    document.querySelectorAll('[data-appearance-tab]').forEach(b => b.classList.toggle('active', b.dataset.appearanceTab === tab));
    _renderAppearanceSubContent();
  };

  function _renderAppearanceSubContent() {
    const el = document.getElementById('appearance-sub-content');
    if (!el) return;

    const cfg = window.theme ? window.theme.get() : { preset: 'light', accentColor: null, radius: 12 };
    const currentAccent = cfg.accentColor || (window.theme ? window.theme.getDefaultAccent() : '#00AE42');
    const currentRadius = cfg.radius ?? 12;

    if (_appearanceSubTab === 'theme') {
      let h = `<div class="settings-card"><div class="card-title">${t('settings.theme_title')}</div><div class="theme-preset-grid">`;
      h += `<button class="theme-preset-card ${cfg.preset === 'light' ? 'active' : ''}" onclick="setThemePreset('light')"><div class="theme-preset-preview theme-preview-light"><div class="tpp-sidebar"></div><div class="tpp-main"><div class="tpp-card"></div><div class="tpp-card"></div></div></div><span>${t('settings.theme_light')}</span></button>`;
      h += `<button class="theme-preset-card ${cfg.preset === 'dark' ? 'active' : ''}" onclick="setThemePreset('dark')"><div class="theme-preset-preview theme-preview-dark"><div class="tpp-sidebar"></div><div class="tpp-main"><div class="tpp-card"></div><div class="tpp-card"></div></div></div><span>${t('settings.theme_dark')}</span></button>`;
      h += `<button class="theme-preset-card ${cfg.preset === 'auto' ? 'active' : ''}" onclick="setThemePreset('auto')"><div class="theme-preset-preview theme-preview-auto"><div class="tpp-half-light"></div><div class="tpp-half-dark"></div></div><span>${t('settings.theme_auto')}</span></button>`;
      h += '</div></div>';
      h += `<div class="mt-md"><button class="form-btn form-btn-secondary" data-ripple onclick="resetTheme()">${t('settings.theme_reset')}</button></div>`;
      el.innerHTML = h;
    } else if (_appearanceSubTab === 'customize') {
      let h = `<div class="settings-card"><div class="card-title">${t('settings.theme_accent')}</div><div class="theme-color-row">`;
      for (const s of (window._ACCENT_SWATCHES || [])) {
        const isActive = currentAccent.toLowerCase() === s.color.toLowerCase();
        h += `<button class="theme-color-swatch ${isActive ? 'active' : ''}" style="background:${s.color}" onclick="setThemeAccent('${s.color}')" title="${s.label}"></button>`;
      }
      h += `<label class="theme-color-custom" title="${t('settings.theme_accent')}"><input type="color" id="theme-accent-picker" value="${currentAccent}" onchange="setThemeAccent(this.value)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></label></div>`;
      if (cfg.accentColor) h += `<button class="form-btn form-btn-sm form-btn-secondary mt-sm" data-ripple onclick="setThemeAccent(null)">${t('settings.theme_accent_reset')}</button>`;
      h += '</div>';
      h += `<div class="settings-card mt-md"><div class="card-title">${t('settings.theme_radius')}</div><div class="theme-radius-row"><span class="text-muted" style="font-size:0.8rem">${t('settings.theme_radius_sharp')}</span><input type="range" class="theme-radius-slider" id="theme-radius-slider" min="0" max="20" step="1" value="${currentRadius}" oninput="setThemeRadius(this.value)"><span class="text-muted" style="font-size:0.8rem">${t('settings.theme_radius_round')}</span><span class="theme-radius-value" id="theme-radius-value">${currentRadius}px</span></div></div>`;
      h += '<div class="settings-card mt-md"><div class="settings-row">';
      h += '<div class="settings-label">' + (t('settings.compact_mode') || 'Compact Mode') + '</div>';
      h += '<div class="settings-control">';
      h += '<label class="toggle-switch"><input type="checkbox" id="compact-mode-toggle" ' + (document.body.classList.contains('compact-mode') ? 'checked' : '') + ' onchange="toggleCompactMode()"><span class="toggle-slider"></span></label>';
      h += '<span style="font-size:0.75rem;color:var(--text-muted);margin-left:8px">' + (t('settings.compact_mode_desc') || 'Denser layout with smaller spacing') + '</span>';
      h += '</div></div></div>';

      // Dashboard columns selector
      const curCols = typeof getDashboardColumns === 'function' ? getDashboardColumns() : 3;
      h += '<div class="settings-card mt-md">';
      h += '<div class="card-title">' + (t('settings.dashboard_columns') || 'Dashboard Columns') + '</div>';
      h += '<div class="dashboard-cols-selector">';
      h += '<button class="dashboard-cols-btn' + (curCols === 2 ? ' active' : '') + '" onclick="setDashboardColumns(2);document.querySelectorAll(\'.dashboard-cols-btn\').forEach(b=>b.classList.remove(\'active\'));this.classList.add(\'active\')">';
      h += '<svg width="28" height="20" viewBox="0 0 28 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="12" height="18" rx="2"/><rect x="15" y="1" width="12" height="18" rx="2"/></svg>';
      h += '<span>2 ' + (t('settings.columns') || 'kolonner') + '</span></button>';
      h += '<button class="dashboard-cols-btn' + (curCols === 3 ? ' active' : '') + '" onclick="setDashboardColumns(3);document.querySelectorAll(\'.dashboard-cols-btn\').forEach(b=>b.classList.remove(\'active\'));this.classList.add(\'active\')">';
      h += '<svg width="28" height="20" viewBox="0 0 28 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="7.3" height="18" rx="1.5"/><rect x="10.3" y="1" width="7.3" height="18" rx="1.5"/><rect x="19.7" y="1" width="7.3" height="18" rx="1.5"/></svg>';
      h += '<span>3 ' + (t('settings.columns') || 'kolonner') + '</span></button>';
      h += '</div></div>';

      el.innerHTML = h;
    }
  }

  // ═══ General sub-tabs ═══
  window._switchGeneralSubTab = function(tab) {
    _generalSubTab = tab;
    const slug = `settings/general/${tab}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    document.querySelectorAll('[data-general-tab]').forEach(b => b.classList.toggle('active', b.dataset.generalTab === tab));
    _renderGeneralSubContent(_cachedPrinters);
  };

  function _renderGeneralSubContent(printers) {
    if (printers && printers.length) _cachedPrinters = printers;
    const p = _cachedPrinters;
    const el = document.getElementById('general-sub-content');
    if (!el) return;

    if (_generalSubTab === 'preferences') {
      const locales = window.i18n.getSupportedLocales();
      const names = window.i18n.getLocaleNames();
      const current = window.i18n.getLocale();
      let opts = '';
      for (const loc of locales) opts += `<option value="${loc}" ${loc === current ? 'selected' : ''}>${names[loc]}</option>`;
      let h = '<div class="settings-grid"><div>';
      h += `<div class="settings-card"><div class="card-title">${t('settings.language')}</div><select class="form-input" id="lang-select" onchange="changeLanguage(this.value)">${opts}</select></div>`;
      h += `<div class="settings-card mt-md"><div class="card-title">${t('settings.notifications_title')}</div><label class="settings-checkbox"><input type="checkbox" id="notify-toggle" ${typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'checked' : ''} onchange="toggleNotificationsPerm(this.checked)"><span>${t('settings.notifications_browser')}</span></label></div>`;
      h += `<div class="settings-card mt-md"><div class="card-title">${t('settings.server_title')}</div><div class="text-muted" style="font-size:0.8rem">Port: ${location.port || '3000'} | ${t('settings.printers_title')}: ${p.length}</div></div>`;
      h += '<div class="settings-card mt-md"><div class="settings-row">';
      h += '<div class="settings-label">' + (t('settings.onboarding_tour') || 'Guided Tour') + '</div>';
      h += '<div class="settings-control">';
      h += '<button class="form-btn form-btn-secondary" onclick="localStorage.removeItem(\'onboarding-completed\'); startTour(); document.querySelector(\'.ix-modal-overlay\')?.remove();">' + (t('settings.restart_tour') || 'Restart Tour') + '</button>';
      h += '<span style="font-size:0.75rem;color:var(--text-muted);margin-left:8px">' + (t('settings.restart_tour_desc') || 'Show the guided introduction again') + '</span>';
      h += '</div></div></div>';
      // Notification sounds toggle
      h += '<div class="settings-card mt-md"><div class="settings-row">';
      h += '<div class="settings-label">' + (t('settings.notification_sounds') || 'Notification Sounds') + '</div>';
      h += '<div class="settings-control">';
      h += '<label class="settings-checkbox"><input type="checkbox" id="sound-toggle" ' + (typeof notificationSound !== 'undefined' && notificationSound.isEnabled() ? 'checked' : '') + ' onchange="if(typeof notificationSound!==\'undefined\'){notificationSound.setEnabled(this.checked);if(this.checked)notificationSound.info();}"><span>' + (t('settings.notification_sounds_desc') || 'Play sounds for print events') + '</span></label>';
      h += '</div></div></div>';
      // Auto-refresh setting
      var _arVal = parseInt(localStorage.getItem('autoRefreshMs')) || 0;
      h += '<div class="settings-card mt-md"><div class="settings-row">';
      h += '<div class="settings-label">Auto-refresh</div>';
      h += '<div class="settings-control">';
      h += '<select class="form-input" id="auto-refresh-select" onchange="if(typeof window.setAutoRefresh===\'function\')window.setAutoRefresh(this.value)">';
      h += '<option value="0"' + (_arVal === 0 ? ' selected' : '') + '>Av</option>';
      h += '<option value="10000"' + (_arVal === 10000 ? ' selected' : '') + '>10s</option>';
      h += '<option value="30000"' + (_arVal === 30000 ? ' selected' : '') + '>30s</option>';
      h += '<option value="60000"' + (_arVal === 60000 ? ' selected' : '') + '>60s</option>';
      h += '<option value="300000"' + (_arVal === 300000 ? ' selected' : '') + '>5min</option>';
      h += '</select>';
      h += '<span style="font-size:0.75rem;color:var(--text-muted);margin-left:8px">Automatically reload panel content</span>';
      h += '</div></div></div>';
      h += '</div></div>';
      el.innerHTML = h;

    } else if (_generalSubTab === 'auth') {
      el.innerHTML = '<div id="auth-settings-section"><div class="settings-card"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div></div>';
      loadAuthSettings();

    } else if (_generalSubTab === 'obs') {
      const printerOpts = (p || []).map(pr => `<option value="${pr.id}">${pr.name || pr.id}</option>`).join('');
      let h = '<div class="settings-grid">';

      // URL Generator card
      h += `<div class="settings-card" style="grid-column:1/-1">
        <div class="card-title">${t('settings.obs_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:12px">${t('settings.obs_description')}</p>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
          <div>
            <label class="form-label">Printer</label>
            <select id="obs-cfg-printer" class="form-input" onchange="window._obsUpdateUrl()">
              <option value="">Alle / første printer</option>
              ${printerOpts}
            </select>
          </div>
          <div>
            <label class="form-label">Bakgrunn</label>
            <select id="obs-cfg-bg" class="form-input" onchange="window._obsUpdateUrl()">
              <option value="transparent">Transparent (anbefalt)</option>
              <option value="">Standard (mørk)</option>
              <option value="custom">Egendefinert farge</option>
            </select>
            <input type="color" id="obs-cfg-bg-color" class="form-input" value="#000000" style="display:none;margin-top:4px;height:32px;padding:2px" onchange="window._obsUpdateUrl()">
          </div>
          <div>
            <label class="form-label">Posisjon</label>
            <select id="obs-cfg-pos" class="form-input" onchange="window._obsUpdateUrl()">
              <option value="right">Høyre side</option>
              <option value="left">Venstre side</option>
            </select>
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:16px">
          <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer">
            <input type="checkbox" id="obs-cfg-compact" onchange="window._obsUpdateUrl()"> Kompakt modus
          </label>
          <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer">
            <input type="checkbox" id="obs-cfg-hide-idle" onchange="window._obsUpdateUrl()"> Skjul ved inaktiv
          </label>
        </div>

        <label class="form-label">Generert URL</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="form-input" id="obs-url-display" readonly style="flex:1;font-size:0.8rem;font-family:monospace">
          <button class="form-btn form-btn-sm form-btn-primary" data-ripple onclick="window.copyObsUrl()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            ${t('camera.copy')}
          </button>
        </div>
      </div>`;

      // OBS Setup Guide card
      h += `<div class="settings-card">
        <div class="card-title">OBS Oppsett</div>
        <ol style="font-size:0.85rem;line-height:1.8;padding-left:20px;color:var(--text-secondary)">
          <li>Kopier URLen ovenfor</li>
          <li>I OBS: <strong>Kilder → + → Nettleser</strong></li>
          <li>Lim inn URL i feltet</li>
          <li>Sett bredde: <code style="background:var(--bg-tertiary);padding:1px 5px;border-radius:4px">320</code> høyde: <code style="background:var(--bg-tertiary);padding:1px 5px;border-radius:4px">900</code> (sidepanel)</li>
          <li>Huk av <strong>Shutdown source when not visible</strong></li>
          <li>Klikk OK</li>
        </ol>
        <div style="margin-top:12px;padding:10px;border-radius:8px;background:color-mix(in srgb, var(--accent-cyan) 8%, transparent);border:1px solid color-mix(in srgb, var(--accent-cyan) 20%, transparent);font-size:0.8rem;color:var(--text-secondary)">
          <strong style="color:var(--accent-cyan)">Tips:</strong> Bruk «Transparent» bakgrunn for å legge sidepanelet over kamerakilden. Panelet viser print-status med progress-ring, temperaturer, AMS-spoler med SVG-visualisering og print-stage.
        </div>
      </div>`;

      // Direct URL cards
      h += `<div class="settings-card">
        <div class="card-title">Direkte kamera-URLer</div>
        <p class="text-muted" style="font-size:0.8rem;margin-bottom:10px">Bruk disse for Home Assistant, VLC, eller andre integrasjoner.</p>
        <div style="display:flex;flex-direction:column;gap:8px">`;
      for (const pr of (p || [])) {
        h += `<div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:0.8rem;font-weight:600;min-width:80px">${_esc(pr.name || pr.id)}</span>
          <code style="font-size:0.72rem;background:var(--bg-tertiary);padding:3px 8px;border-radius:4px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${location.origin}/api/printers/${encodeURIComponent(pr.id)}/stream.mjpeg</code>
          <button class="form-btn form-btn-sm" data-ripple style="font-size:0.65rem;padding:2px 6px" onclick="navigator.clipboard.writeText('${location.origin}/api/printers/${encodeURIComponent(pr.id)}/stream.mjpeg');showToast('Kopiert!','success')">Kopier</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:0.8rem;min-width:80px"></span>
          <code style="font-size:0.72rem;background:var(--bg-tertiary);padding:3px 8px;border-radius:4px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${location.origin}/api/printers/${encodeURIComponent(pr.id)}/frame.jpeg</code>
          <button class="form-btn form-btn-sm" data-ripple style="font-size:0.65rem;padding:2px 6px" onclick="navigator.clipboard.writeText('${location.origin}/api/printers/${encodeURIComponent(pr.id)}/frame.jpeg');showToast('Kopiert!','success')">Kopier</button>
        </div>`;
      }
      h += `</div>
      </div>`;

      // Live Preview card
      h += `<div class="settings-card">
        <div class="card-title">Forhåndsvisning</div>
        <div style="position:relative;border-radius:8px;overflow:hidden;background:#000;aspect-ratio:16/9">
          <iframe id="obs-preview-frame" style="width:100%;height:100%;border:none;pointer-events:none" src=""></iframe>
        </div>
        <button class="form-btn form-btn-sm form-btn-secondary mt-sm" data-ripple onclick="window._obsRefreshPreview()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Oppdater forhåndsvisning
        </button>
      </div>`;

      h += '</div>';
      el.innerHTML = h;
      window._obsUpdateUrl();
      window._obsRefreshPreview();

      // Show/hide custom color picker
      document.getElementById('obs-cfg-bg')?.addEventListener('change', function() {
        const colorPicker = document.getElementById('obs-cfg-bg-color');
        if (colorPicker) colorPicker.style.display = this.value === 'custom' ? '' : 'none';
      });
    }
  }

  // ═══ Notifications sub-tabs ═══
  window._switchNotifSubTab = function(tab) {
    _notifSubTab = tab;
    const slug = `settings/notifications/${tab}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    document.querySelectorAll('[data-notif-tab]').forEach(b => b.classList.toggle('active', b.dataset.notifTab === tab));
    _renderNotifSubContent();
  };

  function _renderNotifSubContent() {
    const el = document.getElementById('notif-sub-content');
    if (!el) return;
    if (_notifSubTab === 'channels') {
      el.innerHTML = `<div id="notif-server-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div>`;
      loadNotifSettings();
    } else if (_notifSubTab === 'log') {
      el.innerHTML = `<div class="settings-card"><div class="card-title">${t('settings.notif_log_title')}</div><div id="notif-log-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div></div>`;
      loadNotifLog();
    } else if (_notifSubTab === 'webhooks') {
      el.innerHTML = `<div class="settings-card"><div class="card-title">${t('settings.webhooks_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.webhooks_desc')}</p><div id="webhooks-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div><button class="form-btn form-btn-primary mt-sm" data-ripple onclick="showWebhookEditor()">${t('settings.webhook_add')}</button></div>`;
      loadWebhooks();
    }
  }

  // ═══ System sub-tabs ═══
  window._switchSystemSubTab = function(tab) {
    _systemSubTab = tab;
    const slug = `settings/system/${tab}`;
    if (location.hash !== '#' + slug) history.replaceState(null, '', '#' + slug);
    document.querySelectorAll('[data-system-tab]').forEach(b => b.classList.toggle('active', b.dataset.systemTab === tab));
    _renderSystemSubContent();
  };

  function _renderSystemSubContent() {
    const el = document.getElementById('system-sub-content');
    if (!el) return;

    if (_systemSubTab === 'updates') {
      let h = '<div class="settings-grid">';
      // Updates card
      h += `<div class="settings-card"><div class="card-title">${t('update.title')}</div><div id="update-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div></div>`;
      // System info card
      h += `<div class="settings-card"><div class="card-title" style="display:flex;align-items:center;gap:6px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> ${t('settings.system_info_title')}</div><div id="system-info-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div></div>`;
      // Scheduled tasks card
      h += `<div class="settings-card"><div class="card-title" style="display:flex;align-items:center;gap:6px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${t('settings.scheduled_tasks_title')}</div><div id="scheduled-tasks-section"></div></div>`;
      // Backups card (full width)
      h += `<div class="settings-card" style="grid-column:1/-1"><div class="card-title" style="display:flex;align-items:center;justify-content:space-between"><span style="display:flex;align-items:center;gap:6px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> ${t('settings.backup_title')}</span><div style="display:flex;gap:6px"><label class="form-btn form-btn-sm" data-ripple style="cursor:pointer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> ${t('settings.backup_upload')}<input type="file" accept=".db" style="display:none" onchange="window._uploadBackup(this)"></label><button class="form-btn form-btn-primary form-btn-sm" data-ripple id="backup-create-btn" onclick="window._createBackup()">${t('settings.backup_create')}</button></div></div><p class="text-muted" style="font-size:0.8rem;margin:4px 0 8px">${t('settings.backup_desc')}</p><div id="backup-list-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div></div>`;
      // Demo data
      h += '<div id="demo-data-section" style="display:none"></div>';
      h += '</div>';
      el.innerHTML = h;
      const updateSection = document.getElementById('update-section');
      if (updateSection && typeof renderUpdateSection === 'function') renderUpdateSection(updateSection);
      checkDemoData();
      _loadSystemInfo();
      _loadScheduledTasks();
      _loadBackupList();

    } else if (_systemSubTab === 'security') {
      let h = '<div class="settings-grid">';
      h += `<div class="settings-card"><div class="card-title">${t('settings.users_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.users_desc')}</p><div id="users-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div><button class="form-btn form-btn-primary mt-sm" data-ripple onclick="showUserEditor()">${t('settings.user_add')}</button></div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.api_keys_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.api_keys_desc')}</p><div id="api-keys-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div><button class="form-btn form-btn-primary mt-sm" data-ripple onclick="showApiKeyEditor()">${t('settings.api_key_add')}</button></div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.push_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.push_desc')}</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap"><button class="form-btn form-btn-primary" data-ripple onclick="subscribePush()">${t('settings.push_enable')}</button><button class="form-btn" data-ripple onclick="unsubscribePush()">${t('settings.push_disable')}</button></div></div>`;
      h += '</div>';
      el.innerHTML = h;
      if (window._can && window._can('admin')) { loadUsers(); loadApiKeys(); }

    } else if (_systemSubTab === 'printers') {
      let h = '<div class="settings-grid">';
      h += `<div class="settings-card"><div class="card-title">${t('settings.printer_groups_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.printer_groups_desc')}</p><div id="printer-groups-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div><button class="form-btn form-btn-primary mt-sm" data-ripple onclick="showPrinterGroupEditor()">${t('settings.printer_groups_add')}</button></div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.hub_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.hub_desc')}</p><div id="hub-settings-section"><label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem"><input type="checkbox" id="hub-mode" onchange="toggleHubMode(this.checked)"><span>${t('settings.hub_enable')}</span></label><label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem"><input type="checkbox" id="kiosk-mode" onchange="toggleKioskMode(this.checked)"><span>${t('settings.kiosk_enable')}</span></label></div></div>`;
      h += '</div>';
      el.innerHTML = h;
      loadPrinterGroupsSettings();
      loadHubSettings();

    } else if (_systemSubTab === 'automation') {
      let h = '<div class="settings-grid">';
      h += `<div class="settings-card"><div class="card-title">${t('settings.ai_detection_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.ai_detection_desc')}</p><div id="ai-detection-section"><label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem"><input type="checkbox" id="ai-detection-enabled" onchange="toggleAiDetection(this.checked)"><span>${t('settings.ai_detection_enable')}</span></label><div style="margin-top:0.5rem;display:flex;align-items:center;gap:0.5rem"><label style="font-size:0.85rem">${t('settings.ai_detection_sensitivity')}</label><select class="form-input" id="ai-detection-sensitivity" onchange="updateAiSensitivity(this.value)" style="width:auto"><option value="low">${t('settings.sensitivity_low')}</option><option value="medium">${t('settings.sensitivity_medium')}</option><option value="high">${t('settings.sensitivity_high')}</option></select></div><div id="ai-detection-list" style="margin-top:0.5rem"></div></div></div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.timelapse_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.timelapse_desc')}</p><div id="timelapse-settings-section"><label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem"><input type="checkbox" id="timelapse-enabled" onchange="toggleTimelapse(this.checked)"><span>${t('settings.timelapse_enable')}</span></label><div id="timelapse-list" style="margin-top:0.5rem"></div></div></div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.milestone_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.milestone_desc')}</p><label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem"><input type="checkbox" id="milestones-enabled" onchange="window._toggleMilestones(this.checked)"><span>${t('settings.milestone_enable')}</span></label></div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.report_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.report_desc')}</p>
        <label class="form-label">${t('settings.report_frequency')}</label>
        <select id="report-frequency" class="form-input">
          <option value="none">${t('settings.report_none')}</option>
          <option value="weekly">${t('settings.report_weekly')}</option>
          <option value="monthly">${t('settings.report_monthly')}</option>
        </select>
        <label class="form-label mt-sm">${t('settings.report_email')}</label>
        <input type="email" id="report-email" class="form-input" placeholder="user@example.com">
        <p class="text-muted" style="font-size:0.75rem;margin-top:4px">${t('settings.report_email_hint')}</p>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="form-btn form-btn-primary" data-ripple onclick="window._saveReportSettings()">${t('common.save')}</button>
          <button class="form-btn form-btn-sm form-btn-secondary" data-ripple onclick="window._previewReport()">${t('settings.report_preview')}</button>
          <button class="form-btn form-btn-sm form-btn-secondary" data-ripple onclick="window._sendTestReport()">${t('settings.report_send_test')}</button>
        </div>
      </div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.public_status_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.public_status_desc')}</p>
        <label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem"><input type="checkbox" id="public-status-enabled" onchange="window._togglePublicStatus(this.checked)"><span>${t('settings.public_status_enable')}</span></label>
        <p class="text-muted" style="font-size:0.75rem;margin-top:6px">${t('settings.public_status_url')}: <a href="/status.html" target="_blank" style="color:var(--accent-blue)">/status.html</a></p>
      </div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.ha_mqtt_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.ha_mqtt_desc')}</p>
        <label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:8px"><input type="checkbox" id="ha-mqtt-enabled" onchange="window._toggleHaMqtt(this.checked)"><span>${t('settings.ha_mqtt_enable')}</span></label>
        <div id="ha-mqtt-fields" style="display:none">
          <label class="form-label">${t('settings.ha_mqtt_broker')}</label>
          <input type="text" id="ha-mqtt-broker" class="form-input" placeholder="mqtt://homeassistant.local:1883">
          <label class="form-label mt-sm">${t('settings.ha_mqtt_username')}</label>
          <input type="text" id="ha-mqtt-username" class="form-input" placeholder="${t('settings.ha_mqtt_optional')}">
          <label class="form-label mt-sm">${t('settings.ha_mqtt_password')}</label>
          <input type="password" id="ha-mqtt-password" class="form-input" placeholder="${t('settings.ha_mqtt_optional')}">
          <div style="display:flex;gap:6px;margin-top:8px;align-items:center">
            <button class="form-btn form-btn-primary" data-ripple onclick="window._saveHaMqttSettings()">${t('common.save')}</button>
            <span id="ha-mqtt-status" style="font-size:0.78rem;color:var(--text-muted)"></span>
          </div>
        </div>
      </div>`;
      h += '</div>';
      el.innerHTML = h;
      loadAiDetectionSettings();
      loadTimelapseSettings();
      _loadMilestoneSettings();
      _loadReportSettings();
      _loadPublicStatusSettings();
      _loadHaMqttSettings();

    } else if (_systemSubTab === 'energy') {
      let h = '<div class="settings-grid">';
      // Provider selection
      h += `<div class="settings-card"><div class="card-title">${t('settings.energy_provider_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.energy_provider_desc')}</p>
        <select id="energy-provider" class="form-input" onchange="window._energyProviderChanged()">
          <option value="none">${t('settings.energy_none')}</option>
          <option value="tibber">Tibber</option>
          <option value="nordpool">Nordpool (${t('settings.energy_no_key')})</option>
        </select>
        <div id="energy-tibber-config" style="display:none;margin-top:8px">
          <label class="form-label">Tibber API Token</label>
          <input type="password" id="energy-tibber-token" class="form-input" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
          <p class="text-muted" style="font-size:0.75rem;margin-top:4px">${t('settings.energy_tibber_hint')}</p>
        </div>
        <div id="energy-nordpool-config" style="display:none;margin-top:8px">
          <label class="form-label">${t('settings.energy_zone')}</label>
          <select id="energy-nordpool-zone" class="form-input">
            <option value="NO1">NO1 — Øst-Norge (Oslo)</option>
            <option value="NO2">NO2 — Sør-Norge (Kristiansand)</option>
            <option value="NO3">NO3 — Midt-Norge (Trondheim)</option>
            <option value="NO4">NO4 — Nord-Norge (Tromsø)</option>
            <option value="NO5">NO5 — Vest-Norge (Bergen)</option>
            <option value="SE1">SE1 — Nord-Sverige</option>
            <option value="SE2">SE2 — Midt-Sverige</option>
            <option value="SE3">SE3 — Sør-Sverige (Stockholm)</option>
            <option value="SE4">SE4 — Malmö</option>
            <option value="DK1">DK1 — Vest-Danmark</option>
            <option value="DK2">DK2 — Øst-Danmark</option>
            <option value="FI">FI — Finland</option>
          </select>
        </div>
        <button class="form-btn form-btn-primary mt-sm" data-ripple onclick="window._saveEnergySettings()">${t('common.save')}</button>
      </div>`;
      // Live prices
      h += `<div class="settings-card"><div class="card-title">${t('settings.energy_prices_title')}</div>
        <div id="energy-live-prices"><div class="text-muted" style="font-size:0.8rem">${t('settings.energy_loading')}</div></div>
        <button class="form-btn form-btn-sm form-btn-secondary mt-sm" data-ripple onclick="window._refreshEnergyPrices()">${t('settings.energy_refresh')}</button>
      </div>`;
      // Smart scheduling info
      h += `<div class="settings-card" style="grid-column:1/-1"><div class="card-title">${t('settings.energy_smart_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.energy_smart_desc')}</p>
        <div id="energy-cheapest-window"></div>
      </div>`;

      // Power Monitor (Shelly/Tasmota)
      h += `<div class="settings-card"><div class="card-title">${t('settings.power_plug_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.power_plug_desc')}</p>
        <label class="form-label">${t('settings.power_plug_type')}</label>
        <select id="power-plug-type" class="form-input" onchange="window._powerPlugTypeChanged()">
          <option value="none">${t('settings.power_none')}</option>
          <option value="shelly_gen1">Shelly Gen1 (Plug S, 1, 1PM)</option>
          <option value="shelly_gen2">Shelly Gen2 (Plus Plug S, Pro)</option>
          <option value="shelly_gen3">Shelly Gen3 (Mini PM, 1 Mini)</option>
          <option value="tasmota">Tasmota</option>
        </select>
        <div id="power-plug-ip-config" style="display:none;margin-top:8px">
          <label class="form-label">${t('settings.power_plug_ip')}</label>
          <input type="text" id="power-plug-ip" class="form-input" placeholder="192.168.1.100">
          <p class="text-muted" style="font-size:0.75rem;margin-top:4px">${t('settings.power_plug_ip_hint')}</p>
        </div>
        <button class="form-btn form-btn-primary mt-sm" data-ripple onclick="window._savePowerSettings()">${t('common.save')}</button>
        <button class="form-btn form-btn-sm form-btn-secondary mt-sm" id="power-test-btn" style="display:none;margin-left:6px" data-ripple onclick="window._testPowerPlug()">${t('settings.power_test')}</button>
      </div>`;

      // Live power reading
      h += `<div class="settings-card"><div class="card-title">${t('settings.power_live_title')}</div>
        <div id="power-live-reading"><div class="text-muted" style="font-size:0.8rem">${t('settings.power_no_data')}</div></div>
        <div id="power-session-info" style="margin-top:8px"></div>
      </div>`;

      h += '</div>';
      el.innerHTML = h;
      _loadEnergySettings();
      _loadPowerSettings();

    } else if (_systemSubTab === 'integrations') {
      let h = '<div class="settings-grid">';
      h += `<div class="settings-card" id="ecom-premium-card"><div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem"><span class="premium-badge" id="ecom-premium-badge">${t('settings.ecom_premium')}</span><div class="card-title">${t('settings.ecom_title')}</div></div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.ecom_desc')}</p><div id="ecom-license-area"><div class="text-muted" style="font-size:0.8rem">${t('settings.ecom_license_checking')}</div></div><div id="ecom-section" style="display:none"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div><button class="form-btn form-btn-primary mt-sm" id="ecom-add-btn" style="display:none" data-ripple onclick="showEcomEditor()">${t('settings.ecom_add')}</button></div>`;
      h += `<div class="settings-card" id="orders-premium-card"><div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem"><span class="premium-badge" id="orders-premium-badge">${t('settings.ecom_premium')}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg><div class="card-title">${t('orders.title')}</div></div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.orders_desc') || 'Ordrebehandling, kanban-tavle, fakturering og prosjektstyring.'}</p><div id="orders-license-area"><div class="text-muted" style="font-size:0.8rem">${t('settings.ecom_license_checking')}</div></div><button class="form-btn form-btn-primary mt-sm" id="orders-open-btn" style="display:none" data-ripple onclick="openPanel('orders')">${t('orders.title')} \u2192</button></div>`;
      h += '</div>';
      el.innerHTML = h;
      loadEcomLicenseStatus();
      _loadOrdersLicenseStatus();

    } else if (_systemSubTab === 'nodes') {
      let h = '<div class="settings-grid">';
      h += `<div class="settings-card"><div class="card-title">${t('settings.nodes_title')}</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.nodes_desc')}</p>
        <div id="remote-nodes-list"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div>
        <button class="form-btn form-btn-primary mt-sm" data-ripple onclick="window._showAddNodeDialog()">${t('settings.nodes_add')}</button>
      </div>`;
      h += '</div>';
      el.innerHTML = h;
      _loadRemoteNodes();

    } else if (_systemSubTab === 'data') {
      let h = '<div class="settings-grid">';
      h += `<div class="settings-card"><div class="card-title">${t('settings.custom_fields_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.custom_fields_desc')}</p><div id="custom-fields-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div><button class="form-btn form-btn-primary mt-sm" data-ripple onclick="showCustomFieldEditor()">${t('settings.custom_fields_add')}</button></div>`;
      h += `<div class="settings-card"><div class="card-title">${t('settings.brand_defaults_title')}</div><p class="text-muted" style="font-size:0.85rem;margin-bottom:0.5rem">${t('settings.brand_defaults_desc')}</p><div id="brand-defaults-section"><div class="text-muted" style="font-size:0.8rem">Loading...</div></div><button class="form-btn form-btn-primary mt-sm" data-ripple onclick="showBrandDefaultEditor()">${t('settings.brand_defaults_add')}</button></div>`;
      h += `<div class="settings-card" style="cursor:pointer" onclick="openPanel('learning')"><div class="card-title">${t('settings.courses_title')}</div><p class="text-muted" style="font-size:0.85rem">${t('settings.courses_desc')}</p><button class="form-btn form-btn-sm mt-sm" data-ripple onclick="openPanel('learning')">${t('learning.go_to')} \u2192</button></div>`;
      // Export & Import card
      h += `<div class="settings-card">
        <div class="card-title">Eksporter & Importer</div>
        <p class="text-muted" style="font-size:0.85rem;margin-bottom:0.75rem">Eksporter alle innstillinger som JSON-fil, eller importer fra en tidligere eksport.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="form-btn form-btn-primary" data-ripple onclick="window._exportDashboardSettings()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Eksporter innstillinger
          </button>
          <button class="form-btn form-btn-sm" data-ripple onclick="window._importDashboardSettings()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Importer innstillinger
          </button>
        </div>
        <div id="settings-import-status" style="margin-top:8px"></div>
      </div>`;
      h += '</div>';
      el.innerHTML = h;
      loadCustomFieldsSettings();
      loadBrandDefaultsSettings();
    }
  }

  // ═══ System Info, Backups, Scheduled Tasks ═══

  function _fmtUptime(s) {
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    let r = '';
    if (d) r += d + 'd ';
    if (h) r += h + 'h ';
    r += m + 'm';
    return r;
  }

  function _fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  async function _loadSystemInfo() {
    const el = document.getElementById('system-info-section');
    if (!el) return;
    try {
      const res = await fetch('/api/system/info');
      const info = await res.json();
      const rows = [
        [t('settings.system_uptime'), _fmtUptime(info.uptime_seconds)],
        [t('settings.system_node'), info.node_version],
        [t('settings.system_platform'), info.platform],
        [t('settings.system_db_version'), 'v' + info.db_version],
        [t('settings.system_db_size'), _fmtBytes(info.db_size)],
        [t('settings.system_printers'), info.printer_count],
        ['PID', info.pid],
        ['Memory', info.memory_mb + ' MB'],
      ];
      el.innerHTML = '<div class="stats-detail-list">' + rows.map(([k, v]) =>
        `<div class="stats-detail-row"><span class="stats-detail-label">${k}</span><span class="stats-detail-value">${v}</span></div>`
      ).join('') + '</div>';
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  function _loadScheduledTasks() {
    const el = document.getElementById('scheduled-tasks-section');
    if (!el) return;
    const tasks = [
      { name: t('settings.task_nightly_backup'), desc: t('settings.task_nightly_backup_desc'), icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>', active: true },
      { name: t('settings.task_auto_trash'), desc: t('settings.task_auto_trash_desc'), icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>', active: true },
    ];
    el.innerHTML = tasks.map(task => `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)">
      <div style="display:flex;align-items:center;gap:8px">${task.icon}<div><div style="font-size:0.85rem;font-weight:500">${task.name}</div><div class="text-muted" style="font-size:0.75rem">${task.desc}</div></div></div>
      <span style="font-size:0.75rem;padding:2px 8px;border-radius:10px;background:${task.active ? 'rgba(0,230,118,0.15);color:var(--accent-green)' : 'rgba(255,82,82,0.15);color:var(--accent-red)'}">${task.active ? t('settings.task_status_active') : t('settings.task_status_disabled')}</span>
    </div>`).join('');
  }

  async function _loadBackupList() {
    const el = document.getElementById('backup-list-section');
    if (!el) return;
    try {
      const res = await fetch('/api/backup/list');
      const backups = await res.json();
      if (!backups.length) { el.innerHTML = `<p class="text-muted" style="font-size:0.8rem">${t('settings.backup_empty')}</p>`; return; }
      let h = '<div style="display:flex;flex-direction:column;gap:4px">';
      for (const b of backups) {
        const date = new Date(b.created_at).toLocaleString();
        const size = _fmtBytes(b.size);
        const label = b.filename.includes('-nightly-') ? 'nightly' : b.filename.includes('-manual-') ? 'manual' : 'auto';
        const badgeColor = label === 'nightly' ? 'var(--accent-blue)' : 'var(--accent-green)';
        h += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--bg-secondary);border-radius:6px;gap:8px">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
            <span style="font-size:0.65rem;padding:1px 6px;border-radius:8px;background:${badgeColor};color:#fff;text-transform:uppercase;flex-shrink:0">${label}</span>
            <span style="font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${date}</span>
            <span class="text-muted" style="font-size:0.75rem;flex-shrink:0">${size}</span>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0">
            <button class="form-btn form-btn-sm" style="font-size:0.75rem;padding:3px 8px;color:var(--accent-green)" onclick="window._restoreBackup('${b.filename}')" title="${t('settings.backup_restore')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-12.36L1 10"/></svg>
            </button>
            <a href="/api/backup/download/${encodeURIComponent(b.filename)}" class="form-btn form-btn-sm" style="text-decoration:none;font-size:0.75rem;padding:3px 8px" title="${t('settings.backup_download')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
            <button class="form-btn form-btn-sm" style="font-size:0.75rem;padding:3px 8px;color:var(--accent-red)" onclick="window._deleteBackup('${b.filename}')" title="${t('settings.backup_delete')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>`;
      }
      h += '</div>';
      el.innerHTML = h;
    } catch { el.innerHTML = '<span class="text-muted">Error</span>'; }
  }

  window._createBackup = async function() {
    const btn = document.getElementById('backup-create-btn');
    if (btn) { btn.disabled = true; btn.textContent = t('settings.backup_creating'); }
    try {
      const res = await fetch('/api/backup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast('Backup created: ' + data.filename, 'success');
      _loadBackupList();
    } catch (e) { showToast(e.message, 'error'); }
    finally { if (btn) { btn.disabled = false; btn.textContent = t('settings.backup_create'); } }
  };

  window._deleteBackup = async function(filename) {
    if (!confirm(t('settings.backup_delete_confirm'))) return;
    try {
      const res = await fetch('/api/backup/' + encodeURIComponent(filename), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      _loadBackupList();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window._restoreBackup = async function(filename) {
    if (!confirm(t('settings.backup_restore_confirm', { filename }))) return;
    try {
      const res = await fetch('/api/backup/restore/' + encodeURIComponent(filename), { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast(t('settings.backup_restore_success'), 'success');
      // Reload page after short delay to pick up restored database
      setTimeout(() => location.reload(), 2000);
    } catch (e) { showToast(e.message, 'error'); }
  };

  window._uploadBackup = async function(input) {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.db')) { showToast(t('settings.backup_upload_invalid'), 'warning'); return; }
    try {
      const buffer = await file.arrayBuffer();
      const res = await fetch('/api/backup/upload?filename=' + encodeURIComponent(file.name), {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: buffer
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast(t('settings.backup_upload_success', { filename: data.filename }), 'success');
      _loadBackupList();
    } catch (e) { showToast(e.message, 'error'); }
    finally { input.value = ''; }
  };

  // ═══ Expose helpers for settings sub-files ═══
  window._settingsEsc = _esc;
  window._renderAppearanceSubContent = _renderAppearanceSubContent;

})();
