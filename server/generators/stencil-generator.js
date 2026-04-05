/**
 * Stencil Generator — converts images to cut-out stencil plates
 * Dark pixels become holes, bright pixels stay solid
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';
import { imageToHeightmap } from '../image-to-heightmap.js';

/**
 * @param {Buffer} imageBuffer - PNG image data
 * @param {object} opts
 * @param {number} [opts.width=100] - Stencil width (mm)
 * @param {number} [opts.thickness=1.5] - Plate thickness (mm)
 * @param {number} [opts.resolution=100] - Max grid dimension
 * @param {number} [opts.threshold=0.5] - Brightness threshold (0-1, below = hole)
 * @param {boolean} [opts.invert=false] - Invert (bright=hole)
 * @param {boolean} [opts.border=true] - Solid border frame
 * @param {number} [opts.borderWidth=3] - Border width (mm)
 * @returns {Promise<Buffer>}
 */
export async function generateStencil3MF(imageBuffer, opts = {}) {
  const targetWidth = opts.width || 100;
  const thick = opts.thickness || 1.5;
  const resolution = opts.resolution || 100;
  const threshold = opts.threshold ?? 0.5;
  const addBorder = opts.border !== false;
  const borderW = opts.borderWidth || 3;

  const hm = imageToHeightmap(imageBuffer, {
    maxWidth: resolution,
    maxHeight: resolution,
    invert: opts.invert || false,
    gamma: 1.0,
  });

  const cellSize = targetWidth / hm.width;
  const totalHeight = hm.height * cellSize;

  // Create binary mask: true = solid, false = hole
  const mask = hm.grid.map(row => row.map(v => v >= threshold));

  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  try {
    const matGroup = model.AddBaseMaterialGroup();
    const mgId = matGroup.GetResourceID();
    const c = new lib.sColor(); c.set_Red(50); c.set_Green(50); c.set_Blue(55); c.set_Alpha(255);
    const colStencil = matGroup.AddMaterial('Stencil', c); c.delete();

    const stencilMesh = model.AddMeshObject();
    stencilMesh.SetName('Stencil');
    stencilMesh.SetObjectLevelProperty(mgId, colStencil);
    const builder = new MeshBuilder(lib, stencilMesh);

    // Build solid cells only (where mask = true)
    // Each solid cell is a small box
    const rows = hm.height, cols = hm.width;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (mask[r][c]) {
          builder.addBox(c * cellSize, r * cellSize, 0, cellSize, cellSize, thick);
        }
      }
    }

    // Border frame (always solid)
    if (addBorder) {
      builder.addBox(-borderW, -borderW, 0, targetWidth + borderW * 2, borderW, thick);          // front
      builder.addBox(-borderW, totalHeight, 0, targetWidth + borderW * 2, borderW, thick);        // back
      builder.addBox(-borderW, 0, 0, borderW, totalHeight, thick);                                 // left
      builder.addBox(targetWidth, 0, 0, borderW, totalHeight, thick);                              // right
    }

    model.AddBuildItem(stencilMesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', 'Stencil');
    addMd('Application', '3DPrintForge Model Forge');

    const vfsPath = `/stencil_${Date.now()}.3mf`;
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
