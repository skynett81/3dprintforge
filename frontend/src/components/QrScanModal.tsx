import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';

// BarcodeDetector is Chromium-only; gate the whole feature on it + a camera.
export const QR_SCAN_SUPPORTED = typeof window !== 'undefined' && 'BarcodeDetector' in window && !!navigator.mediaDevices?.getUserMedia;

/**
 * Live camera QR scanner for inventory labels. Reads a code (or the /qr/<code>
 * URL a phone label encodes), resolves it to a part/stock/location and
 * navigates there.
 */
export function QrScanModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const toast = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;
    const Detector = (window as unknown as { BarcodeDetector: new (o: { formats: string[] }) => { detect: (v: unknown) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
    const detector = new Detector({ formats: ['qr_code'] });
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (stopped) { stream.getTracks().forEach((tr) => tr.stop()); return; }
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {}); }
        const tick = async () => {
          if (stopped || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length) {
              stopped = true;
              try {
                const r = await api.resolveQr(codes[0].rawValue);
                window.location.hash = r.hash;
                toast(r.name, 'success');
              } catch { toast(t('v2.qr.no_match', 'No matching item for that code'), 'error'); }
              onClose();
              return;
            }
          } catch { /* detect can throw between frames — keep polling */ }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (e) { setErr((e as Error).message); }
    })();
    return () => { stopped = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((tr) => tr.stop()); };
  }, [onClose, toast, t]);

  return (
    <div className="cmd-backdrop" onMouseDown={onClose}>
      <div className="qr-scan" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="qr-scan-head">
          <strong>{t('v2.qr.scan', 'Scan a QR label')}</strong>
          <button className="btn btn--sm btn--ghost" onClick={onClose} aria-label={t('common.close', 'Close')}>✕</button>
        </div>
        {err
          ? <p className="muted" style={{ padding: 16 }}>{err}</p>
          : <video ref={videoRef} className="qr-scan-video" muted playsInline />}
        <p className="muted micro" style={{ padding: '0 14px 12px', margin: 0 }}>{t('v2.qr.point', 'Point the camera at a part or bin label.')}</p>
      </div>
    </div>
  );
}
