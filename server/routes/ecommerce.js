// routes/ecommerce.js — E-commerce license, configs, orders, webhook receiver
// Returnerer true hvis ruten ble håndtert, false for pass-through.

import {
  getEcommerceConfigs, getEcommerceConfig, addEcommerceConfig, updateEcommerceConfig, deleteEcommerceConfig,
  getEcommerceOrders, getEcommerceOrder, addEcommerceOrder, updateEcommerceOrder,
  getEcomFees, getEcomFeesSummary, getEcomFeesTotal,
  addQueueItem
} from '../database.js';
import { sendJson, readBody, _readRawBody } from '../api-helpers.js';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createLogger } from '../logger.js';
import { validate } from '../validate.js';

const log = createLogger('ecommerce');

// ---- Validation Schemas ----
const ECOMMERCE_CONFIG_SCHEMA = {
  name: { type: 'string', required: true, minLength: 1, maxLength: 200 },
  platform: { type: 'string', maxLength: 50 }
};

const ECOMMERCE_CONFIG_UPDATE_SCHEMA = {
  name: { type: 'string', minLength: 1, maxLength: 200 },
  platform: { type: 'string', maxLength: 50 }
};

const LICENSE_ACTIVATE_SCHEMA = {
  license_key: { type: 'string', required: true, minLength: 1, maxLength: 200 }
};

// Tolker ordre fra ulike e-commerce-plattformer
function _parseEcommerceOrder(platform, body) {
  try {
    if (platform === 'shopify') {
      const items = (body.line_items || []).map(li => ({ sku: li.sku || '', name: li.title || li.name || '', quantity: li.quantity || 1, price: parseFloat(li.price) || 0 }));
      const orderTotal = parseFloat(body.total_price) || items.reduce((s, i) => s + i.price * i.quantity, 0);
      return {
        orderId: String(body.order_number || body.id || ''),
        platformOrderId: String(body.id || ''),
        customerName: body.customer ? `${body.customer.first_name || ''} ${body.customer.last_name || ''}`.trim() : (body.email || ''),
        items, orderTotal, currency: body.currency || 'NOK'
      };
    }
    if (platform === 'woocommerce') {
      const items = (body.line_items || []).map(li => ({ sku: li.sku || '', name: li.name || '', quantity: li.quantity || 1, price: parseFloat(li.total) / (li.quantity || 1) || 0 }));
      const orderTotal = parseFloat(body.total) || items.reduce((s, i) => s + (parseFloat(i.price) * i.quantity), 0);
      return {
        orderId: String(body.number || body.id || ''),
        platformOrderId: String(body.id || ''),
        customerName: body.billing ? `${body.billing.first_name || ''} ${body.billing.last_name || ''}`.trim() : '',
        items, orderTotal, currency: body.currency || 'NOK'
      };
    }
    // Generisk / custom
    const items = (body.items || body.line_items || []).map(li => ({ sku: li.sku || '', name: li.name || li.title || '', quantity: li.quantity || 1, price: parseFloat(li.price) || 0 }));
    const orderTotal = parseFloat(body.total) || parseFloat(body.order_total) || items.reduce((s, i) => s + i.price * i.quantity, 0);
    return {
      orderId: String(body.order_id || body.id || Date.now()),
      platformOrderId: String(body.platform_order_id || body.id || ''),
      customerName: body.customer_name || body.customer || '',
      items, orderTotal, currency: body.currency || 'NOK'
    };
  } catch { return null; }
}

