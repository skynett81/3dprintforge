---
sidebar_position: 4
title: Tema
description: Personalizza l'aspetto di Bambu Dashboard con modalità chiara/scura/automatica, 6 palette colori e colore accent personalizzato
---

# Tema

Bambu Dashboard ha un sistema di temi flessibile che ti permette di personalizzare l'aspetto secondo i tuoi gusti e il contesto d'uso.

Vai a: **https://localhost:3443/#settings** → **Tema**

## Modalità colore

Scegli tra tre modalità:

| Modalità | Descrizione |
|---|---|
| **Chiara** | Sfondo chiaro, testo scuro — ottima in ambienti ben illuminati |
| **Scura** | Sfondo scuro, testo chiaro — predefinita e consigliata per il monitoraggio |
| **Auto** | Segue le impostazioni del sistema operativo (OS scuro/chiaro) |

Cambia modalità in cima alle impostazioni tema o tramite la scorciatoia nella barra di navigazione (icona luna/sole).

## Palette colori

Sei palette preimpostate disponibili:

| Palette | Colore primario | Stile |
|---|---|---|
| **Bambu** | Verde (#00C853) | Predefinita, ispirata a Bambu Lab |
| **Notte blu** | Blu (#2196F3) | Tranquilla e professionale |
| **Tramonto** | Arancione (#FF6D00) | Calda ed energica |
| **Viola** | Viola (#9C27B0) | Creativa e distintiva |
| **Rosso** | Rosso (#F44336) | Alto contrasto, visivamente impattante |
| **Monocromo** | Grigio (#607D8B) | Neutrale e minimalista |

Clicca su una palette per visualizzarla in anteprima e attivarla immediatamente.

## Colore accent personalizzato

Usa il tuo colore come colore accent:

1. Clicca **Colore personalizzato** sotto il selettore palette
2. Usa il selettore colore o inserisci un codice hex (es. `#FF5722`)
3. L'anteprima si aggiorna in tempo reale
4. Clicca **Applica** per attivare

:::tip Contrasto
Assicurati che il colore accent abbia un buon contrasto con lo sfondo. Il sistema avvisa se il colore potrebbe causare problemi di leggibilità (standard WCAG AA).
:::

## Arrotondamento

Regola l'arrotondamento di pulsanti, carte ed elementi:

| Impostazione | Descrizione |
|---|---|
| **Spigoloso** | Nessun arrotondamento (stile rettangolare) |
| **Piccolo** | Arrotondamento sottile (4 px) |
| **Medio** | Arrotondamento standard (8 px) |
| **Grande** | Arrotondamento pronunciato (16 px) |
| **Pillola** | Arrotondamento massimo (50 px) |

Trascina il cursore per regolare manualmente tra 0 e 50 px.

## Compattezza

Personalizza la densità dell'interfaccia:

| Impostazione | Descrizione |
|---|---|
| **Spaziosa** | Più spazio tra gli elementi |
| **Standard** | Equilibrata, impostazione predefinita |
| **Compatta** | Disposizione più densa — più informazioni sullo schermo |

La modalità compatta è consigliata per schermi sotto 1080p o per la visualizzazione kiosk.

## Tipografia

Scegli il carattere tipografico:

- **Sistema** — usa il carattere predefinito del sistema operativo (caricamento rapido)
- **Inter** — chiaro e moderno (scelta predefinita)
- **JetBrains Mono** — monospace, ottimo per valori numerici
- **Nunito** — stile più morbido e arrotondato

## Animazioni

Disattiva o personalizza le animazioni:

- **Completo** — tutte le transizioni e animazioni attive (predefinito)
- **Ridotto** — solo le animazioni necessarie (rispetta le preferenze del sistema operativo)
- **Off** — nessuna animazione per le massime prestazioni

:::tip Modalità kiosk
Per la visualizzazione kiosk, attiva **Compatto** + **Scuro** + **Animazioni ridotte** per prestazioni ottimali e leggibilità a distanza. Vedi [Modalità Kiosk](./kiosk).
:::

## Esportazione e importazione impostazioni tema

Condividi il tuo tema con altri:

1. Clicca **Esporta tema** — scarica un file `.json`
2. Condividi il file con altri utenti di Bambu Dashboard
3. Loro importano tramite **Importa tema** → seleziona il file
