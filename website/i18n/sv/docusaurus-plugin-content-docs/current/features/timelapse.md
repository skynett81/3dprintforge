---
sidebar_position: 7
title: Timelapse
description: Aktivera automatisk timelapse-inspelning av 3D-utskrifter, administrera videor och spela upp dem direkt i dashboardet
---

# Timelapse

3DPrintForge kan automatiskt ta bilder under utskrift och sätta ihop dem till en timelapse-video. Videorna sparas lokalt och kan spelas upp direkt i dashboardet.

Gå till: **https://localhost:3443/#timelapse**

## Aktivering

1. Gå till **Inställningar → Timelapse**
2. Aktivera **Aktivera timelapse-inspelning**
3. Välj **Inspelningsläge**:
   - **Per lager** — en bild per lager (rekommenderas för hög kvalitet)
   - **Tidsbaserat** — en bild var N:e sekund (t.ex. var 30:e sekund)
4. Välj vilka skrivare som ska ha timelapse aktiverat
5. Klicka **Spara**

:::tip Bildintervall
«Per lager» ger jämnast animation eftersom rörelsen är konsekvent. «Tidsbaserat» använder mindre lagringsutrymme.
:::

## Inspelningsinställningar

| Inställning | Standardvärde | Beskrivning |
|---|---|---|
| Upplösning | 1280×720 | Bildstorlek (640×480 / 1280×720 / 1920×1080) |
| Bildkvalitet | 85 % | JPEG-komprimeringskvalitet |
| FPS i video | 30 | Bilder per sekund i färdig video |
| Videoformat | MP4 (H.264) | Utgående format |
| Rotera bild | Av | Rotera 90°/180°/270° för monteringsriktning |

:::warning Lagringsutrymme
En timelapse med 500 bilder i 1080p använder ca. 200–400 MB innan sammanslagning. Färdig MP4-video är typiskt 20–80 MB.
:::

## Lagring

Timelapse-bilder och videor lagras i `data/timelapse/` under projektmappen. Strukturen organiseras per skrivare och utskrift:

```
data/timelapse/
├── <skrivare-id>/                     ← Unikt skrivar-ID
│   ├── 2026-03-22_modellnamn/        ← Utskriftssession (datum_modellnamn)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Råbilder (raderas efter sammanslagning)
│   ├── 2026-03-22_modellnamn.mp4     ← Färdig timelapse-video
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_telefonhallare.mp4
├── <skrivare-id-2>/                   ← Fler skrivare (vid flerskrivar)
│   └── ...
```

:::tip Extern lagring
För att spara utrymme på systemdisken kan du symlänka timelapse-mappen till en extern disk:
```bash
# Exempel: flytta till en extern disk monterad på /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Skapa symlänk tillbaka
ln -s /mnt/storage/timelapse data/timelapse
```
Dashboardet följer symlänken automatiskt. Du kan använda vilken disk eller nätverksresurs som helst.
:::

## Automatisk sammanslagning

När utskriften är klar sätts bilderna automatiskt ihop till en video med ffmpeg:

1. 3DPrintForge tar emot «print complete»-händelse från MQTT
2. ffmpeg anropas med de insamlade bilderna
3. Videon sparas i lagringsmappen
4. Timelapse-sidan uppdateras med den nya videon

Du kan se förloppet under **Timelapse → Bearbetar**-fliken.

## Uppspelning

1. Gå till **https://localhost:3443/#timelapse**
2. Välj en skrivare från rullgardinsmenyn
3. Klicka på en video i listan för att spela upp den
4. Använd uppspelningskontrollerna:
   - ▶ / ⏸ — Spela upp / Pausa
   - ⏪ / ⏩ — Spola tillbaka / framåt
   - Hastighetsknappar: 0.5× / 1× / 2× / 4×
5. Klicka **Helskärm** för att öppna i helskärm
6. Klicka **Ladda ner** för att ladda ner MP4-filen

## Ta bort timelapse

1. Välj videon i listan
2. Klicka **Ta bort** (papperskorgsikon)
3. Bekräfta i dialogrutan

:::danger Permanent borttagning
Borttagna timelapse-videor och råbilder kan inte återställas. Ladda ner videon först om du vill behålla den.
:::

## Dela timelapse

Timelapse-videor kan delas via en tidsbegränsad länk:

1. Välj videon och klicka **Dela**
2. Ange utgångstid (1 timme / 24 timmar / 7 dagar / ingen utgångstid)
3. Kopiera den genererade länken och dela den
4. Mottagaren behöver inte logga in för att se videon
