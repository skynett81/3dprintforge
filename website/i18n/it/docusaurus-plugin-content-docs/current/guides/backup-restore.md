---
sidebar_position: 9
title: Backup e ripristino
description: Backup automatico e manuale di Bambu Dashboard, ripristino e migrazione a un nuovo server
---

# Backup e ripristino

Bambu Dashboard salva tutti i dati localmente — cronologia stampe, magazzino filamenti, impostazioni, utenti e altro. Il backup regolare garantisce di non perdere nulla in caso di guasto del server o di migrazione.

## Cosa è incluso in un backup?

| Dati | Incluso | Nota |
|------|---------|------|
| Cronologia stampe | Sì | Tutti i log e le statistiche |
| Magazzino filamenti | Sì | Bobine, pesi, marche |
| Impostazioni | Sì | Tutte le impostazioni di sistema |
| Configurazione stampante | Sì | Indirizzi IP, codici di accesso |
| Utenti e ruoli | Sì | Le password sono memorizzate come hash |
| Configurazione notifiche | Sì | Token Telegram ecc. |
| Immagini camera | Opzionale | Possono diventare file grandi |
| Video timelapse | Opzionale | Escluso per impostazione predefinita |

## Backup notturno automatico

Per impostazione predefinita, un backup automatico viene eseguito ogni notte alle 03:00.

**Visualizza e configura il backup automatico:**
1. Vai su **Sistema → Backup**
2. Sotto **Backup automatico** puoi vedere:
   - Ultimo backup riuscito e orario
   - Prossimo backup pianificato
   - Numero di backup salvati (predefinito: 7 giorni)

**Configurazione:**
- **Orario** — modifica dall'orario predefinito 03:00 a un orario adatto
- **Periodo di conservazione** — numero di giorni in cui i backup vengono mantenuti (7, 14, 30 giorni)
- **Posizione di archiviazione** — cartella locale (predefinita) o percorso esterno
- **Compressione** — attivata per impostazione predefinita (riduce le dimensioni del 60–80%)

:::info I file di backup vengono salvati qui per impostazione predefinita
```
/percorso/di/bambu-dashboard/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Backup manuale

Esegui un backup in qualsiasi momento:

1. Vai su **Sistema → Backup**
2. Clicca **Esegui backup ora**
3. Aspetta che lo stato mostri **Completato**
4. Scarica il file di backup cliccando **Scarica**

**In alternativa tramite terminale:**
```bash
cd /percorso/di/bambu-dashboard
node scripts/backup.js
```

Il file di backup viene salvato in `data/backups/` con timestamp nel nome del file.

## Ripristino da backup

:::warning Il ripristino sovrascrive i dati esistenti
Tutti i dati esistenti vengono sostituiti dal contenuto del file di backup. Assicurati di ripristinare il file corretto.
:::

### Tramite il dashboard

1. Vai su **Sistema → Backup**
2. Clicca **Ripristina**
3. Seleziona un file di backup dall'elenco, o carica un file di backup dal disco
4. Clicca **Ripristina ora**
5. Il dashboard si riavvia automaticamente dopo il ripristino

### Tramite terminale

```bash
cd /percorso/di/bambu-dashboard
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Dopo il ripristino, riavvia il dashboard:
```bash
sudo systemctl restart bambu-dashboard
# oppure
npm start
```

## Esportare e importare impostazioni

Vuoi solo conservare le impostazioni (non tutta la cronologia)?

**Esportare:**
1. Vai su **Sistema → Impostazioni → Esporta**
2. Seleziona cosa includere:
   - Configurazione stampante
   - Configurazione notifiche
   - Account utente
   - Marche e profili filamento
3. Clicca **Esporta** — scarichi un file `.json`

**Importare:**
1. Vai su **Sistema → Impostazioni → Importa**
2. Carica il file `.json`
3. Seleziona quali parti importare
4. Clicca **Importa**

:::tip Utile per nuove installazioni
Le impostazioni esportate sono pratiche da portare su un nuovo server. Importale dopo una nuova installazione per evitare di riconfigurare tutto da zero.
:::

## Migrazione a un nuovo server

Come migrare Bambu Dashboard con tutti i dati a una nuova macchina:

### Passo 1 — Esegui un backup sul vecchio server

1. Vai su **Sistema → Backup → Esegui backup ora**
2. Scarica il file di backup
3. Copia il file sul nuovo server (USB, scp, condivisione di rete)

### Passo 2 — Installa sul nuovo server

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

Segui la guida all'installazione. Non hai bisogno di configurare nulla — basta far girare il dashboard.

### Passo 3 — Ripristina il backup

Quando il dashboard è in esecuzione sul nuovo server:

1. Vai su **Sistema → Backup → Ripristina**
2. Carica il file di backup dal vecchio server
3. Clicca **Ripristina ora**

Tutto è ora in posizione: cronologia, magazzino filamenti, impostazioni e utenti.

### Passo 4 — Verifica la connessione

1. Vai su **Impostazioni → Stampanti**
2. Testa la connessione a ciascuna stampante
3. Verifica che gli indirizzi IP siano ancora corretti (il nuovo server può avere un IP diverso)

## Consigli per una buona pratica di backup

- **Testa il ripristino** — esegui un backup e ripristinalo su una macchina di test almeno una volta. I backup non testati non sono backup.
- **Archivia esternamente** — copia regolarmente il file di backup su un disco esterno o archiviazione cloud (Nextcloud, Google Drive ecc.)
- **Configura gli avvisi** — attiva la notifica per "Backup fallito" sotto **Impostazioni → Notifiche → Eventi** in modo da saperlo immediatamente se qualcosa va storto
