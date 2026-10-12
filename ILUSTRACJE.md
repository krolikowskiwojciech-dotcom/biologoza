# Ilustracje Biologozy — prompty do ChatGPT

Styl jak w Lingozie: ikony 3D z plasteliny, pastele, przezroczyste tło, siatka (jeden obiekt w komórce).
Wojtek wkleja jeden zbiorczy prompt (sekcja niżej) — ChatGPT generuje 4 obrazy po kolei. Pojedyncze prompty są pod nim (do poprawek).
Źródło: `narzedzia/prompty.json`. Gotowe arkusze tnie `tnij_arkusz.py` z Lingozy (siatka kolumny×wiersze, nazwy jak niżej).

## Zbiorczy prompt (wszystkie 4 obrazy)

```
Please generate 4 separate images for a biology learning app, one after another (Image 1, then 2, 3 and 4). Do not ask me questions in between — just generate all four in order. Every image uses the same visual style described below.

Style: cute 3D clay icons — smooth matte plasticine, soft rounded shapes, soft pastel palette (lilac, mint, butter yellow, peach, sky blue, pink) with natural accents only where biology needs them (red blood cells, green leaves). Soft studio light from the top left and a gentle soft shadow under each object. Friendly for a 12-year-old, not babyish. Biologically correct shapes and counts (insects have 6 legs, spiders have 8, an earthworm shows ring segments). No text, no letters, no numbers, no labels, no frames, no background scene. Transparent background (PNG).

Grid rules for every image: square 1:1 canvas, objects arranged in an even grid, each object centered in its own cell with clear empty space around it, nothing crossing cell borders, same scale for all objects within one image.

IMAGE 1 of 4 — arkusz-01-maskotka (2 columns × 2 rows)
Create one square image (1:1) with a grid of 2 columns × 2 rows: the same mascot character in 4 different poses, each pose centered in its own cell with clear empty space between cells; nothing crosses cell borders. The character: a cute 3D clay mascot for a biology learning app — a small mint-green tree frog with big friendly eyes, tiny pink cheeks and a small lilac explorer satchel. Keep the same character, proportions and colors in all four poses. Row 1: (1) waving hello with one hand, smiling; (2) giving a cheerful thumbs-up and nodding. Row 2: (3) jumping with joy, arms up, a few small pastel confetti pieces and stars around; (4) thinking, holding a small magnifying glass near its chin, eyes looking up, with a tiny empty thought bubble.

IMAGE 2 of 4 — arkusz-02-dzialy (3 columns × 2 rows)
Create one square image (1:1) with a grid of 3 columns × 2 rows = 6 separate icons for chapters of a 6th-grade biology textbook about animals, each icon centered in its own cell with clear empty space between cells; nothing crosses cell borders. Row 1: (1) a microscope next to a single animal cell, a paw print and a feather — the animal kingdom; (2) a jellyfish next to an earthworm with ring segments — simple invertebrates; (3) a beetle with jointed legs next to a snail with a spiral shell — arthropods and molluscs. Row 2: (4) a fish, a frog and a lizard grouped together — cold-blooded vertebrates; (5) a small bird and a fox grouped together with a small warm sun — warm-blooded vertebrates; (6) a green leaf, a DNA double helix and a magnifying glass — biology in general.

IMAGE 3 of 4 — arkusz-03-lekcje-1 (4 columns × 3 rows)
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate icons for lessons of a 6th-grade biology textbook, each icon centered in its own cell with clear empty space between cells; nothing crosses cell borders. Row 1: (1) a microscope next to a paw print, a feather and a fish scale — the animal kingdom; (2) three tissue samples side by side: a layer of tightly packed cells, a striped muscle fiber and a nerve cell (neuron) with branching ends; (3) connective tissue: a small bone, a piece of cartilage and a drop of blood with round red blood cells; (4) a jellyfish (medusa) next to a small hydra polyp with tentacles. Row 2: (5) a flat, leaf-shaped planarian flatworm next to a long, flat, segmented tapeworm ribbon (stylized, not gross); (6) a thin round worm (nematode) curled on a little mound of soil next to an apple; (7) an earthworm with clearly visible ring segments and a thicker saddle band, next to a small leech; (8) a beetle with a shiny hard exoskeleton and clearly jointed legs. Row 3: (9) a crayfish and a small crab with hard shells; (10) a ladybug and a butterfly, each with 6 legs; (11) a spider with exactly 8 legs sitting on a small web; (12) a snail with a spiral shell, an open clam shell and a small octopus.

IMAGE 4 of 4 — arkusz-04-lekcje-2 (4 columns × 3 rows)
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate icons for lessons of a 6th-grade biology textbook, each icon centered in its own cell with clear empty space between cells; nothing crosses cell borders. Row 1: (1) a fish with clearly visible fins, scales and gill covers, with a few bubbles; (2) three different fish together (a carp, a trout and a small flatfish) with a water plant; (3) a green frog next to a tadpole and a small cluster of frog eggs; (4) a salamander and a toad sitting on a stone. Row 2: (5) a lizard next to two leathery reptile eggs; (6) a turtle next to a coiled snake; (7) a bird with clearly drawn feathers standing beside a nest with an egg; (8) an owl, a penguin and a sparrow standing together. Row 3: (9) a mother fox curled around her cub (mammals feed their young with milk), simple and cute; (10) a bat, a small whale and a mouse together; (11) an open notebook with a green leaf and a pencil — a lesson summary; (12) a clipboard with a checklist of ticks and a pencil — an end-of-chapter test.
```

