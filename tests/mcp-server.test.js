// mcp-server.test.js — the MCP server speaks the protocol and advertises its
// tools. Only the handshake + tools/list are exercised (no live API needed).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function mcpHandshake() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['server/mcp-server.js'], { cwd: root, stdio: ['pipe', 'pipe', 'pipe'] });
    const pending = {};
    let buf = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('MCP server timeout')); }, 8000);
    child.stdout.on('data', (d) => {
      buf += d.toString();
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line) continue;
        try { const msg = JSON.parse(line); if (msg.id && pending[msg.id]) pending[msg.id](msg); } catch { /* ignore */ }
      }
    });
    child.on('error', reject);
    const send = (o) => child.stdin.write(JSON.stringify(o) + '\n');
    const call = (id, method, params) => new Promise((r) => { pending[id] = r; send({ jsonrpc: '2.0', id, method, params }); });
    (async () => {
      const init = await call(1, 'initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
      send({ jsonrpc: '2.0', method: 'notifications/initialized' });
      const tools = await call(2, 'tools/list', {});
      clearTimeout(timer);
      child.kill();
      resolve({ serverInfo: init.result?.serverInfo, tools: (tools.result?.tools || []).map((t) => t.name) });
    })().catch((e) => { clearTimeout(timer); child.kill(); reject(e); });
  });
}

test('MCP server handshakes and advertises its tools', async () => {
  const { serverInfo, tools } = await mcpHandshake();
  assert.equal(serverInfo?.name, '3dprintforge');
  for (const name of ['list_printers', 'control_printer', 'list_spools', 'list_parts', 'build_shopping_list', 'create_build', 'system_info']) {
    assert.ok(tools.includes(name), `missing tool ${name}`);
  }
});
