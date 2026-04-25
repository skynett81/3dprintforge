/**
 * Text Intent Parser — turns a free-text prompt into a structured
 * generation request the AI Forge can dispatch.
 *
 * Implementation is a deliberately simple lexer + keyword matcher (no
 * external NLP models, no GPU). The tradeoff is that it only recognises
 * a curated vocabulary, but for printable functional objects that's
 * actually what users want — vague creative prompts ("a dragon") would
 * never produce a watertight printable mesh anyway.
 *
 * Supported shapes:
 *   - Geometric primitives: cube/box, sphere/ball, cylinder/tube, cone,
 *     torus/ring, prism, hex/hexagon, pyramid
 *   - Composed shapes: pyramid-on-cube, two cubes, three spheres
 *   - Functional shortcuts: keychain, vase, sign, lithophane, tag,
 *     gear, plate, bracket, label
 *
 * Supported modifiers:
 *   - dimensions: "20mm", "5cm", "20x30x10"
 *   - relative size: "tiny" / "small" / "medium" / "large" / "big" / "huge"
 *   - count: "one"…"ten" or numeric
 *   - text content: "with text 'X'", '"X"', "labelled X", "named X"
 *   - hollow: "hollow", "shell"
 *   - material thickness override: "wall 2mm"
 */

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  pair: 2, dozen: 12,
};

const SIZE_PRESETS = {
  tiny: 5, small: 10, little: 10, medium: 20, default: 20,
  large: 40, big: 40, huge: 80, giant: 100,
};

const SHAPE_KEYWORDS = {
  cube:        { type: 'cube',        defaults: { size: 20 } },
  box:         { type: 'box',         defaults: { w: 30, h: 20, d: 15 } },
  cuboid:      { type: 'box',         defaults: { w: 30, h: 20, d: 15 } },
  sphere:      { type: 'sphere',      defaults: { r: 15 } },
  ball:        { type: 'sphere',      defaults: { r: 15 } },
  cylinder:    { type: 'cylinder',    defaults: { r: 10, h: 20 } },
  tube:        { type: 'cylinder',    defaults: { r: 10, h: 30 } },
  pipe:        { type: 'cylinder',    defaults: { r: 10, h: 30 } },
  cone:        { type: 'cone',        defaults: { r1: 10, r2: 0, h: 20 } },
  torus:       { type: 'torus',       defaults: { R: 15, r: 5 } },
  ring:        { type: 'torus',       defaults: { R: 15, r: 5 } },
  donut:       { type: 'torus',       defaults: { R: 15, r: 5 } },
  prism:       { type: 'prism',       defaults: { sides: 6, r: 10, h: 20 } },
  hex:         { type: 'prism',       defaults: { sides: 6, r: 10, h: 20 } },
  hexagon:     { type: 'prism',       defaults: { sides: 6, r: 10, h: 20 } },
  octagon:     { type: 'prism',       defaults: { sides: 8, r: 10, h: 20 } },
  triangle:    { type: 'prism',       defaults: { sides: 3, r: 10, h: 20 } },
  pyramid:     { type: 'pyramid',     defaults: { w: 20, h: 20 } },
  // Functional shortcuts (dispatch to existing Model Forge generators).
  keychain:    { type: 'keychain',    defaults: { text: 'KEY', size: 30 } },
  tag:         { type: 'keychain',    defaults: { text: 'TAG', size: 25 } },
  label:       { type: 'cable_label', defaults: { text: 'LABEL', size: 20 } },
  sign:        { type: 'sign',        defaults: { text: 'HELLO', width: 60, height: 20 } },
  plaque:      { type: 'sign',        defaults: { text: 'PLAQUE', width: 80, height: 30 } },
  vase:        { type: 'vase',        defaults: { r: 25, h: 60 } },
  lithophane:  { type: 'lithophane',  defaults: { width: 80, height: 80 } },
  relief:      { type: 'relief',      defaults: { width: 60, height: 60 } },
  gear:        { type: 'gear',        defaults: { teeth: 20, modulus: 1, h: 8 } },
  plate:       { type: 'plate',       defaults: { w: 50, h: 50, d: 2 } },
  bracket:     { type: 'bracket',     defaults: { w: 30, h: 30, t: 3 } },
  // Single-word generator-backed shapes
  hook:        { type: 'hook',        defaults: { w: 40, h: 30, d: 5 } },
  hinge:       { type: 'hinge',       defaults: { w: 40, h: 20, d: 4 } },
  spring:      { type: 'spring',      defaults: { r: 10, h: 40 } },
  thread:      { type: 'thread',      defaults: { r: 5, pitch: 1.5, h: 20 } },
};

