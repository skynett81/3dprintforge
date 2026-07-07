import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Mesh { vertices: number[]; triangles: number[]; materialColor?: string | null }
// Two shapes exist: the library endpoint returns { meshes: [...] }, the live
// print endpoint (/api/model/:printerId) returns a single { vertices, triangles }.
interface ModelData { meshes?: Mesh[]; vertices?: number[]; triangles?: number[] }

function normalizeMeshes(d: ModelData): Mesh[] {
  if (Array.isArray(d.meshes) && d.meshes.length) return d.meshes;
  if (Array.isArray(d.vertices) && Array.isArray(d.triangles)) return [{ vertices: d.vertices, triangles: d.triangles, materialColor: null }];
  return [];
}

// Interactive 3D model viewer. Loads pre-parsed mesh JSON (vertices + triangle
// indices) from `src` and renders it with orbit/zoom. Three.js is bundled
// locally so it satisfies the /v2 CSP.
export default function ModelViewer({ src }: { src: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [err, setErr] = useState('');

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = (await res.json()) as ModelData | null;
        const meshes = data ? normalizeMeshes(data) : [];
        if (disposed || meshes.length === 0) { if (!disposed) { setErr('No mesh data'); setStatus('error'); } return; }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0e1116);

        const group = new THREE.Group();
        for (const m of meshes) {
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(m.vertices, 3));
          geo.setIndex(m.triangles);
          geo.computeVertexNormals();
          const color = new THREE.Color(m.materialColor || '#00b3a4');
          const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.08, roughness: 0.72 });
          group.add(new THREE.Mesh(geo, mat));
        }

        const box = new THREE.Box3().setFromObject(group);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        group.position.sub(center);
        scene.add(group);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;

        const w = mount.clientWidth || 600;
        const h = mount.clientHeight || 440;
        const camera = new THREE.PerspectiveCamera(45, w / h, maxDim / 100, maxDim * 100);
        camera.position.set(maxDim * 1.3, maxDim * 1.0, maxDim * 1.6);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.65));
        const d1 = new THREE.DirectionalLight(0xffffff, 0.95); d1.position.set(1, 1.5, 1); scene.add(d1);
        const d2 = new THREE.DirectionalLight(0xffffff, 0.35); d2.position.set(-1, -0.4, -1); scene.add(d2);
        const grid = new THREE.GridHelper(maxDim * 3, 24, 0x33415a, 0x1b2430);
        grid.position.y = -size.y / 2; scene.add(grid);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);

        const onResize = () => {
          const nw = mount.clientWidth || 600; const nh = mount.clientHeight || 440;
          camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
        };
        window.addEventListener('resize', onResize);

        let frame = 0;
        const animate = () => { frame = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
        animate();
        setStatus('ready');

        cleanup = () => {
          window.removeEventListener('resize', onResize);
          cancelAnimationFrame(frame);
          controls.dispose();
          scene.traverse((o) => {
            const mesh = o as THREE.Mesh;
            mesh.geometry?.dispose?.();
            const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
            if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose?.();
          });
          renderer.dispose();
          if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        };
      } catch (e) {
        if (!disposed) { setErr((e as Error).message); setStatus('error'); }
      }
    })();

    return () => { disposed = true; cleanup(); };
  }, [src]);

  return (
    <div className="model-viewer">
      <div ref={mountRef} className="model-canvas" />
      {status === 'loading' && <div className="model-overlay muted">Loading model…</div>}
      {status === 'error' && <div className="model-overlay error">{err || 'Could not load model'}</div>}
    </div>
  );
}
