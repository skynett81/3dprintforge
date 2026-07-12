import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import type { Project, Part, AuthStatus } from './types';

// Generic read-only resource loader with light polling. `loader` must be a
// stable reference (e.g. an api.* method) so the effect doesn't re-fire.
export function useResource<T>(loader: () => Promise<T>, pollMs = 5000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    loader()
      .then((d) => { setData(d); setError(null); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [loader]);

  useEffect(() => {
    reload();
    if (!pollMs) return;
    const t = setInterval(reload, pollMs);
    return () => clearInterval(t);
  }, [reload, pollMs]);

  return { data, error, loading, reload };
}

// Current auth state (auth may be disabled server-side, in which case
// enabled=false and the app is fully usable without a login).
export function useAuth() {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  useEffect(() => {
    let alive = true;
    api.getAuthStatus().then((s) => { if (alive) setStatus(s); }).catch(() => { /* leave null */ });
    return () => { alive = false; };
  }, []);
  return status;
}

export type LiveState = Record<string, Record<string, unknown>>;

// Live per-printer state over the dashboard WebSocket (/ws). The server sends
// a full `init` snapshot then `status` deltas; we accumulate them per printer.
// Auto-reconnects on drop.
export function useLivePrinters() {
  const [live, setLive] = useState<LiveState>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (typeof WebSocket === 'undefined') return; // e.g. test env without WS
    let closed = false;
    let ws: WebSocket;
    let retry: ReturnType<typeof setTimeout>;

    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${proto}//${location.host}/ws`);
      ws.onopen = () => setConnected(true);
      ws.onclose = () => { setConnected(false); if (!closed) retry = setTimeout(connect, 2000); };
      ws.onerror = () => { try { ws.close(); } catch { /* ignore */ } };
      ws.onmessage = (ev) => {
        let m: { type?: string; data?: Record<string, unknown> };
        try { m = JSON.parse(String(ev.data)); } catch { return; }
        if (m.type === 'init' && m.data?.states) {
          const next: LiveState = {};
          for (const [id, st] of Object.entries(m.data.states as Record<string, { print?: Record<string, unknown> }>)) {
            next[id] = st?.print ?? {};
          }
          setLive(next);
        } else if (m.type === 'status' && m.data?.printer_id) {
          const id = String(m.data.printer_id);
          const delta = (m.data.print as Record<string, unknown>) ?? {};
          setLive((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...delta } }));
        }
      };
    };

    connect();
    return () => { closed = true; clearTimeout(retry); try { ws.close(); } catch { /* ignore */ } };
  }, []);

  return { live, connected };
}

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
