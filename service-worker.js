self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("planit-store").then(cache => {
      return cache.addAll(["index.html", "style.css", "script.js", "orbit.js", "manifest.json"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});