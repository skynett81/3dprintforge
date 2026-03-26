---
sidebar_position: 7
title: PC
description: Guide til polykarbonat-printing med Bambu Lab — høy styrke, varmeresistens og krav
---

# PC (Polykarbonat)

Polykarbonat er et av de sterkeste termoplastiske materialene tilgjengelig for FDM-printing. Det kombinerer ekstremt høy slagfasthet, varmeresistens opp mot 110–130 °C og naturlig gjennomsiktighet. PC er et krevende materiale å printe, men gir resultater som nærmer seg sprøytestøpte deler i kvalitet.

## Innstillinger

| Parameter | Ren PC | PC-ABS blend | PC-CF |
|-----------|--------|-------------|-------|
| Dysetemperatur | 260–280 °C | 250–270 °C | 270–290 °C |
| Sengtemperatur | 100–120 °C | 90–110 °C | 100–120 °C |
| Kammertemperatur | 50–60 °C (påkrevd) | 45–55 °C | 50–60 °C |
| Del-kjøling | 0–20% | 20–30% | 0–20% |
| Hastighet | 60–80% | 70–90% | 50–70% |
| Tørking nødvendig | Ja (kritisk) | Ja | Ja (kritisk) |

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| High Temp Plate | Utmerket (påkrevd) | Nei |
| Engineering Plate | Akseptabel | Ja |
| Textured PEI | Ikke anbefalt | — |
| Cool Plate (Smooth PEI) | Ikke bruk | — |

:::danger High Temp Plate er påkrevd
PC krever sengtemperaturer på 100–120 °C. Cool Plate og Textured PEI tåler ikke disse temperaturene og vil bli skadet. Bruk **alltid** High Temp Plate for ren PC.
:::

## Krav til printer og utstyr

### Innelukke (påkrevd)

PC krever et **fullstendig innelukket kammer** med stabil temperatur på 50–60 °C. Uten dette vil du oppleve alvorlig warping, lagdeling og delaminering.

### Herdet dyse (sterkt anbefalt)

Ren PC er ikke abrasivt, men PC-CF og PC-GF **krever herdet stål-dyse** (f.eks. Bambu Lab HS01). For ren PC anbefales herdet dyse likevel for de høye temperaturene.

### Printer-kompatibilitet

| Printer | Egnet for PC? | Merknad |
|---------|--------------|---------|
| X1C | Utmerket | Fullt innelukket, HS01 tilgjengelig |
| X1E | Utmerket | Designet for engineering-materialer |
| P1S | Begrenset | Innelukket, men mangler aktiv kammeroppvarming |
| P1P | Ikke anbefalt | Mangler innelukke |
| A1 / A1 Mini | Ikke bruk | Åpen ramme, for lave temperaturer |

:::warning Kun X1C og X1E anbefales
PC krever aktiv kammeroppvarming for konsistente resultater. P1S kan gi akseptable resultater med små deler, men forvrent større deler med warping og lagdeling.
:::

## Tørking

PC er **svært hygroskopisk** og absorberer fuktighet raskt. Fuktig PC gir katastrofale printresultater.

| Parameter | Verdi |
|-----------|-------|
| Tørketemperatur | 70–80 °C |
| Tørketid | 6–8 timer |
| Hygroskopisk nivå | Høy |
| Maks anbefalt fuktighet | < 0.02% |

- **Alltid** tørk PC før printing — selv nyåpnede spoler kan ha absorbert fuktighet
- Print direkte fra tørkeboks om mulig
- AMS er **ikke tilstrekkelig** for PC-oppbevaring — fuktigheten er for høy
- Bruk dedikert filament-tørker med aktiv oppvarming

:::danger Fuktighet ødelegger PC-print
Tegn på fuktig PC: kraftig poppende lyd, bobler i overflaten, svært dårlig lagbinding, stringing. Fuktig PC kan ikke kompenseres med innstillinger — det **må** tørkes først.
:::

