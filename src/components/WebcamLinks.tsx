import type { ResortWebcams } from "../data/resorts";

const STOPS: { key: keyof Omit<ResortWebcams, "general">; title: string }[] = [
  { key: "summit", title: "Summit webcam" },
  { key: "mid", title: "Mid-mountain webcam" },
  { key: "base", title: "Base webcam" },
];

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

function WebcamStop({ href, title }: { href?: string; title: string }) {
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

  const hasSplit = STOPS.some(({ key }) => webcams[key]);

  if (!hasSplit && !webcams.general) return null;

  return (
    <div className="w-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-display text-lg tracking-wide text-slate-900">WEBCAMS</h3>

      {hasSplit ? (
        <div className="mt-4 flex flex-col items-center">
          {STOPS.map(({ key, title }, i) => (
            <div key={key} className="flex flex-col items-center">
              <WebcamStop href={webcams[key]} title={title} />
              {i < STOPS.length - 1 && <div className="h-6 w-px bg-slate-200" />}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <WebcamStop href={webcams.general} title="Resort webcams" />
        </div>
      )}
    </div>
  );
}