## arkusz-01-maskotka — Maskotka (4 pozy) (2×2)

Komórki (wierszami): `maskotka-czesc`, `maskotka-ok`, `maskotka-brawo`, `maskotka-mysli`

```
Create one square image (1:1) with a grid of 2 columns × 2 rows: the same mascot character in 4 different poses, each pose centered in its own cell with clear empty space between cells; nothing crosses cell borders. The character: a cute 3D clay mascot for a biology learning app — a small mint-green tree frog with big friendly eyes, tiny pink cheeks and a small lilac explorer satchel. Keep the same character, proportions and colors in all four poses. Row 1: (1) waving hello with one hand, smiling; (2) giving a cheerful thumbs-up and nodding. Row 2: (3) jumping with joy, arms up, a few small pastel confetti pieces and stars around; (4) thinking, holding a small magnifying glass near its chin, eyes looking up, with a tiny empty thought bubble. Style: cute 3D clay icons — smooth matte plasticine, soft rounded shapes, soft pastel palette (lilac, mint, butter yellow, peach, sky blue, pink) with natural accents only where biology needs them (red blood cells, green leaves). Soft studio light from the top left and a gentle soft shadow under each object. Friendly for a 12-year-old, not babyish. Biologically correct shapes and counts (insects have 6 legs, spiders have 8, an earthworm shows ring segments). No text, no letters, no numbers, no labels, no frames, no background scene. Transparent background (PNG).
```

## arkusz-02-dzialy — Działy podręcznika (3×2)

Komórki (wierszami): `dzial-1`, `dzial-2`, `dzial-3`, `dzial-4`, `dzial-5`, `biologia`

```
Create one square image (1:1) with a grid of 3 columns × 2 rows = 6 separate icons for chapters of a 6th-grade biology textbook about animals, each icon centered in its own cell with clear empty space between cells; nothing crosses cell borders. Row 1: (1) a microscope next to a single animal cell, a paw print and a feather — the animal kingdom; (2) a jellyfish next to an earthworm with ring segments — simple invertebrates; (3) a beetle with jointed legs next to a snail with a spiral shell — arthropods and molluscs. Row 2: (4) a fish, a frog and a lizard grouped together — cold-blooded vertebrates; (5) a small bird and a fox grouped together with a small warm sun — warm-blooded vertebrates; (6) a green leaf, a DNA double helix and a magnifying glass — biology in general. Style: cute 3D clay icons — smooth matte plasticine, soft rounded shapes, soft pastel palette (lilac, mint, butter yellow, peach, sky blue, pink) with natural accents only where biology needs them (red blood cells, green leaves). Soft studio light from the top left and a gentle soft shadow under each object. Friendly for a 12-year-old, not babyish. Biologically correct shapes and counts (insects have 6 legs, spiders have 8, an earthworm shows ring segments). No text, no letters, no numbers, no labels, no frames, no background scene. Transparent background (PNG).
```

## arkusz-03-lekcje-1 — Lekcje: działy I–III (4×3)

