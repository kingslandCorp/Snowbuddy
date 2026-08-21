export type Tier = "base" | "mid" | "summit";

export const TIERS: { key: Tier; label: string }[] = [
  { key: "base", label: "Base" },
  { key: "mid", label: "Mid" },
  { key: "summit", label: "Summit" },
];

/** A single mountain glyph reused for all three tiers — the dot's height marks the tier. */
export function TierIcon({ tier, className }: { tier: Tier; className?: string }) {
  const dotY = tier === "summit" ? 7 : tier === "mid" ? 12 : 17;
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-4 w-4 text-slate-400"} fill="none" aria-hidden="true">
      <path d="M3 19 L12 5 L21 19 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy={dotY} r="1.6" fill="currentColor" />
    </svg>
  );
}
