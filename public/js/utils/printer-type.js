/**
 * Printer Type Utility — consistent type checking across all UI components.
 * Replaces scattered meta.type === 'xxx' checks with semantic helpers.
 *
 * Usage:
 *   const pt = getPrinterType(); // or getPrinterType(meta)
 *   if (pt.isBambu) { ... }
 *   if (pt.hasAms) { ... }
 *   if (pt.hasMultiExtruder) { ... }
 */
(function() {
  'use strict';

  const MOONRAKER_TYPES = ['moonraker', 'klipper', 'creality', 'elegoo', 'voron', 'ratrig', 'qidi', 'sovol', 'anker'];

  /**
   * Get printer type info for the active printer or a specific meta object
   * @param {object} [meta] — printer meta from printerState. If omitted, uses active printer.
   * @param {object} [data] — printer state data for feature detection
   * @returns {object} Type info with boolean flags
   */
  window.getPrinterType = function(meta, data) {
    if (!meta) meta = window.printerState?.getActivePrinterMeta?.() || {};
    if (!data) {
      const pid = meta.id || window.printerState?.getActivePrinterId?.();
      data = pid ? window.printerState?.printers?.[pid] : {};
    }
    const type = (meta.type || '').toLowerCase();

    const isBambu = type === 'bambu' || type === 'mqtt' || (!type && !!meta.serial && !!meta.accessCode);
    const isMoonraker = MOONRAKER_TYPES.includes(type);
    const isOctoPrint = type === 'octoprint';
    const isPrusaLink = type === 'prusalink';
    const isSacp = type === 'sacp';
    const isSmHttp = type === 'snapmaker-http' || type === 'sm-http';
    const isAnkerMake = type === 'ankermake';
    const isSnapmaker = isSacp || isSmHttp || (isMoonraker && (meta.model?.includes('Snapmaker') || data?._isSnapmakerU1));
    const isKlipper = isMoonraker; // All Moonraker printers run Klipper

    // Feature detection (from data, not just type)
    const hasAms = isBambu && !!data?.ams?.ams?.length;
    const hasErcf = !!data?._ercf;
    const hasAfc = !!data?._afc;
    const hasMmu = isPrusaLink && !!data?._mmu_enabled;
    const hasMultiExtruder = hasAms || hasErcf || hasAfc || hasMmu || (data?._extruderCount > 1);
    const hasBedMesh = !!data?._bed_mesh?.meshMatrix?.length;
    const hasCamera = !!data?._camera_state || !!data?.ipcam || isBambu;
    const hasChamber = data?.chamber_temper != null || data?._heatedChamber;
    const hasEnclosure = !!data?._enclosure || isSnapmaker;
    const hasPurifier = !!data?._purifier || !!data?._sm_purifier;
    const hasFilamentSensor = !!data?._filament_sensor;
    const hasWled = !!data?._leds && Object.keys(data._leds).length > 0;
    const hasPowerDevice = !!data?._powerDevices?.length || !!data?._pluginData?.psucontrol;
    const hasSystemTemps = !!data?._system_temps;
    const hasWebSocket = isOctoPrint || isMoonraker; // Real-time push

    return {
      type, isBambu, isMoonraker, isOctoPrint, isPrusaLink, isSacp,
      isSmHttp, isAnkerMake, isSnapmaker, isKlipper,
      // Feature flags
      hasAms, hasErcf, hasAfc, hasMmu, hasMultiExtruder,
      hasBedMesh, hasCamera, hasChamber, hasEnclosure, hasPurifier,
      hasFilamentSensor, hasWled, hasPowerDevice, hasSystemTemps, hasWebSocket,
      // Convenience
      brand: data?._detected_brand || (isBambu ? 'Bambu Lab' : isPrusaLink ? 'Prusa' : isOctoPrint ? 'OctoPrint' : ''),
      model: meta.model || data?._printerProfile?.name || '',
    };
  };

  /**
   * Get filament source description for a printer
   */
  window.getFilamentSourceType = function(pt) {
    if (pt.hasAms) return 'ams';
    if (pt.hasErcf) return 'ercf';
    if (pt.hasAfc) return 'afc';
    if (pt.hasMmu) return 'mmu';
    if (pt.isMoonraker) return 'extruder';
    if (pt.isOctoPrint) return 'octoprint';
    return 'single';
  };
})();
