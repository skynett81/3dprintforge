// route-permissions.test.js — locks in the authorization level required
// per API route (getRoutePermission). Guards against the class of bug
// where a blanket "GET -> view" rule leaks admin-only reads (API keys,
// user PII, full-DB backups, channel/store secrets) to low-privilege
// 'view' users.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getRoutePermission } from '../../server/api-routes.js';

describe('getRoutePermission — sensitive reads require admin', () => {
  const adminReads = [
    ['GET', '/api/keys'],
    ['GET', '/api/keys/3'],
    ['GET', '/api/users'],
    ['GET', '/api/roles'],
    ['GET', '/api/backup/list'],
    ['GET', '/api/backup/download'],
    ['GET', '/api/webhooks'],
    ['GET', '/api/remote-nodes'],
    ['GET', '/api/notifications/config'],
    ['GET', '/api/ecommerce/configs'],
    ['GET', '/api/auth/config'],
    ['GET', '/api/auth/totp/setup'],
    ['GET', '/api/network/settings'],
    ['GET', '/api/discovery/scan'],
  ];
  for (const [m, p] of adminReads) {
    it(`${m} ${p} -> admin`, () => {
      assert.equal(getRoutePermission(m, p), 'admin');
    });
  }

  it('write methods on those resources are also admin', () => {
    assert.equal(getRoutePermission('DELETE', '/api/keys/1'), 'admin');
    assert.equal(getRoutePermission('POST', '/api/users'), 'admin');
    assert.equal(getRoutePermission('DELETE', '/api/backup/2'), 'admin');
  });
});

describe('getRoutePermission — ordinary reads stay view', () => {
  const viewReads = [
    ['GET', '/api/inventory/spools'],
    ['GET', '/api/history'],
    ['GET', '/api/printers/p1/state'],
    ['GET', '/api/ecommerce/license'], // dashboard toggle, not a secret
    ['GET', '/api/notifications/log'],
    ['GET', '/api/bambu-cloud/tasks'],
  ];
  for (const [m, p] of viewReads) {
    it(`${m} ${p} -> view`, () => {
      assert.equal(getRoutePermission(m, p), 'view');
    });
  }
});

describe('getRoutePermission — fail-closed default', () => {
  it('unknown write route defaults to admin', () => {
    assert.equal(getRoutePermission('POST', '/api/some/brand/new/thing'), 'admin');
    assert.equal(getRoutePermission('DELETE', '/api/unmapped'), 'admin');
  });
  it('unknown read route defaults to view', () => {
    assert.equal(getRoutePermission('GET', '/api/some/brand/new/thing'), 'view');
  });
});
