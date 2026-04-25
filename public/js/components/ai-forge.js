/**
 * AI Model Forge — text-, image-, and sketch-driven mesh generation.
 *
 * Four tabs:
 *   1. Text       — type a prompt, get a mesh
 *   2. Image      — drop a photo, choose heightmap or silhouette extrusion
 *   3. Sketch     — draw on a canvas, extrude to 3D
 *   4. Jobs       — history list with download + delete
 */
(function () {
  'use strict';

  const _state = {
    tab: 'text',
    jobs: [],
    busy: false,
    canvas: null,
    canvasPath: '',
    canvasPoints: [],
  };

  function _esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }
  function _toast(m, t = 'info') { if (typeof showToast === 'function') showToast(m, t, 3000); }

  function _formatBytes(bytes) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function _load() {
    const body = document.getElementById('overlay-panel-body');
    if (!body) return;
    body.innerHTML = `
      <div class="pf-tabs">
        <button class="form-btn pf-tab ${_state.tab === 'text' ? 'active' : ''}" data-tab="text">📝 Text → 3D</button>
        <button class="form-btn pf-tab ${_state.tab === 'image' ? 'active' : ''}" data-tab="image">🖼️ Image → 3D</button>
        <button class="form-btn pf-tab ${_state.tab === 'sketch' ? 'active' : ''}" data-tab="sketch">✏️ Sketch → 3D</button>
        <button class="form-btn pf-tab ${_state.tab === 'jobs' ? 'active' : ''}" data-tab="jobs">📋 Jobs</button>
      </div>
      <div id="aif-content" class="pf-content"></div>
    `;
    body.querySelectorAll('.pf-tab').forEach(b => b.onclick = () => { _state.tab = b.dataset.tab; _load(); });
    if (_state.tab === 'text') _renderText();
    else if (_state.tab === 'image') _renderImage();
    else if (_state.tab === 'sketch') _renderSketch();
    else _renderJobs();
  }

  // ── Tab 1: Text ─────────────────────────────────────────────────────

  function _renderText() {
    const c = document.getElementById('aif-content');
    if (!c) return;
    c.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5>Generate from text prompt</h5>
          <p class="text-muted" style="font-size:0.85rem">Examples: <code>cube 30mm</code>, <code>sphere 15</code>,
          <code>cylinder r=10 h=20</code>, <code>three small cubes</code>,
          <code>keychain with text "Sara"</code>, <code>hex prism 25x25x10</code>.</p>
          <textarea id="aif-text-prompt" class="form-control" rows="3" placeholder="Describe the shape…"></textarea>
          <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
            <label>Format:
              <select id="aif-text-format" class="form-control" style="display:inline-block;width:auto;margin-left:6px">
                <option value="stl">STL</option>
                <option value="obj">OBJ</option>
                <option value="3mf">3MF</option>
              </select>
            </label>
            <label><input type="checkbox" id="aif-text-repair" checked> Auto-repair output</label>
            <button id="aif-text-go" class="form-btn primary" style="margin-left:auto">Generate</button>
          </div>
          <div id="aif-text-status" style="margin-top:10px"></div>
        </div>
      </div>`;
    document.getElementById('aif-text-go').onclick = _runText;
  }

  async function _runText() {
    const prompt = document.getElementById('aif-text-prompt').value.trim();
    if (!prompt) { _toast('Enter a prompt first', 'warning'); return; }
    const format = document.getElementById('aif-text-format').value;
    const repair = document.getElementById('aif-text-repair').checked;
    const status = document.getElementById('aif-text-status');
    status.innerHTML = '<em>Generating…</em>';
    try {
      const r = await fetch('/api/ai-forge/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, format, repair }),
      });
      const data = await r.json();
      if (!r.ok) {
        status.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(data.error || r.statusText)}</span>`;
        return;
      }
      _renderJobResult(status, data);
    } catch (e) {
      status.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(e.message)}</span>`;
    }
  }

  // ── Tab 2: Image ────────────────────────────────────────────────────

  function _renderImage() {
    const c = document.getElementById('aif-content');
    if (!c) return;
    c.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5>Generate from image</h5>
          <p class="text-muted" style="font-size:0.85rem">Heightmap mode: grayscale image → relief (lithophane-style).
          Silhouette mode: extracts the outline of the brightest blob and extrudes it.</p>
          <div class="pf-drop" id="aif-img-drop">
            <input type="file" id="aif-img-file" accept="image/*" style="display:none">
            <strong>Drop an image here</strong>
            <p class="text-muted" style="font-size:0.78rem">or <a href="#" id="aif-img-pick" style="color:var(--accent-primary)">click to choose</a></p>
            <p class="text-muted" style="font-size:0.7rem">Max 30 MB · PNG / JPEG / WebP</p>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-top:1rem">
            <label>Mode:
              <select id="aif-img-mode" class="form-control">
                <option value="heightmap">Heightmap</option>
                <option value="silhouette">Silhouette</option>
              </select>
            </label>
            <label>Width (mm): <input id="aif-img-w" type="number" value="80" class="form-control"></label>
            <label>Height (mm): <input id="aif-img-h" type="number" value="80" class="form-control"></label>
            <label>Depth (mm): <input id="aif-img-d" type="number" value="3" step="0.5" class="form-control"></label>
            <label>Base (mm): <input id="aif-img-b" type="number" value="1" step="0.5" class="form-control"></label>
            <label>Threshold (silhouette only): <input id="aif-img-t" type="number" value="128" min="1" max="254" class="form-control"></label>
            <label><input type="checkbox" id="aif-img-invert"> Invert</label>
          </div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
            <label>Format:
              <select id="aif-img-format" class="form-control" style="display:inline-block;width:auto">
                <option value="stl">STL</option>
                <option value="obj">OBJ</option>
                <option value="3mf">3MF</option>
              </select>
            </label>
            <label><input type="checkbox" id="aif-img-repair" checked> Auto-repair</label>
            <button id="aif-img-go" class="form-btn primary" style="margin-left:auto" disabled>Generate</button>
          </div>
          <div id="aif-img-status" style="margin-top:10px"></div>
        </div>
      </div>`;

    const drop = document.getElementById('aif-img-drop');
    const input = document.getElementById('aif-img-file');
    document.getElementById('aif-img-pick').onclick = (e) => { e.preventDefault(); input.click(); };
    input.onchange = () => _selectImage(input.files[0]);
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('pf-drop-over'); };
    drop.ondragleave = () => drop.classList.remove('pf-drop-over');
    drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('pf-drop-over'); _selectImage(e.dataTransfer.files[0]); };
    document.getElementById('aif-img-go').onclick = _runImage;
  }

  function _selectImage(file) {
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) { _toast('Image too large (max 30 MB)', 'error'); return; }
    _state.imageFile = file;
    document.getElementById('aif-img-go').disabled = false;
    document.getElementById('aif-img-drop').querySelector('strong').textContent = file.name;
  }

  async function _runImage() {
    if (!_state.imageFile) return;
    const params = new URLSearchParams();
    params.set('mode', document.getElementById('aif-img-mode').value);
    params.set('widthMm', document.getElementById('aif-img-w').value);
    params.set('heightMm', document.getElementById('aif-img-h').value);
    params.set('depthMm', document.getElementById('aif-img-d').value);
    params.set('baseMm', document.getElementById('aif-img-b').value);
    params.set('threshold', document.getElementById('aif-img-t').value);
    if (document.getElementById('aif-img-invert').checked) params.set('invert', '1');
    params.set('format', document.getElementById('aif-img-format').value);
    if (!document.getElementById('aif-img-repair').checked) params.set('repair', '0');
    const status = document.getElementById('aif-img-status');
    status.innerHTML = '<em>Generating…</em>';
    try {
      const buf = await _state.imageFile.arrayBuffer();
      const r = await fetch(`/api/ai-forge/image?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: buf,
      });
      const data = await r.json();
      if (!r.ok) {
        status.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(data.error || r.statusText)}</span>`;
        return;
      }
      _renderJobResult(status, data);
    } catch (e) {
      status.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(e.message)}</span>`;
    }
  }

  // ── Tab 3: Sketch ──────────────────────────────────────────────────

  function _renderSketch() {
    const c = document.getElementById('aif-content');
    if (!c) return;
    c.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5>Draw a 2D shape, extrude it</h5>
          <p class="text-muted" style="font-size:0.85rem">Click or click-and-drag to draw a closed polygon. Press <kbd>Clear</kbd> to start over.</p>
          <canvas id="aif-canvas" width="600" height="400" style="border:1px solid var(--border-color);background:#fff;cursor:crosshair;width:100%;max-width:600px;display:block"></canvas>
          <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
            <button class="form-btn" id="aif-canvas-clear">Clear</button>
            <label>Depth (mm): <input id="aif-sketch-depth" type="number" value="5" step="0.5" class="form-control" style="width:80px"></label>
            <label>Scale (mm/px): <input id="aif-sketch-scale" type="number" value="0.2" step="0.05" class="form-control" style="width:80px"></label>
            <label>Format:
              <select id="aif-sketch-format" class="form-control" style="width:auto">
                <option value="stl">STL</option>
                <option value="obj">OBJ</option>
                <option value="3mf">3MF</option>
              </select>
            </label>
            <button id="aif-sketch-go" class="form-btn primary" style="margin-left:auto">Generate</button>
          </div>
          <div id="aif-sketch-status" style="margin-top:10px"></div>
        </div>
      </div>`;
    const canvas = document.getElementById('aif-canvas');
    _state.canvas = canvas;
    _state.canvasPoints = [];
    const ctx = canvas.getContext('2d');
    let drawing = false;
    function getPos(e) {
      const r = canvas.getBoundingClientRect();
      const sx = canvas.width / r.width, sy = canvas.height / r.height;
      const x = (e.clientX - r.left) * sx;
      const y = (e.clientY - r.top) * sy;
      return [x, y];
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (_state.canvasPoints.length < 2) return;
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(_state.canvasPoints[0][0], _state.canvasPoints[0][1]);
      for (let i = 1; i < _state.canvasPoints.length; i++) ctx.lineTo(_state.canvasPoints[i][0], _state.canvasPoints[i][1]);
      ctx.closePath();
      ctx.fillStyle = 'rgba(59,130,246,0.15)'; ctx.fill();
      ctx.stroke();
    }
    canvas.onmousedown = (e) => { drawing = true; _state.canvasPoints = [getPos(e)]; redraw(); };
    canvas.onmousemove = (e) => { if (!drawing) return; _state.canvasPoints.push(getPos(e)); redraw(); };
    canvas.onmouseup = () => { drawing = false; redraw(); };
    canvas.onmouseleave = () => { drawing = false; };
    document.getElementById('aif-canvas-clear').onclick = () => { _state.canvasPoints = []; redraw(); };
    document.getElementById('aif-sketch-go').onclick = _runSketch;
  }

  async function _runSketch() {
    if (!_state.canvasPoints || _state.canvasPoints.length < 3) {
      _toast('Draw a shape with at least 3 points', 'warning'); return;
    }
    // Build SVG path d="M.. L.. L.." from canvas points.
    const pts = _state.canvasPoints;
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0]} ${pts[i][1]}`;
    d += ' Z';
    const status = document.getElementById('aif-sketch-status');
    status.innerHTML = '<em>Generating…</em>';
    try {
      const r = await fetch('/api/ai-forge/sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svgPath: d,
          depth: parseFloat(document.getElementById('aif-sketch-depth').value) || 5,
          scale: parseFloat(document.getElementById('aif-sketch-scale').value) || 0.2,
          format: document.getElementById('aif-sketch-format').value,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        status.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(data.error || r.statusText)}</span>`;
        return;
      }
      _renderJobResult(status, data);
    } catch (e) {
      status.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(e.message)}</span>`;
    }
  }

  // ── Tab 4: Jobs ─────────────────────────────────────────────────────

  async function _renderJobs() {
    const c = document.getElementById('aif-content');
    if (!c) return;
    c.innerHTML = `
      <div class="card">
        <div class="card-body">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <h5 style="margin:0">Generation history</h5>
            <button id="aif-jobs-refresh" class="form-btn">Refresh</button>
          </div>
          <div id="aif-jobs-table"><em>Loading…</em></div>
        </div>
      </div>`;
    document.getElementById('aif-jobs-refresh').onclick = _loadJobs;
    await _loadJobs();
  }

  async function _loadJobs() {
    const t = document.getElementById('aif-jobs-table');
    if (!t) return;
    try {
      const r = await fetch('/api/ai-forge/jobs?limit=100');
      const data = await r.json();
      _state.jobs = data.jobs || [];
      if (_state.jobs.length === 0) {
        t.innerHTML = '<em>No jobs yet — generate one from the Text, Image, or Sketch tab.</em>';
        return;
      }
      let html = '<table class="table table-sm"><thead><tr>'
        + '<th>#</th><th>Type</th><th>Prompt</th><th>Format</th><th>Size</th><th>Status</th><th>Created</th><th>Actions</th>'
        + '</tr></thead><tbody>';
      for (const j of _state.jobs) {
        html += `<tr>
          <td>${j.id}</td>
          <td><span class="badge" style="background:rgba(59,130,246,0.15);color:var(--accent-blue)">${_esc(j.job_type)}</span></td>
          <td>${_esc((j.prompt || '').slice(0, 60))}</td>
          <td>${_esc(j.result_format || '—')}</td>
          <td>${j.result_size_bytes ? _formatBytes(j.result_size_bytes) : '—'}</td>
          <td>${_esc(j.status)}</td>
          <td><small>${_esc(j.created_at || '')}</small></td>
          <td>
            ${j.result_path ? `<a href="/api/ai-forge/jobs/${j.id}/download" class="form-btn" download>Download</a>` : ''}
            <button class="form-btn" data-del="${j.id}">Delete</button>
          </td>
        </tr>`;
      }
      html += '</tbody></table>';
      t.innerHTML = html;
      t.querySelectorAll('button[data-del]').forEach(btn => {
        btn.onclick = () => _deleteJob(parseInt(btn.dataset.del, 10));
      });
    } catch (e) {
      t.innerHTML = `<span style="color:#ef4444">Failed: ${_esc(e.message)}</span>`;
    }
  }

  async function _deleteJob(id) {
    try {
      const r = await fetch(`/api/ai-forge/jobs/${id}`, { method: 'DELETE' });
      if (!r.ok) { _toast('Delete failed', 'error'); return; }
      _toast('Deleted', 'success');
      await _loadJobs();
    } catch (e) { _toast(`Delete failed: ${e.message}`, 'error'); }
  }

  // ── Result rendering helper ─────────────────────────────────────────

  function _renderJobResult(target, data) {
    if (!target) return;
    const j = data.job || {};
    const stats = data.stats || {};
    const downloadUrl = j.id ? `/api/ai-forge/jobs/${j.id}/download` : null;
    target.innerHTML = `
      <div style="color:#22c55e;font-weight:600">✓ Generated ${_esc(j.result_format)} · ${_formatBytes(j.result_size_bytes)} · ${j.duration_ms} ms</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.5rem;margin-top:8px;font-size:0.85rem">
        <div><strong>Vertices:</strong> ${(stats.vertices || 0).toLocaleString()}</div>
        <div><strong>Faces:</strong> ${(stats.faces || 0).toLocaleString()}</div>
        <div><strong>Size:</strong> ${stats.bbox ? stats.bbox.size.map(n => n.toFixed(1)).join('×') + ' mm' : '—'}</div>
        ${data.intent ? `<div><strong>Shape:</strong> ${_esc(data.intent.shape)}${data.intent.unknown ? ' <small>(unknown — fallback)</small>' : ''}</div>` : ''}
      </div>
      ${downloadUrl ? `<a href="${downloadUrl}" class="form-btn primary" download style="margin-top:10px">Download ${_esc(j.result_format)}</a>` : ''}
      <details style="margin-top:8px"><summary style="cursor:pointer">Job details</summary>
        <pre style="background:rgba(0,0,0,0.05);padding:8px;border-radius:4px;font-size:0.75rem;overflow:auto">${_esc(JSON.stringify(data, null, 2))}</pre>
      </details>`;
  }

  window.loadAiForge = _load;
})();
