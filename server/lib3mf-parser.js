/**
 * lib3mf WASM wrapper — spec-compliant 3MF file parsing
 * Uses @3mfconsortium/lib3mf for reliable metadata, mesh, and thumbnail extraction
 */

let _lib = null;

/**
 * Lazy-initialize the lib3mf WASM module (cached singleton)
 */
async function getLib() {
  if (_lib) return _lib;
  const init = (await import('@3mfconsortium/lib3mf')).default;
  _lib = await init();
  return _lib;
}

/**
 * Read a sTransform into a flat 12-element array (column-major 4x3)
 */
function readTransform(t) {
  return [
    t.get_Fields_0_0(), t.get_Fields_0_1(), t.get_Fields_0_2(),
    t.get_Fields_1_0(), t.get_Fields_1_1(), t.get_Fields_1_2(),
    t.get_Fields_2_0(), t.get_Fields_2_1(), t.get_Fields_2_2(),
    t.get_Fields_3_0(), t.get_Fields_3_1(), t.get_Fields_3_2(),
  ];
}

/**
 * Extract color from a lib3mf sColor struct
 */
function readColor(c) {
  return {
    r: c.get_Red(),
    g: c.get_Green(),
    b: c.get_Blue(),
    a: c.get_Alpha(),
  };
}

/**
 * WASM object tracker — ensures all Emscripten objects are freed
 */
function createTracker() {
  const objs = [];
  return {
    track(obj) { objs.push(obj); return obj; },
    cleanup() {
      for (let i = objs.length - 1; i >= 0; i--) {
        try { if (objs[i].delete) objs[i].delete(); } catch { /* ignore */ }
      }
      objs.length = 0;
    },
  };
}

/**
 * Parse a 3MF buffer and extract all available data
 * @param {Buffer} buffer - Raw 3MF file contents
 * @returns {Promise<Object>} Parsed 3MF data
 */
export async function parse3mfBuffer(buffer) {
  const lib = await getLib();
  const t = createTracker();

  const wrapper = t.track(new lib.CWrapper());
  const model = t.track(wrapper.CreateModel());

  try {
    const reader = t.track(model.QueryReader('3mf'));
    const vfsPath = `/parse_${Date.now()}.3mf`;
    lib.FS.writeFile(vfsPath, new Uint8Array(buffer));

    try {
      reader.ReadFromFile(vfsPath);
    } finally {
      try { lib.FS.unlink(vfsPath); } catch { /* ignore */ }
    }

    // --- Metadata ---
    const metadata = {};
    const mdg = t.track(model.GetMetaDataGroup());
    for (let i = 0; i < mdg.GetMetaDataCount(); i++) {
      const md = t.track(mdg.GetMetaData(i));
      metadata[md.GetName()] = md.GetValue();
    }

    // --- Meshes ---
    const meshes = [];
    const meshObjMap = new Map();
    const meshIter = t.track(model.GetMeshObjects());
    while (meshIter.MoveNext()) {
      const obj = t.track(meshIter.GetCurrentMeshObject());
      const vertCount = obj.GetVertexCount();
      const triCount = obj.GetTriangleCount();

      const vertices = new Float32Array(vertCount * 3);
      for (let i = 0; i < vertCount; i++) {
        const v = obj.GetVertex(i);
        vertices[i * 3] = v.get_Coordinates0();
        vertices[i * 3 + 1] = v.get_Coordinates1();
        vertices[i * 3 + 2] = v.get_Coordinates2();
      }

      const triangles = new Uint32Array(triCount * 3);
      for (let i = 0; i < triCount; i++) {
        const tri = obj.GetTriangle(i);
        triangles[i * 3] = tri.get_Indices0();
        triangles[i * 3 + 1] = tri.get_Indices1();
        triangles[i * 3 + 2] = tri.get_Indices2();
      }

      // Per-object metadata
      const objMeta = {};
      const objMdg = t.track(obj.GetMetaDataGroup());
      for (let i = 0; i < objMdg.GetMetaDataCount(); i++) {
        const md = t.track(objMdg.GetMetaData(i));
        objMeta[md.GetName()] = md.GetValue();
      }

      const meshIndex = meshes.length;
      meshObjMap.set(obj.GetResourceID(), meshIndex);

      meshes.push({
        name: obj.GetName() || `Mesh_${meshIndex}`,
        vertices,
        triangles,
        vertexCount: vertCount,
        triangleCount: triCount,
        metadata: objMeta,
        resourceId: obj.GetResourceID(),
      });
    }

    // --- Base material colors ---
    const materials = [];
    try {
      const matIter = t.track(model.GetBaseMaterialGroups());
      while (matIter.MoveNext()) {
        const group = t.track(matIter.GetCurrentBaseMaterialGroup());
        const groupId = group.GetResourceID();
        for (let i = 0; i < group.GetCount(); i++) {
          const color = readColor(group.GetDisplayColor(i));
          materials.push({
            groupId,
            index: i,
            name: group.GetName(i),
            color,
            hex: `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`,
          });
        }
      }
    } catch { /* no materials */ }

    // --- Color groups ---
    const colorGroups = [];
    try {
      const cgIter = t.track(model.GetColorGroups());
      while (cgIter.MoveNext()) {
        const group = t.track(cgIter.GetCurrentColorGroup());
        const groupId = group.GetResourceID();
        const count = group.GetCount();
        const colors = [];
        for (let i = 0; i < count; i++) {
          colors.push(readColor(group.GetColor(i)));
        }
        colorGroups.push({ groupId, colors });
      }
    } catch { /* no color groups */ }

    // --- Build items ---
    const buildItems = [];
    const biIter = t.track(model.GetBuildItems());
    while (biIter.MoveNext()) {
      const item = t.track(biIter.GetCurrent());
      const objId = item.GetObjectResourceID();
      const entry = { objectId: objId, meshIndex: meshObjMap.get(objId) ?? -1 };
      if (item.HasObjectTransform()) {
        entry.transform = readTransform(item.GetObjectTransform());
      }
      buildItems.push(entry);
    }

    // --- Thumbnails ---
    const thumbnails = [];
    if (model.HasPackageThumbnailAttachment()) {
      const thumb = t.track(model.GetPackageThumbnailAttachment());
      const thumbPath = `/thumb_${Date.now()}`;
      thumb.WriteToFile(thumbPath);
      const data = Buffer.from(lib.FS.readFile(thumbPath));
      try { lib.FS.unlink(thumbPath); } catch { /* ignore */ }
      thumbnails.push({
        path: thumb.GetPath(),
        data,
        contentType: thumb.GetPath().endsWith('.png') ? 'image/png' : 'image/jpeg',
      });
    }

    // Check attachments for additional thumbnails
    for (let i = 0; i < model.GetAttachmentCount(); i++) {
      const att = t.track(model.GetAttachment(i));
      const attPath = att.GetPath();
      if (/thumbnail|plate_\d+\.(png|jpg|jpeg)/i.test(attPath)) {
        const already = thumbnails.some(th => th.path === attPath);
        if (!already) {
          const tmpPath = `/att_${Date.now()}_${i}`;
          att.WriteToFile(tmpPath);
          const data = Buffer.from(lib.FS.readFile(tmpPath));
          try { lib.FS.unlink(tmpPath); } catch { /* ignore */ }
          thumbnails.push({
            path: attPath,
            data,
            contentType: attPath.endsWith('.png') ? 'image/png' : 'image/jpeg',
          });
        }
      }
    }

    // --- Slicer-specific config (Bambu/Prusa store in attachments) ---
    const attachments = [];
    for (let i = 0; i < model.GetAttachmentCount(); i++) {
      const att = t.track(model.GetAttachment(i));
      const attPath = att.GetPath();
      if (/\.(config|xml|gcode)$/i.test(attPath)) {
        const tmpPath = `/cfg_${Date.now()}_${i}`;
        att.WriteToFile(tmpPath);
        const data = Buffer.from(lib.FS.readFile(tmpPath)).toString('utf8');
        try { lib.FS.unlink(tmpPath); } catch { /* ignore */ }
        attachments.push({ path: attPath, data });
      }
    }

    // --- Validation warnings ---
    const warnings = [];
    const warnCount = reader.GetWarningCount();
    for (let i = 0; i < warnCount; i++) {
      const w = reader.GetWarning(i);
      warnings.push({ code: w.ErrorCode, message: w.return || '' });
    }

    return {
      meshes,
      metadata,
      materials,
      colorGroups,
      buildItems,
      thumbnails,
      attachments,
      warnings,
      isValid: warnings.length === 0,
      unit: model.GetUnit(),
    };
  } finally {
    t.cleanup();
  }
}

