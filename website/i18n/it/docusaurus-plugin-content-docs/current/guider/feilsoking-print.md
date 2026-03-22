---
sidebar_position: 5
title: Risoluzione dei problemi di stampa
description: Diagnostica e risolvi i problemi di stampa più comuni usando i log degli errori e gli strumenti di Bambu Dashboard
---

# Risoluzione dei problemi di stampa

Qualcosa è andato storto? Non preoccuparti — la maggior parte dei problemi di stampa ha soluzioni semplici. Bambu Dashboard ti aiuta a trovare rapidamente la causa.

## Passo 1 — Controlla i codici di errore HMS

HMS (Handling, Monitoring, Sensing) è il sistema di errori di Bambu Labs. Tutti gli errori vengono registrati automaticamente nel dashboard.

1. Vai su **Monitoraggio → Errori**
2. Trova la stampa fallita
3. Clicca sul codice di errore per una descrizione dettagliata e la soluzione suggerita

Codici HMS comuni:

| Codice | Descrizione | Soluzione rapida |
|--------|-------------|-----------------|
| 0700 1xxx | Errore AMS (inceppato, problema motore) | Controlla il percorso del filamento in AMS |
| 0300 0xxx | Errore di estrusione (sotto/sovra estrusione) | Pulisci ugello, controlla filamento |
| 0500 xxxx | Errore di calibrazione | Esegui nuovamente la calibrazione |
| 1200 xxxx | Deviazione di temperatura | Controlla i collegamenti dei cavi |
| 0C00 xxxx | Errore camera | Riavvia la stampante |

:::tip Codici di errore nella cronologia
Sotto **Cronologia → [Stampa] → Log HMS** puoi vedere tutti i codici di errore che si sono verificati durante la stampa — anche se la stampa "ha completato".
:::

## Problemi comuni e soluzioni

### Scarsa adesione (il primo strato non si attacca)

**Sintomi:** La stampa si stacca dal piano, si arriccia, manca il primo strato

**Cause e soluzioni:**

| Causa | Soluzione |
|-------|-----------|
| Piano sporco | Pulisci con alcol IPA |
| Temperatura piano errata | Aumenta di 5°C |
| Z-offset errato | Esegui nuovamente l'Auto Bed Leveling |
| Manca la colla stick (PETG/ABS) | Applica uno strato sottile di colla stick |
| Velocità primo strato troppo alta | Riduci a 20–30 mm/s nel primo strato |

**Checklist rapida:**
1. Il piano è pulito? (IPA + carta privo di pelucchi)
2. Stai usando il piano corretto per il tipo di filamento? (vedi [Scegliere il piano corretto](./velge-rett-plate))
3. La calibrazione Z è stata fatta dopo l'ultimo cambio piano?

---

### Warping (gli angoli si sollevano)

**Sintomi:** Gli angoli si curvano verso l'alto dal piano, soprattutto su modelli grandi e piatti

**Cause e soluzioni:**

| Causa | Soluzione |
|-------|-----------|
| Differenza di temperatura | Chiudi il coperchio frontale della stampante |
| Manca il brim | Attiva il brim in Bambu Studio (3–5 mm) |
| Piano troppo freddo | Aumenta la temperatura del piano di 5–10°C |
| Filamento con alta contrazione (ABS) | Usa Engineering Plate + camera >40°C |

**ABS e ASA sono particolarmente vulnerabili.** Assicurati sempre di:
- Coperchio frontale chiuso
- Ventilazione minima
- Engineering Plate + colla stick
- Temperatura camera 40°C+

---

### Stringing (fili tra le parti)

**Sintomi:** Sottili fili di plastica tra parti separate del modello

**Cause e soluzioni:**

| Causa | Soluzione |
|-------|-----------|
| Filamento umido | Asciuga il filamento 6–8 ore (60–70°C) |
| Temperatura ugello troppo alta | Abbassa di 5°C |
| Retrazione insufficiente | Aumenta la lunghezza di retrazione in Bambu Studio |
| Velocità di spostamento troppo bassa | Aumenta la velocità di spostamento a 200+ mm/s |

