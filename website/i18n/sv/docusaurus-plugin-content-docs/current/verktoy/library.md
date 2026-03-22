---
sidebar_position: 2
title: Filbibliotek
description: Ladda upp och hantera 3D-modeller och G-kodfiler, analysera G-kod och koppla till MakerWorld och Printables
---

# Filbibliotek

Filbiblioteket är en central plats för att lagra och hantera alla dina 3D-modeller och G-kodfiler — med automatisk G-kodanalys och integration mot MakerWorld och Printables.

Gå till: **https://localhost:3443/#library**

## Ladda upp modeller

### Enkel uppladdning

1. Gå till **Filbibliotek**
2. Klicka **Ladda upp** eller dra filer till uppladdningsområdet
3. Format som stöds: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Filen analyseras automatiskt efter uppladdning

:::info Lagringsmapp
Filer lagras i mappen som konfigurerats under **Inställningar → Filbibliotek → Lagringsmapp**. Standard: `./data/library/`
:::

### Batch-uppladdning

Dra och släpp en hel mapp för att ladda upp alla filer som stöds på en gång. Filerna behandlas i bakgrunden och du aviseras när allt är klart.

## G-kodanalys

Efter uppladdning analyseras `.gcode`- och `.bgcode`-filer automatiskt:

| Mätvärde | Beskrivning |
|---|---|
| Beräknad utskriftstid | Tid beräknad från G-kodkommandon |
| Filamentförbrukning | Gram och meter per material/färg |
| Lagräknare | Totalt antal lager |
| Lagertjocklek | Registrerad lagertjocklek |
| Material | Identifierade material (PLA, PETG, osv.) |
| Infill-procent | Om tillgängligt i metadata |
| Stödmaterial | Uppskattad stödvikt |
| Skrivarmodell | Målskrivare från metadata |

Analysdata visas i filkortet och används av [Kostnadskalkylatorn](../analyse/costestimator).

## Filkort och metadata

Varje filkort visar:
- **Filnamn** och format
- **Uppladdningsdatum**
- **Miniatyrbild** (från `.3mf` eller genererad)
- **Analyserad utskriftstid** och filamentförbrukning
- **Taggar** och kategori
- **Kopplade utskrifter** — antal gånger utskrivet

Klicka på ett kort för att öppna detaljvy med fullständig metadata och historik.

## Organisering

### Taggar

Lägg till taggar för enkel sökning:
1. Klicka på filen → **Redigera metadata**
2. Skriv in taggar (kommaseparerade): `benchy, test, PLA, kalibrering`
3. Sök i biblioteket med taggfilter

### Kategorier

Organisera filer i kategorier:
- Klicka **Ny kategori** i sidofältet
- Dra filer till kategorin
- Kategorier kan kapslas (underkategorier stöds)

## Koppling till MakerWorld

1. Gå till **Inställningar → Integrationer → MakerWorld**
2. Logga in med ditt Bambu Lab-konto
3. Tillbaka i biblioteket: klicka på en fil → **Koppla till MakerWorld**
4. Sök efter modellen på MakerWorld och välj rätt träff
5. Metadata (designer, licensiering, betyg) importeras från MakerWorld

Kopplingen visar designernamn och original-URL på filkortet.

## Koppling till Printables

1. Gå till **Inställningar → Integrationer → Printables**
2. Klistra in din Printables API-nyckel
3. Koppla filer till Printables-modeller på samma sätt som MakerWorld

## Skicka till skrivare

Från filbiblioteket kan du skicka direkt till skrivare:

1. Klicka på filen → **Skicka till skrivare**
2. Välj målskrivare
3. Välj AMS-plats (för flerfärgsutskrifter)
4. Klicka **Starta utskrift** eller **Lägg i kö**

:::warning Direktsändning
Direktsändning startar utskriften omedelbart utan bekräftelse i Bambu Studio. Se till att skrivaren är redo.
:::
