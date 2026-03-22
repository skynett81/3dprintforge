---
sidebar_position: 5
title: E-handel
description: Administrer ordrer, kunder og fakturering for salg av 3D-prints — krever lisens fra geektech.no
---

# E-handel

E-handelmodulen gir deg et komplett system for å administrere kunder, ordrer og fakturering — perfekt for de som selger 3D-prints profesjonelt eller semi-profesjonelt.

Gå til: **https://localhost:3443/#orders**

:::danger E-handelslisens påkrevd
E-handelmodulen krever en gyldig lisens. Lisenser kan **kun kjøpes via [geektech.no](https://geektech.no)**. Uten aktiv lisens er modulen låst og utilgjengelig.
:::

## Lisens — kjøp og aktivering

### Kjøpe lisens

1. Gå til **[geektech.no](https://geektech.no)** og opprett en konto
2. Velg **Bambu Dashboard — E-handelslisens**
3. Velg lisenstype:

| Lisenstype | Beskrivelse | Printere |
|---|---|---|
| **Hobby** | Én printer, personlig bruk og småsalg | 1 |
| **Profesjonell** | Opptil 5 printere, kommersiell bruk | 1–5 |
| **Enterprise** | Ubegrenset antall printere, full støtte | Ubegrenset |

4. Fullfør betaling
5. Du mottar en **lisensnøkkel** på e-post

### Aktivere lisens

1. Gå til **Innstillinger → E-handel** i dashboardet
2. Fyll inn følgende felt:

| Felt | Beskrivelse | Påkrevd |
|------|-------------|---------|
| **Lisensnøkkel** | 32-tegn hex nøkkel fra geektech.no | ✅ Ja |
| **E-postadresse** | E-posten du brukte ved kjøp | ✅ Ja |
| **Domene** | Domenet dashboardet kjører på (uten https://) | Anbefalt |
| **Telefon** | Kontakttelefon (med landkode, f.eks. +47) | Valgfritt |

### Lisenstype — identifikatorbinding

geektech.no binder lisensen til én eller flere identifikatorer:

| Type | Validerer mot | Bruksområde |
|------|---------------|-------------|
| **Domene** | Domenenavn (f.eks. `dashboard.firma.no`) | Fast server med eget domene |
| **IP** | Public IP-adresse(r) | Server uten domene, fast IP |
| **MAC** | MAC-adresse(r) på nettverkskortet | Maskinvare-binding |
| **IP + MAC** | Både IP og MAC må matche | Høyeste sikkerhet |

:::info Automatisk identifikasjon
Dashboardet sender automatisk serverens IP-adresse og MAC-adresse ved hver validering. Du trenger ikke fylle inn disse manuelt — geektech.no registrerer dem ved første aktivering.
:::

Flere IP-adresser og MAC-adresser kan tillates (én per linje i geektech.no admin). Dette er nyttig for servere med flere nettverkskort eller dynamisk IP.

3. Klikk **Aktiver lisens**
4. Dashboardet sender aktiveringsforespørsel til geektech.no
5. Ved vellykket aktivering vises:
   - **Lisenstype** (Hobby / Profesjonell / Enterprise)
   - **Utløpsdato**
   - **Maks antall printere**
   - **Lisensinnehaver**
   - **Instans-ID** (unik for din installasjon)

:::warning Lisensnøkkelen er knyttet til domene og installasjon
Nøkkelen aktiveres for én spesifikk Bambu Dashboard-installasjon og domene. Kontakt [geektech.no](https://geektech.no) support hvis du trenger å:
- Flytte lisensen til en ny server
- Endre domene
- Øke antall printere
:::

### Lisensvalidering

Lisensen autentiseres og samkjøres med geektech.no:

- **Validering ved oppstart** — lisensen sjekkes automatisk
- **Løpende validering** — revalideres hver 24. time mot geektech.no
- **Offline-modus** — ved nettverksutfall fungerer lisensen i opptil **7 dager** med cached validering
- **Utløpt lisens** → modulen låses, men eksisterende data (ordrer, kunder) beholdes
- **PIN-kode** — geektech.no kan låse/frigjøre lisensen via PIN-systemet
- **Fornyelse** — via **[geektech.no](https://geektech.no)** → Mine lisenser → Forny

### Lisenstyper og begrensninger

| Plan | Printere | Plattformer | Gebyr | Pris |
|------|----------|-------------|-------|------|
| **Hobby** | 1 | 1 (Shopify ELLER WooCommerce) | 5% | Se geektech.no |
| **Profesjonell** | 1–5 | Alle | 5% | Se geektech.no |
| **Enterprise** | Ubegrenset | Alle + API | 3% | Se geektech.no |

### Sjekke lisensstatus

Gå til **Innstillinger → E-handel** eller kall API-et:

```bash
curl -sk https://localhost:3443/api/ecommerce/license
```

Svaret inneholder:
```json
{
  "active": true,
  "status": "active",
  "plan": "professional",
  "holder": "Firmanavn AS",
  "email": "firma@eksempel.no",
  "domain": "dashboard.firmanavn.no",
  "max_printers": 5,
  "expires_at": "2027-03-22",
  "provider": "geektech.no",
  "fees_pending": 2,
  "fees_this_month": 450.00,
  "orders_this_month": 12
}
```

## Kunder

### Opprette en kunde

1. Gå til **E-handel → Kunder**
2. Klikk **Ny kunde**
3. Fyll inn:
   - **Navn / Firmanavn**
   - **Kontaktperson** (for bedrifter)
   - **E-postadresse**
   - **Telefon**
   - **Adresse** (faktureringsadresse)
   - **Org.nr / Personnummer** (valgfritt, for MVA-registrerte)
   - **Notat** — intern merknad
4. Klikk **Opprett**

### Kundeoversikt

Kundelisten viser:
- Navn og kontaktinfo
- Totalt antall ordrer
- Total omsetning
- Siste ordredato
- Status (Aktiv / Inaktiv)

Klikk på en kunde for å se all ordre- og fakturering-historikk.

## Ordrehåndtering

### Opprette en ordre

1. Gå til **E-handel → Ordrer**
2. Klikk **Ny ordre**
3. Velg **Kunde** fra listen
4. Legg til ordrelinjer:
   - Velg fil/modell fra filbiblioteket, eller legg til fritekst-post
   - Angi antall og enhetspris
   - System beregner kostnad automatisk hvis kobles til prosjekt
5. Angi **Leveringsdato** (estimert)
6. Klikk **Opprett ordre**

### Ordrestatus

| Status | Beskrivelse |
|---|---|
| Forespørsel | Mottatt forespørsel, ikke bekreftet |
| Bekreftet | Kunden har bekreftet |
| Under produksjon | Prints pågår |
| Klar til levering | Ferdig, venter på henting/sending |
| Levert | Ordre fullført |
| Avbrutt | Kansellert av kunde eller deg |

Oppdater status ved å klikke på ordren → **Endre status**.

### Koble prints til ordre

1. Åpne ordren
2. Klikk **Koble print**
3. Velg prints fra historikken (flervalg støttes)
4. Kostnadsdata hentes automatisk fra printhistorikk

## Fakturering

Se [Prosjekter → Fakturering](../funksjoner/projects#fakturering) for detaljert faktureringsdokumentasjon.

Faktura kan genereres direkte fra en ordre:

1. Åpne ordren
2. Klikk **Generer faktura**
3. Kontroller beløp og mva
4. Last ned PDF eller send til kundens e-post

### Fakturanummerserie

Sett opp fakturanummerserie under **Innstillinger → E-handel**:
- **Prefiks**: f.eks. `2026-`
- **Startnummer**: f.eks. `1001`
- Fakturanummer tildeles automatisk i stigende rekkefølge

## Rapportering og avgifter

### Gebyrrapportering

Systemet sporer alle transaksjonsgebyrer:
- Se gebyrer under **E-handel → Gebyrer**
- Marker gebyrer som rapportert for regnskapsformål
- Eksporter gebyrsammendrag per periode

### Statistikk

Under **E-handel → Statistikk**:
- Månedlig omsetning (stolpediagram)
- Topp-kunder etter omsetning
- Mest solgte modeller/materialer
- Gjennomsnittlig ordrestørrelse

Eksporter til CSV for regnskapssystem.

## Støtte og kontakt

:::info Trenger du hjelp?
- **Lisensspørsmål**: kontakt [geektech.no](https://geektech.no) support
- **Tekniske problemer**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Funksjonsønsker**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
