---
sidebar_position: 3
title: Misuratore di Potenza
description: Misura il consumo energetico effettivo per stampa con Shelly o Tasmota smart plug e collegalo alla panoramica costi
---

# Misuratore di Potenza

Collega una presa smart con misurazione di energia alla stampante per registrare il consumo energetico effettivo per stampa — non solo stime.

Vai a: **https://localhost:3443/#settings** → **Integrazioni → Misuratore di Potenza**

## Dispositivi Supportati

| Dispositivo | Protocollo | Raccomandazione |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Consigliato — configurazione semplice |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Per installazione fissa |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Modelli più recenti con API estesa |
| **Dispositivi Tasmota** | MQTT | Flessibile per configurazioni personalizzate |

:::tip Dispositivo consigliato
Shelly Plug S Plus con firmware 1.0+ è testato e consigliato. Supporta Wi-Fi, MQTT e HTTP REST senza dipendenze cloud.
:::

## Configurazione con Shelly

### Prerequisiti

- La presa Shelly è connessa alla stessa rete di Bambu Dashboard
- Lo Shelly è configurato con IP statico o prenotazione DHCP

### Configurazione

1. Vai a **Impostazioni → Misuratore di Potenza**
2. Clicca su **Aggiungi misuratore di potenza**
3. Seleziona **Tipo**: Shelly
4. Compila:
   - **Indirizzo IP**: ad es. `192.168.1.150`
   - **Canale**: 0 (per prese a singola presa)
   - **Autenticazione**: nome utente e password se configurati
5. Clicca su **Test connessione**
6. Collega la presa a una **Stampante**: seleziona dall'elenco a discesa
7. Clicca su **Salva**

### Intervallo di Polling

L'intervallo di polling predefinito è di 10 secondi. Riduci a 5 per misurazioni più accurate, aumenta a 30 per minore carico di rete.

## Configurazione con Tasmota

1. Configura il dispositivo Tasmota con MQTT (vedi la documentazione Tasmota)
2. In Bambu Dashboard: seleziona **Tipo**: Tasmota
3. Inserisci il topic MQTT del dispositivo: ad es. `tasmota/power-plug-1`
4. Collega alla stampante e clicca su **Salva**

Bambu Dashboard si iscrive automaticamente a `{topic}/SENSOR` per le misurazioni di potenza.

## Cosa Viene Misurato

Quando il misuratore di potenza è attivo, vengono registrati per stampa:

| Metrica | Descrizione |
|---|---|
| **Potenza istantanea** | Watt durante la stampa (live) |
| **Consumo energetico totale** | kWh per l'intera stampa |
| **Potenza media** | kWh / tempo di stampa |
| **Costo energetico** | kWh × prezzo energia (da Tibber/Nordpool) |

I dati vengono salvati nella cronologia stampe e sono disponibili per l'analisi.

## Visualizzazione Live

Il consumo di potenza istantaneo viene mostrato in:

- **Dashboard** — come widget aggiuntivo (attiva nelle impostazioni widget)
- **Panoramica Parco Macchine** — come piccolo indicatore sulla scheda stampante

## Confronto con Stima

Dopo la stampa viene mostrato un confronto:

| | Stimato | Effettivo |
|---|---|---|
| Consumo energetico | 1,17 kWh | 1,09 kWh |
| Costo elettricità | 0,29 € | 0,27 € |
| Scarto | — | -6,8% |

Scostamenti costanti possono essere utilizzati per calibrare le stime nel [Calcolatore Costi](../analytics/costestimator).

## Spegni la Stampante Automaticamente

Shelly/Tasmota può spegnere la stampante automaticamente dopo la stampa:

1. Vai a **Misuratore di Potenza → [Stampante] → Spegnimento automatico**
2. Attiva **Spegni X minuti dopo la fine della stampa**
3. Imposta il ritardo (ad es. 10 minuti)

:::danger Raffreddamento
Lascia raffreddare la stampante per almeno 5–10 minuti dopo la stampa prima di togliere l'alimentazione. L'ugello dovrebbe raffreddarsi sotto i 50°C per evitare il heat creep nell'hotend.
:::
