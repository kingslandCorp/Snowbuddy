import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 2 L29 28 L3 28 Z" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cyan-400" />
            <path d="M16 12 L23 28 L9 28 Z" fill="currentColor" className="text-cyan-400" />
          </svg>
          <span className="font-display text-2xl tracking-wide text-white">SNOWBUDDY</span>
        </Link>
        <p className="hidden text-sm font-medium text-slate-400 sm:block">
          Live snow for skiers &amp; riders
        </p>
      </div>
    </header>
  );
}
