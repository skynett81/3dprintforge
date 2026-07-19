// Catalog of the 3DPrintForge Model Forge parametric generators, surfaced in the
// slicer's library (ported from the desktop fork's Forge Library idea). Each id
// maps to POST /api/model-forge/{id}/generate-3mf. Generated with default params;
// the returned 3MF loads straight onto the plate.
export interface ForgeParam { key: string; label: string; type: 'num' | 'text'; def: number | string; step?: number }
export interface ForgeGenerator { id: string; label: string; cat: string; params?: ForgeParam[] }

export const MODEL_FORGE_CATALOG: ForgeGenerator[] = [
  // Organization
  { id: 'gridfinity-baseplate', label: 'Gridfinity Baseplate', cat: 'Organization', params: [
    { key: 'unitsX', label: 'Units X', type: 'num', def: 2 }, { key: 'unitsY', label: 'Units Y', type: 'num', def: 2 }] },
  { id: 'gridfinity-bin', label: 'Gridfinity Bin', cat: 'Organization', params: [
    { key: 'unitsX', label: 'Units X', type: 'num', def: 1 }, { key: 'unitsY', label: 'Units Y', type: 'num', def: 1 }, { key: 'heightUnits', label: 'Height (units)', type: 'num', def: 6 }] },
  { id: 'gridfinity-lid', label: 'Gridfinity Lid', cat: 'Organization' },
  { id: 'gridfinity-tool-holder', label: 'Gridfinity Tool Holder', cat: 'Organization' },
  { id: 'storage-box', label: 'Storage Box', cat: 'Organization', params: [ { key: 'depth', label: 'Depth', type: 'num', def: 60 }, { key: 'dividersX', label: 'Dividers X', type: 'num', def: 1 }, { key: 'dividersY', label: 'Dividers Y', type: 'num', def: 1 } ] },
  { id: 'lidded-box', label: 'Lidded Box', cat: 'Organization' },
  { id: 'desk-organizer', label: 'Desk Organizer', cat: 'Organization' },
  { id: 'voronoi-tray', label: 'Voronoi Tray', cat: 'Organization' },
  // Mechanical
  { id: 'gear', label: 'Gear', cat: 'Mechanical', params: [
    { key: 'teeth', label: 'Teeth', type: 'num', def: 24 }, { key: 'module', label: 'Module', type: 'num', def: 2, step: 0.5 }, { key: 'faceWidth', label: 'Width', type: 'num', def: 6 }, { key: 'bore', label: 'Bore', type: 'num', def: 5 }] },
  { id: 'pulley', label: 'Pulley', cat: 'Mechanical', params: [ { key: 'teeth', label: 'Teeth', type: 'num', def: 20 }, { key: 'bore', label: 'Bore', type: 'num', def: 5 }, { key: 'flangeHeight', label: 'Flange', type: 'num', def: 1, step: 0.5 } ] },
  { id: 'spring', label: 'Spring', cat: 'Mechanical', params: [ { key: 'coils', label: 'Coils', type: 'num', def: 8 }, { key: 'diameter', label: 'Diameter', type: 'num', def: 15 }, { key: 'wireDiameter', label: 'Wire', type: 'num', def: 2, step: 0.5 } ] },
  { id: 'hinge', label: 'Hinge', cat: 'Mechanical', params: [ { key: 'knuckleCount', label: 'Knuckles', type: 'num', def: 3 }, { key: 'plateLength', label: 'Plate length', type: 'num', def: 40 }, { key: 'plateThickness', label: 'Thickness', type: 'num', def: 3 } ] },
  { id: 'snapfit', label: 'Snap-fit', cat: 'Mechanical', params: [ { key: 'beamLength', label: 'Beam length', type: 'num', def: 20 }, { key: 'beamThickness', label: 'Thickness', type: 'num', def: 2, step: 0.5 }, { key: 'hookDepth', label: 'Hook depth', type: 'num', def: 2, step: 0.5 } ] },
  { id: 'thread', label: 'Thread', cat: 'Mechanical' },
  { id: 'lattice', label: 'Lattice', cat: 'Mechanical', params: [ { key: 'cellSize', label: 'Cell', type: 'num', def: 10 }, { key: 'countX', label: 'Count X', type: 'num', def: 3 }, { key: 'countY', label: 'Count Y', type: 'num', def: 3 }, { key: 'countZ', label: 'Count Z', type: 'num', def: 3 } ] },
  { id: 'honeycomb', label: 'Honeycomb', cat: 'Mechanical', params: [ { key: 'width', label: 'Width', type: 'num', def: 60 }, { key: 'height', label: 'Height', type: 'num', def: 40 }, { key: 'cellSize', label: 'Cell', type: 'num', def: 8 } ] },
  // Home & mounts
  { id: 'wall-bracket', label: 'Wall Bracket', cat: 'Home & mounts' },
  { id: 'wall-plate', label: 'Wall Plate', cat: 'Home & mounts' },
  { id: 'vesa-mount', label: 'VESA Mount', cat: 'Home & mounts' },
  { id: 'peg-rail', label: 'Peg Rail', cat: 'Home & mounts' },
  { id: 'hook', label: 'Hook', cat: 'Home & mounts' },
  { id: 'phone-stand', label: 'Phone Stand', cat: 'Home & mounts', params: [ { key: 'deviceWidth', label: 'Device width', type: 'num', def: 75 }, { key: 'backHeight', label: 'Back height', type: 'num', def: 100 } ] },
  { id: 'headphone-stand', label: 'Headphone Stand', cat: 'Home & mounts' },
  { id: 'plant-pot', label: 'Plant Pot', cat: 'Home & mounts', params: [ { key: 'topDiameter', label: 'Top ⌀', type: 'num', def: 80 }, { key: 'height', label: 'Height', type: 'num', def: 70 }, { key: 'wallThickness', label: 'Wall', type: 'num', def: 2, step: 0.5 } ] },
  // Cable management
  { id: 'cable-chain', label: 'Cable Chain', cat: 'Cable & tools' },
  { id: 'cable-clip', label: 'Cable Clip', cat: 'Cable & tools' },
  { id: 'cable-label', label: 'Cable Label', cat: 'Cable & tools', params: [ { key: 'text', label: 'Text', type: 'text', def: 'USB' }, { key: 'cableDiameter', label: 'Cable ⌀', type: 'num', def: 5 } ] },
  { id: 'scraper-holder', label: 'Scraper Holder', cat: 'Cable & tools' },
  { id: 'nozzle-storage', label: 'Nozzle Storage', cat: 'Cable & tools' },
  { id: 'spool-adapter', label: 'Spool Adapter', cat: 'Cable & tools' },
  // Electronics
  { id: 'battery-holder', label: 'Battery Holder', cat: 'Electronics' },
  { id: 'electronics-case', label: 'Electronics Case', cat: 'Electronics' },
  // Creative / image
  { id: 'lithophane', label: 'Lithophane', cat: 'Creative' },
  { id: 'relief', label: 'Relief', cat: 'Creative' },
  { id: 'topo-map', label: 'Topographic Map', cat: 'Creative' },
  { id: 'qr3d', label: 'QR Code (3D)', cat: 'Creative' },
  { id: 'text-plate', label: 'Text Plate', cat: 'Creative', params: [
    { key: 'text', label: 'Text', type: 'text', def: '3DPrintForge' }, { key: 'fontSize', label: 'Font size', type: 'num', def: 10 }, { key: 'plateWidth', label: 'Width', type: 'num', def: 80 }] },
  { id: 'stencil', label: 'Stencil', cat: 'Creative' },
  { id: 'keychain', label: 'Keychain', cat: 'Creative', params: [
    { key: 'text', label: 'Text', type: 'text', def: 'Forge' }, { key: 'width', label: 'Width', type: 'num', def: 50 }, { key: 'thickness', label: 'Thickness', type: 'num', def: 3 }] },
  { id: 'texture', label: 'Texture Tile', cat: 'Creative' },
  { id: 'vase', label: 'Vase', cat: 'Creative' },
  { id: 'shape', label: 'Custom Shape', cat: 'Creative' },
  { id: 'multi-color', label: 'Multi-colour Test', cat: 'Creative' },
  { id: 'dice-tower', label: 'Dice Tower', cat: 'Creative' },
  { id: 'mini-base', label: 'Miniature Base', cat: 'Creative' },
  // Calibration
  { id: 'first-layer', label: 'First-layer Test', cat: 'Calibration' },
];
