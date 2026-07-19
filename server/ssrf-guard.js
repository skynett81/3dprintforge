// SSRF guard for server-initiated HTTP(S) requests to URLs that are
// influenced by user input (price-tracking product pages, remotely
// supplied image URLs, HTTP redirects, external model-site scrapes).
//
// The dashboard also talks to user-configured printers and (optionally)
// a self-hosted Spoolman on the LAN, so callers that legitimately need
// private/loopback targets pass { allowPrivate: true }. Cloud-metadata
// (169.254.169.254 and friends) is blocked unconditionally.
import net from 'node:net';

const METADATA_IPS = new Set(['169.254.169.254', 'fd00:ec2::254']);

/** True for IPv4 literals in loopback / private / link-local ranges. */
function _isPrivateV4(ip) {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some(n => Number.isNaN(n) || n < 0 || n > 255)) return false;
  const [a, b] = p;
  if (a === 0 || a === 127) return true;                 // this-host / loopback
  if (a === 10) return true;                             // 10.0.0.0/8
  if (a === 172 && b >= 16 && b <= 31) return true;      // 172.16.0.0/12
  if (a === 192 && b === 168) return true;               // 192.168.0.0/16
  if (a === 169 && b === 254) return true;               // link-local (metadata)
  if (a === 100 && b >= 64 && b <= 127) return true;     // 100.64.0.0/10 CGNAT
  return false;
}

/** True for IPv6 literals in loopback / unique-local / link-local ranges. */
function _isPrivateV6(ip) {
  const h = ip.toLowerCase().replace(/^\[|\]$/g, '');
  if (h === '::1' || h === '::') return true;
  if (h.startsWith('fe80') || h.startsWith('fc') || h.startsWith('fd')) return true; // link-local / ULA
  // IPv4-mapped in dotted form (::ffff:a.b.c.d) — reuse the v4 rules.
  const dotted = h.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) return _isPrivateV4(dotted[1]);
  // IPv4-mapped in the hex form Node's URL parser normalises to
  // (::ffff:7f00:1 === 127.0.0.1) — decode the two trailing hextets.
  const hex = h.match(/::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex) {
    const hi = parseInt(hex[1], 16), lo = parseInt(hex[2], 16);
    return _isPrivateV4(`${hi >> 8}.${hi & 0xff}.${lo >> 8}.${lo & 0xff}`);
  }
  return false;
}

/**
 * Decide whether an outbound URL is unsafe to fetch.
 * @param {string} urlStr
 * @param {{ allowPrivate?: boolean }} [opts] - allowPrivate lets LAN/loopback
 *        through for legitimately local services (printers, self-hosted Spoolman)
 * @returns {boolean} true when the request should be refused
 */
export function isDangerousUrl(urlStr, opts = {}) {
  const { allowPrivate = false } = opts;
  let u;
  try { u = new URL(urlStr); } catch { return true; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return true;

  let host = u.hostname.toLowerCase();
  if (host.startsWith('[') && host.endsWith(']')) host = host.slice(1, -1);

  // Cloud metadata endpoints are never allowed, even for LAN callers.
  if (METADATA_IPS.has(host)) return true;

  const isV4 = net.isIPv4(host);
  const isV6 = net.isIPv6(host);
  if (isV4 && _isPrivateV4(host)) return !allowPrivate;
  if (isV6 && _isPrivateV6(host)) return !allowPrivate;

  // Named hosts that resolve to the local machine / internal-only TLDs.
  if (!isV4 && !isV6) {
    if (host === 'localhost' || host.endsWith('.localhost') ||
        host.endsWith('.local') || host.endsWith('.internal') || host === '') {
      return !allowPrivate;
    }
  }
  return false;
}
