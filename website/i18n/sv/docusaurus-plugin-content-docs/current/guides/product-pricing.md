---
sidebar_position: 11
title: Produktprissättning — beräkna försäljningspris
description: Komplett guide för att prissätta 3D-utskrifter för försäljning med alla kostnadsfaktorer
---

# Produktprissättning — beräkna försäljningspris

Denna guide förklarar hur du använder kostnadskalkylatorn för att hitta rätt försäljningspris för 3D-utskrifter du säljer.

## Kostnadsöversikt

Kostnaden för en 3D-utskrift består av dessa komponenter:

| Komponent | Beskrivning | Exempel |
|-----------|-------------|---------|
| **Filament** | Materialkostnad baserad på vikt och spoolpris | 100g × 0,25 kr/g = 25 kr |
| **Svinn** | Materialspill (purge, felutskrifter, stöd) | 10% extra = 2,50 kr |
| **El** | Elförbrukning under utskrift | 3,5t × 150W × 1,50 kr/kWh = 0,79 kr |
| **Slitage** | Munstycke + maskinvärde under livstiden | 3,5t × 0,15 kr/t = 0,53 kr |
| **Arbete** | Din tid för uppställning, efterbehandling, packning | 10 min × 200 kr/t = 33,33 kr |
| **Påslag** | Vinstmarginal | 20% = 12,43 kr |

**Total produktionskostnad** = summan av alla komponenter

## Konfigurera inställningar

### Grundinställningar

Gå till **Filament → ⚙ Inställningar** och fyll i:

1. **Elpris (kr/kWh)** — ditt elpris. Kontrollera elräkningen eller använd Nordpool-integrationen
2. **Skrivareffekt (W)** — typiskt 150W för Bambu Lab-skrivare
3. **Maskinkostnad (kr)** — vad du betalade för skrivaren
4. **Maskinlivstid (timmar)** — förväntad livstid (3000-8000 timmar)
5. **Arbetskostnad (kr/timme)** — din timlön
6. **Uppställningstid (min)** — genomsnittlig tid för filamentbyte, plattkontroll, packning
7. **Påslag (%)** — önskad vinstmarginal
8. **Munstyckeskostnad (kr/timme)** — slitage på munstycke (HS01 ≈ 0,05 kr/t)
9. **Svinnfaktor** — materialspill (1,1 = 10% extra, 1,15 = 15%)

:::tip Typiska värden för Bambu Lab
| Inställning | Hobbyist | Semi-pro | Professionell |
|---|---|---|---|
| Elpris | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Skrivareffekt | 150W | 150W | 150W |
| Maskinkostnad | 5 000 kr | 12 000 kr | 25 000 kr |
| Maskinlivstid | 3 000t | 5 000t | 8 000t |
| Arbetskostnad | 0 kr/t | 150 kr/t | 250 kr/t |
| Uppställningstid | 5 min | 10 min | 15 min |
| Påslag | 0% | 30% | 50% |
| Svinnfaktor | 1,05 | 1,10 | 1,15 |
:::

## Beräkna kostnad

1. Gå till **Kostnadskalkylatorn** (`https://localhost:3443/#costestimator`)
2. **Dra och släpp** en `.3mf`- eller `.gcode`-fil
3. Systemet läser automatiskt: filamentvikt, beräknad tid, färger
4. **Koppla spolar** — välj vilka spolar från lagret som används
5. Klicka på **Beräkna kostnad**

### Resultatet visar:

- **Filament** — materialkostnad per färg
- **Svinn/spill** — baserat på svinnfaktorn
- **El** — använder live-spotpris från Nordpool om tillgängligt
- **Slitage** — munstycke + maskinvärde
- **Arbete** — timlön + uppställningstid
- **Produktionskostnad** — summan av allt ovan
- **Påslag** — din vinstmarginal
- **Totalkostnad** — vad du minst bör ta
- **Föreslagna försäljningspriser** — 2×, 2,5×, 3× marginal

## Prissättningsstrategier

### 2× marginal (rekommenderat minimum)
Täcker produktionskostnad + oförutsedda utgifter. Använd för vänner/familj och enkel geometri.

### 2,5× marginal (standard)
Bra balans mellan pris och värde. Fungerar för de flesta produkter.

### 3× marginal (premium)
För komplexa modeller, flerfärg, hög kvalitet eller nischmarknader.

:::warning Glöm inte de dolda kostnaderna
- Felutskrifter (5-15% av alla utskrifter misslyckas)
- Filament som inte används upp (de sista 50g är ofta svåra)
- Tid som läggs på kundservice
- Emballage och frakt
- Underhåll av skrivaren
:::

## Exempel: Prissätta en telefonhållare

| Parameter | Värde |
|-----------|-------|
| Filamentvikt | 45g PLA |
| Utskriftstid | 2 timmar |
| Spotpris | 1,20 kr/kWh |

**Beräkning:**
- Filament: 45g × 0,25 kr/g = 11,25 kr
- Svinn (10%): 1,13 kr
- El: 2t × 0,15kW × 1,20 = 0,36 kr
- Slitage: 2t × 0,15 = 0,30 kr
- Arbete: (2t + 10min) × 200 kr/t = 433 kr (eller 0 för hobby)
- **Produktionskostnad (hobby)**: ~13 kr
- **Försäljningspris 2,5×**: ~33 kr

## Spara uppskattning

Klicka på **Spara uppskattning** för att arkivera beräkningen. Sparade uppskattningar hittar du under fliken **Sparade** i kostnadskalkylatorn.

## E-handel

Använder du [e-handelsmodulen](../integrations/ecommerce) kan du koppla kostnadsuppskattningar direkt till beställningar för automatisk prisberäkning.
