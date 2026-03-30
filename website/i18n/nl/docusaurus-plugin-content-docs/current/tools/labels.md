---
sidebar_position: 1
title: Etiketten
description: QR-codes, spoeletiketten voor thermische printers (ZPL), kleurenkaarten en gedeelde kleurpaletten genereren voor de filamentopslag
---

# Etiketten

Het etikettengereedschap genereert professionele etiketten voor uw filamentspoelen — QR-codes, spoeletiketten voor thermische printers en kleurenkaarten voor visuele identificatie.

Ga naar: **https://localhost:3443/#labels**

## QR-codes

Genereer QR-codes die verwijzen naar filamentinformatie in het dashboard:

1. Ga naar **Etiketten → QR-codes**
2. Kies de spoel waarvoor u een QR-code wilt genereren
3. De QR-code wordt automatisch gegenereerd en weergegeven in de voorvertoning
4. Klik **PNG downloaden** of **Afdrukken**

De QR-code bevat een URL naar het filamentprofiel in het dashboard. Scan met uw mobiel om snel spoelinformatie op te halen.

### Batchgeneratie

1. Klik **Alles selecteren** of vink afzonderlijke spoelen aan
2. Klik **Alle QR-codes genereren**
3. Download als ZIP met één PNG per spoel, of druk alles tegelijk af

## Spoeletiketten

Professionele etiketten voor thermische printers met volledige spoelinformatie:

### Etiketinhoud (standaard)

- Spoelkleur (gevulde kleurblok)
- Materiaaltype (groot lettertype)
- Leverancier
- Kleur hex-code
- Temperatuuraanbevelingen (spuit en bed)
- QR-code
- Streepjescode (optioneel)

### ZPL voor thermische printers

Genereer ZPL-code (Zebra Programming Language) voor Zebra, Brother en Dymo-printers:

1. Ga naar **Etiketten → Thermisch afdrukken**
2. Kies etiketformaat: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Kies de spoel(en)
4. Klik **ZPL genereren**
5. Stuur de ZPL-code naar de printer via:
   - **Direct afdrukken** (USB-verbinding)
   - **ZPL kopiëren** en verzenden via terminalopdracht
   - **ZPL-bestand downloaden**

:::tip Printerinstelling
Voor automatisch afdrukken, configureer het afdrukstation via **Instellingen → Etiketprinter** met IP-adres en poort (standaard: 9100 voor RAW TCP).
:::

### PDF-etiketten

Voor gewone printers, genereer PDF met juiste afmetingen:

1. Kies etiketformaat uit de sjabloon
2. Klik **PDF genereren**
3. Druk af op zelfklevend papier (Avery of vergelijkbaar)

## Kleurenkaarten

Kleurenkaarten zijn een compact raster dat alle spoelen visueel weergeeft:

1. Ga naar **Etiketten → Kleurenkaarten**
2. Kies welke spoelen moeten worden opgenomen (alle actieve, of handmatig selecteren)
3. Kies kaartformaat: **A4** (4×8), **A3** (6×10), **Letter**
4. Klik **PDF genereren**

Elk vak toont:
- Kleurblok met de werkelijke kleur
- Materiaalnaam en kleur-hex
- Materiaalcode (voor snelle referentie)

Ideaal om te lamineren en op te hangen bij het printstation.

## Gedeelde kleurpaletten

Exporteer een selectie kleuren als een gedeeld palet:

1. Ga naar **Etiketten → Kleurpaletten**
2. Kies spoelen om op te nemen in het palet
3. Klik **Palet delen**
4. Kopieer de koppeling — anderen kunnen het palet importeren in hun dashboard
5. Het palet wordt weergegeven met hex-codes en kan worden geëxporteerd naar **Adobe Swatch** (`.ase`) of **Procreate** (`.swatches`)
