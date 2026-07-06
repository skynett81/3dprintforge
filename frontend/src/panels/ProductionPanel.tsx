import { useEffect, useState } from 'react';
import { api } from '../api';
import { useProjects, useParts } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { Overview } from '../components/Overview';
import { PartRow } from '../components/PartRow';
import { AddPartForm } from '../components/AddPartForm';
import { EditPartForm, type PartEdit } from '../components/EditPartForm';
import { CreateProject } from '../components/CreateProject';
import type { NewPart, Part } from '../types';

export function ProductionPanel() {
  const t = useT();
  const toast = useToast();
  const { projects, error: projErr, reload: reloadProjects } = useProjects();
  const [selected, setSelected] = useState<number | null>(null);
  const { parts, error: partsErr, reload } = useParts(selected);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (selected == null && projects.length > 0) setSelected(projects[0].id);
  }, [projects, selected]);

  const current = projects.find((p) => p.id === selected) || null;

  async function run(fn: () => Promise<void>, ok?: string) {
    try { await fn(); if (ok) toast(ok, 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  async function addPart(body: NewPart) {
    if (selected == null) return;
    await run(async () => { await api.addPart(selected, body); setAdding(false); reload(); }, t('v2.production.part_added', 'Part added'));
  }
  async function creditPart(part: Part) {
    await run(async () => { await api.creditPart(part.id); reload(); });
  }
  async function deletePart(part: Part) {
    if (!confirm(t('v2.production.confirm_delete', `Delete part "${part.name}"?`))) return;
    await run(async () => { await api.deletePart(part.id); reload(); }, t('v2.production.part_deleted', 'Part deleted'));
  }
  async function savePart(id: number, body: PartEdit) {
    await run(async () => { await api.updatePart(id, body); setEditingId(null); reload(); }, t('common.saved', 'Saved'));
  }
  async function createProject(name: string) {
    await run(async () => { const { id } = await api.createProject(name); reloadProjects(); setSelected(id); }, t('v2.production.project_created', 'Project created'));
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.production.title', 'Production')}</h2>
          <p className="muted sub">{t('v2.production.subtitle', 'Batch quantity tracking — plates credit parts, parts auto-close at target.')}</p>
        </div>
        {projects.length > 0 && (
          <label className="project-select">
            <span className="field-label">{t('v2.production.project', 'Project')}</span>
            <select className="input" value={selected ?? ''} onChange={(e) => setSelected(Number(e.target.value))}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        )}
      </div>

      {projErr && <div className="error">{t('v2.production.load_error', 'Could not load projects')}: {projErr}</div>}

      {projects.length === 0 && !projErr && (
        <section className="card empty-card">
          <h3>{t('v2.production.start_run', 'Start a production run')}</h3>
          <p className="muted">{t('v2.production.no_projects', 'No projects yet — create your first one to begin tracking parts.')}</p>
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
                {adding ? t('common.close', 'Close') : t('v2.production.add_part', '+ Add part')}
              </button>
            </div>
            {adding && <div className="add-wrap"><AddPartForm onAdd={addPart} /></div>}
            {partsErr && <div className="error">{partsErr}</div>}
            {parts.length === 0 ? (
              <p className="muted empty-note">{t('v2.production.no_parts', 'No parts yet — add one to start tracking production.')}</p>
            ) : (
              <div className="part-list">
                <div className="part-head">
                  <span>{t('v2.production.part', 'Part')}</span>
                  <span>{t('v2.production.progress', 'Progress')}</span>
                  <span>{t('v2.production.per_plate', 'Per plate')}</span>
                  <span></span>
                </div>
                {parts.map((p) => (
                  editingId === p.id
                    ? <EditPartForm key={p.id} part={p} onSave={savePart} onCancel={() => setEditingId(null)} />
                    : <PartRow key={p.id} part={p} onCredit={creditPart} onEdit={(pt) => setEditingId(pt.id)} onDelete={deletePart} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
