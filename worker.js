import { WEBCAM_SOURCES } from "./webcam-sources.js";

const SNAPSHOT_PATH = /^\/webcam-snapshot\/([a-z0-9-]+)\/([a-z]+)\.jpg$/;
const REFRESH_PATH = "/webcam-snapshot-refresh";

// Free-plan Workers cap outbound fetch() calls at 50 per invocation. We
// spread the ~145 sources across 5 staggered cron triggers (see
// wrangler.jsonc), each processing one fixed chunk directly -- self-fetching
// the same route from within scheduled() turned out to be unreliable (522s).
const CHUNK_SIZE = 30;
const CRON_SCHEDULE = ["0 11 * * *", "6 11 * * *", "12 11 * * *", "18 11 * * *", "24 11 * * *"];

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

  // Runs daily as 5 staggered triggers (see wrangler.jsonc), each capturing
  // one fixed chunk of WEBCAM_SOURCES so no single invocation exceeds the
  // free-plan subrequest limit.
  async scheduled(event, env) {
    const chunkIndex = CRON_SCHEDULE.indexOf(event.cron);
    const chunks = chunk(Object.keys(WEBCAM_SOURCES), CHUNK_SIZE);
    const keys = chunks[chunkIndex] ?? [];
    if (keys.length === 0) return;

    const summary = await captureSnapshots(env, keys);
    if (summary.failed > 0) {
      console.log(
        `Webcam snapshot cron (chunk ${chunkIndex}): ${summary.failed}/${summary.total} failed`,
        summary.failures
      );
    }
  },
};
