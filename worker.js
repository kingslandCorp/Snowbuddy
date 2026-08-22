import { WEBCAM_SOURCES } from "./webcam-sources.js";

const SNAPSHOT_PATH = /^\/webcam-snapshot\/([a-z0-9-]+)\/([a-z]+)\.jpg$/;
const REFRESH_PATH = "/webcam-snapshot-refresh";

// Free-plan Workers cap outbound fetch() calls at 50 per invocation, so a
// single call can't capture all ~145 sources at once -- chunk safely under that.
const CHUNK_SIZE = 35;

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
  return chunks;
}

async function captureSnapshots(env, keys) {
  const results = await Promise.allSettled(
    keys.map(async (key) => {
      const sourceUrl = WEBCAM_SOURCES[key];
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
    .map((r, i) => ({ r, key: keys[i] }))
    .filter(({ r }) => r.status === "rejected")
    .map(({ r, key }) => `${key}: ${r.reason?.message ?? r.reason}`);

  return { total: results.length, failed: failures.length, failures };
}

// Runs each chunk as its own Worker invocation (a real HTTP round-trip to
// this same route) so every chunk gets a fresh subrequest budget.
async function captureAllChunked(env) {
  const chunks = chunk(Object.keys(WEBCAM_SOURCES), CHUNK_SIZE);
  const summary = { total: 0, failed: 0, failures: [] };

  for (const keys of chunks) {
    const res = await fetch(`https://www.snowbuddy.co.uk${REFRESH_PATH}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SNAPSHOT_REFRESH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keys }),
    });
    const chunkSummary = await res.json();
    summary.total += chunkSummary.total ?? 0;
    summary.failed += chunkSummary.failed ?? 0;
    summary.failures.push(...(chunkSummary.failures ?? []));
  }

  return summary;
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

    // Manual trigger for ops -- lets us (or the cron) refresh snapshots on
    // demand. POST { keys: [...] } to capture a specific chunk, or POST with
    // no body / an empty object to capture everything (self-chunked).
    if (url.pathname === REFRESH_PATH && request.method === "POST") {
      const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
      if (!env.SNAPSHOT_REFRESH_TOKEN || token !== env.SNAPSHOT_REFRESH_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }
      let body = {};
      try {
        body = await request.json();
      } catch {
        // no body is fine -- means "capture everything"
      }
      const summary = body.keys?.length ? await captureSnapshots(env, body.keys) : await captureAllChunked(env);
      return new Response(JSON.stringify(summary, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return env.ASSETS.fetch(request);
  },

  // Runs daily around midday CET, refreshing the cached snapshot for every
  // resort/tier that has a verified direct-image webcam source.
  async scheduled(event, env) {
    const summary = await captureAllChunked(env);
    if (summary.failed > 0) {
      console.log(`Webcam snapshot cron: ${summary.failed}/${summary.total} failed`, summary.failures);
    }
  },
};
