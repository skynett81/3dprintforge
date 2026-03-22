---
sidebar_position: 5
title: E-handel
description: Hantera beställningar, kunder och fakturering för försäljning av 3D-utskrifter — kräver licens från geektech.no
---

# E-handel

E-handelsmodulen ger dig ett komplett system för att hantera kunder, beställningar och fakturering — perfekt för dem som säljer 3D-utskrifter professionellt eller semi-professionellt.

Gå till: **https://localhost:3443/#orders**

:::danger E-handelslicens krävs
E-handelsmodulen kräver en giltig licens. Licenser kan **endast köpas via [geektech.no](https://geektech.no)**. Utan aktiv licens är modulen låst och otillgänglig.
:::

## Licens — köp och aktivering

### Köpa licens

1. Gå till **[geektech.no](https://geektech.no)** och skapa ett konto
2. Välj **Bambu Dashboard — E-handelslicens**
3. Välj licenstyp:

| Licenstyp | Beskrivning | Skrivare |
|---|---|---|
| **Hobby** | En skrivare, personligt bruk och småförsäljning | 1 |
| **Professionell** | Upp till 5 skrivare, kommersiell användning | 1–5 |
| **Enterprise** | Obegränsat antal skrivare, fullständigt stöd | Obegränsat |

4. Slutför betalning
5. Du får en **licensnyckel** via e-post

### Aktivera licens

1. Gå till **Inställningar → E-handel** i dashboardet
2. Klistra in **licensnyckeln** i fältet
3. Klicka **Aktivera licens**
4. Dashboardet autentiserar nyckeln mot geektech.no:s servrar
5. Vid lyckad aktivering visas licenstyp, utgångsdatum och antal skrivare

:::warning Licensnyckeln är kopplad till din installation
Nyckeln aktiveras för en Bambu Dashboard-installation. Kontakta [geektech.no](https://geektech.no) om du behöver flytta licensen till en ny server.
:::

### Licensvalidering

- Licensen **valideras online** vid uppstart och sedan var 24:e timme
- Vid nätverksavbrott fungerar licensen i upp till **7 dagar offline**
- Utgången licens → modulen låses, men befintlig data behålls
- Förnyelse sker via **[geektech.no](https://geektech.no)** → Mina licenser → Förnya

### Kontrollera licensstatus

Gå till **Inställningar → E-handel** eller anropa API:et:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

Svaret innehåller:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Företagsnamn AB",
  "provider": "geektech.no"
}
```

## Kunder

### Skapa en kund

1. Gå till **E-handel → Kunder**
2. Klicka **Ny kund**
3. Fyll i:
   - **Namn / Företagsnamn**
   - **Kontaktperson** (för företag)
   - **E-postadress**
   - **Telefon**
   - **Adress** (faktureringsadress)
   - **Org.nr / Personnummer** (valfritt, för momsregistrerade)
   - **Anteckning** — intern notering
4. Klicka **Skapa**

### Kundöversikt

Kundlistan visar:
- Namn och kontaktinformation
- Totalt antal beställningar
- Total omsättning
- Senaste beställningsdatum
- Status (Aktiv / Inaktiv)

Klicka på en kund för att se all beställnings- och faktureringshistorik.

## Orderhantering

### Skapa en beställning

1. Gå till **E-handel → Beställningar**
2. Klicka **Ny beställning**
3. Välj **Kund** från listan
4. Lägg till orderrader:
   - Välj fil/modell från filbiblioteket, eller lägg till en fritextpost
   - Ange antal och enhetspris
   - Systemet beräknar kostnad automatiskt om det kopplas till ett projekt
5. Ange **Leveransdatum** (uppskattad)
6. Klicka **Skapa beställning**

### Beställningsstatus

| Status | Beskrivning |
|---|---|
| Förfrågan | Mottagen förfrågan, ej bekräftad |
| Bekräftad | Kunden har bekräftat |
| Under produktion | Utskrifter pågår |
| Redo för leverans | Klar, väntar på avhämtning/sändning |
| Levererad | Beställning slutförd |
| Avbruten | Avbruten av kund eller dig |

Uppdatera status genom att klicka på beställningen → **Ändra status**.

### Koppla utskrifter till beställning

1. Öppna beställningen
2. Klicka **Koppla utskrift**
3. Välj utskrifter från historiken (flerval stöds)
4. Kostnadsdata hämtas automatiskt från utskriftshistorik

## Fakturering

Se [Projekt → Fakturering](../funksjoner/projects#fakturering) för detaljerad faktureringsdokumentation.

Faktura kan genereras direkt från en beställning:

1. Öppna beställningen
2. Klicka **Generera faktura**
3. Kontrollera belopp och moms
4. Ladda ner PDF eller skicka till kundens e-post

### Fakturanummerserie

Ställ in fakturanummerserie under **Inställningar → E-handel**:
- **Prefix**: t.ex. `2026-`
- **Startnummer**: t.ex. `1001`
- Fakturanummer tilldelas automatiskt i stigande ordning

## Rapportering och avgifter

### Avgiftsrapportering

Systemet spårar alla transaktionsavgifter:
- Se avgifter under **E-handel → Avgifter**
- Markera avgifter som rapporterade för bokföringssyften
- Exportera avgiftssammanfattning per period

### Statistik

Under **E-handel → Statistik**:
- Månadsvis omsättning (stapeldiagram)
- Toppkunder efter omsättning
- Mest sålda modeller/material
- Genomsnittlig beställningsstorlek

Exportera till CSV för bokföringssystem.

## Support och kontakt

:::info Behöver du hjälp?
- **Licensfrågor**: kontakta [geektech.no](https://geektech.no) support
- **Tekniska problem**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Funktionsönskemål**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
