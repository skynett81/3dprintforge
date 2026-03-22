---
sidebar_position: 3
title: Inställningar
description: Komplett översikt över alla inställningar i Bambu Dashboard — skrivare, aviseringar, tema, OBS, energi, webhooks och mer
---

# Inställningar

Alla inställningar i Bambu Dashboard är samlade på en sida med tydliga kategorier. Här är en översikt över vad som finns i varje kategori.

Gå till: **https://localhost:3443/#settings**

## Skrivare

Hantera registrerade skrivare:

| Inställning | Beskrivning |
|---|---|
| Lägg till skrivare | Registrera en ny skrivare med serienummer och åtkomstnyckel |
| Skrivarnamn | Anpassat visningsnamn |
| Skrivarmodell | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| MQTT-anslutning | Bambu Cloud MQTT eller lokal MQTT |
| Åtkomstnyckel | LAN Access Code från Bambu Lab-appen |
| IP-adress | För lokalt (LAN) läge |
| Kamerainställningar | Aktivera/inaktivera, upplösning |

Se [Kom igång](../kom-i-gang/oppsett) för steg-för-steg-installation av första skrivare.

## Aviseringar

Se fullständig dokumentation i [Aviseringar](../funksjoner/notifications).

Snabböversikt:
- Aktivera/inaktivera aviseringskanaler (Telegram, Discord, e-post, osv.)
- Per-kanal-händelsefilter
- Tystnadstimer (tidsperiod utan aviseringar)
- Testknapp per kanal

## Tema

Se fullständig dokumentation i [Tema](./themes).

- Ljust / Mörkt / Autoläge
- 6 färgpaletter
- Anpassad accentfärg
- Avrundning och kompakthet

## OBS-overlay

Konfiguration för OBS-overlay:

| Inställning | Beskrivning |
|---|---|
| Standardtema | dark / light / minimal |
| Standardposition | Hörn för overlay |
| Standardskala | Skalning (0.5–2.0) |
| Visa QR-kod | Visa QR-kod till dashboardet i overlayen |

Se [OBS-overlay](../funksjoner/obs-overlay) för fullständig URL-syntax och installation.

## Energi och el

| Inställning | Beskrivning |
|---|---|
| Tibber API Token | Åtkomst till Tibber-spotpriser |
| Nordpool-prisområde | Välj prisregion |
| Nätavgift (kr/kWh) | Din nätavgiftssats |
| Skrivareffekt (W) | Konfigurera effektförbrukning per skrivarmodell |

## Home Assistant

| Inställning | Beskrivning |
|---|---|
| MQTT-broker | IP, port, användarnamn, lösenord |
| Discovery-prefix | Standard: `homeassistant` |
| Aktivera discovery | Publicera enheter till HA |

## Webhooks

Globala webhook-inställningar:

| Inställning | Beskrivning |
|---|---|
| Webhook URL | Mottagar-URL för händelser |
| Hemlig nyckel | HMAC-SHA256-signatur |
| Händelsefilter | Vilka händelser som skickas |
| Retry-försök | Antal försök vid fel (standard: 3) |
| Timeout | Sekunder innan förfrågan ger upp (standard: 10) |

## Köinställningar

| Inställning | Beskrivning |
|---|---|
| Automatisk dispatch | Aktivera/inaktivera |
| Dispatch-strategi | Första lediga / Minst använda / Round-robin |
| Kräv bekräftelse | Manuellt godkännande före sändning |
| Staggerad start | Fördröjning mellan skrivare i kö |

## Säkerhet

| Inställning | Beskrivning |
|---|---|
| Sessionsvaraktighet | Timmar/dagar innan automatisk utloggning |
| Tvinga 2FA | Kräv 2FA för alla användare |
| IP-vitlista | Begränsa åtkomst till specifika IP-adresser |
| HTTPS-certifikat | Ladda upp anpassat certifikat |

## System

| Inställning | Beskrivning |
|---|---|
| Serverport | Standard: 3443 |
| Loggformat | JSON / Text |
| Loggnivå | Error / Warn / Info / Debug |
| Databasrensning | Automatisk borttagning av gammal historik |
| Uppdateringar | Kontrollera om nya versioner finns |
