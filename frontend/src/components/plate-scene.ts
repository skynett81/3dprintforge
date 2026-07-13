import * as THREE from 'three';

/** A subtle top→bottom dark gradient for the 3D scene background, like the
 *  studio look of Bambu Studio / OrcaSlicer. */
export function gradientBackground(top = '#24282f', bottom = '#0c0e12'): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 2; c.height = 512;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  g.fillStyle = grad;
  g.fillRect(0, 0, 2, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Build a desktop-slicer build plate: a dark filled bed, an accent border
 *  frame, and a fine grid. Z-up, centred at the origin. */
export function buildPlate(scene: THREE.Scene, bed: number, accent = 0x00b3a4) {
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(bed, bed),
    new THREE.MeshBasicMaterial({ color: 0x15181d }),
  );
  plate.position.z = -0.05;
  scene.add(plate);

  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(bed, bed)),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.75 }),
  );
  scene.add(border);

  const cells = Math.max(8, Math.round(bed / 10));
  const grid = new THREE.GridHelper(bed, cells, 0x39404a, 0x22272e);
  grid.rotation.x = Math.PI / 2;
  scene.add(grid);
}
