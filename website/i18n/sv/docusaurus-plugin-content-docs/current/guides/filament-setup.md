---
sidebar_position: 2
title: Ställa in filamentlager
description: Hur du skapar, konfigurerar och håller koll på dina filamentspolar i 3DPrintForge
---

# Ställa in filamentlager

Filamentlagret i 3DPrintForge ger dig full överblick över alla dina spoler — vad som är kvar, vad du har använt och vilka spoler som sitter i AMS just nu.

## Automatisk skapning från AMS

När du ansluter en skrivare med AMS läser instrumentpanelen automatiskt information från RFID-chipparna på Bambu-spoler:

- Filamenttyp (PLA, PETG, ABS, TPU osv.)
- Färg (med färghex)
- Märke (Bambu Lab)
- Spolvikt och återstående mängd

**Dessa spoler skapas automatiskt i lagret** — du behöver inte göra något. Se dem under **Filament → Lager**.

:::info Endast Bambu-spoler har RFID
Tredjeparts-spoler (t.ex. eSUN, Polymaker, Bambu-refill utan chip) känns inte igen automatiskt. Dessa måste läggas in manuellt.
:::

## Lägga till spoler manuellt

För spoler utan RFID eller spoler som inte sitter i AMS:

1. Gå till **Filament → Lager**
2. Klicka på **+ Ny spole** längst upp till höger
3. Fyll i fälten:

| Fält | Exempel | Obligatoriskt |
|------|---------|--------------|
| Märke | eSUN, Polymaker, Bambu | Ja |
| Typ | PLA, PETG, ABS, TPU | Ja |
| Färg | #FF5500 eller välj från färghjulet | Ja |
| Startvikt | 1000 g | Rekommenderat |
| Återstående | 850 g | Rekommenderat |
| Diameter | 1,75 mm | Ja |
| Anteckning | "Köpt 2025-01, fungerar bra" | Valfritt |

4. Klicka på **Spara**

## Konfigurera färger och märken

Du kan redigera en spole när som helst genom att klicka på den i lageröversikten:

- **Färg** — Välj från färghjulet eller ange ett hexvärde. Färgen används som visuell markör i AMS-översikten
- **Märke** — Visas i statistik och filtrering. Skapa egna märken under **Filament → Märken**
- **Temperaturprofil** — Ange rekommenderad munstyckes- och platttemperatur från filamenttillverkaren. Instrumentpanelen kan sedan varna om du väljer fel temperatur

## Förstå AMS-synkronisering

Instrumentpanelen synkroniserar AMS-status i realtid:

```
AMS Plats 1 → Spole: Bambu PLA Vit    [███████░░░] 72% kvar
AMS Plats 2 → Spole: eSUN PETG Grå    [████░░░░░░] 41% kvar
AMS Plats 3 → (tom)
AMS Plats 4 → Spole: Bambu PLA Röd    [██████████] 98% kvar
```

Synkroniseringen uppdateras:
- **Under utskrift** — förbrukning dras av i realtid
- **Vid utskriftsslut** — slutlig förbrukning loggas i historiken
- **Manuellt** — klicka på synkroniseringsikonen på en spole för att hämta uppdaterad data från AMS

:::tip Korrigera AMS-uppskattning
AMS-uppskattningen från RFID är inte alltid 100 % noggrann efter första användningen. Väg spolen och uppdatera vikten manuellt för bästa precision.
:::

## Kontrollera förbrukning och återstående

### Per spole
Klicka på en spole i lagret för att se:
- Totalt använt (gram, alla utskrifter)
- Beräknad återstående mängd
- Lista över alla utskrifter som använde denna spole

### Samlad statistik
Under **Analys → Filamentanalys** ser du:
- Förbrukning per filamenttyp över tid
- Vilka märken du använder mest
- Beräknad kostnad baserat på inköpspris per kg

### Lågnivåvarningar
Ställ in varningar för när en spole närmar sig slutet:

1. Gå till **Filament → Inställningar**
2. Aktivera **Varna vid lågt lager**
3. Ange tröskel (t.ex. 100 g kvar)
4. Välj aviseringskanal (Telegram, Discord, e-post)

## Tips: Väg spoler för noggrannhet

Uppskattningarna från AMS och från utskriftsstatistik är aldrig helt exakta. Den mest noggranna metoden är att väga själva spolen:

**Så gör du:**

1. Hitta taravikten (tom spole) — vanligtvis 200–250 g, kolla tillverkarens webbplats eller undersidan av spolen
2. Väg spolen med filament på en köksvåg
3. Dra av taravikten
4. Uppdatera **Återstående** i spolprofilen

**Exempel:**
```
Vägd vikt:       743 g
Tara (tom):    - 230 g
Filament kvar:   513 g
```

:::tip Spoletikett-generator
Under **Verktyg → Etiketter** kan du skriva ut etiketter med QR-kod till dina spoler. Scanna koden med telefonen för att snabbt öppna spolprofilen.
:::
