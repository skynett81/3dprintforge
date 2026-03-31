---
sidebar_position: 2
title: Filamentlager einrichten
description: So erstellen, konfigurieren und verwalten Sie Ihre Filamentspulen im 3DPrintForge
---

# Filamentlager einrichten

Das Filamentlager im 3DPrintForge gibt Ihnen einen vollständigen Überblick über alle Ihre Spulen — was noch übrig ist, was verbraucht wurde und welche Spulen sich gerade im AMS befinden.

## Automatische Erstellung aus dem AMS

Wenn Sie einen Drucker mit AMS verbinden, liest das Dashboard automatisch Informationen von den RFID-Chips auf Bambu-Spulen:

- Filamenttyp (PLA, PETG, ABS, TPU usw.)
- Farbe (mit Farbhex)
- Marke (Bambu Lab)
- Spulengewicht und verbleibende Menge

**Diese Spulen werden automatisch im Lager erstellt** — Sie müssen nichts tun. Sehen Sie sie unter **Filament → Lager**.

:::info Nur Bambu-Spulen haben RFID
Drittanbieter-Spulen (z. B. eSUN, Polymaker, Bambu-Refill ohne Chip) werden nicht automatisch erkannt. Diese müssen manuell eingegeben werden.
:::

## Spulen manuell hinzufügen

Für Spulen ohne RFID oder Spulen, die sich nicht im AMS befinden:

1. Gehen Sie zu **Filament → Lager**
2. Klicken Sie oben rechts auf **+ Neue Spule**
3. Füllen Sie die Felder aus:

| Feld | Beispiel | Pflichtfeld |
|------|----------|-------------|
| Marke | eSUN, Polymaker, Bambu | Ja |
| Typ | PLA, PETG, ABS, TPU | Ja |
| Farbe | #FF5500 oder aus dem Farbrad wählen | Ja |
| Startgewicht | 1000 g | Empfohlen |
| Verbleibend | 850 g | Empfohlen |
| Durchmesser | 1,75 mm | Ja |
| Notiz | „Gekauft 2025-01, funktioniert gut" | Optional |

4. Klicken Sie auf **Speichern**

## Farben und Marken konfigurieren

Sie können eine Spule jederzeit bearbeiten, indem Sie in der Lagerübersicht darauf klicken:

- **Farbe** — Wählen Sie aus dem Farbrad oder geben Sie einen Hexwert ein. Die Farbe wird als visueller Marker in der AMS-Übersicht verwendet
- **Marke** — Wird in Statistiken und Filterung angezeigt. Eigene Marken unter **Filament → Marken** erstellen
- **Temperaturprofil** — Empfohlene Düsen- und Plattentemperatur vom Filamenthersteller eingeben. Das Dashboard kann dann warnen, wenn Sie die falsche Temperatur wählen

## AMS-Synchronisierung verstehen

Das Dashboard synchronisiert den AMS-Status in Echtzeit:

```
AMS Slot 1 → Spule: Bambu PLA Weiß  [███████░░░] 72% verbleibend
AMS Slot 2 → Spule: eSUN PETG Grau  [████░░░░░░] 41% verbleibend
AMS Slot 3 → (leer)
AMS Slot 4 → Spule: Bambu PLA Rot   [██████████] 98% verbleibend
```

Die Synchronisierung wird aktualisiert:
- **Während des Drucks** — Verbrauch wird in Echtzeit abgezogen
- **Am Ende des Drucks** — endgültiger Verbrauch wird im Verlauf protokolliert
- **Manuell** — Klicken Sie auf das Synchronisierungssymbol einer Spule, um aktualisierte Daten vom AMS abzurufen

:::tip AMS-Schätzung korrigieren
Die AMS-Schätzung von RFID ist nach der ersten Verwendung nicht immer 100 % genau. Wiegen Sie die Spule und aktualisieren Sie das Gewicht manuell für beste Präzision.
:::

## Verbrauch und Restmenge prüfen

### Pro Spule
Klicken Sie auf eine Spule im Lager, um zu sehen:
- Gesamt verwendet (Gramm, alle Drucke)
- Geschätzte verbleibende Menge
- Liste aller Drucke, die diese Spule verwendet haben

### Gesamtstatistik
Unter **Analyse → Filamentanalyse** sehen Sie:
- Verbrauch pro Filamenttyp über die Zeit
- Welche Marken Sie am meisten verwenden
- Geschätzte Kosten basierend auf dem Einkaufspreis pro kg

### Niedrigstandswarnungen
Richten Sie Warnungen ein, wenn eine Spule sich dem Ende nähert:

1. Gehen Sie zu **Filament → Einstellungen**
2. Aktivieren Sie **Bei niedrigem Bestand warnen**
3. Schwellenwert festlegen (z. B. noch 100 g)
4. Benachrichtigungskanal wählen (Telegram, Discord, E-Mail)

## Tipp: Spulen für Genauigkeit wiegen

Die Schätzungen von AMS und Druckstatistik sind nie ganz exakt. Die genaueste Methode ist, die Spule selbst zu wiegen:

**So gehen Sie vor:**

1. Taragewicht ermitteln (leere Spule) — normalerweise 200–250 g, auf der Herstellerwebsite oder dem Spulenboden nachsehen
2. Spule mit Filament auf einer Küchenwaage wiegen
3. Taragewicht abziehen
4. **Verbleibend** im Spulenprofil aktualisieren

**Beispiel:**
```
Gewogenes Gewicht:   743 g
Tara (leer):       - 230 g
Filament verbleibend: 513 g
```

:::tip Spulenetikettengenerator
Unter **Werkzeuge → Etiketten** können Sie Etiketten mit QR-Code für Ihre Spulen ausdrucken. Scannen Sie den Code mit dem Telefon, um schnell das Spulenprofil zu öffnen.
:::
