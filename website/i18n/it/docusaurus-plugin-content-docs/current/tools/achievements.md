---
sidebar_position: 5
title: Obiettivi
description: Sistema di gamification con obiettivi sbloccabili, livelli di rarità e traguardi per la stampa 3D con Bambu Lab
---

# Obiettivi

Gli obiettivi (achievements) sono un elemento di gamification che premia i traguardi e i momenti speciali del tuo percorso di stampa. Colleziona obiettivi e osserva i progressi verso il prossimo sblocco.

Vai a: **https://localhost:3443/#achievements**

## Livelli di rarità

Gli obiettivi sono classificati in quattro livelli di rarità:

| Livello | Colore | Descrizione |
|---|---|---|
| **Comune** | Grigio | Traguardi semplici, facili da raggiungere |
| **Insolito** | Verde | Richiede un po' di impegno o tempo |
| **Raro** | Blu | Richiede un impegno costante nel tempo |
| **Leggendario** | Oro | Imprese straordinarie |

## Esempi di obiettivi

### Traguardi di stampa (Comune / Insolito)
| Obiettivo | Requisito |
|---|---|
| Prima stampa | Completa la tua prima stampa |
| Un giorno intero | Stampa per più di 24 ore in totale |
| Alto tasso di successo | 10 stampe riuscite di fila |
| Collezionista di filamenti | Registra 10 tipi diversi di filamento |
| Multicolore | Completa una stampa multicolore |

### Obiettivi di volume (Insolito / Raro)
| Obiettivo | Requisito |
|---|---|
| Il chilogrammo | Usa 1 kg di filamento in totale |
| 10 kg | Usa 10 kg di filamento in totale |
| 100 stampe | 100 stampe riuscite |
| 500 ore | 500 ore accumulate di stampa |
| Turno notturno | Completa una stampa che dura più di 20 ore |

### Manutenzione e cura (Insolito / Raro)
| Obiettivo | Requisito |
|---|---|
| Diligente | Registra un'attività di manutenzione |
| Curatore della stampante | 10 attività di manutenzione registrate |
| Zero sprechi | Crea una stampa con >90% di efficienza materiale |
| Maestro ugelli | Sostituisci l'ugello 5 volte (documentato) |

### Obiettivi leggendari
| Obiettivo | Requisito |
|---|---|
| Instancabile | 1000 stampe riuscite |
| Titano del filamento | 50 kg totali di filamento consumato |
| Settimana senza errori | 7 giorni senza una singola stampa fallita |
| Bibliotecario della stampa | 100 modelli diversi nella libreria file |

## Visualizzare gli obiettivi

La pagina obiettivi mostra:

- **Sbloccati** — obiettivi raggiunti (con data)
- **Vicini** — obiettivi prossimi allo sblocco (barra di avanzamento)
- **Bloccati** — tutti gli obiettivi non ancora raggiunti

Filtra per **Rarità**, **Categoria** o **Stato** (sbloccato / in corso / bloccato).

## Barra di avanzamento

Per gli obiettivi con conteggio viene mostrata una barra di avanzamento:

```
Il chilogrammo — 1 kg filamento
[████████░░] 847 g / 1000 g (84,7 %)
```

## Notifiche

Ricevi una notifica automatica quando raggiungi un nuovo obiettivo:
- **Popup nel browser** con nome dell'obiettivo e grafica
- Opzionale: notifica tramite Telegram / Discord (configura in **Impostazioni → Notifiche → Obiettivi**)

## Supporto multi-utente

Nei sistemi con più utenti, ogni utente ha il proprio profilo obiettivi. Una **classifica** mostra il ranking per:

- Numero totale di obiettivi sbloccati
- Numero totale di stampe
- Ore totali di stampa

:::tip Modalità privata
Disattiva la classifica in **Impostazioni → Obiettivi → Nascondi dalla classifica** per mantenere il profilo privato.
:::
