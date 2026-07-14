import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useT } from '../../i18n';

interface Props {
  slotColors: string[];
  onGenerate: (geom: THREE.BufferGeometry, name: string) => void;
  onColorLayers: (layers: { z: number; slot: number }[]) => void;
  onClose: () => void;
}

/**
 * HueForge-style "Colour Layer" generator (ported from the desktop fork's
 * ForgeColorLayerDialog). Turns an image into a printable relief that reproduces
 * it by stacking the plate's loaded filaments: darker pixels print taller so more
 * (darker) filament layers show through. Emits the mesh + the colour-change
 * layers to set on the preview slider.
 */
export function SlicerColorLayer({ slotColors, onGenerate, onColorLayers, onClose }: Props) {
  const t = useT();
  const [widthMm, setWidthMm] = useState(80);
  const [maxHeight, setMaxHeight] = useState(3);
  const [baseMm, setBaseMm] = useState(0.4);
  const [layerH, setLayerH] = useState(0.12);
  const [invert, setInvert] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function generate(file: File) {
    setBusy(true); setErr('');
    try {
      const bmp = await createImageBitmap(file);
      // Downsample to a manageable grid (keep aspect).
      const maxGrid = 180;
      const scale = Math.min(1, maxGrid / Math.max(bmp.width, bmp.height));
      const gw = Math.max(2, Math.round(bmp.width * scale));
      const gh = Math.max(2, Math.round(bmp.height * scale));
      const cv = document.createElement('canvas'); cv.width = gw; cv.height = gh;
      const cxx = cv.getContext('2d')!; cxx.drawImage(bmp, 0, 0, gw, gh);
      const data = cxx.getImageData(0, 0, gw, gh).data;
      // Luminance 0..1 per cell (row 0 = top of image → far Y).
      const lum = new Float32Array(gw * gh);
      for (let i = 0; i < gw * gh; i++) {
        let l = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
        if (invert) l = 1 - l;
        lum[i] = l;
      }
      // Height: darker (low luminance) → taller so more filament shows.
      const cell = widthMm / gw;
      const heightAt = (i: number) => baseMm + (1 - lum[i]) * maxHeight;
      const geom = buildHeightmap(gw, gh, cell, heightAt);
      geom.computeVertexNormals();
      onGenerate(geom, `Colour layer (${gw}×${gh})`);
      // Colour-change layers: split the relief height range into one band per
      // filament (snapped to the layer height), lightest at the base upward.
      const n = Math.max(1, slotColors.length);
      const layers: { z: number; slot: number }[] = [];
      for (let s = 1; s < n; s++) layers.push({ z: +(Math.round((baseMm + (maxHeight * s) / n) / layerH) * layerH).toFixed(2), slot: s });
      onColorLayers(layers);
      onClose();
    } catch (e) { setErr((e as Error).message || 'Failed to read image'); }
    finally { setBusy(false); }
  }

  // Build a closed relief solid: top surface follows the height field, flat base
  // at z=0, and side walls around the perimeter.
  function buildHeightmap(gw: number, gh: number, cell: number, hAt: (i: number) => number): THREE.BufferGeometry {
    const pos: number[] = [];
    const X = (c: number) => (c - (gw - 1) / 2) * cell;
    const Y = (r: number) => ((gh - 1) / 2 - r) * cell;
    const idx = (r: number, c: number) => r * gw + c;
    const tri = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number) => pos.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    // Top surface.
    for (let r = 0; r < gh - 1; r++) for (let c = 0; c < gw - 1; c++) {
      const z00 = hAt(idx(r, c)), z01 = hAt(idx(r, c + 1)), z10 = hAt(idx(r + 1, c)), z11 = hAt(idx(r + 1, c + 1));
      tri(X(c), Y(r), z00, X(c + 1), Y(r), z01, X(c + 1), Y(r + 1), z11);
      tri(X(c), Y(r), z00, X(c + 1), Y(r + 1), z11, X(c), Y(r + 1), z10);
    }
    // Base (flat, wound downward).
    const x0 = X(0), x1 = X(gw - 1), y0 = Y(0), y1 = Y(gh - 1);
    tri(x0, y0, 0, x1, y1, 0, x1, y0, 0);
    tri(x0, y0, 0, x0, y1, 0, x1, y1, 0);
    // Walls along the four edges.
    for (let c = 0; c < gw - 1; c++) {
      tri(X(c), Y(0), 0, X(c + 1), Y(0), 0, X(c + 1), Y(0), hAt(idx(0, c + 1)));
      tri(X(c), Y(0), 0, X(c + 1), Y(0), hAt(idx(0, c + 1)), X(c), Y(0), hAt(idx(0, c)));
      tri(X(c), Y(gh - 1), 0, X(c + 1), Y(gh - 1), hAt(idx(gh - 1, c + 1)), X(c + 1), Y(gh - 1), 0);
      tri(X(c), Y(gh - 1), 0, X(c), Y(gh - 1), hAt(idx(gh - 1, c)), X(c + 1), Y(gh - 1), hAt(idx(gh - 1, c + 1)));
    }
    for (let r = 0; r < gh - 1; r++) {
      tri(X(0), Y(r), 0, X(0), Y(r + 1), hAt(idx(r + 1, 0)), X(0), Y(r + 1), 0);
      tri(X(0), Y(r), 0, X(0), Y(r), hAt(idx(r, 0)), X(0), Y(r + 1), hAt(idx(r + 1, 0)));
      tri(X(gw - 1), Y(r), 0, X(gw - 1), Y(r + 1), 0, X(gw - 1), Y(r + 1), hAt(idx(r + 1, gw - 1)));
      tri(X(gw - 1), Y(r), 0, X(gw - 1), Y(r + 1), hAt(idx(r + 1, gw - 1)), X(gw - 1), Y(r), hAt(idx(r, gw - 1)));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }

  return (
    <div className="oslice-modal-backdrop" onClick={onClose}>
      <div className="oslice-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="oslice-modal-h">{t('v2.colorlayer.title', 'Colour layer (image → relief)')}</div>
        <p className="muted micro" style={{ margin: '0 0 10px' }}>{t('v2.colorlayer.desc', 'Turns an image into a printable relief that reproduces it by stacking the plate’s filaments — darker areas print taller. Colour-change layers are set automatically.')}</p>
        <div className="oslice-colorlayer-grid">
          <label className="oset-field"><span className="oslice-sectlbl">{t('v2.colorlayer.width', 'Width')}</span><input className="oset-input" type="number" value={widthMm} onChange={(e) => setWidthMm(Number(e.target.value))} /></label>
          <label className="oset-field"><span className="oslice-sectlbl">{t('v2.colorlayer.height', 'Max height')}</span><input className="oset-input" type="number" step={0.5} value={maxHeight} onChange={(e) => setMaxHeight(Number(e.target.value))} /></label>
          <label className="oset-field"><span className="oslice-sectlbl">{t('v2.colorlayer.base', 'Base')}</span><input className="oset-input" type="number" step={0.1} value={baseMm} onChange={(e) => setBaseMm(Number(e.target.value))} /></label>
          <label className="oset-field"><span className="oslice-sectlbl">{t('v2.colorlayer.layerh', 'Layer h')}</span><input className="oset-input" type="number" step={0.02} value={layerH} onChange={(e) => setLayerH(Number(e.target.value))} /></label>
        </div>
        <label className="chk" style={{ margin: '8px 0' }}><input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} /> {t('v2.colorlayer.invert', 'Invert (light areas taller)')}</label>
        <div className="oslice-colorlayer-swatches">
          {slotColors.map((c, i) => <span key={i} className="oslice-paintdot" style={{ width: 16, height: 16, background: c }} />)}
          <span className="muted micro">{slotColors.length} {t('v2.colorlayer.filaments', 'filament(s)')}</span>
        </div>
        {err && <div className="oslice-spoolmatch--short" style={{ padding: '4px 0' }}>{err}</div>}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.currentTarget.value = ''; if (f) generate(f); }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn--sm" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? t('v2.colorlayer.working', 'Working…') : t('v2.colorlayer.pick', 'Choose image & generate')}</button>
          <button className="btn btn--sm btn--ghost" onClick={onClose}>{t('common.cancel', 'Cancel')}</button>
        </div>
      </div>
    </div>
  );
}
