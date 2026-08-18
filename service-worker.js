const CACHE_NAME = "cancel-that-order-v2";
const APP_FILES = ["./", "./index.html", "./style.css", "./script.js", "./manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});

self.addEventListener("push", event => {
  const data = event.data?.json() || {};
  const title = data.title || "🚨 MIRACLEEEE!";
  const body = data.message || data.body || "The Ministry has a message for you. 😂";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "./icon-192.png",
      badge: "./icon-192.png",
      tag: data.tag || "cancel-that-order-reminder",
      renotify: true,
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      const existing = list.find(client => "focus" in client);
      return existing ? existing.focus() : clients.openWindow("./index.html");
    })
  );
});
