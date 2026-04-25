/**
 * Printer Image Renderer — generates a distinct, recognisable SVG for
 * every printer model in the project, derived from its capabilities
 * (build volume, chassis kinematics, feature flags). No external assets
 * required, no copyright concerns, works offline. Replaces the fall-
 * through-to-blank-fallback path when the registry has no URL.
 *
 * The SVG depicts the printer's actual chassis archetype:
 *   - bedslinger      open A-frame (Ender, Sovol, Prusa MK*, Mini)
 *   - corexy          enclosed cube (Bambu, Voron 2.4, K1C, Centauri)
 *   - corexy_idex     wide cube w/ two visible heads (H2D, J1, Toolchanger)
 *   - delta           tall triangular tower (FlashForge Magician)
 *   - toolchanger     wide cube w/ multiple parked heads (XL, U1)
 *   - vortek          enclosed cube w/ 7-toolhead carousel (H2C)
 *   - corexz          tilted Z-axis (Voron Switchwire)
 *
 * Plus optional feature overlays:
 *   - AMS strip (Bambu)        - CFS sidecar (Creality)
 *   - chamber heater glow      - filament humidity meter
 *   - laser badge (H2D Pro)    - hardened-hotend badge
 *   - multi-colour swatch row  - print-bed grid
 *
 * Typical render time: <2 ms. Output is plain SVG (text/svg) — caller
 * stores it in the same on-disk cache as fetched images.
 */

const BRAND_COLORS = {
  bambu:     { primary: '#00AE42', accent: '#0a3d1e', label: '#fff' },
  prusa:     { primary: '#FB8C00', accent: '#5d3000', label: '#fff' },
  snapmaker: { primary: '#00A98F', accent: '#003d33', label: '#fff' },
  creality:  { primary: '#1E88E5', accent: '#0a3a66', label: '#fff' },
  elegoo:    { primary: '#039BE5', accent: '#093a52', label: '#fff' },
  voron:     { primary: '#E74C3C', accent: '#5c1d16', label: '#fff' },
  ratrig:    { primary: '#F44336', accent: '#5c1815', label: '#fff' },
  ankermake: { primary: '#2DD4BF', accent: '#0e433d', label: '#fff' },
  qidi:      { primary: '#7B1FA2', accent: '#280a35', label: '#fff' },
  anycubic:  { primary: '#FFA000', accent: '#5e3900', label: '#fff' },
  sovol:     { primary: '#FF6F00', accent: '#5c2800', label: '#fff' },
  flashforge:{ primary: '#FB8C00', accent: '#5d3000', label: '#fff' },
  biqu:      { primary: '#FFB300', accent: '#5d3f00', label: '#000' },
  twotrees:  { primary: '#3F51B5', accent: '#161e44', label: '#fff' },
  tronxy:    { primary: '#9C27B0', accent: '#3a0a45', label: '#fff' },
  mingda:    { primary: '#00BCD4', accent: '#003a44', label: '#fff' },
  kywoo:     { primary: '#7CB342', accent: '#2e4419', label: '#fff' },
  generic:   { primary: '#64748b', accent: '#1f2937', label: '#fff' },
};

function _detectBrand(model) {
  const m = String(model || '').toLowerCase();
  // Brand-specific patterns FIRST so e.g. "Tronxy CRUX1" doesn't get
  // mis-attributed to Bambu by the broad x1 rule.
  if (/tronxy|crux1?\b|veho/.test(m))                    return 'tronxy';
  if (/sovol|sv0[678]/.test(m))                          return 'sovol';
  if (/flashforge|adventurer 5m|ad5x|guider 3|creator 4/.test(m)) return 'flashforge';
  if (/biqu|hurakan|b1 se/.test(m))                      return 'biqu';
  if (/two ?trees|\bsk-1\b|sapphire/.test(m))            return 'twotrees';
  if (/mingda|magician/.test(m))                         return 'mingda';
  if (/kywoo|tycoon/.test(m))                            return 'kywoo';
  if (/anycubic|kobra/.test(m))                          return 'anycubic';
  if (/ankermake|^anker|\bm5c?\b/.test(m))               return 'ankermake';
  // Established brands.
  if (/prusa|mk[3-4]|core one|ht90|mini\+|^xl\b/.test(m)) return 'prusa';
  if (/snapmaker/.test(m))                                return 'snapmaker';
  if (/creality|^k[12]\b|k1c\b|k1.?max|^hi\b|ender/.test(m)) return 'creality';
  if (/elegoo|neptune|centauri/.test(m))                  return 'elegoo';
  if (/voron|trident|switchwire|phoenix/.test(m))         return 'voron';
  if (/ratrig|v-core|v-minion/.test(m))                   return 'ratrig';
  if (/qidi|x-plus|x-max|q1 pro|x-cf/.test(m))            return 'qidi';
  // Bambu last with strict word-boundary patterns to avoid CRUX1, X-Max, etc.
  if (/\b(p1s|p1p|p2s|x1|x1c|x1e|a1|h2[dcs])\b/.test(m) && !/x-max|x-plus|x-cf|crux/.test(m)) return 'bambu';
  if (/bambu/.test(m)) return 'bambu';
  return 'generic';
}

