import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useT } from '../i18n';
import { gradientBackground, buildPlate } from './plate-scene';

export interface ObjInfo {
  posX: number; posY: number;
  rotX: number; rotY: number; rotZ: number;   // degrees
  scalePct: number;                            // uniform, from X
  dimX: number; dimY: number; dimZ: number;    // mm (world)
}
export type PlateMode = 'translate' | 'rotate' | 'scale';
export interface PlateState { count: number; hasSel: boolean; mode: PlateMode; names: string[]; selIndex: number }
export interface PlateHandle {
  exportSTL: (name: string) => File | null;
  count: () => number;
  addFile: (f: File) => Promise<void>;
  setMode: (m: PlateMode) => void;
  duplicate: () => void;
  remove: () => void;
  arrange: () => void;
  selectAt: (i: number) => void;
  layFlat: () => void;
  center: () => void;
  setPos: (x: number, y: number) => void;
  setRot: (x: number, y: number, z: number) => void;   // degrees
  setScalePct: (pct: number) => void;
  setDim: (axis: 'x' | 'y' | 'z', mm: number, uniform: boolean) => void;
  mirror: (axis: 'x' | 'y' | 'z') => void;
  resetXform: () => void;
}

interface Ctx {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  orbit: OrbitControls; tcontrols: TransformControls; objects: THREE.Mesh[];
  selected: THREE.Mesh | null; raf: number;
}

// Drop an object so its lowest point sits on the plate (z = 0).
function dropToPlate(mesh: THREE.Mesh) {
  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);
  mesh.position.z -= box.min.z;
}

const MAT = () => new THREE.MeshStandardMaterial({ color: 0x00b3a4, roughness: 0.55, metalness: 0.1, flatShading: false });

/**
 * Build-plate 3D editor for the slicer: load a model, move / rotate / scale /
 * duplicate / auto-arrange objects, then export the arranged scene as one STL
 * to slice. Bed is Z-up, millimetres, centred at the origin.
 */
