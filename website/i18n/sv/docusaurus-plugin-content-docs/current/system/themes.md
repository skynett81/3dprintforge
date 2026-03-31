---
sidebar_position: 4
title: Tema
description: Anpassa utseendet på 3DPrintForge med ljust/mörkt/autoläge, 6 färgpaletter och anpassad accentfärg
---

# Tema

3DPrintForge har ett flexibelt temasystem som låter dig anpassa utseendet efter din smak och användningssituation.

Gå till: **https://localhost:3443/#settings** → **Tema**

## Färgläge

Välj mellan tre lägen:

| Läge | Beskrivning |
|---|---|
| **Ljust** | Ljus bakgrund, mörk text — bra i välupplysta rum |
| **Mörkt** | Mörk bakgrund, ljus text — standard och rekommenderat för övervakning |
| **Auto** | Följer operativsystemets inställning (OS-mörkt/ljust) |

Ändra läge längst upp i temainställningarna eller via genvägen i navigationsfältet (måne/sol-ikon).

## Färgpaletter

Sex förinställda färgpaletter är tillgängliga:

| Palett | Primärfärg | Stil |
|---|---|---|
| **Bambu** | Grön (#00C853) | Standard, inspirerad av Bambu Lab |
| **Blå natt** | Blå (#2196F3) | Lugn och professionell |
| **Solnedgång** | Orange (#FF6D00) | Varm och energisk |
| **Lila** | Lila (#9C27B0) | Kreativ och distinkt |
| **Röd** | Röd (#F44336) | Hög kontrast, iögonfallande |
| **Monokrom** | Grå (#607D8B) | Neutral och minimalistisk |

Klicka på en palett för att förhandsgranska och aktivera den omedelbart.

## Anpassad accentfärg

Använd din helt egna färg som accentfärg:

1. Klicka **Anpassad färg** under palettväljaren
2. Använd färgväljaren eller skriv in en hex-kod (t.ex. `#FF5722`)
3. Förhandsgranskningen uppdateras i realtid
4. Klicka **Tillämpa** för att aktivera

:::tip Kontrast
Se till att accentfärgen har god kontrast mot bakgrunden. Systemet varnar om färgen kan skapa läsbarhetsproblem (WCAG AA-standard).
:::

## Avrundning

Justera avrundningen på knappar, kort och element:

| Inställning | Beskrivning |
|---|---|
| **Skarp** | Ingen avrundning (rektangulär stil) |
| **Liten** | Subtil avrundning (4 px) |
| **Medium** | Standard avrundning (8 px) |
| **Stor** | Tydlig avrundning (16 px) |
| **Pill** | Maximal avrundning (50 px) |

Dra skjutreglaget för att justera manuellt mellan 0–50 px.

## Kompakthet

Anpassa tätheten i gränssnittet:

| Inställning | Beskrivning |
|---|---|
| **Luftig** | Mer luft mellan element |
| **Standard** | Balanserad, standardinställning |
| **Kompakt** | Tätare packning — mer info på skärmen |

Kompakt läge rekommenderas för skärmar under 1080p eller kioskvisning.

## Typografi

Välj typsnitt:

- **System** — använder operativsystemets standardtypsnitt (snabbt att ladda)
- **Inter** — tydligt och modernt (standardval)
- **JetBrains Mono** — monospace, bra för datavärden
- **Nunito** — mjukare och mer avrundat

## Animationer

Stäng av eller anpassa animationer:

- **Full** — alla övergångar och animationer aktiva (standard)
- **Reducerade** — endast nödvändiga animationer (respekterar OS-inställning)
- **Av** — inga animationer för maximal prestanda

:::tip Kioskläge
För kioskvisning, aktivera **Kompakt** + **Mörkt** + **Reducerade animationer** för optimal prestanda och läsbarhet på avstånd. Se [Kioskläge](./kiosk).
:::

## Export och import av temainställningar

Dela ditt tema med andra:

1. Klicka **Exportera tema** — laddar ner en `.json`-fil
2. Dela filen med andra 3DPrintForge-användare
3. De importerar via **Importera tema** → välj filen
