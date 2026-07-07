// A top-down filament spool. The wound filament is drawn as a ring whose
// thickness grows with the remaining amount (full spool ≈ filled to the rim,
// nearly-empty ≈ a thin ring around the bare core). Colour = the filament.
export function SpoolGraphic({ colorHex, pct, size = 96 }: { colorHex?: string | null; pct: number; size?: number }) {
  const color = colorHex ? `#${String(colorHex).replace(/^#/, '')}` : '#00b3a4';
  const p = Math.max(0, Math.min(100, pct)) / 100;
  const cx = 50, cy = 50;
  const rimR = 46;   // outer flange
  const hubR = 14;   // bare core
  const maxFilR = 43;
  const filOuterR = hubR + (maxFilR - hubR) * p;
  const ringR = (hubR + filOuterR) / 2;
  const ringW = Math.max(0, filOuterR - hubR);
  const low = pct < 15;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${Math.round(pct)}% remaining`}>
      {/* flange / spool side */}
      <circle cx={cx} cy={cy} r={rimR} fill="#161a21" stroke="#2b3440" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={rimR - 3} fill="none" stroke="#0e1116" strokeWidth={1} />
      {/* wound filament */}
      {ringW > 0.5 && (
        <>
          <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={color} strokeWidth={ringW} />
          {/* winding texture */}
          <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={ringW} strokeDasharray="1.5 3.5" />
        </>
      )}
      {/* core hub + centre hole */}
      <circle cx={cx} cy={cy} r={hubR} fill="#1b212b" stroke="#33404f" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={5} fill="#0e1116" />
      {/* centre label */}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill={low ? '#ef4444' : '#e6edf3'}>{Math.round(pct)}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="5.5" fill="#8a97a6">%</text>
    </svg>
  );
}
