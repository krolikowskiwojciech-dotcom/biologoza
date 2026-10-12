# Biologoza — rodzinna aplikacja do nauki biologii (PWA)

Zawsze po polsku. Aplikacja webowa na iPhone'a (dodana do ekranu początkowego), siostra Lingozy i Matmozy.

- **Adres:** https://krolikowskiwojciech-dotcom.github.io/biologoza/ (GitHub Pages z gałęzi `main`, repo publiczne).
- **Dane (prywatne repo `krolikowskiwojciech-dotcom/biologoza-dane`):** `profile/<id>.json` = `{ id, proby: [...] }` (wyniki)
  oraz `nagrania/<id>.mp3` — pełne nagrania „do nauki z podręcznikiem”. Telefon pobiera je tokenem wklejonym raz w Ustawieniach.
- **Profil:** tylko `julek` (Julek, klasa 6, „Puls życia 6”, Nowa Era). Lista w `narzedzia/biologoza.mjs` (PROFILE).

## Skąd są lekcje

Lekcje robi skill `lekcja-audio` w `iCloud/Audio - do nauki /lekcje-audio` (ekstrakcja ze skanu → narracja według
`references/narracja.md` → pytania, ściąga, definicje w `skrypty/<id>.json` → nagrania ElevenLabs). Biologoza niczego
tam nie pisze, tylko wczytuje gotowe pliki z `KLASA 6/Biologia/Dział */`:

| z lekcje-audio | w Biologozie | gdzie |
|---|---|---|
| `skrypty/<id>.json` (pytania, ściąga, definicje) | zestaw z blokami: Pojęcia, Test wyboru, Prawda czy fałsz, Uzupełnij, Pytania z podręcznika + ściąga | `zestawy/` (publiczne) |
| `audio/na-strone/<id>_www.mp3` | „Krótka powtórka” | `nagrania/` (publiczne — to samo jest na uczsiesprytniej.pl) |
| `audio/do-nauki-z-podrecznikiem/<id>.mp3` | „Lekcja z podręcznikiem” | **tylko** `biologoza-dane/nagrania/` (blisko tekstu książki) |
| ilustracje z `uczsiesprytniej/ilustracje/` | obrazki w ściądze | `obrazy/lekcje/` |

Pełne nagranie i ekstrakcja są blisko tekstu podręcznika — **nigdy** nie trafiają do publicznego repo.

## Prośba „wrzuć nową lekcję do Biologozy” / po nagraniu lekcji biologii Julka

1. `git pull`.
2. `node narzedzia/biologoza.mjs importuj` — wczytuje wszystkie lekcje, wysyła nowe pełne nagrania do `biologoza-dane`
   (pomija niezmienione), sprawdza zestawy i przebudowuje `zestawy/indeks.json`. **Musi przejść bez błędów.**
   Zestawy z importu (`"zrodlo": "lekcje-audio"`) przy każdym imporcie generują się od nowa — błąd w pytaniu poprawiaj
   w `lekcje-audio/.../skrypty/<id>.json`, nie w `zestawy/`. Zachowują się tylko `termin`, `ikona`, `kolor`, `dodano`.
3. Commit + `git push` — Pages publikuje w 1–2 min. Powiedz Wojtkowi, jakie lekcje doszły (pytania, nagrania).

## Kartkówka ze zdjęcia („Julek ma kartkówkę z biologii, zrób mu ćwiczenia z tego zdjęcia”)

1. `git pull`. Sprawdź wyniki: `node narzedzia/biologoza.mjs wyniki` — dołóż ćwiczeń z pomyłek.
2. Rozpoznaj na zdjęciu (podręcznik, karta pracy, zeszyt) **typy zadań** — każdy typ = osobny blok — i zrób
   `zestawy/<rrrr-mm-dd>-julek-<temat>.json` według `ZESTAWY.md` (`termin` = dzień kartkówki). Poziom i treść **jak na zdjęciu**,
   nie trudniej; własnymi słowami. Jeśli ta lekcja jest już zaimportowana, termin można też wpisać w jej zestawie.
   Zdjęcie nie trafia do repo (prawa autorskie wydawnictwa).
