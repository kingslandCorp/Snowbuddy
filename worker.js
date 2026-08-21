import { WEBCAM_SOURCES } from "./webcam-sources.js";

const SNAPSHOT_PATH = /^\/webcam-snapshot\/([a-z0-9-]+)\/([a-z]+)\.jpg$/;

async function captureSnapshots(env) {
  const results = await Promise.allSettled(
    Object.entries(WEBCAM_SOURCES).map(async ([key, sourceUrl]) => {
      const res = await fetch(sourceUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SnowBuddySnapshotBot/1.0; +https://www.snowbuddy.co.uk)" },
      });
      if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error(`${key}: not an image (${contentType})`);
      const buffer = await res.arrayBuffer();
      await env.WEBCAM_KV.put(key, buffer);
    })
  );

  const failures = results
    .map((r, i) => ({ r, key: Object.keys(WEBCAM_SOURCES)[i] }))
    .filter(({ r }) => r.status === "rejected")
    .map(({ r, key }) => `${key}: ${r.reason?.message ?? r.reason}`);

  return { total: results.length, failed: failures.length, failures };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "snowbuddy.co.uk") {
      url.hostname = "www.snowbuddy.co.uk";
      return Response.redirect(url.toString(), 301);
    }

    const snapshotMatch = url.pathname.match(SNAPSHOT_PATH);
    if (snapshotMatch) {
      const [, slug, tier] = snapshotMatch;
      const image = await env.WEBCAM_KV.get(`${slug}-${tier}`, "arrayBuffer");
      if (!image) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(image, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Manual trigger for ops -- lets us (or the next cron) refresh snapshots
    // on demand instead of waiting for the daily schedule.
    if (url.pathname === "/webcam-snapshot-refresh" && request.method === "POST") {
      const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
      if (!env.SNAPSHOT_REFRESH_TOKEN || token !== env.SNAPSHOT_REFRESH_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }
      const summary = await captureSnapshots(env);
      return new Response(JSON.stringify(summary, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return env.ASSETS.fetch(request);
  },

  // Runs daily around midday CET, refreshing the cached snapshot for every
  // resort/tier that has a verified direct-image webcam source.
  async scheduled(event, env) {
    const summary = await captureSnapshots(env);
    if (summary.failed > 0) {
      console.log(`Webcam snapshot cron: ${summary.failed}/${summary.total} failed`, summary.failures);
    }
  },
};
