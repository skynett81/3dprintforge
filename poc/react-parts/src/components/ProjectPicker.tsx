import type { Project } from '../types';

interface Props {
  projects: Project[];
  selected: number | null;
  onSelect: (id: number) => void;
}

export function ProjectPicker({ projects, selected, onSelect }: Props) {
  // Empty state is handled by the App (it shows a create form instead).
  if (projects.length === 0) return null;
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
