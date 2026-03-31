---
sidebar_position: 6
title: Mehrere Drucker
description: Mehrere Bambu-Drucker im 3DPrintForge einrichten und verwalten — Flottenübersicht, Warteschlange und gestaffelter Start
---

# Mehrere Drucker

Haben Sie mehr als einen Drucker? 3DPrintForge ist für das Flottenmanagement gebaut — Sie können alle Drucker von einem Ort aus überwachen, steuern und koordinieren.

## Einen neuen Drucker hinzufügen

1. Gehen Sie zu **Einstellungen → Drucker**
2. Klicken Sie auf **+ Drucker hinzufügen**
3. Ausfüllen:

| Feld | Beispiel | Erklärung |
|------|----------|-----------|
| Seriennummer (SN) | 01P... | In Bambu Handy oder auf dem Druckerbildschirm zu finden |
| IP-Adresse | 192.168.1.101 | Für LAN-Modus (empfohlen) |
| Zugangscode | 12345678 | 8-stelliger Code auf dem Druckerbildschirm |
| Name | „Bambu #2 - P1S" | Im Dashboard angezeigt |
| Modell | P1P, P1S, X1C, A1 | Richtiges Modell für korrekte Symbole und Funktionen wählen |

4. Klicken Sie auf **Verbindung testen** — Sie sollten grünen Status sehen
5. Klicken Sie auf **Speichern**

:::tip Druckern beschreibende Namen geben
„Bambu 1" und „Bambu 2" sind verwirrend. Verwenden Sie Namen wie „X1C - Produktion" und „P1S - Prototypen" für einen besseren Überblick.
:::

## Die Flottenübersicht

Nachdem alle Drucker hinzugefügt wurden, werden sie im **Flotten**-Panel zusammengefasst angezeigt. Hier sehen Sie:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Produktion│  │ P1S - Prototypen│  │ A1 - Hobbyraum  │
│ ████████░░ 82%  │  │ Frei            │  │ ████░░░░░░ 38%  │
│ 1h 24m übrig    │  │ Bereit zum Druck│  │ 3h 12m übrig    │
│ Temp: 220/60°C  │  │ AMS: 4 Spulen   │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Sie können:
- Auf einen Drucker klicken, um die vollständige Detailansicht zu öffnen
- Alle Temperaturen, AMS-Status und aktive Fehler auf einmal sehen
- Nach Status filtern (aktive Drucke, frei, Fehler)

## Druckwarteschlange — Arbeit verteilen

Die Druckwarteschlange ermöglicht es Ihnen, Drucke für alle Drucker von einem Ort aus zu planen.

**So funktioniert es:**
1. Gehen Sie zu **Warteschlange**
2. Klicken Sie auf **+ Auftrag hinzufügen**
3. Datei und Einstellungen wählen
4. Drucker wählen oder **Automatische Zuweisung** wählen

### Automatische Zuweisung
Bei automatischer Zuweisung wählt das Dashboard den Drucker basierend auf:
- Freier Kapazität
- Im AMS verfügbarem Filament
- Geplanten Wartungsfenstern

Aktivieren unter **Einstellungen → Warteschlange → Automatische Zuweisung**.

### Priorisierung
Aufträge per Drag-and-Drop in der Warteschlange verschieben, um die Reihenfolge zu ändern. Ein Auftrag mit **Hoher Priorität** springt vor normale Aufträge.

## Gestaffelter Start — Stromspitzen vermeiden

Wenn Sie viele Drucker gleichzeitig starten, kann die Aufheizphase eine starke Stromspitze verursachen. Der gestaffelte Start verteilt den Anlauf:

**So aktivieren Sie es:**
1. Gehen Sie zu **Einstellungen → Flotte → Gestaffelter Start**
2. **Verteilter Start** aktivieren
3. Verzögerung zwischen Druckern einstellen (empfohlen: 2–5 Minuten)

**Beispiel mit 3 Druckern und 3 Minuten Verzögerung:**
```
08:00 Uhr — Drucker 1 beginnt Aufheizung
08:03 Uhr — Drucker 2 beginnt Aufheizung
08:06 Uhr — Drucker 3 beginnt Aufheizung
```

:::tip Relevant für Sicherungsgröße
Ein X1C zieht ca. 1000 W beim Aufheizen. Drei Drucker gleichzeitig = 3000 W, was die 16A-Sicherung auslösen kann. Der gestaffelte Start beseitigt das Problem.
:::

## Druckergruppen

Druckergruppen ermöglichen es Ihnen, Drucker logisch zu organisieren und Befehle an die gesamte Gruppe zu senden:

**Eine Gruppe erstellen:**
1. Gehen Sie zu **Einstellungen → Druckergruppen**
2. Klicken Sie auf **+ Neue Gruppe**
3. Gruppe einen Namen geben (z. B. „Produktionshalle", „Hobbyraum")
4. Drucker zur Gruppe hinzufügen

**Gruppenfunktionen:**
- Gesamtstatistik für die Gruppe anzeigen
- Pause-Befehl an die gesamte Gruppe gleichzeitig senden
- Wartungsfenster für die Gruppe festlegen

## Alle Drucker überwachen

### Mehrfach-Kameraansicht
Gehen Sie zu **Flotte → Kameraansicht**, um alle Kamera-Feeds nebeneinander zu sehen:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [Live]      │  │  [Frei]      │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Hinzufügen│
│  [Live]      │  │              │
└──────────────┘  └──────────────┘
```

### Benachrichtigungen pro Drucker
Sie können unterschiedliche Benachrichtigungsregeln für verschiedene Drucker konfigurieren:
- Produktionsdrucker: immer benachrichtigen, auch nachts
- Hobbydrucker: nur tagsüber benachrichtigen

Siehe [Benachrichtigungen](./notification-setup) für die Einrichtung.

## Tipps für den Flottenbetrieb

- **Filamentslots standardisieren**: PLA Weiß in Slot 1, PLA Schwarz in Slot 2 auf allen Druckern halten — dann ist die Auftragsverteilung einfacher
- **AMS-Füllstände täglich prüfen**: Siehe [Tägliche Nutzung](./daily-use) für die Morgenroutine
- **Wartung im Wechsel**: Nicht alle Drucker gleichzeitig warten — immer mindestens einen aktiv halten
- **Dateien klar benennen**: Dateinamen wie `logo_x1c_pla_0.2mm.3mf` machen es leicht, den richtigen Drucker zu wählen
