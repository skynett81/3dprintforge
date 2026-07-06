import { api } from '../api';
import { useResource } from '../hooks';
import { BarChart } from '../components/BarChart';
import type { Stats } from '../types';

export function AnalyticsPanel() {
  const { data, error, loading } = useResource<Stats>(api.getStatistics, 15000);

  if (error) return <div className="error">{error}</div>;
  if (loading && !data) return <p className="muted">Loading…</p>;
  if (!data) return null;

  const months = data.monthly_trends.map((m) => ({
    label: m.month.slice(5), // MM
    value: m.total,
    hint: `${m.month}: ${m.total} prints, ${Math.round(m.total_filament_g)} g`,
  }));
  const maxFil = Math.max(1, ...data.filament_by_type.map((f) => f.grams));

  return (
    <div>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Analytics</h2>
          <p className="muted sub">Print statistics across the fleet</p>
        </div>
      </div>

      <div className="kpis kpis--5">
        <Kpi label="Total prints" value={String(data.total_prints)} />
        <Kpi label="Success rate" value={`${data.success_rate}%`} accent={data.success_rate >= 90 ? 'green' : 'teal'} />
        <Kpi label="Print hours" value={data.total_hours.toFixed(0)} />
        <Kpi label="Filament" value={`${(data.total_filament_g / 1000).toFixed(1)} kg`} />
        <Kpi label="Est. cost" value={`${Math.round(data.estimated_cost_nok || 0)} kr`} accent="teal" />
      </div>

      <section className="card">
        <div className="card-title">Prints per month</div>
        <BarChart data={months} />
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-title">Filament by type</div>
          <div className="breakdown">
            {data.filament_by_type.map((f) => (
              <div className="bd-row" key={f.type}>
                <span className="bd-label">{f.type}</span>
                <span className="bd-track"><span className="bd-fill" style={{ width: `${(f.grams / maxFil) * 100}%` }} /></span>
                <span className="bd-val">{Math.round(f.grams)} g</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-title">Top files</div>
          <div className="toplist">
            {data.top_files.slice(0, 6).map((t, i) => (
              <div className="top-row" key={i}>
                <span className="top-rank">{i + 1}</span>
                <span className="top-name" title={t.filename}>{t.filename}</span>
                <span className="top-count muted">{t.count}×</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: 'teal' | 'blue' | 'green' }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ` kpi-value--${accent}` : ''}`}>{value}{sub && <span className="kpi-sub"> {sub}</span>}</div>
    </div>
  );
}