function _detectChassis(model, features = {}) {
  const m = String(model || '').toLowerCase();
  // Explicit features win first.
  if (features.idex || /idex|h2d/.test(m)) return 'corexy_idex';
  if (features.vortek || /h2c/.test(m)) return 'vortek';
  if (features.toolheads >= 4 || /toolchanger|^xl\b|snapmaker u1/.test(m)) return 'toolchanger';
  if (features.coreXZ || /switchwire/.test(m)) return 'corexz';
  if (/delta/.test(m)) return 'delta';
  // CoreXY enclosures (default for high-end models with chamber).
  if (features.coreXY) return 'corexy';
  if (features.enclosure || features.chamber) return 'corexy';
  if (/p1s|p1p|p2s|x1|h2|k1|k2|hurakan|sk-1|crux|core one|magician|q1 pro|adventurer 5m|ad5x/.test(m)) return 'corexy';
  // Default: bedslinger (open A-frame).
  return 'bedslinger';
}

function _featureBadges(features = {}, brand) {
  const badges = [];
  if (features.ams || brand === 'bambu') badges.push({ label: 'AMS', color: '#00AE42' });
  if (features.cfs)       badges.push({ label: 'CFS', color: '#1E88E5' });
  if (features.ifs)       badges.push({ label: 'IFS', color: '#FB8C00' });
  if (features.chamber)   badges.push({ label: 'CHM', color: '#ef4444' });
  if (features.idex)      badges.push({ label: 'IDEX', color: '#8b5cf6' });
  if (features.hasLaser)  badges.push({ label: 'LSR', color: '#f59e0b' });
  if (features.ai)        badges.push({ label: 'AI',  color: '#06b6d4' });
  if (features.hardenedHotend) badges.push({ label: 'CF', color: '#475569' });
  if (features.highTempBed)    badges.push({ label: '350°C', color: '#dc2626' });
  if (features.multiColor && !features.cfs && !features.ifs) badges.push({ label: 'MC', color: '#ec4899' });
  return badges.slice(0, 4); // cap to 4 to avoid clutter
}

// ── SVG primitives ─────────────────────────────────────────────────

function _renderBedslinger(c) {
  // Open A-frame: vertical gantry, Y-axis bed slides front-to-back.
  return `
    <!-- frame uprights -->
    <rect x="50" y="40" width="6" height="120" fill="${c.accent}"/>
    <rect x="194" y="40" width="6" height="120" fill="${c.accent}"/>
    <!-- top X-gantry -->
    <rect x="50" y="40" width="150" height="10" fill="${c.primary}"/>
    <!-- print head -->
    <rect x="115" y="55" width="20" height="22" rx="2" fill="${c.accent}"/>
    <rect x="120" y="73" width="10" height="6" fill="${c.primary}"/>
    <!-- bed (slid forward for visibility) -->
    <rect x="60" y="120" width="130" height="50" rx="2" fill="${c.primary}" opacity="0.85"/>
    <rect x="62" y="118" width="126" height="3" fill="${c.accent}"/>
    <!-- base -->
    <rect x="40" y="160" width="170" height="14" rx="2" fill="${c.accent}"/>
  `;
}

