---
sidebar_position: 4
title: Thema
description: Passen Sie das Erscheinungsbild von 3DPrintForge mit Hell-/Dunkel-/Auto-Modus, 6 Farbpaletten und einer benutzerdefinierten Akzentfarbe an
---

# Thema

3DPrintForge verfügt über ein flexibles Themasystem, mit dem Sie das Erscheinungsbild nach Ihrem Geschmack und Verwendungszweck anpassen können.

Navigieren Sie zu: **https://localhost:3443/#settings** → **Thema**

## Farbmodus

Wählen Sie zwischen drei Modi:

| Modus | Beschreibung |
|---|---|
| **Hell** | Heller Hintergrund, dunkler Text — gut in gut beleuchteten Räumen |
| **Dunkel** | Dunkler Hintergrund, heller Text — Standard und empfohlen für die Überwachung |
| **Auto** | Folgt der Betriebssystemeinstellung (OS-dunkel/hell) |

Modus oben in den Themaeinstellungen ändern oder über die Schnelltaste in der Navigationsleiste (Mond/Sonne-Symbol).

## Farbpaletten

Sechs voreingestellte Farbpaletten sind verfügbar:

| Palette | Primärfarbe | Stil |
|---|---|---|
| **Bambu** | Grün (#00C853) | Standard, inspiriert von Bambu Lab |
| **Blaue Nacht** | Blau (#2196F3) | Ruhig und professionell |
| **Sonnenuntergang** | Orange (#FF6D00) | Warm und energetisch |
| **Lila** | Lila (#9C27B0) | Kreativ und markant |
| **Rot** | Rot (#F44336) | Hoher Kontrast, auffällig |
| **Monochrom** | Grau (#607D8B) | Neutral und minimalistisch |

Klicken Sie auf eine Palette, um sie sofort in der Vorschau anzuzeigen und zu aktivieren.

## Benutzerdefinierte Akzentfarbe

Verwenden Sie Ihre ganz eigene Farbe als Akzentfarbe:

1. Klicken Sie auf **Benutzerdefinierte Farbe** unter dem Palettenauswähler
2. Farbauswahl verwenden oder Hex-Code eingeben (z.B. `#FF5722`)
3. Vorschau wird in Echtzeit aktualisiert
4. Klicken Sie auf **Anwenden** zum Aktivieren

:::tip Kontrast
Stellen Sie sicher, dass die Akzentfarbe einen guten Kontrast zum Hintergrund hat. Das System warnt, wenn die Farbe Lesbarkeitsprobleme verursachen könnte (WCAG AA-Standard).
:::

## Abrundung

Abrundung von Schaltflächen, Karten und Elementen anpassen:

| Einstellung | Beschreibung |
|---|---|
| **Scharf** | Keine Abrundung (rechteckiger Stil) |
| **Klein** | Subtile Abrundung (4 px) |
| **Mittel** | Standardabrundung (8 px) |
| **Groß** | Deutliche Abrundung (16 px) |
| **Pille** | Maximale Abrundung (50 px) |

Schieberegler manuell zwischen 0–50 px anpassen.

## Kompaktheit

Dichte der Benutzeroberfläche anpassen:

| Einstellung | Beschreibung |
|---|---|
| **Großzügig** | Mehr Abstand zwischen Elementen |
| **Standard** | Ausgewogen, Standardeinstellung |
| **Kompakt** | Dichtere Anordnung — mehr Informationen auf dem Bildschirm |

Der Kompaktmodus wird für Bildschirme unter 1080p oder die Kiosk-Ansicht empfohlen.

## Typografie

Schriftart auswählen:

- **System** — verwendet die Standardschrift des Betriebssystems (schnell zu laden)
- **Inter** — klar und modern (Standardauswahl)
- **JetBrains Mono** — Monospace, gut für Datenwerte
- **Nunito** — weicherer und abgerundeterer Stil

## Animationen

Animationen ausschalten oder anpassen:

- **Vollständig** — alle Übergänge und Animationen aktiv (Standard)
- **Reduziert** — nur notwendige Animationen (respektiert OS-Einstellung)
- **Aus** — keine Animationen für maximale Leistung

:::tip Kiosk-Modus
Für Kiosk-Ansicht aktivieren Sie **Kompakt** + **Dunkel** + **Reduzierte Animationen** für optimale Leistung und Lesbarkeit aus der Entfernung. Siehe [Kiosk-Modus](./kiosk).
:::

## Themaeinstellungen exportieren und importieren

Teilen Sie Ihr Thema mit anderen:

1. Klicken Sie auf **Thema exportieren** — lädt eine `.json`-Datei herunter
2. Datei mit anderen 3DPrintForge-Benutzern teilen
3. Diese importieren über **Thema importieren** → Datei auswählen
