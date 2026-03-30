---
sidebar_position: 11
title: Produktprising — beregne salgspris
description: Komplett guide til å prise 3D-prints for salg med alle kostnadsfaktorer
---

# Produktprising — beregne salgspris

Denne guiden forklarer hvordan du bruker kostnadsberegneren til å finne riktig salgspris for 3D-prints du selger.

## Kostnadsoversikt

Kostnaden for en 3D-print består av disse komponentene:

| Komponent | Beskrivelse | Eksempel |
|-----------|-------------|---------|
| **Filament** | Materialkostnad basert på vekt og spolpris | 100g × 0.25 kr/g = 25 kr |
| **Avfall** | Materialsvinn (purge, feilprints, støtte) | 10% ekstra = 2.50 kr |
| **Strøm** | Strømforbruk under printing | 3.5t × 150W × 1.50 kr/kWh = 0.79 kr |
| **Slitasje** | Dyse + maskinverdi over levetid | 3.5t × 0.15 kr/t = 0.53 kr |
| **Arbeid** | Din tid for oppsett, etterbehandling, pakking | 10 min × 200 kr/t = 33.33 kr |
| **Påslag** | Profittmargin | 20% = 12.43 kr |

**Total produksjonskostnad** = sum av alle komponenter

## Konfigurere innstillinger

### Grunninnstillinger

Gå til **Filament → ⚙ Innstillinger** og fyll inn:

1. **Strømpris (kr/kWh)** — din strømpris. Sjekk strømregningen eller bruk Nordpool-integrasjonen
2. **Printereffekt (W)** — typisk 150W for Bambu Lab-printere
3. **Maskinkostnad (kr)** — hva du betalte for printeren
4. **Maskinlevetid (timer)** — forventet levetid (3000-8000 timer)
5. **Arbeidskostnad (kr/time)** — din timepris
6. **Oppsett-tid (min)** — gjennomsnittlig tid for filamentbytte, platesjekk, pakking
7. **Påslag (%)** — profittmargin du ønsker
8. **Dysekostnad (kr/time)** — slitasje på dyse (HS01 ≈ 0.05 kr/t)
9. **Avfallsfaktor** — materialsvinn (1.1 = 10% ekstra, 1.15 = 15%)

:::tip Typiske verdier for Bambu Lab
| Innstilling | Hobbyist | Semi-pro | Profesjonell |
|---|---|---|---|
| Strømpris | 1.50 kr/kWh | 1.50 kr/kWh | 1.00 kr/kWh |
| Printereffekt | 150W | 150W | 150W |
| Maskinkostnad | 5 000 kr | 12 000 kr | 25 000 kr |
| Maskinlevetid | 3 000t | 5 000t | 8 000t |
| Arbeidskostnad | 0 kr/t | 150 kr/t | 250 kr/t |
| Oppsett-tid | 5 min | 10 min | 15 min |
| Påslag | 0% | 30% | 50% |
| Avfallsfaktor | 1.05 | 1.10 | 1.15 |
:::

## Beregne kostnad

1. Gå til **Kostnadsberegner** (`https://localhost:3443/#costestimator`)
2. **Dra og slipp** en `.3mf` eller `.gcode`-fil
3. Systemet leser automatisk: filamentvekt, estimert tid, farger
4. **Koble spoler** — velg hvilke spoler fra lageret som brukes
5. Klikk **Beregn kostnad**

### Resultatet viser:

- **Filament** — materialkostnad per farge
- **Avfall/svinn** — basert på avfallsfaktoren
- **Strøm** — bruker live spotpris fra Nordpool hvis tilgjengelig
- **Slitasje** — dyse + maskinverdi
- **Arbeid** — timerate + oppsett-tid
- **Produksjonskostnad** — sum av alt over
- **Påslag** — din profittmargin
- **Totalkostnad** — hva du minimum bør ta
- **Foreslåtte salgspriser** — 2×, 2.5×, 3× margin

## Prisingsstrategier

### 2× margin (anbefalt minimum)
Dekker produksjonskostnad + uforutsette utgifter. Bruk for venner/familie og enkel geometri.

### 2.5× margin (standard)
God balanse mellom pris og verdi. Fungerer for de fleste produkter.

### 3× margin (premium)
For komplekse modeller, multicolor, høy kvalitet, eller nisjemarkeder.

:::warning Ikke glem skjulte kostnader
- Feilprints (5-15% av alle prints feiler)
- Filament som ikke brukes opp (siste 50g er ofte vanskelig)
- Tid brukt på kundeservice
- Emballasje og frakt
- Vedlikehold av printer
:::

## Eksempel: Prise en telefonholder

| Parameter | Verdi |
|-----------|-------|
| Filamentvekt | 45g PLA |
| Printtid | 2 timer |
| Spotpris | 1.20 kr/kWh |

**Beregning:**
- Filament: 45g × 0.25 kr/g = 11.25 kr
- Avfall (10%): 1.13 kr
- Strøm: 2t × 0.15kW × 1.20 = 0.36 kr
- Slitasje: 2t × 0.15 = 0.30 kr
- Arbeid: (2t + 10min) × 200 kr/t = 433 kr (eller 0 for hobby)
- **Produksjonskostnad (hobby)**: ~13 kr
- **Salgspris 2.5×**: ~33 kr

## Lagre estimat

Klikk **Lagre estimat** for å arkivere beregningen. Lagrede estimater finner du under **Lagrede**-fanen i kostnadsberegneren.

## E-handel

Bruker du [e-handelsmodulen](../integrations/ecommerce), kan du koble kostnadsestimater direkte til ordrer for automatisk prisberegning.
