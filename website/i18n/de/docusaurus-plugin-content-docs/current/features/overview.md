---
sidebar_position: 1
title: Funktionen Übersicht
description: Vollständige Übersicht aller Funktionen von Bambu Dashboard
---

# Funktionen Übersicht

Bambu Dashboard bündelt alles, was Sie benötigen, um Ihre Bambu Lab-Drucker zu überwachen und zu steuern — an einem Ort.

## Dashboard

Das Haupt-Dashboard zeigt den Echtzeitstatus des aktiven Druckers:

- **Temperatur** — Animierte SVG-Ringmesser für Düse und Bett
- **Fortschritt** — Prozentualer Fortschritt mit geschätzter Fertigstellungszeit
- **Kamera** — Live-Kameraansicht (RTSPS → MPEG1 via ffmpeg)
- **AMS-Panel** — Visuelle Darstellung aller AMS-Schächte mit Filamentfarbe
- **Geschwindigkeitsregler** — Schieberegler zur Geschwindigkeitsanpassung (Leise, Standard, Sport, Turbo)
- **Statistikpanels** — Grafana-ähnliche Panels mit Rolldiagrammen
- **Telemetrie** — Live-Werte für Lüfter, Temperaturen, Druck

Die Panels können per Drag & Drop angeordnet werden. Verwenden Sie die Sperrtaste, um das Layout zu fixieren.

## Filamentlager

Siehe [Filament](./filament) für die vollständige Dokumentation.

- Alle Spulen mit Name, Farbe, Gewicht und Hersteller verwalten
- AMS-Synchronisierung — sehen Sie, welche Spulen im AMS eingelegt sind
- Trocknungsprotokoll und Trocknungsplan
- Farbkarten und NFC-Tag-Unterstützung
- Import/Export (CSV)

## Druckverlauf

Siehe [Verlauf](./history) für die vollständige Dokumentation.

- Vollständiges Protokoll aller Drucke
- Filament-Tracking pro Druck
- Links zu MakerWorld-Modellen
- Statistiken und CSV-Export

## Planer

Siehe [Planer](./scheduler) für die vollständige Dokumentation.

- Kalenderansicht der Drucke
- Druckwarteschlange mit Priorisierung
- Multi-Drucker-Zuweisung

## Druckersteuerung

Siehe [Steuerung](./controls) für die vollständige Dokumentation.

- Temperatursteuerung (Düse, Bett, Kammer)
- Geschwindigkeitsprofilsteuerung
- Lüftersteuerung
- G-Code-Konsole
- Filament laden/entladen

## Benachrichtigungen

Bambu Dashboard unterstützt 7 Benachrichtigungskanäle:

| Kanal | Ereignisse |
|-------|-----------|
| Telegram | Druck fertig, Fehler, Pause |
| Discord | Druck fertig, Fehler, Pause |
| E-Mail | Druck fertig, Fehler |
| ntfy | Alle Ereignisse |
| Pushover | Alle Ereignisse |
| SMS (Twilio) | Kritische Fehler |
| Webhook | Benutzerdefinierte Nutzlast |

Konfigurieren Sie unter **Einstellungen → Benachrichtigungen**.

## Print Guard

Print Guard überwacht den aktiven Druck per Kamera (xcam) und Sensoren:

- Automatische Pause bei Spaghetti-Fehlern
- Konfigurierbarer Empfindlichkeitsgrad
- Protokoll der erkannten Ereignisse

## Wartung

Der Wartungsbereich verfolgt:

- Nächste empfohlene Wartung pro Komponente (Düse, Platten, AMS)
- Verschleißverfolgung basierend auf dem Druckverlauf
- Manuelle Erfassung von Wartungsaufgaben

## Multi-Drucker

Mit der Multi-Drucker-Unterstützung können Sie:

- Mehrere Drucker über ein Dashboard verwalten
- Mit der Druckerauswahl zwischen Druckern wechseln
- Statusübersicht aller Drucker gleichzeitig anzeigen
- Druckaufträge mit der Druckwarteschlange verteilen

## OBS-Overlay

Eine dedizierte `obs.html`-Seite bietet ein sauberes Overlay für die OBS Studio-Integration beim Live-Streaming von Drucken.

## Aktualisierungen

Integrierte Auto-Aktualisierung über GitHub Releases. Benachrichtigung und Aktualisierung direkt vom Dashboard unter **Einstellungen → Aktualisierung**.
