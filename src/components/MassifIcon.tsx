import type { Massif } from "../data/resorts";

interface Stroke {
  d: string;
  opacity?: number;
  strokeWidth?: number;
}

const STROKES: Record<Massif, Stroke[]> = {
  // Sharp jagged skyline with rock-face hatching on the tallest peaks
  Alps: [
    {
      d: "M0 95 L35 30 L55 55 L80 15 L100 45 L125 20 L150 60 L180 25 L205 50 L230 18 L255 48 L280 28 L305 58 L335 22 L360 50 L400 90",
    },
    { d: "M78 20 L65 40" },
    { d: "M82 26 L72 44" },
    { d: "M85 33 L78 47" },
    { d: "M228 24 L215 42" },
    { d: "M232 30 L222 46" },
    { d: "M333 28 L322 44" },
  ],
  // A tall narrow spire with rock strata, standing above jagged neighbours
  Dolomites: [
    {
      d: "M0 95 L40 65 L70 80 L100 45 L130 68 L148 20 L155 10 L160 18 L165 8 L172 22 L200 55 L235 30 L268 55 L300 32 L335 60 L400 90",
    },
    { d: "M145 35 L175 33" },
    { d: "M148 48 L178 46" },
    { d: "M150 60 L180 58" },
    { d: "M155 10 L148 30" },
    { d: "M160 18 L153 34" },
    { d: "M233 36 L222 52" },
  ],
  // A wide run of packed peaks, with a fainter range layered behind for depth
  Pyrenees: [
    {
      d: "M0 60 L30 38 L60 50 L90 28 L120 46 L150 25 L180 48 L210 26 L240 50 L270 30 L300 52 L330 32 L360 54 L400 58",
      opacity: 0.45,
    },
    {
      d: "M0 90 L25 55 L48 72 L70 40 L92 65 L115 35 L138 68 L160 42 L182 70 L205 38 L228 66 L250 40 L272 68 L295 45 L318 72 L340 48 L365 74 L400 88",
    },
    { d: "M68 46 L58 62" },
    { d: "M203 44 L193 60" },
  ],
  // Soft rolling hills with a layered contour line and a couple of pines
  Highlands: [
    {
      d: "M0 85 C 40 55, 80 55, 120 82 C 160 108, 200 108, 240 80 C 280 52, 320 52, 360 82 C 380 95, 390 92, 400 85",
      opacity: 0.45,
    },
    {
      d: "M0 70 C 40 30, 80 30, 120 65 C 160 100, 200 100, 240 60 C 280 25, 320 25, 360 65 C 380 82, 390 78, 400 70",
    },
    { d: "M55 70 L60 56 L65 70 M61 70 L61 74" },
    { d: "M255 65 L260 51 L265 65 M261 65 L261 69" },
  ],
};

export function MassifIcon({ massif, className }: { massif: Massif; className?: string }) {
  return (
    <svg viewBox="0 0 400 100" fill="none" aria-hidden="true" className={className}>
      {STROKES[massif].map((s, i) => (
        <path
          key={i}
          d={s.d}
          stroke="currentColor"
          strokeWidth={s.strokeWidth ?? 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={s.opacity ?? 1}
        />
      ))}
    </svg>
  );
}
