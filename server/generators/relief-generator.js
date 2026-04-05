/**
 * Image Relief / Stamp Generator — converts images to raised 3D surfaces
 * Reuses the heightmap pipeline from image-to-heightmap.js
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';
import { imageToHeightmap } from '../image-to-heightmap.js';

/**
 * @param {Buffer} imageBuffer - PNG image data
 * @param {object} opts
 * @param {number} [opts.width=80] - Width (mm)
 * @param {number} [opts.maxRelief=3] - Maximum relief height (mm)
 * @param {number} [opts.baseThickness=2] - Base plate thickness (mm)
 * @param {number} [opts.resolution=150] - Max grid dimension
 * @param {boolean} [opts.invert=false] - Invert (dark=high)
 * @param {boolean} [opts.mirror=false] - Mirror for stamps
 * @param {number} [opts.gamma=1.0] - Gamma correction
 * @param {boolean} [opts.border=false] - Add raised border
 * @param {number} [opts.borderWidth=2] - Border width (mm)
 * @param {number} [opts.borderHeight=1] - Border height (mm)
 * @returns {Promise<Buffer>}
 */
export async function generateRelief3MF(imageBuffer, opts = {}) {
  const targetWidth = opts.width || 80;
  const maxRelief = opts.maxRelief || 3;
  const baseThick = opts.baseThickness || 2;
  const resolution = opts.resolution || 150;
  const mirror = opts.mirror || false;
  const addBorder = opts.border || false;
  const borderW = opts.borderWidth || 2;
  const borderH = opts.borderHeight || 1;

  const hm = imageToHeightmap(imageBuffer, {
    maxWidth: resolution,
    maxHeight: resolution,
    invert: opts.invert || false,
    gamma: opts.gamma || 1.0,
  });

  // Mirror grid horizontally for stamps
  if (mirror) {
    for (const row of hm.grid) row.reverse();
  }

  const cellSize = targetWidth / hm.width;
  const totalHeight = hm.height * cellSize;

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const addColor = (name, r, g, b) => {
      const c = new lib.sColor(); c.set_Red(r); c.set_Green(g); c.set_Blue(b); c.set_Alpha(255);
      const idx = matGroup.AddMaterial(name, c); c.delete(); return idx;
    };
    const colRelief = addColor('Relief', 210, 190, 160);

    const reliefMesh = model.AddMeshObject();
    reliefMesh.SetName(mirror ? 'Stamp' : 'Relief');
    reliefMesh.SetObjectLevelProperty(mgId, colRelief);
    const builder = new MeshBuilder(lib, reliefMesh);

    // Use heightmap surface — relief sits on top of a base plate
    builder.addHeightmapSurface(0, 0, 0, hm.grid, cellSize, baseThick, maxRelief);

    // Border frame
    if (addBorder) {
      const bh = baseThick + maxRelief + borderH;
      builder.addBox(-borderW, -borderW, 0, targetWidth + borderW * 2, borderW, bh);          // front
      builder.addBox(-borderW, totalHeight, 0, targetWidth + borderW * 2, borderW, bh);        // back
      builder.addBox(-borderW, 0, 0, borderW, totalHeight, bh);                                 // left
      builder.addBox(targetWidth, 0, 0, borderW, totalHeight, bh);                              // right
    }

    model.AddBuildItem(reliefMesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', mirror ? 'Stamp' : 'Relief');
    addMd('Application', '3DPrintForge Model Forge');

    const vfsPath = `/relief_${Date.now()}.3mf`;
    const writer = model.QueryWriter('3mf');
    writer.WriteToFile(vfsPath);
    const buf = Buffer.from(lib.FS.readFile(vfsPath));
    try { lib.FS.unlink(vfsPath); } catch {}
    return buf;
  } finally {
    model.delete();
    wrapper.delete();
  }
}
