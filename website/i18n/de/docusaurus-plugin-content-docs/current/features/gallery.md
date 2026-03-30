---
sidebar_position: 8
title: Galerie
description: Sehen Sie Milestone-Screenshots, die automatisch bei 25, 50, 75 und 100 % Fortschritt für alle Drucke aufgenommen wurden
---

# Galerie

Die Galerie sammelt automatische Screenshots, die während jedes Drucks aufgenommen wurden. Die Bilder werden bei festen Meilensteinen aufgenommen und bieten Ihnen ein visuelles Protokoll des Druckfortschritts.

Navigieren Sie zu: **https://localhost:3443/#gallery**

## Milestone-Screenshots

Bambu Dashboard nimmt automatisch einen Screenshot von der Kamera bei folgenden Meilensteinen auf:

| Meilenstein | Zeitpunkt |
|---|---|
| **25 %** | Ein Viertel des Drucks |
| **50 %** | Halbzeit |
| **75 %** | Drei Viertel des Drucks |
| **100 %** | Druck abgeschlossen |

Screenshots werden gespeichert, mit dem entsprechenden Historieeintrag verknüpft und in der Galerie angezeigt.

:::info Voraussetzungen
Milestone-Screenshots erfordern, dass die Kamera verbunden und aktiv ist. Deaktivierte Kameras erzeugen keine Bilder.
:::

## Screenshot-Funktion aktivieren

1. Gehen Sie zu **Einstellungen → Galerie**
2. Aktivieren Sie **Automatische Milestone-Screenshots**
3. Wählen Sie, welche Meilensteine aktiviert werden sollen (alle vier sind standardmäßig aktiv)
4. Wählen Sie die **Bildqualität**: Niedrig (640×360) / Mittel (1280×720) / Hoch (1920×1080)
5. Klicken Sie auf **Speichern**

## Bildanzeige

Die Galerie ist nach Druck organisiert:

1. Verwenden Sie den **Filter** oben, um Drucker, Datum oder Dateinamen auszuwählen
2. Klicken Sie auf eine Druckzeile, um sie aufzuklappen und alle vier Bilder zu sehen
3. Klicken Sie auf ein Bild, um die Vorschau zu öffnen

### Vorschau

Die Vorschau zeigt:
- Bild in voller Größe
- Meilenstein und Zeitstempel
- Druckname und Drucker
- **←** / **→** zum Blättern zwischen Bildern desselben Drucks

## Vollbildansicht

Klicken Sie auf **Vollbild** (oder drücken Sie `F`) in der Vorschau, um den gesamten Bildschirm zu füllen. Verwenden Sie die Pfeiltasten zum Blättern zwischen Bildern.

## Bilder herunterladen

- **Einzelnes Bild**: Klicken Sie auf **Herunterladen** in der Vorschau
- **Alle Bilder eines Drucks**: Klicken Sie auf **Alle herunterladen** in der Druckzeile — Sie erhalten eine `.zip`-Datei
- **Mehrere auswählen**: Haken Sie Kontrollkästchen an und klicken Sie auf **Ausgewählte herunterladen**

## Bilder löschen

:::warning Speicherplatz
Galeriebilder können über die Zeit erheblich Speicherplatz belegen. Richten Sie automatisches Löschen alter Bilder ein.
:::

### Manuelles Löschen

1. Wählen Sie ein oder mehrere Bilder aus (Haken setzen)
2. Klicken Sie auf **Ausgewählte löschen**
3. Bestätigen Sie im Dialog

### Automatische Bereinigung

1. Gehen Sie zu **Einstellungen → Galerie → Automatische Bereinigung**
2. Aktivieren Sie **Bilder löschen, die älter sind als**
3. Setzen Sie die Anzahl der Tage (z.B. 90 Tage)
4. Die Bereinigung wird automatisch jede Nacht um 03:00 Uhr ausgeführt

## Verknüpfung mit der Druckhistorie

Jedes Bild ist mit einem Druckeintrag in der Historie verknüpft:

- Klicken Sie auf **In Historie anzeigen** für einen Druck in der Galerie, um zum Historieeintrag zu springen
- In der Historie wird ein Vorschaubild des 100%-Bildes angezeigt, wenn eines vorhanden ist

## Teilen

Teilen Sie ein Galeriebild über einen zeitlich begrenzten Link:

1. Öffnen Sie das Bild in der Vorschau
2. Klicken Sie auf **Teilen**
3. Wählen Sie die Ablaufzeit und kopieren Sie den Link
