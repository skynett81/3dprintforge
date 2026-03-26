---
sidebar_position: 8
title: PVA og støttematerialer
description: Guide til PVA, HIPS, PVB og andre støttematerialer for Bambu Lab-printere
---

# PVA og støttematerialer

Støttematerialer brukes for å printe komplekse geometrier med overheng, broer og innvendige hulrom som ikke kan printes uten midlertidig støtte. Etter printing fjernes støttematerialet — enten mekanisk eller ved oppløsning i et løsemiddel.

## Oversikt

| Materiale | Løsemiddel | Kombiner med | Oppløsningstid | Vanskelighetsgrad |
|-----------|-----------|-------------|----------------|-------------------|
| PVA | Vann | PLA, PETG | 12–24 timer | Krevende |
| HIPS | d-Limonen | ABS, ASA | 12–24 timer | Moderat |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 timer | Moderat |
| BVOH | Vann | PLA, PETG, PA | 4–8 timer | Krevende |

---

## PVA (Polyvinylalkohol)

PVA er et vannløselig støttemateriale som er det mest brukte valget for PLA-baserte print med komplekse støttestrukturer.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 190–210 °C |
| Sengtemperatur | 45–60 °C |
| Del-kjøling | 100% |
| Hastighet | 60–80% |
| Retraction | Økt (6–8 mm) |

### Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Utmerket | Nei |
| Textured PEI | God | Nei |
| Engineering Plate | God | Nei |
| High Temp Plate | Unngå | — |

### Kompatibilitet

PVA fungerer best med materialer som printer ved **lignende temperaturer**:

| Hovemateriale | Kompatibilitet | Merknad |
|---------------|---------------|---------|
| PLA | Utmerket | Ideell kombinasjon |
| PETG | God | Sengtemp kan være litt høy for PVA |
| ABS/ASA | Dårlig | For høy kammertemp — PVA degraderer |
| PA (Nylon) | Dårlig | For høye temperaturer |

### Oppløsning

- Legg den ferdige printen i **lunkent vann** (ca. 40 °C)
- PVA løses opp i løpet av **12–24 timer** avhengig av tykkelse
- Rør i vannet med jevne mellomrom for å akselerere prosessen
- Bytt vann hver 6–8 timer for raskere oppløsning
- Ultrasonisk renser gir vesentlig raskere resultat (2–6 timer)

:::danger PVA er ekstremt hygroskopisk
PVA absorberer fuktighet fra luften **svært raskt** — selv timer med eksponering kan ødelegge printeresultatet. PVA som har absorbert fuktighet gir:

- Kraftig bobling og poppende lyder
- Dårlig adhesjon til hovedmaterialet
- Stringing og klissete overflate
- Blokkert dyse

**Tørk alltid PVA umiddelbart før bruk** og print fra tørt miljø (tørkeboks).
:::

### Tørking av PVA

| Parameter | Verdi |
|-----------|-------|
| Tørketemperatur | 45–55 °C |
| Tørketid | 6–10 timer |
| Hygroskopisk nivå | Ekstremt høy |
| Oppbevaringsmetode | Forseglet boks med tørkemiddel, alltid |

---

## HIPS (High Impact Polystyrene)

HIPS er et støttemateriale som løses i d-limonen (sitrusbasert løsemiddel). Det er det foretrukne støttematerialet for ABS og ASA.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 220–240 °C |
| Sengtemperatur | 90–100 °C |
| Kammertemperatur | 40–50 °C (anbefalt) |
| Del-kjøling | 20–40% |
| Hastighet | 70–90% |

### Kompatibilitet

| Hovemateriale | Kompatibilitet | Merknad |
|---------------|---------------|---------|
| ABS | Utmerket | Ideell kombinasjon — like temperaturer |
| ASA | Utmerket | Svært god adhesjon |
| PLA | Dårlig | For stor temperaturforskjell |
| PETG | Dårlig | Ulik termisk oppførsel |

### Oppløsning i d-Limonen

- Legg printen i **d-limonen** (sitrusbasert løsemiddel)
- Oppløsningstid: **12–24 timer** ved romtemperatur
- Oppvarming til 35–40 °C akselererer prosessen
- d-Limonen kan gjenbrukes 2–3 ganger
- Skyll delen i vann og tørk etter oppløsning

