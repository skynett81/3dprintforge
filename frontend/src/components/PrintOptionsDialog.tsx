import { useEffect, useState } from 'react';
import { api } from '../api';
import { useT } from '../i18n';
import { useToast } from '../toast';

interface AmsTray { amsId: number; trayId: number; type?: string; color?: string }

const OPTIONS: { key: string; label: string; def: boolean }[] = [
  { key: 'use_ams', label: 'Use AMS', def: true },
  { key: 'bed_leveling', label: 'Bed leveling', def: true },
  { key: 'timelapse', label: 'Timelapse', def: false },
  { key: 'flow_cali', label: 'Flow calibration', def: false },
  { key: 'vibration_cali', label: 'Vibration calibration', def: false },
  { key: 'layer_inspect', label: 'First-layer inspection', def: false },
];

/**
 * Launch a print with AMS colour mapping + per-print options. The AMS mapping
 * is an ordered list (one entry per slicer filament) → an AMS tray global id
 * (unit*4 + slot), 254 = external, -1 = auto/unused.
 */
export function PrintOptionsDialog({ printerId, live, onClose }: { printerId: string; live: Record<string, unknown>; onClose: () => void }) {
  const t = useT();
  const toast = useToast();
  const [files, setFiles] = useState<string[]>([]);
  const [file, setFile] = useState('');
  const [plate, setPlate] = useState('1');
  const [mapping, setMapping] = useState<string[]>([]); // per filament: gid | 'ext' | '' (auto)
  const [opts, setOpts] = useState<Record<string, boolean>>(Object.fromEntries(OPTIONS.map((o) => [o.key, o.def])));
  const [busy, setBusy] = useState(false);

  const trays = ((live._ams_trays as AmsTray[]) || []).map((tr) => ({
    gid: tr.amsId * 4 + tr.trayId,
    label: `AMS${tr.amsId + 1}·${tr.trayId + 1}${tr.type ? ` ${tr.type}` : ''}`,
    color: tr.color,
  }));

  useEffect(() => {
    api.listPrinterFiles(printerId)
      .then((fs) => setFiles(fs.map((f) => (typeof f === 'string' ? f : (f.name || ''))).filter(Boolean)))
      .catch(() => {});
  }, [printerId]);

  function setMap(i: number, v: string) { const m = mapping.slice(); m[i] = v; setMapping(m); }

  async function doPrint() {
    if (!file) { toast(t('v2.print.pick', 'Pick a file to print'), 'error'); return; }
    const ams_mapping = mapping.map((v) => (v === 'ext' ? 254 : v === '' ? -1 : Number(v)));
    setBusy(true);
    try {
      await api.printFile(printerId, { filename: file, plate_id: Number(plate) || 1, ...opts, ams_mapping: ams_mapping.length ? ams_mapping : undefined });
      toast(t('v2.print.sent', 'Print started'), 'success');
      onClose();
    } catch (e) { toast((e as Error).message, 'error'); }
    finally { setBusy(false); }
  }

  return (
    <div className="cmd-backdrop" onMouseDown={onClose}>
      <div className="st-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="qr-scan-head">
          <strong>{t('v2.print.title', 'Print a file')}</strong>
          <button className="btn btn--sm btn--ghost" onClick={onClose} aria-label={t('common.close', 'Close')}>✕</button>
        </div>
        <div className="st-body">
          <label className="field"><span className="field-label">{t('v2.print.file', 'File on printer')}</span>
            <select className="input" value={file} onChange={(e) => setFile(e.target.value)}>
              <option value="">{files.length ? t('v2.print.pick', 'Pick a file to print') : t('v2.print.no_files', 'No files on the printer SD')}</option>
              {files.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <label className="field" style={{ maxWidth: 120 }}><span className="field-label">{t('v2.print.plate', 'Plate')}</span>
            <input className="input" type="number" min={1} value={plate} onChange={(e) => setPlate(e.target.value)} />
          </label>

          <div className="field-label" style={{ marginTop: 10 }}>{t('v2.print.ams', 'AMS colour mapping')}</div>
          <p className="muted micro" style={{ margin: '2px 0 6px' }}>{t('v2.print.ams_hint', 'One row per slicer filament, in order. Leave empty for auto.')}</p>
          {mapping.map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
              <span className="muted" style={{ minWidth: 64, fontSize: '0.8rem' }}>{t('v2.print.filament', 'Filament')} {i + 1}</span>
              <select className="input" value={v} onChange={(e) => setMap(i, e.target.value)} style={{ flex: 1 }}>
                <option value="">{t('v2.print.auto', 'Auto')}</option>
                {trays.map((tr) => <option key={tr.gid} value={tr.gid}>{tr.label}{tr.color ? ` #${String(tr.color).slice(0, 6)}` : ''}</option>)}
                <option value="ext">{t('v2.print.external', 'External spool')}</option>
              </select>
              <button className="btn btn--sm btn--ghost" onClick={() => setMapping(mapping.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <button className="btn btn--sm btn--ghost" onClick={() => setMapping([...mapping, ''])}>{t('v2.print.add_filament', '+ Filament')}</button>

          <div className="field-label" style={{ marginTop: 12 }}>{t('v2.print.options', 'Options')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginTop: 4 }}>
            {OPTIONS.map((o) => (
              <label key={o.key} className="chk" style={{ fontSize: '0.85rem' }}>
                <input type="checkbox" checked={!!opts[o.key]} onChange={(e) => setOpts({ ...opts, [o.key]: e.target.checked })} /> {t(`v2.print.opt_${o.key}`, o.label)}
              </label>
            ))}
          </div>
        </div>
        <div className="drawer-controls" style={{ padding: '10px 14px' }}>
          <button className="btn btn--primary" disabled={busy || !file} onClick={doPrint}>{t('v2.print.start', 'Start print')}</button>
          <button className="btn btn--ghost" onClick={onClose}>{t('common.cancel', 'Cancel')}</button>
        </div>
      </div>
    </div>
  );
}
