---
sidebar_position: 6
title: Fehlermusteranalyse
description: KI-basierte Analyse von Fehlermustern, Korrelationen zwischen Fehlern und Umgebungsfaktoren sowie konkrete Verbesserungsvorschläge
---

# Fehlermusteranalyse

Die Fehlermusteranalyse verwendet historische Daten aus Drucken und Fehlern, um Muster, Ursachen und Korrelationen zu identifizieren — und liefert konkrete Verbesserungsvorschläge.

Navigieren Sie zu: **https://localhost:3443/#error-analysis**

## Was analysiert wird

Das System analysiert folgende Datenpunkte:

- HMS-Fehlercodes und Zeitpunkte
- Filamenttyp und Hersteller bei Fehlern
- Temperatur bei Fehlern (Düse, Bett, Kammer)
- Druckgeschwindigkeit und -profil
- Tageszeit und Wochentag
- Zeit seit letzter Wartung
- Druckermodell und Firmware-Version

## Korrelationsanalyse

Das System sucht nach statistischen Korrelationen zwischen Fehlern und Faktoren:

**Beispiele für erkannte Korrelationen:**
- „78 % der AMS-Blockierungsfehler treten mit Filament von Hersteller X auf"
- „Düsenverstopfung tritt 3× häufiger nach mehr als 6 Stunden kontinuierlichem Drucken auf"
- „Haftungsfehler nehmen bei Kammertemperatur unter 18 °C zu"
- „Stringing-Fehler korrelieren mit Luftfeuchtigkeit über 60 % (wenn Hygrometer angeschlossen)"

Korrelationen mit statistischer Signifikanz (p < 0,05) werden oben angezeigt.

:::info Datenanforderungen
Die Analyse ist am genauesten mit mindestens 50 Drucken in der Historie. Bei weniger Drucken werden Schätzungen mit niedriger Konfidenz angezeigt.
:::

## Verbesserungsvorschläge

Basierend auf den Analysen werden konkrete Vorschläge generiert:

| Vorschlagstyp | Beispiel |
|---|---|
| Filament | „Wechseln Sie zu einem anderen Hersteller für PA-CF — 3 von 4 Fehlern verwendeten HerstellerX" |
| Temperatur | „Erhöhen Sie die Betttemperatur um 5 °C für PETG — Haftungsfehler reduzieren sich schätzungsweise um 60 %" |
| Geschwindigkeit | „Reduzieren Sie die Geschwindigkeit auf 80 % nach 4 Stunden — Düsenverstopfungen reduzieren sich schätzungsweise um 45 %" |
| Wartung | „Extruder-Zahnrad reinigen — Verschleiß korreliert mit 40 % der Extrusionsfehler" |
| Kalibrierung | „Bed-Leveling ausführen — 12 von 15 Haftungsfehlern der letzten Woche korrelieren mit fehlerhafter Kalibrierung" |

Jeder Vorschlag zeigt:
- Geschätzte Auswirkung (%-Reduzierung der Fehler)
- Konfidenz (niedrig / mittel / hoch)
- Schritt-für-Schritt-Implementierung
- Link zur relevanten Dokumentation

## Gesundheitsscore-Einfluss

Die Analyse ist mit dem Gesundheitsscore verknüpft (siehe [Diagnose](./diagnostics)):

- Zeigt, welche Faktoren den Score am stärksten beeinflussen
- Schätzt die Score-Verbesserung bei Umsetzung jedes Vorschlags
- Priorisiert Vorschläge nach potenziellem Score-Gewinn

## Zeitlinienansicht

Gehen Sie zu **Fehleranalyse → Zeitlinie** für eine chronologische Übersicht:

1. Drucker und Zeitraum auswählen
2. Fehler werden als Punkte auf der Zeitlinie angezeigt, farblich nach Typ kodiert
3. Horizontale Linien markieren Wartungsaufgaben
4. Fehlergruppen (viele Fehler in kurzer Zeit) sind rot hervorgehoben

Klicken Sie auf eine Gruppe, um die Analyse des spezifischen Zeitraums zu öffnen.

## Berichte

Erstellen Sie einen PDF-Bericht über die Fehleranalyse:

1. Klicken Sie auf **Bericht erstellen**
2. Zeitraum auswählen (z.B. letzte 90 Tage)
3. Inhalt auswählen: Korrelationen, Vorschläge, Zeitlinie, Gesundheitsscore
4. PDF herunterladen oder per E-Mail senden

Berichte werden unter Projekten gespeichert, wenn der Drucker mit einem Projekt verknüpft ist.

:::tip Wöchentliche Überprüfung
Richten Sie einen automatischen wöchentlichen E-Mail-Bericht unter **Einstellungen → Berichte** ein, um ohne manuellen Dashboard-Besuch auf dem Laufenden zu bleiben. Siehe [Berichte](../system/reports).
:::
