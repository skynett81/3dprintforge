/**
 * Native Slicer Engine — pure-JS mesh-to-G-code slicing pipeline.
 *
 * This is the project's own slicer (not a wrapper). It uses every
 * mesh + g-code module we've built up in this codebase:
 *
 *   format-converter      → STL / OBJ / 3MF import
 *   mesh-repair           → auto dedup / fix-winding before slicing
 *   mesh-transforms       → scale / recenter / hollow
 *   stl-analyzer          → bbox + orientation suggestion
 *   gcode-time-estimator  → trapezoidal motion model for time prediction
 *   gcode-postproc        → optional post-slice rewrites
 *   printer-capabilities  → per-printer build volume + features
 *
 * The pipeline is intentionally minimal — handles simple PLA prints
 * with a single perimeter and a linear infill. No supports, no bridges,
 * no adaptive layer height, no multi-material. For production-quality
 * output use the Slicer Bridge (OrcaSlicer / Bambu Studio).
 *
 * Algorithm:
 *   1. sliceLayer(mesh, z): for each triangle whose z-range crosses
 *      the cut plane, intersect the two crossing edges to get a 2D
 *      line segment. Chain consecutive segments into closed polygon
 *      loops via end-point matching with EPS tolerance.
 *   2. offsetPolygon(poly, d): shrink/grow each vertex along the
 *      bisector of its two adjacent edges by distance d / sin(angle/2).
 *      Drops degenerate self-intersecting parts. Good for simple
 *      convex/mildly-concave shapes; complex shapes with sharp inner
 *      corners will lose detail.
 *   3. lineInfill(poly, spacing, angleDeg): generate parallel lines
 *      across the polygon's bbox at the requested angle, then clip
 *      each line against the polygon edges. Even-odd fill rule.
 *   4. layersToGcode(layers, settings): walk each layer's perimeters
 *      and infill lines as G1 X Y E F moves at the configured speed
 *      and extrusion ratio. Wraps with a starter sequence (home, heat
 *      bed/nozzle, prime line) and a finisher (retract, lift, cool).
 */

const EPS = 0.001;        // mm tolerance for polygon-loop closure
const FILAMENT_DIAM = 1.75;
const PI = Math.PI;

// ── 1. Layer slicing ───────────────────────────────────────────────

/**
 * Slice a mesh at z and return an array of closed polygons (each
 * polygon is an array of [x,y] points in CCW or CW order).
 */
export function sliceLayer(mesh, z) {
  const segments = [];
  const positions = mesh.positions;
  const indices = mesh.indices;

  for (let f = 0; f < indices.length; f += 3) {
    const i0 = indices[f], i1 = indices[f + 1], i2 = indices[f + 2];
    const a = [positions[3 * i0], positions[3 * i0 + 1], positions[3 * i0 + 2]];
    const b = [positions[3 * i1], positions[3 * i1 + 1], positions[3 * i1 + 2]];
    const c = [positions[3 * i2], positions[3 * i2 + 1], positions[3 * i2 + 2]];

    // For each triangle find edges that cross z-plane.
    const edges = [[a, b], [b, c], [c, a]];
    const crossings = [];
    for (const [p, q] of edges) {
      if ((p[2] - z) * (q[2] - z) < 0) {                   // strict crossing
        const t = (z - p[2]) / (q[2] - p[2]);
        crossings.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      } else if (Math.abs(p[2] - z) < EPS && Math.abs(q[2] - z) < EPS) {
        // Edge lies on the plane — ignored to avoid duplicate segments.
      } else if (Math.abs(p[2] - z) < EPS) {
        crossings.push([p[0], p[1]]);
      }
    }
    if (crossings.length === 2) segments.push([crossings[0], crossings[1]]);
  }

  return _chainSegments(segments);
}

function _chainSegments(segments) {
  const polygons = [];
  const used = new Uint8Array(segments.length);
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    const poly = [segments[i][0].slice(), segments[i][1].slice()];
    used[i] = 1;
    let extending = true;
    while (extending) {
      extending = false;
      const tail = poly[poly.length - 1];
      for (let j = 0; j < segments.length; j++) {
        if (used[j]) continue;
        const [p, q] = segments[j];
        if (_near(tail, p)) { poly.push(q.slice()); used[j] = 1; extending = true; break; }
        if (_near(tail, q)) { poly.push(p.slice()); used[j] = 1; extending = true; break; }
      }
    }
    if (poly.length >= 3 && _near(poly[0], poly[poly.length - 1])) poly.pop();
    if (poly.length >= 3) polygons.push(poly);
  }
  return polygons;
}

