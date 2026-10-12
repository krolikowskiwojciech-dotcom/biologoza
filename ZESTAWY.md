# Format zestawu (`zestawy/<id>.json`)

Lekcje z projektu `lekcje-audio` robi narzędzie (`importuj`, mają `"zrodlo": "lekcje-audio"`) — nie edytuj ich ręcznie,
popraw JSON lekcji w `lekcje-audio` i zaimportuj jeszcze raz. Ręcznie piszesz tylko kartkówki ze zdjęć.

```json
{
  "id": "2026-10-20-julek-stawonogi",       // = nazwa pliku; nie zmieniaj po publikacji (od niego zależą wyniki)
  "dla": ["julek"],
  "tytul": "Stawonogi — kartkówka",
  "opis": "Owady, pajęczaki i skorupiaki: budowa i przykłady.",
  "termin": "2026-10-21",                    // dzień kartkówki (opcjonalnie) — karta trafi do „Przed kartkówką”
  "dodano": "2026-10-19",
  "dzial": "III", "dzialTytul": "…", "lekcja": 2, "strony": "55–58",   // opcjonalnie: miejsce w podręczniku
  "ikona": "owad",                           // lisc komorka mikroskop dna ryba ptak owad slimak zaba serce kosc grzyb
  "kolor": "zolty",                          // lila | mietowy | zolty | brzoskwinia | niebieski | rozowy | krem
  "ocena": true,                             // pokaż przybliżoną ocenę szkolną w podsumowaniu
  "nagrania": [ { "tytul": "…", "opis": "…", "plik": "nagrania/x.mp3", "minuty": 9 },
                { "tytul": "…", "prywatne": "nagrania/x.mp3", "minuty": 15 } ],   // prywatne = ścieżka w repo biologoza-dane
  "sciaga": ["punkt 1", "punkt 2"], "definicje": { "pojęcie": "opis" },
  "obrazy": [ { "plik": "obrazy/lekcje/x.svg", "po": 4, "podpis": "…" } ],     // obrazek w ściądze pod punktem nr „po”
  "bloki": [ { … } ]                         // jeden typ zadań = jeden blok
}
```

## Blok

```json
{ "id": "budowa", "tytul": "Budowa owada", "polecenie": "Wybierz poprawną odpowiedź.", "ile": 6,
  "jak": { "intro": "…", "zasady": [["Owady", "3 pary odnóży"]] },   // „Przypomnij sobie” przed blokiem (opcjonalnie)
  "zadania": [ … ] }
```
`ile` — ile pytań w rundzie (losowane z `zadania`, bez powtórek); bez `ile` — wszystkie.

## Zadania (`kind`)

```json
{ "kind": "wybor", "e": "Ile par odnóży ma owad?", "a": "trzy", "choices": ["dwie", "trzy", "cztery"], "exp": ["…"], "zrodlo": "s. 55" }
{ "kind": "pf", "e": "Pająk jest owadem.", "a": false, "exp": ["Pająk to pajęczak — ma cztery pary odnóży."] }
{ "kind": "wpisz", "e": "Ciało owada dzieli się na głowę, tułów i ___.", "a": "odwłok", "inne": ["odwłoka"], "exp": ["…"] }
{ "kind": "kolejnosc", "e": "Ułóż etapy rozwoju motyla.", "elementy": ["jajo", "larwa", "poczwarka", "postać dorosła"], "exp": ["…"] }
{ "kind": "pary", "e": "Połącz zwierzę z grupą.", "pary": [["pająk", "pajęczaki"], ["rak", "skorupiaki"]], "exp": ["…"] }
{ "kind": "otwarte", "e": "Porównaj budowę owada i pająka.", "a": "wzorcowa odpowiedź", "blad": "typowa pomyłka", "zrodlo": "s. 57" }
```

- `e` — treść; w `wpisz` luka to `___` (najwyżej jedna). `kolejnosc` — `elementy` w POPRAWNEJ kolejności (aplikacja tasuje).
- `wpisz` przyjmuje bez wielkich liter, z innym myślnikiem i kropką na końcu; bez ogonków i z jedną literówką (dwiema przy
  długich słowach) też przechodzi, ale z uwagą o pisowni. Inne poprawne formy dopisz do `inne`.
- `exp` — wyjaśnienie po błędzie (obowiązkowe poza `otwarte`); `zrodlo` — gdzie w książce szukać (pokazywane jako „Zajrzyj do książki”).
- `obraz` (przy zadaniu) — własny rysunek z `obrazy/`; nigdy zdjęcie strony podręcznika.
- Wszystko własnymi słowami — repo jest publiczne.
