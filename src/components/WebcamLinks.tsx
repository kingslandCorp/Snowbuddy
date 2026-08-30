import { useState } from "react";
import type { ResortWebcams } from "../data/resorts";
import { TIERS } from "./TierIcon";

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-5 w-5"} aria-hidden="true">
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

/** Shows the latest captured snapshot as the tile's visual; the camera glyph is a faint overlay, not the content. */
function WebcamTile({ href, title, imgSrc }: { href?: string; title: string; imgSrc?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  // Serve-time compression occasionally trips the Workers CPU limit
  // transiently -- a failed attempt is never cached, so a same-URL retry
  // almost always succeeds. Try once before giving up.
  const [retried, setRetried] = useState(false);
  const showImage = Boolean(imgSrc) && !imgFailed;
  const src = retried && imgSrc ? `${imgSrc}?retry=1` : imgSrc;

  const visual = (
    <div
      className={`relative flex h-32 items-center justify-center overflow-hidden rounded-md bg-slate-100 ${
        showImage ? "" : "opacity-50"
      }`}
    >
      {showImage && (
        <img
          src={src}
          alt={title}
          onError={() => (retried ? setImgFailed(true) : setRetried(true))}
          className="h-full w-full object-cover"
        />
      )}
      <CameraIcon className={`absolute h-8 w-8 ${showImage ? "text-white/80 drop-shadow" : "text-slate-300"}`} />
    </div>
  );

  if (!href) {
    return <div title={showImage ? title : `${title} (unavailable)`}>{visual}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" title={title} className="block transition-opacity hover:opacity-90">
      {visual}
    </a>
  );
}

export function WebcamLinks({ slug, webcams }: { slug: string; webcams?: ResortWebcams }) {
  if (!webcams) return null;

  const hasSplit = TIERS.some(({ key }) => webcams[key]);

  if (!hasSplit) {
    if (!webcams.general) return null;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:max-w-xs">
        <WebcamTile href={webcams.general} title="Resort webcams" imgSrc={`/webcam-snapshot/${slug}/general.jpg`} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TIERS.map(({ key, label }) => (
        <div key={key} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 sm:hidden">
            {label.toUpperCase()}
          </span>
          <WebcamTile
            href={webcams[key] ?? webcams.general}
            title={`${label} webcam`}
            imgSrc={`/webcam-snapshot/${slug}/${key}.jpg`}
          />
        </div>
      ))}
    </div>
  );
}
