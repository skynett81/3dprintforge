---
sidebar_position: 3
title: Einstellungen
description: Vollständige Übersicht aller Einstellungen in 3DPrintForge — Drucker, Benachrichtigungen, Thema, OBS, Energie, Webhooks und mehr
---

# Einstellungen

Alle Einstellungen in 3DPrintForge sind auf einer Seite mit übersichtlichen Kategorien zusammengefasst. Hier finden Sie eine Übersicht über den Inhalt jeder Kategorie.

Navigieren Sie zu: **https://localhost:3443/#settings**

## Drucker

Registrierte Drucker verwalten:

| Einstellung | Beschreibung |
|---|---|
| Drucker hinzufügen | Neuen Drucker mit Seriennummer und Zugangscode registrieren |
| Druckername | Benutzerdefinierter Anzeigename |
| Druckermodell | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| MQTT-Verbindung | Bambu Cloud MQTT oder lokales MQTT |
| Zugangscode | LAN Access Code aus der Bambu Lab-App |
| IP-Adresse | Für lokalen (LAN) Modus |
| Kameraeinstellungen | Aktivieren/Deaktivieren, Auflösung |

Siehe [Erste Schritte](../getting-started/setup) für die schrittweise Einrichtung des ersten Druckers.

## Benachrichtigungen

Vollständige Dokumentation unter [Benachrichtigungen](../features/notifications).

Schnellübersicht:
- Benachrichtigungskanäle aktivieren/deaktivieren (Telegram, Discord, E-Mail usw.)
- Ereignisfilter pro Kanal
- Stille Stunden (Zeitraum ohne Benachrichtigungen)
- Testschaltfläche pro Kanal

## Thema

Vollständige Dokumentation unter [Thema](./themes).

- Hell / Dunkel / Auto-Modus
- 6 Farbpaletten
- Benutzerdefinierte Akzentfarbe
- Abrundung und Kompaktheit

## OBS-Overlay

Konfiguration für OBS-Overlay:

| Einstellung | Beschreibung |
|---|---|
| Standardthema | dark / light / minimal |
| Standardposition | Ecke für das Overlay |
| Standardskalierung | Skalierung (0,5–2,0) |
| QR-Code anzeigen | QR-Code zum Dashboard im Overlay anzeigen |

Siehe [OBS-Overlay](../features/obs-overlay) für vollständige URL-Syntax und Einrichtung.

## Energie und Strom

| Einstellung | Beschreibung |
|---|---|
| Tibber API Token | Zugriff auf Tibber-Spotpreise |
| Nordpool-Preisbereich | Preisregion auswählen |
| Netzentgelt (€/kWh) | Ihr Netzentgelttarif |
| Druckerleistung (W) | Leistungsverbrauch pro Druckermodell konfigurieren |

## Home Assistant

| Einstellung | Beschreibung |
|---|---|
| MQTT-Broker | IP, Port, Benutzername, Passwort |
| Discovery-Präfix | Standard: `homeassistant` |
| Discovery aktivieren | Geräte an HA veröffentlichen |

## Webhooks

Globale Webhook-Einstellungen:

| Einstellung | Beschreibung |
|---|---|
| Webhook URL | Empfänger-URL für Ereignisse |
| Geheimer Schlüssel | HMAC-SHA256-Signatur |
| Ereignisfilter | Welche Ereignisse gesendet werden |
| Wiederholungsversuche | Anzahl Versuche bei Fehler (Standard: 3) |
| Timeout | Sekunden, bevor die Anfrage abbricht (Standard: 10) |

## Warteschlangen-Einstellungen

| Einstellung | Beschreibung |
|---|---|
| Automatischer Versand | Aktivieren/Deaktivieren |
| Versandstrategie | Erster verfügbarer / Am wenigsten genutzt / Round-Robin |
| Bestätigung erforderlich | Manuelle Genehmigung vor dem Senden |
| Gestaffelter Start | Verzögerung zwischen Druckern in der Warteschlange |

## Sicherheit

| Einstellung | Beschreibung |
|---|---|
| Sitzungsdauer | Stunden/Tage bis zur automatischen Abmeldung |
| 2FA erzwingen | 2FA für alle Benutzer vorschreiben |
| IP-Whitelist | Zugriff auf bestimmte IP-Adressen beschränken |
| HTTPS-Zertifikat | Benutzerdefiniertes Zertifikat hochladen |

## System

| Einstellung | Beschreibung |
|---|---|
| Server-Port | Standard: 3443 |
| Protokollformat | JSON / Text |
| Protokollstufe | Error / Warn / Info / Debug |
| Datenbankbereinigung | Automatisches Löschen alter Verlaufsdaten |
| Updates | Nach neuen Versionen suchen |
