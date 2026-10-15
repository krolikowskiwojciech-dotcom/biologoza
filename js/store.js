// Stan w przeglądarce i synchronizacja prób z prywatnym repo biologoza-dane (jak w Lingozie: GitHub API + token).
// Każde dziecko ma plik profile/<id>.json = { id, proby: [...], u }. Próby się tylko dopisują, więc scalanie
// dwóch kopii to suma bez powtórzeń (po id próby).

export const LS = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* tryb prywatny */ } },
};

export const REPO_DANYCH = 'krolikowskiwojciech-dotcom/biologoza-dane';
const API = 'https://api.github.com';
const BRAK_REPO = 'Token nie widzi repozytorium biologoza-dane. W ustawieniach tokenu na GitHubie: Repository access → Only select repositories → dodaj biologoza-dane.';
const BRAK_ZAPISU = 'Token widzi repozytorium, ale nie może w nim zapisywać. W ustawieniach tokenu: Permissions → Repositories → Contents → Read and write.';

export const profil = () => LS.get('bz.profil');
export const ustawProfil = (id) => (id ? LS.set('bz.profil', id) : LS.del('bz.profil'));
export const dzwiek = () => LS.get('bz.dzwiek', true);
export const ustawDzwiek = (v) => LS.set('bz.dzwiek', v);
export const token = () => LS.get('bz.token');
export const ustawToken = (t) => (t ? LS.set('bz.token', t) : LS.del('bz.token'));

export const proby = (id) => LS.get('bz.proby.' + id, []);
const zapiszProby = (id, lista) => LS.set('bz.proby.' + id, lista.slice(-500));

export function dodajProbe(id, proba) {
  zapiszProby(id, [...proby(id), proba]);
}

// najlepsza i ostatnia próba danego zestawu (całego, nie pojedynczego bloku)
export function wynikiZestawu(id, zestaw) {
  const lista = proby(id).filter((p) => p.zestaw === zestaw && !p.tylkoBlok);
  return { ostatnia: lista[lista.length - 1] || null, ile: lista.length };
}

function scal(a = [], b = []) {
  const m = new Map();
  for (const p of [...a, ...b]) m.set(p.id, p);
  return [...m.values()].sort((x, y) => x.d - y.d);
}

