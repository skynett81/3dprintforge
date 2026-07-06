import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { formatBytes, formatUptime } from '../format';
import type { SystemInfo } from '../types';

export function DiagnosticsPanel({ embedded }: { embedded?: boolean } = {}) {
  const t = useT();
  const { data, error } = useResource<SystemInfo>(api.getSystemInfo, 10000);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <p className="muted">{t('common.loading', 'Loading…')}</p>;

  const rows: [string, string][] = [
    [t('v2.diag.db_version', 'Schema version'), `v${data.db_version}`],
    [t('v2.diag.uptime', 'Uptime'), formatUptime(data.uptime_seconds)],
    [t('v2.diag.memory', 'Memory'), `${data.memory_mb} MB`],
    [t('v2.diag.db_size', 'Database'), formatBytes(data.db_size)],
    [t('v2.diag.printers', 'Printers'), String(data.printer_count)],
    [t('v2.diag.node', 'Node'), data.node_version],
    [t('v2.diag.platform', 'Platform'), data.platform],
    [t('v2.diag.host', 'Host'), data.hostname],
    ['PID', String(data.pid)],
  ];

  return (
    <div>
      {!embedded && (
        <div className="panel-head">
          <div>
            <h2 className="panel-title">{t('v2.diag.title', 'Diagnostics')}</h2>
            <p className="muted sub">{t('v2.diag.subtitle', 'Server & system status')}</p>
          </div>
        </div>
      )}
      <section className="card">
        <div className="diag-grid">
          {rows.map(([k, v]) => (
            <div className="diag-row" key={k}>
              <span className="muted">{k}</span>
              <span className="diag-val tnum">{v}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
