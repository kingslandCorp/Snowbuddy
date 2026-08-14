import { Link } from "react-router-dom";
import type { Resort } from "../data/resorts";

export function ResortCard({ resort }: { resort: Resort }) {
  return (
    <Link
      to={`/resorts/${resort.slug}`}
      className="group flex flex-col justify-between rounded-xl border border-alpine-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-alpine-800 dark:bg-alpine-900"
    >
      <div>
        <h3 className="font-semibold text-alpine-900 group-hover:text-alpine-600 dark:text-white dark:group-hover:text-alpine-300">
          {resort.name}
        </h3>
        <p className="text-sm text-alpine-500 dark:text-alpine-400">
          {resort.region}, {resort.country}
        </p>
      </div>
      <p className="mt-3 text-xs text-alpine-400 dark:text-alpine-500">
        {resort.baseElevation}m – {resort.topElevation}m
      </p>
    </Link>
  );
}
