// tmf-colors.ts — read Bambu/Orca/Prusa 3MF part colours.
//
// These slicers store a multi-colour model as separate parts, each tagged
// with an `extruder` in Metadata/model_settings.config; the real colours are
// the `filament_colour` array in Metadata/project_settings.config. The
// standard ThreeMFLoader ignores both, so painted/multi-part models render as
// one grey blob. This parser extracts the ordered per-part extruder list and
// the filament colours so the viewer can show the model as intended.

import { unzipSync, strFromU8 } from 'fflate';

export interface TmfColors {
  /** Extruder index (1-based) per part, in document order. */
  extruders: number[];
  /** Filament colours, e.g. ['#000000', '#0080FF']. */
  colors: string[];
}

function parseExtruders(modelSettingsXml: string): number[] {
  const out: number[] = [];
  const objects = modelSettingsXml.split(/<object\b/).slice(1);
  for (const obj of objects) {
    const objExt = obj.match(/key="extruder"\s+value="(\d+)"/);
    const objE = objExt ? parseInt(objExt[1], 10) : 1;
    const parts = obj.split(/<part\b/).slice(1);
    if (!parts.length) { out.push(objE); continue; }
    for (const p of parts) {
      const pe = p.match(/key="extruder"\s+value="(\d+)"/);
      out.push(pe ? parseInt(pe[1], 10) : objE);
    }
  }
  return out;
}

function parseFilamentColors(projectSettings: string): string[] {
  const m = projectSettings.match(/"filament_colou?r"\s*:\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/"(#[0-9A-Fa-f]{6})"/g)].map((x) => x[1]);
}

export function parse3mfColors(buf: ArrayBuffer): TmfColors | null {
  try {
    const files = unzipSync(new Uint8Array(buf));
    const find = (suffix: string) => {
      const key = Object.keys(files).find((k) => k.replace(/\\/g, '/').endsWith(suffix));
      return key ? strFromU8(files[key]) : '';
    };
    const modelSettings = find('Metadata/model_settings.config');
    const projectSettings = find('Metadata/project_settings.config');
    if (!modelSettings && !projectSettings) return null;
    const extruders = modelSettings ? parseExtruders(modelSettings) : [];
    const colors = projectSettings ? parseFilamentColors(projectSettings) : [];
    if (!extruders.length && !colors.length) return null;
    return { extruders, colors };
  } catch {
    return null;
  }
}
