// Settings — Advanced: energy pricing, HA MQTT discovery, remote nodes, power monitor, reports, milestones, public status, dashboard export/import
(function() {

  // ═══ Energy Settings ═══

  async function _loadEnergySettings() {
    try {
      const [provRes, tokenRes, zoneRes] = await Promise.all([
        fetch('/api/inventory/settings/energy_provider').then(r => r.json()),
        fetch('/api/inventory/settings/energy_tibber_token').then(r => r.json()),
        fetch('/api/inventory/settings/energy_nordpool_zone').then(r => r.json())
      ]);
      const provider = provRes.value || 'none';
      const token = tokenRes.value || '';
      const zone = zoneRes.value || 'NO1';

      const sel = document.getElementById('energy-provider');
      if (sel) sel.value = provider;
      const tokInput = document.getElementById('energy-tibber-token');
      if (tokInput) tokInput.value = token;
      const zoneSelect = document.getElementById('energy-nordpool-zone');
      if (zoneSelect) zoneSelect.value = zone;

      window._energyProviderChanged();
      if (provider !== 'none') _loadEnergyPrices();
    } catch {}
  }

  window._energyProviderChanged = function() {
    const provider = document.getElementById('energy-provider')?.value || 'none';
    const tibberCfg = document.getElementById('energy-tibber-config');
    const nordpoolCfg = document.getElementById('energy-nordpool-config');
    if (tibberCfg) tibberCfg.style.display = provider === 'tibber' ? '' : 'none';
    if (nordpoolCfg) nordpoolCfg.style.display = provider === 'nordpool' ? '' : 'none';
  };

  window._saveEnergySettings = async function() {
    const provider = document.getElementById('energy-provider')?.value || 'none';
    const token = document.getElementById('energy-tibber-token')?.value || '';
    const zone = document.getElementById('energy-nordpool-zone')?.value || 'NO1';

    await Promise.all([
      fetch('/api/inventory/settings/energy_provider', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: provider }) }),
      fetch('/api/inventory/settings/energy_tibber_token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: token }) }),
      fetch('/api/inventory/settings/energy_nordpool_zone', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: zone }) })
    ]);

    // Restart service
    await fetch('/api/energy/refresh', { method: 'POST' });
    window.showToast?.(t('common.saved'), 'success');
    if (provider !== 'none') _loadEnergyPrices();
  };

  window._refreshEnergyPrices = async function() {
    const el = document.getElementById('energy-live-prices');
    if (el) el.innerHTML = `<div class="text-muted" style="font-size:0.8rem">${t('settings.energy_loading')}</div>`;
    await fetch('/api/energy/refresh', { method: 'POST' });
    _loadEnergyPrices();
  };

  async function _loadEnergyPrices() {
    try {
      const data = await fetch('/api/energy/today').then(r => r.json());
      const el = document.getElementById('energy-live-prices');
      if (!el || data.error) {
        if (el) el.innerHTML = `<div class="text-muted" style="font-size:0.8rem">${data.error || t('settings.energy_no_data')}</div>`;
        return;
      }

      const levelColors = { low: 'var(--accent-green)', normal: 'var(--text-primary)', high: 'var(--accent-red)' };
      const levelLabels = { low: t('settings.energy_level_low'), normal: t('settings.energy_level_normal'), high: t('settings.energy_level_high'), unknown: '—' };

      let h = `<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px">`;
      h += `<div><span class="text-muted" style="font-size:0.7rem">${t('settings.energy_current')}</span><div style="font-size:1.3rem;font-weight:800;color:${levelColors[data.level] || 'var(--text-primary)'}">${data.current !== null ? data.current.toFixed(2) : '—'} <span style="font-size:0.7rem;font-weight:500">${data.currency}/kWh</span></div><span style="font-size:0.72rem;font-weight:600;color:${levelColors[data.level]}">${levelLabels[data.level]}</span></div>`;
      h += `<div><span class="text-muted" style="font-size:0.7rem">Min</span><div style="font-size:1rem;font-weight:700;color:var(--accent-green)">${data.min.toFixed(2)} <span style="font-size:0.65rem;font-weight:400">kl ${String(data.minHour).padStart(2,'0')}:00</span></div></div>`;
      h += `<div><span class="text-muted" style="font-size:0.7rem">Max</span><div style="font-size:1rem;font-weight:700;color:var(--accent-red)">${data.max.toFixed(2)} <span style="font-size:0.65rem;font-weight:400">kl ${String(data.maxHour).padStart(2,'0')}:00</span></div></div>`;
      h += `<div><span class="text-muted" style="font-size:0.7rem">${t('settings.energy_avg')}</span><div style="font-size:1rem;font-weight:700">${data.avg.toFixed(2)}</div></div>`;
      h += `</div>`;

      // Price chart (24h bar chart)
      if (data.prices?.length) {
        const maxP = Math.max(...data.prices.map(p => p.total), 0.01);
        const nowHour = new Date().getHours();
        h += `<div style="display:flex;gap:2px;align-items:flex-end;height:60px;margin-top:6px">`;
        for (const p of data.prices) {
          const hr = new Date(p.startsAt).getHours();
          const pct = Math.max((p.total / maxP) * 100, 3);
          const isNow = hr === nowHour;
          const lvl = p.level || 'NORMAL';
          const bg = lvl.includes('CHEAP') ? 'var(--accent-green)' : lvl.includes('EXPENSIVE') ? 'var(--accent-red)' : 'var(--accent-blue)';
          h += `<div title="${String(hr).padStart(2,'0')}:00 — ${p.total.toFixed(2)} ${data.currency}/kWh" style="flex:1;height:${pct}%;background:${bg};border-radius:2px 2px 0 0;opacity:${isNow ? 1 : 0.6};${isNow ? 'box-shadow:0 0 6px ' + bg : ''}"></div>`;
        }
        h += `</div>`;
        h += `<div style="display:flex;justify-content:space-between;font-size:0.5rem;color:var(--text-muted);margin-top:2px"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div>`;
      }

      el.innerHTML = h;

      // Cheapest window
      const cheapEl = document.getElementById('energy-cheapest-window');
      if (cheapEl) {
        const windows = await Promise.all([60, 120, 240, 480].map(m =>
          fetch(`/api/energy/cheapest?duration=${m}`).then(r => r.json())
        ));
        let ch = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px">';
        const labels = ['1t', '2t', '4t', '8t'];
        windows.forEach((w, i) => {
          if (w.error) { ch += `<div class="text-muted" style="font-size:0.8rem">${labels[i]}: —</div>`; return; }
          const startHr = new Date(w.startsAt).getHours();
          ch += `<div style="background:var(--bg-tertiary);padding:8px 12px;border-radius:6px"><div class="text-muted" style="font-size:0.68rem">${t('settings.energy_cheapest')} ${labels[i]}</div><div style="font-size:1rem;font-weight:700;color:var(--accent-green)">kl ${String(startHr).padStart(2,'0')}:00</div><div style="font-size:0.72rem;color:var(--text-secondary)">${t('settings.energy_avg')}: ${w.avgPrice.toFixed(2)} ${w.currency}/kWh</div></div>`;
        });
        ch += '</div>';
        cheapEl.innerHTML = ch;
      }
    } catch (e) {
      const el = document.getElementById('energy-live-prices');
      if (el) el.innerHTML = `<div class="text-muted" style="font-size:0.8rem">${t('settings.energy_fetch_error')}</div>`;
    }
  }

  // ═══ Report Settings ═══

  async function _loadReportSettings() {
    try {
      const [freqRes, emailRes] = await Promise.all([
        fetch('/api/inventory/settings/report_frequency').then(r => r.json()),
        fetch('/api/inventory/settings/report_email').then(r => r.json())
      ]);
      const sel = document.getElementById('report-frequency');
      if (sel) sel.value = freqRes.value || 'none';
      const emailInput = document.getElementById('report-email');
      if (emailInput) emailInput.value = emailRes.value || '';
    } catch {}
  }

  window._saveReportSettings = async function() {
    const freq = document.getElementById('report-frequency')?.value || 'none';
    const email = document.getElementById('report-email')?.value || '';

    await Promise.all([
      fetch('/api/inventory/settings/report_frequency', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: freq }) }),
      fetch('/api/inventory/settings/report_email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: email }) })
    ]);
    await fetch('/api/reports/restart', { method: 'POST' });
    window.showToast?.(t('common.saved'), 'success');
  };

  window._previewReport = function() {
    window.open('/api/reports/preview?period=week', '_blank');
  };

  window._sendTestReport = async function() {
    const result = await fetch('/api/reports/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ period: 'week' }) }).then(r => r.json());
    if (result.ok) {
      window.showToast?.(t('settings.report_sent') + ' ' + result.to, 'success');
    } else {
      window.showToast?.(result.error || t('settings.report_send_fail'), 'error');
    }
  };

  // ═══ Milestone Settings ═══

  async function _loadMilestoneSettings() {
    try {
      const res = await fetch('/api/inventory/settings/milestones_enabled').then(r => r.json());
      const enabled = res.value === '1' || res.value === 'true' || res.value === null || res.value === undefined;
      const cb = document.getElementById('milestones-enabled');
      if (cb) cb.checked = enabled;
    } catch {}
  }

  window._toggleMilestones = async function(enabled) {
    await fetch('/api/inventory/settings/milestones_enabled', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: enabled ? '1' : '0' }) });
    window.showToast?.(t('common.saved'), 'success');
  };

  // ═══ Public Status Page Settings ═══

  async function _loadPublicStatusSettings() {
    try {
      const res = await fetch('/api/inventory/settings/public_status_enabled').then(r => r.json());
      const enabled = res.value === '1' || res.value === 'true';
      const cb = document.getElementById('public-status-enabled');
      if (cb) cb.checked = enabled;
    } catch {}
  }

  window._togglePublicStatus = async function(enabled) {
    await fetch('/api/inventory/settings/public_status_enabled', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: enabled ? '1' : '0' }) });
    window.showToast?.(t('common.saved'), 'success');
  };

  // ═══ Home Assistant MQTT Discovery Settings ═══

  async function _loadHaMqttSettings() {
    try {
      const [enabledRes, brokerRes, userRes] = await Promise.all([
        fetch('/api/inventory/settings/ha_mqtt_enabled').then(r => r.json()),
        fetch('/api/inventory/settings/ha_mqtt_broker').then(r => r.json()),
        fetch('/api/inventory/settings/ha_mqtt_username').then(r => r.json())
      ]);
      const enabled = enabledRes.value === '1' || enabledRes.value === 'true';
      const cb = document.getElementById('ha-mqtt-enabled');
      if (cb) cb.checked = enabled;
      const fields = document.getElementById('ha-mqtt-fields');
      if (fields) fields.style.display = enabled ? '' : 'none';
      const brokerEl = document.getElementById('ha-mqtt-broker');
      if (brokerEl) brokerEl.value = brokerRes.value || '';
      const userEl = document.getElementById('ha-mqtt-username');
      if (userEl) userEl.value = userRes.value || '';
      // Load connection status
      const statusRes = await fetch('/api/ha-discovery/status').then(r => r.json());
      const statusEl = document.getElementById('ha-mqtt-status');
      if (statusEl && enabled) {
        statusEl.textContent = statusRes.connected ? t('settings.ha_mqtt_connected') : t('settings.ha_mqtt_disconnected');
        statusEl.style.color = statusRes.connected ? 'var(--accent-green)' : 'var(--text-muted)';
      }
    } catch {}
  }

  window._toggleHaMqtt = function(enabled) {
    const fields = document.getElementById('ha-mqtt-fields');
    if (fields) fields.style.display = enabled ? '' : 'none';
    if (!enabled) {
      // Disable immediately
      fetch('/api/inventory/settings/ha_mqtt_enabled', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: '0' }) })
        .then(() => fetch('/api/ha-discovery/restart', { method: 'POST' }));
      window.showToast?.(t('common.saved'), 'success');
    }
  };

  window._saveHaMqttSettings = async function() {
    const broker = document.getElementById('ha-mqtt-broker')?.value?.trim();
    const username = document.getElementById('ha-mqtt-username')?.value?.trim();
    const password = document.getElementById('ha-mqtt-password')?.value?.trim();
    if (!broker) { window.showToast?.(t('settings.ha_mqtt_broker_required'), 'error'); return; }
    await Promise.all([
      fetch('/api/inventory/settings/ha_mqtt_enabled', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: '1' }) }),
      fetch('/api/inventory/settings/ha_mqtt_broker', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: broker }) }),
      fetch('/api/inventory/settings/ha_mqtt_username', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: username || '' }) }),
      fetch('/api/inventory/settings/ha_mqtt_password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: password || '' }) })
    ]);
    await fetch('/api/ha-discovery/restart', { method: 'POST' });
    window.showToast?.(t('common.saved'), 'success');
    // Reload status after a short delay
    setTimeout(async () => {
      const statusRes = await fetch('/api/ha-discovery/status').then(r => r.json());
      const statusEl = document.getElementById('ha-mqtt-status');
      if (statusEl) {
        statusEl.textContent = statusRes.connected ? t('settings.ha_mqtt_connected') : t('settings.ha_mqtt_disconnected');
        statusEl.style.color = statusRes.connected ? 'var(--accent-green)' : 'var(--text-muted)';
      }
    }, 2000);
  };

  // ═══ Remote Nodes Settings ═══

  async function _loadRemoteNodes() {
    const container = document.getElementById('remote-nodes-list');
    if (!container) return;
    try {
      const nodes = await fetch('/api/remote-nodes').then(r => r.json());
      if (!Array.isArray(nodes) || nodes.length === 0) {
        container.innerHTML = `<p class="text-muted" style="font-size:0.8rem">${t('settings.nodes_none')}</p>`;
        return;
      }
      let html = '';
      for (const n of nodes) {
        const statusDot = n.last_error ? 'var(--accent-red)' : (n.last_seen ? 'var(--accent-green)' : 'var(--text-muted)');
        const printerCount = n.printers?.length || 0;
        html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="width:8px;height:8px;border-radius:50%;background:${statusDot};flex-shrink:0"></span>
            <div>
              <div style="font-weight:600;font-size:0.85rem">${_localEsc(n.name)}</div>
              <div class="text-muted" style="font-size:0.75rem">${_localEsc(n.base_url)} · ${printerCount} ${t('settings.nodes_printers')}</div>
              ${n.last_error ? `<div style="font-size:0.72rem;color:var(--accent-red)">${_localEsc(n.last_error.substring(0, 80))}</div>` : ''}
            </div>
          </div>
          <div style="display:flex;gap:4px">
            <button class="form-btn form-btn-sm" data-ripple onclick="window._toggleNode(${n.id}, ${n.enabled ? 'false' : 'true'})">${n.enabled ? t('common.disable') : t('common.enable')}</button>
            <button class="form-btn form-btn-sm form-btn-danger" data-ripple onclick="window._deleteNode(${n.id})">${t('common.delete')}</button>
          </div>
        </div>`;
      }
      container.innerHTML = html;
    } catch { container.innerHTML = '<p class="text-muted">Error loading nodes</p>'; }
  }

  function _localEsc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  window._showAddNodeDialog = function() {
    const html = `<div class="modal-overlay" id="add-node-modal" onclick="if(event.target===this)this.remove()">
      <div class="modal-content" style="max-width:450px">
        <div class="modal-header"><h3>${t('settings.nodes_add')}</h3>
          <button class="modal-close" onclick="document.getElementById('add-node-modal').remove()">&times;</button></div>
        <div class="modal-body">
          <label class="form-label">${t('settings.nodes_name')}</label>
          <input class="form-input" id="node-name" placeholder="${t('settings.nodes_name_hint')}">
          <label class="form-label mt-sm">${t('settings.nodes_url')}</label>
          <input class="form-input" id="node-url" placeholder="https://192.168.1.100:3443">
          <label class="form-label mt-sm">${t('settings.nodes_api_key')}</label>
          <input class="form-input" id="node-api-key" placeholder="${t('settings.ha_mqtt_optional')}">
          <div style="display:flex;gap:6px;margin-top:12px">
            <button class="form-btn form-btn-primary" data-ripple onclick="window._addNode()">${t('common.add')}</button>
            <button class="form-btn form-btn-sm form-btn-secondary" data-ripple onclick="window._testNode()">${t('settings.nodes_test')}</button>
            <span id="node-test-result" style="font-size:0.78rem;align-self:center"></span>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  };

  window._testNode = async function() {
    const url = document.getElementById('node-url')?.value?.trim();
    const apiKey = document.getElementById('node-api-key')?.value?.trim();
    const el = document.getElementById('node-test-result');
    if (!url) { if (el) el.textContent = t('settings.nodes_url_required'); return; }
    if (el) { el.textContent = t('settings.nodes_testing'); el.style.color = 'var(--text-muted)'; }
    try {
      const res = await fetch('/api/remote-nodes/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base_url: url, api_key: apiKey || undefined }) }).then(r => r.json());
      if (res.ok) {
        if (el) { el.textContent = `${t('settings.nodes_test_ok')} (${res.printers} ${t('settings.nodes_printers')})`; el.style.color = 'var(--accent-green)'; }
      } else {
        if (el) { el.textContent = res.error || t('settings.nodes_test_fail'); el.style.color = 'var(--accent-red)'; }
      }
    } catch (e) { if (el) { el.textContent = e.message; el.style.color = 'var(--accent-red)'; } }
  };

  window._addNode = async function() {
    const name = document.getElementById('node-name')?.value?.trim();
    const url = document.getElementById('node-url')?.value?.trim();
    const apiKey = document.getElementById('node-api-key')?.value?.trim();
    if (!name || !url) { window.showToast?.(t('settings.nodes_name_url_required'), 'error'); return; }
    await fetch('/api/remote-nodes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, base_url: url, api_key: apiKey || undefined }) });
    document.getElementById('add-node-modal')?.remove();
    window.showToast?.(t('common.saved'), 'success');
    _loadRemoteNodes();
  };

  window._toggleNode = async function(id, enabled) {
    await fetch(`/api/remote-nodes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled }) });
    _loadRemoteNodes();
  };

  window._deleteNode = async function(id) {
    if (!confirm(t('common.confirm_delete'))) return;
    await fetch(`/api/remote-nodes/${id}`, { method: 'DELETE' });
    window.showToast?.(t('common.deleted'), 'success');
    _loadRemoteNodes();
  };

  // ═══ Power Monitor Settings ═══

  let _powerPollTimer = null;

  async function _loadPowerSettings() {
    try {
      const [typeRes, ipRes] = await Promise.all([
        fetch('/api/inventory/settings/power_plug_type').then(r => r.json()),
        fetch('/api/inventory/settings/power_plug_ip').then(r => r.json())
      ]);
      const plugType = typeRes.value || 'none';
      const plugIp = ipRes.value || '';

      const sel = document.getElementById('power-plug-type');
      if (sel) sel.value = plugType;
      const ipInput = document.getElementById('power-plug-ip');
      if (ipInput) ipInput.value = plugIp;

      window._powerPlugTypeChanged();
      if (plugType !== 'none' && plugIp) _startPowerLiveUpdate();
    } catch {}
  }

  window._powerPlugTypeChanged = function() {
    const plugType = document.getElementById('power-plug-type')?.value || 'none';
    const ipCfg = document.getElementById('power-plug-ip-config');
    const testBtn = document.getElementById('power-test-btn');
    if (ipCfg) ipCfg.style.display = plugType !== 'none' ? '' : 'none';
    if (testBtn) testBtn.style.display = plugType !== 'none' ? '' : 'none';
  };

  window._savePowerSettings = async function() {
    const plugType = document.getElementById('power-plug-type')?.value || 'none';
    const plugIp = document.getElementById('power-plug-ip')?.value || '';

    await Promise.all([
      fetch('/api/inventory/settings/power_plug_type', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: plugType }) }),
      fetch('/api/inventory/settings/power_plug_ip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: plugIp }) })
    ]);

    // Restart power monitor service
    await fetch('/api/power/restart', { method: 'POST' });
    window.showToast?.(t('common.saved'), 'success');

    if (plugType !== 'none' && plugIp) {
      _startPowerLiveUpdate();
    } else {
      _stopPowerLiveUpdate();
      const el = document.getElementById('power-live-reading');
      if (el) el.innerHTML = `<div class="text-muted" style="font-size:0.8rem">${t('settings.power_no_data')}</div>`;
    }
  };

  window._testPowerPlug = async function() {
    const el = document.getElementById('power-live-reading');
    if (el) el.innerHTML = `<div class="text-muted" style="font-size:0.8rem">${t('settings.power_testing')}</div>`;
    try {
      const data = await fetch('/api/power/poll', { method: 'POST' }).then(r => r.json());
      if (data.error) {
        if (el) el.innerHTML = `<div style="color:var(--accent-red);font-size:0.85rem">${t('settings.power_test_fail')}: ${data.error}</div>`;
      } else {
        _renderPowerReading(data);
        window.showToast?.(t('settings.power_test_ok'), 'success');
      }
    } catch (e) {
      if (el) el.innerHTML = `<div style="color:var(--accent-red);font-size:0.85rem">${t('settings.power_test_fail')}</div>`;
    }
  };

  function _startPowerLiveUpdate() {
    _stopPowerLiveUpdate();
    _updatePowerReading();
    _powerPollTimer = setInterval(() => _updatePowerReading(), 10_000);
  }

  function _stopPowerLiveUpdate() {
    if (_powerPollTimer) { clearInterval(_powerPollTimer); _powerPollTimer = null; }
  }

  async function _updatePowerReading() {
    try {
      const [current, session] = await Promise.all([
        fetch('/api/power/current').then(r => r.json()),
        fetch('/api/power/session').then(r => r.json())
      ]);
      if (current.watts !== null && current.watts !== undefined) {
        _renderPowerReading(current);
      }
      _renderPowerSession(session);
    } catch {}
  }

  function _renderPowerReading(data) {
    const el = document.getElementById('power-live-reading');
    if (!el || data.watts === null || data.watts === undefined) return;

    const watts = data.watts;
    const color = watts > 200 ? 'var(--accent-red)' : watts > 50 ? 'var(--accent-yellow)' : 'var(--accent-green)';

    let h = `<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end">`;
    h += `<div><span class="text-muted" style="font-size:0.7rem">${t('settings.power_watts')}</span><div style="font-size:1.5rem;font-weight:800;color:${color}">${watts.toFixed(1)} <span style="font-size:0.7rem;font-weight:500">W</span></div></div>`;
    if (data.voltage) h += `<div><span class="text-muted" style="font-size:0.7rem">${t('settings.power_voltage')}</span><div style="font-size:1rem;font-weight:700">${data.voltage.toFixed(1)} V</div></div>`;
    if (data.current) h += `<div><span class="text-muted" style="font-size:0.7rem">${t('settings.power_current')}</span><div style="font-size:1rem;font-weight:700">${data.current.toFixed(2)} A</div></div>`;
    if (data.extra?.temperature) h += `<div><span class="text-muted" style="font-size:0.7rem">${t('settings.power_temp')}</span><div style="font-size:1rem;font-weight:700">${data.extra.temperature}°C</div></div>`;
    h += `</div>`;

    const age = data.timestamp ? Math.round((Date.now() - data.timestamp) / 1000) : 0;
    h += `<div class="text-muted" style="font-size:0.65rem;margin-top:4px">${t('settings.power_updated')} ${age}s ${t('settings.power_ago')}</div>`;

    el.innerHTML = h;
  }

  function _renderPowerSession(data) {
    const el = document.getElementById('power-session-info');
    if (!el) return;
    if (data.error || !data.printId) {
      el.innerHTML = '';
      return;
    }

    let h = `<div style="background:var(--bg-tertiary);padding:8px 12px;border-radius:6px">`;
    h += `<div class="text-muted" style="font-size:0.68rem;margin-bottom:4px">${t('settings.power_active_print')}</div>`;
    h += `<div style="display:flex;gap:12px;flex-wrap:wrap">`;
    h += `<div><span class="text-muted" style="font-size:0.65rem">${t('settings.power_current_w')}</span><div style="font-weight:700">${data.currentWatts} W</div></div>`;
    h += `<div><span class="text-muted" style="font-size:0.65rem">${t('settings.power_avg_w')}</span><div style="font-weight:700">${data.avgWatts} W</div></div>`;
    h += `<div><span class="text-muted" style="font-size:0.65rem">${t('settings.power_peak_w')}</span><div style="font-weight:700">${data.peakWatts} W</div></div>`;
    h += `<div><span class="text-muted" style="font-size:0.65rem">${t('settings.power_total')}</span><div style="font-weight:700">${data.totalWh} Wh</div></div>`;
    h += `<div><span class="text-muted" style="font-size:0.65rem">${t('settings.power_readings')}</span><div style="font-weight:700">${data.readings}</div></div>`;
    h += `</div></div>`;

    el.innerHTML = h;
  }

  // ═══ Export & Import Dashboard Settings ═══

  window._exportDashboardSettings = async function() {
    try {
      const res = await fetch('/api/settings/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bambu-dashboard-settings.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (typeof showToast === 'function') showToast('Innstillinger eksportert', 'success', 3000);
    } catch (e) {
      if (typeof showToast === 'function') showToast('Eksport feilet: ' + e.message, 'error', 4000);
    }
  };

  window._importDashboardSettings = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const statusEl = document.getElementById('settings-import-status');
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data._meta || data._meta.type !== 'bambu-dashboard-settings') {
          throw new Error('Ugyldig innstillingsfil');
        }
        const res = await fetch('/api/settings/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: text
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Import feilet');
        if (statusEl) statusEl.innerHTML = `<span style="color:var(--accent-green);font-size:0.8rem">${result.applied} innstillinger importert</span>`;
        if (typeof showToast === 'function') showToast(`${result.applied} innstillinger importert`, 'success', 3000);
      } catch (err) {
        if (statusEl) statusEl.innerHTML = `<span style="color:var(--accent-red);font-size:0.8rem">${err.message}</span>`;
        if (typeof showToast === 'function') showToast('Import feilet: ' + err.message, 'error', 4000);
      }
    };
    input.click();
  };


})();
