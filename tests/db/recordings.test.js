// recordings.test.js — camera video recording records (CRUD + lifecycle).

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb } from '../test-helper.js';
import {
  addRecording, finalizeRecording, getRecordings, getRecording,
  deleteRecording, markStaleRecordingsFailed,
} from '../../server/db/recordings.js';

describe('Camera recordings', () => {
  before(() => setupTestDb());

  it('creates a recording in the "recording" state', () => {
    setupTestDb();
    const id = addRecording({ printer_id: '3dsky', filename: '3dsky_x.mp4' });
    const r = getRecording(id);
    assert.equal(r.printer_id, '3dsky');
    assert.equal(r.filename, '3dsky_x.mp4');
    assert.equal(r.status, 'recording');
    assert.equal(r.ended_at, null);
  });

  it('finalises with duration + size and marks done', () => {
    setupTestDb();
    const id = addRecording({ printer_id: '3dsky', filename: 'a.mp4' });
    const r = finalizeRecording(id, { duration_s: 42, size_bytes: 1024000, status: 'done' });
    assert.equal(r.status, 'done');
    assert.equal(r.duration_s, 42);
    assert.equal(r.size_bytes, 1024000);
    assert.ok(r.ended_at);
  });

  it('lists newest first and filters by printer + status', () => {
    setupTestDb();
    addRecording({ printer_id: 'a', filename: 'a1.mp4' });
    const b = addRecording({ printer_id: 'b', filename: 'b1.mp4' });
    finalizeRecording(b, { duration_s: 10, size_bytes: 100, status: 'done' });
    assert.equal(getRecordings().length, 3 - 1); // 2 created here
    assert.equal(getRecordings({ printer_id: 'b' }).length, 1);
    assert.equal(getRecordings({ status: 'done' }).length, 1);
  });

  it('delete returns the row so the file can be unlinked', () => {
    setupTestDb();
    const id = addRecording({ printer_id: 'a', filename: 'gone.mp4' });
    const row = deleteRecording(id);
    assert.equal(row.filename, 'gone.mp4');
    assert.equal(getRecording(id), null);
  });

  it('markStaleRecordingsFailed flips interrupted recordings to failed', () => {
    setupTestDb();
    addRecording({ printer_id: 'a', filename: 'stuck1.mp4' });
    addRecording({ printer_id: 'a', filename: 'stuck2.mp4' });
    const done = addRecording({ printer_id: 'a', filename: 'ok.mp4' });
    finalizeRecording(done, { duration_s: 5, size_bytes: 50, status: 'done' });
    const changed = markStaleRecordingsFailed();
    assert.equal(changed, 2);
    assert.equal(getRecordings({ status: 'recording' }).length, 0);
    assert.equal(getRecordings({ status: 'failed' }).length, 2);
  });
});
