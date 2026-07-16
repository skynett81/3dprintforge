// webgl.ts — create a THREE.WebGLRenderer that survives flaky GPUs.
//
// On some Linux/Mesa/ANGLE setups (software llvmpipe fallback, driver hiccups)
// `new THREE.WebGLRenderer()` throws "Error creating WebGL context" and takes
// the whole React tree down with it. This tries progressively more permissive
// configs and returns null instead of throwing, so callers can show a fallback
// message and keep the rest of the slicer usable.

import * as THREE from 'three';

export function makeRenderer(opts: THREE.WebGLRendererParameters = {}): THREE.WebGLRenderer | null {
  const attempts: THREE.WebGLRendererParameters[] = [
    { antialias: true, ...opts },
    { ...opts, antialias: false, powerPreference: 'default', failIfMajorPerformanceCaveat: false },
    { ...opts, antialias: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false, preserveDrawingBuffer: false },
  ];
  for (const a of attempts) {
    try {
      const r = new THREE.WebGLRenderer(a);
      if (r && r.getContext()) return r;
      try { r.dispose(); } catch { /* ignore */ }
    } catch { /* try the next, more permissive, config */ }
  }
  return null;
}

/** Drop a friendly fallback panel into `el` when WebGL is unavailable. */
export function showWebglFallback(el: HTMLElement, extra = '') {
  const d = document.createElement('div');
  d.className = 'webgl-fallback';
  d.innerHTML =
    `<div class="webgl-fallback-inner">` +
    `<strong>3D preview unavailable</strong>` +
    `<p>Your browser could not create a WebGL/GPU context, so the 3D view can't render.` +
    ` Slicing still works. Try: enable hardware acceleration, update your GPU driver,` +
    ` or use a normal (non-incognito) window in Chrome/Vivaldi/Firefox.</p>` +
    (extra ? `<p class="webgl-fallback-extra">${extra}</p>` : '') +
    `</div>`;
  el.appendChild(d);
}
