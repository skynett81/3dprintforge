/**
 * Text Plate Generator — multi-line 3D text on a plate
 * Extended font with lowercase letters
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

// Extended pixel font (5x7) — uppercase, lowercase, digits, symbols
const FONT={A:[0x7C,0x12,0x11,0x12,0x7C],B:[0x7F,0x49,0x49,0x49,0x36],C:[0x3E,0x41,0x41,0x41,0x22],D:[0x7F,0x41,0x41,0x22,0x1C],E:[0x7F,0x49,0x49,0x49,0x41],F:[0x7F,0x09,0x09,0x09,0x01],G:[0x3E,0x41,0x49,0x49,0x7A],H:[0x7F,0x08,0x08,0x08,0x7F],I:[0x00,0x41,0x7F,0x41,0x00],J:[0x20,0x40,0x41,0x3F,0x01],K:[0x7F,0x08,0x14,0x22,0x41],L:[0x7F,0x40,0x40,0x40,0x40],M:[0x7F,0x02,0x0C,0x02,0x7F],N:[0x7F,0x04,0x08,0x10,0x7F],O:[0x3E,0x41,0x41,0x41,0x3E],P:[0x7F,0x09,0x09,0x09,0x06],Q:[0x3E,0x41,0x51,0x21,0x5E],R:[0x7F,0x09,0x19,0x29,0x46],S:[0x46,0x49,0x49,0x49,0x31],T:[0x01,0x01,0x7F,0x01,0x01],U:[0x3F,0x40,0x40,0x40,0x3F],V:[0x1F,0x20,0x40,0x20,0x1F],W:[0x3F,0x40,0x30,0x40,0x3F],X:[0x63,0x14,0x08,0x14,0x63],Y:[0x07,0x08,0x70,0x08,0x07],Z:[0x61,0x51,0x49,0x45,0x43],
a:[0x20,0x54,0x54,0x54,0x78],b:[0x7F,0x48,0x44,0x44,0x38],c:[0x38,0x44,0x44,0x44,0x20],d:[0x38,0x44,0x44,0x48,0x7F],e:[0x38,0x54,0x54,0x54,0x18],f:[0x08,0x7E,0x09,0x01,0x02],g:[0x0C,0x52,0x52,0x52,0x3E],h:[0x7F,0x08,0x04,0x04,0x78],i:[0x00,0x44,0x7D,0x40,0x00],j:[0x20,0x40,0x44,0x3D,0x00],k:[0x7F,0x10,0x28,0x44,0x00],l:[0x00,0x41,0x7F,0x40,0x00],m:[0x7C,0x04,0x18,0x04,0x78],n:[0x7C,0x08,0x04,0x04,0x78],o:[0x38,0x44,0x44,0x44,0x38],p:[0x7C,0x14,0x14,0x14,0x08],q:[0x08,0x14,0x14,0x18,0x7C],r:[0x7C,0x08,0x04,0x04,0x08],s:[0x48,0x54,0x54,0x54,0x20],t:[0x04,0x3F,0x44,0x40,0x20],u:[0x3C,0x40,0x40,0x20,0x7C],v:[0x1C,0x20,0x40,0x20,0x1C],w:[0x3C,0x40,0x30,0x40,0x3C],x:[0x44,0x28,0x10,0x28,0x44],y:[0x0C,0x50,0x50,0x50,0x3C],z:[0x44,0x64,0x54,0x4C,0x44],
'0':[0x3E,0x51,0x49,0x45,0x3E],'1':[0x00,0x42,0x7F,0x40,0x00],'2':[0x42,0x61,0x51,0x49,0x46],'3':[0x21,0x41,0x45,0x4B,0x31],'4':[0x18,0x14,0x12,0x7F,0x10],'5':[0x27,0x45,0x45,0x45,0x39],'6':[0x3C,0x4A,0x49,0x49,0x30],'7':[0x01,0x71,0x09,0x05,0x03],'8':[0x36,0x49,0x49,0x49,0x36],'9':[0x06,0x49,0x49,0x29,0x1E],
' ':[0,0,0,0,0],'.':[0,0x60,0x60,0,0],',':[0,0x80,0x60,0,0],':':[0,0x36,0x36,0,0],';':[0,0x80,0x76,0,0],'-':[8,8,8,8,8],'+':[0x08,0x08,0x3E,0x08,0x08],'=':[0x14,0x14,0x14,0x14,0x14],'/':[0x20,0x10,0x08,0x04,0x02],'_':[0x40,0x40,0x40,0x40,0x40],'!':[0,0,0x5F,0,0],'?':[0x02,0x01,0x51,0x09,0x06],'@':[0x3E,0x41,0x5D,0x55,0x1E],'#':[0x14,0x7F,0x14,0x7F,0x14],'(':[0,0x1C,0x22,0x41,0],')': [0,0x41,0x22,0x1C,0],'<':[0x08,0x14,0x22,0x41,0],'>':[0x41,0x22,0x14,0x08,0],'*':[0x14,0x08,0x3E,0x08,0x14],'&':[0x36,0x49,0x55,0x22,0x50]};

function textToGrid(text) {
  const chars = text.split(''); // preserve case
  const h = 7, cw = 5, sp = 1;
  const tw = chars.length * (cw + sp) - sp;
  const grid = Array.from({ length: h }, () => Array(Math.max(1, tw)).fill(false));
  let xOff = 0;
  for (const ch of chars) {
    const g = FONT[ch] || FONT[ch.toUpperCase()] || FONT[' '];
    for (let col = 0; col < cw; col++)
      for (let row = 0; row < h; row++)
        if (g[col] & (1 << row)) grid[row][xOff + col] = true;
    xOff += cw + sp;
  }
  return { grid, width: Math.max(1, tw), height: h };
}

/**
 * @param {object} opts
 * @param {string} [opts.text='Hello World'] - Text (supports multi-line with \n)
 * @param {number} [opts.plateWidth=100] - Plate width (mm), 0=auto
 * @param {number} [opts.plateHeight=0] - Plate height (mm), 0=auto
 * @param {number} [opts.plateDepth=2] - Plate thickness (mm)
 * @param {number} [opts.textHeight=0.8] - Raised text height (mm)
 * @param {number} [opts.fontSize=8] - Font size (mm, height of one character line)
 * @param {number} [opts.lineSpacing=1.5] - Line spacing multiplier
 * @param {number} [opts.cornerRadius=3] - Plate corner radius (mm)
 * @param {number} [opts.padding=4] - Padding around text (mm)
 * @param {'left'|'center'|'right'} [opts.align='center'] - Text alignment
 * @param {boolean} [opts.border=false] - Add raised border
 * @param {number} [opts.borderWidth=1.5] - Border line width (mm)
 * @param {boolean} [opts.holes=false] - Add mount holes
 * @returns {Promise<Buffer>}
 */
