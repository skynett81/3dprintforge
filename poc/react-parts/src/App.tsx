import { useMemo, useState } from 'react';
import { api } from './api';
import { useProjects, useParts } from './hooks';
import { ProjectPicker } from './components/ProjectPicker';
import { PartRow } from './components/PartRow';
import { AddPartForm } from './components/AddPartForm';
import type { NewPart, Part } from './types';

export function App() {
  const { projects, error: projErr } = useProjects();
  const [selected, setSelected] = useState<number | null>(null);
  const { parts, error: partsErr, reload } = useParts(selected);

  const summary = useMemo(() => ({
    total: parts.length,
    closed: parts.filter((p) => p.state === 'closed').length,
    target: parts.reduce((s, p) => s + p.target_qty, 0),
    done: parts.reduce((s, p) => s + p.completed_qty, 0),
  }), [parts]);

  async function addPart(body: NewPart) {
    if (selected == null) return;
    await api.addPart(selected, body);
    reload();
  }

  async function creditPart(part: Part) {
    await api.creditPart(part.id);
    reload();
  }

  async function deletePart(part: Part) {
    await api.deletePart(part.id);
    reload();
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Production <span className="tag">React PoC</span></h1>
        <p className="muted">
          The Projects/Parts panel rebuilt in React + TypeScript, talking to the live 3DPrintForge API.
        </p>
      </header>

      {projErr && <div className="error">Could not load projects: {projErr}</div>}

      <section className="card">
        <ProjectPicker projects={projects} selected={selected} onSelect={setSelected} />
      </section>

      {selected != null && (
        <section className="card">
          <div className="card-title">
            Parts
            {summary.total > 0 && (
              <span className="muted">
                {' '}— {summary.closed}/{summary.total} parts done, {summary.done}/{summary.target} units
              </span>
            )}
          </div>

          {partsErr && <div className="error">{partsErr}</div>}

          {parts.length === 0 ? (
            <p className="muted">No parts yet — add one to start tracking production.</p>
          ) : (
            <div className="part-list">
              {parts.map((p) => (
                <PartRow key={p.id} part={p} onCredit={creditPart} onDelete={deletePart} />
              ))}
            </div>
          )}

          <AddPartForm onAdd={addPart} />
        </section>
      )}
    </div>
  );
}
