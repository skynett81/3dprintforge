import { useMemo, useState } from 'react';
import { useT } from '../../i18n';

const rgb = (h: string) => { const x = String(h).replace(/^#/, ''); return [parseInt(x.slice(0, 2), 16) || 0, parseInt(x.slice(2, 4), 16) || 0, parseInt(x.slice(4, 6), 16) || 0]; };
const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Auto purge volume (mm3) going from colour `from` to colour `to`, the way a
 *  slicer estimates it: identical colours need nothing, and switching to a
 *  lighter colour needs the most flushing to avoid bleed. */
export function autoFlush(from: string, to: string): number {
  if (from.toLowerCase() === to.toLowerCase()) return 0;
  const [r1, g1, b1] = rgb(from), [r2, g2, b2] = rgb(to);
  const dist = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2) / 441; // 0..1
  const lighten = Math.max(0, (lum(r2, g2, b2) - lum(r1, g1, b1)) / 255);
  const MIN = 80, RANGE = 720;
  return Math.round(MIN + dist * RANGE * 0.55 + lighten * RANGE * 0.55);
}

export function buildFlushMatrix(colors: string[]): number[][] {
  return colors.map((from) => colors.map((to) => autoFlush(from, to)));
}

interface Props {
  colors: string[];
  matrix: number[][] | null;
  onChange: (m: number[][]) => void;
  onClose: () => void;
}

/** BambuStudio-style purging-volumes matrix: flush volume (mm3) for every
 *  colour transition. Auto-filled from the slot colours, editable per cell.
 *  With flush-into-infill on, this purge is deposited into the new colour's
 *  infill — waste minimised, no bleed. */
export function SlicerPurge({ colors, matrix, onChange, onClose }: Props) {
  const t = useT();
  const [m, setM] = useState<number[][]>(() => matrix ?? buildFlushMatrix(colors));
  const total = useMemo(() => m.reduce((a, row) => a + row.reduce((b, v) => b + (v || 0), 0), 0), [m]);

  const setCell = (i: number, j: number, v: number) => {
    const next = m.map((row) => row.slice());
    next[i][j] = Number.isFinite(v) ? Math.max(0, v) : 0;
    setM(next);
  };
  const auto = () => setM(buildFlushMatrix(colors));
  const apply = () => { onChange(m); onClose(); };

  return (
    <div className="oslice-modal-backdrop" onClick={onClose}>
      <div className="oslice-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="oslice-modal-h">{t('v2.purge.title', 'Purging volumes')}<button className="oslice-modal-x" onClick={onClose}>×</button></div>
        <p className="muted micro" style={{ margin: '0 0 8px' }}>{t('v2.purge.hint', 'Flush volume (mm³) per colour change. With flush-into-infill on, this is deposited into the new colour’s infill — no waste tower.')}</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="oslice-purge-tbl">
            <thead>
              <tr>
                <th className="muted micro">{t('v2.purge.fromto', 'from \\ to')}</th>
                {colors.map((c, j) => <th key={j}><span className="oslice-purge-sw" style={{ background: c }} />{j + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              {colors.map((c, i) => (
                <tr key={i}>
                  <th><span className="oslice-purge-sw" style={{ background: c }} />{i + 1}</th>
                  {colors.map((_, j) => (
                    <td key={j}>
                      {i === j ? <span className="muted">—</span> : (
                        <input type="number" className="oslice-purge-cell" value={m[i]?.[j] ?? 0} onChange={(e) => setCell(i, j, Number(e.target.value))} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="oslice-modal-foot">
          <span className="muted micro">{t('v2.purge.total', 'Total per full cycle')}: {Math.round(total)} mm³</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button className="btn btn--sm btn--ghost" onClick={auto}>{t('v2.purge.auto', 'Auto')}</button>
            <button className="btn btn--sm" onClick={apply}>{t('v2.purge.apply', 'Apply')}</button>
          </span>
        </div>
      </div>
    </div>
  );
}