// Multi-word shape keywords ("phone stand" → phone_stand). Resolved by
// pairing adjacent tokens during parsing.
const MULTI_WORD_KEYWORDS = {
  'storage box':        { type: 'storage_box',        defaults: { w: 60, h: 40, d: 30 } },
  'plant pot':          { type: 'plant_pot',          defaults: { r: 40, h: 60 } },
  'phone stand':        { type: 'phone_stand',        defaults: { w: 90, h: 60 } },
  'cable label':        { type: 'cable_label',        defaults: { w: 25, text: 'LABEL' } },
  'cable clip':         { type: 'cable_clip',         defaults: { d: 10, diameter: 6 } },
  'battery holder':     { type: 'battery_holder',     defaults: { count: 2, type: 'AA' } },
  'headphone stand':    { type: 'headphone_stand',    defaults: { h: 200, w: 100 } },
  'gridfinity bin':     { type: 'gridfinity_bin',     defaults: { unitsX: 1, unitsY: 1, heightUnits: 3 } },
  'gridfinity baseplate': { type: 'gridfinity_baseplate', defaults: { unitsX: 4, unitsY: 4 } },
  'gridfinity lid':     { type: 'gridfinity_lid',     defaults: { unitsX: 1, unitsY: 1 } },
};

/**
 * Tokenize an input string into a normalised lowercase array. Removes
 * common stopwords that don't affect intent.
 */
function _tokenize(text) {
  const stop = new Set(['a', 'an', 'the', 'with', 'and', 'of', 'in', 'on', 'at']);
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9.\-_'"\s×x]/g, ' ')
    .split(/\s+/)
    .filter(w => w && !stop.has(w));
}

/**
 * Extract a quoted text payload (single or double quotes) from the prompt.
 * Returns `null` if nothing is quoted.
 */
