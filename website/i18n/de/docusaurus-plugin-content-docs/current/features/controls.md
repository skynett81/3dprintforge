---
sidebar_position: 5
title: Druckersteuerung
description: Steuern Sie Temperatur, Geschwindigkeit, Lüfter und senden Sie G-Code direkt an den Drucker
---

# Druckersteuerung

Das Steuerungspanel gibt Ihnen vom Dashboard aus vollständige manuelle Kontrolle über den Drucker.

## Temperatursteuerung

### Düse
- Zieltemperatur zwischen 0–350 °C eingeben
- Klicken Sie auf **Setzen**, um den Befehl zu senden
- Echtzeit-Anzeige mit animiertem Ringmesser

### Heizbett
- Zieltemperatur zwischen 0–120 °C eingeben
- Automatisches Abschalten nach Druck (konfigurierbar)

### Kammer
- Kammertemperatur anzeigen (Echtzeit-Anzeige)
- **X1E, H2S, H2D, H2C**: Aktive Kammerwärmesteuerung über M141 (steuerbare Zieltemperatur)
- **X1C**: Passive Einhausung — Kammertemperatur wird angezeigt, kann aber nicht direkt gesteuert werden
- **P1S**: Passive Einhausung — zeigt Temperatur, keine aktive Kammerwärmesteuerung
- **P1P, A1, A1 Mini und H-Serie ohne chamberHeat**: Kein Kammersensor

:::warning Maximale Temperaturen
Überschreiten Sie nicht die empfohlenen Temperaturen für Düse und Bett. Für gehärtete Stahldüse (HF-Typ): max. 300 °C. Für Messing: max. 260 °C. Siehe Druckerhandbuch.
:::

## Geschwindigkeitsprofile

Die Geschwindigkeitssteuerung bietet vier voreingestellte Profile:

| Profil | Geschwindigkeit | Verwendungszweck |
|--------|----------|-------------|
| Leise | 50 % | Geräuschreduktion, Nachtdruck |
| Standard | 100 % | Normaler Betrieb |
| Sport | 124 % | Schnellere Drucke |
| Turbo | 166 % | Maximale Geschwindigkeit (Qualitätsverlust) |

Der Schieberegler ermöglicht eine benutzerdefinierte Prozentzahl zwischen 50–200 %.

## Lüftersteuerung

Lüftergeschwindigkeiten manuell steuern:

| Lüfter | Beschreibung | Bereich |
|-------|-------------|--------|
| Part Cooling Fan | Kühlt das gedruckte Objekt | 0–100 % |
| Auxiliary Fan | Kammerzirkulation | 0–100 % |
| Chamber Fan | Aktive Kammerkühlung | 0–100 % |

:::tip Gute Einstellungen
- **PLA/PETG:** Teilekühlung 100 %, Aux 30 %
- **ABS/ASA:** Teilekühlung 0–20 %, Kammerlüfter aus
- **TPU:** Teilekühlung 50 %, niedrige Geschwindigkeit
:::

## G-Code-Konsole

G-Code-Befehle direkt an den Drucker senden:

```gcode
; Beispiel: Kopfposition bewegen
G28 ; Alle Achsen referenzfahren
G1 X150 Y150 Z10 F3000 ; Zur Mitte bewegen
M104 S220 ; Düsentemperatur setzen
M140 S60  ; Betttemperatur setzen
```

:::danger Vorsicht mit G-Code
Falscher G-Code kann den Drucker beschädigen. Senden Sie nur Befehle, die Sie verstehen. Vermeiden Sie `M600` (Filamentwechsel) mitten in einem Druck.
:::

## Filamentoperationen

Aus dem Steuerungspanel können Sie:

- **Filament laden** — Düse aufheizen und Filament einziehen
- **Filament entladen** — Düse aufheizen und Filament herausziehen
- **Düse reinigen** — Reinigungszyklus ausführen

## Makros

Sequenzen von G-Code-Befehlen als Makros speichern und ausführen:

1. Klicken Sie auf **Neues Makro**
2. Geben Sie dem Makro einen Namen
3. G-Code-Sequenz eingeben
4. Speichern und mit einem Klick ausführen

Beispiel-Makro für Bettkalibrierung:
```gcode
G28
M84
M500
```

## Drucksteuerung

Während eines aktiven Drucks können Sie:

- **Pause** — Druck nach der aktuellen Lage pausieren
- **Fortsetzen** — Pausierten Druck fortsetzen
- **Stopp** — Druck abbrechen (nicht rückgängig zu machen)
- **Notaus** — Sofortiger Stopp aller Motoren
