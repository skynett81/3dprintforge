import { Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '../api';
import { useResource, useLivePrinters } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { Printer, SlicerStatus, SliceResult, SlicerPrinter, Spool } from '../types';
import type { PlateHandle, ObjInfo, PlateState, PlateSnapshot } from '../components/PlateViewer';
import type { SliceSettings } from './slicer/SlicerProcessTabs';
import { SlicerProcessTabs } from './slicer/SlicerProcessTabs';
import { ObjectPanel } from './slicer/ObjectPanel';
import { SlicerDevice } from './slicer/SlicerDevice';
import { SlicerFilaments } from './slicer/SlicerFilaments';
import { SlicerCalibration } from './slicer/SlicerCalibration';
import { SlicerPurge } from './slicer/SlicerPurge';
import { matchSpools } from '../lib/spool-match';
import { SlicerColorLayer } from './slicer/SlicerColorLayer';
import { LibraryImportModal } from './slicer/LibraryImportModal';
import { IconAdd, IconDelete, IconArrange, IconMove, IconRotate, IconScale, IconLayFlat, IconDuplicate, IconCenter, IconProcess, IconExpand, IconCollapse, IconAutoOrient, IconPlaceFace, IconSplit, IconMeasure, IconSimplify, IconSupportPaint, IconSeamPaint, IconColorPaint, IconCut, IconBoolean, IconShape, IconText, IconFuzzy, IconImage, IconEye, IconEyeOff, IconResetView } from './slicer/icons';

const PlateViewer = lazy(() => import('../components/PlateViewer').then((m) => ({ default: m.PlateViewer })));
const GcodePreview = lazy(() => import('../components/GcodePreview').then((m) => ({ default: m.GcodePreview })));

type RowState = { status: 'slicing' | 'done' | 'error'; result?: SliceResult; error?: string };
type Preview = { gcode: string; layers: number; timeSec: number; filamentG: number; wasteG: number; durationMs: number };

const MATERIALS: Record<string, { temps: [number, number]; color: string }> = {
  PLA: { temps: [210, 60], color: '#37a66b' }, PETG: { temps: [240, 80], color: '#3d8bd8' },
  ABS: { temps: [250, 100], color: '#e0603a' }, ASA: { temps: [250, 100], color: '#e0a13a' },
  TPU: { temps: [230, 40], color: '#9b6ad8' }, PC: { temps: [270, 110], color: '#4bb3c4' },
  Nylon: { temps: [260, 80], color: '#c4b04b' },
};
const DEFAULT_SLOT_COLORS = ['#000000', '#0080FF', '#E53935', '#43A047', '#FDD835', '#FB8C00', '#8E24AA', '#00ACC1'];

function badgeTextColor(hex: string): string {
  const h = String(hex).replace(/^#/, '');
  if (h.length < 6) return '#fff';
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  // relative luminance — light backgrounds get dark text
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? '#1a1a1a' : '#fff';
}

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
  const { live: livePrinters } = useLivePrinters();
  const { data: spoolsData } = useResource<Spool[]>(api.listSpools, 60000);
  const printers = useMemo(() => printersData ?? [], [printersData]);
  const slicerPrinters = useMemo(() => slicerPrintersData ?? [], [slicerPrintersData]);
  const spools = useMemo(() => spoolsData ?? [], [spoolsData]);

  const [file, setFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState<SliceSettings>({
    material: 'PLA', nozzle_temp: 210, bed_temp: 60, nozzle_temp_initial: 215, bed_temp_initial: 60, fan_speed: 100, fan_off_layers: 1,
    layer_height: 0.2, initial_layer_height: 0.24, wall_loops: 2, top_layers: 4, bottom_layers: 4,
    infill_density: 15, infill_pattern: 'grid', infill_direction: 45, skirt_loops: 1, skirt_distance: 3, elephant_foot: 0,
    outer_wall_speed: 120, inner_wall_speed: 150, sparse_infill_speed: 180, internal_solid_infill_speed: 140,
    support_speed: 80, initial_layer_speed: 30, ironing_speed: 20, travel_speed: 250, seam_position: 'aligned',
    line_width: 0.42, outer_wall_line_width: 0.42, inner_wall_line_width: 0.45, sparse_infill_line_width: 0.45,
    initial_layer_line_width: 0.5, retraction_length: 0.8, z_hop: 0,
    retraction_speed: 40, deretraction_speed: 40, wipe: false, wipe_distance: 2,
    default_acceleration: 10000, outer_wall_acceleration: 5000, inner_wall_acceleration: 0, top_surface_acceleration: 2000, sparse_infill_acceleration: 0, initial_layer_acceleration: 500, travel_acceleration: 10000, default_jerk: 9,
    slow_down_layer_time: 5, slow_down_min_speed: 10,
    detect_overhang_wall: true, overhang_1_4_speed: 0, overhang_2_4_speed: 50, overhang_3_4_speed: 30, overhang_4_4_speed: 10, overhang_fan_speed: 100, bridge_flow: 0.7, bridge_speed: 25,
    support_threshold: 40, support_base_density: 20, support_interface_top_layers: 2, support_z_gap_layers: 1, support_object_xy_distance: 0.8, support_wall_count: 0, support_remove_small_overhangs: false, support_min_overhang_area: 3, support_top_z_distance: 0.2,
    bridge_angle: 0,
    ironing_flow: 10, ironing_spacing: 0.1, ironing_direction: 45, infill_wall_overlap: 15, top_shell_thickness: 0, bottom_shell_thickness: 0,
    avoid_crossing_walls: true,
    xy_hole_compensation: 0, xy_contour_compensation: 0, small_perimeter_speed: 25, small_perimeter_threshold: 15, seam_gap: 0.1,
    fuzzy_skin_mode: 'external', fuzzy_skin_point_distance: 0.4, fuzzy_skin_first_layer: false, arc_fitting: false, arc_fitting_tolerance: 0.05,
    gap_fill_enabled: true, gap_infill_speed: 40,
    flush_into_infill: true, flush_volume: 80,
  });
  const [tab, setTab] = useState<'prepare' | 'preview' | 'device' | 'filaments' | 'calibration'>('prepare');
  const tabRef = useRef(tab); tabRef.current = tab;
  const [side, setSide] = useState<'global' | 'objects'>('global');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [slicing, setSlicing] = useState(false);
  const [obj, setObj] = useState<ObjInfo | null>(null);
  const [objOverrides, setObjOverrides] = useState<Record<number, SliceSettings>>({});
  const [filaments, setFilaments] = useState<{ color: string; material: string }[]>([{ color: '#000000', material: 'PLA' }]);
  const [toolState, setToolState] = useState<PlateState>({ count: 0, hasSel: false, mode: 'translate', names: [], selIndex: -1, partTypes: [], partParents: [], hidden: [] });
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; i: number } | null>(null);
  const [colorChangeLayers, setColorChangeLayers] = useState<number[]>([]);
  const colorChangeRef = useRef<number[]>([]);
  const [layerBands, setLayerBands] = useState<{ z0: number; z1: number; h: number }[]>([]);
  const [full, setFull] = useState(false);
  const [autoCalib, setAutoCalib] = useState(true);     // apply saved fleet calibration
  const [calibK, setCalibK] = useState<number | null>(null);
  // Multi-plate: each plate keeps its own live objects (snapshot) so switching
  // preserves the exact arrangement, transforms and paint.
  const [plates, setPlates] = useState<{ id: number; name: string; snap: PlateSnapshot | null }[]>([{ id: 1, name: 'Plate 1', snap: null }]);
  const [activePlate, setActivePlate] = useState(0);
  const [allView, setAllView] = useState(false);
  const plateSeq = useRef(2);
  // Toggle the "all plates" overview — lay every plate out in a grid at once.
  const toggleAllView = () => {
    const pv = plateRef.current; if (!pv) return;
    if (allView) { pv.setAllPlatesView(null); setAllView(false); return; }
    const activeSnap = pv.snapshot();
    const groups = plates.map((pl, i) => ({ meshes: i === activePlate ? activeSnap : (pl.snap ?? []), name: pl.name }));
    pv.setAllPlatesView(groups, activePlate);
    setAllView(true);
  };
  const switchPlate = (idx: number) => {
    if (allView) { plateRef.current?.setAllPlatesView(null); setAllView(false); }
    if (idx === activePlate || !plateRef.current || idx < 0 || idx >= plates.length) return;
    const curSnap = plateRef.current.snapshot();
    setPlates((ps) => ps.map((pl, i) => (i === activePlate ? { ...pl, snap: curSnap } : pl)));
    plateRef.current.restore(plates[idx].snap ?? []);
    setActivePlate(idx);
  };
  const addPlate = () => {
    if (!plateRef.current) return;
    if (allView) { plateRef.current.setAllPlatesView(null); setAllView(false); }
    const curSnap = plateRef.current.snapshot();
    const id = plateSeq.current++;
    const nextIdx = plates.length;
    setPlates((ps) => [...ps.map((pl, i) => (i === activePlate ? { ...pl, snap: curSnap } : pl)), { id, name: `Plate ${id}`, snap: [] }]);
    plateRef.current.restore([]);
    setActivePlate(nextIdx);
  };
  // Move the selected object off the active plate and onto another plate.
  const moveSelectedToPlate = (targetIdx: number) => {
    if (targetIdx === activePlate || !plateRef.current) return;
    const m = plateRef.current.detachSelected();
    if (!m) return;
    setPlates((ps) => ps.map((pl, i) => (i === targetIdx ? { ...pl, snap: [...(pl.snap ?? []), m] } : pl)));
  };
  // Drag-and-drop in the "all plates" overview: move an object (by uuid) from
  // one plate to another, then rebuild the overview.
  const movePlateObject = (srcPlate: number, srcUuid: string, targetPlate: number) => {
    const pv = plateRef.current; if (!pv || srcPlate < 0) return;
    const activeSnap = pv.snapshot();
    const cur = plates.map((pl, i) => (i === activePlate ? activeSnap.slice() : (pl.snap ?? []).slice()));
    if (srcPlate !== targetPlate && cur[srcPlate] && cur[targetPlate]) {
      const srcArr = cur[srcPlate];
      const moved = srcArr.find((m) => m.uuid === srcUuid);
      if (moved) {
        const kids = srcArr.filter((m) => m.userData.partParentId === moved.uuid);
        cur[srcPlate] = srcArr.filter((m) => m !== moved && !kids.includes(m));
        cur[targetPlate] = [...cur[targetPlate], moved, ...kids];
        // The object may have been hidden by the overview (active-plate objects
        // are hidden while in overview); it must be visible on its new plate.
        for (const m of [moved, ...kids]) { m.visible = true; delete m.userData.__ovHidden; }
      }
    }
    const newPlates = plates.map((pl, i) => ({ ...pl, snap: cur[i] }));
    setPlates(newPlates);
    pv.restore(cur[activePlate]);
    pv.setAllPlatesView(newPlates.map((pl, i) => ({ meshes: i === activePlate ? cur[activePlate] : (pl.snap ?? []), name: pl.name })), activePlate);
  };
  const deletePlate = (idx: number) => {
    if (plates.length <= 1 || !plateRef.current) return;
    if (idx === activePlate) {
      // Switch the view to a neighbour, then drop this plate.
      const target = idx === 0 ? 1 : idx - 1;
      plateRef.current.restore(plates[target].snap ?? []);
      const kept = plates[target];
      const newList = plates.filter((_, i) => i !== idx);
      setPlates(newList);
      setActivePlate(newList.indexOf(kept));
    } else {
      // Dropping a background plate — keep the active plate's live state fresh.
      const active = plates[activePlate];
      const curSnap = plateRef.current.snapshot();
      const newList = plates.filter((_, i) => i !== idx).map((pl) => (pl.id === active.id ? { ...pl, snap: curSnap } : pl));
      setPlates(newList);
      setActivePlate(newList.findIndex((pl) => pl.id === active.id));
    }
  };
  const [placeFace, setPlaceFace] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  type PaintCh = 'support' | 'seam' | 'color' | 'fuzzy';
  const [paint, setPaint] = useState<{ ch: PaintCh; val: number } | null>(null);
  // The pick/paint modes are mutually exclusive.
  const exitOthers = (keep: 'place' | 'measure' | 'paint') => {
    if (keep !== 'place') { setPlaceFace(false); plateRef.current?.setPlaceOnFace(false); }
    if (keep !== 'measure') { setMeasuring(false); plateRef.current?.setMeasureMode(false); }
    if (keep !== 'paint') { setPaint(null); plateRef.current?.setPaintMode(null); }
  };
  const togglePlaceFace = () => { setPlaceFace((on) => { const next = !on; plateRef.current?.setPlaceOnFace(next); if (next) exitOthers('place'); return next; }); };
  const toggleMeasure = () => { setMeasuring((on) => { const next = !on; plateRef.current?.setMeasureMode(next); if (next) exitOthers('measure'); return next; }); };
  const applyPaint = (m: { ch: PaintCh; val: number } | null) => { setPaint(m); plateRef.current?.setPaintMode(m); if (m) exitOthers('paint'); };
  // Toggle a paint channel on/off from its rail button (default value per channel).
  const togglePaint = (ch: PaintCh) => applyPaint(paint?.ch === ch ? null : { ch, val: 1 });
  // Cut tool: a translucent plane preview + a height slider.
  const [cutOpen, setCutOpen] = useState(false);
  const [cutFrac, setCutFrac] = useState(0.5);
  const [cutKeep, setCutKeep] = useState<'upper' | 'lower' | 'both'>('both');
  const [cutConn, setCutConn] = useState(0);   // alignment connectors (0-4)
  const toggleCut = () => {
    setCutOpen((on) => {
      const next = !on;
      if (next) { exitOthers('paint'); setPlaceFace(false); plateRef.current?.setPlaceOnFace(false); setMeasuring(false); plateRef.current?.setMeasureMode(false); plateRef.current?.setCutPreview(cutFrac); }
      else plateRef.current?.setCutPreview(null);
      return next;
    });
  };
  const applyCut = () => { plateRef.current?.cut(cutFrac, cutKeep, cutConn); setCutOpen(false); };
  // Boolean + add-primitive bars.
  const [boolOpen, setBoolOpen] = useState(false);
  const [shapeOpen, setShapeOpen] = useState(false);
  const doBoolean = (op: 'union' | 'subtract' | 'intersect') => { plateRef.current?.boolean(op); setBoolOpen(false); };
  const doAddShape = (shape: 'cube' | 'cylinder' | 'sphere') => { plateRef.current?.addPrimitive(shape); setShapeOpen(false); };
  const [textOpen, setTextOpen] = useState(false);
  const [textVal, setTextVal] = useState('Text');
  const [colorLayerOpen, setColorLayerOpen] = useState(false);
  const doAddText = () => { if (textVal.trim()) { plateRef.current?.addText(textVal.trim()); setTextOpen(false); } };
  const [profilePrinter, setProfilePrinter] = useState<string>('');
  const [showLibrary, setShowLibrary] = useState(false);
  type ProfKind = 'process' | 'filament';
  const [purgeOpen, setPurgeOpen] = useState(false);
  const [flushMatrix, setFlushMatrix] = useState<number[][] | null>(null);
  const [profiles, setProfiles] = useState<Record<ProfKind, import('../types').SlicerProfile[]>>({ process: [], filament: [] });
  const [profileId, setProfileId] = useState<Record<ProfKind, number | null>>({ process: null, filament: null });
  const [bindings, setBindings] = useState<Record<string, { process?: number | null; filament?: number | null }>>(() => { try { return JSON.parse(localStorage.getItem('v2.slicer.bindings') || '{}'); } catch { return {}; } });
  const plateRef = useRef<PlateHandle>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const projInputRef = useRef<HTMLInputElement>(null);
  const lastPrinterSync = useRef<string>('');
  const lastBindingApplied = useRef<string>('');

  // Bed size follows the selected printer's build volume (X × Y), so each
  // printer shows its own plate size/shape.
  const bedVol = useMemo(() => {
    const p = slicerPrinters.find((sp) => sp.id === profilePrinter) ?? slicerPrinters[0];
    return { x: p?.buildVolume?.x ?? 256, y: p?.buildVolume?.y ?? p?.buildVolume?.x ?? 256 };
  }, [slicerPrinters, profilePrinter]);
  const bed = bedVol.x;
  const bedY = bedVol.y;

  // Per-printer price/gram: price each loaded filament slot from the closest
  // matching inventory spool (same material, nearest colour), then average the
  // slots. This reflects the actual filaments on the SELECTED printer instead
  // of an inventory-wide single-material average, so cost tracks the machine.
  const pricePerGram = useMemo(() => {
    const pg = (s: typeof spools[number]) => ((s.cost ?? 0) > 0 && (s.initial_weight_g ?? 0) > 0 ? (s.cost as number) / (s.initial_weight_g as number) : 0);
    const rgb = (h: string) => { const x = String(h).replace(/^#/, ''); return [parseInt(x.slice(0, 2), 16) || 0, parseInt(x.slice(2, 4), 16) || 0, parseInt(x.slice(4, 6), 16) || 0]; };
    const dist = (a: string, b: string) => { const [r1, g1, b1] = rgb(a), [r2, g2, b2] = rgb(b); return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2; };
    const anyPriced = spools.filter((s) => pg(s) > 0);
    if (!anyPriced.length) return 0;
    const globalAvg = anyPriced.reduce((a, s) => a + pg(s), 0) / anyPriced.length;
    const perSlot = filaments.map((f) => {
      const mat = (f.material || 'PLA').toUpperCase();
      const cand = spools.filter((s) => (s.material || '').toUpperCase() === mat && pg(s) > 0);
      if (!cand.length) return globalAvg; // no same-material spool → inventory average
      let best = cand[0], bd = Infinity;
      for (const s of cand) { const c = s.color_hex; if (!c) continue; const d = dist(f.color, c.startsWith('#') ? c : '#' + c); if (d < bd) { bd = d; best = s; } }
      return pg(best);
    });
    return perSlot.reduce((a, b) => a + b, 0) / perSlot.length;
  }, [spools, filaments]);

  const formats = [...(status?.supportedFormats ?? ['.stl', '.3mf', '.obj', '.step']), '.svg'];
  const slotColors = useMemo(() => filaments.map((f) => f.color), [filaments]);
  useEffect(() => { plateRef.current?.recolor(slotColors); }, [slotColors]);

  const selPrinter = slicerPrinters.find((p) => p.id === profilePrinter) ?? slicerPrinters[0];

  // Keep the filament slots consistent with the selected printer so cost/waste
  // is computed against the right machine: a printer with a live AMS (or spools
  // assigned to its tools) loads those exact colours; a multi-tool printer
  // (e.g. Snapmaker U1) expands to its physical tool count. Guarded by a
  // signature so a background refresh never clobbers manual edits.
  useEffect(() => {
    const p = selPrinter;
    if (!p?.id) return;
    const sig = `${p.id}|${(p.ams ?? []).map((a) => a.color + a.material).join(',')}|${p.colorSlots ?? 1}`;
    if (sig === lastPrinterSync.current) return;
    lastPrinterSync.current = sig;
    if (p.ams?.length) {
      loadFromAms(p.ams);
    } else {
      const n = Math.max(1, p.colorSlots ?? 1);
      setFilaments((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? { color: DEFAULT_SLOT_COLORS[i % DEFAULT_SLOT_COLORS.length], material: prev[0]?.material ?? 'PLA' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selPrinter]);

  // Auto-apply the process + filament profiles pinned to the selected printer
  // (once the profile lists have loaded). Guarded so it applies once per change.
  useEffect(() => {
    const pid = selPrinter?.id; if (!pid) return;
    if (!profiles.process.length && !profiles.filament.length) return;
    const b = bindings[pid]; if (!b) return;
    const sig = `${pid}:${b.process ?? ''}:${b.filament ?? ''}`;
    if (sig === lastBindingApplied.current) return;
    lastBindingApplied.current = sig;
    if (b.process != null && profiles.process.some((p) => p.id === b.process)) applyProfile('process', b.process);
    if (b.filament != null && profiles.filament.some((p) => p.id === b.filament)) applyProfile('filament', b.filament);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selPrinter, profiles, bindings]);

  function setSlot(i: number, patch: Partial<{ color: string; material: string }>) {
    setFilaments((prev) => {
      const next = prev.map((f, k) => (k === i ? { ...f, ...patch } : f));
      if (i === 0 && patch.material) { const m = MATERIALS[patch.material]; setSettings((s) => ({ ...s, material: patch.material!, ...(m ? { nozzle_temp: m.temps[0], bed_temp: m.temps[1] } : {}) })); }
      return next;
    });
  }
  function addSlot() { setFilaments((prev) => (prev.length >= 16 ? prev : [...prev, { color: DEFAULT_SLOT_COLORS[prev.length % DEFAULT_SLOT_COLORS.length], material: prev[0]?.material ?? 'PLA' }])); }
  function removeSlot(i: number) { setFilaments((prev) => (prev.length <= 1 ? prev : prev.filter((_, k) => k !== i))); }
  function loadFromAms(ams: { color: string; material: string }[]) {
    if (!ams?.length) return;
    const fil = ams.map((a) => ({ color: a.color, material: MATERIALS[a.material] ? a.material : 'PLA' }));
    setFilaments(fil);
    const m0 = MATERIALS[fil[0].material];
    if (m0) setSettings((s) => ({ ...s, material: fil[0].material, nozzle_temp: m0.temps[0], bed_temp: m0.temps[1] }));
  }
  function toggle(id: string) { setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }

  function pickFile(f: File | null) { setFile(f); setPreview(null); setTab('prepare'); setRows({}); setObj(null); setObjOverrides({}); colorChangeRef.current = []; setColorChangeLayers([]); setLayerBands([]); }
  // STEP/STP files are tessellated to STL server-side (OpenCascade) first.
  async function toLoadable(f: File): Promise<File> {
    if (/\.(step|stp|iges|igs)$/i.test(f.name)) {
      try { return await api.stepToStl(f); }
      catch (e) { toast(`${t('v2.slicer.step_fail', 'STEP import failed')}: ${(e as Error).message}`, 'error'); throw e; }
    }
    return f;
  }
  async function onPickInput(files: File[]) {
    if (!files.length) return;
    if (!file) { try { pickFile(await toLoadable(files[0])); } catch { /* toasted */ } }
    else await addModels(files);
  }
  async function addModels(files: FileList | File[] | null) {
    if (!files || !files.length) return;
    for (const f of Array.from(files)) { try { await plateRef.current?.addFile(await toLoadable(f)); } catch { /* toasted */ } }
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
  // ── Profiles (server-persisted, editable): process + filament ───────
  // A filament profile owns the material/temp/retraction/cooling keys; a
  // process profile owns everything else. Split so they compose cleanly.
  const FILAMENT_KEYS = ['material', 'nozzle_temp', 'bed_temp', 'nozzle_temp_initial', 'bed_temp_initial', 'fan_speed', 'fan_off_layers', 'retraction_length'];
  async function loadProfiles() {
    try {
      const [pr, fil] = await Promise.all([api.listSlicerProfiles('process'), api.listSlicerProfiles('filament')]);
      setProfiles({ process: pr.profiles ?? [], filament: fil.profiles ?? [] });
    } catch { /* offline */ }
  }
  useEffect(() => { loadProfiles(); }, []);
  // Undo / redo (Ctrl/Cmd+Z, Ctrl+Y or Ctrl+Shift+Z) for plate edits — ignored
  // while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const k = e.key.toLowerCase();
      if (e.ctrlKey || e.metaKey) {
        if (k === 'z' && !e.shiftKey) { e.preventDefault(); plateRef.current?.undo(); }
        else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); plateRef.current?.redo(); }
        else if (k === 'd') { e.preventDefault(); plateRef.current?.duplicate(); }
        return;
      }
      if (e.key === 'Delete') { e.preventDefault(); plateRef.current?.remove(); return; }
      // BambuStudio gizmo / arrange shortcuts (Prepare tab only).
      if (tabRef.current !== 'prepare') return;
      if (k === 'a') { e.preventDefault(); plateRef.current?.arrange(); }
      else if (k === 'm') { e.preventDefault(); plateRef.current?.setMode('translate'); }
      else if (k === 'r') { e.preventDefault(); plateRef.current?.setMode('rotate'); }
      else if (k === 's') { e.preventDefault(); plateRef.current?.setMode('scale'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function applyProfile(kind: ProfKind, id: number | null) {
    setProfileId((p) => ({ ...p, [kind]: id }));
    if (id == null) return;
    const p = profiles[kind].find((x) => x.id === id);
    if (!p) return;
    try {
      const s = JSON.parse(p.settings_json || '{}') as SliceSettings;
      setSettings((prev) => ({ ...prev, ...s }));
      // Keep the filament slot's material label in step with a filament profile.
      if (kind === 'filament' && s.material) setFilaments((prev) => (prev.length ? prev.map((f, i) => (i === 0 ? { ...f, material: String(s.material) } : f)) : prev));
    } catch { /* bad json */ }
  }

  function profilePayload(kind: ProfKind): Record<string, unknown> {
    const entries = Object.entries(settings).filter(([k]) => (kind === 'filament' ? FILAMENT_KEYS.includes(k) : !FILAMENT_KEYS.includes(k)));
    return Object.fromEntries(entries);
  }

  async function saveProfile(kind: ProfKind) {
    const sel = profileId[kind] != null ? profiles[kind].find((p) => p.id === profileId[kind]) : null;
    const payload = profilePayload(kind);
    if (sel && window.confirm(t('v2.slset.update_profile', 'Update profile "{name}"? Cancel = save as new').replace('{name}', sel.name))) {
      try { await api.updateSlicerProfile(sel.id, { settings: payload }); toast(t('v2.slset.profile_updated', 'Profile updated'), 'success'); await loadProfiles(); }
      catch (e) { toast((e as Error).message, 'error'); }
      return;
    }
    const name = window.prompt(t('v2.slset.profile_name', 'Profile name'))?.trim(); if (!name) return;
    try {
      const created = await api.createSlicerProfile({ kind, name, settings: payload });
      await loadProfiles(); setProfileId((p) => ({ ...p, [kind]: created.id ?? null }));
      toast(t('v2.slset.profile_saved', 'Profile saved'), 'success');
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  async function deleteProfile(kind: ProfKind) {
    const sel = profileId[kind] != null ? profiles[kind].find((p) => p.id === profileId[kind]) : null;
    if (!sel) return;
    if (!window.confirm(t('v2.slset.delete_profile', 'Delete profile "{name}"?').replace('{name}', sel.name))) return;
    try { await api.deleteSlicerProfile(sel.id); setProfileId((p) => ({ ...p, [kind]: null })); await loadProfiles(); toast(t('v2.slset.profile_deleted', 'Profile deleted'), 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  // Pin the current process + filament profiles to the selected printer, so
  // picking that printer later auto-applies them (persisted per browser).
  function pinToPrinter() {
    const pid = selPrinter?.id; if (!pid) return;
    const next = { ...bindings, [pid]: { process: profileId.process, filament: profileId.filament } };
    setBindings(next); localStorage.setItem('v2.slicer.bindings', JSON.stringify(next));
    toast(t('v2.slset.pinned', 'Profiles pinned to {name}').replace('{name}', selPrinter?.name ?? pid), 'success');
  }

  // Inject a target printer's bed size so the slicer centres the model on the
  // right plate (the engine defaults to origin-corner when it's unknown).
  function settingsForPrinter(pid: string | undefined, base: SliceSettings = settings): Record<string, unknown> {
    const bv = slicerPrinters.find((p) => p.id === pid)?.buildVolume;
    const out: Record<string, unknown> = bv ? { ...base, bed_size: [bv.x, bv.y] } : { ...base };
    if (flushMatrix) out.flush_matrix = flushMatrix;
    // Support / seam painting: send enforce/block regions if any were painted.
    // Support enforcer/blocker VOLUMES feed the same channel.
    const sp = plateRef.current?.getSupportPaint();
    const sv = plateRef.current?.getSupportVolumes();
    const spEnforce = [...(sp?.enforce ?? []), ...(sv?.enforce ?? [])];
    const spBlock = [...(sp?.block ?? []), ...(sv?.block ?? [])];
    if (spEnforce.length || spBlock.length) out.support_paint = { enforce: spEnforce, block: spBlock };
    const seam = plateRef.current?.getSeamPaint();
    if (seam && (seam.enforce.length || seam.block.length)) out.seam_paint = seam;
    const fuzzy = plateRef.current?.getFuzzyPaint();
    if (fuzzy && fuzzy.enforce.length) out.fuzzy_paint = { enforce: fuzzy.enforce };
    const mods = plateRef.current?.getModifiers();
    if (mods && mods.length) out.modifiers = mods;
    if (colorChangeRef.current.length) out.color_change_layers = colorChangeRef.current;
    if (layerBands.length) out.layer_height_bands = layerBands;
    return out;
  }

  // Fleet Calibration (from the desktop fork): when a printer is chosen, look up
  // the saved pressure-advance K for the real spool that matches filament slot 1
  // and apply it — the whole fleet shares one calibration memory.
  async function settingsWithCalibration(pid: string | undefined): Promise<Record<string, unknown>> {
    const out = settingsForPrinter(pid);
    if (autoCalib && pid && filaments[0]) {
      const m = matchSpools(filaments[0].color, filaments[0].material, spools);
      if (m.spoolIds.length) {
        const k = await api.bestK(m.spoolIds[0], pid, Number(settings.nozzle_diameter) || 0.4);
        if (k != null && k > 0) { out.pressure_advance = k; setCalibK(k); return out; }
      }
    }
    setCalibK(null);
    return out;
  }

  // Manual colour changes (M600): update the list and re-slice so the preview +
  // send reflect the pause. The ref is read synchronously by settingsForPrinter.
  function addColorChange(layer: number) {
    const next = Array.from(new Set([...colorChangeRef.current, layer])).sort((a, b) => a - b);
    colorChangeRef.current = next; setColorChangeLayers(next); slicePreview();
  }
  function removeColorChange(layer: number) {
    const next = colorChangeRef.current.filter((l) => l !== layer);
    colorChangeRef.current = next; setColorChangeLayers(next); slicePreview();
  }

  // Save the sliced g-code to a .gcode file the user can drop on an SD card.
  function downloadGcode() {
    if (!preview?.gcode) return;
    const name = (file?.name || 'model').replace(/\.[^.]+$/, '') + '.gcode';
    const url = URL.createObjectURL(new Blob([preview.gcode], { type: 'text/plain' }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  }

  // Save the whole plate (geometry + arrangement + settings + filaments +
  // overrides) as a self-contained .forgeproj file the user can reopen later.
  function saveProject() {
    const objects = plateRef.current?.serializePlate() ?? [];
    if (!objects.length) { toast(t('v2.slicer.no_objects', 'No objects on the plate.'), 'error'); return; }
    const project = { app: '3dprintforge-slicer', version: 1, settings, filaments, objOverrides, colorChangeLayers, layerBands, objects };
    const name = (file?.name || 'project').replace(/\.[^.]+$/, '') + '.forgeproj';
    const url = URL.createObjectURL(new Blob([JSON.stringify(project)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
    toast(t('v2.slicer.project_saved', 'Project saved'), 'success');
  }
  async function openProject(f: File) {
    try {
      const p = JSON.parse(await f.text());
      if (!p || p.app !== '3dprintforge-slicer' || !Array.isArray(p.objects)) { toast(t('v2.slicer.project_invalid', 'Not a valid project file'), 'error'); return; }
      setFile(null); setPreview(null); setTab('prepare'); setRows({}); setObj(null);
      plateRef.current?.loadProject(p.objects);
      if (p.settings) setSettings(p.settings);
      if (Array.isArray(p.filaments) && p.filaments.length) setFilaments(p.filaments);
      setObjOverrides(p.objOverrides && typeof p.objOverrides === 'object' ? p.objOverrides : {});
      const cc = Array.isArray(p.colorChangeLayers) ? p.colorChangeLayers : [];
      setColorChangeLayers(cc); colorChangeRef.current = cc;
      setLayerBands(Array.isArray(p.layerBands) ? p.layerBands : []);
      toast(t('v2.slicer.project_loaded', 'Project loaded'), 'success');
    } catch { toast(t('v2.slicer.project_fail', 'Failed to open project'), 'error'); }
  }

  async function slicePreview() {
    if (!file && toolState.count === 0) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    const baseName = file?.name || 'project.stl';
    setSlicing(true);
    try {
      const s = await settingsWithCalibration(selPrinter?.id);
      // Sequential (by-object) printing needs the objects sliced separately.
      const each = s.print_sequence === 'by_object' && toolState.count > 1 ? (plateRef.current?.exportEach(baseName) ?? []) : [];
      // Colour-painted / multi-material models preview through the multi path so
      // the toolpath shows the painted colours (BambuStudio-style), not grey.
      const colorPainted = plateRef.current?.hasColorPaint() ?? false;
      const multi = colorPainted || (plateRef.current?.hasMaterials() ?? false);
      const materials = each.length > 1 ? [] : multi
        ? (colorPainted ? (plateRef.current?.getColorMaterials(baseName) ?? []) : (plateRef.current?.exportMaterials(baseName) ?? []))
        : [];
      if (each.length > 1) {
        const p = await api.sliceObjects(each.map((e) => e.file), s);
        setPreview(p); setTab('preview');
        if (p.warnings?.length) toast(p.warnings[0], 'error');
      } else if (materials.length > 1) {
        const p = await api.sliceMulti(baseName, materials, s);
        setPreview({ ...p, wasteG: p.wasteG ?? 0 }); setTab('preview');
      } else {
        const toSend = plateRef.current?.exportSTL(baseName) ?? file;
        if (!toSend) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
        const p = await api.sliceGcode(toSend, s);
        setPreview(p); setTab('preview');
      }
    } catch (e) { toast((e as Error).message || t('v2.slicer.slice_fail', 'Slicing failed'), 'error'); }
    finally { setSlicing(false); }
  }

  // Slice every plate and report the combined time/filament; leaves the active
  // plate's preview showing. Each plate is restored in turn so its own
  // arrangement + paint feed the slice.
  async function sliceAllPlates() {
    const pv = plateRef.current; if (!pv) return;
    setSlicing(true);
    try {
      const activeSnap = pv.snapshot();
      const all = plates.map((pl, i) => (i === activePlate ? { ...pl, snap: activeSnap } : pl));
      let totTime = 0, totFil = 0, n = 0;
      let activeResult: typeof preview = null;
      for (let i = 0; i < all.length; i++) {
        pv.restore(all[i].snap ?? []);
        if (pv.count() === 0) continue;
        const stl = pv.exportSTL(`${all[i].name}.stl`);
        if (!stl) continue;
        const r = await api.sliceGcode(stl, settingsForPrinter(selPrinter?.id));
        totTime += r.timeSec; totFil += r.filamentG; n++;
        if (i === activePlate) activeResult = r;
      }
      pv.restore(activeSnap);
      if (n === 0) { toast(t('v2.slicer.no_plates', 'No plates with models to slice'), 'error'); return; }
      toast(`${n} ${t('v2.slicer.plates_sliced', 'plates')} · ${fmtTime(totTime)} · ${totFil.toFixed(1)} g`, 'success');
      if (activeResult) { setPreview(activeResult); setTab('preview'); }
    } catch (e) { toast((e as Error).message || t('v2.slicer.slice_fail', 'Slicing failed'), 'error'); }
    finally { setSlicing(false); }
  }

  // Slice and send EVERY non-empty plate to the selected printer(s).
  async function printAllPlates(startPrint: boolean) {
    const pv = plateRef.current; if (!pv) return;
    if (selected.size === 0) { toast(t('v2.slicer.pick_printer', 'Select at least one printer'), 'error'); return; }
    setBusy(true);
    try {
      const activeSnap = pv.snapshot();
      const all = plates.map((pl, i) => (i === activePlate ? { ...pl, snap: activeSnap } : pl));
      let sent = 0, failed = 0;
      for (let i = 0; i < all.length; i++) {
        pv.restore(all[i].snap ?? []);
        if (pv.count() === 0) continue;
        const stl = pv.exportSTL(`${all[i].name}.stl`);
        if (!stl) continue;
        for (const id of selected) {
          try { await api.sliceAndSend(id, stl, { print: startPrint, settings: settingsForPrinter(id) }); sent++; }
          catch { failed++; }
        }
      }
      pv.restore(activeSnap);
      if (!sent && !failed) { toast(t('v2.slicer.no_plates', 'No plates with models to slice'), 'error'); return; }
      toast(`${sent} ${t('v2.slicer.jobs_sent', 'plate job(s) sent')}${failed ? ` · ${failed} ${t('v2.slicer.failed', 'failed')}` : ''}`, failed ? 'error' : 'success');
    } catch (e) { toast((e as Error).message || t('v2.slicer.send_fail', 'Send failed'), 'error'); }
    finally { setBusy(false); }
  }

  async function run(startPrint: boolean) {
    if (!file && toolState.count === 0) { toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    if (selected.size === 0) { toast(t('v2.slicer.pick_printer', 'Select at least one printer'), 'error'); return; }
    const baseName = file?.name || 'project.stl';
    setBusy(true);
    const ids = [...selected];
    // Colour painting produces per-extruder geometry just like a multi-part 3MF,
    // so it feeds the same multi-material send path.
    const colorPainted = plateRef.current?.hasColorPaint() ?? false;
    const multi = colorPainted || (plateRef.current?.hasMaterials() ?? false);
    const materials = colorPainted
      ? (plateRef.current?.getColorMaterials(baseName) ?? [])
      : (multi ? (plateRef.current?.exportMaterials(baseName) ?? []) : []);
    const usePerObject = !multi && Object.keys(objOverrides).length > 0 && toolState.count > 0;
    const perObj = usePerObject ? (plateRef.current?.exportEach(baseName) ?? []) : [];
    const toSend = plateRef.current?.exportSTL(baseName) ?? file;
    if (!toSend) { setBusy(false); toast(t('v2.slicer.pick_file', 'Choose a model file first'), 'error'); return; }
    setRows(Object.fromEntries(ids.map((id) => [id, { status: 'slicing' as const }])));
    const results = await Promise.all(ids.map(async (id): Promise<boolean> => {
      try {
        const s = await settingsWithCalibration(id);
        const result = multi && materials.length > 1
          ? await api.sliceMultiAndSend(id, baseName, materials, { print: startPrint, settings: s })
          : perObj.length
            ? await api.sliceObjectsAndSend(id, baseName, perObj.map((o) => ({ file: o.file, settings: { ...s, ...(objOverrides[o.index] ?? {}) } })), { print: startPrint, settings: s })
            : await api.sliceAndSend(id, toSend, { print: startPrint, settings: s });
        setRows((r) => ({ ...r, [id]: { status: 'done', result } })); return true;
      }
      catch (e) { setRows((r) => ({ ...r, [id]: { status: 'error', error: (e as Error).message } })); return false; }
    }));
    setBusy(false);
    const failed = results.filter((ok) => !ok).length;
    toast(failed ? t('v2.slicer.partial', 'Slice & send finished with errors') : t('v2.slicer.done', 'Slice & send complete'), failed ? 'error' : 'success');
  }

  // A plate is sliceable when it actually holds objects (multi-plate: an empty
  // plate must not fall back to another plate's file).
  const plateHasModels = toolState.count > 0;
  const tool = (m: PlateState['mode'], icon: ReactNode, label: string, needSel = false) => (
    <button className={`oslice-tool${toolState.mode === m ? ' oslice-tool--on' : ''}`} title={label} disabled={needSel && !toolState.hasSel} onClick={() => plateRef.current?.setMode(m)}>{icon}</button>
  );
  const action = (icon: ReactNode, label: string, fn: () => void, disabled = false) => (
    <button className="oslice-tool" title={label} disabled={disabled} onClick={fn}>{icon}</button>
  );

  return (
    <div className={`oslice${full ? ' oslice--full' : ''}`}>
      {/* Top bar (dark) — tabs left, Slice/Print plate right */}
      <div className="oslice-top">
        <span className="oslice-logo">3DPrintForge <span>Slicer</span></span>
        <div className="oslice-filemenu">
          <button className="oslice-filebtn" title={t('v2.slicer.open_project_hint', 'Open a saved .forgeproj project')} onClick={() => projInputRef.current?.click()}>{t('v2.slicer.open_project', 'Open')}</button>
          <button className="oslice-filebtn" title={t('v2.slicer.save_project_hint', 'Save the plate + settings as a .forgeproj project')} disabled={!plateHasModels} onClick={saveProject}>{t('v2.slicer.save_project', 'Save')}</button>
          <input ref={projInputRef} type="file" accept=".forgeproj,application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; e.currentTarget.value = ''; if (f) openProject(f); }} />
        </div>
        <div className="oslice-toptabs">
          <button className={`oslice-toptab${tab === 'prepare' ? ' oslice-toptab--on' : ''}`} onClick={() => setTab('prepare')}>{t('v2.slicer.prepare', 'Prepare')}</button>
          <button className={`oslice-toptab${tab === 'preview' ? ' oslice-toptab--on' : ''}`} disabled={!preview} onClick={() => preview && setTab('preview')}>{t('v2.slicer.preview', 'Preview')}</button>
          <button className={`oslice-toptab${tab === 'device' ? ' oslice-toptab--on' : ''}`} onClick={() => setTab('device')}>{t('v2.slicer.device', 'Device')}</button>
          <button className={`oslice-toptab${tab === 'filaments' ? ' oslice-toptab--on' : ''}`} onClick={() => setTab('filaments')}>{t('v2.slicer.filaments', 'Filaments')}</button>
          <button className={`oslice-toptab${tab === 'calibration' ? ' oslice-toptab--on' : ''}`} onClick={() => setTab('calibration')}>{t('v2.slicer.calibration', 'Calibration')}</button>
        </div>
        <div className="oslice-topright">
          <button className="oslice-sliceplate" disabled={!plateHasModels || slicing} onClick={slicePreview}>{slicing ? t('v2.slicer.slicing', 'Slicing…') : t('v2.slicer.slice_plate', 'Slice plate')}</button>
          {plates.length > 1 && <button className="oslice-sliceplate oslice-sliceall" disabled={slicing} onClick={sliceAllPlates} title={t('v2.slicer.slice_all_hint', 'Slice every plate and sum the estimates')}>{t('v2.slicer.slice_all', 'Slice all')}</button>}
          <button className="oslice-printplate" disabled={!plateHasModels || busy} title={t('v2.slicer.printplate_hint', 'Slice and send to the selected printer(s) — tick a printer under SEND TO')} onClick={() => { if (selected.size === 0) { setSide('global'); toast(t('v2.slicer.pick_printer_send', 'Tick a printer under SEND TO (bottom of the left panel) first'), 'error'); return; } run(false); }}>{t('v2.slicer.print_plate', 'Print plate')}</button>
          {plates.length > 1 && <button className="oslice-printplate" disabled={busy || selected.size === 0} title={t('v2.slicer.printall_hint', 'Slice and send every plate to the selected printer(s)')} onClick={() => printAllPlates(false)}>{t('v2.slicer.print_all', 'Print all')}</button>}
          <button className="oslice-fullbtn" title={full ? t('v2.slicer.exit_full', 'Exit fullscreen') : t('v2.slicer.fullscreen', 'Fullscreen')} onClick={() => setFull((f) => !f)}>{full ? <IconCollapse /> : <IconExpand />}</button>
        </div>
      </div>

      <div className="oslice-body">
        {/* LEFT — settings panel (white). Hidden on the full-width tabs
            (Device / Filaments / Calibration) so they span the whole area like
            BambuStudio; kept mounted so its state survives tab switches. */}
        <aside className={`oslice-panel${tab === 'prepare' || tab === 'preview' ? '' : ' oslice-panel--hidden'}`}>
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
              <div className="oslice-nozzlerow">
                <label><span className="oslice-sectlbl">{t('v2.slicer.nozzle_dia', 'Nozzle')}</span>
                  <select className="oset-input" value={(settings.nozzle_diameter as number) ?? 0.4} onChange={(e) => { const d = Number(e.target.value); setSettings((s) => ({ ...s, nozzle_diameter: d, line_width: +(d * 1.05).toFixed(2), outer_wall_line_width: +(d * 1.05).toFixed(2), inner_wall_line_width: +(d * 1.125).toFixed(2) })); }}>
                    {[0.2, 0.4, 0.6, 0.8].map((d) => <option key={d} value={d}>{d} mm</option>)}
                  </select>
                </label>
                <label><span className="oslice-sectlbl">{t('v2.slicer.flow', 'Flow')}</span>
                  <select className="oset-input" value={(settings.flow_ratio as number) ?? 1} onChange={(e) => setSettings((s) => ({ ...s, flow_ratio: Number(e.target.value) }))}>
                    <option value={1}>{t('v2.slicer.flow_std', 'Standard')}</option>
                    <option value={1.05}>{t('v2.slicer.flow_high', 'High flow')}</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Filament + temps */}
          <div className="oslice-filaments">
            <div className="oslice-sectlbl" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              {t('v2.slset.filament', 'Filament / AMS')}
              {(selPrinter?.colorSlots ?? 0) > 1 && (
                <span style={{ fontSize: '0.62rem', fontWeight: 400, color: 'var(--text-dim, #999)', letterSpacing: 0 }}>
                  {selPrinter?.multiTool
                    ? t('v2.slset.tools_n', '{n} tools').replace('{n}', String(selPrinter?.colorSlots))
                    : t('v2.slset.ams_n', 'AMS · {n}').replace('{n}', String(selPrinter?.colorSlots))}
                </span>
              )}
              {(selPrinter?.ams?.length ?? 0) > 0 && (
                <button className="btn btn--sm btn--ghost" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => loadFromAms(selPrinter!.ams!)}>
                  {selPrinter?.multiTool ? t('v2.slset.from_tools', 'From tools') : t('v2.slset.from_ams', 'From AMS')}
                </button>
              )}
              <button className="oslice-filadd" title={t('v2.slset.add_filament', 'Add filament')} onClick={addSlot} disabled={filaments.length >= (selPrinter?.colorSlots ?? 8)} style={{ marginLeft: (selPrinter?.ams?.length ?? 0) > 0 ? '0' : 'auto' }}>+</button>
            </div>
            {filaments.length > 1 && (
              <button className="btn btn--sm btn--ghost" style={{ fontSize: '0.66rem', padding: '2px 8px', marginBottom: 6, alignSelf: 'flex-start' }} onClick={() => setPurgeOpen(true)} title={t('v2.slset.purge_hint', 'Flush volumes per colour change (waste as infill)')}>
                {t('v2.slset.purge', 'Purge volumes')}{flushMatrix ? ' ●' : ''}
              </button>
            )}
            {filaments.map((f, i) => {
              // Match this slot against real spool inventory. When a slice exists,
              // the single-colour need is the whole print (multi-colour is split
              // evenly as an estimate) so we can flag insufficient stock.
              const needG = preview ? (filaments.length === 1 ? preview.filamentG : preview.filamentG / filaments.length) : 0;
              const m = matchSpools(f.color, f.material, spools, needG);
              return (
              <div className="oslice-filslot" key={i}>
                <div className="oslice-filrow">
                  <label className="oslice-filbadge" style={{ background: f.color, color: badgeTextColor(f.color), boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.18)', cursor: 'pointer' }}>
                    {i + 1}
                    <input type="color" value={f.color} onChange={(e) => setSlot(i, { color: e.target.value })} style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} />
                  </label>
                  <select className="oslice-preset-sel oslice-filname" value={f.material} onChange={(e) => setSlot(i, { material: e.target.value })}>
                    {Object.keys(MATERIALS).map((m2) => <option key={m2} value={m2}>{m2}</option>)}
                  </select>
                  {filaments.length > 1 && <button className="oslice-filadd" title={t('v2.slset.remove', 'Remove')} onClick={() => removeSlot(i)}>−</button>}
                </div>
                <div className={`oslice-spoolmatch${preview && m.matched && !m.sufficient ? ' oslice-spoolmatch--short' : ''}`}>
                  {m.matched
                    ? <>{t('v2.slset.in_stock', 'In stock')} {Math.round(m.availableG)} g · {m.spoolCount} {t('v2.slset.spools', 'spool(s)')}{m.costPerG >= 0 ? ` · ${m.costPerG.toFixed(2)} kr/g` : ''}{preview && !m.sufficient ? ` · ${t('v2.slset.short', 'short')} ${Math.round(m.deficitG)} g` : ''}</>
                    : <span className="muted">{t('v2.slset.no_spool', 'No matching spool in inventory')}</span>}
                </div>
              </div>
              );
            })}
            <div className="oslice-temps" style={{ marginTop: 8 }}>
              <label className="oset-field"><span className="oslice-sectlbl">{t('v2.slset.nozzle', 'Nozzle °C')}</span><input className="oset-input" type="number" value={(settings.nozzle_temp as number) ?? ''} onChange={(e) => setSettings((s) => ({ ...s, nozzle_temp: e.target.value }))} /></label>
              <label className="oset-field"><span className="oslice-sectlbl">{t('v2.slset.bed', 'Bed °C')}</span><input className="oset-input" type="number" value={(settings.bed_temp as number) ?? ''} onChange={(e) => setSettings((s) => ({ ...s, bed_temp: e.target.value }))} /></label>
            </div>
            <label className="oslice-calibrow" title={t('v2.slset.calib_hint', 'Apply the saved pressure-advance calibration for the matched spool + printer')}>
              <input type="checkbox" checked={autoCalib} onChange={(e) => setAutoCalib(e.target.checked)} />
              {t('v2.slset.fleet_calib', 'Fleet calibration')}
              {calibK != null && <span className="oslice-calibk">K {calibK.toFixed(3)}</span>}
            </label>
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
            <div className="oslice-presetctl" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span className="oslice-sectlbl" style={{ minWidth: 54, fontSize: '0.6rem' }}>{t('v2.slset.process', 'Process')}</span>
                <select className="oset-input" style={{ maxWidth: 110 }} value={profileId.process ?? ''} onChange={(e) => applyProfile('process', e.target.value ? Number(e.target.value) : null)} title={t('v2.slset.profile', 'Process profile')}>
                  <option value="">{profiles.process.length ? t('v2.slset.load_profile', 'Profile…') : t('v2.slset.none_saved', 'no profiles')}</option>
                  {profiles.process.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button className="btn btn--sm btn--ghost" onClick={() => saveProfile('process')} title={t('v2.slset.save_profile_hint', 'Save current settings as a profile')}>{t('v2.slset.save', 'Save')}</button>
                {profileId.process != null && <button className="btn btn--sm btn--ghost" onClick={() => deleteProfile('process')} title={t('v2.slset.delete', 'Delete')}>×</button>}
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span className="oslice-sectlbl" style={{ minWidth: 54, fontSize: '0.6rem' }}>{t('v2.slset.filament_short', 'Filament')}</span>
                <select className="oset-input" style={{ maxWidth: 110 }} value={profileId.filament ?? ''} onChange={(e) => applyProfile('filament', e.target.value ? Number(e.target.value) : null)} title={t('v2.slset.filament_profile', 'Filament profile (temps, retraction, cooling)')}>
                  <option value="">{profiles.filament.length ? t('v2.slset.load_profile', 'Profile…') : t('v2.slset.none_saved', 'no profiles')}</option>
                  {profiles.filament.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button className="btn btn--sm btn--ghost" onClick={() => saveProfile('filament')} title={t('v2.slset.save_filament_hint', 'Save material temps/retraction/cooling as a filament profile')}>{t('v2.slset.save', 'Save')}</button>
                {profileId.filament != null && <button className="btn btn--sm btn--ghost" onClick={() => deleteProfile('filament')} title={t('v2.slset.delete', 'Delete')}>×</button>}
              </div>
              {(profileId.process != null || profileId.filament != null) && selPrinter?.id && (
                <button className="btn btn--sm btn--ghost" style={{ fontSize: '0.62rem', alignSelf: 'flex-start' }} onClick={pinToPrinter} title={t('v2.slset.pin_hint', 'Auto-apply these profiles when this printer is selected')}>
                  {bindings[selPrinter.id]?.process === profileId.process && bindings[selPrinter.id]?.filament === profileId.filament
                    ? t('v2.slset.pinned_to', 'Pinned to {name}').replace('{name}', selPrinter.name)
                    : t('v2.slset.pin_to', 'Pin to {name}').replace('{name}', selPrinter.name)}
                </button>
              )}
            </div>
          </div>

          <div className="oslice-panelbody">
            {side === 'global' && <SlicerProcessTabs value={settings} onChange={setSettings} />}
            {side === 'objects' && (
              <>
                <div className="oslice-objlist">
                  {toolState.names.length === 0 && <p className="muted micro" style={{ padding: 10 }}>{t('v2.slicer.no_objects', 'No objects on the plate.')}</p>}
                  {(() => {
                    // Order the flat list as a tree: each top-level object followed by
                    // its attached part volumes (children), so parts nest visually.
                    const order: number[] = [];
                    toolState.names.forEach((_, i) => {
                      if ((toolState.partParents[i] ?? -1) < 0) {
                        order.push(i);
                        toolState.names.forEach((__, j) => { if (toolState.partParents[j] === i) order.push(j); });
                      }
                    });
                    return order.map((i) => {
                      const pt = toolState.partTypes[i] || '';
                      const isPart = !!pt;
                      const badge = pt === 'negative' ? t('v2.part.negative', 'Negative') : pt === 'enforcer' ? t('v2.part.enforcer', 'Support+') : pt === 'blocker' ? t('v2.part.blocker', 'Support−') : pt === 'modifier' ? t('v2.part.modifier', 'Modifier') : '';
                      return (
                        <div key={i} role="button" tabIndex={0}
                          className={`oslice-objitem${toolState.selIndex === i ? ' oslice-objitem--on' : ''}${isPart ? ' oslice-objitem--part' : ''}`}
                          style={isPart ? { paddingLeft: 24 } : undefined}
                          onClick={() => plateRef.current?.selectAt(i)}
                          onContextMenu={(e) => { e.preventDefault(); plateRef.current?.selectAt(i); setCtxMenu({ x: e.clientX, y: e.clientY, i }); }}>
                          {isPart && <span className="oslice-treeglyph">└</span>}
                          <span className="ellipsis" style={toolState.hidden[i] ? { opacity: 0.45 } : undefined}>{toolState.names[i]}</span>
                          {badge && <span className={`oslice-partbadge oslice-partbadge--${pt}`}>{badge}</span>}
                          {!isPart && (
                            <button className="oslice-objeye" title={toolState.hidden[i] ? t('v2.obj.show', 'Show') : t('v2.obj.hide', 'Hide')}
                              onClick={(e) => { e.stopPropagation(); plateRef.current?.setVisible(i, !!toolState.hidden[i]); }}>
                              {toolState.hidden[i] ? <IconEyeOff /> : <IconEye />}
                            </button>
                          )}
                          <button className="oslice-objdel" title={t('v2.obj.delete', 'Delete')} onClick={(e) => { e.stopPropagation(); plateRef.current?.selectAt(i); plateRef.current?.remove(); }}>×</button>
                        </div>
                      );
                    });
                  })()}
                </div>
                {obj && toolState.selIndex >= 0 && !toolState.partTypes[toolState.selIndex] && (
                  <div className="oslice-partadd">
                    <span className="oslice-sectlbl">{t('v2.part.add', 'Add part volume')}</span>
                    <div className="oslice-partadd-row">
                      <button className="btn btn--xs btn--ghost" title={t('v2.part.negative_hint', 'Cut a cavity from this object')} onClick={() => plateRef.current?.addPart('negative', 'cube')}>＋ {t('v2.part.negative', 'Negative')}</button>
                      <button className="btn btn--xs btn--ghost" title={t('v2.part.negcyl_hint', 'Cylindrical cavity')} onClick={() => plateRef.current?.addPart('negative', 'cylinder')}>＋ {t('v2.part.negcyl', 'Neg. cylinder')}</button>
                    </div>
                    <div className="oslice-partadd-row">
                      <button className="btn btn--xs btn--ghost" title={t('v2.part.enforcer_hint', 'Force support inside this volume')} onClick={() => plateRef.current?.addPart('enforcer', 'cube')}>＋ {t('v2.part.enforcer', 'Support enforcer')}</button>
                      <button className="btn btn--xs btn--ghost" title={t('v2.part.blocker_hint', 'Forbid support inside this volume')} onClick={() => plateRef.current?.addPart('blocker', 'cube')}>＋ {t('v2.part.blocker', 'Support blocker')}</button>
                    </div>
                    <div className="oslice-partadd-row">
                      <button className="btn btn--xs btn--ghost" title={t('v2.part.modifier_hint', 'Override infill settings inside this volume')} onClick={() => plateRef.current?.addPart('modifier', 'cube')}>＋ {t('v2.part.modifier', 'Modifier')}</button>
                    </div>
                    <p className="muted micro" style={{ margin: '2px 0 0' }}>{t('v2.part.parts_note', 'A negative volume carves a cavity; a support enforcer/blocker forces or forbids support inside it. Move/scale the volume to shape the region.')}</p>
                  </div>
                )}
                {obj && toolState.selIndex >= 0 && toolState.partTypes[toolState.selIndex] === 'modifier' && (() => {
                  const st = plateRef.current?.getModifierSettings() ?? {};
                  return (
                    <div className="oslice-partadd">
                      <span className="oslice-sectlbl">{t('v2.part.modifier_settings', 'Modifier — infill override')}</span>
                      <label className="field"><span className="field-label">{t('v2.slset.infill', 'Infill')} (%)</span>
                        <input className="input" type="number" step={5} value={st.infill_density ?? ''} placeholder={String(settings.infill_density ?? '')} onChange={(e) => plateRef.current?.setModifierSetting('infill_density', e.target.value)} /></label>
                      <label className="field"><span className="field-label">{t('v2.slset.pattern', 'Pattern')}</span>
                        <select className="input" value={st.infill_pattern ?? ''} onChange={(e) => plateRef.current?.setModifierSetting('infill_pattern', e.target.value)}>
                          <option value="">{t('v2.slset.inherit', '(inherit)')}</option>
                          {['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'line', 'concentric'].map((p) => <option key={p} value={p}>{p}</option>)}
                        </select></label>
                      <p className="muted micro" style={{ margin: '2px 0 0' }}>{t('v2.part.modifier_note', 'Overrides the global infill only inside this volume. Move/scale it to shape the region.')}</p>
                    </div>
                  );
                })()}
                {obj
                  ? <ObjectPanel info={obj} onPos={(x, y) => plateRef.current?.setPos(x, y)} onRot={(x, y, z) => plateRef.current?.setRot(x, y, z)} onScalePct={(p) => plateRef.current?.setScalePct(p)} onDim={(a, mm, u) => plateRef.current?.setDim(a, mm, u)} onMirror={(a) => plateRef.current?.mirror(a)} onReset={() => plateRef.current?.resetXform()} onScaleToFit={() => plateRef.current?.scaleToFit()} onRotate90={(a) => plateRef.current?.rotate90(a)} onDuplicate={() => plateRef.current?.duplicateN(1)} />
                  : <p className="muted empty-note" style={{ padding: 16 }}>{t('v2.slicer.select_obj', 'Select an object to edit it.')}</p>}
                {obj && toolState.selIndex >= 0 && !toolState.partTypes[toolState.selIndex] && (() => {
                  const ov = objOverrides[toolState.selIndex] ?? {};
                  const setOv = (k: string, v: string | boolean) => setObjOverrides((prev) => ({ ...prev, [toolState.selIndex]: { ...(prev[toolState.selIndex] ?? {}), [k]: v } }));
                  const numOv: [string, string, number][] = [
                    ['layer_height', t('v2.slset.layer_h', 'Layer height'), 0.02],
                    ['infill_density', t('v2.slset.infill', 'Infill %'), 5],
                    ['wall_loops', t('v2.slset.walls', 'Wall loops'), 1],
                    ['top_layers', t('v2.slset.top', 'Top layers'), 1],
                    ['bottom_layers', t('v2.slset.bottom', 'Bottom layers'), 1],
                    ['outer_wall_speed', t('v2.slset.owspeed', 'Outer wall speed'), 5],
                    ['nozzle_temp', t('v2.slset.nozzle', 'Nozzle temp'), 5],
                  ];
                  return (
                    <section className="card slicer-card">
                      <div className="obj-group-label" style={{ marginTop: 0 }}>{t('v2.obj.overrides', 'Per-object print settings')}</div>
                      <p className="muted micro" style={{ margin: '0 0 8px' }}>{t('v2.obj.overrides_hint', 'Override the global settings for this object only.')}</p>
                      <div className="slset-grid">
                        {numOv.map(([k, label, step]) => (
                          <label className="field" key={k}><span className="field-label">{label}</span><input className="input" type="number" step={step} value={(ov[k] as string) ?? ''} placeholder={String(settings[k] ?? '')} onChange={(e) => setOv(k, e.target.value)} /></label>
                        ))}
                        <label className="field"><span className="field-label">{t('v2.slset.pattern', 'Infill pattern')}</span>
                          <select className="input" value={(ov.infill_pattern as string) ?? ''} onChange={(e) => setOv('infill_pattern', e.target.value)}>
                            <option value="">{t('v2.slset.inherit', '(inherit)')}</option>
                            {['grid', 'gyroid', 'honeycomb', 'cubic', 'triangles', 'line', 'concentric'].map((p) => <option key={p} value={p}>{p}</option>)}
                          </select></label>
                        <label className="chk" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!ov.supports} onChange={(e) => setOv('supports', e.target.checked)} /> {t('v2.slset.supports', 'Supports')}</label>
                        <label className="chk" style={{ alignSelf: 'end' }}><input type="checkbox" checked={!!ov.spiral_mode} onChange={(e) => setOv('spiral_mode', e.target.checked)} /> {t('v2.slset.vase', 'Vase')}</label>
                      </div>
                      {objOverrides[toolState.selIndex] && <button className="btn btn--sm btn--ghost" style={{ marginTop: 8 }} onClick={() => setObjOverrides((prev) => { const n = { ...prev }; delete n[toolState.selIndex]; return n; })}>{t('v2.obj.clear_override', 'Clear overrides')}</button>}
                    </section>
                  );
                })()}
                {/* Variable layer height: user-defined Z bands (model-local mm). */}
                <section className="card slicer-card">
                  <div className="obj-group-label" style={{ marginTop: 0 }}>{t('v2.varlh.title', 'Variable layer height')}</div>
                  <p className="muted micro" style={{ margin: '0 0 8px' }}>{t('v2.varlh.hint', 'Set a layer thickness for a height range (mm, from the model base). Finer = smoother curves, coarser = faster.')}</p>
                  {layerBands.length > 0 && (() => {
                    const refH = Math.max(obj?.dimZ ?? 0, ...layerBands.map((b) => b.z1), 1);
                    return (
                      <div className="oslice-varlh-bar" title={t('v2.varlh.bar', 'Zone coverage over model height')}>
                        {layerBands.map((b, i) => (
                          <div key={i} className="oslice-varlh-seg" style={{ left: `${(Math.min(b.z0, b.z1) / refH) * 100}%`, width: `${(Math.abs(b.z1 - b.z0) / refH) * 100}%`, opacity: Math.max(0.35, Math.min(1, 0.3 / Math.max(0.04, b.h))) }} />
                        ))}
                      </div>
                    );
                  })()}
                  {layerBands.map((band, i) => {
                    const upd = (k: 'z0' | 'z1' | 'h', v: number) => setLayerBands((bs) => bs.map((b, j) => (j === i ? { ...b, [k]: v } : b)));
                    return (
                      <div className="oslice-varlh-row" key={i}>
                        <input className="input" type="number" step={1} value={band.z0} title={t('v2.varlh.from', 'From Z')} onChange={(e) => upd('z0', +e.target.value)} />
                        <span className="muted">→</span>
                        <input className="input" type="number" step={1} value={band.z1} title={t('v2.varlh.to', 'To Z')} onChange={(e) => upd('z1', +e.target.value)} />
                        <input className="input" type="number" step={0.02} value={band.h} title={t('v2.varlh.height', 'Layer height')} onChange={(e) => upd('h', +e.target.value)} />
                        <button className="oslice-objdel" title={t('v2.obj.delete', 'Delete')} onClick={() => setLayerBands((bs) => bs.filter((_, j) => j !== i))}>×</button>
                      </div>
                    );
                  })}
                  <button className="btn btn--xs btn--ghost" style={{ marginTop: 6 }} onClick={() => setLayerBands((bs) => [...bs, { z0: bs.length ? bs[bs.length - 1].z1 : 0, z1: (bs.length ? bs[bs.length - 1].z1 : 0) + 5, h: 0.12 }])}>＋ {t('v2.varlh.add', 'Add zone')}</button>
                </section>
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
          {tab === 'prepare' && (
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
            {action(<IconResetView />, t('v2.plate.reset_view', 'Reset view'), () => plateRef.current?.resetView())}
            <span className="oslice-rail-sep" />
            {action(<IconAutoOrient />, t('v2.plate.orient', 'Auto-orient (least support)'), () => plateRef.current?.autoOrient(), !toolState.hasSel)}
            <button className={`oslice-tool${placeFace ? ' oslice-tool--on' : ''}`} title={t('v2.plate.placeface', 'Place on face — click a facet to set it on the plate')} disabled={!toolState.hasSel} onClick={togglePlaceFace}><IconPlaceFace /></button>
            {action(<IconSplit />, t('v2.plate.split', 'Split to parts'), () => plateRef.current?.splitToParts(), !toolState.hasSel)}
            {action(<IconSimplify />, t('v2.plate.simplify', 'Simplify mesh (halve triangles)'), () => plateRef.current?.simplify(), !toolState.hasSel)}
            <button className={`oslice-tool${measuring ? ' oslice-tool--on' : ''}`} title={t('v2.plate.measure', 'Measure — click two points')} onClick={toggleMeasure}><IconMeasure /></button>
            <span className="oslice-rail-sep" />
            <button className={`oslice-tool${paint?.ch === 'support' ? ' oslice-tool--on' : ''}`} title={t('v2.plate.support_paint', 'Support painting — brush enforce / block regions')} disabled={!toolState.hasSel} onClick={() => togglePaint('support')}><IconSupportPaint /></button>
            <button className={`oslice-tool${paint?.ch === 'seam' ? ' oslice-tool--on' : ''}`} title={t('v2.plate.seam_paint', 'Seam painting — place / avoid the Z-seam')} disabled={!toolState.hasSel} onClick={() => togglePaint('seam')}><IconSeamPaint /></button>
            <button className={`oslice-tool${paint?.ch === 'color' ? ' oslice-tool--on' : ''}`} title={t('v2.plate.color_paint', 'Colour painting — brush a filament onto the model')} disabled={!toolState.hasSel} onClick={() => togglePaint('color')}><IconColorPaint /></button>
            <button className={`oslice-tool${paint?.ch === 'fuzzy' ? ' oslice-tool--on' : ''}`} title={t('v2.plate.fuzzy_paint', 'Fuzzy-skin painting — brush textured regions')} disabled={!toolState.hasSel} onClick={() => togglePaint('fuzzy')}><IconFuzzy /></button>
            <button className={`oslice-tool${cutOpen ? ' oslice-tool--on' : ''}`} title={t('v2.plate.cut', 'Cut — split the model along a plane')} disabled={!toolState.hasSel} onClick={toggleCut}><IconCut /></button>
            <button className={`oslice-tool${boolOpen ? ' oslice-tool--on' : ''}`} title={t('v2.plate.boolean', 'Boolean — union / subtract / intersect')} disabled={toolState.count < 2} onClick={() => { setBoolOpen((o) => !o); setShapeOpen(false); }}><IconBoolean /></button>
            <button className={`oslice-tool${shapeOpen ? ' oslice-tool--on' : ''}`} title={t('v2.plate.add_shape', 'Add a primitive shape')} onClick={() => { setShapeOpen((o) => !o); setBoolOpen(false); }}><IconShape /></button>
            <button className={`oslice-tool${textOpen ? ' oslice-tool--on' : ''}`} title={t('v2.plate.add_text', 'Add 3D text')} onClick={() => { setTextOpen((o) => !o); setBoolOpen(false); setShapeOpen(false); }}><IconText /></button>
            <button className="oslice-tool" title={t('v2.plate.color_layer', 'Colour layer — image → printable relief')} onClick={() => setColorLayerOpen(true)}><IconImage /></button>
            <input ref={addInputRef} type="file" accept={formats.join(',')} multiple hidden onChange={(e) => { const fs = e.target.files ? Array.from(e.target.files) : []; e.currentTarget.value = ''; onPickInput(fs); }} />
          </div>
          )}

          {/* Cut tool bar — height slider + which half to keep. */}
          {tab === 'prepare' && cutOpen && (
            <div className="oslice-paintbar oslice-cutbar">
              <span className="oslice-paintbar-t">{t('v2.plate.cut', 'Cut')}</span>
              <input type="range" min={1} max={99} value={Math.round(cutFrac * 100)} style={{ width: 130 }}
                onChange={(e) => { const f = Number(e.target.value) / 100; setCutFrac(f); plateRef.current?.setCutPreview(f); }} />
              <span className="muted micro tnum" style={{ minWidth: 34 }}>{Math.round(cutFrac * 100)}%</span>
              {(['both', 'upper', 'lower'] as const).map((k) => (
                <button key={k} className={`btn btn--sm${cutKeep === k ? '' : ' btn--ghost'}`} onClick={() => setCutKeep(k)}>
                  {k === 'both' ? t('v2.plate.cut_both', 'Both') : k === 'upper' ? t('v2.plate.cut_upper', 'Upper') : t('v2.plate.cut_lower', 'Lower')}
                </button>
              ))}
              <span className="muted micro" style={{ marginLeft: 6 }}>{t('v2.plate.cut_conn', 'Connectors')}</span>
              <select className="oset-input" style={{ maxWidth: 52 }} value={cutConn} onChange={(e) => setCutConn(Number(e.target.value))}>
                {[0, 1, 2, 4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <button className="btn btn--sm" onClick={applyCut}>{t('v2.plate.cut_apply', 'Cut')}</button>
              <button className="btn btn--sm btn--ghost" onClick={toggleCut}>{t('common.cancel', 'Cancel')}</button>
            </div>
          )}

          {/* Boolean op bar. */}
          {tab === 'prepare' && boolOpen && (
            <div className="oslice-paintbar oslice-cutbar">
              <span className="oslice-paintbar-t">{t('v2.plate.boolean', 'Boolean')}</span>
              <button className="btn btn--sm" onClick={() => doBoolean('union')}>{t('v2.plate.bool_union', 'Union')}</button>
              <button className="btn btn--sm" onClick={() => doBoolean('subtract')}>{t('v2.plate.bool_subtract', 'Subtract')}</button>
              <button className="btn btn--sm" onClick={() => doBoolean('intersect')}>{t('v2.plate.bool_intersect', 'Intersect')}</button>
              <span className="muted micro">{t('v2.plate.bool_hint', 'selected − others')}</span>
              <button className="btn btn--sm btn--ghost" onClick={() => setBoolOpen(false)}>{t('common.cancel', 'Cancel')}</button>
            </div>
          )}
          {/* Add-primitive bar. */}
          {tab === 'prepare' && shapeOpen && (
            <div className="oslice-paintbar oslice-cutbar">
              <span className="oslice-paintbar-t">{t('v2.plate.add_shape', 'Add shape')}</span>
              <button className="btn btn--sm" onClick={() => doAddShape('cube')}>{t('v2.plate.shape_cube', 'Cube')}</button>
              <button className="btn btn--sm" onClick={() => doAddShape('cylinder')}>{t('v2.plate.shape_cyl', 'Cylinder')}</button>
              <button className="btn btn--sm" onClick={() => doAddShape('sphere')}>{t('v2.plate.shape_sphere', 'Sphere')}</button>
              <button className="btn btn--sm btn--ghost" onClick={() => setShapeOpen(false)}>{t('common.cancel', 'Cancel')}</button>
            </div>
          )}

          {/* Add-text bar. */}
          {tab === 'prepare' && textOpen && (
            <div className="oslice-paintbar oslice-cutbar">
              <span className="oslice-paintbar-t">{t('v2.plate.add_text', '3D text')}</span>
              <input className="oset-input" style={{ width: 160 }} autoFocus value={textVal} onChange={(e) => setTextVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') doAddText(); }} placeholder={t('v2.plate.text_ph', 'Text…')} />
              <button className="btn btn--sm" onClick={doAddText}>{t('v2.plate.text_add', 'Add')}</button>
              <button className="btn btn--sm btn--ghost" onClick={() => setTextOpen(false)}>{t('common.cancel', 'Cancel')}</button>
            </div>
          )}

          {/* Multi-plate tabs — each plate keeps its own arrangement; when an
              object is selected you can send it to another plate. */}
          {(tab === 'prepare' || tab === 'preview') && (
            <div className={`oslice-plates${tab === 'preview' ? ' oslice-plates--preview' : ''}`}>
              {tab === 'prepare' && toolState.hasSel && plates.length > 1 && (
                <span className="oslice-moveto">
                  <span className="muted micro">{t('v2.plate.move_to', 'Move to')}</span>
                  {plates.map((pl, i) => (i === activePlate ? null : (
                    <button key={pl.id} className="oslice-platetab oslice-platetab--move" title={`${t('v2.plate.move_to', 'Move to')} ${pl.name}`} onClick={() => moveSelectedToPlate(i)}>{i + 1}</button>
                  )))}
                </span>
              )}
              {plates.map((pl, i) => {
                const n = i === activePlate ? toolState.count : (pl.snap?.length ?? 0);
                return (
                  <span key={pl.id} className={`oslice-platetab${i === activePlate ? ' oslice-platetab--on' : ''}`} onClick={() => switchPlate(i)} title={`${pl.name} · ${n} ${t('v2.plate.objects', 'object(s)')}`}>
                    {i + 1}{n > 0 && <em className="oslice-platetab-c">{n}</em>}
                    {plates.length > 1 && <button className="oslice-platetab-x" title={t('v2.plate.plate_del', 'Delete plate')} onClick={(e) => { e.stopPropagation(); deletePlate(i); }}>×</button>}
                  </span>
                );
              })}
              <button className="oslice-platetab oslice-platetab--add" title={t('v2.plate.plate_add', 'Add plate')} onClick={addPlate}>+</button>
              {plates.length > 1 && tab === 'prepare' && (
                <button className={`oslice-platetab oslice-platetab--all${allView ? ' oslice-platetab--on' : ''}`} title={t('v2.plate.all_plates', 'Show all plates at once')} onClick={toggleAllView}>{allView ? t('v2.plate.one_plate', 'Single') : t('v2.plate.all', 'All')}</button>
              )}
            </div>
          )}

          {/* Paint brush selector — shown while a paint tool is active. */}
          {tab === 'prepare' && paint && (
            <div className="oslice-paintbar">
              <span className="oslice-paintbar-t">
                {paint.ch === 'support' ? t('v2.plate.support_paint', 'Support painting')
                  : paint.ch === 'seam' ? t('v2.plate.seam_paint', 'Seam painting')
                    : paint.ch === 'fuzzy' ? t('v2.plate.fuzzy_paint', 'Fuzzy skin')
                      : t('v2.plate.color_paint', 'Colour painting')}
              </span>
              {paint.ch === 'fuzzy' ? (
                <>
                  <button className={`btn btn--sm${paint.val === 1 ? '' : ' btn--ghost'}`} onClick={() => applyPaint({ ch: 'fuzzy', val: 1 })}><i className="oslice-paintdot" style={{ background: '#a855f7' }} />{t('v2.plate.paint_on', 'Fuzzy')}</button>
                  <button className={`btn btn--sm${paint.val === 0 ? '' : ' btn--ghost'}`} onClick={() => applyPaint({ ch: 'fuzzy', val: 0 })}>{t('v2.plate.paint_erase', 'Erase')}</button>
                </>
              ) : paint.ch === 'color' ? (
                <>
                  {slotColors.map((col, i) => (
                    <button key={i} className={`oslice-paintswatch${paint.val === i + 1 ? ' oslice-paintswatch--on' : ''}`} title={`${t('v2.slset.filament', 'Filament')} ${i + 1}`} style={{ background: col }} onClick={() => applyPaint({ ch: 'color', val: i + 1 })} />
                  ))}
                  <button className={`btn btn--sm${paint.val === 0 ? '' : ' btn--ghost'}`} onClick={() => applyPaint({ ch: 'color', val: 0 })}>{t('v2.plate.paint_erase', 'Erase')}</button>
                </>
              ) : (
                <>
                  <button className={`btn btn--sm${paint.val === 1 ? '' : ' btn--ghost'}`} onClick={() => applyPaint({ ch: paint.ch, val: 1 })}><i className="oslice-paintdot" style={{ background: paint.ch === 'seam' ? '#2fbf6f' : '#2f7be0' }} />{t('v2.plate.paint_enforce', 'Enforce')}</button>
                  <button className={`btn btn--sm${paint.val === 2 ? '' : ' btn--ghost'}`} onClick={() => applyPaint({ ch: paint.ch, val: 2 })}><i className="oslice-paintdot" style={{ background: paint.ch === 'seam' ? '#e08a2f' : '#e0463c' }} />{t('v2.plate.paint_block', 'Block')}</button>
                  <button className={`btn btn--sm${paint.val === 0 ? '' : ' btn--ghost'}`} onClick={() => applyPaint({ ch: paint.ch, val: 0 })}>{t('v2.plate.paint_erase', 'Erase')}</button>
                </>
              )}
              <button className="btn btn--sm btn--ghost" onClick={() => plateRef.current?.clearPaint(paint.ch)}>{t('v2.plate.paint_clear', 'Clear all')}</button>
              <button className="btn btn--sm btn--ghost" onClick={() => applyPaint(null)}>{t('common.done', 'Done')}</button>
            </div>
          )}

          {/* The build plate is always visible, like Bambu Studio. */}
          {tab === 'prepare' && (
            <Suspense fallback={<div className="oslice-loading">{t('common.loading', 'Loading…')}</div>}>
              <PlateViewer ref={plateRef} file={file} bed={bed} bedY={bedY} onObject={setObj} onState={setToolState} onContextMenu={(x, y, i) => setCtxMenu({ x, y, i })} slotColors={slotColors} showOrder={settings.print_sequence === 'by_object' && toolState.count > 1} clearance={Number(settings.extruder_clearance_radius) || 0} onMovePlate={movePlateObject} />
            </Suspense>
          )}
          {tab === 'preview' && preview && (
            <Suspense fallback={<div className="oslice-loading">{t('common.loading', 'Loading…')}</div>}>
              <div className="oslice-previewroot">
                <div className="oslice-previewbar">
                  <button className="btn btn--sm" onClick={() => downloadGcode()}>{t('v2.slicer.download_gcode', 'Download G-code')}</button>
                </div>
                <GcodePreview gcode={preview.gcode} bed={bed} bedY={bedY} slotColors={slotColors} pricePerGram={pricePerGram} lineWidth={Number(settings.line_width) || 0.42} colorChangeLayers={colorChangeLayers} onAddColorChange={addColorChange} onRemoveColorChange={removeColorChange} />
              </div>
            </Suspense>
          )}
          {tab === 'device' && <SlicerDevice printer={selPrinter} live={livePrinters[selPrinter?.id ?? '']} printers={slicerPrinters} onSelect={setProfilePrinter} />}
          {tab === 'filaments' && <SlicerFilaments spools={spools} printers={printers} onApply={(color, material) => { setSlot(0, { color, material }); toast(t('v2.filmgr.loaded', 'Loaded into slot 1'), 'success'); setTab('prepare'); }} />}
          {tab === 'calibration' && <SlicerCalibration onPreview={(r) => setPreview({ gcode: r.gcode, layers: 0, timeSec: r.timeSec, filamentG: r.filamentG, wasteG: 0, durationMs: 0 })} />}
          {!file && toolState.count === 0 && tab === 'prepare' && (
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

          {/* Plate overlays (axis gizmo, plate label + number) belong to the
              editing plate only — on Preview they collide with the layer
              scrubber, and BambuStudio hides that chrome there too. */}
          {tab === 'prepare' && (<>
            <div className="oslice-axis" aria-hidden>
              <svg viewBox="0 0 40 40" width="48" height="48">
                <line x1="12" y1="28" x2="30" y2="28" stroke="#e0603a" strokeWidth="2" /><text x="31" y="31" fill="#e0603a" fontSize="8">X</text>
                <line x1="12" y1="28" x2="20" y2="14" stroke="#37a66b" strokeWidth="2" /><text x="21" y="13" fill="#37a66b" fontSize="8">Y</text>
                <line x1="12" y1="28" x2="12" y2="8" stroke="#3d8bd8" strokeWidth="2" /><text x="6" y="9" fill="#3d8bd8" fontSize="8">Z</text>
              </svg>
            </div>
            <div className="oslice-platename" aria-hidden>{selPrinter?.name ? `${selPrinter.name} · ` : ''}{bed}×{bedY} mm</div>
            <div className="oslice-plateno" aria-hidden>01</div>
          </>)}
        </div>
      </div>

      {ctxMenu && (
        <>
          <div className="oslice-ctx-backdrop" onClick={() => setCtxMenu(null)} onContextMenu={(e) => { e.preventDefault(); setCtxMenu(null); }} />
          {(() => {
            const isPart = !!toolState.partTypes[ctxMenu.i];
            // Select the object, run an action on the plate handle, close the menu.
            const act = (fn: (h: NonNullable<typeof plateRef.current>) => void) => { plateRef.current?.selectAt(ctxMenu.i); if (plateRef.current) fn(plateRef.current); setCtxMenu(null); };
            return (
              <div className="oslice-ctxmenu" style={{ top: ctxMenu.y, left: ctxMenu.x, transform: ctxMenu.y > window.innerHeight * 0.55 ? 'translateY(-100%)' : undefined }}>
                {!isPart && (
                  <>
                    <button onClick={() => act((h) => h.addPart('negative', 'cube'))}>＋ {t('v2.part.negative', 'Negative part')}</button>
                    <button onClick={() => act((h) => h.addPart('enforcer', 'cube'))}>＋ {t('v2.part.enforcer', 'Support enforcer')}</button>
                    <button onClick={() => act((h) => h.addPart('blocker', 'cube'))}>＋ {t('v2.part.blocker', 'Support blocker')}</button>
                    <button onClick={() => act((h) => h.addPart('modifier', 'cube'))}>＋ {t('v2.part.modifier', 'Modifier')}</button>
                    <div className="oslice-ctxmenu-sep" />
                    <button onClick={() => act((h) => h.duplicateN(1))}>{t('v2.obj.duplicate', 'Duplicate')}</button>
                    <button onClick={() => { const raw = window.prompt(t('v2.obj.copies_prompt', 'Number of copies to add'), '1'); const n = Math.max(0, Math.min(100, Math.floor(Number(raw)))); if (n > 0) act((h) => h.duplicateN(n)); else setCtxMenu(null); }}>{t('v2.obj.set_copies', 'Set number of copies…')}</button>
                    <button onClick={() => act((h) => h.fillBed())}>{t('v2.obj.fill_bed', 'Fill bed with copies')}</button>
                    <div className="oslice-ctxmenu-sep" />
                    <button onClick={() => act((h) => h.layFlat())}>{t('v2.plate.flat', 'Lay flat')}</button>
                    <button onClick={() => act((h) => h.autoOrient())}>{t('v2.plate.orient', 'Auto-orient')}</button>
                    <button onClick={() => act((h) => h.center())}>{t('v2.obj.center', 'Center on plate')}</button>
                    <button onClick={() => act((h) => h.scaleToFit())}>{t('v2.obj.scale_fit', 'Scale to fit plate')}</button>
                    <div className="oslice-ctxmenu-sep" />
                    <button onClick={() => act((h) => h.rotate90('x'))}>{t('v2.obj.rot90x', 'Rotate 90° X')}</button>
                    <button onClick={() => act((h) => h.rotate90('y'))}>{t('v2.obj.rot90y', 'Rotate 90° Y')}</button>
                    <button onClick={() => act((h) => h.rotate90('z'))}>{t('v2.obj.rot90z', 'Rotate 90° Z')}</button>
                    <button onClick={() => act((h) => h.mirror('x'))}>{t('v2.obj.mirror_x', 'Mirror X')}</button>
                    <button onClick={() => act((h) => h.mirror('y'))}>{t('v2.obj.mirror_y', 'Mirror Y')}</button>
                    <button onClick={() => act((h) => h.mirror('z'))}>{t('v2.obj.mirror_z', 'Mirror Z')}</button>
                    <button onClick={() => act((h) => h.resetXform())}>{t('v2.obj.reset_xform', 'Reset transform')}</button>
                    <div className="oslice-ctxmenu-sep" />
                    <button onClick={() => act((h) => h.splitToParts())}>{t('v2.obj.split_objects', 'Split to objects')}</button>
                    <button onClick={() => act((h) => h.simplify())}>{t('v2.obj.simplify', 'Simplify mesh')}</button>
                    {plates.length > 1 && (
                      <>
                        <div className="oslice-ctxmenu-sep" />
                        {plates.map((pl, pi) => (pi === activePlate ? null : (
                          <button key={pl.id} onClick={() => { plateRef.current?.selectAt(ctxMenu.i); moveSelectedToPlate(pi); setCtxMenu(null); }}>{t('v2.plate.move_to', 'Move to')} {pl.name}</button>
                        )))}
                      </>
                    )}
                    <div className="oslice-ctxmenu-sep" />
                  </>
                )}
                <button onClick={() => { const cur = toolState.names[ctxMenu.i] || ''; const n = window.prompt(t('v2.obj.rename_prompt', 'Rename object'), cur); if (n && n.trim()) act((h) => h.rename(n)); else setCtxMenu(null); }}>{t('v2.obj.rename', 'Rename…')}</button>
                <button className="oslice-ctxmenu-del" onClick={() => act((h) => h.remove())}>{t('v2.obj.delete', 'Delete')}</button>
              </div>
            );
          })()}
        </>
      )}
      {showLibrary && <LibraryImportModal onClose={() => setShowLibrary(false)} onImport={importFromLibrary} />}
      {purgeOpen && <SlicerPurge colors={slotColors} matrix={flushMatrix} onChange={setFlushMatrix} onClose={() => setPurgeOpen(false)} />}
      {colorLayerOpen && <SlicerColorLayer slotColors={slotColors}
        onGenerate={(geom, name) => plateRef.current?.addGeometry(geom, name)}
        onColorLayers={(layers) => { if (layers.length) toast(`${layers.length} ${t('v2.colorlayer.changes', 'colour change(s)')}: ${layers.map((l) => `z${l.z}`).join(', ')}`, 'success'); }}
        onClose={() => setColorLayerOpen(false)} />}
    </div>
  );
}
