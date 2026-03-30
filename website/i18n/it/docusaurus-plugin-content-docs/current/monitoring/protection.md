---
sidebar_position: 1
title: Print Guard
description: Monitoraggio automatico con rilevamento eventi XCam, monitoraggio sensori e azioni configurabili in caso di anomalie
---

# Print Guard

Print Guard è il sistema di monitoraggio in tempo reale di Bambu Dashboard. Monitora continuamente la camera, i sensori e i dati della stampante ed esegue azioni configurabili quando qualcosa non va.

Vai a: **https://localhost:3443/#protection**

## Rilevamento eventi XCam

Le stampanti Bambu Lab inviano eventi XCam tramite MQTT quando la telecamera AI rileva problemi:

| Evento | Codice | Gravità |
|---|---|---|
| Spaghetti rilevati | `xcam_spaghetti` | Critico |
| Distacco dal piano | `xcam_detach` | Alto |
| Malfunzionamento primo strato | `xcam_first_layer` | Alto |
| Stringing | `xcam_stringing` | Medio |
| Errore estrusione | `xcam_extrusion` | Alto |

Per ogni tipo di evento puoi configurare una o più azioni:

- **Notifica** — invia un avviso tramite i canali attivi
- **Pausa** — metti la stampa in pausa per un controllo manuale
- **Arresta** — interrompi la stampa immediatamente
- **Nessuna** — ignora l'evento (viene comunque registrato)

:::danger Comportamento predefinito
Per impostazione predefinita, gli eventi XCam sono impostati su **Notifica** e **Pausa**. Cambia in **Arresta** se ti fidi completamente del rilevamento AI.
:::

## Monitoraggio sensori

Print Guard monitora continuamente i dati dei sensori e genera allarmi in caso di anomalie:

### Deviazione temperatura

1. Vai a **Print Guard → Temperatura**
2. Imposta **Deviazione massima dalla temperatura target** (consigliato: ±5°C per ugello, ±3°C per piano)
3. Scegli **Azione in caso di deviazione**: Notifica / Pausa / Arresta
4. Imposta il **Ritardo** (secondi) prima che l'azione venga eseguita — dà il tempo alla temperatura di stabilizzarsi

### Filamento in esaurimento

Il sistema calcola il filamento rimanente sulle bobine:

1. Vai a **Print Guard → Filamento**
2. Imposta il **Limite minimo** in grammi (es. 50 g)
3. Scegli l'azione: **Pausa e notifica** (consigliato) per cambiare bobina manualmente

### Rilevamento arresto stampa

Rileva quando la stampa si è fermata inaspettatamente (timeout MQTT, rottura filamento, ecc.):

1. Attiva **Rilevamento arresto**
2. Imposta il **Timeout** (consigliato: 120 secondi senza dati = fermato)
3. Azione: Notifica sempre — la stampa potrebbe essersi già fermata

## Configurazione

### Attivare Print Guard

1. Vai a **Impostazioni → Print Guard**
2. Attiva **Abilita Print Guard**
3. Seleziona quali stampanti monitorare
4. Clicca **Salva**

### Regole per stampante

Stampanti diverse possono avere regole diverse:

1. Clicca su una stampante nella panoramica Print Guard
2. Disattiva **Eredita regole globali**
3. Configura regole personalizzate per questa stampante

## Registro e cronologia eventi

Tutti gli eventi Print Guard vengono registrati:

- Vai a **Print Guard → Registro**
- Filtra per stampante, tipo evento, data e gravità
- Clicca su un evento per vedere informazioni dettagliate e le eventuali azioni eseguite
- Esporta il registro in CSV

:::tip Falsi positivi
Se Print Guard genera pause non necessarie, regola la sensibilità in **Print Guard → Impostazioni → Sensibilità**. Inizia con «Bassa» e aumenta gradualmente.
:::
