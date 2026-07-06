import type { Part } from '../types';

interface Props {
  parts: Part[];
}

// A production KPI strip + overall progress, derived from the parts.
export function Overview({ parts }: Props) {
  const totalParts = parts.length;
  const closed = parts.filter((p) => p.state === 'closed').length;
  const open = totalParts - closed;
  const unitsDone = parts.reduce((s, p) => s + p.completed_qty, 0);
  const unitsTarget = parts.reduce((s, p) => s + p.target_qty, 0);
  const pct = unitsTarget > 0 ? Math.min(100, Math.round((unitsDone / unitsTarget) * 100)) : 0;

  return (
    <div className="overview">
      <div className="kpis">
        <Kpi label="Parts complete" value={`${closed}/${totalParts}`} />
        <Kpi label="In progress" value={String(open)} accent="blue" />
        <Kpi label="Units produced" value={unitsDone.toLocaleString()} sub={`of ${unitsTarget.toLocaleString()}`} />
        <Kpi label="Overall" value={`${pct}%`} accent={pct >= 100 ? 'green' : 'teal'} />
      </div>
      <div className="overall-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="overall-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: 'teal' | 'blue' | 'green' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>
        {value}
        {sub && <span className="kpi-sub"> {sub}</span>}
      </div>
    </div>
  );
}
