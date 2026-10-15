// Ekrany Biologozy: lista lekcji (działami), lekcja (nagrania, ćwiczenia, ściąga), ćwiczenie, ustawienia.
// Adresy: #/ (start), #/z/<id> (lekcja), #/z/<id>/sciaga, #/ustawienia.

import { h, okno, odm, ik, maskotka, kolor, IKONY_BIO, obrazDzialu, obrazLekcji, ilustracja } from './dom.js';
import { uruchom } from './gra.js';
import * as S from './store.js';
import { graj, przygotujDzwieki } from './dzwieki.js';

const app = document.getElementById('app');
let indeks = null;
let spis = null; // układ podręcznika: działy i lekcje (zestawy/spis.json)
const zestawyCache = {};
let biezacaGra = null;
let odtwarzacz = null; // odtwarzacz, do którego należy teraz wspólny glosnik (jedno nagranie naraz)

async function wczytajIndeks() {
  const r = await fetch('zestawy/indeks.json', { cache: 'no-cache' });
  indeks = await r.json();
  return indeks;
}
async function wczytajZestaw(id) {
  if (!zestawyCache[id]) {
    const r = await fetch(`zestawy/${encodeURIComponent(id)}.json`, { cache: 'no-cache' });
    if (!r.ok) throw new Error('Nie ma takiej lekcji.');
    zestawyCache[id] = await r.json();
  }
  return zestawyCache[id];
}

const profilInfo = (id = S.profil()) => indeks?.profile.find((p) => p.id === id);
const dataPL = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
const dniDo = (iso) => Math.round((new Date(iso + 'T12:00:00') - new Date(new Date().toDateString() + ' 12:00')) / 864e5);
const ikonaZestawu = (z, i) => z.ikona || IKONY_BIO[i % IKONY_BIO.length];
const kolorZestawu = (z, i) => (z.kolor ? 'kolor-' + z.kolor : kolor(i));
const babel = (nazwa, klasa = 'kp-emoji') => h('span', { class: klasa + ' babel-bio', 'aria-hidden': 'true' }, ik(nazwa));
const etykietaTerminu = (dni, iso) => (dni === 0 ? 'kartkówka dziś!' : dni === 1 ? 'kartkówka jutro' : `kartkówka ${dataPL(iso)}`);

function naglowek() {
  const p = profilInfo();
  return h('header', { class: 'naglowek' },
    h('a', { class: 'avatar serif', href: '#/ustawienia', 'aria-label': 'Ustawienia' }, p.znak),
    h('div', { class: 'naglowek-txt' }, h('b', {}, p.imie), h('small', { class: 'maly' }, `biologia · klasa ${p.klasa}`)),
    h('a', { class: 'ikona-btn', href: '#/ustawienia', 'aria-label': 'Ustawienia' }, ik('zebatka')));
}

// ---------- start: kto się uczy? (przy jednym profilu wybór robi się sam) ----------
function ekranWyboru() {
  app.replaceChildren(
    h('main', { class: 'ekran profile-wybor' },
      h('div', { class: 'logo serif' }, 'Bio', h('em', {}, 'logoza')),
      maskotka('czesc', 'maskotka-powitanie'),
      h('h1', { class: 'serif' }, 'Kto dziś się ', h('em', {}, 'uczy'), '?'),
      h('div', { class: 'profile-siatka' }, indeks.profile.map((p, i) => h('button', {
        class: `profil-kafel ${kolor(i)}`, type: 'button',
        onclick: () => { S.ustawProfil(p.id); location.hash = '#/'; render(); },
      }, h('span', { class: 'profil-avatar serif' }, p.znak), h('b', {}, p.imie), h('small', {}, `klasa ${p.klasa}`))))));
}

// ---------- lista lekcji: działy z podręcznika (zestawy/spis.json), w nich lekcje po kolei ----------
const KOLORY_DZIALOW = ['kolor-lila', 'kolor-mietowy', 'kolor-zolty', 'kolor-brzoskwinia', 'kolor-niebieski', 'kolor-rozowy'];
const rozwiniete = new Map(); // nr działu → rozwinięty? (na czas otwartej aplikacji)

