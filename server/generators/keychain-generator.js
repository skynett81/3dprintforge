/**
 * Keychain Generator — custom keychains with text and ring hole
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

// Reuse the pixel font from sign maker for text rendering
const FONT={A:[0x7C,0x12,0x11,0x12,0x7C],B:[0x7F,0x49,0x49,0x49,0x36],C:[0x3E,0x41,0x41,0x41,0x22],D:[0x7F,0x41,0x41,0x22,0x1C],E:[0x7F,0x49,0x49,0x49,0x41],F:[0x7F,0x09,0x09,0x09,0x01],G:[0x3E,0x41,0x49,0x49,0x7A],H:[0x7F,0x08,0x08,0x08,0x7F],I:[0x00,0x41,0x7F,0x41,0x00],J:[0x20,0x40,0x41,0x3F,0x01],K:[0x7F,0x08,0x14,0x22,0x41],L:[0x7F,0x40,0x40,0x40,0x40],M:[0x7F,0x02,0x0C,0x02,0x7F],N:[0x7F,0x04,0x08,0x10,0x7F],O:[0x3E,0x41,0x41,0x41,0x3E],P:[0x7F,0x09,0x09,0x09,0x06],Q:[0x3E,0x41,0x51,0x21,0x5E],R:[0x7F,0x09,0x19,0x29,0x46],S:[0x46,0x49,0x49,0x49,0x31],T:[0x01,0x01,0x7F,0x01,0x01],U:[0x3F,0x40,0x40,0x40,0x3F],V:[0x1F,0x20,0x40,0x20,0x1F],W:[0x3F,0x40,0x30,0x40,0x3F],X:[0x63,0x14,0x08,0x14,0x63],Y:[0x07,0x08,0x70,0x08,0x07],Z:[0x61,0x51,0x49,0x45,0x43],'0':[0x3E,0x51,0x49,0x45,0x3E],'1':[0x00,0x42,0x7F,0x40,0x00],'2':[0x42,0x61,0x51,0x49,0x46],'3':[0x21,0x41,0x45,0x4B,0x31],'4':[0x18,0x14,0x12,0x7F,0x10],'5':[0x27,0x45,0x45,0x45,0x39],'6':[0x3C,0x4A,0x49,0x49,0x30],'7':[0x01,0x71,0x09,0x05,0x03],'8':[0x36,0x49,0x49,0x49,0x36],'9':[0x06,0x49,0x49,0x29,0x1E],' ':[0,0,0,0,0],'.':[0,0x60,0x60,0,0],'-':[8,8,8,8,8],'!':[0,0,0x5F,0,0],'#':[0x14,0x7F,0x14,0x7F,0x14]};

function textToGrid(text) {
  const chars = text.toUpperCase().split('');
  const h = 7, cw = 5, sp = 1;
  const tw = chars.length * (cw + sp) - sp;
  const grid = Array.from({ length: h }, () => Array(Math.max(1, tw)).fill(false));
  let xOff = 0;
  for (const ch of chars) {
    const g = FONT[ch] || FONT[' '];
    for (let col = 0; col < cw; col++)
      for (let row = 0; row < h; row++)
        if (g[col] & (1 << row)) grid[row][xOff + col] = true;
    xOff += cw + sp;
  }
  return { grid, width: Math.max(1, tw), height: h };
}

/**
 * @param {object} opts
 * @param {string} [opts.text='KEY'] - Text to emboss
 * @param {number} [opts.width=50] - Width (mm)
 * @param {number} [opts.height=20] - Height (mm)
 * @param {number} [opts.thickness=3] - Base thickness (mm)
 * @param {number} [opts.textHeight=0.8] - Raised text height (mm)
 * @param {number} [opts.cornerRadius=3] - Corner radius (mm)
 * @param {boolean} [opts.ringHole=true] - Add keyring hole
 * @param {number} [opts.ringDiameter=5] - Ring hole diameter (mm)
 * @param {string} [opts.shape='rectangle'] - Shape: rectangle, oval
 * @returns {Promise<Buffer>}
 */
export async function generateKeychain3MF(opts = {}) {
  const text = opts.text || 'KEY';
  const w = opts.width || 50;
  const h = opts.height || 20;
  const thick = opts.thickness || 3;
  const textH = opts.textHeight || 0.8;
  const ringHole = opts.ringHole !== false;
  const ringD = opts.ringDiameter || 5;
  const ringR = ringD / 2;

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
    const colBase = addColor('Base', 60, 120, 200);
    const colText = addColor('Text', 240, 240, 240);

    // Base plate
    const baseMesh = model.AddMeshObject();
    baseMesh.SetName('Keychain');
    baseMesh.SetObjectLevelProperty(mgId, colBase);
    const base = new MeshBuilder(lib, baseMesh);

    // Main body — extend width for ring tab
    const tabW = ringHole ? ringR * 2 + 4 : 0;
    const totalW = w + tabW;
    base.addBox(0, 0, 0, totalW, h, thick);

    // Ring tab reinforcement (rounded area around hole)
    if (ringHole) {
      const cx = w + tabW / 2;
      const cy = h / 2;
      base.addCylinder(cx, cy, 0, tabW / 2, thick, 20);
      // Ring hole (slightly taller to punch through)
      base.addCylinder(cx, cy, -0.1, ringR + 0.3, thick + 0.2, 16);
    }

    // Raised text
    const tg = textToGrid(text);
    const textScale = Math.min((w - 6) / tg.width, (h - 4) / tg.height);
    const tx = (w - tg.width * textScale) / 2;
    const ty = (h - tg.height * textScale) / 2;

    const textMesh = model.AddMeshObject();
    textMesh.SetName('Text');
    textMesh.SetObjectLevelProperty(mgId, colText);
    const tb = new MeshBuilder(lib, textMesh);

    for (let r = 0; r < tg.height; r++) {
      for (let c = 0; c < tg.width; c++) {
        if (tg.grid[r][c]) {
          tb.addBox(
            tx + (tg.width - 1 - c) * textScale, // mirrored X
            ty + r * textScale,
            thick,
            textScale * 0.9, textScale * 0.9, textH
          );
        }
      }
    }

    model.AddBuildItem(baseMesh, wrapper.GetIdentityTransform());
    model.AddBuildItem(textMesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', text);
    addMd('Application', '3DPrintForge Model Forge');

    const vfsPath = `/keychain_${Date.now()}.3mf`;
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
