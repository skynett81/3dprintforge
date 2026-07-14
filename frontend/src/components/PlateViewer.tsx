import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import { FontLoader, type Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import helvetikerJson from '../assets/helvetiker.json';
import { useT } from '../i18n';
import { gradientBackground, buildPlate } from './plate-scene';
import { parse3mfColors } from '../lib/tmf-colors';

export interface ObjInfo {
  posX: number; posY: number;
  rotX: number; rotY: number; rotZ: number;   // degrees
  scalePct: number;                            // uniform, from X
  dimX: number; dimY: number; dimZ: number;    // mm (world)
}
export type PlateMode = 'translate' | 'rotate' | 'scale';
export type PartType = 'negative' | 'enforcer' | 'blocker' | 'modifier';
export interface PlateState { count: number; hasSel: boolean; mode: PlateMode; names: string[]; selIndex: number; partTypes: string[]; partParents: number[]; hidden: boolean[] }
/** One object serialised for a saved project (geometry + transform + role). */
export interface SerializedObj {
  name: string;
  partType: string;
  parentIdx: number;   // index of the parent object in the array, or -1
  modifierSettings?: Record<string, unknown> | null;
  pos: [number, number, number];
  quat: [number, number, number, number];
  scale: [number, number, number];
  verts: number[];     // flat position attribute (x,y,z,…)
}
export interface PlateHandle {
  exportSTL: (name: string) => File | null;
  exportMaterials: (name: string) => { extruder: number; file: File }[];
  exportEach: (name: string) => { index: number; file: File }[];
  hasMaterials: () => boolean;
  recolor: (colors: string[]) => void;
  count: () => number;
  addFile: (f: File) => Promise<void>;
  setMode: (m: PlateMode) => void;
  duplicate: () => void;
  remove: () => void;
  arrange: () => void;
  selectAt: (i: number) => void;
  layFlat: () => void;
  center: () => void;
  setPos: (x: number, y: number) => void;
  setRot: (x: number, y: number, z: number) => void;   // degrees
  setScalePct: (pct: number) => void;
  setDim: (axis: 'x' | 'y' | 'z', mm: number, uniform: boolean) => void;
  mirror: (axis: 'x' | 'y' | 'z') => void;
  resetXform: () => void;
  scaleToFit: () => void;
  rotate90: (axis: 'x' | 'y' | 'z') => void;
  duplicateN: (n: number) => void;
  fillBed: () => void;
  serializePlate: () => SerializedObj[];
  loadProject: (objs: SerializedObj[]) => void;
  autoOrient: () => void;
  splitToParts: () => void;
  setPlaceOnFace: (on: boolean) => void;
  setMeasureMode: (on: boolean) => void;
  simplify: () => void;
  setPaintMode: (mode: { ch: 'support' | 'seam' | 'color' | 'fuzzy'; val: number } | null) => void;
  clearPaint: (ch: 'support' | 'seam' | 'color' | 'fuzzy') => void;
  getSupportPaint: () => { enforce: number[][]; block: number[][] };
  getSupportVolumes: () => { enforce: number[][]; block: number[][] };
  getSeamPaint: () => { enforce: number[][]; block: number[][] };
  getFuzzyPaint: () => { enforce: number[][]; block: number[][] };
  hasColorPaint: () => boolean;
  getColorMaterials: (name: string) => { extruder: number; file: File }[];
  snapshot: () => PlateSnapshot;
  restore: (snap: PlateSnapshot) => void;
  undo: () => void;
  redo: () => void;
  resetView: () => void;
  setVisible: (index: number, visible: boolean) => void;
  detachSelected: () => THREE.Mesh | null;
  setCutPreview: (fraction: number | null) => void;
  cut: (fraction: number, keep: 'upper' | 'lower' | 'both', connectors?: number) => void;
  boolean: (op: 'union' | 'subtract' | 'intersect') => void;
  addPrimitive: (shape: 'cube' | 'cylinder' | 'sphere') => void;
  addPart: (type: PartType, shape: 'cube' | 'cylinder' | 'sphere') => void;
  addSVG: (svgText: string, depthMm?: number, sizeMm?: number) => boolean;
  getModifiers: () => { box: number[]; infill_density?: number; infill_pattern?: string }[];
  getModifierSettings: () => Record<string, string> | null;
  setModifierSetting: (key: string, value: string) => void;
  rename: (name: string) => void;
  addText: (text: string) => void;
  addGeometry: (geom: THREE.BufferGeometry, name: string) => void;
}

// Parse the bundled typeface once, lazily.
let _font: Font | null = null;
function getFont(): Font {
  if (!_font) _font = new FontLoader().parse(helvetikerJson as unknown as Parameters<FontLoader['parse']>[0]);
  return _font;
}

interface Ctx {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  orbit: OrbitControls; tcontrols: TransformControls; objects: THREE.Mesh[];
  selected: THREE.Mesh | null; raf: number;
  measurePts: THREE.Vector3[]; measureObjs: THREE.Object3D[];
  cutPlane: THREE.Mesh | null;
}

export interface MeasureResult { dist: number; dx: number; dy: number; dz: number }
/** A plate's live objects, kept in memory (with transforms, materials and paint
 *  overlays intact) so switching plates preserves the exact arrangement. */
export type PlateSnapshot = THREE.Mesh[];

// Drop an object so its lowest point sits on the plate (z = 0).
function dropToPlate(mesh: THREE.Mesh) {
  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);
  mesh.position.z -= box.min.z;
}

// Remove all measurement markers/lines and reset the picked points.
function clearMeasure(c: Ctx) {
  for (const o of c.measureObjs) {
    c.scene.remove(o);
    const obj = o as THREE.Mesh;
    obj.geometry?.dispose?.();
    const mat = obj.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose()); else mat?.dispose?.();
  }
  c.measureObjs = []; c.measurePts = [];
}

/**
 * Find the orientation that minimises support (Tweaker-style): score a set of
 * candidate "down" directions — every distinct face normal (a face that could
 * rest on the plate) plus the six axes — by the triangle area that would need
 * support (steep down-facing faces), tie-broken by a larger flat base and lower
 * height. Returns a quaternion to use as the mesh's orientation. Pure geometry,
 * runs in the browser.
 */
function computeAutoOrient(geom: THREE.BufferGeometry): THREE.Quaternion {
  const src = geom.index ? geom.toNonIndexed() : geom;
  const pos = src.getAttribute('position');
  const triCount = pos.count / 3;
  const stride = triCount > 24000 ? Math.ceil(triCount / 24000) : 1; // cap work on dense meshes
  const a = new THREE.Vector3(), b = new THREE.Vector3(), cc = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3();
  type Tri = { n: THREE.Vector3; area: number };
  const tris: Tri[] = [];
  const buckets = new Map<string, { n: THREE.Vector3; area: number }>();
  for (let i = 0; i < triCount; i += stride) {
    const o = i * 3;
    a.fromBufferAttribute(pos, o); b.fromBufferAttribute(pos, o + 1); cc.fromBufferAttribute(pos, o + 2);
    ab.subVectors(b, a); ac.subVectors(cc, a); n.crossVectors(ab, ac);
    const area = n.length() * 0.5;
    if (area < 1e-9) continue;
    n.normalize();
    tris.push({ n: n.clone(), area });
    // Cluster normals to ~15° so a flat face yields one candidate resting plane.
    const key = `${Math.round(n.x * 6)},${Math.round(n.y * 6)},${Math.round(n.z * 6)}`;
    const bk = buckets.get(key);
    if (bk) { bk.area += area; } else buckets.set(key, { n: n.clone(), area });
  }
  // Candidate down-directions: strongest resting planes + the six axes.
  const cands = [...buckets.values()].sort((x, y) => y.area - x.area).slice(0, 24).map((x) => x.n);
  for (const ax of [[0,0,-1],[0,0,1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]] as const)
    cands.push(new THREE.Vector3(ax[0], ax[1], ax[2]));

  const DOWN = new THREE.Vector3(0, 0, -1);
  const OVR = Math.sin(THREE.MathUtils.degToRad(45)); // 45° overhang threshold
  let best: { q: THREE.Quaternion; support: number; base: number; height: number } | null = null;
  const rn = new THREE.Vector3();
  for (const d of cands) {
    const dn = d.clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(dn, DOWN);
    let support = 0, base = 0, minZ = Infinity, maxZ = -Infinity;
    for (const tr of tris) {
      rn.copy(tr.n).applyQuaternion(q);
      if (rn.z < -OVR) support += tr.area;            // steep down-facing → needs support
      else if (rn.z > 0.94) base += tr.area;          // flat, resting on plate
    }
    // Height via the rotated axis extents (sample the bucket normals is not
    // enough — use the rotated bbox from a light vertex sample).
    for (let i = 0; i < pos.count; i += Math.max(1, Math.floor(pos.count / 3000))) {
      a.fromBufferAttribute(pos, i).applyQuaternion(q);
      if (a.z < minZ) minZ = a.z; if (a.z > maxZ) maxZ = a.z;
    }
    const height = maxZ - minZ;
    if (!best || support < best.support - 1e-6 ||
        (Math.abs(support - best.support) <= best.support * 0.05 + 1e-6 &&
         (base > best.base + 1e-6 || (Math.abs(base - best.base) < 1e-6 && height < best.height))))
      best = { q, support, base, height };
  }
  return best?.q ?? new THREE.Quaternion();
}

/** Cut a geometry by the horizontal plane z = zc (object-local frame), splitting
 *  crossing triangles and fan-capping each cut section. Returns the upper and
 *  lower halves (either may be null). */
