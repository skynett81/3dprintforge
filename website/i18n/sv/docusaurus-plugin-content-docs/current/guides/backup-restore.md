---
sidebar_position: 9
title: Säkerhetskopiering och återställning
description: Automatisk och manuell säkerhetskopiering av Bambu Dashboard, återställning och flytt till ny server
---

# Säkerhetskopiering och återställning

Bambu Dashboard lagrar all data lokalt — utskriftshistorik, filamentlager, inställningar, användare och mer. Regelbunden säkerhetskopiering säkerställer att du inte förlorar något vid serverfel eller vid flytt.

## Vad ingår i en säkerhetskopia?

| Data | Ingår | Anmärkning |
|------|-------|------------|
| Utskriftshistorik | Ja | Alla loggar och statistik |
| Filamentlager | Ja | Spoler, vikter, märken |
| Inställningar | Ja | Alla systeminställningar |
| Skrivarkonfiguration | Ja | IP-adresser, åtkomstkoder |
| Användare och roller | Ja | Lösenord lagras hashade |
| Aviseringskonfiguration | Ja | Telegram-tokens osv. |
| Kamerabilder | Valfritt | Kan bli stora filer |
| Timelapse-videor | Valfritt | Exkluderade som standard |

## Automatisk nattlig säkerhetskopiering

Som standard körs en automatisk säkerhetskopiering varje natt kl. 03:00.

**Se och konfigurera automatisk säkerhetskopiering:**
1. Gå till **System → Säkerhetskopiering**
2. Under **Automatisk säkerhetskopiering** ser du:
   - Senaste lyckade säkerhetskopiering och tidpunkt
   - Nästa planerade säkerhetskopiering
   - Antal säkerhetskopior lagrade (standard: 7 dagar)

**Konfigurera:**
- **Tidpunkt** — ändra från standard 03:00 till en tid som passar dig
- **Bevarandetid** — antal dagar säkerhetskopior behålls (7, 14, 30 dagar)
- **Lagringsplats** — lokal mapp (standard) eller extern sökväg
- **Komprimering** — aktiverat som standard (minskar storlek med 60–80%)

:::info Säkerhetskopieringsfiler lagras som standard här
```
/sökväg/till/bambu-dashboard/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Manuell säkerhetskopiering

Ta en säkerhetskopia när som helst:

1. Gå till **System → Säkerhetskopiering**
2. Klicka på **Ta säkerhetskopia nu**
3. Vänta tills statusen visar **Slutförd**
4. Ladda ner säkerhetskopieringsfilen genom att klicka på **Ladda ned**

**Alternativt via terminal:**
```bash
cd /sökväg/till/bambu-dashboard
node scripts/backup.js
```

Säkerhetskopieringsfilen lagras i `data/backups/` med tidsstämpel i filnamnet.

## Återställa från säkerhetskopia

:::warning Återställning skriver över befintlig data
All befintlig data ersätts av innehållet i säkerhetskopieringsfilen. Se till att du återställer från rätt fil.
:::

### Via instrumentpanelen

1. Gå till **System → Säkerhetskopiering**
2. Klicka på **Återställ**
3. Välj en säkerhetskopieringsfil från listan, eller ladda upp en säkerhetskopieringsfil från disk
4. Klicka på **Återställ nu**
5. Instrumentpanelen startar om automatiskt efter återställning

### Via terminal

```bash
cd /sökväg/till/bambu-dashboard
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Efter återställning, starta om instrumentpanelen:
```bash
sudo systemctl restart bambu-dashboard
# eller
npm start
```

## Exportera och importera inställningar

Vill du bara spara inställningarna (inte all historik)?

**Exportera:**
1. Gå till **System → Inställningar → Export**
2. Välj vad som ska inkluderas:
   - Skrivarkonfiguration
   - Aviseringskonfiguration
   - Användarkonton
   - Filamentmärken och profiler
3. Klicka på **Exportera** — du laddar ned en `.json`-fil

**Importera:**
1. Gå till **System → Inställningar → Importera**
2. Ladda upp `.json`-filen
3. Välj vilka delar som ska importeras
4. Klicka på **Importera**

:::tip Användbart vid ny installation
Exporterade inställningar är praktiskt att ha med till ny server. Importera dem efter ny installation för att slippa ställa in allt på nytt.
:::

## Flytta till ny server

Så här flyttar du Bambu Dashboard med all data till en ny maskin:

### Steg 1 — Ta säkerhetskopia på gammal server

1. Gå till **System → Säkerhetskopiering → Ta säkerhetskopia nu**
2. Ladda ned säkerhetskopieringsfilen
3. Kopiera filen till ny server (USB, scp, nätverksdelning)

### Steg 2 — Installera på ny server

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Följ installationsguiden. Du behöver inte konfigurera något — bara få instrumentpanelen att köra.

### Steg 3 — Återställ säkerhetskopian

När instrumentpanelen körs på ny server:

1. Gå till **System → Säkerhetskopiering → Återställ**
2. Ladda upp säkerhetskopieringsfilen från gammal server
3. Klicka på **Återställ nu**

Allt är nu på plats: historik, filamentlager, inställningar och användare.

### Steg 4 — Verifiera anslutningen

1. Gå till **Inställningar → Skrivare**
2. Testa anslutningen till varje skrivare
3. Kontrollera att IP-adresserna fortfarande är korrekta (ny server kan ha annan IP)

## Tips för god säkerhetskopieringshygien

- **Testa återställningen** — ta en säkerhetskopia och återställ på en testmaskin minst en gång. Oprövade säkerhetskopior är ingen säkerhetskopia.
- **Lagra externt** — kopiera jämnt säkerhetskopieringsfilen till en extern disk eller molnlagring (Nextcloud, Google Drive osv.)
- **Ställ in avisering** — aktivera avisering för "Säkerhetskopiering misslyckades" under **Inställningar → Aviseringar → Händelser** så att du vet direkt om något går fel
