// step-import.js — server-side STEP/IGES tessellation via the OpenCascade WASM
// importer (occt-import-js). Runs in Node (no browser CSP limits) and returns
// an ASCII STL the existing STL loader can consume.

import occtimportjs from 'occt-import-js';

let _occt = null;
async function getOcct() {
  if (!_occt) _occt = await occtimportjs();
  return _occt;
}

/** Tessellate a STEP/STP (or IGES/IGS with format='iges') buffer to ASCII STL. */
export async function stepToStl(buffer, format = 'step') {
  const occt = await getOcct();
  const bytes = new Uint8Array(buffer);
  const result = format === 'iges' ? occt.ReadIgesFile(bytes, null) : occt.ReadStepFile(bytes, null);
  if (!result || !result.success || !Array.isArray(result.meshes) || result.meshes.length === 0) {
    throw new Error('STEP tessellation produced no geometry');
  }
  const parts = ['solid step\n'];
  for (const mesh of result.meshes) {
    const pos = mesh.attributes?.position?.array;
    if (!pos || pos.length < 9) continue;
    const idx = mesh.index?.array || null;
    const triCount = idx ? idx.length / 3 : pos.length / 9;
    for (let t = 0; t < triCount; t++) {
      const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
      const ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2];
      const bx = pos[b * 3], by = pos[b * 3 + 1], bz = pos[b * 3 + 2];
      const cx = pos[c * 3], cy = pos[c * 3 + 1], cz = pos[c * 3 + 2];
      const ux = bx - ax, uy = by - ay, uz = bz - az, vx = cx - ax, vy = cy - ay, vz = cz - az;
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      parts.push(`facet normal ${nx} ${ny} ${nz}\nouter loop\n`);
      parts.push(`vertex ${ax} ${ay} ${az}\nvertex ${bx} ${by} ${bz}\nvertex ${cx} ${cy} ${cz}\n`);
      parts.push('endloop\nendfacet\n');
    }
  }
  parts.push('endsolid step\n');
  return parts.join('');
}