function ekranListy() {
  const p = profilInfo();
  const moje = indeks.zestawy.filter((z) => z.dla.includes(p.id));
  const pilne = moje.filter((z) => z.termin && dniDo(z.termin) >= 0).sort((a, b) => a.termin.localeCompare(b.termin));
  const wSpisie = new Set();
  const dzialy = (spis?.dzialy || []).map((d, i) => {
    const pozycje = d.lekcje.map((l) => {
      const z = moje.find((x) => x.dzial === d.nr && (l.typ ? x.typ === l.typ : !x.typ && x.lekcja === l.nr));
      if (z) wSpisie.add(z.id);
      return { ...l, z };
    });
    return { ...d, pozycje, kolor: KOLORY_DZIALOW[i % KOLORY_DZIALOW.length], gotowe: pozycje.filter((x) => x.z).length };
  });
  const inne = moje.filter((z) => !wSpisie.has(z.id) && !pilne.includes(z));

  let nr = 0;
  const karta = (z) => {
    const i = nr++;
    const { ostatnia, ile } = S.wynikiZestawu(p.id, z.id);
    const dni = z.termin ? dniDo(z.termin) : null;
    return h('a', { class: `karta-pakietu ${kolorZestawu(z, i)}`, href: '#/z/' + encodeURIComponent(z.id) },
      h('div', { class: 'kp-gora' }, babel(ikonaZestawu(z, i)),
        h('div', { class: 'kp-txt' },
          z.termin && dni >= 0 ? h('span', { class: 'termin' + (dni <= 1 ? ' pilne' : '') }, etykietaTerminu(dni, z.termin)) : null,
          h('div', { class: 'kp-tytul serif' }, z.tytul))),
      h('div', { class: 'kp-dol' },
        h('span', { class: 'kp-ikony' }, h('span', { class: 'kp-ikona' }, ik('ptaszek'), `${z.zadan} ${odm(z.zadan, 'pytanie', 'pytania', 'pytań')}`)),
        ostatnia ? h('span', { class: 'poz-status zna' }, `ostatnio ${ostatnia.dobrze}/${ostatnia.ile}` + (ile > 1 ? ` · ${ile}×` : '')) : null));
  };

  const wiersz = (l) => {
    const z = l.z;
    const obraz = ilustracja(obrazLekcji(dzialTeraz, l.nr, l.typ), 'lek-obraz');
    const nrEl = h('span', { class: 'lek-miniatura' }, obraz,
      l.typ ? null : h('span', { class: 'lek-nr serif' }, l.nr));
    if (!z) {
      return h('div', { class: 'lek-wiersz wkrotce' }, nrEl,
        h('span', { class: 'lek-txt' }, h('b', {}, l.temat), h('small', {}, `s. ${l.strony}`)),
        h('span', { class: 'lek-wkrotce' }, 'wkrótce'));
    }
    const { ostatnia } = S.wynikiZestawu(p.id, z.id);
    return h('a', { class: 'lek-wiersz', href: '#/z/' + encodeURIComponent(z.id) }, nrEl,
      h('span', { class: 'lek-txt' }, h('b', {}, z.tytul),
        h('small', { class: 'lek-meta' }, h('span', {}, `s. ${z.strony || l.strony}`),
          z.nagrania ? h('span', { class: 'kp-ikona' }, ik('sluchawki'), z.nagrania) : null,
          h('span', { class: 'kp-ikona' }, ik('ptaszek'), z.zadan),
          z.sciaga ? h('span', { class: 'kp-ikona' }, ik('sciaga')) : null)),
      ostatnia ? h('span', { class: 'poz-status zna' }, `${ostatnia.dobrze}/${ostatnia.ile}`) : h('span', { class: 'lek-strzalka' }, ik('dalej')));
  };

  let dzialTeraz = null; // wiersz lekcji potrzebuje numeru działu do ścieżki ilustracji
  const blokDzialu = (d) => {
    dzialTeraz = d.nr;
    if (!rozwiniete.has(d.nr)) rozwiniete.set(d.nr, d.gotowe > 0);
    const sek = h('section', { class: `dzial ${d.kolor}` + (rozwiniete.get(d.nr) ? ' otwarty' : '') });
    const gora = h('button', { class: 'dzial-gora', type: 'button', 'aria-expanded': String(rozwiniete.get(d.nr)),
      onclick: () => { const o = !rozwiniete.get(d.nr); rozwiniete.set(d.nr, o); sek.classList.toggle('otwarty', o); gora.setAttribute('aria-expanded', String(o)); } },
      h('span', { class: 'dzial-obraz' }, ilustracja(obrazDzialu(d.nr)), h('span', { class: 'dzial-nr serif' }, d.nr)),
      h('span', { class: 'dzial-txt' },
        h('small', {}, `Dział ${d.nr}`),
        h('b', { class: 'serif' }, d.tytul),
        h('span', { class: 'dzial-meta' }, d.gotowe ? `gotowe ${d.gotowe} z ${d.pozycje.length}` : 'lekcje wkrótce')),
      h('span', { class: 'dzial-strzalka', 'aria-hidden': 'true' }, ik('dalej')));
    sek.append(gora, h('div', { class: 'dzial-lekcje' }, d.pozycje.map(wiersz)));
    return sek;
  };

  app.replaceChildren(
    h('main', { class: 'ekran' },
      naglowek(),
      h('div', { class: 'tytul-wiersz' },
        h('h1', { class: 'tytul serif' }, 'Czego dziś się ', h('em', {}, 'uczymy'), '?'),
        maskotka('czesc', 'maskotka-glowna')),
      pilne.length ? [h('div', { class: 'sekcja' }, 'Przed kartkówką'), h('div', { class: 'lista-pakietow' }, pilne.map(karta))] : null,
      h('div', { class: 'dzialy' }, dzialy.map(blokDzialu)),
      inne.length ? [h('div', { class: 'sekcja' }, 'Inne zestawy'), h('div', { class: 'lista-pakietow' }, inne.map(karta))] : null));
}

