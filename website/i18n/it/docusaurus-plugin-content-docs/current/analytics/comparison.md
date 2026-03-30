---
sidebar_position: 6
title: Confronto Stampe
description: Confronta due stampe affiancate con metriche dettagliate, grafici e immagini della galleria per l'analisi A/B
---

# Confronto Stampe

Il confronto stampe ti permette di analizzare due stampe affiancate — utile per confrontare impostazioni, materiali, stampanti o versioni dello stesso modello.

Vai a: **https://localhost:3443/#comparison**

## Scegliere le Stampe da Confrontare

1. Vai a **Confronto Stampe**
2. Clicca su **Seleziona stampa A** e cerca nella cronologia
3. Clicca su **Seleziona stampa B** e cerca nella cronologia
4. Clicca su **Confronta** per caricare la visualizzazione di confronto

:::tip Accesso più rapido
Dalla **Cronologia** puoi fare clic destro su una stampa e selezionare **Imposta come stampa A** o **Confronta con...** per passare direttamente alla modalità di confronto.
:::

## Confronto Metriche

Le metriche vengono mostrate in due colonne (A e B) con evidenziazione di quale sia la migliore:

| Metrica | Descrizione |
|---|---|
| Esito | Completata / Interrotta / Fallita |
| Durata | Tempo di stampa totale |
| Consumo filamento | Grammi totali e per colore |
| Efficienza filamento | % modello sul consumo totale |
| Temp. ugello max | Temperatura ugello massima registrata |
| Temp. piatto max | Temperatura piatto massima registrata |
| Impostazione velocità | Silenziosa / Standard / Sport / Turbo |
| Cambi AMS | Numero di cambi colore |
| Errori HMS | Eventuali errori durante la stampa |
| Stampante | Quale stampante è stata utilizzata |

Le celle con il valore migliore vengono mostrate con sfondo verde.

## Grafici Temperatura

Due grafici di temperatura vengono mostrati affiancati (o sovrapposti):

- **Visualizzazione separata** — grafico A a sinistra, grafico B a destra
- **Visualizzazione sovrapposta** — entrambi nello stesso grafico con colori diversi

Usa la visualizzazione sovrapposta per vedere direttamente la stabilità della temperatura e la velocità di riscaldamento.

## Immagini Galleria

Se entrambe le stampe hanno screenshot milestone, vengono mostrati in una griglia:

| Stampa A | Stampa B |
|---|---|
| Immagine 25% A | Immagine 25% B |
| Immagine 50% A | Immagine 50% B |
| Immagine 75% A | Immagine 75% B |
| Immagine 100% A | Immagine 100% B |

Clicca su un'immagine per aprire l'anteprima a schermo intero con animazione a scorrimento.

## Confronto Timelapse

Se entrambe le stampe hanno un timelapse, i video vengono mostrati affiancati:

- Riproduzione sincronizzata — entrambi partono e si mettono in pausa contemporaneamente
- Riproduzione indipendente — controlla ogni video separatamente

## Differenze di Impostazioni

Il sistema evidenzia automaticamente le differenze nelle impostazioni di stampa (estratte dai metadati G-code):

- Spessori strato diversi
- Pattern o percentuale di riempimento diversi
- Impostazioni supporto diverse
- Profili velocità diversi

Le differenze vengono mostrate con evidenziazione arancione nella tabella delle impostazioni.

## Salvare il Confronto

1. Clicca su **Salva confronto**
2. Assegna un nome al confronto (ad es. «PLA vs PETG - Benchy»)
3. Il confronto viene salvato ed è disponibile tramite **Cronologia → Confronti**

## Esportazione

1. Clicca su **Esporta**
2. Seleziona **PDF** per un report con tutte le metriche e le immagini
3. Il report può essere collegato a un progetto per la documentazione della scelta del materiale
