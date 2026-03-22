---
sidebar_position: 3
title: Profili di Stampa
description: Crea, modifica e gestisci profili di stampa con impostazioni predefinite per una stampa rapida e uniforme
---

# Profili di Stampa

I profili di stampa sono insiemi salvati di impostazioni di stampa riutilizzabili tra stampe e stampanti. Risparmia tempo e garantisci una qualità uniforme definendo profili per scopi diversi.

Vai a: **https://localhost:3443/#profiles**

## Creare un profilo

1. Vai a **Strumenti → Profili di Stampa**
2. Clicca **Nuovo profilo** (icona +)
3. Compila:
   - **Nome profilo** — nome descrittivo, es. «PLA - Produzione rapida»
   - **Materiale** — seleziona dall'elenco (PLA / PETG / ABS / PA / PC / TPU / ecc.)
   - **Modello stampante** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Tutti
   - **Descrizione** — testo opzionale

4. Compila le impostazioni (vedi sezioni di seguito)
5. Clicca **Salva profilo**

## Impostazioni in un profilo

### Temperatura
| Campo | Esempio |
|---|---|
| Temperatura ugello | 220°C |
| Temperatura piano | 60°C |
| Temperatura camera (X1C) | 35°C |

### Velocità
| Campo | Esempio |
|---|---|
| Impostazione velocità | Standard |
| Velocità massima (mm/s) | 200 |
| Accelerazione | 5000 mm/s² |

### Qualità
| Campo | Esempio |
|---|---|
| Spessore strato | 0,2 mm |
| Percentuale infill | 15 % |
| Pattern infill | Grid |
| Materiale supporto | Auto |

### AMS e colori
| Campo | Descrizione |
|---|---|
| Volume purge | Quantità di pulizia al cambio colore |
| Slot preferiti | Quali slot AMS preferire |

### Avanzate
| Campo | Descrizione |
|---|---|
| Modalità essiccazione | Abilita essiccazione AMS per materiali umidi |
| Tempo raffreddamento | Pausa tra strati per il raffreddamento |
| Velocità ventola | Velocità ventola di raffreddamento in percentuale |

## Modificare un profilo

1. Clicca sul profilo nell'elenco
2. Clicca **Modifica** (icona matita)
3. Apporta le modifiche
4. Clicca **Salva** (sovrascrive) o **Salva come nuovo** (crea una copia)

:::tip Versioning
Usa «Salva come nuovo» per conservare un profilo funzionante mentre sperimenti le modifiche.
:::

## Usare un profilo

### Dalla libreria file

1. Seleziona un file nella libreria
2. Clicca **Invia alla stampante**
3. Seleziona il **Profilo** dall'elenco a discesa
4. Vengono utilizzate le impostazioni del profilo

### Dalla coda di stampa

1. Crea un nuovo lavoro in coda
2. Seleziona il **Profilo** nelle impostazioni
3. Il profilo viene associato al lavoro in coda

## Importare ed esportare profili

### Esportazione
1. Seleziona uno o più profili
2. Clicca **Esporta**
3. Seleziona il formato: **JSON** (per l'importazione in altri dashboard) o **PDF** (per stampa/documentazione)

### Importazione
1. Clicca **Importa profili**
2. Seleziona un file `.json` esportato da un altro Bambu Dashboard
3. I profili esistenti con lo stesso nome possono essere sovrascritti o mantenuti entrambi

## Condividere profili

Condividi profili con altri tramite il modulo filamenti della community (vedi [Filamenti della Community](../integrasjoner/community)) o tramite esportazione JSON diretta.

## Profilo predefinito

Imposta un profilo predefinito per materiale:

1. Seleziona il profilo
2. Clicca **Imposta come predefinito per [materiale]**
3. Il profilo predefinito viene selezionato automaticamente quando invii un file con quel materiale
