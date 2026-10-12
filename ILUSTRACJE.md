# Ilustracje Biologozy — prompty do ChatGPT

Styl: atlas przyrodniczy (tusz + akwarela, dokładna anatomia, spokojne barwy) — wybór Wojtka 2026-10-12, po odrzuceniu słodkiej
plasteliny 3D („obrazki dla pięciolatka”). Bez maskotki. Zasada całego projektu: grafika dla 11–13 lat (`~/CLAUDE.md`).

Wojtek wkleja jeden zbiorczy prompt — ChatGPT generuje obrazy po kolei. Pojedyncze prompty niżej służą do poprawek.
Źródło: `narzedzia/prompty.json`. Gotowe arkusze tnie `tnij_arkusz.py` z Lingozy (siatka kolumny×wiersze, nazwy komórek jak niżej).

## Zbiorczy prompt

```
Please generate 3 separate images for a biology learning app for 11–13-year-olds, one after another (Image 1, then 2, then 3). Do not ask me questions in between — just generate all of them in order. Every image uses the same visual style described below.

Style: natural history atlas plates — precise fine ink linework with delicate watercolor washes, scientifically accurate anatomy and proportions, calm natural colors (muted greens, ochres, slate blues, soft reds), subtle hand-drawn hatching for volume, like illustrations in a good zoology atlas or field guide for teenagers. Serious and mature: no cartoon faces, no big cute eyes, no smiles, no mascots, no toys, no confetti, no plasticine or 3D clay look. Correct counts and structures (insects have 6 legs, spiders 8, an earthworm shows ring segments and a saddle band). No text, no letters, no numbers, no labels or callout lines, no frames, no background scene. Each subject drawn in isolation on a fully transparent background (PNG), with no paper texture outside the subject.

Grid rules for every image: square 1:1 canvas, subjects arranged in an even grid, each subject centered in its own cell with clear empty space around it, nothing crossing cell borders, consistent scale and line weight within one image.

IMAGE 1 of 3 — arkusz-01-dzialy (3 columns × 2 rows)
Create one square image (1:1) with a grid of 3 columns × 2 rows = 6 separate atlas illustrations for the chapters of a 6th-grade biology textbook about animals. Row 1: (1) a brass microscope beside a magnified animal cell and a feather — the animal kingdom and its tissues; (2) a moon jellyfish with trailing tentacles beside an earthworm — simple invertebrates; (3) a stag beetle beside a Roman snail — arthropods and molluscs. Row 2: (4) a perch, a common frog and a sand lizard arranged together — cold-blooded vertebrates; (5) a European robin perched above a red fox — warm-blooded vertebrates; (6) an oak leaf crossed with a DNA double helix and a magnifying glass — biology in general.

IMAGE 2 of 3 — arkusz-02-lekcje-1 (4 columns × 3 rows)
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate atlas illustrations for lessons of a 6th-grade biology textbook. Row 1: (1) the animal kingdom — a microscope with a hand lens, a feather, a fish scale and a small beetle arranged like a naturalist's study; (2) animal tissues as magnified samples: a sheet of tightly packed epithelial cells, a striated muscle fiber and a branching neuron; (3) connective tissue: a cross-section of bone, a piece of cartilage and magnified blood with red and white blood cells; (4) cnidarians: a moon jellyfish (medusa) beside a freshwater hydra polyp with tentacles. Row 2: (5) flatworms: a flat planarian beside a coiled, segmented tapeworm — scientific, not gross; (6) roundworms: a slender roundworm on a cross-section of soil beside a carrot root; (7) annelids: an earthworm with clear ring segments and a saddle band, beside a medicinal leech; (8) arthropod features: a beetle in side view with jointed legs and a hard exoskeleton, one leg drawn slightly apart to show its joints. Row 3: (9) crustaceans: a crayfish and a shore crab; (10) insects: a swallowtail butterfly and a seven-spot ladybird, each with 6 legs; (11) arachnids: a garden cross spider with exactly 8 legs on a fragment of orb web; (12) molluscs: a Roman snail, an open freshwater mussel shell and a common octopus.

IMAGE 3 of 3 — arkusz-03-lekcje-2 (4 columns × 3 rows)
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate atlas illustrations for lessons of a 6th-grade biology textbook. Row 1: (1) fish anatomy: a perch in side view with fins, scales and gill cover clearly drawn; (2) diversity of fish: a carp, a brown trout and a flounder grouped with a strand of waterweed; (3) amphibians: a common frog beside its tadpole stages and a clump of frogspawn; (4) diversity of amphibians: a fire salamander and a common toad on a mossy stone. Row 2: (5) reptiles: a sand lizard beside two leathery eggs; (6) diversity of reptiles: a European pond turtle and a grass snake; (7) birds: a feather study beside a bird skeleton detail and an egg in a nest; (8) diversity of birds: a tawny owl, a king penguin and a house sparrow. Row 3: (9) mammals: a red fox vixen nursing her cubs; (10) diversity of mammals: a pipistrelle bat, a harbour porpoise and a field mouse; (11) chapter summary: an open naturalist's field notebook with small sketches of animals, a pencil and a hand lens; (12) end-of-chapter test: a pinned insect specimen card, a hand lens and a sharpened pencil.
```