## Egenskaper

| Egenskap | Verdi |
|----------|-------|
| Strekkstyrke | 55–75 MPa |
| Slagfasthet | Ekstremt høy |
| Varmebestandighet (HDT) | 110–130 °C |
| Gjennomsiktighet | Ja (naturlig/klar variant) |
| Kjemisk motstand | Moderat |
| UV-motstand | Moderat (gulner over tid) |
| Krymping | ~0.5–0.7% |

## PC-blends

### PC-ABS

En blend av polykarbonat og ABS som kombinerer styrken til begge materialene:

- **Enklere å printe** enn ren PC — lavere temperaturer og mindre warping
- **Slagfasthet** mellom ABS og PC
- **Populært i industrien** — brukes i bilinteriør og elektronikkhus
- Printer ved 250–270 °C dyse, 90–110 °C seng

### PC-CF (karbonfiber)

Karbonfiberforsterket PC for maksimal stivhet og styrke:

- **Ekstremt stivt** — ideelt for strukturelle deler
- **Lett** — karbonfiber reduserer vekten
- **Krever herdet dyse** — messing slites ut på timer
- Printer ved 270–290 °C dyse, 100–120 °C seng
- Dyrere enn ren PC, men gir mekaniske egenskaper nær aluminium

### PC-GF (glassfiber)

Glassfiberforsterket PC:

- **Billigere enn PC-CF** med god stivhet
- **Hvitere overflate** enn PC-CF
- **Krever herdet dyse** — glassfibere er svært abrasive
- Noe mindre stivhet enn PC-CF, men bedre slagfasthet

## Bruksområder

PC brukes der du trenger **maksimal styrke og/eller varmeresistens**:

- **Mekaniske deler** — gir, fester, koblinger under belastning
- **Optiske deler** — linser, lysledere, transparente deksler (klar PC)
- **Varmebestandige deler** — motorrom, nær varmeelementer
- **Elektronikkhus** — beskyttende kapsling med god slagfasthet
- **Verktøy og jigger** — presise monteringsverktøy

## Tips for vellykket PC-printing

### Førstelag

- Senk hastigheten til **30–40%** for første lag
- Øk sengtemperaturen med 5 °C over standard for første 3–5 lag
- **Brim er obligatorisk** for de fleste PC-deler — bruk 8–10 mm

### Kammertemperatur

- La kammeret nå **50 °C+** før printing starter
- **Ikke åpne kammerdøren** under printing — temperaturfallet gir umiddelbar warping
- Etter printing: la delen avkjøle **sakte** i kammeret (1–2 timer)

### Kjøling

- Bruk **minimal delkjøling** (0–20%) for best lagbinding
- For broer og overheng: øk midlertidig til 30–40%
- Prioriter lagstyrke over estetikk med PC

### Design-hensyn

- **Unngå skarpe hjørner** — rund av med minimum 1 mm radius
- **Jevn veggtykkelse** — ujevn tykkelse gir indre spenninger
- **Store, flate overflater** er vanskelige — del opp eller legg til ribber

:::tip Ny til PC? Start med PC-ABS
Hvis du ikke har printet PC før, start med en PC-ABS blend. Den er mye mer tilgivende enn ren PC og gir deg erfaring med materialet uten de ekstreme kravene. Når du mestrer PC-ABS, gå videre til ren PC.
:::

---

## Etterbehandling

- **Sliping** — PC slipes godt, men bruk våtsliping for klar PC
- **Polering** — klar PC kan poleres til nesten optisk kvalitet
- **Liming** — diklormetanliming gir usynlige skjøter (bruk verneutstyr!)
- **Maling** — krever primer for god heft
- **Annealing** — 120 °C i 1–2 timer reduserer indre spenninger

:::warning Diklormetanliming
Diklormetan er giftig og krever avtrekk, kjemikaliebestandige hansker og vernebriller. Jobb alltid i godt ventilert rom eller avtrekkskap.
:::
