import { WEBCAM_SOURCES } from "./webcam-sources.js";

const SNAPSHOT_PATH = /^\/webcam-snapshot\/([a-z0-9-]+)\/([a-z]+)\.jpg$/;

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

    return env.ASSETS.fetch(request);
  },

  // Runs daily around midday CET, refreshing the cached snapshot for every
  // resort/tier that has a verified direct-image webcam source.
  async scheduled(event, env) {
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

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.log(
        `Webcam snapshot cron: ${failures.length}/${results.length} failed`,
        failures.map((f) => f.reason?.message ?? String(f.reason))
      );
    }
  },
};
