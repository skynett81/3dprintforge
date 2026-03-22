---
sidebar_position: 2
title: Registro Errori
description: Panoramica completa dei codici errore HMS dalle stampanti con livello di gravità, ricerca e link alla wiki Bambu
---

# Registro Errori

Il registro errori raccoglie tutti gli errori e gli avvisi HMS (Health, Maintenance, Safety) dalle tue stampanti. Bambu Dashboard dispone di un database integrato con oltre 269 codici HMS per le stampanti Bambu Lab.

Vai a: **https://localhost:3443/#errors**

## Codici HMS

Le stampanti Bambu Lab inviano codici HMS tramite MQTT quando qualcosa non va. Bambu Dashboard li traduce automaticamente in messaggi leggibili:

| Codice | Esempio | Categoria |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Ugello/Estrusore |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Piano di stampa |
| `0700 0500 0001 0001` | MC disconnect | Elettronica |

L'elenco completo copre tutti i 269+ codici noti per X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D e H2C.

## Livello di gravità

Gli errori sono classificati in quattro livelli:

| Livello | Colore | Descrizione |
|---|---|---|
| **Critico** | Rosso | Richiede intervento immediato — stampa interrotta |
| **Alto** | Arancione | Va gestito rapidamente — la stampa può continuare |
| **Medio** | Giallo | Va esaminato — nessun pericolo immediato |
| **Info** | Blu | Messaggio informativo, nessuna azione necessaria |

## Ricerca e filtri

Usa la barra degli strumenti in cima al registro errori:

1. **Ricerca testuale** — cerca nel messaggio, codice HMS o descrizione stampante
2. **Stampante** — mostra errori solo da una stampante
3. **Categoria** — AMS / Ugello / Piano / Elettronica / Calibrazione / Altro
4. **Gravità** — Tutti / Critico / Alto / Medio / Info
5. **Data** — filtra per intervallo di date
6. **Non confermati** — mostra solo gli errori non ancora confermati

Clicca **Azzera filtri** per vedere tutti gli errori.

## Link alla wiki

Per ogni codice HMS viene mostrato un link alla wiki di Bambu Lab con:

- Descrizione completa dell'errore
- Possibili cause
- Guida alla risoluzione passo per passo
- Raccomandazioni ufficiali di Bambu Lab

Clicca **Apri wiki** su un errore per aprire la pagina wiki pertinente in una nuova scheda.

:::tip Copia locale
Bambu Dashboard memorizza nella cache il contenuto wiki localmente per l'uso offline. Il contenuto viene aggiornato automaticamente ogni settimana.
:::

## Confermare gli errori

La conferma segna un errore come gestito senza eliminarlo:

1. Clicca su un errore nell'elenco
2. Clicca **Conferma** (icona spunta)
3. Aggiungi una nota opzionale su ciò che è stato fatto
4. L'errore viene contrassegnato con una spunta e spostato nell'elenco «Confermati»

### Conferma multipla

1. Seleziona più errori con le caselle di controllo
2. Clicca **Conferma selezionati**
3. Tutti gli errori selezionati vengono confermati contemporaneamente

## Statistiche

In cima al registro errori vengono mostrate:

- Numero totale di errori negli ultimi 30 giorni
- Numero di errori non confermati
- Codice HMS più frequente
- Stampante con più errori

## Esportazione

1. Clicca **Esporta** (icona download)
2. Seleziona il formato: **CSV** o **JSON**
3. Il filtro attivo viene applicato all'esportazione — imposta prima il filtro desiderato
4. Il file viene scaricato automaticamente

## Notifiche per nuovi errori

Abilita le notifiche per nuovi errori HMS:

1. Vai a **Impostazioni → Notifiche**
2. Spunta **Nuovi errori HMS**
3. Scegli la gravità minima per la notifica (consigliato: **Alto** e superiore)
4. Seleziona il canale di notifica

Vedi [Notifiche](../funksjoner/notifications) per la configurazione dei canali.
