import { useMemo, useState, type MouseEvent } from "react";
import { massifs, resorts, type Massif } from "../data/resorts";
import { ResortCard } from "../components/ResortCard";
import { massifTheme } from "../lib/massifTheme";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [massif, setMassif] = useState<Massif | "All">("All");

  const handleHeroMouseMove = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.classList.remove("settling");
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    e.currentTarget.style.setProperty("--mx", relX.toFixed(3));
  };

  const handleHeroMouseLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.classList.add("settling");
    e.currentTarget.style.setProperty("--mx", "0");
  };

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
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-blue-600 to-blue-700"
      >
        <div className="hero-glow pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="hero-glow pointer-events-none absolute top-0 right-1/4 h-72 w-72 rounded-full bg-white/20 blur-3xl [animation-delay:-7s]" />
        <div className="snowfall pointer-events-none absolute inset-0" />

        <svg
          className="mountain-layer pointer-events-none absolute inset-x-0 bottom-0 w-[170%] max-w-none"
          style={{ transform: "translateX(calc(-35% + var(--mx, 0) * 90px))" }}
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 240 L0 150 L150 70 L300 160 L460 50 L620 150 L780 60 L940 160 L1100 90 L1200 140 L1200 240 Z" fill="#ffffff" opacity="0.2" />
        </svg>
        <svg
          className="mountain-layer pointer-events-none absolute inset-x-0 bottom-0 w-[170%] max-w-none"
          style={{ transform: "translateX(calc(-35% + var(--mx, 0) * -160px))" }}
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 240 L0 180 L180 110 L360 190 L560 90 L760 180 L940 120 L1100 175 L1200 150 L1200 240 Z" fill="#ffffff" opacity="0.4" />
        </svg>
        <svg
          className="mountain-layer text-slate-50 pointer-events-none absolute inset-x-0 bottom-0 w-[170%] max-w-none"
          style={{ transform: "translateX(calc(-35% + var(--mx, 0) * 250px))" }}
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 240 L0 200 L220 150 L420 210 L640 130 L860 205 L1040 160 L1200 200 L1200 240 Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative mx-auto max-w-5xl px-4 py-8 text-center sm:py-12">
          <h1 className="font-display rise-in text-6xl tracking-wide text-white drop-shadow-sm sm:text-8xl">
            FIND THE{" "}
            <span className="relative inline-block text-cyan-400" style={{ textShadow: "0 0 40px rgba(6,182,212,0.8)" }}>
              SNOW
              <svg
                className="pointer-events-none absolute -bottom-1 left-0 h-4 w-full sm:-bottom-2 sm:h-6"
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12 C 40 20, 80 2, 120 10 S 180 18, 196 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="carve-line"
                />
              </svg>
            </span>
          </h1>
          <div className="rise-in mx-auto mt-6 max-w-lg [animation-delay:0.1s]">
            <div className="relative">
              <svg
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resorts, regions, countries…"
                className="w-full rounded-full border border-white/40 bg-white py-3.5 pr-5 pl-11 text-slate-900 placeholder:text-slate-400 shadow-lg shadow-blue-900/20 transition focus:border-white focus:ring-4 focus:ring-cyan-200/50 focus:outline-none"
              />
            </div>
          </div>

          <p className="rise-in mx-auto mt-[60px] max-w-xl text-cyan-600 [animation-delay:0.2s]">
            Live 7-day forecasts and snow depth for skiers &amp; riders —
            <br />
            base, mid-mountain and summit, updated all season.
          </p>
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
