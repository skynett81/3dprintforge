---
sidebar_position: 7
title: Report
description: Report email automatici settimanali e mensili con statistiche, riepilogo attività e promemoria manutenzione
---

# Report

Bambu Dashboard può inviare report email automatici con statistiche e riepiloghi attività — settimanali, mensili o entrambi.

Vai a: **https://localhost:3443/#settings** → **Sistema → Report**

## Prerequisiti

I report richiedono che le notifiche email siano configurate. Configura SMTP in **Impostazioni → Notifiche → Email** prima di abilitare i report. Vedi [Notifiche](../features/notifications).

## Abilitare i report automatici

1. Vai a **Impostazioni → Report**
2. Abilita **Report settimanale** e/o **Report mensile**
3. Scegli l'**Orario di invio**:
   - Settimanale: giorno della settimana e orario
   - Mensile: giorno del mese (es. 1° lunedì / ultimo venerdì)
4. Inserisci l'**Email destinatario** (separata da virgola per più indirizzi)
5. Clicca **Salva**

Invia un report di prova per vedere la formattazione: clicca **Invia report di prova ora**.

## Contenuto del report settimanale

Il report settimanale copre gli ultimi 7 giorni:

### Riepilogo
- Numero totale di stampe
- Numero di riuscite / fallite / interrotte
- Tasso di successo e variazione rispetto alla settimana precedente
- Stampante più attiva

### Attività
- Stampe per giorno (minigrafico)
- Ore di stampa totali
- Consumo totale filamento (grammi e costo)

### Filamento
- Consumo per materiale e fornitore
- Stima rimanente per bobina (bobine sotto il 20% evidenziate)

### Manutenzione
- Attività di manutenzione eseguite questa settimana
- Attività di manutenzione scadute (avviso rosso)
- Attività in scadenza la prossima settimana

### Errori HMS
- Numero di errori HMS questa settimana per stampante
- Errori non confermati (richiedono attenzione)

## Contenuto del report mensile

Il report mensile copre gli ultimi 30 giorni e contiene tutto quello del report settimanale, più:

### Andamento
- Confronto con il mese precedente (%)
- Mappa attività (miniatura heatmap del mese)
- Evoluzione mensile del tasso di successo

### Costi
- Costo filamento totale
- Costo elettricità totale (se la misurazione energetica è configurata)
- Costo usura totale
- Costo manutenzione complessivo

### Usura e salute
- Punteggio di salute per stampante (con variazione rispetto al mese precedente)
- Componenti vicini alla sostituzione

### Statistiche in evidenza
- Stampa riuscita più lunga
- Tipo di filamento più utilizzato
- Stampante con l'attività più alta

## Personalizzare il report

1. Vai a **Impostazioni → Report → Personalizzazione**
2. Spunta / deseleziona le sezioni da includere
3. Seleziona il **Filtro stampanti**: tutte le stampanti o una selezione
4. Seleziona la **Visualizzazione logo**: mostra il logo Bambu Dashboard nell'intestazione o disabilitalo
5. Clicca **Salva**

## Archivio report

Tutti i report inviati vengono archiviati e possono essere riaperti:

1. Vai a **Impostazioni → Report → Archivio**
2. Seleziona il report dall'elenco (ordinato per data)
3. Clicca **Apri** per vedere la versione HTML
4. Clicca **Scarica PDF** per scaricare il report

I report vengono eliminati automaticamente dopo **90 giorni** (configurabile).