// ---------- lekcja ----------
async function ekranZestawu(id) {
  const z = await wczytajZestaw(id);
  const p = profilInfo();
  const nr = Math.max(0, kolejnoscKart().findIndex((x) => x.id === z.id));
  const { ostatnia, ile } = S.wynikiZestawu(p.id, z.id);
  const graj1 = (bloki, extra = {}) => startGry(z, bloki, extra);
  const dni = z.termin ? dniDo(z.termin) : null;
  const zadan = z.bloki.reduce((n, b) => n + (b.ile || b.zadania?.length || 0), 0);
  app.replaceChildren(
    h('main', { class: 'ekran' },
      h('section', { class: `naglowek-dzialu ${kolorZestawu(z, nr)}` },
        h('a', { class: 'wstecz', href: '#/', 'aria-label': 'Wróć' }, ik('wstecz')),
        obrazLekcji(z.dzial, z.lekcja, z.typ) ? ilustracja(obrazLekcji(z.dzial, z.lekcja, z.typ), 'nagl-obraz') : babel(ikonaZestawu(z, nr), 'kp-emoji nagl-znak'),
        h('span', { class: 'kat-etykieta' }, z.termin && dni >= 0 ? etykietaTerminu(dni, z.termin)
          : [z.dzial ? `Dział ${z.dzial}` : 'Zestaw', z.lekcja ? ` · lekcja ${z.lekcja}` : '', z.strony ? ` · s. ${z.strony}` : ''].join('')),
        h('h1', { class: 'serif' }, z.tytul),
        z.opis ? h('p', {}, z.opis) : null,
        h('div', { class: 'np-staty' },
          h('span', {}, h('b', {}, z.bloki.length), ' ', odm(z.bloki.length, 'blok', 'bloki', 'bloków')),
          h('span', {}, h('b', {}, zadan), ' ', odm(zadan, 'pytanie', 'pytania', 'pytań')),
          ostatnia ? h('span', {}, 'ostatnio ', h('b', {}, `${ostatnia.dobrze}/${ostatnia.ile}`)) : null,
          ile > 1 ? h('span', {}, h('b', {}, ile), ' prób') : null)),
      z.nagrania?.length ? [h('div', { class: 'sekcja' }, 'Posłuchaj'), h('div', { class: 'nagrania' }, z.nagrania.map((n) => odtwarzaczNagrania(z, n)))] : null,
      h('div', { class: 'sekcja' }, 'Poćwicz'),
      h('button', { class: 'cta', type: 'button', onclick: () => graj1(z.bloki) },
        h('span', { class: 'cta-txt' }, h('b', {}, 'Zaczynam całą lekcję'), h('small', {}, 'blok po bloku, z wyjaśnieniami')),
        h('span', { class: 'cta-strzalka' }, ik('dalej'))),
      h('ul', { class: 'lista-pozycji' }, z.bloki.map((b, i) => {
        const n = b.ile || b.zadania?.length;
        return h('li', { class: 'pozycja klik', onclick: () => graj1([b], { tylkoBlok: b.id }) },
          h('span', { class: `blok-nr serif ${kolor(i)}` }, i + 1),
          h('span', { class: 'poz-txt' }, h('b', {}, b.tytul), h('small', { class: 'maly' }, `${n} ${odm(n, 'pytanie', 'pytania', 'pytań')}`)),
          h('span', { class: 'poz-status' }, 'ćwicz'));
      })),
      z.sciaga?.length ? h('a', { class: 'karta-sciagi', href: `#/z/${encodeURIComponent(z.id)}/sciaga` },
        ik('sciaga'), h('span', { class: 'poz-txt' }, h('b', {}, 'Ściąga z lekcji'), h('small', { class: 'maly' }, `${z.sciaga.length} punktów${z.definicje ? ` · ${Object.keys(z.definicje).length} pojęć` : ''}`)), ik('dalej')) : null));
}

