---
sidebar_position: 6
title: Komposittmaterialer (CF/GF)
description: Karbonfiber og glassfiberfylte filamenter — herdet stål dyse, slitasje og innstillinger
---

# Komposittmaterialer (CF/GF)

Komposittfilamenter inneholder korte karbonfiberfibre (CF) eller glassfiberfibre (GF) blandet i en basisplast som PLA, PETG, PA eller ABS. De gir økt stivhet, redusert vekt og bedre dimensjonsstabilitet.

## Tilgjengelige typer

| Filament | Basis | Stivhet | Vektreduksjon | Vanskelighetsgrad |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Høy | Moderat | Lett |
| PETG-CF | PETG | Høy | Moderat | Moderat |
| PA6-CF | Nylon 6 | Svært høy | God | Krevende |
| PA12-CF | Nylon 12 | Svært høy | God | Moderat |
| ABS-CF | ABS | Høy | Moderat | Moderat |
| PLA-GF | PLA | Høy | Moderat | Lett |

## Herdet stål-dyse er påkrevd

:::danger Aldri bruk messingdyse med CF/GF
Karbon- og glassfibre er svært abrasive. De vil slite ned en standard messingdyse på timer til dager. Bruk alltid **herdet stål-dyse** (Hardened Steel) eller **HS01-dyse** med alle CF og GF-materialer.

- Bambu Lab Hardened Steel Nozzle (0.4 mm)
- Bambu Lab HS01 Nozzle (spesiell belegg, lenger levetid)
:::

## Innstillinger (PA-CF eksempel)

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 270–290 °C |
| Sengtemperatur | 80–100 °C |
| Del-kjøling | 0–20% |
| Hastighet | 80% |
| Tørking | 80 °C / 12 timer |

For PLA-CF: dyse 220–230 °C, seng 35–50 °C — mye enklere enn PA-CF.

## Byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Engineering Plate (Textured PEI) | Utmerket | Ja (for PA-base) |
| High Temp Plate | Bra | Ja |
| Cool Plate | Unngå (CF riper) | — |
| Textured PEI | Bra | Ja |

:::warning Platen kan ripes
CF-materialer kan ripe glatte plater ved fjerning. Bruk alltid Engineering Plate eller Textured PEI. Ikke dra printen av — bøy platen forsiktig.
:::

## Overflatebehandling

CF-filamenter gir en matt, karbonlignende overflate som ikke trenger maling. Overflaten er noe porøs og kan impregneres med epoxy for glattere finish.

## Slitasje og dyselevetid

| Dysetype | Levetid med CF | Kostnad |
|----------|---------------|---------|
| Messing (standard) | Timer–dager | Lav |
| Herdet stål | 200–500 timer | Moderat |
| HS01 (Bambu) | 500–1000 timer | Høy |

Bytt dyse ved synlig slitasje: utvidet dysehull, tynne vegger, dårlig dimensjonsnøyaktighet.

## Tørking

CF-varianter av PA og PETG krever tørking akkurat som basen:
- **PLA-CF:** Tørking anbefalt, men ikke kritisk
- **PETG-CF:** 65 °C / 6–8 timer
- **PA-CF:** 80 °C / 12 timer — kritisk

---

## Avanserte komposittmaterialer

### PPA-CF (polyftanamid med karbonfiber)

En av de sterkeste materialene tilgjengelig for desktop 3D-printing:

- **PPA** (Polyphthalamide) er en semi-aromatisk nylon med ekstremt høy varmebestandighet
- Glassoversgangstemperatur: 130–150 °C
- Kombinert med karbonfiber: Svært stiv, lett og dimensjonsstabil
- Dysetemperatur: 290–320 °C — krever high-temp hotend
- **Bambu X1C med high-temp dyse** er nødvendig
- Industriell-klasse styrke — sammenlignbar med glassfiberkompositter

### PPS-CF (polyfenylensulfid med karbonfiber)

Ytterst segment i desktop 3D-printing:

- Tåler kontinuerlig bruk ved **260–280 °C** — ekstreme temperaturer
- Glassoversgangstemperatur: ~85 °C, men smelter ikke under ~280 °C
- Utmerket kjemisk resistens mot syrer, baser og løsemidler
- Dysetemperatur: 300–340 °C
- Krever spesialisert printer med all-metal hotend og innelukke
- Brukes til flykomponenter, kjemisk prosessutstyr og industrielle jiger
- Ikke tilgjengelig i standard Bambu Studio-profiler — krevende oppsett

---

## Hvordan komposittmaterialer lages

Komposittfilamenter produseres ved å blande **korte fibre** (typisk 0.1–0.5 mm lengde) inn i smeltet plastmatrise under ekstrudering:

1. Basisplast (PLA, PA, etc.) smeltes
2. Karbonfiber- eller glassfiberfibre tilsettes og blandes
3. Blandingen ekstrudes til 1.75 mm tråd
4. Fibrene orienteres delvis i ekstruksjonsretningen under prosessen

**Viktig:** Dette er ikke det samme som kontinuerlig fiber-kompositt (f.eks. Markforged). Korte fibre gir forbedret stivhet men er ikke like sterke som kontinuerlig fiber.

---

## Fiberorientering og anisotropi

Et avgjørende konsept for å forstå komposittmateriale-styrke:

**Anisotropi** betyr at styrken varierer avhengig av retning. I FDM-printing gjelder dette ekstra sterkt for kompositter:

- **Langs lag (XY-plan):** Fibrene orienteres i printretningen — **maksimal styrke**
- **På tvers av lag (Z-retning):** Lagene binder seg kun via plastmatrise — **lavest styrke**
- **Fiberretning innen lag:** Varierer med infill-mønster og perimeter-retning

:::warning Design for riktig lagerorientering
En komposittdel er ikke automatisk sterk. En bolt-flens printet med lag parallelt med kraften er mye sterkere enn en med lag på tvers. Tenk alltid på hvilken retning kreftene virker og orienter printen tilsvarende.
:::

**Praktiske designregler:**
- Primærlaster bør virke **langs** lag-retningen
- Unngå å la z-retning (på tvers av lag) bære kritisk last
- Øk veggtykkelse for å kompensere for svak z-styrke
- 45°-infill (Gyroid eller Lines 45°) fordeler krefter bedre enn rett infill

---

## Når bruke kompositt vs solid metall (3D-print vs CNC)

| Kriterium | 3D-print kompositt (CF/GF) | CNC-maskinert metall |
|-----------|---------------------------|---------------------|
| Styrke/vekt | Utmerket | God |
| Absolutt styrke | Moderat | Svært høy |
| Kompleks geometri | Utmerket | Krevende/dyr |
| Produksjonstid | Timer | Dager–uker |
| Kostnad (enkeltdel) | Lav | Høy |
| Dimensjonsnøyaktighet | God (±0.2–0.5 mm) | Svært høy (±0.01 mm) |
| Temperaturbestandighet | Moderat–god | Utmerket |
| Anisotropi | Ja — svak z-akse | Nei — isotropisk |

**Bruk 3D-print CF/GF når:**
- Prototyper som trenger styrke men ikke toleranser i mikron-klassen
- Lett geometri med komplekse former
- Enkeltdeler eller korte serier
- Deler som primært belastes i XY-planet

**Velg CNC metall når:**
- Sikkerhetskritiske deler (strukturelle lastbærende komponenter)
- Presise toleranser under 0.1 mm
- Høy syklisk belastning over lang tid
- Temperaturer over 150 °C kontinuerlig
