---
sidebar_position: 9
title: Back-up en herstel
description: Automatische en handmatige back-up van 3DPrintForge, herstel en verplaatsing naar een nieuwe server
---

# Back-up en herstel

3DPrintForge slaat alle gegevens lokaal op — printgeschiedenis, filamentbeheer, instellingen, gebruikers en meer. Regelmatige back-ups zorgen ervoor dat je niets verliest bij een serverfout of bij verplaatsing.

## Wat is inbegrepen in een back-up?

| Gegevens | Inbegrepen | Opmerking |
|---------|-----------|-----------|
| Printgeschiedenis | Ja | Alle logs en statistieken |
| Filamentbeheer | Ja | Spoelen, gewichten, merken |
| Instellingen | Ja | Alle systeeminstellingen |
| Printerinstellingen | Ja | IP-adressen, toegangscodes |
| Gebruikers en rollen | Ja | Wachtwoorden opgeslagen als hash |
| Meldingsconfiguratie | Ja | Telegram-tokens, enz. |
| Camerabeelden | Optioneel | Kunnen grote bestanden worden |
| Time-lapse-video's | Optioneel | Standaard uitgesloten |

## Automatische nachtelijke back-up

Standaard wordt elke nacht om 03:00 automatisch een back-up uitgevoerd.

**Automatische back-up bekijken en configureren:**
1. Ga naar **Systeem → Back-up**
2. Onder **Automatische back-up** zie je:
   - Laatste succesvolle back-up en tijdstip
   - Volgende geplande back-up
   - Aantal opgeslagen back-ups (standaard: 7 dagen)

**Configureren:**
- **Tijdstip** — wijzig van standaard 03:00 naar een tijdstip dat jou uitkomt
- **Bewaartijd** — aantal dagen dat back-ups worden bewaard (7, 14, 30 dagen)
- **Opslaglocatie** — lokale map (standaard) of extern pad
- **Compressie** — standaard geactiveerd (vermindert grootte met 60–80%)

:::info Back-upbestanden worden standaard hier opgeslagen
```
/pad/naar/3dprintforge/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Handmatige back-up

Maak op elk moment een back-up:

1. Ga naar **Systeem → Back-up**
2. Klik **Nu back-up maken**
3. Wacht tot de status **Voltooid** toont
4. Download het back-upbestand door op **Downloaden** te klikken

**Alternatief via terminal:**
```bash
cd /pad/naar/3dprintforge
node scripts/backup.js
```

Het back-upbestand wordt opgeslagen in `data/backups/` met een tijdstempel in de bestandsnaam.

## Herstellen vanuit back-up

:::warning Herstellen overschrijft bestaande gegevens
Alle bestaande gegevens worden vervangen door de inhoud van het back-upbestand. Zorg ervoor dat je herstelt naar het juiste bestand.
:::

### Via het dashboard

1. Ga naar **Systeem → Back-up**
2. Klik **Herstellen**
3. Selecteer een back-upbestand uit de lijst, of upload een back-upbestand van schijf
4. Klik **Nu herstellen**
5. Het dashboard herstart automatisch na herstel

### Via terminal

```bash
cd /pad/naar/3dprintforge
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Start het dashboard opnieuw na herstel:
```bash
sudo systemctl restart 3dprintforge
# of
npm start
```

## Instellingen exporteren en importeren

Wil je alleen de instellingen bewaren (niet alle geschiedenis)?

**Exporteren:**
1. Ga naar **Systeem → Instellingen → Exporteren**
2. Kies wat er moet worden opgenomen:
   - Printerinstellingen
   - Meldingsconfiguratie
   - Gebruikersaccounts
   - Filamentmerken en -profielen
3. Klik **Exporteren** — je downloadt een `.json`-bestand

**Importeren:**
1. Ga naar **Systeem → Instellingen → Importeren**
2. Upload het `.json`-bestand
3. Kies welke onderdelen moeten worden geïmporteerd
4. Klik **Importeren**

:::tip Handig bij nieuwe installatie
Geëxporteerde instellingen zijn handig om mee te nemen naar een nieuwe server. Importeer ze na een nieuwe installatie om te voorkomen dat je alles opnieuw moet instellen.
:::

## Verplaatsen naar een nieuwe server

Zo verplaats je 3DPrintForge met alle gegevens naar een nieuwe machine:

### Stap 1 — Maak een back-up op de oude server

1. Ga naar **Systeem → Back-up → Nu back-up maken**
2. Download het back-upbestand
3. Kopieer het bestand naar de nieuwe server (USB, scp, netwerkshare)

### Stap 2 — Installeer op de nieuwe server

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Volg de installatiehandleiding. Je hoeft niets te configureren — zorg gewoon dat het dashboard actief is.

### Stap 3 — Herstel de back-up

Wanneer het dashboard op de nieuwe server draait:

1. Ga naar **Systeem → Back-up → Herstellen**
2. Upload het back-upbestand van de oude server
3. Klik **Nu herstellen**

Alles is nu aanwezig: geschiedenis, filamentbeheer, instellingen en gebruikers.

### Stap 4 — Controleer de verbinding

1. Ga naar **Instellingen → Printers**
2. Test de verbinding met elke printer
3. Controleer of de IP-adressen nog kloppen (nieuwe server kan een ander IP hebben)

## Tips voor goed back-upbeheer

- **Test het herstel** — maak een back-up en herstel op een testmachine ten minste één keer. Niet-geteste back-ups zijn geen back-up.
- **Sla extern op** — kopieer regelmatig het back-upbestand naar een externe schijf of cloudopslag (Nextcloud, Google Drive, enz.)
- **Stel een melding in** — activeer de melding voor "Back-up mislukt" onder **Instellingen → Meldingen → Gebeurtenissen** zodat je het direct weet als er iets misgaat