## arkusz-01-dzialy — Działy podręcznika (3×2)

Komórki (wierszami): `dzial-1`, `dzial-2`, `dzial-3`, `dzial-4`, `dzial-5`, `biologia`

```
Create one square image (1:1) with a grid of 3 columns × 2 rows = 6 separate atlas illustrations for the chapters of a 6th-grade biology textbook about animals. Row 1: (1) a brass microscope beside a magnified animal cell and a feather — the animal kingdom and its tissues; (2) a moon jellyfish with trailing tentacles beside an earthworm — simple invertebrates; (3) a stag beetle beside a Roman snail — arthropods and molluscs. Row 2: (4) a perch, a common frog and a sand lizard arranged together — cold-blooded vertebrates; (5) a European robin perched above a red fox — warm-blooded vertebrates; (6) an oak leaf crossed with a DNA double helix and a magnifying glass — biology in general.

Style: natural history atlas plates — precise fine ink linework with delicate watercolor washes, scientifically accurate anatomy and proportions, calm natural colors (muted greens, ochres, slate blues, soft reds), subtle hand-drawn hatching for volume, like illustrations in a good zoology atlas or field guide for teenagers. Serious and mature: no cartoon faces, no big cute eyes, no smiles, no mascots, no toys, no confetti, no plasticine or 3D clay look. Correct counts and structures (insects have 6 legs, spiders 8, an earthworm shows ring segments and a saddle band). No text, no letters, no numbers, no labels or callout lines, no frames, no background scene. Each subject drawn in isolation on a fully transparent background (PNG), with no paper texture outside the subject.
```

## arkusz-02-lekcje-1 — Lekcje: działy I–III (4×3)

Komórki (wierszami): `dz1-l1`, `dz1-l2`, `dz1-l3`, `dz2-l1`, `dz2-l2`, `dz2-l3`, `dz2-l4`, `dz3-l1`, `dz3-l2`, `dz3-l3`, `dz3-l4`, `dz3-l5`

