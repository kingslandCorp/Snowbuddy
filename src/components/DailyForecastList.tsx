import type { DailyForecast } from "../lib/openMeteo";
import { describeWeatherCode } from "../lib/weatherCodes";

function formatDay(dateStr: string, index: number) {
  if (index === 0) return "Today";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

export function DailyForecastList({ days, title }: { days: DailyForecast[]; title: string }) {
  return (
    <div className="rounded-xl border border-alpine-100 bg-white p-5 dark:border-alpine-800 dark:bg-alpine-900">
      <h3 className="mb-4 font-semibold text-alpine-900 dark:text-white">{title}</h3>
      <div className="flex flex-col divide-y divide-alpine-100 dark:divide-alpine-800">
        {days.map((day, i) => {
          const weather = describeWeatherCode(day.weatherCode);
          return (
            <div key={day.date} className="grid grid-cols-[minmax(0,1.4fr)_auto_auto_auto] items-center gap-3 py-2.5 text-sm">
              <span className="text-alpine-700 dark:text-alpine-200">{formatDay(day.date, i)}</span>
              <span className="text-xl" aria-hidden="true" title={weather.label}>
                {weather.icon}
              </span>
              <span className="text-alpine-500 dark:text-alpine-400">
                {day.tempMinC}° / {day.tempMaxC}°
              </span>
              <span className="justify-self-end font-medium text-alpine-800 dark:text-alpine-100">
                {day.snowfallCm > 0 ? `❄ ${day.snowfallCm}cm` : "–"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
