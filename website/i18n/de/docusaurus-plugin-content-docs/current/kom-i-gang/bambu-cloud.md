---
sidebar_position: 3
title: Bambu Cloud-Integration
description: Verbinden Sie das Dashboard mit Bambu Lab Cloud zur Synchronisierung von Modellen und Druckhistorie
---

# Bambu Cloud-Integration

Bambu Dashboard kann eine Verbindung zur **Bambu Lab Cloud** herstellen, um Modellbilder, Druckhistorie und Filamentdaten abzurufen. Das Dashboard funktioniert problemlos ohne Cloud-Verbindung, aber die Cloud-Integration bietet zusätzliche Vorteile.

## Vorteile der Cloud-Integration

| Funktion | Ohne Cloud | Mit Cloud |
|---------|-----------|----------|
| Live-Druckerstatus | Ja | Ja |
| Druckhistorie (lokal) | Ja | Ja |
| Modellbilder von MakerWorld | Nein | Ja |
| Filamentprofile von Bambu | Nein | Ja |
| Synchronisierung der Druckhistorie | Nein | Ja |
| AMS-Filament aus der Cloud | Nein | Ja |

## Mit Bambu Cloud verbinden

1. Gehen Sie zu **Einstellungen → Bambu Cloud**
2. Geben Sie Ihre Bambu Lab E-Mail-Adresse und Ihr Passwort ein
3. Klicken Sie auf **Anmelden**
4. Wählen Sie, welche Daten synchronisiert werden sollen

:::warning Datenschutz
Benutzername und Passwort werden nicht im Klartext gespeichert. Das Dashboard verwendet die Bambu Labs API, um ein OAuth-Token abzurufen, das lokal gespeichert wird. Ihre Daten verlassen niemals Ihren Server.
:::

## Synchronisierung

### Modellbilder

Wenn die Cloud verbunden ist, werden Modellbilder automatisch von **MakerWorld** abgerufen und angezeigt in:
- Druckhistorie
- Dashboard (während eines aktiven Drucks)
- 3D-Modellansicht

### Druckhistorie

Die Cloud-Synchronisierung importiert die Druckhistorie aus der Bambu Lab App. Duplikate werden automatisch anhand von Zeitstempel und Seriennummer gefiltert.

### Filamentprofile

Die offiziellen Filamentprofile von Bambu Labs werden synchronisiert und im Filamentlager angezeigt. Sie können diese als Ausgangspunkt für eigene Profile verwenden.

## Was funktioniert ohne Cloud?

Alle Kernfunktionen arbeiten ohne Cloud-Verbindung:

- Direkte MQTT-Verbindung zum Drucker über LAN
- Live-Status, Temperatur, Kamera
- Lokale Druckhistorie und Statistiken
- Filamentlager (manuell verwaltet)
- Benachrichtigungen und Planer

:::tip LAN-Only-Modus
Möchten Sie das Dashboard vollständig ohne Internetverbindung nutzen? Es funktioniert hervorragend in einem isolierten Netzwerk — verbinden Sie einfach den Drucker per IP und lassen Sie die Cloud-Integration deaktiviert.
:::

## Fehlerbehebung

**Anmeldung schlägt fehl:**
- Prüfen Sie, ob E-Mail-Adresse und Passwort für die Bambu Lab App korrekt sind
- Prüfen Sie, ob das Konto die Zwei-Faktor-Authentifizierung verwendet (noch nicht unterstützt)
- Versuchen Sie, sich ab- und wieder anzumelden

**Synchronisierung stoppt:**
- Das Token kann abgelaufen sein — melden Sie sich unter Einstellungen ab und wieder an
- Prüfen Sie die Internetverbindung Ihres Servers
