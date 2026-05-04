// helpers.test.js — Tester for API-hjelpefunksjoner og rate limiter

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { sendJson, checkApiRate, checkLoginRate, getApiRateHeaders } from '../../server/api-helpers.js';

// ---- Mock HTTP response ----
// Enkel mock som fanger opp writeHead og end-kall
function createMockRes() {
  const res = {
    _status: null,
    _headers: null,
    _body: null,
    writeHead(status, headers) {
      this._status = status;
      this._headers = headers;
    },
    end(body) {
      this._body = body;
    },
  };
  return res;
}

describe('sendJson()', () => {
  it('sender JSON med status 200 som standard', () => {
    const res = createMockRes();
    sendJson(res, { ok: true });

    assert.strictEqual(res._status, 200, 'status skal være 200');
    assert.strictEqual(res._headers['Content-Type'], 'application/json', 'Content-Type skal være application/json');
    assert.ok(res._body, 'body skal ikke være tom');

    const parsed = JSON.parse(res._body);
    assert.deepStrictEqual(parsed, { ok: true });
  });

  it('sender JSON med tilpasset statuskode', () => {
    const res = createMockRes();
    sendJson(res, { error: 'Ikke funnet' }, 404);

    assert.strictEqual(res._status, 404, 'status skal være 404');
    const parsed = JSON.parse(res._body);
    assert.strictEqual(parsed.error, 'Ikke funnet');
  });

  it('sender JSON med 201 Created', () => {
    const res = createMockRes();
    sendJson(res, { id: 42 }, 201);
    assert.strictEqual(res._status, 201);
  });

  it('serialiserer komplekse objekter korrekt', () => {
    const res = createMockRes();
    const data = {
      printers: [{ id: 'p1', name: 'X1C' }],
      total: 1,
      nested: { deep: { value: true } },
    };
    sendJson(res, data);

    const parsed = JSON.parse(res._body);
    assert.deepStrictEqual(parsed, data);
  });

  it('inkluderer X-API-Version header', () => {
    const res = createMockRes();
    sendJson(res, {});
    assert.ok('X-API-Version' in res._headers, 'X-API-Version header skal eksistere');
  });

  it('håndterer null og tom array', () => {
    const res1 = createMockRes();
    sendJson(res1, null);
    assert.strictEqual(JSON.parse(res1._body), null);

    const res2 = createMockRes();
    sendJson(res2, []);
    assert.deepStrictEqual(JSON.parse(res2._body), []);
  });
});

describe('checkApiRate() — generell rate limiter', () => {
  it('tillater de første 200 forespørslene fra én IP', () => {
    const ip = `test-rate-${Date.now()}-1`;
    // Første kall skal alltid gå gjennom
    const allowed = checkApiRate(ip);
    assert.strictEqual(allowed, true, 'første forespørsel skal tillates');
  });

  it('returnerer true for ny IP', () => {
    const ip = `unique-ip-${Date.now()}-${Math.random()}`;
    assert.strictEqual(checkApiRate(ip), true, 'ny IP skal alltid tillates');
  });

  it('blokkerer etter grensen er nådd', () => {
    const ip = `rate-limit-test-${Date.now()}`;
    // Tøm opp til grensen (200 forespørsler)
    let lastResult;
    for (let i = 0; i < 201; i++) {
      lastResult = checkApiRate(ip);
    }
    assert.strictEqual(lastResult, false, 'forespørsler over grensen skal blokkeres');
  });

  it('returnerer true for to forskjellige IP-er', () => {
    const ip1 = `ip-a-${Date.now()}`;
    const ip2 = `ip-b-${Date.now()}`;
    assert.strictEqual(checkApiRate(ip1), true, 'IP 1 skal tillates');
    assert.strictEqual(checkApiRate(ip2), true, 'IP 2 skal tillates');
  });
});

describe('getApiRateHeaders()', () => {
  it('returnerer rate limit headers', () => {
    const ip = `header-test-${Date.now()}`;
    checkApiRate(ip); // Registrer én forespørsel

    const headers = getApiRateHeaders(ip);
    assert.ok('X-RateLimit-Limit' in headers, 'X-RateLimit-Limit skal eksistere');
    assert.ok('X-RateLimit-Remaining' in headers, 'X-RateLimit-Remaining skal eksistere');
    assert.strictEqual(headers['X-RateLimit-Limit'], 200, 'grensen skal være 200');
  });

  it('returnerer full remaining for ny IP (ingen tidligere kall)', () => {
    const ip = `new-ip-header-${Date.now()}`;
    const headers = getApiRateHeaders(ip);
    assert.strictEqual(headers['X-RateLimit-Remaining'], 200, 'ny IP skal ha full kvote');
  });

  it('reduserer remaining etter forespørsel', () => {
    const ip = `counting-ip-${Date.now()}`;
    checkApiRate(ip); // 1. kall

    const headers = getApiRateHeaders(ip);
    assert.strictEqual(headers['X-RateLimit-Remaining'], 199, 'remaining skal reduseres med 1');
  });
});

describe('checkLoginRate() — innloggings rate limiter', () => {
  it('tillater de første 5 forsøkene fra én IP', () => {
    const ip = `login-test-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const allowed = checkLoginRate(ip);
      assert.strictEqual(allowed, true, `forsøk ${i + 1} skal tillates`);
    }
  });

  it('blokkerer det 6. innloggingsforsøket', () => {
    const ip = `login-block-${Date.now()}`;
    for (let i = 0; i < 5; i++) checkLoginRate(ip);
    const blocked = checkLoginRate(ip);
    assert.strictEqual(blocked, false, '6. forsøk skal blokkeres');
  });

  it('ny IP starter med rent slate', () => {
    const ip = `fresh-login-ip-${Date.now()}`;
    assert.strictEqual(checkLoginRate(ip), true, 'fersk IP skal alltid tillates');
  });
});