export async function handleEcommerceRoutes(method, path, req, res, body, ctx) {
  const url = new URL(req.url, 'http://localhost');

  // ---- License ----
  if (method === 'GET' && path === '/api/ecommerce/license') {
    sendJson(res, ctx.ecomLicense ? ctx.ecomLicense.getStatus() : { active: false, status: 'inactive' });
    return true;
  }
  if (method === 'POST' && path === '/api/ecommerce/license/activate') {
    return readBody(req, async (b) => {
      const vr = validate(LICENSE_ACTIVATE_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      if (!ctx.ecomLicense) return sendJson(res, { error: 'License manager not initialized' }, 500);
      try {
        const result = await ctx.ecomLicense.activate(b.license_key, b.email);
        sendJson(res, result);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }
  if (method === 'POST' && path === '/api/ecommerce/license/deactivate') {
    if (!ctx.ecomLicense) return sendJson(res, { error: 'License manager not initialized' }, 500), true;
    sendJson(res, ctx.ecomLicense.deactivate());
    return true;
  }
  if (method === 'POST' && path === '/api/ecommerce/license/validate') {
    if (!ctx.ecomLicense) return sendJson(res, { error: 'License manager not initialized' }, 500), true;
    try {
      const result = await ctx.ecomLicense.validate(true);
      sendJson(res, result);
    } catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  // ---- Fees ----
  if (method === 'GET' && path === '/api/ecommerce/fees') {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    sendJson(res, {
      summary: getEcomFeesSummary(from, to),
      total: getEcomFeesTotal(),
      fees: getEcomFees()
    });
    return true;
  }
  if (method === 'POST' && path === '/api/ecommerce/fees/report') {
    if (!ctx.ecomLicense) return sendJson(res, { error: 'License manager not initialized' }, 500), true;
    try {
      const result = await ctx.ecomLicense.reportFees();
      sendJson(res, result);
    } catch (e) { sendJson(res, { error: e.message }, 500); }
    return true;
  }

  // ---- Configs ----
  if (method === 'GET' && path === '/api/ecommerce/configs') {
    sendJson(res, getEcommerceConfigs());
    return true;
  }
  if (method === 'POST' && path === '/api/ecommerce/configs') {
    if (ctx.ecomLicense && !ctx.ecomLicense.isActive()) return sendJson(res, { error: 'Active e-commerce license required' }, 403), true;
    return readBody(req, (b) => {
      const vr = validate(ECOMMERCE_CONFIG_SCHEMA, b);
      if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
      try {
        const id = addEcommerceConfig(b);
        sendJson(res, { ok: true, id }, 201);
      } catch (e) { sendJson(res, { error: e.message }, 500); }
    }), true;
  }
  const ecomConfigMatch = path.match(/^\/api\/ecommerce\/configs\/(\d+)$/);
  if (ecomConfigMatch) {
    const id = parseInt(ecomConfigMatch[1]);
    if (method === 'GET') { sendJson(res, getEcommerceConfig(id) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      if (ctx.ecomLicense && !ctx.ecomLicense.isActive()) return sendJson(res, { error: 'Active e-commerce license required' }, 403), true;
      return readBody(req, (b) => {
        const vr = validate(ECOMMERCE_CONFIG_UPDATE_SCHEMA, b);
        if (!vr.valid) return sendJson(res, { error: vr.errors.join(', ') }, 400);
        updateEcommerceConfig(id, b); sendJson(res, { ok: true });
      }), true;
    }
    if (method === 'DELETE') {
      if (ctx.ecomLicense && !ctx.ecomLicense.isActive()) return sendJson(res, { error: 'Active e-commerce license required' }, 403), true;
      deleteEcommerceConfig(id);
      sendJson(res, { ok: true });
      return true;
    }
  }

  // ---- Orders ----
  if (method === 'GET' && path === '/api/ecommerce/orders') {
    const configId = url.searchParams.get('config_id');
    sendJson(res, getEcommerceOrders(configId ? parseInt(configId) : null));
    return true;
  }
  const ecomOrderMatch = path.match(/^\/api\/ecommerce\/orders\/(\d+)$/);
  if (ecomOrderMatch) {
    const id = parseInt(ecomOrderMatch[1]);
    if (method === 'GET') { sendJson(res, getEcommerceOrder(id) || { error: 'Not found' }); return true; }
    if (method === 'PUT') {
      return readBody(req, (b) => { updateEcommerceOrder(id, b); sendJson(res, { ok: true }); }), true;
    }
  }
  const ecomFulfillMatch = path.match(/^\/api\/ecommerce\/orders\/(\d+)\/fulfill$/);
  if (ecomFulfillMatch && method === 'POST') {
    const id = parseInt(ecomFulfillMatch[1]);
    updateEcommerceOrder(id, { status: 'fulfilled', fulfilled_at: new Date().toISOString() });
    sendJson(res, { ok: true });
    return true;
  }

  // ---- Webhook Receiver (public endpoint) ----
  const ecomWebhookMatch = path.match(/^\/api\/ecommerce\/webhook\/(\d+)$/);
  if (ecomWebhookMatch && method === 'POST') {
    const configId = parseInt(ecomWebhookMatch[1]);
    if (ctx.ecomLicense && !ctx.ecomLicense.isActive()) return sendJson(res, { error: 'Active e-commerce license required' }, 403), true;
    return _readRawBody(req, (rawBody) => {
      const ecomConfig = getEcommerceConfig(configId);
      if (!ecomConfig || !ecomConfig.active) return sendJson(res, { error: 'Not found' }, 404);

      // Verifiser HMAC-signatur hvis secret er konfigurert
      if (ecomConfig.webhook_secret) {
        const sig = req.headers['x-shopify-hmac-sha256'] || req.headers['x-wc-webhook-signature'] || req.headers['x-webhook-signature'] || '';
        const expected = createHmac('sha256', ecomConfig.webhook_secret).update(rawBody).digest('base64');
        try {
          if (!sig || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
            return sendJson(res, { error: 'Invalid signature' }, 401);
          }
        } catch { return sendJson(res, { error: 'Invalid signature' }, 401); }
      }

      let parsedBody;
      try { parsedBody = JSON.parse(rawBody); } catch { return sendJson(res, { error: 'Invalid JSON' }, 400); }

      const order = _parseEcommerceOrder(ecomConfig.platform, parsedBody);
      if (!order) return sendJson(res, { error: 'Could not parse order' }, 400);

      const orderId = addEcommerceOrder({
        config_id: configId, order_id: order.orderId,
        platform_order_id: order.platformOrderId, customer_name: order.customerName,
        items: order.items, status: 'received'
      });

      // Spor 5% transaksjonsgebyr
      if (ctx.ecomLicense && order.orderTotal > 0) {
        ctx.ecomLicense.addOrderFee(orderId, configId, order.orderTotal, order.currency || 'NOK');
      }

      // Auto-kø hvis aktivert
      if (ecomConfig.auto_queue && ecomConfig.target_queue_id && ctx.queueManager) {
        const mapping = typeof ecomConfig.sku_to_file_mapping === 'string'
          ? JSON.parse(ecomConfig.sku_to_file_mapping) : (ecomConfig.sku_to_file_mapping || {});
        const queueItemIds = [];
        for (const item of order.items) {
          const filename = mapping[item.sku] || mapping[item.name];
          if (filename) {
            for (let c = 0; c < (item.quantity || 1); c++) {
              try {
                const qiId = addQueueItem({ queue_id: ecomConfig.target_queue_id, filename, notes: `Order #${order.orderId} — ${item.name}` });
                queueItemIds.push(qiId);
              } catch (e) { log.warn('Failed to add ecom queue item', e.message); }
            }
          }
        }
        if (queueItemIds.length > 0) {
          updateEcommerceOrder(orderId, { status: 'queued', queue_item_ids: queueItemIds });
        }
      }

      sendJson(res, { ok: true, order_id: orderId }, 201);
    }), true;
  }

  return false;
}
