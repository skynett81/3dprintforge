// Settings — Security: webhooks, user management, API key management
(function() {

  window.loadWebhooks = async function() {
    const el = document.getElementById('webhooks-section');
    if (!el) return;
    try {
      const res = await fetch('/api/webhooks');
      const webhooks = await res.json();
      if (!webhooks.length) {
        el.innerHTML = `<div class="text-muted">${t('settings.no_webhooks')}</div>`;
        return;
      }
      let html = '<div class="wh-list">';
      for (const wh of webhooks) {
        const events = typeof wh.events === 'string' ? JSON.parse(wh.events) : (wh.events || []);
        html += `<div class="wh-item ${wh.active ? '' : 'wh-disabled'}">
          <div class="wh-item-header">
            <strong>${wh.name}</strong>
            <span class="wh-badge ${wh.active ? 'wh-badge-active' : 'wh-badge-inactive'}">${wh.active ? t('common.active') : t('common.inactive')}</span>
          </div>
          <div class="text-muted" style="font-size:0.8rem;word-break:break-all">${wh.url}</div>
          <div class="text-muted" style="font-size:0.75rem">${t('settings.webhook_template')}: ${wh.template} | ${t('settings.webhook_events')}: ${events.length === 0 ? t('common.all') : events.join(', ')}</div>
          <div class="wh-item-actions mt-xs">
            <button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('settings.webhook_test')}" onclick="testWebhook(${wh.id})">${t('settings.webhook_test')}</button>
            <button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('settings.webhook_edit')}" onclick="showWebhookEditor(${wh.id})">${t('settings.webhook_edit')}</button>
            <button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('settings.webhook_deliveries')}" onclick="showWebhookDeliveries(${wh.id})">${t('settings.webhook_deliveries')}</button>
            <button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('settings.webhook_delete')}" onclick="deleteWebhookItem(${wh.id})">${t('settings.webhook_delete')}</button>
          </div>
        </div>`;
      }
      html += '</div>';
      el.innerHTML = html;
    } catch (e) {
      el.innerHTML = `<div class="text-muted">Error: ${e.message}</div>`;
    }
  };

  window.showWebhookEditor = async function(id) {
    let wh = { name: '', url: '', secret: '', events: [], headers: '{}', template: 'generic', retry_count: 3, retry_delay_s: 10, active: 1 };
    if (id) {
      try {
        const res = await fetch(`/api/webhooks/${id}`);
        wh = await res.json();
        wh.events = typeof wh.events === 'string' ? JSON.parse(wh.events) : (wh.events || []);
        wh.headers = typeof wh.headers === 'string' ? wh.headers : JSON.stringify(wh.headers || {});
      } catch { return; }
    }

    const allEvents = ['print_started','print_finished','print_failed','print_cancelled','printer_error','maintenance_due','bed_cooled','queue_item_started','queue_item_completed','queue_item_failed','queue_completed'];

    const html = `<div class="modal-overlay" id="webhook-editor-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:500px">
        <div class="modal-header"><h3>${id ? t('settings.webhook_edit') : t('settings.webhook_add')}</h3>
          <button class="modal-close" onclick="document.getElementById('webhook-editor-modal').remove()">&times;</button></div>
        <div class="modal-body">
          <label class="form-label">${t('settings.webhook_name')}</label>
          <input class="form-input" id="wh-name" value="${wh.name}">
          <label class="form-label mt-sm">URL</label>
          <input class="form-input" id="wh-url" value="${wh.url}" placeholder="https://...">
          <label class="form-label mt-sm">${t('settings.webhook_secret')}</label>
          <input class="form-input" id="wh-secret" value="${wh.secret || ''}" placeholder="HMAC-SHA256 secret (optional)">
          <label class="form-label mt-sm">${t('settings.webhook_template')}</label>
          <select class="form-input" id="wh-template">
            <option value="generic" ${wh.template === 'generic' ? 'selected' : ''}>Generic JSON</option>
            <option value="discord" ${wh.template === 'discord' ? 'selected' : ''}>Discord</option>
            <option value="slack" ${wh.template === 'slack' ? 'selected' : ''}>Slack</option>
            <option value="homey" ${wh.template === 'homey' ? 'selected' : ''}>Homey</option>
          </select>
          <label class="form-label mt-sm">${t('settings.webhook_events')}</label>
          <div class="wh-events-grid">
            ${allEvents.map(e => `<label class="wh-event-label"><input type="checkbox" value="${e}" ${wh.events.includes(e) || wh.events.includes('*') ? 'checked' : ''}> ${e}</label>`).join('')}
          </div>
          <p class="text-muted" style="font-size:0.75rem">${t('settings.webhook_events_hint')}</p>
          <label class="form-label mt-sm">${t('settings.webhook_active')}</label>
          <input type="checkbox" id="wh-active" ${wh.active ? 'checked' : ''}>
        </div>
        <div class="modal-footer">
          <button class="form-btn form-btn-secondary" data-ripple onclick="document.getElementById('webhook-editor-modal').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple onclick="saveWebhook(${id || 'null'})">${t('common.save')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window.saveWebhook = async function(id) {
    const name = document.getElementById('wh-name').value.trim();
    const url = document.getElementById('wh-url').value.trim();
    const secret = document.getElementById('wh-secret').value.trim();
    const template = document.getElementById('wh-template').value;
    const active = document.getElementById('wh-active').checked ? 1 : 0;
    const events = [...document.querySelectorAll('.wh-events-grid input:checked')].map(i => i.value);

    if (!name || !url) { showToast(t('settings.webhook_name_url_required'), 'warning'); return; }

    const body = { name, url, secret, template, active, events };
    const endpoint = id ? `/api/webhooks/${id}` : '/api/webhooks';
    const method = id ? 'PUT' : 'POST';

    try {
      await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      document.getElementById('webhook-editor-modal')?.remove();
      loadWebhooks();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.testWebhook = async function(id) {
    try {
      const res = await fetch(`/api/webhooks/${id}/test`, { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        showToast(t('settings.webhook_test_sent'), 'success');
      } else {
        showToast(data.error || 'Unknown', 'error');
      }
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteWebhookItem = async function(id) {
    return confirmAction(t('settings.webhook_delete_confirm'), async () => {
      try {
        await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
        loadWebhooks();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  window.showWebhookDeliveries = async function(id) {
    try {
      const res = await fetch(`/api/webhooks/${id}/deliveries`);
      const deliveries = await res.json();

      let html = `<div class="modal-overlay" id="wh-deliveries-modal" onclick="if(event.target===this)this.remove()">
        <div class="modal-content" style="max-width:600px">
          <div class="modal-header"><h3>${t('settings.webhook_deliveries')}</h3>
            <button class="modal-close" onclick="document.getElementById('wh-deliveries-modal').remove()">&times;</button></div>
          <div class="modal-body" style="max-height:400px;overflow-y:auto">`;

      if (!deliveries.length) {
        html += `<div class="text-muted">${t('settings.no_deliveries')}</div>`;
      } else {
        for (const d of deliveries) {
          const statusColor = d.status === 'sent' ? 'var(--accent)' : d.status === 'failed' ? '#e74c3c' : '#f39c12';
          html += `<div class="wh-delivery" style="border-left:3px solid ${statusColor};padding:0.5rem;margin-bottom:0.5rem;background:var(--bg-secondary);border-radius:4px">
            <div><strong>${d.event_type}</strong> <span style="color:${statusColor}">${d.status}</span> <span class="text-muted" style="font-size:0.75rem">${d.created_at}</span></div>
            ${d.response_code ? `<div class="text-muted" style="font-size:0.75rem">HTTP ${d.response_code}</div>` : ''}
          </div>`;
        }
      }

      html += '</div></div></div>';
      document.body.insertAdjacentHTML('beforeend', html);
    } catch (e) { showToast(e.message, 'error'); }
  };

  // ---- Users Management ----

  let _rolesCache = null;

  window.loadUsers = async function() {
    const el = document.getElementById('users-section');
    if (!el) return;
    try {
      const [usersRes, rolesRes] = await Promise.all([fetch('/api/users'), fetch('/api/roles')]);
      const users = await usersRes.json();
      _rolesCache = await rolesRes.json();

      if (!users.length) {
        el.innerHTML = `<div class="text-muted">${t('settings.no_users')}</div>`;
        return;
      }
      let html = '<div class="wh-list">';
      for (const u of users) {
        html += `<div class="wh-item">
          <div class="wh-item-header">
            <strong>${u.username}</strong>${u.display_name ? ` (${u.display_name})` : ''}
            <span class="wh-badge wh-badge-active">${u.role_name || t('settings.no_role')}</span>
          </div>
          <div class="text-muted" style="font-size:0.75rem">${t('settings.user_last_login')}: ${u.last_login || t('common.never')}</div>
          <div class="wh-item-actions mt-xs">
            <button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('settings.user_edit')}" onclick="showUserEditor(${u.id})">${t('settings.user_edit')}</button>
            <button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('settings.user_delete')}" onclick="deleteUserItem(${u.id})">${t('settings.user_delete')}</button>
          </div>
        </div>`;
      }
      html += '</div>';
      el.innerHTML = html;
    } catch (e) {
      el.innerHTML = `<div class="text-muted">Error: ${e.message}</div>`;
    }
  };

  window.showUserEditor = async function(id) {
    let user = { username: '', display_name: '', role_id: '', password: '' };
    if (id) {
      try {
        const res = await fetch(`/api/users/${id}`);
        user = await res.json();
      } catch { return; }
    }
    if (!_rolesCache) {
      try { _rolesCache = await (await fetch('/api/roles')).json(); } catch { _rolesCache = []; }
    }
    const roleOptions = _rolesCache.map(r => `<option value="${r.id}" ${user.role_id === r.id ? 'selected' : ''}>${r.name}</option>`).join('');

    const html = `<div class="modal-overlay" id="user-editor-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:400px">
        <div class="modal-header"><h3>${id ? t('settings.user_edit') : t('settings.user_add')}</h3>
          <button class="modal-close" onclick="document.getElementById('user-editor-modal').remove()">&times;</button></div>
        <div class="modal-body">
          <label class="form-label">${t('settings.user_username')}</label>
          <input class="form-input" id="user-username" value="${user.username}">
          <label class="form-label mt-sm">${t('settings.user_display_name')}</label>
          <input class="form-input" id="user-display-name" value="${user.display_name || ''}">
          <label class="form-label mt-sm">${t('settings.user_role')}</label>
          <select class="form-input" id="user-role">${roleOptions}</select>
          <label class="form-label mt-sm">${t('settings.user_password')}${id ? ' (' + t('settings.user_password_keep_hint') + ')' : ''}</label>
          <input class="form-input" type="password" id="user-password" placeholder="${id ? '••••••••' : ''}">
        </div>
        <div class="modal-footer">
          <button class="form-btn form-btn-secondary" data-ripple onclick="document.getElementById('user-editor-modal').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple onclick="saveUser(${id || 'null'})">${t('common.save')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window.saveUser = async function(id) {
    const username = document.getElementById('user-username').value.trim();
    const display_name = document.getElementById('user-display-name').value.trim();
    const role_id = parseInt(document.getElementById('user-role').value) || null;
    const password = document.getElementById('user-password').value;

    if (!username) { showToast(t('settings.username_required'), 'warning'); return; }
    if (!id && !password) { showToast(t('settings.password_required_new'), 'warning'); return; }

    const body = { username, display_name, role_id };
    if (password) body.password = password;

    try {
      await fetch(id ? `/api/users/${id}` : '/api/users', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      document.getElementById('user-editor-modal')?.remove();
      loadUsers();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteUserItem = async function(id) {
    return confirmAction(t('settings.user_delete_confirm'), async () => {
      try {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        loadUsers();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  // ---- API Key Management ----

  window.loadApiKeys = async function() {
    const el = document.getElementById('api-keys-section');
    if (!el) return;
    try {
      const res = await fetch('/api/keys');
      const keys = await res.json();

      if (!keys.length) {
        el.innerHTML = `<div class="text-muted">${t('settings.no_api_keys')}</div>`;
        return;
      }
      let html = '<div class="wh-list">';
      for (const k of keys) {
        html += `<div class="wh-item ${k.active ? '' : 'wh-disabled'}">
          <div class="wh-item-header">
            <strong>${k.name}</strong>
            <code style="font-size:0.75rem">${k.key_prefix}...</code>
            <span class="wh-badge ${k.active ? 'wh-badge-active' : 'wh-badge-inactive'}">${k.active ? t('common.active') : t('common.inactive')}</span>
          </div>
          <div class="text-muted" style="font-size:0.75rem">
            ${t('settings.api_key_last_used')}: ${k.last_used || t('common.never')}
            ${k.expires_at ? ` | ${t('common.expires')}: ${k.expires_at}` : ''}
          </div>
          <div class="wh-item-actions mt-xs">
            <button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('settings.api_key_delete')}" onclick="deleteApiKeyItem(${k.id})">${t('settings.api_key_delete')}</button>
          </div>
        </div>`;
      }
      html += '</div>';
      el.innerHTML = html;
    } catch (e) {
      el.innerHTML = `<div class="text-muted">Error: ${e.message}</div>`;
    }
  };

  window.showApiKeyEditor = function() {
    const html = `<div class="modal-overlay" id="api-key-editor-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:400px">
        <div class="modal-header"><h3>${t('settings.api_key_add')}</h3>
          <button class="modal-close" onclick="document.getElementById('api-key-editor-modal').remove()">&times;</button></div>
        <div class="modal-body">
          <label class="form-label">${t('settings.api_key_name')}</label>
          <input class="form-input" id="apikey-name" placeholder="My API Key">
          <label class="form-label mt-sm">${t('settings.api_key_expires')}</label>
          <input class="form-input" type="date" id="apikey-expires">
          <div id="apikey-result" style="display:none" class="mt-sm">
            <div class="text-muted" style="font-size:0.85rem;font-weight:bold">${t('settings.api_key_created')}</div>
            <code id="apikey-value" style="word-break:break-all;display:block;padding:8px;background:var(--bg-tertiary);border-radius:4px;margin-top:4px;font-size:0.8rem"></code>
            <p class="text-muted" style="font-size:0.75rem;margin-top:4px">${t('settings.api_key_copy_warning')}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="form-btn form-btn-secondary" data-ripple onclick="document.getElementById('api-key-editor-modal').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple id="apikey-create-btn" onclick="createApiKey()">${t('settings.api_key_generate')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window.createApiKey = async function() {
    const name = document.getElementById('apikey-name').value.trim();
    if (!name) { showToast(t('settings.name_required'), 'warning'); return; }
    const expires = document.getElementById('apikey-expires').value;

    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, expires_at: expires || null })
      });
      const data = await res.json();
      if (data.key) {
        document.getElementById('apikey-value').textContent = data.key;
        document.getElementById('apikey-result').style.display = '';
        document.getElementById('apikey-create-btn').style.display = 'none';
        loadApiKeys();
      }
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteApiKeyItem = async function(id) {
    return confirmAction(t('settings.api_key_delete_confirm'), async () => {
      try {
        await fetch(`/api/keys/${id}`, { method: 'DELETE' });
        loadApiKeys();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  // ---- Orders License (reuses ecom license) ----

  async function _loadOrdersLicenseStatus() {
    const licArea = document.getElementById('orders-license-area');
    const openBtn = document.getElementById('orders-open-btn');
    const badge = document.getElementById('orders-premium-badge');
    if (!licArea) return;
    try {
      const res = await fetch('/api/ecommerce/license');
      const lic = await res.json();
      if (lic.active) {
        if (badge) { badge.classList.add('active'); badge.textContent = t('settings.ecom_premium') + ' \u2713'; }
        licArea.innerHTML = `<div style="font-size:0.85rem;color:var(--accent-green)">${t('settings.orders_license_active') || 'Lisens aktiv — ordrebehandling tilgjengelig.'}</div>`;
        if (openBtn) openBtn.style.display = '';
      } else {
        if (badge) { badge.classList.remove('active'); }
        licArea.innerHTML = `<div style="font-size:0.85rem;color:var(--text-muted)">${t('settings.orders_license_required') || 'Krever aktiv e-handelslisens. Aktiver ovenfor for å bruke ordrebehandling.'}</div>`;
        if (openBtn) openBtn.style.display = 'none';
      }
    } catch {
      licArea.innerHTML = `<span class="text-muted" style="font-size:0.8rem">${t('settings.orders_license_error') || 'Kunne ikke sjekke lisens.'}</span>`;
    }
  }

  // ---- E-Commerce License + Management ----

  async function loadEcomLicenseStatus() {
    const licArea = document.getElementById('ecom-license-area');
    const ecomSection = document.getElementById('ecom-section');
    const addBtn = document.getElementById('ecom-add-btn');
    const badge = document.getElementById('ecom-premium-badge');
    if (!licArea) return;
    try {
      const res = await fetch('/api/ecommerce/license');
      const lic = await res.json();
      if (lic.active) {
        // Active license — show info + enable ecom configs
        if (badge) { badge.classList.add('active'); badge.textContent = t('settings.ecom_premium') + ' \u2713'; }
        const feeStr = formatCurrency(lic.fees_this_month || 0);
        licArea.innerHTML = `
          <div class="ecom-license-info" style="display:flex;flex-wrap:wrap;gap:0.5rem 1.5rem;font-size:0.85rem;margin-bottom:0.5rem;padding:0.6rem;background:var(--bg-secondary);border-radius:var(--radius);border:1px solid rgba(0,174,66,0.3)">
            <span><strong>${t('settings.ecom_license_key')}:</strong> ${window._settingsEsc(lic.license_key || '')}</span>
            <span><strong>${t('settings.ecom_license_holder')}:</strong> ${window._settingsEsc(lic.holder || '-')}</span>
            <span><strong>${t('settings.ecom_license_expires')}:</strong> ${lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : '-'}</span>
            <span><strong>${t('settings.ecom_fees_month')}:</strong> ${feeStr} (${lic.orders_this_month || 0} ${t('settings.ecom_fees_orders')})</span>
            <button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('settings.ecom_deactivate')}" onclick="deactivateEcomLicense()" style="margin-left:auto">${t('settings.ecom_deactivate')}</button>
          </div>`;
        if (ecomSection) ecomSection.style.display = '';
        if (addBtn) addBtn.style.display = '';
        loadEcomConfigs();
      } else {
        // No active license — show activation form
        if (badge) { badge.classList.remove('active'); badge.textContent = t('settings.ecom_premium'); }
        licArea.innerHTML = `
          <div class="ecom-license-box">
            <p style="font-size:0.85rem;margin:0 0 0.3rem">${t('settings.ecom_license_required')}</p>
            <p style="font-size:0.8rem;color:var(--text-muted);margin:0 0 0.6rem">${t('settings.ecom_fee_notice')}</p>
            ${lic.status === 'expired' ? '<p style="font-size:0.8rem;color:#e91e63;margin:0 0 0.5rem">' + t('settings.ecom_license_expired') + '</p>' : ''}
            ${lic.status === 'invalid' ? '<p style="font-size:0.8rem;color:#e91e63;margin:0 0 0.5rem">' + t('settings.ecom_license_invalid') + '</p>' : ''}
            <div class="form-group" style="margin-bottom:0.4rem">
              <label class="form-label">${t('settings.ecom_license_key')}</label>
              <input class="form-input" id="ecom-license-key" placeholder="${t('settings.ecom_license_key_ph')}">
            </div>
            <div class="form-group" style="margin-bottom:0.6rem">
              <label class="form-label">${t('settings.ecom_license_email')}</label>
              <input class="form-input" id="ecom-license-email" placeholder="${t('settings.ecom_license_email_ph') || 'din@epost.no'}">
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center">
              <button class="form-btn form-btn-primary" data-ripple onclick="activateEcomLicense()">${t('settings.ecom_activate')}</button>
              <a href="https://geektech.no/registrer" target="_blank" rel="noopener" style="font-size:0.85rem">${t('settings.ecom_create_account')}</a>
            </div>
          </div>`;
        if (ecomSection) ecomSection.style.display = 'none';
        if (addBtn) addBtn.style.display = 'none';
      }
    } catch (e) { licArea.innerHTML = `<span class="text-muted" style="font-size:0.85rem">Error: ${e.message}</span>`; }
  }

  window.activateEcomLicense = async function() {
    const key = document.getElementById('ecom-license-key')?.value?.trim();
    const email = document.getElementById('ecom-license-email')?.value?.trim();
    if (!key) { showToast(t('settings.ecom_license_invalid'), 'warning'); return; }
    try {
      const res = await fetch('/api/ecommerce/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: key, email })
      });
      const data = await res.json();
      if (data.valid) {
        showToast(t('settings.ecom_license_activated'), 'success');
      } else {
        showToast(data.error || t('settings.ecom_license_invalid'), 'error');
      }
      loadEcomLicenseStatus();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deactivateEcomLicense = async function() {
    return confirmAction(t('settings.ecom_deactivate') + '?', async () => {
      try {
        await fetch('/api/ecommerce/license/deactivate', { method: 'POST' });
        showToast(t('settings.ecom_license_deactivated'), 'success');
        loadEcomLicenseStatus();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  async function loadEcomConfigs() {
    const el = document.getElementById('ecom-section');
    if (!el) return;
    try {
      const res = await fetch('/api/ecommerce/configs');
      const configs = await res.json();
      if (!configs.length) { el.innerHTML = `<span class="text-muted" style="font-size:0.85rem">${t('settings.no_ecom_configs')}</span>`; return; }
      el.innerHTML = configs.map(c => `
        <div class="wh-item" style="display:flex;align-items:center;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.05)">
          <div>
            <strong>${window._settingsEsc(c.name)}</strong>
            <span class="wh-badge" style="margin-left:0.4rem">${window._settingsEsc(c.platform)}</span>
            ${c.active ? '<span class="wh-badge" style="background:rgba(0,200,100,0.15);color:#00c864">' + t('common.active') + '</span>' : '<span class="wh-badge">' + t('common.inactive') + '</span>'}
            ${c.auto_queue ? '<span class="wh-badge" style="background:rgba(0,180,255,0.15);color:#00b4ff">' + t('settings.auto_queue') + '</span>' : ''}
          </div>
          <div style="display:flex;gap:0.3rem">
            <button class="form-btn form-btn-sm" data-ripple data-tooltip="${t('settings.webhook_edit')}" onclick="showEcomEditor(${c.id})">${t('settings.webhook_edit')}</button>
            <button class="form-btn form-btn-sm form-btn-danger" data-ripple data-tooltip="${t('settings.webhook_delete')}" onclick="deleteEcomConfig(${c.id})">${t('settings.webhook_delete')}</button>
          </div>
        </div>`).join('');
    } catch (e) { el.innerHTML = `<span class="text-muted">Error: ${e.message}</span>`; }
  }

  window.showEcomEditor = async function(id = null) {
    let config = { platform: 'custom', name: '', webhook_secret: '', auto_queue: false, target_queue_id: '', sku_to_file_mapping: '{}', active: true };
    if (id) {
      try {
        const res = await fetch(`/api/ecommerce/configs/${id}`);
        config = await res.json();
      } catch { return; }
    }
    const mapping = typeof config.sku_to_file_mapping === 'string' ? config.sku_to_file_mapping : JSON.stringify(config.sku_to_file_mapping || {}, null, 2);
    const html = `<div class="modal-overlay" id="ecom-editor-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:500px">
        <div class="modal-header"><h3>${id ? t('settings.ecom_edit') : t('settings.ecom_add')}</h3><button class="modal-close" onclick="document.getElementById('ecom-editor-modal').remove()">×</button></div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:0.6rem">
          <div class="form-group">
            <label class="form-label">${t('settings.ecom_name')}</label>
            <input class="form-input" id="ecom-name" value="${window._settingsEsc(config.name)}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.ecom_platform')}</label>
            <select class="form-input" id="ecom-platform">
              <option value="custom" ${config.platform==='custom'?'selected':''}>Custom</option>
              <option value="shopify" ${config.platform==='shopify'?'selected':''}>Shopify</option>
              <option value="woocommerce" ${config.platform==='woocommerce'?'selected':''}>WooCommerce</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.webhook_secret')}</label>
            <input class="form-input" id="ecom-secret" value="${window._settingsEsc(config.webhook_secret || '')}" placeholder="HMAC secret">
          </div>
          <label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem">
            <input type="checkbox" id="ecom-auto-queue" ${config.auto_queue?'checked':''}>
            <span>${t('settings.ecom_auto_queue')}</span>
          </label>
          <div class="form-group">
            <label class="form-label">${t('settings.ecom_target_queue')}</label>
            <input class="form-input" id="ecom-target-queue" type="number" value="${config.target_queue_id || ''}" placeholder="Queue ID">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.ecom_sku_mapping')}</label>
            <textarea class="form-input" id="ecom-sku-map" rows="4" style="font-family:monospace;font-size:0.8rem">${window._settingsEsc(mapping)}</textarea>
          </div>
          <label class="form-checkbox-label" style="display:flex;align-items:center;gap:0.5rem">
            <input type="checkbox" id="ecom-active" ${config.active?'checked':''}>
            <span>${t('settings.webhook_active')}</span>
          </label>
        </div>
        <div class="modal-footer">
          <button class="form-btn form-btn-secondary" data-ripple onclick="document.getElementById('ecom-editor-modal').remove()">${t('common.cancel')}</button>
          <button class="form-btn form-btn-primary" data-ripple onclick="saveEcomConfig(${id || 'null'})">${t('common.save')}</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window.saveEcomConfig = async function(id) {
    let skuMap;
    try { skuMap = JSON.parse(document.getElementById('ecom-sku-map').value); } catch { skuMap = {}; }
    const data = {
      name: document.getElementById('ecom-name').value.trim(),
      platform: document.getElementById('ecom-platform').value,
      webhook_secret: document.getElementById('ecom-secret').value.trim() || null,
      auto_queue: document.getElementById('ecom-auto-queue').checked,
      target_queue_id: parseInt(document.getElementById('ecom-target-queue').value) || null,
      sku_to_file_mapping: skuMap,
      active: document.getElementById('ecom-active').checked
    };
    if (!data.name) { showToast(t('settings.name_required'), 'warning'); return; }
    try {
      await fetch(id ? `/api/ecommerce/configs/${id}` : '/api/ecommerce/configs', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      document.getElementById('ecom-editor-modal')?.remove();
      loadEcomConfigs();
    } catch (e) { showToast(e.message, 'error'); }
  };

  window.deleteEcomConfig = async function(id) {
    return confirmAction(t('settings.ecom_delete_confirm'), async () => {
      try {
        await fetch(`/api/ecommerce/configs/${id}`, { method: 'DELETE' });
        loadEcomConfigs();
      } catch (e) { showToast(e.message, 'error'); }
    }, { danger: true });
  };

  // ---- Timelapse Settings ----


})();
