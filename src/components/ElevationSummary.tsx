import type { ElevationForecast } from "../lib/openMeteo";
import { describeWeatherCode } from "../lib/weatherCodes";

export function ElevationSummary({
  label,
  forecast,
}: {
  label: string;
  forecast: ElevationForecast;
}) {
  const weather = describeWeatherCode(forecast.current.weatherCode);

  return (
    <div className="flex-1 rounded-lg border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg tracking-wide text-white">{label.toUpperCase()}</h3>
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
          {forecast.elevation}m
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-5xl" aria-hidden="true">
          {weather.icon}
        </span>
        <div>
          <p className="font-display text-4xl text-white">{forecast.current.tempC}°</p>
          <p className="text-sm text-slate-400">{weather.label}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-950/60 p-2.5">
          <dt className="text-xs text-slate-500">Snow depth</dt>
          <dd
            className={`font-display text-lg tracking-wide ${
              forecast.snowDepthCm ? "text-cyan-300" : "text-slate-300"
            }`}
          >
            {forecast.snowDepthCm != null ? `${forecast.snowDepthCm}cm` : "—"}
          </dd>
        </div>
        <div className="rounded-md bg-slate-950/60 p-2.5">
          <dt className="text-xs text-slate-500">Wind</dt>
          <dd className="font-display text-lg tracking-wide text-slate-300">
            {forecast.current.windKmh}km/h
          </dd>
        </div>
      </dl>
    </div>
  );
}
