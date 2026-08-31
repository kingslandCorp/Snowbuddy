export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
      <p>
        Weather data from{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="text-slate-600 underline hover:text-blue-600"
        >
          Open-Meteo
        </a>
        . SnowBuddy is not affiliated with any resort operator.
      </p>
      <p className="mt-1 text-slate-400">Homepage photo: Failavaga, CC BY-SA 4.0</p>
    </footer>
  );
}
