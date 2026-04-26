---
sidebar_position: 1
title: Kunnskapsbase
description: Praktiske guider for filamenter, byggplater, vedlikehold og feilsøking
---

# Kunnskapsbase

Kunnskapsbasen inneholder praktiske guider for å få best mulig resultat med Bambu Lab-printeren din. Her finner du konkrete tall og tips basert på erfaring med P1S, X1C og A1.

## Hva finner du her?

### Filamenter — standard materialer
Detaljerte guider for hvert materialtype — temperaturinnstillinger, platevalg, tørketider og tips for vellykket printing.

- [PLA](./filaments/pla) — Det enkleste å printe, anbefalt for nybegynnere
- [PETG](./filaments/petg) — Sterkere enn PLA, god kjemisk motstand
- [ABS](./filaments/abs) — Termisk stabilt, krever innelukke
- [PC (Polykarbonat)](./filaments/pc) — Svært slagfast og varmestabilt
- [TPU](./filaments/tpu) — Fleksibelt materiale, krever lav hastighet
- [PA / Nylon](./filaments/nylon) — Svært slitesterkt, krevende å printe

### Filamenter — kompositt, spesial og referanser

- [Komposittmaterialer (CF/GF)](./filaments/composite) — PLA-CF, PETG-CF, PA-CF, PA-GF, ABS-CF osv. — krever herdet stål-dyse
- [Spesialmaterialer](./filaments/special) — ASA (UV-bestandig), PC, PP, PVA, HIPS og andre nisjematerialer
- [Bambu Lab-serien](./filaments/bambu-series) — PLA Basic/Matte/Silk/Sparkle/Tough/Glow/Aero/Carbon, PETG Basic/HF/CF, ABS, ASA, TPU, PA6-CF/GF, PC, PVA, HIPS — alle med RFID og AMS-kompatibilitet
- [Master-temperaturguide](./filaments/guide) — Ett oppslag med dyse/seng/kammer for 15+ materialer
- [Materialsammenligning](./filaments/comparison) — Styrke, varme, fleks, UV, kjemisk motstand + Shore-hardhet + HDT/VST
- [Kompatibilitetsmatrise](./filaments/compatibility) — Hvilke materialer passer på hvilke byggplater og dyser
- [Printprofiler og innstillinger](./filaments/profiles) — Retract, hastighet, kjøling og kvalitetsmodus

### Alle filament-varianter vi har data på (109 rader live i dashbordet)

Basert på Bambu Lab, Polymaker, Prusament, Elegoo, Creality, QIDI, Snapmaker og community-databaser (SpoolmanDB, 3DFilamentProfiles, OrcaSlicer):

| Familie | Varianter |
|---|---|
| **PLA** | Basic, Matte, Silk, Sparkle, Glow, Aero (LW-PLA), Tough (PLA+), Wood, Metal, Ceramic-fill, Stone-fill, HTPLA, FR-PLA, Conductive, Magnetic, PLA-CF, PLA-GF |
| **PETG** | PETG, PETG HF (High-Flow), PETG-CF, PET, PET-CF, PCTG |
| **ABS / ASA** | ABS, ABS+, ABS-CF, ABS-GF, ASA, ASA-CF |
| **PC (Polykarbonat)** | PC, PC Blend, PC-CF, PC-ABS |
| **Nylon (PA)** | PA, PA6, PA12, PAHT, PA-CF, PA6-CF, PA12-CF, PA-GF, PA6-GF, PAHT-CF, PPA-CF |
| **Fleksibelt** | TPU 95A, TPU 85A, TPU 60A, TPU HF, TPE, TPC |
| **Støttemateriale** | PVA, HIPS, BVOH, PVB, Breakaway |
| **Polypropylen** | PP, PP-CF, PP-GF |
| **Høy ytelse** | PEEK, PEKK, PEKK-CF, PEI (ULTEM), PPS, PPS-CF |

Totalt: **28 unike materialer**, **66 Bambu Lab-varianter**, **86 materialer i taksonomi**, **75 rader med byggplate-kompatibilitet**, **109 rader med stjernebasert styrke/fleks/varme/UV-rating**.

### Byggplater
Velg riktig plate for hvert materiale og lær å vedlikeholde dem.

- [Oversikt og kompatibilitetsmatrise](./build-plates/overview)
- [Cool Plate (Smooth PEI)](./build-plates/cool-plate)
- [Engineering Plate (Textured PEI)](./build-plates/engineering-plate)
- [High Temp Plate](./build-plates/high-temp-plate)
- [Textured PEI Plate](./build-plates/textured-pei)

