import { Suspense, lazy, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Printer, SlicerStatus, SliceResult } from '../types';
import type { PlateHandle } from '../components/PlateViewer';
import { SlicerSettings, type SliceSettings } from './slicer/SlicerSettings';

const PlateViewer = lazy(() => import('../components/PlateViewer').then((m) => ({ default: m.PlateViewer })));

type RowState = { status: 'slicing' | 'done' | 'error'; result?: SliceResult; error?: string };

/**
 * Slicer Studio (phase 1): upload a model and slice + send it to one or more
 * printers at once, using the server's slicer engine (OrcaSlicer / BambuStudio /
 * Snapmaker-Orca CLI). Plate arrangement and full print settings come later.
 */
export function SlicerPanel() {
  const t = useT();
  const toast = useToast();
  const { data: status } = useResource<SlicerStatus>(api.getSlicerStatus, 0);
  const { data: printersData } = useResource<Printer[]>(api.listPrinters, 30000);
  const printers = useMemo(() => printersData ?? [], [printersData]);
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState<SliceSettings>({});
  const plateRef = useRef<PlateHandle>(null);

  const formats = status?.supportedFormats ?? ['.stl', '.3mf', '.obj', '.step'];
  function toggle(id: string) { setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }

  async function run(startPrint: boolean) {
    if (!file) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    if (selected.size === 0) { toast(t('v2.slicer.pick_printer', 'Select at least one printer'), 'error'); return; }
    setBusy(true);
    const ids = [...selected];
    // Send the arranged plate (baked STL) when the 3D editor has it, else the raw file.
    const toSend = plateRef.current?.exportSTL(file.name) ?? file;
    setRows(Object.fromEntries(ids.map((id) => [id, { status: 'slicing' as const }])));
    await Promise.all(ids.map(async (id) => {
      try {
        const result = await api.sliceAndSend(id, toSend, { print: startPrint, settings });
        setRows((r) => ({ ...r, [id]: { status: 'done', result } }));
      } catch (e) {
        setRows((r) => ({ ...r, [id]: { status: 'error', error: (e as Error).message } }));
      }
    }));
    setBusy(false);
    const failed = Object.values(rows).filter((r) => r.status === 'error').length;
    toast(failed ? t('v2.slicer.partial', 'Slice & send finished with errors') : t('v2.slicer.done', 'Slice & send complete'), failed ? 'error' : 'success');
  }

  const canRun = !busy && !!file && selected.size > 0 && !!status?.available;

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.slicer.title', 'Slicer')}</h2>
          <p className="muted sub">{status?.available ? `${t('v2.slicer.engine', 'Engine')}: ${status.slicer}` : t('v2.slicer.none', 'No slicer engine detected')}</p>
        </div>
      </div>

      {status && !status.available && (
        <section className="card"><p className="muted empty-note">{t('v2.slicer.unavailable', 'No slicer engine is available on the server. Install OrcaSlicer / BambuStudio or the Snapmaker Orca CLI.')}</p></section>
      )}

      <section className="card" style={{ marginBottom: 14 }}>
        <div className="field-label">{t('v2.slicer.model', 'Model')}</div>
        <label className="slicer-drop">
          <input type="file" accept={formats.join(',')} hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file ? <span>{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</span> : <span className="muted">{t('v2.slicer.choose', 'Click to choose an STL / 3MF / OBJ / STEP file')}</span>}
        </label>
        {file && (
          <div style={{ marginTop: 12 }}>
            <Suspense fallback={<div className="plate-canvas" style={{ display: 'grid', placeItems: 'center' }}><span className="muted">{t('common.loading', 'Loading…')}</span></div>}>
              <PlateViewer ref={plateRef} file={file} />
            </Suspense>
          </div>
        )}
        <p className="muted micro" style={{ margin: '8px 0 0' }}>{t('v2.slicer.default_profile', 'Arrange on the plate, then slice with the printer’s default profile. Full print settings (layer height, infill, supports) arrive in a later phase.')}</p>
      </section>

      {file && <SlicerSettings value={settings} onChange={setSettings} status={status ?? undefined} />}

      <section className="card" style={{ marginBottom: 14 }}>
        <div className="field-label">{t('v2.slicer.printers', 'Send to printers')}</div>
        <p className="muted micro" style={{ margin: '2px 0 8px' }}>{t('v2.slicer.multi', 'Select one or more — they slice and receive in parallel.')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 8 }}>
          {printers.map((p) => {
            const rs = rows[p.id];
            return (
              <label key={p.id} className={`slicer-printer${selected.has(p.id) ? ' slicer-printer--on' : ''}`}>
                <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                <span className="ellipsis">{p.name || p.id}</span>
                {rs?.status === 'slicing' && <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.74rem' }}>{t('v2.slicer.slicing', 'slicing…')}</span>}
                {rs?.status === 'done' && <span className="hs-badge hs-badge-good" style={{ marginLeft: 'auto' }}>{rs.result?.printing ? t('v2.slicer.printing', 'printing') : t('v2.slicer.sent', 'sent')}</span>}
                {rs?.status === 'error' && <span className="hs-badge hs-badge-bad" style={{ marginLeft: 'auto' }} title={rs.error}>{t('v2.slicer.failed', 'failed')}</span>}
              </label>
            );
          })}
          {printers.length === 0 && <p className="muted empty-note">{t('v2.slicer.no_printers', 'No printers connected.')}</p>}
        </div>
      </section>

      <div className="drawer-controls">
        <button className="btn btn--primary" disabled={!canRun} onClick={() => run(false)}>{t('v2.slicer.slice_send', 'Slice & send')}</button>
        <button className="btn" disabled={!canRun} onClick={() => run(true)}>{t('v2.slicer.slice_print', 'Slice, send & start')}</button>
      </div>

      {Object.values(rows).some((r) => r.status === 'done' || r.status === 'error') && (
        <section className="card" style={{ marginTop: 14 }}>
          <div className="field-label">{t('v2.slicer.results', 'Results')}</div>
          <div className="err-list">
            {Object.entries(rows).map(([id, r]) => (
              <div className="err-row" key={id} style={{ gridTemplateColumns: '1fr 1.4fr auto' }}>
                <span className="err-msg" style={{ fontWeight: 600 }}>{printers.find((p) => p.id === id)?.name || id}</span>
                {r.status === 'done'
                  ? <span className="muted tnum">{r.result?.gcodeFilename} · {Math.round((r.result?.sliceDurationMs || 0) / 1000)}s · {((r.result?.sizeBytes || 0) / 1024 / 1024).toFixed(1)} MB</span>
                  : <span className="low">{r.error}</span>}
                <span className={`hs-badge hs-badge-${r.status === 'done' ? 'good' : r.status === 'error' ? 'bad' : 'neutral'}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
