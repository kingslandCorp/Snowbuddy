import type { ElevationForecast } from "../lib/openMeteo";
import { describeWeatherCode } from "../lib/weatherCodes";

export function ElevationSummary({ label, forecast }: { label: string; forecast: ElevationForecast }) {
  const weather = describeWeatherCode(forecast.current.weatherCode);

  return (
    <div className="flex-1 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-400 sm:hidden">{label.toUpperCase()}</span>
        <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
          {forecast.elevation}m
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-5xl" aria-hidden="true">
          {weather.icon}
        </span>
        <div>
          <p className="font-display text-4xl text-slate-900">{forecast.current.tempC}°</p>
          <p className="text-sm text-slate-500">{weather.label}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-50 p-2.5">
          <dt className="text-xs text-slate-400">Snow depth</dt>
          <dd
            className={`font-display text-lg tracking-wide ${
              forecast.snowDepthCm ? "text-blue-600" : "text-slate-700"
            }`}
          >
            {forecast.snowDepthCm != null ? `${forecast.snowDepthCm}cm` : "—"}
          </dd>
        </div>
        <div className="rounded-md bg-slate-50 p-2.5">
          <dt className="text-xs text-slate-400">Wind</dt>
          <dd className="font-display text-lg tracking-wide text-slate-700">
            {forecast.current.windKmh}km/h
          </dd>
        </div>
      </dl>
    </div>
  );
}
