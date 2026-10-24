// Stan w przeglądarce i synchronizacja prób z prywatnym repo biologoza-dane (jak w Lingozie: GitHub API + token).
// Każde dziecko ma plik profile/<id>.json = { id, proby: [...], u }. Próby się tylko dopisują, więc scalanie
// dwóch kopii to suma bez powtórzeń (po id próby).
//
// Dwa tryby:
// - github.io: token GitHub wklejony raz w Ustawieniach, zapytania prosto do api.github.com;
// - *.ogarnijmaterial.pl: osoba zalogowana PIN-em na ogarnijmaterial.pl (ciasteczko na całą domenę), zapytania
//   przez pośrednika https://ogarnijmaterial.pl/api/gh/… (token siedzi na serwerze, telefon go nie zna).
//   Na 127.0.0.1/localhost tryb da się udawać parametrem ?test-ogarnij=julian|aniela|401 (bez sieci, do renderów).

export const LS = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* tryb prywatny */ } },
};

export const REPO_DANYCH = 'krolikowskiwojciech-dotcom/biologoza-dane';

// ---------- tryb ogarnijmaterial.pl ----------
export const STRONA_GLOWNA = 'https://ogarnijmaterial.pl/';
export const ZMIEN_OSOBE = 'https://ogarnijmaterial.pl/#konta';
const LOKALNIE = ['127.0.0.1', 'localhost'].includes(location.hostname);
const TEST = LOKALNIE ? new URLSearchParams(location.search).get('test-ogarnij') : null; // tylko do renderów na 127.0.0.1
export const OGARNIJ = location.hostname.endsWith('ogarnijmaterial.pl') || !!TEST;
const API = OGARNIJ ? 'https://ogarnijmaterial.pl/api/gh' : 'https://api.github.com';
// konto na ogarnijmaterial.pl → profil w Biologii (przedmiot jest tylko Julka)
export const PROFIL_KONTA = { julian: 'julek' };
export const OSOBY = { julian: 'Julek', aniela: 'Aniela', wojtek: 'Wojtek', magda: 'Magda' };

// kto jest zalogowany na ogarnijmaterial.pl: { stan: 'ok', id } | { stan: 'brak' } (401) | { stan: 'offline', id? }
export async function kto() {
  if (TEST) return TEST === '401' ? { stan: 'brak' } : { stan: 'ok', id: TEST };
  try {
    const r = await fetch('https://ogarnijmaterial.pl/api/ja', { credentials: 'include', cache: 'no-store' });
    if (r.status === 401) { LS.del('bz.ogarnij.ja'); return { stan: 'brak' }; }
    if (!r.ok) throw new Error('błąd ' + r.status);
    const { id } = await r.json();
    LS.set('bz.ogarnij.ja', id);
    return { stan: 'ok', id };
  } catch {
    return { stan: 'offline', id: LS.get('bz.ogarnij.ja') }; // bez sieci: ostatnia znana osoba
  }
}

const BRAK_REPO = OGARNIJ ? 'Pośrednik ogarnijmaterial.pl nie widzi repozytorium biologoza-dane (token na serwerze).'
  : 'Token nie widzi repozytorium biologoza-dane. W ustawieniach tokenu na GitHubie: Repository access → Only select repositories → dodaj biologoza-dane.';
const BRAK_ZAPISU = OGARNIJ ? 'Pośrednik ogarnijmaterial.pl widzi repozytorium, ale nie może w nim zapisywać (uprawnienia tokenu na serwerze).'
  : 'Token widzi repozytorium, ale nie może w nim zapisywać. W ustawieniach tokenu: Permissions → Repositories → Contents → Read and write.';

export const profil = () => LS.get('bz.profil');
export const ustawProfil = (id) => (id ? LS.set('bz.profil', id) : LS.del('bz.profil'));
export const dzwiek = () => LS.get('bz.dzwiek', true);
export const ustawDzwiek = (v) => LS.set('bz.dzwiek', v);
export const token = () => LS.get('bz.token');
export const ustawToken = (t) => (t ? LS.set('bz.token', t) : LS.del('bz.token'));
// czy wolno rozmawiać z danymi: na ogarnijmaterial.pl wystarcza zalogowanie (sprawdzone przy starcie), na github.io token
export const maDostep = () => (OGARNIJ ? !TEST : !!token());

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
  if (TEST) throw new Error('Tryb testowy: bez połączenia z danymi.');
  const r = await fetch(API + path, OGARNIJ
    ? { cache: 'no-store', credentials: 'include', ...opts, headers: { Accept: 'application/vnd.github+json', ...(opts.headers || {}) } }
    : { cache: 'no-store', ...opts, headers: { Authorization: `Bearer ${token()}`, Accept: 'application/vnd.github+json', ...(opts.headers || {}) } });
  if (r.status === 401) throw new Error(OGARNIJ ? 'Nie jesteś zalogowany na ogarnijmaterial.pl. Wejdź tam i wybierz osobę.' : 'Token jest nieprawidłowy albo wygasł.');
  return r;
}
const sciezkaPliku = (sciezka) => `/repos/${REPO_DANYCH}/contents/${sciezka.split('/').map(encodeURIComponent).join('/')}`;

