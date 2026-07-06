import { useState } from 'react';
import { useAuth, useResource } from './hooks';
import { api } from './api';
import { useT } from './i18n';
import { countUnread, getLastSeen, setLastSeen, maxId } from './notify';
import { NotificationCenter } from './components/NotificationCenter';
import type { AppNotification } from './types';
import { DashboardPanel } from './panels/DashboardPanel';
import { ProductionPanel } from './panels/ProductionPanel';
import { FleetPanel } from './panels/FleetPanel';
import { MaintenancePanel } from './panels/MaintenancePanel';
import { InventoryPanel } from './panels/InventoryPanel';
import { QueuePanel } from './panels/QueuePanel';
import { AnalyticsPanel } from './panels/AnalyticsPanel';
import { HistoryPanel } from './panels/HistoryPanel';
import { SupplyPanel } from './panels/SupplyPanel';
import { PurchasingPanel } from './panels/PurchasingPanel';
import { SettingsPanel } from './panels/SettingsPanel';

type PanelId = 'dashboard' | 'production' | 'fleet' | 'maintenance' | 'inventory' | 'queue' | 'supply' | 'purchasing' | 'analytics' | 'history' | 'settings';

const NAV: { id: PanelId; label: string; icon: JSX.Element }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconGrid /> },
  { id: 'production', label: 'Production', icon: <IconLayers /> },
  { id: 'fleet', label: 'Fleet', icon: <IconPrinter /> },
  { id: 'maintenance', label: 'Maintenance', icon: <IconWrench /> },
  { id: 'inventory', label: 'Inventory', icon: <IconSpool /> },
  { id: 'queue', label: 'Queue', icon: <IconQueue /> },
  { id: 'supply', label: 'Supply', icon: <IconBox /> },
  { id: 'purchasing', label: 'Purchasing', icon: <IconCart /> },
  { id: 'analytics', label: 'Analytics', icon: <IconChart /> },
  { id: 'history', label: 'History', icon: <IconClock /> },
  { id: 'settings', label: 'Settings', icon: <IconGear /> },
];

export function App() {
  const t = useT();
  const [panel, setPanel] = useState<PanelId>('dashboard');
  const auth = useAuth();
  const authLabel = auth == null ? '' : auth.user ? auth.user : auth.enabled ? 'Signed in' : 'Local · no login';

  const { data: notifData } = useResource<AppNotification[]>(api.listNotifications, 15000);
  const notifications = notifData ?? [];
  const [notifOpen, setNotifOpen] = useState(false);
  const [seen, setSeen] = useState(getLastSeen());
  const unread = countUnread(notifications, seen);

  function openNotifications() {
    setNotifOpen(true);
    const top = maxId(notifications);
    setLastSeen(top);
    setSeen(top);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">3F</div>
          <div className="brand-text">
            <div className="brand-name">3DPrintForge</div>
            <div className="brand-sub">React PoC</div>
          </div>
          <button className="bell" onClick={openNotifications} title={t('v2.notify.title', 'Notifications')} aria-label={t('v2.notify.title', 'Notifications')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            {unread > 0 && <span className="bell-badge">{unread > 9 ? '9+' : unread}</span>}
          </button>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item${panel === n.id ? ' nav-item--active' : ''}`}
              onClick={() => setPanel(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          {authLabel && (
            <div className="auth-chip"><span className="auth-dot" />{authLabel}</div>
          )}
          <a className="classic-link" href="/">← Classic UI</a>
          <div className="muted" style={{ marginTop: 8 }}>Live JSON API · Vite + React + TS</div>
        </div>
      </aside>

      <main className="main">
        {panel === 'dashboard' && <DashboardPanel />}
        {panel === 'production' && <ProductionPanel />}
        {panel === 'fleet' && <FleetPanel />}
        {panel === 'maintenance' && <MaintenancePanel />}
        {panel === 'inventory' && <InventoryPanel />}
        {panel === 'queue' && <QueuePanel />}
        {panel === 'supply' && <SupplyPanel />}
        {panel === 'purchasing' && <PurchasingPanel />}
        {panel === 'analytics' && <AnalyticsPanel />}
        {panel === 'history' && <HistoryPanel />}
        {panel === 'settings' && <SettingsPanel />}
      </main>

      {notifOpen && <NotificationCenter notifications={notifications} onClose={() => setNotifOpen(false)} />}
    </div>
  );
}

function IconGrid() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
}
function IconLayers() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
}
function IconPrinter() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
}
function IconSpool() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IconQueue() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
}
function IconWrench() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
}
function IconBox() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
}
function IconCart() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>;
}
function IconChart() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function IconClock() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>;
}
function IconGear() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}
