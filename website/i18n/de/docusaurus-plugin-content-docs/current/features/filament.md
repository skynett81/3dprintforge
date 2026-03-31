---
sidebar_position: 2
title: Filamentlager
description: Verwalten Sie Filamentspulen, AMS-Synchronisierung, Trocknung und mehr
---

# Filamentlager

Das Filamentlager gibt Ihnen einen vollständigen Überblick über alle Filamentspulen, integriert mit AMS und Druckhistorie.

## Übersicht

Das Lager zeigt alle registrierten Spulen mit:

- **Farbe** — visuelle Farbkarte
- **Material** — PLA, PETG, ABS, TPU, PA usw.
- **Hersteller** — Bambu Lab, Polymaker, eSUN usw.
- **Gewicht** — verbleibendes Gewicht in Gramm (geschätzt oder gewogen)
- **AMS-Schacht** — welcher Schacht die Spule enthält
- **Status** — aktiv, leer, trocknend, eingelagert

## Spulen hinzufügen

1. Klicken Sie auf **+ Neue Spule**
2. Geben Sie Material, Farbe, Hersteller und Gewicht ein
3. Scannen Sie den NFC-Tag falls verfügbar, oder geben Sie ihn manuell ein
4. Speichern

:::tip Bambu Lab-Spulen
Offizielle Bambu Lab-Spulen können automatisch über die Bambu Cloud-Integration importiert werden. Siehe [Bambu Cloud](../getting-started/bambu-cloud).
:::

## AMS-Synchronisierung

Wenn das Dashboard mit dem Drucker verbunden ist, wird der AMS-Status automatisch synchronisiert:

- Schächte werden mit der richtigen Farbe und dem richtigen Material aus dem AMS angezeigt
- Der Verbrauch wird nach jedem Druck aktualisiert
- Leere Spulen werden automatisch markiert

Um eine lokale Spule mit einem AMS-Schacht zu verknüpfen:
1. Gehen Sie zu **Filament → AMS**
2. Klicken Sie auf den Schacht, den Sie verknüpfen möchten
3. Wählen Sie die Spule aus dem Lager

## Trocknung

Registrieren Sie Trocknungszyklen, um die Feuchtigkeitsexposition zu verfolgen:

| Feld | Beschreibung |
|------|-------------|
| Trocknungsdatum | Wann die Spule getrocknet wurde |
| Temperatur | Trocknungstemperatur (°C) |
| Dauer | Anzahl der Stunden |
| Methode | Ofen, Trocknungsbox, Filamenttrockner |

:::info Empfohlene Trocknungstemperaturen
Siehe [Wissensdatenbank](../kb/intro) für materialspezifische Trocknungszeiten und -temperaturen.
:::

## Farbkarte

Die Farbkartenansicht organisiert Spulen visuell nach Farbe. Nützlich, um schnell die richtige Farbe zu finden. Filtern Sie nach Material, Hersteller oder Status.

## NFC-Tags

3DPrintForge unterstützt NFC-Tags zur schnellen Identifikation von Spulen:

1. Schreiben Sie die NFC-Tag-ID für die Spule im Lager
2. Scannen Sie den Tag mit dem Mobilgerät
3. Die Spule öffnet sich direkt im Dashboard

## Import und Export

### Export
Exportieren Sie das gesamte Lager als CSV: **Filament → Export → CSV**

### Import
Importieren Sie Spulen aus CSV: **Filament → Import → Datei auswählen**

Das CSV-Format:
```
name,material,farbe_hex,hersteller,gewicht_gramm,nfc_id
PLA Weiß,PLA,#FFFFFF,Bambu Lab,1000,
PETG Schwarz,PETG,#000000,Polymaker,850,ABC123
```

## Statistiken

Unter **Filament → Statistiken** finden Sie:

- Gesamtverbrauch pro Material (letzte 30/90/365 Tage)
- Verbrauch pro Drucker
- Geschätzte verbleibende Lebensdauer pro Spule
- Meistverwendete Farben und Hersteller