// pobiera plik profilu, scala z lokalnymi próbami i odsyła, jeśli coś doszło
export async function synchronizuj(id) {
  if (!maDostep() || !id) return { stan: 'wylaczona' };
  const plik = `/repos/${REPO_DANYCH}/contents/profile/${id}.json`;
  for (let proba = 0; proba < 3; proba++) {
    if (proba === 0) {
      const repo = await gh(`/repos/${REPO_DANYCH}`);
      if (repo.status === 404 || repo.status === 403) throw new Error(BRAK_REPO);
    }
    const r = await gh(plik);
    if (!r.ok && r.status !== 404) throw new Error(r.status === 403 ? BRAK_REPO : `${OGARNIJ ? 'Serwer' : 'GitHub'}: błąd ${r.status}`);
    const j = r.ok ? await r.json() : null;
    const zdalne = j ? JSON.parse(dec(j.content || '') || 'null') : null;
    const razem = scal(zdalne?.proby, proby(id));
    zapiszProby(id, razem);
    if (zdalne && zdalne.proby.length === razem.length) return { stan: 'ok' };
    const body = { message: `Biologia: wyniki ${id}`, content: enc(JSON.stringify({ id, proby: razem, u: Date.now() }) + '\n') };
    if (j?.sha) body.sha = j.sha;
    const w = await gh(plik, { method: 'PUT', body: JSON.stringify(body) });
    if (w.status === 409 || w.status === 422) continue;
    if (!w.ok) throw new Error(w.status === 403 || w.status === 404 ? BRAK_ZAPISU : `${OGARNIJ ? 'Serwer' : 'GitHub'}: błąd ${w.status} przy zapisie`);
    return { stan: 'ok' };
  }
  throw new Error('Nie udało się zapisać wyników (konflikt). Spróbuj za chwilę.');
}

// pełne nagrania (blisko tekstu podręcznika) leżą tylko w prywatnym repo — pobieramy je tokenem albo przez pośrednika
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
  if (!maDostep()) throw new Error(OGARNIJ ? 'Pełne nagranie jest prywatne — potrzebne zalogowanie na ogarnijmaterial.pl.' : 'Pełne nagranie jest prywatne. Wklej token w Ustawieniach, żeby je odtworzyć.');
  const r = await gh(sciezkaPliku(sciezka) + (OGARNIJ ? '?raw=1' : ''), { headers: { Accept: 'application/vnd.github.raw' } }); // ?raw=1: surowy plik z serwera ogarnijmaterial
  if (r.status === 404 || r.status === 403) throw new Error(OGARNIJ ? 'Nie widzę tego nagrania w prywatnym repozytorium.' : 'Nie widzę tego nagrania w prywatnym repozytorium. Sprawdź token w Ustawieniach.');
  if (!r.ok) throw new Error(`${OGARNIJ ? 'Serwer' : 'GitHub'}: błąd ${r.status} przy pobieraniu nagrania`);
  const razem = Number(r.headers.get('content-length')) || 0;
  const kawalki = [];
  let mam = 0;
  const czytnik = r.body?.getReader?.();
  if (czytnik) {
    for (;;) {
      const { done, value } = await czytnik.read();
      if (done) break;
      kawalki.push(value); mam += value.length;
      // bez rozmiaru (pośrednik może go nie podać) pokazujemy pobrane megabajty
      window.dispatchEvent(new CustomEvent('bz-postep', { detail: { klucz, ile: razem ? Math.min(1, mam / razem) : null, mb: mam / 1048576 } }));
    }
  } else kawalki.push(new Uint8Array(await r.arrayBuffer()));
  const blob = new Blob(kawalki, { type: 'audio/mpeg' });
  try { await (await caches.open(CACHE_NAGRAN)).put(klucz, new Response(blob, { headers: { 'Content-Type': 'audio/mpeg' } })); } catch { /* pełna pamięć */ }
  window.dispatchEvent(new CustomEvent('bz-postep', { detail: { klucz, ile: 1, mb: blob.size / 1048576 } }));
  return blob;
}
export async function maNagranie(sciezka, wersja) {
  try { return !!(await (await caches.open(CACHE_NAGRAN)).match(kluczNagrania(sciezka, wersja))); } catch { return false; }
}

// strumień (tylko ogarnijmaterial.pl): serwer trzyma dane w Cloudflare KV (bez GitHuba i tokenów) i podaje przy pliku
// download_url = https://ogarnijmaterial.pl/api/gh/…/contents/<ścieżka>?raw=1 — surowe audio/mpeg z obsługą Range (206),
// a ciasteczko sesji leci samo w <audio src> (ta sama witryna). <audio> zaczyna więc grać po pierwszych sekundach zamiast
// czekać na całe 8 MB. Gdy adres jest inny albo go brak — null (wtedy pobieramy w całości, z postępem).
export async function adresStrumienia(sciezka) {
  if (!OGARNIJ || !maDostep()) return null;
  try {
    const r = await gh(sciezkaPliku(sciezka));
    if (!r.ok) return null;
    const url = (await r.json()).download_url;
    return typeof url === 'string' && url.startsWith(STRONA_GLOWNA) ? url : null;
  } catch { return null; }
}

