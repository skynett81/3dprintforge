import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useT } from '../i18n';
import { parseGcode, type ParsedGcode, type Feature } from '../lib/gcode-parse';
import { gradientBackground, buildPlate } from './plate-scene';

interface Ctx {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  orbit: OrbitControls; group: THREE.Group; raf: number;
}

// Feature colours mirror a desktop slicer's preview legend.
const FEATURE_COLOR: Record<Feature, number> = {
  'outer-wall': 0xff8a3d,
  'inner-wall': 0xf6c945,
  wall: 0xff8a3d,
  solid: 0xe6564b,
  sparse: 0x37a66b,
  support: 0x4f8bd8,
  skirt: 0x9aa4b2,
  brim: 0x9aa4b2,
  ironing: 0xc084fc,
  bridge: 0x22b8cf,
  gap: 0xef8c5a,
  wipe_tower: 0x9b59d0,
};
const FEATURE_LABEL: Record<Feature, string> = {
  'outer-wall': 'Outer wall', 'inner-wall': 'Inner wall', wall: 'Wall',
  solid: 'Top/bottom', sparse: 'Infill', support: 'Support', skirt: 'Skirt', brim: 'Brim', ironing: 'Ironing', bridge: 'Bridge', gap: 'Gap fill', wipe_tower: 'Wipe tower',
};
const LEGEND_ORDER: Feature[] = ['outer-wall', 'inner-wall', 'solid', 'bridge', 'gap', 'ironing', 'sparse', 'support', 'skirt', 'brim', 'wipe_tower', 'wall'];

/**
 * Vertical dual-handle "layer tower" on the right of the preview — the BambuStudio
 * layer slider. The top handle sets the highest visible layer (scrubbed), the
 * bottom handle raises the lowest visible layer so you can inspect an interior
 * band / cross-section. Values are 1-based layer numbers.
 */
function LayerTower({ total, low, high, onLow, onHigh }: { total: number; low: number; high: number; onLow: (v: number) => void; onHigh: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<'low' | 'high' | null>(null);
  useEffect(() => {
    const valFromY = (clientY: number) => {
      const el = ref.current; if (!el) return high;
      const r = el.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (clientY - r.top) / Math.max(1, r.height)));
      return Math.round((1 - f) * (total - 1)) + 1;   // top = top layer, bottom = layer 1
    };
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const v = valFromY(e.clientY);
      if (drag.current === 'high') onHigh(Math.max(low, v)); else onLow(Math.min(high, v));
    };
    const up = () => { drag.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [low, high, total, onLow, onHigh]);
  const span = Math.max(1, total - 1);
  const yOf = (v: number) => `${(1 - (v - 1) / span) * 100}%`;
  return (
    <div className="gpreview-tower" ref={ref} role="group" aria-label="Layer range">
      <div className="gpreview-tower-track" />
      <div className="gpreview-tower-fill" style={{ top: yOf(high), bottom: `${((low - 1) / span) * 100}%` }} />
      <div className="gpreview-tower-handle" style={{ top: yOf(high) }} title={`Top layer ${high}`}
        onPointerDown={(e) => { e.preventDefault(); drag.current = 'high'; }}>
        <span className="gpreview-tower-lbl">{high}</span>
      </div>
      <div className="gpreview-tower-handle gpreview-tower-handle--low" style={{ top: yOf(low) }} title={`Bottom layer ${low}`}
        onPointerDown={(e) => { e.preventDefault(); drag.current = 'low'; }}>
        {low > 1 && <span className="gpreview-tower-lbl">{low}</span>}
      </div>
    </div>
  );
}

/**
 * G-code toolpath preview: renders extrusion moves layer-by-layer, coloured
 * per feature (walls / infill / support …) with a slider — exactly like a
 * desktop slicer's preview. Z-up, millimetres.
 */
type ColorMode = 'feature' | 'speed' | 'flow' | 'layertime' | 'tool';
const FULL = 1e9;   // "show the whole top layer" sentinel for the moves counter

