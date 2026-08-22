import { WEBCAM_SOURCES } from "./webcam-sources.js";

const SNAPSHOT_PATH = /^\/webcam-snapshot\/([a-z0-9-]+)\/([a-z]+)\.jpg$/;
const REFRESH_PATH = "/webcam-snapshot-refresh";

// Free-plan Workers cap outbound fetch() calls at 50 per invocation, and the
// account is also capped at 5 cron triggers total (shared across every
// project, not just this one) -- so we can't just add more crons to cover
// all ~145 sources in one day. Instead a single daily cron rotates through
// fixed-size chunks, cycling back to the start once it reaches the end, so
// every resort gets refreshed every few days rather than every day.
const CHUNK_SIZE = 30;
const CHUNK_INDEX_KEY = "cron-chunk-index";

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

    // Manual trigger for ops -- POST { keys: [...] } to capture a specific
    // subset (keep it under ~40 keys per call to stay under the subrequest cap).
    if (url.pathname === REFRESH_PATH && request.method === "POST") {
      const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
      if (!env.SNAPSHOT_REFRESH_TOKEN || token !== env.SNAPSHOT_REFRESH_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }
      let body = {};
      try {
        body = await request.json();
      } catch {
        // no/invalid body -- fall through to the default chunk below
      }
      const keys = body.keys?.length ? body.keys : Object.keys(WEBCAM_SOURCES).slice(0, CHUNK_SIZE);
      const summary = await captureSnapshots(env, keys);
      return new Response(JSON.stringify(summary, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return env.ASSETS.fetch(request);
  },

  // Runs once daily. Captures one chunk of WEBCAM_SOURCES and advances a
  // persisted index so the next run picks up where this one left off,
  // cycling through everything over a few days.
  async scheduled(event, env) {
    const chunks = chunk(Object.keys(WEBCAM_SOURCES), CHUNK_SIZE);
    const stored = await env.WEBCAM_KV.get(CHUNK_INDEX_KEY);
    const chunkIndex = stored ? Number(stored) % chunks.length : 0;

    const summary = await captureSnapshots(env, chunks[chunkIndex]);
    await env.WEBCAM_KV.put(CHUNK_INDEX_KEY, String((chunkIndex + 1) % chunks.length));

    if (summary.failed > 0) {
      console.log(
        `Webcam snapshot cron (chunk ${chunkIndex}/${chunks.length}): ${summary.failed}/${summary.total} failed`,
        summary.failures
      );
    }
  },
};
