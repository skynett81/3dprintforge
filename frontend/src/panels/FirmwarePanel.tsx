import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import type { FirmwareInfo } from '../types';

function when(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function FirmwarePanel({ embedded }: { embedded?: boolean } = {}) {
  const t = useT();
  const { data } = useResource<FirmwareInfo>(api.getFirmware, 60000);
  const rows = data?.availableUpdates ?? [];
  const withUpdate = rows.filter((r) => r.update_available);

  return (
    <div>
      {!embedded && (
        <div className="panel-head">
          <div>
            <h2 className="panel-title">{t('v2.fw.title', 'Firmware')}</h2>
            <p className="muted sub">
              {withUpdate.length} {t('v2.fw.updates', 'updates available')} · {t('v2.fw.checked', 'checked')} {when(data?.lastCheckAt)}
            </p>
          </div>
        </div>
      )}
      <section className="card">
        {rows.length === 0 ? (
          <p className="muted empty-note">{t('v2.fw.none', 'No firmware info yet.')}</p>
        ) : (
          <div className="fw-list">
            <div className="fw-head">
              <span>{t('v2.fw.printer', 'Printer')}</span>
              <span>{t('v2.fw.module', 'Module')}</span>
              <span>{t('v2.fw.current', 'Current')}</span>
              <span>{t('v2.fw.latest', 'Latest')}</span>
              <span></span>
            </div>
            {rows.map((r) => (
              <div className="fw-row" key={r.id}>
                <span className="fw-printer">{r.printer_id}</span>
                <span className="muted">{r.module}</span>
                <span className="tnum">{r.sw_ver}</span>
                <span className="tnum">{r.latest_available || '—'}</span>
                {r.update_available
                  ? (r.release_url
                    ? <a className="hs-badge hs-badge-warn" href={r.release_url} target="_blank" rel="noreferrer">{t('v2.fw.update', 'update →')}</a>
                    : <span className="hs-badge hs-badge-warn">{t('v2.fw.available', 'available')}</span>)
                  : <span className="hs-badge hs-badge-good">{t('v2.fw.uptodate', 'up to date')}</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
