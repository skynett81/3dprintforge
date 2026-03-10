(function() {
  'use strict';

  const ALLOWED_EXTENSIONS = ['.3mf', '.gcode', '.gcode.gz'];
  const UPLOAD_ENDPOINT = '/api/library/upload';
  let dragCounter = 0;
  let overlay = null;
  let progressWrap = null;
  let barFill = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'drop-zone-overlay';
    overlay.innerHTML = `
      <div class="drop-zone-inner">
        <div class="drop-zone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div class="drop-zone-title">Drop file to upload</div>
        <div class="drop-zone-desc">Supports .3mf, .gcode files</div>
        <div class="drop-zone-progress">
          <div class="drop-zone-bar">
            <div class="drop-zone-bar-fill"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    progressWrap = overlay.querySelector('.drop-zone-progress');
    barFill = overlay.querySelector('.drop-zone-bar-fill');
  }

  function showOverlay() {
    if (!overlay) createOverlay();
    overlay.classList.add('active');
    progressWrap.classList.remove('active');
    barFill.style.width = '0%';
  }

  function hideOverlay() {
    if (overlay) overlay.classList.remove('active');
  }

  function isAllowedFile(filename) {
    const lower = filename.toLowerCase();
    return ALLOWED_EXTENSIONS.some(ext => lower.endsWith(ext));
  }

  function uploadFile(file) {
    if (!isAllowedFile(file.name)) {
      if (typeof showToast === 'function') {
        showToast('Unsupported file type. Only .3mf, .gcode, .gcode.gz files are allowed.', 'error', 4000);
      }
      hideOverlay();
      return;
    }

    progressWrap.classList.add('active');
    barFill.style.width = '0%';

    const xhr = new XMLHttpRequest();
    const url = UPLOAD_ENDPOINT + '?filename=' + encodeURIComponent(file.name);

    xhr.upload.addEventListener('progress', function(e) {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        barFill.style.width = pct + '%';
      }
    });

    xhr.addEventListener('load', function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (typeof showToast === 'function') {
          showToast('File "' + file.name + '" uploaded successfully', 'success', 3000);
        }
        // Dispatch event so library panel can refresh
        window.dispatchEvent(new CustomEvent('library-updated'));
      } else {
        let msg = 'Upload failed';
        try { msg = JSON.parse(xhr.responseText).error || msg; } catch {}
        if (typeof showToast === 'function') {
          showToast(msg, 'error', 4000);
        }
      }
      hideOverlay();
    });

    xhr.addEventListener('error', function() {
      if (typeof showToast === 'function') {
        showToast('Upload failed - network error', 'error', 4000);
      }
      hideOverlay();
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.send(file);
  }

  document.addEventListener('dragenter', function(e) {
    e.preventDefault();
    dragCounter++;
    if (dragCounter === 1) showOverlay();
  });

  document.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  document.addEventListener('dragleave', function(e) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      hideOverlay();
    }
  });

  document.addEventListener('drop', function(e) {
    e.preventDefault();
    dragCounter = 0;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    } else {
      hideOverlay();
    }
  });
})();
