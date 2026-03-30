---
sidebar_position: 1
title: La tua prima stampa
description: Guida passo dopo passo per avviare la tua prima stampa 3D e monitorarla in Bambu Dashboard
---

# La tua prima stampa

Questa guida ti accompagna attraverso l'intero processo — da una stampante connessa a una stampa completata — con Bambu Dashboard come centro di controllo.

## Passo 1 — Verifica che la stampante sia connessa

Quando apri il dashboard, vedrai la scheda di stato della tua stampante in cima alla barra laterale o nel pannello panoramica.

**Stato verde** significa che la stampante è online e pronta.

| Stato | Colore | Significato |
|-------|--------|-------------|
| Online | Verde | Pronta per la stampa |
| Inattiva | Grigio | Connessa, ma non attiva |
| Stampa | Blu | Stampa in corso |
| Errore | Rosso | Richiede attenzione |

Se la stampante mostra stato rosso:
1. Verifica che la stampante sia accesa
2. Controlla che sia connessa alla stessa rete del dashboard
3. Vai su **Impostazioni → Stampanti** e conferma indirizzo IP e codice di accesso

:::tip Usa la modalità LAN per una risposta più rapida
La modalità LAN offre latenza inferiore rispetto alla modalità cloud. Abilitala nelle impostazioni della stampante se la stampante e il dashboard sono sulla stessa rete.
:::

## Passo 2 — Carica il tuo modello

Bambu Dashboard non avvia stampe direttamente — è compito di Bambu Studio o MakerWorld. Il dashboard subentra non appena la stampa inizia.

**Tramite Bambu Studio:**
1. Apri Bambu Studio sul tuo PC
2. Importa o apri il tuo file `.stl` o `.3mf`
3. Affetta il modello (seleziona filamento, supporti, riempimento ecc.)
4. Clicca **Stampa** in alto a destra

**Tramite MakerWorld:**
1. Trova il modello su [makerworld.com](https://makerworld.com)
2. Clicca **Stampa** direttamente dal sito
3. Bambu Studio si apre automaticamente con il modello pronto

## Passo 3 — Avvia la stampa

In Bambu Studio scegli il metodo di invio:

| Metodo | Requisiti | Vantaggi |
|--------|-----------|----------|
| **Cloud** | Account Bambu + internet | Funziona ovunque |
| **LAN** | Stessa rete | Più veloce, nessun cloud |
| **Scheda SD** | Accesso fisico | Nessun requisito di rete |

Clicca **Invia** — la stampante riceve il lavoro e inizia automaticamente la fase di riscaldamento.

:::info La stampa appare nel dashboard
Pochi secondi dopo che Bambu Studio invia il lavoro, la stampa attiva viene visualizzata nel dashboard sotto **Stampa attiva**.
:::

## Passo 4 — Monitora nel dashboard

Quando la stampa è in corso, il dashboard ti offre una panoramica completa:

### Avanzamento
- Percentuale completata e tempo rimanente stimato vengono mostrati sulla scheda stampante
- Clicca sulla scheda per la visualizzazione dettagliata con informazioni sui livelli

### Temperature
Il pannello dettagli mostra le temperature in tempo reale:
- **Ugello** — temperatura attuale e target
- **Piano di stampa** — temperatura attuale e target
- **Camera** — temperatura dell'aria all'interno della stampante (importante per ABS/ASA)

### Camera
Clicca sull'icona della camera sulla scheda stampante per vedere il feed live direttamente nel dashboard. Puoi tenere la camera aperta in una finestra separata mentre fai altro.

:::warning Controlla i primi strati
I primi 3–5 strati sono critici. Una cattiva adesione adesso significa una stampa fallita in seguito. Guarda la camera e verifica che il filamento si depositi in modo ordinato e uniforme.
:::

### Print Guard
Bambu Dashboard dispone di un **Print Guard** basato sull'IA che rileva automaticamente gli errori spaghetti e può mettere in pausa la stampa. Abilitalo sotto **Monitoraggio → Print Guard**.

## Passo 5 — Dopo che la stampa è completata

Quando la stampa è completata, il dashboard mostra un messaggio di completamento (e invia una notifica se hai configurato gli [avvisi](./notification-setup)).

### Controlla la cronologia
Vai su **Cronologia** nella barra laterale per vedere la stampa completata:
- Tempo totale di stampa
- Consumo di filamento (grammi usati, costo stimato)
- Errori o eventi HMS durante la stampa
- Immagine della camera al completamento (se abilitata)

### Aggiungi una nota
Clicca sulla stampa nella cronologia e aggiungi una nota — ad es. "Serviva un po' più di brim" o "Risultato perfetto". Questo è utile quando stampi di nuovo lo stesso modello.

### Controlla il consumo di filamento
Sotto **Filamento** puoi vedere che il peso della bobina è stato aggiornato in base a quanto è stato utilizzato. Il dashboard sottrae automaticamente.

## Consigli per i principianti

:::tip Non abbandonare la prima stampa
Segui i primi 10–15 minuti. Quando sei sicuro che la stampa aderisca bene, puoi lasciare che il dashboard monitori il resto.
:::

- **Pesa le bobine vuote** — inserisci il peso iniziale delle bobine per un calcolo preciso del residuo (vedi [Magazzino filamenti](./filament-setup))
- **Configura le notifiche Telegram** — ricevi una notifica quando la stampa è completata senza dover aspettare (vedi [Avvisi](./notification-setup))
- **Controlla il piano di stampa** — piano pulito = migliore adesione. Pulisci con IPA (isopropanolo) tra una stampa e l'altra
- **Usa il piano giusto** — vedi [Scegliere il piano di stampa corretto](./choosing-plate) per sapere cosa si adatta al tuo filamento
