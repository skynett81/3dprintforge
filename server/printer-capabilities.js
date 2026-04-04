/**
 * Printer capabilities — per-brand/model configuration for file access, cameras, and features
 * Single source of truth for how to interact with each printer type
 */

/**
 * Capability definitions per printer type
 * Each entry defines HOW to access files, models, and cameras for that printer type
 */
const CAPABILITIES = {
  bambu: {
    label: 'Bambu Lab',
    connection: 'mqtt',
    fileAccess: 'ftps',
    ftps: { port: 990, user: 'bblp', secure: 'implicit' },
    camera: { modes: ['jpeg-tls', 'rtsp'], ports: { jpeg: 6000, rtsp: 322 } },
    modelAccess: {
      // Bambu stores .gcode.3mf on internal storage (root /)
      // The 3MF contains embedded gcode, NOT mesh data
      // Must extract gcode from 3MF ZIP for toolpath rendering
      method: 'ftps-3mf',
      searchDirs: ['/', '/cache/', '/sdcard/', '/data/'],
      filePattern: '.gcode.3mf',
      hasMeshIn3MF: false, // Bambu gcode.3mf has no mesh — only embedded gcode
    },
    gcodeAccess: {
      // Gcode is embedded inside the .gcode.3mf file
      method: 'embedded-in-3mf',
    },
    features: {
      ams: true,
      xcam: true,
      firmwareDetection: true,
      ssdpDiscovery: true,
      cloudTasks: true,
    },
    auth: { required: ['serial', 'accessCode'] },
  },

  moonraker: {
    label: 'Moonraker/Klipper',
    connection: 'websocket',
    fileAccess: 'http-api',
    httpApi: { filesEndpoint: '/server/files/gcodes/', metadataEndpoint: '/server/files/metadata' },
    camera: { modes: ['http-snapshot', 'ssh-sftp'], interval: 200 },
    modelAccess: {
      // Moonraker only has gcode files — no 3MF on the printer
      // Must download gcode and parse as toolpath
      method: 'moonraker-gcode',
      hasMeshIn3MF: false,
    },
    gcodeAccess: {
      method: 'http-download',
      endpoint: '/server/files/gcodes/',
    },
    features: {
      ams: false,
      xcam: false,
      firmwareDetection: false,
      ssdpDiscovery: false,
      cloudTasks: false,
      historySync: true,
      multiExtruder: true,
    },
    auth: { required: ['ip'] },
  },
};

/**
 * Model-specific overrides (extend base type capabilities)
 */
const MODEL_OVERRIDES = {
  // Bambu Lab models
  'P1S': { camera: { modes: ['rtsp'] } },
  'P1P': { camera: { modes: ['rtsp'] } },
  'X1C': { camera: { modes: ['rtsp'] } },
  'X1E': { camera: { modes: ['rtsp'] } },
  'A1': { camera: { modes: ['jpeg-tls', 'rtsp'] } },
  'A1 mini': { camera: { modes: ['jpeg-tls'] } },
  'P2S': { camera: { modes: ['jpeg-tls', 'rtsp'] } },
  'H2D': { camera: { modes: ['jpeg-tls', 'rtsp'] } },

  // Snapmaker models
  'Snapmaker U1': {
    camera: {
      modes: ['http-snapshot', 'ssh-sftp'],
      sshPaths: ['/tmp/.monitor.jpg', '/tmp/printer_detection.jpg'],
    },
  },
};

/**
 * Get capabilities for a printer
 * @param {Object} printer - Printer object from DB (with type, model fields)
 * @returns {Object} Merged capabilities
 */
export function getCapabilities(printer) {
  const baseType = (printer.type || 'bambu').toLowerCase();
  const typeKey = baseType === 'klipper' ? 'moonraker' : (baseType === 'mqtt' ? 'bambu' : baseType);
  const base = CAPABILITIES[typeKey] || CAPABILITIES.bambu;

  // Apply model-specific overrides
  const modelOverride = printer.model ? MODEL_OVERRIDES[printer.model] : null;
  if (!modelOverride) return base;

  return deepMerge(base, modelOverride);
}

/**
 * Get the best strategy to get a 3D model for a printer's history entry
 * @param {Object} printer - Printer from DB
 * @param {Object} histRow - History record
 * @returns {{ strategy: string, searchNames: string[] }}
 */
export function getModelStrategy(printer, histRow) {
  const caps = getCapabilities(printer);
  const searchNames = [histRow.model_name, histRow.filename, histRow.gcode_file].filter(Boolean);

  if (caps.modelAccess.method === 'ftps-3mf') {
    return {
      strategy: 'bambu-ftps',
      searchNames,
      hasMesh: caps.modelAccess.hasMeshIn3MF,
      searchDirs: caps.modelAccess.searchDirs,
    };
  }

  if (caps.modelAccess.method === 'moonraker-gcode') {
    return {
      strategy: 'moonraker-gcode',
      searchNames,
      gcodeEndpoint: caps.gcodeAccess.endpoint,
    };
  }

  return { strategy: 'unknown', searchNames };
}

/**
 * Check if a printer type supports a feature
 */
export function hasFeature(printer, feature) {
  const caps = getCapabilities(printer);
  return !!caps.features?.[feature];
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
