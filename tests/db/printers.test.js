// printers.test.js — Tester for printer CRUD og printer-grupper

import { describe, it, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import { getDb } from '../../server/db/connection.js';
import {
  getPrinters,
  addPrinter,
  updatePrinter,
  deletePrinter,
  getPrinterGroups,
  addPrinterGroup,
  updatePrinterGroup,
  deletePrinterGroup,
  addPrinterToGroup,
  getGroupMembers,
  getPrinterGroupsForPrinter,
} from '../../server/db/printers.js';

describe('Printer og Printer Groups', () => {
  before(() => {
    // Én felles db-setup for alle printer-tester
    setupTestDb();
  });

  afterEach(() => {
    // Rens tabellene mellom tester
    try {
      const db = getDb();
      db.exec('DELETE FROM printer_group_members');
      db.exec('DELETE FROM printer_groups');
      db.exec('DELETE FROM printers');
    } catch { /* ignorer */ }
  });

  describe('Printer CRUD', () => {
    it('getPrinters() returnerer tom liste initialt', () => {
      const printers = getPrinters();
      assert.ok(Array.isArray(printers), 'skal returnere en array');
      assert.strictEqual(printers.length, 0, 'skal være tom initialt');
    });

    it('addPrinter() legger til en skriver', () => {
      addPrinter({
        id: 'test-printer-1',
        name: 'Test X1C',
        ip: '192.168.1.100',
        serial: 'ABC123456',
        accessCode: '12345678',
        model: 'BL-P001',
      });

      const printers = getPrinters();
      assert.strictEqual(printers.length, 1, 'skal ha 1 skriver');
      assert.strictEqual(printers[0].id, 'test-printer-1');
      assert.strictEqual(printers[0].name, 'Test X1C');
      assert.strictEqual(printers[0].ip, '192.168.1.100');
    });

    it('getPrinters() returnerer korrekte feltmappinger (camelCase)', () => {
      addPrinter({ id: 'map-test', name: 'Mapping Test', accessCode: 'abc123' });
      const printers = getPrinters();
      const p = printers[0];
      assert.ok('accessCode' in p, 'accessCode skal eksistere (camelCase)');
      assert.ok('added_at' in p, 'added_at skal eksistere');
    });

    it('addPrinter() støtter minimalt input (kun id og name)', () => {
      addPrinter({ id: 'minimal', name: 'Minimal Printer' });
      const printers = getPrinters();
      assert.strictEqual(printers.length, 1);
      assert.strictEqual(printers[0].ip, null, 'ip skal være null');
    });

    it('updatePrinter() oppdaterer en skriver', () => {
      addPrinter({ id: 'update-test', name: 'Original', ip: '10.0.0.1' });

      updatePrinter('update-test', {
        name: 'Oppdatert',
        ip: '10.0.0.2',
        serial: null,
        accessCode: null,
        model: null,
        electricity_rate_kwh: 1.5,
        printer_wattage: 350,
        machine_cost: null,
        machine_lifetime_hours: null,
      });

      const printers = getPrinters();
      const p = printers[0];
      assert.strictEqual(p.name, 'Oppdatert');
      assert.strictEqual(p.ip, '10.0.0.2');
      assert.strictEqual(p.electricity_rate_kwh, 1.5);
    });

    it('deletePrinter() fjerner en skriver', () => {
      addPrinter({ id: 'delete-test', name: 'Slett Meg' });
      deletePrinter('delete-test');

      const printers = getPrinters();
      assert.strictEqual(printers.length, 0, 'skriveren skal være slettet');
    });

    it('kan legge til flere skrivere', () => {
      addPrinter({ id: 'p1', name: 'Printer 1' });
      addPrinter({ id: 'p2', name: 'Printer 2' });
      addPrinter({ id: 'p3', name: 'Printer 3' });

      const printers = getPrinters();
      assert.strictEqual(printers.length, 3, 'skal ha 3 skrivere');
    });
  });

  describe('Printer Groups', () => {
    it('getPrinterGroups() returnerer tom liste initialt', () => {
      const groups = getPrinterGroups();
      assert.ok(Array.isArray(groups), 'skal returnere array');
      assert.strictEqual(groups.length, 0, 'ingen grupper initialt');
    });

    it('addPrinterGroup() oppretter en gruppe og returnerer id', () => {
      const id = addPrinterGroup({ name: 'Testgruppe', description: 'En testgruppe' });
      assert.ok(typeof id === 'number', 'skal returnere numerisk id');
      assert.ok(id > 0, 'id skal være positiv');
    });

    it('getPrinterGroups() returnerer opprettet gruppe', () => {
      addPrinterGroup({ name: 'Synlig Gruppe' });
      const groups = getPrinterGroups();
      assert.ok(groups.length >= 1, 'skal ha minst 1 gruppe');
      const g = groups.find(g => g.name === 'Synlig Gruppe');
      assert.ok(g, 'Synlig Gruppe skal finnes');
    });

    it('addPrinterToGroup() og getGroupMembers() fungerer', () => {
      addPrinter({ id: 'member-printer', name: 'Gruppe Printer' });
      const groupId = addPrinterGroup({ name: 'Gruppe Med Skrivere' });
      addPrinterToGroup(groupId, 'member-printer');

      const members = getGroupMembers(groupId);
      assert.strictEqual(members.length, 1, 'skal ha 1 medlem');
      assert.strictEqual(members[0].printer_id, 'member-printer');
    });

    it('getPrinterGroupsForPrinter() returnerer grupper skriveren tilhører', () => {
      addPrinter({ id: 'grp-member', name: 'Gruppe Printer' });
      const groupId = addPrinterGroup({ name: 'Printer-gruppe' });
      addPrinterToGroup(groupId, 'grp-member');

      const groups = getPrinterGroupsForPrinter('grp-member');
      assert.ok(groups.length >= 1, 'skriveren skal tilhøre minst 1 gruppe');
    });

    it('updatePrinterGroup() oppdaterer gruppe-navn', () => {
      const groupId = addPrinterGroup({ name: 'Gammel Navn' });
      updatePrinterGroup(groupId, { name: 'Nytt Navn' });

      const groups = getPrinterGroups();
      const updated = groups.find(g => g.id === groupId);
      assert.strictEqual(updated.name, 'Nytt Navn');
    });

    it('deletePrinterGroup() fjerner gruppen', () => {
      const groupId = addPrinterGroup({ name: 'Skal Slettes' });
      deletePrinterGroup(groupId);

      const groups = getPrinterGroups();
      const found = groups.find(g => g.id === groupId);
      assert.strictEqual(found, undefined, 'slettet gruppe skal ikke finnes');
    });
  });
});
