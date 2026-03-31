---
sidebar_position: 6
title: Modalità Kiosk
description: Configura 3DPrintForge come schermo a parete o hub con modalità kiosk e rotazione automatica
---

# Modalità Kiosk

La modalità kiosk è progettata per schermi a parete, televisori o monitor dedicati che mostrano continuamente lo stato delle stampanti — senza tastiera, interazione con il mouse o UI del browser.

Vai a: **https://localhost:3443/#settings** → **Sistema → Kiosk**

## Cos'è la modalità kiosk

In modalità kiosk:
- Il menu di navigazione è nascosto
- Nessun controllo interattivo è visibile
- Il dashboard si aggiorna automaticamente
- Lo schermo ruota tra le stampanti (se configurato)
- Il timeout di inattività è disabilitato

## Attivare la modalità kiosk tramite URL

Aggiungi `?kiosk=true` all'URL per attivare la modalità kiosk senza modificare le impostazioni:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

La modalità kiosk si disattiva rimuovendo il parametro o aggiungendo `?kiosk=false`.

## Impostazioni kiosk

1. Vai a **Impostazioni → Sistema → Kiosk**
2. Configura:

| Impostazione | Valore predefinito | Descrizione |
|---|---|---|
| Vista predefinita | Panoramica Parco Macchine | Quale pagina viene mostrata |
| Intervallo rotazione | 30 secondi | Tempo per stampante nella rotazione |
| Modalità rotazione | Solo attive | Ruota solo tra le stampanti attive |
| Tema | Scuro | Consigliato per i display |
| Dimensione testo | Grande | Leggibile a distanza |
| Orologio | Off | Mostra l'orologio nell'angolo |

## Vista flotta per kiosk

La panoramica parco macchine è ottimizzata per kiosk:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Parametri per la vista flotta:
- `cols=N` — numero di colonne (1–6)
- `size=small|medium|large` — dimensione carta

## Rotazione stampante singola

Per la rotazione tra stampanti singole (una stampante alla volta):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — abilita la rotazione
- `interval=N` — secondi per stampante

## Configurazione su Raspberry Pi / NUC

Per hardware kiosk dedicato:

### Chromium in modalità kiosk (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Aggiungi il comando all'autostart (`~/.config/autostart/bambu-kiosk.desktop`).

### Accesso automatico e avvio

1. Configura l'accesso automatico nel sistema operativo
2. Crea una voce di autostart per Chromium
3. Disabilita il salvaschermo e il risparmio energetico:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Account dedicato
Crea un account 3DPrintForge dedicato con ruolo **Ospite** per il dispositivo kiosk. In questo modo il dispositivo ha solo accesso in lettura e non può modificare le impostazioni anche se qualcuno accede allo schermo.
:::

## Impostazioni hub

La modalità hub mostra una pagina di panoramica con tutte le stampanti e le statistiche chiave — progettata per grandi televisori:

```
https://localhost:3443/#hub?kiosk=true
```

La vista hub include:
- Griglia stampanti con stato
- Dati chiave aggregati (stampe attive, progresso totale)
- Orologio e data
- Ultimi avvisi HMS
