import { Fragment, useCallback, useEffect, useState } from 'react';
import { useAuth, useResource } from './hooks';
import { parseHash, buildHash } from './router';
import { api } from './api';
import { useT } from './i18n';
import { useToast } from './toast';
import { countUnread, getLastSeen, setLastSeen, maxId } from './notify';
import { useNavBadges } from './nav-badges';
import { NotificationCenter } from './components/NotificationCenter';
import { CommandPalette, type CommandItem } from './components/CommandPalette';
import { initialTheme, applyTheme, type Theme } from './theme';
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

const NAV_LOOKUP: Record<string, NavItem> = Object.fromEntries(NAV_GROUPS.flatMap((g) => g.items).map((n) => [n.id, n]));
// Alt+1..9 quick-jump targets, in order.
const SHORTCUT_PANELS: PanelId[] = ['dashboard', 'fleet', 'guard', 'queue', 'inventory', 'purchasing', 'analytics', 'history', 'settings'];
// Web NFC (Chrome-on-Android) — used for the OpenSpool spool-scan action.
const NFC_SUPPORTED = typeof window !== 'undefined' && 'NDEFReader' in window;

// Panels with in-page sub-sections that expand as a tree in the sidebar.
type SubItem = { sub: string; label: string };
const SUBNAV: Partial<Record<PanelId, SubItem[]>> = {
  inventory: [
    { sub: 'overview', label: 'Overview' }, { sub: 'spools', label: 'Spools' }, { sub: 'profiles', label: 'Profiles' },
    { sub: 'locations', label: 'Locations' }, { sub: 'control', label: 'Control' }, { sub: 'activity', label: 'Activity' },
  ],
  purchasing: [{ sub: 'orders', label: 'Orders' }, { sub: 'suppliers', label: 'Suppliers' }, { sub: 'reorder', label: 'Reorder' }],
  crm: [{ sub: 'overview', label: 'Overview' }, { sub: 'customers', label: 'Customers' }, { sub: 'orders', label: 'Orders' }, { sub: 'invoices', label: 'Invoices' }],
  analytics: [{ sub: 'stats', label: 'Statistics' }, { sub: 'consumption', label: 'Consumption' }, { sub: 'costs', label: 'Costs' }, { sub: 'efficiency', label: 'Efficiency' }],
  costs: [{ sub: 'overview', label: 'Overview' }, { sub: 'prints', label: 'Prints' }],
  maintenance: [{ sub: 'components', label: 'Components' }, { sub: 'nozzles', label: 'Nozzles' }, { sub: 'costs', label: 'Costs' }, { sub: 'history', label: 'History' }],
  waste: [{ sub: 'overview', label: 'Overview' }, { sub: 'events', label: 'Events' }],
};
function loadExpandedSub(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('v2.nav.subopen') || '[]')); } catch { return new Set(); }
}

function loadCollapsed(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('v2.nav.collapsed') || '[]')); } catch { return new Set(); }
}
function loadRecent(): string[] {
  try { const r = JSON.parse(localStorage.getItem('v2.nav.recent') || '[]'); return Array.isArray(r) ? r.filter((x) => typeof x === 'string') : []; } catch { return []; }
}
function loadPinned(): string[] {
  try { const r = JSON.parse(localStorage.getItem('v2.nav.pinned') || '[]'); return Array.isArray(r) ? r.filter((x) => typeof x === 'string') : []; } catch { return []; }
}
function loadRail(): boolean {
  try { return localStorage.getItem('v2.nav.rail') === '1'; } catch { return false; }
}

