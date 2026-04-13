// Firmware Updates Panel — unified view of firmware updates across all printers
(function() {
  'use strict';

  let _updates = [];
  let _lastCheckAt = null;
  let _checking = false;

  function _esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function formatDate(iso) {
    if (!iso) return '--';
    const locale = (window.i18n?.getLocale() || 'en').replace('_', '-');
    return new Date(iso).toLocaleString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  async function fetchStatus() {
    try {
      const res = await fetch('/api/firmware/updates');
      if (!res.ok) return;
      const data = await res.json();
      _updates = Array.isArray(data?.availableUpdates) ? data.availableUpdates : [];
      _lastCheckAt = data?.lastCheckAt || null;
      _render();
    } catch {}
  }

  async function checkNow() {
    if (_checking) return;
    _checking = true;
    _render();
    try {
      await fetch('/api/firmware/check-now', { method: 'POST' });
      showToast('Firmware check started — this may take a minute', 'info');
      // Poll for results
      setTimeout(fetchStatus, 10000);
      setTimeout(fetchStatus, 30000);
      setTimeout(() => { _checking = false; _render(); }, 60000);
    } catch (e) {
      _checking = false;
      showToast('Check failed: ' + e.message, 'error');
      _render();
    }
  }

  async function checkPrinter(printerId) {
    try {
      const res = await fetch('/api/firmware/check/' + encodeURIComponent(printerId), { method: 'POST' });
      const data = await res.json();
      if (data.available) {
        showToast(`Update available for ${printerId}: ${data.current} → ${data.latest}`, 'info');
      } else {
        showToast(`${printerId} is up to date (${data.current})`, 'success');
      }
      fetchStatus();
    } catch (e) {
      showToast('Check failed: ' + e.message, 'error');
    }
  }

  async function triggerUpdate(printerId) {
    if (!confirm(`Trigger firmware update on ${printerId}? This will start the update process on the printer.`)) return;
    try {
      const res = await fetch('/api/firmware/trigger/' + encodeURIComponent(printerId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Update triggered: ' + (data.message || 'OK'), 'success');
      } else {
        showToast('Trigger failed: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (e) {
      showToast('Trigger failed: ' + e.message, 'error');
    }
  }

  function showToast(msg, type) {
    if (window.showToast) window.showToast(msg, type);
    else console.log(`[toast ${type}] ${msg}`);
  }

  function _render() {
    const container = document.getElementById('firmware-updates-panel');
    if (!container) return;

    const updatesCount = _updates.length;
    const badgeClass = updatesCount > 0 ? 'badge-warning' : 'badge-success';

    let html = `
      <div class="card card-outline ${updatesCount > 0 ? 'card-warning' : 'card-success'}">
        <div class="card-header">
          <h3 class="card-title">
            <i class="bi bi-cloud-download"></i> Firmware Updates
            <span class="badge ${badgeClass}">${updatesCount} available</span>
          </h3>
          <div class="card-tools">
            <button class="btn btn-sm btn-primary" id="fw-check-now-btn" ${_checking ? 'disabled' : ''}>
              <i class="bi bi-arrow-repeat ${_checking ? 'spin' : ''}"></i>
              ${_checking ? 'Checking...' : 'Check Now'}
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="text-muted small mb-2">Last checked: ${_lastCheckAt ? formatDate(_lastCheckAt) : 'Never'}</div>`;

    if (updatesCount === 0) {
      html += `<p class="text-success mb-0"><i class="bi bi-check-circle"></i> All printers are up to date</p>`;
    } else {
      html += `<div class="list-group list-group-flush">`;
      for (const u of _updates) {
        const name = _esc(u.printer_name || u.printer_id);
        html += `
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${name}</strong>
              <div class="text-muted small">
                ${_esc(u.sw_ver || '?')} → <strong>${_esc(u.latest_available || '?')}</strong>
                ${u.release_url ? `<a href="${_esc(u.release_url)}" target="_blank" rel="noopener">release notes</a>` : ''}
              </div>
              ${u.changelog ? `<div class="text-muted small mt-1" style="max-height:60px;overflow-y:auto">${_esc(u.changelog).slice(0, 300)}</div>` : ''}
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary" onclick="window._fwCheck('${_esc(u.printer_id)}')" title="Recheck">
                <i class="bi bi-arrow-repeat"></i>
              </button>
              <button class="btn btn-sm btn-warning" onclick="window._fwTrigger('${_esc(u.printer_id)}')" title="Install update">
                <i class="bi bi-download"></i> Update
              </button>
            </div>
          </div>`;
      }
      html += `</div>`;
    }

    html += `
        </div>
      </div>`;

    container.innerHTML = html;

    const btn = document.getElementById('fw-check-now-btn');
    if (btn) btn.addEventListener('click', checkNow);
  }

  // Expose action handlers for inline onclick
  window._fwCheck = checkPrinter;
  window._fwTrigger = triggerUpdate;
  window.loadFirmwareUpdatesPanel = fetchStatus;

  // Listen for WebSocket firmware check events
  if (!window._fwWsListener) {
    window._fwWsListener = true;
    const origOnMsg = window._wsOnMessage;
    document.addEventListener('ws:firmware_check_complete', () => fetchStatus());
  }

  // Auto-load on DOM ready if container exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('firmware-updates-panel')) fetchStatus();
  });
})();
