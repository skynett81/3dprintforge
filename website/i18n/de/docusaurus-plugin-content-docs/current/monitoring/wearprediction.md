---
sidebar_position: 5
title: Verschleißprognose
description: Prädiktive Analyse von 8 Druckerkomponenten mit Lebensdauerberechnung, Wartungsbenachrichtigungen und Kostenschätzung
---

# Verschleißprognose

Die Verschleißprognose berechnet die erwartete Lebensdauer kritischer Komponenten basierend auf tatsächlicher Nutzung, Filamenttyp und Druckerverhalten — damit Sie Wartungsarbeiten proaktiv statt reaktiv planen können.

Navigieren Sie zu: **https://localhost:3443/#wear**

## Überwachte Komponenten

3DPrintForge verfolgt den Verschleiß von 8 Komponenten pro Drucker:

| Komponente | Primärer Verschleißfaktor | Typische Lebensdauer |
|---|---|---|
| **Düse (Messing)** | Filamenttyp + Stunden | 300–800 Stunden |
| **Düse (gehärtet)** | Stunden + abrasives Material | 1500–3000 Stunden |
| **PTFE-Rohr** | Stunden + hohe Temperatur | 500–1500 Stunden |
| **Extruder-Zahnrad** | Stunden + abrasives Material | 1000–2000 Stunden |
| **X-Achsen-Stange (CNC)** | Anzahl Drucke + Geschwindigkeit | 2000–5000 Stunden |
| **Druckplattenoberfläche** | Anzahl Drucke + Temperatur | 200–500 Drucke |
| **AMS-Zahnrad** | Anzahl Filamentwechsel | 5000–15000 Wechsel |
| **Kammerlüfter** | Betriebsstunden | 3000–8000 Stunden |

## Verschleißberechnung

Verschleiß wird als kumulativer Prozentsatz berechnet (0–100 % abgenutzt):

```
Verschleiß % = (tatsächliche Nutzung / erwartete Lebensdauer) × 100
             × Materialmultiplikator
             × Geschwindigkeitsmultiplikator
```

**Materialmultiplikatoren:**
- PLA, PETG: 1,0× (normaler Verschleiß)
- ABS, ASA: 1,1× (etwas aggressiver)
- PA, PC: 1,2× (hart für PTFE und Düse)
- CF/GF-Komposite: 2,0–3,0× (sehr abrasiv)

:::warning Kohlefaser
Kohlefaserverstärkte Filamente (CF-PLA, CF-PA usw.) verschleißen Messingdüsen extrem schnell. Verwenden Sie eine gehärtete Stahldüse und rechnen Sie mit 2–3× schnellerem Verschleiß.
:::

## Lebensdauerberechnung

Für jede Komponente wird angezeigt:

- **Aktueller Verschleiß** — Prozentsatz der verbrauchten Lebensdauer
- **Geschätzte verbleibende Lebensdauer** — Stunden oder Drucke
- **Geschätztes Ablaufdatum** — basierend auf der durchschnittlichen Nutzung der letzten 30 Tage
- **Konfidenzintervall** — Unsicherheitsmarge für die Prognose

Klicken Sie auf eine Komponente, um ein detailliertes Diagramm der Verschleißakkumulierung über die Zeit anzuzeigen.

## Benachrichtigungen

Konfigurieren Sie automatische Benachrichtigungen pro Komponente:

1. Gehen Sie zu **Verschleiß → Einstellungen**
2. Setzen Sie für jede Komponente den **Benachrichtigungsschwellenwert** (empfohlen: 75 % und 90 %)
3. Benachrichtigungskanal auswählen (siehe [Benachrichtigungen](../features/notifications))

**Beispiel einer Benachrichtigung:**
> ⚠️ Düse (Messing) auf Mein X1C ist zu 78 % abgenutzt. Geschätzte Lebensdauer: ~45 Stunden. Empfehlung: Düsenwechsel planen.

## Wartungskosten

Das Verschleißmodul ist mit dem Kostenprotokoll integriert:

- **Kosten pro Komponente** — Preis des Ersatzteils
- **Gesamte Austauschkosten** — Summe aller Komponenten, die sich dem Limit nähern
- **Prognose für die nächsten 6 Monate** — geschätzte künftige Wartungskosten

Geben Sie Komponentenpreise unter **Verschleiß → Preise** ein:

1. Klicken Sie auf **Preise festlegen**
2. Geben Sie den Preis pro Einheit für jede Komponente ein
3. Der Preis wird in Kostenprognosen verwendet und kann pro Druckermodell variieren

## Verschleißzähler zurücksetzen

Nach der Wartung setzen Sie den Zähler für die betreffende Komponente zurück:

1. Gehen Sie zu **Verschleiß → [Komponentenname]**
2. Klicken Sie auf **Als ersetzt markieren**
3. Füllen Sie aus:
   - Datum des Austauschs
   - Kosten (optional)
   - Notiz (optional)
4. Der Verschleißzähler wird zurückgesetzt und neu berechnet

Zurücksetzungen werden in der Wartungshistorie angezeigt.

:::tip Kalibrierung
Vergleichen Sie die Verschleißprognose mit tatsächlichen Erfahrungsdaten und passen Sie die Lebensdauerparameter unter **Verschleiß → Lebensdauer konfigurieren** an, um die Berechnungen auf Ihre tatsächliche Nutzung abzustimmen.
:::