3. `node narzedzia/biologoza.mjs katalog` — musi przejść bez błędów.
4. Obejrzyj lokalnie (`python3 -m http.server 8743 --bind 127.0.0.1`, telefon 390 px), potem commit + `git push`.

## Zasady wyglądu

Rogi mniejsze niż w Lingozie (Wojtek 2026-10-12): `--r: 14px`, kafle 12–18 px, kwadraciki 8–10 px — sekcja „zaokrąglenia” na końcu
`styles.css`. Styl ołówkowo-kredkowy (ramki rysowane, bez zaokrągleń) był próbowany i odrzucony — nie wracaj do niego bez prośby.
Ekran pytania: karta jak z talii (nagłówek, kolorowy panel z falami, luka jako żółta pigułka), odpowiedzi 3D z literami A/B/C pod kartą.

**Obrazy dla 11–13 lat (Wojtek 2026-10-12, stanowczo):** żadnych słodkich, „bajkowych” ilustracji dla przedszkolaków —
bez maskotek, dużych oczu, rumieńców, konfetti, plasteliny w stylu dla maluchów. Ilustracje mają wyglądać dojrzale i naukowo.
Maskotki w Biologozie nie ma (pliki `maskotka-*` nie powstaną; element sam znika).

Reszta jak w Lingozie:

- Kroje: nagłówki Libre Baskerville (`.serif`), tekst Jost. **Zero kursywy.**
- **Bez emoji w interfejsie** — ikony SVG z `js/dom.js` (`ik('nazwa')`), kreska 2.1, zaokrąglone końce; nowe dopisuj do `IKONY`.
  Bąble na kartach lekcji to ikony biologiczne (`IKONY_BIO`), pole `ikona` w zestawie.
- Karty 3D z `--brzeg`, akcent biologii: białe liść, komórka i helisa na kartach, kropki „preparatu” w tle ćwiczeń.
- Gwiazdki stonowane na kartach, kolorowe tylko w wynikach (`.gwiazdki-wynik`).
- Żadnych `confirm()`/`alert()` — tylko `okno()`.
- Maskotka: `obrazy/maskotka-<poza>.png` (czesc, ok, brawo, mysli) — jeszcze jej nie ma; dopóki pliku brak, element znika.
  Gdy Wojtek przyśle arkusz z ChatGPT, potnij go jak w Lingozie (`narzedzia/tnij_arkusz.py` stamtąd).
- Zmiany wizualne sprawdzaj renderem na 127.0.0.1 przed pushem.

## Kod

- `index.html`, `styles.css`, `sw.js` (offline; pełne nagrania w osobnej pamięci `biologoza-nagrania`, której SW nie czyści).
- `zestawy/spis.json` — układ podręcznika (działy, lekcje, strony); strona główna pokazuje działy z niego, lekcje bez zestawu jako „wkrótce”.
- `js/app.js` (ekrany: lista działami, lekcja z nagraniami i ćwiczeniami, ściąga, ustawienia; odtwarzacz pamięta miejsce),
  `js/gra.js` (przebieg: wybor, pf, wpisz, kolejnosc, pary, otwarte; poprawka po błędzie, podsumowanie, „Wyślij wynik”),
  `js/sprawdz.js` (ocena odpowiedzi — wspólna z narzędziem), `js/store.js` (zapis, synchronizacja, pobieranie prywatnych nagrań),
  `js/dom.js` (pomocniki, ikony, okienka), `js/dzwieki.js` (dźwięki według `DZWIEKI.md`, z zapasem z „Ucz się sprytniej”).
- `narzedzia/dzwiek.sh "<plik>" <nazwa>` — dźwięk z Epidemic Sound → `audio/<nazwa>.mp3` (przycięty, mono, wyrównany).
- `narzedzia/biologoza.mjs` — `importuj | sprawdz [id] | katalog | wyniki`.
- Podgląd lokalny na 127.0.0.1 nie ma tokenu, więc nie zapisuje wyników do prawdziwych danych. Nie testuj z tokenem.
- Po każdej zmianie kodu podbij `CACHE` w `sw.js`, potem commit + push. Nowe lekcje i nagrania tego nie wymagają.
- Zakładanie repo i zmiany uprawnień tylko za zgodą Wojtka.
