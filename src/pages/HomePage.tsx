import { useMemo, useState } from "react";
import { massifs, resorts, type Massif } from "../data/resorts";
import { ResortCard } from "../components/ResortCard";
import { massifTheme } from "../lib/massifTheme";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [massif, setMassif] = useState<Massif | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resorts.filter((r) => {
      const matchesQuery =
        q.length === 0 ||
        r.name.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q);
      const matchesMassif = massif === "All" || r.massif === massif;
      return matchesQuery && matchesMassif;
    });
  }, [query, massif]);

  const groups = useMemo(
    () =>
      massifs
        .map((m) => ({ massif: m, resorts: filtered.filter((r) => r.massif === m) }))
        .filter((g) => g.resorts.length > 0),
    [filtered],
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-500 via-blue-600 to-blue-700">
        <div className="snowfall pointer-events-none absolute inset-0" />
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full text-slate-50"
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 220 L0 130 L180 60 L340 150 L520 40 L720 140 L900 70 L1080 160 L1200 100 L1200 220 Z" fill="#ffffff" opacity="0.35" />
          <path d="M0 220 L0 170 L220 110 L420 190 L640 90 L860 180 L1040 120 L1200 170 L1200 220 Z" fill="currentColor" />
        </svg>

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
          <h1 className="font-display text-5xl tracking-wide text-white sm:text-7xl">
            FIND THE <span className="text-cyan-200">SNOW</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-blue-50">
            Live 7-day forecasts and snow depth for {resorts.length} UK &amp; European resorts — base
            to summit.
          </p>

          <div className="mx-auto mt-8 max-w-lg">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resorts, regions, countries…"
              className="w-full rounded-full border border-white/40 bg-white px-5 py-3 text-slate-900 placeholder:text-slate-400 focus:border-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setMassif("All")}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              massif === "All"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700"
            }`}
          >
            All regions
          </button>
          {massifs.map((m) => {
            const theme = massifTheme[m];
            const active = massif === m;
            return (
              <button
                key={m}
                onClick={() => setMassif(m)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  active
                    ? `border-transparent bg-gradient-to-r ${theme.gradient} text-white`
                    : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        {groups.length === 0 ? (
          <p className="text-center text-slate-500">No resorts match "{query}".</p>
        ) : (
          <div className="flex flex-col gap-12">
            {groups.map((group) => {
              const theme = massifTheme[group.massif];
              return (
                <section key={group.massif}>
                  <div className="mb-4 flex items-baseline gap-3">
                    <h2 className={`font-display text-3xl tracking-wide ${theme.text}`}>
                      {group.massif.toUpperCase()}
                    </h2>
                    <span className="text-sm text-slate-400">
                      {group.resorts.length} resort{group.resorts.length === 1 ? "" : "s"}
                    </span>
                    <div className={`h-px flex-1 bg-gradient-to-r ${theme.gradient} opacity-30`} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.resorts.map((resort) => (
                      <ResortCard key={resort.slug} resort={resort} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
