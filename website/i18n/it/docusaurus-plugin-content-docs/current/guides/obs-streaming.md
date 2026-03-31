---
sidebar_position: 10
title: Streaming con OBS
description: Configura 3DPrintForge come overlay in OBS Studio per uno streaming professionale della stampa 3D
---

# Streaming della stampa 3D con OBS

3DPrintForge ha un overlay OBS integrato che mostra lo stato della stampante, l'avanzamento, le temperature e il feed della camera direttamente nel tuo stream.

## Prerequisiti

- OBS Studio installato ([obsproject.com](https://obsproject.com))
- 3DPrintForge in esecuzione e connesso alla stampante
- (Opzionale) Camera Bambu attivata per il feed live

## Passo 1 — OBS Browser Source

OBS ha una **Browser Source** integrata che mostra una pagina web direttamente nella tua scena.

**Aggiungere l'overlay in OBS:**

1. Apri OBS Studio
2. Sotto **Sorgenti** (Sources), clicca **+**
3. Seleziona **Browser**
4. Dai un nome alla sorgente, ad es. "Bambu Overlay"
5. Compila:

| Impostazione | Valore |
|-------------|--------|
| URL | `http://localhost:3000/obs/overlay` |
| Larghezza | `1920` |
| Altezza | `1080` |
| FPS | `30` |
| CSS personalizzato | Vedi sotto |

6. Spunta **Controlla audio tramite OBS**
7. Clicca **OK**

:::info Adatta l'URL al tuo server
Il dashboard è in esecuzione su un'altra macchina rispetto a OBS? Sostituisci `localhost` con l'indirizzo IP del server, ad es. `http://192.168.1.50:3000/obs/overlay`
:::

## Passo 2 — Sfondo trasparente

Perché l'overlay si integri nell'immagine lo sfondo deve essere trasparente:

**Nelle impostazioni OBS Browser Source:**
- Spunta **Rimuovi sfondo** (Shutdown source when not visible / Remove background)

**CSS personalizzato per forzare la trasparenza:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Incolla questo nel campo **CSS personalizzato** nelle impostazioni Browser Source.

L'overlay ora mostra solo il widget stesso — senza sfondo bianco o nero.

## Passo 3 — Personalizzare l'overlay

In 3DPrintForge puoi configurare cosa mostra l'overlay:

1. Vai su **Funzioni → Overlay OBS**
2. Configura:

| Impostazione | Opzioni |
|-------------|---------|
| Posizione | In alto a sinistra, destra, in basso a sinistra, destra |
| Dimensione | Piccola, media, grande |
| Tema | Scuro, chiaro, trasparente |
| Colore accento | Scegli un colore che si adatta allo stile del tuo stream |
| Elementi | Scegli cosa visualizzare (vedi sotto) |

**Elementi overlay disponibili:**

- Nome stampante e stato (online/stampa/errore)
- Barra di avanzamento con percentuale e tempo rimanente
- Filamento e colore
- Temperatura ugello e temperatura piano
- Filamento usato (grammi)
- Panoramica AMS (compatta)
- Stato Print Guard

3. Clicca **Anteprima** per vedere il risultato senza passare a OBS
4. Clicca **Salva**

:::tip URL per stampante
Hai più stampanti? Usa URL overlay separati:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## Feed camera in OBS (sorgente separata)

La camera Bambu può essere aggiunta come sorgente separata in OBS — indipendente dall'overlay:

**Alternativa 1: Tramite il proxy camera del dashboard**

1. Vai su **Sistema → Camera**
2. Copia l'**URL dello streaming RTSP o MJPEG**
3. In OBS: Clicca **+** → **Sorgente multimediale** (Media Source)
4. Incolla l'URL
5. Spunta **Loop** e disattiva i file locali

**Alternativa 2: Browser Source con visualizzazione camera**

1. In OBS: Aggiungi **Browser Source**
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Larghezza/altezza: corrisponde alla risoluzione della camera (1080p o 720p)

Ora puoi posizionare liberamente il feed della camera nella scena e sovrapporre l'overlay.

## Consigli per uno stream di qualità

### Setup per la scena stream

Una scena tipica per lo streaming della stampa 3D:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Feed camera dalla stampante]      │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← In basso a sx │
│  │ Stampa: Logo.3mf │                  │
│  │ ████████░░ 82%   │                  │
│  │ 1h 24m rimanenti │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Impostazioni consigliate

| Parametro | Valore consigliato |
|-----------|-------------------|
| Dimensione overlay | Media (non troppo dominante) |
| Frequenza aggiornamento | 30 FPS (corrisponde a OBS) |
| Posizione overlay | In basso a sinistra (evita viso/chat) |
| Tema colore | Scuro con accento blu |

### Scene e cambio scena

Crea scene OBS personalizzate:

- **"Stampa in corso"** — vista camera + overlay
- **"Pausa / in attesa"** — immagine statica + overlay
- **"Completato"** — immagine del risultato + overlay che mostra "Completato"

Passa tra le scene con la scorciatoia da tastiera in OBS o tramite Scene Collection.

### Stabilizzazione dell'immagine camera

La camera Bambu a volte può bloccarsi. Nel dashboard sotto **Sistema → Camera**:
- Attiva **Auto-reconnect** — il dashboard si riconnette automaticamente
- Imposta l'**intervallo di riconnessione** a 10 secondi

### Audio

Le stampanti 3D fanno rumore — soprattutto AMS e raffreddamento. Considera:
- Posiziona il microfono lontano dalla stampante
- Aggiungi un filtro rumore al microfono in OBS (Noise Suppression)
- Oppure usa musica di sottofondo / audio della chat

:::tip Cambio scena automatico
OBS ha supporto integrato per il cambio scena basato sui titoli. Combina con un Plugin (ad es. obs-websocket) e l'API di 3DPrintForge per cambiare scena automaticamente quando la stampa inizia e si ferma.
:::
