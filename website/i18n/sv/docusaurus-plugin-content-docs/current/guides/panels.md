---
sidebar_position: 8
title: Navigera i instrumentpanelen
description: Lär dig navigera i 3DPrintForge — sidopanel, paneler, tangentbordsgenvägar och anpassning
---

# Navigera i instrumentpanelen

Den här guiden ger dig en snabb introduktion till hur instrumentpanelen är organiserad och hur du navigerar effektivt.

## Sidopanelen

Sidopanelen till vänster är ditt navigationscenter. Den är organiserad i avsnitt:

```
┌────────────────────┐
│ 🖨  Skrivarstatus  │  ← En rad per skrivare
├────────────────────┤
│ Översikt           │
│ Flotta             │
│ Aktiv utskrift     │
├────────────────────┤
│ Filament           │
│ Historik           │
│ Projekt            │
│ Kö                 │
│ Planeraren         │
├────────────────────┤
│ Övervakning        │
│  └ Print Guard     │
│  └ Fel             │
│  └ Diagnostik      │
│  └ Underhåll       │
├────────────────────┤
│ Analys             │
│ Verktyg            │
│ Integrationer      │
│ System             │
├────────────────────┤
│ ⚙ Inställningar   │
└────────────────────┘
```

**Sidopanelen kan döljas** genom att klicka på hamburgerikonen (☰) längst upp till vänster. Användbart på mindre skärmar eller i kioskläge.

## Huvudpanelen

När du klickar på ett element i sidopanelen visas innehållet i huvudpanelen till höger. Layouten varierar:

| Panel | Layout |
|-------|--------|
| Översikt | Kortgrid med alla skrivare |
| Aktiv utskrift | Stort detaljkort + temperaturkurvor |
| Historik | Filterbar tabell |
| Filament | Kortvy med spoler |
| Analys | Grafer och diagram |

## Klicka på skrivarstatus för detaljer

Skrivarkortet i översiktspanelen är klickbart:

**Enkelt klick** → Öppnar detaljpanelen för den skrivaren:
- Realtidstemperaturer
- Aktiv utskrift (om pågående)
- AMS-status med alla platser
- Senaste fel och händelser
- Snabbknappar: Pausa, Stopp, Lampa av/på

**Klicka på kameraikonen** → Öppnar live-kameravy

**Klicka på ⚙-ikonen** → Skrivarinställningar

## Tangentbordsgenväg — kommandopaletten

Kommandopaletten ger snabb åtkomst till alla funktioner utan att navigera:

| Genväg | Handling |
|--------|---------|
| `Ctrl + K` (Linux/Windows) | Öppna kommandopaletten |
| `Cmd + K` (macOS) | Öppna kommandopaletten |
| `Esc` | Stäng paletten |

I kommandopaletten kan du:
- Söka efter sidor och funktioner
- Starta en utskrift direkt
- Pausa / återuppta aktiva utskrifter
- Byta tema (ljust/mörkt)
- Navigera till vilken sida som helst

**Exempel:** Tryck `Ctrl+K`, skriv "pausa" → välj "Pausa alla aktiva utskrifter"

## Widget-anpassning

Översiktspanelen kan anpassas med widgets du väljer själv:

**Så redigerar du instrumentpanelen:**
1. Klicka på **Redigera layout** (pennikon) längst upp till höger i översiktspanelen
2. Dra widgets till önskad position
3. Klicka och dra i hörnet av en widget för att ändra storlek
4. Klicka på **+ Lägg till widget** för att lägga till nya:

Tillgängliga widgets:

| Widget | Visar |
|--------|-------|
| Skrivarstatus | Kort för alla skrivare |
| Aktiv utskrift (stor) | Detaljerad vy av pågående utskrift |
| AMS-översikt | Alla platser och filamentnivåer |
| Temperaturkurva | Realtidsgraf |
| Elpris | Prisgraf för nästa 24 timmar |
| Filamentmätare | Total förbrukning senaste 30 dagarna |
| Historikgenväg | Senaste 5 utskrifterna |
| Kameraflöde | Live-kamerabild |

5. Klicka på **Spara layout**

:::tip Spara flera layouter
Du kan ha olika layouter för olika syften — en kompakt för daglig användning, en stor för att hänga på storskärm. Byt mellan dem med layoutväljaren.
:::

## Tema — byta mellan ljust och mörkt

**Snabb byte:**
- Klicka på sol/måne-ikonen längst upp till höger i navigationen
- Eller: `Ctrl+K` → skriv "tema"

**Permanent inställning:**
1. Gå till **System → Teman**
2. Välj mellan:
   - **Ljust** — vit bakgrund
   - **Mörkt** — mörk bakgrund (rekommenderat på natten)
   - **Automatiskt** — följer systeminställningen på din enhet
3. Välj färgaccent (blå, grön, lila osv.)
4. Klicka på **Spara**

## Tangentbordsnavigering

För effektiv navigering utan mus:

| Genväg | Handling |
|--------|---------|
| `Tab` | Nästa interaktiva element |
| `Skift+Tab` | Föregående element |
| `Enter` / `Mellanslag` | Aktivera knapp/länk |
| `Esc` | Stäng modal/dropdown |
| `Ctrl+K` | Kommandopaletten |
| `Alt+1` – `Alt+9` | Navigera direkt till de 9 första sidorna |

## PWA — installera som app

3DPrintForge kan installeras som en progressiv webbapp (PWA) och köras som en fristående app utan webbläsarmenyer:

1. Gå till instrumentpanelen i Chrome, Edge eller Safari
2. Klicka på **Installera app**-ikonen i adressfältet
3. Bekräfta installationen

Se [PWA-dokumentation](../system/pwa) för mer detaljer.

## Kioskläge

Kioskläge döljer all navigering och visar bara instrumentpanelen — perfekt för en dedikerad skärm i utskriftsverkstaden:

1. Gå till **System → Kiosk**
2. Aktivera **Kioskläge**
3. Välj vilka widgets som ska visas
4. Ange uppdateringsintervall

Se [Kiosk-dokumentation](../system/kiosk) för fullständig inställning.
