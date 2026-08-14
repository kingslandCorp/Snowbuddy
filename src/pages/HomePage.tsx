import { useMemo, useState } from "react";
import { massifs, resorts, type Massif } from "../data/resorts";
import { ResortCard } from "../components/ResortCard";

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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-alpine-900 dark:text-white sm:text-4xl">
          Find the snow.
        </h1>
        <p className="mt-2 text-alpine-600 dark:text-alpine-300">
          Live 7-day forecasts and snow depth for {resorts.length} UK &amp; European resorts.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resorts, regions, countries…"
          className="w-full rounded-lg border border-alpine-200 bg-white px-4 py-2.5 text-alpine-900 placeholder:text-alpine-400 focus:border-alpine-400 focus:outline-none dark:border-alpine-800 dark:bg-alpine-900 dark:text-white"
        />
        <select
          value={massif}
          onChange={(e) => setMassif(e.target.value as Massif | "All")}
          className="rounded-lg border border-alpine-200 bg-white px-4 py-2.5 text-alpine-900 focus:border-alpine-400 focus:outline-none dark:border-alpine-800 dark:bg-alpine-900 dark:text-white sm:w-56"
        >
          <option value="All">All regions</option>
          {massifs.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {groups.length === 0 ? (
        <p className="text-center text-alpine-500 dark:text-alpine-400">
          No resorts match "{query}".
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.massif}>
              <h2 className="mb-4 flex items-baseline gap-2 text-xl font-semibold text-alpine-900 dark:text-white">
                {group.massif}
                <span className="text-sm font-normal text-alpine-400 dark:text-alpine-500">
                  {group.resorts.length} resort{group.resorts.length === 1 ? "" : "s"}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.resorts.map((resort) => (
                  <ResortCard key={resort.slug} resort={resort} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