/**
 * Validate a 3MF buffer without full parsing
 * @param {Buffer} buffer
 * @returns {Promise<{ isValid: boolean, errors: Array }>}
 */
export async function validate3mf(buffer) {
  try {
    const result = await parse3mfBuffer(buffer);
    return {
      isValid: result.isValid,
      errors: result.warnings,
      meshCount: result.meshes.length,
      hasThumbnail: result.thumbnails.length > 0,
    };
  } catch (err) {
    return {
      isValid: false,
      errors: [{ code: -1, message: err.message || String(err) }],
      meshCount: 0,
      hasThumbnail: false,
    };
  }
}

/**
 * Extract thumbnails from a 3MF buffer
 * @param {Buffer} buffer
 * @returns {Promise<Array<{ path: string, data: Buffer, contentType: string }>>}
 */
export async function extractThumbnails(buffer) {
  const result = await parse3mfBuffer(buffer);
  return result.thumbnails;
}

/**
 * Extract mesh data suitable for 3D rendering
 * Returns combined vertices/triangles for backward compat plus per-mesh data
 * @param {Buffer} buffer
 * @returns {Promise<Object>}
 */
export async function extractMeshData(buffer) {
  const result = await parse3mfBuffer(buffer);

  // Merge all meshes into combined arrays (backward compat with existing ModelViewer)
  let totalVerts = 0;
  let totalTris = 0;
  for (const m of result.meshes) {
    totalVerts += m.vertexCount;
    totalTris += m.triangleCount;
  }

  const vertices = new Float32Array(totalVerts * 3);
  const triangles = new Uint32Array(totalTris * 3);
  let vOff = 0;
  let tOff = 0;
  let vBase = 0;

  for (const m of result.meshes) {
    vertices.set(m.vertices, vOff);
    vOff += m.vertices.length;

    for (let i = 0; i < m.triangles.length; i++) {
      triangles[tOff + i] = m.triangles[i] + vBase;
    }
    tOff += m.triangles.length;
    vBase += m.vertexCount;
  }

  return {
    vertices,
    triangles,
    meshes: result.meshes,
    buildItems: result.buildItems,
    materials: result.materials,
    colorGroups: result.colorGroups,
    metadata: result.metadata,
    thumbnails: result.thumbnails,
    unit: result.unit,
  };
}
