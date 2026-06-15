// vendor-diagnostics-2026.js — Admin / power-user tools exposed to the UI:
//   - CAN-bus node scan (Klipper + Katapult setup wizard)
//   - Input-shaper tuning (MEASURE_AXES_NOISE, SHAPER_CALIBRATE, TEST_RESONANCES)
//   - Moonraker history CRUD (reset totals, delete job)
//   - Notifier test-trigger
//   - Full update runner
//   - TigerTag NFC manual lookup
//
// Renders into <div id="vendor-diagnostics-2026"> (settings → diagnostics tab).
// Commands go through the same WS sendCommand() pipeline used elsewhere.

(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  let canbusResult = null;
  let tigerTagResult = null;

  window._wsListeners = window._wsListeners || [];
  window._wsListeners.push((msg) => {
    if (msg?.type === 'moonraker_canbus_scan' && msg.data) {
      canbusResult = msg.data;
      render();
    }
  });

  const t = (key, fb) => (typeof window.t === 'function' ? window.t(key, fb) : fb);

  function render() {
    const el = document.getElementById('vendor-diagnostics-2026');
    if (!el) return;

    // Collapsible tool card with a clean header + chevron (shared .atool-* styling).
    const card = (icon, title, body, opts = {}) => `
      <details class="card atool-card" ${opts.open !== false ? 'open' : ''}>
        <summary class="atool-card-head"><i class="bi bi-${icon} atool-card-icon"></i><span>${title}</span><i class="bi bi-chevron-right atool-chev"></i></summary>
        <div class="atool-card-body">${body}</div>
      </details>`;
    const ghost = (onclick, label, extra = '') => `<button class="form-btn form-btn-sm form-btn-ghost" onclick="${onclick}" ${extra}>${label}</button>`;
    const danger = (onclick, label, extra = '') => `<button class="form-btn form-btn-sm form-btn-ghost" style="color:var(--accent-red)" onclick="${onclick}" ${extra}>${label}</button>`;

    el.innerHTML = `
      <div class="card atool-actionbar">
        <span class="atool-actionbar-label">${t('admin_diag.quick_actions', 'Quick actions')}</span>
        ${ghost('_vd2026.updateRefresh()', '<i class="bi bi-arrow-clockwise"></i> ' + t('admin_diag.refresh_updates', 'Refresh updates'), 'title="Refresh Moonraker update-manager status"')}
        ${ghost('_vd2026.shaperMeasure()', '<i class="bi bi-soundwave"></i> ' + t('admin_diag.measure_noise', 'Measure axes noise'), 'title="MEASURE_AXES_NOISE — captures baseline noise on each axis"')}
        ${danger('_vd2026.updateFull()', '<i class="bi bi-cloud-download"></i> ' + t('admin_diag.run_full_update', 'Run full update'), 'title="Run klipper + moonraker + system + web update; reboots services"')}
        ${danger('_vd2026.historyResetTotals()', '<i class="bi bi-eraser"></i> ' + t('admin_diag.reset_totals', 'Reset history totals'), 'title="Reset lifetime filament/time totals — irreversible"')}
      </div>

      <div class="atool-grid">

        ${card('soundwave', t('admin_diag.input_shaper', 'Input shaper tuning'), `
          <div class="atool-toolgrid">
            ${ghost("_vd2026.shaperCalibrate('X')", t('admin_diag.calibrate_x', 'Calibrate X'))}
            ${ghost("_vd2026.shaperCalibrate('Y')", t('admin_diag.calibrate_y', 'Calibrate Y'))}
            ${ghost("_vd2026.shaperTest('X')", 'TEST_RESONANCES X')}
            ${ghost("_vd2026.shaperTest('Y')", 'TEST_RESONANCES Y')}
          </div>
          <div class="atool-hint">${t('admin_diag.shaper_hint', 'Results are saved to')} <code>/tmp/resonances_*.csv</code> ${t('admin_diag.on_host', 'on the printer host')}.</div>`)}

        ${card('hdd-network', t('admin_diag.canbus_scan', 'CAN-bus node scan'), `
          <p class="atool-hint">${t('admin_diag.canbus_desc', 'Detect unassigned Klipper + Katapult nodes on a CAN interface.')}</p>
          <div class="atool-toolrow">
            <input class="form-input form-input-sm" id="vd-canbus-iface" value="can0" placeholder="can0" style="flex:1;min-width:80px;max-width:120px">
            ${ghost('_vd2026.canbusScan()', t('admin_diag.scan', 'Scan'))}
          </div>
          <div id="vd-canbus-result" class="atool-result">${renderCanbus()}</div>`)}

        ${card('clock-history', t('admin_diag.moonraker_history', 'Moonraker history'), `
          <p class="atool-hint">${t('admin_diag.history_desc', 'Delete a single job by UID. Lifetime totals are reset from the Quick actions bar.')}</p>
          <div class="atool-toolrow">
            <input class="form-input form-input-sm" id="vd-history-uid" placeholder="${t('admin_diag.job_uid', 'Job UID')}" style="flex:1;min-width:120px">
            ${danger('_vd2026.historyDelete()', t('admin_diag.delete_job', 'Delete job'))}
          </div>`)}

        ${card('bell', t('admin_diag.notifier_test', 'Notifier test'), `
          <p class="atool-hint">${t('admin_diag.notifier_desc', 'Sends a synthetic notification through a notifier defined in')} <code>moonraker.conf</code>.</p>
          <div class="atool-toolrow">
            <input class="form-input form-input-sm" id="vd-notifier-name" placeholder="${t('admin_diag.notifier_name', 'Notifier name')}" style="flex:1;min-width:140px">
            ${ghost('_vd2026.notifierTest()', t('admin_diag.send_test', 'Send test'))}
          </div>`)}

        ${card('tag', t('admin_diag.tigertag_lookup', 'TigerTag NFC lookup'), `
          <p class="atool-hint">${t('admin_diag.tigertag_desc', 'Resolve a filament NFC tag UID against the offline DB + online TigerTag lookup.')}</p>
          <div class="atool-toolrow">
            <input class="form-input form-input-sm" id="vd-tigertag-uid" placeholder="${t('admin_diag.tag_uid', 'Tag UID')} (DEAD:BEEF:01:02)" style="flex:1;min-width:160px">
            ${ghost('_vd2026.tigertagLookup()', t('admin_diag.look_up', 'Look up'))}
          </div>
          <div id="vd-tigertag-result" class="atool-result">${renderTigerTag()}</div>`)}
      </div>
    `;
  }

  function renderCanbus() {
    if (!canbusResult) return '';
    if (canbusResult.ok) {
      if (!canbusResult.uuids?.length) return `<span class="atool-empty">${t('admin_diag.no_nodes', 'Scan on')} ${esc(canbusResult.interface)} ${t('admin_diag.found_no_nodes', 'found no unassigned nodes.')}</span>`;
      return canbusResult.uuids.map(u => `<code>${esc(u.uuid)}</code> (${esc(u.application || 'unknown')})`).join(', ');
    }
    return `<span class="atool-result-err">${t('admin_diag.scan_failed', 'Scan failed')} (${esc(canbusResult.error?.code)}): ${esc(canbusResult.error?.message)}</span>`;
  }

  function renderTigerTag() {
    if (!tigerTagResult) return '';
    if (tigerTagResult.error) return `<span class="atool-result-err">${esc(tigerTagResult.error)}</span>`;
    if (!tigerTagResult.profile) return `<span class="atool-empty">${t('admin_diag.no_tag_match', 'No match in offline DB or online lookup.')}</span>`;
    const p = tigerTagResult.profile;
    return `<strong>${esc(p.vendor || '?')}</strong> ${esc(p.material || '')} ${esc(p.colorName || '')} ${p.color ? '<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:#' + esc(p.color) + ';border:1px solid var(--border-color);vertical-align:middle"></span>' : ''} — <span class="text-muted">${esc(p.source)}</span>`;
  }

  function sendCmd(action, extra = {}) {
    if (typeof window.sendCommand === 'function') window.sendCommand(action, extra);
  }

  window._vd2026 = {
    canbusScan() {
      const iface = document.getElementById('vd-canbus-iface')?.value.trim() || 'can0';
      canbusResult = { ok: true, uuids: [], interface: iface, error: null };
      render();
      sendCmd('canbus_scan', { interface: iface });
    },
    shaperMeasure() { sendCmd('input_shaper_measure'); },
    shaperCalibrate(axis) { sendCmd('input_shaper_calibrate', { axis }); },
    shaperTest(axis) { sendCmd('input_shaper_test', { axis, output: 'resonances' }); },
    updateRefresh() { sendCmd('update_refresh'); },
    updateFull() {
      if (!confirm('Run a full update (klipper + moonraker + system + web)? This reboots services.')) return;
      sendCmd('update_full');
    },
    historyDelete() {
      const uid = document.getElementById('vd-history-uid')?.value.trim();
      if (!uid) return;
      sendCmd('history_delete', { uid });
    },
    historyResetTotals() {
      if (!confirm('Reset lifetime filament/time totals? This cannot be undone.')) return;
      sendCmd('history_reset_totals');
    },
    notifierTest() {
      const name = document.getElementById('vd-notifier-name')?.value.trim();
      if (!name) return;
      sendCmd('notifier_test', { name });
    },
    async tigertagLookup() {
      const uid = document.getElementById('vd-tigertag-uid')?.value.trim();
      if (!uid) return;
      tigerTagResult = { profile: null };
      render();
      try {
        const res = await fetch(`/api/tigertag/lookup?uid=${encodeURIComponent(uid)}`);
        const data = await res.json();
        tigerTagResult = data;
      } catch (e) {
        tigerTagResult = { error: e.message };
      }
      render();
    },
  };

  // Expose render for panel loader (component lives in a lazy-rendered panel
  // now — the sidebar "admin-diagnostics" entry injects the container then
  // calls this function). Also render on DOMContentLoaded for backwards-
  // compatible setups that still embed the container on the dashboard.
  window.renderVendorDiagnostics2026 = render;
  document.addEventListener('DOMContentLoaded', render);
})();
