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
