import { useEffect, useState } from 'react';
import { api } from '../api';
import { useResource } from '../hooks';
import { useT } from '../i18n';
import { useToast } from '../toast';
import { CHANNELS, isChannelConfigured } from '../settings';
import type { NotificationConfig } from '../types';

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      className={`toggle${checked ? ' toggle--on' : ''}`}
      disabled={disabled}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  );
}

export function SettingsPanel() {
  const t = useT();
  const toast = useToast();
  const { data, error } = useResource<NotificationConfig>(api.getNotificationConfig, 0);
  const [cfg, setCfg] = useState<NotificationConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setCfg(structuredClone(data)); }, [data]);

  if (error) return <div className="error">{error}</div>;
  if (!cfg) return <p className="muted">{t('common.loading', 'Loading…')}</p>;

  function toggleChannel(name: string, enabled: boolean) {
    setCfg((c) => c && ({ ...c, channels: { ...c.channels, [name]: { ...(c.channels[name] || {}), enabled } } }));
  }
  async function save() {
    if (!cfg) return;
    setSaving(true);
    try { await api.saveNotificationConfig(cfg); toast(t('common.saved', 'Saved'), 'success'); }
    catch (e) { toast((e as Error).message, 'error'); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.settings.title', 'Settings')}</h2>
          <p className="muted sub">{t('v2.settings.subtitle', 'Notification channels')}</p>
        </div>
      </div>

      <section className="card">
        <div className="card-head">
          <div className="card-title">{t('v2.settings.notifications', 'Notifications')}</div>
          <button className="btn btn--primary" disabled={saving} onClick={save}>{t('common.save', 'Save')}</button>
        </div>

        <div className="toggle-row toggle-row--main">
          <span>{t('v2.settings.enable_all', 'Enable notifications')}</span>
          <Toggle checked={!!cfg.enabled} onChange={(v) => setCfg((c) => c && ({ ...c, enabled: v }))} />
        </div>

        <div className="chan-list">
          {CHANNELS.map((name) => {
            const ch = cfg.channels?.[name] || {};
            const configured = isChannelConfigured(name, ch);
            return (
              <div className="chan-row" key={name}>
                <span className="chan-name">{name}</span>
                <span className={`chan-status chan-status--${configured ? 'ok' : 'off'}`}>
                  {configured ? t('v2.settings.configured', 'configured') : t('v2.settings.not_configured', 'not configured')}
                </span>
                <Toggle checked={!!ch.enabled} disabled={!configured} onChange={(v) => toggleChannel(name, v)} />
              </div>
            );
          })}
        </div>
        <p className="muted empty-note">{t('v2.settings.note', 'Credentials are configured in the classic UI; here you enable/disable channels.')}</p>
      </section>
    </div>
  );
}
