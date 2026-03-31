---
sidebar_position: 7
title: Timelapse
description: Attiva la registrazione timelapse automatica delle stampe 3D, gestisci i video e riproducili direttamente nel dashboard
---

# Timelapse

3DPrintForge può acquisire automaticamente immagini durante la stampa e assemblarle in un video timelapse. I video vengono salvati localmente e possono essere riprodotti direttamente nel dashboard.

Vai a: **https://localhost:3443/#timelapse**

## Attivazione

1. Vai a **Impostazioni → Timelapse**
2. Attiva **Abilita registrazione timelapse**
3. Seleziona la **Modalità di registrazione**:
   - **Per strato** — un'immagine per strato (consigliata per alta qualità)
   - **Temporale** — un'immagine ogni N secondi (ad es. ogni 30 secondi)
4. Seleziona per quali stampanti abilitare il timelapse
5. Clicca su **Salva**

:::tip Intervallo immagini
«Per strato» fornisce l'animazione più fluida perché il movimento è coerente. «Temporale» utilizza meno spazio di archiviazione.
:::

## Impostazioni di Registrazione

| Impostazione | Valore predefinito | Descrizione |
|---|---|---|
| Risoluzione | 1280×720 | Dimensione immagine (640×480 / 1280×720 / 1920×1080) |
| Qualità immagine | 85% | Qualità compressione JPEG |
| FPS video | 30 | Fotogrammi al secondo nel video finale |
| Formato video | MP4 (H.264) | Formato di output |
| Ruota immagine | Disattivato | Ruota 90°/180°/270° per la direzione di montaggio |

:::warning Spazio di archiviazione
Un timelapse con 500 immagini in 1080p utilizza circa 200–400 MB prima dell'assemblaggio. Il video MP4 finale è tipicamente 20–80 MB.
:::

## Archiviazione

Le immagini e i video timelapse vengono salvati in `data/timelapse/` nella cartella del progetto. La struttura è organizzata per stampante e stampa:

```
data/timelapse/
├── <printer-id>/                     ← ID stampante univoco
│   ├── 2026-03-22_nomemodello/        ← Sessione di stampa (data_nomemodello)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Immagini grezze (eliminate dopo l'assemblaggio)
│   ├── 2026-03-22_nomemodello.mp4     ← Video timelapse finale
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_supportotelefonino.mp4
├── <printer-id-2>/                   ← Più stampanti (con multi-stampante)
│   └── ...
```

:::tip Archiviazione esterna
Per risparmiare spazio sul disco di sistema, puoi creare un collegamento simbolico alla cartella timelapse verso un disco esterno:
```bash
# Esempio: sposta su un disco esterno montato su /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Crea collegamento simbolico
ln -s /mnt/storage/timelapse data/timelapse
```
Il dashboard segue automaticamente il collegamento simbolico. Puoi usare qualsiasi disco o condivisione di rete.
:::

## Assemblaggio Automatico

Quando la stampa è finita, le immagini vengono automaticamente assemblate in un video con ffmpeg:

1. 3DPrintForge riceve l'evento «print complete» da MQTT
2. ffmpeg viene chiamato con le immagini acquisite
3. Il video viene salvato nella cartella di archiviazione
4. La pagina timelapse si aggiorna con il nuovo video

Puoi vedere il progresso nella scheda **Timelapse → In elaborazione**.

## Riproduzione

1. Vai a **https://localhost:3443/#timelapse**
2. Seleziona una stampante dall'elenco a discesa
3. Clicca su un video nell'elenco per riprodurlo
4. Usa i controlli di riproduzione:
   - ▶ / ⏸ — Riproduci / Pausa
   - ⏪ / ⏩ — Riavvolgi / Avanza veloce
   - Pulsanti velocità: 0,5× / 1× / 2× / 4×
5. Clicca su **Schermo intero** per aprire a schermo intero
6. Clicca su **Scarica** per scaricare il file MP4

## Eliminare Timelapse

1. Seleziona il video nell'elenco
2. Clicca su **Elimina** (icona cestino)
3. Conferma nella finestra di dialogo

:::danger Eliminazione permanente
I video timelapse e le immagini grezze eliminati non possono essere recuperati. Scarica il video prima se vuoi conservarlo.
:::

## Condivisione Timelapse

I video timelapse possono essere condivisi tramite link a tempo:

1. Seleziona il video e clicca su **Condividi**
2. Imposta il tempo di scadenza (1 ora / 24 ore / 7 giorni / nessuna scadenza)
3. Copia il link generato e condividilo
4. Il destinatario non ha bisogno di accedere per guardare il video
