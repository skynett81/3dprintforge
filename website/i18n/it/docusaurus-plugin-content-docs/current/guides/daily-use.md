---
sidebar_position: 3
title: Utilizzo quotidiano
description: Una guida pratica all'uso quotidiano di Bambu Dashboard — routine mattutina, monitoraggio, post-stampa e manutenzione
---

# Utilizzo quotidiano

Questa guida illustra come utilizzare Bambu Dashboard in modo efficiente nella vita di tutti i giorni — dall'inizio della giornata al momento di spegnere le luci.

## Routine mattutina

Apri il dashboard e fai una rapida verifica di questi punti:

### 1. Controlla lo stato della stampante
Il pannello panoramica mostra lo stato di tutte le tue stampanti. Cerca:
- **Icone rosse** — errori che richiedono attenzione
- **Messaggi in sospeso** — avvisi HMS dalla notte
- **Stampe non completate** — se avevi una stampa notturna, è finita?

### 2. Controlla i livelli AMS
Vai su **Filamento** o guarda il widget AMS nel dashboard:
- Ci sono bobine sotto i 100 g? Sostituisci o ordinane di nuove
- Il filamento corretto è nel percorso giusto per le stampe di oggi?

### 3. Controlla avvisi ed eventi
Sotto **Log notifiche** (icona a campanella) puoi vedere:
- Eventi accaduti durante la notte
- Errori registrati automaticamente
- Codici HMS che hanno attivato un allarme

## Avviare una stampa

### Da file (Bambu Studio)
1. Apri Bambu Studio
2. Carica e affetta il modello
3. Invia alla stampante — il dashboard si aggiorna automaticamente

### Dalla coda
Se hai pianificato stampe in anticipo:
1. Vai su **Coda**
2. Clicca **Avvia il prossimo** o trascina un lavoro in cima
3. Conferma con **Invia alla stampante**

Vedi la [documentazione della coda di stampa](../features/queue) per informazioni complete sulla gestione della coda.

### Stampa programmata (scheduler)
Per avviare una stampa a un orario specifico:
1. Vai su **Pianificatore**
2. Clicca **+ Nuovo lavoro**
3. Seleziona file, stampante e orario
4. Attiva **Ottimizzazione prezzo energia** per selezionare automaticamente l'ora più economica

Vedi [Pianificatore](../features/scheduler) per i dettagli.

## Monitorare una stampa attiva

### Visualizzazione camera
Clicca sull'icona camera sulla scheda stampante. Puoi:
- Vedere il feed live nel dashboard
- Aprire in una scheda separata per il monitoraggio in background
- Fare uno screenshot manuale

### Informazioni sull'avanzamento
La scheda di stampa attiva mostra:
- Percentuale completata
- Tempo rimanente stimato
- Livello corrente / numero totale di livelli
- Filamento attivo e colore

### Temperature
Le curve di temperatura in tempo reale sono visualizzate nel pannello dettagli:
- Temperatura ugello — dovrebbe rimanere stabile entro ±2°C
- Temperatura piano — importante per una buona adesione
- Temperatura camera — aumenta gradualmente, particolarmente rilevante per ABS/ASA

### Print Guard
Se **Print Guard** è attivato, il dashboard monitora automaticamente spaghetti e deviazioni volumetriche. Se viene rilevato qualcosa:
1. La stampa viene messa in pausa
2. Ricevi una notifica
3. Le immagini della camera vengono salvate per la verifica successiva

## Dopo la stampa — checklist di routine

### Controlla la qualità
1. Apri la camera e dai un'occhiata al risultato mentre è ancora sul piano
2. Vai su **Cronologia → Ultima stampa** per vedere le statistiche
3. Registra una nota: cosa è andato bene, cosa può essere migliorato

### Archivia
Le stampe nella cronologia non vengono mai archiviate automaticamente — rimangono lì. Se vuoi fare ordine:
- Clicca su una stampa → **Archivia** per spostarla nell'archivio
- Usa **Progetti** per raggruppare stampe correlate

### Aggiorna il peso del filamento
Se pesi la bobina per maggiore precisione (consigliato):
1. Pesa la bobina
2. Vai su **Filamento → [Bobina]**
3. Aggiorna **Peso rimanente**

## Promemoria di manutenzione

Il dashboard traccia automaticamente gli intervalli di manutenzione. Sotto **Manutenzione** puoi vedere:

| Attività | Intervallo | Stato |
|----------|-----------|--------|
| Pulizia ugello | Ogni 50 ore | Controllato automaticamente |
| Lubrificazione guide | Ogni 200 ore | Tracciato nel dashboard |
| Calibrazione piano | Dopo sostituzione piano | Promemoria manuale |
| Pulizia AMS | Mensile | Notifica calendario |

Attiva gli avvisi di manutenzione sotto **Monitoraggio → Manutenzione → Avvisi**.

:::tip Imposta un giorno di manutenzione settimanale
Un giorno fisso di manutenzione settimanale (ad es. domenica sera) ti risparmia fermi macchina inutili. Usa la funzione promemoria nel dashboard.
:::

## Prezzi energia — il momento migliore per stampare

Se hai collegato l'integrazione dei prezzi dell'energia (Nordpool / Home Assistant):

1. Vai su **Analisi → Prezzo energia**
2. Vedi il grafico dei prezzi per le prossime 24 ore
3. Le ore più economiche sono evidenziate in verde

Usa il **Pianificatore** con **Ottimizzazione prezzo energia** attivata — il dashboard avvierà automaticamente il lavoro nella finestra disponibile più economica.

:::info Orari tipicamente più economici
La notte (01:00–06:00) è generalmente la più economica in Norvegia. Una stampa di 8 ore messa in coda la sera prima può farti risparmiare il 30–50% sui costi energetici.
:::
