// Tests for saveSecretsToEnv — the .env round-trip used by bambu-cloud
// to persist auto-refreshed tokens. Covers: write/read symmetry, empty-value
// deletion, in-memory process.env sync, and quoting of values that contain
// shell-significant characters.

import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// We isolate the module under test by giving it a fake project root via a
// temp dir + symlinking server/config.js doesn't work — config.js resolves
// ROOT from import.meta.url. Instead, we exercise it directly by running
// in a sandbox where ROOT == repo root and we read/write the real .env.
// To avoid clobbering the dev .env, the test backs it up + restores it.

const REPO_ROOT = new URL('../../', import.meta.url).pathname;
const ENV_PATH = join(REPO_ROOT, '.env');
const BACKUP_PATH = join(tmpdir(), `dpf-env-test-backup-${process.pid}-${Date.now()}`);

let saveSecretsToEnv;

describe('saveSecretsToEnv', () => {
  before(async () => {
    if (existsSync(ENV_PATH)) {
      writeFileSync(BACKUP_PATH, readFileSync(ENV_PATH));
    }
    // Import lazily so the module-load .env scan in config.js sees a known
    // state (we'll wipe between tests anyway).
    ({ saveSecretsToEnv } = await import('../../server/config.js'));
  });

  after(() => {
    if (existsSync(BACKUP_PATH)) {
      writeFileSync(ENV_PATH, readFileSync(BACKUP_PATH));
      rmSync(BACKUP_PATH);
    } else if (existsSync(ENV_PATH)) {
      rmSync(ENV_PATH);
    }
  });

  beforeEach(() => {
    if (existsSync(ENV_PATH)) rmSync(ENV_PATH);
    delete process.env.TEST_KEY_A;
    delete process.env.TEST_KEY_B;
    delete process.env.TEST_KEY_QUOTED;
  });

  it('writes a key/value pair that round-trips on read', () => {
    saveSecretsToEnv({ TEST_KEY_A: 'hello' });
    const raw = readFileSync(ENV_PATH, 'utf8');
    assert.match(raw, /^TEST_KEY_A=hello$/m);
  });

  it('updates process.env in-memory immediately', () => {
    saveSecretsToEnv({ TEST_KEY_A: 'live-value' });
    assert.equal(process.env.TEST_KEY_A, 'live-value');
  });

  it('deletes the key when value is empty string', () => {
    saveSecretsToEnv({ TEST_KEY_A: 'first' });
    saveSecretsToEnv({ TEST_KEY_A: '' });
    const raw = readFileSync(ENV_PATH, 'utf8');
    assert.doesNotMatch(raw, /TEST_KEY_A/);
    assert.equal(process.env.TEST_KEY_A, undefined);
  });

  it('deletes the key when value is null', () => {
    saveSecretsToEnv({ TEST_KEY_A: 'first' });
    saveSecretsToEnv({ TEST_KEY_A: null });
    const raw = readFileSync(ENV_PATH, 'utf8');
    assert.doesNotMatch(raw, /TEST_KEY_A/);
  });

  it('preserves other keys when updating one', () => {
    saveSecretsToEnv({ TEST_KEY_A: 'a-value', TEST_KEY_B: 'b-value' });
    saveSecretsToEnv({ TEST_KEY_A: 'a-changed' });
    assert.equal(process.env.TEST_KEY_A, 'a-changed');
    assert.equal(process.env.TEST_KEY_B, 'b-value');
  });

  it('quotes values with whitespace or shell-significant characters', () => {
    saveSecretsToEnv({ TEST_KEY_QUOTED: 'value with "quotes" and #hash' });
    const raw = readFileSync(ENV_PATH, 'utf8');
    // Round-trip through process.env confirms the value survives parsing.
    assert.equal(process.env.TEST_KEY_QUOTED, 'value with "quotes" and #hash');
    assert.match(raw, /^TEST_KEY_QUOTED="/m);
  });

  it('writes file with chmod 600 (owner-only)', () => {
    saveSecretsToEnv({ TEST_KEY_A: 'sensitive' });
    if (process.platform !== 'win32') {
      const mode = statSync(ENV_PATH).mode & 0o777;
      assert.equal(mode, 0o600, `expected 0600, got 0${mode.toString(8)}`);
    }
  });

  it('handles bearer-token-shaped values (long base64-like strings)', () => {
    // Bambu Cloud accessTokens are JWTs ~300+ chars with dots, underscores, dashes.
    const fakeJwt = 'eyJhbGciOiJIUzI1NiJ9.' + 'A'.repeat(200) + '_' + 'B-'.repeat(50);
    saveSecretsToEnv({ TEST_KEY_A: fakeJwt });
    assert.equal(process.env.TEST_KEY_A, fakeJwt);
  });
});
