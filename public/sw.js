// Basic service worker for PWA
self.addEventListener('install', (event) => {
  console.log('Service worker installing');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating');
});

self.addEventListener('fetch', (event) => {
  // For now, just pass through all requests
  // In a real PWA, you might cache static assets
  event.respondWith(fetch(event.request));
});