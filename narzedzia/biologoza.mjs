#!/usr/bin/env node
// Narzędzie Biologozy.
//   node narzedzia/biologoza.mjs importuj [--bez-nagran]  — lekcje z projektu lekcje-audio (iCloud) → zestawy/, nagrania, obrazy
//   node narzedzia/biologoza.mjs sprawdz [id]             — kontrola zestawów (blokuje publikację)
//   node narzedzia/biologoza.mjs katalog                  — sprawdza wszystko i przebudowuje zestawy/indeks.json
//   node narzedzia/biologoza.mjs wyniki [profil]          — ostatnie próby z prywatnego repo biologoza-dane (przez gh)
//
// Import bierze z lekcje-audio tylko to, co i tak idzie na stronę uczsiesprytniej.pl (pytania, ściąga, definicje
// i krótkie nagranie _www — własne słowa, sprawdzone antyplagiatem). Pełne nagranie „do nauki z podręcznikiem”
// jest blisko tekstu książki, więc trafia WYŁĄCZNIE do prywatnego repo biologoza-dane (nagrania/<id>.mp3).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ocen, wCzesci, normuj, opcjeWyboru, dobraOdpowiedz } from '../js/sprawdz.js';

const KORZEN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZESTAWY = path.join(KORZEN, 'zestawy');
const REPO_DANYCH = 'krolikowskiwojciech-dotcom/biologoza-dane';
const ICLOUD = path.join(os.homedir(), 'Library/Mobile Documents/com~apple~CloudDocs/Audio - do nauki ');
const LEKCJE = path.join(ICLOUD, 'lekcje-audio/KLASA 6/Biologia');
const ILUSTRACJE = path.join(ICLOUD, 'uczsiesprytniej/ilustracje');
const PROFILE = [{ id: 'julek', imie: 'Julek', klasa: 6, znak: 'J' }];
const KOLORY = ['lila', 'mietowy', 'zolty', 'brzoskwinia', 'niebieski', 'rozowy', 'krem'];
const IKONY = ['lisc', 'komorka', 'mikroskop', 'dna', 'ryba', 'ptak', 'owad', 'slimak', 'zaba', 'serce', 'kosc', 'grzyb'];
const RODZAJE = ['wybor', 'pf', 'wpisz', 'kolejnosc', 'pary', 'otwarte'];
const SPIS = JSON.parse(fs.readFileSync(path.join(ZESTAWY, 'spis.json'), 'utf8'));

// ---------- kontrola zestawu ----------
function sprawdzCzesc(cz, gdzie, bledy) {
  const b = (t) => bledy.push(`${gdzie}: ${t}`);
  if (!RODZAJE.includes(cz.kind)) return b(`nieznany rodzaj „${cz.kind}”`);
  if (!cz.e && cz.kind !== 'pary' && cz.kind !== 'kolejnosc') b('brak treści pytania (e)');
  switch (cz.kind) {
    case 'wybor': {
      const o = opcjeWyboru(cz) || [];
      if (o.length < 2) b('za mało odpowiedzi do wyboru');
      if (new Set(o.map(normuj)).size !== o.length) b('powtórzone odpowiedzi do wyboru');
      if (!o.includes(cz.a)) b(`poprawnej odpowiedzi „${cz.a}” nie ma wśród opcji`);
      break;
    }
    case 'pf': if (typeof cz.a !== 'boolean') b('pf: „a” musi być true albo false'); break;
    case 'wpisz':
      if (!String(cz.a || '').trim()) b('wpisz: brak odpowiedzi');
      if ((cz.e.match(/___/g) || []).length > 1) b('wpisz: więcej niż jedna luka „___”');
      break;
    case 'kolejnosc':
      if (!(cz.elementy?.length >= 3)) b('kolejnosc: potrzeba co najmniej 3 elementów');
      else if (new Set(cz.elementy).size !== cz.elementy.length) b('kolejnosc: powtórzone elementy');
      break;
    case 'pary':
      if (!(cz.pary?.length >= 2)) b('pary: potrzeba co najmniej 2 par');
      else if (new Set(cz.pary.map(([l]) => l)).size !== cz.pary.length || new Set(cz.pary.map(([, p]) => p)).size !== cz.pary.length) b('pary: powtórzone elementy');
      break;
    case 'otwarte': if (!String(cz.a || '').trim()) b('otwarte: brak wzorcowej odpowiedzi'); break;
  }
  if (cz.kind !== 'otwarte' && !(cz.exp?.length || cz.zrodlo)) b('brak wyjaśnienia (exp) albo źródła — po błędzie nie byłoby czego pokazać');
  // wyrocznia: wzorcowa odpowiedź musi przejść, a każda inna opcja — nie
  if (cz.kind === 'wybor' || cz.kind === 'pf') {
    if (!ocen(cz, dobraOdpowiedz(cz)).ok) b('wzorcowa odpowiedź nie przechodzi oceny');
    for (const o of opcjeWyboru(cz) || []) if (o !== dobraOdpowiedz(cz) && ocen(cz, o).ok) b(`zła opcja „${o}” przechodzi ocenę`);
  }
  if (cz.kind === 'wpisz') {
    for (const x of [cz.a, ...(cz.inne || [])]) if (!ocen(cz, x).ok) b(`forma „${x}” nie przechodzi oceny`);
  }
  if (cz.kind === 'kolejnosc' && cz.elementy?.length >= 3 && (!ocen(cz, cz.elementy).ok || ocen(cz, [...cz.elementy].reverse()).ok)) b('kolejnosc: ocena nie działa');
  if (cz.kind === 'pary' && cz.pary?.length >= 2 && !ocen(cz, Object.fromEntries(cz.pary)).ok) b('pary: ocena nie działa');
}

