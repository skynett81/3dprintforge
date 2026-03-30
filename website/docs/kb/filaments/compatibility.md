---
sidebar_position: 10
title: Kompatibilitetsmatrise
description: Komplett oversikt over materialkompatibilitet med Bambu Lab-plater, printere og dyser
---

# Kompatibilitetsmatrise

Denne siden gir en komplett oversikt over hvilke materialer som fungerer med hvilke byggplater, printere og dysetyper. Bruk tabellene som referanse når du planlegger print med nye materialer.

---

## Materialer og byggplater

| Materiale | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Limstift |
|-----------|-----------|-------------------|-----------------|--------------|----------|
| PLA | Utmerket | God | Ikke anbefalt | God | Nei |
| PLA+ | Utmerket | God | Ikke anbefalt | God | Nei |
| PLA-CF | Utmerket | God | Ikke anbefalt | God | Nei |
| PLA Silk | Utmerket | God | Ikke anbefalt | God | Nei |
| PETG | Dårlig | Utmerket | God | God | Ja (Cool) |
| PETG-CF | Dårlig | Utmerket | God | Akseptabel | Ja (Cool) |
| ABS | Ikke anbefalt | Utmerket | God | Akseptabel | Ja (HT) |
| ASA | Ikke anbefalt | Utmerket | God | Akseptabel | Ja (HT) |
| TPU | God | God | Ikke anbefalt | Utmerket | Nei |
| PA (Nylon) | Ikke anbefalt | Utmerket | God | Dårlig | Ja |
| PA-CF | Ikke anbefalt | Utmerket | God | Dårlig | Ja |
| PA-GF | Ikke anbefalt | Utmerket | God | Dårlig | Ja |
| PC | Ikke anbefalt | Akseptabel | Utmerket | Ikke anbefalt | Ja (Eng) |
| PC-CF | Ikke anbefalt | Akseptabel | Utmerket | Ikke anbefalt | Ja (Eng) |
| PVA | Utmerket | God | Ikke anbefalt | God | Nei |
| HIPS | Ikke anbefalt | God | God | Akseptabel | Nei |
| PVB | God | God | Ikke anbefalt | God | Nei |

**Forklaring:**
- **Utmerket** — fungerer optimalt, anbefalt kombinasjon
- **God** — fungerer godt, akseptabelt alternativ
- **Akseptabel** — fungerer, men ikke ideell — krever ekstra tiltak
- **Dårlig** — kan fungere med modifikasjoner, men ikke anbefalt
- **Ikke anbefalt** — dårlige resultater eller risiko for skade på platen

:::tip PETG og Cool Plate
PETG hefter **for godt** på Cool Plate (Smooth PEI) og kan rive av PEI-belegget når delen fjernes. Bruk alltid limstift som separasjonsfilm, eller velg Engineering Plate.
:::

:::warning PC og platevalg
PC krever High Temp Plate på grunn av de høye sengtemperaturene (100–120 °C). Andre plater kan bli permanent deformert ved disse temperaturene.
:::

---

## Materialer og printere

| Materiale | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|-----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA+ | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PLA-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| PETG | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PETG-CF | Ja* | Ja* | Ja* | Ja* | Ja* | Ja | Ja | Ja* | Ja* | Ja* |
| ABS | Nei | Nei | Mulig** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| ASA | Nei | Nei | Mulig** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| TPU | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| PA (Nylon) | Nei | Nei | Nei | Mulig** | Mulig** | Ja | Ja | Ja | Ja | Ja |
| PA-CF | Nei | Nei | Nei | Nei | Nei | Ja | Ja | Mulig** | Mulig** | Mulig** |
| PA-GF | Nei | Nei | Nei | Nei | Nei | Ja | Ja | Mulig** | Mulig** | Mulig** |
| PC | Nei | Nei | Nei | Mulig** | Nei | Ja | Ja | Mulig** | Mulig** | Mulig** |
| PC-CF | Nei | Nei | Nei | Nei | Nei | Ja | Ja | Nei | Nei | Nei |
| PVA | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja | Ja |
| HIPS | Nei | Nei | Mulig** | Ja | Ja | Ja | Ja | Ja | Ja | Ja |

**Forklaring:**
- **Ja** — fullt støttet og anbefalt
- **Ja*** — krever herdet stål-dyse (HS01 eller tilsvarende)
- **Mulig**** — kan fungere med begrensninger, ikke offisielt anbefalt
- **Nei** — ikke egnet (mangler innelukke, for lave temperaturer, etc.)

:::danger Enclosure-krav
Materialer som krever innelukke (ABS, ASA, PA, PC):
- **A1 og A1 Mini** har åpen ramme — ikke egnet
- **P1P** har åpen ramme — krever innelukke-tilbehør
- **P1S** har innelukke, men ingen aktiv kammeroppvarming
- **X1C og X1E** har fullt innelukke med aktiv oppvarming — anbefalt for krevende materialer
:::

