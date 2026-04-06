/**
 * Multi-Color Generator — creates multi-object 3MF files with distinct colors per part.
 * Bambu slicer auto-detects multi-object 3MF for AMS color assignment.
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

export async function generateMultiColor3MF(opts = {}) {
  const parts = opts.parts || [
    { shape: 'box', color: { r: 220, g: 50, b: 50 }, x: 0, y: 0, z: 0, w: 30, h: 30, d: 3 },
    { shape: 'box', color: { r: 50, g: 50, b: 220 }, x: 5, y: 5, z: 3, w: 20, h: 20, d: 2 },
  ];
  const layout = opts.layout || 'stack'; // stack | side-by-side | inlay

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();

    // Create one material per part color
    const matIndices = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const col = p.color || { r: 200, g: 200, b: 200 };
      const c = new lib.sColor();
      c.set_Red(col.r || 200); c.set_Green(col.g || 200); c.set_Blue(col.b || 200); c.set_Alpha(255);
      matIndices.push(matGroup.AddMaterial(`Part ${i + 1}`, c));
      c.delete();
    }

    // Compute layout offsets
    const offsets = _computeOffsets(parts, layout);

    // Create one mesh object per part (enables multi-color in slicer)
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const off = offsets[i];
      const mesh = model.AddMeshObject();
      mesh.SetName(`Part ${i + 1}`);
      mesh.SetObjectLevelProperty(mgId, matIndices[i]);
      const b = new MeshBuilder(lib, mesh);

      const px = (p.x || 0) + off.x;
      const py = (p.y || 0) + off.y;
      const pz = (p.z || 0) + off.z;
      const w = p.w || 20, h = p.h || 20, d = p.d || 3;

      switch (p.shape) {
        case 'cylinder':
          b.addCylinder(px + w / 2, py + h / 2, pz, Math.min(w, h) / 2, d, 24);
          break;
        case 'text':
          // Text as raised box (simplified)
          b.addBox(px, py, pz, w, h, d);
          break;
        default: // box
          b.addBox(px, py, pz, w, h, d);
          break;
      }

      model.AddBuildItem(mesh, wrapper.GetIdentityTransform());
    }

    _addMeta(model, 'Multi-Color Model');
    return _write(lib, model);
  } finally { model.delete(); wrapper.delete(); }
}

function _computeOffsets(parts, layout) {
  if (layout === 'side-by-side') {
    let xOff = 0;
    return parts.map(p => {
      const off = { x: xOff, y: 0, z: 0 };
      xOff += (p.w || 20) + 5;
      return off;
    });
  }
  if (layout === 'inlay') {
    // First part is base, rest are inlaid on top
    return parts.map((p, i) => i === 0 ? { x: 0, y: 0, z: 0 } : { x: 0, y: 0, z: parts[0].d || 3 });
  }
  // stack (default)
  let zOff = 0;
  return parts.map(p => {
    const off = { x: 0, y: 0, z: zOff };
    zOff += (p.d || 3);
    return off;
  });
}

function _addMeta(model, title) {
  const mdg = model.GetMetaDataGroup();
  const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
  addMd('Title', title);
  addMd('Application', '3DPrintForge Model Forge');
  addMd('CreationDate', new Date().toISOString().split('T')[0]);
}

function _write(lib, model) {
  const vfsPath = `/gen_${Date.now()}.3mf`;
  const writer = model.QueryWriter('3mf');
  writer.WriteToFile(vfsPath);
  const buf = Buffer.from(lib.FS.readFile(vfsPath));
  try { lib.FS.unlink(vfsPath); } catch {}
  return buf;
}
