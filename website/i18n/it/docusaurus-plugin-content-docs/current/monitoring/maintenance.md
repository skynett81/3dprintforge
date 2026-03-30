---
sidebar_position: 4
title: Manutenzione
description: Tieni traccia delle sostituzioni ugello, lubrificazione e altre attività di manutenzione con promemoria, intervalli e registro costi
---

# Manutenzione

Il modulo manutenzione ti aiuta a pianificare e tracciare tutta la manutenzione delle tue stampanti Bambu Lab — dalla sostituzione ugello alla lubrificazione delle guide.

Vai a: **https://localhost:3443/#maintenance**

## Piano di manutenzione

Bambu Dashboard include intervalli di manutenzione preconfigurati per tutti i modelli Bambu Lab:

| Attività | Intervallo (predefinito) | Modello |
|---|---|---|
| Pulizia ugello | Ogni 200 ore | Tutti |
| Sostituzione ugello (ottone) | Ogni 500 ore | Tutti |
| Sostituzione ugello (acciaio indurito) | Ogni 2000 ore | Tutti |
| Lubrifica asse X | Ogni 300 ore | X1C, P1S |
| Lubrifica asse Z | Ogni 300 ore | Tutti |
| Pulizia ingranaggi AMS | Ogni 200 ore | AMS |
| Pulizia camera | Ogni 500 ore | X1C |
| Sostituzione tubo PTFE | In base alle necessità / 1000 ore | Tutti |
| Calibrazione (completa) | Mensile | Tutti |

Tutti gli intervalli possono essere personalizzati per stampante.

## Registro sostituzioni ugello

1. Vai a **Manutenzione → Ugelli**
2. Clicca **Registra sostituzione ugello**
3. Compila:
   - **Data** — impostata automaticamente a oggi
   - **Materiale ugello** — Ottone / Acciaio Indurito / Rame / Rubino
   - **Diametro ugello** — 0,2 / 0,4 / 0,6 / 0,8 mm
   - **Marca/modello** — opzionale
   - **Prezzo** — per il registro costi
   - **Ore al momento della sostituzione** — recuperate automaticamente dal contatore ore
4. Clicca **Salva**

Il registro mostra tutta la cronologia ugelli ordinata per data.

:::tip Promemoria anticipato
Imposta **Avvisa X ore prima** (es. 50 ore) per ricevere un avviso in anticipo prima della prossima sostituzione consigliata.
:::

## Creare attività di manutenzione

1. Clicca **Nuova attività** (icona +)
2. Compila:
   - **Nome attività** — es. «Lubrifica asse Y»
   - **Stampante** — seleziona la stampante interessata
   - **Tipo intervallo** — Ore / Giorni / Numero stampe
   - **Intervallo** — es. 300 ore
   - **Ultima esecuzione** — indica quando è stata eseguita l'ultima volta (imposta data passata)
3. Clicca **Crea**

## Intervalli e promemoria

Per le attività attive viene mostrato:
- **Verde** — tempo al prossimo intervento > 50% dell'intervallo rimanente
- **Giallo** — tempo al prossimo intervento < 50% rimanente
- **Arancione** — tempo al prossimo intervento < 20% rimanente
- **Rosso** — manutenzione scaduta

### Configurare i promemoria

1. Clicca su un'attività → **Modifica**
2. Attiva **Promemoria**
3. Imposta **Avvisa quando** es. al 10% rimanente prima della scadenza
4. Seleziona il canale di notifica (vedi [Notifiche](../features/notifications))

## Segnare come completata

1. Trova l'attività nell'elenco
2. Clicca **Completata** (icona spunta)
3. L'intervallo viene reimpostato dalla data/ore odierne
4. Una voce nel registro viene creata automaticamente

## Registro costi

Tutte le attività di manutenzione possono avere un costo associato:

- **Parti** — ugelli, tubi PTFE, lubrificanti
- **Tempo** — ore impiegate × tariffa oraria
- **Servizio esterno** — riparazione a pagamento

I costi vengono sommati per stampante e visualizzati nel riepilogo statistiche.

## Cronologia manutenzione

Vai a **Manutenzione → Cronologia** per vedere:
- Tutte le attività di manutenzione eseguite
- Data, ore e costo
- Chi ha eseguito (in sistemi multi-utente)
- Commenti e note

Esporta la cronologia in CSV per scopi contabili.
