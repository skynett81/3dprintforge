---
sidebar_position: 3
title: Manutenzione AMS
description: Manutenzione dell'AMS — tubi PTFE, percorso filamento e prevenzione dell'umidità
---

# Manutenzione AMS

L'AMS (Automatic Material System) è un sistema di precisione che richiede manutenzione regolare per funzionare in modo affidabile. I problemi più comuni sono il percorso filamento sporco e l'umidità nell'alloggiamento.

## Tubi PTFE

I tubi PTFE trasportano il filamento dall'AMS alla stampante. Sono tra le prime parti a usurarsi.

### Ispezione
Controlla i tubi PTFE per:
- **Pieghe o curve** — impediscono il flusso del filamento
- **Usura ai raccordi** — polvere bianca attorno agli ingressi
- **Deformazione della forma** — in particolare con materiali CF

### Sostituzione tubi PTFE
1. Libera il filamento dall'AMS (esegui il ciclo di scarico)
2. Premi l'anello di bloccaggio blu attorno al tubo al raccordo
3. Estrai il tubo (richiede una presa decisa)
4. Taglia il nuovo tubo alla lunghezza corretta (non più corto dell'originale)
5. Inserisci fino a quando si ferma e blocca

:::tip AMS Lite vs. AMS
L'AMS Lite (A1/A1 Mini) ha una configurazione PTFE più semplice rispetto all'AMS completo (P1S/X1C). I tubi sono più corti e più facili da sostituire.
:::

## Percorso filamento

### Pulizia del percorso filamento
I filamenti lasciano polvere e residui nel percorso, in particolare i materiali CF:

1. Esegui lo scarico di tutti gli slot
2. Usa aria compressa o un pennello morbido per soffiare via la polvere sciolta
3. Fai passare un pezzo di nylon pulito o filamento di pulizia PTFE attraverso il percorso

### Sensori
L'AMS usa sensori per rilevare la posizione e le rotture del filamento. Tieni pulite le finestre dei sensori:
- Pulisci delicatamente le lenti dei sensori con un pennello pulito
- Evita l'IPA direttamente sui sensori

## Umidità

L'AMS non protegge il filamento dall'umidità. Per i materiali igroscopici (PA, PETG, TPU) si consiglia:

### Alternative AMS asciutte
- **Scatola sigillata:** Posiziona le bobine in una scatola ermetica con gel di silice
- **Bambu Dry Box:** Accessorio ufficiale di essiccazione
- **Alimentatore esterno:** Usa un alimentatore di filamento esterno all'AMS per i materiali sensibili

### Indicatori di umidità
Posiziona schede indicatrici di umidità (igrometro) nell'alloggiamento AMS. Sostituisci le bustine di gel di silice quando l'umidità relativa supera il 30%.

## Ingranaggi di trascinamento e meccanismo di presa

### Ispezione
Controlla gli ingranaggi di trascinamento (ruote estrusore nell'AMS) per:
- Residui di filamento tra i denti
- Usura dei denti
- Attrito non uniforme alla trazione manuale

### Pulizia
1. Usa uno spazzolino da denti o una spazzola per rimuovere i residui tra i denti
2. Soffia con aria compressa
3. Evita olio e lubrificanti — il livello di presa è calibrato per funzionamento a secco

## Intervalli di manutenzione

| Attività | Intervallo |
|-----------|---------|
| Ispezione visiva tubi PTFE | Mensile |
| Pulizia percorso filamento | Ogni 100 ore |
| Controllo sensori | Mensile |
| Sostituzione gel di silice (setup essiccazione) | In base alle necessità (sopra 30% UR) |
| Sostituzione tubi PTFE | In caso di usura visibile |
