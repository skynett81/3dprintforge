---
sidebar_position: 4
title: TPU
description: Guida alla stampa TPU — temperatura, velocità e impostazioni retract
---

# TPU

Il TPU (Poliuretano Termoplastico) è un materiale flessibile utilizzato per cover, guarnizioni, ruote e altri componenti che richiedono elasticità.

## Impostazioni

| Parametro | Valore |
|-----------|-------|
| Temperatura ugello | 220–240 °C |
| Temperatura piano | 30–45 °C |
| Raffreddamento pezzo | 50–80% |
| Velocità | 30–50% (IMPORTANTE) |
| Retract | Minimo o disabilitato |
| Essiccazione | Consigliata (6–8 ore a 60 °C) |

:::danger La bassa velocità è critica
Il TPU deve essere stampato lentamente. Una velocità troppo alta causa la compressione del materiale nell'estrusore e crea blocchi. Inizia con il 30% di velocità e aumenta gradualmente.
:::

## Piani consigliati

| Piano | Idoneità | Colla stick? |
|-------|---------|----------|
| Textured PEI | Eccellente | No |
| Cool Plate (PEI liscio) | Buono | No |
| Engineering Plate | Buono | No |

## Impostazioni retract

Il TPU è elastico e reagisce male a un retract aggressivo:

- **Direct drive (X1C/P1S/A1):** Retract 0,5–1,0 mm, 25 mm/s
- **Bowden (evita con TPU):** Molto impegnativo, non consigliato

Per TPU molto morbido (Shore A 85 o inferiore): disabilita completamente il retract e affidati al controllo di temperatura e velocità.

## Consigli

- **Essicca il filamento** — il TPU umido è estremamente difficile da stampare
- **Usa l'estrusore diretto** — le Bambu Lab P1S/X1C/A1 hanno tutte direct drive
- **Evita temperature alte** — sopra 250 °C il TPU si degrada e produce stampe scolorite
- **Stringing** — il TPU tende a fare stringing; abbassa la temperatura di 5 °C o aumenta il raffreddamento

:::tip Durezza Shore
Il TPU esiste in diverse durezze Shore (A85, A95, A98). Più basso è il valore Shore A, più morbido e impegnativo è da stampare. Il TPU di Bambu Lab è Shore A 95 — un buon punto di partenza.
:::

## Conservazione

Il TPU è molto igroscopico (assorbe umidità). Il TPU umido causa:
- Bolle e sfrigolii
- Stampa fragile e debole (paradossale per un materiale flessibile)
- Stringing

**Essicca sempre il TPU** a 60 °C per 6–8 ore prima della stampa. Conserva in scatola sigillata con gel di silice.