### Fordeler over PVA

- **Mye mindre fuktighetssensitiv** — enklere å oppbevare og håndtere
- **Sterkere som støttemateriale** — tåler mer uten å brytes ned
- **Bedre termisk kompatibilitet** med ABS/ASA
- **Lettere å printe** — færre tilstoppinger og problemer

:::warning d-Limonen er et løsemiddel
Bruk hansker og jobb i ventilert rom. d-Limonen kan irritere hud og slimhinner. Oppbevar utilgjengelig for barn.
:::

---

## PVB (Polyvinylbutyral)

PVB er et unikt støttemateriale som løses i isopropanol (IPA) og kan brukes til å glatte overflater med IPA-damp.

### Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 200–220 °C |
| Sengtemperatur | 55–75 °C |
| Del-kjøling | 80–100% |
| Hastighet | 70–80% |

### Kompatibilitet

| Hovemateriale | Kompatibilitet | Merknad |
|---------------|---------------|---------|
| PLA | God | Akseptabel adhesjon |
| PETG | Moderat | Sengtemp kan variere |
| ABS/ASA | Dårlig | For høye temperaturer |

### Overflategletting med IPA-damp

PVBs unike egenskap er at overflaten kan glattes med IPA-damp:

1. Plasser delen i en lukket beholder
2. Legg IPA-fuktet klut i bunnen (ikke direkte kontakt med delen)
3. La dampen virke i **30–60 minutter**
4. Ta ut og la tørke i 24 timer
5. Resultatet er en jevn, semi-glanset overflate

:::tip PVB som overflatefinish
Selv om PVB primært er et støttemateriale, kan det printes som ytterste lag på PLA-deler for å gi en overflate som kan IPA-glattes. Dette gir en etterbehandling som minner om acetonglettet ABS.
:::

---

## Sammenligning av støttematerialer

| Egenskap | PVA | HIPS | PVB | BVOH |
|----------|-----|------|-----|------|
| Løsemiddel | Vann | d-Limonen | IPA | Vann |
| Oppløsningstid | 12–24 t | 12–24 t | 6–12 t | 4–8 t |
| Fuktfølsomhet | Ekstremt høy | Lav | Moderat | Ekstremt høy |
| Vanskelighetsgrad | Krevende | Moderat | Moderat | Krevende |
| Pris | Høy | Moderat | Høy | Svært høy |
| Best med | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Tilgjengelighet | God | God | Begrenset | Begrenset |
| AMS-kompatibel | Ja (med tørkemiddel) | Ja | Ja | Problematisk |

---

## Tips for dual-extrusion og multicolor

### Generelle retningslinjer

- **Purge-mengde** — støttematerialer krever god purging ved materialbytte (minst 150–200 mm³)
- **Interface-lag** — bruk 2–3 interface-lag mellom støtte og hoveddel for ren overflate
- **Avstand** — sett støtteavstand til 0.1–0.15 mm for enkelt fjerning etter oppløsning
- **Støttemønster** — bruk trekantmønster for PVA/BVOH, gitter for HIPS

### AMS-oppsett

- Plasser støttematerialet i en **AMS-slot med tørkemiddel**
- For PVA: vurder ekstern tørkeboks med Bowden-tilkobling
- Konfigurer riktig materiale-profil i Bambu Studio
- Test med en enkel overheng-modell før du printer komplekse deler

### Vanlige problemer og løsninger

| Problem | Årsak | Løsning |
|---------|-------|---------|
| Støtte fester seg ikke | For stor avstand | Reduser interface-avstand til 0.05 mm |
| Støtte fester seg for godt | For liten avstand | Øk interface-avstand til 0.2 mm |
| Bobler i støttemateriale | Fuktighet | Tørk filamentet grundig |
| Stringing mellom materialer | Utilstrekkelig retraction | Øk retraction med 1–2 mm |
| Dårlig overflate mot støtte | For få interface-lag | Øk til 3–4 interface-lag |

:::tip Start enkelt
For din første print med støttemateriale: bruk PLA + PVA, en enkel modell med tydelig overheng (45°+), og standardinnstillinger i Bambu Studio. Optimaliser etter hvert som du får erfaring.
:::