export async function generateTextPlate3MF(opts = {}) {
  const text = opts.text || 'Hello World';
  const fontSize = opts.fontSize || 8;
  const lineSpacing = opts.lineSpacing || 1.5;
  const pd = opts.plateDepth || 2;
  const textH = opts.textHeight || 0.8;
  const padding = opts.padding || 4;
  const align = opts.align || 'center';
  const addBorder = opts.border || false;
  const borderW = opts.borderWidth || 1.5;
  const addHoles = opts.holes || false;

  // Split text into lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) lines.push('Text');

  // Convert each line to grid and calculate dimensions
  const lineGrids = lines.map(l => textToGrid(l));
  const lineHeight = fontSize;
  const charScale = fontSize / 7; // 7 pixels tall
  const totalTextH = lines.length * lineHeight + (lines.length - 1) * (lineHeight * (lineSpacing - 1));
  const maxLineW = Math.max(...lineGrids.map(g => g.width * charScale));

  let pw = opts.plateWidth || (maxLineW + padding * 2);
  let ph = opts.plateHeight || (totalTextH + padding * 2);

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
    const colPlate = addColor('Plate', 240, 240, 240);
    const colText = addColor('Text', 30, 30, 30);

    // Plate
    const plateMesh = model.AddMeshObject();
    plateMesh.SetName('Plate');
    plateMesh.SetObjectLevelProperty(mgId, colPlate);
    const plate = new MeshBuilder(lib, plateMesh);
    plate.addBox(0, 0, 0, pw, ph, pd);

    // Border
    if (addBorder) {
      plate.addBox(0, 0, pd, pw, borderW, textH * 0.6);          // bottom
      plate.addBox(0, ph - borderW, pd, pw, borderW, textH * 0.6); // top
      plate.addBox(0, borderW, pd, borderW, ph - borderW * 2, textH * 0.6); // left
      plate.addBox(pw - borderW, borderW, pd, borderW, ph - borderW * 2, textH * 0.6); // right
    }

    // Mount holes
    if (addHoles) {
      const hr = 2;
      plate.addCylinder(hr + 3, ph / 2, pd, hr + 0.5, textH, 12);
      plate.addCylinder(pw - hr - 3, ph / 2, pd, hr + 0.5, textH, 12);
    }

    // Text — each line rendered as pixel blocks
    const textMesh = model.AddMeshObject();
    textMesh.SetName('Text');
    textMesh.SetObjectLevelProperty(mgId, colText);
    const tb = new MeshBuilder(lib, textMesh);

    let yPos = ph - padding - lineHeight;
    for (let li = 0; li < lineGrids.length; li++) {
      const lg = lineGrids[li];
      const lineW = lg.width * charScale;
      let xStart;
      if (align === 'left') xStart = padding;
      else if (align === 'right') xStart = pw - padding - lineW;
      else xStart = (pw - lineW) / 2;

      for (let r = 0; r < lg.height; r++) {
        for (let c = 0; c < lg.width; c++) {
          if (lg.grid[r][c]) {
            tb.addBox(
              xStart + (lg.width - 1 - c) * charScale, // mirrored X
              yPos + r * charScale,
              pd,
              charScale * 0.9, charScale * 0.9, textH
            );
          }
        }
      }
      yPos -= lineHeight * lineSpacing;
    }

    model.AddBuildItem(plateMesh, wrapper.GetIdentityTransform());
    model.AddBuildItem(textMesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', lines[0] || 'Text Plate');
    addMd('Application', '3DPrintForge Model Forge');

    const vfsPath = `/textplate_${Date.now()}.3mf`;
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
