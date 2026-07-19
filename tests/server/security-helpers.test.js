// security-helpers.test.js — unit tests for the SSRF guard and the
// path-traversal containment helper added to close CodeQL alerts.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveWithin } from '../../server/path-safety.js';
import { isDangerousUrl } from '../../server/ssrf-guard.js';

describe('resolveWithin', () => {
  const base = '/srv/app/public';

  it('resolves a plain relative path inside the base', () => {
    assert.equal(resolveWithin(base, 'js/app.js'), '/srv/app/public/js/app.js');
  });

  it('treats a leading slash as relative, not absolute', () => {
    assert.equal(resolveWithin(base, '/index.html'), '/srv/app/public/index.html');
  });

  it('collapses nested traversal but never escapes the base', () => {
    assert.equal(resolveWithin(base, 'a/b/../c.js'), '/srv/app/public/a/c.js');
    // Traversal that would escape is stripped and stays contained.
    assert.equal(resolveWithin(base, '../secret'), '/srv/app/public/secret');
    assert.equal(resolveWithin(base, '../../etc/passwd'), '/srv/app/public/etc/passwd');
    assert.equal(resolveWithin(base, 'x/../../../etc'), '/srv/app/public/etc');
  });

  it('rejects NUL bytes and non-strings', () => {
    assert.equal(resolveWithin(base, 'foo\0bar'), null);
    assert.equal(resolveWithin(base, undefined), null);
    assert.equal(resolveWithin(base, 42), null);
  });

  it('returns the base itself for an empty path', () => {
    assert.equal(resolveWithin(base, ''), '/srv/app/public');
  });
});

describe('isDangerousUrl', () => {
  it('blocks non-http(s) schemes', () => {
    assert.equal(isDangerousUrl('ftp://example.com/x'), true);
    assert.equal(isDangerousUrl('file:///etc/passwd'), true);
    assert.equal(isDangerousUrl('javascript:alert(1)'), true);
    assert.equal(isDangerousUrl('not a url'), true);
  });

  it('allows public hosts', () => {
    assert.equal(isDangerousUrl('https://makerworld.com/x'), false);
    assert.equal(isDangerousUrl('http://8.8.8.8/x'), false);
  });

  it('blocks loopback / private / link-local IPv4', () => {
    for (const u of [
      'http://127.0.0.1/x', 'http://0.0.0.0/x', 'http://10.0.0.5/x',
      'http://172.16.4.4/x', 'http://192.168.1.50/x', 'http://100.100.0.1/x',
    ]) assert.equal(isDangerousUrl(u), true, u);
  });

  it('always blocks cloud metadata, even with allowPrivate', () => {
    assert.equal(isDangerousUrl('http://169.254.169.254/latest/meta-data/'), true);
    assert.equal(isDangerousUrl('http://169.254.169.254/x', { allowPrivate: true }), true);
  });

  it('blocks localhost and internal-only TLDs by name', () => {
    assert.equal(isDangerousUrl('http://localhost/x'), true);
    assert.equal(isDangerousUrl('http://printer.local/x'), true);
    assert.equal(isDangerousUrl('http://svc.internal/x'), true);
  });

  it('blocks loopback / ULA / link-local IPv6 incl. IPv4-mapped', () => {
    assert.equal(isDangerousUrl('http://[::1]/x'), true);
    assert.equal(isDangerousUrl('http://[fe80::1]/x'), true);
    assert.equal(isDangerousUrl('http://[fd00::1]/x'), true);
    assert.equal(isDangerousUrl('http://[::ffff:127.0.0.1]/x'), true);
    assert.equal(isDangerousUrl('http://[::ffff:192.168.1.9]/x'), true);
    assert.equal(isDangerousUrl('http://[::ffff:8.8.8.8]/x'), false);
  });

  it('allows private targets when allowPrivate is set (self-hosted Spoolman/printers)', () => {
    assert.equal(isDangerousUrl('http://192.168.1.50/api', { allowPrivate: true }), false);
    assert.equal(isDangerousUrl('http://localhost:7912/api', { allowPrivate: true }), false);
    assert.equal(isDangerousUrl('http://10.0.0.5/x', { allowPrivate: true }), false);
  });
});
