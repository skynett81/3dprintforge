let seqId = 100;

function nextSeq() {
  return String(seqId++);
}

export function buildPauseCommand() {
  return { print: { sequence_id: nextSeq(), command: 'pause' } };
}

export function buildResumeCommand() {
  return { print: { sequence_id: nextSeq(), command: 'resume' } };
}

export function buildStopCommand() {
  return { print: { sequence_id: nextSeq(), command: 'stop' } };
}

export function buildSpeedCommand(level) {
  return { print: { sequence_id: nextSeq(), command: 'print_speed', param: String(level) } };
}

/**
 * Set chamber heater target — X1E, H2D, H2S, H2C (printers with active
 * chamber heating). Target is clamped to the vendor-safe 0–65°C range.
 * Verified against ha-bambulab chamber_temperature number entity.
 */
export function buildChamberTempCommand(targetC) {
  const clamped = Math.max(0, Math.min(65, Math.round(Number(targetC) || 0)));
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'chamber_temp',
      target: clamped,
    },
  };
}

export function buildLightCommand(node, mode) {
  return {
    system: {
      sequence_id: nextSeq(),
      command: 'ledctrl',
      led_node: node,
      led_mode: mode,
      led_on_time: 500,
      led_off_time: 500,
      loop_times: 0,
      interval_time: 0
    }
  };
}

export function buildGcodeCommand(gcode) {
  return { print: { sequence_id: nextSeq(), command: 'gcode_line', param: gcode } };
}

export function buildSkipObjectsCommand(objList) {
  return { print: { sequence_id: nextSeq(), command: 'skip_objects', obj_list: objList } };
}

// Match any known URL scheme the printer accepts: ftp/ftps, http/https, file.
// H2D (2026 firmware) accepts http(s):// URLs so the printer fetches the 3MF
// directly from our server — no USB stick or cloud upload required.
const URL_SCHEME_RE = /^(ftp|ftps|http|https|file):\/\//i;

export function buildPrintCommand(filename, plateId = 1) {
  const subtaskName = filename.split('/').pop().replace(/\.[^.]+$/, '');
  const url = URL_SCHEME_RE.test(filename) ? filename : `ftp://${filename}`;
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'project_file',
      param: `Metadata/plate_${plateId}.gcode`,
      subtask_name: subtaskName,
      url,
      bed_type: 'auto',
      timelapse: false,
      bed_leveling: true,
      flow_cali: false,
      vibration_cali: false,
      layer_inspect: false,
      use_ams: true
    }
  };
}

export function buildGcodeMultiLine(lines) {
  const cmds = [];
  for (const line of lines.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith(';')) {
      cmds.push(buildGcodeCommand(trimmed));
    }
  }
  return cmds;
}

export function buildFilamentUnloadSequence(tempC = 220) {
  return [
    `M104 S${tempC}`,
    `M109 S${tempC}`,
    'G92 E0',
    'G1 E-50 F300',
    'G1 E-100 F1000',
    'M104 S0',
  ].join('\n');
}

export function buildFilamentLoadSequence(tempC = 220, purgeLength = 30) {
  return [
    `M104 S${tempC}`,
    `M109 S${tempC}`,
    'G92 E0',
    'G1 E80 F300',
    `G1 E${purgeLength} F100`,
    'G92 E0',
  ].join('\n');
}

export function buildAmsTrayChangeCommand(trayId) {
  return { print: { sequence_id: nextSeq(), command: 'ams_change_filament', target: trayId } };
}

export function buildFormatStorageCommand() {
  return { print: { sequence_id: nextSeq(), command: 'gcode_line', param: 'M662' } };
}

/** Predefined buzzer melodies using M300 G-code (S=frequency Hz, P=duration ms). */
export const BUZZER_MELODIES = {
  print_complete: [
    { freq: 523, duration: 150 },  // C5
    { freq: 659, duration: 150 },  // E5
    { freq: 784, duration: 150 },  // G5
    { freq: 1047, duration: 300 }, // C6
  ],
  print_failed: [
    { freq: 784, duration: 200 },  // G5
    { freq: 659, duration: 200 },  // E5
    { freq: 523, duration: 200 },  // C5
    { freq: 392, duration: 400 },  // G4
  ],
  countdown: [
    { freq: 880, duration: 100 },  // A5
    { freq: 0, duration: 80 },     // pause
    { freq: 880, duration: 100 },  // A5
    { freq: 0, duration: 80 },     // pause
    { freq: 880, duration: 100 },  // A5
    { freq: 0, duration: 80 },     // pause
    { freq: 1175, duration: 300 }, // D6
  ],
  alert: [
    { freq: 1000, duration: 150 },
    { freq: 0, duration: 100 },
    { freq: 1000, duration: 150 },
    { freq: 0, duration: 100 },
    { freq: 1000, duration: 150 },
  ],
};