function _extractQuotedText(rawText) {
  const m = String(rawText || '').match(/['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

/**
 * Match dimension patterns: "20mm", "5cm", "10in", "20x30x10".
 */
function _extractDimensions(tokens, raw) {
  const out = {};

  // Triple dimension (e.g. "20x30x10")
  const tripleRe = /(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i;
  let m = String(raw || '').match(tripleRe);
  if (m) { out.w = parseFloat(m[1]); out.h = parseFloat(m[2]); out.d = parseFloat(m[3]); return out; }

  // Pair dimension (e.g. "30x80" or "2x3" for gridfinity)
  const pairRe = /(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i;
  m = String(raw || '').match(pairRe);
  if (m) { out.w = parseFloat(m[1]); out.h = parseFloat(m[2]); out.unitsX = parseInt(m[1], 10); out.unitsY = parseInt(m[2], 10); }

  // Single units
  const numberUnitRe = /(\d+(?:\.\d+)?)\s*(mm|cm|m|in|inch|inches|")/g;
  while ((m = numberUnitRe.exec(String(raw || ''))) !== null) {
    let val = parseFloat(m[1]);
    const unit = (m[2] || 'mm').toLowerCase();
    if (unit === 'cm') val *= 10;
    else if (unit === 'm') val *= 1000;
    else if (unit === 'in' || unit === 'inch' || unit === 'inches' || unit === '"') val *= 25.4;
    if (!('size' in out)) out.size = val;
    else if (!('h' in out)) out.h = val;
    else if (!('d' in out)) out.d = val;
  }
  return out;
}

/**
 * Look for parametric hints like "r=10", "h=20", "teeth=20".
 */
function _extractKeyValues(raw) {
  const out = {};
  const re = /([a-z]+)\s*=\s*(\d+(?:\.\d+)?)/gi;
  let m;
  while ((m = re.exec(String(raw || ''))) !== null) {
    out[m[1].toLowerCase()] = parseFloat(m[2]);
  }
  return out;
}

/**
 * Detect a numeric or word-form count in the prompt.
 */
function _extractCount(tokens) {
  for (const t of tokens) {
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    if (NUMBER_WORDS[t]) return NUMBER_WORDS[t];
  }
  return 1;
}

/**
 * Resolve the primary shape keyword the user mentioned.
 */
function _resolveShape(tokens) {
  // Try multi-word keywords first (most specific wins): scan adjacent
  // pairs of tokens. "gridfinity bin 2x3" → gridfinity_bin.
  for (let i = 0; i < tokens.length - 1; i++) {
    const pair = `${tokens[i]} ${tokens[i + 1]}`;
    if (MULTI_WORD_KEYWORDS[pair]) {
      return { keyword: pair, ...MULTI_WORD_KEYWORDS[pair] };
    }
  }
  // Single-word keyword pass.
  for (const t of tokens) {
    if (SHAPE_KEYWORDS[t]) return { keyword: t, ...SHAPE_KEYWORDS[t] };
    // Handle plurals: "cubes" → "cube", "spheres" → "sphere".
    if (t.endsWith('s') && SHAPE_KEYWORDS[t.slice(0, -1)]) {
      const base = t.slice(0, -1);
      return { keyword: base, ...SHAPE_KEYWORDS[base] };
    }
    // Handle "-es" plurals: "boxes" → "box".
    if (t.endsWith('es') && SHAPE_KEYWORDS[t.slice(0, -2)]) {
      const base = t.slice(0, -2);
      return { keyword: base, ...SHAPE_KEYWORDS[base] };
    }
  }
  return null;
}

/**
 * Find a relative size word ("tiny", "huge"). Returns the mm value
 * suggested by the preset, or null.
 */
function _resolvePresetSize(tokens) {
  for (const t of tokens) if (SIZE_PRESETS[t]) return SIZE_PRESETS[t];
  return null;
}

/**
 * Detect modifier flags (hollow, twisted, mirrored, rounded).
 */
function _extractModifiers(tokens) {
  const flags = {};
  for (const t of tokens) {
    if (t === 'hollow' || t === 'shell') flags.hollow = true;
    else if (t === 'twisted' || t === 'twist') flags.twisted = true;
    else if (t === 'rounded' || t === 'fillet') flags.rounded = true;
    else if (t === 'mirror' || t === 'mirrored') flags.mirrored = true;
  }
  return flags;
}

/**
 * Top-level parser. Returns a structured intent object the dispatcher
 * can consume:
 *   { shape, params, count, text, modifiers, raw }
 *
 * If no shape keyword is recognised, returns a fallback intent that
 * generates a placeholder cube — the caller can decide whether to
 * accept that or report an error.
 */
export function parseIntent(rawText) {
  const tokens = _tokenize(rawText);
  const shape = _resolveShape(tokens);

  if (!shape) {
    return {
      shape: 'cube',
      params: { size: 20 },
      count: _extractCount(tokens),
      text: _extractQuotedText(rawText),
      modifiers: _extractModifiers(tokens),
      raw: rawText,
      unknown: true,
    };
  }

  const params = { ...shape.defaults };

  // Apply preset size first, then exact dimensions, then key=value overrides.
  const preset = _resolvePresetSize(tokens);
  if (preset !== null) {
    if ('size' in params) params.size = preset;
    if ('w' in params) params.w = preset;
    if ('h' in params) params.h = preset;
    if ('d' in params) params.d = preset;
    if ('r' in params) params.r = Math.round(preset / 2);
    if ('R' in params) params.R = preset;
  }

  const dims = _extractDimensions(tokens, rawText);
  if ('w' in dims) params.w = dims.w;
  if ('h' in dims) params.h = dims.h;
  if ('d' in dims) params.d = dims.d;
  if ('unitsX' in dims) params.unitsX = dims.unitsX;
  if ('unitsY' in dims) params.unitsY = dims.unitsY;
  if ('size' in dims && 'size' in params) params.size = dims.size;
  if ('size' in dims && 'r' in params && !('r' in dims)) params.r = dims.size / 2;
  if ('size' in dims && 'h' in params && !('h' in dims)) params.h = dims.size;

  const kv = _extractKeyValues(rawText);
  for (const k of Object.keys(kv)) params[k] = kv[k];

  const text = _extractQuotedText(rawText);
  if (text && ('text' in params || shape.type === 'keychain' || shape.type === 'sign' || shape.type === 'cable_label')) {
    params.text = text;
  }

  return {
    shape: shape.type,
    keyword: shape.keyword,
    params,
    count: _extractCount(tokens),
    text,
    modifiers: _extractModifiers(tokens),
    raw: rawText,
  };
}

export const _internals = {
  _tokenize, _extractQuotedText, _extractDimensions, _extractKeyValues, _extractCount,
  SHAPE_KEYWORDS, SIZE_PRESETS, NUMBER_WORDS,
};
