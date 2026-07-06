import { useState } from 'react';
import type { NewPart } from '../types';

interface Props {
  onAdd: (part: NewPart) => void;
}

export function AddPartForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState(1);
  const [perPlate, setPerPlate] = useState(1);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ name: trimmed, target_qty: target, parts_per_plate: perPlate });
    setName('');
    setTarget(1);
    setPerPlate(1);
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <label className="field grow">
        <span className="field-label">Part name</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chassis" />
      </label>
      <label className="field">
        <span className="field-label">Target</span>
        <input className="input" type="number" min={1} value={target} onChange={(e) => setTarget(Number(e.target.value) || 1)} />
      </label>
      <label className="field">
        <span className="field-label">Per plate</span>
        <input className="input" type="number" min={1} value={perPlate} onChange={(e) => setPerPlate(Number(e.target.value) || 1)} />
      </label>
      <button className="btn btn--primary" type="submit">Add part</button>
    </form>
  );
}
