import { useT } from '../../i18n';
import type { KbPrinter } from '../../types';

function parseArr(v?: string | null): string[] {
  if (!v) return [];
  const raw = v.trim();
  if (raw.startsWith('[')) { try { const p = JSON.parse(raw); return Array.isArray(p) ? p.map(String) : []; } catch { return []; } }
  return raw ? [raw] : [];
}

export function KbPrinterDetail({ printer, onBack }: { printer: KbPrinter; onBack?: () => void }) {
  const t = useT();
  const p = printer;
  const pros = parseArr(p.pros);
  const cons = parseArr(p.cons);
  const filaments = parseArr(p.supported_filaments);
  const conn = parseArr(p.connectivity);
  const sizes = parseArr(p.supported_nozzle_sizes);

  const specs: [string, string][] = [
    [t('v2.kb.volume', 'Build volume'), p.build_volume || '—'],
    [t('v2.kb.speed', 'Max speed'), p.max_speed ? `${p.max_speed} mm/s` : '—'],
    [t('v2.kb.nozzle_temp', 'Max nozzle'), p.nozzle_temp_max ? `${p.nozzle_temp_max}°C` : '—'],
    [t('v2.kb.bed_temp', 'Max bed'), p.heated_bed_max ? `${p.heated_bed_max}°C` : '—'],
    [t('v2.kb.weight', 'Weight'), p.weight_kg ? `${p.weight_kg} kg` : '—'],
    [t('v2.kb.nozzle', 'Nozzle'), [p.nozzle_type, sizes.length ? sizes.join('/') + ' mm' : ''].filter(Boolean).join(' · ') || '—'],
  ];
  const flags = [
    p.has_ams ? 'AMS' : null, p.has_enclosure ? t('v2.kb.enclosed', 'enclosed') : null,
    p.has_camera ? t('v2.kb.camera', 'camera') : null, p.has_lidar ? 'lidar' : null,
  ].filter(Boolean) as string[];

  return (
    <div>
      <div className="panel-head">
        <div>
          <button className="btn btn--sm" onClick={onBack}>← {t('v2.kb.title', 'Knowledge base')}</button>
          <h2 className="panel-title" style={{ marginTop: 10 }}>{p.full_name || p.model}</h2>
          <p className="muted sub">{[p.release_year, p.price_usd != null ? `$${p.price_usd}` : null].filter(Boolean).join(' · ')}</p>
        </div>
        {p.wiki_url && <a className="btn btn--sm" href={p.wiki_url} target="_blank" rel="noreferrer">{t('v2.kb.wiki', 'Wiki →')}</a>}
      </div>

      <section className="card">
        <div className="diag-grid">
          {specs.map(([k, v]) => (
            <div className="diag-row" key={k}><span className="muted">{k}</span><span className="diag-val">{v}</span></div>
          ))}
        </div>
        {(flags.length > 0 || conn.length > 0) && (
          <div className="kb-tags" style={{ marginTop: 12 }}>
            {flags.map((f) => <span className="flag" key={f}>{f}</span>)}
            {conn.map((c) => <span className="flag" key={c}>{c}</span>)}
          </div>
        )}
      </section>

      {filaments.length > 0 && (
        <section className="card">
          <div className="card-title">{t('v2.kb.filaments', 'Supported filaments')}</div>
          <div className="kb-tags">{filaments.map((f) => <span className="flag" key={f}>{f}</span>)}</div>
        </section>
      )}

      {(pros.length > 0 || cons.length > 0) && (
        <div className="two-col">
          {pros.length > 0 && (
            <section className="card">
              <div className="card-title">{t('v2.kb.pros', 'Pros')}</div>
              <ul className="kb-bullets kb-bullets--pro">{pros.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </section>
          )}
          {cons.length > 0 && (
            <section className="card">
              <div className="card-title">{t('v2.kb.cons', 'Cons')}</div>
              <ul className="kb-bullets kb-bullets--con">{cons.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </section>
          )}
        </div>
      )}

      {p.tips && (
        <section className="card">
          <div className="card-title">{t('v2.kb.tips', 'Tips')}</div>
          <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>{p.tips}</p>
        </section>
      )}
    </div>
  );
}
