const CACHE_NAME = 'lingoflow-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './db.js',
  './js/hangman.js',
  './js/learn.js',
  './js/main.js',
  './js/quiz-options.js',
  './js/quiz30.js',
  './js/dictionary.js',
  './js/storage.js',
  './icons/icon-512.png',
];

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});


// --- NUEVO: Elimina cachés viejas automáticamente cuando el Service Worker se actualiza ---
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('LingoFlow: Limpiando caché antigua...', cache);
            return caches.delete(cache); // Borra la version anterior
          }
        })
      );
    })
  );
});


// Estrategia: Stale-While-Revalidate (Muestra lo viejo rápido, actualiza en segundo plano)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(e.request).then(cachedResponse => {
        
        const fetchedResponse = fetch(e.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => null); // Si no hay internet, silencia el error y sigue

        return cachedResponse || fetchedResponse;
      });
    })
  );
});