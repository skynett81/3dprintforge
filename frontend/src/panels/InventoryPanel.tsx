import { useState } from 'react';
import { useT } from '../i18n';
import { OverviewTab } from './inventory/OverviewTab';
import { SpoolsTab } from './inventory/SpoolsTab';
import { ProfilesTab } from './inventory/ProfilesTab';
import { LocationsTab } from './inventory/LocationsTab';
import { ControlTab } from './inventory/ControlTab';
import { StockActivityTab } from './inventory/ActivityTab';

type Tab = 'overview' | 'spools' | 'profiles' | 'locations' | 'control' | 'activity';

export function InventoryPanel() {
  const t = useT();
  const [tab, setTab] = useState<Tab>('overview');
  const [focusId, setFocusId] = useState<number | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('v2.inv.tab_overview', 'Overview') },
    { id: 'spools', label: t('v2.inv.tab_spools', 'Spools') },
    { id: 'profiles', label: t('v2.inv.tab_profiles', 'Profiles') },
    { id: 'locations', label: t('v2.inv.tab_locations', 'Locations') },
    { id: 'control', label: t('v2.inv.tab_control', 'Control') },
    { id: 'activity', label: t('v2.inv.tab_activity', 'Activity') },
  ];

  function pickSpool(id: number) { setFocusId(id); setTab('spools'); }

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{t('v2.inventory.title', 'Inventory')}</h2>
          <p className="muted sub">{t('v2.inv.subtitle', 'Spools, filament catalog, locations and stock movements')}</p>
        </div>
        <div className="seg">
          {tabs.map((tb) => (
            <button key={tb.id} className={`seg-btn${tab === tb.id ? ' seg-btn--on' : ''}`} onClick={() => setTab(tb.id)}>{tb.label}</button>
          ))}
        </div>
      </div>

      {tab === 'overview' && <OverviewTab onPickSpool={pickSpool} />}
      {tab === 'spools' && <SpoolsTab focusId={focusId} onFocusConsumed={() => setFocusId(null)} />}
      {tab === 'profiles' && <ProfilesTab />}
      {tab === 'locations' && <LocationsTab />}
      {tab === 'control' && <ControlTab />}
      {tab === 'activity' && <StockActivityTab />}
    </div>
  );
}