function kolejnoscKart() {
  const p = profilInfo();
  return indeks.zestawy.filter((x) => x.dla.includes(p.id));
}

// ---------- odtwarzacz ----------
// Jeden wspólny element dla wszystkich nagrań lekcji. iPhone pozwala zacząć odtwarzanie tylko w reakcji
// na dotknięcie, a pełne nagranie najpierw się pobiera (kilka sekund) — więc przy dotknięciu ten sam element
// od razu gra ułamek sekundy ciszy (odblokowanie, jak w Lingozie), a po pobraniu dostaje właściwy plik.
const glosnik = new Audio();
glosnik.preload = 'metadata';
glosnik.setAttribute('playsinline', '');
try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* starsze iOS */ } // gra też przy wyciszonym iPhonie
function wavCiszy() {
  const n = 800; const b = new Uint8Array(44 + n); const v = new DataView(b.buffer);
  const t = (o, x) => [...x].forEach((c, i) => { b[o + i] = c.charCodeAt(0); });
  t(0, 'RIFF'); v.setUint32(4, 36 + n, true); t(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); t(36, 'data'); v.setUint32(40, n, true);
  b.fill(128, 44);
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
}
const CISZA = wavCiszy();
function odblokujGlosnik() {
  glosnik.src = CISZA;
  glosnik.play().then(() => { if (glosnik.src === CISZA) glosnik.pause(); }).catch(() => {});
}

const czasTxt = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '–:––');
const kluczMiejsca = (z, n) => `bz.miejsce.${z.id}.${n.plik || n.prywatne}`;

function zatrzymajOdtwarzacz() {
  if (!odtwarzacz) return;
  odtwarzacz.zapisz?.(); // zanim odepniemy słuchacze — wyjście z ekranu też pamięta miejsce
  glosnik.pause();
  odtwarzacz.sluchacze?.abort();
  if (odtwarzacz.url) URL.revokeObjectURL(odtwarzacz.url);
  odtwarzacz.przestan?.();
  odtwarzacz = null;
}

