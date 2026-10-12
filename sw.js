// Offline: pliki aplikacji i lekcje najpierw z sieci (nowe pytania od razu), bez sieci z pamięci podręcznej.
// Krótkie nagrania (nagrania/*.mp3) idą prosto z sieci, bo odtwarzacz prosi o kawałki pliku; pełne nagrania
// z prywatnego repo trzyma osobna pamięć „biologoza-nagrania” (js/store.js), której ten plik nie czyści.
const CACHE = 'biologoza-v12';
const SHELL = ['./', 'index.html', 'styles.css', 'manifest.webmanifest', 'js/app.js', 'js/dom.js', 'js/gra.js', 'js/sprawdz.js',
  'js/store.js', 'js/dzwieki.js', 'zestawy/indeks.json', 'zestawy/spis.json', 'ikony/ikona-192.png', 'fonts/Jost.ttf', 'fonts/LibreBaskerville.ttf',
  'audio/przycisk.mp3', 'audio/wybor.mp3', 'audio/cofnij.mp3',
  'audio/dobra-odpowiedz-podstawowa.mp3', 'audio/zla-odpowiedz.mp3'];
const ZACHOWAJ = [CACHE, 'biologoza-nagrania'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => !ZACHOWAJ.includes(x)).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'api.github.com') return;
  if (url.origin !== location.origin) return;
  if (url.pathname.includes('/nagrania/')) return; // odtwarzacz sam rozmawia z siecią (zapytania Range)
  e.respondWith(fetch(req.url, { cache: 'no-cache' }).then((res) => {
    if (res.ok) { const kopia = res.clone(); caches.open(CACHE).then((c) => c.put(req, kopia)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
});
