/**
 * 3MF and Gcode file parsers for extracting filament usage data
 * Uses lib3mf WASM for standard 3MF metadata + custom ZIP parsing for slicer-specific configs
 */
import { inflateRawSync } from 'node:zlib';
import { parse3mfBuffer } from './lib3mf-parser.js';

/**
 * Parse ZIP entries from a buffer (for slicer-specific config files that lib3mf doesn't expose)
 */
function parseZipEntries(buf) {
  const entries = [];
  let eocdPos = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocdPos = i; break; }
  }
  if (eocdPos < 0) return entries;
  const cdOffset = buf.readUInt32LE(eocdPos + 16);
  const cdSize = buf.readUInt32LE(eocdPos + 12);
  let pos = cdOffset;
  const cdEnd = cdOffset + cdSize;
  while (pos < cdEnd) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;
    const comprMethod = buf.readUInt16LE(pos + 10);
    const compressedSize = buf.readUInt32LE(pos + 20);
    const uncompressedSize = buf.readUInt32LE(pos + 24);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localHeaderOffset = buf.readUInt32LE(pos + 42);
    const name = buf.toString('utf8', pos + 46, pos + 46 + nameLen);
    const lhPos = localHeaderOffset;
    const lhExtraLen = buf.readUInt16LE(lhPos + 28);
    const lhNameLen = buf.readUInt16LE(lhPos + 26);
    const dataStart = lhPos + 30 + lhNameLen + lhExtraLen;
    let data;
    if (comprMethod === 0) {
      data = buf.subarray(dataStart, dataStart + uncompressedSize);
    } else if (comprMethod === 8) {
      try { data = inflateRawSync(buf.subarray(dataStart, dataStart + compressedSize)); } catch { data = Buffer.alloc(0); }
    } else {
      data = Buffer.alloc(0);
    }
    entries.push({ name, data: data.toString('utf8') });
    pos += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

/**
 * Parse 3MF file to extract filament usage information
 * Hybrid: lib3mf for standard metadata, ZIP parsing for slicer-specific config
 * Returns: { filaments: [{ material, color, weight_g, vendor }], total_weight_g, estimated_time_min }
 */
export async function parse3mf(buffer) {
  const result = { filaments: [], total_weight_g: 0, estimated_time_min: 0, plate_name: '' };

  // Get standard 3MF metadata via lib3mf
  let lib3mfData;
  try {
    lib3mfData = await parse3mfBuffer(buffer);
  } catch { /* fall through to ZIP parsing */ }

  // Extract slicer-specific config from ZIP entries (Bambu/Prusa/Orca store these as raw files)
  const entries = parseZipEntries(buffer);

  for (const entry of entries) {
    if (entry.name.match(/Metadata\/slice_info/i) || entry.name.match(/\.config$/i)) {
      const filamentMatches = entry.data.matchAll(/filament_used_g\s*=\s*([\d.]+)/g);
      for (const m of filamentMatches) {
        const weight = parseFloat(m[1]);
        if (weight > 0) result.filaments.push({ weight_g: weight });
      }

      const materialMatches = entry.data.matchAll(/filament_type\s*=\s*(.+)/g);
      let i = 0;
      for (const m of materialMatches) {
        const types = m[1].trim().split(';');
        for (const type of types) {
          if (result.filaments[i]) result.filaments[i].material = type.trim();
          i++;
        }
      }

      const colorMatches = entry.data.matchAll(/filament_colour\s*=\s*(.+)/g);
      i = 0;
      for (const m of colorMatches) {
        const colors = m[1].trim().split(';');
        for (const c of colors) {
          if (result.filaments[i]) result.filaments[i].color = c.trim();
          i++;
        }
      }

      const timeMatch = entry.data.match(/estimated_time\s*=\s*(\d+)/);
      if (timeMatch) result.estimated_time_min = Math.round(parseInt(timeMatch[1]) / 60);
    }

    if (entry.name.match(/Metadata\/model_settings/i)) {
      const plateMatch = entry.data.match(/plate_name[^>]*>([^<]+)/);
      if (plateMatch) result.plate_name = plateMatch[1];
    }

    if (entry.name.match(/\.gcode$/i)) {
      const gcodeResult = parseGcodeString(entry.data);
      if (gcodeResult.total_weight_g > 0 && result.filaments.length === 0) {
        result.filaments = gcodeResult.filaments;
      }
      if (gcodeResult.estimated_time_min > 0) result.estimated_time_min = gcodeResult.estimated_time_min;
    }
  }

  // Enrich with standard 3MF metadata from lib3mf
  if (lib3mfData) {
    if (!result.plate_name && lib3mfData.metadata.Title) {
      result.plate_name = lib3mfData.metadata.Title;
    }
    // Store lib3mf parsed data for downstream use (thumbnails, mesh data, etc.)
    result._lib3mf = lib3mfData;
  }

  result.total_weight_g = result.filaments.reduce((sum, f) => sum + (f.weight_g || 0), 0);

  // Estimate color/tool changes for multi-color prints
  if (result.filaments.length > 1) {
    let toolChanges = 0;
    for (const entry of entries) {
      if (entry.name.match(/\.gcode$/i)) {
        const matches = entry.data.match(/^T\d+$/gm);
        if (matches) toolChanges = Math.max(toolChanges, matches.length);
      }
    }
    result._estimated_changes = toolChanges || (result.filaments.length - 1);
    result._change_time_s = toolChanges > 0 ? toolChanges * 35 : 0;
  } else {
    result._estimated_changes = 0;
    result._change_time_s = 0;
  }

  return result;
}