export function App() {
  const t = useT();
  const toast = useToast();
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
  const [rail, setRail] = useState<boolean>(loadRail);
  const auth = useAuth();
  const { badges, health } = useNavBadges();

  function toggleGroup(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      try { localStorage.setItem('v2.nav.collapsed', JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }
  function toggleRail() {
    setRail((prev) => { const next = !prev; try { localStorage.setItem('v2.nav.rail', next ? '1' : '0'); } catch { /* ignore */ } return next; });
  }

  const [cmdOpen, setCmdOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  // Ctrl/Cmd+K toggles the command palette anywhere in the app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setCmdOpen((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  // Close the mobile drawer whenever the route changes.
  useEffect(() => { setDrawer(false); }, [route.panel]);
  // Track recently visited panels (most-recent first) for the palette.
  const [recent, setRecent] = useState<string[]>(loadRecent);
  useEffect(() => {
    setRecent((prev) => {
      const next = [route.panel, ...prev.filter((p) => p !== route.panel)].filter((p) => NAV_LOOKUP[p]).slice(0, 6);
      try { localStorage.setItem('v2.nav.recent', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [route.panel]);

  // Expandable sub-navigation (tree) for panels with in-page sub-sections.
  const [expandedSub, setExpandedSub] = useState<Set<string>>(loadExpandedSub);
  useEffect(() => {
    if (!SUBNAV[route.panel as PanelId]) return;
    setExpandedSub((prev) => (prev.has(route.panel) ? prev : new Set(prev).add(route.panel)));
  }, [route.panel]);
  function toggleSub(id: string) {
    setExpandedSub((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem('v2.nav.subopen', JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }

  // Pinned panels (user favourites) shown in a group at the top of the sidebar.
  const [pinned, setPinned] = useState<string[]>(loadPinned);
  function togglePin(id: string) {
    setPinned((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem('v2.nav.pinned', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }
  // Alt+1..9 jump to the shortcut panels.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key >= '1' && e.key <= '9') {
        const id = SHORTCUT_PANELS[Number(e.key) - 1];
        if (id) { e.preventDefault(); setPanel(id); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const cmdItems: CommandItem[] = NAV_GROUPS.flatMap((g) => g.items.map((n) => {
    const si = SHORTCUT_PANELS.indexOf(n.id);
    return { id: n.id, label: n.label, group: g.label, icon: n.icon, hint: si >= 0 ? `Alt+${si + 1}` : undefined };
  }));
  function go(id: string) {
    if (id.startsWith('#')) { window.location.hash = id; return; }
    setPanel(id as PanelId);
  }

  const [theme, setTheme] = useState<Theme>(initialTheme);
  function toggleTheme() { setTheme((prev) => { const next: Theme = prev === 'dark' ? 'light' : 'dark'; applyTheme(next); return next; }); }

  // Scan an OpenSpool NFC tag (Web NFC) → match it to a spool → open it.
  async function scanNfc() {
    if (!NFC_SUPPORTED) return;
    try {
      const Reader = (window as unknown as { NDEFReader: new () => { scan: () => Promise<void>; onreading: ((e: { message: { records: { data?: BufferSource }[] } }) => void) | null } }).NDEFReader;
      const ndef = new Reader();
      await ndef.scan();
      toast(t('v2.openspool.scan_wait', 'Hold a spool tag to the phone…'), 'success');
      ndef.onreading = async (e) => {
        for (const rec of e.message.records) {
          if (!rec.data) continue;
          try {
            const json = new TextDecoder().decode(rec.data);
            const res = await api.matchOpenspool(JSON.parse(json));
            if (res.matched_id) { window.location.hash = `#/inventory/spools/${res.matched_id}`; toast(t('v2.openspool.scan_matched', 'Matched a spool'), 'success'); }
            else { window.location.hash = '#/inventory/spools'; toast(t('v2.openspool.scan_nomatch', 'Tag read — no matching spool'), 'error'); }
          } catch { toast(t('v2.openspool.scan_bad', 'Not an OpenSpool tag'), 'error'); }
          break;
        }
      };
    } catch (e) { toast((e as Error).message, 'error'); }
  }

  // Global data search: spools, print history and customers → deep-link results.
  const searchData = useCallback(async (query: string): Promise<CommandItem[]> => {
    const ql = query.toLowerCase();
    const [spools, history, customers] = await Promise.all([
      api.listSpools().catch(() => []),
      api.listHistory().catch(() => []),
      api.listCustomers().catch(() => []),
    ]);
    const out: CommandItem[] = [];
    for (const s of spools) {
      const name = [s.vendor_name, s.profile_name || s.material, s.color_name].filter(Boolean).join(' ').trim();
      if (name.toLowerCase().includes(ql)) out.push({ id: `#/inventory/spools/${s.id}`, label: name || `Spool #${s.id}`, group: 'Filament', icon: <IconSpool /> });
      if (out.length >= 8) break;
    }
    let hn = 0;
    for (const h of history) {
      const name = (h.filename || '').replace(/\.(gcode|3mf)(\.\w+)?$/i, '').trim();
      if (name.toLowerCase().includes(ql)) { out.push({ id: `#/history/${h.id}`, label: name || `Print #${h.id}`, group: 'History', icon: <IconClock /> }); if (++hn >= 8) break; }
    }
    let cn = 0;
    for (const c of customers) {
      const hay = [c.name, c.company, c.email].filter(Boolean).join(' ').toLowerCase();
      if (hay.includes(ql)) { out.push({ id: `#/crm/customers/${c.id}`, label: c.name || c.email || `Customer #${c.id}`, group: 'Customers', icon: <IconUsers /> }); if (++cn >= 8) break; }
    }
    return out;
  }, []);
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

  // Pinned favourites render as a group above the standard nav groups.
  const pinnedItems = pinned.map((id) => NAV_LOOKUP[id]).filter(Boolean);
  const navGroups = pinnedItems.length ? [{ label: 'Pinned', items: pinnedItems }, ...NAV_GROUPS] : NAV_GROUPS;

  // Palette empty-state: recently visited panels + app quick actions.
  const recentItems: CommandItem[] = recent
    .filter((id) => id !== panel && NAV_LOOKUP[id])
    .slice(0, 5)
    .map((id) => ({ id, label: NAV_LOOKUP[id].label, group: 'Recent', icon: NAV_LOOKUP[id].icon }));
  const actionItems: CommandItem[] = [
    { id: 'act:theme', label: theme === 'dark' ? t('v2.cmd.a_light', 'Switch to light theme') : t('v2.cmd.a_dark', 'Switch to dark theme'), group: 'Actions', run: toggleTheme },
    { id: 'act:rail', label: rail ? t('v2.cmd.a_expand', 'Expand sidebar') : t('v2.cmd.a_collapse', 'Collapse sidebar'), group: 'Actions', run: toggleRail },
    { id: 'act:notify', label: t('v2.cmd.a_notify', 'Open notifications'), group: 'Actions', run: openNotifications, hint: unread > 0 ? String(unread) : undefined },
    { id: 'act:classic', label: t('v2.cmd.a_classic', 'Open Classic UI'), group: 'Actions', run: () => { window.location.href = '/'; } },
    ...(NFC_SUPPORTED ? [{ id: 'act:scan', label: t('v2.cmd.a_scan', 'Scan spool tag (NFC)'), group: 'Actions', run: scanNfc }] : []),
  ];

  return (
    <div className={`app-shell${rail ? ' app-shell--rail' : ''}${drawer ? ' app-shell--drawer' : ''}`}>
      <button className="drawer-toggle" onClick={() => setDrawer(true)} aria-label={t('v2.nav.menu', 'Open menu')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      <div className="nav-drawer-backdrop" onClick={() => setDrawer(false)} />
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
          <button className="rail-toggle" onClick={toggleRail} title={rail ? t('v2.nav.expand', 'Expand menu') : t('v2.nav.collapse', 'Collapse menu')} aria-label={rail ? t('v2.nav.expand', 'Expand menu') : t('v2.nav.collapse', 'Collapse menu')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points={rail ? '9 6 15 12 9 18' : '15 6 9 12 15 18'} /></svg>
          </button>
        </div>
        <button className="nav-search" onClick={() => setCmdOpen(true)} title={t('v2.cmd.open', 'Search / jump to…')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <span className="nav-search-label">{t('v2.cmd.search', 'Search')}</span>
          <kbd className="nav-search-kbd">⌘K</kbd>
        </button>
        <nav className="nav">
          {navGroups.map((g, gi) => {
            const isCollapsed = g.label ? collapsed.has(g.label) : false;
            const hasActive = g.items.some((n) => n.id === panel);
            // In rail mode groups always show their icons (labels/headers hide via CSS).
            const showItems = rail || !isCollapsed;
            return (
              <div className="nav-group" key={g.label ?? `g${gi}`}>
                {g.label && (
                  <button className="nav-section" onClick={() => toggleGroup(g.label!)} aria-expanded={!isCollapsed}>
                    <svg className={`nav-chevron${isCollapsed ? '' : ' nav-chevron--open'}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                    <span>{g.label}</span>
                    {isCollapsed && hasActive && <span className="nav-section-dot" />}
                  </button>
                )}
                {showItems && g.items.map((n) => {
                  const b = badges[n.id];
                  const isPinned = pinned.includes(n.id);
                  const subs = SUBNAV[n.id as PanelId];
                  const subOpen = !!subs && expandedSub.has(n.id);
                  const activeSub = panel === n.id ? (route.sub || subs?.[0]?.sub) : null;
                  return (
                    <Fragment key={n.id}>
                      <button
                        className={`nav-item${panel === n.id ? ' nav-item--active' : ''}`}
                        onClick={() => setPanel(n.id)}
                        title={rail ? n.label : undefined}
                      >
                        <span className="nav-icon">{n.icon}</span>
                        <span className="nav-label">{n.label}</span>
                        {b && <span className={`nav-badge nav-badge--${b.tone}`}>{b.count > 99 ? '99+' : b.count}</span>}
                        {subs && (
                          <span
                            className={`nav-caret${subOpen ? ' nav-caret--open' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleSub(n.id); }}
                            role="button"
                            aria-label={t('v2.nav.toggle_sub', 'Toggle sub-menu')}
                            aria-expanded={subOpen}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                          </span>
                        )}
                        <span
                          className={`nav-pin${isPinned ? ' nav-pin--on' : ''}`}
                          onClick={(e) => { e.stopPropagation(); togglePin(n.id); }}
                          title={isPinned ? t('v2.nav.unpin', 'Unpin') : t('v2.nav.pin', 'Pin')}
                          role="button"
                          aria-label={isPinned ? t('v2.nav.unpin', 'Unpin') : t('v2.nav.pin', 'Pin')}
                        >★</span>
                      </button>
                      {subs && subOpen && (
                        <div className="nav-sub">
                          {subs.map((s) => (
                            <button
                              key={s.sub}
                              className={`nav-subitem${activeSub === s.sub ? ' nav-subitem--active' : ''}`}
                              onClick={() => { window.location.hash = buildHash(n.id, s.sub); }}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          {health.total > 0 && (() => {
            const bad = !health.connected || health.offline > 0;
            const txt = !health.connected
              ? t('v2.health.offline', 'Live feed offline')
              : `${health.online}/${health.total} ${t('v2.health.online', 'online')}${health.printing > 0 ? ` · ${health.printing} ${t('v2.health.printing', 'printing')}` : ''}${health.offline > 0 ? ` · ${health.offline} ${t('v2.health.down', 'down')}` : ''}`;
            return (
              <button
                className={`fleet-health fleet-health--${bad ? 'bad' : 'ok'}`}
                onClick={() => setPanel('fleet')}
                title={txt}
              >
                <span className={`fh-dot${health.connected ? ' fh-dot--live' : ''}`} />
                <span className="nav-label">{txt}</span>
              </button>
            );
          })()}
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? t('v2.theme.light', 'Light theme') : t('v2.theme.dark', 'Dark theme')} aria-label={theme === 'dark' ? t('v2.theme.light', 'Light theme') : t('v2.theme.dark', 'Dark theme')}>
            {theme === 'dark'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>}
            <span className="nav-label">{theme === 'dark' ? t('v2.theme.light', 'Light theme') : t('v2.theme.dark', 'Dark theme')}</span>
          </button>
          {authLabel && (
            <div className="auth-chip"><span className="auth-dot" />{authLabel}</div>
          )}
          <a className="classic-link" href="/" title={t('v2.nav.classic', 'Classic UI')}>← <span className="nav-label">{t('v2.nav.classic', 'Classic UI')}</span></a>
          <div className="muted foot-meta" style={{ marginTop: 8 }}>Live JSON API · Vite + React + TS</div>
        </div>
      </aside>

      <main className="main">
        {panel === 'dashboard' && <DashboardPanel onNavigate={(id) => setPanel(id as PanelId)} />}
        {panel === 'production' && <ProductionPanel />}
        {panel === 'fleet' && <FleetPanel />}
        {panel === 'maintenance' && <MaintenancePanel sub={route.sub} onNav={(s) => { window.location.hash = buildHash('maintenance', s); }} />}
        {panel === 'guard' && <PrintGuardPanel />}
        {panel === 'inventory' && <InventoryPanel sub={route.sub} detail={route.detail} onNav={navigateInv} />}
        {panel === 'queue' && <QueuePanel />}
        {panel === 'scheduler' && <SchedulerPanel />}
        {panel === 'supply' && <SupplyPanel />}
        {panel === 'purchasing' && <PurchasingPanel sub={route.sub} detail={route.detail} onNav={navigatePur} />}
        {panel === 'analytics' && <AnalyticsPanel sub={route.sub} onNav={(s) => { window.location.hash = buildHash('analytics', s); }} />}
        {panel === 'costs' && <CostsPanel sub={route.sub} onNav={(s) => { window.location.hash = buildHash('costs', s); }} />}
        {panel === 'waste' && <WastePanel sub={route.sub} onNav={(s) => { window.location.hash = buildHash('waste', s); }} />}
        {panel === 'activity' && <ActivityPanel />}
        {panel === 'errors' && <ErrorsPanel />}
        {panel === 'achievements' && <AchievementsPanel />}
        {panel === 'hardware' && <HardwarePanel />}
        {panel === 'library' && <LibraryPanel selected={route.sub} onSelect={(id) => { window.location.hash = buildHash('library', id); }} onBack={() => { window.location.hash = buildHash('library'); }} />}
        {panel === 'knowledge' && <KnowledgePanel selected={route.sub} onSelect={(id) => { window.location.hash = buildHash('knowledge', id); }} onBack={() => { window.location.hash = buildHash('knowledge'); }} />}
        {panel === 'crm' && <CrmPanel sub={route.sub} detail={route.detail} onNav={(s, d) => { window.location.hash = buildHash('crm', s, d); }} />}
        {panel === 'history' && <HistoryPanel selected={route.sub} onSelect={(id) => { window.location.hash = buildHash('history', id); }} onBack={() => { window.location.hash = buildHash('history'); }} />}
        {panel === 'settings' && <SettingsPanel />}
      </main>

      {notifOpen && <NotificationCenter notifications={notifications} onClose={() => setNotifOpen(false)} />}
      <CommandPalette open={cmdOpen} items={cmdItems} onSelect={go} onClose={() => setCmdOpen(false)} search={searchData} recent={recentItems} actions={actionItems} />
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