---

## Materialer og dysetyper

| Materiale | Messing (standard) | Herdet stål (HS01) | Hardened Steel |
|-----------|--------------------|--------------------|----------------|
| PLA | Utmerket | Utmerket | Utmerket |
| PLA+ | Utmerket | Utmerket | Utmerket |
| PLA-CF | Ikke bruk | Utmerket | Utmerket |
| PLA Silk | Utmerket | Utmerket | Utmerket |
| PETG | Utmerket | Utmerket | Utmerket |
| PETG-CF | Ikke bruk | Utmerket | Utmerket |
| ABS | Utmerket | Utmerket | Utmerket |
| ASA | Utmerket | Utmerket | Utmerket |
| TPU | Utmerket | God | God |
| PA (Nylon) | God | Utmerket | Utmerket |
| PA-CF | Ikke bruk | Utmerket | Utmerket |
| PA-GF | Ikke bruk | Utmerket | Utmerket |
| PC | God | Utmerket | Utmerket |
| PC-CF | Ikke bruk | Utmerket | Utmerket |
| PVA | Utmerket | God | God |
| HIPS | Utmerket | Utmerket | Utmerket |
| PVB | Utmerket | God | God |

:::danger Karbonfiber og glassfiber krever herdet dyse
Alle materialer med **-CF** (karbonfiber) eller **-GF** (glassfiber) **krever herdet stål-dyse**. Messing slites ut på timer til dager med disse materialene. Bambu Lab HS01 er anbefalt.

Materialer som krever herdet dyse:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Messing vs herdet stål for vanlige materialer
Messingdyse gir **bedre varmeledning** og dermed jevnere ekstrudering for vanlige materialer (PLA, PETG, ABS). Herdet stål fungerer fint, men kan kreve 5–10 °C høyere temperatur. Bruk messing for daglig bruk og bytt til herdet stål for CF/GF-materialer.
:::

---

## Tips for materialbytter

Når du bytter mellom materialer i AMS eller manuelt, er riktig purging viktig for å unngå kontaminering.

### Anbefalt purge-mengde

| Fra → Til | Purge-mengde | Merknad |
|-----------|-------------|---------|
| PLA → PLA (annen farge) | 100–150 mm³ | Standard fargeskifte |
| PLA → PETG | 200–300 mm³ | Temperaturøkning, ulik flyt |
| PETG → PLA | 200–300 mm³ | Temperatursenking |
| ABS → PLA | 300–400 mm³ | Stor temperaturforskjell |
| PLA → ABS | 300–400 mm³ | Stor temperaturforskjell |
| PA → PLA | 400–500 mm³ | Nylon henger igjen i hotend |
| PC → PLA | 400–500 mm³ | PC krever grundig purging |
| Mørk → Lys farge | 200–300 mm³ | Mørkt pigment er vanskelig å rense |
| Lys → Mørk farge | 100–150 mm³ | Lettere overgang |

### Temperaturendring ved materialbytte

| Overgang | Anbefaling |
|----------|-----------|
| Kald → Varm (f.eks. PLA → ABS) | Varme opp til nytt materiale, purge grundig |
| Varm → Kald (f.eks. ABS → PLA) | Purge først ved høy temp, senk deretter |
| Like temperaturer (f.eks. PLA → PLA) | Standard purge |
| Stor forskjell (f.eks. PLA → PC) | Mellomstopp med PETG kan hjelpe |

:::warning Nylon og PC etterlater rester
PA (Nylon) og PC er spesielt vanskelige å purge ut. Etter bruk av disse materialene:
1. Purge med **PETG** eller **ABS** ved høy temperatur (260–280 °C)
2. Kjør minst **500 mm³** purge-materiale
3. Inspiser ekstruderingen visuelt — den skal være helt ren uten misfarging
:::

---

## Hurtigreferanse — materialvalg

Usikker på hvilket materiale du trenger? Bruk denne veiledningen:

| Behov | Anbefalt materiale |
|-------|-------------------|
| Prototyping / daglig bruk | PLA |
| Mekanisk styrke | PETG, PLA Tough |
| Utendørs bruk | ASA |
| Varmeresistens | ABS, ASA, PC |
| Fleksible deler | TPU |
| Maksimal styrke | PA-CF, PC-CF |
| Gjennomsiktig | PETG (naturlig), PC (naturlig) |
| Estetikk / dekorasjon | PLA Silk, PLA Sparkle |
| Snap-fit / levende hengsler | PETG, PA |
| Mat-kontakt | PLA (med forbehold) |
