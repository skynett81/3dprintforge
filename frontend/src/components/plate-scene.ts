import * as THREE from 'three';

/** A subtle top→bottom dark gradient for the 3D scene background, like the
 *  studio look of Bambu Studio / OrcaSlicer. */
export function gradientBackground(top = '#4a4e54', bottom = '#26282c'): THREE.Texture {
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

/** Build a realistic textured PEI build plate baked into a canvas texture,
 *  mirroring Bambu Studio: dark bed, fine grid, edge branding and a plate
 *  number. Z-up, centred at the origin. */
function plateTexture(bed: number, accentCss: string): THREE.Texture {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  // Bed base.
  g.fillStyle = '#191b1f';
  g.fillRect(0, 0, size, size);
  const inset = 6;
  g.fillStyle = '#212429';
  g.fillRect(inset, inset, size - inset * 2, size - inset * 2);

  // Fine grid every 10 mm, heavier every 50 mm. (No baked text — it mirrors
  // depending on the view; the plate number is drawn as an HTML overlay.)
  const cells = Math.max(8, Math.round(bed / 10));
  for (let i = 0; i <= cells; i++) {
    const p = inset + (i / cells) * (size - inset * 2);
    const heavy = i % 5 === 0;
    g.strokeStyle = heavy ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.05)';
    g.lineWidth = heavy ? 1.5 : 1;
    g.beginPath(); g.moveTo(p, inset); g.lineTo(p, size - inset);
    g.moveTo(inset, p); g.lineTo(size - inset, p); g.stroke();
  }
  void accentCss;

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.anisotropy = 4;
  return tex;
}

/** Add the build plate + a soft drop shadow under it. */
export function buildPlate(scene: THREE.Scene, bed: number, accent = 0x2ecc71) {
  const accentCss = '#' + accent.toString(16).padStart(6, '0');
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(bed, bed),
    new THREE.MeshBasicMaterial({ map: plateTexture(bed, accentCss) }),
  );
  plate.position.z = -0.04;
  scene.add(plate);

  // Accent edge frame.
  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(bed, bed)),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.55 }),
  );
  scene.add(border);
}
