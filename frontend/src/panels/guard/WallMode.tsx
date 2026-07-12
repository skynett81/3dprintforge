import { useEffect } from 'react';
import { CameraSnapshot } from './CameraSnapshot';
import { useT } from '../../i18n';

export interface WallTile {
  id: string;
  name: string;
  printing: boolean;
  progress?: number | null;
  file?: string | null;
  nozzle?: number | null;
  bed?: number | null;
  state: { text: string; cls: string };
  alerts: number;
}

/**
 * Fullscreen "everything OK" camera wall for a print farm. Shows every
 * printer as a large tile with live camera, status badge and progress —
 * built to be glanceable from across the room. Esc closes it.
 */
export function WallMode({ tiles, onClose }: { tiles: WallTile[]; onClose: () => void }) {
  const t = useT();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const alerts = tiles.filter((x) => x.alerts > 0).length;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0b0d0f', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', color: '#fff' }}>
        <strong style={{ fontSize: '1.1rem' }}>{t('v2.guard.wall_title', 'Print Wall')}</strong>
        <span className={`hs-badge hs-badge-${alerts > 0 ? 'bad' : 'good'}`}>
          {alerts > 0 ? `${alerts} ${t('v2.guard.wall_alerts', 'need attention')}` : t('v2.guard.wall_ok', 'All clear')}
        </span>
        <span style={{ marginLeft: 'auto', color: '#9aa' }}>{tiles.length} {t('v2.guard.printers', 'printers')}</span>
        <button className="btn btn--sm" onClick={onClose}>{t('v2.guard.wall_exit', 'Exit (Esc)')}</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16, alignContent: 'start' }}>
        {tiles.map((x) => (
          <div key={x.id} style={{ background: '#15181c', borderRadius: 12, overflow: 'hidden', border: x.alerts > 0 ? '2px solid #e03131' : '1px solid #23272c' }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 10', background: '#000' }}>
              {x.printing
                ? <CameraSnapshot printerId={x.id} radius={0} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#556' }}>{t('v2.guard.wall_idle', 'Idle')}</div>}
              {x.progress != null && x.printing && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: 'rgba(255,255,255,0.15)' }}>
                  <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, x.progress))}%`, background: '#37b24d' }} />
                </div>
              )}
            </div>
            <div style={{ padding: '8px 12px', color: '#e6e8ea' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: '1rem' }}>{x.name}</strong>
                <span className={`hs-badge hs-badge-${x.state.cls}`} style={{ marginLeft: 'auto' }}>{x.state.text}</span>
              </div>
              {x.printing && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4, fontSize: '0.8rem', color: '#9aa' }}>
                  {x.progress != null && <span>{Math.round(x.progress)}%</span>}
                  {x.nozzle != null && <span>{t('v2.guard.nozzle', 'Nozzle')} {Math.round(x.nozzle)}°</span>}
                  {x.bed != null && <span>{t('v2.guard.bed', 'Bed')} {Math.round(x.bed)}°</span>}
                  {x.file && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }} title={x.file}>{x.file}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
