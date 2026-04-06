/**
 * 3MF Validator — validates 3MF files against spec using lib3mf
 * Checks warnings, mesh integrity, and extension usage.
 */

import { getLib } from '../mesh-builder.js';

export async function validate3MF(buffer) {
  const lib = await getLib();
  const wrapper = new lib.CWrapper();
  const model = wrapper.CreateModel();

  const vfsPath = `/validate_${Date.now()}.3mf`;
  try {
    lib.FS.writeFile(vfsPath, new Uint8Array(buffer));
    const reader = model.QueryReader('3mf');
    reader.SetStrictModeActive(false);
    reader.ReadFromFile(vfsPath);

    // Collect warnings
    const warnings = [];
    const warnCount = reader.GetWarningCount();
    for (let i = 0; i < warnCount; i++) {
      const w = reader.GetWarning(i);
      warnings.push({ code: w.ErrorCode, message: w.Message });
    }

    // Analyze meshes
    const meshStats = [];
    const objIter = model.GetMeshObjects();
    while (objIter.MoveNext()) {
      const mesh = objIter.GetCurrentMeshObject();
      const name = mesh.GetName() || `Object ${meshStats.length + 1}`;
      const vertexCount = mesh.GetVertexCount();
      const triangleCount = mesh.GetTriangleCount();

      // Check Euler characteristic for manifold: V - E + F = 2 (for closed mesh)
      // E ≈ F * 3 / 2 for triangle mesh
      const estimatedEdges = Math.round(triangleCount * 3 / 2);
      const euler = vertexCount - estimatedEdges + triangleCount;
      const isManifold = euler === 2;

      meshStats.push({
        name,
        vertexCount,
        triangleCount,
        estimatedEdges,
        eulerCharacteristic: euler,
        isManifold,
      });
    }

    // Detect extensions
    const extensions = _detectExtensions(model);

    // Metadata
    const metadata = {};
    try {
      const mdg = model.GetMetaDataGroup();
      const mdCount = mdg.GetMetaDataCount();
      for (let i = 0; i < mdCount; i++) {
        const md = mdg.GetMetaData(i);
        metadata[md.GetKey()] = md.GetValue();
      }
    } catch {}

    // Thumbnail check
    let hasThumbnail = false;
    try {
      const attachments = model.GetAttachmentCount();
      for (let i = 0; i < attachments; i++) {
        const att = model.GetAttachment(i);
        const path = att.GetPath().toLowerCase();
        if (path.includes('thumbnail') || path.endsWith('.png') || path.endsWith('.jpg')) {
          hasThumbnail = true;
          break;
        }
      }
    } catch {}

    const totalVertices = meshStats.reduce((s, m) => s + m.vertexCount, 0);
    const totalTriangles = meshStats.reduce((s, m) => s + m.triangleCount, 0);
    const allManifold = meshStats.every(m => m.isManifold);

    return {
      valid: warnings.length === 0 && allManifold,
      warnings,
      meshCount: meshStats.length,
      totalVertices,
      totalTriangles,
      allManifold,
      hasThumbnail,
      extensions,
      metadata,
      meshStats,
    };
  } finally {
    try { lib.FS.unlink(vfsPath); } catch {}
    model.delete();
    wrapper.delete();
  }
}

function _detectExtensions(model) {
  const ext = {
    hasMaterials: false,
    hasColors: false,
    hasMultipleObjects: false,
    hasThumbnails: false,
  };

  try {
    // Check for color/material groups
    const matIter = model.GetBaseMaterialGroups();
    if (matIter.MoveNext()) ext.hasMaterials = true;
  } catch {}

  try {
    const colorIter = model.GetColorGroups();
    if (colorIter.MoveNext()) ext.hasColors = true;
  } catch {}

  try {
    let objCount = 0;
    const objIter = model.GetMeshObjects();
    while (objIter.MoveNext()) objCount++;
    ext.hasMultipleObjects = objCount > 1;
  } catch {}

  try {
    ext.hasThumbnails = model.GetAttachmentCount() > 0;
  } catch {}

  return ext;
}