function odtwarzaczNagrania(z, n) {
  const btn = h('button', { class: 'graj-btn', type: 'button', 'aria-label': 'Odtwórz' }, ik('graj'));
  const cofnij = h('button', { class: 'cofnij-btn', type: 'button', 'aria-label': 'Cofnij 15 sekund', disabled: true }, ik('cofnij15'));
  const suwak = h('input', { class: 'suwak', type: 'range', min: 0, max: 1000, value: 0, disabled: true, 'aria-label': 'Miejsce w nagraniu' });
  const czas = h('small', { class: 'nagr-czas' }, n.minuty ? `ok. ${n.minuty} min` : '');
  const stan = h('small', { class: 'nagr-stan', role: 'status' });
  const klucz = kluczMiejsca(z, n);
  const ja = {}; // ten odtwarzacz; glosnik należy do niego, gdy odtwarzacz === ja
  const moj = () => odtwarzacz === ja;

  const ustawIkone = () => btn.replaceChildren(ik(moj() && !glosnik.paused ? 'pauza' : 'graj'));
  const odswiez = () => {
    if (!moj()) return;
    suwak.value = glosnik.duration ? Math.round((glosnik.currentTime / glosnik.duration) * 1000) : 0;
    czas.textContent = `${czasTxt(glosnik.currentTime)} / ${czasTxt(glosnik.duration)}`;
  };
  ja.przestan = () => { suwak.disabled = true; cofnij.disabled = true; btn.replaceChildren(ik('graj')); };

  function przejmij() {
    zatrzymajOdtwarzacz();
    odtwarzacz = ja;
    ja.sluchacze = new AbortController();
    ja.url = null;
  }
  function podepnij(src) {
    const opcje = { signal: ja.sluchacze.signal };
    const zapisane = Number(S.LS.get(klucz, 0));
    glosnik.addEventListener('loadedmetadata', () => { if (zapisane > 5 && zapisane < glosnik.duration - 5) glosnik.currentTime = zapisane; odswiez(); }, opcje);
    glosnik.addEventListener('timeupdate', () => { odswiez(); if (Math.round(glosnik.currentTime) % 5 === 0) S.LS.set(klucz, glosnik.currentTime); }, opcje);
    glosnik.addEventListener('play', ustawIkone, opcje);
    glosnik.addEventListener('pause', () => { ustawIkone(); ja.zapisz(); }, opcje);
    glosnik.addEventListener('ended', () => { S.LS.set(klucz, 0); ustawIkone(); }, opcje);
    glosnik.src = src;
    suwak.disabled = false; cofnij.disabled = false;
  }
  ja.zapisz = () => { if (moj() && glosnik.src !== CISZA && glosnik.currentTime > 1) S.LS.set(klucz, glosnik.currentTime); };
  const blad = (e) => {
    stan.textContent = e?.name === 'NotAllowedError' ? 'Telefon zablokował dźwięk. Stuknij jeszcze raz.' : (e?.message || 'Nie udało się odtworzyć nagrania.');
    ustawIkone();
  };
  btn.onclick = () => {
    if (moj() && glosnik.src !== CISZA) { if (glosnik.paused) glosnik.play().catch(blad); else glosnik.pause(); return; }
    przejmij();
    if (!n.prywatne) { podepnij(n.plik); glosnik.play().catch(blad); return; } // bez czekania — wciąż w dotknięciu
    odblokujGlosnik(); // jeszcze w dotknięciu, zanim zacznie się pobieranie
    stan.textContent = 'Pobieram nagranie…';
    btn.disabled = true;
    S.nagraniePrywatne(n.prywatne, n.wersja).then((blob) => {
      if (!moj()) return; // w międzyczasie włączono inne nagranie
      ja.url = URL.createObjectURL(blob);
      stan.textContent = '';
      podepnij(ja.url);
      // po długim pobieraniu iPhone potrafi już nie uznać tego za reakcję na dotknięcie — wtedy nagranie czeka gotowe
      return glosnik.play().catch((e) => {
        if (e?.name !== 'NotAllowedError') throw e;
        stan.textContent = 'Nagranie gotowe — stuknij ▶, żeby słuchać.';
        ustawIkone();
      });
    }).catch(blad).finally(() => { btn.disabled = false; });
  };
  // pełne nagranie: pobieranie rusza w tle od razu po wejściu w lekcję, z procentami
  if (n.prywatne && S.token()) {
    const kl = S.kluczPostepu(n.prywatne, n.wersja);
    const naPostep = (e) => {
      if (e.detail.klucz !== kl || !stan.isConnected) return;
      if (!(moj() && glosnik.src !== CISZA)) stan.textContent = e.detail.ile < 1 ? `Pobieram nagranie… ${Math.round(e.detail.ile * 100)}%` : 'Nagranie gotowe.';
    };
    window.addEventListener('bz-postep', naPostep);
    S.maNagranie(n.prywatne, n.wersja).then((jest) => {
      if (jest) { window.removeEventListener('bz-postep', naPostep); return; }
      S.nagraniePrywatne(n.prywatne, n.wersja).then(() => { if (stan.isConnected && !moj()) stan.textContent = 'Nagranie gotowe — zapisane na tym urządzeniu.'; })
        .catch((e) => { if (stan.isConnected && !moj()) stan.textContent = e.message; })
        .finally(() => setTimeout(() => window.removeEventListener('bz-postep', naPostep), 60000));
    });
  }
  cofnij.onclick = () => { if (moj()) glosnik.currentTime = Math.max(0, glosnik.currentTime - 15); };
  suwak.oninput = () => { if (moj() && glosnik.duration) glosnik.currentTime = (suwak.value / 1000) * glosnik.duration; };
  if (n.prywatne) S.maNagranie(n.prywatne, n.wersja).then((jest) => { if (jest) stan.textContent = 'zapisane na tym urządzeniu'; });

  return h('div', { class: 'nagranie' },
    h('div', { class: 'nagr-gora' }, btn,
      h('div', { class: 'poz-txt' }, h('b', {}, n.tytul, n.prywatne ? h('span', { class: 'klodka', title: 'tylko dla rodziny' }, ik('klodka')) : null),
        n.opis ? h('small', { class: 'maly' }, n.opis) : null)),
    h('div', { class: 'nagr-dol' }, cofnij, suwak, czas),
    stan);
}

