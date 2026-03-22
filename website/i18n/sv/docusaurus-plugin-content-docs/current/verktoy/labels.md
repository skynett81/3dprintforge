---
sidebar_position: 1
title: Etiketter
description: Generera QR-koder, spoletiketter för termiska skrivare (ZPL), färgkort och delade färgpaletter för filamentlagret
---

# Etiketter

Etikettyerktyget genererar professionella etiketter för dina filamentspolar — QR-koder, spoletiketter för termiska skrivare och färgkort för visuell identifiering.

Gå till: **https://localhost:3443/#labels**

## QR-koder

Generera QR-koder som kopplar till filamentinformation i dashboardet:

1. Gå till **Etiketter → QR-koder**
2. Välj spolen du vill generera QR-kod för
3. QR-koden genereras automatiskt och visas i förhandsgranskningen
4. Klicka **Ladda ner PNG** eller **Skriv ut**

QR-koden innehåller en URL till filamentprofilen i dashboardet. Skanna med mobilen för att snabbt hämta spolens information.

### Batchgenerering

1. Klicka **Välj alla** eller bocka av enskilda spolar
2. Klicka **Generera alla QR-koder**
3. Ladda ner som ZIP med en PNG per spole, eller skriv ut alla på en gång

## Spoletiketter

Professionella etiketter för termiska skrivare med fullständig spolinformation:

### Etikettsinnehåll (standard)

- Spolfärg (fyllt färgblock)
- Materialnamn (stor text)
- Leverantör
- Färg-hex-kod
- Temperaturrekommendationer (munstycke och bädd)
- QR-kod
- Streckkod (valfritt)

### ZPL för termiska skrivare

Generera ZPL-kod (Zebra Programming Language) för Zebra, Brother och Dymo-skrivare:

1. Gå till **Etiketter → Termisk utskrift**
2. Välj etikettstorlek: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Välj spolen(ar)
4. Klicka **Generera ZPL**
5. Skicka ZPL-koden till skrivaren via:
   - **Skriv ut direkt** (USB-anslutning)
   - **Kopiera ZPL** och skicka via terminalkommando
   - **Ladda ner .zpl-fil**

:::tip Skrivarinställning
För automatisk utskrift, konfigurera skrivarstationen under **Inställningar → Etikett-skrivare** med IP-adress och port (standard: 9100 för RAW TCP).
:::

### PDF-etiketter

För vanliga skrivare, generera PDF med rätt dimensioner:

1. Välj etikettstorlek från mallen
2. Klicka **Generera PDF**
3. Skriv ut på självhäftande papper (Avery eller likvärdigt)

## Färgkort

Färgkort är ett kompakt rutnät som visar alla spolar visuellt:

1. Gå till **Etiketter → Färgkort**
2. Välj vilka spolar som ska inkluderas (alla aktiva, eller välj manuellt)
3. Välj kortformat: **A4** (4×8), **A3** (6×10), **Letter**
4. Klicka **Generera PDF**

Varje fält visar:
- Färgblock med faktisk färg
- Materialnamn och färg-hex
- Materialnummer (för snabb referens)

Idealiskt att laminera och hänga vid skrivarstationen.

## Delade färgpaletter

Exportera ett urval färger som en delad palett:

1. Gå till **Etiketter → Färgpaletter**
2. Välj spolar att inkludera i paletten
3. Klicka **Dela palett**
4. Kopiera länken — andra kan importera paletten till sitt dashboard
5. Paletten visas med hex-koder och kan exporteras till **Adobe Swatch** (`.ase`) eller **Procreate** (`.swatches`)
