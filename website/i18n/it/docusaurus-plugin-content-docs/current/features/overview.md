---
sidebar_position: 1
title: Panoramica Funzionalità
description: Panoramica completa di tutte le funzionalità di 3DPrintForge
---

# Panoramica Funzionalità

3DPrintForge raccoglie tutto ciò di cui hai bisogno per monitorare e controllare le tue stampanti Bambu Lab in un unico posto.

## Dashboard

Il pannello principale mostra lo stato in tempo reale della stampante attiva:

- **Temperatura** — misuratori SVG ad anello animati per ugello e piano
- **Avanzamento** — avanzamento percentuale con orario di completamento stimato
- **Videocamera** — visualizzazione in diretta (RTSPS → MPEG1 tramite ffmpeg)
- **Pannello AMS** — rappresentazione visiva di tutti gli slot AMS con colore filamento
- **Controllo velocità** — cursore per regolare la velocità (Silenziosa, Standard, Sport, Turbo)
- **Pannelli statistiche** — pannelli in stile Grafana con grafici a scorrimento
- **Telemetria** — valori live per ventole, temperature, pressione

I pannelli possono essere trascinati e rilasciati per personalizzare il layout. Usa il pulsante blocco per bloccare il layout.

## Magazzino Filamento

Vedi [Filamento](./filament) per la documentazione completa.

- Traccia tutte le bobine con nome, colore, peso e fornitore
- Sincronizzazione AMS — vedi quali bobine sono nell'AMS
- Registro essiccazione e piano di essiccazione
- Schede colore e supporto tag NFC
- Importazione/esportazione (CSV)

## Cronologia Stampe

Vedi [Cronologia](./history) per la documentazione completa.

- Registro completo di tutte le stampe
- Monitoraggio filamento per stampa
- Link ai modelli MakerWorld
- Statistiche ed esportazione in CSV

## Pianificatore

Vedi [Pianificatore](./scheduler) per la documentazione completa.

- Visualizzazione calendario delle stampe
- Coda stampe con prioritizzazione
- Dispatch multi-stampante

## Controllo Stampante

Vedi [Controllo](./controls) per la documentazione completa.

- Controllo temperatura (ugello, piano, camera)
- Controllo profilo velocità
- Controllo ventole
- Console G-code
- Carico/scarico filamento

## Notifiche

3DPrintForge supporta 7 canali di notifica:

| Canale | Eventi |
|-------|----------|
| Telegram | Stampa finita, errore, pausa |
| Discord | Stampa finita, errore, pausa |
| Email | Stampa finita, errore |
| ntfy | Tutti gli eventi |
| Pushover | Tutti gli eventi |
| SMS (Twilio) | Errori critici |
| Webhook | Payload personalizzato |

Configura in **Impostazioni → Notifiche**.

## Print Guard

Print Guard monitora la stampa attiva tramite videocamera (xcam) e sensori:

- Pausa automatica in caso di errore spaghetti
- Livello di sensibilità configurabile
- Registro degli eventi rilevati

## Manutenzione

La sezione manutenzione tiene traccia di:

- Prossima manutenzione consigliata per componente (ugello, piani, AMS)
- Monitoraggio usura basato sulla cronologia stampe
- Registrazione manuale delle attività di manutenzione

## Multi-Stampante

Con il supporto multi-stampante puoi:

- Gestire più stampanti da un unico dashboard
- Passare tra le stampanti con il selettore stampante
- Vedere la panoramica stato di tutte le stampanti simultaneamente
- Distribuire i lavori di stampa con la coda stampe

## Overlay OBS

Una pagina `obs.html` dedicata fornisce un overlay pulito per l'integrazione con OBS Studio durante lo streaming live delle stampe.

## Aggiornamenti

Aggiornamento automatico integrato tramite GitHub Releases. Notifica e aggiornamento direttamente dal dashboard in **Impostazioni → Aggiornamento**.
