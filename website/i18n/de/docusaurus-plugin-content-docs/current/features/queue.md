---
sidebar_position: 5
title: Druckwarteschlange
description: Planen und automatisieren Sie Drucke mit priorisierter Warteschlange, automatischem Versand und gestaffeltem Start
---

# Druckwarteschlange

Die Druckwarteschlange ermöglicht es Ihnen, Drucke im Voraus zu planen und sie automatisch an verfügbare Drucker zu senden, wenn diese frei sind.

Navigieren Sie zu: **https://localhost:3443/#queue**

## Eine Warteschlange erstellen

1. Gehen Sie zu **Druckwarteschlange** im Navigationsmenü
2. Klicken Sie auf **Neuer Auftrag** (+ Symbol)
3. Füllen Sie aus:
   - **Dateiname** — Laden Sie eine `.3mf`- oder `.gcode`-Datei hoch
   - **Zieldrucker** — Wählen Sie einen bestimmten Drucker oder **Automatisch**
   - **Priorität** — Niedrig / Normal / Hoch / Kritisch
   - **Geplanter Start** — Jetzt oder ein bestimmtes Datum/Uhrzeit
4. Klicken Sie auf **Zur Warteschlange hinzufügen**

:::tip Drag & Drop
Sie können Dateien direkt aus dem Datei-Explorer auf die Warteschlangenseite ziehen, um sie schnell hinzuzufügen.
:::

## Dateien hinzufügen

### Datei hochladen

1. Klicken Sie auf **Hochladen** oder ziehen Sie eine Datei in das Uploadfeld
2. Unterstützte Formate: `.3mf`, `.gcode`, `.bgcode`
3. Die Datei wird in der Dateibibliothek gespeichert und mit dem Warteschlangenauftrag verknüpft

### Aus der Dateibibliothek

1. Gehen Sie zur **Dateibibliothek** und finden Sie die Datei
2. Klicken Sie auf **Zur Warteschlange hinzufügen** bei der Datei
3. Der Auftrag wird mit Standardeinstellungen erstellt — bearbeiten Sie ihn bei Bedarf

### Aus der Historie

1. Öffnen Sie einen früheren Druck in der **Historie**
2. Klicken Sie auf **Erneut drucken**
3. Der Auftrag wird mit denselben Einstellungen wie beim letzten Mal hinzugefügt

## Priorität

Die Warteschlange wird in Prioritätsreihenfolge abgearbeitet:

| Priorität | Farbe | Beschreibung |
|---|---|---|
| Kritisch | Rot | Wird unabhängig von anderen Aufträgen an den ersten freien Drucker gesendet |
| Hoch | Orange | Vor normalen und niedrigen Aufträgen |
| Normal | Blau | Standardreihenfolge (FIFO) |
| Niedrig | Grau | Wird nur gesendet, wenn keine höheren Aufträge warten |

Ziehen Sie Aufträge in der Warteschlange, um die Reihenfolge innerhalb derselben Prioritätsstufe manuell zu ändern.

## Automatischer Versand

Wenn der **Automatische Versand** aktiviert ist, überwacht 3DPrintForge alle Drucker und sendet den nächsten Auftrag automatisch:

1. Gehen Sie zu **Einstellungen → Warteschlange**
2. Aktivieren Sie **Automatischer Versand**
3. Wählen Sie die **Versandstrategie**:
   - **Erster freier** — Sendet an den ersten Drucker, der frei wird
   - **Am wenigsten genutzt** — Bevorzugt den Drucker mit den wenigsten Drucken heute
   - **Round-Robin** — Rotiert gleichmäßig zwischen allen Druckern

:::warning Bestätigung
Aktivieren Sie **Bestätigung erforderlich** in den Einstellungen, wenn Sie jeden Versand manuell genehmigen möchten, bevor die Datei gesendet wird.
:::

## Gestaffelter Start

Gestaffelter Start ist nützlich, um zu vermeiden, dass alle Drucker gleichzeitig starten und enden:

1. Klappen Sie im Dialog **Neuer Auftrag** **Erweiterte Einstellungen** auf
2. Aktivieren Sie **Gestaffelter Start**
3. Setzen Sie **Verzögerung zwischen Druckern** (z.B. 30 Minuten)
4. Das System verteilt die Startzeiten automatisch

**Beispiel:** 4 identische Aufträge mit 30 Minuten Verzögerung starten um 08:00, 08:30, 09:00 und 09:30.

## Warteschlangenstatus und Nachverfolgung

Die Warteschlangenübersicht zeigt alle Aufträge mit Status:

| Status | Beschreibung |
|---|---|
| Wartend | Auftrag ist in der Warteschlange und wartet auf Drucker |
| Geplant | Hat einen geplanten Startzeitpunkt in der Zukunft |
| Wird gesendet | Wird an Drucker übertragen |
| Druckt | Läuft auf dem ausgewählten Drucker |
| Abgeschlossen | Fertig — mit Historie verknüpft |
| Fehlgeschlagen | Fehler beim Senden oder während des Drucks |
| Abgebrochen | Manuell abgebrochen |

:::info Benachrichtigungen
Aktivieren Sie Benachrichtigungen für Warteschlangenereignisse unter **Einstellungen → Benachrichtigungen → Warteschlange**, um eine Meldung zu erhalten, wenn ein Auftrag startet, abgeschlossen wird oder fehlschlägt. Siehe [Benachrichtigungen](./notifications).
:::
