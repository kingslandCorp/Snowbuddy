import { Link, useParams } from "react-router-dom";
import { getResortBySlug } from "../data/resorts";
import { useResortForecast } from "../lib/useResortForecast";
import { usePageMeta } from "../lib/usePageMeta";
import { massifTheme } from "../lib/massifTheme";
import { ElevationSummary } from "../components/ElevationSummary";
import { DailyForecastList } from "../components/DailyForecastList";
import { WebcamLinks } from "../components/WebcamLinks";
import { TierHeaderRow } from "../components/TierHeaderRow";

export function ResortPage() {
  const { slug } = useParams<{ slug: string }>();
  const resort = slug ? getResortBySlug(slug) : undefined;
  const { data, loading, error } = useResortForecast(resort);

  usePageMeta({
    title: resort
      ? `${resort.name} Snow Report & Forecast | SnowBuddy`
      : "Resort not found | SnowBuddy",
    description: resort
      ? `Live snow depth and 7-day forecast for ${resort.name}, ${resort.region}, ${resort.country} — base, mid and summit conditions from ${resort.baseElevation}m to ${resort.topElevation}m.`
      : "Resort not found on SnowBuddy.",
    path: slug ? `/resorts/${slug}` : "/resorts",
  });

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
  const hasWebcams = Boolean(
    resort.webcams && (resort.webcams.general || resort.webcams.base || resort.webcams.mid || resort.webcams.summit)
  );

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
          <TierHeaderRow />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ElevationSummary label="Base" forecast={data.base} />
            <ElevationSummary label="Mid" forecast={data.mid} />
            <ElevationSummary label="Summit" forecast={data.top} />
          </div>

          {hasWebcams && (
            <div>
              <h2 className="font-display mb-3 text-lg tracking-wide text-slate-900">WEBCAM</h2>
              <WebcamLinks slug={resort.slug} webcams={resort.webcams} />
            </div>
          )}

          <div>
            <h2 className="font-display mb-3 text-lg tracking-wide text-slate-900">7 DAY</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <DailyForecastList label="Base" days={data.base.daily} />
              <DailyForecastList label="Mid" days={data.mid.daily} />
              <DailyForecastList label="Summit" days={data.top.daily} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
