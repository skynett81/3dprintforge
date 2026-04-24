// inventory-enhancements.js — wires the new 2026 inventory features into
// the existing filament-tracker DOM: expires-date badges on spool cards,
// climate-alert banner for locations, drag-drop spools between locations,
// and a Spoolman live-status indicator that updates via WebSocket.

(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ──────────────────────────────────────────────────────────────────────
  // 1. Expires-date badges
  // Decorates every .spool-card with an expiry badge when `data-expires-date`
  // is present. Run it whenever the filament-tracker re-renders the grid.
  // ──────────────────────────────────────────────────────────────────────
  function daysUntil(iso) {
    const now = new Date();
    const d = new Date(iso);
    return Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  }

  function decorateExpiryBadges(root) {
    const scope = root || document;
    scope.querySelectorAll('.spool-card[data-expires-date]').forEach(card => {
      if (card.querySelector('.fil-expiry-badge')) return;
      const iso = card.getAttribute('data-expires-date');
      if (!iso) return;
      const days = daysUntil(iso);
      let cls, label;
      if (days < 0) { cls = 'badge bg-danger'; label = `Expired ${-days}d ago`; }
      else if (days < 7) { cls = 'badge bg-warning'; label = `Expires in ${days}d`; }
      else if (days < 30) { cls = 'badge bg-info'; label = `Expires in ${days}d`; }
      else return; // Not urgent — skip badge
      const el = document.createElement('span');
      el.className = `fil-expiry-badge ${cls}`;
      el.style.cssText = 'position:absolute;top:4px;right:4px;font-size:0.65rem';
      el.innerHTML = `<i class="bi bi-hourglass-split"></i> ${esc(label)}`;
      card.style.position = card.style.position || 'relative';
      card.appendChild(el);
    });
  }

  // QR + label buttons per spool card.
  // Cards that expose `data-spool-id` get two compact icon buttons in the
  // bottom-right corner: QR preview and label print.
  function decorateQrLabelButtons(root) {
    const scope = root || document;
    scope.querySelectorAll('.spool-card[data-spool-id]').forEach(card => {
      if (card.querySelector('.fil-qr-btn')) return;
      const id = card.getAttribute('data-spool-id');
      if (!id) return;
      const wrap = document.createElement('div');
      wrap.className = 'fil-qr-label-wrap';
      wrap.style.cssText = 'position:absolute;bottom:4px;right:4px;display:flex;gap:4px;z-index:2';
      wrap.innerHTML = `
        <button class="fil-qr-btn" title="Show QR" style="border:0;background:rgba(0,0,0,0.5);color:#fff;border-radius:3px;padding:2px 6px;font-size:0.7rem">
          <i class="bi bi-qr-code"></i>
        </button>
        <a class="fil-label-btn" title="Print label" href="/api/inventory/spools/${encodeURIComponent(id)}/label" target="_blank"
          style="border:0;background:rgba(0,0,0,0.5);color:#fff;border-radius:3px;padding:2px 6px;font-size:0.7rem;text-decoration:none">
          <i class="bi bi-printer"></i>
        </a>`;
      card.style.position = card.style.position || 'relative';
      card.appendChild(wrap);
      wrap.querySelector('.fil-qr-btn').addEventListener('click', (e) => {
        e.preventDefault();
        showQrOverlay(id);
      });
    });
  }

  function showQrOverlay(spoolId) {
    const existing = document.getElementById('fil-qr-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'fil-qr-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:10000;display:flex;align-items:center;justify-content:center';
    overlay.innerHTML = `
      <div style="background:#fff;padding:16px;border-radius:8px;text-align:center">
        <img src="/api/inventory/spools/${encodeURIComponent(spoolId)}/qr.png" alt="QR" style="display:block;width:256px;height:256px;margin:auto">
        <div style="margin-top:8px;font-size:0.85rem;color:#000">Spool #${esc(spoolId)}</div>
        <button class="form-btn form-btn-sm" style="margin-top:8px" onclick="document.getElementById('fil-qr-overlay').remove()">Close</button>
      </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // Rewrite community-filament image URLs to go through our local cache.
  // Any <img data-external-src="https://..."> becomes <img src="/api/filament-image?url=...">.
  function rewriteImageSources(root) {
    const scope = root || document;
    scope.querySelectorAll('img[data-external-src]').forEach(img => {
      if (img.dataset._proxied) return;
      const src = img.getAttribute('data-external-src');
      if (!src) return;
      img.dataset._proxied = '1';
      img.src = '/api/filament-image?url=' + encodeURIComponent(src);
      img.addEventListener('error', () => {
        // Cache miss falls through to the original URL (no local copy yet).
        img.src = src;
      }, { once: true });
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // 2. Climate-alert banner
  // Polls /api/inventory/location-alerts every 60s and renders out-of-range
  // temp/humidity + capacity violations above the inventory area.
  // ──────────────────────────────────────────────────────────────────────
  async function refreshLocationAlerts() {
    const target = document.getElementById('inventory-climate-alerts');
    if (!target) return;
    try {
      const res = await fetch('/api/inventory/location-alerts');
      if (!res.ok) return;
      const alerts = await res.json();
      if (!Array.isArray(alerts) || alerts.length === 0) {
        target.innerHTML = '';
        target.style.display = 'none';
        return;
      }
      const rows = alerts.map(a => {
        const kind = {
          temp_low: '🥶 Temperature below min', temp_high: '🔥 Temperature above max',
          humidity_low: '🏜 Humidity below min', humidity_high: '💧 Humidity above max',
          min_spools: '📉 Below min spool count', max_spools: '📈 Above max spool count',
          min_weight: '⬇️ Below min weight', max_weight: '⬆️ Above max weight',
        }[a.type] || a.type;
        const sinceStr = a.since ? ` (since ${new Date(a.since).toLocaleString()})` : '';
        return `<li><strong>${esc(a.location)}</strong>: ${kind} — current ${esc(a.current)}, threshold ${esc(a.threshold)}${esc(sinceStr)}</li>`;
      }).join('');
      target.innerHTML = `
        <div class="alert alert-warning mb-3" role="alert">
          <div class="d-flex align-items-center mb-1">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Location alerts (${alerts.length})</strong>
          </div>
          <ul class="mb-0 small">${rows}</ul>
        </div>`;
      target.style.display = '';
    } catch { /* ignore */ }
  }

  // ──────────────────────────────────────────────────────────────────────
  // 3. Drag-drop spools between locations
  // Any element with [data-drag-spool="<id>"] can be dragged onto any
  // element with [data-drop-location="<id>"]. On drop we PATCH the spool.
  // ──────────────────────────────────────────────────────────────────────
  function enableSpoolDragDrop(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-drag-spool]').forEach(el => {
      if (el.dataset._ddBound) return;
      el.dataset._ddBound = '1';
      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('application/x-3dpf-spool-id', el.getAttribute('data-drag-spool'));
        e.dataTransfer.effectAllowed = 'move';
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
    });
    scope.querySelectorAll('[data-drop-location]').forEach(el => {
      if (el.dataset._ddBound) return;
      el.dataset._ddBound = '1';
      el.addEventListener('dragover', (e) => {
        if ([...e.dataTransfer.types].includes('application/x-3dpf-spool-id')) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          el.classList.add('drop-target');
        }
      });
      el.addEventListener('dragleave', () => el.classList.remove('drop-target'));
      el.addEventListener('drop', async (e) => {
        e.preventDefault();
        el.classList.remove('drop-target');
        const spoolId = e.dataTransfer.getData('application/x-3dpf-spool-id');
        const locationId = el.getAttribute('data-drop-location');
        if (!spoolId || !locationId) return;
        try {
          const res = await fetch(`/api/spools/${encodeURIComponent(spoolId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location_id: parseInt(locationId, 10) }),
          });
          if (res.ok) {
            if (window.showToast) window.showToast('Spool moved', 'success');
            if (typeof window.refreshInventory === 'function') window.refreshInventory();
          } else if (window.showToast) {
            window.showToast('Move failed: ' + res.status, 'error');
          }
        } catch (err) {
          if (window.showToast) window.showToast('Move failed: ' + err.message, 'error');
        }
      });
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // 4. Spoolman live-status (WebSocket → dashboard indicator)
  // ──────────────────────────────────────────────────────────────────────
  const spoolmanState = { connected: null, pending: [] };
  function renderSpoolmanStatusBadge() {
    const el = document.getElementById('spoolman-status-badge');
    if (!el) return;
    if (spoolmanState.connected === null) { el.innerHTML = ''; return; }
    const cls = spoolmanState.connected ? 'bg-success' : 'bg-danger';
    const label = spoolmanState.connected ? 'Spoolman online' : 'Spoolman offline';
    const pending = spoolmanState.pending.length;
    el.innerHTML = `
      <span class="badge ${cls}"><i class="bi bi-cloud${spoolmanState.connected ? '-check' : '-slash'}"></i> ${label}${pending ? ` · ${pending} pending` : ''}</span>`;
  }

  window._wsListeners = window._wsListeners || [];
  window._wsListeners.push((msg) => {
    if (msg?.type === 'spoolman_status' && msg.data) {
      if ('spoolman_connected' in msg.data) spoolmanState.connected = !!msg.data.spoolman_connected;
      if (Array.isArray(msg.data.pending_reports)) spoolmanState.pending = msg.data.pending_reports;
      renderSpoolmanStatusBadge();
    }
    if (msg?.type === 'spoolman_active_spool' && typeof window.refreshInventory === 'function') {
      window.refreshInventory();
    }
  });

  // ──────────────────────────────────────────────────────────────────────
  // Kick-off on DOM ready + re-run on inventory re-renders
  // ──────────────────────────────────────────────────────────────────────
  function refreshAll() {
    decorateExpiryBadges();
    enableSpoolDragDrop();
    decorateQrLabelButtons();
    rewriteImageSources();
    renderSpoolmanStatusBadge();
  }

  window.inventoryEnhancements = { refreshAll, refreshLocationAlerts };

  document.addEventListener('DOMContentLoaded', () => {
    refreshAll();
    refreshLocationAlerts();
    setInterval(refreshLocationAlerts, 60_000);
  });

  // Observe the document for re-rendered inventory grids so we re-apply
  // badges + drag handles without needing every caller to invoke us.
  const mo = new MutationObserver(() => refreshAll());
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('filament-tracker-root') || document.body;
    mo.observe(root, { childList: true, subtree: true });
  });
})();
