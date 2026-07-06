import { useT } from '../i18n';
import type { AppNotification } from '../types';

function statusClass(s: string) {
  const t = s.toLowerCase();
  if (t === 'sent' || t === 'ok' || t === 'success') return 'good';
  if (t === 'failed' || t === 'error') return 'bad';
  return 'neutral';
}
function when(iso: string) {
  const d = new Date(iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface Props {
  notifications: AppNotification[];
  onClose: () => void;
}

export function NotificationCenter({ notifications, onClose }: Props) {
  const t = useT();
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div className="drawer-title">{t('v2.notify.title', 'Notifications')}</div>
          <button className="btn btn--sm btn--ghost" onClick={onClose} title={t('common.close', 'Close')}>✕</button>
        </div>
        {notifications.length === 0 ? (
          <p className="muted">{t('v2.notify.empty', 'No notifications yet.')}</p>
        ) : (
          <div className="notif-list">
            {notifications.map((nn) => (
              <div key={nn.id} className="notif-row">
                <div className="notif-top">
                  <span className="notif-title">{nn.title}</span>
                  <span className={`hs-badge hs-badge-${statusClass(nn.status)}`}>{nn.status}</span>
                </div>
                <div className="notif-msg muted">{nn.message}</div>
                <div className="notif-foot faint">{nn.channel} · {when(nn.timestamp)}</div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
