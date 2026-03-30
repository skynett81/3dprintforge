---
sidebar_position: 3
title: Impostazioni
description: Panoramica completa di tutte le impostazioni di Bambu Dashboard — stampanti, notifiche, tema, OBS, energia, webhook e altro
---

# Impostazioni

Tutte le impostazioni di Bambu Dashboard sono raccolte in un'unica pagina con categorie chiare. Ecco una panoramica di cosa si trova in ogni categoria.

Vai a: **https://localhost:3443/#settings**

## Stampanti

Gestisci le stampanti registrate:

| Impostazione | Descrizione |
|---|---|
| Aggiungi stampante | Registra una nuova stampante con numero di serie e codice di accesso |
| Nome stampante | Nome visualizzato personalizzato |
| Modello stampante | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| Connessione MQTT | Bambu Cloud MQTT o MQTT locale |
| Codice di accesso | LAN Access Code dall'app Bambu Lab |
| Indirizzo IP | Per la modalità locale (LAN) |
| Impostazioni camera | Abilita/disabilita, risoluzione |

Vedi [Primi passi](../getting-started/setup) per la configurazione passo per passo della prima stampante.

## Notifiche

Vedi la documentazione completa in [Notifiche](../features/notifications).

Riepilogo rapido:
- Abilita/disabilita canali di notifica (Telegram, Discord, email, ecc.)
- Filtro eventi per canale
- Ore silenziose (intervallo di tempo senza notifiche)
- Pulsante di test per canale

## Tema

Vedi la documentazione completa in [Tema](./themes).

- Modalità chiara / scura / automatica
- 6 palette colori
- Colore accent personalizzato
- Arrotondamento e compattezza

## Overlay OBS

Configurazione per l'overlay OBS:

| Impostazione | Descrizione |
|---|---|
| Tema predefinito | dark / light / minimal |
| Posizione predefinita | Angolo per l'overlay |
| Scala predefinita | Ridimensionamento (0,5–2,0) |
| Mostra QR code | Mostra QR code del dashboard nell'overlay |

Vedi [Overlay OBS](../features/obs-overlay) per la sintassi URL completa e la configurazione.

## Energia ed elettricità

| Impostazione | Descrizione |
|---|---|
| Token API Tibber | Accesso ai prezzi spot Tibber |
| Area prezzo Nordpool | Seleziona la zona di prezzo |
| Oneri di rete (€/kWh) | La tua tariffa di rete |
| Potenza stampante (W) | Configura il consumo energetico per modello di stampante |

## Home Assistant

| Impostazione | Descrizione |
|---|---|
| Broker MQTT | IP, porta, nome utente, password |
| Prefisso discovery | Predefinito: `homeassistant` |
| Abilita discovery | Pubblica dispositivi in HA |

## Webhook

Impostazioni webhook globali:

| Impostazione | Descrizione |
|---|---|
| URL webhook | URL destinatario per gli eventi |
| Chiave segreta | Firma HMAC-SHA256 |
| Filtro eventi | Quali eventi vengono inviati |
| Tentativi retry | Numero di tentativi in caso di errore (predefinito: 3) |
| Timeout | Secondi prima che la richiesta si arrenda (predefinito: 10) |

## Impostazioni coda

| Impostazione | Descrizione |
|---|---|
| Dispatch automatico | Abilita/disabilita |
| Strategia dispatch | Prima disponibile / Meno usata / Round-robin |
| Richiedi conferma | Approvazione manuale prima dell'invio |
| Avvio scaglionato | Ritardo tra le stampanti in coda |

## Sicurezza

| Impostazione | Descrizione |
|---|---|
| Durata sessione | Ore/giorni prima della disconnessione automatica |
| Forza 2FA | Richiedi 2FA per tutti gli utenti |
| Whitelist IP | Limita l'accesso a indirizzi IP specifici |
| Certificato HTTPS | Carica un certificato personalizzato |

## Sistema

| Impostazione | Descrizione |
|---|---|
| Porta server | Predefinito: 3443 |
| Formato log | JSON / Testo |
| Livello log | Error / Warn / Info / Debug |
| Pulizia database | Eliminazione automatica della cronologia vecchia |
| Aggiornamenti | Controlla nuove versioni |
