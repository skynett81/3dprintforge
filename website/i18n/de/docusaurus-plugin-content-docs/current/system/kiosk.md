---
sidebar_position: 6
title: Kiosk-Modus
description: Richten Sie 3DPrintForge als wandmontierten Bildschirm oder Hub-Ansicht mit Kiosk-Modus und automatischer Rotation ein
---

# Kiosk-Modus

Der Kiosk-Modus ist für wandmontierte Bildschirme, Fernseher oder dedizierte Monitore konzipiert, die kontinuierlich den Druckerstatus anzeigen — ohne Tastatur, Mausinteraktion oder Browser-UI.

Navigieren Sie zu: **https://localhost:3443/#settings** → **System → Kiosk**

## Was ist der Kiosk-Modus

Im Kiosk-Modus:
- Das Navigationsmenü ist ausgeblendet
- Keine interaktiven Steuerelemente sichtbar
- Das Dashboard wird automatisch aktualisiert
- Der Bildschirm rotiert zwischen Druckern (wenn konfiguriert)
- Inaktivitäts-Timeout ist deaktiviert

## Kiosk-Modus über URL aktivieren

`?kiosk=true` zur URL hinzufügen, um den Kiosk-Modus zu aktivieren, ohne die Einstellungen zu ändern:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

Kiosk-Modus deaktivieren, indem der Parameter entfernt oder `?kiosk=false` hinzugefügt wird.

## Kiosk-Einstellungen

1. Gehen Sie zu **Einstellungen → System → Kiosk**
2. Konfigurieren:

| Einstellung | Standardwert | Beschreibung |
|---|---|---|
| Standardansicht | Flottenübersicht | Welche Seite angezeigt wird |
| Rotationsintervall | 30 Sekunden | Zeit pro Drucker bei der Rotation |
| Rotationsmodus | Nur aktive | Nur zwischen aktiven Druckern rotieren |
| Thema | Dunkel | Für Bildschirme empfohlen |
| Schriftgröße | Groß | Aus der Entfernung lesbar |
| Uhranzeige | Aus | Uhr in der Ecke anzeigen |

## Flottenansicht für Kiosk

Die Flottenübersicht ist für den Kiosk optimiert:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parameter für die Flottenansicht:
- `cols=N` — Anzahl Spalten (1–6)
- `size=small|medium|large` — Kartengröße

## Einzeldrucker-Rotation

Für die Rotation zwischen einzelnen Druckern (ein Drucker nach dem anderen):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — Rotation aktivieren
- `interval=N` — Sekunden pro Drucker

## Einrichtung auf Raspberry Pi / NUC

Für dedizierte Kiosk-Hardware:

### Chromium im Kiosk-Modus (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Den Befehl in Autostart einfügen (`~/.config/autostart/bambu-kiosk.desktop`).

### Automatische Anmeldung und Start

1. Automatische Anmeldung im Betriebssystem konfigurieren
2. Einen Autostart-Eintrag für Chromium erstellen
3. Bildschirmschoner und Energiesparmodus deaktivieren:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Dediziertes Benutzerkonto
Erstellen Sie ein dediziertes 3DPrintForge-Benutzerkonto mit der Rolle **Gast** für das Kiosk-Gerät. Dann hat das Gerät nur Lesezugriff und kann keine Einstellungen ändern, selbst wenn jemand Zugriff auf den Bildschirm erlangt.
:::

## Hub-Einstellungen

Der Hub-Modus zeigt eine Übersichtsseite mit allen Druckern und wichtigen Statistiken — konzipiert für große Fernseher:

```
https://localhost:3443/#hub?kiosk=true
```

Die Hub-Ansicht enthält:
- Drucker-Grid mit Status
- Aggregierte Kennzahlen (aktive Drucke, Gesamtfortschritt)
- Uhr und Datum
- Neueste HMS-Warnmeldungen