export function sprawdzZestaw(z) {
  const bledy = [];
  let zadan = 0;
  if (!z.id || !z.tytul) bledy.push('brak id albo tytułu');
  for (const p of [].concat(z.dla || [])) if (!PROFILE.some((x) => x.id === p)) bledy.push(`${z.id}: nieznany profil „${p}”`);
  if (!z.bloki?.length) bledy.push(`${z.id}: brak bloków`);
  if (z.ikona && !IKONY.includes(z.ikona)) bledy.push(`${z.id}: nieznana ikona „${z.ikona}” (są: ${IKONY.join(', ')})`);
  for (const n of z.nagrania || []) {
    if (n.plik && !fs.existsSync(path.join(KORZEN, n.plik))) bledy.push(`${z.id}: brak pliku nagrania ${n.plik}`);
    if (!n.plik && !n.prywatne) bledy.push(`${z.id}: nagranie bez pliku`);
  }
  for (const o of z.obrazy || []) if (!fs.existsSync(path.join(KORZEN, o.plik))) bledy.push(`${z.id}: brak obrazka ${o.plik}`);
  // zestaw z działem musi trafić w lekcję ze spisu podręcznika — inaczej nie pojawi się w swoim dziale na liście
  if (z.dzial) {
    const d = SPIS.dzialy.find((x) => x.nr === z.dzial);
    if (!d) bledy.push(`${z.id}: działu „${z.dzial}” nie ma w zestawy/spis.json`);
    else if (!d.lekcje.some((l) => (z.typ ? l.typ === z.typ : !l.typ && l.nr === z.lekcja))) bledy.push(`${z.id}: w dziale ${z.dzial} nie ma ${z.typ ? `pozycji „${z.typ}”` : `lekcji nr ${z.lekcja}`} (zestawy/spis.json)`);
  }
  const idBlokow = new Set();
  for (const b of z.bloki || []) {
    if (idBlokow.has(b.id)) bledy.push(`${z.id}: powtórzone id bloku „${b.id}”`);
    idBlokow.add(b.id);
    if (!b.zadania?.length) bledy.push(`${z.id}/${b.id}: brak zadań`);
    const teksty = new Set();
    (b.zadania || []).forEach((zad, i) => {
      const w = wCzesci(zad);
      if (w.obraz && !fs.existsSync(path.join(KORZEN, w.obraz))) bledy.push(`${z.id}/${b.id}#${i + 1}: brak obrazka ${w.obraz}`);
      w.czesci.forEach((cz, j) => {
        zadan++;
        sprawdzCzesc(cz, `${z.id}/${b.id}#${i + 1}${w.czesci.length > 1 ? String.fromCharCode(97 + j) : ''}`, bledy);
        const t = normuj([w.q, cz.e].join(' '));
        if (teksty.has(t)) bledy.push(`${z.id}/${b.id}#${i + 1}: powtórzone pytanie`);
        teksty.add(t);
      });
    });
  }
  return { bledy, zadan };
}

