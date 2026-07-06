// Immutable toggle for a Set-based multi-selection.
export function toggle<T>(set: Set<T>, id: T): Set<T> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
}
