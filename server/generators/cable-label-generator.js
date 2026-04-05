/**
 * Cable Label Generator — wrap-around or flag labels for cables
 */

import { MeshBuilder, getLib } from '../mesh-builder.js';

const FONT={A:[0x7C,0x12,0x11,0x12,0x7C],B:[0x7F,0x49,0x49,0x49,0x36],C:[0x3E,0x41,0x41,0x41,0x22],D:[0x7F,0x41,0x41,0x22,0x1C],E:[0x7F,0x49,0x49,0x49,0x41],F:[0x7F,0x09,0x09,0x09,0x01],G:[0x3E,0x41,0x49,0x49,0x7A],H:[0x7F,0x08,0x08,0x08,0x7F],I:[0x00,0x41,0x7F,0x41,0x00],J:[0x20,0x40,0x41,0x3F,0x01],K:[0x7F,0x08,0x14,0x22,0x41],L:[0x7F,0x40,0x40,0x40,0x40],M:[0x7F,0x02,0x0C,0x02,0x7F],N:[0x7F,0x04,0x08,0x10,0x7F],O:[0x3E,0x41,0x41,0x41,0x3E],P:[0x7F,0x09,0x09,0x09,0x06],Q:[0x3E,0x41,0x51,0x21,0x5E],R:[0x7F,0x09,0x19,0x29,0x46],S:[0x46,0x49,0x49,0x49,0x31],T:[0x01,0x01,0x7F,0x01,0x01],U:[0x3F,0x40,0x40,0x40,0x3F],V:[0x1F,0x20,0x40,0x20,0x1F],W:[0x3F,0x40,0x30,0x40,0x3F],X:[0x63,0x14,0x08,0x14,0x63],Y:[0x07,0x08,0x70,0x08,0x07],Z:[0x61,0x51,0x49,0x45,0x43],
'0':[0x3E,0x51,0x49,0x45,0x3E],'1':[0x00,0x42,0x7F,0x40,0x00],'2':[0x42,0x61,0x51,0x49,0x46],'3':[0x21,0x41,0x45,0x4B,0x31],'4':[0x18,0x14,0x12,0x7F,0x10],'5':[0x27,0x45,0x45,0x45,0x39],'6':[0x3C,0x4A,0x49,0x49,0x30],'7':[0x01,0x71,0x09,0x05,0x03],'8':[0x36,0x49,0x49,0x49,0x36],'9':[0x06,0x49,0x49,0x29,0x1E],' ':[0,0,0,0,0],'.':[0,0x60,0x60,0,0],'-':[8,8,8,8,8],'/':[0x20,0x10,0x08,0x04,0x02],'_':[0x40,0x40,0x40,0x40,0x40]};

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
 * @param {string} [opts.text='ETH'] - Label text
 * @param {number} [opts.cableDiameter=5] - Cable diameter (mm)
 * @param {number} [opts.thickness=1.2] - Label wall thickness (mm)
 * @param {number} [opts.textHeight=0.6] - Raised text height (mm)
 * @param {number} [opts.labelHeight=12] - Label height along cable axis (mm)
 * @param {number} [opts.wrapAngle=270] - Wrap angle in degrees (< 360 for clip gap)
 * @param {'wrap'|'flag'} [opts.style='flag'] - Label style
 * @param {number} [opts.flagWidth=30] - Flag width (mm, only for flag style)
 * @param {number} [opts.tolerance=0.3] - Cable hole tolerance (mm)
 * @returns {Promise<Buffer>}
 */