function wczytajZestawy() {
  return fs.readdirSync(ZESTAWY).filter((f) => f.endsWith('.json') && f !== 'indeks.json' && f !== 'spis.json').sort()
    .map((f) => {
      const z = JSON.parse(fs.readFileSync(path.join(ZESTAWY, f), 'utf8'));
      if (z.id + '.json' !== f) throw new Error(`${f}: id „${z.id}” musi być takie jak nazwa pliku`);
      return z;
    });
}

function sprawdzWszystko(tylko) {
  let wszystkieBledy = [];
  const zestawy = wczytajZestawy().filter((z) => !tylko || z.id === tylko);
  for (const z of zestawy) {
    const { bledy, zadan } = sprawdzZestaw(z);
    console.log(`${bledy.length ? '✗' : '✓'} ${z.id}: ${z.bloki.length} bloków, ${zadan} pytań`);
    for (const b of bledy.slice(0, 25)) console.log('   ✗ ' + b);
    wszystkieBledy = wszystkieBledy.concat(bledy);
  }
  return { zestawy, bledy: wszystkieBledy };
}

// ---------- import z lekcje-audio ----------
// deterministyczne „losowanie” (ten sam wynik przy każdym imporcie — bez szumu w gicie)
const ziarno = (t) => crypto.createHash('sha1').update(t).digest().readUInt32BE(0);
function tasujStale(lista, klucz) {
  const a = [...lista];
  let s = ziarno(klucz);
  for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// w definicji zasłaniamy samo pojęcie (i jego odmiany), żeby pytanie nie podpowiadało odpowiedzi
function zaslon(def, termin) {
  let t = def;
  for (const slowo of termin.split(/[\s-]+/).filter((x) => x.length >= 4)) {
    const rdzen = slowo.slice(0, Math.max(4, slowo.length - 3)).toLowerCase();
    t = t.replace(new RegExp(`(?<![\\p{L}])${rdzen.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\p{L}*`, 'giu'), '…');
  }
  return t;
}
const IKONA_TEMATU = [[/tkank|krew|kost/i, 'komorka'], [/królestw|zwierz/i, 'mikroskop'], [/parzyd|meduz|polip/i, 'lisc'], [/płazi|tasiem|nicien|glist|robak/i, 'dna'],
  [/pierście|dżdżown|pijawk/i, 'slimak'], [/stawonog|owad|pajęcz|skorup/i, 'owad'], [/mięczak|ślimak|małż/i, 'slimak'], [/ryb/i, 'ryba'], [/płaz|żab/i, 'zaba'],
  [/gad|ptak/i, 'ptak'], [/ssak/i, 'serce'], [/szkielet|kręgow/i, 'kosc']];
const czasNagrania = (plik) => { try { const m = execFileSync('afinfo', [plik], { encoding: 'utf8' }).match(/estimated duration: ([\d.]+)/); return m ? Math.round(Number(m[1]) / 60) : null; } catch { return null; } };
const shaBloba = (buf) => crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

// mowa nie potrzebuje 128 kb/s stereo: 64 kb/s mono to połowa rozmiaru (pełne nagranie ~7 MB zamiast ~14,5 MB), więc
// telefon pobiera je dwa razy szybciej. -bitexact = ten sam plik przy każdym imporcie (bez ponownego wysyłania).
function lekkie(zrodlo) {
  const kat = path.join(os.tmpdir(), 'biologoza-mp3');
  fs.mkdirSync(kat, { recursive: true });
  const cel = path.join(kat, shaBloba(fs.readFileSync(zrodlo)).slice(0, 16) + '.mp3');
  if (!fs.existsSync(cel)) {
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', zrodlo, '-ac', '1', '-ar', '44100', '-b:a', '64k',
      '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:a', '+bitexact', cel]);
  }
  return cel;
}

