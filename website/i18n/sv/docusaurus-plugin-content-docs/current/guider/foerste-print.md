---
sidebar_position: 1
title: Din första utskrift
description: Steg-för-steg-guide för att starta din första 3D-utskrift och övervaka den i Bambu Dashboard
---

# Din första utskrift

Den här guiden tar dig igenom hela processen — från en ansluten skrivare till en färdig utskrift — med Bambu Dashboard som kontrollcentral.

## Steg 1 — Kontrollera att skrivaren är ansluten

När du öppnar instrumentpanelen ser du statuskortet för din skrivare längst upp i sidopanelen eller i översiktspanelen.

**Grön status** betyder att skrivaren är online och redo.

| Status | Färg | Betydelse |
|--------|------|-----------|
| Online | Grön | Redo att skriva ut |
| Inaktiv | Grå | Ansluten men inte aktiv |
| Skriver ut | Blå | Utskrift pågår |
| Fel | Röd | Kräver uppmärksamhet |

Om skrivaren visar röd status:
1. Kontrollera att skrivaren är påslagen
2. Verifiera att den är ansluten till samma nätverk som instrumentpanelen
3. Gå till **Inställningar → Skrivare** och bekräfta IP-adress och åtkomstkod

:::tip Använd LAN-läge för snabbare respons
LAN-läge ger lägre fördröjning än molnläge. Aktivera det under skrivarinställningarna om skrivaren och instrumentpanelen är på samma nätverk.
:::

## Steg 2 — Ladda upp din modell

Bambu Dashboard startar inte utskrifter direkt — det är Bambu Studios eller MakerWorlds uppgift. Instrumentpanelen tar över så snart utskriften börjar.

**Via Bambu Studio:**
1. Öppna Bambu Studio på din dator
2. Importera eller öppna din `.stl`- eller `.3mf`-fil
3. Slice-a modellen (välj filament, stöd, infill osv.)
4. Klicka på **Skriv ut** längst upp till höger

**Via MakerWorld:**
1. Hitta modellen på [makerworld.com](https://makerworld.com)
2. Klicka på **Skriv ut** direkt från webbplatsen
3. Bambu Studio öppnas automatiskt med modellen klar

## Steg 3 — Starta utskriften

I Bambu Studio väljer du sändningsmetod:

| Metod | Krav | Fördelar |
|-------|------|----------|
| **Moln** | Bambu-konto + internet | Fungerar var som helst |
| **LAN** | Samma nätverk | Snabbare, inget moln |
| **SD-kort** | Fysisk åtkomst | Inga nätverkskrav |

Klicka på **Skicka** — skrivaren tar emot jobbet och börjar uppvärmningsfasen automatiskt.

:::info Utskriften visas i instrumentpanelen
Inom några sekunder efter att Bambu Studio skickar jobbet visas den aktiva utskriften i instrumentpanelen under **Aktiv utskrift**.
:::

## Steg 4 — Övervaka i instrumentpanelen

När utskriften är igång ger instrumentpanelen dig full överblick:

### Förlopp
- Procentandel klar och beräknad återstående tid visas på skrivarkortet
- Klicka på kortet för detaljvy med lagerinformation

### Temperaturer
Detaljpanelen visar realtidstemperaturer:
- **Munstycke** — aktuell och måltemperatur
- **Byggplatta** — aktuell och måltemperatur
- **Kammare** — rumstemperatur inuti skrivaren (viktigt för ABS/ASA)

### Kamera
Klicka på kameraikonen på skrivarkortet för att se direktsändning direkt i instrumentpanelen. Du kan ha kameran öppen i ett eget fönster medan du gör andra saker.

:::warning Kontrollera de första lagren
De första 3–5 lagren är avgörande. Dålig vidhäftning nu innebär misslyckad utskrift senare. Titta på kameran och verifiera att filamentet lägger sig snyggt och jämnt.
:::

### Print Guard
Bambu Dashboard har en AI-driven **Print Guard** som automatiskt upptäcker spaghetti-fel och kan pausa utskriften. Aktivera det under **Övervakning → Print Guard**.

## Steg 5 — Efter att utskriften är klar

När utskriften är klar visar instrumentpanelen ett slutfört meddelande (och skickar avisering om du har ställt in [aviseringar](./varsler-oppsett)).

### Kontrollera historiken
Gå till **Historik** i sidopanelen för att se den slutförda utskriften:
- Total utskriftstid
- Filamentförbrukning (gram använt, beräknad kostnad)
- Fel eller HMS-händelser under utskriften
- Kamerabild vid avslutning (om aktiverat)

### Lämna en anteckning
Klicka på utskriften i historiken och lägg till en anteckning — t.ex. "Behövde lite mer brim" eller "Perfekt resultat". Det är användbart när du skriver ut samma modell igen.

### Kontrollera filamentförbrukningen
Under **Filament** kan du se att spolvikten har uppdaterats baserat på vad som användes. Instrumentpanelen drar av automatiskt.

## Tips för nybörjare

:::tip Lämna inte den första utskriften
Håll koll på de första 10–15 minuterna. När du är säker på att utskriften fäster bra kan du låta instrumentpanelen övervaka resten.
:::

- **Väg tomma spoler** — ange startvikt på spoler för exakt restberäkning (se [Filamentlager](./filament-oppsett))
- **Ställ in Telegram-aviseringar** — få besked när utskriften är klar utan att sitta och vänta (se [Aviseringar](./varsler-oppsett))
- **Kontrollera byggplattan** — ren platta = bättre vidhäftning. Torka av med IPA (isopropanol) mellan utskrifter
- **Använd rätt platta** — se [Välja rätt byggplatta](./velge-rett-plate) för vad som passar ditt filament