**Il test dell'umidità:** Ascolta eventuali scoppiettii o cerca bolle nell'estrusione — indica filamento umido. Bambu AMS ha un misuratore di umidità integrato; controlla l'umidità sotto **Stato AMS**.

:::tip Essiccatore per filamento
Investi in un essiccatore per filamento (ad es. Bambu Filament Dryer) se lavori con nylon o TPU — questi assorbono umidità in meno di 12 ore.
:::

---

### Spaghetti (la stampa collassa in un groviglio)

**Sintomi:** Il filamento pende in fili liberi nell'aria, la stampa non è riconoscibile

**Cause e soluzioni:**

| Causa | Soluzione |
|-------|-----------|
| Scarsa adesione iniziale → staccato → collassato | Vedi sezione adesione sopra |
| Velocità troppo alta | Riduci la velocità del 20–30% |
| Configurazione supporti errata | Attiva i supporti in Bambu Studio |
| Sbalzo troppo ripido | Dividi il modello o ruota di 45° |

**Usa Print Guard per fermare automaticamente lo spaghetti** — vedi la sezione successiva.

---

### Sottoestrusione (strati sottili e deboli)

**Sintomi:** Gli strati non sono solidi, buchi nelle pareti, modello debole

**Cause e soluzioni:**

| Causa | Soluzione |
|-------|-----------|
| Ugello parzialmente ostruito | Esegui Cold Pull (vedi manutenzione) |
| Filamento troppo umido | Asciuga il filamento |
| Temperatura troppo bassa | Aumenta la temperatura dell'ugello di 5–10°C |
| Velocità troppo alta | Riduci del 20–30% |
| Tubo PTFE danneggiato | Ispeziona e sostituisci il tubo PTFE |

## Usare Print Guard per protezione automatica

Print Guard monitora le immagini della camera con riconoscimento delle immagini e ferma automaticamente la stampa se viene rilevato lo spaghetti.

**Attivare Print Guard:**
1. Vai su **Monitoraggio → Print Guard**
2. Attiva **Rilevamento automatico**
3. Scegli l'azione: **Pausa** (consigliato) o **Annulla**
4. Imposta la sensibilità (inizia con **Media**)

**Quando Print Guard interviene:**
1. Ricevi una notifica con un'immagine della camera di ciò che è stato rilevato
2. La stampa viene messa in pausa
3. Puoi scegliere: **Continua** (se falso positivo) o **Annulla stampa**

:::info Falsi positivi
Print Guard può a volte reagire a modelli con molte colonne sottili. Riduci la sensibilità o disattiva temporaneamente per modelli complessi.
:::

## Strumenti diagnostici nel dashboard

### Log temperatura
Sotto **Cronologia → [Stampa] → Temperature** puoi vedere la curva di temperatura durante tutta la stampa. Cerca:
- Cadute brusche di temperatura (problema ugello o piano)
- Temperature irregolari (necessità di calibrazione)

### Statistiche filamento
Controlla se il filamento consumato corrisponde alla stima. Una grande discrepanza può indicare sottoestrusione o rottura del filamento.

## Quando contattare l'assistenza?

Contatta l'assistenza Bambu Labs se:
- Il codice HMS si ripete dopo aver seguito tutte le soluzioni suggerite
- Vedi danni meccanici alla stampante (guide piegate, ingranaggi rotti)
- I valori di temperatura sono impossibili (ad es. l'ugello legge -40°C)
- L'aggiornamento firmware non risolve il problema

**Utile da avere pronto per l'assistenza:**
- Codici di errore HMS dal log degli errori del dashboard
- Immagine della camera dell'errore
- Quale filamento e impostazioni sono stati usati (esportabile dalla cronologia)
- Modello stampante e versione firmware (mostrato sotto **Impostazioni → Stampante → Info**)