/** Build G-code commands for buzzer melody. Returns array of gcode command objects. */
export function buildBuzzerCommands(melody, customTones) {
  const tones = melody && BUZZER_MELODIES[melody]
    ? BUZZER_MELODIES[melody]
    : Array.isArray(customTones) ? customTones : [];
  if (tones.length === 0) return [];
  return tones
    .filter(t => typeof t.freq === 'number' && typeof t.duration === 'number' && t.duration > 0)
    .map(t => buildGcodeCommand(`M300 S${Math.round(t.freq)} P${Math.round(t.duration)}`));
}

/** Start AMS drying — sends drying parameters via MQTT. */
export function buildAmsDryCommand(amsId, tempC, durationMin) {
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'ams_control',
      param: 'start',
      ams_id: parseInt(amsId) || 0,
      dry_temp: parseInt(tempC) || 55,
      dry_duration: parseInt(durationMin) || 240,
    }
  };
}

/** Stop AMS drying. */
export function buildAmsStopDryCommand(amsId) {
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'ams_control',
      param: 'stop',
      ams_id: parseInt(amsId) || 0,
    }
  };
}

/** Get MQTT debug message (pushall for full state dump). */
export function buildPushAllCommand() {
  return { pushing: { sequence_id: nextSeq(), command: 'pushall' } };
}

// ── Calibration commands ──

/** Start calibration with selectable modes */
export function buildCalibrationCommand(opts = {}) {
  return { print: { sequence_id: nextSeq(), command: 'calibration',
    vibration: opts.vibration ? 1 : 0,
    bed_leveling: opts.bedLeveling ? 1 : 0,
    xcam_cali: opts.xcamCali ? 1 : 0,
    motor_noise: opts.motorNoise ? 1 : 0,
    nozzle_cali: opts.nozzleCali ? 1 : 0,
  }};
}

/** Pressure advance (PA) calibration */
export function buildPACalibrationCommand(mode = 0) {
  return { print: { sequence_id: nextSeq(), command: 'extrusion_cali', mode } };
}

/** Flow ratio calibration */
export function buildFlowCalibrationCommand(trayIndex, nozzleTemp, bedTemp, maxVolumetricSpeed) {
  return { print: { sequence_id: nextSeq(), command: 'flowrate_cali',
    tray_index: trayIndex || 0, nozzle_temp: nozzleTemp || 220,
    bed_temp: bedTemp || 60, max_volumetric_speed: maxVolumetricSpeed || 12,
  }};
}

// ── Camera commands ──

export function buildCameraRecordCommand(onOff) {
  return { system: { sequence_id: nextSeq(), command: 'ipcam_record_set', control: onOff ? 'enable' : 'disable' } };
}

export function buildCameraTimelapseCommand(onOff) {
  return { system: { sequence_id: nextSeq(), command: 'ipcam_timelapse', control: onOff ? 'enable' : 'disable' } };
}

export function buildCameraResolutionCommand(resolution) {
  return { system: { sequence_id: nextSeq(), command: 'ipcam_resolution_set', resolution: resolution || '1080p' } };
}

// ── AMS advanced commands ──

export function buildAmsChangeTrayCommand(amsId, slotId, oldTemp, newTemp) {
  return { print: { sequence_id: nextSeq(), command: 'ams_change_filament',
    target: amsId * 4 + slotId, old_temp: oldTemp || 220, new_temp: newTemp || 220,
  }};
}

export function buildAmsSettingsCommand(startReadOpt, trayReadOpt, remainFlag) {
  return { print: { sequence_id: nextSeq(), command: 'ams_user_setting',
    ams_user_setting: { startup_read_option: startReadOpt ? 1 : 0, tray_read_option: trayReadOpt ? 1 : 0, calibrate_remain_flag: remainFlag ? 1 : 0 }
  }};
}

export function buildAmsFilamentSettingCommand(amsId, slotId, trayColor, trayType, nozzleTempMin, nozzleTempMax) {
  return { print: { sequence_id: nextSeq(), command: 'ams_filament_setting',
    ams_id: amsId, tray_id: slotId, tray_color: trayColor || 'FFFFFFFF',
    tray_type: trayType || 'PLA', nozzle_temp_min: nozzleTempMin || 190, nozzle_temp_max: nozzleTempMax || 230,
  }};
}

export function buildAmsRefreshRfidCommand(trayId) {
  return { print: { sequence_id: nextSeq(), command: 'ams_control', param: 'resume', tray_id: trayId } };
}

export function buildAmsSelectTrayCommand(trayId) {
  return { print: { sequence_id: nextSeq(), command: 'ams_change_filament', target: trayId } };
}

// ── Nozzle/Extruder commands ──

