// Defensive readers over the live WebSocket state. Field names differ by
// brand (Bambu at root, Moonraker nested) but the hub flattens the common
// ones onto `.print`; we read them best-effort and tolerate missing values.

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return typeof n === 'number' && !Number.isNaN(n) ? n : null;
}

export interface LivePrinter {
  gcodeState: string | null;
  progress: number | null; // 0..100
  remainingMin: number | null;
  nozzle: number | null;
  bed: number | null;
  chamber: number | null;
  file: string | null;
}

export function readLive(st: Record<string, unknown> | undefined): LivePrinter {
  const s = st ?? {};
  const g = (s.gcode_state ?? s.state) as string | undefined;
  const file = (s.subtask_name ?? s.gcode_file ?? s.filename) as string | undefined;
  return {
    gcodeState: g ? String(g) : null,
    progress: num(s.mc_percent),
    remainingMin: num(s.mc_remaining_time),
    nozzle: num(s.nozzle_temper),
    bed: num(s.bed_temper),
    chamber: num(s.chamber_temper),
    file: file ? String(file) : null,
  };
}

export function isPrinting(l: LivePrinter): boolean {
  const g = (l.gcodeState || '').toUpperCase();
  if (g === 'RUNNING' || g === 'PRINTING') return true;
  return l.progress != null && l.progress > 0 && l.progress < 100 && g !== 'IDLE' && g !== 'FINISH';
}