// diagnostyka „Sprawdź nagrania” (Ustawienia): każdy krok osobno, z czytelnym wynikiem — żeby na cudzym urządzeniu
// było widać, czy problem jest w logowaniu/tokenie, dostępie, pliku, szybkości łącza czy w odtwarzaniu
export async function sprawdzNagrania(sciezka, wypisz) {
  if (OGARNIJ) {
    const k = await kto();
    if (k.stan !== 'ok') {
      wypisz('zle', k.stan === 'brak' ? 'Logowanie: nikt nie jest zalogowany na ogarnijmaterial.pl — wejdź tam i wybierz osobę.' : 'Logowanie: brak połączenia z ogarnijmaterial.pl.');
      return;
    }
    wypisz(PROFIL_KONTA[k.id] ? 'ok' : 'zle', `Zalogowano jako ${OSOBY[k.id] || k.id} (ogarnijmaterial.pl)` + (PROFIL_KONTA[k.id] ? '' : ' — to nie jest konto Julka.'));
    if (!PROFIL_KONTA[k.id]) return;
  } else {
    const t = token();
    wypisz(t ? 'ok' : 'zle', t ? `Token na tym urządzeniu: jest (${t.slice(0, 11)}…)` : 'Token na tym urządzeniu: BRAK — wklej go wyżej i stuknij „Włącz”.');
    if (!t) return;
  }
  try {
    const repo = await gh(`/repos/${REPO_DANYCH}`);
    wypisz(repo.ok ? 'ok' : 'zle', repo.ok ? 'Dostęp do repozytorium biologoza-dane: jest' : `Dostęp do repozytorium: BRAK (błąd ${repo.status}). ${BRAK_REPO}`);
    if (!repo.ok) return;
    const sc = sciezkaPliku(sciezka);
    const meta = await gh(sc);
    if (!meta.ok) { wypisz('zle', `Plik nagrania: nie widać go (błąd ${meta.status}).`); return; }
    const { size: rozmiar, download_url: adres } = await meta.json();
    wypisz('ok', `Plik nagrania: jest (${(rozmiar / 1048576).toFixed(1)} MB)`);
    if (OGARNIJ) {
      const strumien = typeof adres === 'string' && adres.startsWith(STRONA_GLOWNA);
      if (!strumien) wypisz('uwaga', 'Odtwarzanie od razu (strumień): niedostępne — nagranie pobierze się w całości przed odtworzeniem.');
      else {
        const t0 = performance.now();
        // to samo, o co poprosi odtwarzacz: kawałek pliku (Range) z ciasteczkiem sesji
        const st = await fetch(adres, { headers: { Range: 'bytes=0-131071' }, credentials: 'include', cache: 'no-store' }).catch(() => null);
        const kawalek = st?.status === 206;
        if (st?.ok) await st.arrayBuffer();
        const s = ((performance.now() - t0) / 1000).toFixed(1);
        wypisz(kawalek ? 'ok' : st?.ok ? 'uwaga' : 'zle', kawalek ? `Odtwarzanie od razu (strumień): działa — pierwszy kawałek po ${s} s`
          : st?.ok ? `Odtwarzanie od razu (strumień): serwer oddaje cały plik zamiast kawałka (${st.status}) — iPhone może nie przewijać.`
            : `Odtwarzanie od razu (strumień): nie wyszło (${st ? 'błąd ' + st.status : 'brak połączenia'}) — nagranie pobierze się w całości przed odtworzeniem.`);
      }
    }
    const t0 = performance.now();
    const pr = await gh(sc + (OGARNIJ ? '?raw=1' : ''), { headers: { Accept: 'application/vnd.github.raw' } });
    if (!pr.ok) { wypisz('zle', `Pobieranie: błąd ${pr.status}.`); return; }
    const bajty = (await pr.arrayBuffer()).byteLength;
    const s = (performance.now() - t0) / 1000;
    wypisz(bajty < rozmiar * 0.98 ? 'zle' : s > 90 ? 'uwaga' : 'ok', bajty < rozmiar * 0.98
      ? `Pobieranie: przerwane (${(bajty / 1048576).toFixed(1)} z ${(rozmiar / 1048576).toFixed(1)} MB).`
      : `Pobieranie na telefon (do słuchania bez sieci): całe nagranie w ${Math.round(s)} s`);
  } catch (e) {
    wypisz('zle', `Połączenie z ${OGARNIJ ? 'ogarnijmaterial.pl' : 'GitHubem'} nie wyszło: ${e.message}`);
    return;
  }
  try {
    const c = await caches.open(CACHE_NAGRAN);
    wypisz('ok', `Pamięć na nagrania: działa (zapisanych: ${(await c.keys()).length})`);
  } catch (e) { wypisz('uwaga', `Pamięć na nagrania niedostępna (${e.message}) — nagranie zagra, ale za każdym razem pobierze się od nowa.`); }
}
