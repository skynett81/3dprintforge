---
sidebar_position: 8
title: Im Dashboard navigieren
description: Lernen Sie, im Bambu Dashboard zu navigieren — Seitenleiste, Panels, Tastaturkürzel und Anpassung
---

# Im Dashboard navigieren

Diese Anleitung gibt Ihnen eine schnelle Einführung in die Organisation des Dashboards und wie Sie effizient navigieren.

## Die Seitenleiste

Die Seitenleiste links ist Ihr Navigationszentrum. Sie ist in Abschnitte gegliedert:

```
┌────────────────────┐
│ 🖨  Druckerstatus  │  ← Eine Zeile pro Drucker
├────────────────────┤
│ Übersicht          │
│ Flotte             │
│ Aktiver Druck      │
├────────────────────┤
│ Filament           │
│ Verlauf            │
│ Projekte           │
│ Warteschlange      │
│ Planer             │
├────────────────────┤
│ Überwachung        │
│  └ Print Guard     │
│  └ Fehler          │
│  └ Diagnose        │
│  └ Wartung         │
├────────────────────┤
│ Analyse            │
│ Werkzeuge          │
│ Integrationen      │
│ System             │
├────────────────────┤
│ ⚙ Einstellungen   │
└────────────────────┘
```

**Die Seitenleiste kann ausgeblendet werden**, indem Sie oben links auf das Hamburger-Symbol (☰) klicken. Nützlich bei kleineren Bildschirmen oder im Kiosk-Modus.

## Das Hauptpanel

Wenn Sie auf ein Element in der Seitenleiste klicken, wird der Inhalt im Hauptpanel rechts angezeigt. Das Layout variiert:

| Panel | Layout |
|-------|--------|
| Übersicht | Kartenraster mit allen Druckern |
| Aktiver Druck | Große Detailkarte + Temperaturkurven |
| Verlauf | Filtierbare Tabelle |
| Filament | Kartenansicht mit Spulen |
| Analyse | Grafiken und Diagramme |

## Auf Druckerstatus für Details klicken

Die Druckerkarte im Übersichtspanel ist anklickbar:

**Einfacher Klick** → Öffnet das Detailpanel für diesen Drucker:
- Echtzeittemperaturen
- Aktiver Druck (wenn laufend)
- AMS-Status mit allen Slots
- Letzte Fehler und Ereignisse
- Schnellschaltflächen: Pause, Stopp, Licht an/aus

**Klick auf das Kamerasymbol** → Öffnet Live-Kameraansicht

**Klick auf das ⚙-Symbol** → Druckereinstellungen

## Tastaturkürzel — Befehlspalette

Die Befehlspalette ermöglicht schnellen Zugriff auf alle Funktionen ohne zu navigieren:

| Kürzel | Aktion |
|--------|--------|
| `Strg + K` (Linux/Windows) | Befehlspalette öffnen |
| `Cmd + K` (macOS) | Befehlspalette öffnen |
| `Esc` | Palette schließen |

In der Befehlspalette können Sie:
- Nach Seiten und Funktionen suchen
- Einen Druck direkt starten
- Aktive Drucke pausieren / fortsetzen
- Theme wechseln (hell/dunkel)
- Zu jeder beliebigen Seite navigieren

**Beispiel:** `Strg+K` drücken, „Pause" eingeben → „Alle aktiven Drucke pausieren" wählen

## Widget-Anpassung

Das Übersichtspanel kann mit selbst gewählten Widgets angepasst werden:

**So bearbeiten Sie das Dashboard:**
1. Oben rechts im Übersichtspanel auf **Layout bearbeiten** (Bleistift-Symbol) klicken
2. Widgets an die gewünschte Position ziehen
3. In die Ecke eines Widgets klicken und ziehen, um die Größe zu ändern
4. Auf **+ Widget hinzufügen** klicken, um neue hinzuzufügen:

Verfügbare Widgets:

| Widget | Zeigt |
|--------|-------|
| Druckerstatus | Karten für alle Drucker |
| Aktiver Druck (groß) | Detailansicht des laufenden Drucks |
| AMS-Übersicht | Alle Slots und Filamentfüllstände |
| Temperaturkurve | Echtzeitgraf |
| Strompreis | Preisdiagramm der nächsten 24 Stunden |
| Filameter | Gesamtverbrauch der letzten 30 Tage |
| Verlaufsverknüpfung | Letzte 5 Drucke |
| Kamera-Feed | Live-Kamerabild |

5. Auf **Layout speichern** klicken

:::tip Mehrere Layouts speichern
Sie können verschiedene Layouts für verschiedene Zwecke haben — ein kompaktes für den täglichen Gebrauch, ein großes für die Anzeige auf einem Großbildschirm. Mit dem Layout-Wähler zwischen ihnen wechseln.
:::

## Theme — zwischen Hell und Dunkel wechseln

**Schnelles Wechseln:**
- Auf das Sonne/Mond-Symbol oben rechts in der Navigation klicken
- Oder: `Strg+K` → „Theme" eingeben

**Dauerhafte Einstellung:**
1. Gehen Sie zu **System → Themes**
2. Zwischen folgenden wählen:
   - **Hell** — weißer Hintergrund
   - **Dunkel** — dunkler Hintergrund (nachts empfohlen)
   - **Automatisch** — folgt der Systemeinstellung Ihres Geräts
3. Akzentfarbe wählen (Blau, Grün, Lila usw.)
4. Auf **Speichern** klicken

## Tastaturnavigation

Für effiziente Navigation ohne Maus:

| Kürzel | Aktion |
|--------|--------|
| `Tab` | Nächstes interaktives Element |
| `Umschalt+Tab` | Vorheriges Element |
| `Eingabe` / `Leertaste` | Schaltfläche/Link aktivieren |
| `Esc` | Modal/Dropdown schließen |
| `Strg+K` | Befehlspalette |
| `Alt+1` – `Alt+9` | Direkt zu den 9 ersten Seiten navigieren |

## PWA — als App installieren

Bambu Dashboard kann als Progressive Web App (PWA) installiert werden und als eigenständige App ohne Browser-Menüs laufen:

1. Das Dashboard in Chrome, Edge oder Safari öffnen
2. Auf das Symbol **App installieren** in der Adressleiste klicken
3. Installation bestätigen

Siehe [PWA-Dokumentation](../system/pwa) für weitere Details.

## Kiosk-Modus

Der Kiosk-Modus blendet alle Navigation aus und zeigt nur das Dashboard — perfekt für einen dedizierten Bildschirm in der Druckerwerkstatt:

1. Gehen Sie zu **System → Kiosk**
2. **Kiosk-Modus** aktivieren
3. Wählen, welche Widgets angezeigt werden sollen
4. Aktualisierungsintervall einstellen

Siehe [Kiosk-Dokumentation](../system/kiosk) für die vollständige Einrichtung.
