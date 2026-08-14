import { useEffect, useState } from "react";
import type { Resort } from "../data/resorts";
import { fetchResortForecast, type ResortForecast } from "./openMeteo";

interface ForecastState {
  data: ResortForecast | null;
  loading: boolean;
  error: string | null;
}

export function useResortForecast(resort: Resort | undefined): ForecastState {
  const [state, setState] = useState<ForecastState>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!resort) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetchResortForecast(resort, controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({ data: null, loading: false, error: err.message ?? "Failed to load forecast" });
      });

    return () => controller.abort();
  }, [resort]);

  return state;
}
