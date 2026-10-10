import { useState } from "react";

// Framed to roughly the site's own resort coverage -- Scottish Highlands
// down to the Pyrenees/Dolomites -- rather than all of Europe.
const WINDY_SRC =
  "https://embed.windy.com/embed2.html?lat=49.5&lon=4&zoom=6&level=surface&overlay=snowcover&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1";

/**
 * A rough, hand-drawn-style illustration of what the Windy panel looks like
 * once there's actual snow on the ground -- purely a mockup for evaluating
 * layout/style in August, not real data. Never let this be mistaken for the
 * live embed: keep the "illustrative" labelling whenever it's shown.
 */
function IllustrativePreview() {
  return (
    <svg viewBox="0 0 500 380" className="h-full w-full" role="img" aria-label="Illustrative example of the snow depth map in winter">
      <rect width="500" height="380" fill="#3a3f47" />

      {/* very rough Western/Central Europe coastline, for orientation only */}
      <path
        d="M40 60 L90 40 L140 55 L160 90 L145 130 L120 150 L100 200 L130 230 L160 260 L150 300 L180 330 L220 340 L260 320 L300 330 L340 310 L380 320 L420 290 L450 250 L440 200 L410 170 L430 130 L400 90 L360 70 L320 90 L280 70 L240 90 L200 70 L160 50 L120 30 L80 20 L40 60 Z"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />

      <defs>
        <radialGradient id="deep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5f3ff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Alps -- the big one */}
      <ellipse cx="290" cy="200" rx="70" ry="34" fill="url(#mid)" />
      <ellipse cx="290" cy="200" rx="34" ry="16" fill="url(#deep)" />
      {/* Dolomites, just east of the Alps */}
      <ellipse cx="345" cy="205" rx="26" ry="14" fill="url(#mid)" />
      {/* Pyrenees */}
      <ellipse cx="175" cy="255" rx="38" ry="14" fill="url(#light)" />
      <ellipse cx="175" cy="255" rx="16" ry="7" fill="url(#mid)" />
      {/* Scottish Highlands */}
      <ellipse cx="90" cy="65" rx="22" ry="14" fill="url(#light)" />

      <text x="20" y="30" fill="rgba(255,255,255,0.55)" fontSize="11" fontFamily="sans-serif">
        Illustrative preview -- not live data
      </text>

      {/* legend, matching the live widget's own cm scale */}
      <g transform="translate(20, 355)">
        <rect x="0" y="0" width="60" height="8" fill="#0ea5e9" />
        <rect x="60" y="0" width="60" height="8" fill="#38bdf8" />
        <rect x="120" y="0" width="60" height="8" fill="#7dd3fc" />
        <rect x="180" y="0" width="60" height="8" fill="#a78bfa" />
        <rect x="240" y="0" width="60" height="8" fill="#f5f3ff" />
        <text x="0" y="22" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="sans-serif">
          2cm
        </text>
        <text x="220" y="22" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="sans-serif">
          3m+
        </text>
      </g>
    </svg>
  );
}

export function SnowHeatmap() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="mx-auto mb-10 max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h2 className="font-display text-lg tracking-wide text-slate-900">SNOW OVERVIEW</h2>
        <div className="flex gap-1 rounded-full bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setShowPreview(false)}
            className={`rounded-full px-3 py-1 transition ${
              !showPreview ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`rounded-full px-3 py-1 transition ${
              showPreview ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"
            }`}
          >
            Preview with snow
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]">
        {showPreview ? (
          <IllustrativePreview />
        ) : (
          // Windy's embed always ships its own logo/legend/timeline chrome --
          // there's no "chromeless" embed mode, so this crops it out: the
          // iframe renders taller than the visible box and is shifted up,
          // pushing the top branding bar and bottom legend/scrubber outside
          // the overflow-hidden container, leaving just the clean map.
          <iframe
            title="Western Europe snow depth map"
            src={WINDY_SRC}
            className="absolute inset-x-0 w-full border-0"
            style={{ top: "-58px", height: "calc(100% + 145px)" }}
            loading="lazy"
          />
        )}
      </div>

      <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
        {showPreview
          ? "Sketch of how the live map colours in once there's real snow -- not actual data."
          : "Live snow-depth map from Windy.com. It's August, so this is genuinely blank right now."}
      </p>
    </div>
  );
}
