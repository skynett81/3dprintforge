// Camera View - jsmpeg MPEG1 player with multi-printer support + fullscreen
(function() {
  let player = null;
  let fullscreenPlayer = null;
  let currentPort = null;
  let streamActive = false;

  function initCamera(port) {
    if (!port) {
      const meta = window.printerState.getActivePrinterMeta();
      port = meta.cameraPort || null;
    }

    const container = document.getElementById('camera-container');
    if (!container) return;

    // No camera port configured — show placeholder, don't connect
    if (!port) {
      if (player) {
        try { player.destroy(); } catch(e) {}
        player = null;
      }
      currentPort = null;
      streamActive = false;
      showPlaceholder(container);
      return;
    }

    if (port === currentPort && player) return;
    currentPort = port;

    if (typeof JSMpeg === 'undefined') {
      showPlaceholder(container);
      return;
    }

    if (player) {
      try { player.destroy(); } catch(e) {}
      player = null;
    }
    streamActive = false;

    const wsUrl = `ws://${location.hostname}:${port}`;

    // Probe the WebSocket first — only create JSMpeg player if it connects
    let probe;
    try {
      probe = new WebSocket(wsUrl);
    } catch(e) {
      showPlaceholder(container);
      return;
    }

    const probeTimeout = setTimeout(() => {
      probe.close();
      showPlaceholder(container);
    }, 3000);

    probe.onopen = () => {
      clearTimeout(probeTimeout);
      probe.close();
      startPlayer(container, wsUrl);
    };

    probe.onerror = () => {
      clearTimeout(probeTimeout);
      showPlaceholder(container);
    };
  }

  function startPlayer(container, wsUrl) {
    try {
      container.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvas.className = 'camera-canvas';
      container.appendChild(canvas);

      // Fullscreen button overlay
      const overlay = document.createElement('div');
      overlay.className = 'camera-overlay';
      const fullscreenTitle = t('camera.fullscreen');
      overlay.innerHTML = `
        <button class="camera-fullscreen-btn" title="${fullscreenTitle}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>`;
      overlay.querySelector('.camera-fullscreen-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openFullscreen();
      });
      container.appendChild(overlay);

      // Click anywhere on camera to open fullscreen
      container.style.cursor = 'pointer';
      container.onclick = () => { if (streamActive) openFullscreen(); };

      player = new JSMpeg.Player(wsUrl, {
        canvas: canvas,
        autoplay: true,
        audio: false,
        loop: false,
        onSourceEstablished: () => {
          console.log('[kamera] Stream tilkoblet');
          streamActive = true;
        },
        onSourceCompleted: () => {
          console.log('[kamera] Stream avsluttet');
          streamActive = false;
          showPlaceholder(container);
        }
      });
    } catch (e) {
      console.warn('[kamera] Kunne ikke starte:', e.message);
      showPlaceholder(container);
    }
  }

  function showPlaceholder(container) {
    container.innerHTML = `
      <div class="camera-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="6" width="15" height="12" rx="2"/>
          <path d="M17 10l4-2v8l-4-2z"/>
        </svg>
        <span>${t('camera.not_available')}</span>
      </div>`;
    container.style.cursor = 'default';
  }

  function openFullscreen() {
    if (!currentPort) return;
    const modal = document.getElementById('camera-modal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const fsContainer = document.getElementById('camera-fullscreen-container');
    fsContainer.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.className = 'camera-canvas-fullscreen';
    fsContainer.appendChild(canvas);

    const wsUrl = `ws://${location.hostname}:${currentPort}`;

    try {
      fullscreenPlayer = new JSMpeg.Player(wsUrl, {
        canvas: canvas,
        autoplay: true,
        audio: false,
        loop: false,
        onSourceCompleted: () => {
          fsContainer.innerHTML = `<div class="camera-placeholder"><span>${t('camera.stream_ended')}</span></div>`;
        }
      });
    } catch (e) {
      fsContainer.innerHTML = `<div class="camera-placeholder"><span>${t('camera.connect_failed')}</span></div>`;
    }
  }

  function closeFullscreen() {
    const modal = document.getElementById('camera-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    if (fullscreenPlayer) {
      try { fullscreenPlayer.destroy(); } catch(e) {}
      fullscreenPlayer = null;
    }
  }

  window.closeCameraModal = closeFullscreen;

  // Switch camera when printer changes
  window.switchCamera = function(port) {
    // Close fullscreen if open when switching printer
    closeFullscreen();
    initCamera(port);
  };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => initCamera(), 1000);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeFullscreen();
    });

    // Close on backdrop click
    const modal = document.getElementById('camera-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeFullscreen();
      });
    }
  });
})();