// ---------- ściąga ----------
async function ekranSciagi(id) {
  const z = await wczytajZestaw(id);
  const nr = Math.max(0, kolejnoscKart().findIndex((x) => x.id === z.id));
  const obrazyPo = {};
  for (const o of z.obrazy || []) (obrazyPo[o.po ?? z.sciaga.length] ||= []).push(o);
  const obraz = (o) => h('figure', { class: 'sciaga-obraz' }, h('img', { src: o.plik, alt: o.podpis || '', loading: 'lazy' }), o.podpis ? h('figcaption', {}, o.podpis) : null);
  app.replaceChildren(
    h('main', { class: 'ekran' },
      h('section', { class: `naglowek-dzialu niski ${kolorZestawu(z, nr)}` },
        h('a', { class: 'wstecz', href: '#/z/' + encodeURIComponent(z.id), 'aria-label': 'Wróć' }, ik('wstecz')),
        h('span', { class: 'kat-etykieta' }, 'Ściąga'),
        h('h1', { class: 'serif' }, z.tytul)),
      (obrazyPo[0] || []).map(obraz), // rysunek ściągi („po”: 0) — przed pierwszym punktem
      h('ol', { class: 'sciaga' }, z.sciaga.map((t, i) => [h('li', {}, t), (obrazyPo[i + 1] || []).map(obraz)])),
      (obrazyPo[z.sciaga.length + 1] || []).map(obraz),
      z.definicje ? [h('div', { class: 'sekcja' }, 'Pojęcia'),
        h('dl', { class: 'pojecia' }, Object.entries(z.definicje).map(([k, v]) => [h('dt', { class: 'serif' }, k), h('dd', {}, v)]))] : null));
}

function startGry(zestaw, bloki, extra = {}) {
  biezacaGra?.zakoncz();
  zatrzymajOdtwarzacz();
  const p = profilInfo();
  const pole = h('div');
  app.replaceChildren(pole);
  biezacaGra = uruchom(pole, {
    zestaw, bloki, profil: p, ...extra,
    naKoniec: (proba) => { S.dodajProbe(p.id, proba); synchro(); },
    jeszczeRaz: () => startGry(zestaw, bloki, { tylkoBlok: extra.tylkoBlok }),
    powtorz: (zadania) => startGry(zestaw, zestaw.bloki.filter((b) => zadania[b.id]), { zadania, powtorka: true }),
    wyjdz: () => { biezacaGra?.zakoncz(); biezacaGra = null; location.hash = '#/z/' + encodeURIComponent(zestaw.id); render(); },
  });
}