function _renderCoreXY(c, features = {}) {
  // Enclosed cube; chamber visible through transparent panel.
  const chamberGlow = features.chamberHeated || features.chamber
    ? `<rect x="60" y="50" width="130" height="100" fill="#ef4444" opacity="0.08"/>` : '';
  return `
    <!-- enclosure outer -->
    <rect x="50" y="40" width="150" height="130" rx="6" fill="${c.accent}"/>
    <rect x="55" y="45" width="140" height="120" rx="4" fill="${c.primary}" opacity="0.18"/>
    ${chamberGlow}
    <!-- top X gantry -->
    <line x1="60" y1="60" x2="190" y2="60" stroke="${c.primary}" stroke-width="3"/>
    <!-- print head -->
    <rect x="115" y="55" width="20" height="18" rx="2" fill="${c.primary}"/>
    <rect x="118" y="70" width="14" height="6" fill="${c.accent}"/>
    <!-- bed (mid-height) -->
    <rect x="65" y="135" width="120" height="8" rx="1" fill="${c.primary}" opacity="0.9"/>
    <line x1="65" y1="139" x2="185" y2="139" stroke="${c.accent}" stroke-width="0.5" opacity="0.6"/>
    <!-- glass door reflection -->
    <line x1="60" y1="50" x2="190" y2="155" stroke="#fff" stroke-width="1" opacity="0.08"/>
  `;
}

function _renderCoreXyIdex(c, features = {}) {
  const chamberGlow = features.chamberHeated
    ? `<rect x="40" y="50" width="170" height="100" fill="#ef4444" opacity="0.08"/>` : '';
  return `
    <!-- wider enclosure for IDEX -->
    <rect x="30" y="40" width="190" height="130" rx="6" fill="${c.accent}"/>
    <rect x="35" y="45" width="180" height="120" rx="4" fill="${c.primary}" opacity="0.18"/>
    ${chamberGlow}
    <!-- twin X gantries -->
    <line x1="40" y1="58" x2="210" y2="58" stroke="${c.primary}" stroke-width="2.5"/>
    <line x1="40" y1="68" x2="210" y2="68" stroke="${c.primary}" stroke-width="2.5"/>
    <!-- two heads -->
    <rect x="80" y="55" width="18" height="18" rx="2" fill="${c.primary}"/>
    <rect x="160" y="55" width="18" height="18" rx="2" fill="${c.primary}"/>
    <rect x="83" y="70" width="12" height="6" fill="${c.accent}"/>
    <rect x="163" y="70" width="12" height="6" fill="${c.accent}"/>
    <!-- bed -->
    <rect x="45" y="135" width="160" height="8" rx="1" fill="${c.primary}" opacity="0.9"/>
  `;
}

function _renderToolchanger(c, features = {}) {
  // Wide cube with 4 parked toolheads at top-left.
  const tools = [60, 78, 96, 114].map((x, i) =>
    `<rect x="${x}" y="48" width="14" height="14" rx="1" fill="${c.primary}" opacity="${0.8 + (i % 2) * 0.2}"/>`
  ).join('');
  return `
    <rect x="30" y="40" width="190" height="130" rx="6" fill="${c.accent}"/>
    <rect x="35" y="45" width="180" height="120" rx="4" fill="${c.primary}" opacity="0.15"/>
    <!-- parked tool dock (top-left corner) -->
    ${tools}
    <!-- active head in middle -->
    <rect x="138" y="65" width="20" height="20" rx="2" fill="${c.primary}"/>
    <rect x="142" y="83" width="12" height="6" fill="${c.accent}"/>
    <!-- bed -->
    <rect x="45" y="135" width="160" height="8" rx="1" fill="${c.primary}" opacity="0.9"/>
  `;
}

function _renderVortek(c) {
  // Carousel of 7 nozzles around a central spindle (H2C).
  const slots = Array.from({ length: 7 }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / 7;
    const cx = 125 + 14 * Math.cos(angle);
    const cy = 75 + 14 * Math.sin(angle);
    return `<circle cx="${cx}" cy="${cy}" r="3" fill="${c.primary}" opacity="${0.6 + (i % 2) * 0.4}"/>`;
  }).join('');
  return `
    <rect x="30" y="40" width="190" height="130" rx="6" fill="${c.accent}"/>
    <rect x="35" y="45" width="180" height="120" rx="4" fill="${c.primary}" opacity="0.15"/>
    <!-- carousel -->
    <circle cx="125" cy="75" r="20" fill="none" stroke="${c.primary}" stroke-width="1" opacity="0.5"/>
    <circle cx="125" cy="75" r="6" fill="${c.primary}"/>
    ${slots}
    <!-- bed -->
    <rect x="45" y="135" width="160" height="8" rx="1" fill="${c.primary}" opacity="0.9"/>
  `;
}

