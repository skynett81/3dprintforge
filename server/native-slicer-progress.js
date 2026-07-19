/**
 * Native Slicer — print-progress annotation (M73).
 *
 * BambuStudio and PrusaSlicer emit `M73 P<percent> R<minutes>` through the
 * g-code so the printer's display shows a live progress bar and remaining time.
 * This is a post-processor: it walks the finished g-code twice — first to sum
 * the motion time and record the cumulative time at every layer boundary, then
 * to insert one M73 per layer with the percent done and minutes remaining.
 *
 * The time model is the simple distance / feedrate one (the firmware recomputes
 * its own estimate with acceleration anyway); it is accurate enough to drive the
 * progress bar. Arc moves (G2/G3) use their true arc length from the I/J centre.
 */

const MOVE = /^G[0123]\b/;

function moveTime(line, st) {
  const gx = line.match(/X(-?[\d.]+)/), gy = line.match(/Y(-?[\d.]+)/), gz = line.match(/Z(-?[\d.]+)/), gf = line.match(/F([\d.]+)/);
  if (gf) st.f = parseFloat(gf[1]);
  const nx = gx ? parseFloat(gx[1]) : st.x, ny = gy ? parseFloat(gy[1]) : st.y, nz = gz ? parseFloat(gz[1]) : st.z;
  let dist;
  if (/^G[23]\b/.test(line)) {
    // Arc: length = radius * |sweep|. Centre = current + (I,J).
    const gi = line.match(/I(-?[\d.]+)/), gj = line.match(/J(-?[\d.]+)/);
    if (gi && gj) {
      const cx = st.x + parseFloat(gi[1]), cy = st.y + parseFloat(gj[1]);
      const r = Math.hypot(st.x - cx, st.y - cy);
      let a0 = Math.atan2(st.y - cy, st.x - cx), a1 = Math.atan2(ny - cy, nx - cx);
      let sweep = a1 - a0;
      const cw = /^G2\b/.test(line);
      if (cw && sweep > 0) sweep -= 2 * Math.PI;
      if (!cw && sweep < 0) sweep += 2 * Math.PI;
      dist = Math.abs(sweep) * r;
    } else {
      dist = Math.hypot(nx - st.x, ny - st.y);
    }
  } else {
    dist = Math.hypot(nx - st.x, ny - st.y, nz - st.z);
  }
  st.x = nx; st.y = ny; st.z = nz;
  const feed = st.f > 0 ? st.f / 60 : 0;                 // mm/min → mm/s
  return feed > 0 ? dist / feed : 0;                     // seconds
}

// One marker per layer only — the g-code emits both `; --- layer N` and
// `;LAYER_CHANGE`; key off the standard LAYER_CHANGE so exactly one M73 is
// inserted per layer (not two).
const isLayerMark = (l) => l.startsWith(';LAYER_CHANGE');

export function insertProgressM73(gcode) {
  const lines = gcode.split('\n');
  // Pass 1 — total time + cumulative time at each layer boundary.
  const st = { x: 0, y: 0, z: 0, f: 0 };
  let total = 0;
  const cumAtLayer = [];
  for (const l of lines) {
    if (isLayerMark(l)) cumAtLayer.push(total);
    if (MOVE.test(l)) total += moveTime(l, st);
  }
  if (total <= 0 || !cumAtLayer.length) return gcode;    // nothing to annotate
  // Pass 2 — emit an M73 just after each layer marker.
  const out = [];
  let li = 0;
  for (const l of lines) {
    out.push(l);
    if (isLayerMark(l)) {
      const cum = cumAtLayer[li++] ?? total;
      const pct = Math.max(0, Math.min(100, Math.round((cum / total) * 100)));
      const remMin = Math.max(0, Math.round((total - cum) / 60));
      out.push(`M73 P${pct} R${remMin}`);
    }
  }
  return out.join('\n');
}
