/**
 * Service worker mínimo — recebe push events do servidor Kwendi.
 */
self.addEventListener("push", (event) => {
  let data = { titulo: "Kwendi", corpo: "Vamos praticar!", url: "/home" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch { /* payload plain text */ }
  event.waitUntil(
    self.registration.showNotification(data.titulo, {
      body: data.corpo,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url: data.url },
      tag: "kwendi-daily",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/home";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ("focus" in w) { w.navigate(url).catch(() => {}); return w.focus(); }
      }
      return self.clients.openWindow(url);
    }),
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));