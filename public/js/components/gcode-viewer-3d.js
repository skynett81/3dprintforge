// G-code 3D Toolpath Viewer — renders G-code as colored line segments with layer scrubber
(function() {
  'use strict';

  /**
   * Open a 3D G-code toolpath viewer overlay
   * @param {object} toolpathData - { layers: [{segments:[{x1,y1,z1,x2,y2,z2,e},...]},...], bounds, layerCount }
   * @param {string} [title]
   */
  window.openGcodeViewer = function(toolpathData, title) {
    if (!toolpathData?.layers?.length) {
      if (typeof showToast === 'function') showToast('No toolpath data', 'error');
      return;
    }

    // Close existing
    document.getElementById('_gcode-3d-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = '_gcode-3d-overlay';
    overlay.className = 'lib-3d-viewer-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) closeGcodeViewer(); };

    const totalLayers = toolpathData.layers.length;

    overlay.innerHTML = `<div class="lib-3d-viewer-wrap" style="width:min(1200px,95vw);height:min(800px,90vh)">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-tertiary);border-radius:8px 8px 0 0">
        <span style="font-size:0.85rem;font-weight:600">${title || 'G-code Toolpath'} — ${totalLayers} layers</span>
        <button class="form-btn form-btn-sm" onclick="closeGcodeViewer()">Close</button>
      </div>
      <div id="_gcode-3d-canvas" style="flex:1;background:#1a1a2e;position:relative"></div>
      <div style="padding:8px 12px;background:var(--bg-tertiary);border-radius:0 0 8px 8px;display:flex;align-items:center;gap:10px">
        <span style="font-size:0.75rem;color:var(--text-muted)">Layer:</span>
        <input type="range" id="_gcode-layer-slider" min="1" max="${totalLayers}" value="${totalLayers}" style="flex:1;accent-color:var(--accent-blue)" oninput="window._gcodeSetLayer(parseInt(this.value))">
        <span id="_gcode-layer-label" style="font-size:0.8rem;font-weight:600;min-width:60px">${totalLayers}/${totalLayers}</span>
      </div>
    </div>`;

    document.body.appendChild(overlay);

    // Render with Three.js
    _renderToolpath(toolpathData);

    document.addEventListener('keydown', _gcodeKeyHandler);
  };

  window.closeGcodeViewer = function() {
    const overlay = document.getElementById('_gcode-3d-overlay');
    if (overlay) overlay.remove();
    if (_gcodeRenderer) { _gcodeRenderer.dispose(); _gcodeRenderer = null; }
    document.removeEventListener('keydown', _gcodeKeyHandler);
  };

  function _gcodeKeyHandler(e) {
    if (e.key === 'Escape') closeGcodeViewer();
  }

  let _gcodeRenderer = null;
  let _gcodeLayerMeshes = [];
  let _gcodeMaxLayer = 0;

  function _renderToolpath(data) {
    const container = document.getElementById('_gcode-3d-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const w = container.clientWidth, h = container.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    _gcodeRenderer = renderer;

    // Calculate center from bounds
    const b = data.bounds || { minX: 0, maxX: 200, minY: 0, maxY: 200, minZ: 0, maxZ: 50 };
    const cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2, cz = (b.minZ + b.maxZ) / 2;
    const size = Math.max(b.maxX - b.minX, b.maxY - b.minY, b.maxZ - b.minZ) || 200;

    camera.position.set(cx + size * 0.8, cy - size * 0.5, cz + size * 0.8);
    camera.lookAt(cx, cy, cz);

    // OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(cx, cy, cz);
      controls.update();
    }

    // Build line segments per layer
    _gcodeLayerMeshes = [];
    _gcodeMaxLayer = data.layers.length;

    for (let li = 0; li < data.layers.length; li++) {
      const layer = data.layers[li];
      if (!layer.segments?.length) { _gcodeLayerMeshes.push(null); continue; }

      const positions = [];
      const colors = [];
      const hue = li / data.layers.length;

      for (const seg of layer.segments) {
        positions.push(seg.x1, seg.y1, seg.z1, seg.x2, seg.y2, seg.z2);
        const isExtrude = seg.e > 0;
        const color = isExtrude ? new THREE.Color().setHSL(hue, 0.8, 0.5) : new THREE.Color(0.3, 0.3, 0.3);
        colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      const mat = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 1 });
      const lines = new THREE.LineSegments(geom, mat);
      scene.add(lines);
      _gcodeLayerMeshes.push(lines);
    }

    // Bed grid
    const gridHelper = new THREE.GridHelper(size, 10, 0x444444, 0x333333);
    gridHelper.position.set(cx, 0, cy);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    // Ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Animate
    function animate() {
      if (!document.getElementById('_gcode-3d-overlay')) return;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth, nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(container);
  }

  window._gcodeSetLayer = function(layer) {
    const label = document.getElementById('_gcode-layer-label');
    if (label) label.textContent = `${layer}/${_gcodeMaxLayer}`;
    for (let i = 0; i < _gcodeLayerMeshes.length; i++) {
      if (_gcodeLayerMeshes[i]) _gcodeLayerMeshes[i].visible = i < layer;
    }
  };
})();
