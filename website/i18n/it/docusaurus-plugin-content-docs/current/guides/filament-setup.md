---
sidebar_position: 2
title: Configurare il magazzino filamenti
description: Come creare, configurare e tenere traccia delle bobine di filamento in 3DPrintForge
---

# Configurare il magazzino filamenti

Il magazzino filamenti in 3DPrintForge ti offre una panoramica completa di tutte le tue bobine — quanto rimane, quanto hai usato e quali bobine sono nell'AMS in questo momento.

## Creazione automatica dall'AMS

Quando colleghi una stampante con AMS, il dashboard legge automaticamente le informazioni dai chip RFID sulle bobine Bambu:

- Tipo di filamento (PLA, PETG, ABS, TPU ecc.)
- Colore (con codice esadecimale)
- Marca (Bambu Lab)
- Peso della bobina e quantità rimanente

**Queste bobine vengono create automaticamente nel magazzino** — non devi fare nulla. Puoi vederle sotto **Filamento → Magazzino**.

:::info Solo le bobine Bambu hanno RFID
Le bobine di terze parti (ad es. eSUN, Polymaker, ricariche Bambu senza chip) non vengono riconosciute automaticamente. Queste devono essere inserite manualmente.
:::

## Aggiungere bobine manualmente

Per le bobine senza RFID, o per le bobine che non sono nell'AMS:

1. Vai su **Filamento → Magazzino**
2. Clicca **+ Nuova bobina** in alto a destra
3. Compila i campi:

| Campo | Esempio | Obbligatorio |
|-------|---------|--------------|
| Marca | eSUN, Polymaker, Bambu | Sì |
| Tipo | PLA, PETG, ABS, TPU | Sì |
| Colore | #FF5500 o scegli dalla ruota dei colori | Sì |
| Peso iniziale | 1000 g | Consigliato |
| Rimanente | 850 g | Consigliato |
| Diametro | 1,75 mm | Sì |
| Nota | "Acquistato 2025-01, funziona bene" | Facoltativo |

4. Clicca **Salva**

## Configurare colori e marca

Puoi modificare una bobina in qualsiasi momento cliccandoci sopra nel magazzino:

- **Colore** — Scegli dalla ruota dei colori o inserisci il valore esadecimale. Il colore viene usato come indicatore visivo nella panoramica AMS
- **Marca** — Appare nelle statistiche e nei filtri. Crea marche personalizzate sotto **Filamento → Marche**
- **Profilo temperatura** — Inserisci le temperature consigliate per ugello e piano dal produttore del filamento. Il dashboard può quindi avvertirti se scegli una temperatura errata

## Capire la sincronizzazione AMS

Il dashboard sincronizza lo stato dell'AMS in tempo reale:

```
AMS Slot 1 → Bobina: Bambu PLA Bianco  [███████░░░] 72% rimanente
AMS Slot 2 → Bobina: eSUN PETG Grigio  [████░░░░░░] 41% rimanente
AMS Slot 3 → (vuoto)
AMS Slot 4 → Bobina: Bambu PLA Rosso   [██████████] 98% rimanente
```

La sincronizzazione viene aggiornata:
- **Durante la stampa** — il consumo viene sottratto in tempo reale
- **Al termine della stampa** — il consumo finale viene registrato nella cronologia
- **Manualmente** — clicca sull'icona di sincronizzazione su una bobina per recuperare i dati aggiornati dall'AMS

:::tip Correggere la stima AMS
La stima AMS dall'RFID non è sempre accurata al 100% dopo il primo utilizzo. Pesa la bobina e aggiorna il peso manualmente per una maggiore precisione.
:::

## Controllare il consumo e il rimanente

### Per bobina
Clicca su una bobina nel magazzino per vedere:
- Totale usato (grammi, tutte le stampe)
- Quantità rimanente stimata
- Elenco di tutte le stampe che hanno utilizzato questa bobina

### Statistiche aggregate
Sotto **Analisi → Analisi filamento** puoi vedere:
- Consumo per tipo di filamento nel tempo
- Quali marche usi di più
- Costo stimato basato sul prezzo di acquisto per kg

### Avvisi di livello basso
Configura avvisi per quando una bobina si avvicina alla fine:

1. Vai su **Filamento → Impostazioni**
2. Attiva **Avvisa per scorta bassa**
3. Imposta la soglia (ad es. 100 g rimanenti)
4. Scegli il canale di notifica (Telegram, Discord, e-mail)

## Suggerimento: Pesa le bobine per maggiore precisione

Le stime dell'AMS e delle statistiche di stampa non sono mai completamente precise. Il metodo più accurato è pesare la bobina stessa:

**Come fare:**

1. Trova il peso tara (bobina vuota) — di solito 200–250 g, controlla il sito del produttore o il fondo della bobina
2. Pesa la bobina con il filamento su una bilancia da cucina
3. Sottrai il peso tara
4. Aggiorna **Rimanente** nel profilo della bobina

**Esempio:**
```
Peso misurato:   743 g
Tara (vuota):  - 230 g
Filamento rimanente: 513 g
```

:::tip Generatore di etichette bobine
Sotto **Strumenti → Etichette** puoi stampare etichette con codice QR per le tue bobine. Scansiona il codice con il telefono per aprire rapidamente il profilo della bobina.
:::
