---
sidebar_position: 3
title: AMS-Wartung
description: Wartung des AMS — PTFE-Schläuche, Filamentweg und Feuchtigkeitsprävention
---

# AMS-Wartung

Das AMS (Automatic Material System) ist ein Präzisionssystem, das regelmäßige Wartung erfordert, um zuverlässig zu funktionieren. Die häufigsten Probleme sind ein verschmutzter Filamentweg und Feuchtigkeit im Gehäuse.

## PTFE-Schläuche

Die PTFE-Schläuche transportieren das Filament vom AMS zum Drucker. Sie gehören zu den ersten Teilen, die verschleißen.

### Inspektion
PTFE-Schläuche auf Folgendes prüfen:
- **Knicke oder Biegungen** — behindern den Filamentfluss
- **Verschleiß an Verbindungen** — weißer Staub rund um die Eingänge
- **Formverformung** — besonders bei Verwendung von CF-Materialien

### PTFE-Schläuche wechseln
1. Filament aus dem AMS freigeben (Entlastungszyklus durchführen)
2. Den blauen Verriegelungsring rund um den Schlauch an der Verbindung eindrücken
3. Schlauch herausziehen (erfordert festen Griff)
4. Neuen Schlauch auf die richtige Länge zuschneiden (nicht kürzer als Original)
5. Einführen bis zum Anschlag und verriegeln

:::tip AMS Lite vs. AMS
AMS Lite (A1/A1 Mini) hat eine einfachere PTFE-Konfiguration als das volle AMS (P1S/X1C). Die Schläuche sind kürzer und leichter zu wechseln.
:::

## Filamentweg

### Reinigung des Filamentwegs
Filamente hinterlassen Staub und Rückstände im Filamentweg, besonders CF-Materialien:

1. Alle Schächte entlasten
2. Druckluft oder einen weichen Pinsel verwenden, um losen Staub herauszublasen
3. Ein sauberes Stück Nylon oder PTFE-Reinigungsfilament durch den Weg führen

### Sensoren
Das AMS verwendet Sensoren zur Erkennung der Filamentposition und von Filamentbrüchen. Sensorlinsen sauber halten:
- Sensorlinsen vorsichtig mit einem sauberen Pinsel abwischen
- Kein IPA direkt auf Sensoren auftragen

## Feuchtigkeit

Das AMS schützt Filament nicht vor Feuchtigkeit. Für hygroskopische Materialien (PA, PETG, TPU) wird Folgendes empfohlen:

### Trockene AMS-Alternativen
- **Versiegelte Box:** Spulen in eine luftdichte Box mit Silicagel legen
- **Bambu Dry Box:** Offizielles Trockner-Zubehör
- **Externer Feeder:** Filament-Feeder außerhalb des AMS für empfindliche Materialien verwenden

### Feuchtigkeitsindikatoren
Feuchtigkeitsindikator-Karten (Hygrometer) in das AMS-Gehäuse legen. Silicagel-Beutel bei über 30% relativer Luftfeuchtigkeit wechseln.

## Antriebsräder und Klemmechanismus

### Inspektion
Antriebsräder (Extruderräder im AMS) auf Folgendes prüfen:
- Filamentrickstände zwischen Zähnen
- Zahnradverschleiß
- Ungleichmäßige Reibung beim manuellen Ziehen

### Reinigung
1. Zahnbürste oder Bürste verwenden, um Rückstände zwischen Antriebsradzähnen zu entfernen
2. Mit Druckluft ausblasen
3. Öl und Schmiermittel vermeiden — das Zugverhalten ist für trockenen Betrieb kalibriert

## Wartungsintervalle

| Aktivität | Intervall |
|-----------|---------|
| Sichtprüfung PTFE-Schläuche | Monatlich |
| Reinigung Filamentweg | Alle 100 Stunden |
| Sensorprüfung | Monatlich |
| Silicagel wechseln (Trockenaufbau) | Nach Bedarf (bei 30%+ rF) |
| PTFE-Schläuche wechseln | Bei sichtbarem Verschleiß |
