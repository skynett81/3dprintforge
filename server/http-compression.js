// HTTP response compression — brotli/gzip negotiation for static assets
// and JSON. Client picks via Accept-Encoding; server skips compression
// for tiny bodies and pre-compressed binary types (images, fonts, video)
// where re-zipping is pure CPU waste.
import { createReadStream } from 'node:fs';
import { createGzip, createBrotliCompress, gzipSync, brotliCompressSync, constants as zlibConstants } from 'node:zlib';

// Bodies under this size aren't compressed — TCP/HTTP framing overhead
// exceeds the savings, and the CPU cost of compressing is wasted on
// small payloads. 1 KB is the conventional threshold.
export const COMPRESS_MIN_BYTES = 1024;

// Brotli quality 4 is the sweet spot for dynamic content: ~3x faster
// than quality 11 for ~5% larger output. Level 11 is for static assets
// that can be pre-compressed at build time.
export const BROTLI_DYNAMIC_QUALITY = 4;
export const BROTLI_QUALITY_STATIC = 5; // higher than dynamic; still streams fast

// File extensions that compress well. Images/fonts/video are already
// compressed and re-zipping inflates output while burning CPU.
export const COMPRESSIBLE_EXTS = new Set([
  '.html', '.htm', '.js', '.mjs', '.css', '.svg',
  '.json', '.xml', '.txt', '.map',
]);

/** Pick the best supported encoding from the client's Accept-Encoding
 *  header. Returns 'br' | 'gzip' | null. */
export function pickEncoding(req) {
  const a = req?.headers?.['accept-encoding'] || '';
  if (a.includes('br')) return 'br';
  if (a.includes('gzip')) return 'gzip';
  return null;
}

/** Compress a JSON-serialised body if the client asked for it AND it's
 *  big enough to benefit. Returns { body, headers } where headers may
 *  include Content-Encoding/Vary. The caller is responsible for setting
 *  Content-Type and writing the response.
 *
 *  Sync compression is acceptable here because most JSON responses are
 *  under 100 KB (1-15 ms cost). Streams would be overkill. */
export function maybeCompressJson(json, req) {
  if (json.length < COMPRESS_MIN_BYTES) {
    return { body: json, headers: {} };
  }
  const enc = pickEncoding(req);
  if (enc === 'br') {
    const body = brotliCompressSync(json, {
      params: { [zlibConstants.BROTLI_PARAM_QUALITY]: BROTLI_DYNAMIC_QUALITY },
    });
    return { body, headers: { 'Content-Encoding': 'br', Vary: 'Accept-Encoding' } };
  }
  if (enc === 'gzip') {
    return { body: gzipSync(json), headers: { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } };
  }
  return { body: json, headers: {} };
}

/** Stream a static file to the response, compressing on the fly when the
 *  extension is compressible AND the client supports br/gzip. Drops
 *  Content-Length because chunked-transfer-encoding takes over once the
 *  payload size becomes unknown.
 *
 *  Note on quality: static assets can afford a higher Brotli quality
 *  than dynamic JSON because the response is streamed (the event loop
 *  doesn't block waiting for it). */
export function streamWithCompression(req, res, headers, filePath, ext) {
  const enc = COMPRESSIBLE_EXTS.has(ext) ? pickEncoding(req) : null;
  if (!enc) {
    res.writeHead(200, headers);
    createReadStream(filePath).pipe(res);
    return;
  }
  const merged = { ...headers, 'Content-Encoding': enc, Vary: 'Accept-Encoding' };
  delete merged['Content-Length'];
  res.writeHead(200, merged);
  const compressor = enc === 'br'
    ? createBrotliCompress({ params: { [zlibConstants.BROTLI_PARAM_QUALITY]: BROTLI_QUALITY_STATIC } })
    : createGzip();
  createReadStream(filePath).pipe(compressor).pipe(res);
}
