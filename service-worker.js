const CACHE_NAME = 'starfire-v57';
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
    './assets/boss 2.png',
    './assets/boss 3.png',
    './assets/boss 4.png',
    './assets/boss 5.png',
    './assets/boss 6.png',
    './assets/boss level 7.png',
    './assets/boss_8_sprite-removebg-preview.png',
    './assets/boss_9_sprite-removebg-preview.png',
    './assets/final boss level 10.png',
    './assets/enemy shoot.png',
    './assets/upgrade weapon.png',
    './assets/heal.png',
    './assets/heall.png',
    './assets/aste1-removebg-preview.png',
    './assets/aste2-removebg-preview.png',
    './assets/aste3-removebg-preview.png',
    './assets/aste4-removebg-preview.png',
    './assets/aste5-removebg-preview.png',
    './assets/aste6-removebg-preview.png'
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
