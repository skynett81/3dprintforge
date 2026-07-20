# BambuStudio (libslic3r) engine algorithms — reference for the native engine upgrade

Extracted from `bambulab/BambuStudio@master` `src/libslic3r/`. Primitive mapping:
`intersection_ex`→`clipIntersection`, `diff_ex`→`clipDifference`, `union_ex`→`clipUnion`
(native-slicer-bool.js), `offset/expand/shrink`→`offsetPolygon`, `offset2(a,d1,d2)`→
`offsetPolygon(offsetPolygon(a,d1),d2)` (opening if `d1<0<d2`), `opening(p,r)`=`offset2(p,-r,+r)`.

## 1. Fill-surface classification (PrintObject.cpp) — DONE via native-slicer-regions.js
Per layer i, region S = layer slices; upper = layer[i+1], lower = layer[i-1]:
- `top = opening(S − upper, offset)` (all top if no layer above)
- `bottom = opening(S − lower, offset)` (all bottom if no layer below)
- `top −= bottom` (overlap → bottom wins)
- `internal = S − top − bottom`
- prepare_fill_surfaces: internal ExPolygon with `area ≤ min_sparse_infill_area` → internalSolid.
- discover_horizontal_shells (top_shell_layers N): for each of top/bottom, project the exposed
  surface down/up through N neighbours; on neighbour n: `newSolid = intersection(solid, neighbourInternal)`,
  widen by `3·lineWidth` via opening, then `internalSolid ∪= newSolid`, `internal −= newSolid`.
  density==0 → shrink `solid` by too-narrow each step (subset propagation, stops solid creeping up vase walls).
- make_fills: solid types → 100% density solid pattern; internal → sparse_infill_density; skip internalVoid.

## 2. Solid infill GAP-FREE at boundary (FillRectilinear/FillBase) — HIGH IMPACT
- `_adjust_solid_spacing` (density>0.9999): n=floor((width-eps)/distance); distance'=(width-eps)/n
  (cap distance' ≤ 1.2·distance). Integer line count exactly spans the region → no sliver at far wall.
- Overlap: outer contour shrunk by only `overlap-0.05·spacing`, inner (line-end) contour by `overlap-0.5·spacing`.
  Lines generated to inner offset but EXTENDED to outer offset at emit → ends overlap perimeter ~0.45·spacing.
  `INFILL_OVERLAP_OVER_SPACING=0.45`.
- Solid: anchor disabled (anchor_length=max=1000mm), x0 += (line_spacing+eps)/2 centers the pattern.

## 3. connect_infill — anchor line-ends onto perimeter (FillBase.cpp:1501)
Project each infill end onto boundary → ContourIntersectionPoint (T-joint), insert as real contour
vertex, arc-length param, doubly-link joints per ring. Passes: (A) greedy shortest-arc-first: if
`arc<anchor_length_max` take WHOLE perimeter arc between two ends (gap-free) via take(); else hook
anchor_length via take_limited(). Union-find merges polylines. Trim hooks by line_half_width and
consumed arcs. clip_distance=1.7·spacing, distance_colliding=0.8·spacing.

## 4. Monotonic done RIGHT (FillRectilinear.cpp) — region-based, not just same-direction
Rotate so lines vertical. slice_region_by_vertical_lines → per line sorted y-intersections
(OUTER_LOW/INNER_LOW/INNER_HIGH/OUTER_HIGH). Partition into monotonic regions (maximal bands of
1-to-1 vertical-span chains). Build left→right precedence DAG (region printed only after left_neighbors).
Order by ACO+3opt (a topological sort by left-edge x, tie-break y, is a valid near-optimal substitute).
Emit each region's zigzag entering from the already-printed left side; cross-line hops ride the perimeter.

## 5. Wall/perimeter generation (PerimeterGenerator.cpp)
Onion loop: `last` = previous wall CENTERLINE (i=0 starts = slice boundary). Each wall:
- i=0: `offset(last, -ext_perimeter_width/2)`
- i≥1: `offset2(last, -(distance+min_spacing/2-1), +(min_spacing/2-1))` where distance =
  ext_perimeter_spacing2 (i=1) or perimeter_spacing (i≥2). offset2 collapses channels too narrow.
- Gap fill per step: `diff(offset(last,-½distance), offset(new,+½distance+safety))` = annulus between
  consecutive centerlines. Width-gate [0.12·perimeter_width, 2·perimeter_spacing] then medial_axis;
  length-gate by filter_out_gap_fill. min_spacing = perimeter_spacing·0.6 (INSET_OVERLAP_TOLERANCE=0.4).
- Infill boundary = innermost centerline offset by (½·inner_spacing − infill_wall_overlap), then
  offset2-collapse by ½·(0.6·solid_infill_spacing). NOT from raw slice.
- Wall order: default inner→outer; OuterInner reverses; InnerOuterInner buffers depth-1 loops and inserts
  each right after its ExternalPerimeter → [inner≥2, outer, second].

## 6. Overhang degree (OverhangDetector.cpp) — exact formula
Reference edge = RAW lower slice. Per sampled point (every 2mm), signed dist d to lower(+½nozzle);
real_dist = ½nozzle + d = signed dist to raw lower edge. If `|real_dist|>w/2`: degree = `d<0?0:100`.
Else degree = (w/2 + real_dist)/w · 100 (LINEAR across a one-line-width band centered on the edge).
Terrace onto {0,10,25,50,75,100} (6 levels). Low-pass: length-weighted avg over ±6.5mm window,
stop at bridge paths. Bridge test per remaining piece: chord < arc-length ⇒ not straight.

Downloaded C++ sources in scratchpad: FillBase.cpp/.hpp, FillRectilinear.cpp, FillConcentric.cpp, Fill.cpp.