export const PlateViewer = forwardRef<PlateHandle, { file: File | null; bed?: number; onObject?: (info: ObjInfo | null) => void; onState?: (s: PlateState) => void }>(function PlateViewer({ file, bed = 256, onObject, onState }, ref) {
  const t = useT();
  const mount = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx | null>(null);
  const onObjRef = useRef(onObject);
  onObjRef.current = onObject;
  const onStateRef = useRef(onState);
  onStateRef.current = onState;
  const [mode, setModeState] = useState<PlateMode>('translate');
  const [count, setCount] = useState(0);
  const [sel, setSel] = useState(false);

  function emitState(nextMode = mode) {
    const c = ctx.current;
    const names = (c?.objects ?? []).map((o, i) => o.name || `Object ${i + 1}`);
    const selIndex = c?.selected ? c.objects.indexOf(c.selected) : -1;
    onStateRef.current?.({ count: c?.objects.length ?? 0, hasSel: !!c?.selected, mode: nextMode, names, selIndex });
  }
  function setMode(m: PlateMode) { setModeState(m); ctx.current?.tcontrols.setMode(m); emitState(m); }

  // Report the selected object's live transform to the parent (Object panel).
  function emitObject() {
    const c = ctx.current; const cb = onObjRef.current; if (!cb) return;
    const m = c?.selected;
    if (!m) { cb(null); return; }
    m.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(m);
    const size = new THREE.Vector3(); box.getSize(size);
    const RAD = 180 / Math.PI;
    cb({
      posX: +m.position.x.toFixed(2), posY: +m.position.y.toFixed(2),
      rotX: +(m.rotation.x * RAD).toFixed(1), rotY: +(m.rotation.y * RAD).toFixed(1), rotZ: +(m.rotation.z * RAD).toFixed(1),
      scalePct: +(m.scale.x * 100).toFixed(1),
      dimX: +size.x.toFixed(2), dimY: +size.y.toFixed(2), dimZ: +size.z.toFixed(2),
    });
  }

  function select(mesh: THREE.Mesh | null) {
    const c = ctx.current; if (!c) return;
    c.selected = mesh;
    if (mesh) c.tcontrols.attach(mesh); else c.tcontrols.detach();
    setSel(!!mesh);
    emitObject();
    emitState();
  }

  function addMesh(geom: THREE.BufferGeometry, name?: string, vertexColors = false) {
    const c = ctx.current; if (!c) return;
    geom.computeVertexNormals();
    geom.center();
    const material = vertexColors
      ? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.05, flatShading: false })
      : MAT();
    const mesh = new THREE.Mesh(geom, material);
    mesh.name = name || `Object ${c.objects.length + 1}`;
    // Keep the model's authored orientation (slicers load STL as-is, Z-up); the
    // user can rotate. Just sit it on the plate.
    c.scene.add(mesh);
    c.objects.push(mesh);
    dropToPlate(mesh);
    setCount(c.objects.length);
    select(mesh);
    arrange();
  }

  // ── setup once ──
  useEffect(() => {
    const el = mount.current; if (!el) return;
    const w = el.clientWidth || 640; const h = el.clientHeight || 440;
    const scene = new THREE.Scene();
    scene.background = gradientBackground();
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 5000);
    camera.up.set(0, 0, 1);
    camera.position.set(bed * 0.9, -bed * 1.1, bed * 0.9);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4); dir.position.set(1, -1, 2); scene.add(dir);
    buildPlate(scene, bed);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; orbit.target.set(0, 0, bed * 0.15);
    const tcontrols = new TransformControls(camera, renderer.domElement);
    tcontrols.setSpace('world');
    tcontrols.addEventListener('dragging-changed', (e) => { orbit.enabled = !e.value; if (!e.value) { const m = ctx.current?.selected; if (m) dropToPlate(m); emitObject(); } });
    tcontrols.addEventListener('objectChange', () => { emitObject(); });
    const helper = (tcontrols as unknown as { getHelper?: () => THREE.Object3D }).getHelper?.() ?? (tcontrols as unknown as THREE.Object3D);
    scene.add(helper);

    const c: Ctx = { scene, camera, renderer, orbit, tcontrols, objects: [], selected: null, raf: 0 };
    ctx.current = c;

    // click-to-select — only on a clean click (not an orbit drag), decided
    // on pointerUP, so rotating the view never changes the selection.
    const ray = new THREE.Raycaster();
    let downX = 0, downY = 0;
    const onPointerDown = (ev: PointerEvent) => { downX = ev.clientX; downY = ev.clientY; };
    const onPointerUp = (ev: PointerEvent) => {
      if (tcontrols.dragging) return;
      if (Math.abs(ev.clientX - downX) > 5 || Math.abs(ev.clientY - downY) > 5) return; // was a drag
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const ny = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = ray.intersectObjects(c.objects, false)[0];
      select(hit ? (hit.object as THREE.Mesh) : null);
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const loop = () => { c.raf = requestAnimationFrame(loop); orbit.update(); renderer.render(scene, camera); };
    loop();
    const onResize = () => { const nw = el.clientWidth, nh = el.clientHeight; if (!nw || !nh) return; camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); };
    window.addEventListener('resize', onResize);
    // Resize with the container (fullscreen toggle, sidebar changes) — not
    // just the window, so the canvas always fills the scene.
    const ro = new ResizeObserver(onResize); ro.observe(el);
    return () => {
      cancelAnimationFrame(c.raf);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      el.removeChild(renderer.domElement);
      ctx.current = null;
    };
  }, [bed]);

  // Load a model buffer into the plate (append). Returns a promise.
  async function loadFileBuffer(f: File) {
    const c = ctx.current; if (!c) return;
    const buf = await f.arrayBuffer();
    const lower = f.name.toLowerCase();
    const base = f.name.replace(/\.[^.]+$/, '');
    try {
      if (lower.endsWith('.3mf')) {
        // A 3MF is usually ONE model that may be split into several coloured
        // parts. Merge the parts into a single object so it drops / lays flat
        // as a whole, and bake each part's colour into vertex colours so the
        // real multi-colour look is preserved.
        const obj = new ThreeMFLoader().parse(buf);
        obj.updateMatrixWorld(true);
        const geoms: THREE.BufferGeometry[] = [];
        obj.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const src = m.geometry.clone().applyMatrix4(m.matrixWorld).toNonIndexed();
          const pos = src.getAttribute('position');
          const g2 = new THREE.BufferGeometry();
          g2.setAttribute('position', pos.clone());
          const existing = src.getAttribute('color');
          if (existing) {
            g2.setAttribute('color', existing.clone());
          } else {
            const col = new THREE.Color(0x9aa4b2);
            const mat = Array.isArray(m.material) ? m.material[0] : m.material;
            if (mat && (mat as THREE.MeshStandardMaterial).color) col.copy((mat as THREE.MeshStandardMaterial).color);
            const n = pos.count;
            const colors = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) { colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b; }
            g2.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          }
          geoms.push(g2);
        });
        if (geoms.length) {
          const merged = mergeGeometries(geoms, false);
          if (merged) addMesh(merged, base, true);
        }
      } else {
        addMesh(new STLLoader().parse(buf), base);
      }
    } catch { /* unsupported/parse error — leave as-is */ }
  }

  // ── load the primary file (replaces the plate) ──
  useEffect(() => {
    const c = ctx.current; if (!c || !file) return;
    for (const m of c.objects) c.scene.remove(m);
    c.objects = []; select(null); setCount(0);
    loadFileBuffer(file);
  }, [file]);

  useEffect(() => { ctx.current?.tcontrols.setMode(mode); }, [mode]);

  function arrange() {
    const c = ctx.current; if (!c || !c.objects.length) return;
    const n = c.objects.length;
    const cols = Math.ceil(Math.sqrt(n));
    const gap = bed / (cols + 1);
    c.objects.forEach((m, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      m.position.x = (col - (cols - 1) / 2) * gap;
      m.position.y = (row - (Math.ceil(n / cols) - 1) / 2) * gap;
      dropToPlate(m);
    });
    emitObject();
  }
  function duplicate() {
    const c = ctx.current; if (!c || !c.selected) return;
    const m = new THREE.Mesh(c.selected.geometry.clone(), MAT());
    m.quaternion.copy(c.selected.quaternion); m.scale.copy(c.selected.scale);
    c.scene.add(m); c.objects.push(m); setCount(c.objects.length); select(m); arrange();
  }
  function removeSel() {
    const c = ctx.current; if (!c || !c.selected) return;
    c.scene.remove(c.selected); c.objects = c.objects.filter((o) => o !== c.selected); select(null); setCount(c.objects.length); arrange();
  }
  function layFlat() { const c = ctx.current; if (!c || !c.selected) return; c.selected.rotation.set(0, 0, 0); dropToPlate(c.selected); emitObject(); }
  function center() { const c = ctx.current; if (!c || !c.selected) return; c.selected.position.x = 0; c.selected.position.y = 0; dropToPlate(c.selected); emitObject(); }

  useImperativeHandle(ref, () => ({
    count: () => ctx.current?.objects.length ?? 0,
    addFile: (f: File) => loadFileBuffer(f),
    setMode: (m: PlateMode) => setMode(m),
    duplicate: () => duplicate(),
    remove: () => removeSel(),
    arrange: () => arrange(),
    selectAt: (i: number) => { const c = ctx.current; if (c && c.objects[i]) select(c.objects[i]); },
    layFlat: () => layFlat(),
    center: () => center(),
    setPos: (x: number, y: number) => { const m = ctx.current?.selected; if (!m) return; m.position.x = x; m.position.y = y; emitObject(); },
    setRot: (x: number, y: number, z: number) => { const m = ctx.current?.selected; if (!m) return; const D = Math.PI / 180; m.rotation.set(x * D, y * D, z * D); dropToPlate(m); emitObject(); },
    setScalePct: (pct: number) => { const m = ctx.current?.selected; if (!m || !(pct > 0)) return; const s = pct / 100; m.scale.set(s, s, s); dropToPlate(m); emitObject(); },
    setDim: (axis: 'x' | 'y' | 'z', mm: number, uniform: boolean) => {
      const m = ctx.current?.selected; if (!m || !(mm > 0)) return;
      m.updateMatrixWorld(true);
      const size = new THREE.Vector3(); new THREE.Box3().setFromObject(m).getSize(size);
      const cur = size[axis]; if (!(cur > 0)) return;
      const factor = mm / cur;
      if (uniform) m.scale.multiplyScalar(factor);
      else m.scale[axis] *= factor;
      dropToPlate(m); emitObject();
    },
    mirror: (axis: 'x' | 'y' | 'z') => { const m = ctx.current?.selected; if (!m) return; m.scale[axis] *= -1; dropToPlate(m); emitObject(); },
    resetXform: () => { const m = ctx.current?.selected; if (!m) return; m.rotation.set(0, 0, 0); m.scale.set(1, 1, 1); m.position.x = 0; m.position.y = 0; dropToPlate(m); emitObject(); },
    exportSTL: (name: string) => {
      const c = ctx.current; if (!c || !c.objects.length) return null;
      const group = new THREE.Group();
      for (const m of c.objects) {
        m.updateMatrixWorld(true);
        const g = m.geometry.clone().applyMatrix4(m.matrixWorld);
        group.add(new THREE.Mesh(g));
      }
      const stl = new STLExporter().parse(group, { binary: false }) as string;
      return new File([stl], name.replace(/\.[^.]+$/, '') + '.stl', { type: 'model/stl' });
    },
  }));

  return (
    <div className="plate-root">
      <div className="plate-stage-wrap">
        <div ref={mount} className="plate-canvas" />
        <div className="plate-count">{count} {t('v2.plate.objects', 'object(s)')}{sel ? ` · ${t('v2.plate.selected', 'selected')}` : ''}</div>
      </div>
    </div>
  );
});