export function GcodePreview({ gcode, bed = 256, bedY, slotColors, pricePerGram = 0, lineWidth = 0.42, colorChangeLayers, onAddColorChange, onRemoveColorChange }: { gcode: string; bed?: number; bedY?: number; slotColors?: string[]; pricePerGram?: number; lineWidth?: number; colorChangeLayers?: number[]; onAddColorChange?: (layer: number) => void; onRemoveColorChange?: (layer: number) => void }) {
  const bedYv = bedY ?? bed;
  const t = useT();
  const mount = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx | null>(null);
  const parsed: ParsedGcode = useMemo(() => parseGcode(gcode), [gcode]);
  const total = parsed.layers.length;
  const [layer, setLayer] = useState(total);
  const [low, setLow] = useState(1);
  // Moves shown of the TOP layer (for BambuStudio's move-by-move Play build-up).
  // A large value means "show the whole layer"; render clamps it to the layer's
  // segment count. Only Play drives it below full; the layer sliders keep it full.
  const [moves, setMoves] = useState(FULL);
  const [showTravel, setShowTravel] = useState(false);
  const [mode, setMode] = useState<ColorMode>('feature');
  const [playing, setPlaying] = useState(false);
  const [hiddenFeats, setHiddenFeats] = useState<Set<Feature>>(new Set());
  const toggleFeat = (f: Feature) => setHiddenFeats((prev) => { const n = new Set(prev); if (n.has(f)) n.delete(f); else n.add(f); return n; });

  useEffect(() => { setLayer(total); setLow(1); setMoves(FULL); }, [total]);
  // A multi-colour slice defaults to the Filament (tool) view so the painted
  // colours show straight away, like BambuStudio.
  useEffect(() => { if (parsed.tools.length > 1) setMode('tool'); }, [parsed]);

  // Play: build up the print move by move, advancing a layer once its moves are
  // exhausted (BambuStudio's nozzle animation), then stop at the top.
  const layerRef = useRef(layer); layerRef.current = layer;
  useEffect(() => {
    if (!playing) return;
    const STEP = 40;   // extrusion segments revealed per tick
    const id = setInterval(() => {
      const li = layerRef.current;
      const topSeg = (parsed.layers[li - 1]?.allSeg.length ?? 0) / 4;
      setMoves((m) => {
        const next = Math.min(m, topSeg) + STEP;
        if (next >= topSeg) {
          if (li >= total) { setPlaying(false); return FULL; }
          setLayer(li + 1);
          return 0;   // start building the next layer from its first move
        }
        return next;
      });
    }, 45);
    return () => clearInterval(id);
  }, [playing, total, parsed]);

  // Cumulative time / filament-length up to each layer (for the readout).
  const cum = useMemo(() => {
    let tSum = 0, eSum = 0; const tArr: number[] = [], eArr: number[] = [];
    for (const l of parsed.layers) { tSum += l.timeSec; eSum += l.eLen; tArr.push(tSum); eArr.push(eSum); }
    return { tArr, eArr, totTime: tSum, totE: eSum };
  }, [parsed]);
  // Colour-change layers: where the tool at the start of a layer differs from
  // the previous layer's tool (a filament swap / M600). Shown as ticks on the
  // slider and jump targets — completes the multi-colour / HueForge workflow.
  const colorChanges = useMemo(() => {
    const out: { layer: number; z: number; tool: number }[] = [];
    let prev = -1;
    parsed.layers.forEach((l, i) => {
      const tool = l.allTool.length ? (l.allTool[0] || 0) : prev < 0 ? 0 : prev;
      if (prev >= 0 && tool !== prev) out.push({ layer: i + 1, z: l.z, tool });
      prev = l.allTool.length ? (l.allTool[l.allTool.length - 1] || 0) : prev;
    });
    return out;
  }, [parsed]);

  const lwRef = useRef(lineWidth); lwRef.current = lineWidth;
  // Filament mm → grams (1.75 mm, ~1.24 g/cm³ — approximate; the exact figure
  // is the slice total in the header).
  const gramsOf = (mm: number) => (mm * Math.PI * 0.875 * 0.875 * 1.24) / 1000;
  const fmtT = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.round((s % 3600) / 60)}m` : s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`);

  useEffect(() => {
    const el = mount.current; if (!el) return;
    const w = el.clientWidth || 640; const h = el.clientHeight || 440;
    const scene = new THREE.Scene();
    scene.background = gradientBackground();
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 5000);
    camera.up.set(0, 0, 1);
    camera.position.set(bed * 0.8, -bed * 1.0, bed * 0.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    buildPlate(scene, bed, bedYv);
    // Lights so the extrusion beads read as 3-D printed lines (with layers),
    // not flat ribbons.
    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a3340, 1.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.25); keyLight.position.set(0.6, -1, 1.4); scene.add(keyLight);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; orbit.target.set(0, 0, bed * 0.1);
    const group = new THREE.Group(); scene.add(group);
    const c: Ctx = { scene, camera, renderer, orbit, group, raf: 0 };
    ctx.current = c;
    const loop = () => { c.raf = requestAnimationFrame(loop); orbit.update(); renderer.render(scene, camera); };
    loop();
    const onResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight; if (!nw || !nh) return;
      camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
      // Fat-line materials need the viewport resolution for correct width AA.
      for (const o of group.children) { const m = (o as { material?: { resolution?: THREE.Vector2 } }).material; if (m?.resolution) m.resolution.set(nw, nh); }
    };
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize); ro.observe(el);
    return () => {
      cancelAnimationFrame(c.raf);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
      ctx.current = null;
    };
  }, [bed]);

  useEffect(() => {
    const c = ctx.current; if (!c) return;
    for (let i = c.group.children.length - 1; i >= 0; i--) {
      const o = c.group.children[i] as unknown as { geometry: { dispose(): void }; material: { dispose(): void } };
      o.geometry.dispose(); o.material.dispose();
      c.group.remove(c.group.children[i]);
    }
    const cx = (parsed.bbox.minX + parsed.bbox.maxX) / 2;
    const cy = (parsed.bbox.minY + parsed.bbox.maxY) / 2;
    const shown = Math.min(layer, total);
    const loIdx = Math.max(0, Math.min(low - 1, shown - 1));   // lowest visible layer index
    const travelPos: number[] = [];
    // Render each extrusion move as a 3-D "bead": an oriented box the width of
    // the line and the height of one layer. This shows real printed layers (like
    // OrcaSlicer) instead of merged camera-facing ribbons. Huge models fall back
    // to thin lines so the preview stays responsive.
    const layerH = total > 1 ? Math.max(0.06, Math.min(1.2, parsed.layers[1].z - parsed.layers[0].z)) : 0.2;
    const beadHW = Math.max(0.15, lwRef.current) / 2;
    const IDX = [4, 5, 6, 4, 6, 7, 0, 2, 1, 0, 3, 2, 4, 7, 3, 4, 3, 0, 5, 4, 0, 5, 0, 1, 6, 5, 1, 6, 1, 2, 7, 6, 2, 7, 2, 3];
    const fatLine = (positions: number[], opts: { color?: number; colors?: number[] }) => {
      const nSeg = positions.length / 6;
      if (nSeg > 250000) {   // too many beads → cheap line render
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        if (opts.colors) g.setAttribute('color', new THREE.Float32BufferAttribute(opts.colors, 3));
        return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: opts.color ?? 0xffffff, vertexColors: !!opts.colors }));
      }
      const P = new Float32Array(nSeg * 108);          // 36 verts × 3
      const C = opts.colors ? new Float32Array(nSeg * 108) : null;
      const V = new Float32Array(24);
      let wp = 0, wc = 0;
      for (let s = 0; s < nSeg; s++) {
        const o = s * 6;
        const ax = positions[o], ay = positions[o + 1], z = positions[o + 2], bx = positions[o + 3], by = positions[o + 4];
        let dx = bx - ax, dy = by - ay; const L = Math.hypot(dx, dy); if (L < 1e-6) continue; dx /= L; dy /= L;
        const nx = -dy * beadHW, ny = dx * beadHW, zt = z, zb = z - layerH;
        V[0] = ax + nx; V[1] = ay + ny; V[2] = zb; V[3] = ax - nx; V[4] = ay - ny; V[5] = zb; V[6] = bx - nx; V[7] = by - ny; V[8] = zb; V[9] = bx + nx; V[10] = by + ny; V[11] = zb;
        V[12] = ax + nx; V[13] = ay + ny; V[14] = zt; V[15] = ax - nx; V[16] = ay - ny; V[17] = zt; V[18] = bx - nx; V[19] = by - ny; V[20] = zt; V[21] = bx + nx; V[22] = by + ny; V[23] = zt;
        for (let t = 0; t < 36; t++) { const ci = IDX[t] * 3; P[wp++] = V[ci]; P[wp++] = V[ci + 1]; P[wp++] = V[ci + 2]; }
        if (C) { const co = s * 6, r = opts.colors![co], g = opts.colors![co + 1], b = opts.colors![co + 2]; for (let t = 0; t < 36; t++) { C[wc++] = r; C[wc++] = g; C[wc++] = b; } }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(P.subarray(0, wp), 3));
      if (C) geo.setAttribute('color', new THREE.BufferAttribute(C.subarray(0, wc), 3));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: opts.color ?? 0xffffff, vertexColors: !!C, roughness: 0.9, metalness: 0, flatShading: true, side: THREE.DoubleSide }));
    };

    if (mode !== 'feature') {
      // Colour each extrusion segment by a per-segment value (speed / flow),
      // per-layer value (layer time) or the active tool — like BambuStudio's
      // "colour by" preview modes.
      const range = mode === 'flow' ? parsed.flowRange : mode === 'layertime' ? parsed.layerTimeRange : parsed.speedRange;
      const span = Math.max(1e-6, range.max - range.min);
      const palette = (slotColors && slotColors.length ? slotColors : ['#ff8a3d', '#37a66b', '#2a4bd8', '#d6333a']).map((h) => new THREE.Color(h));
      const pos: number[] = [];
      const col: number[] = [];
      const rgb = new THREE.Color();
      for (let i = loIdx; i < shown; i++) {
        const l = parsed.layers[i];
        const nSeg = i === shown - 1 ? Math.min(moves, l.allSeg.length / 4) : l.allSeg.length / 4;
        for (let k = 0, s = 0; s < nSeg; k += 4, s++) {
          if (mode === 'tool') {
            rgb.copy(palette[(l.allTool[s] || 0) % palette.length]);
          } else {
            const val = mode === 'flow' ? l.allFlow[s] : mode === 'layertime' ? l.timeSec : l.allSpeed[s];
            const t01 = Math.min(1, Math.max(0, (val - range.min) / span));
            rgb.setHSL((1 - t01) * 0.66, 0.9, 0.5);
          }
          pos.push(l.allSeg[k] - cx, l.allSeg[k + 1] - cy, l.z, l.allSeg[k + 2] - cx, l.allSeg[k + 3] - cy, l.z);
          col.push(rgb.r, rgb.g, rgb.b, rgb.r, rgb.g, rgb.b);
        }
        if (showTravel && i === shown - 1) for (let k = 0; k < l.travel.length; k += 4) travelPos.push(l.travel[k] - cx, l.travel[k + 1] - cy, l.z, l.travel[k + 2] - cx, l.travel[k + 3] - cy, l.z);
      }
      if (pos.length) c.group.add(fatLine(pos, { colors: col }));
    } else {
      // One buffer per feature (batched across visible layers).
      const byFeature = new Map<Feature, number[]>();
      const topI = shown - 1;
      for (let i = loIdx; i < shown; i++) {
        const l = parsed.layers[i];
        const partialTop = i === topI && moves < l.allSeg.length / 4;
        if (!partialTop) {
          // Fast grouped path for fully-shown layers.
          for (const key of Object.keys(l.feats) as Feature[]) {
            if (hiddenFeats.has(key)) continue;   // feature toggled off in the legend
            const src = l.feats[key]!;
            const dst = byFeature.get(key) ?? (byFeature.set(key, []), byFeature.get(key)!);
            for (let k = 0; k < src.length; k += 4) dst.push(src[k] - cx, src[k + 1] - cy, l.z, src[k + 2] - cx, src[k + 3] - cy, l.z);
          }
        } else {
          // Top layer during move-scrub: only the first `moves` segments, in
          // emission order (allSeg/allFeat), so the layer builds up move by move.
          const nSeg = Math.min(moves, l.allSeg.length / 4);
          for (let s = 0; s < nSeg; s++) {
            const key = l.allFeat[s]; if (hiddenFeats.has(key)) continue;
            const dst = byFeature.get(key) ?? (byFeature.set(key, []), byFeature.get(key)!);
            const k = s * 4;
            dst.push(l.allSeg[k] - cx, l.allSeg[k + 1] - cy, l.z, l.allSeg[k + 2] - cx, l.allSeg[k + 3] - cy, l.z);
          }
        }
        if (showTravel && i === shown - 1) for (let k = 0; k < l.travel.length; k += 4) travelPos.push(l.travel[k] - cx, l.travel[k + 1] - cy, l.z, l.travel[k + 2] - cx, l.travel[k + 3] - cy, l.z);
      }
      for (const [feat, pos] of byFeature) {
        if (!pos.length) continue;
        c.group.add(fatLine(pos, { color: FEATURE_COLOR[feat] ?? 0x00b3a4 }));
      }
    }
    if (travelPos.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(travelPos, 3));
      c.group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 })));
    }
  }, [parsed, layer, low, moves, showTravel, total, mode, slotColors, hiddenFeats]);

  const shown = Math.min(layer, total);
  const curLayer = parsed.layers[shown - 1];
  const curZ = curLayer?.z ?? 0;
  const legend = LEGEND_ORDER.filter((f) => parsed.features.includes(f));

  return (
    <div className="gpreview-root">
      <div className="gpreview-wrap">
        <div ref={mount} className="plate-canvas" />
        {total > 1 && <LayerTower total={total} low={low} high={shown} onLow={(v) => { setPlaying(false); setLow(v); setMoves(FULL); }} onHigh={(v) => { setPlaying(false); setLayer(v); setMoves(FULL); }} />}
        {/* Prominent print summary — total time, layer count and filament, so
            "how long / how many layers" is obvious at a glance (BambuStudio). */}
        <div className="gpreview-summary">
          <div className="gpreview-summary-row"><span className="gpreview-summary-v">{fmtT(cum.totTime)}</span><span className="gpreview-summary-l">{t('v2.gpreview.print_time', 'print time')}</span></div>
          <div className="gpreview-summary-row"><span className="gpreview-summary-v">{total}</span><span className="gpreview-summary-l">{t('v2.gpreview.layers', 'layers')}</span></div>
          <div className="gpreview-summary-row"><span className="gpreview-summary-v">{gramsOf(cum.totE).toFixed(1)} g</span><span className="gpreview-summary-l">{t('v2.gpreview.filament', 'filament')}</span></div>
          {pricePerGram > 0 && <div className="gpreview-summary-row"><span className="gpreview-summary-v">{(gramsOf(cum.totE) * pricePerGram).toFixed(1)} kr</span><span className="gpreview-summary-l">{t('v2.gpreview.cost', 'cost')}</span></div>}
        </div>
        {/* BambuStudio-style "Colour scheme" panel: mode selector + legend + options */}
        <div className="gpreview-side">
          <select className="gpreview-side-select" value={mode} onChange={(e) => setMode(e.target.value as ColorMode)}>
            <option value="feature">{t('v2.gpreview.by_feature', 'Line type')}</option>
            <option value="speed">{t('v2.gpreview.by_speed', 'Speed')}</option>
            <option value="flow">{t('v2.gpreview.by_flow', 'Flow')}</option>
            <option value="layertime">{t('v2.gpreview.by_layertime', 'Layer time')}</option>
            {parsed.tools.length > 1 && <option value="tool">{t('v2.gpreview.by_tool', 'Filament')}</option>}
          </select>
          {mode === 'feature' && legend.length > 0 && (
            <div className="gpreview-side-legend">
              {legend.map((f) => (
                <button key={f} type="button" className={`gpreview-legend-item gpreview-legend-btn${hiddenFeats.has(f) ? ' gpreview-legend-btn--off' : ''}`}
                  title={t('v2.gpreview.toggle_feat', 'Click to show / hide this feature')} onClick={() => toggleFeat(f)}>
                  <i style={{ background: `#${(FEATURE_COLOR[f] ?? 0).toString(16).padStart(6, '0')}` }} />
                  {t(`v2.gpreview.${f}`, FEATURE_LABEL[f] ?? f)}
                </button>
              ))}
            </div>
          )}
          {(mode === 'speed' || mode === 'flow' || mode === 'layertime') && (() => {
            const rng = mode === 'flow' ? parsed.flowRange : mode === 'layertime' ? parsed.layerTimeRange : parsed.speedRange;
            const unit = mode === 'flow' ? 'mm³/s' : mode === 'layertime' ? 's' : 'mm/s';
            return (
              <div className="gpreview-side-legend">
                <span className="gpreview-legend-item"><i style={{ width: 40, height: 6, background: 'linear-gradient(90deg,#2a4bd8,#2ecc71,#e0603a,#d6333a)' }} /></span>
                <span className="gpreview-legend-item" style={{ justifyContent: 'space-between' }}>{rng.min.toFixed(mode === 'flow' ? 1 : 0)}–{rng.max.toFixed(mode === 'flow' ? 1 : 0)} {unit}</span>
              </div>
            );
          })()}
          {mode === 'tool' && parsed.tools.length > 0 && (
            <div className="gpreview-side-legend">
              {parsed.tools.map((ti) => (
                <span key={ti} className="gpreview-legend-item">
                  <i style={{ background: (slotColors && slotColors[ti]) || ['#ff8a3d', '#37a66b', '#2a4bd8', '#d6333a'][ti % 4] }} />
                  {t('v2.gpreview.tool', 'Filament')} {ti + 1}
                </span>
              ))}
            </div>
          )}
          <label className="chk gpreview-side-opt"><input type="checkbox" checked={showTravel} onChange={(e) => setShowTravel(e.target.checked)} /> {t('v2.gpreview.travel', 'Travel')}</label>
        </div>
      </div>
      <div className="gpreview-controls">
        <button className="btn btn--sm btn--ghost" style={{ minWidth: 34 }} title={playing ? t('v2.gpreview.pause', 'Pause') : t('v2.gpreview.play', 'Play')}
          onClick={() => { setPlaying((p) => { const next = !p; if (next) { setLayer(Math.max(1, low)); setMoves(0); } return next; }); }}>{playing ? '❚❚' : '▶'}</button>
        <span className="muted micro" style={{ minWidth: 80 }}>{t('v2.gpreview.layer', 'Layer')} {shown}/{total}</span>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          {colorChanges.length > 0 && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, pointerEvents: 'none' }}>
              {colorChanges.map((cc) => (
                <span key={cc.layer}
                  title={`${t('v2.gpreview.colorchange', 'Colour change')} · ${t('v2.gpreview.layer', 'Layer')} ${cc.layer} · z ${cc.z.toFixed(2)} · ${t('v2.gpreview.tool', 'Filament')} ${cc.tool + 1}`}
                  style={{
                    position: 'absolute', top: 1, bottom: 1, width: 2, borderRadius: 1, pointerEvents: 'auto', cursor: 'pointer',
                    left: `${((cc.layer - 1) / Math.max(1, total - 1)) * 100}%`,
                    background: (slotColors && slotColors[cc.tool]) || ['#ff8a3d', '#37a66b', '#2a4bd8', '#d6333a'][cc.tool % 4],
                  }}
                  onClick={() => { setPlaying(false); setLayer(cc.layer); }} />
              ))}
            </div>
          )}
          {(colorChangeLayers ?? []).length > 0 && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, pointerEvents: 'none' }}>
              {(colorChangeLayers ?? []).map((cl) => (
                <span key={`m${cl}`} className="gpreview-cc-marker"
                  title={`${t('v2.gpreview.colorchange', 'Colour change')} · ${t('v2.gpreview.layer', 'Layer')} ${cl} — ${t('v2.gpreview.remove_change', 'click to remove')}`}
                  style={{ position: 'absolute', top: -3, height: 8, width: 8, marginLeft: -4, transform: 'rotate(45deg)', background: '#e0603a', border: '1px solid #fff', borderRadius: 1, pointerEvents: 'auto', cursor: 'pointer', left: `${((cl - 1) / Math.max(1, total - 1)) * 100}%` }}
                  onClick={() => onRemoveColorChange?.(cl)} />
              ))}
            </div>
          )}
          <input type="range" min={1} max={Math.max(1, total)} value={shown} onChange={(e) => { setPlaying(false); setLayer(Number(e.target.value)); setMoves(FULL); }} style={{ width: '100%' }} />
        </div>
        <span className="muted micro tnum" style={{ minWidth: 60 }}>z {curZ.toFixed(2)}</span>
        {colorChanges.length > 0 && <span className="muted micro" title={t('v2.gpreview.colorchanges_hint', 'Filament swaps — click a tick to jump')}>{colorChanges.length} {t('v2.gpreview.colorchanges', 'swaps')}</span>}
        {onAddColorChange && shown > 1 && !(colorChangeLayers ?? []).includes(shown) && (
          <button className="btn btn--sm btn--ghost" title={t('v2.gpreview.add_change_hint', 'Pause for a filament swap at this layer (M600)')} onClick={() => onAddColorChange(shown)}>＋ {t('v2.gpreview.add_change', 'Colour change')}</button>
        )}
      </div>
      <div className="gpreview-stats">
        <span><b>{t('v2.gpreview.this_layer', 'This layer')}:</b> {fmtT(curLayer?.timeSec ?? 0)} · {gramsOf(curLayer?.eLen ?? 0).toFixed(2)} g</span>
        <span><b>{t('v2.gpreview.to_here', 'To here')}:</b> {fmtT(cum.tArr[shown - 1] ?? 0)} · {gramsOf(cum.eArr[shown - 1] ?? 0).toFixed(1)} g</span>
        <span><b>{t('v2.gpreview.total', 'Total')}:</b> {fmtT(cum.totTime)} · {gramsOf(cum.totE).toFixed(1)} g</span>
      </div>
    </div>
  );
}
