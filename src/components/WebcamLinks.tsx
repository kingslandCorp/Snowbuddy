import type { ResortWebcams } from "../data/resorts";

type Tier = "base" | "mid" | "summit";

const TIERS: { key: Tier; label: string }[] = [
  { key: "base", label: "Base" },
  { key: "mid", label: "Mid" },
  { key: "summit", label: "Summit" },
];

/** A single mountain glyph reused for all three tiers — the dot's height marks the tier. */
function TierIcon({ tier }: { tier: Tier }) {
  const dotY = tier === "summit" ? 7 : tier === "mid" ? 12 : 17;
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" aria-hidden="true">
      <path d="M3 19 L12 5 L21 19 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy={dotY} r="1.6" fill="currentColor" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.19a1 1 0 0 0 .8-.4l.87-1.16A1 1 0 0 1 10.16 5h3.68a1 1 0 0 1 .8.4l.87 1.16a1 1 0 0 0 .8.4H18.5A1.5 1.5 0 0 1 20 8.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function WebcamButton({ href, title }: { href?: string; title: string }) {
  if (!href) {
    return (
      <div
        title={`${title} (unavailable)`}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-300"
      >
        <CameraIcon />
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
    >
      <CameraIcon />
    </a>
  );
}

export function WebcamLinks({ webcams }: { webcams?: ResortWebcams }) {
  if (!webcams) return null;

  const hasSplit = TIERS.some(({ key }) => webcams[key]);

  if (!hasSplit) {
    if (!webcams.general) return null;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-display text-lg tracking-wide text-slate-900">WEBCAMS</h3>
        <div className="mt-4 flex justify-center">
          <WebcamButton href={webcams.general} title="Resort webcams" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TIERS.map(({ key, label }) => (
        <div key={key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <TierIcon tier={key} />
            <h3 className="font-display text-lg tracking-wide text-slate-900">{label.toUpperCase()}</h3>
          </div>
          <div className="mt-4 flex justify-center">
            <WebcamButton href={webcams[key]} title={`${label} webcam`} />
          </div>
        </div>
      ))}
    </div>
  );
}
