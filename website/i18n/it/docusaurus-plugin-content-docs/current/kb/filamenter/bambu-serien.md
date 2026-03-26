---
sidebar_position: 9
title: Filamenti Bambu Lab
description: Panoramica completa delle serie di filamenti Bambu Lab — impostazioni, RFID e compatibilità AMS
---

# Filamenti Bambu Lab

Bambu Lab produce un'ampia gamma di filamenti appositamente ottimizzati per le proprie stampanti. Tutti i filamenti Bambu Lab sono dotati di **tag RFID** rilevato automaticamente dalla stampante che imposta le configurazioni corrette.

## RFID e AMS

Tutti i filamenti Bambu Lab hanno un **chip RFID** integrato nella bobina. Questo fornisce:

- **Riconoscimento automatico** — la stampante legge tipo di materiale, colore e impostazioni
- **Quantità rimanente** — stima del filamento rimasto sulla bobina
- **Impostazioni corrette** — temperatura, velocità e raffreddamento impostati automaticamente
- **Compatibilità AMS** — cambio materiale fluido nell'AMS

:::tip Filamenti di terze parti nell'AMS
L'AMS funziona anche con filamenti di terze parti, ma devi impostare le configurazioni manualmente in Bambu Studio. Il rilevamento automatico RFID è esclusivo dei filamenti Bambu Lab.
:::

---

## Serie PLA

La serie PLA di Bambu Lab è la più completa, coprendo tutto dai prodotti base agli effetti speciali.

### PLA Basic

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220 °C |
| Temperatura piatto | 35–45 °C |
| Raffreddamento | 100% |
| RFID | Sì |
| Compatibile AMS | Sì |
| Prezzo | Economico |

Il filamento standard per la stampa quotidiana. Disponibile in un'ampia gamma di colori.

### PLA Matte

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220 °C |
| Temperatura piatto | 35–45 °C |
| Raffreddamento | 100% |
| Superficie | Opaca, senza lucentezza |

Dà una superficie uniforme e opaca che nasconde le linee di strato meglio del PLA standard. Scelta popolare per stampe estetiche.

### PLA Silk

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 230 °C |
| Temperatura piatto | 45–55 °C |
| Raffreddamento | 80% |
| Superficie | Lucida, riflesso metallico |

Dà una superficie lucida e setosa con effetto metallico. Richiede raffreddamento e velocità leggermente inferiori al PLA standard.

### PLA Sparkle

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220–230 °C |
| Temperatura piatto | 35–45 °C |
| Raffreddamento | 100% |
| Superficie | Particelle glitter |

Contiene particelle glitter che danno un effetto scintillante. Stampa come PLA standard.

### PLA Marble

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220 °C |
| Temperatura piatto | 35–45 °C |
| Raffreddamento | 100% |
| Superficie | Effetto marmorizzato |

Dà un effetto marmorizzato unico con variazioni di colore in tutta la stampa. Ogni stampa è leggermente unica.

### PLA Tough (PLA-S)

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220–230 °C |
| Temperatura piatto | 35–55 °C |
| Raffreddamento | 100% |
| Resistenza | 20–30% più resistente del PLA standard |

PLA rinforzato con maggiore resistenza all'urto. Adatto per parti meccaniche che necessitano più resistenza del PLA standard.

### PLA Galaxy

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220–230 °C |
| Temperatura piatto | 35–45 °C |
| Raffreddamento | 100% |
| Superficie | Glitter + gradiente di colore |

Combina effetto glitter con gradienti di colore per un effetto visivo unico. Stampa con impostazioni PLA standard.

---

## Serie PETG

### PETG Basic

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 240–250 °C |
| Temperatura piatto | 70–80 °C |
| Raffreddamento | 50–70% |
| RFID | Sì |
| Compatibile AMS | Sì |

PETG standard con buona resistenza e flessibilità. Disponibile in una buona selezione di colori.

### PETG HF (High Flow)

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 240–260 °C |
| Temperatura piatto | 70–80 °C |
| Raffreddamento | 50–70% |
| Velocità | Fino a 300 mm/s |

Versione ad alta velocità del PETG formulata per un'estrusione più rapida senza sacrificare la qualità. Ideale per pezzi grandi e produzione in serie.

### PETG-CF

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 250–270 °C |
| Temperatura piatto | 70–80 °C |
| Raffreddamento | 40–60% |
| Ugello | Acciaio temprato richiesto |

PETG rinforzato con fibra di carbonio con maggiore rigidità e stabilità dimensionale. Richiede ugello temprato (HS01 o equivalente).

:::warning Ugello temprato per varianti CF
Tutti i filamenti rinforzati con fibra di carbonio (PLA-CF, PETG-CF, PA-CF, PC-CF) richiedono un ugello in acciaio temprato. L'ottone si usura in ore con materiali CF.
:::

