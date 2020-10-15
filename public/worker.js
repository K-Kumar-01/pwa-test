const CACHE_NAME = "pwa-task-manager";
const urlsToCache = ["/", "/completed"];

// Install a service worker
self.addEventListener("install", (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

Notification.requestPermission(function (status) {
  console.log("Notification permission status:", status);
  if (status === "granted") {
    navigator.serviceWorker.getRegistration().then(function (reg) {
      var options = {
        body: "Here is a notification body!",

        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
        actions: [
          {
            action: "explore",
            title: "Explore this new world",
          },
          {
            action: "close",
            title: "Close notification",
          },
        ],
      };
      reg.showNotification("Hello world!", options);
    });
  }
});

self.addEventListener("notificationclick", function (e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === "close") {
    notification.close();
  } else {
    clients.openWindow("http://www.example.com");
    notification.close();
  }
});
