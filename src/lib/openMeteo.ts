import type { Resort } from "../data/resorts";

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMaxC: number;
  tempMinC: number;
  snowfallCm: number;
  windMaxKmh: number;
}

export interface CurrentConditions {
  time: string;
  tempC: number;
  weatherCode: number;
  windKmh: number;
  snowfallCm: number;
}

export interface ElevationForecast {
  elevation: number;
  current: CurrentConditions;
  daily: DailyForecast[];
  snowDepthCm: number | null;
}

export interface ResortForecast {
  base: ElevationForecast;
  mid: ElevationForecast;
  top: ElevationForecast;
}

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    snowfall: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    snowfall_sum: number[];
    wind_speed_10m_max: number[];
  };
  hourly: {
    time: string[];
    snow_depth: number[];
  };
}

async function fetchElevationForecast(
  lat: number,
  lon: number,
  elevation: number,
  signal?: AbortSignal,
): Promise<ElevationForecast> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    elevation: String(Math.round(elevation)),
    timezone: "auto",
    forecast_days: "7",
    current: "temperature_2m,weather_code,wind_speed_10m,snowfall",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum,wind_speed_10m_max",
    hourly: "snow_depth",
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`, { signal });
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed (${res.status})`);
  }
  const data: OpenMeteoResponse = await res.json();

  let snowDepthCm: number | null = null;
  const hourIndex = data.hourly.time.indexOf(data.current.time.slice(0, 13) + ":00");
  if (hourIndex >= 0 && data.hourly.snow_depth[hourIndex] != null) {
    snowDepthCm = Math.round(data.hourly.snow_depth[hourIndex] * 100);
  }

  return {
    elevation,
    current: {
      time: data.current.time,
      tempC: Math.round(data.current.temperature_2m),
      weatherCode: data.current.weather_code,
      windKmh: Math.round(data.current.wind_speed_10m),
      snowfallCm: Math.round(data.current.snowfall * 100 * 10) / 10,
    },
    daily: data.daily.time.map((date, i) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      tempMaxC: Math.round(data.daily.temperature_2m_max[i]),
      tempMinC: Math.round(data.daily.temperature_2m_min[i]),
      snowfallCm: Math.round(data.daily.snowfall_sum[i] * 10) / 10,
      windMaxKmh: Math.round(data.daily.wind_speed_10m_max[i]),
    })),
    snowDepthCm,
  };
}

export async function fetchResortForecast(
  resort: Resort,
  signal?: AbortSignal,
): Promise<ResortForecast> {
  const midElevation = Math.round((resort.baseElevation + resort.topElevation) / 2);
  const [base, mid, top] = await Promise.all([
    fetchElevationForecast(resort.lat, resort.lon, resort.baseElevation, signal),
    fetchElevationForecast(resort.lat, resort.lon, midElevation, signal),
    fetchElevationForecast(resort.lat, resort.lon, resort.topElevation, signal),
  ]);
  return { base, mid, top };
}
