import { Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import { IconAdd, IconDelete, IconArrange, IconMove, IconRotate, IconScale, IconLayFlat, IconDuplicate, IconCenter, IconProcess, IconExpand, IconCollapse } from './slicer/icons';

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
const DEFAULT_SLOT_COLORS = ['#000000', '#0080FF', '#E53935', '#43A047', '#FDD835', '#FB8C00', '#8E24AA', '#00ACC1'];

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
  const [settings, setSettings] = useState<SliceSettings>({
    material: 'PLA', nozzle_temp: 210, bed_temp: 60,
    layer_height: 0.2, initial_layer_height: 0.24, wall_loops: 2, top_layers: 4, bottom_layers: 4,
    infill_density: 15, infill_pattern: 'grid', infill_direction: 45, skirt_loops: 1, skirt_distance: 3, elephant_foot: 0,
    outer_wall_speed: 120, inner_wall_speed: 150, sparse_infill_speed: 180, internal_solid_infill_speed: 140,
    support_speed: 80, initial_layer_speed: 30, ironing_speed: 20, travel_speed: 250, seam_position: 'aligned',
    line_width: 0.42, outer_wall_line_width: 0.42, inner_wall_line_width: 0.45, sparse_infill_line_width: 0.45,
    initial_layer_line_width: 0.5, retraction_length: 0.8, z_hop: 0,
    flush_into_infill: true, flush_volume: 80,
  });
  const [tab, setTab] = useState<'prepare' | 'preview'>('prepare');
  const [side, setSide] = useState<'global' | 'objects'>('global');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [slicing, setSlicing] = useState(false);
  const [obj, setObj] = useState<ObjInfo | null>(null);
  const [objOverrides, setObjOverrides] = useState<Record<number, SliceSettings>>({});
  const [filaments, setFilaments] = useState<{ color: string; material: string }[]>([{ color: '#000000', material: 'PLA' }]);
  const [toolState, setToolState] = useState<PlateState>({ count: 0, hasSel: false, mode: 'translate', names: [], selIndex: -1 });
  const [full, setFull] = useState(false);
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
  const slotColors = useMemo(() => filaments.map((f) => f.color), [filaments]);
  useEffect(() => { plateRef.current?.recolor(slotColors); }, [slotColors]);

  function setSlot(i: number, patch: Partial<{ color: string; material: string }>) {
    setFilaments((prev) => {
      const next = prev.map((f, k) => (k === i ? { ...f, ...patch } : f));
      if (i === 0 && patch.material) { const m = MATERIALS[patch.material]; setSettings((s) => ({ ...s, material: patch.material!, ...(m ? { nozzle_temp: m.temps[0], bed_temp: m.temps[1] } : {}) })); }
      return next;
    });
  }
  function addSlot() { setFilaments((prev) => (prev.length >= 16 ? prev : [...prev, { color: DEFAULT_SLOT_COLORS[prev.length % DEFAULT_SLOT_COLORS.length], material: prev[0]?.material ?? 'PLA' }])); }
  function removeSlot(i: number) { setFilaments((prev) => (prev.length <= 1 ? prev : prev.filter((_, k) => k !== i))); }
  function toggle(id: string) { setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }

  function pickFile(f: File | null) { setFile(f); setPreview(null); setTab('prepare'); setRows({}); setObj(null); setObjOverrides({}); }
  async function addModels(files: FileList | null) {
    if (!files || !files.length) return;
    for (const f of Array.from(files)) { await plateRef.current?.addFile(f); }
    setPreview(null); setTab('prepare');
  }
  async function importFromLibrary(f: File) {
    if (!file) { pickFile(f); return; }
    await plateRef.current?.addFile(f); setPreview(null); setTab('prepare');
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
    const multi = plateRef.current?.hasMaterials() ?? false;
    const materials = multi ? (plateRef.current?.exportMaterials(file.name) ?? []) : [];
    const usePerObject = !multi && Object.keys(objOverrides).length > 0 && toolState.count > 0;
    const perObj = usePerObject ? (plateRef.current?.exportEach(file.name) ?? []) : [];
    const toSend = plateRef.current?.exportSTL(file.name) ?? file;
    setRows(Object.fromEntries(ids.map((id) => [id, { status: 'slicing' as const }])));
    const results = await Promise.all(ids.map(async (id): Promise<boolean> => {
      try {
        const result = multi && materials.length > 1
          ? await api.sliceMultiAndSend(id, file.name, materials, { print: startPrint, settings })
          : perObj.length
            ? await api.sliceObjectsAndSend(id, file.name, perObj.map((o) => ({ file: o.file, settings: { ...settings, ...(objOverrides[o.index] ?? {}) } })), { print: startPrint, settings })
            : await api.sliceAndSend(id, toSend, { print: startPrint, settings });
        setRows((r) => ({ ...r, [id]: { status: 'done', result } })); return true;
      }
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

  const selPrinter = slicerPrinters.find((p) => p.id === profilePrinter) ?? slicerPrinters[0];

  return (
    <div className={`oslice${full ? ' oslice--full' : ''}`}>
      {/* Top bar (dark) — tabs left, Slice/Print plate right */}
      <div className="oslice-top">
        <span className="oslice-logo">3DPrintForge <span>Slicer</span></span>
        <div className="oslice-toptabs">
          <button className={`oslice-toptab${tab === 'prepare' ? ' oslice-toptab--on' : ''}`} onClick={() => setTab('prepare')}>{t('v2.slicer.prepare', 'Prepare')}</button>
          <button className={`oslice-toptab${tab === 'preview' ? ' oslice-toptab--on' : ''}`} disabled={!preview} onClick={() => preview && setTab('preview')}>{t('v2.slicer.preview', 'Preview')}</button>
        </div>
        <div className="oslice-topright">
          {preview && (
            <span className="oslice-topest">
              <span><strong>{fmtTime(preview.timeSec)}</strong></span>
              <span><strong>{preview.filamentG ? `${preview.filamentG.toFixed(1)}g` : '—'}</strong></span>
              {cost > 0 && <span><strong>{cost.toFixed(1)} kr</strong></span>}
            </span>
          )}
          <button className="oslice-sliceplate" disabled={!file || slicing} onClick={slicePreview}>{slicing ? t('v2.slicer.slicing', 'Slicing…') : t('v2.slicer.slice_plate', 'Slice plate')}</button>
          <button className="oslice-printplate" disabled={!canRun} title={t('v2.slicer.printplate_hint', 'Slice and send to the selected printer(s)')} onClick={() => run(false)}>{t('v2.slicer.print_plate', 'Print plate')}</button>
          <button className="oslice-fullbtn" title={full ? t('v2.slicer.exit_full', 'Exit fullscreen') : t('v2.slicer.fullscreen', 'Fullscreen')} onClick={() => setFull((f) => !f)}>{full ? <IconCollapse /> : <IconExpand />}</button>
        </div>
      </div>

      <div className="oslice-body">
        {/* LEFT — settings panel (white) */}
        <aside className="oslice-panel">
          {/* Printer card with image */}
          <div className="oslice-printercard">
            {selPrinter?.model
              ? <img className="oslice-printerimg" src={`/api/printer-image/${encodeURIComponent(selPrinter.model)}`} alt="" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }} />
              : <span className="oslice-printerimg" />}
            <div className="oslice-printersel">
              <div className="oslice-sectlbl">{t('v2.slicer.printer', 'Printer')}</div>
              {slicerPrinters.length ? (
                <select className="oslice-preset-sel" value={profilePrinter} onChange={(e) => setProfilePrinter(e.target.value)}>
                  {slicerPrinters.map((p) => <option key={p.id} value={p.id}>{p.name}{p.buildVolume ? ` (${p.buildVolume.x}×${p.buildVolume.y})` : ''}</option>)}
                </select>
              ) : <div className="oslice-preset-sel">{t('v2.slicer.generic', 'Generic 256×256')}</div>}
            </div>
          </div>

          {/* Filament + temps */}
          <div className="oslice-filaments">
            <div className="oslice-sectlbl" style={{ marginBottom: 6, display: 'flex', alignItems: 'center' }}>
              {t('v2.slset.filament', 'Filament / AMS')}
              <button className="oslice-filadd" title={t('v2.slset.add_filament', 'Add filament')} onClick={addSlot} style={{ marginLeft: 'auto' }}>+</button>
            </div>
            {filaments.map((f, i) => (
              <div className="oslice-filrow" key={i}>
                <label className="oslice-filbadge" style={{ background: f.color, cursor: 'pointer' }}>
                  {i + 1}
                  <input type="color" value={f.color} onChange={(e) => setSlot(i, { color: e.target.value })} style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} />
                </label>
                <select className="oslice-preset-sel oslice-filname" value={f.material} onChange={(e) => setSlot(i, { material: e.target.value })}>
                  {Object.keys(MATERIALS).map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {filaments.length > 1 && <button className="oslice-filadd" title={t('v2.slset.remove', 'Remove')} onClick={() => removeSlot(i)}>−</button>}
              </div>
            ))}
            <div className="oslice-temps" style={{ marginTop: 8 }}>
              <label className="oset-field"><span className="oslice-sectlbl">{t('v2.slset.nozzle', 'Nozzle °C')}</span><input className="oset-input" type="number" value={(settings.nozzle_temp as number) ?? ''} onChange={(e) => setSettings((s) => ({ ...s, nozzle_temp: e.target.value }))} /></label>
              <label className="oset-field"><span className="oslice-sectlbl">{t('v2.slset.bed', 'Bed °C')}</span><input className="oset-input" type="number" value={(settings.bed_temp as number) ?? ''} onChange={(e) => setSettings((s) => ({ ...s, bed_temp: e.target.value }))} /></label>
            </div>
          </div>

          {/* Process preset */}
          <div className="oslice-presets">
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
          </div>

          {/* Global / Objects */}
          <div className="oslice-goTabs">
            <button className={`oslice-goTab${side === 'global' ? ' oslice-goTab--on' : ''}`} onClick={() => setSide('global')}>{t('v2.slicer.global', 'Global')}</button>
            <button className={`oslice-goTab${side === 'objects' ? ' oslice-goTab--on' : ''}`} onClick={() => setSide('objects')}>{t('v2.slicer.objects', 'Objects')}</button>
            <div className="oslice-presetctl">
              <select className="oset-input" style={{ maxWidth: 100 }} value="" onChange={(e) => { if (e.target.value && presets[e.target.value]) setSettings({ ...presets[e.target.value] }); }}>
                <option value="">{Object.keys(presets).length ? t('v2.slset.load_preset', 'Presets…') : t('v2.slset.none_saved', 'no presets')}</option>
                {Object.keys(presets).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <button className="btn btn--sm btn--ghost" onClick={savePreset}>{t('v2.slset.save', 'Save')}</button>
            </div>
          </div>

          <div className="oslice-panelbody">
            {side === 'global' && <SlicerProcessTabs value={settings} onChange={setSettings} />}
            {side === 'objects' && (
              <>
                <div className="oslice-objlist">
                  {toolState.names.length === 0 && <p className="muted micro" style={{ padding: 10 }}>{t('v2.slicer.no_objects', 'No objects on the plate.')}</p>}
                  {toolState.names.map((n, i) => (
                    <button key={i} className={`oslice-objitem${toolState.selIndex === i ? ' oslice-objitem--on' : ''}`} onClick={() => plateRef.current?.selectAt(i)}>
                      <span className="ellipsis">{n}</span>
                    </button>
                  ))}
                </div>
                {obj
                  ? <ObjectPanel info={obj} onPos={(x, y) => plateRef.current?.setPos(x, y)} onRot={(x, y, z) => plateRef.current?.setRot(x, y, z)} onScalePct={(p) => plateRef.current?.setScalePct(p)} onDim={(a, mm, u) => plateRef.current?.setDim(a, mm, u)} onMirror={(a) => plateRef.current?.mirror(a)} onReset={() => plateRef.current?.resetXform()} onScaleToFit={() => plateRef.current?.scaleToFit()} onRotate90={(a) => plateRef.current?.rotate90(a)} onDuplicate={() => plateRef.current?.duplicateN(1)} />
                  : <p className="muted empty-note" style={{ padding: 16 }}>{t('v2.slicer.select_obj', 'Select an object to edit it.')}</p>}
                {obj && toolState.selIndex >= 0 && (() => {
                  const ov = objOverrides[toolState.selIndex] ?? {};
                  const setOv = (k: string, v: string | boolean) => setObjOverrides((prev) => ({ ...prev, [toolState.selIndex]: { ...(prev[toolState.selIndex] ?? {}), [k]: v } }));
                  return (
                    <section className="card slicer-card">
                      <div className="obj-group-label" style={{ marginTop: 0 }}>{t('v2.obj.overrides', 'Per-object print settings')}</div>
                      <p className="muted micro" style={{ margin: '0 0 8px' }}>{t('v2.obj.overrides_hint', 'Override the global settings for this object only.')}</p>
                      <div className="slset-grid">
                        <label className="field"><span className="field-label">{t('v2.slset.infill', 'Infill')} (%)</span><input className="input" type="number" step={5} value={(ov.infill_density as string) ?? ''} placeholder={String(settings.infill_density ?? '')} onChange={(e) => setOv('infill_density', e.target.value)} /></label>
                        <label className="field"><span className="field-label">{t('v2.slset.walls', 'Wall loops')}</span><input className="input" type="number" step={1} value={(ov.wall_loops as string) ?? ''} placeholder={String(settings.wall_loops ?? '')} onChange={(e) => setOv('wall_loops', e.target.value)} /></label>
                        <label className="chk" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!ov.supports} onChange={(e) => setOv('supports', e.target.checked)} /> {t('v2.slset.supports', 'Supports')}</label>
                        <label className="chk" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!ov.spiral_mode} onChange={(e) => setOv('spiral_mode', e.target.checked)} /> {t('v2.slset.vase', 'Vase')}</label>
                      </div>
                      {objOverrides[toolState.selIndex] && <button className="btn btn--sm btn--ghost" style={{ marginTop: 8 }} onClick={() => setObjOverrides((prev) => { const n = { ...prev }; delete n[toolState.selIndex]; return n; })}>{t('v2.obj.clear_override', 'Clear overrides')}</button>}
                    </section>
                  );
                })()}
              </>
            )}
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

        {/* RIGHT — 3D scene (dark) with horizontal top toolbar */}
        <div className="oslice-stage">
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

          {/* The build plate is always visible, like Bambu Studio. */}
          {tab === 'prepare' && (
            <Suspense fallback={<div className="oslice-loading">{t('common.loading', 'Loading…')}</div>}>
              <PlateViewer ref={plateRef} file={file} bed={bed} onObject={setObj} onState={setToolState} slotColors={slotColors} />
            </Suspense>
          )}
          {tab === 'preview' && preview && (
            <Suspense fallback={<div className="oslice-loading">{t('common.loading', 'Loading…')}</div>}>
              <GcodePreview gcode={preview.gcode} bed={bed} />
            </Suspense>
          )}
          {!file && tab === 'prepare' && (
            <div className="oslice-empty">
              <div className="oslice-emptycard">
                <div className="oslice-drop-plus">+</div>
                <div className="oslice-emptytitle">{t('v2.slicer.choose', 'Add a model to this plate')}</div>
                <div className="oslice-emptybtns">
                  <button type="button" className="oslice-printplate" onClick={() => addInputRef.current?.click()}>{t('v2.slicer.add_model', 'Add model')}</button>
                  <button type="button" className="btn btn--sm" onClick={() => setShowLibrary(true)}>{t('v2.slicer.from_library', 'From library')}</button>
                </div>
                <div className="muted micro" style={{ marginTop: 6 }}>STL · 3MF · OBJ · STEP</div>
              </div>
            </div>
          )}

          <div className="oslice-axis" aria-hidden>
            <svg viewBox="0 0 40 40" width="48" height="48">
              <line x1="12" y1="28" x2="30" y2="28" stroke="#e0603a" strokeWidth="2" /><text x="31" y="31" fill="#e0603a" fontSize="8">X</text>
              <line x1="12" y1="28" x2="20" y2="14" stroke="#37a66b" strokeWidth="2" /><text x="21" y="13" fill="#37a66b" fontSize="8">Y</text>
              <line x1="12" y1="28" x2="12" y2="8" stroke="#3d8bd8" strokeWidth="2" /><text x="6" y="9" fill="#3d8bd8" fontSize="8">Z</text>
            </svg>
          </div>
          {/* Static plate label overlays (readable, never mirror) */}
          <div className="oslice-platename" aria-hidden>3DPrintForge Textured PEI Plate · {bed}×{bed}</div>
          <div className="oslice-plateno" aria-hidden>01</div>
        </div>
      </div>

      {showLibrary && <LibraryImportModal onClose={() => setShowLibrary(false)} onImport={importFromLibrary} />}
    </div>
  );
}
