import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import type { StorageLocation } from '../../types';

export function LocationsTab() {
  const t = useT();
  const { data } = useResource<StorageLocation[]>(api.listLocations, 0);
  const locations = data ?? [];

  return (
    <div>
      {locations.length === 0 ? (
        <section className="card"><p className="muted empty-note">{t('v2.inv.no_locations', 'No storage locations yet.')}</p></section>
      ) : (
        <div className="tile-grid">
          {locations.map((l) => (
            <div className="tile" key={l.id}>
              <div className="tile-top">
                <span className="tile-tag">{t('v2.inv.location', 'Location')}</span>
              </div>
              <div className="tile-name">{l.name}</div>
              {l.description && <div className="tile-meta">{l.description}</div>}
              <div className="tile-foot muted">
                {l.max_spools ? `${t('v2.inv.capacity', 'Capacity')}: ${l.max_spools} ${t('v2.inv.spools', 'spools')}` : ''}
                {l.min_weight_kg ? ` · ${t('v2.inv.min', 'min')} ${l.min_weight_kg} kg` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
