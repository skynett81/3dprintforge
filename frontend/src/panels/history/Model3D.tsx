import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useT } from '../../i18n';

interface Mesh { vertices?: number[]; triangles?: number[]; }
interface Preview { meshes?: Mesh[]; }

// Full-screen 3D viewer for a print's model, rendered from /api/preview-3d
// (mesh vertices + triangles). Bambu models are Z-up, so the group is rotated
// to Y-up for a natural upright view.
export function Model3D({ id, onClose }: { id: number; onClose: () => void }) {
  const t = useT();
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let raf = 0;
    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;
    const onResize = () => {
      if (!renderer || !mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      const cam = (renderer as unknown as { _cam?: THREE.PerspectiveCamera })._cam;
      if (cam) { cam.aspect = w / h; cam.updateProjectionMatrix(); }
    };

    (async () => {
      try {
        const res = await fetch(`/api/preview-3d?source=history&id=${id}`);
        if (!res.ok) throw new Error(t('v2.hist.no_3d', 'No 3D model for this print'));
        const data: Preview = await res.json();
        if (disposed) return;

        const w = mount.clientWidth, h = mount.clientHeight;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x14141f);

        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xcfd2d6, metalness: 0.05, roughness: 0.85, side: THREE.DoubleSide });
        for (const m of data.meshes ?? []) {
          if (!m.vertices?.length || !m.triangles?.length) continue;
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(m.vertices, 3));
          geo.setIndex(m.triangles);
          geo.computeVertexNormals();
          group.add(new THREE.Mesh(geo, mat));
        }
        group.rotation.x = -Math.PI / 2; // Z-up (Bambu) -> Y-up (three)
        scene.add(group);

        // Centre + frame the model.
        const box = new THREE.Box3().setFromObject(group);
        const centre = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        group.position.sub(centre);
        const maxDim = Math.max(size.x, size.y, size.z) || 100;

        const camera = new THREE.PerspectiveCamera(45, w / h, maxDim / 100, maxDim * 100);
        camera.position.set(maxDim * 0.9, maxDim * 0.8, maxDim * 1.3);

        scene.add(new THREE.AmbientLight(0xffffff, 0.75));
        const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(1, 1.5, 1); scene.add(key);
        const fill = new THREE.DirectionalLight(0xffffff, 0.3); fill.position.set(-1, 0.5, -1); scene.add(fill);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        (renderer as unknown as { _cam: THREE.PerspectiveCamera })._cam = camera;
        mount.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);
        controls.update();

        setLoading(false);
        window.addEventListener('resize', onResize);
        const animate = () => {
          raf = requestAnimationFrame(animate);
          controls?.update();
          renderer?.render(scene, camera);
        };
        animate();
      } catch (e) {
        if (!disposed) { setErr((e as Error).message); setLoading(false); }
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      controls?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.parentNode?.removeChild(renderer.domElement);
      }
    };
  }, [id, t]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 12 }}>
        <span style={{ color: '#fff', fontWeight: 600 }}>{t('v2.hist.model_3d', '3D model')}</span>
        <span style={{ color: '#9aa0ab', fontSize: '0.8rem' }}>{t('v2.hist.drag_rotate', 'Drag to rotate · scroll to zoom')}</span>
        <button className="btn btn--sm" style={{ marginLeft: 'auto' }} onClick={onClose}>✕ {t('common.close', 'Close')}</button>
      </div>
      <div ref={mountRef} style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {loading && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#9aa0ab' }}>{t('common.loading', 'Loading…')}</div>}
        {err && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#ef8a8a', padding: 24, textAlign: 'center' }}>{err}</div>}
      </div>
    </div>
  );
}
