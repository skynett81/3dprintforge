---
sidebar_position: 2
title: Prezzo Energia
description: Collegati a Tibber o Nordpool per prezzi orari live, storico prezzi e avvisi di prezzo
---

# Prezzo Energia

L'integrazione Prezzo Energia recupera i prezzi dell'energia elettrica in tempo reale da Tibber o Nordpool per fornire calcoli accurati dei costi energetici per stampa e avvisi sulle ore di stampa convenienti o costose.

Vai a: **https://localhost:3443/#settings** → **Integrazioni → Prezzo Energia**

## Integrazione Tibber

Tibber è un fornitore di energia con API aperta per i prezzi spot.

### Configurazione

1. Accedi a [developer.tibber.com](https://developer.tibber.com)
2. Genera un **Personal Access Token**
3. In Bambu Dashboard: incolla il token in **Token API Tibber**
4. Seleziona la **Casa** (da cui recuperare i prezzi, se ne hai più di una)
5. Clicca su **Test connessione**
6. Clicca su **Salva**

### Dati Disponibili da Tibber

- **Prezzo spot ora** — prezzo istantaneo incluse le tasse (€/kWh)
- **Prezzi per le prossime 24 ore** — Tibber fornisce i prezzi del giorno successivo da circa le 13:00
- **Storico prezzi** — fino a 30 giorni indietro
- **Costo per stampa** — calcolato in base al tempo di stampa effettivo × prezzi orari

## Integrazione Nordpool

Nordpool è la borsa energetica che fornisce prezzi spot grezzi per il nord Europa.

### Configurazione

1. Vai a **Integrazioni → Nordpool**
2. Seleziona la **Zona prezzi**: IT-Nord / IT-Sud / IT-Sicilia / IT-Sardo / ecc.
3. Seleziona la **Valuta**: EUR
4. Seleziona **Tasse e oneri**:
   - Spunta **Includi IVA** (22%)
   - Inserisci **Oneri di rete** (€/kWh) — vedi la bolletta del tuo fornitore di rete
   - Inserisci **Accisa energia** (€/kWh)
5. Clicca su **Salva**

:::info Oneri di rete
Gli oneri di rete variano in base al gestore e al modello di prezzo. Controlla la tua ultima bolletta dell'energia per l'aliquota corretta.
:::

## Prezzi Orari

I prezzi orari vengono mostrati come grafico a barre per le prossime 24–48 ore:

- **Verde** — ore economiche (sotto la media)
- **Giallo** — prezzo medio
- **Rosso** — ore costose (sopra la media)
- **Grigio** — ore senza previsione di prezzo disponibile

Passa il mouse sopra un'ora per vedere il prezzo esatto (€/kWh).

## Storico Prezzi

Vai a **Prezzo Energia → Storico** per vedere:

- Prezzo medio giornaliero degli ultimi 30 giorni
- Ora più costosa e più economica per giorno
- Costo totale elettricità per stampe al giorno

## Avvisi di Prezzo

Configura avvisi automatici basati sul prezzo dell'energia:

1. Vai a **Prezzo Energia → Avvisi di prezzo**
2. Clicca su **Nuovo avviso**
3. Seleziona il tipo di avviso:
   - **Prezzo sotto soglia** — avvisa quando il prezzo scende sotto X €/kWh
   - **Prezzo sopra soglia** — avvisa quando il prezzo supera X €/kWh
   - **Ora più economica oggi** — avvisa quando inizia l'ora più economica del giorno
4. Seleziona il canale di notifica
5. Clicca su **Salva**

:::tip Pianificazione intelligente
Combina gli avvisi di prezzo con la coda di stampa: configura un'automazione che invia automaticamente i lavori dalla coda quando il prezzo dell'energia è basso (richiede l'integrazione webhook o Home Assistant).
:::

## Prezzo Energia nel Calcolatore Costi

L'integrazione prezzo energia attivata fornisce costi energetici accurati nel [Calcolatore Costi](../analytics/costestimator). Seleziona **Prezzo live** invece di un prezzo fisso per usare il prezzo Tibber/Nordpool attuale.
