---
sidebar_position: 2
title: Backup
description: Crea, ripristina e pianifica backup automatici dei dati di 3DPrintForge
---

# Backup

3DPrintForge può eseguire il backup di tutta la configurazione, la cronologia e i dati, in modo da poter ripristinare facilmente in caso di guasto del sistema, migrazione del server o problemi di aggiornamento.

Vai a: **https://localhost:3443/#settings** → **Sistema → Backup**

## Cosa è incluso in un backup

| Tipo di dati | Incluso | Note |
|---|---|---|
| Configurazione e impostazioni stampanti | ✅ | |
| Cronologia stampe | ✅ | |
| Magazzino filamento | ✅ | |
| Utenti e ruoli | ✅ | Le password sono salvate in hash |
| Impostazioni | ✅ | Incl. configurazioni notifiche |
| Registro manutenzione | ✅ | |
| Progetti e fatture | ✅ | |
| Libreria file (metadati) | ✅ | |
| Libreria file (file) | Opzionale | Può diventare grande |
| Video timelapse | Opzionale | Può diventare molto grande |
| Immagini galleria | Opzionale | |

## Creare un backup manuale

1. Vai a **Impostazioni → Backup**
2. Seleziona cosa includere (vedi tabella sopra)
3. Clicca **Crea backup ora**
4. Viene mostrata una barra di avanzamento mentre il backup viene creato
5. Clicca **Scarica** quando il backup è pronto

Il backup viene salvato come file `.zip` con timestamp nel nome:
```
3dprintforge-backup-2026-03-22T14-30-00.zip
```

## Scaricare il backup

I file di backup vengono salvati nella cartella backup del server (configurabile). Puoi anche scaricarli direttamente:

1. Vai a **Backup → Backup esistenti**
2. Trova il backup nell'elenco (ordinato per data)
3. Clicca **Scarica** (icona download)

:::info Cartella di archiviazione
Cartella di archiviazione predefinita: `./data/backups/`. Modifica in **Impostazioni → Backup → Cartella di archiviazione**.
:::

## Backup automatico pianificato

1. Attiva **Backup automatico** in **Backup → Pianificazione**
2. Seleziona l'intervallo:
   - **Giornaliero** — eseguito alle 03:00 (configurabile)
   - **Settimanale** — un giorno e orario specifici
   - **Mensile** — il primo giorno del mese
3. Seleziona il **Numero di backup da conservare** (es. 7 — i più vecchi vengono eliminati automaticamente)
4. Clicca **Salva**

:::tip Archiviazione esterna
Per i dati importanti: monta un disco esterno o di rete come cartella di archiviazione per i backup. In questo modo i backup sopravvivono anche se il disco di sistema si guasta.
:::

## Ripristinare da un backup

:::warning Il ripristino sovrascrive i dati esistenti
Il ripristino sostituisce tutti i dati esistenti con il contenuto del file di backup. Assicurati di avere un backup recente dei dati correnti prima di procedere.
:::

### Da un backup esistente sul server

1. Vai a **Backup → Backup esistenti**
2. Trova il backup nell'elenco
3. Clicca **Ripristina**
4. Conferma nella finestra di dialogo
5. Il sistema si riavvia automaticamente dopo il ripristino

### Da un file di backup scaricato

1. Clicca **Carica backup**
2. Seleziona il file `.zip` dal tuo computer
3. Il file viene validato — vedrai cosa è incluso
4. Clicca **Ripristina da file**
5. Conferma nella finestra di dialogo

## Validazione del backup

3DPrintForge valida tutti i file di backup prima del ripristino:

- Verifica la validità del formato ZIP
- Controlla che lo schema del database sia compatibile con la versione corrente
- Mostra un avviso se il backup è da una versione precedente (la migrazione verrà eseguita automaticamente)
