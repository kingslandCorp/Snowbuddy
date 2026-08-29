import { useState } from "react";
import { Link } from "react-router-dom";
import type { Resort } from "../data/resorts";
import { massifTheme } from "../lib/massifTheme";

// Homepage thumbnail doesn't need to be a specific tier -- any real photo
// beats the flat gradient fallback, so try every captured tier in order
// of how representative it tends to be before giving up.
const PHOTO_FALLBACK_ORDER = ["base", "general", "mid", "summit"] as const;

// For the couple of resorts with no webcam source anywhere (verified during
// research, not just untried), a real Wikimedia Commons photo beats the flat
// gradient -- credited per its CC BY-SA license.
const STATIC_PHOTOS: Record<string, { src: string; credit: string }> = {
  "nevis-range": { src: "/photos/nevis-range.jpg", credit: "Allister Combe, CC BY-SA 2.0" },
  formigal: { src: "/photos/formigal.jpg", credit: "Willtron, CC BY-SA 3.0" },
};

function usePhotoSrc(slug: string) {
  const [stageIndex, setStageIndex] = useState(0);
  if (stageIndex < PHOTO_FALLBACK_ORDER.length) {
    return {
      src: `/webcam-snapshot/${slug}/${PHOTO_FALLBACK_ORDER[stageIndex]}.jpg`,
      onError: () => setStageIndex((i) => i + 1),
      credit: null as string | null,
    };
  }

  const fallback = STATIC_PHOTOS[slug];
  return { src: fallback?.src ?? null, onError: () => {}, credit: fallback?.credit ?? null };
}

export function ResortCard({ resort }: { resort: Resort }) {
  const theme = massifTheme[resort.massif];
  const span = resort.topElevation - resort.baseElevation;
  const photo = usePhotoSrc(resort.slug);

  return (
    <Link
      to={`/resorts/${resort.slug}`}
      className="group relative block h-48 overflow-hidden rounded-lg border border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      {photo.src ? (
        <img
          src={photo.src}
          onError={photo.onError}
          alt=""
          className="absolute inset-0 h-full w-full scale-100 object-cover transition duration-500 group-hover:scale-110"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient}`} />

      {photo.credit && (
        <span className="absolute top-2.5 right-2.5 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white/80">
          📷 {photo.credit}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-xl tracking-wide text-white drop-shadow-sm">
          {resort.name.toUpperCase()}
        </h3>
        <p className="text-sm text-white/80">
          {resort.region}, {resort.country}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs tabular-nums text-white/70">{resort.baseElevation}m</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
            <div
              className={`h-full w-full bg-gradient-to-r ${theme.gradient}`}
              style={{ opacity: Math.min(0.55 + span / 4000, 1) }}
            />
          </div>
          <span className="text-xs tabular-nums text-white/70">{resort.topElevation}m</span>
        </div>
      </div>
    </Link>
  );
}
