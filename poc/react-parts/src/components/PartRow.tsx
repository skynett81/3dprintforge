import type { Part } from '../types';

interface Props {
  part: Part;
  onCredit: (part: Part) => void;
  onDelete: (part: Part) => void;
}

export function PartRow({ part, onCredit, onDelete }: Props) {
  const pct = part.target_qty > 0
    ? Math.min(100, Math.round((part.completed_qty / part.target_qty) * 100))
    : 0;
  const closed = part.state === 'closed';

  return (
    <div className={`part-row${closed ? ' part-row--closed' : ''}`}>
      <div className="part-name">
        <span className={`dot ${closed ? 'dot--done' : 'dot--open'}`} />
        {part.name}
        {closed && <span className="badge badge--done">done</span>}
      </div>
      <div className="part-progress">
        <div className="bar">
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="count">{part.completed_qty.toLocaleString()}/{part.target_qty.toLocaleString()}</span>
        <span className="pct">{pct}%</span>
      </div>
      <div className="per-plate">{part.parts_per_plate}</div>
      <div className="part-actions">
        <button className="btn btn--sm" onClick={() => onCredit(part)} title="Record a finished plate">+ plate</button>
        <button className="btn btn--sm btn--ghost" onClick={() => onDelete(part)} title="Delete part">✕</button>
      </div>
    </div>
  );
}
