import { useT } from '../i18n';
import type { Part } from '../types';

interface Props {
  part: Part;
  onCredit: (part: Part) => void;
  onEdit: (part: Part) => void;
  onDelete: (part: Part) => void;
}

export function PartRow({ part, onCredit, onEdit, onDelete }: Props) {
  const t = useT();
  const pct = part.target_qty > 0
    ? Math.min(100, Math.round((part.completed_qty / part.target_qty) * 100))
    : 0;
  const closed = part.state === 'closed';

  return (
    <div className={`part-row${closed ? ' part-row--closed' : ''}`}>
      <div className="part-name">
        <span className={`dot ${closed ? 'dot--done' : 'dot--open'}`} />
        {part.name}
        {closed && <span className="badge badge--done">{t('v2.production.done', 'done')}</span>}
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
        <button className="btn btn--sm" onClick={() => onCredit(part)} title={t('v2.production.credit_plate_hint', 'Record a finished plate')}>
          {t('v2.production.plate', '+ plate')}
        </button>
        <button className="btn btn--sm btn--ghost-quiet" onClick={() => onEdit(part)} title={t('common.edit', 'Edit')}>✎</button>
        <button className="btn btn--sm btn--ghost" onClick={() => onDelete(part)} title={t('common.delete', 'Delete')}>✕</button>
      </div>
    </div>
  );
}
