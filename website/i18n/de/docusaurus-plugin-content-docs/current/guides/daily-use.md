---
sidebar_position: 3
title: Tägliche Nutzung
description: Ein praktischer Leitfaden zur täglichen Nutzung des 3DPrintForges — Morgenroutine, Überwachung, nach dem Druck und Wartung
---

# Tägliche Nutzung

Dieser Leitfaden beschreibt, wie Sie das 3DPrintForge effektiv im Alltag nutzen — von Tagesbeginn bis zum Abschalten des Lichts.

## Morgenroutine

Öffnen Sie das Dashboard und gehen Sie diese Punkte kurz durch:

### 1. Druckerstatus prüfen
Das Übersichtspanel zeigt den Status aller Ihrer Drucker. Achten Sie auf:
- **Rote Symbole** — Fehler, die Aufmerksamkeit erfordern
- **Ausstehende Meldungen** — HMS-Warnungen von der Nacht
- **Nicht abgeschlossene Drucke** — Falls Sie einen Nachtdruck hatten, ist er fertig?

### 2. AMS-Füllstände prüfen
Gehen Sie zu **Filament** oder sehen Sie das AMS-Widget im Dashboard:
- Haben Spulen weniger als 100 g? Ersetzen oder neue bestellen
- Richtiges Filament im richtigen Slot für die heutigen Drucke?

### 3. Benachrichtigungen und Ereignisse prüfen
Unter **Benachrichtigungsprotokoll** (Glockensymbol) sehen Sie:
- Ereignisse, die in der Nacht aufgetreten sind
- Automatisch protokollierte Fehler
- HMS-Codes, die einen Alarm ausgelöst haben

## Einen Druck starten

### Aus einer Datei (Bambu Studio)
1. Bambu Studio öffnen
2. Modell laden und slicen
3. An Drucker senden — das Dashboard aktualisiert sich automatisch

### Aus der Warteschlange
Wenn Sie Drucke im Voraus geplant haben:
1. Gehen Sie zu **Warteschlange**
2. Klicken Sie auf **Nächsten starten** oder ziehen Sie einen Auftrag nach oben
3. Bestätigen mit **An Drucker senden**

Siehe [Druckwarteschlangen-Dokumentation](../features/queue) für vollständige Informationen zur Warteschlangenverwaltung.

### Geplanter Druck (Scheduler)
Um einen Druck zu einem bestimmten Zeitpunkt zu starten:
1. Gehen Sie zu **Planer**
2. Klicken Sie auf **+ Neuer Auftrag**
3. Datei, Drucker und Zeitpunkt wählen
4. **Strompreisoptimierung** aktivieren, um automatisch die günstigste Stunde zu wählen

Siehe [Planer](../features/scheduler) für Details.

## Einen aktiven Druck überwachen

### Kameraansicht
Klicken Sie auf das Kamerasymbol auf der Druckerkarte. Sie können:
- Live-Feed im Dashboard ansehen
- In separater Registerkarte für Hintergrundüberwachung öffnen
- Einen manuellen Screenshot aufnehmen

### Fortschrittsinformationen
Die aktive Druckkarte zeigt:
- Fertigstellungsprozentsatz
- Geschätzte Restzeit
- Aktuelle Schicht / Gesamtanzahl der Schichten
- Aktives Filament und Farbe

### Temperaturen
Echtzeit-Temperaturkurven werden im Detailpanel angezeigt:
- Düsentemperatur — sollte stabil innerhalb von ±2°C bleiben
- Plattentemperatur — wichtig für gute Haftung
- Kammertemperatur — steigt allmählich, besonders relevant für ABS/ASA

### Print Guard
Wenn **Print Guard** aktiviert ist, überwacht das Dashboard automatisch auf Spaghetti und volumetrische Abweichungen. Wenn etwas erkannt wird:
1. Der Druck wird pausiert
2. Sie erhalten eine Benachrichtigung
3. Kamerabilder werden zur Nachkontrolle gespeichert

## Nach dem Druck — Checkliste

### Qualität prüfen
1. Kamera öffnen und das Ergebnis ansehen, während es noch auf der Platte liegt
2. Zu **Verlauf → Letzter Druck** gehen, um Statistiken einzusehen
3. Eine Notiz hinterlassen: Was gut lief, was verbessert werden kann

### Archivieren
Drucke im Verlauf werden nie automatisch archiviert — sie bleiben bestehen. Wenn Sie aufräumen möchten:
- Auf einen Druck klicken → **Archivieren**, um ihn ins Archiv zu verschieben
- **Projekte** verwenden, um zusammengehörige Drucke zu gruppieren

### Filamentgewicht aktualisieren
Wenn Sie die Spule für Genauigkeit wiegen (empfohlen):
1. Spule wiegen
2. Zu **Filament → [Spule]** gehen
3. **Verbleibendes Gewicht** aktualisieren

## Wartungserinnerungen

Das Dashboard verfolgt Wartungsintervalle automatisch. Unter **Wartung** sehen Sie:

| Aufgabe | Intervall | Status |
|---------|-----------|--------|
| Düse reinigen | Alle 50 Stunden | Automatisch geprüft |
| Stangen schmieren | Alle 200 Stunden | Im Dashboard verfolgt |
| Platte kalibrieren | Nach Plattenwechsel | Manuelle Erinnerung |
| AMS reinigen | Monatlich | Kalenderbenachrichtigung |

Wartungsbenachrichtigungen aktivieren unter **Überwachung → Wartung → Benachrichtigungen**.

:::tip Wöchentlichen Wartungstag einrichten
Ein fester Wartungstag in der Woche (z. B. Sonntagabend) spart unnötige Ausfallzeiten. Verwenden Sie die Erinnerungsfunktion im Dashboard.
:::

## Strompreis — beste Zeit zum Drucken

Wenn Sie die Strompreisintegration (Nordpool / Home Assistant) verbunden haben:

1. Gehen Sie zu **Analyse → Strompreis**
2. Preisdiagramm für die nächsten 24 Stunden ansehen
3. Günstigste Stunden sind grün markiert

Verwenden Sie den **Planer** mit aktivierter **Strompreisoptimierung** — dann startet das Dashboard den Auftrag automatisch im günstigsten verfügbaren Zeitfenster.

:::info Typisch günstigste Zeiten
Die Nacht (01:00–06:00 Uhr) ist in der Regel am günstigsten in Nordeuropa. Ein 8-Stunden-Druck, der abends in die Warteschlange gestellt wird, kann bis zu 30–50 % der Stromkosten einsparen.
:::
