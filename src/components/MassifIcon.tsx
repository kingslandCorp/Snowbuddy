import type { Massif } from "../data/resorts";

const PATHS: Record<Massif, string[]> = {
  // Sharp, jagged high-alpine peaks
  Alps: [
    "M0 56 L45 18 L65 38 L95 6 L125 34 L160 14 L190 46 L225 10 L255 40 L290 20 L320 48 L360 24 L400 54",
    "M95 6 L85 26",
    "M225 10 L215 28",
  ],
  // A tall narrow spire standing above jagged neighbours
  Dolomites: [
    "M0 56 L40 36 L65 46 L95 24 L120 42 L145 10 L155 4 L165 14 L175 40 L205 22 L235 44 L270 26 L300 46 L335 20 L400 52",
  ],
  // A wide run of closely packed, similar-height peaks
  Pyrenees: [
    "M0 50 L30 28 L55 40 L80 20 L105 36 L130 18 L155 38 L180 22 L205 40 L230 24 L255 42 L280 20 L305 38 L330 26 L355 44 L400 48",
  ],
  // Soft, worn, rolling hills
  Highlands: [
    "M0 40 C 40 15, 80 15, 120 38 C 160 60, 200 60, 240 35 C 280 12, 320 12, 360 38 C 380 48, 390 46, 400 42",
  ],
};

export function MassifIcon({ massif, className }: { massif: Massif; className?: string }) {
  return (
    <svg viewBox="0 0 400 60" fill="none" aria-hidden="true" className={className}>
      {PATHS[massif].map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
