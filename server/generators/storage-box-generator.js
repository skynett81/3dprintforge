/**
 * Storage Box Generator — parametric boxes with dividers
 * Supports stackable lips and Gridfinity-compatible dimensions
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

/**
 * @param {object} opts
 * @param {number} [opts.width=80] - Outer width (mm)
 * @param {number} [opts.depth=60] - Outer depth (mm)
 * @param {number} [opts.height=40] - Outer height (mm)
 * @param {number} [opts.wallThickness=1.6] - Wall thickness (mm)
 * @param {number} [opts.bottomThickness=1.2] - Bottom thickness (mm)
 * @param {number} [opts.cornerRadius=2] - Corner radius (mm)
 * @param {number} [opts.dividersX=0] - Number of dividers along X axis
 * @param {number} [opts.dividersY=0] - Number of dividers along Y axis
 * @param {number} [opts.dividerThickness=1.2] - Divider wall thickness (mm)
 * @param {boolean} [opts.stackable=false] - Add stacking lip
 * @param {number} [opts.lipHeight=2] - Stacking lip height (mm)
 * @param {number} [opts.lipTolerance=0.3] - Stacking lip tolerance (mm)
 * @param {boolean} [opts.gridfinity=false] - Snap to 42mm grid units
 * @param {number} [opts.gridUnitsX=2] - Gridfinity units X
 * @param {number} [opts.gridUnitsY=2] - Gridfinity units Y
 * @param {string} [opts.label] - Label text on front wall
 * @returns {Promise<Buffer>}
 */
export async function generateStorageBox3MF(opts = {}) {
  let w = opts.width || 80;
  let d = opts.depth || 60;
  const h = opts.height || 40;
  const wt = opts.wallThickness || 1.6;
  const bt = opts.bottomThickness || 1.2;
  const divX = opts.dividersX || 0;
  const divY = opts.dividersY || 0;
  const divT = opts.dividerThickness || 1.2;
  const stackable = opts.stackable || false;
  const lipH = opts.lipHeight || 2;
  const lipTol = opts.lipTolerance || 0.3;

  // Gridfinity snap
  if (opts.gridfinity) {
    const gu = 42;
    w = (opts.gridUnitsX || 2) * gu;
    d = (opts.gridUnitsY || 2) * gu;
  }

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
    const colBox = addColor('Box', 100, 140, 180);
    const colDiv = addColor('Dividers', 130, 160, 200);

    // Box mesh
    const boxMesh = model.AddMeshObject();
    boxMesh.SetName('Storage Box');
    boxMesh.SetObjectLevelProperty(mgId, colBox);
    const box = new MeshBuilder(lib, boxMesh);

    // Build as individual wall panels (no CSG needed)
    // Bottom
    box.addBox(0, 0, 0, w, d, bt);
    // Front wall
    box.addBox(0, 0, bt, w, wt, h - bt);
    // Back wall
    box.addBox(0, d - wt, bt, w, wt, h - bt);
    // Left wall
    box.addBox(0, wt, bt, wt, d - wt * 2, h - bt);
    // Right wall
    box.addBox(w - wt, wt, bt, wt, d - wt * 2, h - bt);

    // Stacking lip (outer perimeter ridge on top)
    if (stackable) {
      const lt = wt - lipTol; // lip is slightly thinner for fit
      box.addBox(lipTol, lipTol, h, w - lipTol * 2, lt, lipH);                     // front lip
      box.addBox(lipTol, d - lipTol - lt, h, w - lipTol * 2, lt, lipH);            // back lip
      box.addBox(lipTol, lipTol + lt, h, lt, d - lipTol * 2 - lt * 2, lipH);       // left lip
      box.addBox(w - lipTol - lt, lipTol + lt, h, lt, d - lipTol * 2 - lt * 2, lipH); // right lip
    }

    // Dividers
    if (divX > 0 || divY > 0) {
      const divMesh = model.AddMeshObject();
      divMesh.SetName('Dividers');
      divMesh.SetObjectLevelProperty(mgId, colDiv);
      const divBuilder = new MeshBuilder(lib, divMesh);

      const innerW = w - wt * 2;
      const innerD = d - wt * 2;
      const divH = h - bt - 1; // dividers slightly shorter than walls

      // X dividers (parallel to Y axis)
      for (let i = 1; i <= divX; i++) {
        const x = wt + (innerW / (divX + 1)) * i - divT / 2;
        divBuilder.addBox(x, wt, bt, divT, innerD, divH);
      }

      // Y dividers (parallel to X axis)
      for (let i = 1; i <= divY; i++) {
        const y = wt + (innerD / (divY + 1)) * i - divT / 2;
        divBuilder.addBox(wt, y, bt, innerW, divT, divH);
      }

      model.AddBuildItem(divMesh, wrapper.GetIdentityTransform());
    }

    model.AddBuildItem(boxMesh, wrapper.GetIdentityTransform());

    // Metadata
    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', opts.label || 'Storage Box');
    addMd('Application', '3DPrintForge Model Forge');
    addMd('CreationDate', new Date().toISOString().split('T')[0]);

    const vfsPath = `/box_${Date.now()}.3mf`;
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
