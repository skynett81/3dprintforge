---
sidebar_position: 3
title: Strommessung
description: Messen Sie den tatsächlichen Stromverbrauch pro Druck mit Shelly oder Tasmota Smart Plug und verbinden Sie ihn mit der Kostenübersicht
---

# Strommessung

Schließen Sie einen Smart Plug mit Energiemessung an den Drucker an, um den tatsächlichen Stromverbrauch pro Druck zu protokollieren — nicht nur Schätzungen.

Navigieren Sie zu: **https://localhost:3443/#settings** → **Integrationen → Strommessung**

## Unterstützte Geräte

| Gerät | Protokoll | Empfehlung |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Empfohlen — einfache Einrichtung |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Für fest installierte Montage |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Neuere Modelle mit erweiterter API |
| **Tasmota-Geräte** | MQTT | Flexibel für selbst gebaute Setups |

:::tip Empfohlenes Gerät
Shelly Plug S Plus mit Firmware 1.0+ ist getestet und empfohlen. Unterstützt WLAN, MQTT und HTTP REST ohne Cloud-Abhängigkeit.
:::

## Einrichtung mit Shelly

### Voraussetzungen

- Der Shelly-Plug ist mit demselben Netzwerk wie Bambu Dashboard verbunden
- Der Shelly ist mit statischer IP oder DHCP-Reservierung konfiguriert

### Konfiguration

1. Gehen Sie zu **Einstellungen → Strommessung**
2. Klicken Sie auf **Strommesser hinzufügen**
3. **Typ** auswählen: Shelly
4. Ausfüllen:
   - **IP-Adresse**: z.B. `192.168.1.150`
   - **Kanal**: 0 (für Einzel-Stecker-Plugs)
   - **Authentifizierung**: Benutzername und Passwort, wenn konfiguriert
5. Klicken Sie auf **Verbindung testen**
6. Plug mit einem **Drucker** verknüpfen: aus der Dropdown-Liste auswählen
7. Klicken Sie auf **Speichern**

### Polling-Intervall

Das Standard-Polling-Intervall beträgt 10 Sekunden. Auf 5 reduzieren für genauere Messungen, auf 30 erhöhen für geringere Netzwerkbelastung.

## Einrichtung mit Tasmota

1. Tasmota-Gerät mit MQTT konfigurieren (siehe Tasmota-Dokumentation)
2. In Bambu Dashboard: **Typ** auswählen: Tasmota
3. MQTT-Topic für das Gerät eingeben: z.B. `tasmota/power-plug-1`
4. Mit Drucker verbinden und auf **Speichern** klicken

Bambu Dashboard abonniert automatisch `{topic}/SENSOR` für Leistungsmessungen.

## Was wird gemessen

Wenn die Strommessung aktiviert ist, wird pro Druck Folgendes protokolliert:

| Metrik | Beschreibung |
|---|---|
| **Momentanleistung** | Watt während des Drucks (live) |
| **Gesamtenergieverbrauch** | kWh für den gesamten Druck |
| **Durchschnittliche Leistung** | kWh / Druckzeit |
| **Energiekosten** | kWh × Strompreis (von Tibber/Nordpool) |

Die Daten werden im Druckverlauf gespeichert und stehen zur Analyse zur Verfügung.

## Live-Ansicht

Der momentane Leistungsverbrauch wird angezeigt in:

- **Dashboard** — als zusätzliches Widget (in Widget-Einstellungen aktivieren)
- **Flottenübersicht** — als kleiner Indikator auf der Druckerkarte

## Vergleich mit Schätzung

Nach dem Druck wird ein Vergleich angezeigt:

| | Geschätzt | Tatsächlich |
|---|---|---|
| Energieverbrauch | 1,17 kWh | 1,09 kWh |
| Stromkosten | 0,35 € | 0,33 € |
| Abweichung | — | -6,8 % |

Konsistente Abweichungen können verwendet werden, um die Schätzungen im [Kostenkalkulator](../analyse/costestimator) zu kalibrieren.

## Drucker automatisch ausschalten

Shelly/Tasmota kann den Drucker nach dem Druck automatisch ausschalten:

1. Gehen Sie zu **Strommessung → [Drucker] → Automatisch ausschalten**
2. **X Minuten nach fertigem Druck ausschalten** aktivieren
3. Zeitverzögerung festlegen (z.B. 10 Minuten)

:::danger Abkühlung
Lassen Sie den Drucker nach dem Druck mindestens 5–10 Minuten abkühlen, bevor der Strom abgeschaltet wird. Die Düse sollte auf unter 50°C abkühlen, um thermisches Kriechen im Hotend zu vermeiden.
:::
