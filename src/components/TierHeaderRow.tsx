import { TIERS, TierIcon } from "./TierIcon";

/** Says "Base" / "Mid" / "Summit" once for the whole column — nothing below should repeat it. */
export function TierHeaderRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TIERS.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2 px-1">
          <TierIcon tier={key} className="h-7 w-7 text-slate-400" />
          <h2 className="font-display text-2xl tracking-wide text-slate-900">{label.toUpperCase()}</h2>
        </div>
      ))}
    </div>
  );
}