function wyslijPrywatne(lokalny, sciezka, opis) {
  const buf = fs.readFileSync(lokalny);
  let sha = null;
  try { sha = execFileSync('gh', ['api', `repos/${REPO_DANYCH}/contents/${sciezka}`, '--jq', '.sha'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* jeszcze nie ma */ }
  if (sha === shaBloba(buf)) return 'bez zmian';
  const tmp = path.join(os.tmpdir(), `biologoza-${process.pid}.json`);
  fs.writeFileSync(tmp, JSON.stringify({ message: `Biologoza: ${opis}`, content: buf.toString('base64'), ...(sha ? { sha } : {}) }));
  try { execFileSync('gh', ['api', '-X', 'PUT', `repos/${REPO_DANYCH}/contents/${sciezka}`, '--input', tmp, '--silent'], { stdio: ['ignore', 'ignore', 'inherit'] }); }
  finally { fs.rmSync(tmp, { force: true }); }
  return sha ? 'zaktualizowane' : 'wysłane';
}

function importuj({ bezNagran }) {
  if (!fs.existsSync(LEKCJE)) throw new Error(`Nie widzę folderu lekcji: ${LEKCJE}`);
  const pliki = fs.readdirSync(LEKCJE).filter((d) => d.startsWith('Dział'))
    .flatMap((d) => { const s = path.join(LEKCJE, d, 'skrypty'); return fs.existsSync(s) ? fs.readdirSync(s).filter((f) => /_J\.json$/.test(f)).map((f) => ({ dzialDir: path.join(LEKCJE, d), plik: path.join(s, f) })) : []; });
  fs.mkdirSync(path.join(KORZEN, 'nagrania'), { recursive: true });
  fs.mkdirSync(path.join(KORZEN, 'obrazy/lekcje'), { recursive: true });
  let i = 0;
  for (const { dzialDir, plik } of pliki.sort((a, b) => a.plik.localeCompare(b.plik))) {
    const L = JSON.parse(fs.readFileSync(plik, 'utf8'));
    const id = L.id.replace(/_J$/, '').replace(/_/g, '-');
    const sciezkaZestawu = path.join(ZESTAWY, id + '.json');
    const stary = fs.existsSync(sciezkaZestawu) ? JSON.parse(fs.readFileSync(sciezkaZestawu, 'utf8')) : null;
    if (stary && stary.zrodlo !== 'lekcje-audio') { console.log(`! ${id}: zestaw zrobiony ręcznie — pomijam`); continue; }
    const P = (typ) => L.pytania.filter((p) => (p.typ || 'otwarte') === typ);
    const exp = (p) => [p.odpowiedz, p.blad ? `Częsty błąd: ${p.blad}` : null].filter(Boolean);
    const terminy = Object.keys(L.definicje || {});
    const bloki = [];
    if (terminy.length >= 3) {
      bloki.push({ id: 'pojecia', tytul: 'Pojęcia z lekcji', polecenie: 'Które pojęcie pasuje do opisu?', ile: Math.min(8, terminy.length),
        zadania: terminy.map((t) => {
          // bez opcji, które też byłyby dobre („tasiemiec” przy „tasiemiec uzbrojony”)
          const zawiera = (a, b) => ` ${normuj(a)} `.includes(` ${normuj(b)} `);
          const inne = tasujStale(terminy.filter((x) => !zawiera(x, t) && !zawiera(t, x)), t).slice(0, 2);
          return { kind: 'wybor', e: zaslon(L.definicje[t], t), a: t, choices: [t, ...inne], exp: inne.map((x) => `${x} to coś innego: ${L.definicje[x]}`) };
        }) });
    }
    if (P('wybor').length) bloki.push({ id: 'wybor', tytul: 'Test wyboru', polecenie: 'Wybierz poprawną odpowiedź.',
      zadania: P('wybor').map((p) => ({ kind: 'wybor', e: p.pytanie, a: p.opcje[p.poprawna], choices: p.opcje, exp: exp(p), zrodlo: p.zrodlo })) });
    if (P('tak-nie').length) bloki.push({ id: 'prawda-falsz', tytul: 'Prawda czy fałsz', polecenie: 'Czy to zdanie jest prawdziwe?',
      zadania: P('tak-nie').map((p) => ({ kind: 'pf', e: p.pytanie, a: !!p.poprawna, exp: exp(p), zrodlo: p.zrodlo })) });
    if (P('uzupelnij').length) bloki.push({ id: 'uzupelnij', tytul: 'Uzupełnij', polecenie: 'Wpisz brakujące pojęcie.',
      zadania: P('uzupelnij').map((p) => ({ kind: 'wpisz', e: p.pytanie, a: p.odpowiedzi[0], inne: p.odpowiedzi.slice(1), exp: exp(p), zrodlo: p.zrodlo })) });
    if (P('otwarte').length) bloki.push({ id: 'pytania', tytul: 'Pytania z podręcznika', polecenie: 'Odpowiedz w myślach albo na głos, potem sprawdź.',
      zadania: P('otwarte').map((p) => ({ kind: 'otwarte', e: p.pytanie, a: p.odpowiedz, blad: p.blad, zrodlo: p.zrodlo })) });

    // obrazki ściągi (te same, co na stronie) — kopiujemy do obrazy/lekcje/
    const obrazy = [];
    for (const o of L.obrazy || []) {
      const zr = path.join(ILUSTRACJE, o.plik);
      if (!fs.existsSync(zr)) { console.log(`   ! brak ilustracji ${o.plik}`); continue; }
      fs.copyFileSync(zr, path.join(KORZEN, 'obrazy/lekcje', o.plik));
      obrazy.push({ plik: `obrazy/lekcje/${o.plik}`, po: o.po, podpis: o.podpis });
    }
    const rysunek = path.join(ILUSTRACJE, `sciaga-${L.id}.svg`);
    if (fs.existsSync(rysunek)) {
      const cel = `obrazy/lekcje/sciaga-${id}.svg`;
      fs.copyFileSync(rysunek, path.join(KORZEN, cel));
      obrazy.unshift({ plik: cel, po: 0, podpis: L.rysunek_podpis || '' });
    }

    // nagrania: krótkie (publiczne, to samo co na stronie) i pełne (tylko prywatne repo)
    const nagrania = [];
    const www = path.join(dzialDir, 'audio/na-strone', `${L.id}_www.mp3`);
    if (fs.existsSync(www)) {
      const cel = `nagrania/${id}-krotkie.mp3`;
      fs.copyFileSync(lekkie(www), path.join(KORZEN, cel));
      nagrania.push({ tytul: 'Krótka powtórka', opis: 'Najważniejsze z lekcji, bez książki', plik: cel, minuty: czasNagrania(www) });
    }
    const pelne = path.join(dzialDir, 'audio/do-nauki-z-podrecznikiem', `${L.id}.mp3`);
    if (fs.existsSync(pelne)) {
      const cel = `nagrania/${id}.mp3`;
      const lekkiePelne = lekkie(pelne);
      const wynik = bezNagran ? 'pominięte (--bez-nagran)' : wyslijPrywatne(lekkiePelne, cel, `pełne nagranie ${id}`);
      console.log(`   pełne nagranie → biologoza-dane/${cel}: ${wynik}`);
      nagrania.unshift({ tytul: 'Lekcja z podręcznikiem', opis: 'Słuchaj i patrz do książki', prywatne: cel, wersja: shaBloba(fs.readFileSync(lekkiePelne)).slice(0, 10), minuty: czasNagrania(pelne) });
    }

    const nr = Number(L.lekcja_nr) || null;
    const zestaw = {
      id, zrodlo: 'lekcje-audio', dla: ['julek'], tytul: L.tytul,
      dzial: L.dzial || null, dzialTytul: L.dzial_tytul || null, lekcja: nr, strony: L.strony || null,
      dodano: stary?.dodano || L.data || new Date().toISOString().slice(0, 10), termin: stary?.termin || null,
      ikona: stary?.ikona || (IKONA_TEMATU.find(([re]) => re.test(L.tytul)) || [, IKONY[i % IKONY.length]])[1],
      kolor: stary?.kolor || KOLORY[i % KOLORY.length],
      ocena: true,
      nagrania: nagrania.length ? nagrania : undefined,
      sciaga: L.sciaga, definicje: L.definicje, obrazy: obrazy.length ? obrazy : undefined,
      bloki,
    };
    fs.writeFileSync(sciezkaZestawu, JSON.stringify(zestaw, null, 2) + '\n');
    console.log(`${stary ? '↻' : '+'} ${id}: ${bloki.map((b) => `${b.tytul} ${b.zadania.length}`).join(', ')}; nagrania: ${nagrania.length}; obrazki: ${obrazy.length}`);
    i++;
  }
}

function zbudujIndeks(zestawy) {
  const indeks = {
    profile: PROFILE,
    zestawy: zestawy.map((z) => ({
      id: z.id, tytul: z.tytul, opis: z.opis || '', dla: [].concat(z.dla), termin: z.termin || null, dodano: z.dodano || null,
      dzial: z.dzial || null, dzialTytul: z.dzialTytul || null, lekcja: z.lekcja || null, typ: z.typ || null, strony: z.strony || null,
      ikona: z.ikona || null, kolor: z.kolor || null, bloki: z.bloki.length,
      zadan: z.bloki.reduce((n, b) => n + (b.ile || b.zadania?.length || 0), 0),
      nagrania: z.nagrania?.length || 0, sciaga: !!z.sciaga?.length,
    })).sort((a, b) => String(b.dodano).localeCompare(String(a.dodano))),
  };
  fs.writeFileSync(path.join(ZESTAWY, 'indeks.json'), JSON.stringify(indeks, null, 2) + '\n');
  console.log(`\nindeks.json: ${indeks.zestawy.length} zestawów.`);
}

const [, , cmd = 'sprawdz', ...reszta] = process.argv;
const arg = reszta.find((x) => !x.startsWith('--'));
if (cmd === 'importuj') {
  importuj({ bezNagran: reszta.includes('--bez-nagran') });
  const { zestawy, bledy } = sprawdzWszystko();
  if (bledy.length) { console.error(`\nBŁĘDY: ${bledy.length}. Nie publikuj, dopóki nie znikną.`); process.exit(1); }
  zbudujIndeks(zestawy);
} else if (cmd === 'sprawdz' || cmd === 'katalog') {
  const { zestawy, bledy } = sprawdzWszystko(cmd === 'sprawdz' ? arg : null);
  if (bledy.length) { console.error(`\nBŁĘDY: ${bledy.length}. Nie publikuj, dopóki nie znikną.`); process.exit(1); }
  if (cmd === 'katalog') zbudujIndeks(zestawy); else console.log('\nWszystko się zgadza.');
} else if (cmd === 'wyniki') {
  for (const p of PROFILE.filter((x) => !arg || x.id === arg)) {
    let dane;
    try {
      const out = execFileSync('gh', ['api', `repos/${REPO_DANYCH}/contents/profile/${p.id}.json`, '--jq', '.content'], { encoding: 'utf8' });
      dane = JSON.parse(Buffer.from(out, 'base64').toString('utf8'));
    } catch { console.log(`${p.imie}: brak danych`); continue; }
    console.log(`\n${p.imie} (klasa ${p.klasa}) — prób: ${dane.proby.length}`);
    for (const pr of dane.proby.slice(-15)) {
      const data = new Date(pr.d).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
      console.log(`  ${data}  ${pr.tytul}${pr.przerwane ? ' (przerwane)' : ''}: ${pr.dobrze}/${pr.ile} za pierwszym razem, ${Math.round(pr.czas / 60)} min`);
      for (const b of pr.bloki) console.log(`     · ${b.tytul}: ${b.dobrze}/${b.ile}`);
      if (pr.bledy?.length) console.log(`     do powtórki: ${pr.bledy.map((x) => `${x.d} (odp. ${x.odp}; dobrze ${x.a})`).join(' | ')}`);
    }
  }
} else {
  console.log('Użycie: node narzedzia/biologoza.mjs importuj [--bez-nagran] | sprawdz [id] | katalog | wyniki [profil]');
  process.exit(1);
}
