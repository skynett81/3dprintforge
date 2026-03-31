---
sidebar_position: 2
title: Säkerhetskopiering
description: Skapa, återställ och schemalägg automatiska säkerhetskopior av 3DPrintForge-data
---

# Säkerhetskopiering

3DPrintForge kan säkerhetskopiera all konfiguration, historik och data så att du enkelt kan återställa vid systemfel, serverflyttning eller uppdateringsproblem.

Gå till: **https://localhost:3443/#settings** → **System → Säkerhetskopiering**

## Vad ingår i en säkerhetskopia

| Datatyp | Inkluderat | Anmärkning |
|---|---|---|
| Skrivarinställningar och konfigurationer | ✅ | |
| Utskriftshistorik | ✅ | |
| Filamentlager | ✅ | |
| Användare och roller | ✅ | Lösenord lagras hashade |
| Inställningar | ✅ | Inkl. aviseringskonfigurationer |
| Underhållslogg | ✅ | |
| Projekt och fakturor | ✅ | |
| Filbibliotek (metadata) | ✅ | |
| Filbibliotek (filer) | Valfritt | Kan bli stor |
| Timelapse-videor | Valfritt | Kan bli mycket stor |
| Galleribilder | Valfritt | |

## Skapa en manuell säkerhetskopia

1. Gå till **Inställningar → Säkerhetskopiering**
2. Välj vad som ska inkluderas (se tabellen ovan)
3. Klicka **Skapa säkerhetskopia nu**
4. Förloppsindikator visas medan säkerhetskopian skapas
5. Klicka **Ladda ner** när säkerhetskopian är klar

Säkerhetskopian sparas som en `.zip`-fil med tidsstämpel i filnamnet:
```
3dprintforge-backup-2026-03-22T14-30-00.zip
```

## Ladda ner säkerhetskopia

Säkerhetskopieringsfiler lagras i säkerhetskopieringsmappen på servern (konfigurerbart). Dessutom kan du ladda ner dem direkt:

1. Gå till **Säkerhetskopiering → Befintliga säkerhetskopior**
2. Hitta säkerhetskopian i listan (sorterad efter datum)
3. Klicka **Ladda ner** (nedladdningsikon)

:::info Lagringsmapp
Standard lagringsmapp: `./data/backups/`. Ändra under **Inställningar → Säkerhetskopiering → Lagringsmapp**.
:::

## Schemalagd automatisk säkerhetskopiering

1. Aktivera **Automatisk säkerhetskopiering** under **Säkerhetskopiering → Schemaläggning**
2. Välj intervall:
   - **Dagligen** — körs kl. 03:00 (konfigurerbart)
   - **Veckovis** — en specifik dag och tid
   - **Månadsvis** — första dagen i månaden
3. Välj **Antal säkerhetskopior att behålla** (t.ex. 7 — äldre raderas automatiskt)
4. Klicka **Spara**

:::tip Extern lagring
För viktig data: montera en extern disk eller nätverksdisk som lagringsmapp för säkerhetskopior. Då överlever säkerhetskopiorna även om systemdisken slutar fungera.
:::

## Återställa från säkerhetskopia

:::warning Återställning skriver över befintlig data
Återställning ersätter all befintlig data med innehållet från säkerhetskopieringsfilen. Se till att du har en färsk säkerhetskopia av aktuell data först.
:::

### Från befintlig säkerhetskopia på servern

1. Gå till **Säkerhetskopiering → Befintliga säkerhetskopior**
2. Hitta säkerhetskopian i listan
3. Klicka **Återställ**
4. Bekräfta i dialogen
5. Systemet startar automatiskt om efter återställning

### Från nedladdad säkerhetskopieringsfil

1. Klicka **Ladda upp säkerhetskopia**
2. Välj `.zip`-filen från din dator
3. Filen valideras — du ser vad som ingår
4. Klicka **Återställ från fil**
5. Bekräfta i dialogen

## Validering av säkerhetskopia

3DPrintForge validerar alla säkerhetskopieringsfiler före återställning:

- Kontrollerar att ZIP-formatet är giltigt
- Verifierar att databasschemat är kompatibelt med aktuell version
- Visar varning om säkerhetskopian är från en äldre version (migrering utförs automatiskt)
