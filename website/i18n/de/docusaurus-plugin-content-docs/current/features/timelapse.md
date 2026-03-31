---
sidebar_position: 7
title: Timelapse
description: Aktivieren Sie automatische Timelapse-Aufnahmen von 3D-Drucken, verwalten Sie Videos und spielen Sie diese direkt im Dashboard ab
---

# Timelapse

3DPrintForge kann automatisch Bilder während des Druckens aufnehmen und zu einem Timelapse-Video zusammenstellen. Die Videos werden lokal gespeichert und können direkt im Dashboard abgespielt werden.

Navigieren Sie zu: **https://localhost:3443/#timelapse**

## Aktivierung

1. Gehen Sie zu **Einstellungen → Timelapse**
2. Aktivieren Sie **Timelapse-Aufnahme aktivieren**
3. Wählen Sie den **Aufnahmemodus**:
   - **Pro Lage** — ein Bild pro Lage (empfohlen für hohe Qualität)
   - **Zeitbasiert** — ein Bild alle N Sekunden (z.B. alle 30 Sekunden)
4. Wählen Sie, für welche Drucker Timelapse aktiviert werden soll
5. Klicken Sie auf **Speichern**

:::tip Bildintervall
„Pro Lage" liefert die gleichmäßigste Animation, da die Bewegung konsistent ist. „Zeitbasiert" verbraucht weniger Speicherplatz.
:::

## Aufnahmeeinstellungen

| Einstellung | Standardwert | Beschreibung |
|---|---|---|
| Auflösung | 1280×720 | Bildgröße (640×480 / 1280×720 / 1920×1080) |
| Bildqualität | 85 % | JPEG-Komprimierungsqualität |
| FPS im Video | 30 | Bilder pro Sekunde im fertigen Video |
| Videoformat | MP4 (H.264) | Ausgabeformat |
| Bild drehen | Aus | Um 90°/180°/270° drehen für Montagerichtung |

:::warning Speicherplatz
Ein Timelapse mit 500 Bildern in 1080p belegt ca. 200–400 MB vor dem Zusammenfügen. Das fertige MP4-Video ist typischerweise 20–80 MB.
:::

## Speicherung

Timelapse-Bilder und -Videos werden unter `data/timelapse/` im Projektordner gespeichert. Die Struktur ist nach Drucker und Druck organisiert:

```
data/timelapse/
├── <drucker-id>/                     ← Eindeutige Drucker-ID
│   ├── 2026-03-22_modellname/        ← Drucksitzung (datum_modellname)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Rohbilder (nach Zusammenfügen gelöscht)
│   ├── 2026-03-22_modellname.mp4     ← Fertiges Timelapse-Video
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_telefonständer.mp4
├── <drucker-id-2>/                   ← Weitere Drucker (bei Multidrucker)
│   └── ...
```

:::tip Externer Speicher
Um Speicherplatz auf der Systemfestplatte zu sparen, können Sie den Timelapse-Ordner mit einer externen Festplatte verlinken:
```bash
# Beispiel: auf eine externe Festplatte unter /mnt/storage verschieben
mv data/timelapse /mnt/storage/timelapse

# Symlink zurück erstellen
ln -s /mnt/storage/timelapse data/timelapse
```
Das Dashboard folgt dem Symlink automatisch. Sie können jede Festplatte oder Netzwerkfreigabe verwenden.
:::

## Automatisches Zusammenfügen

Wenn der Druck fertig ist, werden die Bilder automatisch mit ffmpeg zu einem Video zusammengefügt:

1. 3DPrintForge empfängt das „print complete"-Ereignis von MQTT
2. ffmpeg wird mit den gesammelten Bildern aufgerufen
3. Das Video wird im Speicherordner gespeichert
4. Die Timelapse-Seite wird mit dem neuen Video aktualisiert

Sie können den Fortschritt unter **Timelapse → Wird verarbeitet** einsehen.

## Wiedergabe

1. Gehen Sie zu **https://localhost:3443/#timelapse**
2. Wählen Sie einen Drucker aus der Dropdown-Liste
3. Klicken Sie auf ein Video in der Liste, um es abzuspielen
4. Verwenden Sie die Wiedergabesteuerung:
   - ▶ / ⏸ — Abspielen / Pause
   - ⏪ / ⏩ — Zurückspulen / Vorspulen
   - Geschwindigkeitsschaltflächen: 0,5× / 1× / 2× / 4×
5. Klicken Sie auf **Vollbild**, um im Vollbildmodus zu öffnen
6. Klicken Sie auf **Herunterladen**, um die MP4-Datei herunterzuladen

## Timelapse löschen

1. Wählen Sie das Video in der Liste
2. Klicken Sie auf **Löschen** (Papierkorb-Symbol)
3. Bestätigen Sie im Dialogfeld

:::danger Permanentes Löschen
Gelöschte Timelapse-Videos und Rohbilder können nicht wiederhergestellt werden. Laden Sie das Video zuerst herunter, wenn Sie es behalten möchten.
:::

## Timelapse teilen

Timelapse-Videos können über einen zeitlich begrenzten Link geteilt werden:

1. Wählen Sie das Video aus und klicken Sie auf **Teilen**
2. Setzen Sie die Ablaufzeit (1 Stunde / 24 Stunden / 7 Tage / kein Ablauf)
3. Kopieren Sie den generierten Link und teilen Sie ihn
4. Der Empfänger muss sich nicht anmelden, um das Video anzusehen