---

## ABS e ASA

### ABS

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 250–270 °C |
| Temperatura piatto | 90–110 °C |
| Temperatura camera | Consigliato 40 °C+ |
| Raffreddamento | 20–40% |
| Enclosure | Consigliato |

### ASA

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 240–260 °C |
| Temperatura piatto | 90–110 °C |
| Temperatura camera | Consigliato 40 °C+ |
| Raffreddamento | 30–50% |
| Enclosure | Consigliato |
| Resistenza UV | Eccellente |

---

## TPU 95A

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220–240 °C |
| Temperatura piatto | 35–50 °C |
| Raffreddamento | 50–80% |
| Velocità | 50–70% (ridotta) |
| Durezza Shore | 95A |
| Compatibile AMS | Limitato (alimentazione diretta consigliata) |

Filamento flessibile per parti simili alla gomma. L'AMS può gestire il TPU 95A, ma l'alimentazione diretta dà risultati migliori per varianti più morbide.

:::tip TPU nell'AMS
Il TPU 95A di Bambu Lab è appositamente formulato per funzionare con l'AMS. I TPU più morbidi (85A e inferiori) dovrebbero essere alimentati direttamente all'estrusore.
:::

---

## Serie PA (Nylon)

### PA6-CF

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 270–290 °C |
| Temperatura piatto | 90–100 °C |
| Temperatura camera | 50 °C+ (richiesto) |
| Raffreddamento | 0–20% |
| Ugello | Acciaio temprato richiesto |
| Enclosure | Richiesto |
| Essiccazione | 70–80 °C per 8–12 ore |

Nylon rinforzato con fibra di carbonio con resistenza e rigidità estremamente elevate. Uno dei materiali FDM più resistenti disponibili.

### PA6-GF

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 270–290 °C |
| Temperatura piatto | 90–100 °C |
| Temperatura camera | 50 °C+ (richiesto) |
| Raffreddamento | 0–20% |
| Ugello | Acciaio temprato richiesto |
| Enclosure | Richiesto |
| Essiccazione | 70–80 °C per 8–12 ore |

Nylon rinforzato con fibra di vetro — più economico del PA6-CF con buona rigidità e stabilità dimensionale.

---

## PC

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 260–280 °C |
| Temperatura piatto | 100–120 °C |
| Temperatura camera | 50–60 °C (richiesto) |
| Raffreddamento | 0–20% |
| Enclosure | Richiesto |
| Essiccazione | 70–80 °C per 6–8 ore |

Il policarbonato di Bambu Lab per massima resistenza e resistenza termica.

---

## Materiali di supporto

### PVA

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 190–210 °C |
| Temperatura piatto | 45–60 °C |
| Solvente | Acqua |
| Combinare con | PLA, PETG |

### HIPS

| Parametro | Valore |
|-----------|--------|
| Temperatura ugello | 220–240 °C |
| Temperatura piatto | 90–100 °C |
| Solvente | d-Limonene |
| Combinare con | ABS, ASA |

---

## Controllo qualità e consistenza colore

Bambu Lab mantiene un rigoroso controllo qualità sui propri filamenti:

- **Tolleranza diametro** — ±0,02 mm (leader del settore)
- **Consistenza colore** — controllo per lotto garantisce colore uniforme tra le bobine
- **Qualità bobina** — avvolgimento uniforme senza nodi o sovrapposizioni
- **Sigillato sottovuoto** — ogni bobina consegnata sottovuoto con essiccante
- **Test profilo temperatura** — ogni lotto testato per la temperatura ottimale

:::tip Numero colore per consistenza
Bambu Lab usa numeri colore (es. "Bambu PLA Matte Charcoal") con controllo per lotto. Se hai bisogno di colori identici su più bobine per un progetto grande, ordina dallo stesso lotto o contatta il supporto per l'abbinamento dei lotti.
:::

---

## Prezzo e disponibilità

| Serie | Fascia di prezzo | Disponibilità |
|-------|-----------------|--------------|
| PLA Basic | Economico | Buona — ampia selezione |
| PLA Matte/Silk/Sparkle | Moderato | Buona |
| PLA Tough | Moderato | Buona |
| PETG Basic/HF | Moderato | Buona |
| PETG-CF | Alto | Moderata |
| ABS/ASA | Moderato | Buona |
| TPU 95A | Moderato | Selezione limitata |
| PA6-CF/GF | Alto | Moderata |
| PC | Alto | Limitata |
| PVA/HIPS | Alto | Buona |

I filamenti Bambu Lab sono disponibili attraverso il negozio online di Bambu Lab e rivenditori selezionati. I prezzi sono generalmente competitivi con altri marchi premium, soprattutto il PLA Basic posizionato nel mercato economico.