export async function generateCableLabel3MF(opts = {}) {
  const text = opts.text || 'ETH';
  const cableD = opts.cableDiameter || 5;
  const thick = opts.thickness || 1.2;
  const textH = opts.textHeight || 0.6;
  const labelH = opts.labelHeight || 12;
  const style = opts.style || 'flag';
  const flagW = opts.flagWidth || 30;
  const tol = opts.tolerance || 0.3;
  const cableR = cableD / 2 + tol;
  const outerR = cableR + thick;

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
    const colLabel = addColor('Label', 240, 240, 240);
    const colText = addColor('Text', 30, 30, 30);

    const labelMesh = model.AddMeshObject();
    labelMesh.SetName('Cable Label');
    labelMesh.SetObjectLevelProperty(mgId, colLabel);
    const lb = new MeshBuilder(lib, labelMesh);

    if (style === 'flag') {
      // Flag style: ring around cable + flat flag extending out
      // Ring (tube)
      lb.addTube(0, 0, 0, outerR, cableR, labelH, 20);
      // Flag plate extending from ring
      lb.addBox(outerR - 1, -labelH / 2 + 1, 0, flagW, labelH - 2, thick);

      // Text on flag
      const tg = textToGrid(text);
      const textScale = Math.min((flagW - 4) / tg.width, (labelH - 4) / tg.height);
      const tx = outerR - 1 + (flagW - tg.width * textScale) / 2;
      const ty = -labelH / 2 + 1 + (labelH - 2 - tg.height * textScale) / 2;

      const textMesh = model.AddMeshObject();
      textMesh.SetName('Text');
      textMesh.SetObjectLevelProperty(mgId, colText);
      const tb = new MeshBuilder(lib, textMesh);

      for (let r = 0; r < tg.height; r++) {
        for (let c = 0; c < tg.width; c++) {
          if (tg.grid[r][c]) {
            tb.addBox(
              tx + (tg.width - 1 - c) * textScale,
              ty + r * textScale,
              thick,
              textScale * 0.9, textScale * 0.9, textH
            );
          }
        }
      }
      model.AddBuildItem(textMesh, wrapper.GetIdentityTransform());

    } else {
      // Wrap style: partial cylinder with text on outer surface
      const wrapAngle = (opts.wrapAngle || 270) * Math.PI / 180;
      const segs = 24;
      const arcSegs = Math.round(segs * (wrapAngle / (Math.PI * 2)));

      // Build curved band manually
      const base = lb.vOff;
      for (let i = 0; i <= arcSegs; i++) {
        const a = (i / arcSegs) * wrapAngle - wrapAngle / 2;
        const cosA = Math.cos(a), sinA = Math.sin(a);
        lb._addVertex(cosA * outerR, sinA * outerR, 0);           // outer bottom
        lb._addVertex(cosA * outerR, sinA * outerR, labelH);      // outer top
        lb._addVertex(cosA * cableR, sinA * cableR, 0);           // inner bottom
        lb._addVertex(cosA * cableR, sinA * cableR, labelH);      // inner top
      }

      for (let i = 0; i < arcSegs; i++) {
        const cur = base + i * 4, nxt = base + (i + 1) * 4;
        // Outer face
        lb._addTri(cur, nxt, nxt + 1); lb._addTri(cur, nxt + 1, cur + 1);
        // Inner face (reversed)
        lb._addTri(cur + 2, nxt + 3, nxt + 2); lb._addTri(cur + 2, cur + 3, nxt + 3);
        // Bottom
        lb._addTri(cur, cur + 2, nxt + 2); lb._addTri(cur, nxt + 2, nxt);
        // Top
        lb._addTri(cur + 1, nxt + 1, nxt + 3); lb._addTri(cur + 1, nxt + 3, cur + 3);
      }
      // End caps
      const first = base, last = base + arcSegs * 4;
      lb._addTri(first, first + 1, first + 3); lb._addTri(first, first + 3, first + 2);
      lb._addTri(last, last + 3, last + 1); lb._addTri(last, last + 2, last + 3);
    }

    model.AddBuildItem(labelMesh, wrapper.GetIdentityTransform());

    const mdg = model.GetMetaDataGroup();
    const addMd = (k, v) => { const m = mdg.AddMetaData('', k, v, 'string', true); m.delete(); };
    addMd('Title', text);
    addMd('Application', '3DPrintForge Model Forge');

    const vfsPath = `/cable_${Date.now()}.3mf`;
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
