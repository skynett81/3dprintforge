import { useState } from 'react';
import { DashboardPanel } from './panels/DashboardPanel';
import { ProductionPanel } from './panels/ProductionPanel';
import { FleetPanel } from './panels/FleetPanel';
import { InventoryPanel } from './panels/InventoryPanel';
import { QueuePanel } from './panels/QueuePanel';

type PanelId = 'dashboard' | 'production' | 'fleet' | 'inventory' | 'queue';

const NAV: { id: PanelId; label: string; icon: JSX.Element }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconGrid /> },
  { id: 'production', label: 'Production', icon: <IconLayers /> },
  { id: 'fleet', label: 'Fleet', icon: <IconPrinter /> },
  { id: 'inventory', label: 'Inventory', icon: <IconSpool /> },
  { id: 'queue', label: 'Queue', icon: <IconQueue /> },
];

export function App() {
  const [panel, setPanel] = useState<PanelId>('dashboard');

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">3F</div>
          <div className="brand-text">
            <div className="brand-name">3DPrintForge</div>
            <div className="brand-sub">React PoC</div>
          </div>
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
        <div className="sidebar-foot muted">
          Live JSON API · Vite + React + TS
        </div>
      </aside>

      <main className="main">
        {panel === 'dashboard' && <DashboardPanel />}
        {panel === 'production' && <ProductionPanel />}
        {panel === 'fleet' && <FleetPanel />}
        {panel === 'inventory' && <InventoryPanel />}
        {panel === 'queue' && <QueuePanel />}
      </main>
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
