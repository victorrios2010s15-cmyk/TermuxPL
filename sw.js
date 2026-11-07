const CACHE_NAME = 'devsuite-v8'; // Cambia la versión si haces cambios grandes

// Instalación: Forzar la activación inmediata
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activación: Borrar cachés viejos automáticamente
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Borrando caché antiguo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar peticiones para servir siempre la versión más reciente
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

