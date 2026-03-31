---
sidebar_position: 6
title: Più stampanti
description: Configura e gestisci più stampanti Bambu in 3DPrintForge — panoramica fleet, coda e avvio sfalsato
---

# Più stampanti

Hai più di una stampante? 3DPrintForge è costruito per la gestione della flotta — puoi monitorare, controllare e coordinare tutte le stampanti da un unico posto.

## Aggiungere una nuova stampante

1. Vai su **Impostazioni → Stampanti**
2. Clicca **+ Aggiungi stampante**
3. Compila:

| Campo | Esempio | Spiegazione |
|-------|---------|-------------|
| Numero seriale (SN) | 01P... | Trovato in Bambu Handy o sullo schermo della stampante |
| Indirizzo IP | 192.168.1.101 | Per modalità LAN (consigliata) |
| Codice di accesso | 12345678 | Codice a 8 cifre sullo schermo della stampante |
| Nome | "Bambu #2 - P1S" | Visualizzato nel dashboard |
| Modello | P1P, P1S, X1C, A1 | Scegli il modello corretto per le icone e le funzioni giuste |

4. Clicca **Testa connessione** — dovresti vedere lo stato verde
5. Clicca **Salva**

:::tip Dai alle stampanti nomi descrittivi
"Bambu 1" e "Bambu 2" sono confusionari. Usa nomi come "X1C - Produzione" e "P1S - Prototipi" per mantenere il controllo.
:::

## La panoramica della flotta

Dopo che tutte le stampanti sono state aggiunte, vengono mostrate insieme nel pannello **Flotta**. Qui puoi vedere:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Produzione│  │ P1S - Prototipi │  │ A1 - Hobbistica │
│ ████████░░ 82%  │  │ Libera          │  │ ████░░░░░░ 38%  │
│ 1h 24m rimanenti│  │ Pronta per stamp│  │ 3h 12m rimanenti│
│ Temp: 220/60°C  │  │ AMS: 4 bobine   │  │ Temp: 235/80°C  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Puoi:
- Cliccare su una stampante per la visualizzazione completa dei dettagli
- Vedere tutte le temperature, lo stato AMS e gli errori attivi in una sola vista
- Filtrare per stato (stampe attive, libere, errori)

## Coda di stampa — distribuzione del lavoro

La coda di stampa ti permette di pianificare stampe per tutte le stampanti da un unico posto.

**Come funziona:**
1. Vai su **Coda**
2. Clicca **+ Aggiungi lavoro**
3. Seleziona file e impostazioni
4. Scegli una stampante o seleziona **Assegnazione automatica**

### Assegnazione automatica
Con l'assegnazione automatica il dashboard sceglie la stampante in base a:
- Capacità disponibile
- Filamento disponibile in AMS
- Finestre di manutenzione pianificate

Attiva in **Impostazioni → Coda → Assegnazione automatica**.

### Priorità
Trascina e rilascia i lavori nella coda per cambiare l'ordine. Un lavoro con **Alta priorità** salta davanti ai lavori normali.

## Avvio sfalsato — evitare picchi di corrente

Se avvii molte stampanti contemporaneamente, la fase di riscaldamento può causare un forte picco di corrente. L'avvio sfalsato distribuisce l'avvio:

**Come attivarlo:**
1. Vai su **Impostazioni → Flotta → Avvio sfalsato**
2. Attiva **Avvio distribuito**
3. Imposta il ritardo tra le stampanti (consigliato: 2–5 minuti)

**Esempio con 3 stampanti e 3 minuti di ritardo:**
```
ore 08:00 — Stampante 1 inizia il riscaldamento
ore 08:03 — Stampante 2 inizia il riscaldamento
ore 08:06 — Stampante 3 inizia il riscaldamento
```

:::tip Rilevante per la dimensione del fusibile
Una X1C consuma circa 1000W durante il riscaldamento. Tre stampanti contemporaneamente = 3000W, che può far scattare il fusibile da 16A. L'avvio sfalsato elimina il problema.
:::

## Gruppi di stampanti

I gruppi di stampanti ti permettono di organizzare le stampanti logicamente e inviare comandi all'intero gruppo:

**Creare un gruppo:**
1. Vai su **Impostazioni → Gruppi stampanti**
2. Clicca **+ Nuovo gruppo**
3. Dai un nome al gruppo (ad es. "Piano produzione", "Hobby")
4. Aggiungi le stampanti al gruppo

**Funzioni di gruppo:**
- Visualizza statistiche aggregate del gruppo
- Invia comando di pausa all'intero gruppo contemporaneamente
- Imposta la finestra di manutenzione per il gruppo

## Monitorare tutte le stampanti

### Visualizzazione multi-camera
Vai su **Flotta → Vista camera** per vedere tutti i feed della camera affiancati:

```
┌──────────────┐  ┌──────────────┐
│  X1C Feed    │  │  P1S Feed    │
│  [Live]      │  │  [Libera]    │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Feed     │  │  + Aggiungi  │
│  [Live]      │  │              │
└──────────────┘  └──────────────┘
```

### Notifiche per stampante
Puoi configurare diverse regole di notifica per diverse stampanti:
- Stampante di produzione: notifica sempre, anche di notte
- Stampante hobby: notifica solo di giorno

Vedi [Notifiche](./notification-setup) per la configurazione.

## Consigli per la gestione della flotta

- **Standardizza gli slot del filamento**: Tieni PLA bianco nello slot 1, PLA nero nello slot 2 su tutte le stampanti — rende più semplice la distribuzione dei lavori
- **Controlla i livelli AMS ogni giorno**: Vedi [Utilizzo quotidiano](./daily-use) per la routine mattutina
- **Manutenzione a rotazione**: Non fare manutenzione a tutte le stampanti contemporaneamente — tieni sempre almeno una attiva
- **Nomina i file chiaramente**: Nomi di file come `logo_x1c_pla_0.2mm.3mf` rendono facile scegliere la stampante giusta
