const CACHE_NAME = 'k50-foss-v1';
const ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './js/game.js',
    './js/audio.js',
    './data/words.json',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;900&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate Event - Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Cache First, Network Fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached asset if found
                if (cachedResponse) return cachedResponse;
                
                // Otherwise fetch from network
                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses or non-GET requests
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone response and cache it for future
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                });
            })
    );
});
