/**
 * Native Slicer — arc fitting (G2/G3).
 *
 * A conservative G-code post-processor: runs of consecutive extruding G1 moves
 * that lie on a common circle (within `tolerance`) are replaced with a single
 * G2 (clockwise) / G3 (counter-clockwise) arc. Cuts G-code size on round parts
 * and gives the firmware smoother motion. Anything that isn't clearly an arc is
 * left as-is, so output geometry never changes beyond the tolerance.
 *
 * Off by default (enable_arc_fitting) — opt-in, since some firmware dislikes
 * arcs. Only planar X/Y extruding moves at a constant feedrate are considered;
 * travels, Z moves, retractions and feature/temperature lines break a run.
 */

function circleFrom3(a, b, c) {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return null;
  const a2 = a.x * a.x + a.y * a.y, b2 = b.x * b.x + b.y * b.y, c2 = c.x * c.x + c.y * c.y;
  const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
  const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
  return { x: ux, y: uy, r: Math.hypot(a.x - ux, a.y - uy) };
}

/** Parse a G1 move line into {x,y,e,f,raw} or null if it is not a planar move. */
function parseMove(line) {
  const s = line.trim();
  if (!/^G1\b/.test(s)) return null;
  if (/[;]/.test(s.slice(0, 3))) return null;
  const x = s.match(/X(-?\d*\.?\d+)/), y = s.match(/Y(-?\d*\.?\d+)/);
  const z = s.match(/Z(-?\d*\.?\d+)/), e = s.match(/E(-?\d*\.?\d+)/), f = s.match(/F(-?\d*\.?\d+)/);
  if (z) return null;                                  // layer/hop move — not planar
  if (!x || !y) return null;                           // pure E (retract) or partial move
  return { x: parseFloat(x[1]), y: parseFloat(y[1]), e: e ? parseFloat(e[1]) : null, f: f ? parseFloat(f[1]) : null };
}

export function fitArcs(gcode, tolerance = 0.05, opts = {}) {
  const minPts = opts.minPts ?? 5;         // need a real run to bother
  const maxR = opts.maxR ?? 5000;
  const lines = gcode.split('\n');
  const out = [];
  let cur = null;                          // live position {x,y}
  let run = [];                            // pending extruding moves (parsed)
  let runFeed = null;
  let runEntry = null;                     // position just before the run's first move

  const flushRun = () => {
    if (run.length < minPts || !runEntry) { for (const m of run) out.push(m.raw); run = []; return; }
    // P = positions including the run's entry point.
    const P = [{ x: runEntry.x, y: runEntry.y }, ...run.map((m) => ({ x: m.x, y: m.y }))];
    // All points of [a..end] within tolerance of the circle fitted from the
    // well-spread endpoints+midpoint (stable), and total sweep < ~2π.
    const fitSpan = (a, end) => {
      if (end - a < 2) return null;
      const mid = a + ((end - a) >> 1);
      const c = circleFrom3(P[a], P[mid], P[end]);
      if (!c || c.r <= 0.5 || c.r >= maxR) return null;
      for (let k = a; k <= end; k++) if (Math.abs(Math.hypot(P[k].x - c.x, P[k].y - c.y) - c.r) > tolerance) return null;
      let prev = Math.atan2(P[a].y - c.y, P[a].x - c.x), sweep = 0;
      for (let k = a + 1; k <= end; k++) { let da = Math.atan2(P[k].y - c.y, P[k].x - c.x) - prev; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; sweep += da; prev += da; }
      if (Math.abs(sweep) >= 2 * Math.PI - 0.01) return null;    // full circle → keep as loop
      return { ...c, dir: sweep >= 0 ? 1 : -1 };
    };
    let a = 0;
    while (a < P.length - 1) {
      let best = -1, circle = null;
      // Grow greedily, then shrink to the largest span that fits within tol.
      if (a + minPts - 1 < P.length) {
        let end = P.length - 1;
        while (end - a >= minPts - 1) {
          const c = fitSpan(a, end);
          if (c) { best = end; circle = c; break; }
          end--;
        }
      }
      if (best > a && circle) {
        // Emit one arc P[a] -> P[best]. dir>0 = CCW = G3, dir<0 = CW = G2.
        const end = run[best - 1];           // run index = P index - 1
        const g = circle.dir > 0 ? 'G3' : 'G2';
        const I = (circle.x - P[a].x).toFixed(4), J = (circle.y - P[a].y).toFixed(4);
        let s = `${g} X${P[best].x.toFixed(3)} Y${P[best].y.toFixed(3)} I${I} J${J}`;
        if (end.e != null) s += ` E${end.e.toFixed(4)}`;
        if (runFeed != null) s += ` F${runFeed}`;
        out.push(s);
        a = best;
      } else {
        out.push(run[a].raw);                // keep this move linear
        a += 1;
      }
    }
    run = [];
  };

  for (const line of lines) {
    const m = parseMove(line);
    const extruding = m && m.e != null;    // planar G1 with extrusion
    if (extruding) {
      if (runFeed != null && m.f != null && m.f !== runFeed) { flushRun(); runFeed = null; }
      if (run.length === 0) { runEntry = cur ? { x: cur.x, y: cur.y } : null; runFeed = m.f ?? runFeed; }
      run.push({ ...m, raw: line });
      cur = { x: m.x, y: m.y };
      continue;
    }
    // Non-run line: flush the pending run, pass the line through, update position.
    flushRun(); runFeed = null;
    out.push(line);
    if (m) cur = { x: m.x, y: m.y };
    else { const xm = line.match(/X(-?\d*\.?\d+)/), ym = line.match(/Y(-?\d*\.?\d+)/); if (xm && ym) cur = { x: parseFloat(xm[1]), y: parseFloat(ym[1]) }; }
  }
  flushRun();
  return out.join('\n');
}