Komórki (wierszami): `dz1-l1`, `dz1-l2`, `dz1-l3`, `dz2-l1`, `dz2-l2`, `dz2-l3`, `dz2-l4`, `dz3-l1`, `dz3-l2`, `dz3-l3`, `dz3-l4`, `dz3-l5`

```
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate icons for lessons of a 6th-grade biology textbook, each icon centered in its own cell with clear empty space between cells; nothing crosses cell borders. Row 1: (1) a microscope next to a paw print, a feather and a fish scale — the animal kingdom; (2) three tissue samples side by side: a layer of tightly packed cells, a striped muscle fiber and a nerve cell (neuron) with branching ends; (3) connective tissue: a small bone, a piece of cartilage and a drop of blood with round red blood cells; (4) a jellyfish (medusa) next to a small hydra polyp with tentacles. Row 2: (5) a flat, leaf-shaped planarian flatworm next to a long, flat, segmented tapeworm ribbon (stylized, not gross); (6) a thin round worm (nematode) curled on a little mound of soil next to an apple; (7) an earthworm with clearly visible ring segments and a thicker saddle band, next to a small leech; (8) a beetle with a shiny hard exoskeleton and clearly jointed legs. Row 3: (9) a crayfish and a small crab with hard shells; (10) a ladybug and a butterfly, each with 6 legs; (11) a spider with exactly 8 legs sitting on a small web; (12) a snail with a spiral shell, an open clam shell and a small octopus. Style: cute 3D clay icons — smooth matte plasticine, soft rounded shapes, soft pastel palette (lilac, mint, butter yellow, peach, sky blue, pink) with natural accents only where biology needs them (red blood cells, green leaves). Soft studio light from the top left and a gentle soft shadow under each object. Friendly for a 12-year-old, not babyish. Biologically correct shapes and counts (insects have 6 legs, spiders have 8, an earthworm shows ring segments). No text, no letters, no numbers, no labels, no frames, no background scene. Transparent background (PNG).
```

## arkusz-04-lekcje-2 — Lekcje: działy IV–V, podsumowanie i test (4×3)

Komórki (wierszami): `dz4-l1`, `dz4-l2`, `dz4-l3`, `dz4-l4`, `dz4-l5`, `dz4-l6`, `dz5-l1`, `dz5-l2`, `dz5-l3`, `dz5-l4`, `podsumowanie`, `test`

```
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate icons for lessons of a 6th-grade biology textbook, each icon centered in its own cell with clear empty space between cells; nothing crosses cell borders. Row 1: (1) a fish with clearly visible fins, scales and gill covers, with a few bubbles; (2) three different fish together (a carp, a trout and a small flatfish) with a water plant; (3) a green frog next to a tadpole and a small cluster of frog eggs; (4) a salamander and a toad sitting on a stone. Row 2: (5) a lizard next to two leathery reptile eggs; (6) a turtle next to a coiled snake; (7) a bird with clearly drawn feathers standing beside a nest with an egg; (8) an owl, a penguin and a sparrow standing together. Row 3: (9) a mother fox curled around her cub (mammals feed their young with milk), simple and cute; (10) a bat, a small whale and a mouse together; (11) an open notebook with a green leaf and a pencil — a lesson summary; (12) a clipboard with a checklist of ticks and a pencil — an end-of-chapter test. Style: cute 3D clay icons — smooth matte plasticine, soft rounded shapes, soft pastel palette (lilac, mint, butter yellow, peach, sky blue, pink) with natural accents only where biology needs them (red blood cells, green leaves). Soft studio light from the top left and a gentle soft shadow under each object. Friendly for a 12-year-old, not babyish. Biologically correct shapes and counts (insects have 6 legs, spiders have 8, an earthworm shows ring segments). No text, no letters, no numbers, no labels, no frames, no background scene. Transparent background (PNG).
```

## Po wygenerowaniu

- Zapisz arkusz jako PNG/WebP z przezroczystym tłem i wyślij go w czacie z nazwą arkusza.
- Jeśli ChatGPT da białe tło zamiast przezroczystego, poproś: „Make the background fully transparent, keep everything else the same.”
- Gdy jakiś obiekt wyjdzie źle (np. pająk z 6 nogami), poproś o poprawkę tylko tej komórki: „Fix only the spider in row 3, column 3 — it must have exactly 8 legs; keep everything else identical.”
