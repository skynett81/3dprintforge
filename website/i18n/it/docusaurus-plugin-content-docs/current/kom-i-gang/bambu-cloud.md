---
sidebar_position: 3
title: Integrazione Bambu Cloud
description: Collega il dashboard a Bambu Lab Cloud per sincronizzare modelli e cronologia stampe
---

# Integrazione Bambu Cloud

Bambu Dashboard può connettersi a **Bambu Lab Cloud** per recuperare immagini dei modelli, cronologia stampe e dati sul filamento. Il dashboard funziona perfettamente anche senza connessione cloud, ma l'integrazione offre vantaggi aggiuntivi.

## Vantaggi dell'integrazione cloud

| Funzione | Senza cloud | Con cloud |
|---------|-----------|----------|
| Stato stampante in tempo reale | Sì | Sì |
| Cronologia stampe (locale) | Sì | Sì |
| Immagini modelli da MakerWorld | No | Sì |
| Profili filamento Bambu | No | Sì |
| Sincronizzazione cronologia stampe | No | Sì |
| Filamento AMS dal cloud | No | Sì |

## Connettere Bambu Cloud

1. Vai a **Impostazioni → Bambu Cloud**
2. Inserisci la tua email e password di Bambu Lab
3. Clicca **Accedi**
4. Scegli quali dati sincronizzare

:::warning Privacy
Nome utente e password non vengono salvati in chiaro. Il dashboard utilizza l'API di Bambu Lab per ottenere un token OAuth che viene memorizzato localmente. I tuoi dati non lasciano mai il tuo server.
:::

## Sincronizzazione

### Immagini dei modelli

Quando il cloud è connesso, le immagini dei modelli vengono recuperate automaticamente da **MakerWorld** e mostrate in:
- Cronologia stampe
- Dashboard (durante una stampa attiva)
- Visualizzatore 3D del modello

### Cronologia stampe

La sincronizzazione cloud importa la cronologia stampe dall'app Bambu Lab. I duplicati vengono filtrati automaticamente in base a timestamp e numero di serie.

### Profili filamento

I profili filamento ufficiali di Bambu Lab vengono sincronizzati e mostrati nel magazzino filamento. Puoi usarli come punto di partenza per i tuoi profili personalizzati.

## Cosa funziona senza cloud?

Tutte le funzionalità principali funzionano senza connessione cloud:

- Connessione MQTT diretta alla stampante tramite LAN
- Stato in tempo reale, temperatura, camera
- Cronologia stampe e statistiche locali
- Magazzino filamento (gestito manualmente)
- Notifiche e pianificatore

:::tip Modalità solo LAN
Vuoi usare il dashboard completamente senza connessione internet? Funziona perfettamente in una rete isolata — basta collegarsi alla stampante tramite IP e lasciare disabilitata l'integrazione cloud.
:::

## Risoluzione dei problemi

**Accesso fallisce:**
- Verifica che email e password siano corretti per l'app Bambu Lab
- Controlla se l'account utilizza l'autenticazione a due fattori (non ancora supportata)
- Prova a disconnetterti e riconnetterti

**La sincronizzazione si interrompe:**
- Il token potrebbe essere scaduto — disconnettiti e riconnettiti nelle Impostazioni
- Verifica la connessione internet del server
