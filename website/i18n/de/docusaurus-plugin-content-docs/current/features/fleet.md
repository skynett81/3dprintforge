---
sidebar_position: 3
title: Flottenübersicht
description: Verwalten und überwachen Sie alle Bambu Lab-Drucker in einem Raster mit Sortierung, Filterung und Echtzeitstatus
---

# Flottenübersicht

Die Flottenübersicht gibt Ihnen einen kompakten Überblick über alle verbundenen Drucker auf einer Seite. Ideal für Werkstätten, Schulräume oder alle, die mehr als einen Drucker besitzen.

Navigieren Sie zu: **https://localhost:3443/#fleet**

## Mehrdruckernetzwerk

Alle registrierten Drucker werden in einem responsiven Raster angezeigt:

- **Kartengröße** — Klein (kompakt), Mittel (Standard), Groß (detailliert)
- **Spaltenanzahl** — Passt sich automatisch an die Bildschirmbreite an oder wird manuell eingestellt
- **Aktualisierung** — Jede Karte wird unabhängig über MQTT aktualisiert

Jede Druckerkarte zeigt:
| Feld | Beschreibung |
|---|---|
| Druckername | Konfigurierter Name mit Modellsymbol |
| Status | Bereit / Druckt / Pause / Fehler / Getrennt |
| Fortschritt | Prozentbalken mit verbleibender Zeit |
| Temperatur | Düse und Bett (kompakt) |
| Aktives Filament | Farbe und Material aus AMS |
| Kamera-Vorschaubild | Standbild, alle 30 Sekunden aktualisiert |

## Statusanzeige pro Drucker

Statusfarben ermöglichen es, den Zustand auf einen Blick zu erkennen:

- **Grüner Puls** — Druckt aktiv
- **Blau** — Bereit und wartend
- **Gelb** — Pausiert (manuell oder durch Print Guard)
- **Rot** — Fehler erkannt
- **Grau** — Getrennt oder nicht erreichbar

:::tip Kiosk-Modus
Verwenden Sie die Flottenübersicht im Kiosk-Modus auf einem wandmontierten Bildschirm. Siehe [Kiosk-Modus](../system/kiosk) für die Einrichtung.
:::

## Sortierung

Klicken Sie auf **Sortieren**, um die Reihenfolge zu wählen:

1. **Name** — Alphabetisch A–Z
2. **Status** — Aktive Drucker oben
3. **Fortschritt** — Am weitesten fortgeschritten oben
4. **Zuletzt aktiv** — Zuletzt verwendet oben
5. **Modell** — Gruppiert nach Druckermodell

Die Sortierung wird bis zum nächsten Besuch gespeichert.

## Filterung

Verwenden Sie das Filterfeld oben, um die Ansicht einzuschränken:

- Geben Sie den Druckernamen oder einen Teil davon ein
- Wählen Sie **Status** aus der Dropdown-Liste (Alle / Druckt / Bereit / Fehler)
- Wählen Sie **Modell**, um nur einen Druckertyp anzuzeigen (X1C, P1S, A1, usw.)
- Klicken Sie auf **Filter zurücksetzen**, um alle anzuzeigen

:::info Suche
Die Suche filtert in Echtzeit, ohne die Seite neu zu laden.
:::

## Aktionen aus der Flottenübersicht

Rechtsklicken Sie auf eine Karte (oder klicken Sie auf die drei Punkte) für Schnellaktionen:

- **Dashboard öffnen** — Direkt zum Hauptpanel des Druckers wechseln
- **Druck pausieren** — Drucker pausieren
- **Druck stoppen** — Laufenden Druck abbrechen (erfordert Bestätigung)
- **Kamera ansehen** — Kameraansicht im Popup öffnen
- **Einstellungen öffnen** — Druckereinstellungen öffnen

:::danger Druck stoppen
Das Stoppen eines Drucks ist nicht rückgängig zu machen. Bestätigen Sie immer im erscheinenden Dialogfeld.
:::

## Aggregierte Statistiken

Oben in der Flottenübersicht wird eine Zusammenfassungszeile angezeigt:

- Gesamtanzahl der Drucker
- Anzahl aktiver Drucke
- Gesamter Filamentverbrauch heute
- Geschätzte Fertigstellungszeit des längsten laufenden Drucks
