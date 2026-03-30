---
sidebar_position: 3
title: Diagnostica
description: Punteggio di salute, grafici telemetria, visualizzazione bed mesh e monitoraggio dei componenti per stampanti Bambu Lab
---

# Diagnostica

La pagina Diagnostica offre una panoramica approfondita della salute, delle prestazioni e delle condizioni della stampante nel tempo.

Vai a: **https://localhost:3443/#diagnostics**

## Punteggio di salute

Ogni stampante calcola un **punteggio di salute** da 0 a 100 basato su:

| Fattore | Peso | Descrizione |
|---|---|---|
| Tasso di successo (30gg) | 30 % | Percentuale di stampe riuscite negli ultimi 30 giorni |
| Usura componenti | 25 % | Usura media sui componenti critici |
| Errori HMS (30gg) | 20 % | Numero e gravità degli errori |
| Stato calibrazione | 15 % | Tempo dall'ultima calibrazione |
| Stabilità temperatura | 10 % | Deviazione dalla temperatura target durante la stampa |

**Interpretazione del punteggio:**
- 🟢 80–100 — Condizione eccellente
- 🟡 60–79 — Buona, ma qualcosa va esaminato
- 🟠 40–59 — Prestazioni ridotte, manutenzione consigliata
- 🔴 0–39 — Critico, manutenzione necessaria

:::tip Storico
Clicca sul grafico di salute per vedere l'andamento del punteggio nel tempo. Cali improvvisi possono indicare un evento specifico.
:::

## Grafici telemetria

La sezione telemetria mostra grafici interattivi per tutti i valori dei sensori:

### Dataset disponibili

- **Temperatura ugello** — reale vs. target
- **Temperatura piano** — reale vs. target
- **Temperatura camera** — temperatura ambiente all'interno della macchina
- **Motore estrusore** — consumo corrente e temperatura
- **Velocità ventole** — testina, camera, AMS
- **Pressione** (X1C) — pressione camera per AMS
- **Accelerazione** — dati vibrazione (ADXL345)

### Navigare nei grafici

1. Seleziona il **Periodo di tempo**: Ultima ora / 24 ore / 7 giorni / 30 giorni / Personalizzato
2. Seleziona la **Stampante** dall'elenco a discesa
3. Seleziona i **Dataset** da visualizzare (selezione multipla supportata)
4. Scorri per ingrandire la timeline
5. Clicca e trascina per scorrere
6. Doppio clic per reimpostare lo zoom

### Esportare i dati telemetria

1. Clicca **Esporta** sul grafico
2. Seleziona il formato: **CSV**, **JSON** o **PNG** (immagine)
3. Il periodo di tempo e i dataset selezionati vengono esportati

## Bed Mesh

La visualizzazione bed mesh mostra la calibrazione della planarità del piano di stampa:

1. Vai a **Diagnostica → Bed Mesh**
2. Seleziona la stampante
3. L'ultimo mesh è mostrato come superficie 3D e heatmap:
   - **Blu** — più basso del centro (concavo)
   - **Verde** — approssimativamente piatto
   - **Rosso** — più alto del centro (convesso)
4. Passa il cursore su un punto per vedere la deviazione esatta in mm

### Eseguire la scansione bed mesh dall'interfaccia

1. Clicca **Scansiona ora** (richiede che la stampante sia inattiva)
2. Conferma nella finestra di dialogo — la stampante avvia la calibrazione automaticamente
3. Attendi il completamento della scansione (circa 3–5 minuti)
4. Il nuovo mesh viene visualizzato automaticamente

:::warning Preriscalda prima
Il bed mesh va eseguito con il piano riscaldato (50–60°C per PLA) per una calibrazione accurata.
:::

## Usura dei componenti

Vedi [Predizione Usura](./wearprediction) per la documentazione dettagliata.

La pagina Diagnostica mostra un riepilogo compatto:
- Punteggio percentuale per componente
- Prossima manutenzione consigliata
- Clicca **Dettagli** per l'analisi completa dell'usura
