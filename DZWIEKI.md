# Dźwięki Biologozy — spis

Wszystkie pliki: `audio/<nazwa>.mp3`, jedna rodzina brzmień (miękkie: drewno, marimba, dzwoneczki), bez pisków i brzęczyków.
Głośność wyrównana do siebie, cisza na początku przycięta. „Musi” = bez tego aplikacja brzmi niekompletnie, „może” = dodatek.

## 1. Przyciski (interfejs) — bardzo krótkie, ciche (ok. 35% głośności)

| plik | kiedy gra | czego szukać w Epidemic Sound | długość | priorytet |
|---|---|---|---|---|
| `przycisk` | „Zaczynam”, „Dalej”, karta lekcji, menu | UI tap soft, button click wood | ≤ 0,2 s | musi |
| `wybor` | dotknięcie odpowiedzi, kafelka w kolejności, pojęcia w parach | bubble pop small, marimba tap | ≤ 0,3 s | musi |
| `cofnij` | zdjęcie ułożonego kafelka, rozłączenie pary | UI tap reverse, soft pop down | ≤ 0,3 s | musi |
| `para` | połączenie dwóch elementów w parę | snap click, magnet click | ≤ 0,4 s | może |
| `przelacznik` | włącz/wyłącz w Ustawieniach | toggle switch soft | ≤ 0,2 s | może |

## 2. Pytania i okienka (coś się pojawia i czeka na reakcję)

| plik | kiedy gra | czego szukać | długość | priorytet |
|---|---|---|---|---|
| `start-bloku` | ekran „Blok 1 z 5”, początek ćwiczeń | short harp rise, mallet arpeggio up | ok. 1 s | musi |
| `odslon` | „Pokaż odpowiedź” w pytaniach otwartych | card flip, page turn soft | ≤ 0,6 s | musi |
| `podpowiedz` | „Najpierw wpisz odpowiedź”, „Połącz wszystkie pary” | soft notification, gentle blip | ≤ 0,4 s | musi |
| `okno` | wysunięcie okienka (np. „Przerwać ćwiczenie?”) | swoosh up soft, slide in | ≤ 0,5 s | może |
| `nowe-pytanie` | pojawienie się kolejnego pytania | whoosh very soft, air swipe | ≤ 0,3 s | może (gra bardzo często) |

## 3. Dobre odpowiedzi

| plik | kiedy gra | czego szukać | długość | priorytet |
|---|---|---|---|---|
| `dobrze` | dobra odpowiedź, też „Umiałem” i „dobrze, ale popraw pisownię” | correct answer chime, positive marimba | ok. 1 s | musi |
| `seria-5` | 5 dobrych pod rząd | achievement short, level up small | 1,5–3 s | musi |
| `seria-10` | 10 dobrych pod rząd | success jingle, bonus collect | 2–3 s | musi |

## 4. Złe odpowiedzi

| plik | kiedy gra | czego szukać | długość | priorytet |
|---|---|---|---|---|
| `zle` | zła odpowiedź (wybór, wpis, kolejność, pary) | wrong answer soft, error muted, low marimba down | ok. 0,8 s | musi |
| `jeszcze-nie` | „Jeszcze nie” w pytaniach otwartych — szczera samoocena, nie kara | soft neutral tone, gentle descend | ≤ 0,6 s | musi |
| `powrot-pytania` | wraca pytanie, które było źle („Jeszcze raz to pytanie”) | soft rewind, reminder chime | ≤ 0,6 s | może |

## 5. Wyniki

| plik | kiedy gra | czego szukać | długość | priorytet |
|---|---|---|---|---|
| `blok-gotowy` | koniec bloku, 1–2 gwiazdki | short positive sting | 1–2 s | musi |
| `blok-idealny` | koniec bloku, 3 gwiazdki | achievement sting bright | 1,5–2,5 s | musi |
| `lekcja-gotowa` | podsumowanie całej lekcji | short fanfare soft, completion jingle | 2–3 s | musi |
| `bez-bledow` | cała lekcja bez błędu | win fanfare, celebration short | 3–4 s | musi |
| `wyslano` | wynik wysłany tacie | message sent swoosh | ≤ 0,6 s | może |

Razem: 15 „musi” + 7 „może”.

Nowy plik obrabia `narzedzia/dzwiek.sh "<plik z Epidemic>" <nazwa>` (przycina ciszę, mono, szczyt −1 dB, MP3) — zapisuje
od razu `audio/<nazwa>.mp3`, kod niczego więcej nie potrzebuje. Dopóki pliku nie ma, `js/dzwieki.js` gra zapas z Matmozy
albo milczy. Gotowe: przycisk, wybor, cofnij, para, przelacznik, start-bloku, odslon, podpowiedz, okno, nowe-pytanie, dobrze. Odtwarzacz nagrań lekcji nie ma dźwięków (nie przeszkadzają w słuchaniu).
