const CACHE_NAME = 'starfire-v14';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './assets/sprites.png',
    './assets/player sprite first.png',
    './assets/scout.png',
    './assets/fighter.png',
    './assets/interceptor sprites.png',
    './assets/tank.png',
    './assets/player bullet.png',
    './assets/boss 1.png',
    './assets/boss 2.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
