import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { useT } from '../i18n';

export interface PlateHandle { exportSTL: (name: string) => File | null; count: () => number }

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
export const PlateViewer = forwardRef<PlateHandle, { file: File | null; bed?: number }>(function PlateViewer({ file, bed = 256 }, ref) {
  const t = useT();
  const mount = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx | null>(null);
  const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [count, setCount] = useState(0);
  const [sel, setSel] = useState(false);

  function select(mesh: THREE.Mesh | null) {
    const c = ctx.current; if (!c) return;
    c.selected = mesh;
    if (mesh) c.tcontrols.attach(mesh); else c.tcontrols.detach();
    setSel(!!mesh);
  }

  function addMesh(geom: THREE.BufferGeometry) {
    const c = ctx.current; if (!c) return;
    geom.computeVertexNormals();
    geom.center();
    const mesh = new THREE.Mesh(geom, MAT());
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
    scene.background = new THREE.Color(0x0e1116);
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 5000);
    camera.up.set(0, 0, 1);
    camera.position.set(bed * 0.9, -bed * 1.1, bed * 0.9);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4); dir.position.set(1, -1, 2); scene.add(dir);
    // plate
    const grid = new THREE.GridHelper(bed, 16, 0x2a3340, 0x1b2028);
    grid.rotation.x = Math.PI / 2; scene.add(grid);
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(bed, bed), new THREE.MeshBasicMaterial({ color: 0x11151b, transparent: true, opacity: 0.6 }));
    scene.add(plate);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; orbit.target.set(0, 0, bed * 0.15);
    const tcontrols = new TransformControls(camera, renderer.domElement);
    tcontrols.setSpace('world');
    tcontrols.addEventListener('dragging-changed', (e) => { orbit.enabled = !e.value; });
    tcontrols.addEventListener('objectChange', () => { /* keep in place */ });
    const helper = (tcontrols as unknown as { getHelper?: () => THREE.Object3D }).getHelper?.() ?? (tcontrols as unknown as THREE.Object3D);
    scene.add(helper);

    const c: Ctx = { scene, camera, renderer, orbit, tcontrols, objects: [], selected: null, raf: 0 };
    ctx.current = c;

    // click-to-select
    const ray = new THREE.Raycaster();
    function onDown(ev: PointerEvent) {
      if (tcontrols.dragging) return;
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const ny = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = ray.intersectObjects(c.objects, false)[0];
      select(hit ? (hit.object as THREE.Mesh) : null);
    }
    renderer.domElement.addEventListener('pointerdown', onDown);

    const loop = () => { c.raf = requestAnimationFrame(loop); orbit.update(); renderer.render(scene, camera); };
    loop();
    const onResize = () => { const nw = el.clientWidth, nh = el.clientHeight; camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(c.raf);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.dispose();
      el.removeChild(renderer.domElement);
      ctx.current = null;
    };
  }, [bed]);

  // ── load file ──
  useEffect(() => {
    const c = ctx.current; if (!c || !file) return;
    for (const m of c.objects) c.scene.remove(m);
    c.objects = []; select(null); setCount(0);
    file.arrayBuffer().then((buf) => {
      const name = file.name.toLowerCase();
      try {
        if (name.endsWith('.3mf')) {
          const obj = new ThreeMFLoader().parse(buf);
          obj.traverse((o) => { if ((o as THREE.Mesh).isMesh) addMesh((o as THREE.Mesh).geometry.clone()); });
        } else {
          addMesh(new STLLoader().parse(buf));
        }
      } catch { /* unsupported/parse error — leave empty */ }
    });
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
  function layFlat() { const c = ctx.current; if (!c || !c.selected) return; c.selected.rotation.set(0, 0, 0); dropToPlate(c.selected); }
  function center() { const c = ctx.current; if (!c || !c.selected) return; c.selected.position.x = 0; c.selected.position.y = 0; dropToPlate(c.selected); }

  useImperativeHandle(ref, () => ({
    count: () => ctx.current?.objects.length ?? 0,
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

  const btn = (m: typeof mode, label: string) => (
    <button className={`btn btn--sm${mode === m ? ' btn--primary' : ''}`} onClick={() => setMode(m)}>{label}</button>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
        {btn('translate', t('v2.plate.move', 'Move'))}
        {btn('rotate', t('v2.plate.rotate', 'Rotate'))}
        {btn('scale', t('v2.plate.scale', 'Scale'))}
        <span style={{ width: 8 }} />
        <button className="btn btn--sm btn--ghost" disabled={!sel} onClick={layFlat}>{t('v2.plate.flat', 'Lay flat')}</button>
        <button className="btn btn--sm btn--ghost" disabled={!sel} onClick={center}>{t('v2.plate.center', 'Center')}</button>
        <button className="btn btn--sm btn--ghost" disabled={!sel} onClick={duplicate}>{t('v2.plate.dup', 'Duplicate')}</button>
        <button className="btn btn--sm btn--ghost" disabled={count < 2} onClick={arrange}>{t('v2.plate.arrange', 'Arrange')}</button>
        <button className="btn btn--sm btn--ghost" disabled={!sel} onClick={removeSel}>{t('v2.plate.del', 'Delete')}</button>
        <span className="muted" style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '0.78rem' }}>{count} {t('v2.plate.objects', 'object(s)')}</span>
      </div>
      <div ref={mount} className="plate-canvas" />
    </div>
  );
});