/**
 * Parse Gcode string to extract filament usage
 */
function parseGcodeString(content) {
  const result = { filaments: [], total_weight_g: 0, estimated_time_min: 0 };

  const weightMatch = content.match(/;\s*filament used \[g\]\s*=\s*([\d.,]+)/i);
  if (weightMatch) {
    const weights = weightMatch[1].split(',').map(w => parseFloat(w.trim()));
    for (const w of weights) {
      if (w > 0) result.filaments.push({ weight_g: w });
    }
  }

  const densityMatch = content.match(/;\s*filament_density\s*=\s*([\d.,]+)/i);
  const densities = densityMatch ? densityMatch[1].split(',').map(d => parseFloat(d.trim())) : [];
  const diameterMatch = content.match(/;\s*filament_diameter\s*=\s*([\d.,]+)/i);
  const diameters = diameterMatch ? diameterMatch[1].split(',').map(d => parseFloat(d.trim())) : [];

  if (result.filaments.length === 0) {
    const mmMatch = content.match(/;\s*filament used \[mm\]\s*=\s*([\d.,]+)/i);
    if (mmMatch) {
      const lengths = mmMatch[1].split(',').map(l => parseFloat(l.trim()));
      for (let i = 0; i < lengths.length; i++) {
        const len = lengths[i];
        if (len > 0) {
          const diameter = diameters[i] || diameters[0] || 1.75;
          const density = densities[i] || densities[0] || 1.24;
          const radiusCm = (diameter / 10) / 2;
          const volumeCm3 = (len / 10) * Math.PI * radiusCm * radiusCm;
          const weightG = volumeCm3 * density;
          result.filaments.push({
            weight_g: Math.round(weightG * 100) / 100,
            length_mm: len,
            density,
            diameter,
          });
        }
      }
    }
  }

  for (let i = 0; i < result.filaments.length; i++) {
    if (!result.filaments[i].density && densities[i]) result.filaments[i].density = densities[i];
    if (!result.filaments[i].diameter && diameters[i]) result.filaments[i].diameter = diameters[i];
  }

  const typeMatch = content.match(/;\s*filament_type\s*=\s*(.+)/i);
  if (typeMatch) {
    const types = typeMatch[1].trim().split(';');
    types.forEach((type, i) => {
      if (result.filaments[i]) result.filaments[i].material = type.trim();
    });
  }

  const timeMatch = content.match(/;\s*estimated (?:printing )?time[^=]*=\s*(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?/i);
  if (timeMatch) {
    const d = parseInt(timeMatch[1] || 0);
    const h = parseInt(timeMatch[2] || 0);
    const m = parseInt(timeMatch[3] || 0);
    result.estimated_time_min = d * 1440 + h * 60 + m;
  }

  const curaMatch = content.match(/;\s*Filament used:\s*([\d.]+)m/i);
  if (curaMatch && result.filaments.length === 0) {
    const meters = parseFloat(curaMatch[1]);
    const mm = meters * 1000;
    const diameter = diameters[0] || 1.75;
    const density = densities[0] || 1.24;
    const radiusCm = (diameter / 10) / 2;
    const volumeCm3 = (mm / 10) * Math.PI * radiusCm * radiusCm;
    const weightG = volumeCm3 * density;
    result.filaments.push({ weight_g: Math.round(weightG * 100) / 100, length_mm: mm, density, diameter });
  }

  result.total_weight_g = result.filaments.reduce((sum, f) => sum + (f.weight_g || 0), 0);
  return result;
}

/**
 * Parse Gcode file (Buffer) to extract filament usage
 */
export function parseGcode(buffer) {
  const text = buffer.length > 200000
    ? buffer.toString('utf8', 0, 100000) + '\n' + buffer.toString('utf8', buffer.length - 100000)
    : buffer.toString('utf8');
  return parseGcodeString(text);
}
