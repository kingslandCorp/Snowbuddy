import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-alpine-100 bg-white/80 backdrop-blur dark:border-alpine-900 dark:bg-alpine-950/80 sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-alpine-900 dark:text-white">
          <span aria-hidden="true">❄️</span>
          SnowBuddy
        </Link>
        <p className="hidden text-sm text-alpine-600 dark:text-alpine-300 sm:block">
          Snow forecasts for UK &amp; European resorts
        </p>
      </div>
    </header>
  );
}