export function buildSetNozzleCommand(nozzleType, diameter) {
  return { print: { sequence_id: nextSeq(), command: 'set_nozzle', nozzle_type: nozzleType || 'stainless_steel', nozzle_diameter: diameter || '0.4' } };
}

/** For multi-nozzle printers (H2D) */
export function buildSetNozzle2Command(nozzleId, nozzleType, diameter) {
  return { print: { sequence_id: nextSeq(), command: 'set_nozzle', nozzle_id: nozzleId, nozzle_type: nozzleType || 'stainless_steel', nozzle_diameter: diameter || '0.4' } };
}

export function buildSelectExtruderCommand(extruderId) {
  return { print: { sequence_id: nextSeq(), command: 'select_extruder', extruder_id: extruderId || 0 } };
}

export function buildSetBedTempCommand(temp) {
  return { print: { sequence_id: nextSeq(), command: 'gcode_line', param: `M140 S${temp || 0}` } };
}

export function buildSetNozzleTempCommand(temp) {
  return { print: { sequence_id: nextSeq(), command: 'gcode_line', param: `M104 S${temp || 0}` } };
}

// ── System commands ──

export function buildStopBuzzerCommand() {
  return { print: { sequence_id: nextSeq(), command: 'gcode_line', param: 'M20' } };
}

export function buildSetDoorCheckCommand(enabled) {
  return { print: { sequence_id: nextSeq(), command: 'set_door_open_check', state: enabled ? 1 : 0 } };
}

export function buildCleanPrintErrorCommand(taskId, printError) {
  return { print: { sequence_id: nextSeq(), command: 'clean_print_error', task_id: taskId || '', print_error: printError || 0 } };
}

export function buildSetAutoRecoveryCommand(enabled) {
  return { print: { sequence_id: nextSeq(), command: 'print_option', option: 'auto_recovery', value: enabled ? 1 : 0 } };
}

// ── Fan commands (v3 with air duct modes) ──

/** Fan IDs: 0=heat_break_0, 1=cooling_0, 2=remote_cooling_0, 3=chamber_0, 4=heat_break_1, 5=mc_board_0, 6=inner_loop_0 */
export function buildFanCommand(fanId, speed) {
  return { print: { sequence_id: nextSeq(), command: 'gcode_line', param: `M106 P${fanId} S${Math.round((speed / 100) * 255)}` } };
}

/** Air duct mode: 'cooling', 'heating', 'exhaust', 'full_cooling' */
export function buildAirDuctModeCommand(mode) {
  const modes = { cooling: 0, heating: 1, exhaust: 2, full_cooling: 3 };
  return { system: { sequence_id: nextSeq(), command: 'set_air_duct_mode', mode: modes[mode] ?? 0 } };
}

// ── HMS commands ──

export function buildHmsIgnoreCommand(hmsCode) {
  return { print: { sequence_id: nextSeq(), command: 'hms_idle_ignore', hms_code: hmsCode } };
}

// ── Firmware 01.02.00.00 new commands ──

/** Disable motors (stepper idle) — firmware 01.02.00.00+ */
export function buildDisableMotorsCommand() {
  return { print: { sequence_id: nextSeq(), command: 'disable_motors' } };
}

/** Set heatbed low-power mode — reduces peak power by extending heating time */
export function buildBedLowPowerModeCommand(enabled) {
  return { print: { sequence_id: nextSeq(), command: 'set_bed_heating_mode', mode: enabled ? 'low_power' : 'normal' } };
}

/** Manual filament change for multi-color via external spool — firmware 01.02.00.00+ */
export function buildManualFilamentChangeCommand(trayColor, trayType) {
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'ext_manual_change',
      tray_color: trayColor || '',
      tray_type: trayType || '',
    }
  };
}

/** Start drying while printing — firmware 01.02.00.00+ */
export function buildPrintWhileDryingCommand(amsId, tempC, durationMin, enabled) {
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'ams_control',
      param: enabled ? 'start' : 'stop',
      ams_id: parseInt(amsId) || 0,
      dry_temp: parseInt(tempC) || 55,
      dry_duration: parseInt(durationMin) || 240,
      while_printing: enabled ? 1 : 0,
    }
  };
}

/** Save timelapse to internal storage — firmware 01.02.00.00+ (no USB required) */
export function buildTimelapseStorageCommand(storageType) {
  // storageType: 'internal' | 'external' (USB)
  return {
    system: {
      sequence_id: nextSeq(),
      command: 'ipcam_timelapse_storage',
      storage: storageType === 'internal' ? 'internal' : 'external',
    }
  };
}

/** Delete a timelapse file from printer storage */
export function buildDeleteTimelapseCommand(filename, storage) {
  return {
    system: {
      sequence_id: nextSeq(),
      command: 'ipcam_timelapse_delete',
      filename: filename || '',
      storage: storage || 'internal',
    }
  };
}

