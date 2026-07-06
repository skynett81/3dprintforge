import { useState } from 'react';
import { useT } from '../i18n';
import type { Part } from '../types';

export interface PartEdit {
  name: string;
  target_qty: number;
  parts_per_plate: number;
  completed_qty: number;
}

interface Props {
  part: Part;
  onSave: (id: number, body: PartEdit) => void;
  onCancel: () => void;
}

export function EditPartForm({ part, onSave, onCancel }: Props) {
  const t = useT();
  const [name, setName] = useState(part.name);
  const [target, setTarget] = useState(part.target_qty);
  const [perPlate, setPerPlate] = useState(part.parts_per_plate);
  const [done, setDone] = useState(part.completed_qty);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(part.id, {
      name: trimmed,
      target_qty: Math.max(1, target),
      parts_per_plate: Math.max(1, perPlate),
      completed_qty: Math.max(0, done),
    });
  }

  return (
    <form className="edit-row" onSubmit={submit}>
      <label className="field grow">
        <span className="field-label">{t('v2.production.part_name', 'Part name')}</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </label>
      <label className="field">
        <span className="field-label">{t('v2.production.target', 'Target')}</span>
        <input className="input" type="number" min={1} value={target} onChange={(e) => setTarget(Number(e.target.value) || 1)} />
      </label>
      <label className="field">
        <span className="field-label">{t('v2.production.per_plate', 'Per plate')}</span>
        <input className="input" type="number" min={1} value={perPlate} onChange={(e) => setPerPlate(Number(e.target.value) || 1)} />
      </label>
      <label className="field">
        <span className="field-label">{t('v2.production.completed', 'Completed')}</span>
        <input className="input" type="number" min={0} value={done} onChange={(e) => setDone(Number(e.target.value) || 0)} />
      </label>
      <div className="edit-actions">
        <button className="btn btn--sm btn--primary" type="submit">{t('common.save', 'Save')}</button>
        <button className="btn btn--sm" type="button" onClick={onCancel}>{t('common.cancel', 'Cancel')}</button>
      </div>
    </form>
  );
}
