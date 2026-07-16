// compare.mjs — slice each parity model with our engine and diff its per-feature
// geometry against the matching BambuStudio reference g-code (out/<m>_bambu.gcode).
// Run after gen-models.mjs + slicing the references with BambuStudio CLI.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bufferToMesh } from '../../server/format-converter.js';
import { sliceMeshToGcode } from '../../server/native-slicer.js';
import { analyze } from './analyze.mjs';

const DIR = dirname(fileURLToPath(import.meta.url));
const MODELS = ['cube', 'cylinder', 'overhang', 'thinwall', 'holes'];
// BambuStudio 0.20 mm Standard defaults (from result.json / preset).
const SETTINGS = { layerHeight: 0.2, wall_loops: 2, infill_density: 20, top_layers: 5, bottom_layers: 3, infill_pattern: 'grid' };

const ORDER = ['outerWall', 'innerWall', 'topSurface', 'bottomSurface', 'solidInfill', 'bridge', 'sparseInfill', 'skirt'];
const pad = (s, n) => String(s).padEnd(n);
const num = (v) => (v ? v.toFixed(0) : '·').padStart(8);

for (const m of MODELS) {
  const ref = join(DIR, 'out', `${m}_bambu.gcode`);
  const bambu = m === 'cube' ? join(DIR, 'out', 'plate_1.gcode') : ref;
  if (!existsSync(bambu)) { console.log(`\n### ${m}: no BambuStudio reference, skipping`); continue; }
  const mesh = await bufferToMesh(readFileSync(join(DIR, 'models', `${m}.stl`)), `${m}.stl`);
  const r = await sliceMeshToGcode(mesh, SETTINGS);
  const outPath = join(DIR, 'out', `${m}_ours.gcode`);
  writeFileSync(outPath, r.gcode);
  const A = analyze(bambu), B = analyze(outPath);
  console.log(`\n### ${m}   BambuStudio total ${A.total.toFixed(0)} mm  |  ours ${B.total.toFixed(0)} mm  (${((B.total / A.total - 1) * 100).toFixed(1)}%)`);
  console.log(`  ${pad('feature', 14)} ${pad('bambu', 8)} ${pad('ours', 8)}  delta`);
  for (const k of ORDER) {
    const a = A.len[k], b = B.len[k];
    if (!a && !b) continue;
    const d = a && b ? `${((b / a - 1) * 100).toFixed(0)}%` : (b ? 'ONLY OURS' : 'MISSING');
    console.log(`  ${pad(k, 14)} ${num(a)} ${num(b)}  ${d}`);
  }
}
