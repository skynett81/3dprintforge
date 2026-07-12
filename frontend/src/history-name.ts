import type { CloudTask, HistoryRow } from './types';

// Match a print to a Bambu cloud task (by title / design title) — the source
// of the real design name (and a colour cover). Shared by the history list and
// the detail view so names are consistent.
export function matchCloud(filename: string | undefined, tasks: CloudTask[]): CloudTask | null {
  if (!filename) return null;
  const fn = filename.toLowerCase().trim();
  return tasks.find((t) => {
    const tt = (t.title || '').toLowerCase().trim();
    const dt = (t.designTitle || '').toLowerCase().trim();
    return (tt.length > 3 && (tt === fn || fn.includes(tt) || tt.includes(fn)))
      || (dt.length > 3 && (dt === fn || fn.includes(dt) || dt.includes(fn)));
  }) ?? null;
}

// Best display name: cloud design title, then model_name, then the filename
// without extension (print_history.filename is often a slicer profile string).
export function displayName(row: Pick<HistoryRow, 'filename' | 'model_name'>, tasks: CloudTask[]): string {
  const cloud = matchCloud(row.filename, tasks);
  const cloudTitle = cloud?.designTitle && cloud.designTitle !== cloud.title ? cloud.designTitle : null;
  return cloudTitle || row.model_name || (row.filename || '').replace(/\.(3mf|gcode)$/i, '') || 'Untitled print';
}

// Normalise the /api/bambu-cloud/tasks response (array or {tasks:[]}).
export function cloudTasksOf(data: unknown): CloudTask[] {
  if (Array.isArray(data)) return data as CloudTask[];
  if (data && typeof data === 'object' && Array.isArray((data as { tasks?: unknown }).tasks)) {
    return (data as { tasks: CloudTask[] }).tasks;
  }
  return [];
}
