---
sidebar_position: 7
title: Berichte
description: Automatische wöchentliche und monatliche E-Mail-Berichte mit Statistiken, Aktivitätszusammenfassung und Wartungserinnerungen
---

# Berichte

Bambu Dashboard kann automatische E-Mail-Berichte mit Statistiken und Aktivitätszusammenfassungen senden — wöchentlich, monatlich oder beides.

Navigieren Sie zu: **https://localhost:3443/#settings** → **System → Berichte**

## Voraussetzungen

Berichte erfordern, dass E-Mail-Benachrichtigungen konfiguriert sind. Richten Sie SMTP unter **Einstellungen → Benachrichtigungen → E-Mail** ein, bevor Sie Berichte aktivieren. Siehe [Benachrichtigungen](../funksjoner/notifications).

## Automatische Berichte aktivieren

1. Gehen Sie zu **Einstellungen → Berichte**
2. **Wöchentlichen Bericht** und/oder **Monatlichen Bericht** aktivieren
3. **Sendezeitpunkt** auswählen:
   - Wöchentlich: Wochentag und Uhrzeit
   - Monatlich: Tag im Monat (z.B. 1. Montag / letzter Freitag)
4. **Empfänger-E-Mail** eingeben (kommagetrennt für mehrere)
5. Klicken Sie auf **Speichern**

Testbericht senden, um die Formatierung zu prüfen: Klicken Sie auf **Testbericht jetzt senden**.

## Inhalt des wöchentlichen Berichts

Der wöchentliche Bericht deckt die letzten 7 Tage ab:

### Zusammenfassung
- Gesamtanzahl Drucke
- Anzahl erfolgreich / fehlgeschlagen / abgebrochen
- Erfolgsrate und Änderung gegenüber der Vorwoche
- Aktivster Drucker

### Aktivität
- Drucke pro Tag (Mini-Diagramm)
- Gesamte Druckstunden
- Gesamter Filamentverbrauch (Gramm und Kosten)

### Filament
- Verbrauch nach Material und Hersteller
- Geschätzter Restbestand pro Spule (Spulen unter 20 % hervorgehoben)

### Wartung
- Diese Woche durchgeführte Wartungsaufgaben
- Überfällige Wartungsaufgaben (rote Warnung)
- Aufgaben, die nächste Woche fällig werden

### HMS-Fehler
- Anzahl HMS-Fehler diese Woche pro Drucker
- Unquittierte Fehler (erfordern Aufmerksamkeit)

## Inhalt des monatlichen Berichts

Der monatliche Bericht deckt die letzten 30 Tage ab und enthält alles aus dem Wochenbericht, plus:

### Trend
- Vergleich mit dem Vormonat (%)
- Aktivitätskarte (Heatmap-Miniatur für den Monat)
- Monatliche Entwicklung der Erfolgsrate

### Kosten
- Gesamte Filamentkosten
- Gesamte Stromkosten (wenn Strommessung konfiguriert)
- Gesamte Verschleißkosten
- Gesamte Wartungskosten

### Verschleiß und Gesundheit
- Gesundheitspunktzahl pro Drucker (mit Änderung gegenüber Vormonat)
- Komponenten, die sich dem Austauschzeitpunkt nähern

### Statistik-Highlights
- Längster erfolgreicher Druck
- Meistverwendeter Filamenttyp
- Aktivster Drucker

## Bericht anpassen

1. Gehen Sie zu **Einstellungen → Berichte → Anpassung**
2. Abschnitte ein-/ausschalten, die Sie einschließen möchten
3. **Druckerfilter** auswählen: alle Drucker oder eine Auswahl
4. **Logodarstellung** auswählen: Bambu Dashboard-Logo in der Kopfzeile anzeigen oder deaktivieren
5. Klicken Sie auf **Speichern**

## Berichtsarchiv

Alle gesendeten Berichte werden gespeichert und können erneut geöffnet werden:

1. Gehen Sie zu **Einstellungen → Berichte → Archiv**
2. Bericht aus der Liste auswählen (nach Datum sortiert)
3. Klicken Sie auf **Öffnen**, um die HTML-Version anzuzeigen
4. Klicken Sie auf **Als PDF herunterladen**, um den Bericht herunterzuladen

Berichte werden nach **90 Tagen** automatisch gelöscht (konfigurierbar).
