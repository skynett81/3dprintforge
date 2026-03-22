---
sidebar_position: 6
title: Flera skrivare
description: Ställ in och hantera flera Bambu-skrivare i Bambu Dashboard — flottaöversikt, kö och förskjuten start
---

# Flera skrivare

Har du fler än en skrivare? Bambu Dashboard är byggt för flottahantering — du kan övervaka, styra och koordinera alla skrivare från ett ställe.

## Lägga till en ny skrivare

1. Gå till **Inställningar → Skrivare**
2. Klicka på **+ Lägg till skrivare**
3. Fyll i:

| Fält | Exempel | Förklaring |
|------|---------|------------|
| Serienummer (SN) | 01P... | Finns i Bambu Handy eller på skrivarens skärm |
| IP-adress | 192.168.1.101 | För LAN-läge (rekommenderat) |
| Åtkomstkod | 12345678 | 8-siffrigt kod på skrivarens skärm |
| Namn | "Bambu #2 - P1S" | Visas i instrumentpanelen |
| Modell | P1P, P1S, X1C, A1 | Välj rätt modell för rätt ikoner och funktioner |

4. Klicka på **Testa anslutning** — du bör se grön status
5. Klicka på **Spara**

:::tip Ge skrivarna beskrivande namn
"Bambu 1" och "Bambu 2" är förvirrande. Använd namn som "X1C - Produktion" och "P1S - Prototyper" för att hålla översikten.
:::

## Flottaöversikten

Efter att alla skrivare är tillagda visas de samlat i **Flotta**-panelen. Här ser du:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Produktion│  │ P1S - Prototyper│  │ A1 - Hobbyrum   │
│ ████████░░ 82%  │  │ Ledig           │  │ ████░░░░░░ 38%  │
│ 1t 24m kvar     │  │ Redo att skriva │  │ 3t 12m kvar     │
│ Temp: 220/60°C  │  │ AMS: 4 spoler   │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Du kan:
- Klicka på en skrivare för full detaljvy
- Se alla temperaturer, AMS-status och aktiva fel på en gång
- Filtrera på status (aktiva utskrifter, lediga, fel)

## Utskriftskö — fördela arbete

Utskriftskön låter dig planera utskrifter för alla skrivare från ett ställe.

**Så fungerar det:**
1. Gå till **Kö**
2. Klicka på **+ Lägg till jobb**
3. Välj fil och inställningar
4. Välj skrivare eller välj **Automatisk tilldelning**

### Automatisk tilldelning
Med automatisk tilldelning väljer instrumentpanelen skrivare baserat på:
- Ledig kapacitet
- Filament tillgängligt i AMS
- Planerade underhållsfönster

Aktivera under **Inställningar → Kö → Automatisk tilldelning**.

### Prioritering
Dra och släpp jobb i kön för att ändra ordning. Ett jobb med **Hög prioritet** hoppar framför vanliga jobb.

## Förskjuten start — undvika strömtoppar

Om du startar många skrivare samtidigt kan uppvärmningsfasen ge en kraftig strömtopp. Förskjuten start fördelar uppstarten:

**Så aktiverar du det:**
1. Gå till **Inställningar → Flotta → Förskjuten start**
2. Aktivera **Fördelad uppstart**
3. Ange fördröjning mellan skrivare (rekommenderat: 2–5 minuter)

**Exempel med 3 skrivare och 3 minuters fördröjning:**
```
kl. 08:00 — Skrivare 1 börjar uppvärmning
kl. 08:03 — Skrivare 2 börjar uppvärmning
kl. 08:06 — Skrivare 3 börjar uppvärmning
```

:::tip Relevant för säkringsstorlek
En X1C drar ca 1000 W under uppvärmning. Tre skrivare samtidigt = 3000 W, vilket kan lösa ut 16A-säkringen. Förskjuten start eliminerar problemet.
:::

## Skrivargrupper

Skrivargrupper låter dig organisera skrivare logiskt och skicka kommandon till hela gruppen:

**Skapa en grupp:**
1. Gå till **Inställningar → Skrivargrupper**
2. Klicka på **+ Ny grupp**
3. Ge gruppen ett namn (t.ex. "Produktionsgolv", "Hobbyrum")
4. Lägg till skrivare i gruppen

**Gruppfunktioner:**
- Se samlad statistik för gruppen
- Skicka pauskommando till hela gruppen samtidigt
- Ange underhållsfönster för gruppen

## Övervaka alla skrivare

### Flervy-kamera
Gå till **Flotta → Kameravy** för att se alla kameraflöden sida vid sida:

```
┌──────────────┐  ┌──────────────┐
│  X1C Flöde   │  │  P1S Flöde   │
│  [Live]      │  │  [Ledig]     │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Flöde    │  │  + Lägg till │
│  [Live]      │  │              │
└──────────────┘  └──────────────┘
```

### Aviseringar per skrivare
Du kan konfigurera olika aviseringsregler för olika skrivare:
- Produktionsskrivare: avisera alltid, inklusive natt
- Hobbyskrivare: avisera endast dagtid

Se [Aviseringar](./varsler-oppsett) för inställning.

## Tips för flottadrift

- **Standardisera filamentplatser**: Håll PLA vit i plats 1, PLA svart i plats 2 på alla skrivare — då är jobbfördelningen enklare
- **Kontrollera AMS-nivåer dagligen**: Se [Daglig användning](./daglig-bruk) för morgonrutin
- **Underhåll på rotation**: Underhåll inte alla skrivare samtidigt — håll alltid minst en aktiv
- **Namnge filer tydligt**: Filnamn som `logo_x1c_pla_0.2mm.3mf` gör det enkelt att välja rätt skrivare