function _near(a, b) {
  return Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;
}

// ── 2. Polygon offset (shrink/grow) ─────────────────────────────────

/**
 * Offset a closed polygon by `distance` (negative = shrink inward,
 * positive = grow outward). Vertex-bisector algorithm — works on
 * convex/mildly-concave polygons typical of FDM perimeters.
 */
export function offsetPolygon(poly, distance) {
  const n = poly.length;
  if (n < 3) return [];
  const ccw = _isCCW(poly) ? 1 : -1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const prev = poly[(i - 1 + n) % n];
    const curr = poly[i];
    const next = poly[(i + 1) % n];
    const v1x = curr[0] - prev[0], v1y = curr[1] - prev[1];
    const v2x = next[0] - curr[0], v2y = next[1] - curr[1];
    const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
    if (l1 < EPS || l2 < EPS) continue;
    // Inward normals (CCW: rotate edge -90° points inward). Multiply
    // by ccw so CW polygons offset toward the same side.
    const n1x = -v1y / l1 * ccw, n1y = v1x / l1 * ccw;
    const n2x = -v2y / l2 * ccw, n2y = v2x / l2 * ccw;
    // Bisector — average of the two inward normals.
    let bx = n1x + n2x, by = n1y + n2y;
    const bl = Math.hypot(bx, by);
    if (bl < EPS) continue;
    bx /= bl; by /= bl;
    // Distance along bisector to land on the offset edge: d / sin(α/2)
    const cosA = n1x * n2x + n1y * n2y;     // cos(angle between normals)
    const halfSin = Math.sqrt(Math.max(0.001, (1 - cosA) / 2));
    const scale = -distance / Math.max(0.001, halfSin); // negative since inward = shrink
    out.push([curr[0] + bx * scale, curr[1] + by * scale]);
  }
  // Drop degenerate result. Two checks:
  //  (1) Signed area sign flipped — orientation inverted.
  //  (2) For shrink (negative distance): new polygon's bbox is larger
  //      than the original — the offset overshot the centroid and
  //      produced an inverted, oversized loop. This catches the
  //      "shrink a 2mm square by 10mm → invalid" case that the
  //      bisector approach can't otherwise detect.
  if (_signedArea(out) * _signedArea(poly) < 0) return [];
  if (distance < 0) {
    const origBbox = _bbox(poly);
    const newBbox  = _bbox(out);
    if ((newBbox.maxX - newBbox.minX) > (origBbox.maxX - origBbox.minX) ||
        (newBbox.maxY - newBbox.minY) > (origBbox.maxY - origBbox.minY)) {
      return [];
    }
  }
  return out;
}

function _bbox(poly) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

function _isCCW(poly) { return _signedArea(poly) > 0; }
function _signedArea(poly) {
  let a = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const p = poly[i], q = poly[(i + 1) % n];
    a += (q[0] - p[0]) * (q[1] + p[1]);
  }
  return -a / 2;
}

// ── 3. Linear infill ────────────────────────────────────────────────

/**
 * Generate a hatching pattern across a polygon. Returns an array of
 * line segments [[x1,y1],[x2,y2]] clipped to lie inside the polygon
 * (even-odd rule). `density` is 0..1 (0.2 = 20% infill), `angleDeg`
 * is the hatch direction.
 */
export function lineInfill(poly, density, angleDeg, lineWidth = 0.4) {
  if (poly.length < 3 || density <= 0) return [];
  const angle = (angleDeg || 45) * PI / 180;
  // Spacing between scan lines = lineWidth / density (approximation:
  // each line deposits lineWidth of material per pass).
  const spacing = Math.max(0.5, lineWidth / Math.max(0.01, density));
  // Rotate polygon into hatch-aligned space, scan along Y, then rotate back.
  const cos = Math.cos(-angle), sin = Math.sin(-angle);
  const rot = poly.map(([x, y]) => [x * cos - y * sin, x * sin + y * cos]);
  const minY = Math.min(...rot.map(p => p[1]));
  const maxY = Math.max(...rot.map(p => p[1]));
  const minX = Math.min(...rot.map(p => p[0]));
  const maxX = Math.max(...rot.map(p => p[0]));
  const segments = [];
  const cosBack = Math.cos(angle), sinBack = Math.sin(angle);
  for (let y = minY + spacing; y < maxY; y += spacing) {
    // Find all edge crossings at this y; pair them up under even-odd.
    const xs = [];
    for (let i = 0, n = rot.length; i < n; i++) {
      const p = rot[i], q = rot[(i + 1) % n];
      if ((p[1] - y) * (q[1] - y) < 0) {
        const t = (y - p[1]) / (q[1] - p[1]);
        xs.push(p[0] + t * (q[0] - p[0]));
      }
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      // Rotate the segment back to original frame.
      const a = [xs[k] * cosBack - y * sinBack, xs[k] * sinBack + y * cosBack];
      const b = [xs[k + 1] * cosBack - y * sinBack, xs[k + 1] * sinBack + y * cosBack];
      segments.push([a, b]);
    }
  }
  return segments;
}

