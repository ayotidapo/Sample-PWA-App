/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable func-names */
// Flag for enabling cache in production
const doCache = true;

const CACHE_NAME = 'pwa-app-cache';

// Delete old caches...
self.addEventListener('activate', event => {
  const currentCachelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (!currentCachelist.includes(key)) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

// This triggers when user starts the app
self.addEventListener('install', e => {
  console.log('installing service worker!!');
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache
        .addAll([`/`, `/index.html`, `/static/js/bundle.js`])
        .then(() => self.skipWaiting());
    }),
  );
});

// Here we intercept request and serve up the matching files
// self.addEventListener('fetch', function(event) {
//   if (doCache) {
//     event.respondWith(
//       caches.match(event.request).then(function(response) {
//         return response || fetch(event.request);
//       }),
//     );
//   }
// });

self.addEventListener('fetch', function(event) {
  console.log(`fetching ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});
