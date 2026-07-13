import { useState } from 'react';
import { api } from '../../api';
import { useT } from '../../i18n';
import { useToast } from '../../toast';

interface CalResult { name: string; description: string; gcode: string; expected_minutes: number; filament_g: number; type: string }

interface Props {
  /** Load the generated calibration g-code into the Preview tab. */
  onPreview?: (r: { gcode: string; timeSec: number; filamentG: number }) => void;
}

// The seven built-in calibration generators, with friendly labels + blurbs.
const CALS: { id: string; label: string; desc: string }[] = [
  { id: 'temp-tower', label: 'Temperature tower', desc: 'Find the best nozzle temperature — each block a few °C apart.' },
  { id: 'flow-test', label: 'Flow rate', desc: 'Dial in the flow/extrusion multiplier from a set of patches.' },
  { id: 'pressure-advance', label: 'Pressure advance (tower)', desc: 'Sweep pressure advance / linear advance up a tower.' },
  { id: 'pressure-advance-pattern', label: 'Pressure advance (pattern)', desc: 'PA line pattern for picking the sharpest corners.' },
  { id: 'retract-tower', label: 'Retraction tower', desc: 'Find the retraction length that removes stringing.' },
  { id: 'first-layer', label: 'First layer', desc: 'A first-layer patch to tune Z-offset / squish.' },
  { id: 'single-line', label: 'Speed test', desc: 'Single-line speed sweep to find the max clean speed.' },
];

/** Calibration tab: generate the standard calibration test prints (like
 *  BambuStudio's Calibration tab), preview the toolpath and download the
 *  g-code. Uses the existing /api/calibration generator. */
export function SlicerCalibration({ onPreview }: Props) {
  const t = useT();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<CalResult | null>(null);

  async function gen(id: string) {
    setBusy(id);
    try {
      const r = await api.generateCalibration(id, {});
      setResult(r);
      onPreview?.({ gcode: r.gcode, timeSec: Math.round((r.expected_minutes || 0) * 60), filamentG: r.filament_g || 0 });
      toast(t('v2.cal.generated', 'Generated — see Preview'), 'success');
    } catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(null); }
  }

  function download() {
    if (!result) return;
    const blob = new Blob([result.gcode], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${result.type}.gcode`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="oslice-calwrap">
      <div className="oslice-calhead">
        <h3>{t('v2.cal.title', 'Calibration')}</h3>
        <span className="muted micro">{t('v2.cal.sub', 'Generate a calibration test, preview it, then print it')}</span>
      </div>
      <div className="oslice-calgrid">
        {CALS.map((c) => (
          <div key={c.id} className={`oslice-calcard${result?.type === c.id ? ' oslice-calcard--on' : ''}`}>
            <div className="oslice-calcard-h">{t(`v2.cal.${c.id}`, c.label)}</div>
            <div className="oslice-calcard-d">{c.desc}</div>
            <button className="btn btn--sm" disabled={!!busy} onClick={() => gen(c.id)}>
              {busy === c.id ? t('v2.cal.generating', 'Generating…') : t('v2.cal.generate', 'Generate')}
            </button>
          </div>
        ))}
      </div>
      {result && (
        <div className="oslice-calresult">
          <div>
            <strong>{result.name}</strong>
            <div className="muted micro">{result.description}</div>
            <div className="micro" style={{ marginTop: 4 }}>~{Math.round(result.expected_minutes)} min · {result.filament_g?.toFixed(1)} g</div>
          </div>
          <button className="btn btn--sm btn--ghost" onClick={download}>{t('v2.cal.download', 'Download .gcode')}</button>
        </div>
      )}
    </div>
  );
}
