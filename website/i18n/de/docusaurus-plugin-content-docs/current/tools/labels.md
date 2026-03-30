---
sidebar_position: 1
title: Etiketten
description: Erstellen Sie QR-Codes, Spulenetiketten für Thermodrucker (ZPL), Farbkarten und geteilte Farbpaletten für das Filamentlager
---

# Etiketten

Das Etikettenwerkzeug erstellt professionelle Etiketten für Ihre Filamentspulen — QR-Codes, Spulenetiketten für Thermodrucker und Farbkarten zur visuellen Identifikation.

Navigieren Sie zu: **https://localhost:3443/#labels**

## QR-Codes

QR-Codes erstellen, die auf Filamentinformationen im Dashboard verweisen:

1. Gehen Sie zu **Etiketten → QR-Codes**
2. Wählen Sie die Spule, für die Sie einen QR-Code erstellen möchten
3. Der QR-Code wird automatisch generiert und in der Vorschau angezeigt
4. Klicken Sie auf **PNG herunterladen** oder **Drucken**

Der QR-Code enthält eine URL zum Filamentprofil im Dashboard. Scannen Sie ihn mit dem Mobilgerät, um Spuleninformationen schnell abzurufen.

### Batch-Generierung

1. Klicken Sie auf **Alle auswählen** oder haken Sie einzelne Spulen an
2. Klicken Sie auf **Alle QR-Codes generieren**
3. Als ZIP mit einer PNG pro Spule herunterladen oder alle auf einmal drucken

## Spulenetiketten

Professionelle Etiketten für Thermodrucker mit vollständigen Spuleninformationen:

### Etiketteninhalt (Standard)

- Spulenfarbe (gefüllter Farbblock)
- Materialname (große Schrift)
- Hersteller
- Farb-Hex-Code
- Temperaturempfehlungen (Düse und Bett)
- QR-Code
- Barcode (optional)

### ZPL für Thermodrucker

ZPL-Code (Zebra Programming Language) für Zebra-, Brother- und Dymo-Drucker erstellen:

1. Gehen Sie zu **Etiketten → Thermaldruck**
2. Etikettengröße auswählen: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Spule(n) auswählen
4. Klicken Sie auf **ZPL generieren**
5. ZPL-Code an den Drucker senden über:
   - **Direkt drucken** (USB-Verbindung)
   - **ZPL kopieren** und per Terminal-Befehl senden
   - **.zpl-Datei herunterladen**

:::tip Druckereinrichtung
Für automatischen Druck konfigurieren Sie die Druckerstation unter **Einstellungen → Etikettendrucker** mit IP-Adresse und Port (Standard: 9100 für RAW TCP).
:::

### PDF-Etiketten

Für normale Drucker ein PDF mit richtigen Abmessungen erstellen:

1. Etikettengröße aus der Vorlage auswählen
2. Klicken Sie auf **PDF generieren**
3. Auf selbstklebendes Papier drucken (Avery oder ähnlich)

## Farbkarten

Farbkarten sind ein kompaktes Raster, das alle Spulen visuell anzeigt:

1. Gehen Sie zu **Etiketten → Farbkarten**
2. Wählen Sie, welche Spulen aufgenommen werden sollen (alle aktiven oder manuell auswählen)
3. Kartenformat auswählen: **A4** (4×8), **A3** (6×10), **Letter**
4. Klicken Sie auf **PDF generieren**

Jedes Feld zeigt:
- Farbblock mit tatsächlicher Farbe
- Materialname und Farb-Hex
- Materialnummer (für schnelle Referenz)

Ideal zum Laminieren und Aufhängen an der Druckerstation.

## Geteilte Farbpaletten

Eine Auswahl von Farben als geteilte Palette exportieren:

1. Gehen Sie zu **Etiketten → Farbpaletten**
2. Spulen auswählen, die in die Palette aufgenommen werden sollen
3. Klicken Sie auf **Palette teilen**
4. Link kopieren — andere können die Palette in ihr Dashboard importieren
5. Die Palette wird mit Hex-Codes angezeigt und kann in **Adobe Swatch** (`.ase`) oder **Procreate** (`.swatches`) exportiert werden
