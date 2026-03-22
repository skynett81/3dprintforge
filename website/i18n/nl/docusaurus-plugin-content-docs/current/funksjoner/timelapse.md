---
sidebar_position: 7
title: Timelapse
description: Activeer automatische timelapse-opname van 3D-prints, beheer video's en speel ze direct af in het dashboard
---

# Timelapse

Bambu Dashboard kan automatisch foto's maken tijdens het printen en deze samenvoegen tot een timelapse-video. De video's worden lokaal opgeslagen en kunnen direct in het dashboard worden afgespeeld.

Ga naar: **https://localhost:3443/#timelapse**

## Activeren

1. Ga naar **Instellingen → Timelapse**
2. Schakel **Timelapse-opname activeren** in
3. Kies de **Opnamemodus**:
   - **Per laag** — één foto per laag (aanbevolen voor hoge kwaliteit)
   - **Tijdgebaseerd** — één foto elke N seconden (bijv. elke 30 seconden)
4. Selecteer welke printers timelapse ingeschakeld moeten hebben
5. Klik op **Opslaan**

:::tip Foto-interval
"Per laag" geeft de meest gelijkmatige animatie omdat de beweging consistent is. "Tijdgebaseerd" gebruikt minder opslagruimte.
:::

## Opname-instellingen

| Instelling | Standaardwaarde | Beschrijving |
|---|---|---|
| Resolutie | 1280×720 | Afbeeldingsgrootte (640×480 / 1280×720 / 1920×1080) |
| Beeldkwaliteit | 85 % | JPEG-compressiekwaliteit |
| FPS in video | 30 | Frames per seconde in de eindvideo |
| Videoformaat | MP4 (H.264) | Uitvoerformaat |
| Afbeelding roteren | Uit | Roteren 90°/180°/270° voor montagepositie |

:::warning Opslagruimte
Een timelapse met 500 foto's in 1080p gebruikt circa 200–400 MB vóór het samenvoegen. De eindvideo in MP4 is doorgaans 20–80 MB.
:::

## Opslag

Timelapse-foto's en video's worden opgeslagen in `data/timelapse/` onder de projectmap. De structuur is georganiseerd per printer en print:

```
data/timelapse/
├── <printer-id>/                     ← Unieke printer-ID
│   ├── 2026-03-22_modelnaam/         ← Printsessie (datum_modelnaam)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Ruwe foto's (verwijderd na samenvoegen)
│   ├── 2026-03-22_modelnaam.mp4      ← Eindvideo timelapse
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_telefoonstandaard.mp4
├── <printer-id-2>/                   ← Meerdere printers (bij multi-printer)
│   └── ...
```

:::tip Externe opslag
Om ruimte op de systeemschijf te besparen, kunt u de timelapse-map symlinken naar een externe schijf:
```bash
# Voorbeeld: verplaatsen naar een externe schijf gekoppeld op /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Symlink terugmaken
ln -s /mnt/storage/timelapse data/timelapse
```
Het dashboard volgt de symlink automatisch. U kunt elke schijf of netwerkaandeel gebruiken.
:::

## Automatisch samenvoegen

Wanneer de print klaar is, worden de foto's automatisch samengevoegd tot een video met ffmpeg:

1. Bambu Dashboard ontvangt de "print complete"-gebeurtenis van MQTT
2. ffmpeg wordt aangeroepen met de verzamelde foto's
3. De video wordt opgeslagen in de opslagmap
4. De timelapse-pagina wordt bijgewerkt met de nieuwe video

U kunt de voortgang bekijken via het tabblad **Timelapse → Verwerken**.

## Afspelen

1. Ga naar **https://localhost:3443/#timelapse**
2. Selecteer een printer in de vervolgkeuzelijst
3. Klik op een video in de lijst om deze af te spelen
4. Gebruik de afspeelbesturingselementen:
   - ▶ / ⏸ — Afspelen / Pauzeren
   - ⏪ / ⏩ — Terugspoelen / vooruitspoelen
   - Snelheidsknopen: 0,5× / 1× / 2× / 4×
5. Klik op **Volledig scherm** om op volledig scherm te openen
6. Klik op **Downloaden** om het MP4-bestand te downloaden

## Timelapse verwijderen

1. Selecteer de video in de lijst
2. Klik op **Verwijderen** (prullenbak-pictogram)
3. Bevestig in het dialoogvenster

:::danger Permanent verwijderen
Verwijderde timelapse-video's en ruwe foto's kunnen niet worden hersteld. Download de video eerst als u deze wilt bewaren.
:::

## Timelapse delen

Timelapse-video's kunnen worden gedeeld via een tijdbeperkte link:

1. Selecteer de video en klik op **Delen**
2. Stel de vervaltijd in (1 uur / 24 uur / 7 dagen / geen vervaldatum)
3. Kopieer de gegenereerde link en deel deze
4. De ontvanger hoeft niet in te loggen om de video te bekijken
