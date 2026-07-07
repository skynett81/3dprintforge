import { useEffect, useState } from 'react';
import { useAuth, useResource } from './hooks';
import { parseHash, buildHash } from './router';
import { api } from './api';
import { useT } from './i18n';
import { countUnread, getLastSeen, setLastSeen, maxId } from './notify';
import { NotificationCenter } from './components/NotificationCenter';
import type { AppNotification } from './types';
import { DashboardPanel } from './panels/DashboardPanel';
import { ProductionPanel } from './panels/ProductionPanel';
import { FleetPanel } from './panels/FleetPanel';
import { MaintenancePanel } from './panels/MaintenancePanel';
import { PrintGuardPanel } from './panels/PrintGuardPanel';
import { InventoryPanel } from './panels/InventoryPanel';
import { QueuePanel } from './panels/QueuePanel';
import { SchedulerPanel } from './panels/SchedulerPanel';
import { AnalyticsPanel } from './panels/AnalyticsPanel';
import { CostsPanel } from './panels/CostsPanel';
import { WastePanel } from './panels/WastePanel';
import { ActivityPanel } from './panels/ActivityPanel';
import { ErrorsPanel } from './panels/ErrorsPanel';
import { AchievementsPanel } from './panels/AchievementsPanel';
import { HardwarePanel } from './panels/HardwarePanel';
import { LibraryPanel } from './panels/LibraryPanel';
import { KnowledgePanel } from './panels/KnowledgePanel';
import { HistoryPanel } from './panels/HistoryPanel';
import { CrmPanel } from './panels/CrmPanel';
import { SupplyPanel } from './panels/SupplyPanel';
import { PurchasingPanel } from './panels/PurchasingPanel';
import { SettingsPanel } from './panels/SettingsPanel';

type PanelId = 'dashboard' | 'production' | 'fleet' | 'maintenance' | 'guard' | 'inventory' | 'queue' | 'scheduler' | 'supply' | 'purchasing' | 'analytics' | 'costs' | 'waste' | 'activity' | 'errors' | 'achievements' | 'hardware' | 'library' | 'knowledge' | 'history' | 'crm' | 'settings';

type NavItem = { id: PanelId; label: string; icon: JSX.Element };
const NAV_GROUPS: { label?: string; items: NavItem[] }[] = [
  { items: [{ id: 'dashboard', label: 'Dashboard', icon: <IconGrid /> }] },
  {
    label: 'Operate',
    items: [
      { id: 'fleet', label: 'Fleet', icon: <IconPrinter /> },
      { id: 'guard', label: 'Print Guard', icon: <IconShield /> },
      { id: 'queue', label: 'Queue', icon: <IconQueue /> },
      { id: 'scheduler', label: 'Scheduler', icon: <IconCalendar /> },
      { id: 'maintenance', label: 'Maintenance', icon: <IconWrench /> },
      { id: 'errors', label: 'Errors', icon: <IconAlert /> },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { id: 'inventory', label: 'Filament', icon: <IconSpool /> },
      { id: 'supply', label: 'Supply', icon: <IconBox /> },
      { id: 'purchasing', label: 'Purchasing', icon: <IconCart /> },
      { id: 'hardware', label: 'Hardware', icon: <IconChip /> },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'production', label: 'Production', icon: <IconLayers /> },
      { id: 'crm', label: 'Customers', icon: <IconUsers /> },
      { id: 'costs', label: 'Costs', icon: <IconCoins /> },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: <IconChart /> },
      { id: 'waste', label: 'Waste', icon: <IconTrash /> },
      { id: 'activity', label: 'Activity', icon: <IconActivity /> },
      { id: 'history', label: 'History', icon: <IconClock /> },
      { id: 'achievements', label: 'Achievements', icon: <IconTrophy /> },
    ],
  },
  {
    label: 'Reference',
    items: [
      { id: 'library', label: 'Library', icon: <IconFiles /> },
      { id: 'knowledge', label: 'Knowledge', icon: <IconBook /> },
    ],
  },
  { label: 'System', items: [{ id: 'settings', label: 'Settings', icon: <IconGear /> }] },
];

