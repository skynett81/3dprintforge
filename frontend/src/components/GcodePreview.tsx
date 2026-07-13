import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useT } from '../i18n';
import { parseGcode, type ParsedGcode, type Feature } from '../lib/gcode-parse';

interface Ctx {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  orbit: OrbitControls; group: THREE.Group; raf: number;
}

// Feature colours mirror a desktop slicer's preview legend.
const FEATURE_COLOR: Record<Feature, number> = {
  'outer-wall': 0xff8a3d,
  'inner-wall': 0xf6c945,
  wall: 0xff8a3d,
  solid: 0xe6564b,
  sparse: 0x37a66b,
  support: 0x4f8bd8,
  skirt: 0x9aa4b2,
  brim: 0x9aa4b2,
  ironing: 0xc084fc,
};
const FEATURE_LABEL: Record<Feature, string> = {
  'outer-wall': 'Outer wall', 'inner-wall': 'Inner wall', wall: 'Wall',
  solid: 'Top/bottom', sparse: 'Infill', support: 'Support', skirt: 'Skirt', brim: 'Brim', ironing: 'Ironing',
};
const LEGEND_ORDER: Feature[] = ['outer-wall', 'inner-wall', 'solid', 'ironing', 'sparse', 'support', 'skirt', 'brim', 'wall'];

/**
 * G-code toolpath preview: renders extrusion moves layer-by-layer, coloured
 * per feature (walls / infill / support …) with a slider — exactly like a
 * desktop slicer's preview. Z-up, millimetres.
 */
export function GcodePreview({ gcode, bed = 256 }: { gcode: string; bed?: number }) {
  const t = useT();
  const mount = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx | null>(null);
  const parsed: ParsedGcode = useMemo(() => parseGcode(gcode), [gcode]);
  const total = parsed.layers.length;
  const [layer, setLayer] = useState(total);
  const [showTravel, setShowTravel] = useState(false);

  useEffect(() => { setLayer(total); }, [total]);

  useEffect(() => {
    const el = mount.current; if (!el) return;
    const w = el.clientWidth || 640; const h = el.clientHeight || 440;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1116);
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 5000);
    camera.up.set(0, 0, 1);
    camera.position.set(bed * 0.8, -bed * 1.0, bed * 0.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    const grid = new THREE.GridHelper(bed, 16, 0x2a3340, 0x1b2028);
    grid.rotation.x = Math.PI / 2; scene.add(grid);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; orbit.target.set(0, 0, bed * 0.1);
    const group = new THREE.Group(); scene.add(group);
    const c: Ctx = { scene, camera, renderer, orbit, group, raf: 0 };
    ctx.current = c;
    const loop = () => { c.raf = requestAnimationFrame(loop); orbit.update(); renderer.render(scene, camera); };
    loop();
    const onResize = () => { const nw = el.clientWidth, nh = el.clientHeight; camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(c.raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
      ctx.current = null;
    };
  }, [bed]);

  useEffect(() => {
    const c = ctx.current; if (!c) return;
    for (let i = c.group.children.length - 1; i >= 0; i--) {
      const o = c.group.children[i] as THREE.LineSegments;
      o.geometry.dispose(); (o.material as THREE.Material).dispose();
      c.group.remove(o);
    }
    const cx = (parsed.bbox.minX + parsed.bbox.maxX) / 2;
    const cy = (parsed.bbox.minY + parsed.bbox.maxY) / 2;
    const shown = Math.min(layer, total);

    // One buffer per feature (batched across visible layers).
    const byFeature = new Map<Feature, number[]>();
    const travelPos: number[] = [];
    for (let i = 0; i < shown; i++) {
      const l = parsed.layers[i];
      for (const key of Object.keys(l.feats) as Feature[]) {
        const src = l.feats[key]!;
        const dst = byFeature.get(key) ?? (byFeature.set(key, []), byFeature.get(key)!);
        for (let k = 0; k < src.length; k += 4) dst.push(src[k] - cx, src[k + 1] - cy, l.z, src[k + 2] - cx, src[k + 3] - cy, l.z);
      }
      if (showTravel && i === shown - 1) {
        for (let k = 0; k < l.travel.length; k += 4) travelPos.push(l.travel[k] - cx, l.travel[k + 1] - cy, l.z, l.travel[k + 2] - cx, l.travel[k + 3] - cy, l.z);
      }
    }
    for (const [feat, pos] of byFeature) {
      if (!pos.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      c.group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: FEATURE_COLOR[feat] ?? 0x00b3a4 })));
    }
    if (travelPos.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(travelPos, 3));
      c.group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 })));
    }
  }, [parsed, layer, showTravel, total]);

  const curZ = parsed.layers[Math.min(layer, total) - 1]?.z ?? 0;
  const legend = LEGEND_ORDER.filter((f) => parsed.features.includes(f));

  return (
    <div>
      <div className="gpreview-wrap">
        <div ref={mount} className="plate-canvas" />
        {legend.length > 0 && (
          <div className="gpreview-legend">
            {legend.map((f) => (
              <span key={f} className="gpreview-legend-item">
                <i style={{ background: `#${(FEATURE_COLOR[f] ?? 0).toString(16).padStart(6, '0')}` }} />
                {t(`v2.gpreview.${f}`, FEATURE_LABEL[f] ?? f)}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <span className="muted micro" style={{ minWidth: 96 }}>{t('v2.gpreview.layer', 'Layer')} {Math.min(layer, total)}/{total}</span>
        <input type="range" min={1} max={Math.max(1, total)} value={Math.min(layer, total)} onChange={(e) => setLayer(Number(e.target.value))} style={{ flex: 1 }} />
        <span className="muted micro tnum" style={{ minWidth: 60 }}>z {curZ.toFixed(2)}</span>
        <label className="chk" style={{ margin: 0 }}><input type="checkbox" checked={showTravel} onChange={(e) => setShowTravel(e.target.checked)} /> {t('v2.gpreview.travel', 'Travel')}</label>
      </div>
    </div>
  );
}
