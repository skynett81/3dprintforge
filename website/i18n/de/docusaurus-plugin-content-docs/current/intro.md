---
sidebar_position: 1
title: Willkommen bei Bambu Dashboard
description: Ein leistungsstarkes, selbst gehostetes Dashboard für Bambu Lab 3D-Drucker
---

# Willkommen bei Bambu Dashboard

**Bambu Dashboard** ist ein selbst gehostetes, vollständiges Steuerungspanel für Bambu Lab 3D-Drucker. Es bietet Ihnen vollständige Übersicht und Kontrolle über Drucker, Filamentlager, Druckverlauf und mehr — alles in einem Browser-Tab.

## Was ist Bambu Dashboard?

Bambu Dashboard verbindet sich direkt über MQTT per LAN mit Ihrem Drucker, ohne Abhängigkeit von Bambu Lab-Servern. Sie können auch eine Verbindung zur Bambu Cloud herstellen, um Modelle und Druckverlauf zu synchronisieren.

### Wichtigste Funktionen

- **Live-Dashboard** — Echtzeit-Temperaturen, Fortschritt, Kamera, AMS-Status
- **Filamentlager** — Alle Spulen, Farben, AMS-Sync, Trocknungsprotokoll
- **Druckverlauf** — Vollständiges Protokoll mit Statistiken und Export
- **Planer** — Kalenderansicht und Druckwarteschlange
- **Druckersteuerung** — Temperatur, Geschwindigkeit, Lüfter, G-Code-Konsole
- **Benachrichtigungen** — 7 Kanäle (Telegram, Discord, E-Mail, ntfy, Pushover, SMS, Webhook)
- **Multi-Drucker** — Unterstützt die gesamte Bambu Lab-Serie: X1C, X1E, P1S, P1P, P2S, A1, A1 mini, A1 Combo, H2S, H2D, H2C und mehr
- **Selbst gehostet** — Keine Cloud-Abhängigkeit, Ihre Daten auf Ihrer Maschine

## Schnellstart

| Aufgabe | Link |
|---------|------|
| Dashboard installieren | [Installation](./kom-i-gang/installasjon) |
| Ersten Drucker konfigurieren | [Einrichtung](./kom-i-gang/oppsett) |
| Bambu Cloud verbinden | [Bambu Cloud](./kom-i-gang/bambu-cloud) |
| Alle Funktionen erkunden | [Funktionen](./funksjoner/oversikt) |
| API-Dokumentation | [API](./avansert/api) |

:::tip Demo-Modus
Sie können das Dashboard ohne physischen Drucker testen, indem Sie `npm run demo` ausführen. Dadurch werden 3 simulierte Drucker mit Live-Druckzyklen gestartet.
:::

## Unterstützte Drucker

- **X1-Serie**: X1C, X1C Combo, X1E
- **P1-Serie**: P1S, P1S Combo, P1P
- **P2-Serie**: P2S, P2S Combo
- **A-Serie**: A1, A1 Combo, A1 mini
- **H2-Serie**: H2S, H2D (Doppeldüse), H2C (Werkzeugwechsler, 6 Köpfe)

## Technische Übersicht

Bambu Dashboard ist mit Node.js 22 und reinem HTML/CSS/JS gebaut — keine schweren Frameworks, kein Build-Schritt. Die Datenbank ist SQLite, eingebaut in Node.js 22. Siehe [Architektur](./avansert/arkitektur) für Details.
