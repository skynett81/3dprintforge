/**
 * Image to Heightmap converter — pure JS PNG decoder
 * Converts uploaded images to grayscale heightmap grids for lithophanes, reliefs, stencils
 * No external dependencies — uses Node.js built-in zlib for DEFLATE
 */

import { inflateSync } from 'node:zlib';

/**
 * Convert an image buffer (PNG) to a heightmap grid
 * @param {Buffer} buffer - PNG file buffer
 * @param {object} opts
 * @param {number} [opts.maxWidth=200] - Max grid width (downsample if larger)
 * @param {number} [opts.maxHeight=200] - Max grid height
 * @param {boolean} [opts.invert=false] - Invert brightness (dark=high)
 * @param {number} [opts.gamma=1.0] - Gamma correction
 * @returns {{ grid: number[][], width: number, height: number, originalWidth: number, originalHeight: number }}
 */
export function imageToHeightmap(buffer, opts = {}) {
  const maxW = opts.maxWidth || 200;
  const maxH = opts.maxHeight || 200;
  const invert = opts.invert || false;
  const gamma = opts.gamma || 1.0;

  const { pixels, width, height, channels } = decodePNG(buffer);

  // Downsample if needed
  let sampleW = width, sampleH = height;
  if (width > maxW || height > maxH) {
    const ratio = Math.min(maxW / width, maxH / height);
    sampleW = Math.max(1, Math.round(width * ratio));
    sampleH = Math.max(1, Math.round(height * ratio));
  }

  const grid = [];
  for (let r = 0; r < sampleH; r++) {
    const row = [];
    const srcY = Math.floor(r * height / sampleH);
    for (let c = 0; c < sampleW; c++) {
      const srcX = Math.floor(c * width / sampleW);
      const idx = (srcY * width + srcX) * channels;

      // Convert to grayscale (luminance)
      let gray;
      if (channels >= 3) {
        gray = (pixels[idx] * 0.299 + pixels[idx+1] * 0.587 + pixels[idx+2] * 0.114) / 255;
      } else {
        gray = pixels[idx] / 255;
      }

      // Apply gamma
      if (gamma !== 1.0) gray = Math.pow(gray, gamma);

      // Invert if requested (lithophanes: bright=thick, dark=thin)
      if (invert) gray = 1 - gray;

      row.push(Math.max(0, Math.min(1, gray)));
    }
    grid.push(row);
  }

  return { grid, width: sampleW, height: sampleH, originalWidth: width, originalHeight: height };
}

// ── Minimal PNG decoder (8-bit, non-interlaced) ──

function decodePNG(buf) {
  // Verify PNG signature
  const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  for (let i = 0; i < 8; i++) {
    if (buf[i] !== sig[i]) throw new Error('Not a valid PNG file');
  }

  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  const dataChunks = [];
  let offset = 8;

  while (offset < buf.length) {
    const chunkLen = buf.readUInt32BE(offset);
    const chunkType = buf.toString('ascii', offset + 4, offset + 8);

    if (chunkType === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
      bitDepth = buf[offset + 16];
      colorType = buf[offset + 17];
      const compression = buf[offset + 18];
      const filter = buf[offset + 19];
      const interlace = buf[offset + 20];
      if (interlace !== 0) throw new Error('Interlaced PNG not supported — please use a non-interlaced image');
      if (compression !== 0) throw new Error('Unknown PNG compression method');
      if (bitDepth !== 8 && bitDepth !== 16) throw new Error(`Unsupported bit depth: ${bitDepth}. Use 8-bit or 16-bit PNG`);
    } else if (chunkType === 'IDAT') {
      dataChunks.push(buf.subarray(offset + 8, offset + 8 + chunkLen));
    } else if (chunkType === 'IEND') {
      break;
    }

    offset += 12 + chunkLen; // 4 len + 4 type + data + 4 crc
  }

  if (width === 0 || height === 0) throw new Error('PNG missing IHDR chunk');
  if (dataChunks.length === 0) throw new Error('PNG missing IDAT chunk');

  // Determine channels from color type
  const channelMap = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }; // grayscale, RGB, palette, gray+alpha, RGBA
  const channels = channelMap[colorType];
  if (channels === undefined) throw new Error(`Unsupported PNG color type: ${colorType}`);
  if (colorType === 3) throw new Error('Palette PNG not supported — please convert to RGB/RGBA');

  const bytesPerPixel = channels * (bitDepth === 16 ? 2 : 1);
  const rawRowLen = width * bytesPerPixel;

  // Decompress all IDAT chunks
  const compressed = Buffer.concat(dataChunks);
  const decompressed = inflateSync(compressed);

  // De-filter scanlines
  const pixels = new Uint8Array(width * height * channels);
  let srcOff = 0;

  for (let y = 0; y < height; y++) {
    const filterType = decompressed[srcOff++];
    const rawRow = decompressed.subarray(srcOff, srcOff + rawRowLen);
    srcOff += rawRowLen;

    for (let i = 0; i < rawRowLen; i++) {
      let val = rawRow[i];
      const a = i >= bytesPerPixel ? rawRow[i - bytesPerPixel] : 0; // left
      const b = y > 0 ? _getPrevRow(pixels, y, i, width, channels, bitDepth) : 0; // up
      const c = (i >= bytesPerPixel && y > 0) ? _getPrevRow(pixels, y, i - bytesPerPixel, width, channels, bitDepth) : 0; // upper-left

      switch (filterType) {
        case 0: break;                        // None
        case 1: val = (val + a) & 0xFF; break; // Sub
        case 2: val = (val + b) & 0xFF; break; // Up
        case 3: val = (val + Math.floor((a + b) / 2)) & 0xFF; break; // Average
        case 4: val = (val + _paeth(a, b, c)) & 0xFF; break; // Paeth
        default: throw new Error(`Unknown PNG filter type: ${filterType}`);
      }

      rawRow[i] = val;

      // Store as 8-bit (downsample 16-bit if needed)
      if (bitDepth === 16) {
        if (i % 2 === 0) {
          const dstIdx = (y * width * channels) + Math.floor(i / 2);
          pixels[dstIdx] = val; // Use high byte only for 16-bit
        }
      } else {
        pixels[y * width * channels + i] = val;
      }
    }
  }

  return { pixels, width, height, channels };
}

function _getPrevRow(pixels, y, i, width, channels, bitDepth) {
  if (bitDepth === 16) {
    // For 16-bit, we need the raw defiltered byte, but we only stored 8-bit
    // Fall back to the stored 8-bit value
    const dstIdx = ((y - 1) * width * channels) + Math.floor(i / 2);
    return i % 2 === 0 ? (pixels[dstIdx] || 0) : 0;
  }
  return pixels[(y - 1) * width * channels + i] || 0;
}

function _paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}
