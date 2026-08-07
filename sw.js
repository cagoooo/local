/* ==========================================================
   Service Worker — 本土語分班配對系統

   版本策略:BUILD_VERSION 每次部署都要變(跑 scripts/bump-version.ps1),
   sw.js 的 byte 不變 = 瀏覽器判定 byte-identical = 永遠不會偵測到新版,
   更新通知也就永遠不會出現。

   更新策略:prompt-to-refresh —— install 階段「不」呼叫 skipWaiting,
   讓新 SW 停在 waiting,由頁面跳出通知、使用者按下「重新整理載入」才套用。
   正在核對名單的老師不會被硬生生換版打斷。
   ========================================================== */
const BUILD_VERSION = '2026.08.07-2';
const CACHE = 'nlm-' + BUILD_VERSION;

// 本地資產(相對路徑,GitHub Pages 子路徑部署也正確)
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './favicon.ico',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './demo-new-roster.xlsx'
];

// 離線也要能配對名單,所以連 CDN 的 SheetJS / 字型一起 runtime cache。
// 這些主機都有正確 CORS,回應是 type:'cors' 可安全存進 Cache Storage
// (opaque 回應 size 為 0,存了等於存壞檔,見下方判斷)。
const CDN_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  // 注意:這裡刻意不呼叫 skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(PRECACHE.map(u => c.add(u).catch(() => {})))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('nlm-') && k !== CACHE).map(k => caches.delete(k))
    );
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach(c => c.postMessage({ type: 'SW_ACTIVATED', version: BUILD_VERSION }));
  })());
});

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  // 頁面問「你是哪一版?」— 用來做版本閘門,避免對同一版重複跳通知
  if (data.type === 'GET_VERSION' && event.ports && event.ports[0]) {
    event.ports[0].postMessage({ type: 'VERSION', version: BUILD_VERSION });
  }
});

function putIfCacheable(req, res) {
  if (!res || res.status !== 200) return res;
  if (res.type !== 'basic' && res.type !== 'cors') return res; // opaque 不存
  const copy = res.clone();
  caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
  return res;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && CDN_HOSTS.indexOf(url.hostname) === -1) return; // 其他跨域不攔

  // version.json:永遠拿最新,離線才退回快取
  if (url.pathname.endsWith('version.json')) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // HTML:network-first,確保部署後拿得到新版頁面
  const wantsHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;
  if (sameOrigin && wantsHTML) {
    event.respondWith(
      fetch(req)
        .then(res => putIfCacheable(req, res))
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // 其他資源(含 CDN):cache-first + 背景更新
  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req)
        .then(res => putIfCacheable(req, res))
        .catch(() => cached);
      return cached || network;
    })
  );
});
