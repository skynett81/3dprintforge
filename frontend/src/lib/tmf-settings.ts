// tmf-settings.ts — import a Bambu/Orca 3MF project's embedded PROCESS settings.
//
// A BambuStudio/OrcaSlicer .3mf project stores its slicing configuration in
// Metadata/project_settings.config (JSON). If we ignore it and slice with our
// defaults, a model authored for e.g. 5 walls + 40% infill comes out far
// sparser than the user saw in BambuStudio — "wrong". This reads those
// settings and maps the Bambu keys onto our SliceSettings keys so opening a
// project slices as its author intended.

import { unzipSync, strFromU8 } from 'fflate';

// Bambu process key -> [our key, transform]. Transform converts the Bambu value
// (always a string, sometimes an array) to our value.
const num = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? n : undefined; };
// Our UI stores density/overlap as a PERCENTAGE number (e.g. 40, 15), not a fraction.
const pctNum = (v: string) => { const n = parseFloat(String(v).replace('%', '')); return Number.isFinite(n) ? n : undefined; };
// Bambu/Orca infill pattern names -> ours.
const PATTERN: Record<string, string> = {
  grid: 'grid', line: 'line', cubic: 'cubic', triangles: 'triangles', 'tri-hexagon': 'triangles',
  gyroid: 'gyroid', honeycomb: 'honeycomb', '3dhoneycomb': 'honeycomb', adaptivecubic: 'adaptivecubic',
  concentric: 'concentric', hilbertcurve: 'hilbert', crosshatch: 'crosshatch', zigzag: 'zigzag',
  'aligned rectilinear': 'alignedrectilinear', rectilinear: 'line', lightning: 'lightning',
};
const surfacePat = (v: string) => (String(v).toLowerCase().includes('concentric') ? 'concentric' : String(v).toLowerCase().includes('monotonic') ? 'monotonicline' : 'rectilinear');

const MAP: Record<string, [string, (v: string) => unknown]> = {
  layer_height: ['layer_height', num],
  initial_layer_print_height: ['initial_layer_height', num],
  wall_loops: ['wall_loops', num],
  top_shell_layers: ['top_layers', num],
  bottom_shell_layers: ['bottom_layers', num],
  sparse_infill_density: ['infill_density', pctNum],
  sparse_infill_pattern: ['infill_pattern', (v) => PATTERN[String(v).toLowerCase()] ?? 'grid'],
  top_surface_pattern: ['top_surface_pattern', surfacePat],
  infill_wall_overlap: ['infill_wall_overlap', pctNum],
  outer_wall_line_width: ['outer_wall_line_width', num],
  inner_wall_line_width: ['inner_wall_line_width', num],
  sparse_infill_line_width: ['sparse_infill_line_width', num],
  line_width: ['line_width', num],
  wall_sequence: ['wall_infill_order', (v) => { const s = String(v).toLowerCase(); return s.includes('inner and outer') || s.includes('inner-outer-inner') ? 'inner-outer-inner' : s.startsWith('inner') ? 'inner-outer' : 'outer-inner'; }],
  seam_position: ['seam_position', (v) => String(v).toLowerCase()],
  sparse_infill_anchor: ['infill_anchor', num],
  brim_width: ['brim_width', num],
  brim_type: ['brim_type', (v) => String(v)],
  skirt_loops: ['skirt_loops', num],
  ironing_type: ['ironing', (v) => String(v).toLowerCase() !== 'no ironing'],
};

/**
 * Parse a 3MF buffer's embedded process settings into our SliceSettings shape.
 * Returns null if the file has no project_settings.config (not a Bambu/Orca
 * project). Only keys we recognise are returned.
 */
export function parse3mfSettings(buf: ArrayBuffer): Record<string, string | number | boolean> | null {
  let files: Record<string, Uint8Array>;
  try { files = unzipSync(new Uint8Array(buf)); } catch { return null; }
  const key = Object.keys(files).find((n) => /project_settings\.config$/i.test(n));
  if (!key) return null;
  let json: Record<string, unknown>;
  try { json = JSON.parse(strFromU8(files[key])); } catch { return null; }
  const out: Record<string, string | number | boolean> = {};
  for (const [bk, [ourKey, xf]] of Object.entries(MAP)) {
    const raw = json[bk];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (v === undefined || v === null || v === '') continue;
    const mapped = xf(String(v));
    if (mapped !== undefined) out[ourKey] = mapped as string | number | boolean;
  }
  return Object.keys(out).length ? out : null;
}