// ── 4. G-code emission ─────────────────────────────────────────────

/**
 * Convert a stack of layers (each = { perimeters: [[poly]], infill:
 * [[seg]] }) into a G-code string.
 *
 * @param {Array<{perimeters: number[][][], infill: number[][][]}>} layers
 * @param {object} settings
 *   layerHeight, lineWidth, printSpeed, travelSpeed, retraction,
 *   bedTemp, nozzleTemp, filamentDiam, fanSpeed, firstLayerSpeed,
 *   bedSize:[w,h] used for centering
 */
export function layersToGcode(layers, settings) {
  const s = {
    layerHeight: 0.2, lineWidth: 0.4, printSpeed: 60, travelSpeed: 120,
    retraction: 1.5, bedTemp: 60, nozzleTemp: 215, filamentDiam: FILAMENT_DIAM,
    fanSpeed: 100, firstLayerSpeed: 20, bedSize: [256, 256], material: 'PLA',
    ...settings,
  };
  // Extrusion factor: volume of a 1 mm path =
  //   lineWidth * layerHeight (rectangular cross-section)
  // E (mm of filament) = volume / (π * (filamentDiam/2)²)
  const efactor = (s.lineWidth * s.layerHeight) / (PI * (s.filamentDiam / 2) ** 2);

  let g = '';
  g += `; Generated by 3DPrintForge native slicer\n`;
  g += `; Layers: ${layers.length}, layer height: ${s.layerHeight} mm\n`;
  g += `; Material: ${s.material}, nozzle ${s.nozzleTemp}°C, bed ${s.bedTemp}°C\n`;
  g += `M140 S${s.bedTemp}\n`;
  g += `M104 S${s.nozzleTemp}\n`;
  g += `G28 ; home\n`;
  g += `M190 S${s.bedTemp}\n`;
  g += `M109 S${s.nozzleTemp}\n`;
  g += `G92 E0\n`;
  g += `G90\n`;
  g += `M82\n`;
  g += `M106 S${Math.round(s.fanSpeed * 2.55)}\n`;
  // Prime line.
  g += `; --- prime line ---\n`;
  g += `G1 Z0.3 F${s.travelSpeed * 60}\n`;
  g += `G1 X20 Y20 F${s.travelSpeed * 60}\n`;
  g += `G1 X80 Y20 E${(60 * efactor).toFixed(4)} F${s.firstLayerSpeed * 60}\n`;
  g += `G92 E0\n`;
  let e = 0;
  let curX = 80, curY = 20, curZ = 0.3;

  layers.forEach((layer, layerIdx) => {
    const z = (layerIdx + 1) * s.layerHeight;
    const speed = layerIdx === 0 ? s.firstLayerSpeed : s.printSpeed;
    g += `; --- layer ${layerIdx + 1}/${layers.length} z=${z.toFixed(3)} ---\n`;
    g += `G1 Z${z.toFixed(3)} F${s.travelSpeed * 60}\n`;
    curZ = z;

    // Perimeters first.
    for (const poly of layer.perimeters || []) {
      if (poly.length < 2) continue;
      // Travel to first point.
      const first = poly[0];
      g += `G1 E${(e - s.retraction).toFixed(4)} F${(s.travelSpeed * 60).toFixed(0)}\n`;
      e -= s.retraction;
      g += `G0 X${first[0].toFixed(3)} Y${first[1].toFixed(3)} F${s.travelSpeed * 60}\n`;
      g += `G1 E${(e + s.retraction).toFixed(4)} F${(s.travelSpeed * 60).toFixed(0)}\n`;
      e += s.retraction;
      curX = first[0]; curY = first[1];
      for (let i = 1; i < poly.length; i++) {
        const p = poly[i];
        const dx = p[0] - curX, dy = p[1] - curY;
        const d = Math.hypot(dx, dy);
        e += d * efactor;
        g += `G1 X${p[0].toFixed(3)} Y${p[1].toFixed(3)} E${e.toFixed(4)} F${speed * 60}\n`;
        curX = p[0]; curY = p[1];
      }
      // Close the loop.
      const dx = first[0] - curX, dy = first[1] - curY;
      const d = Math.hypot(dx, dy);
      if (d > EPS) {
        e += d * efactor;
        g += `G1 X${first[0].toFixed(3)} Y${first[1].toFixed(3)} E${e.toFixed(4)} F${speed * 60}\n`;
        curX = first[0]; curY = first[1];
      }
    }

    // Infill segments.
    for (const seg of layer.infill || []) {
      const [a, b] = seg;
      g += `G1 E${(e - s.retraction).toFixed(4)} F${(s.travelSpeed * 60).toFixed(0)}\n`;
      e -= s.retraction;
      g += `G0 X${a[0].toFixed(3)} Y${a[1].toFixed(3)} F${s.travelSpeed * 60}\n`;
      g += `G1 E${(e + s.retraction).toFixed(4)} F${(s.travelSpeed * 60).toFixed(0)}\n`;
      e += s.retraction;
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const d = Math.hypot(dx, dy);
      e += d * efactor;
      g += `G1 X${b[0].toFixed(3)} Y${b[1].toFixed(3)} E${e.toFixed(4)} F${speed * 60}\n`;
      curX = b[0]; curY = b[1];
    }
  });

  // Finisher.
  g += `; --- finished ---\n`;
  g += `G1 E${(e - s.retraction).toFixed(4)} F${s.travelSpeed * 60}\n`;
  g += `G1 Z${(curZ + 5).toFixed(3)} F${s.travelSpeed * 60}\n`;
  g += `M104 S0\n`;
  g += `M140 S0\n`;
  g += `M107\n`;
  g += `G28 X Y\n`;
  g += `M84\n`;
  return g;
}

