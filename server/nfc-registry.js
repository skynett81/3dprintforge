// nfc-registry.js
// Brand-agnostic RFID/NFC tag registry. Every printer that reads a tag —
// Bambu AMS (tag_uid), Snapmaker U1 (CARD_UID), OpenSpool/Spoolman/Creality,
// or an external reader — funnels through here so a tag is recognised the same
// way everywhere and lives in one place (the nfc_mappings table).
//
// Behaviour for a single read against a printer slot:
//   - tag already mapped to a spool  → assign that spool to the slot
//   - tag unknown, slot has a spool  → link the tag to it
//   - tag unknown, no spool in slot  → leave it (a connector that has rich tag
//     data, e.g. the U1, creates the spool itself first, then registers here)
//
// Pure registry logic — callers decide WHEN to call (and do their own
// de-duplication); this just keeps the mapping correct.

import { lookupNfcTag, linkNfcTag } from './db/misc.js';
import { getSpoolBySlot, assignSpoolToSlot } from './db/spools.js';
import { createLogger } from './logger.js';

const log = createLogger('nfc');

const _ZERO = /^[0\s]*$/; // all-zero / blank UID = no tag present

export function isRealTag(uid) {
  return !!uid && !_ZERO.test(String(uid));
}

/**
 * Register one NFC/RFID read against a printer slot.
 *
 * @param {object} o
 * @param {string} o.printerId
 * @param {number} o.amsUnit       AMS unit (0..n), 255 for external spool
 * @param {number} o.trayId        slot / channel (0..n)
 * @param {string} o.tagUid        tag UID (Bambu tag_uid, U1 CARD_UID, …)
 * @param {string} [o.standard]    tag standard: bambu | snapmaker | openspool | spoolman | creality | generic
 * @param {object|string} [o.data] raw tag payload to persist (optional)
 * @param {function} [o.onEvent]   notified on assign/link for live UI + logging
 * @returns {{action:string, spoolId:number}|null}
 */
export function registerNfcTag(o) {
  const { printerId, onEvent } = o;
  const tagUid = o.tagUid;
  if (!printerId || !isRealTag(tagUid)) return null;
  const amsUnit = parseInt(o.amsUnit) || 0;
  const trayId = parseInt(o.trayId) || 0;
  const standard = o.standard || 'generic';
  const data = o.data == null ? null : (typeof o.data === 'string' ? o.data : JSON.stringify(o.data));

  try {
    const mapping = lookupNfcTag(tagUid);

    // Known tag → make sure its spool is the one in this slot.
    if (mapping && mapping.spool_id) {
      const existing = getSpoolBySlot(printerId, amsUnit, trayId);
      if (!existing || existing.id !== mapping.spool_id) {
        assignSpoolToSlot(mapping.spool_id, printerId, amsUnit, trayId);
        log.info(`tag ${tagUid} → assigned spool #${mapping.spool_id} to ${printerId} ${amsUnit}:${trayId}`);
        onEvent?.({ action: 'assigned', printer_id: printerId, ams_unit: amsUnit, tray_id: trayId, tag_uid: tagUid, spool_id: mapping.spool_id, spool_name: mapping.spool_name || null, standard });
        return { action: 'assigned', spoolId: mapping.spool_id };
      }
      return { action: 'current', spoolId: mapping.spool_id };
    }

    // Unknown tag → adopt the spool already in the slot.
    if (!mapping) {
      const existing = getSpoolBySlot(printerId, amsUnit, trayId);
      if (existing) {
        linkNfcTag(tagUid, existing.id, standard, data);
        log.info(`tag ${tagUid} → linked to spool #${existing.id} (${standard})`);
        onEvent?.({ action: 'linked', printer_id: printerId, ams_unit: amsUnit, tray_id: trayId, tag_uid: tagUid, spool_id: existing.id, spool_name: existing.name || null, standard });
        return { action: 'linked', spoolId: existing.id };
      }
    }
  } catch (e) {
    log.warn('registerNfcTag failed: ' + e.message);
  }
  return null;
}