export function buildHmsResumeCommand(hmsCode) {
  return { print: { sequence_id: nextSeq(), command: 'hms_idle_resume', hms_code: hmsCode } };
}

export function buildCommandFromClientMessage(msg) {
  switch (msg.action) {
    case 'pause': return buildPauseCommand();
    case 'resume': return buildResumeCommand();
    case 'stop': return buildStopCommand();
    case 'speed': return buildSpeedCommand(msg.value);
    case 'light': return buildLightCommand(msg.node || 'chamber_light', msg.mode || 'on');
    case 'gcode': return buildGcodeCommand(msg.gcode);
    case 'skip_objects': return msg.obj_list ? buildSkipObjectsCommand(msg.obj_list) : null;
    case 'print_file': return msg.filename ? buildPrintCommand(msg.filename, msg.plate_id) : null;
    case 'format_storage': return buildFormatStorageCommand();
    case 'ams_dry': return buildAmsDryCommand(msg.ams_id, msg.temp, msg.duration);
    case 'ams_stop_dry': return buildAmsStopDryCommand(msg.ams_id);
    case 'pushall': return buildPushAllCommand();
    // New commands
    case 'calibration': return buildCalibrationCommand(msg);
    case 'pa_calibration': return buildPACalibrationCommand(msg.mode);
    case 'flow_calibration': return buildFlowCalibrationCommand(msg.tray_index, msg.nozzle_temp, msg.bed_temp, msg.max_volumetric_speed);
    case 'camera_record': return buildCameraRecordCommand(msg.enable);
    case 'camera_timelapse': return buildCameraTimelapseCommand(msg.enable);
    case 'camera_resolution': return buildCameraResolutionCommand(msg.resolution);
    case 'ams_change_tray': return buildAmsChangeTrayCommand(msg.ams_id, msg.slot_id, msg.old_temp, msg.new_temp);
    case 'ams_settings': return buildAmsSettingsCommand(msg.startup_read, msg.tray_read, msg.remain_flag);
    case 'ams_filament_setting': return buildAmsFilamentSettingCommand(msg.ams_id, msg.slot_id, msg.tray_color, msg.tray_type, msg.nozzle_temp_min, msg.nozzle_temp_max);
    case 'ams_refresh_rfid': return buildAmsRefreshRfidCommand(msg.tray_id);
    case 'ams_select_tray': return buildAmsSelectTrayCommand(msg.tray_id);
    case 'set_nozzle': return buildSetNozzleCommand(msg.nozzle_type, msg.diameter);
    case 'set_nozzle2': return buildSetNozzle2Command(msg.nozzle_id, msg.nozzle_type, msg.diameter);
    case 'select_extruder': return buildSelectExtruderCommand(msg.extruder_id);
    case 'set_bed_temp': return buildSetBedTempCommand(msg.temp);
    case 'set_nozzle_temp': return buildSetNozzleTempCommand(msg.temp);
    case 'stop_buzzer': return buildStopBuzzerCommand();
    case 'set_door_check': return buildSetDoorCheckCommand(msg.enable);
    case 'clean_print_error': return buildCleanPrintErrorCommand(msg.task_id, msg.print_error);
    case 'set_auto_recovery': return buildSetAutoRecoveryCommand(msg.enable);
    case 'set_fan': return buildFanCommand(msg.fan_id, msg.speed);
    case 'set_air_duct_mode': return buildAirDuctModeCommand(msg.mode);
    case 'hms_ignore': return buildHmsIgnoreCommand(msg.hms_code);
    case 'hms_resume': return buildHmsResumeCommand(msg.hms_code);
    // Firmware 01.02.00.00 new commands
    case 'disable_motors': return buildDisableMotorsCommand();
    case 'bed_low_power': return buildBedLowPowerModeCommand(msg.enable);
    case 'manual_filament_change': return buildManualFilamentChangeCommand(msg.tray_color, msg.tray_type);
    case 'print_while_drying': return buildPrintWhileDryingCommand(msg.ams_id, msg.temp, msg.duration, msg.enable);
    case 'timelapse_storage': return buildTimelapseStorageCommand(msg.storage);
    case 'delete_timelapse': return buildDeleteTimelapseCommand(msg.filename, msg.storage);
    // 2025–2026 — chamber heater (X1E/H2D/H2S/H2C) and H2D granular xcam toggles
    case 'chamber_temp': return buildChamberTempCommand(msg.target);
    case 'xcam_control': return buildXcamControlCommand(msg.field, msg.enable);
    default: return null;
  }
}

/**
 * Toggle an individual xcam AI detector (H2D granular controls).
 * field values: clump_detector, airprint_detector, pileup_detector,
 * spaghetti_detector, first_layer_inspector, printing_monitor
 */
export function buildXcamControlCommand(field, enable) {
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'xcam_control_set',
      module_name: field,
      enable: !!enable,
    },
  };
}
