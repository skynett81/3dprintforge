/**
 * Native Slicer — Arachne beading strategy (ported from BambuStudio /
 * Cura's DistributedBeadingStrategy).
 *
 * The heart of Arachne: given the LOCAL thickness of a thin region (the
 * cross-section width between the two facing walls), decide how many extrusion
 * beads to lay and how wide each one is, so the beads exactly fill the space
 * with no leftover gap and no double-extrusion. Wide sections get more beads at
 * ~optimal width; a section a little too wide for N beads widens them slightly
 * (distributed toward the middle) rather than adding a starved N+1th bead.
 *
 * Faithful to BambuStudio's BeadingStrategy.cpp:
 *   - getOptimalThickness(n)       = optimal_width * n
 *   - getTransitionThickness(lo)   = lo_w + thr * (hi_w - lo_w),
 *                                    thr = lo odd ? split_mid : add_mid
 *   - getOptimalBeadCount(t)       = largest n with transitionThickness(n) <= t
 *   - compute(t, n)                = per-bead widths + centre locations
 *
 * `location[i]` is the distance of bead i's centreline from the region's left
 * wall (0 = on the left wall). The caller offsets inward by these to place the
 * variable-width bead centrelines.
 */

/**
 * @param {object} opts
 *   optimalWidth        — target bead width (line width), mm
 *   splitMidThreshold   — wall_split_middle_threshold (odd counts), 0..1
 *   addMidThreshold     — wall_add_middle_threshold (even counts), 0..1
 *   distributionRadius  — how many beads share the excess (Cura default 2)
 */
export function makeBeadingStrategy(opts = {}) {
  const optimalWidth = opts.optimalWidth ?? 0.42;
  const splitMid = opts.splitMidThreshold ?? 0.5;
  const addMid = opts.addMidThreshold ?? 0.5;
  const distRadius = opts.distributionRadius ?? 2;
  const oneOverDistSq = distRadius >= 2 ? 1 / ((distRadius - 1) * (distRadius - 1)) : 1;

  const getOptimalThickness = (n) => optimalWidth * n;
  const getTransitionThickness = (lower) => {
    const lo = getOptimalThickness(lower), hi = getOptimalThickness(lower + 1);
    const thr = (lower % 2 === 1) ? splitMid : addMid;
    return lo + thr * (hi - lo);
  };
  // Largest n such that every transition up to n has been crossed.
  const getOptimalBeadCount = (thickness) => {
    let n = 0;
    while (getTransitionThickness(n) <= thickness && n < 64) n++;
    return n;
  };

  /**
   * @returns {{ widths:number[], locations:number[], leftOver:number }}
   *   widths[i]    — width of bead i (mm)
   *   locations[i] — centreline distance of bead i from the left wall (mm)
   *   leftOver     — unfilled thickness (only when bead_count <= 0)
   */
  const compute = (thickness, beadCount) => {
    if (beadCount <= 0) return { widths: [], locations: [], leftOver: thickness };
    const widths = new Array(beadCount);
    const locations = new Array(beadCount);
    if (beadCount === 1) {
      widths[0] = thickness; locations[0] = thickness / 2;
    } else if (beadCount === 2) {
      widths[0] = widths[1] = thickness / 2;
      locations[0] = thickness / 4; locations[1] = thickness - thickness / 4;
    } else {
      const middle = (beadCount - 1) / 2;
      const weights = new Array(beadCount);
      let sumW = 0;
      for (let i = 0; i < beadCount; i++) { const w = Math.max(0, 1 - oneOverDistSq * (i - middle) * (i - middle)); weights[i] = w; sumW += w; }
      const toBeDivided = thickness - beadCount * optimalWidth;
      let acc = 0;
      for (let i = 0; i < beadCount; i++) {
        widths[i] = optimalWidth + (sumW > 0 ? toBeDivided * (weights[i] / sumW) : 0);
        acc += widths[i];
      }
      // Correct any rounding so the beads sum exactly to the thickness.
      widths[beadCount - 1] += thickness - acc;
      locations[0] = widths[0] / 2;
      for (let i = 1; i < beadCount; i++) locations[i] = locations[i - 1] + (widths[i - 1] + widths[i]) / 2;
    }
    return { widths, locations, leftOver: 0 };
  };

  if (opts.widening === false) return { optimalWidth, getOptimalThickness, getTransitionThickness, getOptimalBeadCount, compute };

  // WideningBeadingStrategy wrapper — exact BambuStudio port
  // (Arachne/BeadingStrategy/WideningBeadingStrategy.cpp). A feature thinner
  // than the parent's optimal width is printed as ONE bead widened up to
  // min_output_width (so a genuinely thin wall survives instead of vanishing);
  // below min_input_width it is left over (too small to print at all).
  const minInput = opts.minInputWidth ?? optimalWidth * 0.15;   // min_feature_size
  const minOutput = opts.minOutputWidth ?? optimalWidth * 0.85;  // min_bead_width
  return {
    optimalWidth,
    getOptimalThickness,
    getTransitionThickness: (lower) => (lower === 0 ? minInput : getTransitionThickness(lower)),
    getOptimalBeadCount: (t) => {
      if (t < minInput) return 0;
      const ret = getOptimalBeadCount(t);
      return (t >= minInput && ret < 1) ? 1 : ret;
    },
    compute: (t, n) => {
      if (t < optimalWidth) {
        if (t >= minInput) return { widths: [Math.max(t, minOutput)], locations: [t / 2], leftOver: 0 };
        return { widths: [], locations: [], leftOver: t };
      }
      return compute(t, n);
    },
  };
}
