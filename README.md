# SnowBuddy

Live 7-day snow forecasts for UK & European ski resorts, built with React, Vite and Tailwind CSS. Weather and snow depth data comes from [Open-Meteo](https://open-meteo.com/) (free, no API key), queried at each resort's base and summit elevation.

## Development

```bash
npm install
npm run dev
```

## Project structure

- `src/data/resorts.ts` — curated list of resorts (name, region, coordinates, elevations)
- `src/lib/openMeteo.ts` — Open-Meteo API client
- `src/lib/useResortForecast.ts` — data-fetching hook
- `src/pages/HomePage.tsx` — searchable resort directory
- `src/pages/ResortPage.tsx` — per-resort forecast

## Deploying to Cloudflare Workers

This project deploys as a static single-page app on Cloudflare Workers (via `wrangler`'s static assets support).

```bash
npm run deploy
```

The first deploy will prompt you to log in to Cloudflare (`wrangler login`) if you aren't already authenticated. This publishes to `snowbuddy.<your-subdomain>.workers.dev`.

### Connecting www.snowbuddy.co.uk

`wrangler.jsonc` already declares custom domain routes for `www.snowbuddy.co.uk` and `snowbuddy.co.uk` (the apex redirects to `www` via `worker.js`). For these to attach automatically on `npm run deploy`:

1. `snowbuddy.co.uk`'s DNS must be managed by Cloudflare — add the zone in the Cloudflare dashboard first if it isn't yet.
2. Run `npm run deploy`. Wrangler will provision both custom domains and TLS certificates automatically.

If the zone isn't on Cloudflare yet, remove the `routes` block from `wrangler.jsonc`, deploy to get a working `*.workers.dev` URL, then add the custom domains from the dashboard (**Workers & Pages → snowbuddy → Settings → Domains & Routes**) once DNS is migrated.
