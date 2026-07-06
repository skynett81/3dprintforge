export interface Bar {
  label: string;
  value: number;
  hint?: string;
}

// A tiny dependency-free column chart. Bars scale to the max value; an
// optional value label sits above each column.
export function BarChart({ data, unit = '' }: { data: Bar[]; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (data.length === 0) return <p className="muted">No data yet.</p>;
  return (
    <div className="chart">
      {data.map((d, i) => (
        <div className="chart-col" key={i} title={d.hint || `${d.label}: ${d.value}${unit}`}>
          <div className="chart-val">{d.value}{unit}</div>
          <div className="chart-track">
            <div className="chart-bar" style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
          <div className="chart-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
