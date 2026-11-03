
const CACHE_NAME = 'v1-cache-app';
const IMAGE_CACHE_NAME = 'imagenes-supabase-v1';
 
// Recursos estáticos que se guardarán en caché en la instalación
const STATIC_ASSETS = ['/']
 
// 1. Evento de Instalación: Pre-caché de recursos críticos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando recursos estáticos');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});
 
// 2. Evento de Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Mantenemos solo las cachés activas (App e Imágenes)
          if (cache !== CACHE_NAME && cache !== IMAGE_CACHE_NAME) {
            console.log('[SW] Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});
 
// 3. Evento Fetch: Manejo de Peticiones
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET o esquemas no soportados (ej. extensiones)
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;
 
  const url = new URL(event.request.url);
 
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/_next/image')
  ) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
        console.log('[SW] Imagen entregada desde caché:', event.request.url);
          return cachedResponse;
        }
 
        // Si no está, la buscamos en la red y la guardamos
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const responseToCache = networkResponse.clone();
            caches.open(IMAGE_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }
 
  //Network First (fallback to Cache) para el resto de la aplicación
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si falla la red, buscamos en la caché de la App
        return caches.match(event.request);
      })
  );
});
 