// ---------- ustawienia ----------
function ekranUstawien() {
  const p = profilInfo();
  const t = S.token();
  const pole = h('input', { class: 'pole', type: 'password', placeholder: t ? '•••••••• (zapisany)' : 'github_pat_…', autocomplete: 'off' });
  const stan = h('p', { class: 'maly', role: 'status' });
  app.replaceChildren(
    h('main', { class: 'ekran' },
      h('div', { class: 'profil-gora' },
        h('a', { class: 'ikona-btn', href: '#/', 'aria-label': 'Wróć' }, ik('wstecz')),
        h('span', { class: 'profil-duzy-avatar serif' }, p.znak),
        h('h1', { class: 'serif' }, p.imie)),
      h('section', { class: 'ust' },
        h('div', { class: 'sekcja' }, 'Ten telefon'),
        h('div', { class: 'wiersz' }, h('span', {}, `Uczy się: ${p.imie}, klasa ${p.klasa}`),
          indeks.profile.length > 1 ? h('button', { class: 'chip', type: 'button', onclick: () => { S.ustawProfil(null); location.hash = '#/'; render(); } }, 'Zmień') : null),
        h('div', { class: 'wiersz' }, h('span', {}, 'Dźwięki'),
          h('button', { class: 'chip' + (S.dzwiek() ? ' akt' : ''), type: 'button', 'aria-pressed': String(S.dzwiek()), onclick: () => { S.ustawDzwiek(!S.dzwiek()); graj('przelacznik'); render(); } },
            S.dzwiek() ? 'włączone' : 'wyłączone'))),
      h('section', { class: 'ust' },
        h('div', { class: 'sekcja' }, 'Wyniki i pełne nagrania'),
        h('p', { class: 'maly' }, 'Wyniki zapisują się w prywatnym repozytorium rodziny, a pełne nagrania do nauki z podręcznikiem stamtąd się pobierają. Wystarczy raz wkleić token GitHub na tym telefonie.'),
        pole,
        h('div', { class: 'przyciski' },
          h('button', { class: 'btn glowny', type: 'button', onclick: async () => {
            const nowy = pole.value.trim();
            if (nowy) S.ustawToken(nowy);
            if (!S.token()) { stan.textContent = 'Wklej token.'; return; }
            stan.textContent = 'Łączę…';
            try { await S.synchronizuj(p.id); stan.textContent = 'Połączone. Wyniki są zapisane.'; } catch (e) { stan.textContent = e.message; }
          } }, t ? 'Synchronizuj teraz' : 'Włącz'),
          t ? h('button', { class: 'btn jasny', type: 'button', onclick: async () => {
            if (await okno({ tytul: 'Wyłączyć synchronizację?', tresc: 'Wyniki zostaną na telefonie, ale przestaną trafiać do taty. Pełne nagrania przestaną się pobierać.', przyciski: [{ tekst: 'Zostaw', wartosc: false }, { tekst: 'Wyłącz', wartosc: true, klasa: 'czerwony' }] })) { S.ustawToken(null); render(); }
          } }, 'Wyłącz') : null),
        stan)));
}

async function synchro() {
  const p = S.profil();
  if (!p || !S.token()) return;
  try { await S.synchronizuj(p); } catch (e) { console.warn('Synchronizacja:', e.message); }
}

async function render() {
  try {
    if (!indeks) await wczytajIndeks();
    if (!spis) spis = await fetch('zestawy/spis.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : { dzialy: [] })).catch(() => ({ dzialy: [] }));
    if (!profilInfo() && indeks.profile.length === 1) S.ustawProfil(indeks.profile[0].id);
    if (!profilInfo()) return ekranWyboru();
    const hash = location.hash || '#/';
    if (biezacaGra && !hash.startsWith('#/gra')) { biezacaGra.zakoncz(); biezacaGra = null; }
    const sc = hash.match(/^#\/z\/(.+)\/sciaga$/);
    if (sc) { zatrzymajOdtwarzacz(); window.scrollTo(0, 0); return await ekranSciagi(decodeURIComponent(sc[1])); }
    const m = hash.match(/^#\/z\/(.+)$/);
    if (m) { zatrzymajOdtwarzacz(); return await ekranZestawu(decodeURIComponent(m[1])); }
    zatrzymajOdtwarzacz();
    if (hash === '#/ustawienia') return ekranUstawien();
    if (hash.startsWith('#/gra')) return;
    return ekranListy();
  } catch (e) {
    app.replaceChildren(h('main', { class: 'ekran' }, h('h1', { class: 'serif' }, 'Ups'), h('p', {}, e.message), h('a', { class: 'btn', href: '#/' }, 'Na start')));
  }
}

// ogólny dźwięk przycisku: nawigacja, karty, zwykłe przyciski; odpowiedzi i „Sprawdź” mają własne dźwięki,
// a przyciski z data-cichy grają swój dźwięk same
const GLOSNE = 'a[href], .cta, .pozycja.klik, .btn:not(.sprawdz), .chip, .profil-kafel';
document.addEventListener('click', (e) => {
  const el = e.target.closest(GLOSNE);
  if (el && !el.disabled && !el.closest('[data-cichy]') && !el.matches('.chip[aria-pressed]')) graj('przycisk');
}, true);
document.addEventListener('pointerdown', przygotujDzwieki, { once: true });

window.addEventListener('hashchange', render);
render().then(synchro);

if ('serviceWorker' in navigator && location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
