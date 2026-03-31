---
sidebar_position: 1
title: Benvenuto in 3DPrintForge
description: Un potente dashboard self-hosted per le stampanti 3D Bambu Lab
---

# Benvenuto in 3DPrintForge

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge** è un pannello di controllo self-hosted e completo per le stampanti 3D Bambu Lab. Offre visibilità e controllo completi sulla stampante, sull'inventario dei filamenti, sulla cronologia di stampa e altro ancora — tutto da un'unica scheda del browser.

## Cos'è 3DPrintForge?

3DPrintForge si connette direttamente alla tua stampante tramite MQTT su LAN, senza dipendenza dai server di Bambu Lab. Puoi anche connetterti a Bambu Cloud per la sincronizzazione di modelli e cronologia di stampa.

### Funzionalità principali

- **Dashboard live** — temperatura in tempo reale, avanzamento, fotocamera, stato AMS con indicatore LIVE
- **Inventario filamenti** — traccia tutte le bobine con sincronizzazione AMS, supporto bobina EXT, info materiale, compatibilità piano e guida all'essiccazione
- **Tracciamento filamenti** — tracciamento accurato con 4 livelli di fallback (sensore AMS → stima EXT → cloud → durata)
- **Guida materiali** — 15 materiali con temperature, compatibilità piano, essiccazione, proprietà e consigli
- **Cronologia di stampa** — registro completo con nomi dei modelli, link MakerWorld, consumo di filamento e costi
- **Pianificatore** — vista calendario, coda di stampa con bilanciamento del carico e verifica del filamento
- **Controllo stampante** — temperatura, velocità, ventole, console G-code
- **Print Guard** — protezione automatica con xcam + 5 monitor sensori
- **Stimatore costi** — materiale, elettricità, manodopera, usura, margine con prezzo di vendita suggerito
- **Manutenzione** — tracciamento con intervalli basati su KB, durata dell'ugello, durata del piano e guida
- **Avvisi sonori** — 9 eventi configurabili con caricamento audio personalizzato e altoparlante della stampante (M300)
- **Registro attività** — timeline persistente di tutti gli eventi (stampe, errori, manutenzione, filamento)
- **Notifiche** — 7 canali (Telegram, Discord, e-mail, ntfy, Pushover, SMS, webhook)
- **Multi-stampante** — supporta l'intera gamma Bambu Lab
- **17 lingue** — norvegese, inglese, tedesco, francese, spagnolo, italiano, giapponese, coreano, olandese, polacco, portoghese, svedese, turco, ucraino, cinese, ceco, ungherese
- **Self-hosted** — nessuna dipendenza dal cloud, i tuoi dati sulla tua macchina

### Novità della v1.1.14

- **Integrazione AdminLTE 4** — ristrutturazione HTML completa con sidebar treeview, layout moderno e supporto CSP per CDN
- **Sistema CRM** — gestione completa dei clienti con 4 pannelli: clienti, ordini, fatture e impostazioni aziendali con integrazione dello storico
- **UI moderna** — accento teal, titoli a gradiente, bagliore hover, sfere fluttuanti e tema scuro migliorato
- **Achievements: 18 monumenti** — nave vichinga, Statua della Libertà, Eiffel Tower, Big Ben, Porta di Brandeburgo, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, mulino a vento olandese, Drago di Wawel, Cristo Redentor, Turning Torso, Hagia Sophia, La Madre Patria, Grande Muraglia Cinese, Orologio Astronomico di Praga, Parlamento di Budapest — con popup dettagli, XP e rarità
- **Umidità/temperatura AMS** — valutazione a 5 livelli con raccomandazioni per conservazione e essiccazione
- **Tracciamento filamento in tempo reale** — aggiornamento in tempo reale durante la stampa tramite fallback stima cloud
- **Redesign della sezione filamento** — bobine grandi con info complete (marca, peso, temperatura, RFID, colore), layout orizzontale e clic per i dettagli
- **Bobina EXT inline** — bobina esterna visualizzata insieme alle bobine AMS con miglior utilizzo dello spazio
- **Layout del dashboard ottimizzato** — 2 colonne predefinite per monitor 24–27", grande vista 3D/fotocamera, filamento/AMS compatto
- **Tempo di cambio filamento** nello stimatore costi con contatore di cambi visibile
- **Sistema di avvisi globale** — barra di avviso con notifiche toast in basso a destra, non blocca la navbar
- **Tour guidato i18n** — tutte le 14 chiavi del tour tradotte in 17 lingue
- **5 nuove pagine KB** — matrice di compatibilità e nuove guide ai filamenti tradotte in 17 lingue
- **i18n completo** — tutte le 3252 chiavi tradotte in 17 lingue, inclusi CRM e achievement dei monumenti

