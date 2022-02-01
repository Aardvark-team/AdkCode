const cacheName = 'my-cache';
const filestoCache = [
  '/',
  '/js/preferences.js',
  '/index.html',
  '/js/editor/aardvark.js',
  '/css/main.css',
  '/js/editor/topbar.js',
  '/img/logo.png',
  '/img/aardvark.svg',
  '/img/files.svg',
  '/img/files-selected.png'
]; 
// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event 
// typically used to cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache))
  );
});

// the fetch event handler, to intercept requests and serve all 
// static assets from the cache
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
    .then(response => response ? response : fetch(e.request))
  )
});