const enc = (str) => {
  const bytes = new TextEncoder().encode(str);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const dec = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

async function gh(path, opts = {}) {
  const r = await fetch(API + path, {
    cache: 'no-store', ...opts,
    headers: { Authorization: `Bearer ${token()}`, Accept: 'application/vnd.github+json', ...(opts.headers || {}) },
  });
  if (r.status === 401) throw new Error('Token jest nieprawidłowy albo wygasł.');
  return r;
}

// pobiera plik profilu, scala z lokalnymi próbami i odsyła, jeśli coś doszło
export async function synchronizuj(id) {
  if (!token() || !id) return { stan: 'wylaczona' };
  const plik = `/repos/${REPO_DANYCH}/contents/profile/${id}.json`;
  for (let proba = 0; proba < 3; proba++) {
    if (proba === 0) {
      const repo = await gh(`/repos/${REPO_DANYCH}`);
      if (repo.status === 404 || repo.status === 403) throw new Error(BRAK_REPO);
    }
    const r = await gh(plik);
    if (!r.ok && r.status !== 404) throw new Error(r.status === 403 ? BRAK_REPO : `GitHub: błąd ${r.status}`);
    const j = r.ok ? await r.json() : null;
    const zdalne = j ? JSON.parse(dec(j.content || '') || 'null') : null;
    const razem = scal(zdalne?.proby, proby(id));
    zapiszProby(id, razem);
    if (zdalne && zdalne.proby.length === razem.length) return { stan: 'ok' };
    const body = { message: `Biologoza: wyniki ${id}`, content: enc(JSON.stringify({ id, proby: razem, u: Date.now() }) + '\n') };
    if (j?.sha) body.sha = j.sha;
    const w = await gh(plik, { method: 'PUT', body: JSON.stringify(body) });
    if (w.status === 409 || w.status === 422) continue;
    if (!w.ok) throw new Error(w.status === 403 || w.status === 404 ? BRAK_ZAPISU : `GitHub: błąd ${w.status} przy zapisie`);
    return { stan: 'ok' };
  }
  throw new Error('Nie udało się zapisać wyników (konflikt). Spróbuj za chwilę.');
}

// pełne nagrania (blisko tekstu podręcznika) leżą tylko w prywatnym repo — pobieramy je tokenem
// i trzymamy w pamięci podręcznej telefonu, żeby drugi raz grały bez sieci
const CACHE_NAGRAN = 'biologoza-nagrania';
// klucz zawiera wersję pliku: po ponownym nagraniu (np. w nowszym modelu) telefon pobiera nowy plik, a stary usuwa
const kluczNagrania = (sciezka, wersja) => `https://prywatne.biologoza/${sciezka}${wersja ? '?v=' + wersja : ''}`;
// jedno pobieranie na plik naraz (w tle po wejściu w lekcję i po dotknięciu „odtwórz” to ta sama obietnica);
// postęp idzie zdarzeniem „bz-postep” { klucz, ile: 0–1 }, żeby odtwarzacz pokazał procenty
const wTrakcie = new Map();
export const kluczPostepu = kluczNagrania;
export function nagraniePrywatne(sciezka, wersja) {
  const klucz = kluczNagrania(sciezka, wersja);
  if (!wTrakcie.has(klucz)) {
    const p = pobierzNagranie(sciezka, wersja, klucz).finally(() => wTrakcie.delete(klucz));
    wTrakcie.set(klucz, p);
  }
  return wTrakcie.get(klucz);
}
async function pobierzNagranie(sciezka, wersja, klucz) {
  try {
    const c = await caches.open(CACHE_NAGRAN);
    const jest = await c.match(klucz);
    if (jest) return jest.blob();
    for (const r of await c.keys()) if (r.url.split('?')[0] === klucz.split('?')[0]) await c.delete(r); // starsze wersje
  } catch { /* brak Cache Storage */ }
  if (!token()) throw new Error('Pełne nagranie jest prywatne. Wklej token w Ustawieniach, żeby je odtworzyć.');
  const r = await gh(`/repos/${REPO_DANYCH}/contents/${sciezka.split('/').map(encodeURIComponent).join('/')}`, { headers: { Accept: 'application/vnd.github.raw' } });
  if (r.status === 404 || r.status === 403) throw new Error('Nie widzę tego nagrania w prywatnym repozytorium. Sprawdź token w Ustawieniach.');
  if (!r.ok) throw new Error(`GitHub: błąd ${r.status} przy pobieraniu nagrania`);
  const razem = Number(r.headers.get('content-length')) || 0;
  const kawalki = [];
  let mam = 0;
  const czytnik = r.body?.getReader?.();
  if (czytnik) {
    for (;;) {
      const { done, value } = await czytnik.read();
      if (done) break;
      kawalki.push(value); mam += value.length;
      if (razem) window.dispatchEvent(new CustomEvent('bz-postep', { detail: { klucz, ile: Math.min(1, mam / razem) } }));
    }
  } else kawalki.push(new Uint8Array(await r.arrayBuffer()));
  const blob = new Blob(kawalki, { type: 'audio/mpeg' });
  try { await (await caches.open(CACHE_NAGRAN)).put(klucz, new Response(blob, { headers: { 'Content-Type': 'audio/mpeg' } })); } catch { /* pełna pamięć */ }
  return blob;
}
export async function maNagranie(sciezka, wersja) {
  try { return !!(await (await caches.open(CACHE_NAGRAN)).match(kluczNagrania(sciezka, wersja))); } catch { return false; }
}
