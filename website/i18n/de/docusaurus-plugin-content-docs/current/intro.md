---
sidebar_position: 1
title: Willkommen bei 3DPrintForge
description: Ein leistungsstarkes, selbst gehostetes Dashboard für Bambu Lab 3D-Drucker
---

# Willkommen bei 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** ist ein selbst gehostetes, vollständiges Steuerungspanel für Bambu Lab 3D-Drucker. Es bietet Ihnen vollständige Übersicht und Kontrolle über Drucker, Filamentlager, Druckverlauf und mehr — alles in einem Browser-Tab.

## Was ist 3DPrintForge?

3DPrintForge verbindet sich direkt über MQTT per LAN mit Ihrem Drucker, ohne Abhängigkeit von Bambu Lab-Servern. Sie können auch eine Verbindung zur Bambu Cloud herstellen, um Modelle und Druckverlauf zu synchronisieren.

### Wichtigste Funktionen

- **Live-Dashboard** — Echtzeit-Temperaturen, Fortschritt, Kamera, AMS-Status mit LIVE-Indikator
- **Filamentlager** — Alle Spulen mit AMS-Sync, EXT-Spulenunterstützung, Materialinfo, Plattenkompatibilität und Trocknungsanleitung
- **Filament-Tracking** — Genaues Tracking mit 4-stufigem Fallback (AMS-Sensor → EXT-Schätzung → Cloud → Dauer)
- **Materialanleitung** — 15 Materialien mit Temperaturen, Plattenkompatibilität, Trocknung, Eigenschaften und Tipps
- **Druckverlauf** — Vollständiges Protokoll mit Modellnamen, MakerWorld-Links, Filamentverbrauch und Kosten
- **Planer** — Kalenderansicht, Druckwarteschlange mit Lastausgleich und Filamentprüfung
- **Druckersteuerung** — Temperatur, Geschwindigkeit, Lüfter, G-Code-Konsole
- **Print Guard** — Automatischer Schutz mit xcam + 5 Sensormonitore
- **Kostenkalkulator** — Material, Strom, Arbeit, Verschleiß, Aufschlag mit Verkaufspreisvorschlag
- **Wartung** — Tracking mit KB-basierten Intervallen, Düsenlebensdauer, Plattenlebensdauer und Anleitung
- **Tonbenachrichtigungen** — 9 konfigurierbare Events mit benutzerdefiniertem Sound-Upload und Druckerlautsprecher (M300)
- **Aktivitätsprotokoll** — Persistente Zeitleiste aller Ereignisse (Drucke, Fehler, Wartung, Filament)
- **Benachrichtigungen** — 7 Kanäle (Telegram, Discord, E-Mail, ntfy, Pushover, SMS, Webhook)
- **Multi-Drucker** — Unterstützt die gesamte Bambu Lab-Serie
- **17 Sprachen** — Norwegisch, Englisch, Deutsch, Französisch, Spanisch, Italienisch, Japanisch, Koreanisch, Niederländisch, Polnisch, Portugiesisch, Schwedisch, Türkisch, Ukrainisch, Chinesisch, Tschechisch, Ungarisch
- **Selbst gehostet** — Keine Cloud-Abhängigkeit, Ihre Daten auf Ihrer Maschine

### Neu in v1.1.14

- **AdminLTE 4-Integration** — komplette HTML-Umstrukturierung mit Treeview-Sidebar, modernem Layout und CSP-Unterstützung für CDN
- **CRM-System** — vollständige Kundenverwaltung mit 4 Panels: Kunden, Aufträge, Rechnungen und Unternehmenseinstellungen mit Verlaufsintegration
- **Modernes UI** — Teal-Akzent, Verlaufstitel, Hover-Glow, schwebende Orbs und verbessertes dunkles Theme
- **Achievements: 18 Wahrzeichen** — Wikingerschiff, Freiheitsstatue, Eiffel Tower, Big Ben, Brandenburger Tor, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, niederländische Windmühle, Wawel-Drache, Cristo Redentor, Turning Torso, Hagia Sophia, Mutter Heimat, Chinesische Mauer, Prager Rathausuhr, Budapester Parlament — mit Detail-Popup, XP und Seltenheit
- **AMS-Feuchtigkeit/Temperatur** — 5-Stufen-Bewertung mit Empfehlungen für Lagerung und Trocknung
- **Live-Filament-Tracking** — Echtzeit-Aktualisierung während des Drucks über Cloud-Schätzungs-Fallback
- **Filament-Bereich Redesign** — große Spulen mit vollständigen Infos (Marke, Gewicht, Temperatur, RFID, Farbe), horizontales Layout und Klick-für-Details
- **EXT-Spule inline** — externe Spule wird zusammen mit AMS-Spulen angezeigt, bessere Platznutzung
- **Dashboard-Layout optimiert** — 2-Spalten-Standard für 24–27"-Monitore, großes 3D/Kamera, kompaktes Filament/AMS
- **Filamentwechselzeit** im Kostenkalkulator mit sichtbarem Wechselzähler
- **Globales Warnsystem** — Warnleiste mit Toast-Benachrichtigungen unten rechts, blockiert nicht die Navbar
- **Guided Tour i18n** — alle 14 Tour-Schlüssel in 17 Sprachen übersetzt
- **5 neue KB-Seiten** — Kompatibilitätsmatrix und neue Filament-Anleitungen in 17 Sprachen übersetzt
- **Vollständiges i18n** — alle 3252 Schlüssel in 17 Sprachen übersetzt, einschließlich CRM und Wahrzeichen-Achievements

