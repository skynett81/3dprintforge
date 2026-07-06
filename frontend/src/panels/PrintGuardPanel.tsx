import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import type { ProtectionEvent } from '../types';

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function PrintGuardPanel() {
  const t = useT();
  const toast = useToast();
  const { data, reload } = useResource<ProtectionEvent[]>(api.getProtectionLog, 15000);
  const events = [...(data ?? [])].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  const unresolved = events.filter((e) => !e.resolved).length;

  async function resolve(id: number) {
    try { await api.resolveProtection(id); toast(t('v2.guard.resolved', 'Resolved'), 'success'); reload(); }
    catch (e) { toast((e as Error).message, 'error'); }
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.guard.title', 'Print Guard')}</h2>
          <p className="muted sub">{unresolved} {t('v2.guard.open', 'open')} · {events.length} {t('v2.guard.events', 'events')}</p>
        </div>
      </div>
      <section className="card">
        {events.length === 0 ? (
          <p className="muted empty-note">{t('v2.guard.none', 'No protection events. Prints are running clean.')}</p>
        ) : (
          <div className="err-list">
            {events.map((e) => (
              <div className={`err-row${e.resolved ? ' err-row--acked' : ''}`} key={e.id} style={{ gridTemplateColumns: 'auto 1.6fr 1fr auto auto' }}>
                <span className={`hs-badge hs-badge-${e.resolved ? 'good' : 'bad'}`}>{e.event_type}</span>
                <span className="err-msg">{e.action_taken || t('v2.guard.detected', 'detected')}</span>
                <span className="muted">{e.printer_id}</span>
                <span className="muted tnum">{when(e.timestamp)}</span>
                {e.resolved
                  ? <span className="faint">{t('v2.guard.done', 'resolved')}</span>
                  : <button className="btn btn--sm" onClick={() => resolve(e.id)}>{t('v2.guard.resolve', 'Resolve')}</button>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
