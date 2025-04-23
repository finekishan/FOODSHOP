const CACHE_NAME = 'foodshop-cache-v1';
const urlsToCache = [
  '/shoppingsite/',
  '/shoppingsite/index.html',
  '/shoppingsite/about.html',
  '/shoppingsite/services.html',
  '/shoppingsite/yourorders.html',
  '/shoppingsite/wishlists.html',
  '/shoppingsite/contact.html',
  '/shoppingsite/offline.html',   // fallback page
  '/shoppingsite/index.css',
  '/shoppingsite/images/foodie hunter.png',
  '/shoppingsite/images/paneer/palak-paneer.jpg',
  '/shoppingsite/images/paneer/kadai-paneer.jpg',
  '/shoppingsite/images/biryani/veg-biryani.jpg',
  '/shoppingsite/images/dosa/masala-dosa.jpg',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
];

// Install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;

      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(function() {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/shoppingsite/offline.html');
        }
      });
    })
  );
});

// Activate
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});