import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import type { Project, Part } from './types';

// Load the active projects once.
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    api
      .listActiveProjects()
      .then((p) => { setProjects(p); setError(null); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);
  return { projects, error, loading, reload };
}

// Load a project's parts, with light polling so auto-credit from finished
// prints shows up live without a manual refresh.
export function useParts(projectId: number | null, pollMs = 4000) {
  const [parts, setParts] = useState<Part[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (projectId == null) { setParts([]); return; }
    api
      .getParts(projectId)
      .then((p) => { setParts(p); setError(null); })
      .catch((e: Error) => setError(e.message));
  }, [projectId]);

  useEffect(() => {
    reload();
    if (projectId == null) return;
    const t = setInterval(reload, pollMs);
    return () => clearInterval(t);
  }, [reload, projectId, pollMs]);

  return { parts, error, reload };
}
