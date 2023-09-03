const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');



precacheAndRoute(self.__WB_MANIFEST); 
//^^this is allows pwa to work offline by caching all the assets and setting up the routes

//Cache strategy, create
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    // plugin for cache functionality either 0 (offline) or 200 (online)
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      //sets experations time on cache response (for how long it is stored)
      maxAgeSeconds: 30 * 24 * 60 * 60, //30 days
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});
//registering application with workbox
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching

registerRoute(
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

