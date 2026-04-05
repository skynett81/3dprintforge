/**
 * Snapmaker SACP Protocol Client
 * Lightweight Node.js implementation for older Snapmaker machines:
 * A150, A250, A350, J1, Artisan
 *
 * Protocol: Binary framed TCP on port 8888
 * Packet format: SOF(2) + Length(2) + Version(1) + RecvID(1) + CRC8(1) + SenderID(1)
 *               + Attribute(1) + Sequence(2) + CommandSet(1) + CommandID(1) + Payload(N) + CRC16(2)
 */

import { createConnection } from 'node:net';
import dgram from 'node:dgram';

const SOF = 0xAA55;
const PEER_SOFTWARE = 0x00;
const PEER_CONTROLLER = 0x01;

// Known Snapmaker model IDs
const SACP_MODELS = {
  0: 'Snapmaker 2.0 A150',
  1: 'Snapmaker 2.0 A250',
  2: 'Snapmaker 2.0 A350',
  3: 'Snapmaker J1',
  4: 'Snapmaker Artisan',
  5: 'Snapmaker Ray',
};

/**
 * Discover older Snapmaker machines on the network via UDP broadcast
 * @param {number} [timeoutMs=3000]
 * @returns {Promise<Array<{ip, name, model, sacp: true}>>}
 */
export function discoverSacpPrinters(timeoutMs = 3000) {
  return new Promise((resolve) => {
    const found = new Map();
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      try { socket.close(); } catch {}
      resolve([...found.values()]);
    };

    const timer = setTimeout(finish, timeoutMs);

    socket.on('message', (msg, rinfo) => {
      const text = msg.toString('utf8');
      // Response format: {Name}@{IP}|model:{model}|SACP:{version}
      const match = text.match(/^(.+)@([\d.]+)\|model:([^|]*)\|SACP:(.+)$/);
      if (match) {
        found.set(rinfo.address, {
          ip: rinfo.address,
          name: match[1],
          model: match[3] || 'Snapmaker',
          sacpVersion: match[4],
          sacp: true,
          type: 'sacp',
        });
      }
    });

    socket.on('error', () => finish());

    socket.bind(0, () => {
      socket.setBroadcast(true);
      const msg = Buffer.from('discover');
      // Send to broadcast on common subnets
      socket.send(msg, 0, msg.length, 20054, '255.255.255.255', () => {
        setTimeout(() => socket.send(msg, 0, msg.length, 20054, '255.255.255.255'), 500);
      });
    });
  });
}

/**
 * SACP TCP Client for commanding older Snapmaker machines
 */
export class SacpClient {
  constructor(ip, port = 8888) {
    this.ip = ip;
    this.port = port;
    this.socket = null;
    this.connected = false;
    this._seq = 0;
    this._pending = new Map();
    this._buffer = Buffer.alloc(0);
  }

  connect(timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Connection timeout'));
        try { this.socket?.destroy(); } catch {}
      }, timeoutMs);

      this.socket = createConnection({ host: this.ip, port: this.port }, () => {
        clearTimeout(timer);
        this.connected = true;
        resolve();
      });

      this.socket.on('data', (data) => this._onData(data));
      this.socket.on('error', (err) => { clearTimeout(timer); reject(err); });
      this.socket.on('close', () => { this.connected = false; });
    });
  }

  disconnect() {
    this.connected = false;
    try { this.socket?.destroy(); } catch {}
  }

  /**
   * Send a SACP command and wait for response
   * @param {number} cmdSet - Command set
   * @param {number} cmdId - Command ID
   * @param {Buffer} [payload] - Optional payload
   * @param {number} [timeoutMs=5000]
   * @returns {Promise<Buffer>} Response payload
   */
  sendCommand(cmdSet, cmdId, payload, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const seq = this._seq++;
      const pkt = this._buildPacket(cmdSet, cmdId, seq, payload || Buffer.alloc(0));

      const timer = setTimeout(() => {
        this._pending.delete(seq);
        reject(new Error('Command timeout'));
      }, timeoutMs);

      this._pending.set(seq, { resolve, reject, timer });
      this.socket.write(pkt);
    });
  }

  /** Get machine info (model, serial, firmware version) */
  async getMachineInfo() {
    const resp = await this.sendCommand(0x01, 0x21, null);
    // Parse response: model_id(1) + hw_version(30) + serial(30) + fw_version(30)
    if (resp.length < 4) return null;
    return {
      modelId: resp[0],
      model: SACP_MODELS[resp[0]] || `Unknown (${resp[0]})`,
      hardwareVersion: resp.subarray(1, 31).toString('utf8').replace(/\0/g, '').trim(),
      serialNumber: resp.subarray(31, 61).toString('utf8').replace(/\0/g, '').trim(),
      firmwareVersion: resp.subarray(61, 91).toString('utf8').replace(/\0/g, '').trim(),
    };
  }

  /** Execute G-code line */
  async executeGcode(gcode) {
    const buf = Buffer.from(gcode + '\n', 'utf8');
    return this.sendCommand(0x01, 0x02, buf);
  }

  /** Get module list */
  async getModules() {
    const resp = await this.sendCommand(0x01, 0x20, null);
    // Module list parsing — simplified
    return resp;
  }

  // ── Packet building ──

  _buildPacket(cmdSet, cmdId, seq, payload) {
    const headerLen = 13;
    const totalLen = headerLen + payload.length + 2; // +2 for CRC16
    const pkt = Buffer.alloc(totalLen);

    pkt.writeUInt16LE(SOF, 0);               // SOF
    pkt.writeUInt16LE(totalLen, 2);           // Length
    pkt[4] = 1;                                // Version
    pkt[5] = PEER_CONTROLLER;                  // Receiver ID
    pkt[6] = this._crc8(pkt.subarray(0, 6));  // CRC8
    pkt[7] = PEER_SOFTWARE;                    // Sender ID
    pkt[8] = 0x00;                             // Attribute (request)
    pkt.writeUInt16LE(seq, 9);                 // Sequence
    pkt[11] = cmdSet;                          // Command Set
    pkt[12] = cmdId;                           // Command ID

    if (payload.length > 0) payload.copy(pkt, headerLen);

    const crc16 = this._crc16(pkt.subarray(0, totalLen - 2));
    pkt.writeUInt16LE(crc16, totalLen - 2);

    return pkt;
  }

  _onData(data) {
    this._buffer = Buffer.concat([this._buffer, data]);

    while (this._buffer.length >= 13) {
      const sof = this._buffer.readUInt16LE(0);
      if (sof !== SOF) { this._buffer = this._buffer.subarray(1); continue; }

      const totalLen = this._buffer.readUInt16LE(2);
      if (this._buffer.length < totalLen) break;

      const pkt = this._buffer.subarray(0, totalLen);
      this._buffer = this._buffer.subarray(totalLen);

      const seq = pkt.readUInt16LE(9);
      const payload = pkt.subarray(13, totalLen - 2);

      const pending = this._pending.get(seq);
      if (pending) {
        clearTimeout(pending.timer);
        this._pending.delete(seq);
        pending.resolve(payload);
      }
    }
  }

  _crc8(data) {
    let crc = 0;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) & 0xFF : (crc << 1) & 0xFF;
    }
    return crc;
  }

  _crc16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) crc = (crc & 1) ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
    }
    return crc;
  }
}
