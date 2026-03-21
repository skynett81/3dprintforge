// Settings — Printer management: add/edit forms, discovery, Bambu Lab Cloud integration
(function() {

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
        <details style="margin-top:8px;border-top:1px solid var(--border-color);padding-top:8px">
          <summary style="cursor:pointer;font-size:0.8rem;font-weight:600">${t('settings.per_printer_cost_title')}</summary>
          <p class="text-muted" style="font-size:0.7rem;margin:4px 0">${t('settings.per_printer_cost_hint')}</p>
          <div class="flex gap-sm" style="flex-wrap:wrap">
            <div class="form-group" style="width:110px">
              <label class="form-label">${t('settings.printer_wattage')}</label>
              <input class="form-input" id="pf-wattage" type="number" value="${printer?.printer_wattage || ''}" placeholder="--">
            </div>
            <div class="form-group" style="width:110px">
              <label class="form-label">${t('settings.printer_electricity_rate')}</label>
              <input class="form-input" id="pf-elec-rate" type="number" step="0.01" value="${printer?.electricity_rate_kwh || ''}" placeholder="--">
            </div>
            <div class="form-group" style="width:110px">
              <label class="form-label">${t('settings.printer_machine_cost')}</label>
              <input class="form-input" id="pf-machine-cost" type="number" step="0.01" value="${printer?.machine_cost || ''}" placeholder="--">
            </div>
            <div class="form-group" style="width:110px">
              <label class="form-label">${t('settings.printer_machine_lifetime')}</label>
              <input class="form-input" id="pf-machine-lifetime" type="number" value="${printer?.machine_lifetime_hours || ''}" placeholder="--">
            </div>
          </div>
        </details>
        <div class="form-actions">
          <button class="form-btn" data-ripple onclick="savePrinterForm('${printer?.id || ''}')">${t('settings.save')}</button>
          <button class="form-btn form-btn-secondary" data-ripple onclick="testPrinterConnection()">${t('settings.test_connection')}</button>
          <button class="form-btn form-btn-secondary" data-ripple onclick="cancelPrinterForm()">${t('settings.cancel')}</button>
        </div>
        <div id="test-connection-result" style="margin-top:0.5rem"></div>
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

    if (!name) { showToast(t('settings.name_required'), 'warning'); return; }

    const accessCode = document.getElementById('pf-access')?.value.trim();
    const wattage = document.getElementById('pf-wattage')?.value;
    const elecRate = document.getElementById('pf-elec-rate')?.value;
    const machCost = document.getElementById('pf-machine-cost')?.value;
    const machLife = document.getElementById('pf-machine-lifetime')?.value;
    const body = { name, model, ip, serial, accessCode,
      printer_wattage: wattage ? parseFloat(wattage) : null,
      electricity_rate_kwh: elecRate ? parseFloat(elecRate) : null,
      machine_cost: machCost ? parseFloat(machCost) : null,
      machine_lifetime_hours: machLife ? parseFloat(machLife) : null
    };

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
      showToast(t('settings.save_failed'), 'error');
    }
  };

  window.cancelPrinterForm = function() {
    const area = document.getElementById('printer-form-area');
    if (area) area.innerHTML = '';
  };

  window.removePrinter = async function(id) {
    return confirmAction(t('settings.confirm_delete'), async () => {
      try {
        await fetch(`/api/printers/${id}`, { method: 'DELETE' });
        loadSettings();
      } catch (e) { /* ignore */ }
    }, { danger: true });
  };

  // ═══ Printer Discovery ═══
  window.discoverPrinters = async function() {
    const btn = document.getElementById('discover-btn');
    const results = document.getElementById('discovery-results');
    if (!btn || !results) return;

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-sm"></span> ${t('settings.discovering')}`;
    results.innerHTML = '';

    try {
      const res = await fetch('/api/discovery/scan');
      const data = await res.json();

      if (!data.printers || data.printers.length === 0) {
        results.innerHTML = `<div class="settings-card" style="margin-bottom:0.75rem"><p class="text-muted" style="margin:0;font-size:0.85rem">${t('settings.discovery_none')}</p></div>`;
      } else {
        let h = `<div class="settings-card" style="margin-bottom:0.75rem"><div class="card-title">${t('settings.discovery_found').replace('{count}', data.printers.length)}</div>`;
        for (const p of data.printers) {
          const signalBar = p.signal != null ? `<span class="text-muted" style="font-size:0.75rem">${t('settings.discovery_signal')}: ${p.signal}%</span>` : '';
          h += `<div class="printer-config-card" style="margin-bottom:0.5rem"><div class="printer-config-header"><div>`;
          h += `<strong>${window._settingsEsc(p.name)}</strong>`;
          h += `<div class="text-muted" style="font-size:0.75rem">${window._settingsEsc(p.model)} | ${window._settingsEsc(p.ip)} | ${window._settingsEsc(p.serial)} ${signalBar}</div>`;
          h += `</div><div class="printer-config-actions">`;
          if (p.alreadyAdded) {
            h += `<span class="badge badge-muted" style="font-size:0.7rem">${t('settings.discovery_already_added')}</span>`;
          } else {
            h += `<button class="form-btn form-btn-sm" data-ripple onclick="addDiscoveredPrinter(${window._settingsEsc(JSON.stringify(JSON.stringify(p)))})">${t('settings.discovery_add')}</button>`;
          }
          h += '</div></div></div>';
        }
        h += '</div>';
        results.innerHTML = h;
      }
    } catch (e) {
      results.innerHTML = `<div class="settings-card" style="margin-bottom:0.75rem"><p class="text-muted" style="margin:0">${t('settings.discovery_none')}</p></div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><line x1="2" y1="12" x2="22" y2="12"/></svg> ${t('settings.discover_printers')}`;
    }
  };

  window.addDiscoveredPrinter = function(jsonStr) {
    try {
      const p = JSON.parse(jsonStr);
      const area = document.getElementById('printer-form-area');
      if (!area) return;
      renderPrinterForm(area, { name: p.name, model: p.model, ip: p.ip, serial: p.serial });
      // Focus on access code field
      setTimeout(() => {
        const accessEl = document.getElementById('pf-access');
        if (accessEl) accessEl.focus();
      }, 100);
    } catch { /* ignore */ }
  };

  window.testPrinterConnection = async function() {
    const ip = document.getElementById('pf-ip')?.value.trim();
    const serial = document.getElementById('pf-serial')?.value.trim();
    const accessCode = document.getElementById('pf-access')?.value.trim();
    const resultEl = document.getElementById('test-connection-result');
    if (!resultEl) return;

    if (!ip || !accessCode) {
      resultEl.innerHTML = `<span style="color:var(--warning-color,#f0ad4e);font-size:0.8rem">${t('settings.discovery_enter_access')}</span>`;
      return;
    }

    resultEl.innerHTML = `<span class="text-muted" style="font-size:0.8rem"><span class="spinner-sm"></span> ${t('settings.testing_connection')}</span>`;

    try {
      const res = await fetch('/api/discovery/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, serial, accessCode })
      });
      const data = await res.json();
      if (data.ok) {
        resultEl.innerHTML = `<span style="color:var(--success-color,#28a745);font-size:0.8rem">&#10003; ${t('settings.test_success')}</span>`;
      } else {
        const err = data.error === 'timeout' ? t('settings.test_timeout') : t('settings.test_failed');
        resultEl.innerHTML = `<span style="color:var(--danger-color,#dc3545);font-size:0.8rem">&#10007; ${err}</span>`;
      }
    } catch {
      resultEl.innerHTML = `<span style="color:var(--danger-color,#dc3545);font-size:0.8rem">&#10007; ${t('settings.test_failed')}</span>`;
    }
  };

  // ═══ Bambu Lab Cloud ═══
  let _cloudEmail = '';
  let _cloudState = 'loading'; // loading, login, verify, connected

  async function _loadCloudStatus() {
    const el = document.getElementById('cloud-content');
    if (!el) return;
    try {
      const res = await fetch('/api/bambu-cloud/status');
      const data = await res.json();
      if (data.authenticated) {
        _cloudState = 'connected';
        _cloudEmail = data.email || '';
        _renderCloudConnected(el);
      } else {
        _cloudState = 'login';
        _renderCloudLoginForm(el);
      }
    } catch {
      _cloudState = 'login';
      _renderCloudLoginForm(el);
    }
  }

  function _renderCloudLoginForm(el) {
    el.innerHTML = `
      <p class="text-muted" style="font-size:0.8rem;margin:0 0 0.5rem">${t('settings.bambu_cloud_desc')}</p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:flex-end">
        <div class="form-group" style="margin:0;flex:1;min-width:140px">
          <input class="form-input" id="cloud-email" placeholder="${t('settings.cloud_email')}" value="${window._settingsEsc(_cloudEmail)}" style="font-size:0.85rem">
        </div>
        <div class="form-group" style="margin:0;flex:1;min-width:140px">
          <input class="form-input" id="cloud-password" type="password" placeholder="${t('settings.cloud_password')}" style="font-size:0.85rem">
        </div>
        <button class="form-btn" data-ripple onclick="bambuCloudLogin()" id="cloud-login-btn" style="white-space:nowrap">${t('settings.cloud_login')}</button>
      </div>
      <div id="cloud-error" style="margin-top:0.35rem"></div>`;
  }

  function _renderCloudVerifyForm(el) {
    el.innerHTML = `
      <p style="font-size:0.85rem;margin:0 0 0.5rem;color:var(--text-primary)">${t('settings.cloud_verify_desc')}</p>
      <div style="display:flex;gap:0.5rem;align-items:flex-end">
        <div class="form-group" style="margin:0;flex:1;max-width:200px">
          <input class="form-input" id="cloud-code" placeholder="000000" maxlength="6" style="font-size:1rem;letter-spacing:0.2em;text-align:center">
        </div>
        <button class="form-btn" data-ripple onclick="bambuCloudVerify()" id="cloud-verify-btn">${t('settings.cloud_verify')}</button>
        <button class="form-btn form-btn-secondary" data-ripple onclick="_resetCloudLogin()">${t('settings.cancel')}</button>
      </div>
      <div id="cloud-error" style="margin-top:0.35rem"></div>`;
    setTimeout(() => { const c = document.getElementById('cloud-code'); if (c) c.focus(); }, 50);
  }

  function _renderCloudConnected(el) {
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
        <span style="font-size:0.85rem;color:var(--success-color,#28a745)">&#10003; ${t('settings.cloud_connected').replace('{email}', window._settingsEsc(_cloudEmail))}</span>
        <button class="form-btn form-btn-sm" data-ripple onclick="bambuCloudGetPrinters()" id="cloud-import-btn">${t('settings.cloud_import')}</button>
        <button class="form-btn form-btn-sm form-btn-secondary" data-ripple onclick="bambuCloudLogout()">${t('settings.cloud_disconnect')}</button>
      </div>
      <div id="cloud-printer-results" style="margin-top:0.5rem"></div>`;
  }

  window._resetCloudLogin = function() {
    _cloudState = 'login';
    const el = document.getElementById('cloud-content');
    if (el) _renderCloudLoginForm(el);
  };

  window.bambuCloudLogin = async function() {
    const email = document.getElementById('cloud-email')?.value.trim();
    const password = document.getElementById('cloud-password')?.value;
    const errEl = document.getElementById('cloud-error');
    if (!email || !password) return;

    const btn = document.getElementById('cloud-login-btn');
    if (btn) { btn.disabled = true; btn.textContent = t('settings.cloud_logging_in'); }

    try {
      const res = await fetch('/api/bambu-cloud/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.needsVerification) {
        _cloudEmail = email;
        _cloudState = 'verify';
        const el = document.getElementById('cloud-content');
        if (el) _renderCloudVerifyForm(el);
      } else if (data.ok) {
        _cloudEmail = data.email || email;
        _cloudState = 'connected';
        const el = document.getElementById('cloud-content');
        if (el) _renderCloudConnected(el);
      } else {
        if (errEl) errEl.innerHTML = `<span style="color:var(--danger-color,#dc3545);font-size:0.8rem">${t('settings.cloud_login_failed')}</span>`;
        if (btn) { btn.disabled = false; btn.textContent = t('settings.cloud_login'); }
      }
    } catch {
      if (errEl) errEl.innerHTML = `<span style="color:var(--danger-color,#dc3545);font-size:0.8rem">${t('settings.cloud_login_failed')}</span>`;
      if (btn) { btn.disabled = false; btn.textContent = t('settings.cloud_login'); }
    }
  };

  window.bambuCloudVerify = async function() {
    const code = document.getElementById('cloud-code')?.value.trim();
    const errEl = document.getElementById('cloud-error');
    if (!code) return;

    const btn = document.getElementById('cloud-verify-btn');
    if (btn) { btn.disabled = true; btn.textContent = t('settings.cloud_verifying'); }

    try {
      const res = await fetch('/api/bambu-cloud/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: _cloudEmail, code })
      });
      const data = await res.json();

      if (data.ok) {
        _cloudEmail = data.email || _cloudEmail;
        _cloudState = 'connected';
        const el = document.getElementById('cloud-content');
        if (el) _renderCloudConnected(el);
      } else {
        if (errEl) errEl.innerHTML = `<span style="color:var(--danger-color,#dc3545);font-size:0.8rem">${t('settings.cloud_verify_failed')}</span>`;
        if (btn) { btn.disabled = false; btn.textContent = t('settings.cloud_verify'); }
      }
    } catch {
      if (errEl) errEl.innerHTML = `<span style="color:var(--danger-color,#dc3545);font-size:0.8rem">${t('settings.cloud_verify_failed')}</span>`;
      if (btn) { btn.disabled = false; btn.textContent = t('settings.cloud_verify'); }
    }
  };

  window.bambuCloudGetPrinters = async function() {
    const resultsEl = document.getElementById('cloud-printer-results');
    const btn = document.getElementById('cloud-import-btn');
    if (!resultsEl) return;

    if (btn) { btn.disabled = true; btn.textContent = t('settings.cloud_loading'); }
    resultsEl.innerHTML = '';

    try {
      const res = await fetch('/api/bambu-cloud/printers');
      const data = await res.json();

      if (!data.printers || data.printers.length === 0) {
        resultsEl.innerHTML = `<p class="text-muted" style="font-size:0.8rem;margin:0">${t('settings.cloud_no_printers')}</p>`;
      } else {
        let h = '';
        for (const p of data.printers) {
          const ipInfo = p.ip ? `| ${window._settingsEsc(p.ip)}` : '';
          const localBadge = p.ip ? ' <span style="color:var(--success-color,#28a745);font-size:0.7rem">&#9679; LAN</span>' : '';
          h += `<div class="printer-config-card" style="margin-bottom:0.4rem"><div class="printer-config-header"><div>`;
          h += `<strong>${window._settingsEsc(p.name)}</strong>`;
          h += `<div class="text-muted" style="font-size:0.75rem">${window._settingsEsc(p.model)} | ${window._settingsEsc(p.serial)} ${ipInfo}${localBadge}</div>`;
          h += `</div><div class="printer-config-actions">`;
          if (p.alreadyAdded) {
            h += `<span class="badge badge-muted" style="font-size:0.7rem">${t('settings.discovery_already_added')}</span>`;
          } else {
            h += `<button class="form-btn form-btn-sm" data-ripple onclick="addCloudPrinter(${window._settingsEsc(JSON.stringify(JSON.stringify(p)))})">${t('settings.discovery_add')}</button>`;
          }
          h += '</div></div></div>';
        }
        resultsEl.innerHTML = h;
      }
    } catch {
      resultsEl.innerHTML = `<p class="text-muted" style="font-size:0.8rem;margin:0">${t('settings.cloud_no_printers')}</p>`;
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = t('settings.cloud_import'); }
    }
  };

  window.addCloudPrinter = async function(jsonStr) {
    try {
      const p = JSON.parse(jsonStr);
      const body = {
        id: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
        name: p.name,
        model: p.model,
        ip: p.ip || '',
        serial: p.serial,
        accessCode: p.accessCode
      };
      await fetch('/api/printers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      showToast(t('settings.cloud_added'), 'success');
      loadSettings();
    } catch { /* ignore */ }
  };

  window.bambuCloudLogout = async function() {
    try {
      await fetch('/api/bambu-cloud/logout', { method: 'POST' });
      _cloudState = 'login';
      _cloudEmail = '';
      const el = document.getElementById('cloud-content');
      if (el) _renderCloudLoginForm(el);
    } catch { /* ignore */ }
  };


})();
