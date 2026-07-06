// project-parts.test.js — Production model on Projects: parts with a target
// quantity produced in plates, credited per finished plate, auto-closing on
// completion (overshoot allowed — never half a plate).

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  addProject,
  getProjectWithDetails,
  getProjectParts,
  getProjectPart,
  addProjectPart,
  updateProjectPart,
  deleteProjectPart,
  creditProjectPart,
} from '../../server/db/projects.js';

describe('Project parts (production model)', () => {
  let projectId;

  before(() => {
    setupTestDb();
    projectId = addProject({ name: 'XRP Kit Run' });
  });

  it('addProjectPart creates an open part with defaults', () => {
    const id = addProjectPart({ project_id: projectId, name: 'Chassis', target_qty: 1000, parts_per_plate: 10 });
    const part = getProjectPart(id);
    assert.equal(part.name, 'Chassis');
    assert.equal(part.target_qty, 1000);
    assert.equal(part.parts_per_plate, 10);
    assert.equal(part.completed_qty, 0);
    assert.equal(part.state, 'open');
  });

  it('getProjectParts lists a project’s parts', () => {
    addProjectPart({ project_id: projectId, name: 'Lid', target_qty: 50 });
    const parts = getProjectParts(projectId);
    assert.ok(parts.length >= 2);
    assert.ok(parts.every(p => p.project_id === projectId));
  });

  it('creditProjectPart adds a plate worth and stays open below target', () => {
    const id = addProjectPart({ project_id: projectId, name: 'Bracket', target_qty: 100, parts_per_plate: 10 });
    const part = creditProjectPart(id, 10);
    assert.equal(part.completed_qty, 10);
    assert.equal(part.state, 'open');
  });

  it('auto-closes when the target is reached, allowing overshoot', () => {
    // target 1000, plate of 10: at 995 completed, one final plate lands 1005
    const id = addProjectPart({ project_id: projectId, name: 'Overshoot', target_qty: 1000, parts_per_plate: 10 });
    updateProjectPart(id, { completed_qty: 995 });
    const part = creditProjectPart(id, 10);
    assert.equal(part.completed_qty, 1005);
    assert.equal(part.state, 'closed'); // 1005 >= 1000
  });

  it('credit defaults to parts_per_plate when qty omitted', () => {
    const id = addProjectPart({ project_id: projectId, name: 'DefaultCredit', target_qty: 30, parts_per_plate: 5 });
    const part = creditProjectPart(id);
    assert.equal(part.completed_qty, 5);
  });

  it('raising the target on a closed part reopens it', () => {
    const id = addProjectPart({ project_id: projectId, name: 'Reopen', target_qty: 10, parts_per_plate: 10 });
    creditProjectPart(id, 10); // -> closed
    assert.equal(getProjectPart(id).state, 'closed');
    updateProjectPart(id, { target_qty: 50 });
    assert.equal(getProjectPart(id).state, 'open');
  });

  it('getProjectWithDetails includes parts and a rollup summary', () => {
    const details = getProjectWithDetails(projectId);
    assert.ok(Array.isArray(details.parts), 'parts array present');
    assert.ok(details.parts_summary, 'summary present');
    assert.equal(typeof details.parts_summary.total, 'number');
    assert.equal(typeof details.parts_summary.closed, 'number');
  });

  it('deleteProjectPart removes it', () => {
    const id = addProjectPart({ project_id: projectId, name: 'Temp', target_qty: 1 });
    deleteProjectPart(id);
    assert.equal(getProjectPart(id), undefined);
  });
});
