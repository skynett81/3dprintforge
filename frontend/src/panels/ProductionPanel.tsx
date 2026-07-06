import { useEffect, useState } from 'react';
import { api } from '../api';
import { useProjects, useParts } from '../hooks';
import { Overview } from '../components/Overview';
import { PartRow } from '../components/PartRow';
import { AddPartForm } from '../components/AddPartForm';
import { CreateProject } from '../components/CreateProject';
import type { NewPart, Part } from '../types';

export function ProductionPanel() {
  const { projects, error: projErr, reload: reloadProjects } = useProjects();
  const [selected, setSelected] = useState<number | null>(null);
  const { parts, error: partsErr, reload } = useParts(selected);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (selected == null && projects.length > 0) setSelected(projects[0].id);
  }, [projects, selected]);

  const current = projects.find((p) => p.id === selected) || null;

  async function addPart(body: NewPart) {
    if (selected == null) return;
    await api.addPart(selected, body);
    setAdding(false);
    reload();
  }
  async function creditPart(part: Part) { await api.creditPart(part.id); reload(); }
  async function deletePart(part: Part) { await api.deletePart(part.id); reload(); }
  async function createProject(name: string) {
    const { id } = await api.createProject(name);
    reloadProjects();
    setSelected(id);
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Production</h2>
          <p className="muted sub">Batch quantity tracking — plates credit parts, parts auto-close at target.</p>
        </div>
        {projects.length > 0 && (
          <label className="project-select">
            <span className="field-label">Project</span>
            <select className="input" value={selected ?? ''} onChange={(e) => setSelected(Number(e.target.value))}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        )}
      </div>

      {projErr && <div className="error">Could not load projects: {projErr}</div>}

      {projects.length === 0 && !projErr && (
        <section className="card empty-card">
          <h3>Start a production run</h3>
          <p className="muted">No projects yet — create your first one to begin tracking parts.</p>
          <CreateProject onCreate={createProject} />
        </section>
      )}

      {current && (
        <>
          <Overview parts={parts} />
          <section className="card">
            <div className="card-head">
              <div className="card-title">{current.name}</div>
              <button className="btn btn--primary" onClick={() => setAdding((v) => !v)}>
                {adding ? 'Close' : '+ Add part'}
              </button>
            </div>
            {adding && <div className="add-wrap"><AddPartForm onAdd={addPart} /></div>}
            {partsErr && <div className="error">{partsErr}</div>}
            {parts.length === 0 ? (
              <p className="muted empty-note">No parts yet — add one to start tracking production.</p>
            ) : (
              <div className="part-list">
                <div className="part-head"><span>Part</span><span>Progress</span><span>Per plate</span><span></span></div>
                {parts.map((p) => <PartRow key={p.id} part={p} onCredit={creditPart} onDelete={deletePart} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
