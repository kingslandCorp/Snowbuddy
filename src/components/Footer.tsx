export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
      <p>
        Weather data from{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 underline hover:text-cyan-400"
        >
          Open-Meteo
        </a>
        . SnowBuddy is not affiliated with any resort operator.
      </p>
    </footer>
  );
}
