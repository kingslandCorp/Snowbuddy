import type { DailyForecast } from "../lib/openMeteo";
import { describeWeatherCode } from "../lib/weatherCodes";

function formatDay(dateStr: string, index: number) {
  if (index === 0) return "Today";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

const POWDER_THRESHOLD_CM = 5;

export function DailyForecastList({ days, title }: { days: DailyForecast[]; title: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h3 className="font-display mb-4 text-lg tracking-wide text-white">{title.toUpperCase()}</h3>
      <div className="flex flex-col divide-y divide-slate-800">
        {days.map((day, i) => {
          const weather = describeWeatherCode(day.weatherCode);
          const isPowderDay = day.snowfallCm >= POWDER_THRESHOLD_CM;
          return (
            <div
              key={day.date}
              className={`grid grid-cols-[minmax(0,1.4fr)_auto_auto_auto] items-center gap-3 py-2.5 text-sm ${
                isPowderDay ? "rounded-md bg-cyan-500/10 px-2" : ""
              }`}
            >
              <span className="text-slate-300">{formatDay(day.date, i)}</span>
              <span className="text-xl" aria-hidden="true" title={weather.label}>
                {weather.icon}
              </span>
              <span className="text-slate-500">
                {day.tempMinC}° / {day.tempMaxC}°
              </span>
              <span
                className={`justify-self-end font-display tracking-wide ${
                  isPowderDay ? "text-cyan-300" : "text-slate-400"
                }`}
              >
                {day.snowfallCm > 0 ? `❄ ${day.snowfallCm}cm` : "–"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
