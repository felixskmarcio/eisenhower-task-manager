/**
 * Service Worker Desabilitado - Arquivo de transição
 * 
 * Este arquivo substitui o service worker antigo para garantir que
 * os navegadores parem de usar o service worker problemático.
 * 
 * Em vez de processar requisições, apenas se desinstala automaticamente.
 */

self.addEventListener('install', (event) => {
  console.log('Service worker desabilitado - instalando...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker desabilitado - ativando e removendo caches...');
  
  // Remove todos os caches do service worker antigo
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Removendo cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Força o navegador a parar de usar este service worker
      return self.registration.unregister();
    })
  );
  
  self.clients.claim();
});

// Intercepta todas as requisições e as deixa passar sem processamento
self.addEventListener('fetch', (event) => {
  // Não faz nada - deixa a requisição seguir normalmente
  return;
});