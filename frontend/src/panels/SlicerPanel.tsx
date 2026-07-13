import { Suspense, lazy, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Printer, SlicerStatus, SliceResult, SlicerPrinter, Spool } from '../types';
import type { PlateHandle, ObjInfo, PlateState } from '../components/PlateViewer';
import type { SliceSettings } from './slicer/SlicerProcessTabs';
import { SlicerProcessTabs } from './slicer/SlicerProcessTabs';
import { ObjectPanel } from './slicer/ObjectPanel';
import { LibraryImportModal } from './slicer/LibraryImportModal';
import { IconAdd, IconDelete, IconArrange, IconMove, IconRotate, IconScale, IconLayFlat, IconDuplicate, IconCenter, IconPrinter, IconFilament, IconProcess } from './slicer/icons';

const PlateViewer = lazy(() => import('../components/PlateViewer').then((m) => ({ default: m.PlateViewer })));
const GcodePreview = lazy(() => import('../components/GcodePreview').then((m) => ({ default: m.GcodePreview })));

type RowState = { status: 'slicing' | 'done' | 'error'; result?: SliceResult; error?: string };
type Preview = { gcode: string; layers: number; timeSec: number; filamentG: number; durationMs: number };

const MATERIALS: Record<string, { temps: [number, number]; color: string }> = {
  PLA: { temps: [210, 60], color: '#37a66b' }, PETG: { temps: [240, 80], color: '#3d8bd8' },
  ABS: { temps: [250, 100], color: '#e0603a' }, ASA: { temps: [250, 100], color: '#e0a13a' },
  TPU: { temps: [230, 40], color: '#9b6ad8' }, PC: { temps: [270, 110], color: '#4bb3c4' },
  Nylon: { temps: [260, 80], color: '#c4b04b' },
};