function cutGeometryZ(geom: THREE.BufferGeometry, zc: number): { upper: THREE.BufferGeometry | null; lower: THREE.BufferGeometry | null } {
  const src = geom.index ? geom.toNonIndexed() : geom;
  const pos = src.getAttribute('position');
  const up: number[] = [], lo: number[] = [];
  const capA: THREE.Vector3[] = [], capB: THREE.Vector3[] = [];
  const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const lerp = (a: THREE.Vector3, b: THREE.Vector3) => {
    const t = (zc - a.z) / (b.z - a.z);
    return new THREE.Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, zc);
  };
  const tri = (arr: number[], a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => arr.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 0; i < pos.count; i += 3) {
    for (let k = 0; k < 3; k++) v[k].fromBufferAttribute(pos, i + k);
    const s = [v[0].z >= zc ? 1 : -1, v[1].z >= zc ? 1 : -1, v[2].z >= zc ? 1 : -1];
    const na = s[0] + s[1] + s[2];
    if (na === 3) { tri(up, v[0], v[1], v[2]); continue; }
    if (na === -3) { tri(lo, v[0], v[1], v[2]); continue; }
    const lone = na > 0 ? s.indexOf(-1) : s.indexOf(1);   // the vertex alone on its side
    const A = v[lone], B = v[(lone + 1) % 3], C = v[(lone + 2) % 3];
    const AB = lerp(A, B), AC = lerp(A, C);
    const aSide = s[lone] > 0 ? up : lo, oSide = s[lone] > 0 ? lo : up;
    tri(aSide, A, AB, AC);
    tri(oSide, AB, B, C);
    tri(oSide, AB, C, AC);
    capA.push(AB.clone()); capB.push(AC.clone());
  }
  // Fan-cap each side from the section centroid (lower cap faces up, upper down).
  if (capA.length) {
    const cen = new THREE.Vector3();
    for (let i = 0; i < capA.length; i++) { cen.add(capA[i]); cen.add(capB[i]); }
    cen.multiplyScalar(1 / (capA.length * 2)); cen.z = zc;
    for (let i = 0; i < capA.length; i++) { tri(lo, capA[i], capB[i], cen); tri(up, capB[i], capA[i], cen); }
  }
  const mk = (arr: number[]) => {
    if (arr.length < 9) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    g.computeVertexNormals();
    return g;
  };
  return { upper: mk(up), lower: mk(lo) };
}

/** Apply a CSG op (ADDITION/SUBTRACTION/INTERSECTION) between two geometries in
 *  a shared frame; returns the result geometry. Strips uv/color and ensures
 *  normals so the evaluator (position+normal only) doesn't silently no-op. */
function csgApply(ev: Evaluator, a: THREE.BufferGeometry, b: THREE.BufferGeometry, op: number): THREE.BufferGeometry {
  const prep = (g: THREE.BufferGeometry) => { g.deleteAttribute('uv'); g.deleteAttribute('color'); if (!g.getAttribute('normal')) g.computeVertexNormals(); return g; };
  const bA = new Brush(prep(a)); bA.updateMatrixWorld();
  const bB = new Brush(prep(b)); bB.updateMatrixWorld();
  return ev.evaluate(bA, bB, op).geometry.clone();
}

/** Split a mesh into connected components (disconnected shells) by welding
 *  vertices at shared positions and union-finding triangles. Returns one
 *  BufferGeometry per shell (the original if it's a single shell). */
