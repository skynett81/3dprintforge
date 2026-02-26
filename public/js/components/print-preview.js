// Print Preview — 3D model viewer with layer-by-layer animation + HUD overlay
// Tracks per-layer filament color for accurate multi-color rendering
(function() {
  let _currentSubtask = '';
  let _fetching = false;
  let _viewer = null;

  // Per-layer color tracking
  let _layerColors = [];    // [layerIndex] = [r, g, b] (0-1)
  let _lastTrackedLayer = -1;
  let _lastColor = null;

  // MakerWorld tracking
  let _currentProjectId = '';
  let _makerWorldData = null;
  let _mwFetching = false;
  let _usingMwImage = false;

  const STATE_TEXT = {
    IDLE: 'idle', RUNNING: 'running', PAUSE: 'pause',
    FINISH: 'finish', FAILED: 'failed', PREPARE: 'prepare', HEATING: 'heating'
  };

  const STATE_COLORS = {
    IDLE: '#c0c8d2', RUNNING: '#00e676', PAUSE: '#f0883e',
    FINISH: '#58a6ff', FAILED: '#f85149', PREPARE: '#e3b341', HEATING: '#e3b341'
  };

  // Convert RRGGBBAA hex string to [r, g, b] in 0-1 range for WebGL
  function trayColorToRgb(hex) {
    if (!hex || hex.length < 6) return null;
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return [r, g, b];
  }

  // Get active filament color from AMS data
  function getActiveFilamentColor(data) {
    if (!data.ams || !data.ams.ams) return null;
    const activeTrayId = data.ams.tray_now;
    if (activeTrayId == null) return null;
    for (const unit of data.ams.ams) {
      const tray = (unit.tray || []).find(t => String(t.id) === String(activeTrayId));
      if (tray && tray.tray_color) {
        return trayColorToRgb(tray.tray_color);
      }
    }
    return null;
  }

  // Record the current filament color for all layers up to currentLayer
  function trackLayerColor(data) {
    const currentLayer = data.layer_num || 0;
    const rgb = getActiveFilamentColor(data);
    if (!rgb) return;

    // Update last known color
    _lastColor = rgb;

    // Fill from last tracked layer+1 to current layer with current color
    const startFill = Math.max(0, _lastTrackedLayer + 1);
    for (let i = startFill; i <= currentLayer; i++) {
      _layerColors[i] = rgb;
    }
    _lastTrackedLayer = currentLayer;
  }

  window.updatePrintPreview = function(data) {
    const canvas = document.getElementById('print-model-canvas');
    if (!canvas) return;

    const gcodeState = data.gcode_state || 'IDLE';
    const isActive = gcodeState === 'RUNNING' || gcodeState === 'PAUSE' || gcodeState === 'PREPARE' || gcodeState === 'HEATING';
    const subtask = data.subtask_name || '';

    // Update HUD regardless of 3D model state
    updateHud(data, gcodeState, isActive);

    const mwContainer = document.getElementById('print-mw-container');

    if (!isActive || !subtask) {
      canvas.style.display = 'none';
      if (mwContainer) mwContainer.style.display = 'none';
      _currentSubtask = '';
      _usingMwImage = false;
      if (_viewer) { _viewer.destroy(); _viewer = null; }
      // Reset layer tracking
      _layerColors = [];
      _lastTrackedLayer = -1;
      _lastColor = null;
      return;
    }

    // Track layer colors on every tick
    trackLayerColor(data);

    // Update progress on every tick
    const layer = data.layer_num || 0;
    const total = data.total_layer_num || 0;
    const pct = total > 0 ? (layer / total) * 100 : 0;

    if (_usingMwImage) {
      // Reveal bright image from bottom via clip-path
      const reveal = document.getElementById('print-mw-reveal');
      const edge = document.getElementById('print-mw-edge');
      const clipTop = 100 - pct;
      if (reveal) reveal.style.clipPath = `inset(${clipTop}% 0 0 0)`;
      if (edge) {
        edge.style.bottom = pct + '%';
        // Tint glow line with active filament color
        const rgb = getActiveFilamentColor(data);
        if (rgb) {
          const hex = '#' + rgb.map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
          edge.style.background = hex;
          edge.style.boxShadow = `0 0 12px ${hex}, 0 0 4px ${hex}`;
        }
      }
    } else if (_viewer) {
      if (total > 0) {
        _viewer.setProgress(layer / total);
      }
      // Upload per-layer color map to GPU for multi-color rendering
      if (_layerColors.length > 0) {
        const totalLayers = data.total_layer_num || _layerColors.length;
        _viewer.setLayerColors(_layerColors, totalLayers);
      }
      // Update uniform color to active filament (for layers not yet tracked)
      const rgb = getActiveFilamentColor(data);
      if (rgb) _viewer.setColor(rgb);
    }

    // Already showing this model/image — only need progress update above
    if (subtask === _currentSubtask && (canvas.style.display !== 'none' || _usingMwImage)) return;

    // New subtask: reset
    if (subtask !== _currentSubtask) {
      _layerColors = [];
      _lastTrackedLayer = -1;
      _lastColor = null;
      _usingMwImage = false;
      if (mwContainer) mwContainer.style.display = 'none';
    }

    if (_fetching) return;
    _currentSubtask = subtask;
    _fetching = true;
    updateModelLoadingState(true);

    const printerId = window.printerState.getActivePrinterId();
    const projectId = data.project_id;

    // If MakerWorld project: use cover image with progress reveal
    if (projectId && projectId !== '0') {
      fetch(`/api/makerworld/${projectId}`)
        .then(r => r.ok ? r.json() : null)
        .then(info => {
          if (info && info.image && !info.fallback) {
            _usingMwImage = true;
            canvas.style.display = 'none';
            if (_viewer) { _viewer.destroy(); _viewer = null; }
            const bgImg = document.getElementById('print-mw-image');
            const revealImg = document.getElementById('print-mw-reveal');
            const edge = document.getElementById('print-mw-edge');
            if (bgImg) bgImg.src = info.image;
            if (revealImg) revealImg.src = info.image;
            // Set initial progress
            const clipTop = 100 - pct;
            if (revealImg) revealImg.style.clipPath = `inset(${clipTop}% 0 0 0)`;
            if (edge) edge.style.bottom = pct + '%';
            if (mwContainer) mwContainer.style.display = '';
            // Handle image load failure
            if (bgImg) bgImg.onerror = () => {
              if (mwContainer) mwContainer.style.display = 'none';
              _usingMwImage = false;
              _loadModel(printerId, canvas, data);
            };
          } else {
            _loadModel(printerId, canvas, data);
          }
        })
        .catch(() => {
          _loadModel(printerId, canvas, data);
        })
        .finally(() => {
          _fetching = false;
          updateModelLoadingState(false);
        });
    } else {
      _loadModel(printerId, canvas, data);
    }
  };

  function _loadModel(printerId, canvas, data) {
    const mwContainer = document.getElementById('print-mw-container');
    if (mwContainer) mwContainer.style.display = 'none';
    _usingMwImage = false;

    fetch(`/api/model/${printerId}`)
      .then(res => {
        if (!res.ok) throw new Error('No model');
        return res.json();
      })
      .then(model => {
        canvas.style.display = '';
        if (!_viewer) {
          _viewer = new window.ModelViewer(canvas);
        }
        // Apply active filament color as the model's base color
        const rgb = getActiveFilamentColor(data);
        if (rgb) model.color = rgb;
        _viewer.loadModel(model);
        const layer = data.layer_num || 0;
        const total = data.total_layer_num || 0;
        if (total > 0) {
          _viewer.setProgress(layer / total);
        } else {
          _viewer.setProgress(0);
        }
      })
      .catch(() => {
        canvas.style.display = 'none';
      })
      .finally(() => {
        _fetching = false;
        updateModelLoadingState(false);
      });
  }

  function updatePrepareOverlay(data, state) {
    const overlay = document.getElementById('prepare-overlay');
    if (!overlay) return;

    const isPrepare = state === 'PREPARE' || state === 'HEATING';
    if (!isPrepare) {
      overlay.style.display = 'none';
      return;
    }

    overlay.style.display = '';

    const icon = document.getElementById('prepare-icon');
    const status = document.getElementById('prepare-status');
    const bar = document.getElementById('prepare-bar');
    const detail = document.getElementById('prepare-detail');

    const upload = data.upload || {};
    const isUploading = upload.status === 'uploading';

    if (isUploading) {
      // Uploading phase
      const pct = upload.progress || 0;
      if (icon) icon.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>`;
      if (status) status.textContent = `${t('prepare.uploading')} ${pct}%`;
      if (bar) bar.style.width = `${pct}%`;
      if (detail) {
        const fname = (data.subtask_name || '').replace(/\.(3mf|gcode)$/i, '');
        detail.textContent = fname || '';
      }
    } else {
      // Heating phase
      const nozzle = Math.round(data.nozzle_temper || 0);
      const nozzleTarget = data.nozzle_target_temper || 0;
      const bed = Math.round(data.bed_temper || 0);
      const bedTarget = data.bed_target_temper || 0;

      // Calculate overall heating progress
      let heatPct = 0;
      if (nozzleTarget > 0 && bedTarget > 0) {
        const nPct = Math.min(nozzle / nozzleTarget, 1);
        const bPct = Math.min(bed / bedTarget, 1);
        heatPct = Math.round((nPct * 0.6 + bPct * 0.4) * 100);
      }

      if (icon) icon.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2c0 0-5 6-5 10a5 5 0 0 0 10 0c0-4-5-10-5-10z"/>
          <path d="M12 18v-3" opacity="0.5"/>
        </svg>`;
      if (status) status.textContent = `${t('prepare.heating')} ${heatPct}%`;
      if (bar) bar.style.width = `${heatPct}%`;
      if (detail) {
        detail.textContent = `${t('temperature.nozzle')} ${nozzle}°/${nozzleTarget}°  ·  ${t('temperature.bed')} ${bed}°/${bedTarget}°`;
      }
    }
  }

  function updateHud(data, state, isActive) {
    const hudFile = document.getElementById('hud-file');
    const hudState = document.getElementById('hud-state');
    const hudPct = document.getElementById('hud-pct');
    const hudLayers = document.getElementById('progress-layers');

    // Update prepare overlay and MakerWorld info
    updatePrepareOverlay(data, state);
    updateMakerWorldInfo(data, isActive);

    // File name
    if (hudFile) {
      const fname = data.subtask_name || '--';
      hudFile.textContent = fname.replace(/\.(3mf|gcode)$/i, '');
    }

    // State badge
    if (hudState) {
      const key = STATE_TEXT[state];
      const label = key ? t(`state.${key}`) : state;
      hudState.textContent = label;
      hudState.style.color = STATE_COLORS[state] || '#c0c8d2';
      hudState.style.background = isActive ? 'rgba(0,0,0,0.4)' : '';
    }

    // Percent
    if (hudPct) {
      hudPct.textContent = `${data.mc_percent || 0}%`;
    }

    // Layers
    if (hudLayers) {
      const current = data.layer_num || 0;
      const total = data.total_layer_num || 0;
      if (total > 0 && isActive) {
        hudLayers.textContent = `${t('progress.layer', { current, total })}`;
      } else {
        hudLayers.textContent = '--';
      }
    }
  }

  // ---- Model loading indicator ----

  function updateModelLoadingState(loading) {
    const detail = document.getElementById('prepare-detail');
    if (!detail) return;
    if (loading) {
      // Append loading model text if in prepare phase
      const existing = detail.textContent;
      if (existing) {
        detail.innerHTML = `${existing}<div class="model-loading-text">${t('prepare.loading_model')}</div>`;
      } else {
        detail.innerHTML = `<div class="model-loading-text">${t('prepare.loading_model')}</div>`;
      }
    }
  }

  // ---- MakerWorld integration ----

  function updateMakerWorldInfo(data, isActive) {
    const mwEl = document.getElementById('makerworld-info');
    if (!mwEl) return;

    if (!isActive) {
      mwEl.style.display = 'none';
      _currentProjectId = '';
      _makerWorldData = null;
      return;
    }

    const projectId = data.project_id;
    if (!projectId || projectId === '0') {
      mwEl.style.display = 'none';
      return;
    }

    // Already fetched for this ID
    if (projectId === _currentProjectId && _makerWorldData !== null) {
      return;
    }

    if (projectId !== _currentProjectId) {
      _currentProjectId = projectId;
      _makerWorldData = null;

      if (_mwFetching) return;
      _mwFetching = true;

      mwEl.style.display = '';
      mwEl.innerHTML = `<span class="mw-loading">${t('makerworld.loading')}</span>`;

      fetch(`/api/makerworld/${projectId}`)
        .then(r => r.ok ? r.json() : null)
        .then(info => {
          _makerWorldData = info || { fallback: true, url: `https://makerworld.com/en/models/${projectId}` };
          renderMakerWorldInfo(mwEl, _makerWorldData, projectId);
        })
        .catch(() => {
          _makerWorldData = { fallback: true, url: `https://makerworld.com/en/models/${projectId}` };
          renderMakerWorldInfo(mwEl, _makerWorldData, projectId);
        })
        .finally(() => {
          _mwFetching = false;
        });
    }
  }

  function renderMakerWorldInfo(el, info, projectId) {
    if (!info) { el.style.display = 'none'; return; }

    const mwUrl = info.url || `https://makerworld.com/en/models/${projectId}`;
    const mwIcon = `<svg class="mw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`;

    if (info.fallback || !info.title) {
      el.innerHTML = `${mwIcon}<a class="mw-link" href="${mwUrl}" target="_blank" rel="noopener">${t('makerworld.view_on_mw')}</a>`;
    } else {
      let html = '';
      if (info.image) {
        html += `<img class="mw-thumb" src="${info.image}" alt="" onerror="this.style.display='none'">`;
      }
      html += `<div style="min-width:0;flex:1">`;
      html += `<div class="mw-title">${info.title}</div>`;
      const parts = [];
      if (info.designer) parts.push(`${t('makerworld.by')} ${info.designer}`);
      if (info.downloads > 0) parts.push(`${info.downloads} \u2B07`);
      if (info.likes > 0) parts.push(`${info.likes} \u2764`);
      if (parts.length) html += `<span class="mw-designer">${parts.join(' \u00B7 ')}</span>`;
      html += `</div>`;
      html += `<a class="mw-link" href="${mwUrl}" target="_blank" rel="noopener">${mwIcon}</a>`;
      el.innerHTML = html;
    }
  }
})();
