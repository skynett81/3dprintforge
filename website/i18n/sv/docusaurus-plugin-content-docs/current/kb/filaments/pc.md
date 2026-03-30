---
sidebar_position: 7
title: PC
description: Guide till polykarbonatutskrift med Bambu Lab — hög hållfasthet, värmebeständighet och krav
---

# PC (Polykarbonat)

Polykarbonat är ett av de starkaste termoplastiska materialen tillgängliga för FDM-utskrift. Det kombinerar extremt hög slaghållfasthet, värmebeständighet upp till 110–130 °C och naturlig genomskinlighet. PC är ett krävande material att skriva ut, men ger resultat som närmar sig formsprutad kvalitet.

## Inställningar

| Parameter | Ren PC | PC-ABS blend | PC-CF |
|-----------|--------|-------------|-------|
| Munstyckstemperatur | 260–280 °C | 250–270 °C | 270–290 °C |
| Bäddtemperatur | 100–120 °C | 90–110 °C | 100–120 °C |
| Kammartemperatur | 50–60 °C (krävs) | 45–55 °C | 50–60 °C |
| Delkylning | 0–20% | 20–30% | 0–20% |
| Hastighet | 60–80% | 70–90% | 50–70% |
| Torkning nödvändig | Ja (kritiskt) | Ja | Ja (kritiskt) |

## Rekommenderade byggplattor

| Platta | Lämplighet | Limstift? |
|--------|-----------|----------|
| High Temp Plate | Utmärkt (krävs) | Nej |
| Engineering Plate | Acceptabel | Ja |
| Textured PEI | Ej rekommenderad | — |
| Cool Plate (Smooth PEI) | Använd ej | — |

:::danger High Temp Plate krävs
PC kräver bäddtemperaturer på 100–120 °C. Cool Plate och Textured PEI tål inte dessa temperaturer och kommer att skadas. Använd **alltid** High Temp Plate för ren PC.
:::

## Skrivar- och utrustningskrav

### Hölje (krävs)

PC kräver en **helt sluten kammare** med stabil temperatur på 50–60 °C. Utan detta kommer du att uppleva allvarlig warping, lagerdelning och delaminering.

### Härdat munstycke (starkt rekommenderat)

Ren PC är inte slipande, men PC-CF och PC-GF **kräver härdat stålmunstycke** (t.ex. Bambu Lab HS01). För ren PC rekommenderas härdat munstycke ändå på grund av de höga temperaturerna.

### Skrivarkompatibilitet

| Skrivare | Lämplig för PC? | Anmärkning |
|----------|----------------|------------|
| X1C | Utmärkt | Helt sluten, HS01 tillgängligt |
| X1E | Utmärkt | Designad för tekniska material |
| P1S | Begränsad | Sluten, men saknar aktiv kammaruppvärmning |
| P1P | Ej rekommenderad | Saknar hölje |
| A1 / A1 Mini | Använd ej | Öppen ram, för låga temperaturer |

:::warning Endast X1C och X1E rekommenderas
PC kräver aktiv kammaruppvärmning för konsekventa resultat. P1S kan ge acceptabla resultat med små delar, men förvänta warping och lagerdelning med större delar.
:::

## Torkning

PC är **mycket hygroskopiskt** och absorberar fukt snabbt. Fuktig PC ger katastrofala utskriftsresultat.

| Parameter | Värde |
|-----------|-------|
| Torktemperatur | 70–80 °C |
| Torktid | 6–8 timmar |
| Hygroskopisk nivå | Hög |
| Max rekommenderad fuktighet | < 0,02% |

- **Alltid** torka PC innan utskrift — även nyöppnade spolar kan ha absorberat fukt
- Skriv ut direkt från torklåda om möjligt
- AMS är **inte tillräckligt** för PC-förvaring — fuktigheten är för hög
- Använd dedikerad filamenttork med aktiv uppvärmning

:::danger Fukt förstör PC-utskrifter
Tecken på fuktig PC: kraftigt poppande ljud, bubblor på ytan, mycket dålig lagerbindning, stringing. Fuktig PC kan inte kompenseras med inställningar — den **måste** torkas först.
:::

