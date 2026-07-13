import { Suspense, lazy, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Printer, SlicerStatus, SliceResult, SlicerPrinter, Spool } from '../types';
import type { PlateHandle, ObjInfo } from '../components/PlateViewer';
import { SlicerSettings, type SliceSettings } from './slicer/SlicerSettings';
import { ObjectPanel } from './slicer/ObjectPanel';

const PlateViewer = lazy(() => import('../components/PlateViewer').then((m) => ({ default: m.PlateViewer })));
const GcodePreview = lazy(() => import('../components/GcodePreview').then((m) => ({ default: m.GcodePreview })));

type RowState = { status: 'slicing' | 'done' | 'error'; result?: SliceResult; error?: string };
type Preview = { gcode: string; layers: number; timeSec: number; filamentG: number; durationMs: number };

function fmtTime(sec: number): string {
  if (!sec) return '—';
  const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Slicer — a fully integrated web slicer built on the project's own engine.
 * Prepare the plate, tune settings, preview the toolpath layer-by-layer, then
 * slice and send to one or more printers at once. No external slicer binary.
 */
export function SlicerPanel() {
  const t = useT();
  const toast = useToast();
  const { data: status } = useResource<SlicerStatus>(api.getSlicerStatus, 0);
  const { data: printersData } = useResource<Printer[]>(api.listPrinters, 30000);
  const { data: slicerPrintersData } = useResource<SlicerPrinter[]>(api.getSlicerPrinters, 60000);
  const { data: spoolsData } = useResource<Spool[]>(api.listSpools, 60000);
  const printers = useMemo(() => printersData ?? [], [printersData]);
  const slicerPrinters = useMemo(() => slicerPrintersData ?? [], [slicerPrintersData]);
  const spools = useMemo(() => spoolsData ?? [], [spoolsData]);
  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState<SliceSettings>({});
  const [tab, setTab] = useState<'prepare' | 'preview'>('prepare');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [slicing, setSlicing] = useState(false);
  const [obj, setObj] = useState<ObjInfo | null>(null);
  const [profilePrinter, setProfilePrinter] = useState<string>('');
  const [extraModels, setExtraModels] = useState<string[]>([]);
  const plateRef = useRef<PlateHandle>(null);

  // Bed size from the chosen slice-profile printer (falls back to 256).
  const bed = useMemo(() => {
    const p = slicerPrinters.find((sp) => sp.id === profilePrinter) ?? slicerPrinters[0];
    return p?.buildVolume?.x ?? 256;
  }, [slicerPrinters, profilePrinter]);

  // Filament cost = grams × average price/gram for the chosen material.
  const pricePerGram = useMemo(() => {
    const mat = String((settings.material as string) || 'PLA').toUpperCase();
    const rows = spools
      .filter((s) => (s.material || '').toUpperCase() === mat && (s.cost ?? 0) > 0 && (s.initial_weight_g ?? 0) > 0)
      .map((s) => (s.cost as number) / (s.initial_weight_g as number));
    if (!rows.length) return 0;
    return rows.reduce((a, b) => a + b, 0) / rows.length;
  }, [spools, settings.material]);
  const cost = preview && pricePerGram > 0 ? preview.filamentG * pricePerGram : 0;

  const formats = status?.supportedFormats ?? ['.stl', '.3mf', '.obj', '.step'];
  function toggle(id: string) { setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }

  function pickFile(f: File | null) {
    setFile(f);
    setPreview(null);
    setTab('prepare');
    setRows({});
    setObj(null);
    setExtraModels([]);
  }

  async function addModels(files: FileList | null) {
    if (!files || !files.length) return;
    for (const f of Array.from(files)) {
      await plateRef.current?.addFile(f);
      setExtraModels((prev) => [...prev, f.name]);
    }
    setPreview(null);
    setTab('prepare');
  }

  // Slice for preview only (no printer). Uses the arranged plate.
  async function slicePreview() {
    if (!file) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    setSlicing(true);
    try {
      const toSend = plateRef.current?.exportSTL(file.name) ?? file;
      const p = await api.sliceGcode(toSend, settings);
      setPreview(p);
      setTab('preview');
    } catch (e) {
      toast((e as Error).message || t('v2.slicer.slice_fail', 'Slicing failed'), 'error');
    } finally {
      setSlicing(false);
    }
  }

  async function run(startPrint: boolean) {
    if (!file) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    if (selected.size === 0) { toast(t('v2.slicer.pick_printer', 'Select at least one printer'), 'error'); return; }
    setBusy(true);
    const ids = [...selected];
    const toSend = plateRef.current?.exportSTL(file.name) ?? file;
    setRows(Object.fromEntries(ids.map((id) => [id, { status: 'slicing' as const }])));
    const results = await Promise.all(ids.map(async (id): Promise<boolean> => {
      try {
        const result = await api.sliceAndSend(id, toSend, { print: startPrint, settings });
        setRows((r) => ({ ...r, [id]: { status: 'done', result } }));
        return true;
      } catch (e) {
        setRows((r) => ({ ...r, [id]: { status: 'error', error: (e as Error).message } }));
        return false;
      }
    }));
    setBusy(false);
    const failed = results.filter((ok) => !ok).length;
    toast(failed ? t('v2.slicer.partial', 'Slice & send finished with errors') : t('v2.slicer.done', 'Slice & send complete'), failed ? 'error' : 'success');
  }

  const canRun = !busy && !!file && selected.size > 0;
  const est = preview;

  return (
    <div className="slicer-app">
      <div className="slicer-main">
        {/* Viewport */}
        <div className="slicer-viewport">
          <div className="slicer-tabs">
            <button className={`slicer-tab${tab === 'prepare' ? ' slicer-tab--on' : ''}`} onClick={() => setTab('prepare')}>{t('v2.slicer.prepare', 'Prepare')}</button>
            <button className={`slicer-tab${tab === 'preview' ? ' slicer-tab--on' : ''}`} disabled={!preview} onClick={() => preview && setTab('preview')}>{t('v2.slicer.preview', 'Preview')}</button>
            <span className="slicer-engine-pill" title={t('v2.slicer.native_note', 'Slices on the built-in engine — no external slicer required')}>
              {t('v2.slicer.native_name', '3DPrintForge native slicer')}
            </span>
          </div>

          <div className="slicer-stage">
            {!file && (
              <label className="slicer-drop slicer-drop--stage">
                <input type="file" accept={formats.join(',')} hidden onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', opacity: 0.5 }}>+</div>
                  <div className="muted">{t('v2.slicer.choose', 'Click to choose an STL / 3MF / OBJ / STEP file')}</div>
                </div>
              </label>
            )}
            {file && tab === 'prepare' && (
              <Suspense fallback={<div className="slicer-loading muted">{t('common.loading', 'Loading…')}</div>}>
                <PlateViewer ref={plateRef} file={file} bed={bed} onObject={setObj} />
              </Suspense>
            )}
            {file && tab === 'preview' && preview && (
              <Suspense fallback={<div className="slicer-loading muted">{t('common.loading', 'Loading…')}</div>}>
                <GcodePreview gcode={preview.gcode} bed={bed} />
              </Suspense>
            )}
          </div>
        </div>

        {/* Settings sidebar */}
        <aside className="slicer-sidebar">
          <section className="card slicer-card">
            <div className="field-label">{t('v2.slicer.model', 'Model')}</div>
            <label className="slicer-drop">
              <input type="file" accept={formats.join(',')} hidden onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
              {file ? <span className="ellipsis">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</span> : <span className="muted">{t('v2.slicer.choose_short', 'Choose model…')}</span>}
            </label>
            {file && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <label className="btn btn--sm btn--ghost" style={{ cursor: 'pointer' }}>
                  <input type="file" accept={formats.join(',')} multiple hidden onChange={(e) => { addModels(e.target.files); e.currentTarget.value = ''; }} />
                  + {t('v2.slicer.add_model', 'Add model')}
                </label>
                {extraModels.length > 0 && <span className="muted micro">{extraModels.length} {t('v2.slicer.added', 'added')}</span>}
              </div>
            )}
            {slicerPrinters.length > 0 && (
              <label className="field" style={{ marginTop: 10 }}>
                <span className="field-label">{t('v2.slicer.profile_printer', 'Printer (bed & profile)')}</span>
                <select className="input" value={profilePrinter} onChange={(e) => setProfilePrinter(e.target.value)}>
                  {slicerPrinters.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.buildVolume ? ` · ${p.buildVolume.x}×${p.buildVolume.y}×${p.buildVolume.z}mm` : ''}</option>
                  ))}
                </select>
              </label>
            )}
          </section>

          {file && tab === 'prepare' && obj && (
            <ObjectPanel
              info={obj}
              onPos={(x, y) => plateRef.current?.setPos(x, y)}
              onRot={(x, y, z) => plateRef.current?.setRot(x, y, z)}
              onScalePct={(p) => plateRef.current?.setScalePct(p)}
              onDim={(axis, mm, uniform) => plateRef.current?.setDim(axis, mm, uniform)}
              onMirror={(axis) => plateRef.current?.mirror(axis)}
              onReset={() => plateRef.current?.resetXform()}
            />
          )}

          <SlicerSettings value={settings} onChange={setSettings} status={status ?? undefined} />

          <section className="card slicer-card">
            <div className="field-label">{t('v2.slicer.printers', 'Send to printers')}</div>
            <p className="muted micro" style={{ margin: '2px 0 8px' }}>{t('v2.slicer.multi', 'Select one or more — they slice and receive in parallel.')}</p>
            <div className="slicer-printer-grid">
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
        </aside>
      </div>

      {/* Bottom action bar */}
      <div className="slicer-actionbar">
        <div className="slicer-estimate">
          {est ? (
            <>
              <span title={t('v2.slicer.est_time', 'Estimated print time')}><strong>{fmtTime(est.timeSec)}</strong> {t('v2.slicer.time', 'time')}</span>
              <span title={t('v2.slicer.est_filament', 'Estimated filament')}><strong>{est.filamentG ? `${est.filamentG.toFixed(1)} g` : '—'}</strong> {t('v2.slicer.filament', 'filament')}</span>
              {cost > 0 && <span title={t('v2.slicer.est_cost', 'Estimated material cost from your spool prices')}><strong>{cost.toFixed(1)} kr</strong> {t('v2.slicer.cost', 'cost')}</span>}
              <span><strong>{est.layers}</strong> {t('v2.slicer.layers', 'layers')}</span>
              <span className="muted micro">{t('v2.slicer.sliced_in', 'sliced in')} {(est.durationMs / 1000).toFixed(1)}s</span>
            </>
          ) : (
            <span className="muted micro">{t('v2.slicer.slice_hint', 'Slice to preview the toolpath and estimate time / filament.')}</span>
          )}
        </div>
        <div className="slicer-actions">
          <button className="btn" disabled={!file || slicing} onClick={slicePreview}>{slicing ? t('v2.slicer.slicing', 'slicing…') : t('v2.slicer.slice_preview', 'Slice (preview)')}</button>
          <button className="btn btn--primary" disabled={!canRun} onClick={() => run(false)}>{t('v2.slicer.slice_send', 'Slice & send')}</button>
          <button className="btn" disabled={!canRun} onClick={() => run(true)}>{t('v2.slicer.slice_print', 'Slice, send & start')}</button>
        </div>
      </div>
    </div>
  );
}
