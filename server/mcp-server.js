#!/usr/bin/env node
// mcp-server.js — Model Context Protocol server exposing 3DPrintForge to AI
// assistants (Claude Desktop, Claude Code, …). It is a thin stdio client over
// the existing REST API, so an LLM can query the fleet, control prints and
// work the whole inventory in natural language.
//
// Register in an MCP client (e.g. ~/.claude.json / Claude Desktop config):
//   "mcpServers": {
//     "3dprintforge": {
//       "command": "node",
//       "args": ["<repo>/server/mcp-server.js"],
//       "env": { "FORGE_API_URL": "https://localhost:3443", "FORGE_API_KEY": "<key>" }
//     }
//   }

// The dashboard serves a self-signed cert on localhost; accept it for this
// dedicated local tool process.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE = (process.env.FORGE_API_URL || 'https://localhost:3443').replace(/\/$/, '');
const API_KEY = process.env.FORGE_API_KEY || '';

async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  const res = await fetch(BASE + path, { ...opts, headers });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(`${res.status} ${typeof data === 'string' ? data : (data.error || res.statusText)}`);
  return data;
}
const ok = (data) => ({ content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }] });
const fail = (e) => ({ content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true });
const tool = (fn) => async (args) => { try { return ok(await fn(args)); } catch (e) { return fail(e); } };

const server = new McpServer({ name: '3dprintforge', version: '1.0.0' });

// ── Fleet & printing ──
server.registerTool('list_printers',
  { title: 'List printers', description: 'List every printer with its live status (state, progress, temperatures).', inputSchema: {} },
  tool(() => apiFetch('/api/printers')));

server.registerTool('printer_state',
  { title: 'Printer state', description: 'Full live state of one printer.', inputSchema: { id: z.string().describe('printer id') } },
  tool(({ id }) => apiFetch(`/api/printers/${encodeURIComponent(id)}/state`)));

server.registerTool('control_printer',
  { title: 'Control printer', description: 'Pause, resume or stop the current print on a printer.', inputSchema: { id: z.string(), action: z.enum(['pause', 'resume', 'stop']) } },
  tool(({ id, action }) => apiFetch(`/api/printers/${encodeURIComponent(id)}/control`, { method: 'POST', body: JSON.stringify({ action }) })));

server.registerTool('list_queue',
  { title: 'Print queue', description: 'List queued print jobs.', inputSchema: {} },
  tool(() => apiFetch('/api/queues')));

// ── Filament ──
server.registerTool('list_spools',
  { title: 'Filament spools', description: 'List filament spools with material, colour and remaining weight.', inputSchema: {} },
  tool(() => apiFetch('/api/inventory/spools')));

// ── Inventory (parts / stock / builds) ──
server.registerTool('list_parts',
  { title: 'Inventory parts', description: 'List inventory parts (tools, components, products) with total / reserved / available stock and a low-stock flag.', inputSchema: { q: z.string().optional().describe('search text (name or part no.)') } },
  tool(({ q }) => apiFetch('/api/inventory/parts' + (q ? `?q=${encodeURIComponent(q)}` : ''))));

server.registerTool('build_shopping_list',
  { title: 'Build shopping list', description: 'The components you still need to buy to fulfil all planned builds.', inputSchema: {} },
  tool(() => apiFetch('/api/inventory/build-shopping-list')));

server.registerTool('create_build',
  { title: 'Create build', description: 'Create a build order for a product part (consumes its BOM components when completed).', inputSchema: { part_id: z.number().int(), quantity: z.number().default(1) } },
  tool(({ part_id, quantity }) => apiFetch('/api/inventory/builds', { method: 'POST', body: JSON.stringify({ part_id, quantity: quantity ?? 1 }) })));

server.registerTool('adjust_stock',
  { title: 'Adjust stock', description: 'Adjust a stock item quantity by a delta (positive to add, negative to remove).', inputSchema: { stock_item_id: z.number().int(), delta: z.number(), reason: z.string().optional() } },
  tool(({ stock_item_id, delta, reason }) => apiFetch(`/api/inventory/stock-items/${stock_item_id}/adjust`, { method: 'POST', body: JSON.stringify({ delta, reason }) })));

// ── System ──
server.registerTool('system_info',
  { title: 'System info', description: 'Server version, uptime, memory and printer count.', inputSchema: {} },
  tool(() => apiFetch('/api/system/info')));

const transport = new StdioServerTransport();
await server.connect(transport);
