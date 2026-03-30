---
sidebar_position: 4
title: Lubrificazione
description: Lubrificazione di guide lineari, cuscinetti e intervalli per le stampanti Bambu Lab
---

# Lubrificazione

Una lubrificazione corretta delle parti mobili riduce l'usura, abbassa il livello di rumore e garantisce un movimento preciso. Le stampanti Bambu Lab usano sistemi di movimento lineare che richiedono una lubrificazione periodica.

## Tipi di lubrificazione

| Componente | Tipo lubrificazione | Prodotto |
|-----------|-------------|---------|
| Guide lineari (XY) | Olio leggero per macchine o spray PTFE | 3-in-1, Super Lube |
| Vite a ricircolo asse Z | Grasso denso | Super Lube grasso |
| Cuscinetti lineari | Grasso leggero al litio | Bambu Lab grease |
| Cerniere catena portacavi | Nessuna (a secco) | — |

## Guide lineari

### Assi X e Y
Le guide sono barre d'acciaio temprate che scorrono attraverso cuscinetti lineari:

```
Intervallo: Ogni 200–300 ore, o in caso di rumori cigolanti
Quantità: Pochissima — una goccia per punto di guida è sufficiente
Metodo:
1. Spegni la stampante
2. Sposta manualmente il carrello all'estremità
3. Applica 1 goccia di olio leggero al centro della guida
4. Sposta lentamente il carrello avanti e indietro 10 volte
5. Rimuovi l'olio in eccesso con carta priva di pelucchi
```

:::warning Non lubrificare eccessivamente
Troppo olio attira polvere e crea una pasta abrasiva. Usa quantità minime e rimuovi sempre l'eccesso.
:::

### Asse Z (verticale)
L'asse Z usa una vite a ricircolo (leadscrew) che richiede grasso (non olio):

```
Intervallo: Ogni 200 ore
Metodo:
1. Spegni la stampante
2. Applica uno strato sottile di grasso lungo la vite a ricircolo
3. Fai scorrere l'asse Z su e giù manualmente (o tramite il menu manutenzione)
4. Il grasso si distribuisce automaticamente
```

## Cuscinetti lineari

Le stampanti Bambu Lab P1S e X1C usano cuscinetti lineari (MGN12) sull'asse Y:

```
Intervallo: Ogni 300–500 ore
Metodo:
1. Rimuovi un po' di grasso con un ago o stuzzicadenti dall'apertura di ingresso
2. Inietta nuovo grasso con una siringa e cannula sottile
3. Fai scorrere l'asse avanti e indietro per distribuire il grasso
```

Bambu Lab vende grasso lubrificante ufficiale (Bambu Lubricant) calibrato per il sistema.

## Manutenzione lubrificazione per i vari modelli

### X1C / P1S
- Asse Y: Cuscinetti lineari — grasso Bambu
- Asse X: Guide in carbonio — olio leggero
- Asse Z: Doppia vite a ricircolo — grasso Bambu

### A1 / A1 Mini
- Tutti gli assi: Barre d'acciaio — olio leggero
- Asse Z: Vite a ricircolo singola — grasso Bambu

## Segnali che la lubrificazione è necessaria

- **Rumori cigolanti o stridenti** durante il movimento
- **Pattern di vibrazione** visibili sulle pareti verticali (VFA)
- **Dimensioni imprecise** senza altre cause
- **Aumento del livello sonoro** dal sistema di movimento

## Intervalli di lubrificazione

| Attività | Intervallo |
|-----------|---------|
| Olio guide XY | Ogni 200–300 ore |
| Grasso vite Z | Ogni 200 ore |
| Grasso cuscinetti lineari (X1C/P1S) | Ogni 300–500 ore |
| Ciclo completo manutenzione | Semestrale (o 500 ore) |

Usa il modulo manutenzione nel dashboard per tracciare automaticamente gli intervalli.
