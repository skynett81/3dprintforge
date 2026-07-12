import { useEffect, useRef, useState } from 'react';
import type { ProtectionEvent } from '../../types';

export type NotifyPermission = 'default' | 'granted' | 'denied' | 'unsupported';

function currentPermission(): NotifyPermission {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission as NotifyPermission;
}

// Short WebAudio beep — no asset needed, works offline.
function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.12;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.3);
    osc.onended = () => ctx.close().catch(() => {});
  } catch { /* audio not available */ }
}

/**
 * Fires a browser notification + sound whenever a new unresolved protection
 * event appears. Returns the permission state and a request() helper so the
 * panel can offer an opt-in button (Notification permission needs a gesture).
 */
export function useAlertNotifications(events: ProtectionEvent[], enabled: boolean) {
  const [permission, setPermission] = useState<NotifyPermission>(currentPermission);
  const seen = useRef<Set<number> | null>(null);

  async function request(): Promise<NotifyPermission> {
    if (typeof Notification === 'undefined') return 'unsupported';
    try {
      const p = (await Notification.requestPermission()) as NotifyPermission;
      setPermission(p);
      return p;
    } catch { return permission; }
  }

  useEffect(() => {
    // Seed the seen-set on first run so we don't alert for the backlog.
    if (seen.current === null) {
      seen.current = new Set(events.map((e) => e.id));
      return;
    }
    if (!enabled) { seen.current = new Set(events.map((e) => e.id)); return; }
    const fresh = events.filter((e) => !e.resolved && !seen.current!.has(e.id));
    for (const e of events) seen.current.add(e.id);
    if (fresh.length === 0) return;
    beep();
    if (permission === 'granted' && typeof Notification !== 'undefined') {
      for (const e of fresh.slice(0, 3)) {
        const title = e.event_type.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
        try {
          new Notification(`Print Guard: ${title}`, {
            body: `${e.printer_id}${e.action_taken ? ` — ${e.action_taken}` : ''}`,
            tag: `guard-${e.id}`,
          });
        } catch { /* notification failed */ }
      }
    }
  }, [events, enabled, permission]);

  return { permission, request };
}
