"use client";

/**
 * Minimal dependency-free charts (SVG + divs). Enough for the admin
 * dashboard; reach for a chart lib only if these stop covering the need.
 */

const CYAN = "#0891b2";
const MAGENTA = "#c026a9";

export function BarList({ data, color = CYAN }: { data: { name: string; count: number }[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  if (data.length === 0) return <p className="text-sm text-on-surface-variant/50">No data</p>;
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs font-semibold text-on-surface-variant" title={d.name}>
            {d.name}
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-black/[0.04] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs font-bold text-on-surface tabular-nums">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="12" />
        {total > 0 &&
          segments.map((seg) => {
            const len = (seg.value / total) * C;
            const dash = <circle
              key={seg.label}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />;
            offset += len;
            return dash;
          })}
      </svg>
      <div className="space-y-2">
        {centerValue !== undefined && (
          <div className="mb-3">
            <p className="text-2xl font-extrabold text-on-surface leading-none">{centerValue}</p>
            {centerLabel && <p className="text-[11px] font-semibold text-on-surface-variant mt-1">{centerLabel}</p>}
          </div>
        )}
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-xs font-semibold text-on-surface-variant">{seg.label}</span>
            <span className="text-xs font-bold text-on-surface tabular-nums">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sparkbars({ data, color = MAGENTA }: { data: { name: string; count: number }[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d) => (
        <div key={d.name} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full flex items-end h-full">
            <div
              className="w-full rounded-t transition-all group-hover:opacity-80"
              style={{ height: `${Math.max(4, (d.count / max) * 100)}%`, backgroundColor: d.count ? color : "rgba(0,0,0,0.06)" }}
              title={`${d.name}: ${d.count}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export const CHART_COLORS = { cyan: CYAN, magenta: MAGENTA, muted: "#94a3b8" };