// ── 5. Pipeline orchestrator ───────────────────────────────────────

/**
 * End-to-end slicing: mesh → G-code. Repairs the mesh first, recenters
 * to the printer bed, then slices into layers + perimeters + infill.
 */
export async function sliceMeshToGcode(mesh, settings = {}) {
  const s = {
    layerHeight: 0.2, lineWidth: 0.4, perimeters: 1, infillDensity: 0.2,
    infillAngle: 45, ...settings,
  };

  // Repair + recenter so first layer starts at z=layerHeight.
  const { autoRepair } = await import('./mesh-repair.js');
  const { recenterToOrigin, meshStats } = await import('./mesh-transforms.js');
  const repaired = autoRepair(mesh).mesh;
  const recentered = recenterToOrigin(repaired).mesh;
  const stats = meshStats(recentered);
  const layerHeight = s.layerHeight;
  const numLayers = Math.max(1, Math.floor(stats.bbox.size[2] / layerHeight));

  const layers = [];
  for (let i = 0; i < numLayers; i++) {
    const z = (i + 0.5) * layerHeight; // sample mid-layer
    const polygons = sliceLayer(recentered, z);
    const perimeters = [];
    const infill = [];
    for (const poly of polygons) {
      // Outer perimeter is the polygon itself; inner perimeters are
      // each successive shrink by lineWidth.
      perimeters.push(poly);
      let inner = poly;
      for (let p = 1; p < s.perimeters; p++) {
        inner = offsetPolygon(inner, s.lineWidth);
        if (!inner || inner.length < 3) break;
        perimeters.push(inner);
      }
      // Infill area = innermost perimeter shrunk by half a lineWidth
      // so adjacent paths don't overlap.
      const infillArea = offsetPolygon(inner, s.lineWidth * 0.5);
      if (infillArea && infillArea.length >= 3) {
        const angle = s.infillAngle + (i % 2) * 90; // alternate per layer
        const segs = lineInfill(infillArea, s.infillDensity, angle, s.lineWidth);
        for (const sg of segs) infill.push(sg);
      }
    }
    layers.push({ perimeters, infill });
  }

  const gcode = layersToGcode(layers, s);
  return {
    gcode,
    layers: layers.length,
    bbox: stats.bbox,
    triangles: recentered.indices.length / 3,
  };
}

export const _internals = { _chainSegments, _signedArea, _isCCW, _near, EPS };
