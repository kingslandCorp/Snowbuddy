import { Link } from "react-router-dom";
import type { Resort } from "../data/resorts";
import { massifTheme } from "../lib/massifTheme";

export function ResortCard({ resort }: { resort: Resort }) {
  const theme = massifTheme[resort.massif];
  const span = resort.topElevation - resort.baseElevation;

  return (
    <Link
      to={`/resorts/${resort.slug}`}
      className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient}`} />

      <h3 className="font-display text-xl tracking-wide text-slate-900 group-hover:text-blue-600">
        {resort.name.toUpperCase()}
      </h3>
      <p className="text-sm text-slate-500">
        {resort.region}, {resort.country}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs tabular-nums text-slate-400">{resort.baseElevation}m</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full w-full bg-gradient-to-r ${theme.gradient}`} style={{ opacity: Math.min(0.4 + span / 4000, 1) }} />
        </div>
        <span className="text-xs tabular-nums text-slate-400">{resort.topElevation}m</span>
      </div>
    </Link>
  );
}
