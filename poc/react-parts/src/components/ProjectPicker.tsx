import type { Project } from '../types';

interface Props {
  projects: Project[];
  selected: number | null;
  onSelect: (id: number) => void;
}

export function ProjectPicker({ projects, selected, onSelect }: Props) {
  if (projects.length === 0) {
    return <p className="muted">No active projects. Create one in the main app first.</p>;
  }
  return (
    <label className="field">
      <span className="field-label">Project</span>
      <select
        className="input"
        value={selected ?? ''}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        <option value="" disabled>Pick a project…</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </label>
  );
}