## Egenskaper

| Egenskap | Värde |
|----------|-------|
| Draghållfasthet | 55–75 MPa |
| Slaghållfasthet | Extremt hög |
| Värmebeständighet (HDT) | 110–130 °C |
| Genomskinlighet | Ja (naturlig/klar variant) |
| Kemisk motståndskraft | Måttlig |
| UV-motstånd | Måttligt (gulnar med tiden) |
| Krympning | ~0,5–0,7% |

## PC-blandningar

### PC-ABS

En blandning av polykarbonat och ABS som kombinerar styrkan hos båda materialen:

- **Enklare att skriva ut** än ren PC — lägre temperaturer och mindre warping
- **Slaghållfasthet** mellan ABS och PC
- **Populärt inom industrin** — används i bilinredning och elektroniklådor
- Skriver ut vid 250–270 °C munstycke, 90–110 °C bädd

### PC-CF (kolfiber)

Kolfiberförstärkt PC för maximal styvhet och hållfasthet:

- **Extremt styv** — idealisk för strukturella delar
- **Lätt** — kolfiber minskar vikten
- **Kräver härdat munstycke** — mässing slits ut på timmar
- Skriver ut vid 270–290 °C munstycke, 100–120 °C bädd
- Dyrare än ren PC, men ger mekaniska egenskaper nära aluminium

### PC-GF (glasfiber)

Glasfiberförstärkt PC:

- **Billigare än PC-CF** med bra styvhet
- **Vitare yta** än PC-CF
- **Kräver härdat munstycke** — glasfibrer är mycket slipande
- Något mindre styv än PC-CF, men bättre slaghållfasthet

## Användningsområden

PC används där du behöver **maximal hållfasthet och/eller värmebeständighet**:

- **Mekaniska delar** — kugghjul, fästen, kopplingar under belastning
- **Optiska delar** — linser, ljusledare, transparenta kåpor (klar PC)
- **Värmebeständiga delar** — motorrum, nära värmeelement
- **Elektroniklådor** — skyddande kapsling med bra slaghållfasthet
- **Verktyg och jiggar** — precisa monteringsverktyg

## Tips för lyckad PC-utskrift

### Första lager

- Sänk hastigheten till **30–40%** för första lagret
- Öka bäddtemperaturen med 5 °C över standard för de första 3–5 lagren
- **Brim är obligatoriskt** för de flesta PC-delar — använd 8–10 mm

### Kammartemperatur

- Låt kammaren nå **50 °C+** innan utskrift startar
- **Öppna inte kammardörren** under utskrift — temperaturfallet ger omedelbar warping
- Efter utskrift: låt delen svalna **långsamt** i kammaren (1–2 timmar)

### Kylning

- Använd **minimal delkylning** (0–20%) för bästa lagerbindning
- För broar och överhäng: öka tillfälligt till 30–40%
- Prioritera lagerstyrka över estetik med PC

### Designöverväganden

- **Undvik skarpa hörn** — avrunda med minst 1 mm radie
- **Jämn väggtjocklek** — ojämn tjocklek ger inre spänningar
- **Stora, plana ytor** är svåra — dela upp eller lägg till ribbor

:::tip Ny med PC? Börja med PC-ABS
Om du inte har skrivit ut PC förut, börja med en PC-ABS blend. Den är mycket mer förlåtande än ren PC och ger dig erfarenhet av materialet utan de extrema kraven. När du behärskar PC-ABS, gå vidare till ren PC.
:::

---

## Efterbehandling

- **Slipning** — PC slipas bra, men använd våtslipning för klar PC
- **Polering** — klar PC kan poleras till nästan optisk kvalitet
- **Limning** — diklormetanlimning ger osynliga skarvar (använd skyddsutrustning!)
- **Målning** — kräver primer för bra vidhäftning
- **Härdning** — 120 °C i 1–2 timmar minskar inre spänningar

:::warning Diklormetanlimning
Diklormetan är giftigt och kräver dragskåp, kemikaliebeständiga handskar och skyddsglasögon. Arbeta alltid i väl ventilerat rum eller dragskåp.
:::
