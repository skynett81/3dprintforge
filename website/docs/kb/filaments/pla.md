---
sidebar_position: 1
title: PLA
description: Guide til PLA-printing med Bambu Lab — temperatur, plater, tips og varianter
---

# PLA

PLA (Polylactic Acid) er det mest nybegynnervennlige filamentet. Det printer lett, gir fine overflater og krever ingen innelukke eller spesiell oppvarmingsbehandling.

## Innstillinger

| Parameter | Standard PLA | PLA+ | PLA Silk |
|-----------|-------------|------|---------|
| Dysetemperatur | 220 °C | 230 °C | 230 °C |
| Sengtemperatur | 35–45 °C | 45–55 °C | 45–55 °C |
| Kammertemperatur | — | — | — |
| Del-kjøling | 100% | 100% | 80% |
| Hastighet | Standard | Standard | 80% |
| Tørking nødvendig | Nei | Nei | Nei |

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Utmerket | Nei |
| Textured PEI | Bra | Nei |
| Engineering Plate | Bra | Nei |
| High Temp Plate | Unngå | — |

## Tips for vellykket printing

- **Ingen limstift nødvendig** — PLA hefter godt på de fleste plater uten limstift
- **La platen kjøle seg** — PLA slipp platen lettere når den avkjøles til romtemperatur
- **Første lag hastighet** — sett til 50–70% for bedre heft
- **Del-kjøling** — hold på 100% for skarpere detaljer og bedre broer

:::tip Z-offset
Kalibrer Z-offset nøye for første lag. For PLA på Cool Plate: live-juster til første lag er lett transparent og godt festet, ikke klemt.
:::

## Varianter

### PLA+
Sterkere og mer varmestabil enn standard PLA. Kjører litt varmere (225–235 °C). Noe mer fleksibel og lettere å etterbehandle.

### PLA Silk
Gir blanke, metalliske overflater. Krever lavere kjøling og noe lavere hastighet for best resultat. Broer er mer krevende.

### PLA-CF (karbonfiber)
Karbonfiberforsterket PLA gir økt stivhet og er lett. Krever **herdet stål-dyse** — bruk aldri vanlig messingdyse med CF-materialer.

### PLA Matte
Matt overflate uten glans. Printer på samme innstillinger som standard PLA.

## Oppbevaring

PLA absorberer ikke fuktighet like raskt som PETG og PA, men bør likevel oppbevares tørt:

- **Anbefalt:** Forseglet pose med silikagel
- **Tegn på fuktig filament:** Poppende lyder, boblende overflate, svak print

Tørk ved **45–55 °C i 4–6 timer** om nødvendig.

---

## PLA-varianter i detalj

### PLA+ / Engineering-PLA / PLA Tough / PLA Pro / ePLA / Impact-PLA — hva er forskjellen?

Alle disse er markedsføringsnavn for modifisert PLA med tilsetningsstoffer som gjør det seigere og sterkere. Kjerneforskjellen:

| Variant | Hva er forskjellig | Ytelse vs standard PLA |
|---------|-------------------|----------------------|
| PLA+ | Fleksibilisatorer og slagabsorberende tilsetninger | +20–30% slagfasthet, litt mer fleksibel |
| Engineering-PLA | Optimert for mekaniske deler, tettere ekstruksjon | Bedre dimensjonsnøyaktighet og lagfusing |
| PLA Tough | Fokus på bruddmotstand, ligner ABS i oppførsel | Tåler mer mekanisk belastning |
| PLA Pro | Markedsføringsnavn, ligner PLA+ | Varierer mellom produsenter |
| ePLA / Impact-PLA | Ekstra høy slagmotstand | Best for deler som får støt |

:::tip Praktisk råd
Disse variantene printer tilnærmet likt som standard PLA. Trenger du litt sterkere deler uten å bytte til PETG? Velg PLA+. Det er et enkelt oppgraderingssteg.
:::

### PLA-CF (karbonfiber)

