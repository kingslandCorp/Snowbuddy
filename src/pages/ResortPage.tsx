import { Link, useParams } from "react-router-dom";
import { getResortBySlug } from "../data/resorts";
import { useResortForecast } from "../lib/useResortForecast";
import { ElevationSummary } from "../components/ElevationSummary";
import { DailyForecastList } from "../components/DailyForecastList";

export function ResortPage() {
  const { slug } = useParams<{ slug: string }>();
  const resort = slug ? getResortBySlug(slug) : undefined;
  const { data, loading, error } = useResortForecast(resort);

  if (!resort) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-alpine-600 dark:text-alpine-300">Resort not found.</p>
        <Link to="/" className="mt-4 inline-block text-alpine-500 underline dark:text-alpine-400">
          Back to all resorts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="text-sm text-alpine-500 hover:underline dark:text-alpine-400">
        ← All resorts
      </Link>

      <div className="mt-2 mb-8">
        <h1 className="text-3xl font-bold text-alpine-900 dark:text-white">{resort.name}</h1>
        <p className="text-alpine-600 dark:text-alpine-300">
          {resort.region}, {resort.country} · {resort.baseElevation}m–{resort.topElevation}m
        </p>
      </div>

      {loading && <p className="text-alpine-500 dark:text-alpine-400">Loading forecast…</p>}
      {error && <p className="text-red-500">Couldn't load the forecast: {error}</p>}

      {data && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <ElevationSummary label="Base" forecast={data.base} />
            <ElevationSummary label="Summit" forecast={data.top} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DailyForecastList title="Base — 7 day" days={data.base.daily} />
            <DailyForecastList title="Summit — 7 day" days={data.top.daily} />
          </div>
        </div>
      )}
    </div>
  );
}