function fmtTime(sec: number): string {
  if (!sec) return '—';
  const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

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
  const [settings, setSettings] = useState<SliceSettings>({ material: 'PLA', nozzle_temp: 210, bed_temp: 60 });
  const [tab, setTab] = useState<'prepare' | 'preview'>('prepare');
  const [side, setSide] = useState<'global' | 'objects'>('global');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [slicing, setSlicing] = useState(false);
  const [obj, setObj] = useState<ObjInfo | null>(null);
  const [toolState, setToolState] = useState<PlateState>({ count: 0, hasSel: false, mode: 'translate' });
  const [profilePrinter, setProfilePrinter] = useState<string>('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [presets, setPresets] = useState<Record<string, SliceSettings>>(() => { try { return JSON.parse(localStorage.getItem('v2.slicer.presets') || '{}'); } catch { return {}; } });
  const plateRef = useRef<PlateHandle>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const bed = useMemo(() => {
    const p = slicerPrinters.find((sp) => sp.id === profilePrinter) ?? slicerPrinters[0];
    return p?.buildVolume?.x ?? 256;
  }, [slicerPrinters, profilePrinter]);

  const pricePerGram = useMemo(() => {
    const mat = String((settings.material as string) || 'PLA').toUpperCase();
    const rows = spools.filter((s) => (s.material || '').toUpperCase() === mat && (s.cost ?? 0) > 0 && (s.initial_weight_g ?? 0) > 0).map((s) => (s.cost as number) / (s.initial_weight_g as number));
    return rows.length ? rows.reduce((a, b) => a + b, 0) / rows.length : 0;
  }, [spools, settings.material]);
  const cost = preview && pricePerGram > 0 ? preview.filamentG * pricePerGram : 0;

  const formats = status?.supportedFormats ?? ['.stl', '.3mf', '.obj', '.step'];
  const material = String((settings.material as string) || 'PLA');
  function toggle(id: string) { setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }

  function pickFile(f: File | null) { setFile(f); setPreview(null); setTab('prepare'); setRows({}); setObj(null); }
  async function addModels(files: FileList | null) {
    if (!files || !files.length) return;
    for (const f of Array.from(files)) { await plateRef.current?.addFile(f); }
    setPreview(null); setTab('prepare');
  }
  async function importFromLibrary(f: File) {
    if (!file) { pickFile(f); return; }
    await plateRef.current?.addFile(f); setPreview(null); setTab('prepare');
  }

  function applyMaterial(mat: string) {
    const m = MATERIALS[mat];
    setSettings((s) => ({ ...s, material: mat, ...(m ? { nozzle_temp: m.temps[0], bed_temp: m.temps[1] } : {}) }));
  }
  function applyQuality(id: string) {
    const p = status?.qualityPresets?.find((q) => q.id === id);
    if (!p) return;
    setSettings((s) => ({ ...s, quality: id, layer_height: p.layerHeight, infill_density: p.infill }));
  }
  function savePreset() {
    const name = window.prompt(t('v2.slset.preset_name', 'Preset name'))?.trim(); if (!name) return;
    const next = { ...presets, [name]: settings }; setPresets(next); localStorage.setItem('v2.slicer.presets', JSON.stringify(next));
  }

  async function slicePreview() {
    if (!file) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    setSlicing(true);
    try {
      const toSend = plateRef.current?.exportSTL(file.name) ?? file;
      const p = await api.sliceGcode(toSend, settings);
      setPreview(p); setTab('preview');
    } catch (e) { toast((e as Error).message || t('v2.slicer.slice_fail', 'Slicing failed'), 'error'); }
    finally { setSlicing(false); }
  }

  async function run(startPrint: boolean) {
    if (!file) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    if (selected.size === 0) { toast(t('v2.slicer.pick_printer', 'Select at least one printer'), 'error'); return; }
    setBusy(true);
    const ids = [...selected];
    const toSend = plateRef.current?.exportSTL(file.name) ?? file;
    setRows(Object.fromEntries(ids.map((id) => [id, { status: 'slicing' as const }])));
    const results = await Promise.all(ids.map(async (id): Promise<boolean> => {
      try { const result = await api.sliceAndSend(id, toSend, { print: startPrint, settings }); setRows((r) => ({ ...r, [id]: { status: 'done', result } })); return true; }
      catch (e) { setRows((r) => ({ ...r, [id]: { status: 'error', error: (e as Error).message } })); return false; }
    }));
    setBusy(false);
    const failed = results.filter((ok) => !ok).length;
    toast(failed ? t('v2.slicer.partial', 'Slice & send finished with errors') : t('v2.slicer.done', 'Slice & send complete'), failed ? 'error' : 'success');
  }

  const canRun = !busy && !!file && selected.size > 0;
  const tool = (m: PlateState['mode'], icon: ReactNode, label: string, needSel = false) => (
    <button className={`oslice-tool${toolState.mode === m ? ' oslice-tool--on' : ''}`} title={label} disabled={needSel && !toolState.hasSel} onClick={() => plateRef.current?.setMode(m)}>{icon}</button>
  );
  const action = (icon: ReactNode, label: string, fn: () => void, disabled = false) => (
    <button className="oslice-tool" title={label} disabled={disabled} onClick={fn}>{icon}</button>
  );

  return (
    <div className="oslice">
      {/* Top bar */}
      <div className="oslice-top">
        <div className="oslice-toptabs">
          <button className={`oslice-toptab${tab === 'prepare' ? ' oslice-toptab--on' : ''}`} onClick={() => setTab('prepare')}>{t('v2.slicer.prepare', 'Prepare')}</button>
          <button className={`oslice-toptab${tab === 'preview' ? ' oslice-toptab--on' : ''}`} disabled={!preview} onClick={() => preview && setTab('preview')}>{t('v2.slicer.preview', 'Preview')}</button>
        </div>
        <span className="oslice-brand">{status?.slicer ?? t('v2.slicer.native_name', '3DPrintForge native slicer')}</span>
      </div>

      <div className="oslice-body">
        {/* Left tool rail */}
        <div className="oslice-rail">
          {action(<IconAdd />, t('v2.slicer.add_model', 'Add model'), () => addInputRef.current?.click())}
          {action(<IconDuplicate />, t('v2.plate.dup', 'Duplicate'), () => plateRef.current?.duplicate(), !toolState.hasSel)}
          {action(<IconArrange />, t('v2.plate.arrange', 'Auto-arrange'), () => plateRef.current?.arrange(), toolState.count < 2)}
          {action(<IconDelete />, t('v2.plate.del', 'Delete'), () => plateRef.current?.remove(), !toolState.hasSel)}
          <span className="oslice-rail-sep" />
          {tool('translate', <IconMove />, t('v2.plate.move', 'Move'))}
          {tool('rotate', <IconRotate />, t('v2.plate.rotate', 'Rotate'))}
          {tool('scale', <IconScale />, t('v2.plate.scale', 'Scale'))}
          {action(<IconLayFlat />, t('v2.plate.flat', 'Lay flat'), () => plateRef.current?.layFlat(), !toolState.hasSel)}
          {action(<IconCenter />, t('v2.plate.center', 'Center'), () => plateRef.current?.center(), !toolState.hasSel)}
          <input ref={addInputRef} type="file" accept={formats.join(',')} multiple hidden onChange={(e) => { if (!file) pickFile(e.target.files?.[0] ?? null); else addModels(e.target.files); e.currentTarget.value = ''; }} />
        </div>

        {/* Viewport */}
        <div className="oslice-stage">
          {!file && (
            <label className="oslice-drop">
              <input type="file" accept={formats.join(',')} hidden onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
              <div style={{ textAlign: 'center' }}>
                <div className="oslice-drop-plus">+</div>
                <div>{t('v2.slicer.choose', 'Click to choose an STL / 3MF / OBJ / STEP file')}</div>
                <button type="button" className="btn btn--sm" style={{ marginTop: 12 }} onClick={(e) => { e.preventDefault(); setShowLibrary(true); }}>{t('v2.slicer.from_library', 'Import from library')}</button>
              </div>
            </label>
          )}
          {file && tab === 'prepare' && (
            <Suspense fallback={<div className="oslice-loading">{t('common.loading', 'Loading…')}</div>}>
              <PlateViewer ref={plateRef} file={file} bed={bed} onObject={setObj} onState={setToolState} />
            </Suspense>
          )}
          {file && tab === 'preview' && preview && (
            <Suspense fallback={<div className="oslice-loading">{t('common.loading', 'Loading…')}</div>}>
              <GcodePreview gcode={preview.gcode} bed={bed} />
            </Suspense>
          )}
        </div>

        {/* Right settings panel */}
        <aside className="oslice-panel">
          {/* Preset bar */}
          <div className="oslice-presets">
            <div className="oslice-preset">
              <span className="oslice-preset-ic"><IconPrinter /></span>
              <div className="oslice-preset-main">
                <span className="oslice-preset-lbl">{t('v2.slicer.printer', 'Printer')}</span>
                {slicerPrinters.length ? (
                  <select className="oslice-preset-sel" value={profilePrinter} onChange={(e) => setProfilePrinter(e.target.value)}>
                    {slicerPrinters.map((p) => <option key={p.id} value={p.id}>{p.name}{p.buildVolume ? ` (${p.buildVolume.x}×${p.buildVolume.y})` : ''}</option>)}
                  </select>
                ) : <span className="oslice-preset-sel">{t('v2.slicer.generic', 'Generic')}</span>}
              </div>
            </div>
            <div className="oslice-preset">
              <span className="oslice-preset-ic" style={{ color: MATERIALS[material]?.color }}><IconFilament /></span>
              <div className="oslice-preset-main">
                <span className="oslice-preset-lbl">{t('v2.slset.material', 'Filament')}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="oslice-chip" style={{ background: MATERIALS[material]?.color ?? '#888' }} />
                  <select className="oslice-preset-sel" value={material} onChange={(e) => applyMaterial(e.target.value)}>
                    {Object.keys(MATERIALS).map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="oslice-preset">
              <span className="oslice-preset-ic"><IconProcess /></span>
              <div className="oslice-preset-main">
                <span className="oslice-preset-lbl">{t('v2.slicer.process', 'Process')}</span>
                <select className="oslice-preset-sel" value={(settings.quality as string) ?? ''} onChange={(e) => applyQuality(e.target.value)}>
                  <option value="">{t('v2.slset.custom', 'Custom')}</option>
                  {(status?.qualityPresets ?? []).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="oslice-temps">
              <label className="oset-field"><span className="oset-label">{t('v2.slset.nozzle', 'Nozzle °C')}</span><input className="oset-input" type="number" value={(settings.nozzle_temp as number) ?? ''} onChange={(e) => setSettings((s) => ({ ...s, nozzle_temp: e.target.value }))} /></label>
              <label className="oset-field"><span className="oset-label">{t('v2.slset.bed', 'Bed °C')}</span><input className="oset-input" type="number" value={(settings.bed_temp as number) ?? ''} onChange={(e) => setSettings((s) => ({ ...s, bed_temp: e.target.value }))} /></label>
            </div>
          </div>

          {/* Global / Objects */}
          <div className="oslice-goTabs">
            <button className={`oslice-goTab${side === 'global' ? ' oslice-goTab--on' : ''}`} onClick={() => setSide('global')}>{t('v2.slicer.global', 'Global')}</button>
            <button className={`oslice-goTab${side === 'objects' ? ' oslice-goTab--on' : ''}`} onClick={() => setSide('objects')}>{t('v2.slicer.objects', 'Objects')}</button>
            <div className="oslice-presetctl">
              <select className="oset-input" style={{ maxWidth: 110 }} value="" onChange={(e) => { if (e.target.value && presets[e.target.value]) setSettings({ ...presets[e.target.value] }); }}>
                <option value="">{Object.keys(presets).length ? t('v2.slset.load_preset', 'Presets…') : t('v2.slset.none_saved', 'no presets')}</option>
                {Object.keys(presets).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <button className="btn btn--sm btn--ghost" onClick={savePreset}>{t('v2.slset.save', 'Save')}</button>
            </div>
          </div>

          <div className="oslice-panelbody">
            {side === 'global' && <SlicerProcessTabs value={settings} onChange={setSettings} />}
            {side === 'objects' && (obj
              ? <ObjectPanel info={obj} onPos={(x, y) => plateRef.current?.setPos(x, y)} onRot={(x, y, z) => plateRef.current?.setRot(x, y, z)} onScalePct={(p) => plateRef.current?.setScalePct(p)} onDim={(a, mm, u) => plateRef.current?.setDim(a, mm, u)} onMirror={(a) => plateRef.current?.mirror(a)} onReset={() => plateRef.current?.resetXform()} />
              : <p className="muted empty-note" style={{ padding: 16 }}>{t('v2.slicer.select_obj', 'Select an object on the plate to edit it.')}</p>)}
          </div>

          {/* Send targets */}
          <div className="oslice-printers">
            <div className="oslice-printers-lbl">{t('v2.slicer.printers', 'Send to')}</div>
            {printers.map((p) => {
              const rs = rows[p.id];
              return (
                <label key={p.id} className={`oslice-printer${selected.has(p.id) ? ' oslice-printer--on' : ''}`}>
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                  <span className="ellipsis">{p.name || p.id}</span>
                  {rs?.status === 'done' && <span className="hs-badge hs-badge-good" style={{ marginLeft: 'auto' }}>{rs.result?.printing ? t('v2.slicer.printing', 'printing') : t('v2.slicer.sent', 'sent')}</span>}
                  {rs?.status === 'error' && <span className="hs-badge hs-badge-bad" style={{ marginLeft: 'auto' }} title={rs.error}>{t('v2.slicer.failed', 'failed')}</span>}
                </label>
              );
            })}
            {printers.length === 0 && <p className="muted micro">{t('v2.slicer.no_printers', 'No printers connected.')}</p>}
          </div>
        </aside>
      </div>

      {/* Bottom bar */}
      <div className="oslice-bottom">
        <div className="oslice-est">
          {preview ? (
            <>
              <span><strong>{fmtTime(preview.timeSec)}</strong> {t('v2.slicer.time', 'time')}</span>
              <span><strong>{preview.filamentG ? `${preview.filamentG.toFixed(1)} g` : '—'}</strong></span>
              {cost > 0 && <span><strong>{cost.toFixed(1)} kr</strong></span>}
              <span><strong>{preview.layers}</strong> {t('v2.slicer.layers', 'layers')}</span>
            </>
          ) : <span className="muted micro">{t('v2.slicer.slice_hint', 'Slice to preview the toolpath and estimate time / filament.')}</span>}
        </div>
        <div className="oslice-actions">
          <button className="btn" disabled={!file || slicing} onClick={slicePreview}>{slicing ? t('v2.slicer.slicing', 'slicing…') : t('v2.slicer.slice_plate', 'Slice plate')}</button>
          <button className="oslice-print" disabled={!canRun} onClick={() => run(false)}>{t('v2.slicer.slice_send', 'Slice & send')}</button>
          <button className="btn" disabled={!canRun} onClick={() => run(true)}>{t('v2.slicer.slice_print', 'Send & start')}</button>
        </div>
      </div>

      {showLibrary && <LibraryImportModal onClose={() => setShowLibrary(false)} onImport={importFromLibrary} />}
    </div>
  );
}
