import { useState } from 'react';
import { useT } from '../i18n';
import { SpoolsTab } from './inventory/SpoolsTab';
import { ProfilesTab } from './inventory/ProfilesTab';
import { LocationsTab } from './inventory/LocationsTab';
import { StockActivityTab } from './inventory/ActivityTab';

type Tab = 'spools' | 'profiles' | 'locations' | 'activity';

export function InventoryPanel() {
  const t = useT();
  const [tab, setTab] = useState<Tab>('spools');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'spools', label: t('v2.inv.tab_spools', 'Spools') },
    { id: 'profiles', label: t('v2.inv.tab_profiles', 'Profiles') },
    { id: 'locations', label: t('v2.inv.tab_locations', 'Locations') },
    { id: 'activity', label: t('v2.inv.tab_activity', 'Activity') },
  ];

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

      {tab === 'spools' && <SpoolsTab />}
      {tab === 'profiles' && <ProfilesTab />}
      {tab === 'locations' && <LocationsTab />}
      {tab === 'activity' && <StockActivityTab />}
    </div>
  );
}
