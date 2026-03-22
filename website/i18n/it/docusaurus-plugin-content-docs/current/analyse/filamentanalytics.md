---
sidebar_position: 3
title: Analisi Filamento
description: Analisi dettagliata del consumo di filamento, costi, previsioni, tassi di consumo e sprechi per materiale e fornitore
---

# Analisi Filamento

L'Analisi Filamento ti fornisce una visione completa del tuo consumo di filamento — cosa usi, quanto costa e dove puoi risparmiare.

Vai a: **https://localhost:3443/#filament-analytics**

## Panoramica Consumo

In cima viene mostrato un riepilogo per il periodo selezionato:

- **Consumo totale** — grammi e metri per tutti i materiali
- **Costo stimato** — basato sul prezzo registrato per bobina
- **Materiale più usato** — tipo e fornitore
- **Tasso di riutilizzo** — percentuale di filamento nel modello effettivo rispetto a supporti/purge

### Consumo per Materiale

Grafico a torta e tabella mostrano la distribuzione tra i materiali:

| Colonna | Descrizione |
|---|---|
| Materiale | PLA, PETG, ABS, PA, ecc. |
| Fornitore | Bambu Lab, PolyMaker, Prusament, ecc. |
| Grammi usati | Peso totale |
| Metri | Lunghezza stimata |
| Costo | Grammi × prezzo per grammo |
| Stampe | Numero di stampe con questo materiale |

Clicca su una riga per scendere al livello delle singole bobine.

## Tassi di Consumo

Il tasso di consumo mostra il consumo medio di filamento per unità di tempo:

- **Grammi per ora** — durante la stampa attiva
- **Grammi per settimana** — incluso il tempo di inattività della stampante
- **Grammi per stampa** — media per stampa

Questi vengono utilizzati per calcolare le previsioni delle esigenze future.

:::tip Pianificazione acquisti
Usa il tasso di consumo per pianificare le scorte di bobine. Il sistema avvisa automaticamente quando le scorte stimate si esauriranno entro 14 giorni (configurabile).
:::

## Previsione Costi

In base al tasso di consumo storico viene calcolato:

- **Consumo stimato nei prossimi 30 giorni** (grammi per materiale)
- **Costo stimato nei prossimi 30 giorni**
- **Scorta consigliata** (sufficiente per 30 / 60 / 90 giorni di operatività)

La previsione tiene conto delle variazioni stagionali se disponi di dati per almeno un anno.

## Spreco ed Efficienza

Vedi [Monitoraggio Sprechi](./waste) per la documentazione completa. L'Analisi Filamento mostra un riepilogo:

- **Purge AMS** — grammi e percentuale del consumo totale
- **Materiale di supporto** — grammi e percentuale
- **Materiale effettivo del modello** — percentuale rimanente (efficienza %)
- **Costo stimato dello spreco** — quanto ti costa lo spreco

## Registro Bobine

Tutte le bobine (attive e vuote) sono registrate:

| Campo | Descrizione |
|---|---|
| Nome bobina | Nome materiale e colore |
| Peso originale | Peso registrato all'avvio |
| Peso rimanente | Peso rimanente calcolato |
| Usato | Grammi usati in totale |
| Ultimo utilizzo | Data dell'ultima stampa |
| Stato | Attiva / Vuota / In magazzino |

## Registrazione Prezzi

Per un'analisi dei costi accurata, registra i prezzi per bobina:

1. Vai a **Magazzino Filamento**
2. Clicca su una bobina → **Modifica**
3. Inserisci **Prezzo d'acquisto** e **Peso all'acquisto**
4. Il sistema calcola automaticamente il prezzo per grammo

Le bobine senza prezzo registrato usano il **prezzo standard per grammo** (impostato in **Impostazioni → Filamento → Prezzo standard**).

## Esportazione

1. Clicca su **Esporta dati filamento**
2. Seleziona periodo e formato (CSV / PDF)
3. Il CSV include una riga per stampa con grammi, costo e materiale
