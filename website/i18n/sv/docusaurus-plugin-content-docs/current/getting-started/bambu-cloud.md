---
sidebar_position: 3
title: Bambu Cloud-integration
description: Anslut dashboardet till Bambu Lab Cloud för synkronisering av modeller och utskriftshistorik
---

# Bambu Cloud-integration

Bambu Dashboard kan ansluta till **Bambu Lab Cloud** för att hämta modellbilder, utskriftshistorik och filamentdata. Dashboardet fungerar utmärkt utan molnanslutning, men cloud-integrationen ger extra fördelar.

## Fördelar med cloud-integration

| Funktion | Utan cloud | Med cloud |
|---------|-----------|----------|
| Live printerstatus | Ja | Ja |
| Utskriftshistorik (lokal) | Ja | Ja |
| Modellbilder från MakerWorld | Nej | Ja |
| Filamentprofiler från Bambu | Nej | Ja |
| Synk av utskriftshistorik | Nej | Ja |
| AMS-filament från moln | Nej | Ja |

## Anslut till Bambu Cloud

1. Gå till **Inställningar → Bambu Cloud**
2. Ange din Bambu Lab e-post och lösenord
3. Klicka **Logga in**
4. Välj vilka data som ska synkroniseras

:::warning Integritet
Användarnamn och lösenord lagras inte i klartext. Dashboardet använder Bambu Labs API för att hämta en OAuth-token som lagras lokalt. Dina data lämnar aldrig din server.
:::

## Synkronisering

### Modellbilder

När cloud är ansluten hämtas modellbilder automatiskt från **MakerWorld** och visas i:
- Utskriftshistorik
- Dashboard (under aktiv utskrift)
- 3D-modellvisaren

### Utskriftshistorik

Cloud-synk importerar utskriftshistorik från Bambu Lab-appen. Dubbletter filtreras automatiskt baserat på tidsstämpel och serienummer.

### Filamentprofiler

Bambu Labs officiella filamentprofiler synkroniseras och visas i filamentlagret. Du kan använda dessa som utgångspunkt för egna profiler.

## Vad fungerar utan cloud?

Alla kärnfunktioner fungerar utan molnanslutning:

- Direkt MQTT-anslutning till skrivaren via LAN
- Live-status, temperatur, kamera
- Lokal utskriftshistorik och statistik
- Filamentlager (manuellt administrerat)
- Aviseringar och schemaläggare

:::tip LAN-only-läge
Vill du använda dashboardet helt utan internetanslutning? Det fungerar utmärkt i ett isolerat nätverk — anslut bara skrivaren via IP och låt cloud-integrationen vara avstängd.
:::

## Felsökning

**Inloggning misslyckas:**
- Kontrollera att e-post och lösenord är korrekt för Bambu Lab-appen
- Kontrollera om kontot använder tvåfaktorsautentisering (stöds inte ännu)
- Försök logga ut och in igen

**Synkronisering stannar:**
- Token kan ha upphört — logga ut och in igen under Inställningar
- Kontrollera internetanslutningen från din server
