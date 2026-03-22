---
sidebar_position: 8
title: Navigare nel dashboard
description: Impara a navigare in Bambu Dashboard — pannello laterale, pannelli, scorciatoie da tastiera e personalizzazione
---

# Navigare nel dashboard

Questa guida ti offre una rapida introduzione su come è organizzato il dashboard e come navigare in modo efficiente.

## Il pannello laterale

Il pannello laterale a sinistra è il tuo centro di navigazione. È organizzato in sezioni:

```
┌────────────────────┐
│ 🖨  Stato stampanti │  ← Una riga per stampante
├────────────────────┤
│ Panoramica         │
│ Flotta             │
│ Stampa attiva      │
├────────────────────┤
│ Filamento          │
│ Cronologia         │
│ Progetti           │
│ Coda               │
│ Pianificatore      │
├────────────────────┤
│ Monitoraggio       │
│  └ Print Guard     │
│  └ Errori          │
│  └ Diagnostica     │
│  └ Manutenzione    │
├────────────────────┤
│ Analisi            │
│ Strumenti          │
│ Integrazioni       │
│ Sistema            │
├────────────────────┤
│ ⚙ Impostazioni    │
└────────────────────┘
```

**Il pannello laterale può essere nascosto** cliccando sull'icona hamburger (☰) in alto a sinistra. Utile su schermi più piccoli o in modalità kiosk.

## Il pannello principale

Quando clicchi su un elemento nel pannello laterale, il contenuto viene visualizzato nel pannello principale a destra. Il layout varia:

| Pannello | Layout |
|---------|--------|
| Panoramica | Griglia di schede con tutte le stampanti |
| Stampa attiva | Scheda dettagliata grande + curve di temperatura |
| Cronologia | Tabella filtrabile |
| Filamento | Vista schede con bobine |
| Analisi | Grafici e diagrammi |

## Cliccare sullo stato stampante per i dettagli

La scheda stampante nel pannello panoramica è cliccabile:

**Click singolo** → Apre il pannello dettagli per quella stampante:
- Temperature in tempo reale
- Stampa attiva (se in corso)
- Stato AMS con tutti gli slot
- Ultimi errori ed eventi
- Pulsanti rapidi: Pausa, Stop, Luce on/off

**Click sull'icona camera** → Apre la visualizzazione camera live

**Click sull'icona ⚙** → Impostazioni stampante

## Scorciatoia da tastiera — tavolozza dei comandi

La tavolozza dei comandi dà accesso rapido a tutte le funzioni senza navigare:

| Scorciatoia | Azione |
|------------|--------|
| `Ctrl + K` (Linux/Windows) | Apri la tavolozza dei comandi |
| `Cmd + K` (macOS) | Apri la tavolozza dei comandi |
| `Esc` | Chiudi la tavolozza |

Nella tavolozza dei comandi puoi:
- Cercare pagine e funzioni
- Avviare una stampa direttamente
- Mettere in pausa / riprendere le stampe attive
- Cambiare tema (chiaro/scuro)
- Navigare verso qualsiasi pagina

**Esempio:** Premi `Ctrl+K`, digita "pausa" → seleziona "Metti in pausa tutte le stampe attive"

## Personalizzazione widget

Il pannello panoramica può essere personalizzato con i widget che scegli:

**Come modificare il dashboard:**
1. Clicca **Modifica layout** (icona matita) in alto a destra nel pannello panoramica
2. Trascina i widget nella posizione desiderata
3. Clicca e trascina l'angolo di un widget per ridimensionarlo
4. Clicca **+ Aggiungi widget** per aggiungerne di nuovi:

Widget disponibili:

| Widget | Mostra |
|--------|--------|
| Stato stampante | Schede per tutte le stampanti |
| Stampa attiva (grande) | Visualizzazione dettagliata della stampa in corso |
| Panoramica AMS | Tutti gli slot e i livelli di filamento |
| Curva temperatura | Grafico in tempo reale |
| Prezzo energia | Grafico dei prezzi per le prossime 24 ore |
| Contatore filamento | Consumo totale negli ultimi 30 giorni |
| Scorciatoia cronologia | Ultime 5 stampe |
| Feed camera | Immagine camera live |

5. Clicca **Salva layout**

:::tip Salva più layout
Puoi avere layout diversi per scopi diversi — uno compatto per l'uso quotidiano, uno grande per visualizzarlo su grande schermo. Passa da uno all'altro con il selettore di layout.
:::

## Tema — passare tra chiaro e scuro

**Cambio rapido:**
- Clicca sull'icona sole/luna in alto a destra nella navigazione
- Oppure: `Ctrl+K` → digita "tema"

**Impostazione permanente:**
1. Vai su **Sistema → Temi**
2. Scegli tra:
   - **Chiaro** — sfondo bianco
   - **Scuro** — sfondo scuro (consigliato di notte)
   - **Automatico** — segue le impostazioni del sistema sul tuo dispositivo
3. Scegli il colore accento (blu, verde, viola ecc.)
4. Clicca **Salva**

## Navigazione da tastiera

Per una navigazione efficiente senza mouse:

| Scorciatoia | Azione |
|------------|--------|
| `Tab` | Elemento interattivo successivo |
| `Shift+Tab` | Elemento precedente |
| `Enter` / `Space` | Attiva pulsante/link |
| `Esc` | Chiudi modale/dropdown |
| `Ctrl+K` | Tavolozza comandi |
| `Alt+1` – `Alt+9` | Naviga direttamente alle prime 9 pagine |

## PWA — installa come app

Bambu Dashboard può essere installato come progressive web app (PWA) e funzionare come app indipendente senza menu del browser:

1. Vai al dashboard in Chrome, Edge o Safari
2. Clicca sull'icona **Installa app** nella barra degli indirizzi
3. Conferma l'installazione

Vedi la [documentazione PWA](../system/pwa) per maggiori dettagli.

## Modalità kiosk

La modalità kiosk nasconde tutta la navigazione e mostra solo il dashboard — perfetta per uno schermo dedicato nell'officina di stampa:

1. Vai su **Sistema → Kiosk**
2. Attiva **Modalità kiosk**
3. Scegli quali widget visualizzare
4. Imposta l'intervallo di aggiornamento

Vedi la [documentazione kiosk](../system/kiosk) per la configurazione completa.
