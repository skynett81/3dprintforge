import { useEffect, useState } from 'react';

/**
 * Best-effort live camera. The snapshot endpoint serves the latest stream
 * frame (available while the camera is streaming, e.g. during a print). Polls
 * on an interval, hides on error and retries so it recovers when the stream
 * starts. `fit` controls object-fit (cover for cards, contain for wall mode).
 */
export function CameraSnapshot({ printerId, aspect = '16 / 10', fit = 'cover', radius = 8 }: { printerId: string; aspect?: string; fit?: 'cover' | 'contain'; radius?: number }) {
  const [tick, setTick] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const poll = setInterval(() => setTick((x) => x + 1), 2000);
    const retry = setInterval(() => setFailed(false), 8000);
    return () => { clearInterval(poll); clearInterval(retry); };
  }, []);
  if (failed) return null;
  return (
    <img
      src={`/api/printers/${encodeURIComponent(printerId)}/camera?t=${tick}`}
      alt="live camera"
      onError={() => setFailed(true)}
      style={{ width: '100%', borderRadius: radius, aspectRatio: aspect, objectFit: fit, background: '#000' }}
    />
  );
}
