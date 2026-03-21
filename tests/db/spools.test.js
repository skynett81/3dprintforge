// spools.test.js — Tester for spool CRUD (filamenthåndtering)

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  getSpools,
  getSpool,
  addSpool,
  updateSpool,
  deleteSpool,
  archiveSpool,
  refillSpool,
  searchSpools,
} from '../../server/db/spools.js';

describe('Spools CRUD', () => {
  let testSpoolId;

  before(() => {
    setupTestDb();
  });

  it('getSpools() returnerer tom liste initialt', () => {
    const result = getSpools();
    assert.ok(result && typeof result === 'object', 'skal returnere et objekt');
    assert.ok(Array.isArray(result.rows), 'rows skal være en array');
    assert.strictEqual(result.total, 0, 'ingen spoler initialt');
  });

  it('addSpool() legger til en spole og returnerer id og short_id', () => {
    const result = addSpool({
      initial_weight_g: 1000,
      remaining_weight_g: 1000,
      used_weight_g: 0,
      cost: 199,
      location: 'Hylle A',
      comment: 'Testspole',
    });

    assert.ok(result && typeof result === 'object', 'skal returnere objekt');
    assert.ok(typeof result.id === 'number', 'id skal være nummer');
    assert.ok(result.id > 0, 'id skal være positiv');
    assert.ok(typeof result.short_id === 'string', 'short_id skal være streng');
    assert.strictEqual(result.short_id.length, 4, 'short_id skal være 4 tegn');

    testSpoolId = result.id;
  });

  it('getSpools() returnerer 1 spole etter addSpool()', () => {
    const result = getSpools({ archived: false });
    assert.strictEqual(result.total, 1, 'skal ha 1 spole');
    assert.strictEqual(result.rows.length, 1);
  });

  it('getSpool() returnerer spolen med korrekte felter', () => {
    const spool = getSpool(testSpoolId);
    assert.ok(spool, 'spolen skal finnes');
    assert.strictEqual(spool.id, testSpoolId);
    assert.strictEqual(spool.initial_weight_g, 1000);
    assert.strictEqual(spool.location, 'Hylle A');
    assert.strictEqual(spool.comment, 'Testspole');
    // Enrichede felter fra _enrichSpoolRows
    assert.ok('remaining_length_m' in spool, 'remaining_length_m skal finnes');
    assert.ok('used_length_m' in spool, 'used_length_m skal finnes');
  });

  it('getSpool() returnerer null for ikke-eksisterende id', () => {
    const spool = getSpool(99999);
    assert.strictEqual(spool, null);
  });

  it('updateSpool() oppdaterer spolen', () => {
    updateSpool(testSpoolId, {
      remaining_weight_g: 750,
      used_weight_g: 250,
      location: 'Hylle B',
      comment: 'Oppdatert kommentar',
      initial_weight_g: 1000,
      cost: 199,
      archived: 0,
    });

    const updated = getSpool(testSpoolId);
    assert.strictEqual(updated.remaining_weight_g, 750);
    assert.strictEqual(updated.used_weight_g, 250);
    assert.strictEqual(updated.location, 'Hylle B');
  });

  it('archiveSpool() arkiverer spolen', () => {
    archiveSpool(testSpoolId, true);
    const spool = getSpool(testSpoolId);
    assert.strictEqual(spool.archived, 1, 'spolen skal være arkivert');
  });

  it('archiveSpool() kan de-arkivere spolen', () => {
    archiveSpool(testSpoolId, false);
    const spool = getSpool(testSpoolId);
    assert.strictEqual(spool.archived, 0, 'spolen skal ikke være arkivert');
  });

  it('refillSpool() oppdaterer vekt og teller oppfyllinger', () => {
    const result = refillSpool(testSpoolId, 1000);
    assert.ok(result, 'refill skal returnere resultat');
    assert.strictEqual(result.id, testSpoolId);
    assert.strictEqual(result.refill_count, 1, 'refill_count skal være 1');

    const spool = getSpool(testSpoolId);
    assert.strictEqual(spool.remaining_weight_g, 1000, 'vekt skal være oppdatert');
    assert.strictEqual(spool.used_weight_g, 0, 'used_weight_g skal nullstilles');
    assert.strictEqual(spool.is_refill, 1, 'is_refill skal settes');
  });

  it('searchSpools() finner spole basert på kommentar', () => {
    // Oppdater spolen med en søkbar kommentar
    updateSpool(testSpoolId, {
      remaining_weight_g: 1000,
      used_weight_g: 0,
      initial_weight_g: 1000,
      comment: 'UniktSøkeord123',
      archived: 0,
    });

    const result = searchSpools('UniktSøkeord123');
    assert.ok(result.total >= 1, 'søk skal finne spolen');
  });

  it('searchSpools() returnerer tom liste for ikke-eksisterende søkeord', () => {
    const result = searchSpools('INGENTREFF_XYZ_999');
    assert.strictEqual(result.total, 0, 'ingen treff for ukjent søkeord');
    assert.strictEqual(result.rows.length, 0);
  });

  it('deleteSpool() fjerner spolen', () => {
    deleteSpool(testSpoolId);
    const spool = getSpool(testSpoolId);
    assert.strictEqual(spool, null, 'slettet spole skal ikke finnes');
  });
});