```
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate atlas illustrations for lessons of a 6th-grade biology textbook. Row 1: (1) the animal kingdom — a microscope with a hand lens, a feather, a fish scale and a small beetle arranged like a naturalist's study; (2) animal tissues as magnified samples: a sheet of tightly packed epithelial cells, a striated muscle fiber and a branching neuron; (3) connective tissue: a cross-section of bone, a piece of cartilage and magnified blood with red and white blood cells; (4) cnidarians: a moon jellyfish (medusa) beside a freshwater hydra polyp with tentacles. Row 2: (5) flatworms: a flat planarian beside a coiled, segmented tapeworm — scientific, not gross; (6) roundworms: a slender roundworm on a cross-section of soil beside a carrot root; (7) annelids: an earthworm with clear ring segments and a saddle band, beside a medicinal leech; (8) arthropod features: a beetle in side view with jointed legs and a hard exoskeleton, one leg drawn slightly apart to show its joints. Row 3: (9) crustaceans: a crayfish and a shore crab; (10) insects: a swallowtail butterfly and a seven-spot ladybird, each with 6 legs; (11) arachnids: a garden cross spider with exactly 8 legs on a fragment of orb web; (12) molluscs: a Roman snail, an open freshwater mussel shell and a common octopus.

Style: natural history atlas plates — precise fine ink linework with delicate watercolor washes, scientifically accurate anatomy and proportions, calm natural colors (muted greens, ochres, slate blues, soft reds), subtle hand-drawn hatching for volume, like illustrations in a good zoology atlas or field guide for teenagers. Serious and mature: no cartoon faces, no big cute eyes, no smiles, no mascots, no toys, no confetti, no plasticine or 3D clay look. Correct counts and structures (insects have 6 legs, spiders 8, an earthworm shows ring segments and a saddle band). No text, no letters, no numbers, no labels or callout lines, no frames, no background scene. Each subject drawn in isolation on a fully transparent background (PNG), with no paper texture outside the subject.
```

## arkusz-03-lekcje-2 — Lekcje: działy IV–V, podsumowanie i test (4×3)

Komórki (wierszami): `dz4-l1`, `dz4-l2`, `dz4-l3`, `dz4-l4`, `dz4-l5`, `dz4-l6`, `dz5-l1`, `dz5-l2`, `dz5-l3`, `dz5-l4`, `podsumowanie`, `test`

```
Create one square image (1:1) with a grid of 4 columns × 3 rows = 12 separate atlas illustrations for lessons of a 6th-grade biology textbook. Row 1: (1) fish anatomy: a perch in side view with fins, scales and gill cover clearly drawn; (2) diversity of fish: a carp, a brown trout and a flounder grouped with a strand of waterweed; (3) amphibians: a common frog beside its tadpole stages and a clump of frogspawn; (4) diversity of amphibians: a fire salamander and a common toad on a mossy stone. Row 2: (5) reptiles: a sand lizard beside two leathery eggs; (6) diversity of reptiles: a European pond turtle and a grass snake; (7) birds: a feather study beside a bird skeleton detail and an egg in a nest; (8) diversity of birds: a tawny owl, a king penguin and a house sparrow. Row 3: (9) mammals: a red fox vixen nursing her cubs; (10) diversity of mammals: a pipistrelle bat, a harbour porpoise and a field mouse; (11) chapter summary: an open naturalist's field notebook with small sketches of animals, a pencil and a hand lens; (12) end-of-chapter test: a pinned insect specimen card, a hand lens and a sharpened pencil.

Style: natural history atlas plates — precise fine ink linework with delicate watercolor washes, scientifically accurate anatomy and proportions, calm natural colors (muted greens, ochres, slate blues, soft reds), subtle hand-drawn hatching for volume, like illustrations in a good zoology atlas or field guide for teenagers. Serious and mature: no cartoon faces, no big cute eyes, no smiles, no mascots, no toys, no confetti, no plasticine or 3D clay look. Correct counts and structures (insects have 6 legs, spiders 8, an earthworm shows ring segments and a saddle band). No text, no letters, no numbers, no labels or callout lines, no frames, no background scene. Each subject drawn in isolation on a fully transparent background (PNG), with no paper texture outside the subject.
```

## Po wygenerowaniu

- Białe tło zamiast przezroczystego: „Make the background fully transparent, keep everything else the same.”
- Jeden obiekt źle (np. pająk z 6 nogami): „Fix only the spider in row 3, column 3 — exactly 8 legs; keep everything else identical.”
