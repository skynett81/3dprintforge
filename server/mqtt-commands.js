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
    default: return null;
  }
}
