import { useState } from 'react';

interface Props {
  onCreate: (name: string) => void;
}

// Small convenience so the PoC is testable end-to-end without switching to
// the main app when there are no projects yet.
export function CreateProject({ onCreate }: Props) {
  const [name, setName] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <label className="field grow">
        <span className="field-label">New project name</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="XRP Kit Run" />
      </label>
      <button className="btn btn--primary" type="submit">Create project</button>
    </form>
  );
}