function splitGeometry(geom: THREE.BufferGeometry): THREE.BufferGeometry[] {
  const src = geom.index ? geom.toNonIndexed() : geom;
  const pos = src.getAttribute('position');
  const triCount = pos.count / 3;
  if (triCount < 2) return [geom];
  // Weld vertices to a canonical id per position (quantised to 1e-4 mm).
  const idOf = new Map<string, number>();
  const vid = new Int32Array(pos.count);
  const q = (v: number) => Math.round(v * 1e4);
  let next = 0;
  for (let i = 0; i < pos.count; i++) {
    const key = `${q(pos.getX(i))},${q(pos.getY(i))},${q(pos.getZ(i))}`;
    let id = idOf.get(key); if (id === undefined) { id = next++; idOf.set(key, id); }
    vid[i] = id;
  }
  const parent = new Int32Array(next); for (let i = 0; i < next; i++) parent[i] = i;
  const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const uni = (a: number, b: number) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
  for (let tOff = 0; tOff < pos.count; tOff += 3) { uni(vid[tOff], vid[tOff + 1]); uni(vid[tOff], vid[tOff + 2]); }
  // Group triangles by component root.
  const groups = new Map<number, number[]>();
  for (let t = 0; t < triCount; t++) {
    const root = find(vid[t * 3]);
    (groups.get(root) ?? (groups.set(root, []), groups.get(root)!)).push(t);
  }
  if (groups.size <= 1) return [geom];
  const out: THREE.BufferGeometry[] = [];
  for (const trisIdx of groups.values()) {
    const arr = new Float32Array(trisIdx.length * 9);
    let w = 0;
    for (const t of trisIdx) {
      const o = t * 3;
      for (let k = 0; k < 3; k++) { arr[w++] = pos.getX(o + k); arr[w++] = pos.getY(o + k); arr[w++] = pos.getZ(o + k); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    out.push(g);
  }
  return out;
}

const MAT = () => new THREE.MeshStandardMaterial({ color: 0x00b3a4, roughness: 0.55, metalness: 0.1, flatShading: false });

/**
 * Build-plate 3D editor for the slicer: load a model, move / rotate / scale /
 * duplicate / auto-arrange objects, then export the arranged scene as one STL
 * to slice. Bed is Z-up, millimetres, centred at the origin.
 */
export const PlateViewer = forwardRef<PlateHandle, { file: File | null; bed?: number; onObject?: (info: ObjInfo | null) => void; onState?: (s: PlateState) => void; onContextMenu?: (x: number, y: number, index: number) => void; slotColors?: string[]; showOrder?: boolean; clearance?: number }>(function PlateViewer({ file, bed = 256, onObject, onState, onContextMenu, slotColors, showOrder, clearance = 0 }, ref) {
  const t = useT();
  const mount = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx | null>(null);
  const slotColorsRef = useRef<string[] | undefined>(slotColors);
  slotColorsRef.current = slotColors;
  const showOrderRef = useRef<boolean | undefined>(showOrder);
  showOrderRef.current = showOrder;
  const clearanceRef = useRef<number>(clearance);
  clearanceRef.current = clearance;
  const onObjRef = useRef(onObject);
  onObjRef.current = onObject;
  const onCtxRef = useRef(onContextMenu);
  onCtxRef.current = onContextMenu;
  const onStateRef = useRef(onState);
  onStateRef.current = onState;
  const placeFaceRef = useRef(false);   // "place on face" pick mode
  const measureRef = useRef(false);     // "measure" pick mode
  // Paint brush: a channel (support / seam / color) + value. support/seam use
  // 0 erase, 1 enforce, 2 block; color uses the extruder index (0 = erase).
  const paintRef = useRef<{ ch: 'support' | 'seam' | 'color' | 'fuzzy'; val: number } | null>(null);
  const [mode, setModeState] = useState<PlateMode>('translate');
  const [count, setCount] = useState(0);
  const [sel, setSel] = useState(false);
  const [measure, setMeasure] = useState<MeasureResult | null>(null);
  const [measuring, setMeasuring] = useState(false);

  function emitState(nextMode = mode) {
    const c = ctx.current;
    const objs = c?.objects ?? [];
    const names = objs.map((o, i) => o.name || `Object ${i + 1}`);
    const partTypes = objs.map((o) => (o.userData.partType as string) || '');
    const partParents = objs.map((o) => (o.userData.partParentId ? objs.findIndex((p) => p.uuid === o.userData.partParentId) : -1));
    const selIndex = c?.selected ? objs.indexOf(c.selected) : -1;
    const hidden = objs.map((o) => o.visible === false);
    onStateRef.current?.({ count: objs.length, hasSel: !!c?.selected, mode: nextMode, names, selIndex, partTypes, partParents, hidden });
  }
  function setMode(m: PlateMode) { setModeState(m); ctx.current?.tcontrols.setMode(m); emitState(m); }

  // Report the selected object's live transform to the parent (Object panel).
  function emitObject() {
    const c = ctx.current; const cb = onObjRef.current; if (!cb) return;
    const m = c?.selected;
    if (!m) { cb(null); return; }
    m.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(m);
    const size = new THREE.Vector3(); box.getSize(size);
    const RAD = 180 / Math.PI;
    cb({
      posX: +m.position.x.toFixed(2), posY: +m.position.y.toFixed(2),
      rotX: +(m.rotation.x * RAD).toFixed(1), rotY: +(m.rotation.y * RAD).toFixed(1), rotZ: +(m.rotation.z * RAD).toFixed(1),
      scalePct: +(m.scale.x * 100).toFixed(1),
      dimX: +size.x.toFixed(2), dimY: +size.y.toFixed(2), dimZ: +size.z.toFixed(2),
    });
  }

  function select(mesh: THREE.Mesh | null) {
    const c = ctx.current; if (!c) return;
    c.selected = mesh;
    if (mesh) c.tcontrols.attach(mesh); else c.tcontrols.detach();
    setSel(!!mesh);
    emitObject();
    emitState();
  }

  function addMesh(geom: THREE.BufferGeometry, name?: string, vertexColors = false, materials?: { extruder: number; geometry: THREE.BufferGeometry }[]) {
    const c = ctx.current; if (!c) return;
    geom.computeVertexNormals();
    geom.center();
    const material = vertexColors
      ? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.05, flatShading: false })
      : MAT();
    const mesh = new THREE.Mesh(geom, material);
    if (materials && materials.length) mesh.userData.materials = materials;
    mesh.name = name || `Object ${c.objects.length + 1}`;
    // Keep the model's authored orientation (slicers load STL as-is, Z-up); the
    // user can rotate. Just sit it on the plate.
    c.scene.add(mesh);
    c.objects.push(mesh);
    dropToPlate(mesh);
    setCount(c.objects.length);
    select(mesh);
    arrange();
    pushHistory();
  }

  // ── undo / redo: a bounded stack of deep snapshots (geometry + transform +
  // userData clones) captured after each edit. ──
  const history = useRef<{ geom: THREE.BufferGeometry; pos: THREE.Vector3; quat: THREE.Quaternion; scale: THREE.Vector3; name: string; userData: Record<string, unknown>; material: THREE.Material | THREE.Material[]; visible: boolean }[][]>([]);
  const histIdx = useRef(-1);
  function deepSnap() {
    const c = ctx.current; if (!c) return [];
    return c.objects.map((m) => { m.updateMatrixWorld(); return { geom: m.geometry.clone(), pos: m.position.clone(), quat: m.quaternion.clone(), scale: m.scale.clone(), name: m.name, userData: { ...m.userData }, material: m.material, visible: m.visible }; });
  }
  function pushHistory() {
    const snap = deepSnap();
    history.current = history.current.slice(0, histIdx.current + 1);
    history.current.push(snap);
    if (history.current.length > 40) history.current.shift();
    histIdx.current = history.current.length - 1;
  }
  function applySnap(snap: ReturnType<typeof deepSnap>) {
    const c = ctx.current; if (!c) return;
    select(null);
    for (const m of c.objects) c.scene.remove(m);
    c.objects = snap.map((s) => { const mesh = new THREE.Mesh(s.geom.clone(), s.material); mesh.position.copy(s.pos); mesh.quaternion.copy(s.quat); mesh.scale.copy(s.scale); mesh.name = s.name; mesh.userData = { ...s.userData }; mesh.visible = s.visible !== false; c.scene.add(mesh); return mesh; });
    setCount(c.objects.length);
    if (c.objects[0]) select(c.objects[0]);
    emitState();
  }

  // ── setup once ──
  useEffect(() => {
    const el = mount.current; if (!el) return;
    const w = el.clientWidth || 640; const h = el.clientHeight || 440;
    const scene = new THREE.Scene();
    scene.background = gradientBackground();
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 5000);
    camera.up.set(0, 0, 1);
    camera.position.set(bed * 0.9, -bed * 1.1, bed * 0.9);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4); dir.position.set(1, -1, 2); scene.add(dir);
    buildPlate(scene, bed);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; orbit.target.set(0, 0, bed * 0.15);
    const tcontrols = new TransformControls(camera, renderer.domElement);
    tcontrols.setSpace('world');
    tcontrols.addEventListener('dragging-changed', (e) => { orbit.enabled = !e.value; if (!e.value) { const m = ctx.current?.selected; if (m) dropToPlate(m); emitObject(); pushHistory(); } });
    tcontrols.addEventListener('objectChange', () => { emitObject(); });
    const helper = (tcontrols as unknown as { getHelper?: () => THREE.Object3D }).getHelper?.() ?? (tcontrols as unknown as THREE.Object3D);
    scene.add(helper);

    const c: Ctx = { scene, camera, renderer, orbit, tcontrols, objects: [], selected: null, raf: 0, measurePts: [], measureObjs: [], cutPlane: null };
    ctx.current = c;

    // click-to-select — only on a clean click (not an orbit drag), decided
    // on pointerUP, so rotating the view never changes the selection.
    const ray = new THREE.Raycaster();
    let downX = 0, downY = 0;

    // ── Model painting ── brush support / seam / colour onto mesh triangles.
    // Each channel is a Uint8Array on the mesh (userData.paint_<ch>) with its
    // own coloured overlay (userData.ov_<ch>), so the three tools coexist.
    const brushR = 6;                              // brush radius (mm)
    const tva = new THREE.Vector3(), tvb = new THREE.Vector3(), tvc = new THREE.Vector3();
    let painting = false, strokeMesh: THREE.Mesh | null = null, strokeCentroids: Float32Array | null = null;
    const paintTriCount = (m: THREE.Mesh) => { const g = m.geometry; return g.index ? g.index.count / 3 : g.getAttribute('position').count / 3; };
    const triVI = (g: THREE.BufferGeometry, i: number): [number, number, number] =>
      g.index ? [g.index.getX(i * 3), g.index.getX(i * 3 + 1), g.index.getX(i * 3 + 2)] : [i * 3, i * 3 + 1, i * 3 + 2];
    const ensurePaint = (m: THREE.Mesh, ch: string): Uint8Array => {
      const n = paintTriCount(m); const key = 'paint_' + ch;
      let arr = m.userData[key] as Uint8Array | undefined;
      if (!arr || arr.length !== n) { arr = new Uint8Array(n); m.userData[key] = arr; }
      return arr;
    };
    const chColor = (ch: string, v: number): number => {
      if (ch === 'support') return v === 2 ? 0xe0463c : 0x2f7be0;
      if (ch === 'seam') return v === 2 ? 0xe08a2f : 0x2fbf6f;
      if (ch === 'fuzzy') return 0xa855f7;
      const sc = slotColorsRef.current; const hexs = sc && sc[v - 1];
      return hexs ? new THREE.Color(hexs).getHex() : 0x9aa4b2;   // colour = the extruder's filament colour
    };
    const worldCentroids = (m: THREE.Mesh): Float32Array => {
      const g = m.geometry, pos = g.getAttribute('position'); const n = paintTriCount(m);
      const out = new Float32Array(n * 3); m.updateMatrixWorld(true); const mw = m.matrixWorld;
      for (let i = 0; i < n; i++) {
        const [a, b, cc] = triVI(g, i);
        tva.fromBufferAttribute(pos, a).applyMatrix4(mw); tvb.fromBufferAttribute(pos, b).applyMatrix4(mw); tvc.fromBufferAttribute(pos, cc).applyMatrix4(mw);
        out[i * 3] = (tva.x + tvb.x + tvc.x) / 3; out[i * 3 + 1] = (tva.y + tvb.y + tvc.y) / 3; out[i * 3 + 2] = (tva.z + tvb.z + tvc.z) / 3;
      }
      return out;
    };
    const rebuildOverlay = (m: THREE.Mesh, ch: string) => {
      const okey = 'ov_' + ch;
      const prev = m.userData[okey] as THREE.Mesh | undefined;
      if (prev) { m.remove(prev); prev.geometry.dispose(); m.userData[okey] = undefined; }
      const arr = m.userData['paint_' + ch] as Uint8Array | undefined; if (!arr) return;
      const g = m.geometry, pos = g.getAttribute('position');
      const P: number[] = [], C: number[] = []; const col = new THREE.Color();
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) continue;
        const [a, b, cc] = triVI(g, i);
        tva.fromBufferAttribute(pos, a); tvb.fromBufferAttribute(pos, b); tvc.fromBufferAttribute(pos, cc);
        const nrm = tvb.clone().sub(tva).cross(tvc.clone().sub(tva)).normalize().multiplyScalar(0.15);
        col.setHex(chColor(ch, arr[i]));
        for (const v of [tva, tvb, tvc]) { P.push(v.x + nrm.x, v.y + nrm.y, v.z + nrm.z); C.push(col.r, col.g, col.b); }
      }
      if (!P.length) return;
      const og = new THREE.BufferGeometry();
      og.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
      og.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
      const ov = new THREE.Mesh(og, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: ch === 'color' ? 0.95 : 0.8, depthWrite: false }));
      ov.renderOrder = 2; m.add(ov); m.userData[okey] = ov;
    };
    const applyBrush = (m: THREE.Mesh, worldPt: THREE.Vector3, faceIndex: number | undefined) => {
      const mode = paintRef.current; if (!mode) return;
      const arr = ensurePaint(m, mode.ch);
      if (strokeMesh !== m || !strokeCentroids) { strokeMesh = m; strokeCentroids = worldCentroids(m); }
      const cen = strokeCentroids;
      const val = mode.val;
      const br2 = brushR * brushR;
      // Always mark the directly-hit triangle (so low-poly faces paint too),
      // plus every triangle whose centroid falls inside the brush.
      if (faceIndex != null && faceIndex < arr.length) arr[faceIndex] = val;
      for (let i = 0; i < arr.length; i++) {
        const dx = cen[i * 3] - worldPt.x, dy = cen[i * 3 + 1] - worldPt.y, dz = cen[i * 3 + 2] - worldPt.z;
        if (dx * dx + dy * dy + dz * dz <= br2) arr[i] = val;
      }
      rebuildOverlay(m, mode.ch);
    };
    const paintAt = (ev: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((ev.clientX - r.left) / r.width) * 2 - 1, ny = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = ray.intersectObjects(c.objects, false)[0];
      if (hit) applyBrush(hit.object as THREE.Mesh, hit.point, hit.faceIndex ?? undefined);
    };
    const onPointerMove = (ev: PointerEvent) => { if (painting) paintAt(ev); };

    const onPointerDown = (ev: PointerEvent) => {
      downX = ev.clientX; downY = ev.clientY;
      if (paintRef.current) { painting = true; strokeMesh = null; strokeCentroids = null; orbit.enabled = false; paintAt(ev); }
    };
    const onPointerUp = (ev: PointerEvent) => {
      if (painting) { painting = false; orbit.enabled = true; strokeMesh = null; strokeCentroids = null; return; }
      if (tcontrols.dragging) return;
      if (Math.abs(ev.clientX - downX) > 5 || Math.abs(ev.clientY - downY) > 5) return; // was a drag
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const ny = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = ray.intersectObjects(c.objects, false)[0];
      // Measure: collect two picked points; show markers, a line and the
      // distance + per-axis deltas. A third pick starts a fresh measurement.
      if (measureRef.current) {
        if (!hit) return;
        if (c.measurePts.length >= 2) { clearMeasure(c); }
        const pt = hit.point.clone();
        c.measurePts.push(pt);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), new THREE.MeshBasicMaterial({ color: 0x009789 }));
        dot.position.copy(pt); c.scene.add(dot); c.measureObjs.push(dot);
        if (c.measurePts.length === 2) {
          const [p0, p1] = c.measurePts;
          const g = new THREE.BufferGeometry().setFromPoints([p0, p1]);
          const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x009789 }));
          c.scene.add(line); c.measureObjs.push(line);
          setMeasure({ dist: p0.distanceTo(p1), dx: Math.abs(p1.x - p0.x), dy: Math.abs(p1.y - p0.y), dz: Math.abs(p1.z - p0.z) });
        } else setMeasure(null);
        return;
      }
      // Place-on-face: rotate the picked mesh so the clicked facet lies on the
      // plate (its world normal points straight down), then drop it.
      if (placeFaceRef.current && hit && hit.face) {
        const m = hit.object as THREE.Mesh;
        const wn = hit.face.normal.clone().transformDirection(m.matrixWorld).normalize();
        const delta = new THREE.Quaternion().setFromUnitVectors(wn, new THREE.Vector3(0, 0, -1));
        m.quaternion.premultiply(delta);
        dropToPlate(m);
        select(m); emitObject();
        return;
      }
      select(hit ? (hit.object as THREE.Mesh) : null);
    };
    // Right-click an object in the scene → select it and open the same context
    // menu the object list uses (BambuStudio's viewport right-click).
    const onContext = (ev: MouseEvent) => {
      ev.preventDefault();
      if (paintRef.current || measureRef.current) return;
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const ny = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = ray.intersectObjects(c.objects, false)[0];
      if (!hit) return;
      const m = hit.object as THREE.Mesh;
      select(m);
      onCtxRef.current?.(ev.clientX, ev.clientY, c.objects.indexOf(m));
    };
    renderer.domElement.addEventListener('contextmenu', onContext);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Sequential-print order badges: numbered chips over each object at its
    // projected top-centre, shown only when by-object printing is active.
    el.style.position = el.style.position || 'relative';
    const orderLayer = document.createElement('div');
    orderLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;overflow:hidden;';
    el.appendChild(orderLayer);
    const _ov = new THREE.Vector3();
    const syncOrder = () => {
      if (!showOrderRef.current) { if (orderLayer.childElementCount) orderLayer.replaceChildren(); return; }
      const positives = c.objects.filter((o) => !o.userData.partType);
      while (orderLayer.childElementCount < positives.length) { const d = document.createElement('div'); d.className = 'plate-order-badge'; orderLayer.appendChild(d); }
      while (orderLayer.childElementCount > positives.length) orderLayer.lastChild?.remove();
      const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
      positives.forEach((m, i) => {
        m.updateMatrixWorld();
        const box = new THREE.Box3().setFromObject(m); box.getCenter(_ov); _ov.z = box.max.z;
        _ov.project(camera);
        const badge = orderLayer.children[i] as HTMLDivElement;
        badge.textContent = String(i + 1);
        if (_ov.z > 1 || _ov.z < -1) { badge.style.display = 'none'; return; }
        badge.style.display = 'flex';
        badge.style.left = `${(_ov.x * 0.5 + 0.5) * w}px`;
        badge.style.top = `${(-_ov.y * 0.5 + 0.5) * h}px`;
      });
    };
    // Sequential-print clearance rings: a circle around each object's footprint
    // grown by the head-clearance radius; turns red where two rings overlap
    // (objects too close to print one-at-a-time without a collision).
    const ringGroup = new THREE.Group(); scene.add(ringGroup);
    const syncRings = () => {
      if (!showOrderRef.current) { if (ringGroup.children.length) { for (const o of ringGroup.children as THREE.LineLoop[]) o.geometry.dispose(); ringGroup.clear(); } return; }
      const positives = c.objects.filter((o) => !o.userData.partType);
      const info = positives.map((m) => { m.updateMatrixWorld(); const box = new THREE.Box3().setFromObject(m); const size = new THREE.Vector3(); box.getSize(size); const ctr = new THREE.Vector3(); box.getCenter(ctr); return { x: ctr.x, y: ctr.y, r: 0.5 * Math.hypot(size.x, size.y) + Math.max(0, clearanceRef.current) }; });
      const hit = info.map(() => false);
      for (let i = 0; i < info.length; i++) for (let j = i + 1; j < info.length; j++) { const d = Math.hypot(info[i].x - info[j].x, info[i].y - info[j].y); if (d < info[i].r + info[j].r) { hit[i] = true; hit[j] = true; } }
      while (ringGroup.children.length < info.length) ringGroup.add(new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 })));
      while (ringGroup.children.length > info.length) { const o = ringGroup.children.pop() as THREE.LineLoop; o.geometry.dispose(); }
      const N = 56;
      info.forEach((o, i) => {
        const line = ringGroup.children[i] as THREE.LineLoop;
        const pts = new Float32Array(N * 3);
        for (let k = 0; k < N; k++) { const a = (k / N) * Math.PI * 2; pts[k * 3] = o.x + Math.cos(a) * o.r; pts[k * 3 + 1] = o.y + Math.sin(a) * o.r; pts[k * 3 + 2] = 0.15; }
        line.geometry.setAttribute('position', new THREE.BufferAttribute(pts, 3));
        (line.material as THREE.LineBasicMaterial).color.setHex(hit[i] ? 0xe0463c : 0x009789);
      });
    };
    let orderTick = 0;
    const loop = () => { c.raf = requestAnimationFrame(loop); orbit.update(); renderer.render(scene, camera); if ((orderTick++ & 3) === 0) { syncOrder(); syncRings(); } };
    loop();
    const onResize = () => { const nw = el.clientWidth, nh = el.clientHeight; if (!nw || !nh) return; camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); };
    window.addEventListener('resize', onResize);
    // Resize with the container (fullscreen toggle, sidebar changes) — not
    // just the window, so the canvas always fills the scene.
    const ro = new ResizeObserver(onResize); ro.observe(el);
    return () => {
      cancelAnimationFrame(c.raf);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      orderLayer.remove();
      for (const o of ringGroup.children as THREE.LineLoop[]) o.geometry.dispose();
      ringGroup.clear(); scene.remove(ringGroup);
      renderer.domElement.removeEventListener('contextmenu', onContext);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      el.removeChild(renderer.domElement);
      ctx.current = null;
    };
  }, [bed]);

  // Load a model buffer into the plate (append). Returns a promise.
  // Parse an SVG string into an extruded 3-D part on the plate. Shared by the
  // file loader and the addSVG handle. Returns false when there are no shapes.
  function svgToPlate(svgText: string, depthMm = 3, sizeMm = 50): boolean {
    try {
      const data = new SVGLoader().parse(svgText);
      const shapes: THREE.Shape[] = [];
      for (const path of data.paths) for (const sh of SVGLoader.createShapes(path)) shapes.push(sh);
      if (!shapes.length) return false;
      const geo = new THREE.ExtrudeGeometry(shapes, { depth: depthMm, bevelEnabled: false, curveSegments: 8 });
      geo.scale(1, -1, 1);                 // SVG Y is down → flip upright
      geo.computeBoundingBox();
      const bb = geo.boundingBox!; const maxXY = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y) || 1;
      geo.scale(sizeMm / maxXY, sizeMm / maxXY, 1);
      geo.computeVertexNormals();
      addMesh(geo.toNonIndexed(), 'SVG');
      return true;
    } catch { return false; }
  }

  async function loadFileBuffer(f: File) {
    const c = ctx.current; if (!c) return;
    const buf = await f.arrayBuffer();
    const lower = f.name.toLowerCase();
    const base = f.name.replace(/\.[^.]+$/, '');
    try {
      if (lower.endsWith('.svg')) {
        if (!svgToPlate(new TextDecoder().decode(buf), 3, 50)) throw new Error('SVG has no shapes');
        return;
      }
      if (lower.endsWith('.3mf')) {
        // A 3MF may hold several SEPARATE objects (each individually movable) or
        // one model split into overlapping coloured parts. Cluster meshes by
        // spatial overlap: overlapping parts merge into one coloured object,
        // spatially-separate objects each become their own movable object.
        const obj = new ThreeMFLoader().parse(buf);
        obj.updateMatrixWorld(true);
        // Real per-part colours from the Bambu/Orca config (extruder → filament colour).
        const cfg = parse3mfColors(buf);
        const meshes: THREE.Mesh[] = [];
        obj.traverse((o) => { if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh); });
        if (!meshes.length) return;
        const useCfg = !!cfg && cfg.colors.length > 0 && cfg.extruders.length === meshes.length;

        // Build one vertex-coloured, world-space geometry per source mesh.
        const buildGeom = (m: THREE.Mesh, idx: number): THREE.BufferGeometry => {
          const src = m.geometry.clone().applyMatrix4(m.matrixWorld).toNonIndexed();
          const pos = src.getAttribute('position');
          const g2 = new THREE.BufferGeometry();
          g2.setAttribute('position', pos.clone());
          const existing = src.getAttribute('color');
          if (useCfg) {
            const ext = cfg!.extruders[idx] || 1;
            const sc = slotColorsRef.current;
            const col = new THREE.Color((sc && sc[ext - 1]) || cfg!.colors[(ext - 1) % cfg!.colors.length] || '#9aa4b2');
            const n = pos.count; const colors = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) { colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b; }
            g2.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          } else if (existing) {
            g2.setAttribute('color', existing.clone());
          } else {
            const col = new THREE.Color(0x9aa4b2);
            const mat = Array.isArray(m.material) ? m.material[0] : m.material;
            if (mat && (mat as THREE.MeshStandardMaterial).color) col.copy((mat as THREE.MeshStandardMaterial).color);
            const n = pos.count; const colors = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) { colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b; }
            g2.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          }
          (g2 as THREE.BufferGeometry & { _ext?: number })._ext = useCfg ? (cfg!.extruders[idx] || 1) : 1;
          return g2;
        };

        // Cluster meshes whose world bounding boxes overlap (union-find).
        const boxes = meshes.map((m) => new THREE.Box3().setFromObject(m));
        const parent = meshes.map((_, i) => i);
        const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
        const overlap = (A: THREE.Box3, B: THREE.Box3) => A.min.x <= B.max.x && A.max.x >= B.min.x && A.min.y <= B.max.y && A.max.y >= B.min.y && A.min.z <= B.max.z && A.max.z >= B.min.z;
        for (let i = 0; i < meshes.length; i++) for (let j = i + 1; j < meshes.length; j++) if (overlap(boxes[i], boxes[j])) parent[find(i)] = find(j);
        const clusters = new Map<number, number[]>();
        meshes.forEach((_, i) => { const r = find(i); (clusters.get(r) ?? (clusters.set(r, []), clusters.get(r)!)).push(i); });

        const nClusters = clusters.size;
        let ci = 0;
        for (const idxs of clusters.values()) {
          const geoms = idxs.map((i) => buildGeom(meshes[i], i));
          const merged = mergeGeometries(geoms, false);
          if (!merged) continue;
          merged.computeBoundingBox();
          const bb = merged.boundingBox!;
          const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
          // Per-extruder split for multi-colour objects (aligned to the shared frame).
          let materials: { extruder: number; geometry: THREE.BufferGeometry }[] | undefined;
          const exts = geoms.map((gg) => (gg as THREE.BufferGeometry & { _ext?: number })._ext || 1);
          if (useCfg && exts.some((x) => x !== exts[0])) {
            const byExt = new Map<number, THREE.BufferGeometry[]>();
            geoms.forEach((gg, k) => { const ext = exts[k]; (byExt.get(ext) ?? (byExt.set(ext, []), byExt.get(ext)!)).push(gg); });
            materials = [];
            for (const [ext, gs] of byExt) {
              const mg = mergeGeometries(gs.map((x) => x.clone()), false);
              if (mg) { mg.translate(-cx, -cy, -cz); materials.push({ extruder: ext, geometry: mg }); }
            }
          }
          addMesh(merged, nClusters > 1 ? `${base} (${++ci})` : base, true, materials);
        }
      } else if (lower.endsWith('.obj')) {
        // OBJ can hold several groups — add each mesh as its own object.
        const obj = new OBJLoader().parse(new TextDecoder().decode(buf));
        const meshes: THREE.Mesh[] = [];
        obj.traverse((o) => { if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh); });
        meshes.forEach((mm, i) => addMesh(mm.geometry.clone(), meshes.length > 1 ? `${base} (${i + 1})` : base));
      } else {
        addMesh(new STLLoader().parse(buf), base);
      }
    } catch { /* unsupported/parse error — leave as-is */ }
  }

  // ── load the primary file (replaces the plate) ──
  useEffect(() => {
    const c = ctx.current; if (!c || !file) return;
    for (const m of c.objects) c.scene.remove(m);
    c.objects = []; select(null); setCount(0);
    loadFileBuffer(file);
  }, [file]);

  useEffect(() => { ctx.current?.tcontrols.setMode(mode); }, [mode]);

  function arrange() {
    const c = ctx.current; if (!c || !c.objects.length) return;
    // Parts (negative / support volumes) ride with their parent — never arrange them.
    const items = c.objects.filter((m) => !m.userData.partType);
    const n = items.length; if (!n) return;
    const cols = Math.ceil(Math.sqrt(n));
    const gap = bed / (cols + 1);
    items.forEach((m, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      m.position.x = (col - (cols - 1) / 2) * gap;
      m.position.y = (row - (Math.ceil(n / cols) - 1) / 2) * gap;
      dropToPlate(m);
    });
    emitObject();
  }
  function duplicate() {
    const c = ctx.current; if (!c || !c.selected) return;
    const m = new THREE.Mesh(c.selected.geometry.clone(), MAT());
    m.quaternion.copy(c.selected.quaternion); m.scale.copy(c.selected.scale);
    c.scene.add(m); c.objects.push(m); setCount(c.objects.length); select(m); arrange();
  }
  function removeSel() {
    const c = ctx.current; if (!c || !c.selected) return;
    const victim = c.selected;
    // Removing an object also removes its attached part volumes.
    const doomed = new Set<THREE.Mesh>([victim]);
    if (!victim.userData.partType) for (const o of c.objects) if (o.userData.partParentId === victim.uuid) doomed.add(o);
    for (const o of doomed) c.scene.remove(o);
    c.objects = c.objects.filter((o) => !doomed.has(o)); select(null); setCount(c.objects.length); arrange();
    pushHistory();
  }
  function layFlat() { const c = ctx.current; if (!c || !c.selected) return; c.selected.rotation.set(0, 0, 0); dropToPlate(c.selected); emitObject(); }
  function center() { const c = ctx.current; if (!c || !c.selected) return; c.selected.position.x = 0; c.selected.position.y = 0; dropToPlate(c.selected); emitObject(); }
  // Collect a paint channel's enforce/block triangles in world coords (rounded
  // 0.1 mm). `withZMin` emits the full [zMin,zMax] band (seam) vs just zMax
  // (support).
  function collectPaintRegions(ch: 'support' | 'seam' | 'color' | 'fuzzy', withZMin: boolean) {
    const c = ctx.current; const enforce: number[][] = [], block: number[][] = []; if (!c) return { enforce, block };
    const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3();
    const r1 = (v: number) => Math.round(v * 10) / 10;
    for (const m of c.objects) {
      const arr = m.userData['paint_' + ch] as Uint8Array | undefined; if (!arr) continue;
      const g = m.geometry, pos = g.getAttribute('position'), idx = g.index; m.updateMatrixWorld(true); const mw = m.matrixWorld;
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) continue;
        const a = idx ? idx.getX(i * 3) : i * 3, b = idx ? idx.getX(i * 3 + 1) : i * 3 + 1, cc = idx ? idx.getX(i * 3 + 2) : i * 3 + 2;
        va.fromBufferAttribute(pos, a).applyMatrix4(mw); vb.fromBufferAttribute(pos, b).applyMatrix4(mw); vc.fromBufferAttribute(pos, cc).applyMatrix4(mw);
        const zMax = Math.max(va.z, vb.z, vc.z), zMin = Math.min(va.z, vb.z, vc.z);
        const tri = withZMin
          ? [r1(va.x), r1(va.y), r1(vb.x), r1(vb.y), r1(vc.x), r1(vc.y), r1(zMin), r1(zMax)]
          : [r1(va.x), r1(va.y), r1(vb.x), r1(vb.y), r1(vc.x), r1(vc.y), r1(zMax)];
        (arr[i] === 2 ? block : enforce).push(tri);
      }
    }
    return { enforce, block };
  }
  function autoOrient() {
    const c = ctx.current; if (!c || !c.selected) return;
    const q = computeAutoOrient(c.selected.geometry);
    c.selected.quaternion.copy(q); dropToPlate(c.selected); emitObject();
  }
  // Split disconnected shells into separate objects (connected components by
  // shared vertex position). Replaces the selected mesh with its parts.
  function splitToParts() {
    const c = ctx.current; if (!c || !c.selected) return;
    const m = c.selected;
    const parts = splitGeometry(m.geometry);
    if (parts.length <= 1) return;
    const baseName = m.name || 'Object';
    m.updateMatrixWorld(true);
    const mat = m.material;
    c.scene.remove(m); c.objects = c.objects.filter((o) => o !== m);
    parts.forEach((g, i) => {
      g.computeVertexNormals();
      const nm = new THREE.Mesh(g, Array.isArray(mat) ? mat[0].clone() : (mat as THREE.Material).clone());
      nm.name = `${baseName} (${i + 1})`;
      nm.quaternion.copy(m.quaternion); nm.scale.copy(m.scale);
      c.scene.add(nm); c.objects.push(nm); dropToPlate(nm);
    });
    setCount(c.objects.length); select(c.objects[c.objects.length - parts.length]); arrange();
  }

  useImperativeHandle(ref, () => ({
    count: () => ctx.current?.objects.length ?? 0,
    addFile: (f: File) => loadFileBuffer(f),
    setMode: (m: PlateMode) => setMode(m),
    duplicate: () => duplicate(),
    remove: () => removeSel(),
    arrange: () => arrange(),
    selectAt: (i: number) => { const c = ctx.current; if (c && c.objects[i]) select(c.objects[i]); },
    layFlat: () => layFlat(),
    center: () => center(),
    autoOrient: () => autoOrient(),
    splitToParts: () => splitToParts(),
    setPlaceOnFace: (on: boolean) => { placeFaceRef.current = on; },
    setMeasureMode: (on: boolean) => { measureRef.current = on; setMeasuring(on); const c = ctx.current; if (c && !on) { clearMeasure(c); setMeasure(null); } },
    setPaintMode: (mode) => {
      paintRef.current = mode;
      const c = ctx.current; if (!c) return;
      if (mode) c.tcontrols.detach(); else if (c.selected) c.tcontrols.attach(c.selected);
    },
    clearPaint: (ch) => {
      const c = ctx.current; if (!c) return;
      for (const m of c.objects) {
        m.userData['paint_' + ch] = undefined;
        const ov = m.userData['ov_' + ch] as THREE.Mesh | undefined;
        if (ov) { m.remove(ov); ov.geometry.dispose(); m.userData['ov_' + ch] = undefined; }
      }
    },
    // Support/seam regions in world coords. Support needs zMax; seam needs the
    // full [zMin, zMax] band. Coords rounded to 0.1 mm to keep the payload small.
    getSupportPaint: () => collectPaintRegions('support', false),
    // Support enforcer/blocker VOLUMES → the same enforce/block triangle channel
    // the painter feeds (each tri [x0,y0,x1,y1,x2,y2,zMax] in world coords). An
    // enforcer forces support columns up to the volume top; a blocker forbids
    // support in its footprint.
    getSupportVolumes: () => {
      const c = ctx.current; const enforce: number[][] = [], block: number[][] = []; if (!c) return { enforce, block };
      const r1 = (v: number) => Math.round(v * 10) / 10;
      const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3();
      for (const m of c.objects) {
        const pt = m.userData.partType;
        if (pt !== 'enforcer' && pt !== 'blocker') continue;
        m.updateMatrixWorld(true);
        const g = m.geometry, pos = g.getAttribute('position'), idx = g.index;
        const triCount = idx ? idx.count / 3 : pos.count / 3;
        const dst = pt === 'enforcer' ? enforce : block;
        for (let t = 0; t < triCount; t++) {
          const ia = idx ? idx.getX(t * 3) : t * 3, ib = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, ic = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
          va.fromBufferAttribute(pos, ia).applyMatrix4(m.matrixWorld);
          vb.fromBufferAttribute(pos, ib).applyMatrix4(m.matrixWorld);
          vc.fromBufferAttribute(pos, ic).applyMatrix4(m.matrixWorld);
          dst.push([r1(va.x), r1(va.y), r1(vb.x), r1(vb.y), r1(vc.x), r1(vc.y), r1(Math.max(va.z, vb.z, vc.z))]);
        }
      }
      return { enforce, block };
    },
    getSeamPaint: () => collectPaintRegions('seam', true),
    getFuzzyPaint: () => collectPaintRegions('fuzzy', true),
    hasColorPaint: () => {
      const c = ctx.current; if (!c) return false;
      for (const m of c.objects) { const a = m.userData.paint_color as Uint8Array | undefined; if (a && a.some((v) => v > 0)) return true; }
      return false;
    },
    getColorMaterials: (name) => {
      const c = ctx.current; if (!c) return [];
      const byExt = new Map<number, number[]>();
      const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3();
      for (const m of c.objects) {
        const arr = m.userData.paint_color as Uint8Array | undefined;
        const g = m.geometry, pos = g.getAttribute('position'), idx = g.index; m.updateMatrixWorld(true); const mw = m.matrixWorld;
        const n = idx ? idx.count / 3 : pos.count / 3;
        for (let i = 0; i < n; i++) {
          const ext = (arr && arr[i]) ? arr[i] : 1;   // unpainted → extruder 1
          const a = idx ? idx.getX(i * 3) : i * 3, b = idx ? idx.getX(i * 3 + 1) : i * 3 + 1, cc = idx ? idx.getX(i * 3 + 2) : i * 3 + 2;
          va.fromBufferAttribute(pos, a).applyMatrix4(mw); vb.fromBufferAttribute(pos, b).applyMatrix4(mw); vc.fromBufferAttribute(pos, cc).applyMatrix4(mw);
          const dst = byExt.get(ext) ?? (byExt.set(ext, []), byExt.get(ext)!);
          dst.push(va.x, va.y, va.z, vb.x, vb.y, vb.z, vc.x, vc.y, vc.z);
        }
      }
      if (byExt.size <= 1) return [];    // single extruder → not multi-material
      const exp = new STLExporter(); const bn = name.replace(/\.[^.]+$/, '');
      return [...byExt.entries()].sort((a, b) => a[0] - b[0]).map(([extruder, arr]) => {
        const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
        const grp = new THREE.Group(); grp.add(new THREE.Mesh(gg));
        return { extruder, file: new File([exp.parse(grp, { binary: false }) as string], `${bn}_ext${extruder}.stl`, { type: 'model/stl' }) };
      });
    },
    // Detach the current plate's meshes (kept live in memory with transforms +
    // paint overlays) and hand them out; restore puts a snapshot back.
    snapshot: () => {
      const c = ctx.current; if (!c) return [];
      return c.objects.slice();
    },
    // Translucent preview plane at the cut height (object-local frame), so the
    // user sees exactly where the cut lands. null clears it.
    setCutPreview: (fraction) => {
      const c = ctx.current; if (!c) return;
      if (c.cutPlane) { c.cutPlane.parent?.remove(c.cutPlane); c.cutPlane.geometry.dispose(); (c.cutPlane.material as THREE.Material).dispose(); c.cutPlane = null; }
      if (fraction == null || !c.selected) return;
      const m = c.selected, g = m.geometry; g.computeBoundingBox(); const bb = g.boundingBox!;
      const zc = bb.min.z + fraction * (bb.max.z - bb.min.z);
      const w = (bb.max.x - bb.min.x) * 1.15 || 10, h = (bb.max.y - bb.min.y) * 1.15 || 10;
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0x009789, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }));
      pl.position.set((bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2, zc);
      pl.renderOrder = 3; m.add(pl); c.cutPlane = pl;
    },
    cut: (fraction, keep, connectors = 0) => {
      const c = ctx.current; if (!c || !c.selected) return;
      const m = c.selected, g = m.geometry; g.computeBoundingBox(); const bb = g.boundingBox!;
      const zc = bb.min.z + Math.min(0.999, Math.max(0.001, fraction)) * (bb.max.z - bb.min.z);
      let { upper, lower } = cutGeometryZ(g, zc);
      // Alignment connectors: a peg on the lower half (union) and a matching hole
      // on the upper half (subtract) at each connector location on the cut plane.
      if (connectors > 0 && upper && lower) {
        try {
          const ev = new Evaluator(); ev.attributes = ['position', 'normal']; ev.useGroups = false;
          const spanX = bb.max.x - bb.min.x, spanY = bb.max.y - bb.min.y;
          const r = Math.max(1, Math.min(spanX, spanY) * 0.07);   // peg radius
          const hh = r * 3;                                        // peg length (± around plane)
          const n = Math.min(4, Math.round(connectors));
          const cols = n <= 1 ? 1 : 2, rows = Math.ceil(n / cols);
          let k = 0;
          for (let rr = 0; rr < rows && k < n; rr++) for (let cc = 0; cc < cols && k < n; cc++, k++) {
            const px = bb.min.x + spanX * (cols === 1 ? 0.5 : (cc + 1) / (cols + 1));
            const py = bb.min.y + spanY * (rows === 1 ? 0.5 : (rr + 1) / (rows + 1));
            const peg = () => { const cg = new THREE.CylinderGeometry(r, r, hh, 24); cg.rotateX(Math.PI / 2); cg.translate(px, py, zc); return cg; };
            const hole = () => { const cg = new THREE.CylinderGeometry(r + 0.2, r + 0.2, hh + 0.4, 24); cg.rotateX(Math.PI / 2); cg.translate(px, py, zc); return cg; };
            lower = csgApply(ev, lower!, peg(), ADDITION);
            upper = csgApply(ev, upper!, hole(), SUBTRACTION);
          }
        } catch { /* connector boolean failed — keep the plain halves */ }
      }
      if (c.cutPlane) { c.cutPlane.parent?.remove(c.cutPlane); c.cutPlane = null; }
      c.scene.remove(m); c.objects = c.objects.filter((o) => o !== m);
      const mat = m.material;
      const parts: { g: THREE.BufferGeometry; tag: string }[] = [];
      if ((keep === 'upper' || keep === 'both') && upper) parts.push({ g: upper, tag: 'top' });
      if ((keep === 'lower' || keep === 'both') && lower) parts.push({ g: lower, tag: 'bottom' });
      for (const pt of parts) {
        const nm = new THREE.Mesh(pt.g, Array.isArray(mat) ? mat[0].clone() : (mat as THREE.Material).clone());
        nm.name = `${m.name} (${pt.tag})`;
        nm.quaternion.copy(m.quaternion); nm.scale.copy(m.scale);
        c.scene.add(nm); c.objects.push(nm); dropToPlate(nm);
      }
      setCount(c.objects.length);
      if (c.objects.length) select(c.objects[c.objects.length - 1]);
      arrange();
    },
    // Mesh boolean via three-bvh-csg. Union merges all objects; subtract/intersect
    // apply the selected object against the rest. Result replaces the inputs.
    boolean: (op) => {
      const c = ctx.current; if (!c || c.objects.length < 2) return;
      const ev = new Evaluator();
      ev.attributes = ['position', 'normal'];   // only process attrs every brush has
      ev.useGroups = false;
      const brushOf = (m: THREE.Mesh) => {
        m.updateMatrixWorld(true);
        const g = m.geometry.clone().applyMatrix4(m.matrixWorld);
        g.deleteAttribute('uv'); g.deleteAttribute('color');
        if (!g.getAttribute('normal')) g.computeVertexNormals();
        const br = new Brush(g); br.updateMatrixWorld(); return br;
      };
      try {
        let acc: Brush;
        if (op === 'union') {
          acc = brushOf(c.objects[0]);
          for (let i = 1; i < c.objects.length; i++) { acc = ev.evaluate(acc, brushOf(c.objects[i]), ADDITION); acc.updateMatrixWorld(); }
        } else {
          const A = c.selected ?? c.objects[0];
          acc = brushOf(A);
          const CSG = op === 'subtract' ? SUBTRACTION : INTERSECTION;
          for (const m of c.objects) { if (m === A) continue; acc = ev.evaluate(acc, brushOf(m), CSG); acc.updateMatrixWorld(); }
        }
        const geom = acc.geometry.clone();
        if (!geom.getAttribute('position') || geom.getAttribute('position').count < 3) return;
        for (const m of c.objects) c.scene.remove(m);
        c.objects = []; select(null); setCount(0);
        addMesh(geom, 'Boolean');
      } catch { /* degenerate boolean — leave the scene unchanged */ }
    },
    // Add a primitive solid (usable as a modifier or, with boolean subtract, a
    // negative volume).
    addPrimitive: (shape) => {
      const c = ctx.current; if (!c) return;
      const s = Math.max(20, bed * 0.15);
      const g = shape === 'cylinder' ? new THREE.CylinderGeometry(s / 2, s / 2, s, 48)
        : shape === 'sphere' ? new THREE.SphereGeometry(s / 2, 48, 32)
          : new THREE.BoxGeometry(s, s, s);
      // Three primitives are Y-up; rotate to the plate's Z-up frame.
      if (shape === 'cylinder') g.rotateX(Math.PI / 2);
      g.computeVertexNormals();
      addMesh(g.toNonIndexed(), shape.charAt(0).toUpperCase() + shape.slice(1));
    },
    // Attach a part volume to the selected object (BambuStudio-style): a
    // negative volume is CSG-subtracted at slice time; support enforcer/blocker
    // volumes force or forbid support inside the region. The part rides with its
    // parent (never auto-arranged) and is transformable like any object.
    addPart: (type, shape) => {
      const c = ctx.current; if (!c) return;
      const parent = c.selected;
      if (!parent || parent.userData.partType) return;   // need a real object selected
      // Size the part to ~45% of the parent's smallest dimension so a negative
      // starts as a partial cavity (not an engulfing box that erases the model).
      parent.updateMatrixWorld(true);
      const pbox = new THREE.Box3().setFromObject(parent);
      const psize = new THREE.Vector3(); pbox.getSize(psize);
      const s = Math.max(4, 0.45 * Math.min(psize.x, psize.y, psize.z));
      const g = shape === 'cylinder' ? new THREE.CylinderGeometry(s / 2, s / 2, s, 48)
        : shape === 'sphere' ? new THREE.SphereGeometry(s / 2, 48, 32)
          : new THREE.BoxGeometry(s, s, s);
      if (shape === 'cylinder') g.rotateX(Math.PI / 2);
      g.computeVertexNormals();
      const color = type === 'negative' ? 0xe0463c : type === 'enforcer' ? 0x2a7de0 : type === 'blocker' ? 0x8a8f98 : 0x9b59d0;
      const mat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.42, roughness: 0.6, metalness: 0, depthWrite: false });
      const mesh = new THREE.Mesh(g.toNonIndexed(), mat);
      mesh.userData.partType = type;
      mesh.userData.partParentId = parent.uuid;
      if (type === 'modifier') mesh.userData.modifierSettings = {};   // { infill_density?, infill_pattern? }
      mesh.name = type === 'negative' ? 'Negative' : type === 'enforcer' ? 'Support enforcer' : type === 'blocker' ? 'Support blocker' : 'Modifier';
      const ctr = new THREE.Vector3(); pbox.getCenter(ctr);
      mesh.position.copy(ctr);
      c.scene.add(mesh); c.objects.push(mesh); setCount(c.objects.length);
      select(mesh); emitState(); pushHistory();
    },
    // 3-D text as a plate object (raised in Z). Union/subtract it onto a model
    // to emboss / engrave.
    addText: (text) => {
      const c = ctx.current; if (!c || !text.trim()) return;
      const size = Math.max(6, bed * 0.06);
      const geo = new TextGeometry(text, { font: getFont(), size, depth: Math.max(2, size * 0.3), curveSegments: 4, bevelEnabled: false });
      geo.computeVertexNormals();
      addMesh(geo, `Text: ${text}`);
    },
    addGeometry: (geom, name) => { addMesh(geom, name); },
    // Import an SVG as an extruded 3-D part (BambuStudio SVG tool). Union/subtract
    // it onto a model to emboss / engrave. Returns false if the SVG has no shapes.
    addSVG: (svgText, depthMm = 3, sizeMm = 50) => svgToPlate(svgText, depthMm, sizeMm),
    rename: (name) => { const m = ctx.current?.selected; if (m && name.trim()) { m.name = name.trim(); emitState(); } },
    // Modifier volumes → world-frame AABBs + their setting overrides. The native
    // engine applies each modifier's infill density/pattern inside its box.
    getModifiers: () => {
      const c = ctx.current; const out: { box: number[]; infill_density?: number; infill_pattern?: string }[] = []; if (!c) return out;
      const r = (v: number) => Math.round(v * 100) / 100;
      for (const m of c.objects) {
        if (m.userData.partType !== 'modifier') continue;
        m.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(m);
        const st = (m.userData.modifierSettings as Record<string, string>) || {};
        const e: { box: number[]; infill_density?: number; infill_pattern?: string } = { box: [r(bb.min.x), r(bb.min.y), r(bb.min.z), r(bb.max.x), r(bb.max.y), r(bb.max.z)] };
        if (st.infill_density !== undefined && st.infill_density !== '') e.infill_density = Number(st.infill_density);
        if (st.infill_pattern) e.infill_pattern = st.infill_pattern;
        out.push(e);
      }
      return out;
    },
    getModifierSettings: () => { const m = ctx.current?.selected; return m && m.userData.partType === 'modifier' ? ((m.userData.modifierSettings as Record<string, string>) || {}) : null; },
    setModifierSetting: (key, value) => {
      const m = ctx.current?.selected; if (!m || m.userData.partType !== 'modifier') return;
      const st = { ...((m.userData.modifierSettings as Record<string, string>) || {}) };
      if (value === '' || value == null) delete st[key]; else st[key] = value;
      m.userData.modifierSettings = st; emitState();
    },
    undo: () => { if (histIdx.current > 0) { histIdx.current -= 1; applySnap(history.current[histIdx.current]); } },
    redo: () => { if (histIdx.current < history.current.length - 1) { histIdx.current += 1; applySnap(history.current[histIdx.current]); } },
    resetView: () => {
      const c = ctx.current; if (!c) return;
      c.camera.position.set(bed * 0.9, -bed * 1.1, bed * 0.9);
      c.orbit.target.set(0, 0, bed * 0.15); c.orbit.update();
    },
    setVisible: (index: number, visible: boolean) => {
      const c = ctx.current; if (!c) return;
      const m = c.objects[index]; if (!m) return;
      m.visible = visible;
      // Cascade to this object's part children (negatives/modifiers).
      for (const o of c.objects) if (o.userData.partParentId === m.uuid) o.visible = visible;
      if (!visible && c.selected === m) select(null);
      emitState();
    },
    restore: (snap) => {
      const c = ctx.current; if (!c) return;
      select(null);
      for (const m of c.objects) c.scene.remove(m);
      c.objects = snap.slice();
      for (const m of c.objects) c.scene.add(m);
      setCount(c.objects.length);
      if (c.objects[0]) select(c.objects[0]);
      emitState();
    },
    // Remove the selected object from this plate (kept live) and return it, so
    // the caller can drop it onto another plate's snapshot.
    detachSelected: () => {
      const c = ctx.current; if (!c || !c.selected) return null;
      const m = c.selected;
      c.scene.remove(m);
      c.objects = c.objects.filter((o) => o !== m);
      select(null); setCount(c.objects.length);
      if (c.objects[0]) select(c.objects[0]);
      arrange(); emitState();
      return m;
    },
    simplify: () => {
      const c = ctx.current; if (!c || !c.selected) return;
      const m = c.selected;
      const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry;
      const verts = g.getAttribute('position').count;
      const remove = Math.floor(verts * 0.5);   // halve the vertex count
      if (remove < 3) return;
      try {
        const simplified = new SimplifyModifier().modify(g, remove);
        simplified.computeVertexNormals();
        m.geometry.dispose(); m.geometry = simplified;
        dropToPlate(m); emitObject();
      } catch { /* SimplifyModifier can fail on non-manifold meshes — leave as-is */ }
    },
    setPos: (x: number, y: number) => { const m = ctx.current?.selected; if (!m) return; m.position.x = x; m.position.y = y; emitObject(); },
    setRot: (x: number, y: number, z: number) => { const m = ctx.current?.selected; if (!m) return; const D = Math.PI / 180; m.rotation.set(x * D, y * D, z * D); dropToPlate(m); emitObject(); },
    setScalePct: (pct: number) => { const m = ctx.current?.selected; if (!m || !(pct > 0)) return; const s = pct / 100; m.scale.set(s, s, s); dropToPlate(m); emitObject(); },
    setDim: (axis: 'x' | 'y' | 'z', mm: number, uniform: boolean) => {
      const m = ctx.current?.selected; if (!m || !(mm > 0)) return;
      m.updateMatrixWorld(true);
      const size = new THREE.Vector3(); new THREE.Box3().setFromObject(m).getSize(size);
      const cur = size[axis]; if (!(cur > 0)) return;
      const factor = mm / cur;
      if (uniform) m.scale.multiplyScalar(factor);
      else m.scale[axis] *= factor;
      dropToPlate(m); emitObject();
    },
    mirror: (axis: 'x' | 'y' | 'z') => { const m = ctx.current?.selected; if (!m) return; m.scale[axis] *= -1; dropToPlate(m); emitObject(); },
    resetXform: () => { const m = ctx.current?.selected; if (!m) return; m.rotation.set(0, 0, 0); m.scale.set(1, 1, 1); m.position.x = 0; m.position.y = 0; dropToPlate(m); emitObject(); },
    scaleToFit: () => {
      const m = ctx.current?.selected; if (!m) return;
      m.updateMatrixWorld(true);
      const size = new THREE.Vector3(); new THREE.Box3().setFromObject(m).getSize(size);
      const maxXY = Math.max(size.x, size.y); if (!(maxXY > 0)) return;
      const factor = (bed * 0.9) / maxXY;
      m.scale.multiplyScalar(factor); dropToPlate(m); emitObject();
    },
    rotate90: (axis: 'x' | 'y' | 'z') => { const m = ctx.current?.selected; if (!m) return; m.rotation[axis] += Math.PI / 2; dropToPlate(m); emitObject(); },
    duplicateN: (n: number) => { for (let i = 0; i < n; i++) duplicate(); },
    fillBed: () => {
      const c = ctx.current; const src = c?.selected; if (!c || !src) return;
      src.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(src);
      const size = new THREE.Vector3(); box.getSize(size);
      const gap = 4;
      const cellX = Math.max(size.x, 1) + gap, cellY = Math.max(size.y, 1) + gap;
      const cols = Math.max(1, Math.floor(bed / cellX));
      const rows = Math.max(1, Math.floor(bed / cellY));
      const target = Math.min(cols * rows, 100);   // safety cap
      const positives = () => c.objects.filter((o) => !o.userData.partType);
      for (let i = positives().length; i < target; i++) duplicate();
      // Pack every top-level object into the size-aware grid, centred on the bed.
      const items = positives();
      const usedCols = Math.min(cols, items.length);
      const usedRows = Math.ceil(items.length / cols);
      items.forEach((m, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        m.position.x = (col - (usedCols - 1) / 2) * cellX;
        m.position.y = (row - (usedRows - 1) / 2) * cellY;
        dropToPlate(m);
      });
      select(items[0] ?? null); setCount(c.objects.length); emitObject(); emitState(); pushHistory();
    },
    serializePlate: () => {
      const c = ctx.current; if (!c) return [];
      return c.objects.map((m): SerializedObj => {
        const pos = m.geometry.getAttribute('position');
        const parentIdx = m.userData.partParentId ? c.objects.findIndex((o) => o.uuid === m.userData.partParentId) : -1;
        return {
          name: m.name,
          partType: (m.userData.partType as string) || '',
          parentIdx,
          modifierSettings: (m.userData.modifierSettings as Record<string, unknown>) ?? null,
          pos: [m.position.x, m.position.y, m.position.z],
          quat: [m.quaternion.x, m.quaternion.y, m.quaternion.z, m.quaternion.w],
          scale: [m.scale.x, m.scale.y, m.scale.z],
          verts: Array.from(pos.array as Float32Array),
        };
      });
    },
    loadProject: (objs) => {
      const c = ctx.current; if (!c || !Array.isArray(objs)) return;
      select(null);
      for (const m of c.objects) c.scene.remove(m);
      c.objects = [];
      const created: THREE.Mesh[] = objs.map((o) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(o.verts, 3));
        g.computeVertexNormals();
        let mat: THREE.Material;
        if (o.partType) {
          const color = o.partType === 'negative' ? 0xe0463c : o.partType === 'enforcer' ? 0x2a7de0 : o.partType === 'blocker' ? 0x8a8f98 : 0x9b59d0;
          mat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.42, roughness: 0.6, metalness: 0, depthWrite: false });
        } else mat = MAT();
        const mesh = new THREE.Mesh(g, mat);
        mesh.name = o.name;
        mesh.position.set(o.pos[0], o.pos[1], o.pos[2]);
        mesh.quaternion.set(o.quat[0], o.quat[1], o.quat[2], o.quat[3]);
        mesh.scale.set(o.scale[0], o.scale[1], o.scale[2]);
        if (o.partType) mesh.userData.partType = o.partType;
        if (o.modifierSettings) mesh.userData.modifierSettings = o.modifierSettings;
        c.scene.add(mesh); c.objects.push(mesh);
        return mesh;
      });
      objs.forEach((o, i) => { if (o.parentIdx >= 0 && created[o.parentIdx]) created[i].userData.partParentId = created[o.parentIdx].uuid; });
      setCount(c.objects.length);
      select(c.objects[0] ?? null);
      emitState(); emitObject(); pushHistory();
    },
    exportSTL: (name: string) => {
      const c = ctx.current; if (!c || !c.objects.length) return null;
      const positives = c.objects.filter((m) => !m.userData.partType && m.visible !== false);
      if (!positives.length) return null;
      const ev = new Evaluator(); ev.attributes = ['position', 'normal']; ev.useGroups = false;
      const group = new THREE.Group();
      for (const m of positives) {
        m.updateMatrixWorld(true);
        let g = m.geometry.clone().applyMatrix4(m.matrixWorld);
        // Carve out this object's negative-part volumes at export time.
        const negs = c.objects.filter((p) => p.userData.partType === 'negative' && p.userData.partParentId === m.uuid);
        for (const p of negs) {
          p.updateMatrixWorld(true);
          const pg = p.geometry.clone().applyMatrix4(p.matrixWorld);
          try {
            const carved = csgApply(ev, g, pg, SUBTRACTION);
            const pos = carved.getAttribute('position');
            if (pos && pos.count >= 3) g = carved;   // ignore a subtract that erases the solid
          } catch { /* degenerate subtract — keep the solid */ }
        }
        group.add(new THREE.Mesh(g));
      }
      const stl = new STLExporter().parse(group, { binary: false }) as string;
      return new File([stl], name.replace(/\.[^.]+$/, '') + '.stl', { type: 'model/stl' });
    },
    exportEach: (name: string) => {
      const c = ctx.current; if (!c || !c.objects.length) return [];
      const exp = new STLExporter();
      const bn = name.replace(/\.[^.]+$/, '');
      const ev = new Evaluator(); ev.attributes = ['position', 'normal']; ev.useGroups = false;
      const positives = c.objects.filter((m) => !m.userData.partType && m.visible !== false);
      return positives.map((m, index) => {
        m.updateMatrixWorld(true);
        let g = m.geometry.clone().applyMatrix4(m.matrixWorld);
        for (const p of c.objects.filter((q) => q.userData.partType === 'negative' && q.userData.partParentId === m.uuid)) {
          p.updateMatrixWorld(true);
          try {
            const carved = csgApply(ev, g, p.geometry.clone().applyMatrix4(p.matrixWorld), SUBTRACTION);
            const pos = carved.getAttribute('position');
            if (pos && pos.count >= 3) g = carved;
          } catch { /* keep solid */ }
        }
        const group = new THREE.Group(); group.add(new THREE.Mesh(g));
        return { index, file: new File([exp.parse(group, { binary: false }) as string], `${bn}_obj${index}.stl`, { type: 'model/stl' }) };
      });
    },
    recolor: (colors: string[]) => {
      const c = ctx.current; if (!c) return;
      for (const m of c.objects) {
        const mats = m.userData.materials as { extruder: number; geometry: THREE.BufferGeometry }[] | undefined;
        if (!mats || !mats.length) continue;
        const parts = mats.map((mm) => {
          const g = mm.geometry.clone();
          const col = new THREE.Color(colors[(mm.extruder - 1) % colors.length] || '#9aa4b2');
          const n = g.getAttribute('position').count; const cols = new Float32Array(n * 3);
          for (let i = 0; i < n; i++) { cols[i * 3] = col.r; cols[i * 3 + 1] = col.g; cols[i * 3 + 2] = col.b; }
          g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
          return g;
        });
        const merged = mergeGeometries(parts, false);
        if (merged) { merged.computeVertexNormals(); m.geometry.dispose(); m.geometry = merged; }
      }
    },
    hasMaterials: () => {
      const c = ctx.current; if (!c) return false;
      const exts = new Set<number>();
      for (const m of c.objects) { const ms = m.userData.materials as { extruder: number }[] | undefined; if (ms) ms.forEach((x) => exts.add(x.extruder)); else exts.add(1); }
      return exts.size > 1;
    },
    exportMaterials: (name: string) => {
      const c = ctx.current; if (!c || !c.objects.length) return [];
      // Group every object's per-material geometry (baked to world) by extruder.
      const byExt = new Map<number, THREE.Group>();
      const grp = (ext: number) => byExt.get(ext) ?? (byExt.set(ext, new THREE.Group()), byExt.get(ext)!);
      for (const m of c.objects) {
        m.updateMatrixWorld(true);
        const ms = m.userData.materials as { extruder: number; geometry: THREE.BufferGeometry }[] | undefined;
        if (ms && ms.length) {
          for (const mm of ms) grp(mm.extruder).add(new THREE.Mesh(mm.geometry.clone().applyMatrix4(m.matrixWorld)));
        } else {
          grp(1).add(new THREE.Mesh(m.geometry.clone().applyMatrix4(m.matrixWorld)));
        }
      }
      const exp = new STLExporter();
      const bn = name.replace(/\.[^.]+$/, '');
      return [...byExt.entries()].sort((a, b) => a[0] - b[0]).map(([extruder, group]) => ({
        extruder,
        file: new File([exp.parse(group, { binary: false }) as string], `${bn}_ext${extruder}.stl`, { type: 'model/stl' }),
      }));
    },
  }));

  return (
    <div className="plate-root">
      <div className="plate-stage-wrap">
        <div ref={mount} className="plate-canvas" />
        <div className="plate-count">{count} {t('v2.plate.objects', 'object(s)')}{sel ? ` · ${t('v2.plate.selected', 'selected')}` : ''}</div>
        {measuring && (
          <div className="plate-measure">
            {measure
              ? <><b>{measure.dist.toFixed(2)} mm</b><span>ΔX {measure.dx.toFixed(2)} · ΔY {measure.dy.toFixed(2)} · ΔZ {measure.dz.toFixed(2)}</span></>
              : <span>{t('v2.plate.measure_hint', 'Click two points to measure')}</span>}
          </div>
        )}
      </div>
    </div>
  );
});
