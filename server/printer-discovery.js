/**
 * SSDP-based printer discovery for Bambu Lab printers on the local network.
 * Uses node:dgram (UDP) — no external dependencies.
 */
import dgram from 'node:dgram';
import mqtt from 'mqtt';

const SSDP_ADDR = '239.255.255.250';
const SSDP_PORT = 1990;
const SEARCH_TARGET = 'urn:bambulab-com:device:3dprinter:1';

const MODEL_MAP = {
  'BL-P001': 'X1 Carbon', 'BL-P002': 'X1', 'BL-P003': 'X1E',
  'BL-A001': 'A1 mini', 'BL-A003': 'A1', 'BL-A004': 'A1 Combo',
  'C11': 'P1P', 'C12': 'P1S', 'C13': 'P1S Combo',
  'N1': 'P2S', 'N2S': 'P2S Combo', 'N7': 'P2S',
};

export class PrinterDiscovery {
  constructor() {
    this._cache = [];
    this._scanning = false;
  }

  /**
   * Send SSDP M-SEARCH and collect responses for `timeoutMs` milliseconds.
   * Returns array of { ip, serial, model, modelCode, name, signal }
   */
  scan(timeoutMs = 5000) {
    if (this._scanning) return Promise.resolve(this._cache);
    this._scanning = true;

    return new Promise((resolve) => {
      const found = new Map();
      let socket;

      try {
        socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
      } catch {
        this._scanning = false;
        return resolve([]);
      }

      const finish = () => {
        this._scanning = false;
        try { socket.close(); } catch { /* ignore */ }
        this._cache = [...found.values()];
        resolve(this._cache);
      };

      const timer = setTimeout(finish, timeoutMs);

      socket.on('error', () => {
        clearTimeout(timer);
        finish();
      });

      socket.on('message', (msg, rinfo) => {
        const text = msg.toString('utf8');
        if (!text.includes('NOTIFY') && !text.includes('HTTP/1.1 200')) return;

        const headers = {};
        for (const line of text.split('\r\n')) {
          const idx = line.indexOf(':');
          if (idx > 0) {
            headers[line.substring(0, idx).trim().toLowerCase()] = line.substring(idx + 1).trim();
          }
        }

        const serial = headers['usn'] || '';
        const location = headers['location'] || '';
        const modelCode = headers['devmodel.bambu.com'] || '';
        const name = headers['devname.bambu.com'] || '';
        const signal = headers['devsignal.bambu.com'] || '';

        if (!serial) return;

        // Extract IP from Location header or use remote address
        let ip = rinfo.address;
        const locMatch = location.match(/\/\/([^:/]+)/);
        if (locMatch) ip = locMatch[1];

        found.set(serial, {
          ip,
          serial,
          model: MODEL_MAP[modelCode] || modelCode || '',
          modelCode,
          name: name || serial,
          signal: signal ? parseInt(signal, 10) : null,
        });
      });

      socket.bind(0, () => {
        try {
          socket.addMembership(SSDP_ADDR);
        } catch { /* not fatal — responses still arrive as unicast */ }

        const msearch = [
          'M-SEARCH * HTTP/1.1',
          `HOST: ${SSDP_ADDR}:${SSDP_PORT}`,
          'MAN: "ssdp:discover"',
          `ST: ${SEARCH_TARGET}`,
          'MX: 3',
          '', '',
        ].join('\r\n');

        const buf = Buffer.from(msearch);
        // Send twice for reliability
        socket.send(buf, 0, buf.length, SSDP_PORT, SSDP_ADDR, () => {
          setTimeout(() => {
            socket.send(buf, 0, buf.length, SSDP_PORT, SSDP_ADDR, () => {});
          }, 500);
        });
      });
    });
  }

  /**
   * Scan for Moonraker/Klipper printers on the local network.
   * Probes common IPs via HTTP for Moonraker's /printer/info endpoint.
   * @param {string[]} [extraIps] - Additional IPs to probe
   * @param {number} [timeoutMs=3000] - Per-probe timeout
   */
  async scanMoonraker(extraIps = [], timeoutMs = 3000) {
    const ipsToProbe = new Set(extraIps);

    // Get local subnet from network interfaces
    const { networkInterfaces } = await import('node:os');
    const ifaces = networkInterfaces();
    for (const list of Object.values(ifaces)) {
      for (const iface of list) {
        if (iface.internal || iface.family !== 'IPv4') continue;
        const parts = iface.address.split('.');
        // Probe common printer IPs in the same subnet (limited range)
        for (let i = 1; i <= 254; i++) {
          ipsToProbe.add(`${parts[0]}.${parts[1]}.${parts[2]}.${i}`);
        }
      }
    }

    // Remove our own IPs
    for (const list of Object.values(ifaces)) {
      for (const iface of list) ipsToProbe.delete(iface.address);
    }

    const results = [];
    const batchSize = 30;
    const ips = [...ipsToProbe];

    for (let i = 0; i < ips.length; i += batchSize) {
      const batch = ips.slice(i, i + batchSize);
      const probes = batch.map(async (ip) => {
        try {
          const res = await fetch(`http://${ip}:80/printer/info`, { signal: AbortSignal.timeout(timeoutMs) });
          if (!res.ok) return null;
          const data = await res.json();
          if (!data?.result?.hostname) return null;
          return {
            ip,
            serial: data.result.hostname || ip,
            model: 'Moonraker/Klipper',
            modelCode: '',
            name: data.result.hostname || ip,
            signal: null,
            type: 'moonraker',
            software_version: data.result.software_version || '',
            state: data.result.state || '',
          };
        } catch { return null; }
      });
      const batchResults = await Promise.all(probes);
      for (const r of batchResults) {
        if (r) results.push(r);
      }
    }

    return results;
  }

  /**
   * Combined scan — Bambu SSDP + Moonraker HTTP + Snapmaker SACP broadcast
   */
  async scanAll(timeoutMs = 5000, extraIps = []) {
    let sacpResults = [];
    try {
      const { discoverSacpPrinters } = await import('./sacp-client.js');
      sacpResults = await discoverSacpPrinters(3000);
    } catch { /* SACP discovery optional */ }

    const [bambu, moonraker] = await Promise.all([
      this.scan(timeoutMs),
      this.scanMoonraker(extraIps, 3000),
    ]);
    const combined = [...bambu, ...moonraker, ...sacpResults];
    this._cache = combined;
    return combined;
  }

  getCached() { return this._cache; }
  isScanning() { return this._scanning; }
  shutdown() { this._cache = []; }
}

/**
 * Test MQTT connection to a Bambu Lab printer.
 * Resolves { ok: true } on success, { ok: false, error: string } on failure.
 */
export function testMqttConnection(ip, serial, accessCode, timeoutMs = 8000) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { client.end(true); } catch { /* ignore */ }
      resolve(result);
    };

    const timer = setTimeout(() => finish({ ok: false, error: 'timeout' }), timeoutMs);

    const client = mqtt.connect(`mqtts://${ip}:8883`, {
      username: 'bblp',
      password: accessCode,
      rejectUnauthorized: false,
      connectTimeout: 6000,
    });

    client.on('connect', () => finish({ ok: true }));
    client.on('error', (err) => finish({ ok: false, error: err.message }));
  });
}
