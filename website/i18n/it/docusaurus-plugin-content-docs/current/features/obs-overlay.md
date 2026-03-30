---
sidebar_position: 4
title: Overlay OBS
description: Aggiungi un overlay di stato trasparente per la tua stampante Bambu Lab direttamente in OBS Studio
---

# Overlay OBS

L'overlay OBS ti permette di mostrare lo stato in tempo reale della stampante direttamente in OBS Studio — perfetto per lo streaming live o la registrazione della stampa 3D.

## URL Overlay

L'overlay è disponibile come pagina web con sfondo trasparente:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

Sostituisci `PRINTER_ID` con l'ID della stampante (si trova in **Impostazioni → Stampanti**).

### Parametri Disponibili

| Parametro | Valore predefinito | Descrizione |
|---|---|---|
| `printer` | prima stampante | ID stampante da mostrare |
| `theme` | `dark` | `dark`, `light` o `minimal` |
| `scale` | `1.0` | Scala (0,5–2,0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Opacità (0,0–1,0) |
| `fields` | tutti | Lista separata da virgole: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Colore accento (hex) |

**Esempio con parametri:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## Configurazione in OBS Studio

### Passo 1: Aggiungi sorgente browser

1. Apri OBS Studio
2. Clicca su **+** sotto **Sorgenti**
3. Seleziona **Browser** (Browser Source)
4. Assegna un nome alla sorgente, ad es. `Bambu Overlay`
5. Clicca su **OK**

### Passo 2: Configura la sorgente browser

Compila la finestra di impostazioni con:

| Campo | Valore |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=IL_TUO_ID` |
| Larghezza | `400` |
| Altezza | `200` |
| FPS | `30` |
| CSS personalizzato | *(lascia vuoto)* |

Spunta:
- ✅ **Chiudi sorgente quando non visibile**
- ✅ **Aggiorna browser quando la scena è attivata**

:::warning HTTPS e localhost
OBS potrebbe avvisare del certificato auto-firmato. Prima vai su `https://localhost:3443` in Chrome/Firefox e accetta il certificato. OBS userà poi la stessa approvazione.
:::

### Passo 3: Sfondo trasparente

L'overlay è costruito con `background: transparent`. Perché funzioni in OBS:

1. **Non** spuntare **Colore di sfondo personalizzato** nella sorgente browser
2. Assicurati che l'overlay non sia racchiuso in un elemento opaco
3. Imposta eventualmente la **Modalità di fusione** su **Normale** sulla sorgente in OBS

:::tip Alternativa: Chroma key
Se la trasparenza non funziona, usa il filtro → **Chroma Key** con sfondo verde:
Aggiungi `&bg=green` all'URL e imposta il filtro chroma key sulla sorgente in OBS.
:::

## Cosa Viene Mostrato nell'Overlay

L'overlay standard contiene:

- **Barra di avanzamento** con valore percentuale
- **Tempo rimanente** (stimato)
- **Temperatura ugello** e **temperatura piano**
- **Slot AMS attivo** con colore e nome filamento
- **Modello stampante** e nome (può essere disattivato)

## Modalità Minimale per lo Streaming

Per un overlay discreto durante lo streaming:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Mostra solo una piccola barra di avanzamento con il tempo rimanente nell'angolo.
