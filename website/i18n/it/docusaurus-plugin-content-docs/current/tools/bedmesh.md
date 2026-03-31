---
sidebar_position: 6
title: Bed Mesh
description: Visualizzazione 3D della calibrazione planarità del piano di stampa con heatmap, scansione dall'interfaccia e guida alla calibrazione
---

# Bed Mesh

Lo strumento Bed Mesh ti offre una rappresentazione visiva della planarità del piano di stampa — fondamentale per una buona adesione e un primo strato uniforme.

Vai a: **https://localhost:3443/#bedmesh**

## Cos'è il bed mesh?

Le stampanti Bambu Lab eseguono la scansione della superficie del piano con una sonda e creano una mappa (mesh) delle variazioni di altezza. Il firmware della stampante compensa automaticamente le variazioni durante la stampa. 3DPrintForge visualizza questa mappa per te.

## Visualizzazione

### Superficie 3D

La mappa bed mesh viene mostrata come superficie 3D interattiva:

- Usa il mouse per ruotare la visualizzazione
- Scorri per ingrandire/ridurre
- Clicca **Vista dall'alto** per la vista a volo d'uccello
- Clicca **Vista laterale** per vedere il profilo

La scala colori mostra le variazioni rispetto all'altezza media:
- **Blu** — più basso del centro (concavo)
- **Verde** — approssimativamente piatto (< 0,1 mm di variazione)
- **Giallo** — variazione moderata (0,1–0,2 mm)
- **Rosso** — variazione elevata (> 0,2 mm)

### Heatmap

Clicca **Heatmap** per una visualizzazione 2D piatta della mappa mesh — più semplice da leggere per la maggior parte.

La heatmap mostra:
- Valori esatti delle variazioni (mm) per ogni punto di misurazione
- Punti problematici evidenziati (variazione > 0,3 mm)
- Dimensioni della griglia (numero di righe × colonne)

## Eseguire la scansione bed mesh dall'interfaccia

:::warning Requisiti
La scansione richiede che la stampante sia inattiva e la temperatura del piano sia stabilizzata. Preriscalda il piano alla temperatura desiderata PRIMA della scansione.
:::

1. Vai a **Bed Mesh**
2. Seleziona la stampante dall'elenco a discesa
3. Clicca **Scansiona ora**
4. Scegli la temperatura del piano per la scansione:
   - **Freddo** (temperatura ambiente) — rapido, ma meno accurato
   - **Caldo** (50–60°C PLA, 70–90°C PETG) — consigliato
5. Conferma nella finestra di dialogo — la stampante avvia automaticamente la sequenza di sonda
6. Attendi il completamento della scansione (3–8 minuti a seconda della dimensione mesh)
7. La nuova mappa mesh viene visualizzata automaticamente

## Guida alla calibrazione

Dopo la scansione, il sistema fornisce raccomandazioni concrete:

| Risultato | Raccomandazione |
|---|---|
| Variazione < 0,1 mm ovunque | Eccellente — nessuna azione necessaria |
| Variazione 0,1–0,2 mm | Buono — la compensazione è gestita dal firmware |
| Variazione > 0,2 mm negli angoli | Regola le molle del piano manualmente (se possibile) |
| Variazione > 0,3 mm | Il piano potrebbe essere danneggiato o montato male |
| Centro più alto degli angoli | Espansione termica — normale per piani caldi |

:::tip Confronto storico
Clicca **Confronta con precedente** per vedere se la mappa mesh è cambiata nel tempo — utile per rilevare una graduale deformazione del piano.
:::

## Cronologia mesh

Tutte le scansioni mesh vengono salvate con timestamp:

1. Clicca **Cronologia** nel pannello laterale bed mesh
2. Seleziona due scansioni per confrontarle (viene mostrata una mappa delle differenze)
3. Elimina le scansioni vecchie non più necessarie

## Esportazione

Esporta i dati mesh come:
- **PNG** — immagine della heatmap (per documentazione)
- **CSV** — dati grezzi con X, Y e variazione altezza per ogni punto
