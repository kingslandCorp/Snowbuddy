import type { ResortWebcams } from "../data/resorts";

const LABELS: { key: keyof Omit<ResortWebcams, "general">; label: string }[] = [
  { key: "base", label: "Base" },
  { key: "mid", label: "Mid-mountain" },
  { key: "summit", label: "Summit" },
];

export function WebcamLinks({ webcams }: { webcams?: ResortWebcams }) {
  if (!webcams) return null;

  const links = LABELS.filter(({ key }) => webcams[key]);

  if (links.length === 0 && !webcams.general) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-display text-lg tracking-wide text-slate-900">WEBCAMS</h3>

      {links.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(({ key, label }) => (
            <a
              key={key}
              href={webcams[key]}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-blue-100 hover:text-blue-700"
            >
              {label} ↗
            </a>
          ))}
        </div>
      ) : (
        webcams.general && (
          <div className="mt-3">
            <a
              href={webcams.general}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-blue-100 hover:text-blue-700"
            >
              Resort webcams ↗
            </a>
          </div>
        )
      )}
    </div>
  );
}
