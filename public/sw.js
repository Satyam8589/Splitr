// Service worker for Splitr PWA
// This enables offline functionality and caching

const CACHE_NAME = "splitr-cache-v1";

// URLs to cache
const urlsToCache = [
  "/",
  "/dashboard",
  "/expenses/new",
  "/contacts",
  "/manifest.json",
  "/logos/logo.png",
  "/logos/logo-s.png",
];

// Install event - cache core assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing");

  // Perform install steps
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener("fetch", (event) => {
  // Skip for API calls and non-GET requests
  if (event.request.url.includes("/api/") || event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Return the offline page for navigation requests
        if (event.request.destination === "document") {
          return caches.match("/");
        }
      })
  );
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json();

  const options = {
    body: data.body || "New notification from Splitr",
    icon: "/pwa/icon-192.png",
    badge: "/pwa/badge-72.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification("Splitr", options));
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url));
});
