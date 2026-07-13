import { useState } from 'react';
import { useT } from '../../i18n';
import type { ObjInfo } from '../../components/PlateViewer';

interface Props {
  info: ObjInfo;
  onPos: (x: number, y: number) => void;
  onRot: (x: number, y: number, z: number) => void;
  onScalePct: (pct: number) => void;
  onDim: (axis: 'x' | 'y' | 'z', mm: number, uniform: boolean) => void;
  onMirror: (axis: 'x' | 'y' | 'z') => void;
  onReset: () => void;
}

function Field({ label, value, onCommit, step }: { label: string; value: number; onCommit: (v: number) => void; step?: number }) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(value);
  const commit = () => { if (draft !== null) { const v = parseFloat(draft); if (!Number.isNaN(v)) onCommit(v); setDraft(null); } };
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="input" type="number" step={step ?? 1} value={shown}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
      />
    </label>
  );
}

/**
 * Object manipulation panel — exact position / rotation / scale / dimensions,
 * mirror and reset for the selected model, like a desktop slicer's object
 * panel. Values are live: dragging the gizmo updates them and typing here
 * moves the model.
 */
export function ObjectPanel({ info, onPos, onRot, onScalePct, onDim, onMirror, onReset }: Props) {
  const t = useT();
  const [uniform, setUniform] = useState(true);

  return (
    <section className="card slicer-card">
      <div className="field-label" style={{ marginBottom: 8 }}>{t('v2.obj.title', 'Object')}</div>

      <div className="obj-group-label">{t('v2.obj.position', 'Position (mm)')}</div>
      <div className="slset-grid">
        <Field label="X" value={info.posX} onCommit={(v) => onPos(v, info.posY)} step={0.5} />
        <Field label="Y" value={info.posY} onCommit={(v) => onPos(info.posX, v)} step={0.5} />
      </div>

      <div className="obj-group-label">{t('v2.obj.rotation', 'Rotation (°)')}</div>
      <div className="slset-grid">
        <Field label="X" value={info.rotX} onCommit={(v) => onRot(v, info.rotY, info.rotZ)} />
        <Field label="Y" value={info.rotY} onCommit={(v) => onRot(info.rotX, v, info.rotZ)} />
        <Field label="Z" value={info.rotZ} onCommit={(v) => onRot(info.rotX, info.rotY, v)} />
      </div>

      <div className="obj-group-label">{t('v2.obj.scale', 'Scale')}</div>
      <div className="slset-grid">
        <Field label={t('v2.obj.uniform', 'Uniform %')} value={info.scalePct} onCommit={onScalePct} step={1} />
      </div>

      <div className="obj-group-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {t('v2.obj.size', 'Size (mm)')}
        <label className="chk" style={{ margin: 0, marginLeft: 'auto', fontWeight: 400 }}>
          <input type="checkbox" checked={uniform} onChange={(e) => setUniform(e.target.checked)} /> {t('v2.obj.lock', 'lock ratio')}
        </label>
      </div>
      <div className="slset-grid">
        <Field label="X" value={info.dimX} onCommit={(v) => onDim('x', v, uniform)} step={0.5} />
        <Field label="Y" value={info.dimY} onCommit={(v) => onDim('y', v, uniform)} step={0.5} />
        <Field label="Z" value={info.dimZ} onCommit={(v) => onDim('z', v, uniform)} step={0.5} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
        <button className="btn btn--sm btn--ghost" onClick={() => onMirror('x')}>{t('v2.obj.mirror_x', 'Mirror X')}</button>
        <button className="btn btn--sm btn--ghost" onClick={() => onMirror('y')}>{t('v2.obj.mirror_y', 'Mirror Y')}</button>
        <button className="btn btn--sm btn--ghost" onClick={() => onMirror('z')}>{t('v2.obj.mirror_z', 'Mirror Z')}</button>
        <button className="btn btn--sm btn--ghost" style={{ marginLeft: 'auto' }} onClick={onReset}>{t('v2.obj.reset', 'Reset')}</button>
      </div>
    </section>
  );
}
