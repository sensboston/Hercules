/* Hercules offline service worker (0.6.0, update rules 0.7.7).
 * - App files (index.html, hercules.js, sw-independent scripts, manifest, icons) are NETWORK-FIRST: every start asks the
 *   server (a cheap revalidation, 304 when unchanged), so a new hercules.js / index.html on the host is used at once,
 *   even if this file did not change. The copy in the shell cache is only used offline or when the server does not
 *   answer within SHELL_TIMEOUT ms.
 * - DATA/ and MUSIC/ files (HERCULES.FS, the DLLs, ETV videos, MP3s) never change: they are cached the first time they
 *   are fetched (the page also pre-fetches all of them) and then always served from the cache "hercules-data-v1",
 *   which is kept across versions - an update never downloads the game data again.
 * - Range requests (the <audio> element asks for byte ranges of the MP3s) are answered from the cached file. */
const VERSION = "1.0.7";
const SHELL_CACHE = "hercules-shell-" + VERSION; // versioned shell cache ensures clean atomic updates
const DATA_CACHE = "hercules-data-v1";
const SHELL_TIMEOUT = 4000;
const SHELL = ["./", "index.html", "hercules.js", "manifest.webmanifest", "favicon.ico",
  "icons/favicon-32.png", "icons/favicon-16.png", "icons/icon-192.png", "icons/icon-512.png",
  "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Robust pre-caching: fetch each shell file with reload, ensuring a single missing/redirected
    // resource never causes the entire service worker install to abort.
    await Promise.all(SHELL.map(async (u) => {
      try {
        const req = new Request(u, { cache: "reload" });
        const res = await fetch(req);
        if (res.ok && res.status === 200) {
          await cache.put(req, res.clone());
          if (u === "index.html") {
            await cache.put(new Request("./", { cache: "reload" }), res.clone()).catch(() => {});
          } else if (u === "./") {
            await cache.put(new Request("index.html", { cache: "reload" }), res.clone()).catch(() => {});
          }
        }
      } catch (err) {
        console.warn("[sw] pre-cache failed for", u, err);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Delete all previous shell caches (unversioned and versioned) while keeping DATA_CACHE intact
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key.startsWith("hercules-shell") && key !== SHELL_CACHE)
          .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

function isData(url) { return /\/(DATA|MUSIC)\//i.test(url.pathname); }

async function rangeResponse(res, range) {
  const m = /bytes=(\d*)-(\d*)/.exec(range || "");
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  let start = m && m[1] ? parseInt(m[1], 10) : 0;
  let end = m && m[2] ? parseInt(m[2], 10) : size - 1;
  if (m && !m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }   // suffix range
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  end = Math.min(end, size - 1);
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

/** Shell files: the server first (revalidated with reload to prevent 304 network errors), the cached copy when offline or slow. */
async function shell(request, url, key) {
  const cache = await caches.open(SHELL_CACHE);
  const cachedCopy = async () => {
    let c = await cache.match(key, { ignoreSearch: true, ignoreVary: true });
    if (!c && request.mode === "navigate") {
      c = (await cache.match(new URL("index.html", self.registration.scope).href))
        || (await cache.match(new URL("./", self.registration.scope).href));
    }
    return c;
  };

  const fetchRequest = request.mode === "navigate"
    ? new Request(url.href, { cache: "reload", credentials: "same-origin" })
    : new Request(request, { cache: "reload" });

  const net = fetch(fetchRequest).then((res) => {
    if (res.ok && res.status === 200) {
      const copy = res.clone();
      cache.put(key, copy).catch(() => {});
      if (request.mode === "navigate") {
        if (/\/$/.test(url.pathname)) {
          cache.put(new URL("index.html", self.registration.scope).href, res.clone()).catch(() => {});
        } else if (url.pathname.endsWith("/index.html")) {
          cache.put(new URL("./", self.registration.scope).href, res.clone()).catch(() => {});
        }
      }
    }
    return res;
  });

  let timer;
  const slow = new Promise((resolve) => { timer = setTimeout(resolve, SHELL_TIMEOUT); });
  try {
    const res = await Promise.race([net, slow.then(() => null)]);
    if (res && res.ok && res.status === 200) {
      clearTimeout(timer);
      return res;
    }
    const c = await cachedCopy();             // the server is slow or non-200: use the cached copy
    if (c) { clearTimeout(timer); return c; }
    return res || await net;
  } catch (error) {
    clearTimeout(timer);
    const c = await cachedCopy();
    return c || new Response("Offline and not cached: " + url.pathname, { status: 504, headers: { "Content-Type": "text/plain" } });
  }
}

async function handle(request) {
  const url = new URL(request.url);
  const range = request.headers.get("range");
  const key = url.origin + url.pathname;   // query strings (?AUTOPLAY=1 …) do not matter for the files
  if (!isData(url)) return shell(request, url, key);
  const cached = await caches.match(key, { ignoreSearch: true, ignoreVary: true, cacheName: DATA_CACHE });
  if (cached) return range ? rangeResponse(cached, range) : cached;
  let res;
  try {
    res = await fetch(range ? new Request(request.url, { headers: {} }) : request);
  } catch (error) {
    return new Response("Offline and not cached: " + url.pathname, { status: 504, headers: { "Content-Type": "text/plain" } });
  }
  if (res.ok && res.status === 200) {
    const copy = res.clone();
    caches.open(DATA_CACHE).then((c) => c.put(key, copy)).catch(() => {});
  }
  if (range && res.status === 200) return rangeResponse(res, range);
  return res;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(handle(request));
});