### Vedlikehold
Hold printeren i god stand med jevnlig vedlikehold.

- [Dysevedlikehold](./maintenance/nozzle) — Rengjøring, cold pull og bytte
- [Platevedlikehold](./maintenance/plate) — IPA-rengjøring og skade-forebygging
- [AMS-vedlikehold](./maintenance/ams) — PTFE-rør og filament-vei
- [Smøring](./maintenance/lubrication) — Stenger, leiere og intervaller

### Feilsøking
Vanlige problemer og praktiske løsninger.

- [Dårlig heft](./troubleshooting/adhesion) — Første lag sitter ikke
- [Warping](./troubleshooting/warping) — Hjørner løfter seg
- [Stringing](./troubleshooting/stringing) — Tynne tråder mellom objekter

## For hvem?

Kunnskapsbasen er for deg som:
- Er ny til 3D-printing med Bambu Lab
- Bytter til et nytt materiale og trenger startinnstillinger
- Har et spesifikt problem du vil løse
- Vil forstå mer om vedlikehold og lang levetid på utstyret

:::tip Innebygd i dashboardet
Kunnskapsbasen er også tilgjengelig direkte i dashboardet under **Kunnskap**-fanen — ingen nettleserbytte nødvendig mens du printer.
:::

---

## Hva er filament?

Filament er råmaterialet som brukes i FDM-printere (Fused Deposition Modeling). Det er en lang, tynn plastråd kveilet på en spole. Printeren smelter råden gjennom en oppvarmet dyse og legger den lag for lag for å bygge opp et objekt.

### Størrelse og diameter

Standard filamentdiameter er **1.75 mm** — dette bruker alle Bambu Lab-printere. Eldre standard på 2.85 mm er i stor grad utdatert og brukes kun av noen få maskinproducenter. Kjøp alltid 1.75 mm til P1S, X1C, A1 og A1 Mini.

### Hva betyr forkortelsene?

| Forkortelse | Materiale | Norsk navn |
|-------------|-----------|------------|
| PLA | Polylactic Acid | Polymelkesyre (biobasert) |
| PETG | Polyethylene Terephthalate Glycol | Glykol-modifisert PET |
| ABS | Acrylonitrile Butadiene Styrene | ABS-plast |
| ASA | Acrylonitrile Styrene Acrylate | UV-bestandig ABS-alternativ |
| PA | Polyamide | Nylon |
| PC | Polycarbonate | Polykarbonat |
| TPU | Thermoplastic Polyurethane | Fleksibel polyuretan |
| TPE | Thermoplastic Elastomer | Fleksibelt elastomer |
| PP | Polypropylene | Polypropylen |
| PVA | Polyvinyl Alcohol | Vannløselig støttemateriale |
| HIPS | High Impact Polystyrene | Slagfast polystyren (støttemateriale) |

### Tilsetningsstoffer — CF og GF

Mange filamenter finnes i forsterkede varianter:

- **CF (Carbon Fiber / Karbonfiber):** Korte karbonfibre blandet inn i plasten. Gir økt stivhet og dimensjonsstabilitet, reduserer vekt. Krever **herdet stål-dyse** — sliter ned vanlig messing raskt.
- **GF (Glass Fiber / Glassfiber):** Korte glassfiberfibre. Billigere enn CF, god stivhet. Også abrasivt — herdet stål-dyse påkrevd.

:::warning CF og GF sliter dysen
Bruk aldri standard messingdyse med CF- eller GF-filamenter. De abrasive fibrene vil ødelegge dysen på timer til dager.
:::

### Hvordan velge riktig filament?

Bruk dette som tommelfingerregel:

| Bruksområde | Anbefalt materiale |
|-------------|-------------------|
| Prototyper, pynt, nybegynnerdeler | PLA |
| Funksjonelle deler, litt varme | PETG |
| Varme, slag, aceton-glatt finish | ABS / ASA |
| Fleksible deler, deksler, hjul | TPU |
| Mekaniske deler, tannhjul, høy slitasje | PA (Nylon) |
| Maks stivhet, lett vekt | PA-CF / PLA-CF |
| Utendørs, UV-eksponering | ASA |
| Transparent, optisk klar | PC / PETG |
| Vannløselig støtte | PVA |

:::tip Start med PLA
Er du ny til 3D-printing? Start med PLA. Det er det enkleste materialet, gir gode resultater og er tilgivende ved feil. Gå videre til PETG eller ABS etter at du er komfortabel med grunninnstillingene.
:::