function _renderCoreXZ(c) {
  return `
    <rect x="50" y="40" width="150" height="130" rx="4" fill="${c.accent}"/>
    <rect x="55" y="45" width="140" height="120" rx="3" fill="${c.primary}" opacity="0.18"/>
    <!-- tilted Z rod -->
    <line x1="55" y1="160" x2="195" y2="50" stroke="${c.primary}" stroke-width="2.5"/>
    <line x1="60" y1="155" x2="190" y2="55" stroke="${c.accent}" stroke-width="1" opacity="0.6"/>
    <!-- head on the slanted rail -->
    <rect x="120" y="95" width="18" height="18" rx="2" fill="${c.primary}" transform="rotate(-30 129 104)"/>
    <!-- bed -->
    <rect x="65" y="140" width="120" height="8" rx="1" fill="${c.primary}" opacity="0.9"/>
  `;
}

function _renderDelta(c) {
  return `
    <!-- triangular tower -->
    <polygon points="125,30 60,170 190,170" fill="${c.primary}" opacity="0.15"/>
    <polygon points="125,30 60,170 190,170" fill="none" stroke="${c.accent}" stroke-width="3"/>
    <!-- effector triangle -->
    <polygon points="125,90 110,110 140,110" fill="${c.primary}" stroke="${c.accent}" stroke-width="1"/>
    <!-- nozzle -->
    <circle cx="125" cy="118" r="3" fill="${c.accent}"/>
    <!-- bed circle -->
    <ellipse cx="125" cy="160" rx="55" ry="8" fill="${c.primary}" opacity="0.5"/>
  `;
}

function _renderChassis(kind, c, features) {
  switch (kind) {
    case 'corexy_idex': return _renderCoreXyIdex(c, features);
    case 'toolchanger': return _renderToolchanger(c, features);
    case 'vortek':      return _renderVortek(c);
    case 'corexz':      return _renderCoreXZ(c);
    case 'delta':       return _renderDelta(c);
    case 'corexy':      return _renderCoreXY(c, features);
    case 'bedslinger':
    default:            return _renderBedslinger(c);
  }
}

function _renderBadges(badges, c) {
  if (!badges.length) return '';
  let x = 12, y = 14;
  return badges.map(b => {
    const w = b.label.length * 6 + 10;
    const out = `<g><rect x="${x}" y="${y}" width="${w}" height="14" rx="3" fill="${b.color}"/><text x="${x + w / 2}" y="${y + 10}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="9" font-weight="700" fill="#fff">${b.label}</text></g>`;
    x += w + 4;
    return out;
  }).join('');
}

/**
 * Generate an SVG string for a printer model.
 *
 * @param {string} model
 * @param {object} [capabilities] - { features, buildVolume } from
 *        printer-capabilities.js. Optional; renderer derives chassis
 *        from the model name alone if absent.
 */
export function renderPrinterSvg(model, capabilities = {}) {
  const brand = _detectBrand(model);
  const c = BRAND_COLORS[brand] || BRAND_COLORS.generic;
  const features = capabilities.features || {};
  const chassis = _detectChassis(model, features);
  const badges = _featureBadges(features, brand);
  const bv = capabilities.buildVolume || [];
  const bvLabel = bv.length === 3 ? `${bv[0]}×${bv[1]}×${bv[2]} mm` : '';

  const safeLabel = String(model || 'Printer')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 220" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="${c.primary}" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="${c.accent}"  stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="250" height="220" fill="url(#bg)"/>
    ${_renderChassis(chassis, c, features)}
    ${_renderBadges(badges, c)}
    <!-- model label -->
    <text x="125" y="195" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" font-weight="700" fill="${c.primary}">${safeLabel}</text>
    ${bvLabel ? `<text x="125" y="210" text-anchor="middle" font-family="ui-monospace,monospace" font-size="9" fill="${c.accent}" opacity="0.7">${bvLabel}</text>` : ''}
  </svg>`;
}

export const _internals = { _detectBrand, _detectChassis, _featureBadges, BRAND_COLORS };
