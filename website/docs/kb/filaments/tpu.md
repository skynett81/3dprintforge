---
sidebar_position: 4
title: TPU
description: Guide til TPU-printing — temperatur, hastighet og retract-innstillinger
---

# TPU

TPU (Thermoplastic Polyurethane) er et fleksibelt materiale brukt til deksler, pakninger, hjul og andre deler som krever elastisitet.

## Innstillinger

| Parameter | Verdi |
|-----------|-------|
| Dysetemperatur | 220–240 °C |
| Sengtemperatur | 30–45 °C |
| Del-kjøling | 50–80% |
| Hastighet | 30–50% (VIKTIG) |
| Retract | Minimal eller deaktivert |
| Tørking | Anbefalt (6–8 t ved 60 °C) |

:::danger Lav hastighet er kritisk
TPU må printes sakte. For høy hastighet fører til at materialet komprimeres i extruderen og skaper stopp. Start med 30% hastighet og øk forsiktig.
:::

## Anbefalte byggplater

| Plate | Egnethet | Limstift? |
|-------|---------|----------|
| Textured PEI | Utmerket | Nei |
| Cool Plate (Smooth PEI) | Bra | Nei |
| Engineering Plate | Bra | Nei |

## Retract-innstillinger

TPU er elastisk og reagerer dårlig på aggressiv retract:

- **Direct drive (X1C/P1S/A1):** Retract 0.5–1.0 mm, 25 mm/s
- **Bowden (unngå med TPU):** Meget krevende, anbefales ikke

For svært myk TPU (Shore A 85 eller lavere): deaktiver retract helt og stol på temperatur- og hastighetskontroll.

## Tips

- **Tørk filamentet** — fuktig TPU er ekstremt vanskelig å printe
- **Bruk direkte extruder** — Bambu Lab P1S/X1C/A1 har alle direct drive
- **Unngå høy temperatur** — over 250 °C degraderes TPU og gir misfarget print
- **Helling** — TPU heller mot å danne strenger; senk temperatur 5 °C eller øk kjøling

:::tip Shore-hardhet
TPU finnes i ulike Shore-hardheter (A85, A95, A98). Jo lavere Shore A, jo mykere og mer krevende å printe. Bambu Lab sin TPU er Shore A 95 — et godt startpunkt.
:::

## Oppbevaring

TPU er svært hygroskopisk (trekker til seg fuktighet). Fuktig TPU gir:
- Bobler og hissing
- Svak og sprø print (paradoksalt for et fleksibelt material)
- Stringing

**Tørk alltid TPU** ved 60 °C i 6–8 timer før printing. Oppbevar i forseglet boks med silikagel.

---

## Shore-hardhet forklart

Shore-hardhet er skalaen som brukes for å måle mykheten på elastomere materialer. For TPU gjelder Shore A-skalaen:

| Shore A | Følelse | Eksempel |
|---------|---------|---------|
| 60A | Veldig myk, gelé-aktig | Myk gummiball |
| 70A | Myk | Viskelær |
| 85A | Myk men strukturert | Myk bilringer |
| 95A | Standard, litt fjærende | Rullebretthjul |
| 98A | Fast, nesten rigid | Hardt gummi |

**Bambu Lab sin TPU er Shore A 95** — et godt balansepunkt mellom fleksibilitet og printbarhet. Jo lavere Shore A, jo vanskeligere er materialet å printe fordi det bøyer seg i ekstruderen.

:::tip Mykere = vanskeligere å printe
Shore 85A og lavere krever ekstra lav hastighet (20 mm/s eller lavere) og minimal retract. Vurder om Shore 95A er mykt nok for ditt brukstilfelle før du kjøper mykere varianter.
:::

---

## TPE, TPU og TPC — hva er forskjellen?

Alle tre er fleksible termoplaster, men de er ikke like:

| Type | Fullt navn | Egenskaper |
|------|-----------|------------|
| TPE | Thermoplastic Elastomer | Bred kategori — inkluderer TPU og TPC |
| TPU | Thermoplastic Polyurethane | Mest brukte i 3D-printing. God slitestyrke og kjemisk motstand |
| TPC | Thermoplastic Copolyester | God kjemisk motstand og UV-bestandighet, brukt industrielt |

I praksis: når du kjøper "fleksibelt filament" til 3D-printing er det nesten alltid **TPU**. TPE er overordnet kategori, og TPC er mer nisjeprodukter.

---

## Direct drive vs Bowden for TPU

TPU er elastisk, og det er nettopp det som gjør det utfordrende for Bowden-systemer:

**Direct drive (X1C, P1S, A1, A1 Mini):**
- Ekstruderen sitter direkte på toolhead
- Kort vei fra tannhjul til dyse
- Fungerer godt for TPU — anbefalt

**Bowden-systemer:**
- Langt PTFE-rør mellom ekstruder og dyse
- Det elastiske filamenter komprimeres i røret
- Gir ukontrollert ekstruksjon og jamming
- **Unngå Bowden med TPU** — særlig mykere varianter

Alle Bambu Lab-printere bruker direct drive og er egnet for TPU.

---

## Retract-innstillinger for TPU

Aggressiv retract komprimerer TPU i hot end og gir propp:

| Setting | Anbefalt verdi for TPU |
|---------|----------------------|
| Retract avstand | 0–1 mm (start på 0) |
| Retract hastighet | 20–25 mm/s |
| Zhop | Valgfritt, 0.2 mm |

For Shore 85A og lavere: **deaktiver retract helt**. Stol heller på riktig temperatur og tørket filament for å minimere stringing.

---

## Hastighet

TPU er et materiale som MÅ printes sakte:

- **Anbefalt:** 20–30 mm/s for alle bevegelser
- **Maks for god kvalitet:** 40–50 mm/s (kun for hardere Shore 95A+)
- **Første lag:** 15–20 mm/s

På Bambu-printerne: sett hastigheten til 30–40% i Bambu Studio og øk kun om du ser at resultatet er bra.

---

## Bruksområder

TPU er spesielt godt egnet for:

- **Mobilcovers og bumpers** — absorberer støt
- **Hjul og ruller** — god slitestyrke og grep
- **Tetninger og pakninger** — fleksibel og tett
- **Vibrasjonsdempere** — for motorer, vifter og elektronikk
- **Grep og håndtak** — mykt mot hud
- **Kabelgjennomføringer** — bøyer seg uten å sprekke
- **Leker og dyr-tilbehør** — myk og trygg overflate
