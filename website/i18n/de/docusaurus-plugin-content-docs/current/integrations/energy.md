---
sidebar_position: 2
title: Strompreis
description: Verbinden Sie sich mit Tibber oder Nordpool für Live-Stundenpreise, Preisverlauf und Preisbenachrichtigungen
---

# Strompreis

Die Strompreis-Integration ruft Live-Strompreise von Tibber oder Nordpool ab, um genaue Stromkostenberechnungen pro Druck zu ermöglichen und Benachrichtigungen über günstige oder ungünstige Druckzeiten zu senden.

Navigieren Sie zu: **https://localhost:3443/#settings** → **Integrationen → Strompreis**

## Tibber-Integration

Tibber ist ein nordischer Stromanbieter mit offener API für Spotpreise.

### Einrichtung

1. Melden Sie sich bei [developer.tibber.com](https://developer.tibber.com) an
2. Generieren Sie einen **Personal Access Token**
3. In 3DPrintForge: Token unter **Tibber API Token** einfügen
4. **Zuhause** auswählen (von wo Preise abgerufen werden sollen, wenn mehrere Häuser vorhanden)
5. Klicken Sie auf **Verbindung testen**
6. Klicken Sie auf **Speichern**

### Verfügbare Daten von Tibber

- **Spotpreis jetzt** — aktueller Preis inkl. Steuern (€/kWh)
- **Preise für die nächsten 24 Stunden** — Tibber liefert die Preise des nächsten Tages ab ca. 13:00 Uhr
- **Preisverlauf** — bis zu 30 Tage rückwirkend
- **Kosten pro Druck** — berechnet aus tatsächlicher Druckzeit × Stundenpreisen

## Nordpool-Integration

Nordpool ist die Energiebörse, die Roh-Spotpreise für den nordischen Raum liefert.

### Einrichtung

1. Gehen Sie zu **Integrationen → Nordpool**
2. **Preisbereich** auswählen: DE-LU (Deutschland-Luxemburg) / AT (Österreich) / CH (Schweiz) / usw.
3. **Währung** auswählen: EUR
4. **Steuern und Abgaben** auswählen:
   - **MwSt. einschließen** (19 %) ankreuzen
   - **Netzentgelt** (€/kWh) eingeben — auf Ihrer Stromrechnung nachsehen
   - **Stromsteuer** (€/kWh) eingeben
5. Klicken Sie auf **Speichern**

:::info Netzentgelt
Das Netzentgelt variiert je nach Netzbetreiber und Tarifmodell. Schauen Sie auf Ihre letzte Stromrechnung für den richtigen Tarif.
:::

## Stundenpreise

Stundenpreise werden als Balkendiagramm für die nächsten 24–48 Stunden angezeigt:

- **Grün** — günstige Stunden (unter Durchschnitt)
- **Gelb** — Durchschnittspreis
- **Rot** — teure Stunden (über Durchschnitt)
- **Grau** — Stunden ohne verfügbare Preisprognose

Hovern Sie über eine Stunde, um den genauen Preis (€/kWh) zu sehen.

## Preisverlauf

Gehen Sie zu **Strompreis → Verlauf**, um Folgendes anzuzeigen:

- Täglicher Durchschnittspreis der letzten 30 Tage
- Teuerste und günstigste Stunde pro Tag
- Gesamtstromkosten für Drucke pro Tag

## Preisbenachrichtigungen

Automatische Benachrichtigungen basierend auf dem Strompreis einrichten:

1. Gehen Sie zu **Strompreis → Preisbenachrichtigungen**
2. Klicken Sie auf **Neue Benachrichtigung**
3. Benachrichtigungstyp auswählen:
   - **Preis unter Schwellenwert** — benachrichtigen, wenn der Strompreis unter X €/kWh fällt
   - **Preis über Schwellenwert** — benachrichtigen, wenn der Preis über X €/kWh steigt
   - **Günstigste Stunde heute** — benachrichtigen, wenn die günstigste Stunde des Tages beginnt
4. Benachrichtigungskanal auswählen
5. Klicken Sie auf **Speichern**

:::tip Intelligente Planung
Kombinieren Sie Preisbenachrichtigungen mit der Druckwarteschlange: Richten Sie eine Automatisierung ein, die Warteschlangenaufträge automatisch sendet, wenn der Strompreis niedrig ist (erfordert Webhook-Integration oder Home Assistant).
:::

## Strompreis im Kostenkalkulator

Eine aktivierte Strompreisintegration liefert genaue Stromkosten im [Kostenkalkulator](../analytics/costestimator). Wählen Sie **Live-Preis** anstelle eines Festpreises, um den aktuellen Tibber/Nordpool-Preis zu verwenden.