Karbonfiberforsterket PLA er stivere og lettere enn standard PLA. Overflatefinishen er matt og karbonlignende.

- **Dysetemperatur:** 220–235 °C
- **Krever herdet stål-dyse** — messing vil slites på dager
- **Stivere, men mer sprø** — ikke egnet der du trenger fleksibilitet
- **Dimensjonsstabilitet:** Utmerket, lite vridning
- Bambu Lab HS01-dyse anbefales for lengre levetid

### HT-PLA (høytemperatur-PLA)

Standard PLA myker ved ca. 55–60 °C. HT-PLA er formulert for å tåle høyere temperaturer **etter annealing** (herding i ovn):

- Print på vanlige PLA-innstillinger (220 °C)
- Legg den ferdige printen i ovn ved **90–100 °C i 30–60 minutter**
- Etter annealing: tåler temperaturer opp mot 100–110 °C
- **NB:** Printen kan krympe litt og miste dimensjonsnøyaktighet under annealing — legg inn toleranser om mål er kritiske

:::warning Annealing krever planlegging
Annealing gir bedre varmebestandighet, men kan forvri tynne eller usymmetriske deler. Test på prøvedel først.
:::

### Silk PLA

Silk PLA inneholder tilsetningsstoffer som gir en blankt metallisk overflate — ofte i to-tone eller regnbueffekter.

- **Ser imponerende ut**, men er svakere enn standard PLA
- Mer utsatt for lagdeling ved broer og overheng
- Reduser hastighet til 70–80% og kjøling til 60–80%
- Ikke egnet for mekaniske deler — ren estetikk

### PLA Wood (tre-PLA)

PLA blandet med trefiberpartikler (bambus, eik, kork, etc.):

- Unik treaktig tekstur og lukt under printing
- Kan slipes og beisets som tre
- Abrasivt — herdet stål anbefales ved stor bruk
- **Dysetemperatur:** 180–220 °C (lavere enn standard PLA)
- Unngå høye temperaturer — trefiberne brenner og blokkerer dysen

### PLA Glow (lyser i mørket)

Inneholder fosforescent pigment som absorberer lys og avgir det i mørket:

- Printer som standard PLA
- Glow-effekten er sterkest etter eksponering for sterkt hvitt eller UV-lys
- Tilgjengelig i grønn, blå og lilla (grønn gløder sterkest)
- Svakere enn standard PLA — ikke for mekaniske deler

---

## Er PLA biologisk nedbrytbart? — myte vs virkelighet

PLA markedsføres ofte som "biologisk nedbrytbart" og "miljøvennlig". Sannheten er mer nyansert:

:::warning PLA brytes ikke ned i naturen
PLA er **kun biologisk nedbrytbart under industrielle kompostforhold**: 58 °C+, høy fuktighet og spesifikke mikroorganismer i 90+ dager. I naturen, kompostkasse hjemme eller søppelfylling vil PLA ligge i **hundrevis av år** — omtrent som vanlig plast.

- **Ikke** kast PLA-print i kompost hjemme
- **Ikke** regn med nedbrytning i naturen
- **Resirkulering** er vanskelig (kontaminering fra farger og tilsetninger)
:::

PLA er likevel mer bærekraftig enn oljebasert plast fordi råstoffet (maisstivelse, sukkerrør) er fornybart og produksjonen slipper ut mindre CO₂.

---

## Krymping

PLA krymper svært lite — typisk **0.3–0.5%** fra dyse til ferdig del. Dette er blant de laveste krymp-ratene i 3D-printing og er grunnen til at PLA gir god dimensjonsnøyaktighet uten spesielle tiltak. Sammenligning:

| Materiale | Krymping |
|-----------|----------|
| PLA | ~0.3–0.5% |
| PETG | ~0.3–0.6% |
| ABS | ~0.7–0.8% |
| PA (Nylon) | ~1.0–2.0% |

Lav krymping betyr at modeller som krever presise mål (passdeler, innsatsmuttere) fungerer godt i PLA uten kompensasjon.