## Avvio rapido

| Attività | Collegamento |
|----------|-------------|
| Installa il dashboard | [Installazione](./getting-started/installation) |
| Configura la prima stampante | [Configurazione](./getting-started/setup) |
| Connetti a Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| Esplora tutte le funzionalità | [Funzionalità](./features/overview) |
| Guida filamenti | [Guida materiali](./kb/filaments/guide) |
| Guida alla manutenzione | [Manutenzione](./kb/maintenance/nozzle) |
| Documentazione API | [API](./advanced/api) |

:::tip Modalità demo
Puoi provare il dashboard senza una stampante fisica eseguendo `npm run demo`. Questo avvia 3 stampanti simulate con cicli di stampa in tempo reale.
:::

## Stampanti supportate

Tutte le stampanti Bambu Lab con modalità LAN:

- **Serie X1**: X1C, X1C Combo, X1E
- **Serie P1**: P1S, P1S Combo, P1P
- **Serie P2**: P2S, P2S Combo
- **Serie A**: A1, A1 Combo, A1 mini
- **Serie H2**: H2S, H2D (doppio ugello), H2C (cambiatesta, 6 teste)

## Funzionalità in dettaglio

### Tracciamento filamenti

Il dashboard traccia automaticamente il consumo di filamento con un fallback a 4 livelli:

1. **Diff sensore AMS** — il più accurato, confronta remain% di inizio/fine
2. **EXT diretto** — per P2S/A1 senza vt_tray, usa stima cloud
3. **Stima cloud** — dai dati del lavoro di stampa di Bambu Cloud
4. **Stima per durata** — ~30 g/ora come ultimo fallback

Tutti i valori vengono mostrati come il minimo tra sensore AMS e database bobine per evitare errori dopo stampe fallite.

### Guida materiali

Database integrato con 15 materiali che include:
- Temperature (ugello, piano, camera)
- Compatibilità piano (Cool, Engineering, High Temp, Textured PEI)
- Informazioni sull'essiccazione (temperatura, tempo, igroscopicità)
- 8 proprietà (resistenza, flessibilità, resistenza al calore, UV, superficie, facilità d'uso)
- Livello di difficoltà e requisiti speciali (ugello indurito, enclosure)

### Avvisi sonori

9 eventi configurabili con supporto per:
- **Clip audio personalizzate** — carica MP3/OGG/WAV (max 10 secondi, 500 KB)
- **Toni integrati** — suoni metallici/synth generati con Web Audio API
- **Altoparlante della stampante** — melodie G-code M300 direttamente sul buzzer della stampante
- **Conto alla rovescia** — avviso sonoro quando manca 1 minuto alla fine della stampa

### Manutenzione

Sistema di manutenzione completo con:
- Tracciamento componenti (ugello, tubo PTFE, aste, cuscinetti, AMS, piano, essiccazione)
- Intervalli basati su KB dalla documentazione
- Durata dell'ugello per tipo (ottone, acciaio indurito, HS01)
- Durata del piano per tipo (Cool, Engineering, High Temp, Textured PEI)
- Scheda guida con consigli e link alla documentazione completa

## Panoramica tecnica

3DPrintForge è costruito con Node.js 22 e vanilla HTML/CSS/JS — nessun framework pesante, nessuna fase di build. Il database è SQLite, integrato in Node.js 22.

- **Backend**: Node.js 22 con solo 3 pacchetti npm (mqtt, ws, basic-ftp)
- **Frontend**: Vanilla HTML/CSS/JS, nessuna fase di build
- **Database**: SQLite tramite il built-in di Node.js 22 `--experimental-sqlite`
- **Documentazione**: Docusaurus con 17 lingue, generata automaticamente all'installazione
- **API**: 177+ endpoint, documentazione OpenAPI su `/api/docs`

Vedi [Architettura](./advanced/architecture) per i dettagli.
