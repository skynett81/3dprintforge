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

export function buildPrintCommand(filename, plateId = 1) {
  const subtaskName = filename.split('/').pop().replace(/\.[^.]+$/, '');
  return {
    print: {
      sequence_id: nextSeq(),
      command: 'project_file',
      param: `Metadata/plate_${plateId}.gcode`,
      subtask_name: subtaskName,
      url: `ftp://${filename}`,
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

/** Start AMS tørking — sender tørkeparametre via MQTT. */
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

/** Stopp AMS tørking. */
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

/** Hent MQTT debug-melding (pushall for full state dump). */
export function buildPushAllCommand() {
  return { pushing: { sequence_id: nextSeq(), command: 'pushall' } };
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
    default: return null;
  }
}
