const cacheName = "cache-v1";
const resourcesToPrecache = [
  "/",
  "index.html",
  "assets/icons/mosque.png",
  "assets/icons/mosque.svg",
  "assets/js/app.js",
];

self.addEventListener("install", (e) => {
  console.log("Install event");
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(resourcesToPrecache))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request)).then(
    (cachedResponse) => cachedResponse || fetch(e.request)
  );
});

self.addEventListener("activate", (e) => console.log("Activate event"));
