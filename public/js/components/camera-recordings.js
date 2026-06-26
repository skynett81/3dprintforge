// camera-recordings.js — record a printer's live camera to MP4 and manage the
// saved clips. Exposes:
//   window._toggleCameraRecording(printerId, btn)  start/stop the recording
//   window._initRecordBtn(printerId, btn)          reflect ongoing state
//   window._showRecordings(printerId)              modal: list/play/download/delete
(function () {
  'use strict';

  const t = (k, f) => (window.t ? window.t(k, f) : (typeof f === 'string' ? f : k));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (m, k) => (window.showToast ? window.showToast(m, k) : void 0);

  async function _json(url, opts) {
    const r = await fetch(url, opts);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `${r.status}`);
    return d;
  }

  function _fmtBytes(n) {
    if (!n) return '–';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + ' GB';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + ' MB';
    return Math.max(1, Math.round(n / 1e3)) + ' KB';
  }
  function _fmtDur(s) {
    s = Math.round(s || 0);
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  function _setBtnRecording(btn, on) {
    if (!btn) return;
    btn.classList.toggle('rec-active', !!on);
    btn.title = on ? t('camera.stop_record', 'Stop recording') : t('camera.record', 'Record video');
  }

  window._initRecordBtn = async function (pid, btn) {
    if (!pid || !btn) return;
    try {
      const s = await _json(`/api/printers/${encodeURIComponent(pid)}/recording/status`);
      btn.style.display = s.supported ? '' : 'none';
      _setBtnRecording(btn, s.recording);
    } catch { /* leave as-is */ }
  };

  window._toggleCameraRecording = async function (pid, btn) {
    if (!pid) return;
    const recording = btn && btn.classList.contains('rec-active');
    try {
      if (recording) {
        await _json(`/api/printers/${encodeURIComponent(pid)}/recording/stop`, { method: 'POST' });
        _setBtnRecording(btn, false);
        toast(t('camera.recording_saved', 'Recording saved'), 'success');
      } else {
        await _json(`/api/printers/${encodeURIComponent(pid)}/recording/start`, { method: 'POST' });
        _setBtnRecording(btn, true);
        toast(t('camera.recording_started', 'Recording…'), 'info');
      }
    } catch (e) { toast(e.message, 'error'); }
  };

  window._showRecordings = async function (pid) {
    const overlay = document.createElement('div');
    overlay.className = 'ph-detail-overlay rec-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="rec-dialog"><div class="rec-head">
      <span class="rec-title">${t('camera.recordings', 'Recordings')}</span>
      <button class="co-x" onclick="this.closest('.rec-overlay').remove()">&times;</button>
    </div><div class="rec-body">${t('common.loading', 'Loading…')}</div></div>`;
    document.body.appendChild(overlay);
    const body = overlay.querySelector('.rec-body');
    try {
      const list = await _json('/api/recordings' + (pid ? `?printer_id=${encodeURIComponent(pid)}` : ''));
      window._recRender(body, list);
    } catch (e) { body.innerHTML = `<div class="alert alert-danger">${esc(e.message)}</div>`; }
  };

  window._recRender = function (body, list) {
    if (!list.length) {
      body.innerHTML = `<p class="text-muted" style="padding:12px">${t('camera.no_recordings', 'No recordings yet. Press the red dot on the camera to start one.')}</p>`;
      return;
    }
    body.innerHTML = list.map(r => {
      const dt = String(r.started_at || '').slice(0, 16).replace('T', ' ');
      const badge = r.status === 'recording' ? `<span class="rec-badge rec-badge-live">${t('camera.recording', '● recording')}</span>`
        : r.status === 'failed' ? `<span class="rec-badge rec-badge-fail">${t('camera.failed', 'failed')}</span>`
        : `<span class="rec-meta">${_fmtDur(r.duration_s)} · ${_fmtBytes(r.size_bytes)}</span>`;
      const playable = r.status === 'done';
      return `<div class="rec-item" data-id="${r.id}">
        <div class="rec-item-head">
          <div><strong>${esc(r.printer_name || r.printer_id)}</strong> <span class="rec-meta">${esc(dt)}</span></div>
          <div class="rec-item-actions">
            ${badge}
            ${playable ? `<a class="form-btn form-btn-sm form-btn-ghost" href="/api/recordings/${r.id}/download" download="${esc(r.filename)}">${t('camera.download', 'Download')}</a>` : ''}
            ${playable ? `<button class="form-btn form-btn-sm form-btn-ghost" onclick="window._recPlay(${r.id}, this)">${t('camera.play', 'Play')}</button>` : ''}
            <button class="form-btn form-btn-sm form-btn-ghost" style="color:var(--accent-red)" onclick="window._recDelete(${r.id}, this)" ${r.status === 'recording' ? 'disabled' : ''}>${t('settings.delete', 'Delete')}</button>
          </div>
        </div>
        <div class="rec-player"></div>
      </div>`;
    }).join('');
  };

  window._recPlay = function (id, btn) {
    const host = btn.closest('.rec-item').querySelector('.rec-player');
    if (host.querySelector('video')) { host.innerHTML = ''; return; }
    host.innerHTML = `<video src="/api/recordings/${id}/download" controls autoplay style="width:100%;max-height:360px;border-radius:8px;margin-top:8px"></video>`;
  };

  window._recDelete = async function (id, btn) {
    if (!confirm(t('camera.confirm_delete', 'Delete this recording?'))) return;
    try {
      await _json(`/api/recordings/${id}`, { method: 'DELETE' });
      const item = btn.closest('.rec-item');
      const body = item.parentElement;
      item.remove();
      if (!body.querySelector('.rec-item')) body.innerHTML = `<p class="text-muted" style="padding:12px">${t('camera.no_recordings', 'No recordings yet.')}</p>`;
    } catch (e) { toast(e.message, 'error'); }
  };
})();
