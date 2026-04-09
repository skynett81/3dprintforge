/**
 * Analytics Panel — AWStats-inspired web analytics dashboard
 * Shows: requests/hour, bandwidth, top endpoints, error rates,
 * browser/device breakdown, sessions, WebSocket stats, camera bandwidth
 */
(function() {
  'use strict';

  window.loadAnalyticsPanel = function() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;
    panel.innerHTML = '<div class="text-muted" style="padding:20px;text-align:center">Loading analytics...</div>';
    _fetchAndRender(panel);
  };

  async function _fetchAndRender(panel) {
    try {
      const [overview, hourly, topEndpoints, sessions, errors] = await Promise.all([
        fetch('/api/analytics/overview').then(r => r.json()),
        fetch('/api/analytics/hourly?days=7').then(r => r.json()),
        fetch('/api/analytics/top-endpoints').then(r => r.json()),
        fetch('/api/analytics/sessions').then(r => r.json()),
        fetch('/api/analytics/errors').then(r => r.json()),
      ]);

      let html = '<div class="analytics-layout" style="display:flex;flex-direction:column;gap:14px">';

      // ── Overview Cards ──
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px">';
      html += _statCard('Requests Today', overview.today?.requests || 0, '📊');
      html += _statCard('Errors Today', overview.today?.errors || 0, '⚠️', overview.today?.errors > 0 ? 'var(--accent-red)' : '');
      html += _statCard('Bandwidth', _fmtBytes(overview.today?.bytes || 0), '📡');
      html += _statCard('Avg Response', (overview.today?.avgResponseMs || 0) + 'ms', '⚡');
      html += _statCard('Active Sessions', overview.activeSessions || 0, '👥');
      html += _statCard('WS Connections', overview.websocket?.connections || 0, '🔌');
      html += '</div>';

      // ── Requests per Hour Chart ──
      html += `<div class="settings-card" style="overflow:hidden">
        <div class="card-title">Requests per Hour (7 days)</div>
        <canvas id="analytics-hourly-chart" width="400" height="160" style="width:100%;height:160px;display:block"></canvas>
      </div>`;

      // ── Grid for details ──
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">';

      // ── Top Endpoints ──
      html += `<div class="settings-card" style="overflow:hidden">
        <div class="card-title">Top Endpoints (24h)</div>
        <div style="max-height:250px;overflow-y:auto">
          ${topEndpoints.length ? topEndpoints.map((ep, i) => `
            <div style="display:flex;align-items:center;gap:6px;padding:4px 0;font-size:0.72rem;border-bottom:1px solid var(--border-subtle)">
              <span style="width:20px;text-align:right;color:var(--text-muted)">${i + 1}</span>
              <span style="flex:1;font-family:monospace;font-size:0.65rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ep.endpoint}</span>
              <span style="font-weight:600;min-width:40px;text-align:right">${ep.hits}</span>
              ${ep.errors > 0 ? `<span style="color:var(--accent-red);font-size:0.6rem">${ep.errors}err</span>` : ''}
              <span style="color:var(--text-muted);font-size:0.6rem;min-width:35px;text-align:right">${ep.avgMs}ms</span>
            </div>`).join('') : '<div class="text-muted" style="padding:8px;font-size:0.72rem">No data yet — analytics collect after first hour</div>'}
        </div>
      </div>`;

      // ── Device/Browser Breakdown ──
      html += `<div class="settings-card" style="overflow:hidden">
        <div class="card-title">Devices & Browsers</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <div style="font-size:0.72rem;font-weight:600;margin-bottom:4px">Devices</div>
            ${Object.entries(overview.devices || {}).filter(([,v]) => v > 0).map(([type, count]) => `
              <div style="display:flex;justify-content:space-between;font-size:0.68rem;padding:2px 0">
                <span>${type}</span><strong>${count}</strong>
              </div>`).join('') || '<div class="text-muted" style="font-size:0.68rem">No data</div>'}
          </div>
          <div>
            <div style="font-size:0.72rem;font-weight:600;margin-bottom:4px">Browsers</div>
            ${Object.entries(overview.browsers || {}).filter(([,v]) => v > 0).map(([name, count]) => `
              <div style="display:flex;justify-content:space-between;font-size:0.68rem;padding:2px 0">
                <span>${name}</span><strong>${count}</strong>
              </div>`).join('') || '<div class="text-muted" style="font-size:0.68rem">No data</div>'}
          </div>
        </div>
      </div>`;

      // ── Active Sessions ──
      html += `<div class="settings-card" style="overflow:hidden">
        <div class="card-title">Active Sessions (last hour)</div>
        <div style="max-height:200px;overflow-y:auto">
          ${sessions.length ? sessions.map(s => `
            <div style="display:flex;align-items:center;gap:6px;padding:4px 0;font-size:0.68rem;border-bottom:1px solid var(--border-subtle)">
              <span style="width:8px;height:8px;border-radius:50%;background:var(--accent-green)"></span>
              <span style="flex:1;font-family:monospace">${s.ip}</span>
              <span class="text-muted">${s.device_type}</span>
              <span style="font-weight:600">${s.hits} hits</span>
            </div>`).join('') : '<div class="text-muted" style="padding:8px;font-size:0.72rem">No active sessions</div>'}
        </div>
      </div>`;

      // ── Error Breakdown ──
      if (errors.length > 0) {
        html += `<div class="settings-card" style="overflow:hidden">
          <div class="card-title" style="color:var(--accent-red)">Error Endpoints (24h)</div>
          ${errors.map(e => `
            <div style="display:flex;align-items:center;gap:6px;padding:3px 0;font-size:0.68rem">
              <span style="color:var(--accent-red);font-weight:600;min-width:25px">${e.count}×</span>
              <span style="font-family:monospace;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.endpoint}</span>
            </div>`).join('')}
        </div>`;
      }

      // ── WebSocket Stats ──
      html += `<div class="settings-card" style="overflow:hidden">
        <div class="card-title">WebSocket & Camera</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.72rem">
          <div style="padding:6px;background:var(--bg-inset);border-radius:4px">WS Connections: <strong>${overview.websocket?.connections || 0}</strong></div>
          <div style="padding:6px;background:var(--bg-inset);border-radius:4px">Messages In: <strong>${overview.websocket?.messagesIn || 0}</strong></div>
          <div style="padding:6px;background:var(--bg-inset);border-radius:4px">Messages Out: <strong>${overview.websocket?.messagesOut || 0}</strong></div>
          <div style="padding:6px;background:var(--bg-inset);border-radius:4px">WS Bytes: <strong>${_fmtBytes((overview.websocket?.bytesIn || 0) + (overview.websocket?.bytesOut || 0))}</strong></div>
        </div>
        ${Object.keys(overview.camera || {}).length > 0 ? `
          <div style="margin-top:8px;font-size:0.72rem;font-weight:600">Camera Streams</div>
          ${Object.entries(overview.camera).map(([pid, stats]) => `
            <div style="display:flex;justify-content:space-between;font-size:0.68rem;padding:2px 0">
              <span>${pid}</span><span>${stats.streams} streams · ${_fmtBytes(stats.bytes)}</span>
            </div>`).join('')}
        ` : ''}
      </div>`;

      // ── OS Breakdown ──
      html += `<div class="settings-card" style="overflow:hidden">
        <div class="card-title">Operating Systems</div>
        ${Object.entries(overview.os || {}).filter(([,v]) => v > 0).map(([name, count]) => `
          <div style="display:flex;justify-content:space-between;font-size:0.68rem;padding:2px 0">
            <span>${name}</span><strong>${count}</strong>
          </div>`).join('') || '<div class="text-muted" style="font-size:0.68rem">No data</div>'}
      </div>`;

      html += '</div>'; // close detail grid
      html += '</div>'; // close analytics-layout
      panel.innerHTML = html;

      // Draw hourly chart
      setTimeout(() => _drawHourlyChart(hourly), 100);

    } catch (e) {
      panel.innerHTML = `<div class="alert alert-danger" style="margin:20px">Analytics error: ${e.message}</div>`;
    }
  }

  function _drawHourlyChart(hourly) {
    const canvas = document.getElementById('analytics-hourly-chart');
    if (!canvas || !hourly.length) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const pad = { top: 10, right: 10, bottom: 20, left: 40 };

    ctx.clearRect(0, 0, W, H);

    const maxReq = Math.max(...hourly.map(h => h.requests), 1);
    const graphW = W - pad.left - pad.right;
    const graphH = H - pad.top - pad.bottom;
    const barW = Math.max(2, graphW / hourly.length - 1);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (graphH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '9px monospace'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxReq * (1 - i / 4)), pad.left - 4, y + 3);
    }

    // Bars
    for (let i = 0; i < hourly.length; i++) {
      const h = hourly[i];
      const barH = (h.requests / maxReq) * graphH;
      const x = pad.left + (i / hourly.length) * graphW;
      const y = pad.top + graphH - barH;

      ctx.fillStyle = h.errors > 0 ? 'rgba(255,82,82,0.7)' : 'rgba(0,230,118,0.5)';
      ctx.fillRect(x, y, barW, barH);
    }
  }

  function _statCard(label, value, icon, color) {
    return `<div class="settings-card" style="padding:10px;text-align:center">
      <div style="font-size:1.4rem">${icon}</div>
      <div style="font-size:1.1rem;font-weight:700;${color ? 'color:' + color : ''}">${value}</div>
      <div style="font-size:0.65rem;color:var(--text-muted)">${label}</div>
    </div>`;
  }

  function _fmtBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }
})();