function loadCollapsed(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('v2.nav.collapsed') || '[]')); } catch { return new Set(); }
}

export function App() {
  const t = useT();
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const validPanels = new Set<string>(NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id)));
  const panel: PanelId = (validPanels.has(route.panel) ? route.panel : 'dashboard') as PanelId;
  const setPanel = (id: PanelId) => { window.location.hash = buildHash(id); };
  const navigateInv = (sub: string, detail?: string | null) => { window.location.hash = buildHash('inventory', sub, detail); };
  const navigatePur = (sub: string, detail?: string | null) => { window.location.hash = buildHash('purchasing', sub, detail); };
  const [collapsed, setCollapsed] = useState<Set<string>>(loadCollapsed);
  const auth = useAuth();

  function toggleGroup(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      try { localStorage.setItem('v2.nav.collapsed', JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }
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
          {NAV_GROUPS.map((g, gi) => {
            const isCollapsed = g.label ? collapsed.has(g.label) : false;
            const hasActive = g.items.some((n) => n.id === panel);
            return (
              <div className="nav-group" key={gi}>
                {g.label && (
                  <button className="nav-section" onClick={() => toggleGroup(g.label!)} aria-expanded={!isCollapsed}>
                    <svg className={`nav-chevron${isCollapsed ? '' : ' nav-chevron--open'}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                    <span>{g.label}</span>
                    {isCollapsed && hasActive && <span className="nav-section-dot" />}
                  </button>
                )}
                {!isCollapsed && g.items.map((n) => (
                  <button
                    key={n.id}
                    className={`nav-item${panel === n.id ? ' nav-item--active' : ''}`}
                    onClick={() => setPanel(n.id)}
                  >
                    <span className="nav-icon">{n.icon}</span>
                    {n.label}
                  </button>
                ))}
              </div>
            );
          })}
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
        {panel === 'dashboard' && <DashboardPanel onNavigate={(id) => setPanel(id as PanelId)} />}
        {panel === 'production' && <ProductionPanel />}
        {panel === 'fleet' && <FleetPanel />}
        {panel === 'maintenance' && <MaintenancePanel />}
        {panel === 'guard' && <PrintGuardPanel />}
        {panel === 'inventory' && <InventoryPanel sub={route.sub} detail={route.detail} onNav={navigateInv} />}
        {panel === 'queue' && <QueuePanel />}
        {panel === 'scheduler' && <SchedulerPanel />}
        {panel === 'supply' && <SupplyPanel />}
        {panel === 'purchasing' && <PurchasingPanel supplierDetail={route.sub === 'suppliers' ? route.detail : null} onOpenSupplier={(id) => navigatePur('suppliers', id)} onBackSuppliers={() => navigatePur('')} />}
        {panel === 'analytics' && <AnalyticsPanel />}
        {panel === 'costs' && <CostsPanel />}
        {panel === 'waste' && <WastePanel />}
        {panel === 'activity' && <ActivityPanel />}
        {panel === 'errors' && <ErrorsPanel />}
        {panel === 'achievements' && <AchievementsPanel />}
        {panel === 'hardware' && <HardwarePanel />}
        {panel === 'library' && <LibraryPanel />}
        {panel === 'knowledge' && <KnowledgePanel />}
        {panel === 'crm' && <CrmPanel />}
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
function IconChip() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>;
}
function IconFiles() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>;
}
function IconBook() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
}
function IconShield() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function IconAlert() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
function IconActivity() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
}
function IconTrophy() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>;
}
function IconWrench() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
}
function IconCalendar() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
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
function IconTrash() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function IconCoins() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="M16.71 13.88l.7.71-2.82 2.82" /></svg>;
}
function IconClock() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>;
}
function IconUsers() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function IconGear() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}
