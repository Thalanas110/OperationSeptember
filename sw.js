const CACHE_NAME = 'poetry-app-v1';
const STATIC_CACHE = 'poetry-static-v1';
const DYNAMIC_CACHE = 'poetry-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/main.css',
  '/logic.js',
  '/poems.js',
  '/manifest.json',
  '/bgimg.png',
  // Add any other static assets you have
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('Service Worker: Caching dynamic content', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Fetch failed, serving offline fallback', error);
            
            // Return offline fallback for HTML pages
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For other requests, you could return a generic offline response
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for saving data when back online
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-favorites') {
    event.waitUntil(syncFavorites());
  } else if (event.tag === 'background-sync-ratings') {
    event.waitUntil(syncRatings());
  } else if (event.tag === 'background-sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// Sync functions (you can expand these based on your needs)
async function syncFavorites() {
  try {
    // Get pending favorites from IndexedDB or localStorage
    const pendingFavorites = localStorage.getItem('pending-favorites');
    if (pendingFavorites) {
      // Process pending favorites
      console.log('Service Worker: Syncing favorites');
      // You could send to a server here
      localStorage.removeItem('pending-favorites');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing favorites', error);
  }
}

async function syncRatings() {
  try {
    const pendingRatings = localStorage.getItem('pending-ratings');
    if (pendingRatings) {
      console.log('Service Worker: Syncing ratings');
      localStorage.removeItem('pending-ratings');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing ratings', error);
  }
}

async function syncProgress() {
  try {
    const pendingProgress = localStorage.getItem('pending-progress');
    if (pendingProgress) {
      console.log('Service Worker: Syncing reading progress');
      localStorage.removeItem('pending-progress');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing progress', error);
  }
}

// Push notification event (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New poetry content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Read Now',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Poetry App', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle message from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
