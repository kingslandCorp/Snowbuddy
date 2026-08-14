export function Footer() {
  return (
    <footer className="border-t border-alpine-100 py-6 text-center text-xs text-alpine-500 dark:border-alpine-900 dark:text-alpine-400">
      <p>
        Weather data from{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-alpine-700 dark:hover:text-alpine-200"
        >
          Open-Meteo
        </a>
        . SnowBuddy is not affiliated with any resort operator.
      </p>
    </footer>
  );
}
