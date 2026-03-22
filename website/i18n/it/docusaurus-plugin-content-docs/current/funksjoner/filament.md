---
sidebar_position: 2
title: Magazzino Filamento
description: Gestisci le bobine di filamento, sincronizzazione AMS, essiccazione e altro
---

# Magazzino Filamento

Il Magazzino Filamento ti offre una panoramica completa di tutte le bobine di filamento, integrata con AMS e cronologia stampe.

## Panoramica

Il magazzino mostra tutte le bobine registrate con:

- **Colore** — scheda colore visiva
- **Materiale** — PLA, PETG, ABS, TPU, PA, ecc.
- **Fornitore** — Bambu Lab, Polymaker, eSUN, ecc.
- **Peso** — grammi rimanenti (stimati o pesati)
- **Slot AMS** — quale slot ospita la bobina
- **Stato** — attiva, vuota, in essiccazione, in magazzino

## Aggiungere Bobine

1. Clicca su **+ Nuova bobina**
2. Inserisci materiale, colore, fornitore e peso
3. Scansiona il tag NFC se disponibile, oppure inserisci manualmente
4. Salva

:::tip Bobine Bambu Lab
Le bobine ufficiali Bambu Lab possono essere importate automaticamente tramite l'integrazione Bambu Cloud. Vedi [Bambu Cloud](../kom-i-gang/bambu-cloud).
:::

## Sincronizzazione AMS

Quando il dashboard è connesso alla stampante, lo stato AMS viene sincronizzato automaticamente:

- Gli slot vengono mostrati con il colore e il materiale corretti dall'AMS
- Il consumo viene aggiornato dopo ogni stampa
- Le bobine vuote vengono contrassegnate automaticamente

Per collegare una bobina locale a uno slot AMS:
1. Vai a **Filamento → AMS**
2. Clicca sullo slot che vuoi collegare
3. Seleziona la bobina dal magazzino

## Essiccazione

Registra i cicli di essiccazione per monitorare l'esposizione all'umidità:

| Campo | Descrizione |
|------|-------------|
| Data essiccazione | Quando la bobina è stata essiccata |
| Temperatura | Temperatura di essiccazione (°C) |
| Durata | Numero di ore |
| Metodo | Forno, scatola essiccante, essiccatore filamento |

:::info Temperature di essiccazione consigliate
Vedi la [Base di Conoscenza](../kb/intro) per tempi e temperature di essiccazione specifici per materiale.
:::

## Schede Colore

La visualizzazione schede colore organizza visivamente le bobine per colore. Utile per trovare rapidamente il colore giusto. Filtra per materiale, fornitore o stato.

## Tag NFC

Bambu Dashboard supporta tag NFC per l'identificazione rapida delle bobine:

1. Scrivi l'ID del tag NFC sulla bobina nel magazzino
2. Scansiona il tag con il cellulare
3. La bobina si apre direttamente nel dashboard

## Importazione ed Esportazione

### Esportazione
Esporta l'intero magazzino come CSV: **Filamento → Esporta → CSV**

### Importazione
Importa bobine da CSV: **Filamento → Importa → Seleziona file**

Formato CSV:
```
nome,materiale,colore_hex,fornitore,peso_grammi,nfc_id
PLA Bianco,PLA,#FFFFFF,Bambu Lab,1000,
PETG Nero,PETG,#000000,Polymaker,850,ABC123
```

## Statistiche

Sotto **Filamento → Statistiche** trovi:

- Consumo totale per materiale (ultimi 30/90/365 giorni)
- Consumo per stampante
- Durata di vita rimanente stimata per bobina
- Colori e fornitori più usati
