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
    <div className="flex-1 rounded-xl border border-alpine-100 bg-white p-5 dark:border-alpine-800 dark:bg-alpine-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-alpine-900 dark:text-white">{label}</h3>
        <span className="text-xs text-alpine-400 dark:text-alpine-500">{forecast.elevation}m</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">
          {weather.icon}
        </span>
        <div>
          <p className="text-2xl font-bold text-alpine-900 dark:text-white">{forecast.current.tempC}°C</p>
          <p className="text-sm text-alpine-500 dark:text-alpine-400">{weather.label}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-alpine-400 dark:text-alpine-500">Snow depth</dt>
          <dd className="font-medium text-alpine-800 dark:text-alpine-100">
            {forecast.snowDepthCm != null ? `${forecast.snowDepthCm} cm` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-alpine-400 dark:text-alpine-500">Wind</dt>
          <dd className="font-medium text-alpine-800 dark:text-alpine-100">{forecast.current.windKmh} km/h</dd>
        </div>
      </dl>
    </div>
  );
}
