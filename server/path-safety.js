// Path-traversal safety for static file serving.
//
// User-controlled URL paths must never resolve outside the directory
// they are meant to be served from. `resolveWithin` normalises the
// requested sub-path, forces it to stay relative to the base, and
// verifies the resolved absolute path is contained within the base
// directory — returning null when the request tries to escape.
import { normalize, resolve, sep } from 'node:path';

/**
 * Resolve `userPath` inside `baseDir`, guaranteeing the result cannot
 * escape the base directory via `..`, absolute paths, or NUL bytes.
 *
 * @param {string} baseDir - trusted base directory
 * @param {string} userPath - untrusted request path (relative or with a leading slash)
 * @returns {string|null} the safe absolute path, or null if it escapes the base
 */
export function resolveWithin(baseDir, userPath) {
  if (typeof userPath !== 'string' || userPath.includes('\0')) return null;
  const baseResolved = resolve(baseDir);
  // Normalise, then strip leading slashes and any leading ".." segments
  // so the path is forced to stay relative to baseDir.
  let rel = normalize(userPath).replace(/\\/g, '/');
  rel = rel.replace(/^\/+/, '');
  rel = rel.replace(/^(\.\.(\/|$))+/, '');
  const full = resolve(baseResolved, rel);
  if (full !== baseResolved && !full.startsWith(baseResolved + sep)) return null;
  return full;
}
