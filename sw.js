const CACHE_NAME = 'foodshop-cache-v2';  // Changed to v2 to force update
const urlsToCache = [
    '/shoppingsite/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/yourorders.html',
    '/wishlists.html',
    '/contact.html',
    '/offline.html',
    '/index.css',
    '/offline.html',
    '/images/foodie hunter.png',
    '/images/foodielogo.png',
    '/images/paneer/palak-paneer.jpg',
    '/images/paneer/kadai-paneer.jpg',
    '/images/biryani/veg-biryani.jpg',
    '/images/dosa/masala-dosa.jpg',
    '/images/freedelevery.jpg',
    '/images/event.jpg',
    '/images/dine.jpg',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
];

// Install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache all URLs:', error);
            })
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                const fetchRequest = event.request.clone();
                return fetch(fetchRequest)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                    });
            })
    );
});

// Activate
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
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