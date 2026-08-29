import { TIERS, TierIcon } from "./TierIcon";

/**
 * Says "Base" / "Mid" / "Summit" once for the whole column — nothing below
 * should repeat it. Stays a 3-up row at every width (the cards below stack
 * to one column on mobile, but this label row would look like three
 * disconnected giant headings if it stacked too).
 */
export function TierHeaderRow() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {TIERS.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-center gap-1.5 px-1 sm:justify-start sm:gap-2">
          <TierIcon tier={key} className="h-4 w-4 shrink-0 text-slate-400 sm:h-7 sm:w-7" />
          <h2 className="font-display text-sm tracking-wide text-slate-900 sm:text-2xl">{label.toUpperCase()}</h2>
        </div>
      ))}
    </div>
  );
}
