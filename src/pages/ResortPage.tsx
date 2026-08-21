import { Link, useParams } from "react-router-dom";
import { getResortBySlug } from "../data/resorts";
import { useResortForecast } from "../lib/useResortForecast";
import { massifTheme } from "../lib/massifTheme";
import { ElevationSummary } from "../components/ElevationSummary";
import { DailyForecastList } from "../components/DailyForecastList";
import { WebcamLinks } from "../components/WebcamLinks";

export function ResortPage() {
  const { slug } = useParams<{ slug: string }>();
  const resort = slug ? getResortBySlug(slug) : undefined;
  const { data, loading, error } = useResortForecast(resort);

  if (!resort) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-slate-600">Resort not found.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 underline">
          Back to all resorts
        </Link>
      </div>
    );
  }

  const theme = massifTheme[resort.massif];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="text-sm text-slate-500 hover:text-blue-600">
        ← All resorts
      </Link>

      <div className="mt-3 mb-8">
        <span className={`inline-block rounded-full bg-gradient-to-r ${theme.gradient} px-3 py-0.5 text-xs font-semibold text-white`}>
          {resort.massif}
        </span>
        <h1 className="font-display mt-2 text-4xl tracking-wide text-slate-900 sm:text-5xl">
          {resort.name.toUpperCase()}
        </h1>
        <p className="text-slate-500">
          {resort.region}, {resort.country} · {resort.baseElevation}m–{resort.topElevation}m
        </p>
      </div>

      {loading && <p className="text-slate-500">Loading forecast…</p>}
      {error && <p className="text-red-600">Couldn't load the forecast: {error}</p>}

      {data && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ElevationSummary label="Base" forecast={data.base} />
            <ElevationSummary label="Mid" forecast={data.mid} />
            <ElevationSummary label="Summit" forecast={data.top} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DailyForecastList title="Base — 7 day" days={data.base.daily} />
            <DailyForecastList title="Mid — 7 day" days={data.mid.daily} />
            <DailyForecastList title="Summit — 7 day" days={data.top.daily} />
          </div>

          <WebcamLinks webcams={resort.webcams} />
        </div>
      )}
    </div>
  );
}
