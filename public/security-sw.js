/**
 * Service Worker para Segurança
 * 
 * Este worker fornece:
 * - Adição de cabeçalhos de segurança via fetch interception
 * - Cache de segurança
 * - Proteção básica contra ataques
 */

const CACHE_NAME = 'security-cache-v1';

// Interceptar requisições fetch
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Não interceptar requisições non-GET ou de outros domínios
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Responder com a cache primeiro, depois atualizar
  event.respondWith(
    (async function() {
      // Tentar obter da cache
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        // Se temos na cache, iniciar atualização em background
        event.waitUntil(updateCache(request, cache));
        return addSecurityHeaders(cachedResponse);
      }
      
      // Se não temos na cache, buscar da rede
      try {
        const networkResponse = await fetch(request);
        event.waitUntil(cache.put(request, networkResponse.clone()));
        
        return addSecurityHeaders(networkResponse);
      } catch (error) {
        // Falha na busca - verificar se temos alguma fallback na cache
        const fallbackResponse = await cache.match('/offline.html');
        if (fallbackResponse) {
          return fallbackResponse;
        }
        
        // Se não tiver fallback, retorna erro
        throw error;
      }
    })()
  );
});

// Atualiza a cache com uma nova cópia da requisição
async function updateCache(request, cache) {
  try {
    const response = await fetch(request);
    await cache.put(request, response);
    return true;
  } catch {
    return false;
  }
}

// Adiciona cabeçalhos de segurança a uma resposta
function addSecurityHeaders(response) {
  if (!response) return response;
  
  const newHeaders = new Headers(response.headers);
  
  // Content Security Policy
  newHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.supabase.io");
  
  // Prevenir XSS
  newHeaders.set('X-XSS-Protection', '1; mode=block');
  
  // Prevenir clickjacking
  newHeaders.set('X-Frame-Options', 'DENY');
  
  // Prevenir sniffing MIME
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissões
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

// Ao instalar, cache os recursos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/offline.html', // Página offline (deve ser criada)
        '/main.js',
        '/manifest.json',
        '/favicon.ico'
      ]);
    })
  );
  
  // Ativar imediatamente para substituir versões anteriores
  self.skipWaiting();
});

// Ao ativar, limpar caches antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  
  // Tomar controle imediatamente
  self.clients.claim();
}); 