---
sidebar_position: 4
title: Remote-Server
description: Verbinden Sie mehrere 3DPrintForge-Instanzen, um alle Drucker von einem zentralen Dashboard aus anzuzeigen
---

# Remote-Server (Remote Nodes)

Die Remote-Server-Funktion ermöglicht es Ihnen, mehrere 3DPrintForge-Instanzen zu verbinden, sodass Sie alle Drucker über eine zentrale Benutzeroberfläche anzeigen und steuern können — unabhängig davon, ob sie sich im selben Netzwerk oder an verschiedenen Standorten befinden.

Navigieren Sie zu: **https://localhost:3443/#settings** → **Integrationen → Remote-Server**

## Anwendungsszenarien

- **Zuhause + Büro** — Drucker an beiden Standorten vom selben Dashboard aus anzeigen
- **Makerspace** — Zentrales Dashboard für alle Instanzen im Raum
- **Gastinstanzen** — Kunden eingeschränkten Einblick ohne vollen Zugriff gewähren

## Architektur

```
Primäre Instanz (Ihr PC)
  ├── Drucker A (lokales MQTT)
  ├── Drucker B (lokales MQTT)
  └── Remote-Server: Sekundäre Instanz
        ├── Drucker C (MQTT am Remote-Standort)
        └── Drucker D (MQTT am Remote-Standort)
```

Die primäre Instanz fragt Remote-Server über die REST-API ab und aggregiert die Daten lokal.

## Einen Remote-Server hinzufügen

### Schritt 1: API-Schlüssel auf der Remote-Instanz generieren

1. Bei der Remote-Instanz anmelden (z.B. `https://192.168.2.50:3443`)
2. Gehen Sie zu **Einstellungen → API-Schlüssel**
3. Klicken Sie auf **Neuer Schlüssel** → Namen vergeben „Primärer Knoten"
4. Berechtigungen festlegen: **Lesen** (mindestens) oder **Lesen + Schreiben** (für Fernsteuerung)
5. Schlüssel kopieren

### Schritt 2: Von der Primärinstanz verbinden

1. Gehen Sie zu **Einstellungen → Remote-Server**
2. Klicken Sie auf **Remote-Server hinzufügen**
3. Ausfüllen:
   - **Name**: z.B. „Büro" oder „Garage"
   - **URL**: `https://192.168.2.50:3443` oder externe URL
   - **API-Schlüssel**: Schlüssel aus Schritt 1
4. Klicken Sie auf **Verbindung testen**
5. Klicken Sie auf **Speichern**

:::warning Selbstsigniertes Zertifikat
Wenn die Remote-Instanz ein selbstsigniertes Zertifikat verwendet, aktivieren Sie **TLS-Fehler ignorieren** — tun Sie dies jedoch nur für interne Netzwerkverbindungen.
:::

## Aggregierte Ansicht

Nach der Verbindung werden die Remote-Drucker angezeigt in:

- **Flottenübersicht** — mit dem Namen des Remote-Servers und einem Cloud-Symbol markiert
- **Statistiken** — aggregiert über alle Instanzen hinweg
- **Filamentlager** — zusammengefasste Übersicht

## Fernsteuerung

Mit **Lesen + Schreiben**-Berechtigung können Sie Remote-Drucker direkt steuern:

- Pausieren / Fortsetzen / Stoppen
- Zur Druckwarteschlange hinzufügen (Auftrag wird an die Remote-Instanz gesendet)
- Kamerastream anzeigen (über die Remote-Instanz weitergeleitet)

:::info Latenz
Der Kamerastream über den Remote-Server kann je nach Netzwerkgeschwindigkeit und Entfernung merkliche Verzögerungen aufweisen.
:::

## Zugangskontrolle

Einschränken, welche Daten der Remote-Server teilt:

1. Auf der Remote-Instanz: gehen Sie zu **Einstellungen → API-Schlüssel → [Schlüsselname]**
2. Zugriff einschränken:
   - Nur bestimmte Drucker
   - Kein Kamerastream
   - Schreibgeschützt (nur Lesen)

## Gesundheit und Überwachung

Status jedes Remote-Servers wird unter **Einstellungen → Remote-Server** angezeigt:

- **Verbunden** — letzter Poll erfolgreich
- **Getrennt** — Remote-Server nicht erreichbar
- **Authentifizierungsfehler** — API-Schlüssel ungültig oder abgelaufen
- **Letzte Synchronisierung** — Zeitstempel der letzten erfolgreichen Datensynchronisierung