## Schnellstart

| Aufgabe | Link |
|---------|------|
| Dashboard installieren | [Installation](./getting-started/installation) |
| Ersten Drucker konfigurieren | [Einrichtung](./getting-started/setup) |
| Bambu Cloud verbinden | [Bambu Cloud](./getting-started/bambu-cloud) |
| Alle Funktionen erkunden | [Funktionen](./features/overview) |
| Filamentanleitung | [Materialanleitung](./kb/filaments/guide) |
| Wartungsanleitung | [Wartung](./kb/maintenance/nozzle) |
| API-Dokumentation | [API](./advanced/api) |

:::tip Demo-Modus
Sie können das Dashboard ohne physischen Drucker testen, indem Sie `npm run demo` ausführen. Dadurch werden 3 simulierte Drucker mit Live-Druckzyklen gestartet.
:::

## Unterstützte Drucker

Alle Bambu Lab-Drucker mit LAN-Modus:

- **X1-Serie**: X1C, X1C Combo, X1E
- **P1-Serie**: P1S, P1S Combo, P1P
- **P2-Serie**: P2S, P2S Combo
- **A-Serie**: A1, A1 Combo, A1 mini
- **H2-Serie**: H2S, H2D (Doppeldüse), H2C (Werkzeugwechsler, 6 Köpfe)

## Funktionen im Detail

### Filament-Tracking

Das Dashboard verfolgt den Filamentverbrauch automatisch mit einem 4-stufigen Fallback:

1. **AMS-Sensor-Diff** — am genauesten, vergleicht Start/Ende remain%
2. **EXT direkt** — für P2S/A1 ohne vt_tray, verwendet Cloud-Schätzung
3. **Cloud-Schätzung** — aus Bambu Cloud-Druckjob-Daten
4. **Dauer-Schätzung** — ~30 g/Stunde als letzter Fallback

Alle Werte werden als Minimum aus AMS-Sensor und Spulendatenbank angezeigt, um Fehler nach fehlgeschlagenen Drucken zu vermeiden.

### Materialanleitung

Integrierte Datenbank mit 15 Materialien einschließlich:
- Temperaturen (Düse, Bett, Kammer)
- Plattenkompatibilität (Cool, Engineering, High Temp, Textured PEI)
- Trocknungsinformationen (Temperatur, Zeit, Hygroskopizität)
- 8 Eigenschaften (Stärke, Flexibilität, Wärmebeständigkeit, UV, Oberfläche, Benutzerfreundlichkeit)
- Schwierigkeitsgrad und besondere Anforderungen (gehärtete Düse, Enclosure)

### Tonbenachrichtigungen

9 konfigurierbare Events mit Unterstützung für:
- **Benutzerdefinierte Audioclips** — MP3/OGG/WAV hochladen (max. 10 Sekunden, 500 KB)
- **Integrierte Töne** — metallische/synth-Klänge mit Web Audio API generiert
- **Druckerlautsprecher** — M300 G-Code-Melodien direkt auf dem Buzzer des Druckers
- **Countdown** — Tonalarm, wenn noch 1 Minute des Drucks verbleibt

### Wartung

Vollständiges Wartungssystem mit:
- Komponentenverfolgung (Düse, PTFE-Schlauch, Stangen, Lager, AMS, Platte, Trocknung)
- KB-basierte Intervalle aus der Dokumentation
- Düsenlebensdauer pro Typ (Messing, gehärteter Stahl, HS01)
- Plattenlebensdauer pro Typ (Cool, Engineering, High Temp, Textured PEI)
- Anleitungs-Tab mit Tipps und Links zur vollständigen Dokumentation

## Technische Übersicht

3DPrintForge ist mit Node.js 22 und reinem HTML/CSS/JS gebaut — keine schweren Frameworks, kein Build-Schritt. Die Datenbank ist SQLite, eingebaut in Node.js 22.

- **Backend**: Node.js 22 mit nur 3 npm-Paketen (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, kein Build-Schritt
- **Datenbank**: SQLite über Node.js 22 Built-in `--experimental-sqlite`
- **Dokumentation**: Docusaurus mit 17 Sprachen, automatisch bei Installation erstellt
- **API**: 177+ Endpunkte, OpenAPI-Dokumentation unter `/api/docs`

Siehe [Architektur](./advanced/architecture) für Details.
