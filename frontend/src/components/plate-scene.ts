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

/** Small seeded PRNG so the speckle pattern is stable between renders (no
 *  shimmering if the texture is ever regenerated). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** Build the photo-realistic textured-PEI build plate: an albedo map with a
 *  fine powder-coat speckle, a millimetre grid, and the plate branding, plus a
 *  matching bump map so the grain catches the scene light like the real sheet.
 *  Mirrors Bambu Studio's engineering-plate look. Z-up, centred at the origin. */
function peiTextures(bed: number, brandCss: string): { map: THREE.Texture; bump: THREE.Texture } {
  const size = 1024;
  // ── albedo ──
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  // Warm dark-grey PEI base with a soft centre-lift so it reads as a lit sheet
  // even under flat ambient.
  const rad = g.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.75);
  rad.addColorStop(0, '#33353b');
  rad.addColorStop(1, '#212329');
  g.fillStyle = rad;
  g.fillRect(0, 0, size, size);

  // ── bump ──
  const bc = document.createElement('canvas');
  bc.width = bc.height = size;
  const bg = bc.getContext('2d')!;
  bg.fillStyle = '#808080';
  bg.fillRect(0, 0, size, size);

  // Powder-coat speckle — the grain that makes textured PEI read as "textured".
  const rand = rng(0x3d9f0c);
  for (let i = 0; i < 14000; i++) {
    const x = rand() * size, y = rand() * size, r = 0.5 + rand() * 1.7;
    const light = rand();
    // albedo fleck
    g.fillStyle = light > 0.5
      ? `rgba(210,214,222,${0.03 + rand() * 0.06})`
      : `rgba(8,9,11,${0.05 + rand() * 0.10})`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    // matching bump fleck (brighter = raised)
    const v = light > 0.5 ? 150 + Math.round(rand() * 70) : 40 + Math.round(rand() * 50);
    bg.fillStyle = `rgb(${v},${v},${v})`;
    bg.beginPath(); bg.arc(x, y, r, 0, Math.PI * 2); bg.fill();
  }

  // Millimetre grid — light every 10 mm, heavier every 50 mm.
  const inset = 8;
  const cells = Math.max(8, Math.round(bed / 10));
  for (let i = 0; i <= cells; i++) {
    const p = inset + (i / cells) * (size - inset * 2);
    const heavy = i % 5 === 0;
    g.strokeStyle = heavy ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.045)';
    g.lineWidth = heavy ? 1.6 : 1;
    g.beginPath();
    g.moveTo(p, inset); g.lineTo(p, size - inset);
    g.moveTo(inset, p); g.lineTo(size - inset, p);
    g.stroke();
  }

  // Etched inner frame, like the engraved border of a real plate.
  g.strokeStyle = 'rgba(255,255,255,0.08)';
  g.lineWidth = 2;
  g.strokeRect(inset, inset, size - inset * 2, size - inset * 2);

  // Baked brand logo, engraved low-contrast into the sheet (bottom edge, upright
  // when viewed from above). A faint highlight above a dark stamp gives the
  // "etched" impression.
  g.save();
  g.translate(size / 2, size - 46);
  g.font = '600 30px system-ui, -apple-system, Segoe UI, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = 'rgba(255,255,255,0.07)';
  g.fillText('3DPRINTFORGE', 0, -1);
  g.fillStyle = 'rgba(0,0,0,0.30)';
  g.fillText('3DPRINTFORGE', 0, 1);
  g.restore();
  void brandCss;

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(bc);
  bump.anisotropy = 8;
  return { map, bump };
}

/** Add the build plate (lit, textured, with physical thickness) plus a soft
 *  accent edge frame. */
export function buildPlate(scene: THREE.Scene, bed: number, accent = 0x2ecc71) {
  const accentCss = '#' + accent.toString(16).padStart(6, '0');
  const { map, bump } = peiTextures(bed, accentCss);
  const thickness = Math.max(2, bed * 0.012);

  // Top surface uses the lit PEI material; the sides/bottom are a plain dark
  // metal so the plate reads as a solid sheet with an edge, not a decal.
  const top = new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 0.6, roughness: 0.62, metalness: 0.18 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.5, metalness: 0.35 });
  // BoxGeometry face order: +x, -x, +y, -y, +z(top), -z(bottom).
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(bed, bed, thickness),
    [edge, edge, edge, edge, top, edge],
  );
  plate.position.z = -thickness / 2 - 0.02;
  plate.receiveShadow = true;
  scene.add(plate);

  // Accent edge frame around the print area, on the plate's top surface.
  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(bed, bed)),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.5 }),
  );
  scene.add(border);
}
