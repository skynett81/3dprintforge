---
sidebar_position: 4
title: Planer
description: Planen Sie Drucke, verwalten Sie die Druckwarteschlange und richten Sie automatischen Versand ein
---

# Planer

Der Planer ermöglicht es Ihnen, Druckaufträge mit Kalenderansicht und einer intelligenten Druckwarteschlange zu organisieren und zu automatisieren.

## Kalenderansicht

Die Kalenderansicht bietet einen Überblick über alle geplanten und durchgeführten Drucke:

- **Monats-, Wochen- und Tagesansicht** — wählen Sie den Detaillierungsgrad
- **Farbcodierung** — verschiedene Farben pro Drucker und Status
- **Klick auf ein Ereignis** — Druckdetails anzeigen

Abgeschlossene Drucke werden automatisch basierend auf der Druckhistorie angezeigt.

## Druckwarteschlange

Die Druckwarteschlange ermöglicht es Ihnen, Aufträge in eine Reihenfolge zu stellen, die nacheinander an den Drucker gesendet werden:

### Auftrag zur Warteschlange hinzufügen

1. Klicken Sie auf **+ Auftrag hinzufügen**
2. Datei auswählen (von Drucker-SD, lokalem Upload oder FTP)
3. Priorität angeben (hoch, normal, niedrig)
4. Zieldrucker auswählen (oder „automatisch")
5. Klicken Sie auf **Hinzufügen**

### Warteschlangenverwaltung

| Aktion | Beschreibung |
|----------|-------------|
| Drag & Drop | Reihenfolge ändern |
| Warteschlange pausieren | Versand vorübergehend stoppen |
| Überspringen | Nächsten Auftrag ohne Warten senden |
| Löschen | Auftrag aus Warteschlange entfernen |

:::tip Multi-Drucker-Versand
Mit mehreren Druckern kann die Warteschlange Aufträge automatisch auf freie Drucker verteilen. Aktivieren Sie **Automatischer Versand** unter **Planer → Einstellungen**.
:::

## Geplante Drucke

Richten Sie Drucke ein, die zu einem bestimmten Zeitpunkt starten sollen:

1. Klicken Sie auf **+ Druck planen**
2. Datei und Drucker auswählen
3. Startzeit angeben
4. Benachrichtigung konfigurieren (optional)
5. Speichern

:::warning Drucker muss frei sein
Geplante Drucke starten nur, wenn der Drucker zum angegebenen Zeitpunkt im Stand-by-Modus ist. Wenn der Drucker beschäftigt ist, wird der Start auf den nächsten verfügbaren Zeitpunkt verschoben (konfigurierbar).
:::

## Lastausgleich

Mit automatischem Lastausgleich werden Aufträge intelligent auf Drucker verteilt:

- **Round-Robin** — gleichmäßige Verteilung auf alle Drucker
- **Am wenigsten beschäftigt** — an den Drucker mit der kürzesten geschätzten Fertigstellungszeit senden
- **Manuell** — Sie wählen für jeden Auftrag selbst den Drucker

Konfigurieren Sie unter **Planer → Lastausgleich**.

## Benachrichtigungen

Der Planer ist mit Benachrichtigungskanälen integriert:

- Benachrichtigung wenn Auftrag startet
- Benachrichtigung wenn Auftrag fertig ist
- Benachrichtigung bei Fehler oder Verzögerung

Siehe [Funktionsübersicht](./overview#varsler) zur Konfiguration von Benachrichtigungskanälen.
